# Folkhold

**Your place. Your people.**

Folkhold is an experimental social web project built around personal spaces rather than flat profiles. Each member has a **Hold** containing rooms for the things they care about, and access to private Holds is granted through individually revocable **Keys** rather than shared passwords.

> **Advertising pays for Folkhold. Your private life does not.**

## Prototype

The current GitHub Pages prototype is intentionally frontend-only. It demonstrates the product language and interaction model before a permanent backend is chosen and deployed.

Current prototype areas:

- **My Hold** — personal space and rooms
- **Public Square** — global chronological conversation
- **Notice Board** — Witcher-style persistent public notices
- **The Tavern** — adults-only, one-time warning, intentionally minimal moderation within a platform-wide legal/safety floor
- **Tea Room** — heavily moderated civility-first alternative
- **Directory** — broad or narrow people discovery
- **Key Ring** — individually issued and revocable access keys
- **Advertising** — one quiet banner per page, with Google AdSense wired as the first eligible provider and room-specific providers planned where needed

## Core ideas

- A member owns a **Hold**, not merely a profile.
- A Hold may contain public rooms, keyed rooms, and private rooms.
- Every gifted Key is unique so one person's access can be revoked without changing everybody else's access.
- A listed Hold may still be locked. People without a Key can **Knock**.
- Members will be allowed substantial sandboxed HTML/CSS customization, inspired by the creative freedom of the early social web.
- Public discovery should be broad when the user wants it broad and precise when they want it precise.
- A future AI People Finder may help locate old friends using only information members explicitly make discoverable.
- Folkhold is intended to be a web application first. A separate native mobile application is not required for the core experience.

## Advertising prototype

The ad slot is provider-neutral. Google AdSense is wired for ordinary pages but remains disabled until an approved publisher ID and responsive display-ad slot are supplied. See `docs/ADSENSE.md` for the activation path and the root-domain `ads.txt` note.

## Hosting plan

GitHub remains the source repository and project history. GitHub Pages hosts the early static prototype. A later interactive experiment is expected to use a backend service suitable for real accounts, realtime chat, persistent Keys, uploads, and private access control.

## Status

Early concept prototype. Interfaces and architecture are expected to change considerably.
