import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Bot,
  CheckCircle,
  Clock,
  Info,
  Sparkles,
  User,
} from 'lucide-react';
import React from 'react';

export type ChatMessage = {
  id: string;
  type: 'user' | 'ai' | 'system' | 'success' | 'warning' | 'processing';
  content: string;
  timestamp: Date;
  isTemporary?: boolean; // 标记临时消息
  metadata?: {
    operation?: string;
    confidence?: number;
    risks?: string[];
    stats?: {
      rowsBefore?: number;
      rowsAfter?: number;
      processed?: number;
    };
  };
};

type ChatMessageProps = {
  message: ChatMessage;
  isLatest?: boolean;
};

const MessageIcon: React.FC<{ type: ChatMessage['type'] }> = ({ type }) => {
  const iconClass = 'h-4 w-4';

  switch (type) {
    case 'user':
      return <User className={`${iconClass} text-blue-500`} />;
    case 'ai':
      return <Bot className={`${iconClass} text-purple-500`} />;
    case 'system':
      return <Info className={`${iconClass} text-blue-400`} />;
    case 'success':
      return <CheckCircle className={`${iconClass} text-green-500`} />;
    case 'warning':
      return <AlertTriangle className={`${iconClass} text-amber-500`} />;
    case 'processing':
      return <Sparkles className={`${iconClass} animate-pulse text-indigo-500`} />;
    default:
      return <Info className={`${iconClass} text-gray-400`} />;
  }
};

const MessageContent: React.FC<{ message: ChatMessage }> = ({ message }) => {
  if (message.type === 'processing') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex space-x-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '0.1s' }}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <span className="font-medium text-indigo-600 dark:text-indigo-400">{message.content}</span>
      </div>
    );
  }

  // 如果有统计Info，不显示数据卡片（已隐藏）
  // if (message.metadata?.stats) {
  //   return (
  //     <div className="space-y-3">
  //       <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
  //       <div className="grid grid-cols-3 gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
  //         {message.metadata.stats.rowsBefore && (
  //           <div className="text-center">
  //             <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
  //               <Database className="h-3 w-3" />
  //               Original
  //             </div>
  //             <div className="font-semibold text-blue-600 dark:text-blue-400">
  //               {message.metadata.stats.rowsBefore.toLocaleString()}
  //             </div>
  //           </div>
  //         )}
  //         {message.metadata.stats.rowsAfter && (
  //           <div className="text-center">
  //             <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
  //               <TrendingUp className="h-3 w-3" />
  //               Result
  //             </div>
  //             <div className="font-semibold text-green-600 dark:text-green-400">
  //               {message.metadata.stats.rowsAfter.toLocaleString()}
  //             </div>
  //           </div>
  //         )}
  //         {message.metadata.stats.processed && (
  //           <div className="text-center">
  //             <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
  //               <Zap className="h-3 w-3" />
  //               Changed
  //             </div>
  //             <div className="font-semibold text-purple-600 dark:text-purple-400">
  //               {message.metadata.stats.processed.toLocaleString()}
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-2">
      <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>

      {/* 显示置信度 */}
      {message.metadata?.confidence && message.metadata.confidence > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                style={{ width: `${message.metadata.confidence * 100}%` }}
              />
            </div>
            <span>
              {Math.round(message.metadata.confidence * 100)}
              % confidence
            </span>
          </div>
        </div>
      )}

      {/* 显示风险Warning */}
      {message.metadata?.risks && message.metadata.risks.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 dark:border-amber-700 dark:bg-amber-900/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
            <div>
              <div className="mb-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                Potential Risks
              </div>
              <ul className="space-y-1 text-xs text-amber-600 dark:text-amber-400">
                {message.metadata.risks.map((risk, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="mt-0.5 text-amber-400">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message, isLatest }) => {
  const getMessageStyle = () => {
    // 系统和AI消息使用固定宽度（约2/3），用户消息自动adjusting宽度
    const standardStyle = {
      container: 'justify-start',
      bubble: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg border border-gray-200 dark:border-gray-700',
      maxWidth: 'max-w-[66.67%]', // 固定2/3宽度
    };

    switch (message.type) {
      case 'user':
        return {
          container: 'justify-end', // 右对齐
          bubble: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25',
          maxWidth: 'max-w-fit', // 根据内容自动adjusting宽度，但不超过容器
        };
      case 'ai':
        return standardStyle;
      case 'system':
        return standardStyle;
      case 'success':
        return standardStyle;
      case 'warning':
        return standardStyle;
      case 'processing':
        return standardStyle;
      default:
        return standardStyle;
    }
  };

  const style = getMessageStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex ${style.container} mb-4`}
    >
      <div className={`${style.maxWidth} ${style.bubble} rounded-2xl px-4 py-3 backdrop-blur-sm`}>
        {/* Message Header */}
        {message.type !== 'user' && (
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-full bg-white/10 p-1 dark:bg-black/10">
              <MessageIcon type={message.type} />
            </div>
            <span className="text-xs font-medium opacity-80">
              {message.type === 'system'
                ? 'System'
                : message.type === 'ai'
                  ? 'AI Assistant'
                  : message.type === 'success'
                    ? 'Success'
                    : message.type === 'warning'
                      ? 'Warning'
                      : message.type === 'processing' ? 'Processing' : 'Message'}
            </span>
            {message.metadata?.operation && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs dark:bg-black/20">
                {message.metadata.operation}
              </span>
            )}
          </div>
        )}

        {/* Message Content */}
        <MessageContent message={message} />

        {/* Message Footer */}
        <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 dark:border-black/10">
          <div className="flex items-center gap-1 text-xs opacity-60">
            <Clock className="h-3 w-3" />
            <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          {isLatest && message.type === 'ai' && (
            <div className="flex items-center gap-1 text-xs opacity-60">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
              <span>Latest</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessageComponent;
