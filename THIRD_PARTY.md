# Third-Party Software and Assets

## Folkhold prototype

Folkhold's browser UI remains intentionally lightweight and uses browser-standard HTML, CSS and JavaScript. Server-side account and deployment tooling now includes the following audited dependencies.

### Better Auth

- Project: https://www.better-auth.com/
- Package: `better-auth`
- Version range: `^1.7.6`
- License: MIT
- Purpose: email/password authentication, sessions, Google/Apple OAuth provider support, and Cloudflare D1-backed account records.

### Cloudflare Wrangler

- Project: https://github.com/cloudflare/workers-sdk
- Package: `wrangler`
- Version range: `^4.144.0`
- License: MIT OR Apache-2.0
- Purpose: build and deploy the Folkhold Cloudflare Worker, Durable Object Global Chat, and future D1 bindings.

Google and Apple are external identity providers rather than bundled Folkhold software. Their OAuth credentials are deployment secrets and must never be committed to this repository.

Future dependencies must be recorded here with their project URL, version, license and purpose before they become accepted parts of Folkhold.
