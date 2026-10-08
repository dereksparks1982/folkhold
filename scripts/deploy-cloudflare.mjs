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
  // Google credentials share the same private build-to-runtime handoff.
  // Do not enable a half-configured provider. Deploy it only once both exist.
  const googleId = String(process.env.GOOGLE_CLIENT_ID || '').trim();
  const googleSecret = String(process.env.GOOGLE_CLIENT_SECRET || '').trim();
  const runtimeSecrets = { BETTER_AUTH_SECRET: secret };
  if (googleId && googleSecret) {
    runtimeSecrets.GOOGLE_CLIENT_ID = googleId;
    runtimeSecrets.GOOGLE_CLIENT_SECRET = googleSecret;
    console.log('Google login credentials included in runtime secret upload (values hidden).');
  } else {
    console.log('Google login not yet activated: both Google build credentials are needed.');
  }

  const dir = await mkdtemp(join(tmpdir(), 'folkhold-secrets-'));
  try {
    const file = join(dir, 'runtime.json');
    await writeFile(file, JSON.stringify(runtimeSecrets), {
      mode: 0o600, flag: 'wx'
    });
    const env = { ...process.env };
    for (const name of ['BETTER_AUTH_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']) {
      delete env[name];
    }
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
