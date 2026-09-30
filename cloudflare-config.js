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
    const faviconPath = 'favicon.ico?v=7';
    const appleIconPath = 'apple-touch-icon.png?v=7';

    document.querySelectorAll(
      '.brand-mark img, .side-rail [data-view="home"] img, .mobile-nav [data-view="home"] img, img[src="assets/folkhold-home.png"], img[src$="/folkhold-home.png"], img[src="assets/folkhold-home-fh.png"], img[src^="assets/folkhold-home-fh.png?"]'
    ).forEach((img) => {
      img.src = iconPath;
    });

    document.querySelectorAll('link[rel="icon"]').forEach((link) => {
      link.href = faviconPath;
      link.type = 'image/x-icon';
      link.removeAttribute('sizes');
    });

    document.querySelectorAll('link[rel="apple-touch-icon"]').forEach((link) => {
      link.href = appleIconPath;
      link.removeAttribute('sizes');
    });

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
      <button type="button" data-view="hold"><span aria-hidden="true">🏠</span><small>My Hold</small></button>
      <button type="button" data-view="square"><span aria-hidden="true">🏛</span><small>Square</small></button>
      <button type="button" data-view="notice"><span aria-hidden="true">📌</span><small>Notices</small></button>
      <button type="button" data-view="tavern"><span aria-hidden="true">🍺</span><small>Tavern</small><b class="top-age-chip">18+</b></button>
      <button type="button" data-view="tea"><span aria-hidden="true">☕</span><small>Tea Room</small></button>
      <button type="button" data-view="directory"><span aria-hidden="true">📖</span><small>Directory</small></button>
      <button type="button" data-view="keys"><span aria-hidden="true">🔑</span><small>Key Ring</small></button>
      <button type="button" data-action="ad-settings"><span aria-hidden="true">⚙</span><small>Ads</small></button>
    `;
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
        .desktop-nav button>small{font:12px Georgia,'Times New Roman',serif!important;color:inherit!important}
        .desktop-nav button:hover,.desktop-nav button.active{background:#302a23!important;color:#fff!important}
        .top-age-chip{font:8px Arial,sans-serif!important;background:var(--red)!important;color:#fff!important;padding:1px 3px!important;border-radius:4px!important;margin-left:1px!important}
        .avatar-button{flex:0 0 auto}
      }
    `;
    document.head.append(style);
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
    ensureMobileDirectoryNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootFolkholdUiFixes, { once: true });
  } else {
    bootFolkholdUiFixes();
  }
})();
