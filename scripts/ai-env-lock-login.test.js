import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const settings = fs.readFileSync(new URL('../src/stores/settings.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../src/App.svelte', import.meta.url), 'utf8');
const login = fs.readFileSync(new URL('../src/routes/Login.svelte', import.meta.url), 'utf8');

test('settings exposes one env-lock loader that fetches and updates the store', () => {
  assert.match(settings, /export async function loadEnvLocks\(\)/);
  assert.match(settings, /apiUrl\('\/api\/app-config\/env-locks'\)/);
  assert.match(settings, /envLocks\.set\(data\)/);
});

test('App startup uses the shared env-lock loader', () => {
  assert.match(app, /import\('\.\/stores\/settings\.js'\).*loadEnvLocks/s);
  assert.match(app, /await loadEnvLocks\(\)/);
});

test('password login refreshes env locks after auth and before navigation', () => {
  assert.match(login, /import \{ loadServerSettings, loadEnvLocks \} from '\.\.\/stores\/settings\.js'/);
  const loginStart = login.indexOf('async function login()');
  const loginEnd = login.indexOf('async function recover()', loginStart);
  const passwordLogin = login.slice(loginStart, loginEnd);
  const authAt = passwordLogin.indexOf('await loadAuthState()');
  const locksAt = passwordLogin.indexOf('await loadEnvLocks()', authAt);
  const pushAt = passwordLogin.indexOf("push('/')", authAt);
  assert.ok(loginStart >= 0 && loginEnd > loginStart, 'password login function is isolated');
  assert.ok(authAt >= 0, 'login refreshes auth state');
  assert.ok(locksAt > authAt, 'login refreshes env locks after auth');
  assert.ok(pushAt > locksAt, 'login refreshes env locks before navigation');
});
