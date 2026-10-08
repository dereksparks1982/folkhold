## 2026-10-08 — Google OAuth client identity diagnostic candidate

- Google browser screenshot: `401 invalid_client`, `The OAuth client was not found`. Last Test Center passed presence checks, not the real OAuth round trip.
- Added a Test Center check to initiate one Google OAuth authorization URL and compare its public client ID with SHA-256 derived from the Google Console creation screenshot. No password, token, secret, OAuth state or redirect URL is displayed in the report. This check may create one temporary OAuth state record in D1 but no account.
- **Pending:** GitHub live run; if an ID mismatch is confirmed, correct the Cloudflare Build Variable. If IDs match, inspect Google's registered client details and the live browser OAuth request before further changes.

## 2026-10-08 — Google OAuth runtime credential handoff candidate

- Extended only the existing Wrangler secure deployment script and mock-Wrangler tests, not Worker business logic, site frontend, database configuration or chat/forum endpoints.
- With both Google build credentials present, the helper uploads them as private runtime bindings. With one or neither, it does not enable half-configured Google OAuth; existing Better Auth runtime secret continues to deploy.
- Tests additionally check complete-pair presence, private-file mode, cleanup, no inherited Google credentials in subprocess, and no credential values in stdout/stderr.
- Pending actual GitHub Actions unit-test result, next Cloudflare production deployment after owner saves the Google Client Secret, runtime provider readiness and browser OAuth test.

## 2026-10-08 — Google-first readiness candidate

- Confirmed from current source that `socialProviders.google` requires both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, while frontend posts to Better Auth social sign-in then redirects to the provider URL.
- Google OAuth callback is `https://folkhold.dereksparks1982.workers.dev/api/auth/callback/google`, per Better Auth's default callback scheme and Google exact redirect URI requirement.
- Added two automated Test Center checks, one static source-contract and one read-only runtime provider check. Google provider not configured yet is SKIP, not FAIL.
- **Pending:** first new GitHub Action run, Google Cloud Web application OAuth client, credentials in Cloudflare runtime, successful provider redirect and profile/Hold provisioning. No account or OAuth requests were performed.

## 2026-10-08 — Runtime authentication ready and D1 initialization candidate

- Verified GitHub Actions Test Center run `37820689995`: **10 PASS, 0 FAIL, 0 SKIP** (log obtained through GitHub). Runtime auth test returned `Runtime ready; enabled providers: email` and all forum/frontend checks passed.
- GitHub Cloudflare Workers Builds reported success on commit `91fedfc`. The earlier missing secret is no longer reported in production.
- Added an unauthenticated GET `/api/auth/get-session` smoke check; Better Auth may initialize missing database tables on first access. This check is pending a fresh live GitHub Action run. No member account is created, and no login secrets are collected.

## 2026-10-08 — Production runtime-secret deploy trial

- The owner showed `npm run deploy` in Cloudflare's Production deploy-command field. This commit provides a clean new GitHub `main` push to exercise that configuration.
- **Pending evidence:** Cloudflare build log must show the actual command and success; Test Center must show runtime readiness. Displaying a field value is not proof it was saved/applied.
- No application logic or credentials modified for this trial.

## 2026-10-08 — Auth runtime deployment helper candidate

- Source candidate: private temporary-file secret handoff using Cloudflare-supported wrangler deploy --secrets-file, no credential values stored in git or public configs.
- GitHub Test Center now includes mock-Wrangler unit tests. Pending first Actions run and real Cloudflare deployment after owner changes Deploy command to npm run deploy.
- Existing Worker, D1, Global Chat and forum source unchanged; ready:true not yet demonstrated.

## 2026-10-08 — Folkhold Test Center first-slice candidate

- Read current Company Bible, docs, and existing Worker/Better Auth configuration.
- Introduced read-only source/runtime runner and on-push/manual GitHub workflow, with reports saved on failure.
- No secrets, DB writes, test posts or account creation. Tests are HTTP GET and source file comparisons.
- Pending: first GitHub Actions artifact, live Worker status results, real email/Google/Apple authentication. Do not mark previously missing runtime secret as fixed.

## 2026-10-08 — Approved icon for Cloudflare API tabs

