# UO Folkhold Archive Forensics — 2026-09-30

Status: **forensic slice complete; runtime client pinning remains unverified**

This report records what was actually found inside Derek's preserved RunUO archives before any Linux port or Folkhold integration work. The original uploaded archives were read without modifying them.

## Source archives

### Outer working archive

`RunUO_2.0_Final_Repack_02-03-2011.7z`

- bytes: `26,072,522`
- SHA-256: `d8fc7e8461ceb1e3709b0b66572843ab594b9aa545d4c9239951183f4902963c`
- archive entries: `9,595`
- regular files: `9,016`

This outer archive is **not merely a pristine 2011 distribution**. It contains later runtime state, including 2026 Saves/Backups/Logs and a 2026-edited `Scripts/Misc/DataPath.cs`. Treat the outer archive as Derek's preserved working tree and treat its account/save material as private runtime state.

### Embedded repack baseline

The outer archive contains:

`RunUO_2.0_Final_Repack_02-03-2011/RunUO_2.0_Final_Repack_02-03-2011.7z`

- bytes: `9,037,377`
- SHA-256: `9cf93288a184ab67edcf78a98c15a0868e70b394d274bc8ea98d4fc68ee85b4b`
- archive entries: `9,536`
- regular files: `8,980`
- regular `Scripts/` files: `3,446`

This embedded archive is the best preserved baseline found inside the uploaded working tree and is the reference used for the patch comparison below.

### Outer 2012 patch archive

`Patch_05-27-2012.7z`

- bytes: `4,455,659`
- SHA-256: `e2004f75f391abf255c69247c3baf7ee0243e82b6543ef3f40448649422b71ac`

It contains one nested patch archive:

`Patch_05-27-2012/Patch_05-27-2012.7z`

- bytes: `4,455,194`
- SHA-256: `00dd5263508d2fe96a35401951239272f6e7953c24156eccdb3d1f941b7e366c`
- entries: `4,356`
- regular files: `3,838`
- all regular content is under `Scripts/`

## Full-manifest evidence

During this forensic pass, full SHA-256/size/path manifests were generated from the embedded repack baseline and nested 2012 patch.

- embedded baseline manifest: `8,980` regular-file records
  - manifest bytes: `998,645`
  - manifest SHA-256: `7e9af2dc494322035caa096195c4fa9ef27cea249575da91464c41159e624547`
- nested 2012 patch manifest: `3,838` regular-file records
  - manifest bytes: `477,438`
  - manifest SHA-256: `e06ed3e4eed1a58a0bfe188551a2baa5598d741ea50da2a0584a0138e482aa10`

The private outer working tree was deliberately **not** published as a full path manifest because it contains live/preserved save and backup state. Its source-tree differences are summarized below instead.

## 2012 patch vs embedded baseline

Comparing the patch's `Scripts/` tree against the embedded repack baseline:

- files added by patch: **392**
- files removed by patch: **0**
- existing files changed by patch: **67**
- existing files unchanged: **3,379**

The additions are mostly custom systems/content. The largest groups are the Jupiter, Saturn, Lord Destiny, and Lord Mumbane custom packages. The changed set includes core-ish scripts such as:

- `Scripts/Misc/ClientVerification.cs`
- `Scripts/Misc/DataPath.cs`
- `Scripts/Misc/CharacterCreation.cs`
- `Scripts/Misc/ServerList.cs`
- `Scripts/Misc/AutoSave.cs`
- `Scripts/Engines/AI/Creature/BaseCreature.cs`
- crafting/help/container/vendor and creature scripts
- compiled `Scripts/Output/Scripts.CS.dll` and its hash

The patch ships a rebuilt `Scripts/Output/Scripts.CS.dll`:

- bytes: `7,352,320`
- SHA-256: `1ff60a67f54d6b24bc2b5c20da376313d13e7908fbc4d7b71e8b5ac6d0fb4fdb`

For a Linux port, source scripts are the authority. The old compiled script cache should not be treated as the Linux build target.

## Outer working tree vs embedded baseline

The outer uploaded working tree is much closer to the embedded baseline than to the 2012 patch.

For `Scripts/`, compared directly with the embedded baseline:

- added: **1**
- removed: **44**
- changed: **5**
- unchanged common files: **3,397**

The five changed files are:

- `Scripts/Daat99/New/Daat99 Control Center Gumps.cs`
- `Scripts/Daat99/Tokens/Lady Luck.cs`
- `Scripts/Engines/Craft/DefTinkering.cs`
- `Scripts/Misc/DataPath.cs`
- `Scripts/Output/Scripts.CS.hash`

The one added file is:

- `Scripts/Daat99/Tokens/Safe Trash 4 Tokens Backpack.txt.cs`

The removed set includes selected custom scripts plus the old compiled `Scripts/Output/Scripts.CS.dll`.

**Conclusion:** the separate 2012 patch is **not applied wholesale** to the uploaded working tree. We must not treat the outer working tree as “base + 2012 patch.” Applying that patch later is a deliberate migration decision, not a restoration assumption.

## RunUO executable identity

The same `RunUO.exe` exists in both the embedded baseline and outer working tree.

- bytes: `585,728`
- SHA-256: `43cf9055f8c52f5b45059ba081803ef85df97fff72020156005b6d1f51e77005`
- format: PE32 Windows console application, i386 Mono/.NET assembly
- embedded File/Product version: **2.0.3567.2838**
- PE timestamp: October 7, 2009

