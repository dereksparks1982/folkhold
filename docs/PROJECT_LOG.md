# Folkhold Project Log

## 2026-10-08 — Owner-required GitHub Pages login-only Cloudflare design

- User explicitly ordered the GitHub Pages Folkhold website to remain open when the account avatar is clicked, with an in-page login window and no duplicate Cloudflare website or music proxy. Implemented targeted account UI and Better Auth bearer session transport, minimal OAuth popup and first-party callback handoff, backend-only Worker landing, and specific Test Center contracts.
- Radio, Square chat/forum, Holds, banners, icons, public Google/Cloudflare client configuration and D1 schema intentionally unchanged.
- Google 401 invalid_client remains a separate external verification issue. Automatic tests do not prove successful user login.

## 2026-10-08 — Diagnose Google 401 invalid_client (targeted OAuth test)

- Owner tried Google sign-in on the live Folkhold Cloud app and supplied screenshots of Google's `401 invalid_client` / `The OAuth client was not found`. This confirms the Google redirect is reached but provider acceptance is not working despite all 13 prior presence/readiness tests passing.
- Added a narrow Test Center check that starts an unauthenticated Better Auth Google OAuth URL, compares its public `client_id` to the value shown by Google at client creation using a pinned SHA-256, and records only a sanitized result. A temporary OAuth state may be recorded in D1; no member account is created and no cookies, OAuth state, secrets, URLs, or user data are logged.
- Do not alter Google Cloud OAuth client, existing secret values, Google consent screen, forum, chat, or Worker code before the mismatch result is established.

## 2026-10-08 — Trigger Google OAuth production credential verification

- Owner confirmed saving `GOOGLE_CLIENT_ID` as Variable and `GOOGLE_CLIENT_SECRET` as Secret under Folkhold Cloudflare Production Builds → Variables and secrets.
- This documentation-only commit triggers a Git-connected main deployment using the existing verified `npm run deploy` handoff. No credential values are stored in GitHub; no Worker code, D1, forum, or live chat is changed.
- Verify Cloudflare Workers Build success, Test Center `providers.google` runtime status, and only then attempt the real Google login browser flow. Do not equate configuration success with a completed Google login.

## October 8 — Google credential handoff through existing build variables

