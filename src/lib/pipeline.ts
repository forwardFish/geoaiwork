// Pipeline DSL Schema Definition
export type Op
  = | { op: 'normalize'; dates?: { col: string; to: 'YYYY-MM-DD' }[]; money?: { col: string; keep: 'number' }[] }
    | {
      op: 'dedupe';
      by: string[];
      keep: 'latest' | 'earliest';
      orderBy?: { col: string; dir: 'asc' | 'desc' }[];
      aggs?: Record<string, { col?: string; fn: 'sum' | 'count' | 'max' | 'min' }>;
    }
    | { op: 'split'; column: string; by: ' ' | ',' | ';' | 'regex'; pattern?: string; into: string[] }
    | { op: 'merge'; columns: string[]; into?: string; newColumn?: string; separator?: string; keepOriginal?: boolean }
    | {
      op: 'clean';
      trims?: string[];
      normalizeSpace?: string[];
      replace?: { col: string; from: string; to: string }[];
      upper?: string[]; // 新增：大写转换
      lower?: string[]; // 新增：小写转换
      proper?: string[]; // 新增：首字母大写
      removeSpecial?: string[]; // 新增：移除特殊字符
    }
    | {
      op: 'join';
      rightRef: 'b' | 'c' | string;
      how: 'left' | 'inner';
      on: Record<string, string>;
      select?: string[];
    }
    | { op: 'diff'; rightRef: string; key: string[]; scope: 'all' | string[] }
    | { op: 'filter'; conditions: FilterCondition[] }
    | { op: 'sort'; by: { col: string; order: 'asc' | 'desc' }[] }
    | { op: 'aggregate'; groupBy: string[]; aggs: Record<string, { fn: 'sum' | 'count' | 'avg' | 'max' | 'min' | 'median' | 'stddev'; col?: string }> }
    | { op: 'select'; columns: string[]; exclude?: boolean }; // 新增：列选择操作

export type FilterCondition = {
  col: string;
  op: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'not_contains' | 'notContains' | 'is_null' | 'is_not_null';
  value?: string | number;
};

export type Pipeline = {
  version: 'v1';
  dataset: 'a';
  steps: Op[];
  meta?: {
    title?: string;
    notes?: string;
    userQuery?: string;
  };
};

export type PipelineResult = {
  kind: 'ok' | 'clarify' | 'invalid';
  pipeline?: Pipeline;
  questions?: string[];
  errors?: any;
};

// Helper types for data handling
export type DataTable = {
  name: string;
  columns: string[];
  sample: any[];
  rowCount: number;
};

export type PreviewSummary = {
  originalRows: number;
  finalRows: number;
  operations: string[];
  warnings: string[];
  samples: {
    added?: any[];
    removed?: any[];
    modified?: any[];
  };
};

// Preview result interface
export type PreviewResult = {
  rowsBefore: number;
  rowsAfter: number;
  columnsModified: string[];
  summary: {
    added: number;
    removed: number;
    modified: number;
  };
  samples: {
    dropped?: any[];
    failed?: any[];
    unmatched?: any[];
  };
  risks: string[];
};
