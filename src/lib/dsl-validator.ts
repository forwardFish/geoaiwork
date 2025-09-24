import type { Op, Pipeline } from './pipeline';
import { z } from 'zod';

/**
 * DSL Schema 验证器
 * 确保大模型生成的DSL符合正确的结构和语义
 */

// 定义操作的Zod schema
const NormalizeOpSchema = z.object({
  op: z.literal('normalize'),
  dates: z.array(z.object({ col: z.string() })).optional(),
  money: z.array(z.object({ col: z.string() })).optional(),
});

const DedupeOpSchema = z.object({
  op: z.literal('dedupe'),
  by: z.array(z.string()),
  orderBy: z.array(z.object({
    col: z.string(),
    dir: z.enum(['asc', 'desc']),
  })).optional(),
  aggs: z.record(z.string(), z.object({
    fn: z.enum(['count', 'sum', 'avg', 'max', 'min']),
    col: z.string().optional(),
  })).optional(),
});

const SplitOpSchema = z.object({
  op: z.literal('split'),
  column: z.string(),
  by: z.string(),
  into: z.array(z.string()),
  pattern: z.string().optional(),
});

const MergeOpSchema = z.object({
  op: z.literal('merge'),
  columns: z.array(z.string()),
  into: z.string().optional(),
  newColumn: z.string().optional(), // 支持OpenRouter返回的newColumn字段
  separator: z.string().default(' '),
  keepOriginal: z.boolean().default(true),
}).refine(data => data.into || data.newColumn, {
  message: 'Either \'into\' or \'newColumn\' must be provided',
});

const CleanOpSchema = z.object({
  op: z.literal('clean'),
  trims: z.array(z.string()).optional(),
  normalizeSpace: z.array(z.string()).optional(),
  replace: z.array(z.object({
    col: z.string(),
    from: z.string(),
    to: z.string(),
  })).optional(),
});

const JoinOpSchema = z.object({
  op: z.literal('join'),
  rightRef: z.string(),
  on: z.record(z.string(), z.string()),
  how: z.enum(['inner', 'left', 'right', 'outer']),
  select: z.array(z.string()).optional(),
});

const DiffOpSchema = z.object({
  op: z.literal('diff'),
  rightRef: z.string(),
  key: z.array(z.string()),
});

const SelectOpSchema = z.object({
  op: z.literal('select'),
  columns: z.array(z.string()),
  exclude: z.boolean().default(false),
});

const SortOpSchema = z.object({
  op: z.literal('sort'),
  by: z.array(z.object({
    col: z.string(),
    order: z.enum(['asc', 'desc']).default('asc'),
  })),
});

// Filter condition schema
const FilterConditionSchema = z.object({
  col: z.string(),
  op: z.enum(['=', '!=', '>', '<', '>=', '<=', 'contains', 'notContains', 'not_contains', 'is_null', 'is_not_null']),
  value: z.union([z.string(), z.number()]).optional(),
});

const FilterOpSchema = z.object({
  op: z.literal('filter'),
  conditions: z.array(FilterConditionSchema),
});

// 联合所有操作schema
const OpSchema = z.union([
  NormalizeOpSchema,
  DedupeOpSchema,
  SplitOpSchema,
  MergeOpSchema,
  CleanOpSchema,
  JoinOpSchema,
  DiffOpSchema,
  SelectOpSchema,
  SortOpSchema,
  FilterOpSchema,
]);

// Pipeline schema
const PipelineSchema = z.object({
  version: z.literal('v1'),
  dataset: z.string(), // Allow any string, not just "a"
  steps: z.array(OpSchema),
  meta: z.object({
    title: z.string(),
    userQuery: z.string(),
  }).optional(),
});

// 验证结果接口
export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  corrected?: Pipeline;
};

