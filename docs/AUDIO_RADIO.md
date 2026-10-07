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
