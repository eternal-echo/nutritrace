import assert from 'node:assert/strict';
import test from 'node:test';

import { parseAnthropicResponse } from '../server/lib/anthropic-response.js';

test('returns joined text blocks while ignoring thinking blocks', () => {
  assert.deepEqual(
    parseAnthropicResponse({
      stop_reason: 'end_turn',
      content: [
        { type: 'thinking', thinking: 'private reasoning' },
        { type: 'text', text: 'answer' },
      ],
    }),
    { text: 'answer' },
  );
});

test('returns structured tool calls and preserves accompanying text', () => {
  assert.deepEqual(
    parseAnthropicResponse({
      stop_reason: 'tool_use',
      content: [
        { type: 'thinking', thinking: 'private reasoning' },
        { type: 'text', text: 'Checking that now.' },
        { type: 'tool_use', id: 'tool-1', name: 'search_foods', input: { query: 'rice' } },
      ],
    }),
    {
      assistantMessage: {
        role: 'assistant',
        content: 'Checking that now.',
        tool_calls: [{
          id: 'tool-1',
          type: 'function',
          function: { name: 'search_foods', arguments: '{"query":"rice"}' },
        }],
      },
      toolCalls: [{ id: 'tool-1', name: 'search_foods', args: { query: 'rice' } }],
    },
  );
});

test('rejects thinking-only and truncated responses instead of returning empty success', () => {
  assert.throws(
    () => parseAnthropicResponse({
      stop_reason: 'max_tokens',
      content: [{ type: 'thinking', thinking: 'unfinished reasoning' }],
    }),
    /no usable text or completed tool call.*max_tokens/i,
  );
});
