# Folkhold Changelog

All notable accepted Folkhold changes are recorded here from v1.1.0 forward.

## Unreleased candidate — Desktop navigation overflow correction (October 8, 2026)
- Changed runtime desktop navigation alignment from centered overflow to left-starting horizontal scrolling; wheel and mouse-drag support and browser Back handling already exist in the previous deployed candidate.
- Refreshed JavaScript cache versions without changing button order, accepted backgrounds, Radio, map logic or the mobile footer.
- Documented the recreational Games direction with no wagering in the roadmap; no Games UI or new gameplay was built.
- Real desktop Firefox overflow/wheel/drag/Back behavior remains owner-validation work.

## Unreleased candidate — Hub destination colors and Settings (October 8, 2026)
- Filled all ten Hub cards with distinct destination colors. Public Square blue, Notice Board yellow, Tavern red, Tea Room brown, and Travel Companion earth green; My Hold, Directory, Key Ring, Radio, and Settings each have their own solid color.
- Added My Hold, Directory, Key Ring, Radio and Settings shortcut cards; Tea Room uses the same ☕ icon as its desktop navigation button.
- Replaced Travel Companion's crosshair with 🧭 and added its missing desktop top-navigation button.
- Renamed the top-navigation Ads entry to Settings. The Settings card and navigation open the existing advertising preferences dialog, now headed Settings; other settings remain future work.
- Preserved mobile navigation, Radio playback, backgrounds, mapping code, icons outside the requested Hub icons, and account/advertising behavior. PC/iPhone validation remains pending.

## Unreleased candidate — Travel Companion navigation choice (October 8, 2026)

- Restored Google Maps as the primary external navigation link for walking and driving.
- Kept OpenStreetMap Directions as a second link; both use the same selected route endpoints and travel mode.
- Preserved OpenLayers, OpenStreetMap map tiles, Valhalla road overlays, Radio, and existing navigation.
- iPhone/desktop link handoffs still require owner validation.

## Unreleased candidate — Travel Companion external directions provider

- Replaced the Google Maps external directions link with OpenStreetMap Directions for both walking and driving modes; retained internal Valhalla road-route drawing.
- Advanced only the routing script cache key. External navigation still needs a browser/device acceptance test.

## Unreleased candidate — OpenLayers map replacement

- Removed the previous map-rendering library from Travel Companion runtime and replaced it with OpenLayers 10.10.0.
- Reimplemented map, marker, nearby-place and route overlays against the new mapping API. Preserved OpenStreetMap contributor attribution.
- Refreshed browser script versions; requires PC/iPhone validation of map and travel features.
- The accepted Radio and global navigation/artwork were not changed.

## Unreleased candidates — Travel Companion (Wayfarer) slices 20–24

- Renamed the public-facing map/travel page to **Travel Companion** without changing its internal route or accepted UI.

- Added a world map, opt-in location lookup and manually submitted place searches within Folkhold.
- Added walking/driving road routes, route geometry, distance/time estimates and Google Maps handoff.
- Added nearby places by category using volunteer OSM data.
- Added on-demand weather, reference currency exchange and Hanafi prayer times with method choice.
- Added short-message translation, offline Turkish phrases, numeric quote/benchmark Fair Price comparison and initial Hitch selected-place context.
- Third-party demo/data service terms and availability, actual iPhone/desktop behavior and provider CORS remain unverified pending owner testing.
- No Keys location sharing, AI chatbot, unverified local market-price claims or automatic GPS tracking.
- Radio v1.2.0, accepted background and navigation remain unchanged.

## v1.2.0 — Folkhold Radio and mobile navigation

**Accepted October 7, 2026**

### Added
- Dedicated Radio place with persistent playback across in-app screens.
- Horizontally swipeable iPhone bottom navigation with a Radio button.
- Six locally hosted and licensed recordings, organized music directories, and three station presets.

### Changed
- Removed the floating radio footer and presented full-width controls inside Radio.
- Unified single SVG Previous, upward-arrow Play/Pause, and Next controls on PC and iPhone.
- Removed the phone-side volume slider, keeping desktop volume control.
- Retained approved backgrounds, Hub glyph and Hold tower; refined desktop tower alignment.

### Platform constraint
- iOS and other browsers may require a user gesture before audible autoplay.

## v1.1.0 — Hold Door and Navigation Closeout

**Closed: September 30, 2026**

### Added

- Generic medieval CSS front door for Derek's Hold with wood planks, iron bands, rivets, and a proper keyhole.
- Double-click/keyboard Knock interaction on the Hold door.
- Knock confirmation prompt: **Do you wish to leave a knock?** with Yes/No choices.
- Generic PNG app/browser icon set for favicon, Apple touch icon, and web-app manifest.
- Readable cream heading panels for the major top-of-page section headings that were disappearing into the leather background.
- Canonical project documentation for versioning, roadmap, known issues, validation evidence, task slicing, and durable memory.

### Changed

- Desktop primary navigation moved to the top and the desktop side rail was removed.
- Desktop navigation order now places **My Hold** after **Village Square** and **Notice Board**.
- Public Square navigation label is now **Village Square** in the top desktop navigation.
- Derek's Hold front sign remains **Derek's Hold** and its welcome strip now reads **Everyone is Welcome**.
- Folkhold's top-left/app icon uses the generic placeholder icon for now rather than continuing to fight platform-specific rendering of the ornate brand asset.
- Browser/runtime cache versions were advanced where needed so current UI code and icon references can replace stale cached versions.
- Project closeout now follows explicit `MAJOR.MINOR.PATCH` tracking from v1.1.0 forward.

### Removed

- The site-wide slogan **Advertising pays for Folkhold. Your private life does not.** because planned paid private-room features make that absolute claim inaccurate.

### Preserved

- Global Chat remains live through Cloudflare.
- Better Auth account infrastructure remains staged pending D1/secrets.
- The approved FH artwork remains preserved as an approved brand asset even where a generic placeholder is currently used for troublesome app/icon surfaces.

### Documented for future slices

- Hold-themed Knock activity/Visitor Ledger concept.
- Hold Front Door Designer.
- Hanafi ↔ Folkhold **Majlis** bridge.
- Town Crier.
- Tavern Upstairs Rooms.
- UO Folkhold based on Derek's preserved RunUO 2.0 Final Repack.

## v1.0.0 — Version 1 Baseline

**Closed: September 30, 2026**

Established the initial Folkhold baseline: Hub, Holds, Public Square/Global Chat, Notice Board, Tavern, Tea Room, Directory, Key Ring concepts, advertising shell, GitHub Pages frontend, Cloudflare realtime backend foundation, and staged account infrastructure.
