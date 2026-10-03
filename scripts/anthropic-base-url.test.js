import assert from 'node:assert/strict';
import test from 'node:test';

import { anthropicMessagesUrl } from '../server/lib/anthropic-base-url.js';

test('uses the official Anthropic Messages endpoint when no base URL is configured', () => {
  assert.equal(
    anthropicMessagesUrl(),
    'https://api.anthropic.com/v1/messages',
  );
});

test('appends the Messages path to an Anthropic-compatible base URL', () => {
  assert.equal(
    anthropicMessagesUrl('https://open.bigmodel.cn/api/anthropic'),
    'https://open.bigmodel.cn/api/anthropic/v1/messages',
  );
});

test('removes trailing slashes before appending the Messages path', () => {
  assert.equal(
    anthropicMessagesUrl('https://open.bigmodel.cn/api/anthropic///'),
    'https://open.bigmodel.cn/api/anthropic/v1/messages',
  );
});
