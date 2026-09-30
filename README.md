# Folkhold

<p align="center">
  <a href="https://dereksparks1982.github.io/folkhold/">
    <img src="assets/folk-hold-brand.png" alt="Folkhold FH monogram" width="160">
  </a>
</p>

<p align="center"><strong><a href="https://dereksparks1982.github.io/folkhold/">Open Folkhold</a></strong></p>

**Your place. Your people.**

Folkhold is a social web project built around personal places rather than flat profiles. Each member has a **Hold** containing rooms for the things they care about, and access to private Holds is granted through individually revocable **Keys** rather than shared passwords.

> **Advertising pays for Folkhold. Your private life does not.**

## Version 1

**Folkhold v1 closed out on September 30, 2026.**

The v1 baseline establishes the Hub, Holds, town spaces, live Public Square chat, Key-based access concepts, the approved Folkhold visual identity, GitHub Pages frontend, and Cloudflare backend foundation.

Current v1 areas:

- **Hub** — the main Folkhold landing place and navigation center
- **My Hold** — personal space and rooms
- **Public Square / Global Chat** — live global chronological conversation through Cloudflare WebSockets
- **Notice Board** — persistent public notices
- **The Tavern** — adults-only, one-time warning, intentionally minimal moderation within a platform-wide legal/safety floor
- **Tea Room** — heavily moderated civility-first alternative
- **Directory** — broad or narrow people discovery
- **Key Ring** — individually issued and revocable access keys
- **Advertising** — one quiet banner per page, with Google AdSense wired as the first eligible provider and room-specific providers planned where needed
- **Accounts** — email/password, Google, and Apple account UI/backend staged with Better Auth; activation awaits the Cloudflare D1 binding and deployment secrets

## Core ideas

- A member owns a **Hold**, not merely a profile.
- A Hold may contain public rooms, keyed rooms, and private rooms.
- Every gifted Key is unique so one person's access can be revoked without changing everybody else's access.
- A listed Hold may still be locked. People without a Key can **Knock**.
- Members will be allowed substantial sandboxed HTML/CSS customization, inspired by the creative freedom of the early social web.
- Public discovery should be broad when the user wants it broad and precise when they want it precise.
- A future AI People Finder may help locate old friends using only information members explicitly make discoverable.
- Folkhold is intended to be a web application first. A separate native mobile application is not required for the core experience.

## Branding

The approved Folkhold brand identity is the **borderless intertwined FH monogram** with ornate gilded lettering on the dark textured background. The brand mark returns to the **Hub**. Holds use their own separate home/tower identity so the Folkhold brand and a member's Hold remain visually distinct.

The live UI uses `assets/folk-hold-brand.png` for the Folkhold brand mark and Hub navigation. Browser, iPhone, and PWA icon handling is tracked separately because those platforms require different icon sizes and cache behavior.

The v1 desktop side navigation is intentionally stripped down so the navigation buttons float directly over the leather background instead of sitting inside a full sidebar panel.

## Accounts

Authentication is separated from Folkhold identity. Better Auth handles login/session state; Folkhold stores the member's username, display name, Hold ownership, rooms, keys, and social state separately.

The Cloudflare Worker also proxies the current GitHub Pages frontend so `folkhold.dereksparks1982.workers.dev` can become the same-origin account-capable application address without duplicating the UI. See `docs/ACCOUNTS.md` for the D1, secret, Google, and Apple activation steps.

## Advertising prototype

The ad slot is provider-neutral. Google AdSense is wired for ordinary pages but remains disabled until an approved publisher ID and responsive display-ad slot are supplied. See `docs/ADSENSE.md` for the activation path and the root-domain `ads.txt` note.

## Next after v1

The first planned post-v1 feature is the **Town Crier** on the Hub.

The Town Crier is intended to feel like an Ultima Online-style town crier rather than a news app: one major world story roughly once per hour, quiet between proclamations, with the ability for Folkhold announcements to replace an hourly story when needed. Truly extraordinary alerts may interrupt the normal proclamation, but Folkhold will not become a continuous headline feed.

## Hosting

GitHub remains the source repository and project history. GitHub Pages hosts the public frontend. Cloudflare Workers provides the realtime backend and is being expanded to accounts, persistence, secure Keys, uploads, and private access control.

## License

**Folkhold is proprietary source-available software, not open source.**

The repository may be viewed for personal, non-commercial evaluation, but the Folkhold code, design, documentation, and assets may not be commercially used, redistributed, republished, modified, rebranded, forked for deployment, or used to create derivative services without prior written permission from the copyright holder(s).

See [`LICENSE`](LICENSE) for the full terms. Third-party dependencies remain under their own licenses as documented in [`THIRD_PARTY.md`](THIRD_PARTY.md).

## Status

**v1 baseline closed.** Global Chat is live. Account infrastructure is staged but not yet activated until its D1 database and secrets are connected. New feature work should build from this v1 baseline.