- Inspected current HTML, web manifest and runtime favicon source: the main application already loads approved gold house/keyhole PNG while API pages default to `/favicon.ico` (older file).
- Modified only the existing Worker frontend proxy's favicon fallback to serve the approved PNG asset. Verified JS syntax and path mapping for `/favicon.ico`, `/api/forum/categories` and `/`.
- **Not validated:** deployed Worker favicon response, browser caching, physical Firefox/iPhone display. User may need to close/reopen the API tab after deployment.
- The owner-reported account status now lists **only `BETTER_AUTH_SECRET`** as missing, confirming `AUTH_DB` is present in the running Worker. This icon patch does not alter either binding.

## 2026-10-08 — Precise account-status prerequisite reporting

- Confirmed the previous account-status function always listed **both** D1 and auth secret if either was absent; the reported `ready: false` alone did not establish which prerequisite was missing.
- Source patch changes only the status endpoint's `needs` calculation. Tested four combinations: neither present, only D1, only secret, both present. Modified Worker parsed successfully.
- `authConfigured`, Better Auth, Global Chat, forum routes, Wrangler D1 bindings and secret values remain untouched.
- **Pending:** Cloudflare Worker build/deploy, remotely reading updated `/api/account/status`, actual authentication initialization. GitHub Pages success is not proof of Cloudflare Worker update.

## 2026-10-08 — Account D1 binding configuration candidate

- Verified owner screenshot identifies D1 `folkhold-auth` and a dashboard `AUTH_DB` binding, with `GLOBAL_CHAT` preserved.
- Added the same binding to both Wrangler configurations. Parsed both as JSON; verified required `binding`, `database_name`, and `database_id`; checked the remainder of each configuration was byte-semantic-equivalent before/after.
- **Pending:** automatic Cloudflare deployment status, remote Worker `/api/account/status`, `BETTER_AUTH_SECRET` setup, Better Auth schema initialization, Google credentials and OAuth browser test. Source validation is not live login verification.

## 2026-10-08 — Square forum unsuccessful-save UI diagnostic patch

- Confirmed current source permits topic composition before a successful backend-read request and shows write errors only above the scrolling form.
- Candidate patch gates creation on a successful categories response, validates 4-character minimum titles before submission, retains typed content when a save fails, and shows the server error beside the publishing button.
- The prior successful GitHub Pages deployment does **not** confirm a successful Cloudflare Worker deployment. Cannot directly verify live Cloudflare GET/POST in this environment; production server response and owner browser test remain outstanding. No live chat or Worker code edited in this patch.

## 2026-10-08 — Square forum candidate source checks

- Read repository `main`, live-chat source, Worker and the prior forum design before editing.
- Parsed new frontend JS and modified Worker JS (after stripping ESM wrappers for syntax-only inspection).
- Checked the Square retains existing chat IDs and UI, and the Worker retains WebSocket handling. Forum REST paths, input limits and SQLite schema are present.
- **Not tested:** live Worker deployment, GET/POST round trip, iPhone, Firefox, anti-abuse under load, session cookies or owner acceptance. This is a candidate, not a closed release.

## 2026-10-08 — v1.3.0 release-scope closeout (not all features device-accepted)

- Explicit owner instruction: **close out the last build, document everything, and roadmap**. Version advanced from `1.2.0` to `1.3.0` because Wayfarer and additional UI/door features have been delivered. This is release-scope acceptance, not a fabricated success report for unobserved devices.
- GitHub `main` pre-closeout runtime head `90cb72710813a4daea5242cbbe62ede8d92852c3` had **successful GitHub Pages deployment**, workflow run `37800022754`.
- Inspected current source: `app.js`, `cloudflare-config.js`, `hold-designer.js`, `gods-eye/map.js`, `gods-eye/nearby.js`, and `ads-config.js` all passed JavaScript syntax parsing.
- Source-level checks confirm: eleven desktop nav entries with **Wayfarer** name; static HTML tagline **Your people**; fresh browser geolocation and coarse (>10 km) position guard; no hardcoded Boston; `.hero-door` markup reused for Hub/Hold without the extra knocker; runtime cache references align; ad config `enabled: false`.
- Current Square live chat architecture stays intact; the NodeBB-style forum is a separately planned feature and **was not installed or tested**. The source closeout did not deploy a new Cloudflare Worker, D1 binding or other server configuration.
- **Pending owner/device acceptance:** actual Firefox horizontal wheel/drag and browser Back; identical door appearance and saved custom design; Knock behavior on both doors; iPhone layout; OS geolocation correctness; live map/geocoding, directions, weather, currency, prayer-time calculation and translation; any production account flow.
- The release docs/source may deploy through a separate Pages workflow. Verify the exact post-closeout commit separately. No semantic-release tag or extra branch created.

