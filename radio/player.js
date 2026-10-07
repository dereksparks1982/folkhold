(() => {
  'use strict';

  const PLAYLIST = Array.isArray(globalThis.FOLKHOLD_RADIO_PLAYLIST)
    ? globalThis.FOLKHOLD_RADIO_PLAYLIST
    : [];

  const VOLUME_KEY = 'folkhold.radio.volume';
  const DEFAULT_VOLUME = 0.32;
  let index = 0;
  let autoplayBlocked = false;
  let unlockArmed = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function savedVolume() {
    const raw = Number(localStorage.getItem(VOLUME_KEY));
    return Number.isFinite(raw) ? clamp(raw, 0, 1) : DEFAULT_VOLUME;
  }

  function formatTime(seconds) {
    const value = Number(seconds);
    if (!Number.isFinite(value) || value < 0) return '0:00';
    const minutes = Math.floor(value / 60);
    const secs = Math.floor(value % 60);
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  }

  function ensureStyles() {
    if (document.getElementById('folkhold-radio-style')) return;
    const style = document.createElement('style');
    style.id = 'folkhold-radio-style';
    style.textContent = `
      :root{--fh-radio-height:58px}
      body{padding-bottom:var(--fh-radio-height)}
      .folkhold-radio{position:fixed;z-index:70;left:0;right:0;bottom:0;height:var(--fh-radio-height);display:grid;grid-template-columns:auto minmax(150px,1fr) minmax(120px,320px) auto;align-items:center;gap:12px;padding:7px 16px;background:rgba(20,18,16,.98);color:#f2e7d5;border-top:1px solid #80623f;box-shadow:0 -8px 24px #0005;font-family:Georgia,'Times New Roman',serif}
      .fh-radio-controls{display:flex;align-items:center;gap:6px}.fh-radio-controls button{width:38px;height:38px;border:1px solid #826c4d;border-radius:50%;background:#2a241f;color:#f2e7d5;padding:0;display:grid;place-items:center}.fh-radio-controls button:hover{background:#3a3028}.fh-radio-controls .fh-radio-play{width:42px;height:42px;background:#355e4a;border-color:#6f8d78}
      .fh-radio-now{min-width:0;display:grid;gap:2px}.fh-radio-label{font:700 9px Arial,sans-serif;letter-spacing:.14em;color:#d5b77e}.fh-radio-title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:bold}.fh-radio-artist{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#baa98d;font:11px Arial,sans-serif}
      .fh-radio-progress{display:grid;grid-template-columns:34px minmax(80px,1fr) 34px;align-items:center;gap:7px;font:10px Arial,sans-serif;color:#bcae99}.fh-radio-progress input{width:100%;accent-color:#b08d57}
      .fh-radio-volume{display:flex;align-items:center;gap:7px;font:11px Arial,sans-serif;color:#baa98d}.fh-radio-volume input{width:92px;accent-color:#b08d57}
      .fh-radio-status{position:absolute;right:12px;top:-23px;max-width:min(420px,85vw);padding:4px 8px;border-radius:7px 7px 0 0;background:#2b241d;color:#e8d7bd;font:10px Arial,sans-serif;border:1px solid #80623f;border-bottom:0}
      .fh-radio-status[hidden]{display:none}
      .ad-strip{bottom:var(--fh-radio-height)!important}.mobile-nav{bottom:calc(45px + var(--fh-radio-height))!important}.toast{bottom:calc(70px + var(--fh-radio-height))!important}
      @media(max-width:760px){:root{--fh-radio-height:64px}main{padding-bottom:calc(180px + var(--fh-radio-height))!important}.folkhold-radio{grid-template-columns:auto minmax(0,1fr) auto;gap:8px;padding:7px 9px}.fh-radio-progress{display:none}.fh-radio-volume input{width:62px}.fh-radio-label{display:none}.fh-radio-artist{font-size:10px}.fh-radio-title{font-size:13px}.fh-radio-controls button{width:34px;height:34px}.fh-radio-controls .fh-radio-play{width:38px;height:38px}}
      @media(max-width:440px){.fh-radio-volume span{display:none}.fh-radio-volume input{width:54px}.fh-radio-controls{gap:3px}.fh-radio-now{max-width:38vw}}
    `;
    document.head.append(style);
  }

  function buildBar() {
    const bar = document.createElement('footer');
    bar.className = 'folkhold-radio';
    bar.setAttribute('aria-label', 'Folkhold Radio');
    bar.innerHTML = `
      <div class="fh-radio-controls">
        <button type="button" data-radio-prev aria-label="Previous song">◀◀</button>
        <button type="button" class="fh-radio-play" data-radio-play aria-label="Play">▶</button>
        <button type="button" data-radio-next aria-label="Next song">▶▶</button>
      </div>
      <div class="fh-radio-now">
        <span class="fh-radio-label">FOLKHOLD RADIO</span>
        <span class="fh-radio-title" data-radio-title></span>
        <span class="fh-radio-artist" data-radio-artist></span>
      </div>
      <div class="fh-radio-progress">
        <span data-radio-current>0:00</span>
        <input data-radio-seek type="range" min="0" max="1000" value="0" aria-label="Song position">
        <span data-radio-duration>0:00</span>
      </div>
      <label class="fh-radio-volume"><span>VOL</span><input data-radio-volume type="range" min="0" max="100" value="32" aria-label="Radio volume"></label>
      <div class="fh-radio-status" data-radio-status hidden></div>
    `;
    document.body.append(bar);
    return bar;
  }

  function start() {
    if (document.querySelector('.folkhold-radio')) return;

    ensureStyles();
    const bar = buildBar();
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = savedVolume();

    const playButton = bar.querySelector('[data-radio-play]');
    const title = bar.querySelector('[data-radio-title]');
    const artist = bar.querySelector('[data-radio-artist]');
    const seek = bar.querySelector('[data-radio-seek]');
    const current = bar.querySelector('[data-radio-current]');
    const duration = bar.querySelector('[data-radio-duration]');
    const volume = bar.querySelector('[data-radio-volume]');
    const status = bar.querySelector('[data-radio-status]');

    volume.value = String(Math.round(audio.volume * 100));

    function showStatus(message, timeout = 0) {
      status.textContent = message;
      status.hidden = !message;
      clearTimeout(showStatus.timer);
      if (message && timeout) {
        showStatus.timer = setTimeout(() => {
          status.hidden = true;
        }, timeout);
      }
    }

    function updatePlayButton() {
      const playing = !audio.paused && !audio.ended;
      playButton.textContent = playing ? 'Ⅱ' : '▶';
      playButton.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    }

    function loadTrack(nextIndex, shouldPlay = true) {
      if (!PLAYLIST.length) return;
      index = (nextIndex + PLAYLIST.length) % PLAYLIST.length;
      const track = PLAYLIST[index];
      audio.src = track.src;
      audio.load();
      title.textContent = track.title;
      artist.textContent = `${track.artist} · ${track.role}`;
      seek.value = '0';
      current.textContent = '0:00';
      duration.textContent = '0:00';
      if (shouldPlay) requestPlay();
      else updatePlayButton();
    }

    function armUnlock() {
      if (unlockArmed) return;
      unlockArmed = true;
      const unlock = () => {
        if (!autoplayBlocked || !audio.paused) return;
        const promise = audio.play();
        if (promise && typeof promise.then === 'function') {
          promise.then(() => {
            autoplayBlocked = false;
            showStatus('', 0);
            updatePlayButton();
          }).catch(() => {});
        }
      };
      ['pointerdown', 'touchstart', 'keydown'].forEach(type => {
        document.addEventListener(type, unlock, { capture: true, passive: true });
      });
    }

    function requestPlay() {
      const promise = audio.play();
      if (!promise || typeof promise.catch !== 'function') {
        updatePlayButton();
        return;
      }
      promise.then(() => {
        autoplayBlocked = false;
        showStatus('', 0);
        updatePlayButton();
      }).catch(() => {
        autoplayBlocked = true;
        showStatus('Your browser blocked automatic sound. Your first tap will start Folkhold Radio.');
        armUnlock();
        updatePlayButton();
      });
    }

    playButton.addEventListener('click', () => {
      autoplayBlocked = false;
      if (audio.paused) requestPlay();
      else audio.pause();
    });

    bar.querySelector('[data-radio-prev]').addEventListener('click', () => {
      if (audio.currentTime > 5) {
        audio.currentTime = 0;
        requestPlay();
      } else {
        loadTrack(index - 1, true);
      });

    bar.querySelector('[data-radio-next]').addEventListener('click', () => loadTrack(index + 1, true));

    volume.addEventListener('input', () => {
      audio.volume = clamp(Number(volume.value) / 100, 0, 1);
      localStorage.setItem(VOLUME_KEY, String(audio.volume));
    });

    seek.addEventListener('input', () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
    });

    audio.addEventListener('play', updatePlayButton);
    audio.addEventListener('pause', updatePlayButton);
    audio.addEventListener('loadedmetadata', () => {
      duration.textContent = formatTime(audio.duration);
    });
    audio.addEventListener('timeupdate', () => {
      current.textContent = formatTime(audio.currentTime);
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        seek.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
      }
    });
    audio.addEventListener('ended', () => loadTrack(index + 1, true));
    audio.addEventListener('error', () => {
      showStatus(`Could not load ${PLAYLIST[index]?.title || 'this track'}.`, 7000);
      updatePlayButton();
    });

    loadTrack(0, true);

    globalThis.FolkholdRadio = Object.freeze({
      play: requestPlay,
      pause: () => audio.pause(),
      next: () => loadTrack(index + 1, true),
      previous: () => loadTrack(index - 1, true),
      playlist: () => PLAYLIST.map(track => ({ ...track })),
      currentTrack: () => ({ ...PLAYLIST[index] }),
      audio
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();