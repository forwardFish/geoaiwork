import { MarkdownRenderer } from '@/lib/blog/markdown-fallback';

export default function TestMarkdown() {
  const testContent = `# Test Markdown

This is a test of the markdown renderer.

## Features

- **Bold text**
- *Italic text*
- \`inline code\`

## Code Block

\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`

## Links

[Visit Google](https://google.com)

That's all!`;

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold">Markdown Test Page</h1>
        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <MarkdownRenderer content={testContent} />
        </div>
      </div>
    </div>
  );
}
