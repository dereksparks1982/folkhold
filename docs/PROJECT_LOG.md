# Folkhold Project Log

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
