# Folkhold Known Issues and Unfinished Work

This file records unresolved or intentionally incomplete work. An item remains here until it is actually resolved and validated.

## Accounts / persistence

- Better Auth UI/backend scaffolding exists, but production account activation still depends on Cloudflare D1 binding and deployment secrets.
- Google/Apple provider activation still depends on valid provider credentials if those sign-in methods remain enabled.
- Holds, Rooms, Keys, Knocks, notices, preferences, and most social state are not yet fully persistent production data.

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

- Documented but not implemented.
- Hanafi repository/current deployment must be verified before changes.
- Final Folkhold entry destination should be confirmed during implementation; Village Square is the current default recommendation.

## UO Folkhold

- The supplied RunUO 2.0 Final Repack and 2012 patch hashes have been verified.
- Archive contents have not yet been fully inventoried in this closeout slice.
- Exact compatible UO client/data version is not yet pinned.
- Ocllo/Occlo terrain/static regression still must be tested against candidate clients.
- Linux/Mono port work has not begun.
- Folkhold Game Room integration has not begun.

## General validation boundary

GitHub source state, browser behavior, Cloudflare services, iOS Home Screen behavior, and Derek's local Linux/runtime environment are separate validation surfaces. Success in one must not be reported as proof of another.
