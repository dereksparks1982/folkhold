#!/usr/bin/env node
// Folkhold Test Center, slice 1. Read-only: never inspect secret values or modify user data.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const offline = process.argv.includes('--offline');
const base = process.env.FOLKHOLD_WORKER_ORIGIN || 'https://folkhold.dereksparks1982.workers.dev';
const pages = process.env.FOLKHOLD_PAGES_ORIGIN || 'https://dereksparks1982.github.io/folkhold/';
const repo = process.env.GITHUB_REPOSITORY || 'dereksparks1982/folkhold';
const commit = process.env.GITHUB_SHA || 'local';
const output = process.env.FOLKHOLD_REPORT_DIR || 'test-center-reports';
const tests = [];
const started = new Date().toISOString();

async function test(group, name, fn) {
  const at = Date.now();
  try {
    const result = await fn();
    tests.push({ group, name, status: 'PASS', durationMs: Date.now() - at, message: result || 'OK' });
  } catch (error) {
    const message = String(error?.message || error).slice(0, 250).replace(/[\r\n]/g, ' ');
    tests.push({ group, name, status: message.startsWith('SKIP:') ? 'SKIP' : 'FAIL',
      durationMs: Date.now() - at, message });
  }
}
function requireValue(ok, message) { if (!ok) throw Error(message); }
function skip(message) { throw Error('SKIP: ' + message); }
async function request(url) {
  if (offline) skip('Network disabled for source-only run');
  return fetch(url, { signal: AbortSignal.timeout(15000), redirect: 'follow',
    headers: { 'User-Agent': 'Folkhold-Test-Center/1.0' } });
}
async function getJson(url) {
  const response = await request(url);
  requireValue(response.ok, 'HTTP ' + response.status + ' at ' + new URL(url).pathname);
  requireValue((response.headers.get('content-type') || '').includes('json'), 'JSON response expected');
  return response.json();
}