## 2026-10-08 — Compact desktop top navigation candidate

- Inspected the actual runtime-generated desktop bar in `cloudflare-config.js` and the `app.js` wheel/drag listeners; updated both along with static HTML for consistency.
- Source JS parsed successfully; verified eleven matching nav labels in fixed order; 108px × 44px widths, CSS mandatory scroll snapping, full-button-count width calculation, wheel `preventDefault` unconditionally inside the top navigation, temporarily suspended mandatory snapping with an important inline rule during mouse drag, and the “Your people” subtitle.
- Confirmed no edits to accepted `styles.css` background chunk, Radio modules or mobile footer. Bumped dynamic runtime and app script cache versions.
- **Not yet device-validated:** actual wheel and drag in Firefox, layout with the Hanafi return link, keyboard navigation, mouse Back behavior and responsive clipping. GitHub Pages deployment result is checked separately; only owner can accept this candidate.
- No administrator permissions, ads toggle or Master Key implemented; account authorization remains prerequisite.

## 2026-10-08 — Desktop top-nav overflow correction (candidate)

- Confirmed browser runtime constructs navigation in `cloudflare-config.js`; its `justify-content:center!important` was overriding the intended horizontally scrollable behavior and could push overflowing items visually ahead of Hub. Corrected to `justify-content:flex-start!important` with constrained overflow and a thin scrollbar.
- Source-level JavaScript parser checks passed for affected `app.js` and `cloudflare-config.js`. Index/runtime cache references were increased, preserving all navigation labels/icons/order.
- Existing (already deployed) `app.js` has mouse-wheel-to-horizontal scrolling, left-click dragging, and history push/pop support for browser/mouse Back. Existing Travel Companion location errors and extra translator languages are source-present, but no new functional/device acceptance is claimed by this navigation correction.
- **Still to validate:** actual Firefox mouse wheel, drag without accidental navigation, mouse Back, overflow at different desktop widths, location provider/permission behavior and translation-provider availability for the new languages. GitHub Pages deployment status must be checked separately.

## 2026-10-08 — External navigation handoff candidate

- The routing JavaScript was syntax-checked; confirmed no Google Maps URL remains in the runtime route module.
- Checked URL parameters against OpenStreetMap Directions format: `engine=fossgis_osrm_car` or `engine=fossgis_osrm_foot` and `route=lat,lon;lat,lon`.
- The external link and routing provider behavior still require browser/iPhone validation. Other provider migrations are not part of this slice.

## 2026-10-08 — Map dependency replacement source validation

- Travel Companion loads **OpenLayers 10.10.0**, not the previous renderer. All affected runtime modules were inspected and successfully parsed.
- The map module now uses OpenLayers tile, vector, overlay and projection APIs. The route and nearby modules use an event-delivered renderer adapter instead of the former mapping API.
- Player/map links were cache-bumped to force iPhone/desktop scripts to update. The seven-button mobile nav, Radio asset references and background styles were not changed.
- OpenStreetMap map-data attribution remains present.
- **Still to test on owner devices:** map tile delivery from OpenLayers CDN/OSM, markers, drawing a real route, nearby results, mobile gestures, and map readability.

## 2026-10-07 — Travel Companion Wayfarer travel slices 21–24

Source/structure validations:

