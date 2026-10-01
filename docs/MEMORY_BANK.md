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
- Folkhold's origin-aware half is implemented: `?from=hanafi` creates session navigation context and adds **← Hanafi** while normal Folkhold navigation remains intact.
- The Hanafi-side **Majlis** doorway still needs to target that origin-aware entry.
- A source/origin marker is navigation context only and must never grant authorization.
- See `docs/HANAFI_BRIDGE.md`.

## Backgammon decision

Derek wants **Backgammon** inside Folkhold's Game Room.

Durable direction:

- First playable target is a complete browser game against **real AI**.
- “Real AI” means an opponent that generates legal move sequences, evaluates resulting positions, and searches alternatives rather than choosing random legal moves.
- Rules/state, AI, and UI should be separate layers so the same rules engine can later power remote matches.
- The local AI game should work without accounts or networking.
- Later, add **remote play with friends** using server-authoritative dice/state, synchronized turns, reconnect/resume, and Folkhold member invitations.
- Remote play is a separate later slice because it depends on persistent identity/realtime infrastructure.
- See `docs/BACKGAMMON.md` and Slices 13–14 in `docs/TASK_SLICES.md`.

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

Preserved outer inputs verified directly on September 30, 2026:

- `RunUO_2.0_Final_Repack_02-03-2011.7z`
  - 26,072,522 bytes
  - SHA-256 `d8fc7e8461ceb1e3709b0b66572843ab594b9aa545d4c9239951183f4902963c`
- `Patch_05-27-2012.7z`
  - 4,455,659 bytes
  - SHA-256 `e2004f75f391abf255c69247c3baf7ee0243e82b6543ef3f40448649422b71ac`

Forensic discoveries that must survive thread changes:

- The outer RunUO archive is Derek's later **working tree**, with 2026 save/backup/runtime state. Do not publish its private saves/accounts casually.
- It contains an embedded repack baseline archive, SHA-256 `9cf93288a184ab67edcf78a98c15a0868e70b394d274bc8ea98d4fc68ee85b4b`.
- The outer patch contains a nested 2012 patch payload, SHA-256 `00dd5263508d2fe96a35401951239272f6e7953c24156eccdb3d1f941b7e366c`.
- Patch vs embedded baseline Scripts: **392 added, 67 changed, 0 removed**.
- Derek's outer working Scripts vs embedded baseline: **1 added, 44 removed, 5 changed**. Therefore the 2012 patch is **not applied wholesale** to Derek's preserved working state.
- The repack uses **Mondain's Legacy**.
- The repack's own `UPDATES.TXT` warns not to use clients above **6.0.0.0** because of TID/token issues.
- That same history says **7.0.4.2** caused many teleporters to spawn underground, directly matching the kind of world/ground mismatch Derek wants to avoid.
- Derek's preserved 2026 `DataPath.cs` explicitly points to **`uoml_setup_fully_patched_5.0.9.1`**. This makes **5.0.9.1 Candidate A** for runtime testing, not yet the accepted final client.
- A controlled **6.0.0.0-era** data set is Candidate B/reference if needed.
- Do not start client testing in 7.x.
- Ocllo/Occlo is a required terrain/static regression location before accepting a client.
- The 2012 patch points to `C:\RunUO 2.0\World Data` but does not contain that World Data directory.
- Preserved `RunUO.exe` SHA-256 is `43cf9055f8c52f5b45059ba081803ef85df97fff72020156005b6d1f51e77005`, File/Product version `2.0.3567.2838`, and is a Mono/.NET assembly.
- Linux strategy begins by attempting that preserved assembly under a compatible Mono runtime with minimal path/runtime adaptation. Do not replace the emulator merely because newer software is easier.

Full evidence: `docs/UO_FORENSICS_2026-09-30.md` and `docs/UO_FOLKHOLD.md`.

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
