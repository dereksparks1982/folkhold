import assert from 'node:assert/strict';

await import('../backgammon-engine.js');

const E = globalThis.FolkholdBackgammonEngine;
assert.ok(E, 'Backgammon engine should register on globalThis.');

const { HUMAN, AI } = E;

function emptyState() {
  return {
    points: Array(24).fill(0),
    bar: { human: 0, ai: 0 },
    off: { human: 0, ai: 0 }
  };
}

function sequenceIsLegal(state, player, dice, sequence) {
  return E.generateSequences(state, player, dice)
    .some(candidate => JSON.stringify(candidate) === JSON.stringify(sequence));
}

{
  const state = E.initialState();
  assert.equal(E.validateState(state), true);
  assert.equal(E.playerTotal(state, HUMAN), 15);
  assert.equal(E.playerTotal(state, AI), 15);
  assert.equal(E.pipCount(state, HUMAN), 167);
  assert.equal(E.pipCount(state, AI), 167);
}

{
  const state = emptyState();
  state.points[7] = 1;   // human checker on point 8
  state.points[4] = -1;  // AI blot on point 5
  state.off.human = 14;
  state.off.ai = 14;

  const next = E.applyMove(state, HUMAN, { from: 8, to: 5, die: 3 });
  assert.equal(next.points[4], 1, 'Human checker should occupy hit point.');
  assert.equal(next.bar.ai, 1, 'Hit AI checker should move to the bar.');
}

{
  const state = emptyState();
  state.bar.human = 1;
  state.off.human = 14;
  state.points[23] = -2; // point 24 blocked
  state.off.ai = 13;

  assert.deepEqual(E.singleMoves(state, HUMAN, 1), [], 'A checker on the bar cannot enter a blocked point.');
}

{
  const state = emptyState();
  state.points[0] = 15;
  state.off.ai = 15;

  assert.equal(E.allInHome(state, HUMAN), true);
  assert.ok(E.singleMoves(state, HUMAN, 1).some(move => move.from === 1 && move.to === 'off'));
}

{
  const state = emptyState();
  state.points[0] = 14;
  state.points[2] = 1;
  state.off.ai = 15;

  const moves = E.singleMoves(state, HUMAN, 6);
  assert.ok(!moves.some(move => move.from === 1 && move.to === 'off'), 'Oversize bear-off cannot skip a checker farther from home.');
  assert.ok(moves.some(move => move.from === 3 && move.to === 'off'), 'Farthest checker may bear off with an oversize die.');
}

{
  const state = emptyState();
  state.bar.human = 1;
  state.off.human = 14;
  state.points[23] = -2; // blocks die 1 entry at point 24
  state.points[21] = -2; // blocks subsequent die 1 move after die 2 entry at point 23
  state.off.ai = 11;

  const sequences = E.generateSequences(state, HUMAN, [1, 2]);
  assert.ok(sequences.length > 0);
  assert.ok(sequences.every(sequence => sequence.length === 1 && sequence[0].die === 2), 'When only one die can be played, the higher die must be used.');
}

{
  const state = emptyState();
  state.points[5] = 15;
  state.off.ai = 15;

  const sequences = E.generateSequences(state, HUMAN, [1, 1, 1, 1]);
  assert.ok(sequences.some(sequence => sequence.length === 4), 'Doubles should allow four moves when four are legal.');
}

{
  const gammon = emptyState();
  gammon.off.human = 15;
  gammon.points[23] = -15;
  assert.equal(E.winner(gammon), HUMAN);
  assert.equal(E.winMultiplier(gammon, HUMAN), 2);

  const backgammon = emptyState();
  backgammon.off.human = 15;
  backgammon.bar.ai = 1;
  backgammon.points[23] = -14;
  assert.equal(E.winMultiplier(backgammon, HUMAN), 3);

  const normalWin = emptyState();
  normalWin.off.human = 15;
  normalWin.off.ai = 1;
  normalWin.points[23] = -14;
  assert.equal(E.winMultiplier(normalWin, HUMAN), 1);
}

{
  const state = E.initialState();
  const originalKey = E.stateKey(state);
  const dice = [3, 1];
  const sequence = E.chooseAISequence(state, dice, { strength: 'strong' });

  assert.ok(sequence.length > 0, 'AI should choose a move when legal moves exist.');
  assert.equal(sequenceIsLegal(state, AI, dice, sequence), true, 'AI choice must be a legal complete sequence.');
  assert.equal(E.stateKey(state), originalKey, 'AI search must not mutate the input state.');
}

console.log('PASS: Folkhold Backgammon engine rule and AI regression suite.');
