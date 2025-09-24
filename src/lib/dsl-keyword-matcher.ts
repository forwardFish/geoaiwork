import type { DSLSpec } from './dsl-specification';
import { DSL_SPECIFICATION } from './dsl-specification';

/**
 * DSL Keyword Matcher
 * Analyzes user queries and returns relevant DSL specifications for prompt enhancement
 */

export type MatchResult = {
  operation: string;
  confidence: number;
  relevantSpecs: any[];
  suggestedSyntax: any;
  examples: any[];
  keywords: string[];
};

export class DSLKeywordMatcher {
  private specs: DSLSpec;

  constructor() {
    this.specs = DSL_SPECIFICATION;
  }

  /**
   * Analyze user query and return relevant DSL specifications
   */
  analyzeQuery(userQuery: string, dataColumns: string[] = []): MatchResult[] {
    const query = userQuery.toLowerCase();
    const results: MatchResult[] = [];

    // Score each operation based on keyword matches
    for (const [operationName, spec] of Object.entries(this.specs)) {
      const score = this.calculateScore(query, spec, dataColumns);

      if (score > 0) {
        results.push({
          operation: operationName,
          confidence: score,
          relevantSpecs: [spec],
          suggestedSyntax: spec.syntax,
          examples: spec.examples,
          keywords: spec.keywords.filter(k => query.includes(k.toLowerCase())),
        });
      }
    }

    // Sort by confidence score (highest first)
    return results.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Calculate relevance score for an operation
   */
  private calculateScore(query: string, spec: any, dataColumns: string[]): number {
    let score = 0;

    // 1. Direct keyword matches (high weight)
    const directMatches = spec.keywords.filter((keyword: string) =>
      query.includes(keyword.toLowerCase()),
    );
    score += directMatches.length * 10;

    // 2. Column name mentions (medium weight)
    const columnMatches = dataColumns.filter(col =>
      query.includes(col.toLowerCase()),
    );
    score += columnMatches.length * 5;

    // 3. Context clues (low weight)
    score += this.getContextScore(query, spec.operation);

    return score;
  }

  /**
   * Get context-based score for operation type
   */
  private getContextScore(query: string, operation: string): number {
    const contextPatterns = {
      normalize: /\b(format|standard|convert|fix|yyyy-mm-dd|date.*format)\b/i,
      dedupe: /\b(duplicate|unique|latest|recent|remove.*duplicate)\b/i,
      split: /\b(split|separate|first.*name|last.*name|divide)\b/i,
      merge: /\b(combine|merge|join.*column|concat|unite)\b/i,
      sort: /\b(sort|order|arrange|chronological|alphabetical)\b/i,
      select: /\b(column|field|select|choose|only|specific)\b/i,
      filter: /\b(where|condition|only.*show|criteria|exclude)\b/i,
      clean: /\b(clean|trim|space|replace|case|text)\b/i,
      aggregate: /\b(group|sum|total|count|average|summarize)\b/i,
      join: /\b(join|merge.*with|combine.*with|lookup|relate)\b/i,
      diff: /\b(compare|difference|changes|delta|version)\b/i,
    };

    const pattern = contextPatterns[operation as keyof typeof contextPatterns];
    return pattern && pattern.test(query) ? 3 : 0;
  }

  /**
   * Generate enhanced prompt with relevant DSL specifications
   */
  generateEnhancedPrompt(
    userQuery: string,
    dataColumns: string[],
    _sampleData: any[] = [],
    basePrompt: string,
  ): string {
    const matches = this.analyzeQuery(userQuery, dataColumns);

    if (matches.length === 0) {
      return basePrompt;
    }

    // Take top 2 most relevant operations
    const topMatches = matches.slice(0, 2);

    let enhancedPrompt = `${basePrompt}\n\n`;
    enhancedPrompt += '## RELEVANT DSL SPECIFICATIONS:\n\n';

    topMatches.forEach((match, index) => {
      enhancedPrompt += `### ${index + 1}. ${match.operation.toUpperCase()} Operation\n`;
      enhancedPrompt += `**Exact Syntax:**\n`;
      enhancedPrompt += '```json\n';
      enhancedPrompt += JSON.stringify(match.suggestedSyntax, null, 2);
      enhancedPrompt += '\n```\n\n';

      enhancedPrompt += `**Examples:**\n`;
      match.examples.slice(0, 2).forEach((example, i) => {
        enhancedPrompt += `Example ${i + 1}:\n`;
        enhancedPrompt += '```json\n';
        enhancedPrompt += JSON.stringify(example, null, 2);
        enhancedPrompt += '\n```\n\n';
      });

      enhancedPrompt += `**Matched Keywords:** ${match.keywords.join(', ')}\n\n`;
    });

    enhancedPrompt += '## IMPORTANT RULES:\n';
    enhancedPrompt += '- Use EXACT field names as shown in syntax above\n';
    enhancedPrompt += '- Follow the JSON structure precisely\n';
    enhancedPrompt += '- Match column names exactly from the provided data\n\n';

    return enhancedPrompt;
  }

  /**
   * Get specific operation specification
   */
  getOperationSpec(operation: string): any {
    return this.specs[operation] || null;
  }

  /**
   * Validate if query matches expected patterns
   */
  validateQuery(userQuery: string): {
    isValid: boolean;
    suggestions: string[];
    detectedOperations: string[];
  } {
    const matches = this.analyzeQuery(userQuery);

    const detectedOperations = matches
      .filter(m => m.confidence > 5)
      .map(m => m.operation);

    const suggestions: string[] = [];

    // Provide suggestions for low-confidence queries
    if (matches.length === 0 || (matches[0] && matches[0].confidence < 10)) {
      suggestions.push('Try being more specific about the operation you want to perform');
      suggestions.push('Include column names that exist in your data');
      suggestions.push('Use clear action words like: sort, filter, merge, split, remove duplicates');
    }

    return {
      isValid: matches.length > 0 && (matches[0]?.confidence ?? 0) >= 5,
      suggestions,
      detectedOperations,
    };
  }
}

export default DSLKeywordMatcher;
