import type { Pipeline, PreviewResult } from './pipeline';
import { DSLCompiler } from './dsl-compiler';
import { DuckDBManager } from './duckdb';

/**
 * 预览引擎 - 执行 DSL 预览并生成差异分析
 */
export class PreviewEngine {
  private duckdb: DuckDBManager;
  private compiler: DSLCompiler;
  private backupStack: Map<string, string[]> = new Map(); // 数据备份栈

  constructor() {
    this.duckdb = new DuckDBManager();
    this.compiler = new DSLCompiler();
  }

  /**
   * 安全地将BigInt转换为number
   */
  private safeToNumber(value: any): number {
    if (value !== undefined && value !== null) {
      return Number(value);
    }
    return 0;
  }

  /**
   * 初始化预览引擎
   */
  async initialize(): Promise<void> {
    await this.duckdb.initialize();
  }

  /**
   * 注册数据集
   */
  async registerDataset(name: string, data: any[]): Promise<void> {
    await this.duckdb.registerJSON(name, data);
  }

  /**
   * 执行预览分析
   */
  async preview(pipeline: Pipeline, sampleSize = 2000): Promise<PreviewResult> {
    const startTime = Date.now();

    try {
      // 清理所有临时表和视图以避免名称冲突
      await this.cleanupTempTables();

      // 获取原始数据信息
      const originalInfo = await this.duckdb.getTableInfo(pipeline.dataset);

      // 编译并执行预览 SQL
      const previewSQLs = this.compiler.compileForPreview(pipeline, sampleSize);

      try {
        await this.duckdb.executeSequence(previewSQLs);
        // 物化 RESULT 以避免部分视图在后续查询中触发 DuckDB 内部错误
        try {
          await this.duckdb.query('CREATE OR REPLACE TEMP TABLE RESULT AS SELECT * FROM RESULT');
        } catch (e) {
          // If RESULT already a table, this still replaces it. Ignore errors here.
        }
      } catch (error: any) {
        // 如果遇到DuckDB内部错误，尝试重新初始化并重试
        if (error?.message?.includes('Could not find column index for table filter')) {
          console.warn('🔄 DuckDB internal error detected, attempting recovery...');

          // 重新初始化DuckDB
          await this.duckdb.cleanup();
          await this.duckdb.initialize();

          // 重新注册数据集 - 需要从外部传入数据
          // 这里暂时抛出错误，提示需要重新上传数据
          throw new Error('Database state corrupted. Please refresh the page and re-upload your data.');
        }
        throw error;
      }

      // 获取处理后数据信息
      const resultInfo = await this.duckdb.getTableInfo('RESULT');

      // 生成详细的差异分析
      const summary = await this.generateSummary(pipeline, originalInfo.rowCount);
      const samples = await this.collectSamples(pipeline);
      const risks = await this.assessRisks(pipeline, originalInfo.rowCount, resultInfo.rowCount);

      const result: PreviewResult = {
        rowsBefore: originalInfo.rowCount,
        rowsAfter: resultInfo.rowCount,
        columnsModified: await this.getModifiedColumns(pipeline),
        summary,
        samples,
        risks,
      };

      console.log(`✅ Preview completed in ${Date.now() - startTime}ms`);
      return result;
    } catch (error) {
      console.error('❌ Preview failed:', error);
      throw error;
    }
  }

  /**
   * 生成操作摘要
   */
  private async generateSummary(pipeline: Pipeline, originalRows: number): Promise<PreviewResult['summary']> {
    const summary = { added: 0, removed: 0, modified: 0 };

    try {
      // 计算行数变化 - 处理BigInt转换
      const resultRows = await this.duckdb.query('SELECT COUNT(*) as count FROM RESULT');
      const newRowCount = this.safeToNumber(resultRows.get(0)?.count);

      if (newRowCount > originalRows) {
        summary.added = newRowCount - originalRows;
      } else if (newRowCount < originalRows) {
        summary.removed = originalRows - newRowCount;
      }

      // 对于特定操作，提供更详细的分析
      for (const step of pipeline.steps) {
        switch (step.op) {
          case 'dedupe':
            // 计算去重删除的行数
            const dedupeDropped = await this.calculateDedupeDropped(step, pipeline.dataset);
            summary.removed += dedupeDropped;
            break;

          case 'split':
            // 列拆分会增加列但不增加行
            summary.modified += originalRows;
            break;

          case 'join':
            // JOIN 可能增加或减少行数
            const joinStats = await this.calculateJoinStats(step, pipeline.dataset);
            summary.added += joinStats.matched;
            summary.removed += joinStats.unmatched;
            break;
        }
      }
    } catch (error) {
      console.warn('Warning: Could not generate detailed summary:', error);
    }

    return summary;
  }

