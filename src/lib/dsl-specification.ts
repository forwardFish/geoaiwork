/**
 * SheetAlly DSL Complete Specification
 * This file contains all supported DSL operations with exact syntax
 * Used for keyword matching and prompt generation
 */

export type DSLSpec = {
  [key: string]: {
    operation: string;
    keywords: string[];
    description: string;
    syntax: string; // JSON string representation
    examples: any[];
    notes?: string[];
  };
};

export const DSL_SPECIFICATION: DSLSpec = {
  // 1. 数据标准化操作
  normalize: {
    operation: 'normalize',
    keywords: [
      'normalize',
      'standardize',
      'format',
      'convert',
      'date format',
      'currency format',
      'clean dates',
      'fix format',
      'standard format',
      'yyyy-mm-dd',
      'date conversion',
      'money format',
      'currency',
    ],
    description: 'Standardize date, currency, and other data formats',
    syntax: `{
  "op": "normalize",
  "dates": [{ "col": "string", "to": "YYYY-MM-DD" }], // optional
  "money": [{ "col": "string", "keep": "number" }]     // optional
}`,
    examples: [
      {
        op: 'normalize',
        dates: [{ col: 'OrderDate', to: 'YYYY-MM-DD' }],
      },
      {
        op: 'normalize',
        money: [{ col: 'Amount', keep: 'number' }],
      },
      {
        op: 'normalize',
        dates: [{ col: 'CreatedAt', to: 'YYYY-MM-DD' }, { col: 'UpdatedAt', to: 'YYYY-MM-DD' }],
        money: [{ col: 'Price', keep: 'number' }, { col: 'Total', keep: 'number' }],
      },
    ],
    notes: [
      'Handles various date formats: 2025/07/01, Jul 2 2025, 03/15/2024, etc.',
      'Converts currency formats: $1,200.00, £560.00 → numeric values',
      'Preserves original columns by default',
    ],
  },

  // 2. 去重操作
  dedupe: {
    operation: 'dedupe',
    keywords: [
      'dedupe',
      'duplicate',
      'remove duplicate',
      'unique',
      'distinct',
      'latest',
      'earliest',
      'keep first',
      'keep last',
      'deduplication',
      'remove duplicates',
      'latest order',
      'most recent',
    ],
    description: 'Remove duplicate records based on specified columns',
    syntax: `{
  "op": "dedupe",
  "by": ["string"],  // columns to check for duplicates
  "keep": "latest" | "earliest",
  "orderBy": [{ "col": "string", "dir": "asc" | "desc" }], // optional
  "aggs": { // optional aggregations
    "newColumnName": { "col": "string", "fn": "sum" | "count" | "max" | "min" }
  }
}`,
    examples: [
      {
        op: 'dedupe',
        by: ['CustomerID'],
        keep: 'latest',
        orderBy: [{ col: 'OrderDate', dir: 'desc' }],
      },
      {
        op: 'dedupe',
        by: ['Email', 'Phone'],
        keep: 'earliest',
      },
      {
        op: 'dedupe',
        by: ['ProductID'],
        keep: 'latest',
        orderBy: [{ col: 'UpdatedAt', dir: 'desc' }],
        aggs: {
          TotalSales: { col: 'Amount', fn: 'sum' },
          OrderCount: { fn: 'count' },
        },
      },
    ],
    notes: [
      'Use keep: "latest" to preserve the most recent record',
      'Use keep: "earliest" to preserve the oldest record',
      'orderBy determines what "latest" or "earliest" means',
    ],
  },

  // 3. 列分割操作
  split: {
    operation: 'split',
    keywords: [
      'split',
      'separate',
      'divide',
      'break',
      'full name',
      'first name',
      'last name',
      'address split',
      'split by',
      'split column',
      'parse',
      'extract',
    ],
    description: 'Split a single column into multiple columns',
    syntax: `{
  "op": "split",
  "column": "string",
  "by": " " | "," | ";" | "regex",
  "pattern": "string", // required if by: "regex"
  "into": ["string"] // new column names
}`,
    examples: [
      {
        op: 'split',
        column: 'FullName',
        by: ' ',
        into: ['FirstName', 'LastName'],
      },
      {
        op: 'split',
        column: 'Address',
        by: ',',
        into: ['Street', 'City', 'State', 'ZIP'],
      },
      {
        op: 'split',
        column: 'ContactInfo',
        by: 'regex',
        pattern: '([^|]+)\\|([^|]+)\\|(.+)',
        into: ['Email', 'Phone', 'Address'],
      },
    ],
    notes: [
      'Common separators: space, comma, semicolon',
      'Use regex for complex patterns',
      'Creates new columns with specified names',
    ],
  },

  // 4. 列合并操作
  merge: {
    operation: 'merge',
    keywords: [
      'merge',
      'combine',
      'join columns',
      'concat',
      'concatenate',
      'full name',
      'combine into',
      'merge into',
      'unite',
    ],
    description: 'Merge multiple columns into a single column',
    syntax: `{
  "op": "merge",
  "columns": ["string"], // columns to merge
  "into": "string",      // new column name (use either 'into' or 'newColumn')
  "newColumn": "string", // alternative field name
  "separator": "string", // optional, default: " "
  "keepOriginal": boolean // optional, default: true
}`,
    examples: [
      {
        op: 'merge',
        columns: ['FirstName', 'LastName'],
        into: 'FullName',
        separator: ' ',
      },
      {
        op: 'merge',
        columns: ['Street', 'City', 'State'],
        newColumn: 'FullAddress',
        separator: ', ',
        keepOriginal: false,
      },
    ],
    notes: [
      'Use either "into" or "newColumn" field',
      'Default separator is space',
      'keepOriginal controls whether source columns are retained',
    ],
  },

  // 5. 排序操作
  sort: {
    operation: 'sort',
    keywords: [
      'sort',
      'order',
      'arrange',
      'sort by',
      'order by',
      'ascending',
      'descending',
      'asc',
      'desc',
      'latest first',
      'oldest first',
      'alphabetical',
      'chronological',
    ],
    description: 'Sort data by one or more columns',
    syntax: `{
  "op": "sort",
  "by": [{
    "col": "string",
    "order": "asc" | "desc"
  }]
}`,
    examples: [
      {
        op: 'sort',
        by: [{ col: 'OrderDate', order: 'desc' }],
      },
      {
        op: 'sort',
        by: [
          { col: 'CustomerID', order: 'asc' },
          { col: 'OrderDate', order: 'desc' },
        ],
      },
    ],
    notes: [
      'Multiple columns create hierarchical sorting',
      'desc = newest/highest first, asc = oldest/lowest first',
    ],
  },

  // 6. 列选择操作
  select: {
    operation: 'select',
    keywords: [
      'select',
      'choose',
      'pick',
      'keep',
      'include',
      'exclude',
      'remove column',
      'delete column',
      'drop column',
      'only columns',
      'specific columns',
      'certain columns',
    ],
    description: 'Select or exclude specific columns',
    syntax: `{
  "op": "select",
  "columns": ["string"],
  "exclude": boolean // optional, default: false (include mode)
}`,
    examples: [
      {
        op: 'select',
        columns: ['CustomerID', 'OrderDate', 'Amount'],
      },
      {
        op: 'select',
        columns: ['TempColumn', 'DebugInfo'],
        exclude: true,
      },
    ],
    notes: [
      'exclude: false (default) = keep only specified columns',
      'exclude: true = remove specified columns, keep others',
    ],
  },

  // 7. 数据过滤操作
  filter: {
    operation: 'filter',
    keywords: [
      'filter',
      'where',
      'condition',
      'criteria',
      'only show',
      'contains',
      'equals',
      'greater than',
      'less than',
      'not null',
      'empty',
      'blank',
      'exclude',
    ],
    description: 'Filter rows based on conditions',
    syntax: `{
  "op": "filter",
  "conditions": [{
    "col": "string",
    "op": "=" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "not_contains" | "is_null" | "is_not_null",
    "value": "string | number" // optional for null checks
  }]
}`,
    examples: [
      {
        op: 'filter',
        conditions: [
          { col: 'Status', op: '=', value: 'PAID' },
        ],
      },
      {
        op: 'filter',
        conditions: [
          { col: 'Amount', op: '>', value: 1000 },
          { col: 'CustomerType', op: 'contains', value: 'Premium' },
        ],
      },
    ],
  },

  // 8. 数据聚合操作
  aggregate: {
    operation: 'aggregate',
    keywords: [
      'aggregate',
      'group by',
      'sum',
      'count',
      'average',
      'max',
      'min',
      'total',
      'summarize',
      'group',
      'rollup',
      'pivot',
    ],
    description: 'Group data and calculate aggregations',
    syntax: `{
  "op": "aggregate",
  "groupBy": ["string"],
  "aggs": {
    "newColumnName": {
      "fn": "sum" | "count" | "avg" | "max" | "min" | "median" | "stddev",
      "col": "string" // optional for count
    }
  }
}`,
    examples: [
      {
        op: 'aggregate',
        groupBy: ['CustomerID'],
        aggs: {
          TotalAmount: { fn: 'sum', col: 'Amount' },
          OrderCount: { fn: 'count' },
          LastOrderDate: { fn: 'max', col: 'OrderDate' },
        },
      },
    ],
  },

  // 9. 表连接操作
  join: {
    operation: 'join',
    keywords: [
      'join',
      'merge with',
      'combine with',
      'lookup',
      'match',
      'left join',
      'inner join',
      'relate',
      'link',
    ],
    description: 'Join with another dataset',
    syntax: `{
  "op": "join",
  "rightRef": "string", // reference to second dataset
  "how": "left" | "inner",
  "on": { "leftColumn": "rightColumn" }, // column mapping
  "select": ["string"] // optional, columns to include from right table
}`,
    examples: [
      {
        op: 'join',
        rightRef: 'customers',
        how: 'left',
        on: { CustomerID: 'ID' },
      },
      {
        op: 'join',
        rightRef: 'products',
        how: 'inner',
        on: { ProductCode: 'SKU' },
        select: ['ProductName', 'Category', 'Price'],
      },
    ],
  },

  // 10. 差异比较操作
  diff: {
    operation: 'diff',
    keywords: [
      'diff',
      'difference',
      'compare',
      'changes',
      'delta',
      'what changed',
      'modifications',
      'variations',
    ],
    description: 'Compare datasets and show differences',
    syntax: `{
  "op": "diff",
  "rightRef": "string", // reference to comparison dataset
  "key": ["string"],    // key columns for matching
  "scope": "all" | ["string"] // "all" or specific columns to compare
}`,
    examples: [
      {
        op: 'diff',
        rightRef: 'version2',
        key: ['ID'],
        scope: 'all',
      },
      {
        op: 'diff',
        rightRef: 'updated_data',
        key: ['CustomerID', 'OrderID'],
        scope: ['Status', 'Amount', 'Notes'],
      },
    ],
  },
};

