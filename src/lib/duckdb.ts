/**
 * DuckDB WebAssembly 封装类
 * 用于在浏览器中执行 SQL 查询和数据处理
 */
import * as duckdb from '@duckdb/duckdb-wasm';

export class DuckDBManager {
  private db: duckdb.AsyncDuckDB | null = null;
  private conn: duckdb.AsyncDuckDBConnection | null = null;

  /**
   * 初始化 DuckDB 实例
   */
  async initialize(): Promise<void> {
    if (this.db && this.conn) {
      return;
    }

    try {
      // 创建 DuckDB 实例
      const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

      const worker_url = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker!}");`], { type: 'text/javascript' }),
      );

      const worker = new Worker(worker_url);
      const logger = new duckdb.ConsoleLogger();
      this.db = new duckdb.AsyncDuckDB(logger, worker);

      await this.db.instantiate(bundle.mainModule, bundle.pthreadWorker);
      URL.revokeObjectURL(worker_url);

      this.conn = await this.db.connect();

      console.log('✅ DuckDB initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize DuckDB:', error);
      throw error;
    }
  }

  /**
   * 从 CSV 文本注册数据表
   */
  async registerCSV(name: string, csvText: string): Promise<void> {
    if (!this.conn) {
      throw new Error('DuckDB not initialized');
    }

    try {
      // For CSV, we might need to use a different approach
      await this.query(`CREATE TABLE IF NOT EXISTS ${name} AS SELECT * FROM read_csv_auto('${csvText}')`);
      console.log(`✅ Registered CSV table: ${name}`);
    } catch (error) {
      console.error(`❌ Failed to register CSV table ${name}:`, error);

      // Fallback: try the original API with proper options
      try {
        await this.conn.insertCSVFromPath(name, { name, data: csvText } as any);
        console.log(`✅ Registered CSV table via fallback: ${name}`);
      } catch (fallbackError) {
        console.error(`❌ CSV fallback also failed:`, fallbackError);
        throw error;
      }
    }
  }

  /**
   * 从 JSON 数组注册数据表
   */
  async registerJSON(name: string, data: any[]): Promise<void> {
    if (!this.conn) {
      throw new Error('DuckDB not initialized');
    }

    try {
      // Clean and prepare data to avoid SQL parsing issues
      const cleanData = data.map((row) => {
        const cleanRow: any = {};
        for (const [key, value] of Object.entries(row)) {
          // Keep original column names, don't replace spaces with underscores
          // DuckDB can handle quoted column names with spaces
          let cleanValue = value;
          if (typeof value === 'string') {
            // Escape problematic strings that might conflict with SQL
            cleanValue = value.replace(/'/g, '\'\'').replace(/"/g, '""');
          }
          cleanRow[key] = cleanValue; // Use original key
        }
        return cleanRow;
      });

      // Create table with explicit column definitions
      if (cleanData.length > 0) {
        const columns = Object.keys(cleanData[0]);
        const columnDefs = columns.map(col => `"${col}" VARCHAR`).join(', ');

        // Create table first
        await this.query(`DROP TABLE IF EXISTS "${name}"`);
        await this.query(`CREATE TABLE "${name}" (${columnDefs})`);

        // Insert data row by row to avoid parsing issues
        for (const row of cleanData.slice(0, 1000)) { // Limit to prevent timeout
          const values = columns.map((col) => {
            const val = row[col];
            if (val === null || val === undefined) {
              return 'NULL';
            }
            return `'${String(val).replace(/'/g, '\'\'')}'`;
          }).join(', ');

          await this.query(`INSERT INTO "${name}" VALUES (${values})`);
        }
      }

      console.log(`✅ Registered JSON table: ${name}`);
    } catch (error) {
      console.error(`❌ Failed to register JSON table ${name}:`, error);

      // Fallback: try the original API
      try {
        await (this.conn as any).insertJSONFromPath(name, { name, data });
        console.log(`✅ Registered JSON table via fallback: ${name}`);
      } catch (fallbackError) {
        console.error(`❌ Fallback also failed:`, fallbackError);
        throw error;
      }
    }
  }

  /**
   * 执行 SQL 查询
   */
  async query(sql: string): Promise<any> {
    if (!this.conn) {
      throw new Error('DuckDB not initialized');
    }

    try {
      const result = await this.conn.query(sql);
      return result;
    } catch (error) {
      console.error('❌ SQL Query failed:', sql, error);
      throw error;
    }
  }

  /**
   * 执行多个 SQL 语句
   */
  async executeSequence(sqls: string[]): Promise<void> {
    for (let i = 0; i < sqls.length; i++) {
      const sql = sqls[i];
      if (!sql) {
        continue;
      }
      try {
        await this.query(sql);
      } catch (error) {
        console.error(`❌ [DUCKDB] SQL ${i + 1} failed:`, error);
        throw error;
      }
    }
  }

  /**
   * 获取表的基本信息
   */
  async getTableInfo(tableName: string): Promise<{
    rowCount: number;
    columnCount: number;
    columns: { name: string; type: string }[];
  }> {
    if (!this.conn) {
      throw new Error('DuckDB not initialized');
    }

    try {
      // 获取行数 - 处理BigInt转换
      const rowCountResult = await this.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      const countValue = rowCountResult.get(0)?.count;
      const rowCount = countValue !== undefined && countValue !== null
        ? Number(countValue)
        : 0;

      // 获取列信息
      const columnsResult = await this.query(`DESCRIBE ${tableName}`);
      const columns = columnsResult.toArray().map((row: any) => ({
        name: row.column_name,
        type: row.column_type,
      }));

      return {
        rowCount,
        columnCount: columns.length,
        columns,
      };
    } catch (error) {
      console.error(`❌ Failed to get table info for ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * 获取表的样本数据
   */
  async getSample(tableName: string, limit = 10): Promise<any[]> {
    if (!this.conn) {
      throw new Error('DuckDB not initialized');
    }

    try {
      const result = await this.query(`SELECT * FROM ${tableName} LIMIT ${limit}`);
      return result.toArray();
    } catch (error) {
      console.error(`❌ Failed to get sample from ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * 检查表是否存在
   */
  async tableExists(tableName: string): Promise<boolean> {
    if (!this.conn) {
      throw new Error('DuckDB not initialized');
    }

    try {
      await this.query(`SELECT 1 FROM ${tableName} LIMIT 1`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 导出查询结果为 JSON
   */
  async exportToJSON(query: string): Promise<any[]> {
    const result = await this.query(query);
    return result.toArray();
  }

  /**
   * 导出查询结果为 CSV 文本
   */
  async exportToCSV(query: string): Promise<string> {
    const result = await this.query(query);
    const data = result.toArray();

    if (data.length === 0) {
      return '';
    }

    // 获取列名
    const columns = Object.keys(data[0]);
    const headers = columns.join(',');

    // 转换数据行，确保正确处理Unicode字符
    const rows = data.map((row: any) =>
      columns.map((col) => {
        const value = row[col];
        if (value === null || value === undefined) {
          return '';
        }

        const stringValue = String(value);

        // 如果包含逗号、引号、换行符或中文字符，则用引号包围
        if (stringValue.includes(',')
          || stringValue.includes('"')
          || stringValue.includes('\n')
          || /[\u4E00-\u9FFF]/.test(stringValue)) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(','),
    );

    return [headers, ...rows].join('\n');
  }

  /**
   * 清理资源
   */
  async cleanup(): Promise<void> {
    try {
      if (this.conn) {
        await this.conn.close();
        this.conn = null;
      }
      if (this.db) {
        await this.db.terminate();
        this.db = null;
      }
      console.log('✅ DuckDB cleanup completed');
    } catch (error) {
      console.error('❌ DuckDB cleanup failed:', error);
    }
  }

  /**
   * 获取连接状态
   */
  get isInitialized(): boolean {
    return this.db !== null && this.conn !== null;
  }
}
