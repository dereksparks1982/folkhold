# Folkhold Radio

Status: **development candidate / owner review**

Folkhold Radio is the persistent music layer for the web app.

- Controls remain at the absolute bottom of every Folkhold screen.
- The playlist is data-driven in `radio/playlist.js`.
- The first/default opening theme is **Ibn Al-Noor** by Kevin MacLeod.
- Audio is stored by role under `assets/audio/`; no loose sound files belong in the asset root.
- Playback attempts to start on initial load.
- If a browser blocks audible autoplay, the first pointer/touch/key interaction automatically retries playback.
- Previous, play/pause, next, title/artist, seek, and volume controls are implemented.
- Normal Folkhold screen navigation does not destroy the player.

Browser note: iPhone/Safari and other browsers may require a user gesture before audible media can begin. Folkhold can retry on that gesture, but it cannot override browser autoplay policy.
