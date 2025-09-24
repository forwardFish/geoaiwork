import type { Op, Pipeline } from './pipeline';

/**
 * DSL 到 SQL 编译器
 * 将 Pipeline DSL 转换为 DuckDB SQL 语句序列
 */
export class DSLCompiler {
  /**
   * 编译 Pipeline 为 SQL 语句数组
   */
  compile(pipeline: Pipeline): string[] {
    const sqls: string[] = [];
    let currentView: string = pipeline.dataset; // 从 "a" 开始
    let stepIndex = 0;

    for (const step of pipeline.steps) {
      stepIndex++;
      const nextView = `t${stepIndex}`;
      const sql = this.compileStep(step, currentView, nextView);
      sqls.push(sql);
      currentView = nextView;
    }

    // 最后创建 RESULT 为临时表，物化以避免某些 DuckDB 视图筛选内部错误
    sqls.push(`CREATE OR REPLACE TEMP TABLE RESULT AS SELECT * FROM ${currentView};`);

    return sqls;
  }

  /**
   * 编译单个操作步骤
   */
  private compileStep(step: Op, inputView: string, outputView: string): string {
    switch (step.op) {
      case 'normalize':
        return this.compileNormalize(step, inputView, outputView);
      case 'dedupe':
        return this.compileDedupe(step, inputView, outputView);
      case 'split':
        return this.compileSplit(step, inputView, outputView);
      case 'merge':
        return this.compileMerge(step, inputView, outputView);
      case 'clean':
        return this.compileClean(step, inputView, outputView);
      case 'join':
        return this.compileJoin(step, inputView, outputView);
      case 'diff':
        return this.compileDiff(step, inputView, outputView);
      case 'select':
        return this.compileSelect(step, inputView, outputView);
      case 'aggregate':
        return this.compileAggregate(step, inputView, outputView);
      case 'filter':
        return this.compileFilter(step, inputView, outputView);
      case 'sort':
        return this.compileSort(step, inputView, outputView);
      default:
        throw new Error(`Unsupported operation: ${(step as any).op}`);
    }
  }

