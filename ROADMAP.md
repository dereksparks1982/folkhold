# Folkhold Roadmap

This roadmap is the current planning record. Items are not implementation authorization by themselves.

## Current baseline

- **v1.1.0** is the current closed baseline.
- GitHub `main` is authoritative.
- Desktop navigation is top-centered, the desktop side rail is gone, the app/browser icon uses a generic placeholder, room/page heading panels are readable, and Derek's Hold has a generic medieval CSS door with a working double-click Knock interaction.
- Folkhold documentation now follows explicit version/change/validation/memory records so the project leaves breadcrumbs instead of relying on conversation history alone.

## 1. Hold presence, Knocks, and a better notification model

A normal modern bell icon is functional but thematically weak. Folkhold should make personal activity feel like something happening at your Hold.

### Working concept: Hall Lantern + Visitor Ledger

- An unread Knock lights a small **Hall Lantern** or otherwise changes a Hold-themed status indicator.
- Selecting it opens a **Visitor Ledger** rather than a generic notification drawer.
- The ledger can eventually contain Knocks, Key invitations, accepted/revoked Keys, private-room invitations, game invitations, and other direct Hold activity.
- Broadcast/world information stays with the Town Crier rather than being mixed into personal Hold activity.
- Exact naming and final visual treatment remain owner decisions.

### Knock persistence

The current Knock interaction is a working browser prototype. Production work needs:

- account identity attached to a Knock
- persisted Knock records
- timestamp/read state
- owner notification/signal
- optional reply, visitor profile/Hold link, block/report controls
- duplicate/rate limiting and abuse controls

## 2. Hold Front Door Designer

A Hold's front door should be a public identity surface that every visitor sees.

Planned customization can include:

- generic medieval door style presets
- wood/stone/metal palette
- arch/door shape
- iron bands, hinges, knocker, handle/keyhole
- name plate text
- welcome phrase
- open/closed visual state

The default can remain code/CSS based. Final artwork is optional rather than required.

**Access model:** the front door/foyer may be open to everyone while individual Rooms still enforce public, Keyed, or private access. Derek's default message is **Everyone is Welcome**.

## 3. Account activation and persistent Folkhold data

The staged Better Auth work still needs production activation:

- Cloudflare D1 binding
- deployment secrets
- Google/Apple credentials if those providers remain enabled
- member/Hold identity tables
- persistent Rooms, Keys, Knocks, notices, preferences, games, and moderation state
- access-control checks enforced server-side rather than only in UI

## 4. Hanafi ↔ Folkhold Majlis bridge

Hanafi and Folkhold remain independent sites but deliberately open doors into one another.

- Hanafi's intentional community doorway is named **Majlis**.
- Hanafi now links Majlis to Folkhold's Village Square with `?from=hanafi` origin context.
- Folkhold recognizes that origin, stores it for the browser session, and displays **← Hanafi** while the origin context is active.
- Normal Folkhold navigation remains unchanged.
- The origin marker is navigation context only and never grants Keys, authentication, moderation rights, or Room access.
- A normal direct Folkhold visit clears the Hanafi-origin context and does not show the return control.
- Source and deployment work are complete on both sides; owner round-trip observation is the remaining acceptance check.

See `docs/HANAFI_BRIDGE.md`.

## 5. Town Crier

Town Crier stays front-and-center on the Hub and must not become a news application.

- roughly one significant world story per hour
- short proclamation plus source link
- quiet between proclamations
- Folkhold announcement can replace a normal hourly story
- extraordinary emergency interruption only for truly exceptional situations
- same proclamation for everyone, not personalized
- Cloudflare scheduled worker fetches/selects/stores the current proclamation

## 6. Tavern: private Upstairs Rooms

A future paid Tavern feature for two consenting adults who want a temporary private space without exchanging outside contact information.

Required flow:

1. One person selects **Invite Upstairs**.
2. The other person sees and accepts or declines the invitation.
3. **No charge occurs before acceptance.**
4. After acceptance, the inviter pays the real displayed room price.
5. Temporary private text opens immediately.
6. Video remains off until both participants explicitly enable it.
7. Either participant may disable video or leave at any time.
8. The room expires unless extended.

Payment principles:

- real currencies only
- localized supported currency at checkout where available
- settlement to the owner's selected supported currency
- keep the base room inexpensive enough that moving to an outside free service is not the obvious choice
- adult-capable payment provider and age-verification requirements must be rechecked immediately before implementation

## 7. Game Room: UO Folkhold — deferred

UO Folkhold is intentionally deferred until higher-priority Folkhold work is farther along. When resumed, it remains a private/free Ultima Online shard built from Derek's preserved **RunUO 2.0 Final Repack** rather than replacing it with a newer emulator simply because newer software exists.

Primary goals:

