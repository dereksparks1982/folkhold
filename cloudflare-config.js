/*
 * Folkhold Cloudflare backend configuration.
 *
 * Leave apiBase blank while the Worker is not deployed. Once Cloudflare gives
 * us the folkhold-api workers.dev URL, put it here, for example:
 *   https://folkhold-api.example.workers.dev
 */
window.FOLKHOLD_CLOUDFLARE = Object.freeze({
  apiBase: "",
  globalChatRoom: "global"
});