  /**
   * 编译数据标准化操作
   */
  private compileNormalize(step: Extract<Op, { op: 'normalize' }>, inputView: string, outputView: string): string {
    const replacements: string[] = [];

    // 处理日期标准化
    if (step.dates) {
      for (const dateConfig of step.dates) {
        const col = this.quote(dateConfig.col);
        replacements.push(`
          CASE
            WHEN ${col} IS NULL OR TRIM(CAST(${col} AS VARCHAR)) = '' THEN NULL
            -- Handle numeric timestamp values
            WHEN TRY_CAST(${col} AS BIGINT) IS NOT NULL THEN
              CASE
                -- Milliseconds timestamp (> 1 trillion, like 1751328000000)
                WHEN TRY_CAST(${col} AS BIGINT) > 1000000000000 THEN
                  TO_TIMESTAMP(TRY_CAST(${col} AS BIGINT) / 1000)::DATE
                -- Seconds timestamp (> 1 billion)
                WHEN TRY_CAST(${col} AS BIGINT) > 1000000000 THEN
                  TO_TIMESTAMP(TRY_CAST(${col} AS BIGINT))::DATE
                -- Days since epoch (simple addition)
                WHEN TRY_CAST(${col} AS BIGINT) > 1000 THEN
                  ('1970-01-01'::DATE + TRY_CAST(${col} AS INTEGER))
                ELSE NULL
              END
            -- Handle string date formats
            ELSE COALESCE(
              TRY_CAST(CAST(${col} AS VARCHAR) AS DATE),
              TRY_STRPTIME(CAST(${col} AS VARCHAR), '%Y-%m-%d')::DATE,
              TRY_STRPTIME(CAST(${col} AS VARCHAR), '%Y/%m/%d')::DATE,
              TRY_STRPTIME(CAST(${col} AS VARCHAR), '%m/%d/%Y')::DATE,
              TRY_STRPTIME(CAST(${col} AS VARCHAR), '%d/%m/%Y')::DATE,
              TRY_STRPTIME(CAST(${col} AS VARCHAR), '%d-%m-%Y')::DATE,
              TRY_STRPTIME(CAST(${col} AS VARCHAR), '%m-%d-%Y')::DATE,
              TRY_STRPTIME(CAST(${col} AS VARCHAR), '%Y.%m.%d')::DATE,
              TRY_STRPTIME(CAST(${col} AS VARCHAR), '%b %d, %Y')::DATE,
              TRY_STRPTIME(CAST(${col} AS VARCHAR), '%B %d, %Y')::DATE
            )
          END AS ${col}
        `.trim());
      }
    }

    // 处理金额标准化 - 修复版本：保留小数点
    if (step.money) {
      for (const moneyConfig of step.money) {
        const col = this.quote(moneyConfig.col);
        const sql = `
          CASE
            WHEN ${col} IS NULL OR TRIM(CAST(${col} AS VARCHAR)) = '' THEN NULL
            ELSE TRY_CAST(
              REPLACE(REPLACE(REPLACE(REPLACE(
                CAST(${col} AS VARCHAR),
                '$', ''),
                ',', ''),
                '£', ''),
                '¥', ''
              ) AS DOUBLE
            )
          END AS ${col}
        `.trim();
        console.warn(`🔍 [SQL DEBUG] Money normalization for ${col}:`);
        console.warn(`   Original SQL: ${sql}`);
        console.warn(`   Logic: Remove $ → Remove , → Remove £ → Remove ¥ → Keep decimal point → Cast to DOUBLE`);
        replacements.push(sql);
      }
    }

    // 使用 SELECT * REPLACE 以保持列顺序不变
    if (replacements.length > 0) {
      return `CREATE OR REPLACE TEMP VIEW ${outputView} AS
SELECT * REPLACE (
  ${replacements.join(',\n  ')}
) FROM ${inputView};`;
    }

    return `CREATE OR REPLACE TEMP VIEW ${outputView} AS SELECT * FROM ${inputView};`;
  }

  /**
   * 编译去重操作
   */
  private compileDedupe(step: Extract<Op, { op: 'dedupe' }>, inputView: string, outputView: string): string {
    const partitionBy = step.by.map(this.quote).join(', ');

    // 简化去重逻辑：直接使用 DISTINCT ON 来确保去重效果
    if (step.orderBy && step.orderBy.length > 0) {
      // 有明确排序要求时使用 DISTINCT ON
      const orderBy = step.orderBy
        .map(o => `${this.quote(o.col)} ${o.dir.toUpperCase()}`)
        .join(', ');

      return `CREATE OR REPLACE TEMP VIEW ${outputView} AS
SELECT DISTINCT ON (${partitionBy}) *
FROM ${inputView}
ORDER BY ${partitionBy}, ${orderBy};`;
    } else {
      // 没有排序要求时，简单去重
      return `CREATE OR REPLACE TEMP VIEW ${outputView} AS
SELECT DISTINCT ON (${partitionBy}) *
FROM ${inputView}
ORDER BY ${partitionBy};`;
    }
  }

  /**
   * 编译列拆分操作
   */
  private compileSplit(step: Extract<Op, { op: 'split' }>, inputView: string, outputView: string): string {
    const sourceCol = this.quote(step.column);
    const targetCols = step.into.map((col, index) => {
      const colName = this.quote(col);
      let expression = '';

      if (step.by === 'regex' && step.pattern) {
        expression = `REGEXP_EXTRACT(${sourceCol}, '${step.pattern}', ${index + 1}) AS ${colName}`;
      } else {
        const delimiter = step.by === ' ' ? ' ' : step.by;
        expression = `SPLIT_PART(${sourceCol}, '${delimiter}', ${index + 1}) AS ${colName}`;
      }

      return expression;
    });

    return `CREATE OR REPLACE TEMP VIEW ${outputView} AS
SELECT *,
  ${targetCols.join(',\n  ')}
FROM ${inputView};`;
  }

