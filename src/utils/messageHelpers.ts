import type { ChatMessage } from '../components/ChatMessage';

export type MessageStats = {
  rowsBefore?: number;
  rowsAfter?: number;
  processed?: number;
  added?: number;
  removed?: number;
  modified?: number;
};

export type MessageMetadata = {
  operation?: string;
  confidence?: number;
  risks?: string[];
  stats?: MessageStats;
};

/**
 * 创建格式化的聊天消息
 */
export const createChatMessage = (
  type: ChatMessage['type'],
  content: string,
  metadata?: MessageMetadata,
): ChatMessage => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  type,
  content,
  timestamp: new Date(),
  metadata,
});

/**
 * 创建成功消息
 */
export const createSuccessMessage = (
  title: string,
  details?: string,
  stats?: MessageStats,
): ChatMessage => {
  let content = `✅ **${title}**`;
  if (details) {
    content += `\n\n${details}`;
  }

  return createChatMessage('success', content, { stats });
};

/**
 * 创建处理中消息
 */
export const createProcessingMessage = (operation: string): ChatMessage =>
  createChatMessage('processing', `Processing ${operation}...`, { operation });

/**
 * 创建预览生成成功消息
 */
export const createPreviewSuccessMessage = (
  rowsBefore: number,
  rowsAfter: number,
  summary: { added: number; removed: number; modified: number },
  risks: string[] = [],
): ChatMessage => {
  const changeText = [];
  if (summary.added > 0) {
    changeText.push(`${summary.added.toLocaleString()} rows added`);
  }
  if (summary.removed > 0) {
    changeText.push(`${summary.removed.toLocaleString()} rows removed`);
  }
  if (summary.modified > 0) {
    changeText.push(`${summary.modified.toLocaleString()} rows modified`);
  }

  const content = `**Preview Generated Successfully!**

📊 **Data Summary:**
${changeText.length > 0 ? changeText.join(', ') : 'No data changes detected'}

${risks.length > 0 ? '\n⚠️ **Important Notice:**\nPlease review the preview carefully in the right panel and click "Apply Changes" if satisfied.' : ''}

${risks.length === 0 ? 'Preview looks good! Click "Apply Changes" if you\'re satisfied with the results.' : ''}`;

  return createChatMessage('success', content, {
    operation: 'Preview',
    stats: {
      rowsBefore,
      rowsAfter,
      processed: summary.added + summary.removed + summary.modified,
    },
    risks: risks.length > 0 ? risks : undefined,
  });
};

/**
 * 创建AI分析消息
 */
export const createAIAnalysisMessage = (
  operation: string,
  confidence: number,
  description: string,
  risks: string[] = [],
): ChatMessage => {
  let content = `🤖 **Understanding Your Request: ${operation}**

📋 **Operation Details:**
${description}

🎯 **Execution Plan:**
I'll generate a preview for you to review in the right panel.`;

  if (risks.length > 0) {
    content += `\n\n⚠️ **Important Considerations:**\n${risks.map(risk => `• ${risk}`).join('\n')}`;
  }

  return createChatMessage('ai', content, {
    operation,
    confidence,
    risks: risks.length > 0 ? risks : undefined,
  });
};

/**
 * 创建错误消息
 */
export const createErrorMessage = (title: string, details?: string): ChatMessage => {
  let content = `❌ **${title}**`;
  if (details) {
    content += `\n\n${details}`;
  }

  return createChatMessage('warning', content);
};

/**
 * 创建数据应用成功消息
 */
export const createApplySuccessMessage = (operation: string, backupId?: string): ChatMessage => {
  let content = `✅ **Changes Applied Successfully!**

🔄 **Operation Completed:** ${operation}
📊 **Data Updated:** Original data has been replaced with processed results`;

  if (backupId) {
    content += `\n💾 **Backup Created:** Automatic backup created for rollback if needed`;
  }

  return createChatMessage('success', content, {
    operation: 'Apply Changes',
  });
};

/**
 * 创建回滚成功消息
 */
export const createRollbackSuccessMessage = (): ChatMessage =>
  createChatMessage('success', `🔄 **Data Successfully Rolled Back**

✅ Data restored to previous version
📊 All changes have been undone`, {
    operation: 'Rollback',
  });

/**
 * 创建DSL验证失败消息
 */
export const createDSLValidationErrorMessage = (errors: string[]): ChatMessage => {
  const content = `⚠️ **DSL Validation Failed**

❌ **Issues Found:**
${errors.map(error => `• ${error}`).join('\n')}

🔄 **Suggestion:** Please try describing your request differently or check if column names are correct.`;

  return createChatMessage('warning', content);
};

/**
 * 创建欢迎消息
 */
export const createWelcomeMessage = (): ChatMessage =>
  createChatMessage('system', `👋 **Welcome to SheetAlly!**

📊 **Getting Started:**
1. Upload your Excel or CSV file
2. Describe your data processing needs in plain English
3. Preview results and confirm changes

💡 **Example Operations:**
• "Merge first and second columns"
• "Remove duplicate records"  
• "Standardize all dates to YYYY-MM-DD format"  
• "Sort data by date"
• "Filter rows containing specific text"`);

/**
 * 格式化文本中的粗体标记
 */
export const formatMessageText = (text: string): string => {
  return text
    // 处理粗体标记
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // 处理列表项
    .replace(/^[•·▪▫]\s*/gm, '• ');
};

/**
 * 提取消息中的统计信息
 */
export const extractStatsFromContent = (content: string): MessageStats | undefined => {
  const stats: MessageStats = {};

  // 提取数字信息
  const rowsMatch = content.match(/(\d+)\s*行/g);
  if (rowsMatch && rowsMatch.length >= 2) {
    const firstMatch = rowsMatch[0];
    const secondMatch = rowsMatch[1];
    if (firstMatch && secondMatch) {
      stats.rowsBefore = Number.parseInt(firstMatch);
      stats.rowsAfter = Number.parseInt(secondMatch);
    }
  }

  return Object.keys(stats).length > 0 ? stats : undefined;
};
