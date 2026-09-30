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
    const iconPath = 'assets/folk-hold-brand.png?v=6';
    const faviconPath = 'favicon.ico?v=6';
    const appleIconPath = 'apple-touch-icon.png?v=6';

    document.querySelectorAll(
      '.brand-mark img, .side-rail [data-view="home"] img, .mobile-nav [data-view="home"] img, img[src="assets/folkhold-home.png"], img[src$="/folkhold-home.png"], img[src="assets/folkhold-home-fh.png"], img[src^="assets/folkhold-home-fh.png?"]'
    ).forEach((img) => {
      img.src = iconPath;
    });

    document.querySelectorAll('link[rel="icon"]').forEach((link) => {
      link.href = faviconPath;
      link.type = 'image/x-icon';
    });

    document.querySelectorAll('link[rel="apple-touch-icon"]').forEach((link) => {
      link.href = appleIconPath;
      link.setAttribute('sizes', '180x180');
    });

    document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((meta) => {
      meta.content = 'https://dereksparks1982.github.io/folkhold/assets/folk-hold-brand.png?v=6';
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
    ensureMobileDirectoryNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootFolkholdUiFixes, { once: true });
  } else {
    bootFolkholdUiFixes();
  }
})();
