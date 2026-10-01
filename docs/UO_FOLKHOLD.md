# UO Folkhold

## Purpose

**UO Folkhold** is the planned Ultima Online free shard for the Folkhold Game Room.

The preservation target is Derek's preferred old RunUO package. The objective is to preserve that version's behavior and content, determine the exact matching UO client/data set, get the server running reliably on Linux if practical, and only then integrate the shard into Folkhold.

## Preserved source packages supplied by Derek

The following fingerprints were computed directly from the uploaded archive bytes on September 30, 2026.

### RunUO 2.0 Final Repack

- File: `RunUO_2.0_Final_Repack_02-03-2011.7z`
- Size: `26,072,522` bytes
- SHA-256: `d8fc7e8461ceb1e3709b0b66572843ab594b9aa545d4c9239951183f4902963c`

### Later patch

- File: `Patch_05-27-2012.7z`
- Size: `4,455,659` bytes
- SHA-256: `e2004f75f391abf255c69247c3baf7ee0243e82b6543ef3f40448649422b71ac`

These binary archives are preservation inputs, not Folkhold web assets. They should not be casually committed into the Folkhold repository. Derek intends to create a dedicated repository for the UO work later.

## Exact client version: not locked yet

Do **not** guess the UO client version from the words “RunUO 2.0 Final.”

This is a dated **repack** plus a later **2012 patch**, so stock RunUO compatibility tables may not describe the exact modified package Derek preserved. Historical documentation can narrow the search, but the accepted client must be proven from the actual archive contents and runtime behavior.

## Why the ground can look wrong

A server/client protocol match is not enough. Ultima Online terrain appearance also depends on the client data set and file format used by that era. Relevant data can include map, statics/index, tiledata, art/texture data, and later container/patch formats.

If the server/world was built against one era's map/static/tile data while the player client is using a later changed data set, towns and terrain can render incorrectly even when login and movement work.

**Ocllo/Occlo is a required regression location** because Derek has previously seen ground changes there expose bad client/data pairings.

## Client-compatibility gate

Before declaring a client supported:

1. Preserve the original archives unchanged.
2. Produce a full manifest and per-file hashes after extraction.
3. Extract the repack and patch separately.
4. Diff the later patch against the base repack and document every replaced/added/removed file.
5. Inspect server source/configuration for client-version gates, packet branches, expansion flags, data-path assumptions, map/static handling, and patch/diff behavior.
6. Search the preserved package itself for notes identifying the intended client version or data set.
7. Build a small candidate-client matrix from evidence rather than random trial and error.
8. Validate Ocllo/Occlo terrain, buildings, coastlines, statics, Z heights, and walkability.
9. Validate several additional known locations so a one-town coincidence cannot pass.
10. Hash and archive the accepted client/data set once the match is proven.
11. Record the exact client executable/data version in this document before Folkhold integration begins.

**Do not run an official auto-patcher on the accepted frozen client baseline once it is pinned.** A data update could silently invalidate a previously correct shard/client pairing.

## Linux port plan

The first objective is preservation, not modernization for its own sake.

### Phase A: untouched baseline

- unpack in an isolated working copy
- preserve archive fingerprints and create extracted manifests
- identify bundled binaries/source/scripts
- determine .NET/Mono/toolchain assumptions from the actual files
- establish reference behavior on an environment compatible with the original package if practical

### Phase B: Linux compile/runtime adaptation

- use the closest practical compatible Mono/.NET toolchain supported by the source
- fix genuine portability/build failures first
- keep changes small and documented
- keep Windows-specific helpers optional rather than rewriting game logic
- do not replace the repack with a newer emulator just because the newer project is easier to compile

### Phase C: runtime validation

- server starts cleanly
- world/scripts load
- account creation/login
- character creation
- movement and combat
- NPC/vendor/spawn systems
- saves/restart/persistence
- clean shutdown
- Ocllo/Occlo terrain validation with the pinned client
- multiple concurrent local clients
- external connection test only when networking is intentionally opened

### Phase D: Folkhold integration

Only after the standalone shard is stable:

- Game Room server status
- owner/admin Start/Stop
- Join/Launch control or clear client instructions for permitted users
- shard address/client-package guidance
- online player count/health
- logs/status surfaced without exposing server secrets

## Preservation rule

Do not replace this project with ServUO, Sphere, or a modern RunUO fork merely because it is easier. Other projects may be consulted for historical or Linux-port clues, but **UO Folkhold's baseline is Derek's preserved RunUO 2.0 Final Repack** unless Derek explicitly changes that decision.

## Current status

- Original archive fingerprints: **verified**
- Full archive inventory: **next slice**
- Patch diff: **not yet completed**
- Exact UO client/data baseline: **not yet pinned**
- Linux port: **not yet started**
- Folkhold Game Room integration: **not yet started**

See `docs/TASK_SLICES.md` for the execution order.
