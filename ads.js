(() => {
  const config = window.FOLKHOLD_ADS || {};
  const renderedViews = new Set();
  let googleLoader = null;

  function installPrototypeChrome() {
    document.getElementById('ad-strip')?.remove();
    document.querySelector('.range-label')?.remove();

    const dialog = document.getElementById('ad-dialog');
    const intro = dialog?.querySelector('p');
    const privacy = dialog?.querySelector('.privacy-note');
    if (intro) intro.textContent = 'Folkhold reserves one unobtrusive banner per page. Free accounts keep the banner, while declared interests can guide Folkhold-direct ads and compatible providers without building a behavioral profile.';
    if (privacy) privacy.textContent = 'Google AdSense is the first network being wired in. Folkhold requests non-personalized Google ads by default. Other areas can use different providers when appropriate.';

    const principle = document.querySelector('.principle p');
    if (principle) principle.textContent = 'One quiet banner per page. Google AdSense is the first provider, using non-personalized requests by default where Google is eligible to serve.';

    const style = document.createElement('style');
    style.dataset.folkholdAds = 'true';
    style.textContent = `
      .folkhold-page-ad{position:relative;max-width:970px;min-height:92px;margin:16px auto 24px;border:1px solid rgba(176,141,87,.38);border-radius:12px;background:rgba(255,248,238,.76);overflow:hidden;display:grid;place-items:center;box-shadow:0 7px 20px rgba(50,36,23,.05)}
      .folkhold-page-ad .ad-kicker{position:absolute;top:6px;left:9px;z-index:2;font:9px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#8a7a67}
      .folkhold-page-ad .ad-placeholder{padding:22px 18px 14px;text-align:center;font:13px Arial,sans-serif;color:#6f6356}
      .folkhold-page-ad .ad-placeholder strong{display:block;color:#3c332a;font-size:14px;margin-bottom:4px}
      .folkhold-page-ad .adsbygoogle{display:block;width:100%;min-height:90px}
      @media(max-width:760px){.mobile-nav{bottom:0!important}.folkhold-page-ad{min-height:72px;margin:12px auto 18px;border-radius:10px}.folkhold-page-ad .adsbygoogle{min-height:70px}}
    `;
    document.head.append(style);
  }

  function hasLiveGoogleConfig() {
    return config.enabled === true &&
      /^ca-pub-\d+$/.test(config.client || '') &&
      /^\d+$/.test(config.slot || '');
  }

  function isGoogleView(view) {
    const views = Array.isArray(config.googleViews) ? config.googleViews : [];
    return views.includes(view);
  }

  function ensureHost(view) {
    const screen = document.querySelector(`[data-screen="${view}"]`);
    if (!screen) return null;

    let host = screen.querySelector('.folkhold-page-ad');
    if (host) return host;

    host = document.createElement('aside');
    host.className = 'folkhold-page-ad';
    host.setAttribute('aria-label', 'Advertisement');
    host.dataset.adView = view;

    const anchor = screen.querySelector('.section-heading, .hold-cover, .tavern-header, .hero');
    if (anchor) anchor.insertAdjacentElement('afterend', host);
    else screen.prepend(host);
    return host;
  }

  function placeholder(host, title, detail) {
    host.innerHTML = `
      <span class="ad-kicker">Advertisement</span>
      <div class="ad-placeholder"><strong>${title}</strong><span>${detail}</span></div>`;
  }

  function loadGoogle() {
    if (googleLoader) return googleLoader;

    googleLoader = new Promise((resolve, reject) => {
      window.adsbygoogle = window.adsbygoogle || [];
      if (config.nonPersonalized !== false) {
        window.adsbygoogle.requestNonPersonalizedAds = 1;
      }

      const existing = document.querySelector('script[data-folkhold-adsense]');
      if (existing) {
        if (existing.dataset.loaded === 'yes') resolve();
        else {
          existing.addEventListener('load', resolve, { once: true });
          existing.addEventListener('error', reject, { once: true });
        }
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.folkholdAdsense = 'true';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.client)}`;
      script.addEventListener('load', () => {
        script.dataset.loaded = 'yes';
        resolve();
      }, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.head.append(script);
    });

    return googleLoader;
  }

  async function renderGoogle(host, view) {
    if (renderedViews.has(view)) return;

    host.innerHTML = '<span class="ad-kicker">Advertisement</span>';
    const unit = document.createElement('ins');
    unit.className = 'adsbygoogle';
    unit.style.display = 'block';
    unit.dataset.adClient = config.client;
    unit.dataset.adSlot = config.slot;
    unit.dataset.adFormat = 'horizontal';
    unit.dataset.fullWidthResponsive = 'true';
    host.append(unit);

    try {
      await loadGoogle();
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      renderedViews.add(view);
    } catch (error) {
      console.warn('Folkhold Google ad could not load.', error);
      placeholder(host, 'Ad slot ready', 'Google AdSense could not load in this browser.');
    }
  }

  function showForView(view) {
    const host = ensureHost(view);
    if (!host) return;

    if (!isGoogleView(view)) {
      placeholder(host, 'Room-specific ad slot', 'Reserved for a provider allowed in this area.');
      return;
    }

    if (!hasLiveGoogleConfig()) {
      placeholder(host, 'Google AdSense slot ready', 'Add the Folkhold publisher ID and responsive banner slot to activate it.');
      return;
    }

    renderGoogle(host, view);
  }

  installPrototypeChrome();
  window.FolkholdAds = Object.freeze({ showForView });
})();
