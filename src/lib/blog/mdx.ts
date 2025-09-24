import { compile, run } from '@mdx-js/mdx';
import React, { cache } from 'react';

import * as runtime from 'react/jsx-runtime';

// MDX编译选项
export const mdxOptions = {
  development: process.env.NODE_ENV === 'development',
  useDynamicImport: true,
  remarkPlugins: [],
  rehypePlugins: [],
};

// 编译MDX内容
export const compileMDX = cache(async (source: string) => {
  try {
    const compiled = await compile(source, {
      ...mdxOptions,
      outputFormat: 'function-body',
    });

    const { default: Content } = await run(compiled, runtime);
    return Content;
  } catch (error) {
    console.error('MDX compilation error:', error);
    throw new Error('Failed to compile MDX content');
  }
});

// 提取MDX文档中的标题结构（用于生成目录）
export function extractHeadings(content: string): Array<{
  id: string;
  text: string;
  level: number;
}> {
  const headings: Array<{ id: string; text: string; level: number }> = [];

  // 匹配Markdown标题，支持自定义ID语法 {#id}
  const headingRegex = /^(#{1,6})\s+(.+?)(?:\s*\{#([^}]+)\})?\s*$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1]?.length || 1;
    const text = match[2]?.trim() || '';
    const customId = match[3]?.trim();

    // 使用自定义ID，如果没有则生成一个
    const id = customId || generateHeadingId(text);

    headings.push({ id, text, level });
  }

  return headings;
}

// 生成标题ID（用于锚点）
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4E00-\u9FFF\s-]/g, '') // 保留中文、英文、数字、空格、连字符
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/-+/g, '-') // 多个连字符合并为一个
    .replace(/^-|-$/g, ''); // 移除首尾连字符
}

// 处理代码块高亮
export function processCodeBlocks(content: string): string {
  // 这里可以添加代码高亮处理逻辑
  // 目前先返回原内容
  return content;
}

// 处理图片链接
export function processImages(content: string, baseUrl = ''): string {
  return content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_match, alt, src) => {
      // 如果是相对路径，添加基础URL
      const imageSrc = src.startsWith('http') ? src : `${baseUrl}${src}`;
      return `![${alt}](${imageSrc})`;
    },
  );
}

// MDX组件映射配置
export const mdxComponents = {
  h1: (props: any) => React.createElement('h1', { className: 'text-4xl font-bold text-gray-900 mb-6', ...props }),
  h2: (props: any) => React.createElement('h2', { className: 'text-3xl font-semibold text-gray-900 mt-12 mb-6', ...props }),
  h3: (props: any) => React.createElement('h3', { className: 'text-2xl font-semibold text-gray-900 mt-8 mb-4', ...props }),
  h4: (props: any) => React.createElement('h4', { className: 'text-xl font-semibold text-gray-900 mt-6 mb-3', ...props }),
  h5: (props: any) => React.createElement('h5', { className: 'text-lg font-semibold text-gray-900 mt-4 mb-2', ...props }),
  h6: (props: any) => React.createElement('h6', { className: 'text-base font-semibold text-gray-900 mt-4 mb-2', ...props }),

  p: (props: any) => React.createElement('p', { className: 'text-lg text-gray-700 leading-relaxed mb-6', ...props }),

  a: (props: any) => React.createElement('a', {
    className: 'text-blue-600 hover:text-blue-800 underline underline-offset-2',
    target: props.href?.startsWith('http') ? '_blank' : undefined,
    rel: props.href?.startsWith('http') ? 'noopener noreferrer' : undefined,
    ...props,
  }),

  strong: (props: any) => React.createElement('strong', { className: 'font-semibold text-gray-900', ...props }),
  em: (props: any) => React.createElement('em', { className: 'italic', ...props }),

  ul: (props: any) => React.createElement('ul', { className: 'list-disc list-inside mb-6 space-y-2', ...props }),
  ol: (props: any) => React.createElement('ol', { className: 'list-decimal list-inside mb-6 space-y-2', ...props }),
  li: (props: any) => React.createElement('li', { className: 'text-lg text-gray-700', ...props }),

  blockquote: (props: any) => React.createElement('blockquote', {
    className: 'border-l-4 border-blue-500 pl-6 py-2 mb-6 italic text-gray-600 bg-blue-50',
    ...props,
  }),

  code: (props: any) => React.createElement('code', {
    className: 'bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono',
    ...props,
  }),

  pre: (props: any) => React.createElement('pre', {
    className: 'bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-6 text-sm',
    ...props,
  }),

  table: (props: any) => React.createElement('div', {
    className: 'overflow-x-auto mb-6',
  }, React.createElement('table', { className: 'min-w-full border border-gray-200', ...props })),

  thead: (props: any) => React.createElement('thead', { className: 'bg-gray-50', ...props }),
  tbody: (props: any) => React.createElement('tbody', props),
  tr: (props: any) => React.createElement('tr', { className: 'border-b border-gray-200', ...props }),
  th: (props: any) => React.createElement('th', {
    className: 'px-6 py-3 text-left text-sm font-semibold text-gray-900',
    ...props,
  }),
  td: (props: any) => React.createElement('td', {
    className: 'px-6 py-4 text-sm text-gray-700',
    ...props,
  }),

  hr: (props: any) => React.createElement('hr', { className: 'border-gray-300 my-8', ...props }),

  img: (props: any) => React.createElement('img', {
    className: 'max-w-full h-auto rounded-lg shadow-sm mb-6',
    loading: 'lazy',
    ...props,
  }),
};

// 验证MDX内容
export function validateMDXContent(content: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // 检查基本的MDX语法
    if (!content.trim()) {
      errors.push('Content is empty');
      return { isValid: false, errors, warnings };
    }

    // 检查frontmatter
    if (!content.startsWith('---')) {
      errors.push('Missing frontmatter');
    }

    // 检查是否有标题结构
    const headings = extractHeadings(content);
    if (headings.length === 0) {
      warnings.push('No headings found - consider adding section headers');
    }

    // 检查图片alt文本
    const imageMatches = content.match(/!\[([^\]]*)\]/g);
    if (imageMatches) {
      imageMatches.forEach((match) => {
        const alt = match.match(/!\[([^\]]*)\]/)?.[1];
        if (!alt || alt.trim() === '') {
          warnings.push('Image missing alt text');
        }
      });
    }

    // 检查链接
    const linkMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g);
    if (linkMatches) {
      linkMatches.forEach((match) => {
        const url = match.match(/\]\(([^)]+)\)/)?.[1];
        if (url && !url.startsWith('http') && !url.startsWith('/') && !url.startsWith('#')) {
          warnings.push(`Potentially invalid link: ${url}`);
        }
      });
    }
  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
