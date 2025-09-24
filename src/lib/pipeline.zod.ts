import { z } from 'zod';

// Filter condition schema
const zFilterCondition = z.object({
  col: z.string(),
  op: z.enum(['=', '!=', '>', '<', '>=', '<=', 'contains', 'not_contains', 'notContains', 'is_null', 'is_not_null']),
  value: z.union([z.string(), z.number()]).optional(),
});

// Individual operation schemas
const zNormalize = z.object({
  op: z.literal('normalize'),
  dates: z.array(z.object({
    col: z.string(),
    to: z.literal('YYYY-MM-DD'),
  })).optional(),
  money: z.array(z.object({
    col: z.string(),
    keep: z.literal('number'),
  })).optional(),
});

const zDedupe = z.object({
  op: z.literal('dedupe'),
  by: z.array(z.string()).min(1),
  keep: z.enum(['latest', 'earliest']),
  orderBy: z.array(z.object({
    col: z.string(),
    dir: z.enum(['asc', 'desc']),
  })).optional(),
  aggs: z.record(z.string(), z.object({
    col: z.string().optional(),
    fn: z.enum(['sum', 'count', 'max', 'min']),
  })).optional(),
});

const zSplit = z.object({
  op: z.literal('split'),
  column: z.string(),
  by: z.enum([' ', ',', ';', 'regex']),
  pattern: z.string().optional(),
  into: z.array(z.string()),
});

const zMerge = z.object({
  op: z.literal('merge'),
  columns: z.array(z.string()).min(2),
  into: z.string().optional(),
  newColumn: z.string().optional(), // Support OpenRouter's newColumn field
  separator: z.string().optional(),
  keepOriginal: z.boolean().optional(),
}).refine(data => data.into || data.newColumn, {
  message: 'Either \'into\' or \'newColumn\' must be provided',
});

const zClean = z.object({
  op: z.literal('clean'),
  trims: z.array(z.string()).optional(),
  normalizeSpace: z.array(z.string()).optional(),
  replace: z.array(z.object({
    col: z.string(),
    from: z.string(),
    to: z.string(),
  })).optional(),
});

const zJoin = z.object({
  op: z.literal('join'),
  rightRef: z.string(),
  how: z.enum(['left', 'inner']),
  on: z.record(z.string(), z.string()),
  select: z.array(z.string()).optional(),
});

const zDiff = z.object({
  op: z.literal('diff'),
  rightRef: z.string(),
  key: z.array(z.string()),
  scope: z.union([z.literal('all'), z.array(z.string())]),
});

const zFilter = z.object({
  op: z.literal('filter'),
  conditions: z.array(zFilterCondition),
});

const zSort = z.object({
  op: z.literal('sort'),
  by: z.array(z.object({
    col: z.string(),
    order: z.enum(['asc', 'desc']),
  })),
});

const zAggregate = z.object({
  op: z.literal('aggregate'),
  groupBy: z.array(z.string()),
  aggs: z.record(z.string(), z.object({
    fn: z.enum(['sum', 'count', 'avg', 'max', 'min']),
    col: z.string().optional(),
  })),
});

const zSelect = z.object({
  op: z.literal('select'),
  columns: z.array(z.string()),
  exclude: z.boolean().optional(),
});

// Union of all operations
const zOp = z.union([
  zNormalize,
  zDedupe,
  zSplit,
  zMerge,
  zClean,
  zJoin,
  zDiff,
  zFilter,
  zSort,
  zAggregate,
  zSelect,
]);

// Main pipeline schema
export const zPipeline = z.object({
  version: z.literal('v1'),
  dataset: z.literal('a'),
  steps: z.array(zOp),
  meta: z.object({
    title: z.string().optional(),
    notes: z.string().optional(),
    userQuery: z.string().optional(),
  }).optional(),
});

// Validation helper function
export function validatePipeline(data: any): { success: boolean; pipeline?: any; errors?: any } {
  const result = zPipeline.safeParse(data);
  if (result.success) {
    return { success: true, pipeline: result.data };
  }
  return { success: false, errors: result.error.flatten() };
}

// Semantic validation function
export function validateSemantics(pipeline: any, tables: Record<string, string[]>): string[] {
  const errors: string[] = [];
  const tableA = tables.a || [];

  for (const step of pipeline.steps) {
    switch (step.op) {
      case 'dedupe':
        // Check if dedup columns exist
        for (const col of step.by) {
          if (!tableA.includes(col)) {
            errors.push(`Dedupe column "${col}" not found in dataset A`);
          }
        }
        if (step.orderBy) {
          for (const order of step.orderBy) {
            if (!tableA.includes(order.col)) {
              errors.push(`OrderBy column "${order.col}" not found in dataset A`);
            }
          }
        }
        break;

      case 'join': {
        const rightTable = tables[step.rightRef];
        if (!rightTable) {
          errors.push(`Referenced table "${step.rightRef}" not found`);
          break;
        }
        // Check join keys
        for (const [leftKey, rightKey] of Object.entries(step.on)) {
          if (!tableA.includes(leftKey)) {
            errors.push(`Left join key "${leftKey}" not found in dataset A`);
          }
          if (!rightTable.includes(rightKey as string)) {
            errors.push(`Right join key "${rightKey}" not found in dataset ${step.rightRef}`);
          }
        }
        break;
      }

      case 'filter':
        for (const condition of step.conditions) {
          if (!tableA.includes(condition.col)) {
            errors.push(`Filter column "${condition.col}" not found in dataset A`);
          }
        }
        break;

      case 'sort':
        for (const sortCol of step.by) {
          if (!tableA.includes(sortCol.col)) {
            errors.push(`Sort column "${sortCol.col}" not found in dataset A`);
          }
        }
        break;

      case 'split':
        if (!tableA.includes(step.column)) {
          errors.push(`Split column "${step.column}" not found in dataset A`);
        }
        break;

      case 'normalize':
        // Check if normalize date columns exist
        if (step.dates) {
          for (const dateConfig of step.dates) {
            if (!tableA.includes(dateConfig.col)) {
              errors.push(`Normalize date column "${dateConfig.col}" not found in dataset A`);
            }
          }
        }
        // Check if normalize money columns exist
        if (step.money) {
          for (const moneyConfig of step.money) {
            if (!tableA.includes(moneyConfig.col)) {
              errors.push(`Normalize money column "${moneyConfig.col}" not found in dataset A`);
            }
          }
        }
        break;

      default:
        // Other operations can be validated similarly
        break;
    }
  }

  return errors;
}