- The owner correctly identified that Runtime and Builds are sections of the same Cloudflare Settings page, and the `Variables and secrets` block was visible beneath Builds. The unrelated Cloudflare account Secrets Store is not needed.
- Extended the proven private `npm run deploy` helper to transfer `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to Worker runtime only as a complete pair, without plaintext repository files or build log output.
- Added mock-Wrangler tests covering complete-pair transfer and incomplete-pair nonactivation. Existing BETTER_AUTH_SECRET, D1, Global Chat, forum, and Worker source remain untouched. Live Google credentials and OAuth round trip are not verified.

## 2026-10-08 — Google-first account integration checks

- Owner chose to activate Google login before testing email registration or adding Apple OAuth.
- Inspected current backend socialProviders.google configuration and frontend OAuth redirect flow. Both already exist, so no extra auth provider, navigation redesign, or Worker behavior change was necessary.
- Extended Test Center with source-level Google OAuth flow contract and GET-only runtime Google readiness, reporting absent OAuth credentials as SKIP rather than an application failure. Documented exact authorized OAuth callback and Cloudflare runtime credential names.
- Google Cloud project/client, credential attachment, browser login, and real user profile/Hold flow remain pending owner/provider steps and live acceptance.

## 2026-10-08 — Authentication runtime prerequisite solved; D1 init smoke test

- Following owner's Cloudflare deployment-command change, commit `91fedfc` deployed and Test Center run `37820689995` confirmed `10 PASS, 0 FAIL`. Specifically, `/api/account/status` returned ready true with email enabled, showing D1 and `BETTER_AUTH_SECRET` are now available at runtime. The previous blocker is resolved.
- Next scoped candidate adds unauthenticated GET `/api/auth/get-session` to Test Center. This invokes existing Better Auth D1 schema migration if necessary but does not create accounts or touch chat/forum. Provider OAuth and signup remain unverified.

## 2026-10-08 — Trigger production validation with new secret handoff

- Owner supplied a screenshot of Cloudflare's Folkhold Production build configuration showing Deploy command `npm run deploy` and branch `main`. Settings persistence had not been independently verified.
- This documentation-only commit triggers a new Git-connected Cloudflare Workers Build. Its logs will confirm which deploy command actually executed; the Test Center will independently read production `/api/account/status` and verify unrelated endpoints.
- Runtime secret activation, database migrations, and real email/OAuth sign-in remain pending live evidence. No changes to Worker, chat, forum, secret value, or Wrangler bindings.

## 2026-10-08 — Authentication runtime secret deployment helper candidate

- Confirmed official Cloudflare support for deployment with --secrets-file; build variables do not automatically become Worker runtime secrets. Built private-temp-file deployment helper, npm script, mock-Wrangler unit tests and documentation.
- Helper changes require Cloudflare deploy command to be set to `npm run deploy` outside GitHub; existing build command remains npx wrangler deploy until then. Do not call runtime authentication fixed yet. No Worker/chat/forum source changes.

## 2026-10-08 — Test Center first slice candidate

- Added a read-only Node.js diagnostic runner and GitHub Actions workflow with downloadable logs/reports.
- The runner compares both Wrangler configs; checks declared email, Google and Apple auth paths; probes Worker runtime readiness, Pages, the Square forum and the Cloudflare build status.
- No changes to Worker, runtime bindings, authentication, user data, forum or chat. Reports never print secret values. Cloudflare and GitHub build success is not mistaken for runtime authentication success.
- Source candidate pending first real Actions run and owner acceptance.

## 2026-10-08 — Use approved Folkhold favicon on Worker API tabs

- Owner saw the outdated icon on the `workers.dev/api/account/status` browser tab. JSON responses have no HTML favicon link, so browsers fall back to requesting `/favicon.ico`, which the existing frontend proxy previously served from the older root icon.
- Worker frontend proxy now maps only `/favicon.ico` to the existing `assets/folkhold-app-icon-192.png` (gold house/keyhole). No binary artwork, page UI, existing chat/forum, account status or D1 bindings changed.
- Source syntax and route mapping checked. Browser favicon caching and live Cloudflare deployment still require owner verification.

## 2026-10-08 — Account readiness diagnostic correction

- During first post-secret validation, owner reported `ready: false` with both prerequisites listed. Found the Worker code emitted both names whenever either setting was missing, making the result ambiguous.
- Changed only `/api/account/status` to list the missing binding/secret independently. Source check covered all four binding combinations. No authentication, chat, forum, database, or secret changes.
- Await Worker deployment and second status response before troubleshooting a specific missing binding.

## 2026-10-08 — Persist Cloudflare D1 authentication binding in deployment configs

- Owner created `folkhold-auth` in D1 and connected it as Worker binding `AUTH_DB`; screenshot confirmed original `GLOBAL_CHAT` binding intact.
- Recorded identical D1 database ID, name and binding in both root and `cloudflare/` Wrangler configurations to prevent Git deployments from silently dropping the dashboard binding. No other Worker bindings, worker source, forum UI or chat logic changed.
- OAuth activation awaits a private `BETTER_AUTH_SECRET` and Google OAuth client credentials, configured by the owner in provider dashboards. Account migrations and live sign-in not yet tested or claimed.

## 2026-10-08 — Forum save error visibility candidate

- Following owner report that a new forum topic would not save, improved only the forum UI failure path: prevent composing before the backend is reachable, enforce the server's existing four-character title minimum, and show save errors inline while retaining the form content.
- Existing live chat, backend and theme unchanged. Actual Cloudflare save failure still requires Worker request/deployment evidence; no claim of a repaired backend.

## 2026-10-08 — Integrated Public Square forum source candidate

- Owner approved the native NodeBB-inspired forum built into the existing Square, with no paid forum hosting or additional navigation destination.
- Added original categories/topics/replies UI, responsive forum/chat composition and Cloudflare Worker APIs using the already-bound SQLite Durable Object, without editing `global-chat.js` or chat WebSocket behavior.
- Candidate source parsed successfully; live backend deployment, account verification, mobile/desktop checks and owner acceptance remain open.

## 2026-10-08 — v1.3.0 closeout and Square forum handoff

- Owner explicitly requested closing the most recent build, documenting all work and updating the roadmap. Selected **v1.3.0** because the scope added Wayfarer/travel functionality after accepted Radio v1.2.0, not merely patch-level CSS polish. Retained existing history rather than rewriting earlier acceptance.
- Verified the latest pre-closeout runtime head `90cb72710813a4daea5242cbbe62ede8d92852c3` and successful GitHub Pages deployment `37800022754`.
- Verified affected browser JavaScript parses, 11-button desktop UI uses **Wayfarer**, geolocation does not contain a Boston default, reported precision is disclosed, and both front doors use matching medieval markup. Browser and provider correctness remain deliberately open in validation/known issues.
- Recorded the full current user-facing scope: colored Hub cards; Settings; compact horizontal nav and Your people banner; Wayfarer name/map/travel tools; current local Hold Designer and matching Hub/Hold doors; Russian/Urdu/Pashto/Dari translator options in UI; maintained Radio/mobile footer and existing realtime Global Chat.
- Preserved outstanding infrastructure: production Better Auth/D1, Keys/Knocks, Master Key server authorization, Google AdSense disabled configuration, live routing/search/GPS provider testing and browser visual verification.
- The owner then selected a **NodeBB-like spacious, category-first forum** co-located with current Square live chat as the next design target. Added `docs/SQUARE_FORUM.md` and Slice 30: compare independently hosted NodeBB and a Folkhold-native original implementation before selecting an architecture. No NodeBB download, deployment, license copying, GitHub repo/branch creation or live chat disruption occurred.
- Closeout is owner-authorized publication of the release documentation and version; do not confuse it with independent owner-device validation of all feature states.


## 2026-10-08 — Compact navigation UI candidate; admin request recorded

- The owner specified exact eleven abbreviated desktop top-nav labels, uniform button sizing, left-mouse horizontal drag, no vertical page scrolling on hover even at scroll ends, and scroll stops showing complete buttons.
- Runtime-generated navigation, static fallback, wheel/drag logic and cache keys were updated in one source commit. The top-left Folkhold brand graphic/title are preserved, with subtitle abbreviated to “Your people”.
- No changes to accepted Radio, wallpaper, Hub cards, iPhone footer or live ads/account behavior.
- Owner requested a Federal Electric-style Admin Panel with Ads On / Ads Off and a Master Key. Recorded this as a separately gated server-authorized feature, not a client-side bypass of pending production login. First determine site-wide vs own-preview ad control and the Master Key's legitimate administrative scope.
- Actual Firefox usability and owner signoff remain outstanding.


## 2026-10-08 — Desktop overflow repair and recreational Games roadmap

- Repaired dynamic desktop navigation layout: left-started horizontal list instead of centered overflowing items; thin scrollbar complements already-existing wheel/drag code. Existing mouse Back support uses browser history push/pop, and Travel Companion location feedback and extended translation language choices were found already committed.
- All accepted artwork, Radio, mobile footer, map logic, top navigation order and colors were left intact.
- Added the owner's no-betting Games direction to the canonical roadmap, task slices and Backgammon specification. Backgammon remains AI-first, with optional additional table games requiring future owner approval. No Games code released in this documentation slice.
- Source validation performed; desktop/iPhone owner observation remains pending.

## 2026-10-08 — Hub full-color destination cards and Settings navigation
- Owner approved ten Hub shortcuts, including previously missing My Hold, Directory, Key Ring, Radio, and Settings. Each has a full-color background; corrected palette is Square blue, Notice yellow, Tavern red, Tea Room brown, Travel Companion earth green.
- Tea Room Hub icon now matches top navigation (☕), and Travel Companion uses 🧭 in its Hub card and a newly added desktop navigation item.
- Top navigation's Ads label is now Settings, opening the existing advertising-preferences dialog. Settings does not yet offer other options.
- Only scoped Hub HTML/styles and desktop navigation wiring changed. Kept existing seven-button mobile navigation, approved Radio, background, map tools, and accounts intact.
- Candidate requires owner validation on desktop and iPhone.


## 2026-10-08 — Travel Companion directions handoff provider

- As the first narrow part of a broader provider review, removed Google Maps as the external navigation handoff. Walking and driving handoffs now use OpenStreetMap Directions links while internal Valhalla road overlays stay unchanged.
- Updated routing cache key and user-visible button. External service and device review pending. No accounts, ads, hosting, Radio, or unrelated features changed.

## 2026-10-08 — Travel Companion map engine replacement

- Owner requested complete removal of the previous mapping dependency, not suppression of an attribution element.
- Rebuilt the browser map layer using **OpenLayers 10.10.0**, migrating place and GPS markers, road overlay drawing and nearby-place layers.
- Removed the former JS and CSS imports from the map loader; retained legally required OpenStreetMap map-data credit.
- Upgraded only Travel Companion map modules, scoped map styling, and their cache keys in index.html. Radio, global navigation, Hub/Hold icons and backgrounds remain unchanged.
- GitHub source parsed successfully; external CDN delivery, iOS and PC rendering, road routes and nearby selection remain owner-validation candidates.


## 2026-10-07 — Travel Companion temporary name

- Owner requested that the new travel destination be named **Travel Companion**, not the previous map-focused title.
- Updated Hub card, screen heading, accessible panel label, map feedback, Hitch subheading and current product documentation.
- Kept `gods-eye` internal identifiers, hashes and module paths stable to preserve deep links and existing functionality.
- Radio v1.2.0, seven-button swipeable navigation and approved wallpaper/icons were not touched.


## 2026-10-07 — Wayfarer candidate slices 21–24

- Implemented a road routing module using the Valhalla demo server for explicit start/end, walking/driving geometry, time/distance and optional navigation handoff.
- Implemented on-demand nearby Overpass category discovery (mosques, food, history, adventure, nightlife).
- Implemented Open-Meteo weather, Frankfurter conversion and AlAdhan Hanafi prayer times using selected coordinates. Follow-up corrected prayer-date calculations to the destination timezone before a weather request.
- Implemented MyMemory short translation, offline Turkish phrases, Fair Price using the user's own reference and a basic Hitch shared selected-place context.
- Updated the Travel Companion heading to clarify that explicit travel-data requests send coordinates to external providers.
- No account persistence, Key-to-Key location access, autonomous assistant, unverified market rates, accepted Radio/UI artwork or mobile nav changes.
- Modules compiled as JS source but third-party APIs and device behavior remain to be reviewed.


## 2026-10-07 — Travel Companion slice 1

- Following accepted v1.2.0 Radio closeout, created a dedicated Travel Companion place reachable from the Hub.
- The old separate travel prototype repository was unavailable through the connected GitHub account, so this first standalone map slice is written directly into Folkhold.
- Added lazy-loaded Leaflet map with OSM tiles, user-submitted Photon geocoding, and opt-in geolocation.
- Map/search services are prototype-grade; there is no persistent location data, background location tracking, or member-to-member routing.
- The accepted mobile nav (seven swipeable buttons), Hub and Hold icons, leather background and Radio were intentionally left untouched.
- Source candidate awaits iPhone and desktop observation.


## 2026-10-07 — v1.2.0 owner-accepted Radio closeout

- Owner explicitly said **“radio is good”** and instructed closeout before Travel Companion development.
- Accepted Radio page, persistent playback, six licensed locally hosted tracks, three station presets, SVG controls, and swipeable navigation as the v1.2.0 baseline.
- Advanced version from 1.1.0 to 1.2.0 after owner acceptance.
- Browser autoplay remains platform-dependent. No new artwork, other UI adjustments, or features were introduced in this closeout.


## 2026-10-07 — iPhone Radio single-icon and layout repair

- Owner shared an iPhone Safari screenshot confirming that Previous/Next showed two blue emoji-style arrowheads apiece, with the song title panel squeezed left.
- Replaced the transport symbols with unambiguous inline SVG: one Previous, one upward-arrow Play / Pause, and one Next. No emoji rendering.
- Removed obsolete footer-player CSS that was constraining Radio page layout; the playlist and song panel now use full page width.
- Hid phone volume slider and set phone media volume to unity so physical iPhone volume buttons are used. Desktop slider remains.
- Bumped the Radio script query string to invalidate old Safari caches.
- No changes to the accepted mobile bottom navigation, background, Hub or Hold icons.
- Pending real iPhone playback/layout acceptance.


## 2026-10-07 - Desktop tower alignment follow-up

- Owner screenshot showed the 26px desktop My Hold tower slightly too large and low relative to neighboring navigation icons.
- With explicit approval, adjusted only the desktop tower to 23px and translated it upward by 2px.
- Preserved the mobile tower and all backgrounds. Bumped the runtime script version for cache refresh.
- Pending desktop visual approval.


## 2026-10-07 - Desktop Hold icon sizing candidate

- Owner confirmed the tower symbol but noted that it rendered too small in desktop navigation.
- Raised only the desktop My Hold tower icon from the shared 16px sizing to 26px, preserving the glyph itself and iPhone sizing.
- Bumped the desktop runtime/app cache query strings. Pending visual acceptance on desktop.


## 2026-10-07 — Desktop Hold and Key-to-Key routes

- Owner screenshot exposed a runtime desktop My Hold house icon despite the accepted mobile rook/tower icon. Desktop runtime icon was changed to the identical ♜ glyph, and script cache versions advanced.
- Key-to-Key route concept: Keys unlock the ability to share a meeting destination **only on explicit opt-in**; Travel Companion should draw the actual street path from the current device GPS to the shared pin and allow navigation handoff.
- The route feature is documented and deferred until accounts, permissioned Keys and the Wayfarer map are in place.
- Original Kevin MacLeod music is now explicitly considered a **placeholder**, while authentic Persian and other tradition-specific performances are researched under a separate licensing/curation slice.
- No actual recipient address tracking, routing backend or new audio recording was deployed as part of this roadmap update.


## 2026-10-07 — Radio moves into navigation

- Derek requested Radio as one of the bottom navigation buttons, not a floating panel above them.
- Made the mobile bottom navigation horizontally swipeable for destinations that exceed screen width.
- Added a dedicated Radio screen and visible track list, preserving cross-screen music playback.
- Added Radio to the desktop top navigation.
- Corrected the existing player syntax error and unset first-run saved volume behavior.
- Approved mobile background, Hub glyph and Hold tower were preserved unchanged.
- Subsequent tracks belong under `assets/audio/music/` with playlist metadata in `radio/playlist.js`.
- Candidate awaiting owner-device validation.


## 2026-10-01 — Backgammon roadmap and Majlis bridge reconciliation

### Backgammon added to the Game Room roadmap
- Derek specified that Folkhold should include **Backgammon** with a real AI opponent first.
- The AI target is an actual evaluating/searching opponent, not a random legal-move bot wearing an AI label.
- Rules/state, AI, and presentation are to remain separate so the same rules model can later support networking.
- Local browser play is the first target and does not depend on accounts or another user being online.
- **Remote play with friends** is the later second stage, with server-authoritative dice/state, synchronized turns, reconnect/resume, and Folkhold member invitations.
- Added `docs/BACKGAMMON.md`.
- Added **Slice 13** (Backgammon vs AI) and **Slice 14** (remote play) to `docs/TASK_SLICES.md`.

### Hanafi Majlis documentation reconciled with source
- Folkhold's origin-aware half is no longer merely roadmap work.
- `hanafi-bridge.js` is loaded by the Folkhold runtime.
- `?from=hanafi` stores the Hanafi navigation origin for the browser session and adds **← Hanafi** to the Folkhold top bar.
- Direct Folkhold entry clears stale Hanafi origin context.
- GitHub Pages run `36902962625` succeeded for exact commit `98eba8af4d1a3db05640bcb26cdadbeaaefa6e41` (`Add Hanafi origin-aware return bridge`).
- The remaining bridge work is the Hanafi-side **Majlis** doorway and deployed round-trip validation.
- Updated roadmap, task slices, known issues, memory bank, Hanafi bridge docs, and validation records to tell the same story.

## 2026-09-30 — Reciprocal Hanafi / Folkhold links cleanup

### Repository presentation
- Removed the broken decorative image from the top of the Folkhold GitHub README.
- Removed the standalone centered **Open Folkhold** link from the top of the README.
- Added a normal **Links** section near the top of the README instead.
- The Folkhold Links section now points to the Folkhold Web App and to the Hanafi Learning Deck project.

### Hanafi reciprocal link
- Added **Folkhold** to Hanafi's existing Web App **Links** page rather than creating a duplicate social/community page inside Hanafi.
- The two projects now provide a direct navigational breadcrumb to one another while remaining independent applications and repositories.
- This is ordinary cross-linking only. It does **not** implement the future **Majlis** origin-aware bridge or the temporary **← Hanafi** return control.

## 2026-09-30 — UO Folkhold archive-forensics slice

### What was examined
- Read the supplied `RunUO_2.0_Final_Repack_02-03-2011.7z` and `Patch_05-27-2012.7z` without modifying the originals.
- Identified an embedded repack baseline archive inside Derek's larger working archive.
- Identified the nested 2012 patch payload.
- Generated full per-file SHA-256/size/path manifests for the embedded baseline and nested patch.
- Compared the patch Scripts tree to the embedded baseline and separately compared Derek's outer working Scripts tree to the baseline.

### Important preservation discovery
- Derek's outer RunUO archive is a preserved **working tree**, not simply the pristine 2011 package. It contains 2026 save/backup/runtime state and a later DataPath edit.
- The embedded repack archive is the better baseline reference for historical comparisons.
- Private account/save material in the outer archive is not to be published casually.

### Patch relationship
- 2012 patch vs embedded baseline Scripts: **392 added, 67 changed, 0 removed, 3,379 unchanged common files**.
- Outer working Scripts vs embedded baseline: **1 added, 44 removed, 5 changed, 3,397 unchanged common files**.
- Therefore the 2012 patch is **not applied wholesale** to Derek's current preserved working tree.
- The 2012 patch changes client enforcement and DataPath behavior, but points to a separate `C:\RunUO 2.0\World Data` directory that is not supplied by the patch archive itself.

### Client-era evidence
- The repack is configured for **Mondain's Legacy**.
- The repack's own `UPDATES.TXT` warns against using clients above **6.0.0.0** because of TID/token issues.
- The same history states the repack was originally created using **7.0.4.2**, which caused many teleporters to spawn underground; the world was then cleared/redecorated/respawned.
- Derek's preserved 2026 `DataPath.cs` explicitly points to **`uoml_setup_fully_patched_5.0.9.1`**.
- Resulting test order: **5.0.9.1 first**, controlled **6.0.0.0-era** data second/reference if needed, and do not begin with 7.x.
- Ocllo/Occlo remains a required runtime terrain/static regression location before a client is accepted.

### Linux direction refined
- The preserved `RunUO.exe` is a PE32 i386 **Mono/.NET assembly**, File/Product version `2.0.3567.2838`.
- The package does not include a complete modern core-source build tree beside it.
- First Linux strategy is therefore to attempt the preserved assembly under a compatible Mono runtime and make minimal path/runtime adaptations, not to replace or reconstruct the core before proving that necessary.
- No Mono/Linux run was claimed during this forensic slice.

### Evidence trail
- Detailed report: `docs/UO_FORENSICS_2026-09-30.md`
- Updated preservation plan: `docs/UO_FOLKHOLD.md`
- Validation evidence: `docs/VALIDATION.md`
- Task status: Slice 1 moved to **REVIEW**; Slice 2 client pinning is blocked until the candidate client/data set is available.

## 2026-09-30 — v1.1.0 closeout

### Release bookkeeping
- Folkhold now uses explicit `MAJOR.MINOR.PATCH` tracking.
- **v1.1.0** is closed as the current baseline.
- `main` remains the only authorized branch.
- Added canonical operating/documentation files: `COMPANY_BIBLE.md`, `ROADMAP.md`, `CHANGELOG.md`, and `docs/MEMORY_BANK.md`.
- Added `docs/KNOWN_ISSUES.md`, `docs/VALIDATION.md`, and `docs/TASK_SLICES.md` so future work has explicit unresolved-state, evidence, and execution records.
- Added `docs/UO_FOLKHOLD.md` for the planned Game Room shard.
- Added `docs/HANAFI_BRIDGE.md` for the planned Hanafi ↔ Folkhold Majlis doorway.

### Company-rule consolidation
- Available DKLab/Elderred Softworks Library handoffs and Company Bible excerpts were searched during closeout.
- Recovered recurring rules were distilled into Folkhold's Bible and memory bank: owner authority, approval gates, stop-immediately behavior, no guessing, read-current-docs/source first, warnings-as-errors for compiled work, behavior validation, README/release closeout law, truthful known-issue reporting, no unauthorized side projects/branches/GitHub writes, safe package/manifest/hash practices, and owner-only acceptance.
- The memory bank is explicitly a supplement to current source/docs, not a replacement for reading them.

### Desktop/navigation polish
- Desktop navigation lives at the top; the old desktop side panel is removed.
- Current desktop order: Hub, Village Square, Notice Board, My Hold, Tavern, Tea Room, Directory, Key Ring, Ads.
- Major top-of-page section headings have runtime cream backing panels over the leather background. Prior cross-device visibility trouble remains a regression item in `docs/KNOWN_ISSUES.md` rather than being forgotten.

### Generic app icon decision
- Browser/PWA/iPhone/app-icon surfaces now use a simple generic placeholder PNG set rather than repeatedly fighting the ornate FH asset on platform-specific icon surfaces.
- The approved FH artwork remains preserved as an approved brand asset and is not to be regenerated or redrawn.

### Hold front door and Knocks
- Derek's Hold uses a generic medieval CSS door with plank styling, iron bands/rivets, and a keyhole.
- Door sign: **Derek's Hold**.
- Welcome strip: **Everyone is Welcome**.
- The Hold front/foyer concept is public-facing even when individual rooms remain Keyed/private.
- Double-clicking the door asks **Do you wish to leave a knock?** with Yes/No choices.
- Derek confirmed the Knock interaction works.
- Production Knock persistence, identity, unread state, abuse controls, and owner signaling are roadmapped.

### Notification direction
- Avoid a generic modern notification bell as the only metaphor.
- Roadmap working concept: a Hold-themed **Hall Lantern** signal plus **Visitor Ledger** for personal activity such as Knocks and Key invitations. Names remain provisional until owner approval.

### Hanafi ↔ Folkhold Majlis concept
- Derek defined the projects as complementary rather than redundant: **Hanafi as the mother**, centered on learning/faith/practice, and **Folkhold as the father**, centered on community/people/gathering.
- They remain separate applications and repositories.
- The Hanafi button that opens the community side is named **Majlis**.
- `Majlis` was chosen rather than `Shura` because the site is not presenting itself as an accredited/formal religious council.
- Planned navigation: Hanafi's **Majlis** opens Folkhold's public gathering side; when Folkhold detects a Hanafi-origin visit it adds **← Hanafi** while retaining normal Folkhold navigation.
- No bridge UI was built in this v1.1.0 closeout. The design is documented in `docs/HANAFI_BRIDGE.md`.

### Advertising/private-room wording
- Removed the site-wide slogan **Advertising pays for Folkhold. Your private life does not.** because planned paid private rooms make the absolute statement inaccurate.
- Paid Tavern Upstairs Room concept remains roadmap only: invitation first, acceptance second, charge after acceptance, private text, mutual-consent video, temporary room.
- Real currencies only; no fake Folkhold currency.

### UO Folkhold roadmap
- Planned Game Room shard name: **UO Folkhold**.
- Preserve and use Derek's supplied `RunUO_2.0_Final_Repack_02-03-2011.7z` rather than replacing it with a newer emulator merely for convenience.
- Supplied later patch: `Patch_05-27-2012.7z`.
- Archive size/SHA-256 fingerprints were computed directly from the uploaded bytes and recorded in `docs/UO_FOLKHOLD.md` and `docs/VALIDATION.md`.
- Exact client version is deliberately unresolved until the repack/patch are inventoried and Ocllo/Occlo terrain/static behavior is tested.
- Linux adaptation and Folkhold Game Room integration remain separate later slices.

### Work-slicing rule
- Roadmap implementation is now broken into explicit slices in `docs/TASK_SLICES.md`.
- Each slice is expected to leave its own source changes, validation evidence, known-issue updates, and project-history breadcrumbs.
- UO archive forensics is the first READY deep-work slice after closeout; Hanafi Majlis bridge is separately ready once the Hanafi repository/deployment is verified.

### Method refinement
- Runtime-injected styles/scripts must be checked when static CSS changes appear ineffective.
- Source deployment and visible browser deployment are separate states; do not report the latter until verified.
- Do not image-generate unless Derek explicitly asks for a picture/image edit.
- Generic placeholders are acceptable and preferred over repeatedly producing bad approximations.
- Every accepted patch/add-on now updates version/documentation records.
- `docs/VALIDATION.md` distinguishes implemented, deployed, observed, validated, and accepted states.

## 2026-09-30 — Version 1 closeout

### v1 baseline
- **Folkhold v1.0.0 closed out as the initial baseline.**
- GitHub `main` is the authoritative branch.
- The Hub, My Hold, Public Square / Global Chat, Notice Board, Tavern, Tea Room, Directory, Key Ring, advertising shell, branding system, GitHub Pages frontend, and Cloudflare backend foundation are part of the v1 baseline.
- Global Chat is live through Cloudflare WebSockets / Durable Objects.
- Better Auth account UI/backend is staged, but D1 and deployment secrets are still required before account activation.

### Hub and navigation
- The main Folkhold landing page is called the **Hub**.
- Holds retain their separate personal-space identity.
- Earlier v1 work removed/neutralized the desktop left navigation panel before the navigation was subsequently moved fully to the top in v1.1.0.

### Post-v1 direction
- The first planned post-v1 feature was the **Town Crier**.
- Town Crier belongs front-and-center on the Hub rather than as a separate news section.
- Intended behavior: roughly one significant world story per hour, quiet between proclamations, with a short summary and source link.
- Folkhold announcements can replace an hourly world story when needed.
- Truly extraordinary alerts may interrupt the current proclamation, but the feature must not evolve into a continuous news feed or dedicated news app.

## 2026-09-30 — Brand naming and icon handling

### Brand name
- Official product/brand spelling: **Folkhold** — one word.
- Do not change the brand to “Folk Hold” unless Derek explicitly authorizes a later naming change.

### Approved FH brand artwork
- The approved brand artwork is the current borderless FH monogram approved by Derek in the Folkhold project.
- Do **not** redesign, redraw, reinterpret, crop, recolor, or otherwise alter the FH artwork unless explicitly authorized.
- Preserved approved-source fingerprint from the v1 documentation:
  - Format: PNG
  - Dimensions: 1254 × 1254
  - Color mode: RGB
  - Byte size: 2,470,630 bytes
  - SHA-256: `137acd3927def8cf7c2e2250c15a13f6f16d1c2a16b47e7d949e3f99c234c2a3`

### Binary-safe image / favicon procedure
When adding or replacing Folkhold image assets:
1. Treat PNG/ICO image assets as **binary files**, not UTF-8 text.
2. Do not pass binary image contents through the normal text-file updater.
3. Before upload, verify source dimensions, byte size, and SHA-256 hash.
4. Upload binary assets through a binary-safe Git/GitHub path and verify the stored file after upload.
5. Generate platform-specific sizes only from an approved source when artwork is being used; redesigning is not allowed without explicit permission.
6. Verify browser favicon, manifest, Apple touch icon, in-app slot, and social preview separately.
7. Verify manifest `sizes` metadata matches actual dimensions.
8. Account for browser/PWA/iOS caching before diagnosing a deployed icon as unchanged.
