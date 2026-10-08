# Folkhold Known Issues and Unfinished Work

## Square forum candidate

- Owner reported a new topic failed to save on October 8. Source UI now surfaces errors inline, but the actual live POST failure remains undiagnosed pending the Cloudflare Worker response/deployment status; do not call posting fixed.

- Forum and Worker routes are in GitHub source but **live Worker deployment and device validation remain unverified**.
- Guest display names are unverified. Durable Object cooldown is in-memory and resets on restart. Moderation, editing, identity activation, paging, search and notification are still incomplete.

This file records unresolved or intentionally incomplete work. An item remains here until it is actually resolved and validated.

## Accounts / persistence

- Better Auth UI/backend scaffolding exists, but production account activation still depends on Cloudflare D1 binding and deployment secrets.
- Google/Apple provider activation still depends on valid provider credentials if those sign-in methods remain enabled.
- Holds, Rooms, Keys, Knocks, notices, preferences, games, and most social state are not yet fully persistent production data.

## Knocks

- Door Knock interaction works as a browser prototype.
- Knocks are not yet stored as durable server-side events.
- No unread/read state, owner activity indicator, Visitor Ledger, rate limiting, or persistent sender identity exists yet.

## App/browser icons

- Generic PNG placeholder icons are intentionally in use for browser/PWA/iPhone/app-icon surfaces.
- Final icon artwork is deferred.
- Installed iOS/PWA icons can remain stale until the installed shortcut/app is removed and added again because platform caches are outside Folkhold's direct control.

## Section-heading styling

- Runtime styling was added to place major `.section-heading` blocks on readable cream panels over the leather background.
- A prior report specifically said Notice Board, Tea Room, Directory, and Key Ring had not visibly updated at one point. Later cache/version changes were made, but cross-device owner confirmation for every page should be retained as a regression check rather than assumed forever.

## Hold front door

- Current medieval door is a generic CSS placeholder and intentionally not final artwork.
- Local browser-based door customization is implemented and deployed; server-backed persistence and other members' door state are not yet implemented.
- The public-front-door / restricted-room access model is conceptual until server-side Room permissions are live.

## Town Crier

- Documented but not implemented.
- News provider/licensing, scheduled Worker logic, D1 schema, source-selection rules, and UI still need implementation and validation.

## Tavern Upstairs Rooms

- Roadmap only.
- Payment provider, adult verification, private messaging/video transport, temporary-room lifecycle, and legal/terms checks are not implemented.

## Hanafi Majlis bridge

- Folkhold's origin-aware return half is implemented and deployed.
- `?from=hanafi` stores a browser-session origin and shows **← Hanafi** in Folkhold.
- Hanafi still needs the intentional **Majlis** entry that targets Folkhold with that origin marker.
- The full round trip still needs deployed desktop/mobile validation after the Hanafi-side entry is added.

## Backgammon

- Documented but not implemented yet.
- Slice 13 is the first playable target: complete browser Backgammon against a real evaluating/searching AI opponent.
- Remote play with friends is a separate later slice and depends on both a validated local rules engine and account/realtime persistence.
- No claim is made yet about AI strength, rules completeness, or multiplayer transport because those have not been built or tested.

## UO Folkhold

Archive forensics are complete enough for review, but runtime work remains:

- The outer working archive is not a pristine 2011 snapshot; it contains later runtime state and must be treated as private preserved state.
- The embedded repack baseline and nested 2012 patch have been identified and fingerprinted.
- The 2012 patch is **not applied wholesale** to Derek's uploaded working tree.
- The patch expects `C:\RunUO 2.0\World Data`, but that World Data directory is not contained in the patch archive.
- The exact accepted UO client/data version is still not runtime-pinned.
- **5.0.9.1 is Candidate A**, because Derek's preserved DataPath explicitly points at it.
- A controlled **6.0.0.0-era** data set is Candidate B/reference if required.
- Do not begin with 7.x; the repack's own history documents 7.0.4.2 causing underground teleporter/world-placement problems.
- Ocllo/Occlo terrain/static regression still must be runtime-tested against the candidate client.
- Mono/Linux execution of the preserved `RunUO.exe` has not yet been tested.
- The 2012 patch has not been applied.
- Folkhold Game Room integration has not begun.

See `docs/UO_FORENSICS_2026-09-30.md`.

## General validation boundary

GitHub source state, browser behavior, Cloudflare services, iOS Home Screen behavior, Derek's local Linux/runtime environment, and a UO client/data set are separate validation surfaces. Success in one must not be reported as proof of another.

## Radio navigation candidate

- Radio now has its own page, accessed through a mobile swipeable navigation button or the desktop top navigation. The old persistent floating bar was removed.
- Mobile Radio/navigation UI was accepted by the owner on October 7, 2026.
- Audible browser autoplay, especially on iPhone, may be blocked until the first user gesture.
- Publicly hosted music must have redistribution rights. YouTube downloads are not assumed to have those rights.


