# Folkhold Radio

Status: **development candidate / owner review**

Folkhold Radio is the persistent music layer for the web app.

- Radio now has its own screen. On iPhone, tap **Radio** in the swipeable bottom navigation instead of using a floating bar over the other buttons.
- The playlist is data-driven in `radio/playlist.js`.
- The first/default opening theme is **Ibn Al-Noor** by Kevin MacLeod.
- Audio is stored by role under `assets/audio/`; no loose sound files belong in the asset root.
- Playback attempts to start on initial load.
- If a browser blocks audible autoplay, the first pointer/touch/key interaction automatically retries playback.
- Previous, play/pause, next, title/artist, seek, and volume controls are implemented.
- Music continues across ordinary Folkhold screen navigation, even though the controls are inside the Radio screen.
- The Radio screen displays the playlist and lets listeners select a specific song.

Browser note: iPhone/Safari and other browsers may require a user gesture before audible media can begin. Folkhold can retry on that gesture, but it cannot override browser autoplay policy.

## Adding music

1. Upload MP3 (or another browser-compatible audio file) to `assets/audio/music/`, using a lowercase kebab-case filename.
2. Add a matching entry with title, artist, URL/path and optional role in `radio/playlist.js`.
3. Radio displays that entry automatically; it supports playing any track, skipping and looping back to the start of the playlist.

GitHub Pages cannot automatically list unknown files in a folder. The playlist manifest is the controlled source of truth.

Folkhold is a public web app/repository. Downloading a song from YouTube does **not** necessarily give permission to rehost it. Use tracks with appropriate permission/licensing and preserve attribution where required.

## Current owner-validation boundary

- Verify horizontal swipe through seven navigation buttons on iPhone.
- Verify tapping Radio opens its own screen and the former floating bar is gone.
- Check controls, track choice, volume, seeking and music continuing as other pages open.
- Confirm no changes to the accepted mobile background, Hub glyph or Hold tower.
- Verify mobile Safari audio gesture/autoplay behavior on the real device.


## Curated stations, October 7, 2026

The audio library has **six real MP3 files** under `assets/audio/music/`:

- **All Music:** the complete six-track library, beginning with Ibn Al-Noor.
- **Eastern Roads:** Ibn Al-Noor, Desert City and Dhaka.
- **Medieval Hall:** Lord of the Land, Suonatore di Liuto and The Pyre.

They are modern instrumentals by Kevin MacLeod under CC BY 4.0. Their descriptions are historically/regionally inspired, not authentic religious recitations or verified traditional Persian recordings. Full composer/source/license credits are in `THIRD_PARTY.md`.

The licensed-media import workflow `.github/workflows/import-folkhold-radio.yml` **succeeded** in [run 37694240022](https://github.com/dereksparks1982/folkhold/actions/runs/37694240022) and the repository contains all six MP3 files. The original Ibn Al-Noor file was preserved. The player can fall back to composer-hosted audio if a local MP3 is unavailable.

For future songs, confirm redistribution rights, upload media under `assets/audio/music/`, add track/station/source metadata in `radio/playlist.js`, and update `THIRD_PARTY.md`. YouTube availability alone is not redistribution permission.

### Acceptance checks

On iPhone swipe the lower nav to Radio. Confirm that stations switch, all six songs play, volume, seek and pause work, and music continues while you visit the Hold or Square. Verify that the Hub icon, Hold tower and approved leather background remain unchanged. Do the same playback/navigation checks on desktop.


## Soundtrack direction: cultural recordings (owner request)

The six Kevin MacLeod tracks are **temporary placeholders**. The desired eventual identity is authentic, distinctive Persian, Middle Eastern, Anatolian and Nordic music, preferably real performances with characteristic instruments and provenance rather than common game/stock-soundtrack material. Research candidates by the recording's actual performer and tradition, then verify permission to redistribute the *sound recording*. A centuries-old melody does not make a modern recording public domain.

Keep the current starter tracks while building the better collection. Preserve the owner-chosen default opening track until explicitly changed. Track a music candidate's title (including original script if available), performer, region, instrumentation, label/rights holder, source, license, and source quality before any public import.
