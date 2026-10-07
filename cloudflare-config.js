/*
 * Folkhold Cloudflare backend configuration.
 *
 * This workers.dev endpoint is the live Folkhold backend.
 */
window.FOLKHOLD_CLOUDFLARE = Object.freeze({
  apiBase: "https://folkhold.dereksparks1982.workers.dev",
  globalChatRoom: "global"
});

(() => {
  if (!document.querySelector('script[data-folkhold-account-ui]')) {
    const script = document.createElement('script');
    script.src = 'auth-ui.js';
    script.async = true;
    script.dataset.folkholdAccountUi = 'true';
    document.head.append(script);
  }

  function applyApprovedBrandIcon() {
    const iconPath = 'assets/folk-hold-brand.png?v=7';
    const faviconPath = 'assets/folkhold-app-icon-192.png?v=9';
    const appleIconPath = 'assets/folkhold-app-icon-180.png?v=9';

    document.querySelectorAll(
      '.brand-mark img, .side-rail [data-view="home"] img, .mobile-nav [data-view="home"] img, img[src="assets/folkhold-home.png"], img[src$="/folkhold-home.png"], img[src="assets/folkhold-home-fh.png"], img[src^="assets/folkhold-home-fh.png?"]'
    ).forEach((img) => {
      img.src = iconPath;
    });

    document.querySelectorAll('link[rel="icon"]').forEach((link) => {
      link.href = faviconPath;
      link.type = 'image/png';
      link.setAttribute('sizes', '192x192');
    });

    document.querySelectorAll('link[rel="apple-touch-icon"]').forEach((link) => {
      link.href = appleIconPath;
      link.setAttribute('sizes', '180x180');
    });

    const manifest = document.querySelector('link[rel="manifest"]');
    if (manifest) manifest.href = 'site.webmanifest?v=9';

    document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((meta) => {
      meta.content = 'https://dereksparks1982.github.io/folkhold/assets/folk-hold-brand.png?v=7';
    });
  }

  function applyFolkholdNaming() {
    document.title = 'Folkhold';

    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = 'Folkhold: your place, your people, your keys.';

    document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((meta) => {
      meta.content = 'Folkhold';
    });

    document.querySelectorAll('.brand-copy strong').forEach((node) => {
      node.textContent = 'Folkhold';
    });

    const brandButton = document.querySelector('.brand[data-view="home"]');
    if (brandButton) brandButton.setAttribute('aria-label', 'Folkhold Hub');

    document.querySelectorAll('.side-rail [data-view="home"], .mobile-nav [data-view="home"]').forEach((button) => {
      button.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) node.nodeValue = node.nodeValue.replace(/Home/g, 'Hub');
      });
      button.setAttribute('aria-label', 'Hub');
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.includes('Folk Hold') || node.nodeValue.includes('FOLK HOLD')) {
        node.nodeValue = node.nodeValue.replace(/FOLK HOLD/g, 'FOLKHOLD').replace(/Folk Hold/g, 'Folkhold');
      }
    }

    document.querySelectorAll('[aria-label="Folk Hold places"]').forEach((node) => {
      node.setAttribute('aria-label', 'Folkhold places');
    });
  }

  function configureDesktopNavigation() {
    const nav = document.querySelector('.desktop-nav');
    if (!nav) return;

    nav.innerHTML = `
      <button type="button" data-view="home"><span aria-hidden="true">⌂</span><small>Hub</small></button>
      <button type="button" data-view="square"><span aria-hidden="true">🏛</span><small>Village Square</small></button>
      <button type="button" data-view="notice"><span aria-hidden="true">📌</span><small>Notice Board</small></button>
      <button type="button" data-view="hold"><span class="folkhold-hold-icon" aria-hidden="true">♜</span><small>My Hold</small></button>
      <button type="button" data-view="tavern"><span aria-hidden="true">🍺</span><small>Tavern</small><b class="top-age-chip">18+</b></button>
      <button type="button" data-view="tea"><span aria-hidden="true">☕</span><small>Tea Room</small></button>
      <button type="button" data-view="directory"><span aria-hidden="true">📖</span><small>Directory</small></button>
      <button type="button" data-view="keys"><span aria-hidden="true">🔑</span><small>Key Ring</small></button>
      <button type="button" data-view="radio"><span aria-hidden="true">📻</span><small>Radio</small></button>
      <button type="button" data-action="ad-settings"><span aria-hidden="true">⚙</span><small>Ads</small></button>
    `;

    const syncActiveState = () => {
      const current = location.hash.replace('#', '') || 'home';
      nav.querySelectorAll('[data-view]').forEach((button) => {
        button.classList.toggle('active', button.dataset.view === current);
      });
    };

    nav.addEventListener('click', () => setTimeout(syncActiveState, 0));
    window.addEventListener('hashchange', syncActiveState);
    syncActiveState();
  }

  function applyDesktopLayout() {
    if (document.getElementById('folkhold-desktop-topnav-style')) return;

    const style = document.createElement('style');
    style.id = 'folkhold-desktop-topnav-style';
    style.textContent = `
      @media (min-width:761px) {
        .side-rail{display:none!important}
        .app-shell{display:block!important;max-width:1280px!important;margin:0 auto!important;border:0!important;outline:0!important;box-shadow:none!important}
        .app-shell::before,.app-shell::after{content:none!important;display:none!important}
        main{width:100%!important;max-width:1120px!important;margin:0 auto!important;padding-left:24px!important;padding-right:24px!important;border:0!important;outline:0!important;box-shadow:none!important}
        .ad-strip{left:0!important}
        .topbar{display:flex!important;gap:14px!important;padding-left:18px!important;padding-right:18px!important}
        .brand{flex:0 0 auto}
        .desktop-nav{display:flex!important;align-items:stretch!important;justify-content:center!important;gap:3px!important;min-width:0!important;flex:1 1 auto!important;margin-left:0!important;overflow-x:auto!important;scrollbar-width:none}
        .desktop-nav::-webkit-scrollbar{display:none}
        .desktop-nav button{position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;min-width:max-content!important;padding:8px 9px!important;border-radius:9px!important;color:#d8cbb7!important;white-space:nowrap!important}
        .desktop-nav button>span{font-size:16px!important;line-height:1!important}
        .desktop-nav button[data-view="hold"]>.folkhold-hold-icon{font-size:23px!important;line-height:1!important;transform:translateY(-2px)}
        .desktop-nav button>small{font:12px Georgia,'Times New Roman',serif!important;color:inherit!important}
        .desktop-nav button:hover,.desktop-nav button.active{background:#302a23!important;color:#fff!important}
        .top-age-chip{font:8px Arial,sans-serif!important;background:var(--red)!important;color:#fff!important;padding:1px 3px!important;border-radius:4px!important;margin-left:1px!important}
        .avatar-button{flex:0 0 auto}
      }
    `;
    document.head.append(style);
  }

  function applySectionHeadingPanels() {
    if (document.getElementById('folkhold-section-heading-style')) return;

    const style = document.createElement('style');
    style.id = 'folkhold-section-heading-style';
    style.textContent = `
      .view > .section-heading {
        background:rgba(255,248,238,.94);
        border:1px solid var(--line);
        border-radius:var(--radius);
        box-shadow:var(--shadow);
        padding:24px 28px;
      }
    `;
    document.head.append(style);
  }

  function applyMedievalHoldDoor() {
    const heroDoor = document.querySelector('.hero-door');
    const door = heroDoor?.querySelector('.door');
    const sign = heroDoor?.querySelector('.door-sign');
    const welcome = heroDoor?.querySelector('.doormat');
    if (!heroDoor || !door) return;

    heroDoor.removeAttribute('aria-hidden');
    if (sign) sign.textContent = "Derek's Hold";
    if (welcome) welcome.textContent = 'Everyone is Welcome';

    door.setAttribute('role', 'button');
    door.setAttribute('tabindex', '0');
    door.setAttribute('aria-label', "Knock on Derek's Hold");
    door.setAttribute('title', 'Double-click to knock');

    if (!document.getElementById('folkhold-medieval-door-style')) {
      const style = document.createElement('style');
      style.id = 'folkhold-medieval-door-style';
      style.textContent = `
        .hero-door{width:250px!important}
        .door-sign{background:#3b2a1d!important;color:#f1dfbf!important;border:3px solid #8d6a39!important;padding:8px 18px!important;box-shadow:0 6px 10px rgba(0,0,0,.22)!important}
        .hero-door .door{
          height:285px!important;
          width:185px!important;
          margin:14px auto 0!important;
          border:10px solid #34271c!important;
          border-bottom:0!important;
          border-radius:92px 92px 3px 3px!important;
          background:
            linear-gradient(90deg,rgba(255,255,255,.035),rgba(0,0,0,.08)),
            repeating-linear-gradient(90deg,#684827 0 28px,#3e2a19 28px 31px,#795334 31px 57px)!important;
          box-shadow:inset 0 0 0 4px #8b6338,inset 0 -20px 30px rgba(0,0,0,.2),0 18px 22px rgba(0,0,0,.2)!important;
          position:relative!important;
          cursor:pointer!important;
        }
        .hero-door .door::before{
          content:""!important;
          position:absolute!important;
          left:7px!important;
          right:7px!important;
          top:72px!important;
          height:12px!important;
          border:1px solid #0d0b09!important;
          background:
            radial-gradient(circle at 9px 50%,#8a7657 0 2px,transparent 3px),
            radial-gradient(circle at calc(100% - 9px) 50%,#8a7657 0 2px,transparent 3px),
            #24201c!important;
          box-shadow:0 92px 0 #24201c!important;
          border-radius:2px!important;
        }
        .hero-door .door::after{
          content:""!important;
          position:absolute!important;
          inset:10px!important;
          border:2px solid rgba(173,134,86,.55)!important;
          border-radius:80px 80px 2px 2px!important;
          pointer-events:none!important;
        }
        .hero-door .door-keyhole{
          position:absolute!important;
          right:31px!important;
          top:143px!important;
          width:15px!important;
          height:15px!important;
          border-radius:50%!important;
          background:#15110e!important;
          color:transparent!important;
          box-shadow:0 0 0 2px #a27a43!important;
          z-index:3!important;
        }
        .hero-door .door-keyhole::after{
          content:"";
          position:absolute;
          left:4px;
          top:10px;
          width:7px;
          height:15px;
          background:#15110e;
          clip-path:polygon(50% 0,100% 100%,0 100%);
        }
        .doormat{font:11px Georgia,'Times New Roman',serif!important;letter-spacing:.06em!important;background:#4d3726!important;color:#ead7b7!important;padding:10px!important;width:225px!important;margin:auto!important;text-transform:none!important}
        .hero-door .door:focus-visible{outline:3px solid var(--brass-light)!important;outline-offset:5px!important}
        .knock-dialog{border:0;padding:0;background:transparent;max-width:min(420px,calc(100vw - 28px))}
        .knock-card{background:var(--cream);color:var(--ink);border:2px solid var(--brass);border-radius:14px;padding:24px;box-shadow:0 24px 70px rgba(0,0,0,.55);text-align:center}
        .knock-card h2{margin:0 0 18px;font-size:25px}
        .knock-actions{display:flex;justify-content:center;gap:10px}
        .knock-actions button{min-width:90px;border-radius:9px;padding:9px 14px}
      `;
      document.head.append(style);
    }

    if (!document.getElementById('folkhold-knock-dialog')) {
      const dialog = document.createElement('dialog');
      dialog.id = 'folkhold-knock-dialog';
      dialog.className = 'knock-dialog';
      dialog.innerHTML = `
        <form method="dialog" class="knock-card">
          <h2>Do you wish to leave a knock?</h2>
          <div class="knock-actions">
            <button class="secondary" value="no">No</button>
            <button class="primary" value="yes">Yes</button>
          </div>
        </form>
      `;
      document.body.append(dialog);
      dialog.addEventListener('close', () => {
        if (dialog.returnValue === 'yes') {
          window.dispatchEvent(new CustomEvent('folkhold:knock', { detail: { hold: "Derek's Hold" } }));
        }
      });
    }

    const openKnockDialog = () => document.getElementById('folkhold-knock-dialog')?.showModal();
    door.addEventListener('dblclick', openKnockDialog);
    door.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openKnockDialog();
      }
    });
  }

  function ensureMobileDirectoryNav() {
    const nav = document.querySelector('.mobile-nav');
    if (!nav || nav.querySelector('[data-view="directory"]')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.view = 'directory';
    button.innerHTML = '<span aria-hidden="true">📖</span>Directory';
    button.setAttribute('aria-label', 'Directory');

    const keysButton = nav.querySelector('[data-view="keys"]');
    nav.insertBefore(button, keysButton || null);

    if (!document.getElementById('folkhold-mobile-directory-style')) {
      const style = document.createElement('style');
      style.id = 'folkhold-mobile-directory-style';
      style.textContent = '@media(max-width:760px){.mobile-nav{grid-template-columns:repeat(6,1fr)!important}.mobile-nav button{min-width:0}.mobile-nav button[data-view="directory"]{font-size:10px}}';
      document.head.append(style);
    }

    const syncActiveState = () => {
      button.classList.toggle('active', location.hash === '#directory');
    };

    button.addEventListener('click', () => setTimeout(syncActiveState, 0));
    window.addEventListener('hashchange', syncActiveState);
    syncActiveState();
  }

  function bootFolkholdUiFixes() {
    applyApprovedBrandIcon();
    applyFolkholdNaming();
    configureDesktopNavigation();
    applyDesktopLayout();
    applySectionHeadingPanels();
    applyMedievalHoldDoor();
    ensureMobileDirectoryNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootFolkholdUiFixes, { once: true });
  } else {
    bootFolkholdUiFixes();
  }
})();
