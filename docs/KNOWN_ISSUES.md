# Folkhold Known Issues and Unfinished Work

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
- Door customization is not yet implemented.
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


## God's Eye core map candidate

- Map UI is source-implemented, but external Leaflet CDN, OSM community tiles and Photon demo search must be checked live on desktop/iPhone.
- OSM tile and Photon search services are best-effort/limited capacity; replace with provisioned providers before production scale.
- The first slice has no routing, nearby place layers or geolocation sharing. GPS permission denial must be user tested.
