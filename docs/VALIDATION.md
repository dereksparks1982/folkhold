# Folkhold Validation Record

This file records what has actually been observed or verified. It is intentionally narrower than the roadmap or implementation claims.

## v1.1.0 closeout validation

### Repository / source

- `main` was verified as the authoritative branch before closeout work.
- The pre-closeout user-facing source head was `778579fba287960c92d3b7882618277410288715` (`Refresh medieval Hold door UI`).
- The v1.1.0 closeout documentation is intended to advance from that accepted UI state without changing the user-facing implementation.
- `package.json` is advanced from `1.0.0` to `1.1.0` as part of closeout bookkeeping.

### Door / Knock

Owner-observed:

- Derek confirmed the generic medieval Hold door appearance was acceptable enough to continue.
- Derek explicitly confirmed: **“knocking also works.”**

Implemented behavior retained for the baseline:

- double-click door
- prompt: **Do you wish to leave a knock?**
- Yes/No choices
- Yes emits the current prototype Knock event/confirmation path

Not validated as production behavior:

- persistence
- remote delivery to another account
- unread/read state
- rate limiting

### Navigation

Implemented in source:

- desktop top navigation
- order: Hub, Village Square, Notice Board, My Hold, Tavern, Tea Room, Directory, Key Ring, Ads
- desktop side rail hidden

This remains a normal regression check for future UI work.

### Icon state

Owner-observed:

- after the generic icon repair, Derek responded **“okay good”** and moved on to the Hold door work.

Implementation state:

- generic PNG app/browser icon sizes exist for 180, 192, and 512 surfaces
- top-left slot is forced to the generic PNG path
- platform cache behavior remains an external variable, especially installed iOS Home Screen shortcuts

### Global Chat

Historical v1 baseline:

- live Global Chat was previously tested through the Cloudflare WebSocket/Durable Object backend.

The v1.1.0 closeout work does not intentionally alter Global Chat logic. No claim is made here that every prior backend path was freshly retested during documentation-only closeout.

### Accounts

- Better Auth work remains staged.
- Production account activation is not considered validated until D1/secrets/provider configuration are connected and exercised.

### UO preservation inputs

Directly verified from the uploaded files on September 30, 2026:

`RunUO_2.0_Final_Repack_02-03-2011.7z`

- bytes: `26,072,522`
- SHA-256: `d8fc7e8461ceb1e3709b0b66572843ab594b9aa545d4c9239951183f4902963c`

`Patch_05-27-2012.7z`

- bytes: `4,455,659`
- SHA-256: `e2004f75f391abf255c69247c3baf7ee0243e82b6543ef3f40448649422b71ac`

Archive-content/client compatibility is a separate future validation slice and is not claimed complete here.

## Validation language rule

Future entries should distinguish:

- **implemented**: source contains the intended change
- **deployed**: hosting platform finished deploying the exact commit
- **observed**: a person/device actually displayed or exercised it
- **validated**: the defined test/acceptance condition passed
- **accepted**: Derek explicitly closed/accepted the version or slice

Do not collapse those into one word.