  /**
   * 编译列合并操作
   */
  private compileMerge(step: Extract<Op, { op: 'merge' }>, inputView: string, outputView: string): string {
    const sourceCols = step.columns.map(this.quote);
    const targetColName = step.into || step.newColumn;
    if (!targetColName) {
      throw new Error('Merge operation requires either "into" or "newColumn" field');
    }
    const targetCol = this.quote(targetColName);
    const separator = step.separator || ' ';

    // 构建合并表达式，处理NULL值
    const concatExpression = sourceCols
      .map(col => `COALESCE(CAST(${col} AS VARCHAR), '')`)
      .join(` || '${separator}' || `);

    if (step.keepOriginal !== false) {
      // 默认保留原列，除非明确设置为false
      return `CREATE OR REPLACE TEMP VIEW ${outputView} AS
SELECT *, ${concatExpression} AS ${targetCol}
FROM ${inputView};`;
    } else {
      // 不保留原列，只创建合并后的列加上其他列
      // 这里只生成合并列，依赖其他步骤来选择需要的列
      return `CREATE OR REPLACE TEMP VIEW ${outputView} AS
SELECT *, ${concatExpression} AS ${targetCol}
FROM ${inputView};`;
    }
  }

  /**
   * 编译数据清洗操作
   */
  private compileClean(step: Extract<Op, { op: 'clean' }>, inputView: string, outputView: string): string {
    const replacements: string[] = [];

    if (step.trims) {
      for (const col of step.trims) {
        const quotedCol = this.quote(col);
        replacements.push(`TRIM(${quotedCol}) AS ${quotedCol}`);
      }
    }

    if (step.normalizeSpace) {
      for (const col of step.normalizeSpace) {
        const quotedCol = this.quote(col);
        replacements.push(`REGEXP_REPLACE(TRIM(${quotedCol}), '\\s+', ' ', 'g') AS ${quotedCol}`);
      }
    }

    if (step.replace) {
      for (const replaceConfig of step.replace) {
        const quotedCol = this.quote(replaceConfig.col);
        replacements.push(`REPLACE(${quotedCol}, '${replaceConfig.from}', '${replaceConfig.to}') AS ${quotedCol}`);
      }
    }

    // 新增：大小写转换
    if (step.upper) {
      for (const col of step.upper) {
        const quotedCol = this.quote(col);
        replacements.push(`UPPER(${quotedCol}) AS ${quotedCol}`);
      }
    }

    if (step.lower) {
      for (const col of step.lower) {
        const quotedCol = this.quote(col);
        replacements.push(`LOWER(${quotedCol}) AS ${quotedCol}`);
      }
    }

    if (step.proper) {
      for (const col of step.proper) {
        const quotedCol = this.quote(col);
        // DuckDB的INITCAP函数实现Proper Case
        replacements.push(`INITCAP(${quotedCol}) AS ${quotedCol}`);
      }
    }

    // 新增：移除特殊字符
    if (step.removeSpecial) {
      for (const col of step.removeSpecial) {
        const quotedCol = this.quote(col);
        // 只保留字母、数字、空格和基本标点
        replacements.push(`REGEXP_REPLACE(${quotedCol}, '[^\\w\\s.,!?-]', '', 'g') AS ${quotedCol}`);
      }
    }

    if (replacements.length === 0) {
      return `CREATE OR REPLACE TEMP VIEW ${outputView} AS SELECT * FROM ${inputView};`;
    }

    return `CREATE OR REPLACE TEMP VIEW ${outputView} AS
SELECT * REPLACE (
  ${replacements.join(',\n  ')}
) FROM ${inputView};`;
  }

