import React from 'react';

// Simple markdown to HTML converter for fallback
export function simpleMarkdownToHTML(markdown: string): string {
  return markdown
    // Headers with optional IDs
    .replace(/^### (.*?)(?:\s*\{#([^}]+)\})?\s*$/gm, (_match, title, id) => {
      const idAttr = id ? ` id="${id}"` : '';
      return `<h3${idAttr} class="text-xl font-semibold text-gray-900 mt-8 mb-4">${title}</h3>`;
    })
    .replace(/^## (.*?)(?:\s*\{#([^}]+)\})?\s*$/gm, (_match, title, id) => {
      const idAttr = id ? ` id="${id}"` : '';
      return `<h2${idAttr} class="text-2xl font-semibold text-gray-900 mt-12 mb-6">${title}</h2>`;
    })
    .replace(/^# (.*?)(?:\s*\{#([^}]+)\})?\s*$/gm, (_match, title, id) => {
      const idAttr = id ? ` id="${id}"` : '';
      return `<h1${idAttr} class="text-2xl font-bold text-gray-900 mb-6">${title}</h1>`;
    })
    // Process ordered lists before other processing
    .replace(/^(\d+\.\s.*)(?=\n(?:\d+\.\s+|\n|$))/gm, (match) => {
      const lines = match.trim().split('\n');
      let listHtml = '<ol class="list-decimal list-inside mb-6 space-y-3">';

      let currentItem = '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (/^\d+\.\s+/.test(trimmed)) {
          // Close previous item if exists
          if (currentItem) {
            listHtml += `<li class="text-base text-gray-700">${currentItem}</li>`;
          }
          // Start new item
          currentItem = trimmed.replace(/^\d+\.\s+/, '');
        } else if (trimmed.startsWith('   -') || trimmed.startsWith('   *')) {
          // Sub-item
          const subContent = trimmed.replace(/^\s*[-*]\s*/, '');
          currentItem += `<br/><span class="ml-4 text-gray-600">• <em>${subContent}</em></span>`;
        } else if (trimmed.length > 0) {
          // Continuation
          currentItem += ` ${trimmed}`;
        }
      }

      // Close last item
      if (currentItem) {
        listHtml += `<li class="text-base text-gray-700">${currentItem}</li>`;
      }

      listHtml += '</ol>';
      return listHtml;
    })
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Code blocks
    .replace(/```[\s\S]*?```/g, (match) => {
      const code = match.replace(/```/g, '').trim();
      return `<pre class="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-6 text-sm"><code>${code}</code></pre>`;
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full max-w-2xl mx-auto my-8 rounded-lg shadow-lg" />')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Blockquotes
    .replace(/^> (.+$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-6 py-2 mb-6 italic text-gray-600 bg-blue-50">$1</blockquote>')
    // Tables - process before paragraph splitting
    .replace(/^(\|.+\|)\s*\n(\|[-\s|]+\|)\s*\n((?:\|.+\|\s*)+)/gm, (_match, headerRow, _separatorRow, dataRows) => {
      // Parse header - remove leading/trailing pipes and split, filter empty cells
      const headers = headerRow.replace(/^\||\|$/g, '').split('|').map((h: string) => h.trim()).filter((h: string) => h.length > 0);

      // Parse data rows - remove leading/trailing pipes and split, filter empty cells
      const rows = dataRows.trim().split('\n').map((row: string) =>
        row.replace(/^\||\|$/g, '').split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell.length > 0),
      );

      const headerHtml = headers.map((h: string) => `<th class="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">${h}</th>`).join('');
      const rowsHtml = rows.map((row: string[]) =>
        `<tr>${row.map((cell: string) => `<td class="border border-gray-300 px-4 py-2">${cell}</td>`).join('')}</tr>`,
      ).join('');

      return `<div class="overflow-x-auto my-6"><table class="min-w-full border-collapse border border-gray-300"><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
    })
    // Unordered lists
    .replace(/^[*\-]\s+(?:\S.*)?$/gm, (match) => {
      return `<li class="text-base text-gray-700">${match.replace(/^[*\-]\s+/, '')}</li>`;
    })
    // Wrap consecutive list items in ul tags
    .replace(/(<li class="text-base text-gray-700">.*?<\/li>[\s\S]*?)+/g, (match) => {
      if (match.includes('<ol class="list-decimal')) {
        return match;
      } // Skip if already processed as ordered list
      return `<ul class="list-disc list-inside mb-6 space-y-2">${match}</ul>`;
    })
    // Paragraphs
    .split('\n\n')
    .map((paragraph) => {
      paragraph = paragraph.trim();
      if (!paragraph || paragraph.startsWith('<')) {
        return paragraph;
      }
      return `<p class="text-base text-gray-700 leading-relaxed mb-6">${paragraph}</p>`;
    })
    .join('\n');
}

// Fallback markdown renderer component
export function MarkdownRenderer({ content }: { content: string }) {
  const htmlContent = simpleMarkdownToHTML(content);

  return (
    <div
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