- Confirmed `gods-eye/map.js`, `routes.js`, `nearby.js`, `essentials.js` and `companion.js` all parsed as JavaScript.
- Travel Companion passes selected point and map references through explicit in-page events. Directions requests are manual, using a Valhalla OSRM-compatible GeoJSON route response with a Google Maps external link as fallback.
- Nearby places are manually requested with bounded Overpass categories and map markers; source lists may be incomplete.
- Weather, Hanafi prayers and conversion need button/form actions. Prayer-day calculation uses destination time zone (fetched if weather was not checked first).
- Translation is manual and limited to short messages; offline Turkish phrase buttons do not send network requests. Fair Price is benchmark-relative math only. Hitch is a selected-map-place context summary, not an AI chatbot.
- Verified HTML module order, five associated travel JS modules, and seven untouched bottom navigation destinations; accepted Radio v1.2.0 assets were not edited.
- **Not independently verified:** actual demo/data provider API success in browser, CORS, real route drawn, correct local clock/fiqh timing against an official mosque, physical device GPS and UX, or owner acceptance.

## 2026-10-07 — Travel Companion slice 1 source validation

- Verified standalone Travel Companion screen and Hub card use the existing Folkhold `data-view` system.
- `gods-eye/map.js` parsed as JavaScript; no automatic position lookup, no shared user GPS records or map tile prefetch are implemented.
- Search requests are manually submitted, limited to five Photon results, and cached per browser tab. The provider remains a limited demo.
- Leaflet library loaded lazily via pinned CDN + integrity hashes; map data displayed with OSM attribution.
- Confirmed iPhone bottom navigation retains seven destinations, Radio v1.2.0 and accepted wallpaper/Hub/Hold icons were not edited.
- **Not yet confirmed:** actual external CDN/tile/search delivery, Safari GPS dialogs, iPhone map layout or owner acceptance.

## 2026-10-07 — Radio v1.2.0 owner acceptance

- Evidence: owner expressly said **“radio is good”** and requested closing the build.
- The accepted implementation includes Radio navigation and playlist/player, six licensed MP3 files, three stations, and SVG transport buttons on PC/iPhone.
- Volume slider remains on PC; phone volume uses device buttons. Browser autoplay may require interaction.
- This is explicit owner acceptance, not a claim of independent device/browser automated testing.

## 2026-10-07 iPhone Radio single-icon repair

- Inspected the owner-provided iPhone screenshot showing duplicated emoji arrowheads and squeezed title/artist panel.
- Source verified that the problem came from literal `◀◀` and `▶▶` plus a legacy `max-width:38vw` mobile CSS declaration inherited from the old radio footer.
- Candidate player now uses one inline SVG for each Previous/Next control, an upward-arrow SVG for Play and two bars for Pause.
- Removed retired fixed footer/ad/nav layout rules from `radio/player.js`; page-level UI now fills available width.
- Phone-only volume slider is hidden. Desktop slider and remembered desktop volume remain.
- Player JS syntax checked; `index.html` references a new script cache version.
- Accepted background, navigation and icon code are untouched. Owner device validation is still required.

## 2026-10-07 Desktop tower alignment follow-up

- Source-verified: the desktop My Hold tower-specific rule is now 23px with transform translateY(-2px), replacing the 26px rule.
- The HTML tower glyph remains ♜ on desktop and mobile; mobile-only sizing is unchanged.
- Background styles are untouched. Runtime script URLs were versioned to invalidate caches.
- Actual cross-browser positioning remains for owner visual approval.

## 2026-10-07 Desktop Hold tower size candidate

- Source-level check: the desktop navigation uses the approved ♜ tower rather than 🏠.
- Added a targeted desktop-only font-size override (26px) after the general 16px desktop icon rule.
- Mobile Hold tower font sizing and approved background CSS are unchanged.
- Updated JavaScript URLs for cache invalidation.
- Actual visual sizing is pending owner desktop verification.

## 2026-10-07 Radio navigation candidate

Source-verified, not yet owner-device accepted:

- Added Folkhold Radio screen with a visible playlist and controls within the page; removed the fixed player bar behavior.
- Added Radio to desktop top navigation and mobile bottom navigation.
- Seven destinations now exist in mobile navigation, with native horizontal scrolling and snap points.
- Directory is included in static mobile markup, so the older script's six-cell grid override is skipped.
- The same audio object remains alive across screen navigation.
- Fixed a syntax error in `radio/player.js`: the Previous button event listener's `else` block was missing a closing brace. This was discovered while verifying the Radio relocation.
- Corrected the first-run default volume: missing localStorage data now gives the intended 32% rather than 0%.
- Candidate JavaScript passed syntax parsing before commit.
- Approved background, Hub symbol and Hold tower were intentionally unchanged.