await test('source', 'Wrangler configuration parity', async () => {
  const root = JSON.parse(await readFile('wrangler.jsonc', 'utf8'));
  const child = JSON.parse(await readFile('cloudflare/wrangler.jsonc', 'utf8'));
  for (const key of ['d1_databases', 'durable_objects', 'vars']) {
    requireValue(JSON.stringify(root[key]) === JSON.stringify(child[key]), key + ' differs between deployment roots');
  }
  requireValue(root.name === 'folkhold' && child.name === 'folkhold', 'Worker name mismatch');
  requireValue(root.main === 'cloudflare/src/index.js' && child.main === 'src/index.js', 'Entrypoint mismatch');
  return 'Root and nested Worker configuration agree';
});
await test('source', 'Source authentication and storage declarations', async () => {
  const config = JSON.parse(await readFile('wrangler.jsonc', 'utf8'));
  requireValue(config.d1_databases?.some(x => x.binding === 'AUTH_DB' && x.database_name === 'folkhold-auth'),
    'AUTH_DB binding missing from deployment configuration');
  requireValue(config.durable_objects?.bindings?.some(x => x.name === 'GLOBAL_CHAT'),
    'GLOBAL_CHAT Durable Object binding missing');
  const source = await readFile('cloudflare/src/index.js', 'utf8');
  for (const key of ['BETTER_AUTH_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET',
    'APPLE_CLIENT_ID', 'APPLE_CLIENT_SECRET', 'emailAndPassword']) {
    requireValue(source.includes('env.' + key) || (key === 'emailAndPassword' && source.includes(key)),
      'Auth configuration reference absent: ' + key);
  }
  return 'Auth providers and storage bindings declared (not proof of activation)';
});
await test('production', 'Worker health', async () => {
  const data = await getJson(base + '/api/health');
  requireValue(data.ok === true && data.service === 'folkhold', 'Unrecognized Worker health response');
  return 'Worker HTTP health OK';
});
await test('production', 'Authentication runtime bindings', async () => {
  const data = await getJson(base + '/api/account/status');
  requireValue(typeof data.ready === 'boolean' && Array.isArray(data.needs), 'Malformed account status');
  if (!data.ready) {
    const known = ['AUTH_DB', 'BETTER_AUTH_SECRET'];
    const missing = data.needs.filter(x => known.some(k => String(x).includes(k)));
    throw Error('Runtime prerequisites missing: ' + (missing.join(', ') || 'unknown') +
      '. Cloudflare build variables and Worker runtime bindings are separate.');
  }
  return 'Runtime ready; enabled providers: ' +
    Object.entries(data.providers || {}).filter(([, yes]) => yes).map(([name]) => name).join(', ');
});
// A GET without cookies never signs in or creates a user. On first call, the existing
// Worker may lazily initialize Better Auth's own D1 schema (expected activation).
await test('source', 'Google OAuth source integration contract', async () => {
  const worker = await readFile('cloudflare/src/index.js', 'utf8');
  const ui = await readFile('auth-ui.js', 'utf8');
  for (const fragment of ['env.GOOGLE_CLIENT_ID', 'env.GOOGLE_CLIENT_SECRET',
    'socialProviders.google', 'clientId: env.GOOGLE_CLIENT_ID',
    'clientSecret: env.GOOGLE_CLIENT_SECRET']) {
    requireValue(worker.includes(fragment), 'Google Worker configuration missing: ' + fragment);
  }
  for (const fragment of ['socialButton("google"', '"/api/auth/sign-in/social"',
    'disableRedirect: true', 'location.assign(url)', 'renderUsernameSetup()']) {
    requireValue(ui.includes(fragment), 'Google account UI contract missing: ' + fragment);
  }
  return 'Google button, OAuth start, redirect and profile setup found in source';
});
await test('production', 'Google OAuth runtime configuration', async () => {
  const data = await getJson(base + '/api/account/status');
  if (!data.ready) skip('General authentication prerequisites are not ready yet');
  if (!data.providers?.google) {
    skip('Google OAuth not configured yet: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET required as Worker runtime bindings');
  }
  return 'Google provider enabled in running Worker (end-to-end Google login still untested)';
});
// This starts (but never completes) one throwaway Google OAuth state so we can
// inspect the public client_id actually sent to Google. No sign-in or user created.
await test('production', 'Google OAuth authorization uses registered client ID', async () => {
  const readiness = await getJson(base + '/api/account/status');
  if (!readiness?.providers?.google) skip('Google provider not enabled');
  if (offline) skip('Network disabled');
  const origin = new URL(base).origin;
  const response = await fetch(base + '/api/auth/sign-in/social', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': origin,
      'User-Agent': 'Folkhold-Test-Center/1.0' },
    body: JSON.stringify({ provider: 'google', callbackURL: origin + '/',
      newUserCallbackURL: origin + '/', errorCallbackURL: origin + '/?authError=1',
      disableRedirect: true }),
    signal: AbortSignal.timeout(15000)
  });
  requireValue(response.ok, 'OAuth start returned HTTP ' + response.status);
  const result = await response.json();
  const destination = new URL(result.url || result.data?.url);
  requireValue(destination.protocol === 'https:' && destination.hostname === 'accounts.google.com',
    'Unexpected Google authorization destination');
  const actual = destination.searchParams.get('client_id') || '';
  requireValue(actual.length > 30, 'Google authorization request is missing client_id');
  // SHA-256 of the PUBLIC client ID visible in the owner's Google Console
  // creation screenshot. Never log OAuth state, redirect URL or credentials.
  const { createHash } = await import('node:crypto');
  const observedHash = createHash('sha256').update(actual, 'utf8').digest('hex');
  const registeredHash = '2ef833cae9493ab407867b453c1f8a04abbfdbbc72eb9c6f5b5d6ffc272c0994';
  requireValue(observedHash === registeredHash,
    'The live OAuth request uses a different client ID from the Google Console creation screenshot. Copy the full client ID again into Cloudflare Builds.');
  return 'Google request contains the client ID shown when the OAuth client was created; provider acceptance is checked separately';
});
await test('production', 'Better Auth session endpoint and D1 initialization', async () => {
  const readiness = await getJson(base + '/api/account/status');
  if (!readiness.ready) skip('Authentication runtime prerequisites missing');
  const response = await request(base + '/api/auth/get-session');
  requireValue(response.ok, 'GET session failed: HTTP ' + response.status +
    ' (database migration or auth handler may be failing)');
  requireValue((response.headers.get('content-type') || '').includes('json'),
    'Unexpected get-session response content-type');
  const session = await response.json();
  requireValue(session === null || typeof session === 'object', 'Unexpected session response');
  return 'Unauthenticated session request completed (no account created)';
});
await test('production', 'Square forum categories', async () => {
  const data = await getJson(base + '/api/forum/categories');
  requireValue(Array.isArray(data.categories) && data.categories.length >= 5, 'Forum categories missing');
  return data.categories.length + ' categories available (read-only)';
});
await test('production', 'Square forum topics', async () => {
  const data = await getJson(base + '/api/forum/topics?category=general');
  requireValue(Array.isArray(data.topics), 'Forum topic list unavailable');
  return 'Forum topic GET works (no posts created)';
});
await test('production', 'GitHub Pages frontend', async () => {
  const response = await request(pages);
  requireValue(response.ok, 'GitHub Pages HTTP ' + response.status);
  requireValue((await response.text()).includes('<title>Folkhold</title>'), 'Folkhold title not found');
  return 'Pages returns Folkhold HTML';
});
await test('production', 'Worker frontend proxy', async () => {
  const response = await request(base + '/');
  requireValue(response.ok, 'Worker proxy HTTP ' + response.status);
  requireValue((await response.text()).includes('<title>Folkhold</title>'), 'Folkhold title not found');
  return 'Worker serves the same-origin application';
});
await test('production', 'Approved API-tab icon', async () => {
  const response = await request(base + '/favicon.ico');
  requireValue(response.ok, 'Worker favicon HTTP ' + response.status);
  const bytes = new Uint8Array(await response.arrayBuffer());
  requireValue(bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((x, i) => bytes[i] === x),
    'Worker favicon is not the approved PNG');
  return 'Worker favicon is PNG';
});
await test('deployment', 'Cloudflare Worker GitHub build check', async () => {
  if (offline || commit === 'local') skip('Requires GitHub Actions commit context');
  const api = 'https://api.github.com/repos/' + repo + '/commits/' + commit + '/check-runs?per_page=100';
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'Folkhold-Test-Center/1.0' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = 'Bearer ' + process.env.GITHUB_TOKEN;
  const response = await fetch(api, { signal: AbortSignal.timeout(15000), headers });
  if (!response.ok) skip('Cannot inspect GitHub check runs (HTTP ' + response.status + ')');
  const data = await response.json();
  const run = (data.check_runs || []).find(x => x.name === 'Workers Builds: folkhold');
  if (!run || run.status !== 'completed') skip('Cloudflare build check not finished or not yet reported');
  requireValue(run.conclusion === 'success', 'Cloudflare Worker build concluded: ' + run.conclusion);
  return 'Cloudflare build reported success (not proof of runtime bindings)';
});

