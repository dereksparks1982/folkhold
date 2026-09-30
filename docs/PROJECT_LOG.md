# Folkhold Project Log

## 2026-09-30 — Brand naming and icon handling

### Brand name
- Official product/brand spelling: **Folkhold** — one word.
- Do not change the brand to “Folk Hold” unless Derek explicitly authorizes a later naming change.
- Existing UI/code references using “Folk Hold” should be corrected to **Folkhold** on the next authorized build/change pass.

### Approved FH brand artwork
- The approved brand artwork is the current `FH.png` supplied by Derek.
- Do **not** redesign, redraw, reinterpret, crop, recolor, or otherwise alter the FH artwork unless explicitly authorized.
- Current approved-source fingerprint:
  - Format: PNG
  - Dimensions: 1254 × 1254
  - Color mode: RGBA
  - Byte size: 3,402,202 bytes
  - SHA-256: `63c1f60800aa1f88571152b7abc53c8d155b36bb857a00ddade1b966bcb90cbb`

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
   - any PWA/service-worker/cache references that include icon assets
7. Verify the manifest `sizes` metadata matches the actual generated file dimensions.
8. After deployment, account for browser/PWA icon caching before assuming an asset is still wrong.

### Current diagnosis recorded for next build
- The approved source image itself is square and does not have an aspect-ratio defect.
- The current repository references `assets/folk-hold-brand.png` as the favicon, Apple touch icon, social preview image, and manifest icon.
- The current manifest declares that icon as `160x160`.
- The observed half-white / black icon behavior should therefore be treated first as an icon-export/reference/cache problem, **not** as a reason to alter the approved FH artwork.