  /**
   * 编译表连接操作
   */
  private compileJoin(step: Extract<Op, { op: 'join' }>, inputView: string, outputView: string): string {
    const joinConditions = Object.entries(step.on)
      .map(([leftCol, rightCol]) =>
        `${inputView}.${this.quote(leftCol)} = ${step.rightRef}.${this.quote(rightCol)}`,
      )
      .join(' AND ');

    const selectCols = step.select
      ? step.select.map(col => `${step.rightRef}.${this.quote(col)}`).join(', ')
      : `${step.rightRef}.*`;

    const joinType = step.how.toUpperCase();

    return `CREATE OR REPLACE TEMP VIEW ${outputView} AS
SELECT ${inputView}.*, ${selectCols}
FROM ${inputView}
${joinType} JOIN ${step.rightRef} ON ${joinConditions};`;
  }

  /**
   * 编译数据对比操作
   */
  private compileDiff(step: Extract<Op, { op: 'diff' }>, inputView: string, outputView: string): string {
    const keyJoin = step.key
      .map(col => `a.${this.quote(col)} = b.${this.quote(col)}`)
      .join(' AND ');

    return `
CREATE OR REPLACE TEMP VIEW ${outputView}_added AS
SELECT a.*, 'ADDED' AS _change_type
FROM ${inputView} a
LEFT JOIN ${step.rightRef} b ON ${keyJoin}
WHERE ${step.key.map(col => `b.${this.quote(col)}`).join(' AND ')} IS NULL;

CREATE OR REPLACE TEMP VIEW ${outputView}_removed AS
SELECT b.*, 'REMOVED' AS _change_type
FROM ${step.rightRef} b
LEFT JOIN ${inputView} a ON ${keyJoin}
WHERE ${step.key.map(col => `a.${this.quote(col)}`).join(' AND ')} IS NULL;

CREATE OR REPLACE TEMP VIEW ${outputView}_modified AS
SELECT a.*, 'MODIFIED' AS _change_type
FROM ${inputView} a
INNER JOIN ${step.rightRef} b ON ${keyJoin}
WHERE a != b;

CREATE OR REPLACE TEMP VIEW ${outputView} AS
SELECT * FROM ${outputView}_added
UNION ALL
SELECT * FROM ${outputView}_removed
UNION ALL
SELECT * FROM ${outputView}_modified;`;
  }

  /**
   * 编译列选择操作
   */
  private compileSelect(step: Extract<Op, { op: 'select' }>, inputView: string, outputView: string): string {
    if (step.exclude) {
      // 排除指定列 - 使用动态列查询
      const excludeList = step.columns.map(this.quote).join(', ');

      // 使用INFORMATION_SCHEMA动态获取列名并排除指定列
      return `CREATE OR REPLACE TEMP VIEW ${outputView} AS
SELECT * EXCLUDE (${excludeList})
FROM ${inputView};`;
    } else {
      // 只选择指定列
      const selectColumns = step.columns.map(this.quote).join(', ');
      return `CREATE OR REPLACE TEMP VIEW ${outputView} AS
SELECT ${selectColumns}
FROM ${inputView};`;
    }
  }

