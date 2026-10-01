# UO Folkhold

## Purpose

**UO Folkhold** is the planned Ultima Online free shard for the Folkhold Game Room.

The preservation target is Derek's preferred old RunUO package. The objective is to preserve that version's behavior and content, determine the exact matching UO client/data set, get the server running reliably on Linux if practical, and only then integrate the shard into Folkhold.

## Preserved source packages supplied by Derek

The following fingerprints were computed directly from the uploaded archive bytes on September 30, 2026.

### RunUO 2.0 Final Repack working archive

- File: `RunUO_2.0_Final_Repack_02-03-2011.7z`
- Size: `26,072,522` bytes
- SHA-256: `d8fc7e8461ceb1e3709b0b66572843ab594b9aa545d4c9239951183f4902963c`

The outer archive contains later runtime state, including 2026 Saves/Backups and a later DataPath edit. It is Derek's preserved working tree, not merely a pristine 2011 distribution. Private account/save data must not be casually published.

### Embedded repack baseline

The working archive contains an embedded baseline archive:

- File: `RunUO_2.0_Final_Repack_02-03-2011/RunUO_2.0_Final_Repack_02-03-2011.7z`
- Size: `9,037,377` bytes
- SHA-256: `9cf93288a184ab67edcf78a98c15a0868e70b394d274bc8ea98d4fc68ee85b4b`
- Regular files: `8,980`
- Regular `Scripts/` files: `3,446`

This embedded archive is the reference baseline used for the 2012 patch comparison.

### Later patch

Outer file:

- File: `Patch_05-27-2012.7z`
- Size: `4,455,659` bytes
- SHA-256: `e2004f75f391abf255c69247c3baf7ee0243e82b6543ef3f40448649422b71ac`

Nested patch payload:

- File: `Patch_05-27-2012/Patch_05-27-2012.7z`
- Size: `4,455,194` bytes
- SHA-256: `00dd5263508d2fe96a35401951239272f6e7953c24156eccdb3d1f941b7e366c`
- Regular files: `3,838`, all under `Scripts/`

The patch is **not applied wholesale** to Derek's uploaded working tree. It must be treated as a separate migration option rather than assumed current state.

See `UO_FORENSICS_2026-09-30.md` for the full findings.

## Forensic client findings

The exact client is not formally pinned until runtime testing, but the archive evidence now narrows the search substantially.

### First candidate: UO ML 5.0.9.1

Derek's preserved 2026 working-tree `Scripts/Misc/DataPath.cs` explicitly points to:

`C:\Games\Ultima Online\Clients\uoml_setup_fully_patched_5.0.9.1`

This is the strongest exact client/data breadcrumb in Derek's preserved state and is therefore the **first client to test**.

### Hard upper-era warning from the repack itself

The embedded repack's own `UPDATES.TXT` says the authors suggest **not using anything over client Patch v6.0.0.0**, because later clients cause `TID: Provided Token Out Of Range` problems.

The same history records that the repack was originally created while running against **client patch v7.0.4.2**, and that many teleporters were being spawned **underground** instead of where they belonged. The authors cleared/redecorated/respawned the world to compensate.

That is direct historical evidence for the same class of terrain/world mismatch Derek remembers around Ocllo/Occlo. **Do not start UO Folkhold client testing in 7.x.**

### Second/reference candidate

A controlled **6.0.0.0-era** data set is the next comparison target if 5.0.9.1 exposes a specific problem or an A/B boundary test is needed.

### Expansion/map state

Both baseline and patch use `Expansion.ML`.

Map definitions include:

- Felucca `7168 × 4096`
- Trammel `7168 × 4096`
- Ilshenar `2304 × 1600`
- Malas `2560 × 2048`
- Tokuno `1448 × 1448`

`MapDefinitions.cs` also explicitly has:

`TileMatrixPatch.Enabled = false; // OSI client patch 6.0.0.0`

## 2012 patch behavior that matters

Against the embedded baseline, the nested 2012 patch has:

