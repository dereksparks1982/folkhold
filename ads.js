(() => {
  const config = window.FOLKHOLD_ADS || {};
  const renderedViews = new Set();
  let googleLoader = null;

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

  window.FolkholdAds = Object.freeze({ showForView });
})();
