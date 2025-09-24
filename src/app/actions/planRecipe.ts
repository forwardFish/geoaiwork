'use server';

import type { Pipeline } from '@/lib/pipeline';
import DSLKeywordMatcher from '@/lib/dsl-keyword-matcher';
import { zPipeline } from '@/lib/pipeline.zod';
import { safeJsonParse } from '@/lib/safeJsonParse';

// Normalize AI JSON to our strict zod schema
function normalizeIncomingPipeline(json: any): any {
  if (!json || typeof json !== 'object') {
    return json;
  }

  const normalized: any = { ...json };
  if (!normalized.version) {
    normalized.version = 'v1';
  }
  if (!normalized.dataset) {
    normalized.dataset = 'a';
  }

  if (Array.isArray(normalized.steps)) {
    normalized.steps = normalized.steps.map((step: any) => {
      if (!step || typeof step !== 'object') {
        return step;
      }

      // Support select with "exclude" as an array, e.g. { op: 'select', exclude: ['Col'] }
      if (step.op === 'select') {
        if (Array.isArray(step.exclude) && !Array.isArray(step.columns)) {
          return { ...step, columns: step.exclude, exclude: true };
        }
      }

      // Support merge with "newColumn" instead of "into"
      if (step.op === 'merge') {
        if (step.newColumn && !step.into) {
          const { newColumn, ...rest } = step;
          return { ...rest, into: newColumn };
        }
      }

      return step;
    });
  }

  return normalized;
}