const counts = Object.fromEntries(['PASS', 'FAIL', 'SKIP'].map(x => [x, tests.filter(t => t.status === x).length]));
const report = { title: 'Folkhold Test Center', started, completed: new Date().toISOString(),
  repo, commit, mode: offline ? 'source-only' : 'production-read-only', counts, tests };
await mkdir(output, { recursive: true });
await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
const md = ['# Folkhold Test Center', '', 'Commit: ' + commit,
  'Mode: ' + report.mode, 'Results: ' + counts.PASS + ' PASS, ' + counts.FAIL + ' FAIL, ' + counts.SKIP + ' SKIP', '',
  '| Group | Test | Status | Detail |', '|---|---|---|---|',
  ...tests.map(t => '| ' + t.group + ' | ' + t.name + ' | ' + t.status + ' | ' + t.message.replace(/\|/g, '\\|') + ' |'), '',
  'Build success does not prove Worker runtime secrets are present.',
  'No secret values, user accounts, test posts or database mutations are collected.', ''].join('\n');
await writeFile(join(output, 'report.md'), md);
const log = tests.map(t => '[' + t.status + '] ' + t.group + ' / ' + t.name + ': ' + t.message).join('\n') + '\n';
await writeFile(join(output, 'report.log'), log);
console.log(log + 'Reports: ' + output + '; ' + counts.PASS + ' PASS, ' + counts.FAIL +
  ' FAIL, ' + counts.SKIP + ' SKIP');
if (counts.FAIL) process.exitCode = 1;
