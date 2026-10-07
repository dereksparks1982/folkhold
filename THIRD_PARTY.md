# Third-Party Software and Assets

## Folkhold prototype

Folkhold's browser UI remains intentionally lightweight and uses browser-standard HTML, CSS and JavaScript. Server-side account and deployment tooling now includes the following audited dependencies.

**Folkhold itself is proprietary source-available software under the repository `LICENSE`.** The Folkhold license does not replace, narrow, or override rights granted directly by third-party licensors for their own components.

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


### Folkhold Radio opening theme: Ibn Al-Noor

- Track: **Ibn Al-Noor**
- Composer: Kevin MacLeod
- Source: https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100706
- License: Creative Commons Attribution 4.0 (CC BY 4.0)
- License URL: https://creativecommons.org/licenses/by/4.0/
- Purpose: default Folkhold Radio opening/theme track.
- Repository asset: `assets/audio/music/ibn-al-noor.mp3`

Attribution: **"Ibn Al-Noor" Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0 License.**
