# Folkhold Project Log

## 2026-09-30 — Version 1 closeout

### v1 baseline
- **Folkhold v1 is closed out as the current baseline.**
- GitHub `main` is the authoritative branch.
- The Hub, My Hold, Public Square / Global Chat, Notice Board, Tavern, Tea Room, Directory, Key Ring, advertising shell, branding system, GitHub Pages frontend, and Cloudflare backend foundation are part of the v1 baseline.
- Global Chat is live through Cloudflare WebSockets / Durable Objects.
- Better Auth account UI/backend is staged, but D1 and deployment secrets are still required before account activation.

### Hub and navigation
- The main Folkhold landing page is called the **Hub**.
- The approved FH brand mark returns to the Hub.
- Holds retain their separate home/tower visual identity.
- The desktop left navigation panel itself has been removed visually so the buttons, TOWN label, divider, and Ad choices sit directly over the leather background.
- The remaining sidebar edge/divider styling was explicitly neutralized at runtime as part of the v1 polish pass.

### Post-v1 direction
- The first planned post-v1 feature is the **Town Crier**.
- Town Crier belongs front-and-center on the Hub rather than as a separate news section.
- Intended behavior: roughly one significant world story per hour, quiet between proclamations, with a short summary and source link.
- Folkhold announcements can replace an hourly world story when needed.
- Truly extraordinary alerts may interrupt the current proclamation, but the feature must not evolve into a continuous news feed or dedicated news app.

## 2026-09-30 — Brand naming and icon handling

### Brand name
- Official product/brand spelling: **Folkhold** — one word.
- Do not change the brand to “Folk Hold” unless Derek explicitly authorizes a later naming change.
- Existing UI/code references using “Folk Hold” should be corrected to **Folkhold** on the next authorized build/change pass.

### Approved FH brand artwork
- The approved brand artwork is the current **borderless FH monogram** approved by Derek in this thread.
- Do **not** redesign, redraw, reinterpret, crop, recolor, or otherwise alter the FH artwork unless explicitly authorized.
- Canonical approved-source fingerprint for this build:
  - Format: PNG
  - Dimensions: 1254 × 1254
  - Color mode: RGB
  - Byte size: 2,470,630 bytes
  - SHA-256: `137acd3927def8cf7c2e2250c15a13f6f16d1c2a16b47e7d949e3f99c234c2a3`

### Binary-safe image / favicon procedure
When adding or replacing Folkhold brand icons:
1. Treat PNG/ICO image assets as **binary files**, not UTF-8 text.
2. Do not pass binary image contents through the normal text-file updater.
3. Before upload, verify the source image dimensions, byte size, and SHA-256 hash.
4. Upload binary assets through a binary-safe Git/GitHub path and verify the stored file after upload.
5. Generate platform-specific icon sizes only from the approved source artwork. Resizing/exporting is allowed when required for favicon/PWA/iOS compatibility; redesigning the artwork is not.
6. Update the complete icon chain together so platforms do not fall back to stale or mismatched artwork:
   - browser favicon references
   - web-app manifest icons
   - Apple touch icon
   - social preview image references
   - any PWA/service-worker/cache references that include icon assets
7. Verify the manifest `sizes` metadata matches the actual generated file dimensions.
8. After deployment, account for browser/PWA icon caching before assuming an asset is still wrong.

### Build application
- Keep the approved artwork unchanged except for deterministic downscaling needed for icon export.
- Brand mark and Hub navigation use the approved FH artwork.
- Hold navigation remains visually separate with its home/tower icon.
- Official spelling is **Folkhold** everywhere.
- Browser/iPhone icon repair uses a fresh cache version so stale broken icons are not reused.