  /**
   * 收集问题样本
   */
  private async collectSamples(pipeline: Pipeline): Promise<PreviewResult['samples']> {
    const samples: PreviewResult['samples'] = {};

    try {
      // 收集每个操作的问题样本
      for (const step of pipeline.steps) {
        switch (step.op) {
          case 'dedupe':
            samples.dropped = await this.collectDedupeSamples(step);
            break;

          case 'normalize':
            samples.failed = await this.collectNormalizationFailures(step);
            break;

          case 'join':
            samples.unmatched = await this.collectUnmatchedJoinKeys(step);
            break;
        }
      }
    } catch (error) {
      console.warn('Warning: Could not collect samples:', error);
    }

    return samples;
  }

  /**
   * 评估风险
   */
  private async assessRisks(pipeline: Pipeline, originalRows: number, resultRows: number): Promise<string[]> {
    const risks: string[] = [];

    // 行数变化风险
    const rowChangePercent = Math.abs(resultRows - originalRows) / originalRows * 100;
    if (rowChangePercent > 50) {
      risks.push(`⚠️ Row count changed by more than 50%: from ${originalRows} to ${resultRows} rows`);
    }

    // 具体操作风险评估
    for (const step of pipeline.steps) {
      const stepRisks = await this.assessStepRisks(step, originalRows);
      risks.push(...stepRisks);
    }

    return risks;
  }

  /**
   * 评估单个步骤的风险
   */
  private async assessStepRisks(step: Pipeline['steps'][0], _originalRows: number): Promise<string[]> {
    const risks: string[] = [];

    try {
      switch (step.op) {
        case 'normalize':
          // 检查日期/金额解析失败率
          if (step.dates) {
            for (const dateConfig of step.dates) {
              const failureRate = await this.calculateNormalizationFailureRate(dateConfig.col, 'date');
              if (failureRate > 0.3) {
                risks.push(`⚠️ Date column "${dateConfig.col}" parsing success rate is only ${((1 - failureRate) * 100).toFixed(1)}%`);
              }
            }
          }
          break;

        case 'dedupe':
          // 检查去重比例
          const dedupeRate = await this.calculateDedupeRate(step);
          if (dedupeRate > 0.5) {
            risks.push(`⚠️ Deduplication will remove more than 50% of data (${(dedupeRate * 100).toFixed(1)}%)`);
          }
          break;

        case 'join':
          // 检查JOIN匹配率
          const matchRate = await this.calculateJoinMatchRate(step);
          if (matchRate < 0.7) {
            risks.push(`⚠️ Table join match rate is only ${(matchRate * 100).toFixed(1)}%`);
          }
          break;
      }
    } catch (error) {
      console.warn('Could not assess risks for step:', step, error);
    }

    return risks;
  }

  // 辅助方法实现

  private async getModifiedColumns(pipeline: Pipeline): Promise<string[]> {
    const modified = new Set<string>();

    for (const step of pipeline.steps) {
      switch (step.op) {
        case 'normalize':
          step.dates?.forEach(d => modified.add(d.col));
          step.money?.forEach(m => modified.add(m.col));
          break;
        case 'split':
          step.into.forEach(col => modified.add(col));
          break;
        case 'clean':
          step.trims?.forEach(col => modified.add(col));
          step.normalizeSpace?.forEach(col => modified.add(col));
          step.replace?.forEach(r => modified.add(r.col));
          break;
      }
    }

    return Array.from(modified);
  }

  private async calculateDedupeDropped(step: Extract<Pipeline['steps'][0], { op: 'dedupe' }>, dataset: string): Promise<number> {
    try {
      const partitionBy = step.by.map(col => `"${col}"`).join(', ');
      const result = await this.duckdb.query(`
        SELECT SUM(cnt - 1) as dropped
        FROM (
          SELECT COUNT(*) as cnt
          FROM ${dataset}
          GROUP BY ${partitionBy}
          HAVING COUNT(*) > 1
        )
      `);
      return this.safeToNumber(result.get(0)?.dropped);
    } catch {
      return 0;
    }
  }

