# Folkhold Accounts

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
