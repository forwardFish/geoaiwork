/**
 * 数据模式自动检测工具
 * 自动识别数据类型、格式和模式
 */

export type ColumnPattern = {
  column: string;
  dataType: 'number' | 'date' | 'currency' | 'email' | 'phone' | 'text' | 'mixed';
  format?: string;
  nullCount: number;
  uniqueCount: number;
  samples: any[];
  confidence: number;
};

export class DataPatternDetector {
  /**
   * 检测所有列的数据模式
   */
  detectPatterns(data: any[][], headers: string[]): ColumnPattern[] {
    const patterns: ColumnPattern[] = [];

    for (let colIndex = 0; colIndex < headers.length; colIndex++) {
      const columnName = headers[colIndex];
      const columnData = data.map(row => row[colIndex]).filter(val => val != null && val !== '');

      patterns.push(this.detectColumnPattern(columnName || `Column_${colIndex}`, columnData));
    }

    return patterns;
  }

  /**
   * 检测单列的数据模式
   */
  private detectColumnPattern(columnName: string, data: any[]): ColumnPattern {
    const totalCount = data.length;
    const uniqueValues = new Set(data);
    const uniqueCount = uniqueValues.size;
    const samples = Array.from(uniqueValues).slice(0, 5);

    // 统计各种类型的匹配数
    let dateCount = 0;
    let numberCount = 0;
    let currencyCount = 0;
    let emailCount = 0;
    let phoneCount = 0;

    for (const value of data) {
      const strValue = String(value).trim();

      // 检测货币
      if (this.isCurrency(strValue)) {
        currencyCount++;
      }
      // 检测日期
      else if (this.isDate(strValue)) {
        dateCount++;
      }
      // 检测数字
      else if (this.isNumber(strValue)) {
        numberCount++;
      }
      // 检测邮箱
      else if (this.isEmail(strValue)) {
        emailCount++;
      }
      // 检测电话
      else if (this.isPhone(strValue)) {
        phoneCount++;
      }
    }

    // 判断主要类型（超过80%认为是该类型）
    const threshold = totalCount * 0.8;
    let dataType: ColumnPattern['dataType'] = 'text';
    let confidence = 0;
    let format: string | undefined;

    if (currencyCount > threshold) {
      dataType = 'currency';
      confidence = currencyCount / totalCount;
      format = this.detectCurrencyFormat(data);
    } else if (dateCount > threshold) {
      dataType = 'date';
      confidence = dateCount / totalCount;
      format = this.detectDateFormat(data);
    } else if (numberCount > threshold) {
      dataType = 'number';
      confidence = numberCount / totalCount;
    } else if (emailCount > threshold) {
      dataType = 'email';
      confidence = emailCount / totalCount;
    } else if (phoneCount > threshold) {
      dataType = 'phone';
      confidence = phoneCount / totalCount;
    } else if ((dateCount + numberCount + currencyCount) > threshold) {
      dataType = 'mixed';
      confidence = 0.5;
    } else {
      dataType = 'text';
      confidence = 1 - (dateCount + numberCount + currencyCount + emailCount + phoneCount) / totalCount;
    }

    return {
      column: columnName,
      dataType,
      format,
      nullCount: totalCount - data.length,
      uniqueCount,
      samples,
      confidence,
    };
  }

  /**
   * 检测是否为货币格式
   */
  private isCurrency(value: string): boolean {
    // 货币符号模式
    const currencyPatterns = [
      /^[$£¥€]/, // 开头是货币符号
      /[$£¥€]$/, // 结尾是货币符号
      /^(USD|GBP|CNY|EUR|JPY)\s*[\d,]+/, // 货币代码
      /^[\d,]+\.\d{2}$/, // 标准金额格式
    ];

    return currencyPatterns.some(pattern => pattern.test(value));
  }

