(() => {
  const config = window.FOLKHOLD_CLOUDFLARE || {};
  const apiBase = String(config.apiBase || "").replace(/\/$/, "");
  if (!apiBase) return;

  const cloudOrigin = new URL(apiBase).origin;
  // GitHub Pages is the canonical frontend; Cloudflare is an API-only backend.
  // A tab-scoped bearer session works when third-party cookies are disabled.
  const tokenKey = "folkhold.sessionBearer";
  let authPopup = null;
  let authNonce = null;
  function currentToken() { return sessionStorage.getItem(tokenKey) || ""; }
  function saveToken(token) {
    if (typeof token === "string" && token.length > 20) sessionStorage.setItem(tokenKey, token);
  }
  const avatar = document.querySelector(".avatar-button");
  if (!avatar) return;

  avatar.removeAttribute("data-view");
  avatar.textContent = "👤";
  avatar.setAttribute("aria-label", "Folkhold account");
  avatar.title = "Account";

  const style = document.createElement("style");
  style.textContent = `
    .account-dialog{width:min(520px,calc(100vw - 24px));max-width:520px}
    .account-card{background:#fff8ee;color:#2c2926;border:2px solid #b08d57;border-radius:18px;padding:26px;box-shadow:0 30px 100px #0008}
    .account-card h1{font-size:34px;margin:0 0 8px;color:#251f1a}.account-card p{line-height:1.45;color:#695f54}
    .account-close{position:absolute;right:17px;top:14px;border:0;background:transparent;font-size:24px;color:#766657}
    .account-social{display:grid;gap:9px;margin:18px 0}.account-social button,.account-submit{min-height:46px;border-radius:10px;border:1px solid #bca17a;background:#fff;color:#2c2926;font-weight:bold;padding:10px 14px;text-align:center;text-decoration:none;display:grid;place-items:center}
    .account-social button.apple{background:#171717;color:white;border-color:#171717}.account-social button.google{background:#fff;color:#2c2926}.account-social button:disabled{opacity:.45;cursor:not-allowed}
    .account-divider{display:flex;align-items:center;gap:11px;color:#9b8c7b;font:11px Arial,sans-serif;text-transform:uppercase;letter-spacing:.1em;margin:17px 0}.account-divider:before,.account-divider:after{content:"";height:1px;background:#dfd0bc;flex:1}
    .account-tabs{display:grid;grid-template-columns:1fr 1fr;gap:5px;background:#eee1cf;padding:4px;border-radius:10px;margin-bottom:17px}.account-tabs button{border:0;border-radius:7px;padding:9px;background:transparent;color:#665b50}.account-tabs button.active{background:#fff8ee;color:#2c2926;box-shadow:0 2px 8px #0001}
    .account-form{display:grid;gap:11px}.account-form label{display:grid;gap:5px;font:12px Arial,sans-serif;color:#63584c}.account-form input{width:100%;border:1px solid #c8b394;border-radius:9px;padding:11px;background:#fff;color:#28231e;font:16px Arial,sans-serif}.account-submit{background:#355e4a;color:white;border-color:#294839;cursor:pointer}.account-submit:disabled{opacity:.55;cursor:wait}
    .account-message{min-height:19px;margin:10px 0 0;font:12px Arial,sans-serif;color:#8c3f3f}.account-good{color:#355e4a}.account-user{display:grid;gap:12px}.account-user-badge{display:flex;align-items:center;gap:13px;background:#f1e4d2;padding:14px;border-radius:12px}.account-user-badge b{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:#355e4a;color:white;font-size:21px}.account-user-badge strong,.account-user-badge small{display:block}.account-user-badge small{color:#75695d;margin-top:3px}.account-actions{display:flex;gap:9px;flex-wrap:wrap}.account-actions button{border:1px solid #b89b73;border-radius:9px;background:transparent;padding:9px 13px;color:#4b3a29}.account-note{font-size:12px!important;color:#817366!important}.account-status{display:inline-flex;gap:6px;align-items:center;background:#e5efe8;color:#355e4a;border-radius:999px;padding:5px 8px;font:bold 11px Arial,sans-serif}.account-status.waiting{background:#eee1cf;color:#7a6957}
    @media(max-width:760px){.account-card{padding:22px 18px}.account-card h1{font-size:29px}.account-dialog{width:calc(100vw - 18px)}}
  `;
  document.head.append(style);

  const dialog = document.createElement("dialog");
  dialog.className = "account-dialog";
  dialog.innerHTML = `<div class="account-card" style="position:relative"><button class="account-close" type="button" aria-label="Close">×</button><div data-account-body></div></div>`;
  document.body.append(dialog);
  const body = dialog.querySelector("[data-account-body]");
  dialog.querySelector(".account-close").addEventListener("click", () => dialog.close());

  let status = null;
  let sessionData = null;
  let profileData = null;
  let mode = "signin";

  async function api(path, options = {}) {
    const token = currentToken();
    const response = await fetch(`${apiBase}${path}`, {
      credentials: "omit",
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: "Bearer " + token } : {}),
        ...(options.headers || {}),
      },
    });
    // Better Auth bearer plugin emits a new session on email sign-in/sign-up.
    // Keep the opaque credential out of URLs, HTML and localStorage.
    if (response.ok) saveToken(response.headers.get("set-auth-token"));
    let data = null;
    try { data = await response.json(); } catch { data = {}; }
    if (!response.ok) {
      const error = new Error(data?.message || data?.error || `Request failed (${response.status})`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }

  function setMessage(text, good = false) {
    const area = dialog.querySelector(".account-message");
    if (!area) return;
    area.textContent = text || "";
    area.classList.toggle("account-good", good);
  }

  async function loadStatus() {
    try {
      status = await api("/api/account/status");
    } catch {
      status = { ready: false, providers: {} };
    }
    return status;
  }

  async function loadSession() {
    try {
      sessionData = await api("/api/auth/get-session");
    } catch {
      sessionData = null;
    }
    if (!sessionData?.user) {
      profileData = null;
      return null;
    }
    try {
      const result = await api("/api/folkhold/profile");
      profileData = result.profile || null;
    } catch {
      profileData = null;
    }
    if (profileData) {
      localStorage.setItem("folkhold.globalChatName", profileData.display_name || profileData.username);
      avatar.textContent = (profileData.display_name || profileData.username || "U").charAt(0).toUpperCase();
      avatar.title = `Signed in as ${profileData.username}`;
    } else {
      avatar.textContent = (sessionData.user.name || sessionData.user.email || "U").charAt(0).toUpperCase();
    }
    return sessionData;
  }

  async function completePopup(event) {
    if (event.origin !== cloudOrigin || event.source !== authPopup) return;
    const message = event.data;
    if (!message || message.type !== "folkhold:auth-complete" || message.nonce !== authNonce) return;
    authPopup = null;
    authNonce = null;
    if (typeof message.token !== "string" || message.token.length < 20) return;
    saveToken(message.token);
    setMessage("Finishing sign-in…", true);
    await loadSession();
    if (!sessionData?.user) {
      setMessage("Sign-in could not be confirmed. Please retry.");
    } else if (!profileData) {
      renderUsernameSetup();
    } else {
      renderAccount();
    }
  }
  window.addEventListener("message", completePopup);

  function socialButton(provider, label, className) {
    const enabled = Boolean(status?.providers?.[provider]);
    return `<button class="${className}" type="button" data-social="${provider}" ${enabled ? "" : "disabled"}>${label}${enabled ? "" : " · setup pending"}</button>`;
  }

  function renderSignedOut() {
    body.innerHTML = `
      <span class="eyebrow">FOLKHOLD ACCOUNT</span>
      <h1>${mode === "signup" ? "Create your account" : "Welcome back"}</h1>
      <div class="account-social">
        ${socialButton("google", "Continue with Google", "google")}
        ${socialButton("apple", "Continue with Apple", "apple")}
      </div>
      <div class="account-divider">or use email</div>
      <div class="account-tabs"><button type="button" data-mode="signin" class="${mode === "signin" ? "active" : ""}">Sign in</button><button type="button" data-mode="signup" class="${mode === "signup" ? "active" : ""}">Create account</button></div>
      ${mode === "signup" ? `
        <form class="account-form" data-signup>
          <label>Folkhold username<input name="username" maxlength="24" pattern="[A-Za-z0-9_]{3,24}" autocomplete="username" placeholder="yourname" required></label>
          <label>Display name<input name="displayName" maxlength="60" autocomplete="name" placeholder="Your name" required></label>
          <label>Email<input name="email" type="email" autocomplete="email" required></label>
          <label>Password<input name="password" type="password" minlength="8" maxlength="128" autocomplete="new-password" required></label>
          <button class="account-submit" type="submit">Create account</button>
        </form>` : `
        <form class="account-form" data-signin>
          <label>Email<input name="email" type="email" autocomplete="email" required></label>
          <label>Password<input name="password" type="password" minlength="8" maxlength="128" autocomplete="current-password" required></label>
          <button class="account-submit" type="submit">Sign in</button>
        </form>`}
      <div class="account-message"></div>
      <p class="account-note">Passwords are handled by Better Auth on the Cloudflare Worker. Folkhold never needs to put plaintext passwords in its own profile tables.</p>`;
    wireSignedOut();
  }

  function renderNeedsSetup() {
    body.innerHTML = `
      <span class="eyebrow">ACCOUNT BUILD</span>
      <h1>The doors are fitted. The lock needs its database.</h1>
      <p><span class="account-status waiting">Backend staged</span></p>
      <p>Email, Google, and Apple account support is now built into the Worker, but account creation stays disabled until the Cloudflare D1 database and authentication secret are connected.</p>
      <p class="account-note">Global Chat remains live while this setup is incomplete.</p>`;
  }

  function renderUsernameSetup() {
    const suggested = (sessionData?.user?.name || "").replace(/[^A-Za-z0-9_]/g, "").slice(0, 24);
    body.innerHTML = `
      <span class="eyebrow">ONE LAST THING</span>
      <h1>Choose your Folkhold name</h1>
      <p>Your login proves the account belongs to you. Your Folkhold username is the name people use to find you here.</p>
      <form class="account-form" data-profile>
        <label>Username<input name="username" maxlength="24" pattern="[A-Za-z0-9_]{3,24}" value="${escapeHtml(suggested)}" required></label>
        <label>Display name<input name="displayName" maxlength="60" value="${escapeHtml(sessionData?.user?.name || "")}" required></label>
        <button class="account-submit" type="submit">Create my Hold</button>
      </form>
      <div class="account-message"></div>`;
    dialog.querySelector("[data-profile]").addEventListener("submit", saveProfile);
  }

  function renderAccount() {
    const name = profileData?.display_name || sessionData?.user?.name || profileData?.username || "Member";
    const username = profileData?.username || "username pending";
    body.innerHTML = `
      <span class="eyebrow">YOUR ACCOUNT</span>
      <h1>You're inside.</h1>
      <div class="account-user">
        <div class="account-user-badge"><b>${escapeHtml(name.charAt(0).toUpperCase())}</b><div><strong>${escapeHtml(name)}</strong><small>@${escapeHtml(username)} · ${escapeHtml(sessionData?.user?.email || "")}</small></div></div>
        <p><span class="account-status">Signed in</span></p>
        <div class="account-actions"><button type="button" data-account-hold>Enter My Hold</button><button type="button" data-signout>Sign out</button></div>
      </div>
      <div class="account-message"></div>`;
    dialog.querySelector("[data-account-hold]").addEventListener("click", () => {
      dialog.close();
      document.querySelector('[data-view="hold"]')?.click();
    });
    dialog.querySelector("[data-signout]").addEventListener("click", signOut);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[character]);
  }

  function socialSignIn(provider) {
    // Open synchronously from the button click so Safari/Firefox don't block it.
    authNonce = crypto.randomUUID();
    const url = cloudOrigin + "/auth/popup?provider=" + encodeURIComponent(provider)
      + "&nonce=" + encodeURIComponent(authNonce);
    authPopup = window.open(url, "folkhold-sign-in",
      "width=520,height=690,resizable=yes,scrollbars=yes");
    if (!authPopup) {
      authNonce = null;
      setMessage("Please allow the sign-in popup for Folkhold and try again.");
      return;
    }
    authPopup.focus();
    setMessage("Complete " + provider + " sign-in in the separate window. Folkhold stays open.", true);
  }

  async function emailSignUp(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = form.querySelector("button[type=submit]");
    const values = Object.fromEntries(new FormData(form));
    submit.disabled = true;
    setMessage("Creating your account…", true);
    try {
      await api("/api/auth/sign-up/email", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          name: values.displayName,
          callbackURL: `${location.origin}/`,
        }),
      });
      if (!currentToken()) throw new Error("The account was created but no login session was returned. Please sign in.");
      await api("/api/folkhold/profile", {
        method: "POST",
        body: JSON.stringify({ username: values.username, displayName: values.displayName }),
      });
      await loadSession();
      renderAccount();
      setMessage("Account created. Welcome to Folkhold.", true);
    } catch (error) {
      setMessage(error.message || "Account creation failed.");
    } finally {
      submit.disabled = false;
    }
  }

  async function emailSignIn(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = form.querySelector("button[type=submit]");
    const values = Object.fromEntries(new FormData(form));
    submit.disabled = true;
    setMessage("Signing in…", true);
    try {
      await api("/api/auth/sign-in/email", {
        method: "POST",
        body: JSON.stringify({ email: values.email, password: values.password, rememberMe: true }),
      });
      if (!currentToken()) throw new Error("No login session was returned. Please retry.");
      await loadSession();
      if (profileData) renderAccount(); else renderUsernameSetup();
    } catch (error) {
      setMessage(error.message || "Sign-in failed.");
    } finally {
      submit.disabled = false;
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = form.querySelector("button[type=submit]");
    const values = Object.fromEntries(new FormData(form));
    submit.disabled = true;
    setMessage("Building your Hold…", true);
    try {
      const result = await api("/api/folkhold/profile", {
        method: "POST",
        body: JSON.stringify({ username: values.username, displayName: values.displayName }),
      });
      profileData = result.profile;
      localStorage.setItem("folkhold.globalChatName", profileData.display_name || profileData.username);
      avatar.textContent = (profileData.display_name || profileData.username).charAt(0).toUpperCase();
      renderAccount();
      setMessage("Your Folkhold identity is ready.", true);
    } catch (error) {
      setMessage(error.message || "Could not save that username.");
    } finally {
      submit.disabled = false;
    }
  }

  async function signOut() {
    setMessage("Signing out…", true);
    try {
      await api("/api/auth/sign-out", { method: "POST", body: JSON.stringify({}) });
    } catch {
      // Refresh state even if the provider returned no body.
    }
    sessionStorage.removeItem(tokenKey);
    sessionData = null;
    profileData = null;
    localStorage.removeItem("folkhold.globalChatName");
    avatar.textContent = "👤";
    avatar.title = "Account";
    mode = "signin";
    renderSignedOut();
    setMessage("Signed out.", true);
  }

  function wireSignedOut() {
    dialog.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        mode = button.dataset.mode;
        renderSignedOut();
      });
    });
    dialog.querySelectorAll("[data-social]").forEach((button) => {
      button.addEventListener("click", () => socialSignIn(button.dataset.social));
    });
    dialog.querySelector("[data-signup]")?.addEventListener("submit", emailSignUp);
    dialog.querySelector("[data-signin]")?.addEventListener("submit", emailSignIn);
  }

  async function openAccount() {
    if (!dialog.open) dialog.showModal();
    body.innerHTML = '<span class="eyebrow">FOLKHOLD ACCOUNT</span><h1>Checking the door…</h1>';

    await loadStatus();
    if (!status?.ready) {
      renderNeedsSetup();
      return;
    }
    await loadSession();
    if (!sessionData?.user) renderSignedOut();
    else if (!profileData) renderUsernameSetup();
    else renderAccount();
  }

  avatar.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openAccount();
  }, true);

  loadStatus().then(async () => {
    if (!status?.ready || !currentToken()) return;
    await loadSession();
  });

  window.FolkholdAccount = Object.freeze({
    open: openAccount,
    currentUser: () => profileData ? { ...profileData } : null,
    signedIn: () => Boolean(sessionData?.user),
  });
})();
