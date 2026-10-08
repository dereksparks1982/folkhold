# Folkhold Task Slices

This file turns the roadmap into small, finishable pieces. Each slice should be inspected, implemented, validated, documented, and closed before the next slice expands the surface area.

Status values:

- **CLOSED** — accepted baseline/history
- **REVIEW** — work/evidence is complete enough for Derek to review, but only Derek can accept/close it
- **READY** — can be taken next without another dependency
- **BLOCKED** — needs a prerequisite or owner-provided external credential/resource
- **ROADMAP** — intentionally not active yet
- **DEFERRED** — deliberately parked while higher-priority Folkhold work proceeds

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

**Status: DEFERRED (forensic work preserved; no further UO work is a current priority)**

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

**Status: DEFERRED.**

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

**Status: DEFERRED.**

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

**Status: DEFERRED.**

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

**Status: READY. Folkhold's origin-aware return half is implemented; Hanafi's intentional Majlis entry remains.**

Goal: connect the two sites without merging them.

Foundation completed:

- Folkhold README has a normal Links section linking the Folkhold Web App and Hanafi Learning Deck
- Hanafi's existing Web App Links page has a Folkhold card
- Folkhold loads `hanafi-bridge.js`
- entry with `?from=hanafi` stores Hanafi origin in session storage
- Folkhold displays **← Hanafi** while that origin context is active
- clicking the return clears the origin context
- a normal direct Folkhold entry clears the Hanafi context
- this navigation context grants no authorization

Remaining work:

- Hanafi adds **Majlis** as the intentional community doorway
- Majlis opens Folkhold's public gathering destination with the Hanafi origin marker
- verify the complete round trip from the deployed Hanafi site on desktop and mobile

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

## Slice 13 — Backgammon: player vs real AI

**Status: READY**

Goal: add a proper Backgammon table to the Folkhold Game Room that is worth playing even when nobody else is online.

Stage-A requirements:

- complete legal move/rule engine
- dice and doubles
- bar entry and blocked points
- bearing off
- legal move-sequence enumeration for a roll
- win detection and scoring foundations
- UI separated from the game-state/rules engine
- genuine AI opponent that scores positions and searches legal move sequences rather than choosing randomly
- deterministic test positions for move legality and AI decisions
- playable entirely in the browser without account or network dependencies

Design direction:

- keep the first AI self-contained and reliable
- do not fake intelligence with random weighted moves
- expose difficulty later by changing search/evaluation strength, not by breaking rules
- keep the engine architecture reusable for remote matches

Acceptance boundary: Derek can play a complete legal game against an AI opponent from Folkhold.

See `docs/BACKGAMMON.md`.

## Slice 14 — Backgammon: remote play with friends

**Status: BLOCKED by Slice 6 and a validated Slice 13 rules engine.**

Goal: allow two Folkhold members to play the same Backgammon game remotely.

Future work:

- member-to-member match invitation
- server-authoritative dice and match state
- legal-move validation on the server side
- realtime synchronized turns
- reconnect/resume
- match invitation surfaced through the Hold activity / Visitor Ledger system
- optional public/private tables later

Acceptance boundary: two authenticated Folkhold members can complete the same match from separate browsers without state divergence.

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


## Slice 15 — Folkhold Radio + organized audio

**Status: CLOSED (accepted in v1.2.0 October 7, 2026)**

Goal: one persistent Folkhold music player with a clean audio-asset layout.

Candidate implemented:

- `radio/playlist.js` is the single playlist manifest
- `radio/player.js` owns playback/UI behavior
- revised candidate: controls and playlist now live on the Radio screen, selected from the swipeable mobile bottom navigation or desktop top navigation
- previous / play-pause / next / current track / seek / volume
- playback still survives normal screen navigation, because the audio object remains alive in the single-page shell
- **Ibn Al-Noor** is track 1 and the default opening theme
- initial load attempts autoplay
- if the browser blocks audible autoplay, first user interaction retries automatically
- uploaded MP3 moved byte-for-byte from loose `assets/` into `assets/audio/music/ibn-al-noor.mp3`
- audio folder rules documented for music, ambience, SFX and voice

Acceptance: owner expressly approved Radio on October 7, 2026; browser autoplay remains dependent on device policy.

See `docs/AUDIO_RADIO.md`.

