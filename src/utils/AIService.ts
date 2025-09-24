import type { DataFile, ProcessingStep, Recipe } from '@/components/ToolWorkbench';
import type { ValidationResult } from '@/lib/dsl-validator';
import { dslValidator } from '@/lib/dsl-validator';

export type DataOperation = {
  type: 'DEDUPLICATE' | 'MERGE' | 'FILTER' | 'TRANSFORM' | 'AGGREGATE' | 'SORT' | 'SPLIT' | 'VALIDATE' | 'STANDARDIZE' | 'COLUMN_MERGE' | 'COLUMN_SPLIT' | 'COLUMN_RENAME' | 'COLUMN_DELETE' | 'COLUMN_ADD';
  confidence: number;
  description: string;
  parameters: Record<string, any>;
  targetColumns?: string[];
  conditions?: string[];
};

export type IntentAnalysis = {
  primaryOperation: DataOperation;
  secondaryOperations?: DataOperation[];
  requirements: string[];
  risks: string[];
  estimatedComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedSteps: string[];
  refinedDSL?: any; // The AI-refined DSL recipe
  dslValidation?: ValidationResult; // DSL validation result
};

export class AIService {
  private apiKey: string;
  private baseUrl: string = 'https://openrouter.ai/api/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
    console.log('AIService initialized with API key:', this.apiKey ? 'Present' : 'Missing');
  }

  async analyzeUserIntent(
    userInput: string,
    dataFile: DataFile,
    chatHistory: string[] = [],
  ): Promise<IntentAnalysis> {
    console.log('🤖 Analyzing user intent:', userInput);
    console.log('📊 Data file:', dataFile.name, 'Rows:', dataFile.data.length);

    try {
      if (!this.apiKey) {
        console.warn('⚠️ OpenRouter API key not found, using fallback analysis');
        return this.fallbackAnalysis(userInput, dataFile);
      }

      // First, generate initial DSL recipe to provide context
      const initialRecipe = this.generateInitialRecipe(userInput, dataFile);
      console.log('🔧 Generated initial DSL recipe:', JSON.stringify(initialRecipe, null, 2));

      const systemPrompt = `You are an expert data analyst AI assistant specialized in Excel/CSV data processing with DSL (Domain Specific Language) operations.

CRITICAL: You must respond with VALID JSON only, no other text or explanations.

## Context Information:
**User Request:** "${userInput}"
**Data File:** ${dataFile.name} (${dataFile.data.length} rows, ${dataFile.headers.length} columns)
**Columns:** ${dataFile.headers.join(', ')}
**Sample Data:** ${JSON.stringify(dataFile.data.slice(0, 3))}
**Chat History:** ${chatHistory.slice(-2).join(' | ')}

## DSL Schema Definition:
You must generate DSL that follows this exact schema:

\`\`\`json
{
  "version": "v1",
  "dataset": "a",
  "steps": [
    {
      "op": "normalize|dedupe|split|merge|clean|join|diff|select",
      // Operation-specific parameters
    }
  ],
  "meta": {
    "title": "Operation description",
    "userQuery": "Original user query"
  }
}
\`\`\`

## Available Operations:

### 1. normalize - Data standardization
\`\`\`json
{
  "op": "normalize",
  "dates": [{"col": "column_name"}],
  "money": [{"col": "column_name"}]
}
\`\`\`

### 2. dedupe - Remove duplicates
\`\`\`json
{
  "op": "dedupe",
  "by": ["column1", "column2"],
  "orderBy": [{"col": "date_column", "dir": "desc"}],
  "aggs": {"total_count": {"fn": "count"}}
}
\`\`\`

### 3. split - Split column data
\`\`\`json
{
  "op": "split",
  "column": "source_column",
  "by": " ",
  "into": ["new_col1", "new_col2"],
  "pattern": "regex_pattern"
}
\`\`\`

### 4. merge - Merge columns
\`\`\`json
{
  "op": "merge",
  "columns": ["col1", "col2"],
  "into": "new_column_name",
  "separator": " ",
  "keepOriginal": true
}
\`\`\`

### 5. clean - Data cleaning
\`\`\`json
{
  "op": "clean",
  "trims": ["column1"],
  "normalizeSpace": ["column2"],
  "replace": [{"col": "column", "from": "old", "to": "new"}]
}
\`\`\`

### 6. select - Column selection
\`\`\`json
{
  "op": "select",
  "columns": ["col1", "col2"],
  "exclude": false
}
\`\`\`

## Examples:

**User:** "第一列和第二列合并"
**Columns:** ["Category", "Task", "Priority"]
**Response:**
\`\`\`json
{
  "version": "v1",
  "dataset": "a", 
  "steps": [
    {
      "op": "merge",
      "columns": ["Category", "Task"],
      "into": "Category_Task",
      "separator": " ",
      "keepOriginal": true
    }
  ],
  "meta": {
    "title": "Merge Category and Task columns",
    "userQuery": "第一列和第二列合并"
  }
}
\`\`\`

**User:** "remove duplicates by name"
**Columns:** ["Name", "Email", "Date"]
**Response:**
\`\`\`json
{
  "version": "v1",
  "dataset": "a",
  "steps": [
    {
      "op": "dedupe", 
      "by": ["Name"],
      "orderBy": [{"col": "Date", "dir": "desc"}]
    }
  ],
  "meta": {
    "title": "Remove duplicates by Name",
    "userQuery": "remove duplicates by name"
  }
}
\`\`\`

## Your Task:
Analyze the user request and generate EXACT DSL that matches the schema above. 

**IMPORTANT Rules:**
1. Use EXACT column names from the provided data
2. Always include "version": "v1" and "dataset": "a"
3. Choose the most appropriate operation based on user intent
4. For Chinese queries like "第一列和第二列", map to actual column names
5. For merge operations, always set "keepOriginal": true unless user specifies otherwise
6. For dedupe, use meaningful columns as "by" parameters
7. Include "meta" section with clear title and original query

Return ONLY the DSL JSON, no explanations.`;

      console.log('🔄 Making enhanced API request to OpenRouter with DSL context...');

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://sheetally.com',
          'X-Title': 'SheetAlly Excel AI Tool',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Please analyze this request with the provided DSL context: "${userInput}"` },
          ],
          max_tokens: 2000,
          temperature: 0.05, // Lower temperature for more consistent DSL generation
          top_p: 1,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OpenRouter API error:', response.status, errorText);
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Enhanced OpenRouter API response received');

      const content = result.choices?.[0]?.message?.content;
      if (!content) {
        console.error('❌ Empty response from OpenRouter');
        throw new Error('Empty response from OpenRouter');
      }

      console.log('📝 Enhanced AI response:', content);

      // Parse DSL directly from response
      let dslResult;
      try {
        // Extract JSON from response if wrapped in code blocks
        let jsonContent = content.trim();
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || content.match(/(\{[\s\S]*\})/);
        if (jsonMatch) {
          jsonContent = jsonMatch[1] || jsonMatch[0];
        }

        dslResult = JSON.parse(jsonContent);
        console.log('✅ Successfully parsed DSL from AI:', dslResult);
      } catch (parseError) {
        console.error('❌ Failed to parse DSL response as JSON:', parseError);
        console.error('Raw content:', content);
        throw new Error('Invalid DSL JSON response from AI');
      }

      // 2. 验证DSL结构和语义
      console.log('🔍 Validating DSL schema and semantics...');
      const validationResult = dslValidator.validate(dslResult, dataFile.headers);

      if (!validationResult.isValid) {
        console.error('❌ DSL validation failed:', validationResult.errors);
        // 尝试使用修正后的DSL或回退到规则分析
        if (validationResult.corrected) {
          console.log('🔧 Using auto-corrected DSL');
          dslResult = validationResult.corrected;
        } else {
          throw new Error(`DSL validation failed: ${validationResult.errors.join(', ')}`);
        }
      } else {
        console.log('✅ DSL validation passed');
        if (validationResult.warnings.length > 0) {
          console.warn('⚠️ DSL warnings:', validationResult.warnings);
        }
      }

      // 3. 评估数据风险
      const dataRisks = dslValidator.assessDataRisks(dslResult, dataFile.data.length);
      console.log('🔍 Data risks assessed:', dataRisks);

      // Create IntentAnalysis from DSL result for compatibility
      const intentAnalysis: IntentAnalysis = {
        primaryOperation: {
          type: this.mapDSLOpToOperation(dslResult.steps[0]?.op || 'transform'),
          confidence: validationResult.isValid ? 0.95 : 0.7,
          description: dslResult.meta?.title || 'Process data',
          parameters: dslResult.steps[0] || {},
          targetColumns: this.extractTargetColumns(dslResult.steps[0]),
        },
        requirements: ['DSL validation', 'Data backup'],
        risks: [...dataRisks, ...this.assessDSLRisks(dslResult)],
        estimatedComplexity: this.estimateDSLComplexity(dslResult),
        suggestedSteps: ['Validate DSL', 'Execute operations', 'Verify results'],
        refinedDSL: dslResult,
        dslValidation: validationResult,
      };

      console.log('🎯 Final DSL analysis:', intentAnalysis);
      return intentAnalysis;
    } catch (error) {
      console.error('💥 Enhanced AI analysis failed:', error);
      console.log('🔄 Falling back to intelligent rule-based analysis');
      return this.fallbackAnalysis(userInput, dataFile);
    }
  }

  // Helper methods for DSL processing
  private mapDSLOpToOperation(dslOp: string): DataOperation['type'] {
    const opMapping: Record<string, DataOperation['type']> = {
      normalize: 'STANDARDIZE',
      dedupe: 'DEDUPLICATE',
      split: 'COLUMN_SPLIT',
      merge: 'COLUMN_MERGE',
      clean: 'STANDARDIZE',
      join: 'MERGE',
      diff: 'FILTER',
      select: 'FILTER',
    };

    return opMapping[dslOp] || 'TRANSFORM';
  }

  private extractTargetColumns(step: any): string[] {
    if (!step) {
      return [];
    }

    switch (step.op) {
      case 'merge':
        return step.columns || [];
      case 'split':
        return step.into || [];
      case 'dedupe':
        return step.by || [];
      case 'select':
        return step.columns || [];
      default:
        return [];
    }
  }

  private assessDSLRisks(dsl: any): string[] {
    const risks: string[] = [];

    for (const step of dsl.steps || []) {
      switch (step.op) {
        case 'dedupe':
          risks.push('May remove legitimate duplicate entries');
          break;
        case 'merge':
          if (!step.keepOriginal) {
            risks.push('Original columns will be removed');
          }
          break;
        case 'split':
          risks.push('Data may not split evenly across all rows');
          break;
        case 'select':
          if (step.exclude) {
            risks.push('Selected columns will be permanently removed');
          }
          break;
      }
    }

    return risks.length > 0 ? risks : ['Standard data transformation risks apply'];
  }

  private estimateDSLComplexity(dsl: any): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (!dsl.steps || dsl.steps.length === 0) {
      return 'LOW';
    }

    const complexOperations = ['join', 'diff', 'dedupe'];
    const hasComplexOp = dsl.steps.some((step: any) => complexOperations.includes(step.op));

    if (hasComplexOp || dsl.steps.length > 3) {
      return 'HIGH';
    }
    if (dsl.steps.length > 1) {
      return 'MEDIUM';
    }
    return 'LOW';
  }

  private generateInitialRecipe(userInput: string, dataFile: DataFile): any {
    // Generate an initial DSL recipe to provide context to the AI
    const fallbackAnalysis = this.fallbackAnalysis(userInput, dataFile);

    return {
      operation: `Process ${dataFile.name.replace(/\.(csv|xlsx|xls)$/i, '')}`,
      steps: [
        {
          operation: 'ANALYZE_COLUMNS',
          parameters: {
            sourceColumns: dataFile.headers,
            dataRows: dataFile.data.length,
            sampleData: dataFile.data.slice(0, Math.min(5, dataFile.data.length)),
          },
          description: `Analyze ${dataFile.headers.length} columns in ${dataFile.name}`,
        },
        {
          operation: fallbackAnalysis.primaryOperation.type,
          parameters: fallbackAnalysis.primaryOperation.parameters,
          description: fallbackAnalysis.primaryOperation.description,
        },
        {
          operation: 'VALIDATE_RESULTS',
          parameters: {
            expectedRowCount: dataFile.data.length,
            checkDataIntegrity: true,
          },
          description: 'Validate transformation results',
        },
      ],
      expectedResult: {
        rowsRemoved: fallbackAnalysis.primaryOperation.type === 'DEDUPLICATE' ? Math.floor(dataFile.data.length * 0.1) : 0,
        rowsAdded: fallbackAnalysis.primaryOperation.type === 'MERGE' ? Math.floor(dataFile.data.length * 0.1) : 0,
        columnsModified: fallbackAnalysis.primaryOperation.targetColumns || [],
      },
    };
  }

  private fallbackAnalysis(userInput: string, dataFile: DataFile): IntentAnalysis {
    // Enhanced rule-based fallback when AI API is unavailable
    console.log('🧠 Using intelligent rule-based analysis for:', userInput);

    const lowerInput = userInput.toLowerCase();

    let primaryOperation: DataOperation;
    let confidence = 0.6; // Start with moderate confidence

    // Enhanced column operation detection
    const columnOperation = this.detectColumnOperation(userInput, dataFile);
    if (columnOperation) {
      return columnOperation;
    }

    // Enhanced pattern matching with better confidence scores
    if (this.matchesPattern(lowerInput, ['duplicate', 'unique', 'remove duplicate', 'dedup', 'duplicat', '重复', '去重'])) {
      const keyColumns = this.detectKeyColumns(dataFile);
      const dateColumns = this.detectDateColumns(dataFile);

      confidence = keyColumns.length > 0 ? 0.85 : 0.7;

      primaryOperation = {
        type: 'DEDUPLICATE',
        confidence,
        description: `Remove duplicate records ${keyColumns.length > 0 ? `based on ${keyColumns.join(', ')}` : 'using all columns'}`,
        parameters: {
          method: 'smart_dedup',
          keyColumns,
          keepLatest: this.matchesPattern(lowerInput, ['latest', 'recent', 'newest', 'last', '最新', '最近']),
          keepFirst: this.matchesPattern(lowerInput, ['first', 'earliest', 'oldest', '最早', '第一个']),
          dateColumns,
        },
        targetColumns: keyColumns,
      };
    } else if (this.matchesPattern(lowerInput, ['sort', 'order', 'arrange', 'rank', '排序', '排列', '整理'])) {
      const sortColumns = this.detectSortColumns(userInput, dataFile);
      const isDescending = this.matchesPattern(lowerInput, ['desc', 'descending', 'highest', 'largest', 'biggest', '降序', '从大到小', '从高到低']);

      confidence = sortColumns.length > 0 ? 0.8 : 0.6;

      primaryOperation = {
        type: 'SORT',
        confidence,
        description: `Sort data by ${sortColumns.length > 0 ? sortColumns.join(', ') : 'detected columns'} ${isDescending ? 'descending' : 'ascending'}`,
        parameters: {
          columns: sortColumns,
          order: isDescending ? 'desc' : 'asc',
          handleEmpty: 'last',
        },
        targetColumns: sortColumns,
      };
    } else if (this.matchesPattern(lowerInput, ['filter', 'where', 'only', 'show', 'include', 'exclude', '过滤', '筛选', '只要', '只显示'])) {
      const filterConditions = this.extractAdvancedFilterConditions(userInput, dataFile);
      confidence = filterConditions.length > 0 ? 0.75 : 0.6;

      primaryOperation = {
        type: 'FILTER',
        confidence,
        description: `Filter data ${filterConditions.length > 0 ? `with conditions: ${filterConditions.join(', ')}` : 'based on your criteria'}`,
        parameters: {
          conditions: filterConditions,
          method: 'smart_filter',
          preserveHeaders: true,
        },
        conditions: filterConditions,
      };
    } else if (this.matchesPattern(lowerInput, ['merge', 'join', 'combine', 'match', '合并', '连接', '结合'])) {
      const keyColumns = this.detectKeyColumns(dataFile);
      confidence = 0.7;

      primaryOperation = {
        type: 'MERGE',
        confidence,
        description: `Merge data tables ${keyColumns.length > 0 ? `using ${keyColumns.join(', ')} as key` : 'with intelligent key detection'}`,
        parameters: {
          joinType: this.detectJoinType(userInput),
          keyColumns,
          method: 'smart_merge',
        },
        targetColumns: keyColumns,
      };
    } else if (this.matchesPattern(lowerInput, ['format', 'standard', 'normalize', 'clean', 'fix', '格式化', '标准化', '清理', '修正'])) {
      const targetColumns = this.detectFormatColumns(userInput, dataFile);
      confidence = targetColumns.length > 0 ? 0.8 : 0.65;

      primaryOperation = {
        type: 'STANDARDIZE',
        confidence,
        description: `Standardize ${targetColumns.length > 0 ? targetColumns.join(', ') : 'data format'}`,
        parameters: {
          targetColumns,
          format: this.detectFormatType(userInput),
          strict: false,
        },
        targetColumns,
      };
    } else if (this.matchesPattern(lowerInput, ['group', 'aggregate', 'sum', 'count', 'average', 'total', '分组', '汇总', '求和', '计数', '平均'])) {
      const groupColumns = this.detectGroupColumns(userInput, dataFile);
      confidence = 0.75;

      primaryOperation = {
        type: 'AGGREGATE',
        confidence,
        description: `Group and aggregate data ${groupColumns.length > 0 ? `by ${groupColumns.join(', ')}` : 'with smart grouping'}`,
        parameters: {
          groupBy: groupColumns,
          aggregations: this.detectAggregations(userInput),
          method: 'smart_aggregate',
        },
        targetColumns: groupColumns,
      };
    } else {
      // Smarter default analysis
      const detectedColumns = this.detectMentionedColumns(userInput, dataFile);
      confidence = detectedColumns.length > 0 ? 0.65 : 0.5;

      primaryOperation = {
        type: 'TRANSFORM',
        confidence,
        description: `Apply data transformation${detectedColumns.length > 0 ? ` to ${detectedColumns.join(', ')}` : ' based on your request'}`,
        parameters: {
          method: 'intelligent_transform',
          targetColumns: detectedColumns,
          preserveStructure: true,
        },
        targetColumns: detectedColumns,
      };
    }

    // Generate intelligent requirements and risks
    const requirements = this.generateRequirements(primaryOperation.type, dataFile);
    const risks = this.generateRisks(primaryOperation.type, dataFile);
    const complexity = this.estimateComplexity(primaryOperation, dataFile);
    const steps = this.generateSuggestedSteps(primaryOperation.type);

    console.log('🎯 Rule-based analysis result:', {
      operation: primaryOperation.type,
      confidence: primaryOperation.confidence,
      description: primaryOperation.description,
    });

    return {
      primaryOperation,
      requirements,
      risks,
      estimatedComplexity: complexity,
      suggestedSteps: steps,
    };
  }

  private detectColumnOperation(userInput: string, dataFile: DataFile): IntentAnalysis | null {
    const lowerInput = userInput.toLowerCase();

    // 列合并检测 - 支持中英文
    if (this.matchesPattern(lowerInput, ['merge column', 'combine column', '合并列', '列合并', '第一列和第二列合并', '列A和列B合并'])) {
      const columnReferences = this.extractColumnReferences(userInput, dataFile);
      console.log('🔍 Detected column references:', columnReferences);

      let targetColumns: string[] = [];
      let confidence = 0.9;

      if (columnReferences.length >= 2) {
        targetColumns = columnReferences.slice(0, 2); // Take first two columns
        confidence = 0.95;
      } else {
        // Default to first two columns if not specified
        targetColumns = dataFile.headers.slice(0, 2);
        confidence = 0.8;
      }

      const primaryOperation: DataOperation = {
        type: 'COLUMN_MERGE',
        confidence,
        description: `Merge columns "${targetColumns[0]}" and "${targetColumns[1]}" into a single column`,
        parameters: {
          sourceColumns: targetColumns,
          targetColumnName: `${targetColumns[0]}_${targetColumns[1]}`,
          separator: ' ', // Default separator
          method: 'concatenate',
        },
        targetColumns,
      };

      return {
        primaryOperation,
        requirements: ['Column data validation', 'Preserve original column data'],
        risks: ['Combined column may be too wide', 'Data may lose original structure'],
        estimatedComplexity: 'LOW',
        suggestedSteps: [
          'Identify source columns',
          'Choose merge separator',
          'Create new combined column',
          'Validate merged data',
        ],
      };
    }

    // 列拆分检测
    if (this.matchesPattern(lowerInput, ['split column', 'separate column', '拆分列', '列拆分', '分割列'])) {
      const columnReferences = this.extractColumnReferences(userInput, dataFile);
      const targetColumn = columnReferences.length > 0 ? columnReferences[0] : dataFile.headers[0];

      if (!targetColumn) {
        return null; // No valid column found
      }

      const primaryOperation: DataOperation = {
        type: 'COLUMN_SPLIT',
        confidence: 0.85,
        description: `Split column "${targetColumn}" into multiple columns`,
        parameters: {
          sourceColumn: targetColumn,
          separator: this.detectSeparator(userInput),
          maxSplits: 2,
          method: 'split_by_delimiter',
        },
        targetColumns: [targetColumn],
      };

      return {
        primaryOperation,
        requirements: ['Identify split delimiter', 'Handle variable split counts'],
        risks: ['Data may not split evenly', 'Some rows may have fewer parts'],
        estimatedComplexity: 'MEDIUM',
        suggestedSteps: [
          'Analyze column content',
          'Detect split pattern',
          'Create new columns',
          'Distribute split data',
        ],
      };
    }

    return null; // No specific column operation detected
  }

  private extractColumnReferences(userInput: string, dataFile: DataFile): string[] {
    const references: string[] = [];
    const lowerInput = userInput.toLowerCase();

    // 中文数字列引用：第一列、第二列等
    const chineseNumbers: Record<string, number> = {
      '第一列': 0,
      '第二列': 1,
      '第三列': 2,
      '第四列': 3,
      '第五列': 4,
      '第1列': 0,
      '第2列': 1,
      '第3列': 2,
      '第4列': 3,
      '第5列': 4,
      'column 1': 0,
      'column 2': 1,
      'column 3': 2,
      'column 4': 3,
      'column 5': 4,
      'column a': 0,
      'column b': 1,
      'column c': 2,
      'column d': 3,
      'column e': 4,
      '列a': 0,
      '列b': 1,
      '列c': 2,
      '列d': 3,
      '列e': 4,
    };

    // 检查中文数字列引用
    for (const [pattern, index] of Object.entries(chineseNumbers)) {
      if (lowerInput.includes(pattern)) {
        if (index < dataFile.headers.length) {
          const header = dataFile.headers[index];
          if (header) {
            references.push(header);
          }
        }
      }
    }

    // 检查具体列名引用
    for (const header of dataFile.headers) {
      if (header && lowerInput.includes(header.toLowerCase())) {
        references.push(header);
      }
    }

    // 如果没有找到任何引用，尝试从数字提取
    const numberMatches = userInput.match(/(\d+)/g);
    if (numberMatches && references.length === 0) {
      for (const match of numberMatches) {
        const colIndex = Number.parseInt(match) - 1; // Convert to 0-based index
        if (colIndex >= 0 && colIndex < dataFile.headers.length) {
          const header = dataFile.headers[colIndex];
          if (header) {
            references.push(header);
          }
        }
      }
    }

    console.log('🎯 Extracted column references:', references);
    return references;
  }

  private detectSeparator(userInput: string): string {
    const lowerInput = userInput.toLowerCase();

    if (this.matchesPattern(lowerInput, ['comma', '逗号', ','])) {
      return ',';
    }
    if (this.matchesPattern(lowerInput, ['space', '空格', ' '])) {
      return ' ';
    }
    if (this.matchesPattern(lowerInput, ['semicolon', '分号', ';'])) {
      return ';';
    }
    if (this.matchesPattern(lowerInput, ['tab', '制表符'])) {
      return '\t';
    }

    return ' '; // Default to space
  }

  private matchesPattern(input: string, patterns: string[]): boolean {
    return patterns.some(pattern => input.includes(pattern));
  }

  private detectSortColumns(userInput: string, dataFile: DataFile): string[] {
    const lowerInput = userInput.toLowerCase();
    const mentionedColumns = this.detectMentionedColumns(userInput, dataFile);

    if (mentionedColumns.length > 0) {
      return mentionedColumns;
    }

    // Smart defaults based on common sorting patterns
    if (this.matchesPattern(lowerInput, ['date', 'time'])) {
      return this.detectDateColumns(dataFile);
    }
    if (this.matchesPattern(lowerInput, ['name', 'title', 'customer'])) {
      return dataFile.headers.filter((header: string) =>
        header.toLowerCase().includes('name') || header.toLowerCase().includes('title'),
      );
    }
    if (this.matchesPattern(lowerInput, ['amount', 'price', 'value', 'cost'])) {
      return dataFile.headers.filter((header: string) =>
        ['amount', 'price', 'value', 'cost', 'total'].some(indicator =>
          header.toLowerCase().includes(indicator),
        ),
      );
    }

    return [];
  }

  private extractAdvancedFilterConditions(userInput: string, dataFile: DataFile): string[] {
    const conditions: string[] = [];
    const lowerInput = userInput.toLowerCase();

    // Look for specific column mentions with conditions
    dataFile.headers.forEach((header: string) => {
      const headerLower = header.toLowerCase();
      if (lowerInput.includes(headerLower)) {
        // Try to find conditions related to this column
        const patterns = [
          new RegExp(`${headerLower}\\s*(=|equals?)\\s*([^\\s]+)`, 'i'),
          new RegExp(`${headerLower}\\s*(>|greater than)\\s*([^\\s]+)`, 'i'),
          new RegExp(`${headerLower}\\s*(<|less than)\\s*([^\\s]+)`, 'i'),
          new RegExp(`${headerLower}\\s*(contains?)\\s*([^\\s]+)`, 'i'),
        ];

        patterns.forEach((pattern) => {
          const match = userInput.match(pattern);
          if (match) {
            conditions.push(`${header} ${match[1]} ${match[2]}`);
          }
        });
      }
    });

    // Common filter patterns
    if (this.matchesPattern(lowerInput, ['empty', 'blank', 'null'])) {
      conditions.push('Remove empty rows');
    }
    if (this.matchesPattern(lowerInput, ['active', 'enabled', 'valid'])) {
      conditions.push('Show only active records');
    }
    if (this.matchesPattern(lowerInput, ['recent', 'latest', '2024', 'this year'])) {
      conditions.push('Filter recent data');
    }

    return conditions;
  }

  private detectMentionedColumns(userInput: string, dataFile: DataFile): string[] {
    const lowerInput = userInput.toLowerCase();
    return dataFile.headers.filter((header: string) =>
      lowerInput.includes(header.toLowerCase())
      || header.toLowerCase().split(/\s+/).some(word => lowerInput.includes(word)),
    );
  }

  private detectJoinType(userInput: string): string {
    const lowerInput = userInput.toLowerCase();
    if (this.matchesPattern(lowerInput, ['inner', 'match', 'both'])) {
      return 'inner';
    }
    if (this.matchesPattern(lowerInput, ['left', 'all from first', 'keep all'])) {
      return 'left';
    }
    if (this.matchesPattern(lowerInput, ['outer', 'full', 'everything'])) {
      return 'outer';
    }
    return 'inner'; // default
  }

  private detectFormatColumns(userInput: string, dataFile: DataFile): string[] {
    const mentioned = this.detectMentionedColumns(userInput, dataFile);
    if (mentioned.length > 0) {
      return mentioned;
    }

    const lowerInput = userInput.toLowerCase();
    if (this.matchesPattern(lowerInput, ['date', 'time'])) {
      return this.detectDateColumns(dataFile);
    }
    if (this.matchesPattern(lowerInput, ['phone', 'number'])) {
      return dataFile.headers.filter((header: string) =>
        header.toLowerCase().includes('phone') || header.toLowerCase().includes('number'),
      );
    }

    return [];
  }

  private detectFormatType(userInput: string): string {
    const lowerInput = userInput.toLowerCase();
    if (this.matchesPattern(lowerInput, ['yyyy-mm-dd', 'iso', 'standard date'])) {
      return 'date_iso';
    }
    if (this.matchesPattern(lowerInput, ['mm/dd/yyyy', 'us date'])) {
      return 'date_us';
    }
    if (this.matchesPattern(lowerInput, ['uppercase', 'upper'])) {
      return 'uppercase';
    }
    if (this.matchesPattern(lowerInput, ['lowercase', 'lower'])) {
      return 'lowercase';
    }
    if (this.matchesPattern(lowerInput, ['title case', 'proper'])) {
      return 'titlecase';
    }
    return 'auto_detect';
  }

  private detectGroupColumns(userInput: string, dataFile: DataFile): string[] {
    const mentioned = this.detectMentionedColumns(userInput, dataFile);
    if (mentioned.length > 0) {
      return mentioned;
    }

    // Common grouping columns
    return dataFile.headers.filter((header: string) =>
      ['category', 'type', 'status', 'department', 'region', 'group'].some(indicator =>
        header.toLowerCase().includes(indicator),
      ),
    );
  }

  private detectAggregations(userInput: string): string[] {
    const lowerInput = userInput.toLowerCase();
    const aggregations: string[] = [];

    if (this.matchesPattern(lowerInput, ['sum', 'total'])) {
      aggregations.push('sum');
    }
    if (this.matchesPattern(lowerInput, ['count', 'number of'])) {
      aggregations.push('count');
    }
    if (this.matchesPattern(lowerInput, ['average', 'avg', 'mean'])) {
      aggregations.push('avg');
    }
    if (this.matchesPattern(lowerInput, ['max', 'maximum', 'highest'])) {
      aggregations.push('max');
    }
    if (this.matchesPattern(lowerInput, ['min', 'minimum', 'lowest'])) {
      aggregations.push('min');
    }

    return aggregations.length > 0 ? aggregations : ['count'];
  }

  private generateRequirements(operationType: string, _dataFile: DataFile): string[] {
    const requirements = ['Data integrity validation'];

    switch (operationType) {
      case 'DEDUPLICATE':
        requirements.push('Backup original data', 'Key column identification');
        break;
      case 'MERGE':
        requirements.push('Common key columns', 'Data type compatibility');
        break;
      case 'FILTER':
        requirements.push('Clear filter criteria', 'Preserve original structure');
        break;
      case 'SORT':
        requirements.push('Handle missing values', 'Maintain row relationships');
        break;
      case 'STANDARDIZE':
        requirements.push('Format validation', 'Handle edge cases');
        break;
    }

    return requirements;
  }

  private generateRisks(operationType: string, dataFile: DataFile): string[] {
    const risks: string[] = [];

    switch (operationType) {
      case 'DEDUPLICATE':
        risks.push('Potential data loss from duplicate removal');
        if (dataFile.data.length > 1000) {
          risks.push('Large dataset processing time');
        }
        break;
      case 'FILTER':
        risks.push('May significantly reduce dataset size');
        break;
      case 'MERGE':
        risks.push('Unmatched records may be lost');
        break;
      case 'STANDARDIZE':
        risks.push('Format conversion may alter data meaning');
        break;
      default:
        risks.push('Data transformation may have unexpected results');
    }

    return risks;
  }

  private estimateComplexity(operation: DataOperation, dataFile: DataFile): 'LOW' | 'MEDIUM' | 'HIGH' {
    const rowCount = dataFile.data.length;
    const columnCount = dataFile.headers.length;

    if (rowCount > 5000 || columnCount > 20) {
      return 'HIGH';
    }
    if (rowCount > 1000 || columnCount > 10) {
      return 'MEDIUM';
    }
    if (operation.type === 'MERGE' || operation.type === 'AGGREGATE') {
      return 'MEDIUM';
    }
    return 'LOW';
  }

  private generateSuggestedSteps(operationType: string): string[] {
    const baseSteps = ['Analyze data structure', 'Validate operation parameters'];

    switch (operationType) {
      case 'DEDUPLICATE':
        return [...baseSteps, 'Identify duplicate records', 'Apply deduplication rules', 'Verify results'];
      case 'SORT':
        return [...baseSteps, 'Identify sort columns', 'Apply sorting algorithm', 'Maintain data integrity'];
      case 'FILTER':
        return [...baseSteps, 'Parse filter conditions', 'Apply filters', 'Review filtered results'];
      case 'MERGE':
        return [...baseSteps, 'Identify key columns', 'Perform data merge', 'Handle unmatched records'];
      case 'STANDARDIZE':
        return [...baseSteps, 'Detect current formats', 'Apply standardization', 'Validate conversions'];
      case 'COLUMN_MERGE':
        return [...baseSteps, 'Select source columns', 'Choose separator', 'Create merged column', 'Validate results'];
      case 'COLUMN_SPLIT':
        return [...baseSteps, 'Analyze column content', 'Detect split pattern', 'Create new columns', 'Distribute data'];
      case 'COLUMN_RENAME':
        return [...baseSteps, 'Identify target columns', 'Validate new names', 'Apply renaming', 'Update references'];
      case 'COLUMN_DELETE':
        return [...baseSteps, 'Confirm column selection', 'Backup data', 'Remove columns', 'Verify structure'];
      case 'COLUMN_ADD':
        return [...baseSteps, 'Define new column', 'Set default values', 'Insert column', 'Validate data types'];
      default:
        return [...baseSteps, 'Apply transformation', 'Validate results'];
    }
  }

  private detectKeyColumns(dataFile: DataFile): string[] {
    const keyIndicators = ['id', 'key', 'customer', 'user', 'email', 'name'];
    return dataFile.headers.filter((header: string) =>
      keyIndicators.some(indicator =>
        header.toLowerCase().includes(indicator),
      ),
    );
  }

  private detectDateColumns(dataFile: DataFile): string[] {
    const dateIndicators = ['date', 'time', 'created', 'updated', 'modified'];
    return dataFile.headers.filter((header: string) =>
      dateIndicators.some(indicator =>
        header.toLowerCase().includes(indicator),
      ),
    );
  }

  generateRecipe(analysis: IntentAnalysis, dataFile: DataFile, userIntent: string): Recipe {
    const steps: Array<{
      operation: string;
      parameters: Record<string, any>;
      description: string;
    }> = [];

    // Always start with data analysis
    steps.push({
      operation: 'ANALYZE_COLUMNS',
      parameters: {
        sourceColumns: dataFile.headers,
        dataRows: dataFile.data.length,
        sampleData: dataFile.data.slice(0, 5),
      },
      description: `Analyze ${dataFile.headers.length} columns in ${dataFile.name}`,
    });

    // Add primary operation
    steps.push({
      operation: analysis.primaryOperation.type,
      parameters: analysis.primaryOperation.parameters,
      description: analysis.primaryOperation.description,
    });

    // Add secondary operations if any
    if (analysis.secondaryOperations) {
      analysis.secondaryOperations.forEach((op) => {
        steps.push({
          operation: op.type,
          parameters: op.parameters,
          description: op.description,
        });
      });
    }

    // Always end with validation
    steps.push({
      operation: 'VALIDATE_RESULTS',
      parameters: {
        expectedRowCount: dataFile.data.length,
        checkDataIntegrity: true,
      },
      description: 'Validate transformation results',
    });

    return {
      id: Date.now().toString(),
      name: `Process ${dataFile.name.split('.')[0]}`,
      description: analysis.primaryOperation.description,
      userIntent,
      steps: steps as any, // Legacy code - cast to bypass type checking
      createdAt: new Date(),
    } as any; // Legacy code - cast entire return type
  }

  generateProcessingSteps(): ProcessingStep[] {
    return [
      {
        id: '1',
        title: 'Parse Command',
        description: 'Understanding your request using AI...',
        status: 'completed',
      },
      {
        id: '2',
        title: 'Analyze Data Structure',
        description: 'Examining your data columns and types...',
        status: 'processing',
      },
      {
        id: '3',
        title: 'Generate Recipe',
        description: 'Creating optimal processing steps...',
        status: 'pending',
      },
    ];
  }

  generateAIResponse(analysis: IntentAnalysis, dataFile: DataFile): string {
    const operation = analysis.primaryOperation;
    const confidence = Math.round(operation.confidence * 100);

    const baseResponse = `🤖 I understand you want to **${operation.description}** (${confidence}% confidence).`;

    let specificResponse = '';

    switch (operation.type) {
      case 'DEDUPLICATE':
        const keyColumns = operation.parameters.keyColumns || [];
        specificResponse = `

📋 **Deduplication Strategy:**
1. Identify duplicates using: ${keyColumns.length > 0 ? keyColumns.join(', ') : 'all columns'}
2. ${operation.parameters.keepLatest ? 'Keep most recent entries' : 'Keep first occurrence'}
3. Remove duplicate records
4. Maintain data integrity

🎯 **Key Detection:** ${keyColumns.length > 0 ? `Found ID columns: ${keyColumns.join(', ')}` : 'Using smart column detection'}`;
        break;

      case 'FILTER':
        specificResponse = `

📋 **Filtering Strategy:**
1. Apply conditions: ${operation.conditions?.join(', ') || 'Based on your criteria'}
2. Validate filter logic
3. Remove non-matching rows
4. Preserve data structure`;
        break;

      case 'SORT':
        specificResponse = `

📋 **Sorting Strategy:**
1. Sort by: ${operation.parameters.columns?.join(', ') || 'detected columns'}
2. Order: ${operation.parameters.order || 'ascending'}
3. Handle missing values
4. Maintain relationships`;
        break;

      case 'STANDARDIZE':
        specificResponse = `

📋 **Standardization Strategy:**
1. Target columns: ${operation.targetColumns?.join(', ') || 'auto-detected'}
2. Apply consistent formatting
3. Validate data integrity
4. Handle edge cases`;
        break;

      default:
        specificResponse = `

📋 **Processing Strategy:**
1. ${analysis.suggestedSteps.join('\n2. ')}`;
    }

    const complexityWarning = analysis.estimatedComplexity === 'HIGH'
      ? '\n⚠️  **High Complexity Operation** - Please review carefully before proceeding.'
      : '';

    const risksWarning = analysis.risks.length > 0
      ? `\n🔍 **Potential Risks:** ${analysis.risks.join(', ')}`
      : '';

    return `${baseResponse}${specificResponse}

📊 **Expected Result:** Processing ${dataFile.data.length} rows from "${dataFile.name}"

🔍 **Recipe Details:** Click "Show Recipe" to see the detailed DSL configuration.${complexityWarning}${risksWarning}

Would you like me to generate a preview of the changes?`;
  }
}

export const aiService = new AIService();
