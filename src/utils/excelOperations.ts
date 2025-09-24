/**
 * Excel/CSV 数据处理操作提示词配置
 * 从高级Excel专家角度设计的完整操作分类体系
 */

export type OperationCategory = {
  name: string;
  operations: string[];
  complexity: 'simple' | 'medium' | 'complex';
  description: string;
};

export const EXCEL_OPERATIONS: Record<string, OperationCategory> = {
  // 基础数据清理操作
  'data-cleaning': {
    name: '数据清理',
    complexity: 'medium',
    description: '去除空白、标准化格式、修正数据质量问题',
    operations: [
      // 空值处理
      'remove empty',
      'delete blank',
      'fill empty',
      'replace null',
      'handle missing',
      '删除空行',
      '删除空值',
      '填充空白',
      '处理缺失值',
      '移除空白',

      // 去重操作
      'dedupe',
      'remove duplicate',
      'unique records',
      'distinct values',
      '去重',
      '删除重复',
      '去除重复项',
      '唯一值',
      '不重复记录',

      // 格式清理
      'clean text',
      'trim spaces',
      'remove extra spaces',
      'standardize format',
      '清理文本',
      '删除空格',
      '去除多余空格',
      '标准化格式',
      '文本清理',

      // 大小写转换
      'uppercase',
      'lowercase',
      'proper case',
      'title case',
      'sentence case',
      '转大写',
      '转小写',
      '首字母大写',
      '标题格式',
      '句子格式',
    ],
  },

  // 数据转换操作
  'data-transformation': {
    name: '数据转换',
    complexity: 'medium',
    description: '改变数据结构、格式或表示方式',
    operations: [
      // 列操作
      'merge columns',
      'combine columns',
      'concatenate',
      'join fields',
      '合并列',
      '连接列',
      '列合并',
      '字段合并',
      '拼接列',

      'split column',
      'separate column',
      'divide column',
      'parse column',
      '拆分列',
      '分割列',
      '列拆分',
      '分离列',
      '解析列',

      // 数据类型转换
      'convert to number',
      'convert to date',
      'convert to text',
      'change data type',
      '转为数字',
      '转为日期',
      '转为文本',
      '数据类型转换',
      '格式转换',

      // 单位转换
      'convert units',
      'currency conversion',
      'measurement conversion',
      '单位转换',
      '货币转换',
      '度量转换',
      '换算单位',
    ],
  },

  // 数据筛选与排序
  'filtering-sorting': {
    name: '筛选排序',
    complexity: 'simple',
    description: '根据条件筛选数据或重新排序',
    operations: [
      // 筛选操作
      'filter',
      'where',
      'select where',
      'conditional filter',
      'advanced filter',
      '筛选',
      '过滤',
      '条件筛选',
      '高级筛选',
      '筛选条件',

      // 排序操作
      'sort',
      'order by',
      'arrange',
      'rank',
      'sort ascending',
      'sort descending',
      '排序',
      '排列',
      '升序',
      '降序',
      '按...排序',
      '排名',

      // 范围选择
      'top records',
      'bottom records',
      'first rows',
      'last rows',
      'sample data',
      '前几行',
      '后几行',
      '最大值',
      '最小值',
      '抽样数据',
      '随机选择',
    ],
  },

  // 列管理操作
  'column-management': {
    name: '列管理',
    complexity: 'simple',
    description: '添加、删除、重命名或重新排列列',
    operations: [
      // 列选择
      'select columns',
      'keep columns',
      'choose columns',
      'pick columns',
      '选择列',
      '保留列',
      '选取列',
      '挑选列',

      // 列删除
      'delete columns',
      'remove columns',
      'drop columns',
      'exclude columns',
      '删除列',
      '移除列',
      '去掉列',
      '排除列',

      // 列重命名
      'rename columns',
      'change column names',
      'update headers',
      '重命名列',
      '修改列名',
      '更新标题',
      '改列名',

      // 列重排
      'reorder columns',
      'move columns',
      'rearrange columns',
      'reorganize columns',
      '重排列',
      '移动列',
      '调整列顺序',
      '重新排列',
    ],
  },

  // 数学计算操作
  'calculations': {
    name: '计算统计',
    complexity: 'medium',
    description: '执行数学计算、统计分析',
    operations: [
      // 基础计算
      'sum',
      'total',
      'add',
      'calculate sum',
      'sum up',
      '求和',
      '总计',
      '合计',
      '加总',
      '汇总',

      'average',
      'mean',
      'avg',
      'calculate average',
      '平均值',
      '平均数',
      '均值',
      '求平均',

      'count',
      'count records',
      'number of records',
      '计数',
      '统计个数',
      '记录数',
      '计算数量',

      // 统计函数
      'min',
      'max',
      'minimum',
      'maximum',
      'range',
      '最小值',
      '最大值',
      '最小',
      '最大',
      '范围',

      'median',
      'mode',
      'standard deviation',
      'variance',
      '中位数',
      '众数',
      '标准差',
      '方差',

      // 百分比和比率
      'percentage',
      'percent',
      'ratio',
      'proportion',
      '百分比',
      '比例',
      '占比',
      '比率',
    ],
  },

  // 日期时间操作
  'date-time': {
    name: '日期时间',
    complexity: 'medium',
    description: '处理日期时间数据的格式化和计算',
    operations: [
      // 日期格式化
      'format date',
      'standardize date',
      'date format',
      'parse date',
      '日期格式化',
      '标准化日期',
      '日期解析',
      '格式化日期',

      // 日期计算
      'date difference',
      'age calculation',
      'days between',
      'date arithmetic',
      '日期差',
      '计算年龄',
      '日期间隔',
      '日期计算',
      '相差天数',

      // 日期提取
      'extract year',
      'extract month',
      'extract day',
      'get weekday',
      '提取年份',
      '提取月份',
      '提取日期',
      '获取星期',
      '分解日期',
    ],
  },

  // 文本处理操作
  'text-processing': {
    name: '文本处理',
    complexity: 'medium',
    description: '处理和分析文本数据',
    operations: [
      // 文本查找替换
      'find replace',
      'search replace',
      'substitute',
      'replace text',
      '查找替换',
      '文本替换',
      '替换内容',
      '查找并替换',

      // 文本提取
      'extract text',
      'substring',
      'left right mid',
      'text extraction',
      '提取文本',
      '截取文本',
      '文本提取',
      '字符串截取',

      // 文本分析
      'text length',
      'character count',
      'word count',
      'text analysis',
      '文本长度',
      '字符计数',
      '字数统计',
      '文本分析',

      // 文本匹配
      'contains',
      'starts with',
      'ends with',
      'pattern matching',
      '包含',
      '开头是',
      '结尾是',
      '模式匹配',
      '文本匹配',
    ],
  },

  // 数据验证操作
  'data-validation': {
    name: '数据验证',
    complexity: 'complex',
    description: '检查数据质量和一致性',
    operations: [
      // 数据检查
      'validate data',
      'check consistency',
      'data quality',
      'find errors',
      '验证数据',
      '检查一致性',
      '数据质量',
      '查找错误',
      '数据校验',

      // 格式验证
      'validate format',
      'check format',
      'format validation',
      'pattern check',
      '格式验证',
      '检查格式',
      '格式检查',
      '模式验证',

      // 范围检查
      'check range',
      'validate range',
      'outlier detection',
      'anomaly detection',
      '范围检查',
      '异常检测',
      '离群值',
      '数据异常',
    ],
  },

  // 数据透视和聚合
  'pivot-aggregation': {
    name: '透视聚合',
    complexity: 'complex',
    description: '创建数据透视表和聚合分析',
    operations: [
      // 透视表
      'pivot table',
      'cross tabulation',
      'pivot',
      'crosstab',
      '数据透视表',
      '交叉表',
      '透视',
      '数据透视',

      // 分组聚合
      'group by',
      'aggregate',
      'summarize',
      'group and sum',
      '分组',
      '聚合',
      '汇总',
      '分组汇总',
      '按...分组',

      // 小计和总计
      'subtotal',
      'grand total',
      'running total',
      'cumulative',
      '小计',
      '总计',
      '累计',
      '累积和',
    ],
  },

  // 表格连接操作
  'table-joins': {
    name: '表格连接',
    complexity: 'complex',
    description: '合并多个数据表',
    operations: [
      // 连接类型
      'join tables',
      'merge tables',
      'combine tables',
      'lookup',
      '连接表',
      '合并表',
      '表连接',
      '查找匹配',

      'vlookup',
      'hlookup',
      'index match',
      'left join',
      'inner join',
      '垂直查找',
      '水平查找',
      '索引匹配',
      '左连接',
      '内连接',

      // 数据匹配
      'match records',
      'find matching',
      'data matching',
      'record linkage',
      '匹配记录',
      '数据匹配',
      '记录关联',
      '关联数据',
    ],
  },

  // 条件逻辑操作
  'conditional-logic': {
    name: '条件逻辑',
    complexity: 'medium',
    description: '基于条件执行不同操作',
    operations: [
      // 条件判断
      'if then',
      'conditional',
      'case when',
      'logic rules',
      '如果那么',
      '条件判断',
      '逻辑规则',
      '条件逻辑',

      // 分类标记
      'categorize',
      'classify',
      'label',
      'tag',
      'flag',
      '分类',
      '分组',
      '标记',
      '打标签',
      '标注',

      // 条件计算
      'conditional sum',
      'conditional count',
      'conditional average',
      '条件求和',
      '条件计数',
      '条件平均',
      '按条件计算',
    ],
  },
};

