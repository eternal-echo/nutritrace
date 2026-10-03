import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync(new URL('../server/ai.js', import.meta.url), 'utf8');

test('environment AI key is not persisted in the app_config seed map', () => {
  assert.doesNotMatch(source, /AI_API_KEY:\s*['"]ai_api_key['"]/);
});

test('runtime AI config reads an environment key without requiring database storage', () => {
  assert.match(source, /process\.env\.AI_API_KEY\s*!=\s*null/);
  assert.match(source, /cfg\.ai_api_key\s*=\s*process\.env\.AI_API_KEY/);
});

test('an env-provided key removes any stale database copy before backups run', () => {
  assert.match(source, /del\.run\(['"]ai_api_key['"]\)/);
});
