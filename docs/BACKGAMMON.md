# Folkhold Backgammon

Status: **Roadmapped, AI-first**

## Product intent

Folkhold should have a real Backgammon table in the Game Room.

The first version is for one person playing against a genuine computer opponent. Remote play with friends comes later after accounts, persistence, and realtime match transport are ready.

The guiding sequence is:

**player vs real AI first -> remote play with friends later**

## What “real AI” means here

The opponent must not simply choose a random legal move or use a cosmetic difficulty label.

The AI should:

- enumerate legal move sequences for the current dice
- evaluate resulting board positions
- compare competing legal sequences
- search ahead where practical
- understand race versus contact positions
- value pip count, blots, anchors, primes, made points, home-board strength, trapped checkers, bar pressure, and bearing-off efficiency
- make repeatable, explainable decisions from the game state

A first implementation does not need to reproduce a world-championship backgammon engine, but it must behave like an actual opponent making informed choices.

## Architecture

Keep three layers separate from the start.

### 1. Rules / state engine

Responsible for:

- board representation
- dice
- legal move generation
- doubles
- using both dice where legally required
- bar entry
- hitting/blots
- blocked points
- bearing off
- turn transitions
- win detection
- gammon/backgammon scoring foundations

This layer must not depend on DOM/UI code.

### 2. AI engine

Consumes only legal game state and legal move sequences.

Initial direction:

- heuristic board evaluation
- search across legal move sequences
- controlled lookahead/expectation over future rolls where performance allows
- deterministic tests for known board positions

Difficulty may later vary evaluation/search strength. Easy mode must still obey the rules and make coherent choices.

### 3. Presentation

The browser UI renders the board and sends player actions to the rules engine.

The first version should work entirely in the browser so Derek can play against AI without requiring login, Cloudflare state, or another player.

## Stage A acceptance requirements

A local AI release is not complete until it can validate at least:

- normal opening and movement
- doubles
- forced bar entry
- blocked bar entry
- hitting and placing an opponent checker on the bar
- bearing off with exact and oversize rolls where legal
- situations where only one die can be played
- situations where the higher die must be used when only one can be played
- no illegal move through/onto blocked points
- complete game through win state
- AI returns a legal move for every playable state in the test set

The AI should also have repeatable benchmark positions so later refactoring cannot silently turn it into a worse/random player.

## Stage B: remote play with friends

Remote play is a later slice, not a requirement for the first playable version.

Planned behavior:

- invite a Folkhold member to Backgammon
- recipient accepts/declines
- server owns authoritative dice and match state
- clients submit moves rather than deciding truth independently
- server validates moves against the same rules model
- realtime turn synchronization
- reconnect/resume
- game invitation appears through the future Hold activity / Visitor Ledger system
- optional public/private tables later

Cloudflare Durable Objects are a likely fit because Folkhold already uses them for realtime Global Chat, but the exact transport should be verified when the remote-play slice begins rather than treated as an irreversible decision now.

## Version / slice boundary

- **Slice 13:** browser Backgammon vs real AI
- **Slice 14:** remote Backgammon with friends

The local rules engine is the foundation for both. Remote play should reuse it rather than inventing a second set of backgammon rules on the server.

## Breadcrumb

Backgammon was added to the Folkhold roadmap on October 1, 2026 after Derek specified that Folkhold should have Backgammon with a real AI opponent first and remote play with friends later.