The archive does not provide a complete modern core-source build tree beside this executable. Therefore the first Linux-port experiment should be to run the preserved .NET assembly under a compatible Mono runtime and adapt paths/runtime assumptions minimally before considering reconstruction/recompilation of the core.

## Expansion and map assumptions

Both the embedded baseline and 2012 patch use:

`Expansion.ML`

So the intended rules/content baseline is **Mondain's Legacy**.

`MapDefinitions.cs` registers:

- Felucca: `7168 × 4096`
- Trammel: `7168 × 4096`
- Ilshenar: `2304 × 1600`
- Malas: `2560 × 2048`
- Tokuno: `1448 × 1448`

It also explicitly contains:

`TileMatrixPatch.Enabled = false; // OSI client patch 6.0.0.0`

This is relevant to the client-data boundary and reinforces that later client data cannot be treated as interchangeable.

## The strongest client-version evidence

### 1. Repack's own update history warns against > 6.0.0.0

The embedded `UPDATES.TXT` states that the repack authors suggest **not using anything over client Patch v6.0.0.0**, because later versions begin producing `TID: Provided Token Out Of Range` problems.

### 2. The repack documents a known 7.0.4.2 world-placement failure

The same history says the repack was originally created while running against **client patch v7.0.4.2**, and that many teleporters were being spawned **underground** rather than where they belonged. The authors then cleared/redecorated/respawned the world to compensate.

That is direct historical evidence for exactly the class of ground/world mismatch Derek remembers. It is a strong reason **not to begin client testing in the 7.x era**.

### 3. Derek's preserved working tree points at 5.0.9.1

The outer working tree's 2026-edited `Scripts/Misc/DataPath.cs` explicitly points to:

`C:\Games\Ultima Online\Clients\uoml_setup_fully_patched_5.0.9.1`

This is the strongest exact-version breadcrumb in Derek's own preserved state.

### 4. 6.0.0.0 is a behavior boundary elsewhere too

`CharacterCreation.cs` defines the New Haven client boundary as `6.0.0.0`, and `ClientVerification.cs` includes a commented `Required = new ClientVersion("6.0.0.0")` example.

### 5. A 6.0.3.1 string exists but is not shard-wide evidence

The Stargate custom system contains help text saying it uses `6.0.3.1` client files for particular gumps/items. That is a custom-system note. It does not outweigh the repack-wide update-history warning about clients above `6.0.0.0`.

## Client enforcement behavior

Embedded baseline `ClientVerification.cs`:

- `m_DetectClientRequirement = true`
- old-client response = `LenientKick`
- when a `client.exe` is found in the configured data path, the server reads its file version and uses it as the minimum required version

2012 patch `ClientVerification.cs` changes this to:

- `m_DetectClientRequirement = false`
- old-client response = `Ignore`

So the 2012 patch deliberately stops automatic enforcement of the data-path client's version.

## Data-path behavior

Embedded baseline:

- `CustomPath = null`
- falls back to the installed UO registry path or an entered data directory

Outer preserved working tree:

- points directly at Derek's `uoml_setup_fully_patched_5.0.9.1` directory

2012 patch:

- points to `C:\RunUO 2.0\World Data`

The patch archive itself contains only `Scripts/`; it does **not** contain a `World Data` directory. Therefore the patch expects a separate data directory/resource that is not supplied by the patch archive itself. Blindly copying the patch and keeping that path would leave the server without the expected world data.

## Historical shard-specific patch settings

The 2012 patch's `ServerList.cs` contains old shard-specific values, including the server name `Terabithia (ML)` and an old dynamic-DNS hostname. Those are historical configuration artifacts and must not be carried into UO Folkhold unchanged.

## Client test matrix after forensics

### Candidate A — UO ML 5.0.9.1

**Priority: first test**

Reason:

- exact path intentionally present in Derek's preserved working tree
- Mondain's Legacy era
- below the repack's `6.0.0.0` warning boundary

Required proof:

- server boot against this data set
- login/character creation
- Ocllo/Occlo terrain, statics, buildings, coastline, Z height, doors/teleporters, and walkability
- several additional towns/dungeons

### Candidate B — controlled 6.0.0.0-era data set

**Priority: second/reference test if needed**

Reason:

- explicit repack warning boundary
- explicit `TileMatrixPatch` comment and client-version references

Use only if 5.0.9.1 exposes a specific incompatibility or if a clean A/B comparison is needed.

### 7.x clients

**Do not use as the initial baseline.** The repack itself documents 7.0.4.2 causing underground placement problems.

## Slice 1 conclusion

The archive-forensics goal is satisfied:

- original archive fingerprints verified
- embedded baseline identified and fingerprinted
- patch nested archive identified and fingerprinted
- full baseline/patch manifests generated
- patch diff quantified
- outer working tree distinguished from both clean baseline and patch
- executable identity determined
- expansion/map/client enforcement/data-path behavior inspected
- exact historical evidence for the >6.0.0.0 and 7.0.4.2 problems recovered
- client test matrix narrowed to **5.0.9.1 first**, **6.0.0.0-era second/reference**

What is **not** claimed:

- 5.0.9.1 is not yet the accepted final client
- Ocllo/Occlo has not yet been runtime-tested in this environment
- Linux/Mono execution has not yet been tested
- the 2012 patch has not been applied

The next technical slice is client pinning, which requires the candidate UO client/data set to be available for runtime testing.