## Slice 16 — Wayfarer / Travel Copilot integration

**Status: IN PROGRESS (Travel Companion core-map candidate built; other travel components remain separate slices)**

Goal: fold the useful Midlife Crisis travel prototype into Folkhold.

First build:

- Hub/desktop entry point without expanding the permanent five-button mobile footer
- Travel Companion map and live location
- nearby places/discovery
- exchange rate and weather
- Hanafi prayer times
- English/Turkish two-way conversation translation
- Fair Price evidence/confidence layer
- Hitch/social helper
- shared travel context
- hooks for later Ask the Square / local Folkhold knowledge

The existing `dereksparks1982/midlifecrisis` repository is a prototype/source pool, not the long-term product home.


## Slice 17 — Curated Folkhold Radio stations

**Status: CLOSED (accepted in v1.2.0 October 7, 2026)**

- Keep the existing swipeable seven-button mobile bottom navigation and standalone Radio page.
- Add All Music, Eastern Roads and Medieval Hall station filters.
- Curate six Kevin MacLeod recordings licensed CC BY 4.0, retaining Ibn Al-Noor as the opening/default.
- Preserve attribution and origin URLs in `THIRD_PARTY.md`.
- Import approved MP3s into `assets/audio/music/` through a scoped GitHub Actions workflow.
- Provide official composer-hosted fallback only if a local song is missing.
- Verify next/previous, station-switch, track selection, and global audio continuity.

