# Folkhold Accounts

## Google-first activation (owner priority October 8)

Owner explicitly prioritized Google login ahead of email registration testing and Apple login. Google OAuth is already implemented in the Worker and UI, and the public Test Center confirms Better Auth's unauthenticated session endpoint is healthy ([run 37821109168](https://github.com/dereksparks1982/folkhold/actions/runs/37821109168)). The missing input is a Google Auth Platform **Web application** OAuth client, not more changes to `BETTER_AUTH_SECRET`.

Create/select a Google Cloud project at https://console.cloud.google.com/auth/overview, configure **Branding** and **Audience** (External as appropriate), and under **Clients** create an OAuth client with type **Web application**. Set authorized JavaScript origin `https://folkhold.dereksparks1982.workers.dev` (if the form requests an origin) and the exact authorized redirect URI `https://folkhold.dereksparks1982.workers.dev/api/auth/callback/google`. Google requires an exact match. If the consent screen remains in Testing mode, add the desired test Google account(s). Use only basic sign-in scopes (openid, email, profile); no extra Google API permissions are required for ordinary login.

In the **Cloudflare Production Worker runtime** Variables and Secrets (not Build variables alone), add `GOOGLE_CLIENT_ID` and secret `GOOGLE_CLIENT_SECRET`. The existing deploy script uses `--keep-vars` and Cloudflare preserves existing runtime secrets not present in its `--secrets-file`. Do not put the Google client secret in GitHub or chat; no changes to the existing Better Auth secret or D1 are required. Verify `/api/account/status` reports `providers.google: true`, then complete an actual browser Google sign-in and create the member's username/Hold.

## 2026-10-08 runtime readiness confirmed; migrations pending smoke test

After the owner set Cloudflare's Git-connected Worker Deploy command to `npm run deploy`, the subsequent GitHub Test Center run `37820689995` reported **10 PASS, 0 FAIL**. The live `/api/account/status` check returned `ready: true`, with email provider enabled. `AUTH_DB` and the secret are now both visible to the Worker. Actual D1 table migrations, sign-in requests, and Google/Apple provider credentials remain separate unfinished checks. The Test Center now includes an unauthenticated session GET to exercise Better Auth initialization without creating a member.

## 2026-10-08 D1 provisioning progress (pre-login activation)

The owner created the D1 database `folkhold-auth` and confirmed a dashboard Worker binding named `AUTH_DB` while preserving the existing `GLOBAL_CHAT` Durable Object binding. Both Wrangler configurations (`wrangler.jsonc` in the repository root and `cloudflare/wrangler.jsonc`) now record the same database ID and binding, so whichever directory Cloudflare builds from keeps the database reference.

**Do not mistake this for enabled authentication:** `BETTER_AUTH_SECRET` has not been confirmed, and live account migrations and OAuth redirects have not been tested.

**Owner-only next action in Cloudflare:** Open **Workers & Pages → folkhold → Settings → Variables and secrets**, add a **Secret** named `BETTER_AUTH_SECRET` with a cryptographically random value of at least 32 bytes, and save/deploy. Generate the value privately (for example with a password manager's secure generator or `openssl rand -base64 48` on a trusted local machine); do not paste its value into chat or commit it to GitHub. After it is set, `/api/account/status` should report `ready: true`. The first authenticated API access initializes Better Auth tables. Verify in Cloudflare D1 rather than assuming tables exist because a binding exists.

After confirming auth database startup, configure **Google Auth Platform** in Google Cloud Console (OAuth consent, external audience when appropriate, and a Web application OAuth client). Add `https://folkhold.dereksparks1982.workers.dev` as an authorized JavaScript origin where requested, and register the redirect URI below **exactly**. Put `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Cloudflare Worker variables/secrets (the secret must be secret). Never put either secret value in GitHub. Depending on Google's publishing/test mode, add designated test users or finish required publishing/verification steps before expecting general public login.

Finally, open `https://folkhold.dereksparks1982.workers.dev`, use the account control, select **Continue with Google**, return to Folkhold, and set a unique username/profile. Test a new session and confirmed member identity; keep Global Chat and Square forum guest-capable.

This slice stages real Folkhold accounts on the existing Cloudflare Worker without interrupting Global Chat.

## Accepted account methods

The account UI is designed for:

- Email + password
- Continue with Google
- Continue with Apple

Authentication is handled by Better Auth. Folkhold-specific identity remains separate: after authentication, a member chooses a unique Folkhold username and display name, and Folkhold creates that member's Hold.

## Current architecture

The Cloudflare Worker at `https://folkhold.dereksparks1982.workers.dev` now has account routes staged under `/api/auth/*` plus Folkhold profile provisioning at `/api/folkhold/profile`.

The Worker also proxies the current GitHub Pages frontend for ordinary page requests. This gives Folkhold a same-origin application address for secure session cookies and OAuth callbacks while keeping GitHub Pages as the source/prototype frontend.

The GitHub Pages address remains usable. When someone opens the account control there, Folkhold sends them to the Cloudflare application origin for authentication.

## Activation gate

Accounts deliberately remain disabled until Cloudflare has both:

1. A D1 database binding named `AUTH_DB`.
2. A secret named `BETTER_AUTH_SECRET` containing at least 32 high-entropy characters.

No password, OAuth secret, Apple private key, or Better Auth secret belongs in GitHub.

When `AUTH_DB` and `BETTER_AUTH_SECRET` exist, the Worker will run Better Auth's D1 migrations programmatically and create Folkhold's own profile/Hold tables.

## Google activation

Add Worker secrets/variables:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Register this callback URL in the Google OAuth web client:

`https://folkhold.dereksparks1982.workers.dev/api/auth/callback/google`

## Apple activation

The staged Worker accepts:

- `APPLE_CLIENT_ID`
- `APPLE_CLIENT_SECRET`

Register this return URL with Apple:

`https://folkhold.dereksparks1982.workers.dev/api/auth/callback/apple`

Apple client secrets are JWTs and expire. A later hardening slice should generate the Apple client-secret JWT from the Apple Team ID, Key ID, and private key instead of manually rotating a static JWT.

## Folkhold profile provisioning

After successful authentication, Folkhold stores a separate profile record with:

- Better Auth user ID
- unique username
- display name
- timestamps

It also creates one owner Hold for that account. The account system answers "who are you?" while the Hold system answers "what belongs to you?"

## Global Chat identity

Global Chat remains guest-capable. Once accounts are activated, a signed-in member using the Cloudflare application origin is identified server-side before the WebSocket is handed to the Durable Object. The Durable Object then uses the member's Folkhold display name instead of trusting a client-supplied chat name.

## Next account steps

After D1 and the Better Auth secret are connected, verify email signup first. Then add Google credentials. Apple can follow once its developer credentials are available. Password-reset email and email verification require a transactional email provider and are intentionally not claimed as finished in this slice.

**Account-status diagnostic correction (October 8):** The old `/api/account/status` response listed both `AUTH_DB` and `BETTER_AUTH_SECRET` whenever **either one** was missing. That output was ambiguous. A narrowly scoped Worker fix now lists only the actual missing prerequisites; it does not expose secret values or change account activation behavior. After Cloudflare deploys the correction, re-open `/api/account/status` and read the `needs` array. If it still reports both, verify the active Worker deployment and its production bindings rather than generating a new secret or database blindly.
