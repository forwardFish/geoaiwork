export function safeJsonParse(content: string): any {
  // Try to extract JSON from markdown code blocks or other wrappers
  let jsonContent = content.trim();

  // Remove markdown code blocks
  const codeBlockMatch = jsonContent.match(/```(?:json)?\s*/);
  if (codeBlockMatch) {
    const startIndex = codeBlockMatch.index! + codeBlockMatch[0].length;
    const endIndex = jsonContent.indexOf('```', startIndex);
    if (endIndex !== -1) {
      jsonContent = jsonContent.slice(startIndex, endIndex).trim();
    }
  }

  // Find JSON object boundaries
  const openBrace = jsonContent.indexOf('{');
  if (openBrace !== -1) {
    let braceCount = 1;
    let i = openBrace + 1;
    while (i < jsonContent.length && braceCount > 0) {
      if (jsonContent[i] === '{') {
        braceCount++;
      } else if (jsonContent[i] === '}') {
        braceCount--;
      }
      i++;
    }
    if (braceCount === 0) {
      jsonContent = jsonContent.slice(openBrace, i);
    }
  }

  try {
    return JSON.parse(jsonContent);
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    console.error('Content:', jsonContent);
    return null;
  }
}
