(() => {
  const config = window.FOLKHOLD_CLOUDFLARE || {};
  const stream = document.getElementById("square-chat");
  const form = document.getElementById("square-form");
  const input = document.getElementById("square-message");
  if (!stream || !form || !input) return;

  let socket = null;
  let reconnectTimer = null;
  let reconnectAttempt = 0;
  let live = false;

  const chatPanel = stream.closest(".chat-panel");
  const status = document.createElement("div");
  status.className = "global-chat-status";
  status.innerHTML = '<span class="global-chat-dot"></span><strong>Global Chat</strong><span data-chat-state>Cloudflare backend not connected yet</span><span data-chat-online></span>';
  chatPanel?.prepend(status);

  const style = document.createElement("style");
  style.textContent = `
    .global-chat-status{display:flex;align-items:center;gap:8px;min-height:38px;padding:8px 14px;border-bottom:1px solid rgba(176,141,87,.25);background:#f7eddf;font:12px Arial,sans-serif;color:#6f6356}
    .global-chat-status strong{color:#342b24}.global-chat-dot{width:8px;height:8px;border-radius:50%;background:#9a8c7d;box-shadow:0 0 0 3px rgba(154,140,125,.12)}
    .global-chat-status.live .global-chat-dot{background:#3f7a55;box-shadow:0 0 0 3px rgba(63,122,85,.14)}
    .global-chat-status [data-chat-online]{margin-left:auto;color:#355e4a;font-weight:bold}
    .global-chat-system{padding:9px 12px;margin:8px 0;border-radius:9px;background:#f2e7d5;color:#695e52;font:12px Arial,sans-serif}
  `;
  document.head.append(style);

  const stateText = status.querySelector("[data-chat-state]");
  const onlineText = status.querySelector("[data-chat-online]");

  function getName() {
    let name = localStorage.getItem("folkhold.globalChatName");
    if (!name) {
      name = `Guest-${Math.floor(1000 + Math.random() * 9000)}`;
      localStorage.setItem("folkhold.globalChatName", name);
    }
    return name.slice(0, 32);
  }

  function setState(text, isLive = false) {
    stateText.textContent = text;
    status.classList.toggle("live", isLive);
  }

  function setOnline(count) {
    const number = Number(count);
    onlineText.textContent = Number.isFinite(number) ? `${number} online` : "";
  }

  function timeLabel(timestamp) {
    return new Date(Number(timestamp) || Date.now()).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function appendMessage(message) {
    const row = document.createElement("div");
    row.className = "chat-message";

    const time = document.createElement("span");
    time.className = "chat-time";
    time.textContent = timeLabel(message.created_at);

    const name = document.createElement("button");
    name.className = "chat-name";
    name.type = "button";
    name.textContent = message.sender || "Guest";

    const body = document.createElement("p");
    body.textContent = message.body || "";

    row.append(time, name, body);
    stream.append(row);
    stream.scrollTop = stream.scrollHeight;
  }

  function systemMessage(text) {
    const row = document.createElement("div");
    row.className = "global-chat-system";
    row.textContent = text;
    stream.append(row);
    stream.scrollTop = stream.scrollHeight;
  }

  async function loadHistory(base) {
    const response = await fetch(`${base}/api/global/history?limit=50`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`History returned ${response.status}`);
    const data = await response.json();
    stream.replaceChildren();
    for (const message of data.messages || []) appendMessage(message);
  }

  function websocketUrl(base) {
    const url = new URL(base);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/api/global/ws";
    url.search = "";
    url.hash = "";
    return url.toString();
  }

  function scheduleReconnect(base) {
    clearTimeout(reconnectTimer);
    const delay = Math.min(15000, 1000 * Math.max(1, 2 ** reconnectAttempt));
    reconnectAttempt += 1;
    reconnectTimer = setTimeout(() => connect(base), delay);
  }

  function connect(base) {
    clearTimeout(reconnectTimer);
    setState("Connecting to Cloudflare…");

    try {
      socket = new WebSocket(websocketUrl(base));
    } catch (error) {
      console.warn("Global Chat WebSocket could not be created.", error);
      setState("Cloudflare connection failed");
      scheduleReconnect(base);
      return;
    }

    socket.addEventListener("open", () => {
      live = true;
      reconnectAttempt = 0;
      setState("Live through Cloudflare", true);
    });

    socket.addEventListener("message", (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (data.type === "welcome" || data.type === "presence") {
        setOnline(data.online);
        return;
      }
      if (data.type === "message") {
        appendMessage(data);
        return;
      }
      if (data.type === "error" && data.message) {
        systemMessage(data.message);
      }
    });

    socket.addEventListener("close", () => {
      live = false;
      setOnline(null);
      setState("Reconnecting…");
      scheduleReconnect(base);
    });

    socket.addEventListener("error", () => {
      setState("Connection problem");
    });
  }

  function send(text) {
    if (!live || !socket || socket.readyState !== WebSocket.OPEN) return false;
    socket.send(JSON.stringify({
      type: "message",
      name: getName(),
      text: String(text || "").slice(0, 280),
    }));
    return true;
  }

  form.addEventListener("submit", (event) => {
    if (!live) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const text = input.value.trim();
    if (!text) return;
    if (send(text)) input.value = "";
  }, true);

  const base = String(config.apiBase || "").replace(/\/$/, "");
  if (!base) {
    setState("Prototype mode. Cloudflare Worker URL still needs to be added.");
    window.FolkholdGlobalChat = Object.freeze({ send, connected: () => live });
    return;
  }

  loadHistory(base)
    .then(() => connect(base))
    .catch((error) => {
      console.warn("Global Chat history could not load.", error);
      systemMessage("Cloudflare history is temporarily unavailable. Trying live chat anyway.");
      connect(base);
    });

  window.FolkholdGlobalChat = Object.freeze({ send, connected: () => live });
})();
