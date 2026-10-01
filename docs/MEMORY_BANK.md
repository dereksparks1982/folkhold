# Folkhold Memory Bank

This is the temporary in-repository externalized memory for Folkhold and Elderred Softworks working rules. Derek plans to create a dedicated external-memory repository later. Until then, this file preserves distilled decisions and lessons that should survive thread changes.

## Source sweep used to build this bank

The first consolidation pass pulled from available DKLab/Elderred Softworks Library material and handoffs that explicitly referenced or quoted Company Bible rules, including Nougat Media Plus closeout/build records and conversation handoffs. The recurring rules agreed across those sources were carried forward here and into Folkhold's `COMPANY_BIBLE.md`.

Recovered themes included:

- owner authority and explicit approval gates
- **Stop means stop**
- no guessing about source, paths, versions, or verification state
- read the current Bible/docs/source before substantial work
- warnings-as-errors discipline for compiled work
- behavior testing rather than compile-only claims
- README/release-note closeout law
- truthful known-issue reporting
- no unauthorized side projects/branches/GitHub writes
- changed-files package + manifest + SHA-256 practices where binary handoff is relevant
- preserve user/runtime state and exact rollback when destructive work is involved
- no casual modification of legal/licensing policy files
- only Derek decides acceptance

This bank is a distilled cross-project memory, not a substitute for reading the active project's canonical documentation.

## Recovered company-wide operating rules

- Derek is the final acceptance authority.
- Owner instructions override inference.
- **Stop** halts building, editing, packaging, command generation, Git/GitHub work, and other tool-driven changes until a new explicit instruction.
- Before substantial build/repair/patch/validation/package/closeout work, read the current canonical Bible and relevant project documents rather than relying on memory alone.
- Proposal first, approval second, build third unless the owner directly orders the build/change.
- A scope statement should make clear what is being changed, what is excluded, how it will be tested, and what constitutes acceptance.
- Rejected/failed candidates do not automatically consume a version number. Repair the candidate unless a new version is explicitly warranted.
- Warnings are treated as errors during compiled work unless an unavoidable warning is explicitly documented.
- Compile/build success is not the same thing as behavioral validation.
- Documentation is part of closeout, not optional cleanup after the fact.
- README history is preserved. The newest accepted version belongs before older historical release sections.
- Known problems are documented truthfully rather than silently marked fixed.
- Only the owner decides when a candidate becomes accepted.
- Changed-files-only packages, manifests, and SHA-256 verification are the preferred handoff pattern for local compiled projects when packaging is required.
- Accepted local compiled-project flow historically follows: candidate -> owner validation -> acceptance snapshot -> commit/tag -> GitHub publication.
- Project work belongs inside its authorized project. Do not create unrelated side projects or repositories without permission.
- Do not use terminal snippets that deliberately close Derek's interactive shell.
- Do not auto-open GUI tools or browser windows unless asked.

## Folkhold-specific repository discipline

- One branch only: `main`.
- Do not create branches or pull requests without explicit authorization.
- GitHub writes require explicit user authorization or a direct action instruction such as build/update/document/closeout that necessarily includes the write.
- Verify deployment before saying a GitHub Pages change is live.
- A source change and a visible browser change are not the same thing when caches are involved.
- Keep breadcrumbs in repository docs instead of relying on chat memory.

## Folkhold product decisions

- Official spelling: **Folkhold**.
- Main landing page: **Hub**.
- Personal space: **Hold**.
- Holds contain **Rooms**.
- Account login is separate from Hold/Room authorization.
- Hold access credentials are called **Keys**, never Hold passwords.
- Keys are intended to be individually issued and revocable.
- The front of a Hold can be publicly welcoming while rooms behind it remain individually public, Keyed, or private.
- Derek's Hold front message: **Everyone is Welcome**.
- Visitors Knock by double-clicking the Hold door and confirming **Do you wish to leave a knock?**
- Desktop primary navigation currently places **My Hold** after **Village Square** and **Notice Board**.
- Public Square/Global Chat is chronological rather than engagement-ranked.
- Tavern is adults-only and intentionally minimally moderated within the platform-wide legal/safety floor.
- Tea Room is deliberately strict and civility-first.
- Town Crier is a quiet hourly proclamation feature, not a continuous news feed.
- Paid Tavern Upstairs Rooms are temporary private spaces: invitation first, acceptance second, charge only after acceptance, text immediately, video only with mutual consent.
- Real currencies only. No fake Folkhold currency unless Derek explicitly revisits that decision.

