#!/usr/bin/env node
// Folkhold: upload build-provided auth secret as a runtime secret with Worker code.
// No credential values in git, command-line arguments, subprocess environment, or logs.
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

async function main() {
  if (process.env.WORKERS_CI === '1' &&
      process.env.WORKERS_CI_BRANCH &&
      process.env.WORKERS_CI_BRANCH !== 'main') {
    throw Error('Refusing production deployment from non-main branch');
  }
  const secret = process.env.BETTER_AUTH_SECRET;
  if (typeof secret !== 'string' || secret.length < 32) {
    throw Error('BETTER_AUTH_SECRET missing or too short in build environment');
  }
  const dir = await mkdtemp(join(tmpdir(), 'folkhold-secrets-'));
  try {
    const file = join(dir, 'runtime.json');
    await writeFile(file, JSON.stringify({ BETTER_AUTH_SECRET: secret }), {
      mode: 0o600, flag: 'wx'
    });
    const env = { ...process.env };
    delete env.BETTER_AUTH_SECRET;
    console.log('Deploying Worker with a private runtime-secret upload (value hidden).');
    const code = await new Promise((resolve, reject) => {
      const child = spawn('npx', ['wrangler', 'deploy', '--secrets-file', file, '--keep-vars'],
        { stdio: 'inherit', env });
      child.once('error', reject);
      child.once('close', resolve);
    });
    if (code !== 0) {
      process.exitCode = typeof code === 'number' ? code : 1;
      console.error('Worker upload failed; secret not printed.');
      return;
    }
    console.log('Worker upload completed; awaiting live Test Center verification.');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
try {
  await main();
} catch (error) {
  const allowed = ['Refusing production deployment from non-main branch',
                   'BETTER_AUTH_SECRET missing or too short in build environment'];
  console.error(allowed.includes(error?.message) ? error.message : 'Secure deploy helper failed.');
  process.exitCode = 1;
}
