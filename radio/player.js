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
  let station = 'All Music';
  let fallbackAttempted = false;
  let userPaused = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function savedVolume() {
    const raw = localStorage.getItem(VOLUME_KEY);
    if (raw === null) return DEFAULT_VOLUME;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? clamp(parsed, 0, 1) : DEFAULT_VOLUME;
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
    style.textContent += `
      .fh-radio-page{padding:24px 28px;margin:20px 0 30px;background:rgba(255,248,238,.96)}
      .fh-radio-page .folkhold-radio{position:static!important;z-index:auto!important;left:auto!important;right:auto!important;bottom:auto!important;width:100%!important;height:auto!important;display:grid!important;grid-template-columns:1fr!important;gap:19px!important;padding:0!important;background:transparent!important;color:#2c2926!important;border:0!important;box-shadow:none!important}
      .fh-radio-page .fh-radio-controls{justify-content:center;gap:14px}
      .fh-radio-page .fh-radio-now{padding:23px 12px;border-radius:12px;background:#29221c;color:#f2e7d5;text-align:center}
      .fh-radio-page .fh-radio-title{font-size:clamp(24px,4vw,36px);white-space:normal;overflow-wrap:anywhere}
      .fh-radio-page .fh-radio-progress{display:grid!important;grid-template-columns:42px minmax(0,1fr) 42px;gap:9px;color:#645443}
      .fh-radio-page .fh-radio-volume{justify-content:center;color:#645443}
      .fh-radio-page .fh-radio-volume input{width:min(300px,65vw)}
      .fh-radio-page .fh-radio-label{display:block!important}
      .fh-radio-page .fh-radio-artist{font-size:13px}
      .fh-radio-page .fh-radio-status{position:static!important;max-width:none;border-radius:8px;border:1px solid #80623f;padding:11px;line-height:1.5}
      .fh-radio-list-heading{font:700 12px Arial,sans-serif;letter-spacing:.13em;color:#645138;text-transform:uppercase;margin:6px 0 10px}
      .fh-radio-playlist{list-style:none;margin:0;padding:0;display:grid;gap:8px}
      .fh-radio-playlist button{width:100%;display:flex;align-items:center;gap:12px;text-align:left;padding:13px 15px;background:#f7ebd9;color:#3a2c20;border:1px solid #c6ae87;border-radius:10px}
      .fh-radio-playlist button:hover{background:#f0ddc0}
      .fh-radio-playlist button[aria-current="true"]{border-color:#355e4a;background:#e0e9de}
      .fh-radio-track-number{font:700 12px Arial,sans-serif;min-width:22px;color:#705a3b}
      .fh-radio-track-info{display:grid;gap:3px;min-width:0}
      .fh-radio-track-info small{font:12px Arial,sans-serif;color:#6d6256}
      body{padding-bottom:0!important}
      .ad-strip{bottom:0!important}
      .mobile-nav{bottom:45px!important}
      .toast{bottom:70px!important}
      @media(max-width:760px){main{padding-bottom:140px!important}.fh-radio-page{padding:18px 14px}.fh-radio-page .fh-radio-progress{display:grid!important}.fh-radio-page .fh-radio-volume input{width:min(260px,60vw)}}
    `;
    style.textContent += `
      .fh-radio-stations{display:flex;justify-content:center;gap:9px;flex-wrap:wrap}
      .fh-radio-stations button{border:1px solid #aa906b;border-radius:99px;padding:9px 14px;background:#efe0c8;color:#473523;font:600 13px Arial,sans-serif}
      .fh-radio-stations button[aria-pressed="true"]{background:#355e4a;border-color:#355e4a;color:white}
      .fh-radio-credits{font:12px Arial,sans-serif;line-height:1.55;color:#6c5a46}
      .fh-radio-credits a{color:#355e4a}
    `;
    document.head.append(style);
  }

  function buildBar() {
    const bar = document.createElement('div');
    bar.className = 'folkhold-radio';
    bar.setAttribute('aria-label', 'Folkhold Radio');
    bar.innerHTML = `
      <div class="fh-radio-stations" data-radio-stations aria-label="Music stations"></div>
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
      <div class="fh-radio-tracks"><h2 class="fh-radio-list-heading">Songs</h2><ol class="fh-radio-playlist" data-radio-playlist></ol></div>
      <p class="fh-radio-credits">Music by Kevin MacLeod (incompetech.com), licensed <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>. These are regionally inspired instrumentals, not religious recitations.</p>
    `;
    document.getElementById('folkhold-radio-mount').append(bar);
    return bar;
  }

  function start() {
    if (document.querySelector('.folkhold-radio') || !document.getElementById('folkhold-radio-mount')) return;

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
    const playlistPanel = bar.querySelector('[data-radio-playlist]');
    const stationsPanel = bar.querySelector('[data-radio-stations]');
    const songQueue = () => PLAYLIST.map((track,i) => i).filter(i => station === 'All Music' || PLAYLIST[i].station === station);

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
      fallbackAttempted = false;
      audio.src = track.src;
      audio.load();
      title.textContent = track.title;
      artist.textContent = `${track.artist} · ${track.role}`;
      seek.value = '0';
      current.textContent = '0:00';
      duration.textContent = '0:00';
      playlistPanel.querySelectorAll('[data-radio-track]').forEach(button => button.setAttribute('aria-current', String(Number(button.dataset.radioTrack) === index)));
      if (shouldPlay) requestPlay();
      else updatePlayButton();
    }

    function armUnlock() {
      if (unlockArmed) return;
      unlockArmed = true;
      const unlock = (event) => {
        if (event.target?.closest?.('[data-radio-play],[data-radio-prev],[data-radio-next],[data-radio-track]')) return;
        if (!autoplayBlocked || !audio.paused || userPaused) return;
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
      userPaused = false;
      const promise = audio.play();
      if (!promise || typeof promise.catch !== 'function') {
        updatePlayButton();
        return;
      }
      promise.then(() => {
        autoplayBlocked = false;
        showStatus('', 0);
        updatePlayButton();
      }).catch(error => {
        if (error?.name === 'NotAllowedError') {
          autoplayBlocked = true;
          showStatus('Your browser blocked automatic sound. Your first tap will start Folkhold Radio.');
          armUnlock();
        } else if (error?.name !== 'AbortError') {
          showStatus('This track could not be played. Choose another song.');
        }
        updatePlayButton();
      });
    }

    playButton.addEventListener('click', () => {
      autoplayBlocked = false;
      if (audio.paused) requestPlay();
      else { autoplayBlocked = false; userPaused = true; audio.pause(); }
    });

    bar.querySelector('[data-radio-prev]').addEventListener('click', () => {
      if (audio.currentTime > 5) {
        audio.currentTime = 0;
        requestPlay();
      } else {
        move(-1);
      }
    });

    function move(step) {
      const queue = songQueue();
      if (!queue.length) return;
      const pos = queue.indexOf(index);
      loadTrack(queue[((pos < 0 ? 0 : pos) + step + queue.length) % queue.length],true);
    }
    bar.querySelector('[data-radio-next]').addEventListener('click', () => move(1));

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
    audio.addEventListener('ended', () => move(1));
    audio.addEventListener('error', () => {
      const track = PLAYLIST[index];
      if (!fallbackAttempted && track?.fallbackSrc) {
        fallbackAttempted = true;
        audio.src = track.fallbackSrc;
        audio.load();
        showStatus('Using official composer audio for ' + track.title + '.');
        if (!userPaused) requestPlay();
      } else {
        showStatus('Could not load ' + (track?.title || 'this track') + '. Try another song.');
        updatePlayButton();
      }
    });


    function renderPlaylist() {
      playlistPanel.replaceChildren();
      stationsPanel.querySelectorAll('button').forEach(btn => {
        btn.setAttribute('aria-pressed', String(btn.dataset.radioStation === station));
      });
      songQueue().forEach((pos, order) => {
        const track = PLAYLIST[pos];
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.radioTrack = String(pos);
        button.setAttribute('aria-current', String(pos === index));
        button.setAttribute('aria-label', 'Play ' + track.title + ' by ' + track.artist);
        const number = document.createElement('span');
        number.className = 'fh-radio-track-number';
        number.textContent = String(order + 1).padStart(2, '0');
        const info = document.createElement('span');
        info.className = 'fh-radio-track-info';
        const trackTitle = document.createElement('strong');
        trackTitle.textContent = track.title;
        const artist = document.createElement('small');
        artist.textContent = track.artist + ' · ' + track.role;
        info.append(trackTitle, artist);
        button.append(number, info);
        button.addEventListener('click', () => loadTrack(pos, true));
        li.append(button);
        playlistPanel.append(li);
      });
    }
    ['All Music', 'Eastern Roads', 'Medieval Hall'].forEach(label => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.radioStation = label;
      btn.textContent = label;
      btn.setAttribute('aria-pressed', String(label === station));
      btn.addEventListener('click', () => {
        if (station === label) return;
        station = label;
        renderPlaylist();
        loadTrack(songQueue()[0] || 0, true);
      });
      stationsPanel.append(btn);
    });
    renderPlaylist();

    loadTrack(0, true);

    globalThis.FolkholdRadio = Object.freeze({
      play: requestPlay,
      pause: () => { userPaused = true; autoplayBlocked = false; audio.pause(); },
      next: () => move(1),
      previous: () => move(-1),
      setStation: name => { if (['All Music', 'Eastern Roads', 'Medieval Hall'].includes(name)) { station = name; renderPlaylist(); loadTrack(songQueue()[0] || 0, true); } },
      playlist: () => PLAYLIST.map(track => ({ ...track })),
      currentTrack: () => ({ ...PLAYLIST[index] }),
      audio
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();