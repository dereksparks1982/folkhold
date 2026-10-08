# Folkhold Changelog

All notable accepted Folkhold changes are recorded here from v1.1.0 forward.

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
