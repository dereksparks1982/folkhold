import { DurableObject } from "cloudflare:workers";

const DEFAULT_ORIGIN = "https://dereksparks1982.github.io";
const DEFAULT_PUBLIC_SITE = "https://dereksparks1982.github.io/folkhold";
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

function requestOrigin(request) {
  return new URL(request.url).origin;
}

function allowedOrigins(request, env) {
  const configured = String(env.ALLOWED_ORIGINS || DEFAULT_ORIGIN)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set([
    ...configured,
    requestOrigin(request),
    "http://localhost:8787",
    "http://127.0.0.1:8787",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
  ]);
}

function originAllowed(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  return allowedOrigins(request, env).has(origin);
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin");
  const allowed = origin && allowedOrigins(request, env).has(origin)
    ? origin
    : requestOrigin(request);
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
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

async function proxyFrontend(request, env) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Folkhold", { status: 404 });
  }

  const incoming = new URL(request.url);
  const base = new URL(`${String(env.PUBLIC_SITE_ORIGIN || DEFAULT_PUBLIC_SITE).replace(/\/$/, "")}/`);
  // Browser tabs viewing JSON endpoints request /favicon.ico without the
  // main application's icon link. Serve the existing approved house/key image.
  const relativePath = incoming.pathname === "/favicon.ico"
    ? "assets/folkhold-app-icon-192.png"
    : incoming.pathname.replace(/^\//, "");
  const target = new URL(relativePath || "./", base);
  target.search = incoming.search;

  const upstream = new Request(target, request);
  const response = await fetch(upstream);
  const headers = new Headers(response.headers);
  headers.set("X-Folkhold-Frontend", "github-pages-proxy");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function handleSquareForum(room,request,url){
  const sql=room.sql,path=url.pathname;
  const valid=["general","workshop","games","journeys","questions"];
  const answer=(data,status=200)=>json(data,{status});
  if(request.method==="GET"){
    if(path==="/api/forum/categories"){
      const counts=sql.exec("SELECT category,COUNT(*) AS topics FROM forum_topics GROUP BY category").toArray();
      return answer({categories:valid.map(id=>({id,topics:Number(counts.find(r=>r.category===id)?.topics||0)}))});
    }
    if(path==="/api/forum/topics"){
      const category=url.searchParams.get("category");
      if(!valid.includes(category))return answer({error:"Unknown category."},400);
      return answer({topics:sql.exec("SELECT id,category,title,author,reply_count,created_at,last_at FROM forum_topics WHERE category=? ORDER BY last_at DESC,id DESC LIMIT 50",category).toArray()});
    }
    if(path==="/api/forum/topic"){
      const id=Number(url.searchParams.get("id"));
      if(!Number.isSafeInteger(id)||id<1)return answer({error:"Invalid topic."},400);
      const topic=sql.exec("SELECT * FROM forum_topics WHERE id=?",id).toArray()[0];
      if(!topic)return answer({error:"Topic not found."},404);
      const replies=sql.exec("SELECT id,author,body,created_at FROM forum_replies WHERE topic_id=? ORDER BY id DESC LIMIT 100",id).toArray().reverse();
      return answer({topic,replies,moreReplies:topic.reply_count>replies.length});
    }
  }
  if(request.method!=="POST"||!["/api/forum/topics","/api/forum/topic"].includes(path))
    return answer({error:"Not found."},404);
  if(Number(request.headers.get("content-length")||0)>7200)return answer({error:"Post too long."},413);
  const raw=await request.text();
  if(raw.length>7200)return answer({error:"Post too long."},413);
  let data;try{data=JSON.parse(raw)}catch{return answer({error:"Invalid JSON."},400)}
  const body=String(data.body||"").replace(/\r\n?/g,"\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,"").trim();
  if(!body||body.length>5000)return answer({error:"Post must be between 1 and 5,000 characters."},400);
  const name=cleanText(request.headers.get("X-Folkhold-Name")||data.name,32)||"Guest";
  const userId=cleanText(request.headers.get("X-Folkhold-User"),128)||null;
  const now=Date.now();
  let id;
  if(path==="/api/forum/topics"){
    if(!valid.includes(data.category))return answer({error:"Choose a discussion category."},400);
    const title=cleanText(data.title,120);
    if(title.length<4)return answer({error:"Title needs at least four characters."},400);
  }else{
    id=Number(url.searchParams.get("id"));
    if(!Number.isSafeInteger(id)||id<1)return answer({error:"Invalid topic."},400);
    if(!sql.exec("SELECT id FROM forum_topics WHERE id=?",id).toArray().length)return answer({error:"Topic not found."},404);
  }
  const key=userId?`member:${userId}`:`ip:${request.headers.get("CF-Connecting-IP")||"unknown"}`;
  room.forumThrottle||=new Map();
  const period=path==="/api/forum/topics"?10000:3000;
  if(now-(room.forumThrottle.get(key)||0)<period)return answer({error:"Wait a moment before posting again."},429);
  if(room.forumThrottle.size>2000)room.forumThrottle.clear();
  room.forumThrottle.set(key,now);
  if(path==="/api/forum/topics"){
    const title=cleanText(data.title,120);
    const topic=sql.exec("INSERT INTO forum_topics(category,title,author,author_user_id,body,created_at,last_at,reply_count) VALUES(?,?,?,?,?,?,?,0) RETURNING id",data.category,title,name,userId,body,now,now).one();
    return answer({topic:{id:topic.id}},201);
  }
  sql.exec("INSERT INTO forum_replies(topic_id,author,author_user_id,body,created_at) VALUES(?,?,?,?,?)",id,name,userId,body,now);
  sql.exec("UPDATE forum_topics SET reply_count=reply_count+1,last_at=? WHERE id=?",now,id);
  return answer({ok:true},201);
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


    // Forum persistence uses the already-bound SQLite Durable Object; live chat is unchanged.
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS forum_topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT NOT NULL,
        title TEXT NOT NULL, author TEXT NOT NULL, author_user_id TEXT,
        body TEXT NOT NULL, created_at INTEGER NOT NULL, last_at INTEGER NOT NULL,
        reply_count INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS forum_topics_category_last ON forum_topics(category,last_at DESC);
      CREATE TABLE IF NOT EXISTS forum_replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT, topic_id INTEGER NOT NULL,
        author TEXT NOT NULL, author_user_id TEXT, body TEXT NOT NULL, created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS forum_replies_topic ON forum_replies(topic_id,id);
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

    if (url.pathname.startsWith("/api/forum/")) return handleSquareForum(this, request, url);

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
    const authenticatedName = cleanText(request.headers.get("X-Folkhold-Name"), MAX_NAME_LENGTH);
    const authenticatedUser = cleanText(request.headers.get("X-Folkhold-User"), 128);

    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({
      lastMessageAt: 0,
      authenticatedName: authenticatedName || null,
      authenticatedUser: authenticatedUser || null,
    });

    server.send(
      JSON.stringify({
        type: "welcome",
        room: "global",
        online: this.ctx.getWebSockets().length,
        authenticated: Boolean(authenticatedUser),
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

    const attachment = ws.deserializeAttachment() || { lastMessageAt: 0 };
    const sender = attachment.authenticatedName
      || cleanText(payload.name, MAX_NAME_LENGTH)
      || "Guest";
    const body = cleanText(payload.text, MAX_MESSAGE_LENGTH);
    if (!body) return;

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
        json({
          ok: true,
          service: "folkhold",
          realtime: "durable-objects",
        }),
        request,
        env,
      );
    }

    // Account services have been withdrawn.
    if (url.pathname.startsWith("/api/auth/") ||
        url.pathname.startsWith("/api/account/") ||
        url.pathname === "/api/folkhold/profile") {
      return new Response("Not found", { status: 404 });
    }

    if (url.pathname.startsWith("/api/forum/")) {
      if (!originAllowed(request, env))
        return withCors(json({error:"Origin not allowed."},{status:403}),request,env);
      // Never accept client-provided identity claims. Forum remains guest-only.
      const headers = new Headers(request.headers);
      headers.delete("X-Folkhold-Name");
      headers.delete("X-Folkhold-User");
      const forwarded = new Request(request, { headers });
      return withCors(await env.GLOBAL_CHAT.getByName("global").fetch(forwarded),request,env);
    }

    if (url.pathname.startsWith("/api/global/")) {
      if (!originAllowed(request, env)) {
        return new Response("Origin not allowed", { status: 403 });
      }

      const headers = new Headers(request.headers);
      headers.delete("X-Folkhold-Name");
      headers.delete("X-Folkhold-User");
      const chatRequest = new Request(request, { headers });
      const room = env.GLOBAL_CHAT.getByName("global");
      if (url.pathname.endsWith("/ws")) {
        return room.fetch(chatRequest);
      }

      const response = await room.fetch(chatRequest);
      return withCors(response, request, env);
    }

    return proxyFrontend(request, env);
  },
};
