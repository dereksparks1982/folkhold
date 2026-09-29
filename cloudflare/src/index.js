import { DurableObject } from "cloudflare:workers";

const DEFAULT_ORIGIN = "https://dereksparks1982.github.io";
const MAX_MESSAGE_LENGTH = 280;
const MAX_NAME_LENGTH = 32;
const HISTORY_LIMIT = 50;
const RETAIN_MESSAGES = 500;
const MIN_MESSAGE_INTERVAL_MS = 900;

function cleanText(value, maxLength) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function allowedOrigins(env) {
  const configured = String(env.ALLOWED_ORIGINS || DEFAULT_ORIGIN)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set([
    ...configured,
    "http://localhost:8787",
    "http://127.0.0.1:8787",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
  ]);
}

function originAllowed(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  return allowedOrigins(env).has(origin);
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin");
  const allowed = origin && allowedOrigins(env).has(origin) ? origin : DEFAULT_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { ...init, headers });
}

function withCors(response, request, env) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders(request, env))) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export class GlobalChat extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx = ctx;
    this.env = env;
    this.sql = ctx.storage.sql;

    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_messages_created_at
      ON messages(created_at DESC);
    `);

    this.ctx.setWebSocketAutoResponse(
      new WebSocketRequestResponsePair("ping", "pong"),
    );
  }

  history(limit = HISTORY_LIMIT) {
    const safeLimit = Math.max(1, Math.min(Number(limit) || HISTORY_LIMIT, 100));
    return this.sql
      .exec(
        `SELECT id, sender, body, created_at
         FROM messages
         ORDER BY id DESC
         LIMIT ?`,
        safeLimit,
      )
      .toArray()
      .reverse();
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.endsWith("/history")) {
      return json({
        room: "global",
        messages: this.history(url.searchParams.get("limit")),
      });
    }

    if (!url.pathname.endsWith("/ws")) {
      return new Response("Not found", { status: 404 });
    }

    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ lastMessageAt: 0 });

    server.send(
      JSON.stringify({
        type: "welcome",
        room: "global",
        online: this.ctx.getWebSockets().length,
      }),
    );
    this.broadcastPresence();

    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(ws, message) {
    let payload;
    try {
      payload = JSON.parse(typeof message === "string" ? message : new TextDecoder().decode(message));
    } catch {
      this.sendError(ws, "That message was not valid JSON.");
      return;
    }

    if (payload?.type !== "message") return;

    const sender = cleanText(payload.name, MAX_NAME_LENGTH) || "Guest";
    const body = cleanText(payload.text, MAX_MESSAGE_LENGTH);
    if (!body) return;

    const attachment = ws.deserializeAttachment() || { lastMessageAt: 0 };
    const now = Date.now();
    if (now - Number(attachment.lastMessageAt || 0) < MIN_MESSAGE_INTERVAL_MS) {
      this.sendError(ws, "Slow down a little before sending another message.");
      return;
    }
    attachment.lastMessageAt = now;
    ws.serializeAttachment(attachment);

    const cursor = this.sql.exec(
      "INSERT INTO messages (sender, body, created_at) VALUES (?, ?, ?) RETURNING id",
      sender,
      body,
      now,
    );
    const inserted = cursor.one();

    this.sql.exec(
      `DELETE FROM messages
       WHERE id NOT IN (
         SELECT id FROM messages ORDER BY id DESC LIMIT ?
       )`,
      RETAIN_MESSAGES,
    );

    this.broadcast({
      type: "message",
      id: inserted.id,
      sender,
      body,
      created_at: now,
    });
  }

  webSocketClose(ws, code, reason) {
    try {
      ws.close(code, reason);
    } catch {
      // The peer may already be gone.
    }
    this.broadcastPresence();
  }

  webSocketError() {
    this.broadcastPresence();
  }

  sendError(ws, message) {
    try {
      ws.send(JSON.stringify({ type: "error", message }));
    } catch {
      // Ignore a connection that vanished mid-send.
    }
  }

  broadcast(payload) {
    const wire = JSON.stringify(payload);
    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(wire);
      } catch {
        // A later lifecycle event will clean up dead sockets.
      }
    }
  }

  broadcastPresence() {
    this.broadcast({
      type: "presence",
      online: this.ctx.getWebSockets().length,
    });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      if (!originAllowed(request, env)) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    if (url.pathname === "/api/health") {
      return withCors(
        json({ ok: true, service: "folkhold-api", realtime: "durable-objects" }),
        request,
        env,
      );
    }

    if (!url.pathname.startsWith("/api/global/")) {
      return new Response("Folkhold API", { status: 404 });
    }

    if (!originAllowed(request, env)) {
      return new Response("Origin not allowed", { status: 403 });
    }

    const room = env.GLOBAL_CHAT.getByName("global");

    if (url.pathname.endsWith("/ws")) {
      return room.fetch(request);
    }

    const response = await room.fetch(request);
    return withCors(response, request, env);
  },
};
