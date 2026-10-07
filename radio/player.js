(() => {
  'use strict';

  const PLAYLIST = Array.isArray(globalThis.FOLKHOLD_RADIO_PLAYLIST)
    ? globalThis.FOLKHOLD_RADIO_PLAYLIST
    : [];

  const VOLUME_KEY = 'folkhold.radio.volume';
  const DEFAULT_VOLUME = 0.32;
  // Single, consistently rendered SVG controls. Never use emoji presentation for transport icons.
  const PLAY_ICON = '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  const PAUSE_ICON = '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>';
  const PREVIOUS_ICON = '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M5 5v14M19 6L8 12l11 6z"/></svg>';
  const NEXT_ICON = '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M19 5v14M5 6l11 6-11 6z"/></svg>';
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
    // The radio has its own screen. Do not inherit old floating-footer CSS:
    // that compressed the album panel on iPhone and shrank the controls.
    style.textContent = `
      .fh-radio-page{padding:24px 28px;margin:20px 0 30px;background:rgba(255,248,238,.96)}
      .fh-radio-page,.fh-radio-page *{box-sizing:border-box}
      .fh-radio-page .folkhold-radio{position:static;width:100%;min-width:0;display:grid;grid-template-columns:minmax(0,1fr);gap:19px;padding:0;background:transparent;color:#2c2926;border:0;box-shadow:none;font-family:Georgia,'Times New Roman',serif}
      .fh-radio-page .fh-radio-stations{display:flex;justify-content:center;gap:9px;flex-wrap:wrap}
      .fh-radio-page .fh-radio-stations button{border:1px solid #aa906b;border-radius:99px;padding:10px 14px;min-height:44px;background:#efe0c8;color:#473523;font:600 13px Arial,sans-serif;touch-action:manipulation}
      .fh-radio-page .fh-radio-stations button[aria-pressed="true"]{background:#355e4a;border-color:#355e4a;color:white}
      .fh-radio-page .fh-radio-controls{display:grid;grid-template-columns:50px 62px 50px;justify-content:center;align-items:center;gap:15px;width:100%;margin:0 auto}
      .fh-radio-page .fh-radio-controls button{display:grid;place-items:center;width:50px;height:50px;min-width:50px;min-height:50px;border:1px solid #826c4d;border-radius:50%;background:#2a241f;color:#f2e7d5;padding:0;cursor:pointer;touch-action:manipulation;box-shadow:0 2px 5px #0003}
      .fh-radio-page .fh-radio-controls button:hover{background:#3a3028}
      .fh-radio-page .fh-radio-controls .fh-radio-play{width:62px;height:62px;min-width:62px;min-height:62px;background:#355e4a;border-color:#6f8d78}
      .fh-radio-page .fh-radio-controls svg{width:24px;height:24px;display:block;fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
      .fh-radio-page .fh-radio-controls .fh-radio-play svg{width:29px;height:29px}
      .fh-radio-page .fh-radio-now{width:100%;min-width:0;max-width:none;padding:23px 16px;border-radius:12px;background:#29221c;color:#f2e7d5;text-align:center;display:grid;gap:5px}
      .fh-radio-page .fh-radio-label{font:700 10px Arial,sans-serif;letter-spacing:.14em;color:#d5b77e}
      .fh-radio-page .fh-radio-title{font-size:clamp(24px,4vw,36px);font-weight:bold;white-space:normal;overflow-wrap:anywhere}
      .fh-radio-page .fh-radio-artist{color:#baa98d;font:13px Arial,sans-serif;white-space:normal;overflow-wrap:anywhere;line-height:1.45}
      .fh-radio-page .fh-radio-progress{display:grid;grid-template-columns:42px minmax(0,1fr) 42px;gap:9px;align-items:center;color:#645443;font:12px Arial,sans-serif}
      .fh-radio-page .fh-radio-progress input{width:100%;min-width:0;accent-color:#b08d57}
      .fh-radio-page .fh-radio-volume{display:flex;align-items:center;justify-content:center;gap:9px;color:#645443;font:12px Arial,sans-serif}
      .fh-radio-page .fh-radio-volume input{width:min(300px,65vw);accent-color:#b08d57}
      .fh-radio-page .fh-radio-status{position:static;max-width:none;border-radius:8px;border:1px solid #80623f;padding:11px;line-height:1.5;background:#2b241d;color:#e8d7bd;font:12px Arial,sans-serif}
      .fh-radio-page .fh-radio-status[hidden]{display:none}
      .fh-radio-page .fh-radio-list-heading{font:700 12px Arial,sans-serif;letter-spacing:.13em;color:#645138;text-transform:uppercase;margin:6px 0 10px}
      .fh-radio-page .fh-radio-playlist{list-style:none;margin:0;padding:0;display:grid;gap:8px}
      .fh-radio-page .fh-radio-playlist button{width:100%;display:flex;min-height:48px;align-items:center;gap:12px;text-align:left;padding:13px 15px;background:#f7ebd9;color:#3a2c20;border:1px solid #c6ae87;border-radius:10px;touch-action:manipulation}
      .fh-radio-page .fh-radio-playlist button:hover{background:#f0ddc0}
      .fh-radio-page .fh-radio-playlist button[aria-current="true"]{border-color:#355e4a;background:#e0e9de}
      .fh-radio-page .fh-radio-track-number{font:700 12px Arial,sans-serif;min-width:22px;color:#705a3b}
      .fh-radio-page .fh-radio-track-info{display:grid;gap:3px;min-width:0}
      .fh-radio-page .fh-radio-track-info small{font:12px Arial,sans-serif;color:#6d6256}
      .fh-radio-page .fh-radio-credits{font:12px Arial,sans-serif;line-height:1.55;color:#6c5a46}
      .fh-radio-page .fh-radio-credits a{color:#355e4a}
      @media(max-width:760px){
        .fh-radio-page{padding:18px 14px;max-width:100%;overflow:hidden}
        .fh-radio-page .folkhold-radio{width:100%;min-width:0}
        .fh-radio-page .fh-radio-now{padding:23px 13px;max-width:none}
        .fh-radio-page .fh-radio-title{font-size:clamp(22px,6vw,29px)}
        .fh-radio-page .fh-radio-controls{grid-template-columns:48px 60px 48px;gap:14px}
        .fh-radio-page .fh-radio-controls button{width:48px;height:48px;min-width:48px;min-height:48px}
        .fh-radio-page .fh-radio-controls .fh-radio-play{width:60px;height:60px;min-width:60px;min-height:60px}
        .fh-radio-page .fh-radio-volume{display:none!important}
      }
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
        <button type="button" data-radio-prev aria-label="Previous song">${PREVIOUS_ICON}</button>
        <button type="button" class="fh-radio-play" data-radio-play aria-label="Play">${PLAY_ICON}</button>
        <button type="button" data-radio-next aria-label="Next song">${NEXT_ICON}</button>
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
    // iPhone uses hardware volume buttons; never inherit desktop media attenuation.
    const phoneLayout = window.matchMedia('(max-width:760px)').matches;
    audio.volume = phoneLayout ? 1 : savedVolume();

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
      playButton.innerHTML = playing ? PAUSE_ICON : PLAY_ICON;
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