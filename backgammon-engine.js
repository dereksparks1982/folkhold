(() => {
  'use strict';

  const HUMAN = 'human';
  const AI = 'ai';
  const CHECKERS_PER_PLAYER = 15;

  function opponent(player) {
    return player === HUMAN ? AI : HUMAN;
  }

  function cloneState(state) {
    return {
      points: [...state.points],
      bar: { human: state.bar.human, ai: state.bar.ai },
      off: { human: state.off.human, ai: state.off.ai }
    };
  }

  function initialState() {
    const points = Array(24).fill(0);

    // Human moves from point 24 down toward point 1.
    points[23] = 2;
    points[12] = 5;
    points[7] = 3;
    points[5] = 5;

    // AI moves from point 1 up toward point 24.
    points[0] = -2;
    points[11] = -5;
    points[16] = -3;
    points[18] = -5;

    return {
      points,
      bar: { human: 0, ai: 0 },
      off: { human: 0, ai: 0 }
    };
  }

  function pointCount(state, player, point) {
    const value = state.points[point - 1] || 0;
    if (player === HUMAN) return Math.max(0, value);
    return Math.max(0, -value);
  }

  function opponentCount(state, player, point) {
    return pointCount(state, opponent(player), point);
  }

  function playerTotal(state, player) {
    let total = state.bar[player] + state.off[player];
    for (let point = 1; point <= 24; point += 1) total += pointCount(state, player, point);
    return total;
  }

  function isHomePoint(player, point) {
    return player === HUMAN ? point >= 1 && point <= 6 : point >= 19 && point <= 24;
  }

  function allInHome(state, player) {
    if (state.bar[player] > 0) return false;
    for (let point = 1; point <= 24; point += 1) {
      if (pointCount(state, player, point) > 0 && !isHomePoint(player, point)) return false;
    }
    return true;
  }

  function canLand(state, player, point) {
    return point >= 1 && point <= 24 && opponentCount(state, player, point) < 2;
  }

  function mayBearOffFrom(state, player, point, die) {
    if (!allInHome(state, player)) return false;

    const distance = player === HUMAN ? point : 25 - point;
    if (die === distance) return true;
    if (die < distance) return false;

    if (player === HUMAN) {
      for (let farther = point + 1; farther <= 6; farther += 1) {
        if (pointCount(state, player, farther) > 0) return false;
      }
      return true;
    }

    for (let farther = point - 1; farther >= 19; farther -= 1) {
      if (pointCount(state, player, farther) > 0) return false;
    }
    return true;
  }

  function singleMoves(state, player, die) {
    if (!Number.isInteger(die) || die < 1 || die > 6) return [];
    const moves = [];

    if (state.bar[player] > 0) {
      const destination = player === HUMAN ? 25 - die : die;
      if (canLand(state, player, destination)) {
        moves.push({ from: 'bar', to: destination, die });
      }
      return moves;
    }

    for (let point = 1; point <= 24; point += 1) {
      if (pointCount(state, player, point) === 0) continue;

      const destination = player === HUMAN ? point - die : point + die;
      if (destination >= 1 && destination <= 24) {
        if (canLand(state, player, destination)) moves.push({ from: point, to: destination, die });
        continue;
      }

      if (mayBearOffFrom(state, player, point, die)) {
        moves.push({ from: point, to: 'off', die });
      }
    }

    return moves;
  }

  function applyMove(state, player, move) {
    const next = cloneState(state);
    const sign = player === HUMAN ? 1 : -1;
    const foe = opponent(player);

    if (move.from === 'bar') {
      if (next.bar[player] <= 0) throw new Error('Cannot move from an empty bar.');
      next.bar[player] -= 1;
    } else {
      const index = Number(move.from) - 1;
      if (!Number.isInteger(index) || index < 0 || index >= 24 || pointCount(next, player, Number(move.from)) <= 0) {
        throw new Error('Move source does not contain a checker.');
      }
      next.points[index] -= sign;
    }

    if (move.to === 'off') {
      next.off[player] += 1;
      return next;
    }

    const destination = Number(move.to);
    if (!canLand(next, player, destination)) throw new Error('Destination is blocked.');
    const index = destination - 1;

    if (opponentCount(next, player, destination) === 1) {
      next.points[index] = 0;
      next.bar[foe] += 1;
    }

    next.points[index] += sign;
    return next;
  }

  function diceOrders(dice) {
    if (!Array.isArray(dice) || dice.length === 0) return [];
    if (dice.length !== 2 || dice[0] === dice[1]) return [[...dice]];
    return [[dice[0], dice[1]], [dice[1], dice[0]]];
  }

  function sequenceKey(sequence) {
    return sequence.map(move => `${move.from}>${move.to}:${move.die}`).join('|');
  }

  function generateSequences(state, player, dice) {
    const raw = [];

    for (const order of diceOrders(dice)) {
      const walk = (position, dieIndex, sequence) => {
        if (dieIndex >= order.length) {
          raw.push(sequence);
          return;
        }

        const die = order[dieIndex];
        const moves = singleMoves(position, player, die);
        if (moves.length === 0) {
          walk(position, dieIndex + 1, sequence);
          return;
        }

        for (const move of moves) {
          walk(applyMove(position, player, move), dieIndex + 1, [...sequence, move]);
        }
      };

      walk(state, 0, []);
    }

    if (raw.length === 0) return [];
    const maxLength = Math.max(...raw.map(sequence => sequence.length));
    let filtered = raw.filter(sequence => sequence.length === maxLength);

    // If only one of two different dice can be played, the higher die must be used.
    if (dice.length === 2 && dice[0] !== dice[1] && maxLength === 1) {
      const higher = Math.max(dice[0], dice[1]);
      if (filtered.some(sequence => sequence[0]?.die === higher)) {
        filtered = filtered.filter(sequence => sequence[0]?.die === higher);
      }
    }

    const unique = new Map();
    for (const sequence of filtered) unique.set(sequenceKey(sequence), sequence);
    return [...unique.values()];
  }

  function legalFirstMoves(state, player, dice) {
    const unique = new Map();
    for (const sequence of generateSequences(state, player, dice)) {
      const first = sequence[0];
      if (!first) continue;
      unique.set(`${first.from}>${first.to}:${first.die}`, first);
    }
    return [...unique.values()];
  }

  function applySequence(state, player, sequence) {
    return sequence.reduce((position, move) => applyMove(position, player, move), state);
  }

  function pipCount(state, player) {
    let total = state.bar[player] * 25;
    for (let point = 1; point <= 24; point += 1) {
      const distance = player === HUMAN ? point : 25 - point;
      total += pointCount(state, player, point) * distance;
    }
    return total;
  }

  function madePoints(state, player) {
    let total = 0;
    for (let point = 1; point <= 24; point += 1) {
      if (pointCount(state, player, point) >= 2) total += 1;
    }
    return total;
  }

  function homeStrength(state, player) {
    let score = 0;
    for (let point = 1; point <= 24; point += 1) {
      if (!isHomePoint(player, point)) continue;
      const count = pointCount(state, player, point);
      if (count >= 2) score += 1;
    }
    return score;
  }

  function blotCount(state, player) {
    let total = 0;
    for (let point = 1; point <= 24; point += 1) {
      if (pointCount(state, player, point) === 1) total += 1;
    }
    return total;
  }

  function longestPrime(state, player) {
    let best = 0;
    let current = 0;
    const ordered = player === HUMAN
      ? Array.from({ length: 24 }, (_, index) => 24 - index)
      : Array.from({ length: 24 }, (_, index) => index + 1);

    for (const point of ordered) {
      if (pointCount(state, player, point) >= 2) {
        current += 1;
        best = Math.max(best, current);
      } else {
        current = 0;
      }
    }
    return best;
  }

  function winner(state) {
    if (state.off[HUMAN] >= CHECKERS_PER_PLAYER) return HUMAN;
    if (state.off[AI] >= CHECKERS_PER_PLAYER) return AI;
    return null;
  }

  function winMultiplier(state, winningPlayer) {
    const losingPlayer = opponent(winningPlayer);
    if (state.off[losingPlayer] > 0) return 1;

    const loserOnBar = state.bar[losingPlayer] > 0;
    let loserInWinnerHome = false;
    for (let point = 1; point <= 24; point += 1) {
      if (isHomePoint(winningPlayer, point) && pointCount(state, losingPlayer, point) > 0) {
        loserInWinnerHome = true;
        break;
      }
    }

    return loserOnBar || loserInWinnerHome ? 3 : 2;
  }

  function evaluateForAI(state) {
    const won = winner(state);
    if (won === AI) return 100000 + winMultiplier(state, AI) * 1000;
    if (won === HUMAN) return -100000 - winMultiplier(state, HUMAN) * 1000;

    const pip = (pipCount(state, HUMAN) - pipCount(state, AI)) * 1.1;
    const borneOff = (state.off[AI] - state.off[HUMAN]) * 95;
    const barPressure = (state.bar[HUMAN] - state.bar[AI]) * 28;
    const structure = (madePoints(state, AI) - madePoints(state, HUMAN)) * 4;
    const homes = (homeStrength(state, AI) - homeStrength(state, HUMAN)) * 7;
    const blots = (blotCount(state, HUMAN) - blotCount(state, AI)) * 2.5;
    const primes = (longestPrime(state, AI) - longestPrime(state, HUMAN)) * 5;

    return pip + borneOff + barPressure + structure + homes + blots + primes;
  }

  function rollOutcomes() {
    const outcomes = [];
    for (let first = 1; first <= 6; first += 1) {
      for (let second = first; second <= 6; second += 1) {
        const weight = first === second ? 1 : 2;
        const dice = first === second ? [first, first, first, first] : [first, second];
        outcomes.push({ dice, weight });
      }
    }
    return outcomes;
  }

  const OUTCOMES = rollOutcomes();

  function bestHumanReplyScore(state, dice) {
    const replies = generateSequences(state, HUMAN, dice);
    if (replies.length === 0 || replies.every(sequence => sequence.length === 0)) return evaluateForAI(state);

    let worstForAI = Infinity;
    for (const reply of replies) {
      const score = evaluateForAI(applySequence(state, HUMAN, reply));
      if (score < worstForAI) worstForAI = score;
    }
    return worstForAI;
  }

  function expectedHumanReplyScore(state) {
    let total = 0;
    let totalWeight = 0;
    for (const outcome of OUTCOMES) {
      total += bestHumanReplyScore(state, outcome.dice) * outcome.weight;
      totalWeight += outcome.weight;
    }
    return total / totalWeight;
  }

  function chooseAISequence(state, dice, options = {}) {
    const strength = options.strength || 'strong';
    const sequences = generateSequences(state, AI, dice);
    if (sequences.length === 0) return [];
    if (sequences.length === 1) return sequences[0];

    const ranked = sequences.map(sequence => {
      const next = applySequence(state, AI, sequence);
      return { sequence, next, staticScore: evaluateForAI(next) };
    }).sort((a, b) => b.staticScore - a.staticScore);

    if (strength === 'fast') return ranked[0].sequence;

    // Genuine expectiminimax-style lookahead: keep the strongest static candidates,
    // then average the best human response over all 36 next-roll probabilities.
    const candidates = ranked.slice(0, Math.min(18, ranked.length));
    let best = candidates[0];
    let bestScore = -Infinity;

    for (const candidate of candidates) {
      const expectedReply = expectedHumanReplyScore(candidate.next);
      const score = candidate.staticScore * 0.35 + expectedReply * 0.65;
      if (score > bestScore) {
        bestScore = score;
        best = candidate;
      }
    }

    return best.sequence;
  }

  function stateKey(state) {
    return [
      state.points.join(','),
      state.bar.human,
      state.bar.ai,
      state.off.human,
      state.off.ai
    ].join('|');
  }

  function validateState(state) {
    if (!state || !Array.isArray(state.points) || state.points.length !== 24) return false;
    if (playerTotal(state, HUMAN) !== CHECKERS_PER_PLAYER) return false;
    if (playerTotal(state, AI) !== CHECKERS_PER_PLAYER) return false;
    return true;
  }

  globalThis.FolkholdBackgammonEngine = Object.freeze({
    HUMAN,
    AI,
    CHECKERS_PER_PLAYER,
    initialState,
    cloneState,
    pointCount,
    opponentCount,
    playerTotal,
    allInHome,
    singleMoves,
    applyMove,
    applySequence,
    generateSequences,
    legalFirstMoves,
    pipCount,
    winner,
    winMultiplier,
    evaluateForAI,
    chooseAISequence,
    stateKey,
    validateState
  });
})();