  /**
   * 检测是否为日期格式
   */
  private isDate(value: string): boolean {
    // 常见日期格式
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}/, // MM/DD/YYYY
      /^\d{2}-\d{2}-\d{4}/, // DD-MM-YYYY
      /^\w{3}\s+\d{1,2},\s+\d{4}/, // Jan 1, 2024
      /^\d{10,13}$/, // Unix timestamp
    ];

    if (datePatterns.some(pattern => pattern.test(value))) {
      return true;
    }

    // 尝试解析为日期
    const date = new Date(value);
    return !isNaN(date.getTime()) && date.getFullYear() > 1900 && date.getFullYear() < 2100;
  }

  /**
   * 检测是否为数字
   */
  private isNumber(value: string): boolean {
    // 移除逗号后检查
    const cleanValue = value.replace(/,/g, '');
    return !isNaN(Number(cleanValue)) && cleanValue !== '';
  }

  /**
   * 检测是否为邮箱
   */
  private isEmail(value: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
    return emailPattern.test(value);
  }

  /**
   * 检测是否为电话号码
   */
  private isPhone(value: string): boolean {
    // 移除常见分隔符
    const cleanValue = value.replace(/[\s\-().]/g, '');
    // 检查是否为10-15位数字
    return /^\+?\d{10,15}$/.test(cleanValue);
  }

  /**
   * 检测货币格式
   */
  private detectCurrencyFormat(data: any[]): string {
    const symbols = new Map<string, number>();

    for (const value of data.slice(0, 100)) { // 采样前100个
      const strValue = String(value);
      if (strValue.includes('$')) {
        symbols.set('USD', (symbols.get('USD') || 0) + 1);
      }
      if (strValue.includes('£')) {
        symbols.set('GBP', (symbols.get('GBP') || 0) + 1);
      }
      if (strValue.includes('¥')) {
        symbols.set('CNY', (symbols.get('CNY') || 0) + 1);
      }
      if (strValue.includes('€')) {
        symbols.set('EUR', (symbols.get('EUR') || 0) + 1);
      }
    }

    // 返回最常见的货币
    let maxCount = 0;
    let mostCommon = 'USD';
    for (const [symbol, count] of symbols) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = symbol;
      }
    }

    return mostCommon;
  }

  /**
   * 检测日期格式
   */
  private detectDateFormat(data: any[]): string {
    const formats = new Map<string, number>();

    for (const value of data.slice(0, 100)) { // 采样前100个
      const strValue = String(value);

      if (/^\d{4}-\d{2}-\d{2}/.test(strValue)) {
        formats.set('YYYY-MM-DD', (formats.get('YYYY-MM-DD') || 0) + 1);
      } else if (/^\d{2}\/\d{2}\/\d{4}/.test(strValue)) {
        formats.set('MM/DD/YYYY', (formats.get('MM/DD/YYYY') || 0) + 1);
      } else if (/^\d{2}-\d{2}-\d{4}/.test(strValue)) {
        formats.set('DD-MM-YYYY', (formats.get('DD-MM-YYYY') || 0) + 1);
      } else if (/^\d{10,13}$/.test(strValue)) {
        formats.set('TIMESTAMP', (formats.get('TIMESTAMP') || 0) + 1);
      }
    }

    // 返回最常见的格式
    let maxCount = 0;
    let mostCommon = 'YYYY-MM-DD';
    for (const [format, count] of formats) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = format;
      }
    }

    return mostCommon;
  }

  /**
   * 基于检测结果生成操作建议
   */
  generateSuggestions(patterns: ColumnPattern[]): string[] {
    const suggestions: string[] = [];

    // 检查日期列
    const dateColumns = patterns.filter(p => p.dataType === 'date');
    if (dateColumns.length > 0) {
      const differentFormats = new Set(dateColumns.map(c => c.format));
      if (differentFormats.size > 1) {
        suggestions.push(`Standardize date formats in columns: ${dateColumns.map(c => c.column).join(', ')}`);
      }
    }

    // 检查货币列
    const currencyColumns = patterns.filter(p => p.dataType === 'currency');
    if (currencyColumns.length > 0) {
      const differentCurrencies = new Set(currencyColumns.map(c => c.format));
      if (differentCurrencies.size > 1) {
        suggestions.push(`Convert all amounts to the same currency in: ${currencyColumns.map(c => c.column).join(', ')}`);
      }
    }

    // 检查重复数据
    for (const pattern of patterns) {
      const duplicateRatio = 1 - (pattern.uniqueCount / (pattern.uniqueCount + pattern.nullCount));
      if (duplicateRatio > 0.3 && pattern.dataType !== 'text') {
        suggestions.push(`High duplicate rate (${(duplicateRatio * 100).toFixed(1)}%) in column "${pattern.column}"`);
      }
    }

    // 检查混合类型
    const mixedColumns = patterns.filter(p => p.dataType === 'mixed' || p.confidence < 0.8);
    if (mixedColumns.length > 0) {
      suggestions.push(`Clean mixed data types in: ${mixedColumns.map(c => c.column).join(', ')}`);
    }

    return suggestions;
  }
}