Still needed: confirm live desktop/iPhone UI, swipe behavior, and audible player/autoplay behavior on the real devices.

# Folkhold Validation Record

This file records what has actually been observed or verified. It is intentionally narrower than the roadmap or implementation claims.

## Hanafi / Folkhold bridge validation

Source/deployment verified on October 1, 2026:

- Folkhold loads `hanafi-bridge.js?v=1` after `cloudflare-config.js`.
- `hanafi-bridge.js` detects `?from=hanafi`.
- It stores the Hanafi navigation origin in `sessionStorage` under `folkhold.navigationOrigin`.
- While that context exists, it inserts **← Hanafi** into the Folkhold top bar.
- The return link targets the Hanafi Learning Deck deployment and clears the origin context when used.
- A normal entry without a `from` marker clears the stored Hanafi origin.
- GitHub Pages workflow run `36902962625` completed successfully for exact Folkhold commit `98eba8af4d1a3db05640bcb26cdadbeaaefa6e41` (`Add Hanafi origin-aware return bridge`).

This validates the Folkhold half in source and deployment. It does **not** yet validate the complete Hanafi → Majlis → Folkhold → Hanafi round trip, because the Hanafi-side intentional **Majlis** entry still needs to be added/validated.

## Reciprocal Hanafi / Folkhold links

Source-verified on September 30, 2026:

- Folkhold `README.md` no longer contains the broken decorative image block or standalone centered **Open Folkhold** link at the top.
- Folkhold `README.md` has a normal **Links** section containing the Folkhold Web App and Hanafi Learning Deck links.
- Hanafi `web-viewer/links/index.html` contains a **Folkhold** card linking to `https://dereksparks1982.github.io/folkhold/`.
- Hanafi workflow **Main Web App Build** run `36806544061` completed successfully for exact commit `081c4429f5c046e1c3fd5af1e7f7180e403f5db9`.

This validates the ordinary reciprocal-link foundation separately from the origin-aware bridge.

## Backgammon validation boundary

Backgammon is currently **documented and sliced, not implemented**.

- `docs/BACKGAMMON.md` defines the AI-first architecture and acceptance conditions.
- Slice 13 is local browser Backgammon against a real evaluating/searching AI.
- Slice 14 is later remote play with friends.
- No rules engine, AI strength, rendered board, or remote transport has been validated yet.

## v1.1.0 closeout validation

### Repository / source

- `main` was verified as the authoritative branch before closeout work.
- The pre-closeout user-facing source head was `778579fba287960c92d3b7882618277410288715` (`Refresh medieval Hold door UI`).
- The v1.1.0 closeout commit is `cb6f15004679df432fb59470f40c392c7dca5547`.
- GitHub Pages workflow run `36803870310` completed successfully for that exact closeout commit.
- `package.json` reports `1.1.0`.

### Door / Knock

Owner-observed:

- Derek confirmed the generic medieval Hold door appearance was acceptable enough to continue.
- Derek explicitly confirmed: **“knocking also works.”**

Implemented behavior retained for the baseline:

- double-click door
- prompt: **Do you wish to leave a knock?**
- Yes/No choices
- Yes emits the current prototype Knock event/confirmation path

Not validated as production behavior:

- persistence
- remote delivery to another account
- unread/read state
- rate limiting

### Navigation

Implemented in source:

- desktop top navigation
- order: Hub, Village Square, Notice Board, My Hold, Tavern, Tea Room, Directory, Key Ring, Ads
- desktop side rail hidden

This remains a normal regression check for future UI work.

### Icon state

Owner-observed:

- after the generic icon repair, Derek responded **“okay good”** and moved on to the Hold door work.

Implementation state:

- generic PNG app/browser icon sizes exist for 180, 192, and 512 surfaces
- top-left slot is forced to the generic PNG path
- platform cache behavior remains an external variable, especially installed iOS Home Screen shortcuts

### Global Chat

Historical v1 baseline:

- live Global Chat was previously tested through the Cloudflare WebSocket/Durable Object backend.

The v1.1.0 closeout work does not intentionally alter Global Chat logic. No claim is made here that every prior backend path was freshly retested during documentation-only closeout.

### Accounts

