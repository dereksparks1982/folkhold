# Folkhold Task Slices

This file turns the roadmap into small, finishable pieces. Each slice should be inspected, implemented, validated, documented, and closed before the next slice expands the surface area.

Status values:

- **CLOSED** — accepted baseline/history
- **READY** — can be taken next without another dependency
- **BLOCKED** — needs a prerequisite or owner-provided external credential/resource
- **ROADMAP** — intentionally not active yet

## Slice 0 — v1.1.0 documentation and closeout

**Status: CLOSED when the v1.1.0 closeout commit reaches `main` and its documentation is verified.**

Scope:

- version `1.1.0`
- README closeout
- changelog
- project log
- Company Bible
- roadmap
- memory bank
- known issues + validation record
- UO Folkhold preservation plan
- Hanafi Majlis bridge design

No new user-facing feature belongs in this slice.

## Slice 1 — UO Folkhold archive forensics

**Status: READY**

Goal: understand the exact preserved RunUO package before changing it.

Work:

- inventory both supplied 7z archives without modifying originals
- record full file manifests and hashes
- extract repack and patch into isolated working directories
- diff patch against base
- locate documentation, version gates, data-path assumptions, Mono scripts/project files, expansion flags, packet/version branches, map/MUL/UOP handling
- identify clues to the intended UO client and data era
- update `docs/UO_FOLKHOLD.md` with evidence, not guesses

Acceptance boundary: a documented forensic report and a narrowed client test matrix. No Folkhold UI integration yet.

## Slice 2 — UO Folkhold client pinning

**Status: BLOCKED until Slice 1 identifies the plausible client/data range and the required client installers/data are available.**

Goal: prove one exact client/data set against the preserved server.

Work:

- test candidate client/data sets deliberately
- validate login, character creation, movement, packets, map loading
- use Ocllo/Occlo as a required terrain/static regression location
- validate additional locations so a one-town coincidence cannot pass
- record client executable version and hashes of accepted data files
- freeze the accepted client package against auto-patching

Acceptance boundary: exact client/data baseline documented with evidence.

## Slice 3 — UO Folkhold Linux/Mono port

**Status: BLOCKED by Slice 1 baseline understanding; final validation benefits from Slice 2.**

Goal: run the preferred RunUO 2.0 repack on Linux while preserving its behavior.

Work:

- establish untouched reference behavior
- compile with the closest practical Mono/.NET compatibility path
- fix portability failures minimally and document every change
- preserve game logic unless a Linux compatibility repair requires it
- validate world load, scripts, accounts, networking, saves, restart, clean shutdown
- document any Linux-only wrapper/service layer separately from preserved RunUO logic

Acceptance boundary: standalone UO Folkhold server reliably runs on Linux before Folkhold embedding.

## Slice 4 — UO Folkhold Game Room integration

**Status: BLOCKED by a stable standalone shard.**

Goal: make UO Folkhold feel like something living inside the Game Room without hiding the preserved server architecture.

Potential work:

- server status
- owner/admin Start and Stop
- Join/Launch instructions/control
- current player count/health
- safe log/status surface
- no secrets exposed to normal visitors

Acceptance boundary: Folkhold can manage/discover the shard without becoming responsible for fragile core emulation logic.

## Slice 5 — Hanafi Majlis bridge

**Status: READY after both repositories are verified.**

Goal: connect the two sites without merging them.

Work:

- Hanafi adds **Majlis**
- Majlis opens Folkhold's public gathering destination
- origin marker such as `?from=hanafi`
- Folkhold session-preserves origin context
- Folkhold shows **← Hanafi** only when appropriate
- normal Folkhold navigation remains unchanged
- origin context never grants authorization

See `docs/HANAFI_BRIDGE.md`.

## Slice 6 — Account/D1 persistence foundation

**Status: BLOCKED by Cloudflare D1 binding/secrets/provider credentials where applicable.**

Goal: move identity-dependent prototype behavior into real persisted data.

Work:

- activate Better Auth against D1
- member/Hold identity
- persistent Rooms/Keys/Knocks/notices/preferences
- server-side access checks
- migration and rollback notes

Acceptance boundary: reliable sign-in/session plus persisted Folkhold identity data.

## Slice 7 — Persistent Knocks + Visitor Ledger

**Status: BLOCKED by Slice 6.**

Goal: turn the working door Knock into a real social signal.

Work:

- persisted Knock record
- sender/target/timestamp
- unread/read state
- Hall Lantern or approved Hold-themed unread signal
- Visitor Ledger
- reply/visit/block/report surfaces as approved
- duplicate/rate-limit abuse protection

Acceptance boundary: knocking another Hold creates a durable owner-visible event.

## Slice 8 — Hold Front Door Designer

**Status: READY for front-end prototype; persistence portion depends on Slice 6.**

Goal: make each Hold's public front door part of its identity.

Work in two stages:

1. local/front-end door customization prototype
2. persistent owner-saved door configuration after accounts/D1 are active

Keep generic CSS presets available so artwork is not required.

## Slice 9 — Town Crier

**Status: READY for provider/licensing research and schema prototype.**

Goal: one quiet proclamation on the Hub, not a news feed.

Work:

- current-story data model
- scheduled Cloudflare selection/update
- one major story roughly hourly
- source link
- Folkhold announcement override
- extraordinary interruption policy kept narrow
- current political/news content handled with neutral sourced summaries

Acceptance boundary: one stable proclamation at a time with traceable source and update history.

## Slice 10 — Room + Key maturation

**Status: BLOCKED in part by Slice 6.**

Goal:

- real Room creation/editing
- public/Keyed/private enforcement
- individual Keys and revocation
- Key invitation/request history
- Room-specific activity/chat where appropriate

## Slice 11 — Tavern Upstairs Rooms

**Status: BLOCKED by accounts/persistence and current provider/legal verification.**

Goal: consensual temporary paid private rooms.

Prerequisites:

- adult verification strategy
- payment-provider terms checked at implementation time
- account identity/persistence
- invitation/acceptance records
- private messaging transport

Core invariant: **invite -> acceptance -> payment -> room**. Never charge before acceptance. Video remains mutual opt-in.

## Slice 12 — Directory / People Finder maturation

**Status: ROADMAP**

Goal: strong member-controlled discovery without silently making private data searchable.

Work:

- discoverability fields
- old usernames
- hometown/school/year as user-selected fields
- mutuals
- later AI-assisted search only over explicitly discoverable information

## Slice discipline

At the end of every completed slice:

1. validate the behavior actually changed
2. update `CHANGELOG.md` if user-visible
3. update `docs/PROJECT_LOG.md`
4. update `docs/KNOWN_ISSUES.md`
5. update `docs/VALIDATION.md`
6. update roadmap/memory/Bible only when the slice changes those truths
7. advance version according to `COMPANY_BIBLE.md`
8. keep `main` as the only branch
