import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm, chmod, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const fixtureSecret = 'unit-test-only-' + 'X'.repeat(60);
async function stub(t) {
  const dir = await mkdtemp(join(tmpdir(), 'folkhold-unit-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const code = [
    '#!/usr/bin/env node',
    "const fs = require('node:fs');",
    "const path = require('node:path');",
    "const args = process.argv.slice(2);",
    "const p = args[args.indexOf('--secrets-file') + 1];",
    "const payload = JSON.parse(fs.readFileSync(p, 'utf8'));",
    "const report = { hasSecret: payload.BETTER_AUTH_SECRET === process.env.FOLKHOLD_UNIT_EXPECTED,",
    "  inherited: Boolean(process.env.BETTER_AUTH_SECRET),",
    "  mode: fs.statSync(p).mode & 0o777,",
    "  dir: path.dirname(p),",
    "  params: [args[0], args[1], args.includes('--keep-vars')] };",
    "fs.writeFileSync(process.env.FOLKHOLD_UNIT_REPORT, JSON.stringify(report));",
    "process.exit(Number(process.env.FOLKHOLD_UNIT_EXIT || 0));"
  ].join('\n');
  await writeFile(join(dir, 'npx'), code);
  await chmod(join(dir, 'npx'), 0o755);
  return { dir, report: join(dir, 'result.json') };
}
function invoke(vars) {
  return spawnSync(process.execPath, ['scripts/deploy-cloudflare.mjs'], {
    encoding: 'utf8', timeout: 12000,
    env: { ...process.env, WORKERS_CI: '1', WORKERS_CI_BRANCH: 'main', ...vars }
  });
}
test('Missing auth secret fails without deploying', async t => {
  const f = await stub(t);
  const r = invoke({ BETTER_AUTH_SECRET: '', PATH: f.dir + ':' + process.env.PATH,
    FOLKHOLD_UNIT_REPORT: f.report });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /BETTER_AUTH_SECRET missing/);
  await assert.rejects(access(f.report));
});
test('Valid secret uploads privately, no value in output and cleans temp file', async t => {
  const f = await stub(t);
  const r = invoke({ BETTER_AUTH_SECRET: fixtureSecret, PATH: f.dir + ':' + process.env.PATH,
    FOLKHOLD_UNIT_REPORT: f.report, FOLKHOLD_UNIT_EXPECTED: fixtureSecret });
  assert.equal(r.status, 0, r.stderr);
  const x = JSON.parse(await readFile(f.report, 'utf8'));
  assert.equal(x.hasSecret, true);
  assert.equal(x.inherited, false);
  assert.equal(x.mode, 0o600);
  assert.deepEqual(x.params, ['wrangler', 'deploy', true]);
  assert.ok(!r.stdout.includes(fixtureSecret) && !r.stderr.includes(fixtureSecret));
  await assert.rejects(access(x.dir));
});
test('Wrangler failure propagates and temp secrets are removed', async t => {
  const f = await stub(t);
  const r = invoke({ BETTER_AUTH_SECRET: fixtureSecret, PATH: f.dir + ':' + process.env.PATH,
    FOLKHOLD_UNIT_REPORT: f.report, FOLKHOLD_UNIT_EXPECTED: fixtureSecret, FOLKHOLD_UNIT_EXIT: '23' });
  assert.equal(r.status, 23, r.stderr);
  const x = JSON.parse(await readFile(f.report, 'utf8'));
  await assert.rejects(access(x.dir));
});
test('Never deploys production on a preview branch', async t => {
  const f = await stub(t);
  const r = invoke({ BETTER_AUTH_SECRET: fixtureSecret, PATH: f.dir + ':' + process.env.PATH,
    FOLKHOLD_UNIT_REPORT: f.report, WORKERS_CI_BRANCH: 'preview' });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /non-main/);
  await assert.rejects(access(f.report));
});
