# Folkhold

**Your place. Your people.**

Folkhold is a social web project built around personal places rather than flat profiles. Each member has a **Hold** containing rooms for the things they care about, and access to private Holds is granted through individually revocable **Keys** rather than shared passwords.

## Links

- **Folkhold Web App:** https://dereksparks1982.github.io/folkhold/
- **Hanafi Learning Deck:** https://dereksparks1982.github.io/Hanafi-Islam-Learning-Deck/
- **Hanafi Learning Deck repository:** https://github.com/dereksparks1982/Hanafi-Islam-Learning-Deck

## Current candidate: compact desktop navigation (October 8, 2026)

The eleven desktop top-nav shortcuts now use short labels (**Hub, Square, Notice, Hold, Tavern, Tea Room, Directory, Key Ring, Radio, Travel, Settings**), equal-size buttons and a fixed-count horizontal carousel. While the mouse is over the bar, its wheel moves the bar sideways without scrolling the document. Wheel moves and mouse-drag release align whole buttons. The banner tagline is now **Your people**. This is a source-validated candidate requiring desktop Firefox owner acceptance; no mobile-footer, background or Radio changes. The owner-only administration panel with Master Key and ad-display control is a separate planned security slice, not implemented by this visual patch.

## Development candidates: Travel Companion and Wayfarer (slices 20–24)

**Map renderer updated October 8, 2026:** Travel Companion now uses OpenLayers 10.10.0. The former renderer is completely absent from the page's runtime dependencies; road and nearby marker layers were migrated too. The OpenStreetMap map-data credit remains. This replacement still awaits owner validation on PC/iPhone.

Travel Companion is a new place inside Folkhold, entered from the Hub, with a world map, place search and **optional** device location.

The next four self-contained candidate slices now add manual **driving/walking road routes** and navigation handoff, nearby discoveries (mosques, cafés/food, history, adventure, nightlife), selected-place weather, **Hanafi prayer times**, currency conversion, short-message translation, a Turkish phrasebook, **Fair Price** comparison using your own benchmark, and an initial Hitch travel-context panel.

**Review status:** source committed and parsed; third-party map/search/routing/data services and iPhone/desktop interactions still need real browser testing. The location chosen on the map is sent to outside providers only when you explicitly request nearby results, directions, weather or prayer times. Translation text goes to MyMemory only when you press Translate. No automatic GPS, member location sharing, persistent trip records, true AI assistant or verified local market-price database are in this candidate.

See `docs/GODS_EYE.md` for provider credits, usage limits and review checklist. Radio v1.2.0 and accepted backgrounds, mobile bar and icons are unchanged.

## v1.2.0 — Folkhold Radio

**Accepted October 7, 2026.**

Radio has its own page accessible from desktop navigation and the swipeable iPhone bottom bar. Playback continues while moving between Folkhold screens.

- Controls: one Previous, **up-arrow Play** (Pause during playback), and one Next button on both PC and iPhone, plus seek and a selectable playlist.
- The iPhone uses its hardware volume keys; desktop retains a volume slider.
- Presets: **All Music**, **Eastern Roads**, and **Medieval Hall**.
- Six locally hosted CC BY 4.0 Kevin MacLeod recordings under `assets/audio/music/`; **Ibn Al-Noor** remains the default theme.
- Organized audio paths and source/licensing records: `docs/AUDIO_RADIO.md` and `THIRD_PARTY.md`.
- Browser autoplay may require user interaction. Higher-fidelity cultural recordings are a separate future curation slice.

## v1.1.0 — Hold Door and Navigation Closeout

**Folkhold v1.1.0 closed out on September 30, 2026.**

This closeout gathers the post-v1 interface work into the first tracked minor release:

- desktop navigation moved to the top and the old desktop side rail is gone
- top navigation order places **Village Square**, **Notice Board**, then **My Hold** near the center
- generic app/browser PNG icons replace the troublesome ornate icon on platform icon surfaces for now
- major section headings have readable cream backing panels over the leather background
- Derek's Hold now has a generic medieval CSS front door with wood planks, iron bands, rivets, and a keyhole
- double-clicking the Hold door asks **Do you wish to leave a knock?** and Derek confirmed the prototype Knock interaction works
- Derek's Hold welcome message is **Everyone is Welcome** while individual rooms may still require Keys
- the inaccurate site-wide slogan **Advertising pays for Folkhold. Your private life does not.** has been removed
- Folkhold now has explicit version/change/roadmap/validation/memory documentation so the project's story does not depend on one conversation thread

Release history is tracked in [`CHANGELOG.md`](CHANGELOG.md). Current operating rules are in [`COMPANY_BIBLE.md`](COMPANY_BIBLE.md), future work is in [`ROADMAP.md`](ROADMAP.md), work slices are in [`docs/TASK_SLICES.md`](docs/TASK_SLICES.md), unresolved items are in [`docs/KNOWN_ISSUES.md`](docs/KNOWN_ISSUES.md), validation evidence is in [`docs/VALIDATION.md`](docs/VALIDATION.md), and distilled cross-thread/project memory is in [`docs/MEMORY_BANK.md`](docs/MEMORY_BANK.md).

## Version 1 baseline

**Folkhold v1.0.0 closed out on September 30, 2026.**

The v1 baseline established the Hub, Holds, town spaces, live Public Square chat, Key-based access concepts, the Folkhold visual identity, GitHub Pages frontend, and Cloudflare backend foundation.