- preserve the behavior and feel of the preferred RunUO 2.0 repack
- determine and pin the exact compatible classic UO client/data set
- eliminate terrain/ground mismatches, including the kind of Ocllo/Occlo visual mismatch caused by client/map-data changes
- port or compatibility-adapt the server to Linux
- prove the shard works standalone before embedding its launcher/status/join flow into Folkhold's Game Room

See `docs/UO_FOLKHOLD.md` for the preservation baseline, client-compatibility gate, and Linux-port plan.

## 8. Game Room: Backgammon

Folkhold should include a proper playable **Backgammon** table.

### Stage A: player vs real AI

The first version is local browser play against a genuine computer opponent, not a random-move bot.

- complete legal backgammon move generation and validation
- dice, doubles, bar entry, bearing off, blocked points, turn sequencing, win detection, gammons/backgammons where match scoring uses them
- separate rules engine from presentation so the AI and future remote transport share the same authoritative game model
- AI evaluates board positions and legal move sequences and searches alternatives before choosing a move
- difficulty can later adjust search depth/evaluation strength without making low difficulty intentionally nonsensical
- no account, server, or network dependency for the first playable AI version

### Stage B: remote play with friends

Remote play comes later after identity/persistence/realtime foundations are ready.

- invite another Folkhold member to a match
- server-authoritative dice and game state
- synchronized legal moves
- reconnect/resume
- match invitations surfaced through the Hold activity / Visitor Ledger system
- optional private/public tables later

The target sequence is therefore **real AI first, remote play with friends later**.

See `docs/BACKGAMMON.md`.

## 9. Room system maturation

- real Room creation/editing
- Room-specific permissions
- public/Keyed/private states
- Room membership/activity indicators
- Room-specific live chat where appropriate
- optional media/game integrations without turning every Room into the same template

## 10. Keys

- unique per-person Keys
- granular Room permissions
- revoke one Key without changing anyone else's access
- issuance/acceptance history
- Key requests and invitation flow
- clear distinction between account login and Hold access

## 11. Directory and discovery

- member-chosen discoverability fields
- old usernames
- hometown/school/year and other user-approved fields
- mutuals
- future AI People Finder restricted to information members explicitly chose to make discoverable

## 12. Folkhold Radio and shared audio system

Folkhold should have one persistent radio/music layer rather than page-specific audio islands.

- **Radio** is a separate Folkhold place; the mobile bottom navigation scrolls horizontally, and the player does not float above it
- previous, play/pause, next, track information, seek, volume, and a visible selectable playlist
- playlist continues while navigating between Folkhold screens; only player controls are inside the Radio place
- the first/default opening theme is **Ibn Al-Noor** by Kevin MacLeod
- attempt audible autoplay on initial load; when browser policy blocks it, the first user gesture starts playback
- playlists are data-driven, with **All Music**, **Eastern Roads** and **Medieval Hall** presets and six locally hosted, licensed tracks; future authorized recordings use the same organized import process
- all sound assets stay organized under `assets/audio/music`, `ambience`, `sfx`, or `voice`
- radio styling belongs to Folkhold rather than copying Federal Electric's 1930s radio face
- only audio with usable provenance/licensing belongs in the public Folkhold repository

See `docs/AUDIO_RADIO.md`.

## 13. Wayfarer / Travel Copilot

Fold the useful Midlife Crisis travel prototype into Folkhold as a first-class place rather than maintaining a competing standalone app.

Initial scope:

- **God's Eye** map with live location and place search
- nearby mosques, food, history, adventure and nightlife
- live exchange rates and weather
- Hanafi-aware prayer times
- English ↔ Turkish conversation translation, with additional languages later
- **Fair Price** mode that separates objective conversion from evidence-based local valuation and reports weak/no data plainly
- lightweight **Hitch** social coaching: language/cultural context and a few tools without scripting the user's entire interaction
- one shared travel assistant that can use trip state/location/context instead of many unrelated mini-assistants
- later connection to Folkhold itself, such as asking the Square/local Holds for current local knowledge
- phone-first responsive UI; mobile bottom navigation now supports horizontal swiping, but start Wayfarer with a Hub/desktop entry point
- reuse the `midlifecrisis` prototype as a source pool until the Folkhold implementation is accepted

Trust rule: live prices, laws, schedules and local facts need current evidence. The assistant must not manufacture a confident answer when the data layer does not support one.

## 14. Documentation and release discipline

For every accepted patch/add-on/feature:

- update `CHANGELOG.md`
- update `docs/PROJECT_LOG.md`
- update README when the current user-visible state changes
- update this roadmap when future scope changes
- add or update a feature-specific document for substantial subsystems
- update `docs/KNOWN_ISSUES.md` and `docs/VALIDATION.md` when applicable
- record repeatable lessons in `docs/MEMORY_BANK.md` and, when they become operating law, `COMPANY_BIBLE.md`

## Execution slices

The ordered work breakdown lives in `docs/TASK_SLICES.md`. It is intentionally sliced so each feature can be built, checked, documented, and accepted without turning Folkhold into one giant mystery commit.