## Hanafi ↔ Folkhold relationship

Derek defined a durable relationship between the projects:

- **Hanafi is the mother**: learning, faith, practice, reference, and guidance.
- **Folkhold is the father**: community, people, rooms, gathering, and social life.
- They complement one another but remain separate applications/repositories.
- The Hanafi button that opens the community side is named **Majlis**.
- `Majlis` was chosen because the feature is a gathering place, not an accredited religious council; therefore **Shura** is not the chosen label.
- A Hanafi-origin visitor should receive a temporary **← Hanafi** return button inside Folkhold while normal Folkhold navigation remains intact.
- A source/origin marker is navigation context only and must never grant authorization.
- See `docs/HANAFI_BRIDGE.md`.

## Visual rules learned the hard way

- Never generate an image unless Derek explicitly asks for image creation/editing. If the request is implementation, use code/CSS/existing assets.
- Once artwork is approved, use the exact approved asset. Do not redraw or reinterpret it.
- Generic code/CSS placeholders are preferable to bad approximations and can be replaced later.
- Binary image assets must never be pushed through a UTF-8 text update path.
- Browser favicon, Apple touch icon, manifest icon, in-app brand slot, social preview, and installed PWA icon are separate surfaces and must be verified separately.
- iOS/Home Screen caching may preserve an old icon even after the site updates.
- Runtime JavaScript can override correct static CSS/HTML. Inspect runtime overrides when a visual change appears not to take effect.
- Cache-bust changed runtime files when the browser is demonstrably serving stale code.

## Method refinements from Folkhold v1.0.0 -> v1.1.0

1. Inspect the actual source responsible for a visible element before changing it.
2. Check for runtime-injected styles/scripts before assuming static CSS is authoritative.
3. Make the smallest requested change first.
4. Do not report deployment success while GitHub Pages is still queued or in progress.
5. When a visual slot is troublesome, use a simple generic placeholder rather than repeatedly regenerating artwork.
6. Document feature behavior immediately after it becomes accepted enough to keep.
7. Keep future ideas in `ROADMAP.md`; accepted version changes in `CHANGELOG.md`; decisions/lessons here; operating law in `COMPANY_BIBLE.md`.
8. Record unresolved items in `docs/KNOWN_ISSUES.md` rather than letting them evaporate between chats.
9. Record what was actually validated in `docs/VALIDATION.md` rather than upgrading implementation into proof by wording.
10. Break large ambitions into `docs/TASK_SLICES.md` and finish them one coherent slice at a time.

## UO Folkhold preservation memory

Derek intends the Game Room's first major game world to be **UO Folkhold**.

Preserved inputs supplied in the Folkhold thread and verified directly on September 30, 2026:

- `RunUO_2.0_Final_Repack_02-03-2011.7z`
  - 26,072,522 bytes
  - SHA-256 `d8fc7e8461ceb1e3709b0b66572843ab594b9aa545d4c9239951183f4902963c`
- `Patch_05-27-2012.7z`
  - 4,455,659 bytes
  - SHA-256 `e2004f75f391abf255c69247c3baf7ee0243e82b6543ef3f40448649422b71ac`

The repack is intentional and should not be replaced with a newer emulator without Derek's approval. Exact client compatibility remains unresolved and must be proven against the repack and its map data, with Ocllo/Occlo used as a regression location. Historical stock RunUO 2.0 Final compatibility guidance can inform the investigation but is not enough to pin this repack's client by itself.

## What belongs in the future dedicated external-memory repository

When Derek creates it, migrate and expand:

- company-wide canonical operating law
- project-specific Company Bibles
- durable user-approved product decisions
- release/version histories
- accepted visual identity fingerprints and asset provenance
- recurring failure modes and corrected procedures
- handoff summaries between long-running threads
- project paths/repository identities where appropriate
- preservation hashes and provenance records
- cross-project relationships such as Hanafi ↔ Folkhold

The external-memory repository should supplement live project documentation, not replace reading the current repository before changes.