- **392 added** script files
- **67 changed** existing script files
- **0 removed** baseline script files
- **3,379 unchanged** common script files

Important changes include `DataPath.cs`, `ClientVerification.cs`, `CharacterCreation.cs`, `ServerList.cs`, `AutoSave.cs`, several engines/content scripts, and a rebuilt script assembly.

Baseline `ClientVerification.cs` auto-detects the `client.exe` version in the configured data path and uses `LenientKick` for older clients.

The 2012 patch changes this to:

- `m_DetectClientRequirement = false`
- old-client response = `Ignore`

The patch also changes `DataPath.cs` to:

`C:\RunUO 2.0\World Data`

but the patch archive contains only Scripts and does **not** supply that World Data directory. The patch therefore cannot be blindly copied and expected to provide its own map/statics data.

Its `ServerList.cs` also contains historical shard-specific values that must not be carried into UO Folkhold unchanged.

## RunUO executable / Linux implication

The baseline and working tree contain the same `RunUO.exe`:

- Size: `585,728` bytes
- SHA-256: `43cf9055f8c52f5b45059ba081803ef85df97fff72020156005b6d1f51e77005`
- PE32 Windows console application
- i386 Mono/.NET assembly
- File/Product version: **2.0.3567.2838**

The package does not include a complete modern core-source build tree beside that executable. Therefore Linux work should begin by attempting to run the preserved .NET assembly under a compatible Mono runtime and adapting paths/runtime assumptions minimally. Reconstructing or replacing the RunUO core is not the first move.

## Why the ground can look wrong

A server/client protocol match is not enough. Ultima Online terrain appearance depends on the matching client data set and file format for that era: map, statics/index, tiledata, art/texture data, diffs, and later container formats.

If the world was generated against one era's data while the client/server later reads another, towns and terrain can render or place objects incorrectly even when login and movement work.

**Ocllo/Occlo is a required regression location** because Derek has seen this class of mismatch there before and the repack's own history confirms later-client world-placement failures.

## Client-compatibility gate

Before declaring a client supported:

1. Preserve the original archives unchanged.
2. Use **5.0.9.1 as Candidate A**.
3. Use a controlled **6.0.0.0-era** data set only as Candidate B/reference if needed.
4. Do not use 7.x as the initial baseline.
5. Start the server against the candidate data set.
6. Verify login and character creation.
7. Validate Ocllo/Occlo terrain, buildings, coastlines, statics, Z heights, doors/teleporters, and walkability.
8. Validate several additional towns/dungeons so a one-town coincidence cannot pass.
9. Hash and archive the accepted client/data set once proven.
10. Record the exact client executable/data version here before Folkhold integration begins.

**Do not run an official auto-patcher on the accepted frozen client baseline once it is pinned.** A data update could silently invalidate a previously correct shard/client pairing.

## Linux port plan

The first objective is preservation, not modernization for its own sake.

### Phase A: preserved-runtime baseline

- keep original archive fingerprints
- preserve extracted manifests and patch forensic record
- obtain/provide Candidate A client data
- establish reference behavior using the existing `RunUO.exe`

### Phase B: Linux runtime adaptation

- use a compatible Mono runtime for the preserved .NET assembly
- change Windows-only filesystem/config paths only as required
- let script source rebuild its cache rather than treating the old compiled `Scripts.CS.dll` as the target
- fix genuine portability/runtime failures minimally and document every change
- do not replace the repack with a newer emulator simply because it is easier

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
- Embedded baseline identified: **verified**
- Baseline/patch manifests: **generated and fingerprinted**
- Patch-vs-baseline diff: **completed**
- Outer working-tree relationship to baseline/patch: **completed**
- First client candidate: **5.0.9.1 identified, not yet runtime-accepted**
- Ocllo/Occlo runtime regression: **not yet tested**
- Linux/Mono runtime test: **not yet started**
- Folkhold Game Room integration: **not yet started**

See `docs/TASK_SLICES.md` for the execution order and `docs/UO_FORENSICS_2026-09-30.md` for the forensic evidence.
