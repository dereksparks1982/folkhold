/*
 * Folkhold advertising configuration.
 *
 * Live Google ads remain disabled until an approved AdSense publisher ID
 * and responsive display-ad slot ID are supplied.
 */
window.FOLKHOLD_ADS = Object.freeze({
  provider: 'google-adsense',
  enabled: false,
  client: '',       // Example: ca-pub-1234567890123456
  slot: '',         // Example: 1234567890
  nonPersonalized: true,
  googleViews: ['home', 'hold', 'square', 'notice', 'tea', 'directory', 'keys']
});