/**
 * Keywords that indicate specific operations
 */
export const OPERATION_KEYWORDS = {
  // Date/Time operations
  dates: ['date', 'time', 'timestamp', 'created', 'updated', 'yyyy-mm-dd', 'format date'],

  // Duplicate operations
  duplicates: ['duplicate', 'dedupe', 'unique', 'distinct', 'latest', 'earliest', 'recent'],

  // Text operations
  text: ['name', 'split', 'merge', 'combine', 'separate', 'first name', 'last name', 'full name'],

  // Sorting
  sorting: ['sort', 'order', 'arrange', 'ascending', 'descending', 'asc', 'desc', 'chronological'],

  // Column operations
  columns: ['column', 'field', 'select', 'choose', 'remove', 'delete', 'drop', 'keep', 'include', 'exclude'],

  // Data filtering
  filtering: ['filter', 'where', 'condition', 'only', 'contains', 'equals', 'greater', 'less'],

  // Aggregation
  aggregation: ['sum', 'total', 'count', 'average', 'max', 'min', 'group', 'summarize'],

  // Data cleaning
  cleaning: ['clean', 'trim', 'space', 'replace', 'uppercase', 'lowercase', 'normalize'],

  // Comparison
  comparison: ['compare', 'diff', 'difference', 'changes', 'delta', 'version'],
};

export default DSL_SPECIFICATION;