- Better Auth work remains staged.
- Production account activation is not considered validated until D1/secrets/provider configuration are connected and exercised.

## UO Folkhold forensic validation

The following was verified directly from the uploaded archive bytes without modifying the originals.

### Outer preservation inputs

`RunUO_2.0_Final_Repack_02-03-2011.7z`

- bytes: `26,072,522`
- SHA-256: `d8fc7e8461ceb1e3709b0b66572843ab594b9aa545d4c9239951183f4902963c`
- archive entries: `9,595`
- regular files: `9,016`

`Patch_05-27-2012.7z`

- bytes: `4,455,659`
- SHA-256: `e2004f75f391abf255c69247c3baf7ee0243e82b6543ef3f40448649422b71ac`

### Embedded repack baseline

- nested archive bytes: `9,037,377`
- SHA-256: `9cf93288a184ab67edcf78a98c15a0868e70b394d274bc8ea98d4fc68ee85b4b`
- entries: `9,536`
- regular files: `8,980`
- regular Scripts files: `3,446`

### Nested 2012 patch

- bytes: `4,455,194`
- SHA-256: `00dd5263508d2fe96a35401951239272f6e7953c24156eccdb3d1f941b7e366c`
- entries: `4,356`
- regular files: `3,838`
- all regular payload files are under `Scripts/`

### Generated forensic manifests

Full regular-file SHA-256/size/path manifests were generated during analysis:

- embedded baseline manifest: `8,980` records, `998,645` bytes, SHA-256 `7e9af2dc494322035caa096195c4fa9ef27cea249575da91464c41159e624547`
- nested patch manifest: `3,838` records, `477,438` bytes, SHA-256 `e06ed3e4eed1a58a0bfe188551a2baa5598d741ea50da2a0584a0138e482aa10`

### Patch comparison

2012 patch Scripts vs embedded baseline Scripts:

- added: `392`
- removed: `0`
- changed: `67`
- unchanged common files: `3,379`

Outer preserved working Scripts vs embedded baseline Scripts:

- added: `1`
- removed: `44`
- changed: `5`
- unchanged common files: `3,397`

This validates that the 2012 patch is **not applied wholesale** to Derek's outer working tree.

### RunUO executable

The baseline and outer working tree contain the same `RunUO.exe`:

- bytes: `585,728`
- SHA-256: `43cf9055f8c52f5b45059ba081803ef85df97fff72020156005b6d1f51e77005`
- identified as a PE32 i386 Mono/.NET console assembly
- embedded File/Product version: `2.0.3567.2838`

### Client/data evidence recovered

Verified from preserved source/history:

- `CurrentExpansion.cs` uses `Expansion.ML`.
- `MapDefinitions.cs` has `TileMatrixPatch.Enabled = false` with comment `OSI client patch 6.0.0.0`.
- embedded `UPDATES.TXT` recommends not using client patches above `6.0.0.0` because of `TID: Provided Token Out Of Range` problems.
- embedded `UPDATES.TXT` states the repack had originally been created with client patch `7.0.4.2` and that many teleporters were spawned underground; the world was subsequently cleared/redecorated/respawned.
- Derek's later outer working `DataPath.cs` explicitly points at `uoml_setup_fully_patched_5.0.9.1`.
- 2012 patch `DataPath.cs` points at `C:\RunUO 2.0\World Data`, but the patch archive does not include that World Data directory.
- baseline ClientVerification auto-detects the configured `client.exe` requirement with `LenientKick`; the 2012 patch disables automatic requirement detection and changes old-client handling to `Ignore`.

### What remains unvalidated

- `5.0.9.1` is **Candidate A**, not an accepted client baseline yet.
- no candidate client has been launched against the server in this environment
- Ocllo/Occlo has not yet been visually/runtime checked
- Mono execution on Linux has not yet been attempted
- the 2012 patch has not been applied

See `docs/UO_FORENSICS_2026-09-30.md` for the forensic report.

## Validation language rule

Future entries should distinguish:

- **implemented**: source contains the intended change
- **deployed**: hosting platform finished deploying the exact commit
- **observed**: a person/device actually displayed or exercised it
- **validated**: the defined test/acceptance condition passed
- **accepted**: Derek explicitly closed/accepted the version or slice

Do not collapse those into one word.
