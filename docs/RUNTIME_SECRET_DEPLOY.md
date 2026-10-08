# Folkhold runtime-secret deployment (candidate)

Cloudflare build variables are available during the Git-connected build but are not automatically Worker runtime secrets. The first Test Center run confirmed 9 passes, 1 failure: the running Worker still lacks BETTER_AUTH_SECRET.

Cloudflare supports uploading runtime secrets with Worker code via npx wrangler deploy --secrets-file PATH. The private Cloudflare build variable BETTER_AUTH_SECRET is read by scripts/deploy-cloudflare.mjs, written to an OS temporary JSON file with permission 0600, uploaded with Wrangler, and deleted even after failure. No secret values enter GitHub, plain Wrangler vars, process arguments, or logs. Existing Worker configuration, D1 database and Global Chat are unchanged.

## One-time Cloudflare step, after reviewing tests

In Workers & Pages > folkhold > Settings > Build, change Deploy command from npx wrangler deploy to npm run deploy. This is a private Cloudflare setting the GitHub app cannot edit. Leave the existing encrypted secret, D1 binding and other fields unchanged. Trigger the next main-branch build or retry a build after saving.

Until that Cloudflare Deploy command is changed, the helper is installed but NOT RUN by Git-connected builds. Do not claim that live authentication is fixed without a successful runtime check.

## Validation and follow-ups

- The Folkhold Test Center GitHub workflow executes mock-Wrangler unit tests for absence of secret, secure transfer and clean success, Wrangler failure and cleanup, and non-main branch rejection.
- Check https://folkhold.dereksparks1982.workers.dev/api/account/status for ready:true, needs:[] after deployment.
- Subsequent D1 migrations, email registration, Google OAuth client and Apple OAuth configuration require separate end-to-end tests.

Docs: https://developers.cloudflare.com/workers/configuration/secrets/ and https://developers.cloudflare.com/workers/ci-cd/builds/configuration/.