Current areas:

- **Hub** — the main Folkhold landing place and navigation center
- **My Hold** — personal space and rooms
- **Village/Public Square / Global Chat** — live global chronological conversation through Cloudflare WebSockets
- **Notice Board** — persistent public notices
- **The Tavern** — adults-only, one-time warning, intentionally minimal moderation within a platform-wide legal/safety floor
- **Tea Room** — heavily moderated civility-first alternative
- **Directory** — broad or narrow people discovery
- **Key Ring** — individually issued and revocable access keys
- **Advertising** — provider-neutral advertising shell with ordinary-page provider work staged separately
- **Accounts** — email/password, Google, and Apple account UI/backend staged with Better Auth; activation awaits the Cloudflare D1 binding and deployment secrets

## Core ideas

- A member owns a **Hold**, not merely a profile.
- A Hold may contain public rooms, keyed rooms, and private rooms.
- A Hold's front door may welcome everyone even when rooms behind it require Keys.
- Every gifted Key is unique so one person's access can be revoked without changing everybody else's access.
- A listed Hold may still restrict individual rooms. People can **Knock** at the front door.
- Members will be allowed substantial sandboxed HTML/CSS customization, inspired by the creative freedom of the early social web.
- Public discovery should be broad when the user wants it broad and precise when they want it precise.
- A future AI People Finder may help locate old friends using only information members explicitly make discoverable.
- Folkhold is intended to be a web application first. A separate native mobile application is not required for the core experience.

## Branding and placeholders

The approved ornate borderless FH monogram remains preserved as an approved Folkhold brand asset.

For troublesome browser/iPhone/PWA and top-left app-icon surfaces, Folkhold currently uses a **generic placeholder app icon**. This is intentional. The project will prefer a reliable generic placeholder over repeatedly corrupting or redrawing approved artwork. Final icon replacement can happen later when Derek explicitly chooses it.

Holds have their own identity, including a visible front door that can eventually be customized by the Hold owner.

## Hanafi ↔ Folkhold

Hanafi and Folkhold are being treated as separate but complementary applications.

Derek's product metaphor is **Hanafi as the mother** and **Folkhold as the father**: Hanafi centers learning, faith, practice, reference, and guidance; Folkhold centers community, people, rooms, and gathering.

The planned Hanafi community button is named **Majlis**. It will open Folkhold's public gathering side without merging the sites. When a visitor arrives through Hanafi, Folkhold can temporarily add **← Hanafi** while keeping its normal navigation intact. The bridge is documented but not yet implemented. See [`docs/HANAFI_BRIDGE.md`](docs/HANAFI_BRIDGE.md).

## Accounts

Authentication is separated from Folkhold identity. Better Auth handles login/session state; Folkhold stores the member's username, display name, Hold ownership, rooms, keys, knocks, and social state separately.

The Cloudflare Worker also proxies the current GitHub Pages frontend so `folkhold.dereksparks1982.workers.dev` can become the same-origin account-capable application address without duplicating the UI. See `docs/ACCOUNTS.md` for the D1, secret, Google, and Apple activation steps.

## Advertising prototype

The ad slot is provider-neutral. Ordinary-page provider support remains staged and room-specific/adult-capable providers can be evaluated where required. See `docs/ADSENSE.md` for the existing ordinary-page AdSense activation notes.

## Roadmap highlights

The active roadmap includes:

- a Hold-themed Knock/activity signal and Visitor Ledger instead of a generic notification bell
- customizable Hold front doors
- account/D1 persistence and real server-side Keys/Knocks
- the Hanafi **Majlis** doorway into Folkhold
- the Hub **Town Crier** with roughly one major proclamation per hour
- temporary paid Tavern **Upstairs Rooms** with invite-first/charge-after-acceptance flow and mutual video consent
- **UO Folkhold**, an Ultima Online free shard based on Derek's preserved RunUO 2.0 Final Repack, with exact client pinning and Linux compatibility work before Folkhold Game Room integration

See [`ROADMAP.md`](ROADMAP.md), [`docs/TASK_SLICES.md`](docs/TASK_SLICES.md), [`docs/UO_FOLKHOLD.md`](docs/UO_FOLKHOLD.md), and [`docs/HANAFI_BRIDGE.md`](docs/HANAFI_BRIDGE.md).

## Hosting

GitHub remains the source repository and project history. GitHub Pages hosts the public frontend. Cloudflare Workers provides the realtime backend and is being expanded to accounts, persistence, secure Keys, uploads, private access control, and future scheduled services such as Town Crier.

## License

**Folkhold is proprietary source-available software, not open source.**

The repository may be viewed for personal, non-commercial evaluation, but the Folkhold code, design, documentation, and assets may not be commercially used, redistributed, republished, modified, rebranded, forked for deployment, or used to create derivative services without prior written permission from the copyright holder(s).

See [`LICENSE`](LICENSE) for the full terms. Third-party dependencies remain under their own licenses as documented in [`THIRD_PARTY.md`](THIRD_PARTY.md).

## Status

**v1.1.0 closed.** Global Chat is live. Knock interaction works as a browser prototype. Account infrastructure is staged but not yet activated until its D1 database and secrets are connected. The Hanafi Majlis bridge, Town Crier, persistent Knock ledger, Hold door designer, Tavern Upstairs Rooms, and UO Folkhold are documented future slices rather than completed v1.1.0 features.