// Map ordinal column references in user text to actual column names
function applyOrdinalColumnHints(pipeline: any, columns: string[], userText?: string): any {
  if (!pipeline || !Array.isArray(pipeline.steps)) {
    return pipeline;
  }
  const text = (userText || pipeline?.meta?.userQuery || '').toString();
  if (!text) {
    return pipeline;
  }

  const lower = text.toLowerCase();

  const enOrdinals: Record<string, number> = {
    'first': 1,
    '1st': 1,
    'second': 2,
    '2nd': 2,
    'third': 3,
    '3rd': 3,
    'fourth': 4,
    '4th': 4,
    'fifth': 5,
    '5th': 5,
    'sixth': 6,
    '6th': 6,
    'seventh': 7,
    '7th': 7,
    'eighth': 8,
    '8th': 8,
    'ninth': 9,
    '9th': 9,
    'tenth': 10,
    '10th': 10,
  };

  const zhNumMap: Record<string, number> = {
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
  };

  const findOrdinalIndex = (): number | null => {
    // Chinese patterns: 第3列 / 第三列 / 第3栏
    const m1 = text.match(/第\s*(\d+)\s*(列|栏)/);
    if (m1 && m1[1]) {
      const idx = Number.parseInt(m1[1], 10);
      if (!Number.isNaN(idx)) {
        return idx;
      }
    }
    const m2 = text.match(/第([一二三四五六七八九十]+)(列|栏)/);
    if (m2 && m2[1]) {
      const chars = m2[1].split('');
      if (chars.length === 1) {
        const idx = zhNumMap[chars[0]];
        if (idx) {
          return idx;
        }
      }
      if (chars.length === 2 && chars[0] === '十') {
        return 10; // 第十列
      }
    }

    // English: third column / 3rd column / column 3 / col 3
    const enKey = Object.keys(enOrdinals).find(k => lower.includes(`${k} column`));
    if (enKey) {
      return enOrdinals[enKey] ?? null;
    }

    const m3 = lower.match(/\b(\d+)(st|nd|rd|th)?\s+column\b/);
    if (m3 && m3[1]) {
      const idx = Number.parseInt(m3[1], 10);
      if (!Number.isNaN(idx)) {
        return idx;
      }
    }
    const m4 = lower.match(/\b(column|col)\s*(?:#\s*)?(\d+)\b/);
    if (m4 && m4[2]) {
      const idx = Number.parseInt(m4[2], 10);
      if (!Number.isNaN(idx)) {
        return idx;
      }
    }

    return null;
  };

  const ordinal = findOrdinalIndex();
  if (!ordinal || ordinal < 1 || ordinal > columns.length) {
    return pipeline;
  }
  const targetCol = columns[ordinal - 1];

  const updated = JSON.parse(JSON.stringify(pipeline));
  updated.steps = updated.steps.map((step: any) => {
    if (step.op === 'dedupe') {
      // Force dedupe by the ordinal-specified column
      step.by = [targetCol];
      // Drop invalid orderBy columns if any
      if (Array.isArray(step.orderBy)) {
        step.orderBy = step.orderBy.filter((o: any) => o && columns.includes(o.col));
        if (step.orderBy.length === 0) {
          delete step.orderBy;
        }
      }
      // Ensure keep exists for strict schema
      if (!step.keep) {
        step.keep = 'earliest';
      }
    }
    if (step.op === 'normalize') {
      // If user mentioned an ordinal but the dates array is empty or wrong, map it
      if (!step.dates && !step.money) {
        step.dates = [{ col: targetCol, to: 'YYYY-MM-DD' }];
      }
    }
    return step;
  });

  // Also store resolved hint into meta for debugging/tracing
  updated.meta = {
    ...(updated.meta || {}),
    resolvedColumnFromOrdinal: targetCol,
  };

  return updated;
}

type PlanRecipeResult = {
  kind: 'ok' | 'clarify' | 'invalid';
  pipeline?: Pipeline;
  questions?: string[];
  errors?: any;
};

// 语义校验函数
function validateSemantics(pipeline: Pipeline, context: { a: string[]; b: string[] | null; b2: string[] | null }): string[] {
  const errors: string[] = [];

  for (const step of pipeline.steps) {
    switch (step.op) {
      case 'normalize':
        step.dates?.forEach((d) => {
          if (!context.a.includes(d.col)) {
            errors.push(`Date column '${d.col}' not found in dataset A`);
          }
        });
        step.money?.forEach((m) => {
          if (!context.a.includes(m.col)) {
            errors.push(`Money column '${m.col}' not found in dataset A`);
          }
        });
        break;
      case 'dedupe':
        step.by.forEach((col) => {
          if (!context.a.includes(col)) {
            errors.push(`Dedupe key column '${col}' not found in dataset A`);
          }
        });
        step.orderBy?.forEach((o) => {
          if (!context.a.includes(o.col)) {
            errors.push(`OrderBy column '${o.col}' not found in dataset A`);
          }
        });
        break;
      case 'join':
        const rightCols = step.rightRef === 'b' ? context.b : context.b2;
        if (!rightCols) {
          errors.push(`Join dataset '${step.rightRef}' not available`);
          break;
        }
        Object.entries(step.on).forEach(([leftCol, rightCol]) => {
          if (!context.a.includes(leftCol)) {
            errors.push(`Join left key '${leftCol}' not found in dataset A`);
          }
          if (!rightCols.includes(rightCol)) {
            errors.push(`Join right key '${rightCol}' not found in dataset ${step.rightRef}`);
          }
        });
        break;
    }
  }

  return errors;
}

export async function planRecipe(params: {
  userQuery: string;
  colsA: string[];
  colsB?: string[];
  colsB2?: string[];
  sampleA: any[];
  sampleB?: any[];
  sampleB2?: any[];
}): Promise<PlanRecipeResult> {
  console.log('🚀 [DEBUG] planRecipe called with:', {
    userQuery: params.userQuery,
    colsA: params.colsA,
    sampleRowCount: params.sampleA.length,
    usingSampleData: params.sampleA.length > 0,
  });

  // Initialize keyword matcher and analyze query
  const keywordMatcher = new DSLKeywordMatcher();
  const queryAnalysis = keywordMatcher.analyzeQuery(params.userQuery, params.colsA);

  console.log('🔍 [DEBUG] Query analysis:', {
    detectedOperations: queryAnalysis.map(q => `${q.operation} (${q.confidence})`),
    topMatch: queryAnalysis[0]?.operation || 'none',
  });

  // Prepare context for LLM
  const tablesContext = {
    a: params.colsA,
    b: params.colsB || null,
    b2: params.colsB2 || null,
  };

  // Base system prompt
  const baseSystemPrompt = `You are a data transformation planner that converts natural language requests into structured JSON pipelines.

CRITICAL RULES:
- Never modify data yourself. Only output valid JSON conforming to the provided schema.
- If any column names are ambiguous or missing, respond with: {"needs_clarification": true, "questions": ["...", "..."]}
- Always use exact column names from the provided datasets.
- Return ONLY a JSON object, no explanations or markdown.
- Use EXACT field names as specified in the DSL syntax examples.

Your task is to analyze the user's natural language request and convert it into a precise pipeline JSON.`;

  // Enhance system prompt with relevant DSL specifications
  const enhancedSystemPrompt = keywordMatcher.generateEnhancedPrompt(
    params.userQuery,
    params.colsA,
    params.sampleA,
    baseSystemPrompt,
  );

  console.log('📝 [DEBUG] Enhanced prompt generated with', queryAnalysis.length, 'operation matches');

  // Provide a 1-based column index map for ordinal references like "third column"/"第三列"
  const indexedCols = params.colsA.map((c, i) => `${i + 1}: ${c}`).join(', ');

  const developerPrompt = `REQUIRED JSON STRUCTURE:
{
  "version": "v1",
  "dataset": "a", 
  "steps": [
    // array of operation objects using EXACT syntax from specifications
  ],
  "meta": {
    "title": "operation title",
    "userQuery": "original user request"
  }
}

CRITICAL NORMALIZE OPERATION FORMAT:
- CORRECT: {"op": "normalize", "dates": [{"col": "OrderDate", "to": "YYYY-MM-DD"}]}
- WRONG: {"op": "normalize", "columns": ["OrderDate"], "to": "YYYY-MM-DD"}
- WRONG: {"op": "normalize", "type": "date", "columns": ["OrderDate"]}
- For normalize operations, ALWAYS use "dates" array with "col" and "to" fields

CRITICAL MERGE OPERATION FORMAT:
- CORRECT: {"op": "merge", "columns": ["FirstName", "LastName"], "into": "FullName", "separator": " "}
- CORRECT: {"op": "merge", "columns": ["Category", "Site"], "newColumn": "Category_Site", "separator": "_"}
- WRONG: {"op": "merge", "columns": ["FirstName", "LastName"]} (missing target column name)
- Always provide a meaningful target column name that describes the merged content
- Use underscores or descriptive names like "Category_Site", "Full_Name", "Combined_Data"

 ORDINAL COLUMN REFERENCES:
 - Users may refer to columns by position (e.g., "first column", "3rd column", "第三列").
 - Resolve ordinals using this 1-based map and output exact column names:
   Column Index Map: ${indexedCols}
 - Examples:
   • "third column" -> the 3rd column name in the map
   • "第3列"/"第三列" -> the 3rd column name in the map

 CRITICAL DEDUPE RULES:
 - Default behavior: if user asks to remove duplicates for a column and does not specify latest/newest, set keep = "earliest" and DO NOT include orderBy.
 - If the user explicitly asks for "latest/newest/最近/最新", set keep = "latest" and include a valid orderBy using an EXISTING column. If no valid sort column is specified or inferable, return needs_clarification.
 - NEVER invent columns (e.g., do not use "UpdatedAt" unless it exists in the dataset).

SUPPORTED OPERATIONS:
- normalize: MUST use "dates": [{"col": "ColumnName", "to": "YYYY-MM-DD"}] OR "money": [{"col": "ColumnName", "keep": "number"}]
- dedupe: Remove duplicates, optionally with aggregation
- split: Split column values by delimiter or regex
- merge: Combine multiple columns into one with optional separator. Always specify a meaningful target column name using "into" or "newColumn" field.
- clean: Trim whitespace, normalize spaces, replace values (NOT for removing OR merging columns)
- join: Left or inner join with another dataset
- diff: Compare two datasets to find differences
- filter: Filter rows based on conditions
- sort: Sort by columns ascending or descending  
- aggregate: Group and aggregate data
- select: Select or exclude specific columns from the dataset

 WHEN TO ASK FOR CLARIFICATION:
 - If an ordinal (e.g., "third column") cannot be resolved to a valid index, ask for clarification.
 - If user requests "latest/newest" but no valid timestamp/sort column is available, ask for clarification.

DATASET COLUMNS:
${JSON.stringify(tablesContext, null, 2)}

Return ONLY a JSON object of type Pipeline. Do not include explanations or markdown.`;

  const userPrompt = `USER REQUEST: "${params.userQuery}"

DATA STRUCTURE:
Dataset A columns: [${params.colsA.join(', ')}]
Column indexes (1-based): ${indexedCols}
${params.sampleA.length > 0
    ? `Sample rows: ${JSON.stringify(params.sampleA.slice(0, 3), null, 2)}`
    : `(No sample data provided - column structure only)`
}

${params.colsB
  ? `Dataset B columns: [${params.colsB.join(', ')}]
${params.sampleB && params.sampleB.length > 0
    ? `Sample rows: ${JSON.stringify(params.sampleB.slice(0, 3), null, 2)}`
    : `(No sample data provided - column structure only)`
}`
  : ''}

CONSTRAINTS:
- Use only existing column names from the datasets above
- For dedupe operations with "latest/newest", specify orderBy with a date column
- For normalize operations: dates use to="YYYY-MM-DD", money use keep="number"
- For join operations, specify exact column mapping in "on" field
- If you're unsure about column names or operations, return needs_clarification
- For simple operations like column selection/removal, column names are sufficient`;

  try {
    // Get OpenRouter API key
    const apiKey = process.env.NEXT_PUBLIC_OPEN_ROUTER_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    console.log('🔑 [DEBUG] API Key check:', {
      hasKey: !!apiKey,
      keyLength: apiKey?.length || 0,
    });

    if (!apiKey) {
      console.error('❌ [DEBUG] No API key found');
      return {
        kind: 'invalid',
        errors: ['OpenRouter API key not configured. Please add NEXT_PUBLIC_OPEN_ROUTER_KEY to your environment variables.'],
      };
    }

    // Call LLM
    console.log('🌐 [DEBUG] Calling OpenRouter API...');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://sheetally.com',
        'X-Title': 'SheetAlly Excel AI Tool',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: enhancedSystemPrompt },
          { role: 'developer', content: developerPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 2000,
        temperature: 0.1, // Low temperature for consistent structured output
        response_format: {
          type: 'json_object',
          schema: {
            type: 'object',
            properties: {
              version: { type: 'string', enum: ['v1'] },
              dataset: { type: 'string', enum: ['a'] },
              steps: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    op: {
                      type: 'string',
                      enum: ['normalize', 'dedupe', 'split', 'merge', 'clean', 'join', 'diff', 'filter', 'sort', 'aggregate', 'select'],
                    },
                  },
                  required: ['op'],
                  oneOf: [
                    {
                      properties: {
                        op: { const: 'normalize' },
                        dates: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              col: { type: 'string' },
                              to: { type: 'string', enum: ['YYYY-MM-DD'] },
                            },
                            required: ['col', 'to'],
                            additionalProperties: false,
                          },
                        },
                        money: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              col: { type: 'string' },
                              keep: { type: 'string', enum: ['number'] },
                            },
                            required: ['col', 'keep'],
                            additionalProperties: false,
                          },
                        },
                      },
                      required: ['op'],
                      additionalProperties: false,
                    },
                    {
                      properties: {
                        op: { const: 'select' },
                        columns: { type: 'array', items: { type: 'string' } },
                        exclude: { type: 'boolean' },
                      },
                      required: ['op', 'columns'],
                      additionalProperties: false,
                    },
                    {
                      properties: {
                        op: { const: 'merge' },
                        columns: { type: 'array', items: { type: 'string' }, minItems: 2 },
                        into: { type: 'string' },
                        newColumn: { type: 'string' },
                        separator: { type: 'string' },
                        keepOriginal: { type: 'boolean' },
                      },
                      required: ['op', 'columns'],
                      additionalProperties: false,
                      anyOf: [
                        { required: ['into'] },
                        { required: ['newColumn'] },
                      ],
                    },
                    {
                      properties: {
                        op: { const: 'dedupe' },
                        by: { type: 'array', items: { type: 'string' }, minItems: 1 },
                        keep: { type: 'string', enum: ['latest', 'earliest'] },
                        orderBy: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              col: { type: 'string' },
                              dir: { type: 'string', enum: ['asc', 'desc'] },
                            },
                            required: ['col', 'dir'],
                            additionalProperties: false,
                          },
                        },
                      },
                      required: ['op', 'by', 'keep'],
                      additionalProperties: false,
                    },
                    {
                      properties: {
                        op: { const: 'filter' },
                        conditions: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              col: { type: 'string' },
                              op: {
                                type: 'string',
                                enum: ['=', '!=', '>', '<', '>=', '<=', 'contains', 'not_contains', 'notContains', 'is_null', 'is_not_null'],
                              },
                              value: {
                                oneOf: [
                                  { type: 'string' },
                                  { type: 'number' },
                                ],
                              },
                            },
                            required: ['col', 'op'],
                            additionalProperties: false,
                          },
                        },
                      },
                      required: ['op', 'conditions'],
                      additionalProperties: false,
                    },
                    {
                      properties: {
                        op: {
                          type: 'string',
                          enum: ['split', 'clean', 'join', 'diff', 'sort', 'aggregate'],
                        },
                      },
                      required: ['op'],
                      additionalProperties: true,
                    },
                  ],
                },
              },
              meta: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  userQuery: { type: 'string' },
                },
              },
            },
            required: ['version', 'dataset', 'steps'],
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return {
        kind: 'invalid',
        errors: [`API error: ${response.status} - ${errorText}`],
      };
    }

    const result = await response.json();
    console.log('📝 [DEBUG] OpenRouter response:', {
      status: response.status,
      hasChoices: !!result.choices,
      choiceCount: result.choices?.length || 0,
      content: `${result.choices?.[0]?.message?.content?.substring(0, 2000)}...`,
    });

    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      return {
        kind: 'invalid',
        errors: ['Empty response from AI'],
      };
    }

    // Parse JSON response
    const json = safeJsonParse(content);
    if (!json) {
      return {
        kind: 'invalid',
        errors: ['Failed to parse AI response as JSON', content],
      };
    }

    // Check for clarification request
    if (json.needs_clarification) {
      return {
        kind: 'clarify',
        questions: json.questions || [],
      };
    }

    // Normalize common AI variations to match our strict schema
    const normalized = normalizeIncomingPipeline(json);
    const hinted = applyOrdinalColumnHints(normalized, params.colsA, params.userQuery);

    // Validate structure with Zod
    const parsed = zPipeline.safeParse(hinted);
    if (!parsed.success) {
      return {
        kind: 'invalid',
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    // Semantic validation
    const semanticErrors = validateSemantics(parsed.data, tablesContext);
    if (semanticErrors.length > 0) {
      return {
        kind: 'invalid',
        errors: semanticErrors,
      };
    }

    return {
      kind: 'ok',
      pipeline: parsed.data,
    };
  } catch (error) {
    console.error('planRecipe error:', error);
    return {
      kind: 'invalid',
      errors: [`Unexpected error: ${error}`],
    };
  }
}
