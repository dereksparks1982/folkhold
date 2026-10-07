# Folkhold Company Bible

This is the canonical operating document for Folkhold. It consolidates the working rules recovered from Elderred Softworks / DKLab project records, prior Company Bible material and handoffs, plus the lessons learned while building Folkhold.

## 1. Authority

- Derek is the product owner and final decision-maker.
- Owner instructions override inference, convention, previous assistant suggestions, and older project rules.
- If an instruction is ambiguous in a way that could materially change scope, ask before changing anything.
- Never claim a change is fixed, deployed, accepted, tested, or verified until that exact state has actually been checked.
- Only Derek decides acceptance.

## 2. Stop means stop

- If Derek says **stop**, **wait**, or equivalent, all building, editing, packaging, command generation, repository writes, and tool-driven changes stop immediately.
- Work resumes only after a new explicit instruction.

## 3. Read before changing

Before substantial Folkhold build/repair/patch/validation/package/closeout work, read the current:

- `COMPANY_BIBLE.md`
- `README.md`
- `ROADMAP.md`
- `CHANGELOG.md`
- `docs/PROJECT_LOG.md`
- `docs/KNOWN_ISSUES.md`
- latest relevant validation record
- relevant feature documentation
- affected source files

Memory, summaries, prior-chat recollection, and assumptions are not substitutes for the current repository state.

Verify the active branch/head and affected runtime/deployment state before making claims about the baseline.

## 4. Scope and approval

- Proposal first, approval second, build third when Derek is discussing an idea rather than directly ordering implementation.
- A direct instruction such as **build**, **fix it**, **add it**, **update GitHub**, **document it**, or **close out the version** authorizes the stated scope only.
- Do not add unrelated cleanup, redesigns, dependencies, branches, workflows, repositories, or features to an authorized change.
- Project work belongs inside the authorized project unless Derek explicitly creates or authorizes a separate project/repository.
- Work in slices. Finish, document, and validate one coherent slice before sprawling into the next unless Derek explicitly combines them.

## 5. Git and GitHub

- Folkhold uses **one branch: `main`**.
- Do not create branches or pull requests unless Derek explicitly changes that rule.
- GitHub is read-only unless Derek explicitly authorizes a write or gives a clear action instruction that necessarily includes one.
- Build/test authorization is not automatically permission for unrelated GitHub cleanup or publication.
- Do not create temporary branches, tags, refs, workflow changes, or CI staging unless explicitly authorized.
- Prefer coherent commits that tell the project story rather than needless commit confetti.
- Verify the `main` head and GitHub Pages deployment state before reporting a deployment as live.

## 6. Versioning

Folkhold uses `MAJOR.MINOR.PATCH` from v1.1.0 forward.

- **PATCH**: bug fixes, compatibility repairs, visual polish, documentation corrections, cache fixes, and behavior-preserving maintenance.
- **MINOR**: a new user-facing feature or additive capability.
- **MAJOR**: a large incompatible product/architecture shift.
- Rejected or failed candidates do not automatically burn version numbers. Repair the same candidate until accepted unless Derek explicitly advances the version.
- Every accepted closeout updates `package.json`, `README.md`, `CHANGELOG.md`, and `docs/PROJECT_LOG.md`.
- `ROADMAP.md` is updated whenever future scope or priority changes.
- Known limitations remain visible until they are actually resolved.

## 7. Documentation and breadcrumb law

The project should leave a trail a future maintainer can follow.

- Preserve the README introduction unless Derek asks to rewrite it.
- The newest accepted version belongs near the top of the README, before older release history.
- Historical sections remain historical and are not rewritten to pretend they were current.
- Every substantial feature/add-on should leave documentation covering purpose, current state, important decisions, validation status, and unresolved work.
- `CHANGELOG.md` records user-visible version changes.
- `docs/PROJECT_LOG.md` records decisions, closeouts, and project history.
- `ROADMAP.md` records future work, not implied authorization.
- `docs/MEMORY_BANK.md` records durable distilled context and lessons until the dedicated external-memory repository exists.
- `docs/KNOWN_ISSUES.md` records unresolved defects/limitations truthfully.
- `docs/VALIDATION.md` records what was actually checked and what remains owner/device/service dependent.
- If the README and release records do not describe the exact state being closed out, closeout is incomplete.
- Newer explicit owner decisions override older historical UI/process rules. Do not silently resurrect superseded decisions.

