# Folkhold audio assets

Audio is organized by purpose so Folkhold does not accumulate a loose media pile.

- `music/` — full songs and theme music
- `ambience/` — environmental/room loops
- `sfx/` — interface and short effect sounds
- `voice/` — spoken announcements, station IDs, narration

Rules:

1. Do not place new audio files directly in `assets/`.
2. Use lowercase kebab-case filenames.
3. Record source/license/provenance in `THIRD_PARTY.md` when required.
4. Add playlist music through `radio/playlist.js`; do not scatter song paths through UI code.