/**
 * 根据用户输入匹配最相关的操作类别
 */
export const matchOperations = (userInput: string): OperationCategory[] => {
  const input = userInput.toLowerCase();
  const matches: { category: OperationCategory; score: number }[] = [];

  Object.values(EXCEL_OPERATIONS).forEach((category) => {
    let score = 0;

    category.operations.forEach((operation) => {
      if (input.includes(operation.toLowerCase())) {
        // 完全匹配得分更高
        score += operation.length === input.length ? 10 : 5;
      }
    });

    if (score > 0) {
      matches.push({ category, score });
    }
  });

  // 按匹配度排序
  return matches
    .sort((a, b) => b.score - a.score)
    .map(match => match.category);
};

/**
 * 获取操作复杂度建议
 */
export const getComplexityAdvice = (complexity: OperationCategory['complexity']): string => {
  switch (complexity) {
    case 'simple':
      return '这是一个简单操作，通常只需要指定列名和基本参数。';
    case 'medium':
      return '这是一个中等复杂度操作，可能需要额外的配置参数。';
    case 'complex':
      return '这是一个复杂操作，建议提供详细的操作说明和参数。';
    default:
      return '';
  }
};

/**
 * 生成操作提示
 */
export const generateOperationHints = (userInput: string): string[] => {
  const matches = matchOperations(userInput);
  const hints: string[] = [];

  if (matches.length === 0) {
    hints.push('尝试使用更具体的描述，例如："删除重复行"、"按日期排序"、"合并姓名列"');
    hints.push('支持的操作包括：数据清理、排序筛选、列管理、计算统计等');
  } else {
    const primaryCategory = matches[0];
    if (primaryCategory) {
      hints.push(`识别为${primaryCategory.name}操作：${primaryCategory.description}`);
      hints.push(getComplexityAdvice(primaryCategory.complexity));

      // 提供相关操作建议
      const relatedOps = primaryCategory.operations
        .filter(op => !userInput.toLowerCase().includes(op.toLowerCase()))
        .slice(0, 3);

      if (relatedOps.length > 0) {
        hints.push(`相关操作：${relatedOps.join('、')}`);
      }
    }
  }

  return hints;
};