export class DSLValidator {
  /**
   * 验证DSL Pipeline的结构和语义
   */
  validate(dsl: any, dataColumns: string[]): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    try {
      // 1. 预处理：标准化字段名
      const normalizedDSL = this.normalizeDSL(dsl);

      // 2. Schema结构验证
      const parseResult = PipelineSchema.safeParse(normalizedDSL);
      if (!parseResult.success) {
        result.isValid = false;
        parseResult.error.issues.forEach((err) => {
          result.errors.push(`Schema error: ${err.path.join('.')} - ${err.message}`);
        });
        return result;
      }

      const pipeline = parseResult.data as Pipeline;

      // 3. 语义验证
      this.validateSemantics(pipeline as any, dataColumns, result);

      // 4. 业务逻辑验证
      this.validateBusinessLogic(pipeline as any, dataColumns, result);

      // 5. 自动修正可修正的错误
      if (result.errors.length === 0 && result.warnings.length > 0) {
        result.corrected = this.autoCorrect(pipeline as any, dataColumns, result);
      }
    } catch (error) {
      result.isValid = false;
      result.errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * 标准化DSL字段名，将常见的变体转换为标准格式
   */
  private normalizeDSL(dsl: any): any {
    const normalized = JSON.parse(JSON.stringify(dsl));

    if (normalized.steps && Array.isArray(normalized.steps)) {
      normalized.steps.forEach((step: any) => {
        // 转换merge操作的字段名
        if (step.op === 'merge') {
          // 如果有newColumn但没有into，将newColumn转换为into
          if (step.newColumn && !step.into) {
            step.into = step.newColumn;
            delete step.newColumn;
          }
          // 如果同时有两个字段，优先使用into
          else if (step.newColumn && step.into) {
            delete step.newColumn;
          }
        }

        // 转换select操作的字段名/形式
        if (step.op === 'select') {
          // 兼容形如 { op: 'select', exclude: ['Col'] } 的写法
          if (Array.isArray(step.exclude) && !Array.isArray(step.columns)) {
            step.columns = step.exclude;
            step.exclude = true;
          }
        }

        // 未来可以在这里添加其他操作的字段名标准化
      });
    }

    return normalized;
  }

  /**
   * 语义验证：检查列名、数据类型等
   * 注意：这里只验证操作本身的有效性，不验证步骤间的依赖关系
   */
  private validateSemantics(pipeline: Pipeline, dataColumns: string[], result: ValidationResult) {
    for (const step of pipeline.steps) {
      switch (step.op) {
        case 'merge':
          this.validateMergeOp(step, dataColumns, result);
          break;
        case 'split':
          this.validateSplitOp(step, dataColumns, result);
          break;
        case 'dedupe':
          this.validateDedupeOp(step, dataColumns, result);
          break;
        case 'select':
          // 对于select操作，我们在语义验证阶段跳过列存在性检查
          // 因为列可能是由前面的操作创建的，应该在业务逻辑验证中处理
          break;
        case 'normalize':
          this.validateNormalizeOp(step, dataColumns, result);
          break;
        case 'clean':
          this.validateCleanOp(step, dataColumns, result);
          break;
        case 'filter':
          this.validateFilterOp(step, dataColumns, result);
          break;
      }
    }
  }

  private validateMergeOp(step: Extract<Op, { op: 'merge' }>, dataColumns: string[], result: ValidationResult) {
    // 检查源列是否存在
    for (const col of step.columns) {
      if (!dataColumns.includes(col)) {
        result.errors.push(`Merge operation: Column "${col}" does not exist in data`);
        result.isValid = false;
      }
    }

    // 确保有目标列名（经过标准化后应该有into字段）
    if (!step.into) {
      result.errors.push('Merge operation: Target column name is required');
      result.isValid = false;
      return;
    }

    // 检查目标列名冲突
    if (dataColumns.includes(step.into) && step.keepOriginal) {
      result.warnings.push(`Merge operation: Target column "${step.into}" already exists, will be overwritten`);
    }

    // 验证分隔符
    if (!step.separator || step.separator.length === 0) {
      result.warnings.push('Merge operation: Empty separator may cause data to be concatenated without spacing');
    }
  }

  private validateSplitOp(step: Extract<Op, { op: 'split' }>, dataColumns: string[], result: ValidationResult) {
    // 检查源列是否存在
    if (!dataColumns.includes(step.column)) {
      result.errors.push(`Split operation: Column "${step.column}" does not exist in data`);
      result.isValid = false;
    }

    // 检查目标列名冲突
    for (const targetCol of step.into) {
      if (dataColumns.includes(targetCol)) {
        result.warnings.push(`Split operation: Target column "${targetCol}" already exists, will be overwritten`);
      }
    }

    // 验证分隔符或模式
    if (!step.by && !step.pattern) {
      result.errors.push('Split operation: Must specify either "by" (delimiter) or "pattern" (regex)');
      result.isValid = false;
    }
  }

  private validateDedupeOp(step: Extract<Op, { op: 'dedupe' }>, dataColumns: string[], result: ValidationResult) {
    // 检查去重键列是否存在
    for (const col of step.by) {
      if (!dataColumns.includes(col)) {
        result.errors.push(`Dedupe operation: Key column "${col}" does not exist in data`);
        result.isValid = false;
      }
    }

    // 检查排序列是否存在
    if (step.orderBy) {
      for (const orderCol of step.orderBy) {
        if (!dataColumns.includes(orderCol.col)) {
          result.errors.push(`Dedupe operation: Order column "${orderCol.col}" does not exist in data`);
          result.isValid = false;
        }
      }
    }
  }

  private validateNormalizeOp(step: Extract<Op, { op: 'normalize' }>, dataColumns: string[], result: ValidationResult) {
    // 检查日期列是否存在
    if (step.dates) {
      for (const dateCol of step.dates) {
        if (!dataColumns.includes(dateCol.col)) {
          result.errors.push(`Normalize operation: Date column "${dateCol.col}" does not exist in data`);
          result.isValid = false;
        }
      }
    }

    // 检查金额列是否存在
    if (step.money) {
      for (const moneyCol of step.money) {
        if (!dataColumns.includes(moneyCol.col)) {
          result.errors.push(`Normalize operation: Money column "${moneyCol.col}" does not exist in data`);
          result.isValid = false;
        }
      }
    }
  }

  private validateCleanOp(step: Extract<Op, { op: 'clean' }>, dataColumns: string[], result: ValidationResult) {
    // 检查trim列是否存在
    if (step.trims) {
      for (const col of step.trims) {
        if (!dataColumns.includes(col)) {
          result.errors.push(`Clean operation: Trim column "${col}" does not exist in data`);
          result.isValid = false;
        }
      }
    }

    // 检查normalizeSpace列是否存在
    if (step.normalizeSpace) {
      for (const col of step.normalizeSpace) {
        if (!dataColumns.includes(col)) {
          result.errors.push(`Clean operation: Normalize space column "${col}" does not exist in data`);
          result.isValid = false;
        }
      }
    }

    // 检查替换操作列是否存在
    if (step.replace) {
      for (const replaceOp of step.replace) {
        if (!dataColumns.includes(replaceOp.col)) {
          result.errors.push(`Clean operation: Replace column "${replaceOp.col}" does not exist in data`);
          result.isValid = false;
        }
      }
    }
  }

  private validateFilterOp(step: Extract<Op, { op: 'filter' }>, dataColumns: string[], result: ValidationResult) {
    // 检查筛选条件中的列是否存在
    for (const condition of step.conditions) {
      if (!dataColumns.includes(condition.col)) {
        result.errors.push(`Filter operation: Column "${condition.col}" does not exist in data`);
        result.isValid = false;
      }

      // 检查操作符是否需要值
      const needsValue = ['=', '!=', '>', '<', '>=', '<=', 'contains', 'notContains', 'not_contains'];
      if (needsValue.includes(condition.op) && (condition.value === undefined || condition.value === null)) {
        result.errors.push(`Filter operation: Operation "${condition.op}" requires a value`);
        result.isValid = false;
      }
    }
  }

  /**
   * 业务逻辑验证：检查操作序列的合理性
   */
  private validateBusinessLogic(pipeline: Pipeline, dataColumns: string[], result: ValidationResult) {
    // 检查操作序列的逻辑合理性
    let currentColumns = [...dataColumns];

    for (let i = 0; i < pipeline.steps.length; i++) {
      const step = pipeline.steps[i] as Op;

      // 模拟操作对列的影响
      switch (step.op) {
        case 'merge':
          // merge操作会创建新列
          if (step.into) {
            if (step.keepOriginal !== false) {
              // 默认保留原列，添加新列
              currentColumns.push(step.into);
            } else {
              // 移除源列，添加目标列
              currentColumns = currentColumns.filter(col => !step.columns.includes(col));
              currentColumns.push(step.into);
            }
          }
          break;
        case 'split':
          currentColumns.push(...step.into);
          break;
        case 'select':
          if (step.exclude) {
            currentColumns = currentColumns.filter(col => !step.columns.includes(col));
          } else {
            currentColumns = step.columns;
          }
          break;
      }

      // 检查后续操作是否还有效
      if (i < pipeline.steps.length - 1) {
        const nextStep = pipeline.steps[i + 1];
        if (nextStep) {
          this.validateStepDependencies(nextStep, currentColumns, result, i + 1);
        }
      }
    }

    // 检查最终结果是否有意义
    if (currentColumns.length === 0) {
      result.warnings.push('Pipeline will result in empty dataset with no columns');
    }
  }

  private validateStepDependencies(step: Op, availableColumns: string[], result: ValidationResult, stepIndex: number) {
    const getRequiredColumns = (op: Op): string[] => {
      switch (op.op) {
        case 'merge': return op.columns;
        case 'split': return [op.column];
        case 'dedupe': return op.by;
        case 'select': return op.columns;
        case 'normalize':
          return [...(op.dates?.map(d => d.col) || []), ...(op.money?.map(m => m.col) || [])];
        case 'clean':
          return [...(op.trims || []), ...(op.normalizeSpace || []), ...(op.replace?.map(r => r.col) || [])];
        default: return [];
      }
    };

    const requiredColumns = getRequiredColumns(step);
    for (const col of requiredColumns) {
      if (!availableColumns.includes(col)) {
        result.warnings.push(
          `Step ${stepIndex + 1} (${step.op}): Column "${col}" may not be available after previous operations`,
        );
      }
    }
  }

  /**
   * 自动修正常见错误
   */
  private autoCorrect(pipeline: Pipeline, dataColumns: string[], result: ValidationResult): Pipeline {
    const corrected = JSON.parse(JSON.stringify(pipeline)) as Pipeline;

    for (const step of corrected.steps) {
      switch (step.op) {
        case 'merge':
          // 自动设置合理的分隔符
          if (!step.separator) {
            step.separator = ' ';
            result.warnings.push('Auto-corrected: Set merge separator to space');
          }
          break;
        case 'select':
          // 防止选择不存在的列
          const validColumns = step.columns.filter(col => dataColumns.includes(col));
          if (validColumns.length !== step.columns.length) {
            step.columns = validColumns;
            result.warnings.push('Auto-corrected: Removed non-existent columns from selection');
          }
          break;
      }
    }

    return corrected;
  }

  /**
   * 数据风险评估
   */
  assessDataRisks(pipeline: Pipeline, dataRowCount: number): string[] {
    const risks: string[] = [];

    for (const step of pipeline.steps) {
      switch (step.op) {
        case 'dedupe':
          risks.push(`Deduplication may remove up to ${Math.floor(dataRowCount * 0.3)} rows based on duplicate detection`);
          break;
        case 'select':
          if (step.exclude) {
            risks.push(`Column exclusion will permanently remove ${step.columns.length} columns from the dataset`);
          } else if (step.columns.length < 5) { // 假设原始数据有更多列
            risks.push(`Column selection will reduce dataset to only ${step.columns.length} columns`);
          }
          break;
        case 'merge':
          if (!step.keepOriginal) {
            risks.push(`Column merge will remove original columns: ${step.columns.join(', ')}`);
          }
          break;
        case 'split':
          risks.push('Column splitting may create empty cells if data doesn\'t split evenly');
          break;
      }
    }

    return risks;
  }

  /**
   * 生成用户友好的验证报告
   */
  generateValidationReport(result: ValidationResult): string {
    let report = '';

    if (result.isValid) {
      report += '✅ **DSL验证通过**\n\n';
    } else {
      report += '❌ **DSL验证失败**\n\n';
    }

    if (result.errors.length > 0) {
      report += '🚫 **错误:**\n';
      result.errors.forEach((error) => {
        report += `• ${error}\n`;
      });
      report += '\n';
    }

    if (result.warnings.length > 0) {
      report += '⚠️ **警告:**\n';
      result.warnings.forEach((warning) => {
        report += `• ${warning}\n`;
      });
      report += '\n';
    }

    if (result.corrected) {
      report += '🔧 **已自动修正部分问题**\n\n';
    }

    return report.trim();
  }
}

export const dslValidator = new DSLValidator();
