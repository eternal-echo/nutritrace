export function parseAnthropicResponse(data) {
  const blocks = Array.isArray(data?.content) ? data.content : [];
  const toolUses = blocks.filter(block => block?.type === 'tool_use');
  const text = blocks
    .filter(block => block?.type === 'text' && typeof block.text === 'string')
    .map(block => block.text)
    .join('\n')
    .trim();

  if (toolUses.length > 0 && data.stop_reason === 'tool_use') {
    const assistantMessage = {
      role: 'assistant',
      content: text || null,
      tool_calls: toolUses.map(toolUse => ({
        id: toolUse.id,
        type: 'function',
        function: {
          name: toolUse.name,
          arguments: JSON.stringify(toolUse.input || {}),
        },
      })),
    };
    const toolCalls = toolUses.map(toolUse => ({
      id: toolUse.id,
      name: toolUse.name,
      args: toolUse.input || {},
    }));
    return { assistantMessage, toolCalls };
  }

  if (text) return { text };

  const stopReason = data?.stop_reason || 'unknown';
  throw new Error(`Claude API returned no usable text or completed tool call (stop_reason=${stopReason})`);
}
