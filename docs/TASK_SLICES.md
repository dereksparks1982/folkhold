# Folkhold Task Slices

This file turns the roadmap into small, finishable pieces. Each slice should be inspected, implemented, validated, documented, and closed before the next slice expands the surface area.

Status values:

- **CLOSED** — accepted baseline/history
- **REVIEW** — work/evidence is complete enough for Derek to review, but only Derek can accept/close it
- **READY** — can be taken next without another dependency
- **BLOCKED** — needs a prerequisite or owner-provided external credential/resource
- **ROADMAP** — intentionally not active yet

## Slice 0 — v1.1.0 documentation and closeout

**Status: CLOSED**

Scope completed:

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

The exact v1.1.0 closeout commit deployed successfully through GitHub Pages.

## Slice 1 — UO Folkhold archive forensics

**Status: REVIEW**

Goal: understand the exact preserved RunUO package before changing it.

Completed work:

- verified both supplied outer archive hashes
- identified and fingerprinted the embedded repack baseline
- identified and fingerprinted the nested 2012 patch payload
- generated full regular-file SHA-256/size/path manifests for baseline and patch
- diffed 2012 patch Scripts against the embedded baseline
- distinguished Derek's later outer working tree from both the baseline and patch
- inspected `UPDATES.TXT`, `DataPath.cs`, `ClientVerification.cs`, `CurrentExpansion.cs`, `MapDefinitions.cs`, `ServerList.cs`, and executable identity
- recovered direct evidence that the repack authors warned against clients newer than `6.0.0.0`
- recovered direct evidence that `7.0.4.2` had caused underground teleporter/world-placement problems
- found Derek's preserved 2026 DataPath pointing at `uoml_setup_fully_patched_5.0.9.1`
- narrowed the runtime client matrix to **5.0.9.1 first**, with a controlled **6.0.0.0-era** data set as the second/reference test
- documented the missing separate `World Data` expectation in the 2012 patch
- documented that the preserved `RunUO.exe` is a Mono/.NET assembly, making direct Mono runtime testing the first Linux strategy

Evidence: `docs/UO_FORENSICS_2026-09-30.md` and `docs/UO_FOLKHOLD.md`.

Acceptance boundary: forensic evidence and client test matrix only. No patch was applied, no client was declared accepted, and no Linux runtime claim was made.

## Slice 2 — UO Folkhold client pinning

**Status: BLOCKED until the candidate UO client/data set is available for runtime testing.**

Goal: prove one exact client/data set against the preserved server.

Candidate order:

1. **UO ML 5.0.9.1** — strongest exact breadcrumb in Derek's preserved working tree
2. **controlled 6.0.0.0-era data** — boundary/reference comparison if needed
3. do not begin with 7.x; the repack itself documents 7.0.4.2 world-placement failures

Work:

- test candidate client/data sets deliberately
- validate login, character creation, movement, packets, map loading
- use Ocllo/Occlo as a required terrain/static regression location
- validate additional locations so a one-town coincidence cannot pass
- record client executable version and hashes of accepted data files
- freeze the accepted client package against auto-patching

Acceptance boundary: exact client/data baseline documented with runtime evidence.

## Slice 3 — UO Folkhold Linux/Mono runtime adaptation

**Status: BLOCKED by candidate client/data availability for full validation.**

Goal: run the preferred RunUO 2.0 repack on Linux while preserving its behavior.

Current forensic direction:

- first attempt the preserved `RunUO.exe` under a compatible Mono runtime
- adapt filesystem/config/runtime assumptions minimally
- do not reconstruct or replace the core before proving the preserved assembly cannot be used
- rebuild script cache from source rather than treating the old `Scripts.CS.dll` as the Linux target

Validation work:

- world/scripts load
- accounts/login
- networking
- saves/restart
- clean shutdown
- Ocllo/Occlo and other map checks with the pinned client

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

**Status: READY. Simple reciprocal links are already in place; origin-aware Majlis behavior remains to be built.**

Goal: connect the two sites without merging them.

Foundation already completed:

- Folkhold README has a normal Links section linking the Folkhold Web App and Hanafi Learning Deck
- Hanafi's existing Web App Links page has a Folkhold card
- this cross-linking grants no authorization and carries no origin state

Remaining work:

- Hanafi adds **Majlis** as the intentional community doorway
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
7. advance version according to `COMPANY_BIBLE.md` when a release/version boundary is actually reached
8. keep `main` as the only branch