  /**
   * 编译数据聚合操作
   */
  private compileAggregate(step: Extract<Op, { op: 'aggregate' }>, inputView: string, outputView: string): string {
    const groupByCols = step.groupBy.map(col => this.quote(col)).join(', ');
    const aggExpressions: string[] = [];

    for (const [alias, agg] of Object.entries(step.aggs)) {
      const col = agg.col ? this.quote(agg.col) : '*';
      let expression = '';

      switch (agg.fn) {
        case 'sum':
          expression = `SUM(${col})`;
          break;
        case 'count':
          expression = `COUNT(${col})`;
          break;
        case 'avg':
          expression = `AVG(${col})`;
          break;
        case 'max':
          expression = `MAX(${col})`;
          break;
        case 'min':
          expression = `MIN(${col})`;
          break;
        case 'median':
          expression = `MEDIAN(${col})`;
          break;
        case 'stddev':
          expression = `STDDEV(${col})`;
          break;
        default:
          expression = `COUNT(${col})`;
      }

      aggExpressions.push(`${expression} AS ${this.quote(alias)}`);
    }

    if (groupByCols) {
      return `CREATE OR REPLACE TEMP VIEW ${outputView} AS
SELECT ${groupByCols}, ${aggExpressions.join(', ')}
FROM ${inputView}
GROUP BY ${groupByCols};`;
    } else {
      return `CREATE OR REPLACE TEMP VIEW ${outputView} AS
SELECT ${aggExpressions.join(', ')}
FROM ${inputView};`;
    }
  }

  /**
   * 编译过滤操作
   */
  private compileFilter(step: Extract<Op, { op: 'filter' }>, inputView: string, outputView: string): string {
    const conditions: string[] = [];

    for (const cond of step.conditions) {
      const col = this.quote(cond.col);

      switch (cond.op) {
        case '=':
          conditions.push(`${col} = '${cond.value}'`);
          break;
        case '!=':
          conditions.push(`${col} != '${cond.value}'`);
          break;
        case '>':
          conditions.push(`${col} > ${cond.value}`);
          break;
        case '<':
          conditions.push(`${col} < ${cond.value}`);
          break;
        case '>=':
          conditions.push(`${col} >= ${cond.value}`);
          break;
        case '<=':
          conditions.push(`${col} <= ${cond.value}`);
          break;
        case 'contains':
          conditions.push(`${col} LIKE '%${cond.value}%'`);
          break;
        case 'not_contains':
        case 'notContains':
          conditions.push(`${col} NOT LIKE '%${cond.value}%'`);
          break;
        case 'is_null':
          conditions.push(`${col} IS NULL`);
          break;
        case 'is_not_null':
          conditions.push(`${col} IS NOT NULL`);
          break;
      }
    }

    return `CREATE OR REPLACE TEMP VIEW ${outputView} AS
SELECT *
FROM ${inputView}
WHERE ${conditions.join(' AND ')};`;
  }

  /**
   * 编译排序操作
   */
  private compileSort(step: Extract<Op, { op: 'sort' }>, inputView: string, outputView: string): string {
    const orderBy = step.by
      .map(col => `${this.quote(col.col)} ${col.order.toUpperCase()}`)
      .join(', ');

    return `CREATE OR REPLACE TEMP VIEW ${outputView} AS
SELECT *
FROM ${inputView}
ORDER BY ${orderBy};`;
  }

  /**
   * 引用标识符（处理包含空格或特殊字符的列名）
   */
  private quote(identifier: string): string {
    // Always quote identifiers to avoid SQL keyword conflicts
    return `"${identifier.replace(/"/g, '""')}"`;
  }

  /**
   * 生成预览查询（限制行数）
   */
  compileForPreview(pipeline: Pipeline, sampleSize = 2000): string[] {
    const sqls = this.compile(pipeline);
    console.warn('🔍 [DEBUG] Generated base SQLs:', sqls);

    // 在第一个查询前添加采样
    const sampledSqls = [
      `CREATE OR REPLACE TEMP VIEW ${pipeline.dataset}_sample AS
       SELECT * FROM ${pipeline.dataset} LIMIT ${sampleSize};`,
    ];

    // 将所有引用原始数据集的地方替换为采样版本
    const modifiedSqls = sqls.map(sql =>
      sql.replace(new RegExp(`\\b${pipeline.dataset}\\b`, 'g'), `${pipeline.dataset}_sample`),
    );

    console.warn('🔍 [DEBUG] Final preview SQLs:', sampledSqls.concat(modifiedSqls));
    return sampledSqls.concat(modifiedSqls);
  }
}