## Radio browser constraints

- Owner accepted v1.2.0 Radio and its single SVG transport controls, track panel and phone-side hardware-volume design.
- Audible autoplay remains governed by browser/OS permission. iOS Safari may require user interaction.


## Travel Companion core map candidate

- Map UI is source-implemented, but external Leaflet CDN, OSM community tiles and Photon demo search must be checked live on desktop/iPhone.
- OSM tile and Photon search services are best-effort/limited capacity; replace with provisioned providers before production scale.
- The first slice has no routing, nearby place layers or geolocation sharing. GPS permission denial must be user tested.


## Wayfarer demo-service and device review (slices 21–24)

- Live road routing relies on Valhalla's public demo (walking/driving); response format and CORS need owner/browser validation, and a provisioned routing provider is needed before scale.
- Nearby places rely on public Overpass OSM data. Results can be missing, outdated or throttled; mosque/restaurant tags cannot establish safety, halal certification or opening hours.
- Current weather (Open-Meteo), published reference FX (Frankfurter), calculated Hanafi prayers (AlAdhan), and short translation (MyMemory) may be unavailable or rate-limited. Live source responses and mobile layouts are not yet owner-verified.
- Prayer-date queries now request the destination's timezone if unknown, requiring Open-Meteo to be available for correct destination-local date resolution. The local mosque's official timings can differ.
- The translation sends user-entered messages to an external provider when requested. Avoid personal/sensitive phrases.
- Fair Price does not have market-price evidence; it only compares two numbers entered by the user. Hitch is not yet a full AI assistant.
- No backend Keys permissions, member-to-member location sharing, trip persistence or production provider quotas are implemented.


## Travel Companion map renderer candidate (October 8, 2026)

- Previous map-rendering dependency removed from the browser runtime and replaced with OpenLayers 10.10.0.
- OpenLayers assets now load from a pinned external CDN; browser connectivity, iPhone/PC display and route/nearby overlays are not yet owner-verified.
- Shared OpenStreetMap tile limits and required OSM attribution are unaffected by the renderer replacement.

## Desktop navigation and current Travel Companion checks (October 8, 2026)

- User reported Settings wrapping/appearing in front of the first desktop navigation items. Runtime CSS alignment corrected in candidate commit; desktop Firefox visual review and wheel/drag/back-mouse confirmation still required.
- Desktop browser location may fail or time out without any permission popup when no platform geolocation provider can establish a position. Code now distinguishes denial, timeout and unavailable; real Firefox/Ubuntu diagnosis depends on owner-device checks.
- Two-way translator dropdown includes Russian, Urdu, Pashto and Dari. It uses third-party MyMemory; live language-pair support and translation quality (especially Pashto and Dari) are not guaranteed. Dari currently maps to Persian and is explicitly marked an approximation.
- Games destination remains roadmap-only and has no wagering features by design. Do not describe planned games as universally permissible under all Islamic schools.

## Desktop navigation candidate and administrative controls (October 8, 2026)

- Source now contains the uniform 108px / 44px eleven-button desktop carousel, mouse wheel containment, mouse-drag snapping, and the shortened brand subtitle. The owner must test real Firefox behavior at multiple widths, including nav-wheel at either edge, browser Back, and Hanafi-origin return-link layouts. No device acceptance is implied by a successful source check/deploy.
- The admin panel, Master Key, and Ads On/Off control are **not yet implemented**. Current Settings is advertising preferences only and may be non-persistent. Full administrator access depends on production backend authentication and explicit privilege design. Do not treat a local UI state flag as administrative authentication.

## v1.3.0 closeout validation boundaries (October 8, 2026)

- Source and GitHub Pages deployment succeeded, but **real Firefox/iPhone visual checks** are still needed for whole-button desktop nav scrolling, Hub/Hold door parity including saved customization, Knock dialogs, and the Wayfarer experience.
- If a desktop browser reports Boston while the user is in Wichita, browser network geolocation may simply be wrong. Showing claimed accuracy and retrying a fresh fix cannot guarantee a correct city. User can search and explicitly choose a route start; do not replace the wrong location with an assumed Wichita GPS position.
- External map, geocoding, Valhalla routes, nearby listings, Hanafi prayer-time provider, currency and MyMemory translation responses require provider and device testing. No claim of fully supported production usage or local-market prices.
- The Square forum is **roadmap only**. Existing live chat is preserved; no NodeBB instance is running. NodeBB server/database hosting, login bridging, GPL-3.0 licensing compatibility and security/operational decisions have not been approved.
- Admin Panel/Master Key and an ad display toggle are **not built**. Accounts require D1/secrets; Ads config remains disabled until legitimate publisher/slot configuration is provided.