  private async calculateJoinStats(step: Extract<Pipeline['steps'][0], { op: 'join' }>, dataset: string): Promise<{ matched: number; unmatched: number }> {
    try {
      const joinConditions = Object.entries(step.on)
        .map(([leftCol, rightCol]) => `${dataset}."${leftCol}" = ${step.rightRef}."${rightCol}"`)
        .join(' AND ');

      const matchedResult = await this.duckdb.query(`
        SELECT COUNT(*) as count
        FROM ${dataset}
        INNER JOIN ${step.rightRef} ON ${joinConditions}
      `);

      const unmatchedResult = await this.duckdb.query(`
        SELECT COUNT(*) as count
        FROM ${dataset}
        LEFT JOIN ${step.rightRef} ON ${joinConditions}
        WHERE ${Object.values(step.on).map(col => `${step.rightRef}."${col}"`).join(' AND ')} IS NULL
      `);

      return {
        matched: this.safeToNumber(matchedResult.get(0)?.count),
        unmatched: this.safeToNumber(unmatchedResult.get(0)?.count),
      };
    } catch {
      return { matched: 0, unmatched: 0 };
    }
  }

  private async collectDedupeSamples(step: Extract<Pipeline['steps'][0], { op: 'dedupe' }>): Promise<any[]> {
    try {
      const partitionBy = step.by.map(col => `"${col}"`).join(', ');
      const result = await this.duckdb.query(`
        SELECT *
        FROM (
          SELECT *, ROW_NUMBER() OVER (PARTITION BY ${partitionBy} ORDER BY ${partitionBy}) as rn
          FROM a
        )
        WHERE rn > 1
        LIMIT 10
      `);
      return result.toArray();
    } catch {
      return [];
    }
  }

  private async collectNormalizationFailures(step: Extract<Pipeline['steps'][0], { op: 'normalize' }>): Promise<any[]> {
    const failures: any[] = [];

    if (step.dates) {
      for (const dateConfig of step.dates) {
        try {
          const result = await this.duckdb.query(`
            SELECT "${dateConfig.col}" as original_value, '${dateConfig.col}' as column_name
            FROM a
            WHERE "${dateConfig.col}" IS NOT NULL
              AND TRY_STRPTIME("${dateConfig.col}", '%Y-%m-%d') IS NULL
              AND TRY_STRPTIME("${dateConfig.col}", '%m/%d/%Y') IS NULL
              AND TRY_STRPTIME("${dateConfig.col}", '%d/%m/%Y') IS NULL
            LIMIT 5
          `);
          failures.push(...result.toArray());
        } catch (error) {
          console.warn('Could not collect normalization failures:', error);
        }
      }
    }

    return failures;
  }

  private async collectUnmatchedJoinKeys(step: Extract<Pipeline['steps'][0], { op: 'join' }>): Promise<any[]> {
    try {
      const joinConditions = Object.entries(step.on)
        .map(([leftCol, rightCol]) => `a."${leftCol}" = ${step.rightRef}."${rightCol}"`)
        .join(' AND ');

      const result = await this.duckdb.query(`
        SELECT ${Object.keys(step.on).map(col => `a."${col}"`).join(', ')}
        FROM a
        LEFT JOIN ${step.rightRef} ON ${joinConditions}
        WHERE ${Object.values(step.on).map(col => `${step.rightRef}."${col}"`).join(' AND ')} IS NULL
        LIMIT 10
      `);
      return result.toArray();
    } catch {
      return [];
    }
  }

  private async calculateNormalizationFailureRate(column: string, type: 'date' | 'money'): Promise<number> {
    try {
      const totalResult = await this.duckdb.query(`
        SELECT COUNT(*) as total FROM a WHERE "${column}" IS NOT NULL
      `);
      const total = this.safeToNumber(totalResult.get(0)?.total) || 1;

      let successQuery = '';
      if (type === 'date') {
        successQuery = `
          SELECT COUNT(*) as success FROM a
          WHERE "${column}" IS NOT NULL
            AND (TRY_STRPTIME("${column}", '%Y-%m-%d') IS NOT NULL
                OR TRY_STRPTIME("${column}", '%m/%d/%Y') IS NOT NULL
                OR TRY_STRPTIME("${column}", '%d/%m/%Y') IS NOT NULL)
        `;
      } else {
        successQuery = `
          SELECT COUNT(*) as success FROM a
          WHERE "${column}" IS NOT NULL
            AND TRY_CAST(REGEXP_REPLACE("${column}", '[^0-9.-]', '', 'g') AS DECIMAL) IS NOT NULL
        `;
      }

      const successResult = await this.duckdb.query(successQuery);
      const success = this.safeToNumber(successResult.get(0)?.success);

      return 1 - (success / total);
    } catch {
      return 0;
    }
  }

