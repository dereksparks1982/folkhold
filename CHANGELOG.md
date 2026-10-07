# Folkhold Changelog

All notable accepted Folkhold changes are recorded here from v1.1.0 forward.

## Unreleased candidate - iPhone Radio layout

- Replace duplicated emoji-like transport arrows with single SVG buttons (Previous / up-arrow Play or Pause / Next). Expand the song panel to page width, removing legacy compact footer layout rules. Hide mobile volume in favor of the device rocker, while preserving the desktop slider. Pending iPhone acceptance.

## Unreleased candidate - Desktop Hold tower sizing

- Refined the desktop My Hold tower from 26px to 23px and raised it 2px for alignment with neighboring icons. Mobile sizing remains unchanged. Pending owner approval.

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