## 8. Build and validation discipline

- No guessing about paths, source, versions, runtime behavior, deployment state, external-service capabilities, or compatibility.
- Inspect affected source before modifying it.
- Test the behavior that changed, not merely whether code parses or compiles.
- Treat warnings as errors during compiled/native work unless a project-specific record explicitly documents an unavoidable warning.
- Preserve rollback information when work becomes destructive or migration-heavy.
- Do not call something compiled, tested, fixed, or working unless the named compilation/test/behavior was actually exercised.
- If an external service, specific device, or Derek's machine is required for final proof, state that boundary instead of inventing success.

## 9. Packaging and terminal safety

These rules apply when Folkhold or a related Elderred project requires local binary/package handoff work.

- Prefer a changed-files-only package when that is sufficient.
- Include a manifest with path, byte count, and SHA-256 for packaged files when packaging is used.
- Do not package generated caches, temporary build trees, credentials, or unrelated user data.
- Preserve unexpected user/runtime files rather than deleting them as cleanup.
- Terminal command blocks must not contain `exit`/`exit 1` or anything intended to close Derek's interactive terminal.
- Do not put `set -euo pipefail` directly into Derek's interactive shell.
- Do not auto-open GUI tools or browser windows unless Derek asks.

## 10. Protected legal/project files

Do not modify licensing or legal-policy files merely as collateral cleanup. Files such as `LICENSE`, copyright notices, contributing terms, third-party notices, and licensing-policy documents require explicit authorization when a substantive policy change is involved.

## 11. Visual and asset rules

- Do not generate, redraw, reinterpret, or replace artwork unless Derek explicitly asks for image work.
- If Derek says **make a picture** or clearly requests image editing, that request authorizes image work for that task. Otherwise use code/CSS/existing assets or ask first.
- Approved artwork must be used exactly unless deterministic resize/format conversion is explicitly needed.
- Binary assets must be handled through binary-safe tooling and verified after upload.
- Generic code/CSS placeholders are preferred when a final visual asset has not been approved or when a platform-specific slot is fighting the approved artwork.
- Audio files are never left loose in `assets/`. Store them under `assets/audio/` by role: `music/`, `ambience/`, `sfx/`, or `voice/`. Keep playlist metadata in the radio/audio module rather than scattering media paths through unrelated UI code.
- New audio assets must have a clear source/license or owner-provided provenance recorded before they are treated as release assets.

## 12. Folkhold product truths

- Folkhold is one word.
- The main landing page is the **Hub**.
- A member owns a **Hold** containing Rooms.
- Account authentication is distinct from Hold/Room access.
- Access credentials are **Keys**, not Hold passwords.
- A Hold may welcome everyone at the front door while individual rooms remain public, Keyed, or private.
- The Village/Public Square is chronological public conversation, not engagement-ranked social media.
- The Tavern is adults-only and intentionally lightly moderated within a platform-wide legal/safety floor.
- The Tea Room is intentionally strict and civility-first.
- Folkhold remains proprietary source-available software unless Derek explicitly changes the license policy.

## 13. Interaction, payment, and privacy

- Private-room/video features require explicit participant consent.
- A paid private room must not charge the inviter before the invitee accepts.
- Do not present privacy claims that are no longer true after product changes.
- Payment/currency handling should use real currencies. Do not invent fake Folkhold currency unless Derek later requests it.
- Navigation-origin markers, such as the future Hanafi → Folkhold Majlis bridge, are presentation context only and must never grant authorization.

## 14. Hanafi relationship

Hanafi and Folkhold remain separate applications that complement one another.

- Derek's product metaphor is **Hanafi as the mother** and **Folkhold as the father**.
- This metaphor does not create a technical parent/child dependency or merge the repositories.
- The planned Hanafi community bridge button is named **Majlis**.
- Folkhold may show a temporary **← Hanafi** return control when a visitor arrived from Hanafi, while preserving normal Folkhold navigation.
- See `docs/HANAFI_BRIDGE.md` for the documented design. It remains roadmap work until implemented.

## 15. Memory and method refinement

- `docs/MEMORY_BANK.md` is the in-repository distilled memory bank until Derek creates the separate external-memory repository.
- When a mistake exposes a repeatable failure mode, record the corrected method in the Bible, memory bank, project log, or relevant feature doc.
- Do not silently resurrect superseded methods.
- Future external memory should supplement live project documentation, never replace reading the current repository before making changes.
