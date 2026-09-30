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
  if (document.querySelector('script[data-folkhold-account-ui]')) return;
  const script = document.createElement('script');
  script.src = 'auth-ui.js';
  script.async = true;
  script.dataset.folkholdAccountUi = 'true';
  document.head.append(script);
})();
