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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureMobileDirectoryNav, { once: true });
  } else {
    ensureMobileDirectoryNav();
  }
})();