Source/import verified: GitHub Actions [run 37694240022](https://github.com/dereksparks1982/folkhold/actions/runs/37694240022) succeeded. All six organized MP3 assets are present. Owner expressly accepted the completed Radio candidate on October 7, 2026.


## Slice 18 — Key-to-Key Travel Companion navigation

**Status: ROADMAP / BLOCKED by identity + Keys persistence and Wayfarer map.**

Goal: after two members exchange Keys, let a member request a real street route from their current position to the other member's **explicitly shared** destination.

Stages:

1. UI/data contract for per-Key **Share meeting point / Share destination**, revocation and optional expiry. A Key exchange by itself reveals no position/address.
2. Road-level routing adapter on Travel Companion, with walking/driving distance, ETA, polyline/road geometry and route state (not a straight line).
3. Key Ring and Travel Companion **Directions** controls; live starting GPS is local to the requesting device and only sent to the chosen router on request.
4. Optional Google Maps/other navigation handoff for turn-by-turn guidance.
5. Authenticated server enforcement, mutual relationship check, permission deletion/revocation and mobile tests.

Acceptance: two distinct accounts exchange Keys; one explicitly shares a destination; the recipient sees an actual road route on iPhone; revoking the location or Key removes access; no address leaks before opt-in.

## Slice 19 — Authentic cultural Radio catalog

**Status: RESEARCH / READY for licensing-and-curation work.**

- Current CC BY instrumentals remain acceptable temporary placeholders, not the long-term Folkhold soundtrack.
- Research authentic Persian, Arabic, Anatolian/Turkish and Nordic recordings with enough quality and cultural identity to be distinct from common video-game library tracks.
- Verify **recording** redistribution permission, not just traditional composition status or a YouTube upload.
- Maintain an organized candidate/approved catalog with musician and source credits, native titles, cultural description, sound files and licenses.
- Replace/add recordings in self-contained curated slices only when legally usable assets are confirmed.
- Do not replace the current opening theme without owner approval.


## Slice 20 — Travel Companion core map and search

**Status: REVIEW (candidate; owner PC/iPhone validation pending)**

- Add a Travel Companion card on the Hub, opening its own Folkhold page.
- Lazy-load Leaflet map, show OSM world tiles and attribution, support pan/zoom.
- Add button-initiated GPS position marker with permission/denial/error states, no automatic location access or storage.
- Add user-submit Photon place search, up to five selectable results, in-session cache and a per-tab query cooldown.
- Preserve accepted seven-button mobile navigation, Hub/Hold icons, leather artwork and v1.2.0 Radio.
- Document public map/geocoding usage constraints and plan scalable provider selection.

Acceptance checks: Travel Companion opens on desktop/iPhone; a user can pan, search/select places and request or deny their own location. No location prompt occurs until requested.

Next slices: street route geometry, nearby discovery and travel tools; Key-to-Key shared destinations remain gated by accounts/Keys and explicit sharing.


## Slice 21 — Travel Companion routes

**Status: REVIEW; live provider and owner-device validation pending**

Start/destination selection, walking/driving routes using Valhalla demo GeoJSON road geometry, duration/distance, optional Google Maps navigation handoff. No actual Key-holder locations involved.

## Slice 22 — Nearby places

**Status: REVIEW; provider/device validation pending**

On-demand Overpass category discovery: mosques, food/cafés, history, adventure and nightlife. Bounded request radius, limited markers and selectable list. OSM listings may be inaccurate/incomplete.

## Slice 23 — Travel essentials

**Status: REVIEW; provider/device validation pending**

On-demand Open-Meteo weather, Frankfurter reference currency conversion, AlAdhan Hanafi prayer times with method selection. No inferred retail prices, real bank fees or guaranteed official mosque schedules.

## Slice 24 — Language, Fair Price and Hitch context

**Status: REVIEW; provider/device validation pending**

Short MyMemory translation for English/Turkish plus selectable Arabic/Persian/French, offline Turkish phrasebook, quoted vs user-supplied known benchmark, selected-place context for Hitch. Full LLM conversation and verified local prices are NOT implemented.

## Slice 25 — Harden Wayfarer and add genuine AI Hitch

**Status: ROADMAP / dependent on provisioned providers and privacy design**

Replace shared demo routing/discovery endpoints with scalable providers; verify iPhone UX. Add trip memory only with consent, researched local-price evidence and conversational AI Hitch. Key-to-Key GPS directions remain blocked on account/Key authorization.

## Slice 26 — Folkhold Games destination, recreational games only

**Status: ROADMAP; owner selection and implementation gate pending.**

- Extend the existing Backgammon AI-first and remote-match plan into a discoverable **Games** area once the owner approves the UI/position.
- Consider checkers, chess, mancala and other traditional games only after owner selects titles.
- Prohibit gambling outright: no bets, stakes, buy-ins, prize pools, wagering tokens, real or virtual currency transfers, or wager-based mechanics. Win/loss scores only.
- Do not claim a uniform religious ruling for dice games, as scholarly views differ.
- Preserve Radio, travel tools, seven-button mobile navigation and approved leather artwork until separately authorized to change them.
- Source for owner decision: https://github.com/dereksparks1982/folkhold/issues/2

**Acceptance boundary:** scope and visual entry point approved before Games UI implementation; no actual game added by this documentation slice.

## Slice 27 — Compact desktop navigation, whole-button carousel

**Status: REVIEW (candidate, owner desktop validation required).**

- Use precisely eleven desktop nav shortcuts in this order: Hub, Square, Notice, Hold, Tavern, Tea Room, Directory, Key Ring, Radio, Travel, Settings.
- Every desktop top-nav button is 108px wide and 44px high, preserving existing icons and Tavern age indicator.
- Resize nav viewport to fit an integral number of buttons; snap wheel and mouse-drag navigation to whole-button positions.
- Intercept mouse-wheel events above desktop nav even at its ends: the page must not scroll vertically while hovered there.
- Shorten only the top-brand subtitle to “Your people”.
- Preserve the mobile bottom navigation, approved Radio, leather wallpaper, and Hub destination cards.
- Owner acceptance: test Firefox wheel scrolling (including both limits), left-mouse drag, full button visibility at several PC widths, mouse Back, and no unexpected iPhone changes.

**Source commit:** `64ac58ae4c08f17c8e70a610b38e00fbaa47ddaf`.

## Slice 28 — Server-authorized Administration Panel and Master Key

**Status: BLOCKED (production identity and privilege backend prerequisites).**

- Owner-only admin entry point, master-level site-administration authorization distinct from member Keys.
- First confirmed control: Ads On / Ads Off, with ads visible by default for owner review until explicitly turned off; owner can return to ad preview.
- Define whether ad toggle is owner-preview-only or site-wide before implementing behavior.
- Require verified server-side session, role checks, permissions and audit logging. Never secure the admin using localStorage, hardcoded email or public JavaScript secrets.
- Document exact Master Key administrative scope, especially any user-private-content boundary, with owner approval before shipping.

**No admin panel, Master Key privilege, or ad behavior is implemented by Slice 27.**