  private async calculateDedupeRate(step: Extract<Pipeline['steps'][0], { op: 'dedupe' }>): Promise<number> {
    try {
      const totalResult = await this.duckdb.query('SELECT COUNT(*) as total FROM a');
      const total = this.safeToNumber(totalResult.get(0)?.total) || 1;

      const partitionBy = step.by.map(col => `"${col}"`).join(', ');
      const uniqueResult = await this.duckdb.query(`
        SELECT COUNT(*) as unique_count
        FROM (SELECT DISTINCT ${partitionBy} FROM a)
      `);
      const unique = this.safeToNumber(uniqueResult.get(0)?.unique_count) || total;

      return (total - unique) / total;
    } catch {
      return 0;
    }
  }

  private async calculateJoinMatchRate(step: Extract<Pipeline['steps'][0], { op: 'join' }>): Promise<number> {
    try {
      const totalResult = await this.duckdb.query('SELECT COUNT(*) as total FROM a');
      const total = this.safeToNumber(totalResult.get(0)?.total) || 1;

      const joinConditions = Object.entries(step.on)
        .map(([leftCol, rightCol]) => `a."${leftCol}" = ${step.rightRef}."${rightCol}"`)
        .join(' AND ');

      const matchedResult = await this.duckdb.query(`
        SELECT COUNT(*) as matched
        FROM a
        INNER JOIN ${step.rightRef} ON ${joinConditions}
      `);
      const matched = this.safeToNumber(matchedResult.get(0)?.matched);

      return matched / total;
    } catch {
      return 0;
    }
  }

  /**
   * 清理资源
   */
  async cleanup(): Promise<void> {
    await this.duckdb.cleanup();
  }

  /**
   * 清理临时表和视图以避免名称冲突
   * 使用最小化清理避免SQL语法错误
   */
  private async cleanupTempTables(): Promise<void> {
    try {
      console.log('🧹 Cleaning up temporary objects...');

      // 只清理最关键的临时对象，避免SQL保留字问题
      const criticalTempObjects = ['RESULT', 't1', 't2', 't3', 't4', 't5'];

      for (const objName of criticalTempObjects) {
        await this.dropObjectIfExists(objName);
      }

      console.log('✅ Critical temporary objects cleaned up');
    } catch (error) {
      console.warn('⚠️ Cleanup warning (non-critical):', error);
    }
  }

  /**
   * 根据对象类型安全地删除（避免视图/表类型不匹配的报错日志）
   */
  private async dropObjectIfExists(name: string): Promise<void> {
    try {
      const typeRes = await this.duckdb.query(`
        SELECT table_type FROM information_schema.tables
        WHERE table_name = '${name.toUpperCase()}'
        LIMIT 1
      `);
      const rows = typeRes.toArray();
      if (!rows || rows.length === 0) {
        return;
      }
      const type = (rows[0].table_type || '').toString().toUpperCase();
      if (type.includes('VIEW')) {
        await this.duckdb.query(`DROP VIEW ${name}`);
      } else {
        await this.duckdb.query(`DROP TABLE ${name}`);
      }
    } catch (e) {
      // Swallow errors to keep cleanup non-blocking
    }
  }

  /**
   * 创建数据备份
   */
  async createBackup(datasetName: string): Promise<string> {
    const backupId = `backup_${datasetName}_${Date.now()}`;

    try {
      // 创建备份表
      await this.duckdb.query(`CREATE TEMP TABLE ${backupId} AS SELECT * FROM ${datasetName}`);

      // 存储备份信息
      const backups = this.backupStack.get(datasetName) || [];
      backups.push(backupId);
      this.backupStack.set(datasetName, backups);

      console.log(`✅ Created backup: ${backupId} for dataset: ${datasetName}`);
      return backupId;
    } catch (error) {
      console.error('❌ Failed to create backup:', error);
      throw new Error(`Failed to create backup for ${datasetName}`);
    }
  }

