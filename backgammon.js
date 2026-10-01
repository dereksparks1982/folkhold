(() => {
  'use strict';

  const Engine = globalThis.FolkholdBackgammonEngine;
  if (!Engine) {
    console.warn('Folkhold Backgammon engine did not load.');
    return;
  }

  const { HUMAN, AI } = Engine;
  const runtime = {
    state: Engine.initialState(),
    phase: 'idle',
    dice: [],
    selectedSource: null,
    status: '',
    started: false,
    aiTimer: null
  };

  function randomDie() {
    if (globalThis.crypto?.getRandomValues) {
      const data = new Uint32Array(1);
      globalThis.crypto.getRandomValues(data);
      return (data[0] % 6) + 1;
    }
    return Math.floor(Math.random() * 6) + 1;
  }

  function normalRoll() {
    const first = randomDie();
    const second = randomDie();
    return first === second ? [first, first, first, first] : [first, second];
  }

  function removeUsedDie(dice, used) {
    const next = [...dice];
    const index = next.indexOf(used);
    if (index >= 0) next.splice(index, 1);
    return next;
  }

  function sourceKey(source) {
    return source === 'bar' ? 'bar' : String(source);
  }

  function sourceLabel(source) {
    return source === 'bar' ? 'Bar' : `Point ${source}`;
  }

  function destinationLabel(destination) {
    return destination === 'off' ? 'Off' : `Point ${destination}`;
  }

  function checkerMarkup(owner, count) {
    if (!count) return '';
    const shown = Math.min(count, 5);
    const checkers = Array.from({ length: shown }, () => `<span class="bg-checker bg-checker-${owner}" aria-hidden="true"></span>`).join('');
    const extra = count > shown ? `<span class="bg-checker-count" aria-hidden="true">${count}</span>` : '';
    return `<span class="bg-checker-stack">${checkers}${extra}</span>`;
  }

  function pointMarkup(point, orientation, alternate) {
    const value = runtime.state.points[point - 1];
    const owner = value > 0 ? HUMAN : value < 0 ? AI : null;
    const count = Math.abs(value);
    const firstMoves = runtime.phase === 'human-moving'
      ? Engine.legalFirstMoves(runtime.state, HUMAN, runtime.dice)
      : [];
    const sourceAvailable = firstMoves.some(move => sourceKey(move.from) === String(point));
    const targetAvailable = runtime.selectedSource !== null && firstMoves.some(
      move => sourceKey(move.from) === sourceKey(runtime.selectedSource) && move.to === point
    );
    const selected = sourceKey(runtime.selectedSource) === String(point);
    const classes = [
      'bg-point',
      `bg-point-${orientation}`,
      alternate ? 'bg-point-alt' : '',
      sourceAvailable ? 'bg-source-available' : '',
      targetAvailable ? 'bg-target-available' : '',
      selected ? 'bg-selected-source' : ''
    ].filter(Boolean).join(' ');
    const label = owner ? `${owner === HUMAN ? 'Your' : 'AI'} point ${point}, ${count} checker${count === 1 ? '' : 's'}` : `Point ${point}, empty`;

    return `
      <button class="${classes}" type="button" data-bg-point="${point}" aria-label="${label}">
        <span class="bg-point-number">${point}</span>
        ${checkerMarkup(owner, count)}
      </button>`;
  }

  function rowMarkup(points, orientation) {
    const left = points.slice(0, 6).map((point, index) => pointMarkup(point, orientation, index % 2 === 1)).join('');
    const right = points.slice(6).map((point, index) => pointMarkup(point, orientation, index % 2 === 0)).join('');
    return `<div class="bg-row bg-row-${orientation}">${left}<div class="bg-board-bar" aria-hidden="true"></div>${right}</div>`;
  }

  function diceMarkup() {
    if (!runtime.dice.length) return '<span class="bg-dice-empty">No dice in play</span>';
    return runtime.dice.map(die => `<span class="bg-die" aria-label="Die ${die}">${die}</span>`).join('');
  }

  function legalMoveSummary() {
    if (runtime.phase !== 'human-moving') return '';
    const moves = Engine.legalFirstMoves(runtime.state, HUMAN, runtime.dice);
    if (!moves.length) return '<span>No legal move.</span>';
    return moves.map(move => `<span>${sourceLabel(move.from)} → ${destinationLabel(move.to)} <b>${move.die}</b></span>`).join('');
  }

  function render() {
    const dialog = document.getElementById('folkhold-backgammon-dialog');
    if (!dialog) return;

    const board = dialog.querySelector('[data-bg-board]');
    const status = dialog.querySelector('[data-bg-status]');
    const dice = dialog.querySelector('[data-bg-dice]');
    const summary = dialog.querySelector('[data-bg-legal]');
    const rollButton = dialog.querySelector('[data-bg-action="roll"]');
    const humanBar = dialog.querySelector('[data-bg-human-bar]');
    const aiBar = dialog.querySelector('[data-bg-ai-bar]');
    const humanOff = dialog.querySelector('[data-bg-human-off]');
    const aiOff = dialog.querySelector('[data-bg-ai-off]');
    const pip = dialog.querySelector('[data-bg-pips]');

    if (board) {
      board.innerHTML = [
        rowMarkup([13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], 'top'),
        '<div class="bg-board-midline" aria-hidden="true"></div>',
        rowMarkup([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 'bottom')
      ].join('');
    }

    const firstMoves = runtime.phase === 'human-moving'
      ? Engine.legalFirstMoves(runtime.state, HUMAN, runtime.dice)
      : [];
    const barSource = firstMoves.some(move => move.from === 'bar');
    const offTarget = runtime.selectedSource !== null && firstMoves.some(
      move => sourceKey(move.from) === sourceKey(runtime.selectedSource) && move.to === 'off'
    );

    if (humanBar) {
      humanBar.textContent = `Your bar: ${runtime.state.bar.human}`;
      humanBar.classList.toggle('bg-source-available', barSource);
      humanBar.classList.toggle('bg-selected-source', runtime.selectedSource === 'bar');
      humanBar.disabled = runtime.state.bar.human === 0 || runtime.phase !== 'human-moving';
    }
    if (aiBar) aiBar.textContent = `AI bar: ${runtime.state.bar.ai}`;
    if (humanOff) {
      humanOff.textContent = `You off: ${runtime.state.off.human}/15`;
      humanOff.classList.toggle('bg-target-available', offTarget);
    }
    if (aiOff) aiOff.textContent = `AI off: ${runtime.state.off.ai}/15`;
    if (status) status.textContent = runtime.status;
    if (dice) dice.innerHTML = diceMarkup();
    if (summary) summary.innerHTML = legalMoveSummary();
    if (rollButton) rollButton.disabled = runtime.phase !== 'human-await-roll';
    if (pip) pip.textContent = `Pip count · You ${Engine.pipCount(runtime.state, HUMAN)} · AI ${Engine.pipCount(runtime.state, AI)}`;
  }

  function finishGame(winningPlayer) {
    runtime.phase = 'gameover';
    runtime.dice = [];
    runtime.selectedSource = null;
    const multiplier = Engine.winMultiplier(runtime.state, winningPlayer);
    const result = multiplier === 3 ? 'backgammon' : multiplier === 2 ? 'gammon' : 'game';
    runtime.status = winningPlayer === HUMAN
      ? `You win the ${result}.`
      : `Folkhold AI wins the ${result}.`;
    render();
  }

  function checkWinner() {
    const winningPlayer = Engine.winner(runtime.state);
    if (!winningPlayer) return false;
    finishGame(winningPlayer);
    return true;
  }

  function beginHumanRoll() {
    runtime.phase = 'human-await-roll';
    runtime.dice = [];
    runtime.selectedSource = null;
    runtime.status = 'Your turn. Roll the dice.';
    render();
  }

  function playAISequence(sequence, index = 0) {
    if (runtime.phase !== 'ai') return;
    if (index >= sequence.length) {
      if (!checkWinner()) beginHumanRoll();
      return;
    }

    const move = sequence[index];
    runtime.state = Engine.applyMove(runtime.state, AI, move);
    runtime.dice = removeUsedDie(runtime.dice, move.die);
    runtime.status = `Folkhold AI: ${sourceLabel(move.from)} → ${destinationLabel(move.to)}.`;
    render();

    if (checkWinner()) return;
    runtime.aiTimer = window.setTimeout(() => playAISequence(sequence, index + 1), 260);
  }

  function runAITurn(openingDice = null) {
    window.clearTimeout(runtime.aiTimer);
    runtime.phase = 'ai';
    runtime.selectedSource = null;
    runtime.dice = openingDice ? [...openingDice] : normalRoll();
    runtime.status = 'Folkhold AI is thinking…';
    render();

    runtime.aiTimer = window.setTimeout(() => {
      if (runtime.phase !== 'ai') return;
      const sequence = Engine.chooseAISequence(runtime.state, runtime.dice, { strength: 'strong' });
      if (!sequence.length) {
        runtime.status = 'Folkhold AI has no legal move.';
        render();
        runtime.aiTimer = window.setTimeout(beginHumanRoll, 650);
        return;
      }
      playAISequence(sequence);
    }, 90);
  }

  function beginOpeningRoll() {
    let humanDie = randomDie();
    let aiDie = randomDie();
    while (humanDie === aiDie) {
      humanDie = randomDie();
      aiDie = randomDie();
    }

    runtime.dice = [humanDie, aiDie];
    runtime.selectedSource = null;

    if (humanDie > aiDie) {
      runtime.phase = 'human-moving';
      runtime.status = `Opening roll: you ${humanDie}, AI ${aiDie}. You move first using both dice.`;
      render();
      return;
    }

    runtime.phase = 'ai';
    runtime.status = `Opening roll: you ${humanDie}, AI ${aiDie}. Folkhold AI moves first.`;
    render();
    runtime.aiTimer = window.setTimeout(() => runAITurn([humanDie, aiDie]), 450);
  }

  function newGame() {
    window.clearTimeout(runtime.aiTimer);
    runtime.state = Engine.initialState();
    runtime.phase = 'opening';
    runtime.dice = [];
    runtime.selectedSource = null;
    runtime.status = 'Opening roll…';
    runtime.started = true;
    render();
    window.setTimeout(beginOpeningRoll, 250);
  }

  function rollForHuman() {
    if (runtime.phase !== 'human-await-roll') return;
    runtime.dice = normalRoll();
    runtime.phase = 'human-moving';
    runtime.selectedSource = null;
    runtime.status = runtime.dice.length === 4
      ? `You rolled double ${runtime.dice[0]}s.`
      : `You rolled ${runtime.dice[0]} and ${runtime.dice[1]}.`;
    render();

    const sequences = Engine.generateSequences(runtime.state, HUMAN, runtime.dice);
    if (!sequences.some(sequence => sequence.length > 0)) {
      runtime.status += ' No legal move. Turn passes.';
      render();
      runtime.aiTimer = window.setTimeout(() => runAITurn(), 650);
    }
  }

  function performHumanMove(move) {
    runtime.state = Engine.applyMove(runtime.state, HUMAN, move);
    runtime.dice = removeUsedDie(runtime.dice, move.die);
    runtime.selectedSource = null;
    runtime.status = `You moved ${sourceLabel(move.from)} → ${destinationLabel(move.to)} using ${move.die}.`;
    render();

    if (checkWinner()) return;

    const remaining = Engine.generateSequences(runtime.state, HUMAN, runtime.dice);
    if (!runtime.dice.length || !remaining.some(sequence => sequence.length > 0)) {
      runtime.aiTimer = window.setTimeout(() => runAITurn(), 430);
    }
  }

  function handleHumanBoardChoice(choice) {
    if (runtime.phase !== 'human-moving') return;
    const firstMoves = Engine.legalFirstMoves(runtime.state, HUMAN, runtime.dice);
    if (!firstMoves.length) return;

    if (runtime.selectedSource !== null) {
      const destination = choice.kind === 'off' ? 'off' : choice.kind === 'point' ? choice.point : null;
      if (destination !== null) {
        const matching = firstMoves.find(
          move => sourceKey(move.from) === sourceKey(runtime.selectedSource) && move.to === destination
        );
        if (matching) {
          performHumanMove(matching);
          return;
        }
      }
    }

    const proposedSource = choice.kind === 'bar' ? 'bar' : choice.kind === 'point' ? choice.point : null;
    if (proposedSource !== null && firstMoves.some(move => sourceKey(move.from) === sourceKey(proposedSource))) {
      runtime.selectedSource = proposedSource;
      runtime.status = `${sourceLabel(proposedSource)} selected. Choose a highlighted destination.`;
      render();
    }
  }

  function ensureStyles() {
    if (document.getElementById('folkhold-backgammon-style')) return;
    const style = document.createElement('style');
    style.id = 'folkhold-backgammon-style';
    style.textContent = `
      .bg-launch{margin-top:12px}
      .bg-dialog{width:min(1040px,calc(100vw - 20px));max-width:1040px;border:0;padding:0;background:transparent}
      .bg-dialog::backdrop{background:rgba(8,7,6,.84);backdrop-filter:blur(3px)}
      .bg-shell{background:#f6ead8;color:#282019;border:2px solid var(--brass);border-radius:18px;box-shadow:0 30px 100px #000;padding:18px}
      .bg-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:12px}
      .bg-header h2{margin:0;font-size:32px;color:#251f1a}.bg-header p{margin:5px 0 0;color:#685b4e}
      .bg-header-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.bg-header-actions button{padding:8px 12px;border-radius:9px}
      .bg-statusbar{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;background:#2a211a;color:#f2e5d2;border-radius:12px;padding:11px 13px;margin-bottom:10px}
      .bg-status{font-weight:bold}.bg-dice{display:flex;gap:6px;align-items:center;justify-content:flex-end}.bg-die{display:grid;place-items:center;width:34px;height:34px;background:#f8f0e3;color:#221b16;border:2px solid #a57c46;border-radius:7px;font:bold 17px Georgia,serif;box-shadow:inset 0 0 0 1px #fff8}.bg-dice-empty{font-size:12px;color:#c9b8a3}
      .bg-meta{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px;margin-bottom:10px}.bg-meta button,.bg-meta span{min-width:0;padding:8px 9px;border-radius:8px;border:1px solid #c6a97d;background:#ead9bf;color:#3a2c20;text-align:center;font-size:12px}.bg-meta button{cursor:pointer}.bg-meta button:disabled{cursor:default;opacity:.75}.bg-meta .bg-source-available,.bg-meta .bg-target-available{outline:3px solid #b08d57;outline-offset:1px}.bg-meta .bg-selected-source{background:#d7bc8f}
      .bg-board{border:9px solid #3a2416;border-radius:10px;background:#5b3822;box-shadow:inset 0 0 28px #0007;overflow:hidden}
      .bg-row{display:grid;grid-template-columns:repeat(6,minmax(44px,1fr)) 18px repeat(6,minmax(44px,1fr));min-height:190px}.bg-board-bar{background:#2a1b12;border-left:1px solid #987147;border-right:1px solid #987147}.bg-board-midline{height:4px;background:#24160f;border-top:1px solid #8a6742;border-bottom:1px solid #8a6742}
      .bg-point{position:relative;border:0;background:transparent;min-width:0;padding:6px 3px;display:flex;align-items:center;color:#281c13;overflow:hidden}.bg-point-top{justify-content:flex-start;flex-direction:column}.bg-point-bottom{justify-content:flex-end;flex-direction:column-reverse}.bg-point::before{content:"";position:absolute;z-index:0;left:3px;right:3px;opacity:.92}.bg-point-top::before{top:0;height:88%;clip-path:polygon(0 0,100% 0,50% 100%);background:#d7b977}.bg-point-bottom::before{bottom:0;height:88%;clip-path:polygon(50% 0,100% 100%,0 100%);background:#d7b977}.bg-point-alt::before{background:#7c342e}.bg-point-number{position:absolute;z-index:3;font:10px Arial,sans-serif;font-weight:bold;background:#f2e2c5cc;padding:2px 4px;border-radius:4px}.bg-point-top .bg-point-number{top:3px}.bg-point-bottom .bg-point-number{bottom:3px}
      .bg-checker-stack{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;margin-top:19px}.bg-point-bottom .bg-checker-stack{margin-top:0;margin-bottom:19px;flex-direction:column-reverse}.bg-checker{display:block;width:31px;height:31px;border-radius:50%;margin:-3px 0;border:2px solid #2a1b12;box-shadow:0 2px 3px #0006}.bg-checker-human{background:#f4e8d2}.bg-checker-ai{background:#294c3d;border-color:#c5a66a}.bg-checker-count{margin-top:4px;min-width:24px;padding:2px 5px;border-radius:999px;background:#1f1712;color:#fff;font:bold 11px Arial,sans-serif;text-align:center}
      .bg-source-available{box-shadow:inset 0 0 0 3px rgba(239,210,132,.9)}.bg-target-available{box-shadow:inset 0 0 0 4px #e8c864}.bg-selected-source{box-shadow:inset 0 0 0 4px #fff0a9}.bg-point:focus-visible{outline:3px solid #fff1a8;outline-offset:-4px}
      .bg-legal{min-height:35px;display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:10px}.bg-legal span{font-size:11px;background:#ead9bf;border:1px solid #c8aa7a;border-radius:7px;padding:5px 7px}.bg-pips{margin:9px 0 0;text-align:center;color:#6b5b4d;font-size:12px}
      @media(max-width:760px){.bg-shell{padding:10px}.bg-header{align-items:stretch;flex-direction:column}.bg-header-actions{justify-content:flex-start}.bg-statusbar{grid-template-columns:1fr}.bg-dice{justify-content:flex-start}.bg-meta{grid-template-columns:1fr 1fr}.bg-meta [data-bg-pips]{grid-column:1/-1}.bg-row{grid-template-columns:repeat(6,minmax(25px,1fr)) 10px repeat(6,minmax(25px,1fr));min-height:132px}.bg-checker{width:23px;height:23px}.bg-point-number{font-size:8px}.bg-legal{max-height:74px;overflow:auto}.bg-dialog{width:calc(100vw - 8px)}}
    `;
    document.head.append(style);
  }

  function ensureDialog() {
    let dialog = document.getElementById('folkhold-backgammon-dialog');
    if (dialog) return dialog;

    ensureStyles();
    dialog = document.createElement('dialog');
    dialog.id = 'folkhold-backgammon-dialog';
    dialog.className = 'bg-dialog';
    dialog.innerHTML = `
      <section class="bg-shell" aria-labelledby="bg-title">
        <header class="bg-header">
          <div><span class="eyebrow">GAME ROOM</span><h2 id="bg-title">Backgammon</h2><p>You vs Folkhold AI. The AI evaluates positions and looks ahead at your possible replies.</p></div>
          <div class="bg-header-actions">
            <button class="secondary" type="button" data-bg-action="new">New Game</button>
            <button class="secondary" type="button" data-bg-action="roll">Roll Dice</button>
            <button class="secondary" type="button" data-bg-action="close">Close</button>
          </div>
        </header>
        <div class="bg-statusbar"><div class="bg-status" data-bg-status></div><div class="bg-dice" data-bg-dice></div></div>
        <div class="bg-meta">
          <button type="button" data-bg-human-bar>Human bar</button>
          <span data-bg-ai-bar>AI bar</span>
          <button type="button" data-bg-human-off>You off</button>
          <span data-bg-ai-off>AI off</span>
          <span data-bg-pips>Pip count</span>
        </div>
        <div class="bg-board" data-bg-board aria-label="Backgammon board"></div>
        <div class="bg-legal" data-bg-legal aria-live="polite"></div>
        <p class="bg-pips">Select one of your highlighted points, then a highlighted destination. Checkers on the bar must re-enter first.</p>
      </section>`;
    document.body.append(dialog);

    dialog.addEventListener('click', event => {
      const action = event.target.closest('[data-bg-action]')?.dataset.bgAction;
      if (action === 'new') newGame();
      if (action === 'roll') rollForHuman();
      if (action === 'close') dialog.close();

      const point = event.target.closest('[data-bg-point]');
      if (point) handleHumanBoardChoice({ kind: 'point', point: Number(point.dataset.bgPoint) });
      if (event.target.closest('[data-bg-human-bar]')) handleHumanBoardChoice({ kind: 'bar' });
      if (event.target.closest('[data-bg-human-off]')) handleHumanBoardChoice({ kind: 'off' });
    });

    return dialog;
  }

  function installLauncher() {
    const gamingRoom = [...document.querySelectorAll('.room')].find(room => room.querySelector('h2')?.textContent.trim() === 'Gaming Room');
    if (!gamingRoom || gamingRoom.querySelector('[data-bg-launch]')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary bg-launch';
    button.dataset.bgLaunch = 'true';
    button.textContent = 'Play Backgammon';
    button.addEventListener('click', () => {
      const dialog = ensureDialog();
      dialog.showModal();
      if (!runtime.started) newGame();
      else render();
    });
    gamingRoom.append(button);
  }

  ensureStyles();
  ensureDialog();
  installLauncher();
  globalThis.FolkholdBackgammon = Object.freeze({
    newGame,
    open() {
      const dialog = ensureDialog();
      dialog.showModal();
      if (!runtime.started) newGame();
      else render();
    }
  });
})();
