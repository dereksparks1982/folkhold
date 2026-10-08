(() => {
  const state = {
    view: location.hash.replace('#', '') || 'home',
    tavernAccepted: localStorage.getItem('folkhold.tavernAccepted') === 'yes'
  };

  const screens = [...document.querySelectorAll('[data-screen]')];
  const navButtons = [...document.querySelectorAll('[data-view]')];
  const toast = document.getElementById('toast');
  const tavernDialog = document.getElementById('tavern-dialog');
  const tavernConsent = document.getElementById('tavern-consent');
  const acceptTavern = document.getElementById('accept-tavern');
  const adDialog = document.getElementById('ad-dialog');

  function loadLocalScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[data-folkhold-module="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.dataset.folkholdModule = src;
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.head.append(script);
    });
  }

  loadLocalScript('ads-config.js')
    .then(() => loadLocalScript('ads.js'))
    .then(() => window.FolkholdAds?.showForView(state.view))
    .catch((error) => console.warn('Folkhold ad module did not load.', error));

  loadLocalScript('cloudflare-config.js?v=22')
    .then(() => {
      const brandIcon = document.querySelector('.brand-mark img');
      if (brandIcon) brandIcon.src = 'assets/folkhold-app-icon-192.png?v=10';
      return loadLocalScript('hanafi-bridge.js?v=1');
    })
    .then(() => loadLocalScript('backgammon-engine.js?v=1'))
    .then(() => loadLocalScript('backgammon.js?v=1'))
    .then(() => loadLocalScript('hold-designer.js?v=1'))
    .then(() => loadLocalScript('global-chat.js'))
    .catch((error) => console.warn('Folkhold runtime module did not load.', error));

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  function setView(name, updateHash = true) {
    if (!screens.some(s => s.dataset.screen === name)) name = 'home';
    state.view = name;
    screens.forEach(s => s.classList.toggle('active', s.dataset.screen === name));
    navButtons.forEach(b => b.classList.toggle('active', b.dataset.view === name));
    if (updateHash && location.hash !== `#${name}`) history.pushState({ folkholdView: name }, '', `#${name}`);
    document.getElementById('main').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (name === 'tavern') renderTavern();
    window.FolkholdAds?.showForView(name);
  }

  function renderTavern() {
    const area = document.getElementById('tavern-content');
    if (!state.tavernAccepted) {
      area.className = 'panel tavern-chat locked-content';
      area.innerHTML = '<div class="locked-badge">🔒</div><h2>The door is closed.</h2><p>Accept the one-time Tavern warning to enter this prototype area.</p><button class="primary" type="button" data-action="tavern-enter">Read warning & enter</button>';
      return;
    }
    area.className = 'panel tavern-chat tavern-live';
    area.innerHTML = `
      <span class="eyebrow">YOU ACCEPTED THE TAVERN WARNING</span>
      <div class="chat-stream">
        <div class="chat-message"><span class="chat-time">3:07</span><button class="chat-name">BarstoolPhilosopher</button><p>Prototype note: this room will eventually require real adult verification.</p></div>
        <div class="chat-message"><span class="chat-time">3:09</span><button class="chat-name">OldSchoolNet</button><p>The point is knowing what room you're entering before you open the door.</p></div>
        <div class="chat-message"><span class="chat-time">3:11</span><button class="chat-name">ModBot</button><p>Minimal moderation does not mean invisible. Illegal conduct remains outside the rules.</p></div>
      </div>
      <div class="chat-compose"><input aria-label="Tavern message" placeholder="Prototype: local message only"><button class="danger" type="button" data-action="prototype-send">Send</button></div>`;
  }

  document.addEventListener('click', (event) => {
    const viewButton = event.target.closest('[data-view]');
    if (viewButton) {
      setView(viewButton.dataset.view);
      return;
    }

    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;
    const action = actionButton.dataset.action;

    if (action === 'tavern-enter') {
      if (state.tavernAccepted) renderTavern();
      else tavernDialog.showModal();
    }
    if (action === 'ad-settings') adDialog.showModal();
    if (action === 'customize') showToast('Front Door Designer is loading.');
    if (action === 'new-room') showToast('Room creation is planned for the interactive data slice.');
    if (action === 'give-key') showToast('Key gifting UI is next. Each issued key will be unique.');
    if (action === 'knock') showToast('Knock sent. In production, the Hold owner would receive it.');
    if (action === 'revoke') {
      const row = actionButton.closest('.issued-key');
      const who = row?.querySelector('strong')?.textContent || 'That visitor';
      actionButton.textContent = 'Revoked';
      actionButton.disabled = true;
      row.style.opacity = '.5';
      showToast(`${who}'s prototype key has been revoked.`);
    }
    if (action === 'people-search') {
      const query = document.getElementById('people-query').value.trim();
      showToast(query ? `Prototype search: “${query}”` : 'Type something to search the directory.');
    }
    if (action === 'pin-note') {
      const title = prompt('Notice title');
      if (!title) return;
      const body = prompt('What should the notice say?') || '';
      const note = document.createElement('article');
      note.className = 'paper-note tilt-right';
      note.innerHTML = `<span class="pin">●</span><small>NEW NOTICE</small><h2></h2><p></p><footer><strong>You</strong><button type="button">Edit</button></footer>`;
      note.querySelector('h2').textContent = title;
      note.querySelector('p').textContent = body;
      document.getElementById('notice-board').prepend(note);
      showToast('Pinned to the Notice Board in this browser session.');
    }
    if (action === 'prototype-send') showToast('Tavern chat becomes live when the backend is added.');
  });

  document.getElementById('square-form').addEventListener('submit', (event) => {
    if (window.FolkholdGlobalChat?.connected?.()) return;
    event.preventDefault();
    const input = document.getElementById('square-message');
    const text = input.value.trim();
    if (!text) return;
    const row = document.createElement('div');
    row.className = 'chat-message';
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    row.innerHTML = '<span class="chat-time"></span><button class="chat-name">You</button><p></p>';
    row.querySelector('.chat-time').textContent = now;
    row.querySelector('p').textContent = text;
    const stream = document.getElementById('square-chat');
    stream.append(row);
    stream.scrollTop = stream.scrollHeight;
    input.value = '';
  });

  tavernConsent.addEventListener('change', () => {
    acceptTavern.disabled = !tavernConsent.checked;
  });

  tavernDialog.addEventListener('close', () => {
    if (tavernDialog.returnValue === 'default' && tavernConsent.checked) {
      state.tavernAccepted = true;
      localStorage.setItem('folkhold.tavernAccepted', 'yes');
      renderTavern();
      showToast('Tavern warning accepted on this browser.');
    }
  });

  const adCount = document.getElementById('ad-count');
  const adCountLabel = document.getElementById('ad-count-label');
  if (adCount && adCountLabel) {
    adCount.addEventListener('input', () => adCountLabel.textContent = adCount.value);
  }
  adDialog.addEventListener('close', () => showToast('Ad preferences saved locally for the prototype.'));

  window.addEventListener('folkhold:knock', (event) => {
    const holdName = event.detail?.hold || 'this Hold';
    showToast(`You left a knock at ${holdName}.`);
  });


  // Let desktop users scroll the navigation horizontally with a wheel or left-mouse drag.
  const desktopNav = document.querySelector('.desktop-nav');
  if (desktopNav) {
    desktopNav.addEventListener('wheel', (event) => {
      const max = desktopNav.scrollWidth - desktopNav.clientWidth;
      if (max <= 1) return;
      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      const factor = event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? desktopNav.clientWidth : 1;
      const movement = delta * factor;
      if ((movement > 0 && desktopNav.scrollLeft < max - 1) ||
          (movement < 0 && desktopNav.scrollLeft > 1)) {
        desktopNav.scrollLeft += movement;
        event.preventDefault();
      }
    }, { passive: false });

    let pointer = null, startX = 0, startScroll = 0, dragged = false, blockClick = false;
    desktopNav.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      pointer = event.pointerId;
      startX = event.clientX;
      startScroll = desktopNav.scrollLeft;
      dragged = false;
      blockClick = false;
    });
    window.addEventListener('pointermove', event => {
      if (pointer !== event.pointerId) return;
      const offset = startX - event.clientX;
      if (Math.abs(offset) > 5) dragged = true;
      if (!dragged) return;
      desktopNav.classList.add('is-dragging');
      desktopNav.scrollLeft = startScroll + offset;
      event.preventDefault();
    });
    const stopDrag = event => {
      if (pointer !== event.pointerId) return;
      pointer = null;
      blockClick = dragged;
      desktopNav.classList.remove('is-dragging');
    };
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);
    window.addEventListener('blur', () => {
      pointer = null; dragged = false; blockClick = false;
      desktopNav.classList.remove('is-dragging');
    });
    desktopNav.addEventListener('click', event => {
      if (!blockClick) return;
      event.preventDefault();
      event.stopPropagation();
      blockClick = false;
    }, true);
  }

  window.addEventListener('popstate', () => setView(location.hash.replace('#', '') || 'home', false));
  window.addEventListener('hashchange', () => setView(location.hash.replace('#', '') || 'home', false));
  setView(state.view, false);
})();