  /**
   * 应用更改（用户确认后替换原数据）
   */
  async applyChanges(datasetName: string, pipeline: Pipeline): Promise<void> {
    try {
      // 0. 清理临时表和视图
      await this.cleanupTempTables();

      // 1. 创建数据备份
      const backupId = await this.createBackup(datasetName);

      // 2. 编译完整的DSL操作
      const sqls = this.compiler.compile(pipeline);

      // 3. 执行操作序列
      console.log('🔄 Applying changes to original dataset...');
      await this.duckdb.executeSequence(sqls);

      // 4. 用处理后的结果替换原数据
      await this.duckdb.query(`CREATE OR REPLACE TEMP TABLE ${datasetName} AS SELECT * FROM RESULT`);

      // 5. 清理临时表
      await this.duckdb.query('DROP TABLE IF EXISTS RESULT');

      console.log(`✅ Successfully applied changes to dataset: ${datasetName}`);
      console.log(`📦 Backup available: ${backupId} (use rollback to revert)`);
    } catch (error) {
      console.error('❌ Failed to apply changes:', error);
      throw new Error(`Failed to apply changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 回滚到上一个版本
   */
  async rollback(datasetName: string): Promise<boolean> {
    try {
      const backups = this.backupStack.get(datasetName);
      if (!backups || backups.length === 0) {
        console.warn('⚠️ No backups available for rollback');
        return false;
      }

      // 获取最新的备份
      const latestBackup = backups.pop();
      if (!latestBackup) {
        return false;
      }

      // 检查备份是否存在
      const backupExists = await this.checkTableExists(latestBackup);
      if (!backupExists) {
        console.error(`❌ Backup table ${latestBackup} not found`);
        return false;
      }

      // 恢复数据
      await this.duckdb.query(`CREATE OR REPLACE TEMP TABLE ${datasetName} AS SELECT * FROM ${latestBackup}`);

      // 清理已使用的备份
      await this.duckdb.query(`DROP TABLE IF EXISTS ${latestBackup}`);

      // 更新备份栈
      this.backupStack.set(datasetName, backups);

      console.log(`✅ Successfully rolled back dataset: ${datasetName}`);
      return true;
    } catch (error) {
      console.error('❌ Rollback failed:', error);
      return false;
    }
  }

  /**
   * 获取备份历史
   */
  getBackupHistory(datasetName: string): string[] {
    return this.backupStack.get(datasetName) || [];
  }

  /**
   * 清理所有备份
   */
  async clearBackups(datasetName: string): Promise<void> {
    const backups = this.backupStack.get(datasetName) || [];

    for (const backupId of backups) {
      try {
        await this.duckdb.query(`DROP TABLE IF EXISTS ${backupId}`);
      } catch (error) {
        console.warn(`Warning: Could not drop backup ${backupId}:`, error);
      }
    }

    this.backupStack.delete(datasetName);
    console.log(`🧹 Cleared all backups for dataset: ${datasetName}`);
  }

  /**
   * 检查表是否存在
   */
  private async checkTableExists(tableName: string): Promise<boolean> {
    try {
      const result = await this.duckdb.query(`
        SELECT COUNT(*) as count
        FROM information_schema.tables
        WHERE table_name = '${tableName.toUpperCase()}'
      `);
      return this.safeToNumber(result.get(0)?.count) > 0;
    } catch {
      return false;
    }
  }

  /**
   * 获取数据变更摘要
   */
  async getChangesSummary(datasetName: string, pipeline: Pipeline): Promise<{
    originalRows: number;
    previewRows: number;
    affectedColumns: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    risks: string[];
  }> {
    try {
      // 获取原始数据行数
      const originalInfo = await this.duckdb.getTableInfo(datasetName);

      // 执行预览获取处理后行数
      const previewSQLs = this.compiler.compileForPreview(pipeline, 10000); // 使用更大样本
      await this.duckdb.executeSequence(previewSQLs);
      const previewInfo = await this.duckdb.getTableInfo('RESULT');

      // 分析受影响的列
      const affectedColumns = await this.getModifiedColumns(pipeline);

      // 评估风险级别
      const risks = await this.assessRisks(pipeline, originalInfo.rowCount, previewInfo.rowCount);
      const riskLevel = this.calculateRiskLevel(originalInfo.rowCount, previewInfo.rowCount, risks.length);

      return {
        originalRows: originalInfo.rowCount,
        previewRows: previewInfo.rowCount,
        affectedColumns,
        riskLevel,
        risks,
      };
    } catch (error) {
      console.error('❌ Failed to get changes summary:', error);
      throw error;
    }
  }

  /**
   * 计算风险级别
   */
  private calculateRiskLevel(originalRows: number, previewRows: number, riskCount: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    // 基于行数变化百分比
    const changePercent = Math.abs(previewRows - originalRows) / originalRows * 100;

    if (changePercent > 50 || riskCount >= 3) {
      return 'HIGH';
    } else if (changePercent > 20 || riskCount >= 2) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }
}
