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

## First production trial (October 8)

Owner screenshot shows Deploy command set to `npm run deploy` in the Production build configuration. A documentation-only GitHub push will trigger a fresh build to determine whether the saved Cloudflare build setting runs the secret handoff. The first actual deployment run must be verified before treating account setup as ready.

## Google OAuth credentials through the existing deployment helper

The dashboard screenshot confirmed that `Variables and secrets` appears within **Settings → Builds**, and the owner already entered `GOOGLE_CLIENT_ID` there as a Variable. Cloudflare's separate account-wide **Secrets Store** is not used by Folkhold.

The helper now also reads optional `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from the same **Builds → Variables and secrets** block. Both must be present before it uploads them as runtime secret bindings along with `BETTER_AUTH_SECRET`. Until both are provided, it leaves Google OAuth pending without breaking the existing Worker deployment. The values are never committed or echoed to build logs and are removed from the Wrangler subprocess environment. This upload uses the already-configured `npm run deploy` command. Cloudflare remains the owner-controlled credential store.

**Owner step:** In the existing Folkhold Cloudflare **Builds → Variables and secrets** block, keep `GOOGLE_CLIENT_ID` as a Variable; add `GOOGLE_CLIENT_SECRET` as a **Secret**, save, then trigger a new Git-connected deployment. Confirm `providers.google: true` via Folkhold Test Center and then complete an actual browser Google sign-in with an authorized test user.
