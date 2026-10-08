import { DurableObject } from "cloudflare:workers";
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { getMigrations } from "better-auth/db/migration";

const DEFAULT_ORIGIN = "https://dereksparks1982.github.io";
const DEFAULT_PUBLIC_SITE = "https://dereksparks1982.github.io/folkhold";
const MAX_MESSAGE_LENGTH = 280;
const MAX_NAME_LENGTH = 32;
const HISTORY_LIMIT = 50;
const RETAIN_MESSAGES = 500;
const MIN_MESSAGE_INTERVAL_MS = 900;

let authMigrationPromise = null;
let folkholdSchemaPromise = null;

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
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Expose-Headers": "set-auth-token",
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

function authConfigured(env) {
  return Boolean(env.AUTH_DB && env.BETTER_AUTH_SECRET);
}

function configuredProviders(env) {
  return {
    email: authConfigured(env),
    google: authConfigured(env) && Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
    apple: authConfigured(env) && Boolean(env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET),
  };
}

function createAuth(request, env) {
  const origin = requestOrigin(request);
  const socialProviders = {};

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    socialProviders.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    };
  }

  if (env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET) {
    socialProviders.apple = {
      clientId: env.APPLE_CLIENT_ID,
      clientSecret: env.APPLE_CLIENT_SECRET,
    };
  }

  return betterAuth({
    database: env.AUTH_DB,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: origin,
    trustedOrigins: [
      origin,
      DEFAULT_ORIGIN,
      "https://dereksparks1982.github.io",
      "https://appleid.apple.com",
    ],
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    socialProviders,
    plugins: [bearer()],
  });
}

async function ensureFolkholdSchema(db) {
  if (!folkholdSchemaPromise) {
    folkholdSchemaPromise = db.batch([
      db.prepare(`
        CREATE TABLE IF NOT EXISTS folkhold_profile (
          user_id TEXT PRIMARY KEY,
          username TEXT NOT NULL UNIQUE COLLATE NOCASE,
          display_name TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `),
      db.prepare(`
        CREATE TABLE IF NOT EXISTS folkhold_hold (
          id TEXT PRIMARY KEY,
          owner_user_id TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `),
      db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_folkhold_profile_username
        ON folkhold_profile(username)
      `),
    ]).catch((error) => {
      folkholdSchemaPromise = null;
      throw error;
    });
  }
  await folkholdSchemaPromise;
}

async function ensureAuthReady(request, env) {
  if (!authConfigured(env)) return null;
  const auth = createAuth(request, env);

  if (!authMigrationPromise) {
    authMigrationPromise = (async () => {
      const migrations = await getMigrations(auth.options);
      await migrations.runMigrations();
    })().catch((error) => {
      authMigrationPromise = null;
      throw error;
    });
  }

  await authMigrationPromise;
  await ensureFolkholdSchema(env.AUTH_DB);
  return auth;
}

async function getSession(auth, request) {
  if (!auth) return null;
  try {
    return await auth.api.getSession({ headers: request.headers });
  } catch {
    return null;
  }
}

async function getProfile(db, userId) {
  if (!db || !userId) return null;
  return db.prepare(
    `SELECT user_id, username, display_name, created_at, updated_at
     FROM folkhold_profile
     WHERE user_id = ?`
  ).bind(userId).first();
}

async function accountStatus(request, env) {
  const providers = configuredProviders(env);
  return withCors(json({
    ready: authConfigured(env),
    providers,
    appOrigin: requestOrigin(request),
    publicSite: env.PUBLIC_SITE_ORIGIN || DEFAULT_PUBLIC_SITE,
    // Report each prerequisite independently so the status page cannot
    // incorrectly claim both are missing when only one is absent.
    needs: [
      ...(!env.AUTH_DB ? ["D1 binding AUTH_DB"] : []),
      ...(!env.BETTER_AUTH_SECRET ? ["BETTER_AUTH_SECRET"] : []),
    ],
  }), request, env);
}

async function profileRoute(request, env, auth) {
  const session = await getSession(auth, request);
  if (!session?.user?.id) {
    return withCors(json({ error: "Sign in required." }, { status: 401 }), request, env);
  }

  if (request.method === "GET") {
    const profile = await getProfile(env.AUTH_DB, session.user.id);
    return withCors(json({ profile, user: session.user }), request, env);
  }

  if (request.method !== "POST") {
    return withCors(json({ error: "Method not allowed." }, { status: 405 }), request, env);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return withCors(json({ error: "Invalid JSON." }, { status: 400 }), request, env);
  }

  const username = cleanText(body.username, 24);
  const displayName = cleanText(body.displayName || username, 60);
  if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) {
    return withCors(json({
      error: "Username must be 3-24 characters using letters, numbers, or underscore."
    }, { status: 400 }), request, env);
  }
  if (!displayName) {
    return withCors(json({ error: "Display name is required." }, { status: 400 }), request, env);
  }

  const now = Date.now();
  try {
    await env.AUTH_DB.prepare(`
      INSERT INTO folkhold_profile (user_id, username, display_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        username = excluded.username,
        display_name = excluded.display_name,
        updated_at = excluded.updated_at
    `).bind(session.user.id, username, displayName, now, now).run();

    await env.AUTH_DB.prepare(`
      INSERT INTO folkhold_hold (id, owner_user_id, name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(owner_user_id) DO UPDATE SET
        name = excluded.name,
        updated_at = excluded.updated_at
    `).bind(
      crypto.randomUUID(),
      session.user.id,
      `${displayName}'s Hold`,
      now,
      now,
    ).run();
  } catch (error) {
    if (String(error?.message || error).toLowerCase().includes("unique")) {
      return withCors(json({ error: "That Folkhold username is already taken." }, { status: 409 }), request, env);
    }
    throw error;
  }

  const profile = await getProfile(env.AUTH_DB, session.user.id);
  return withCors(json({ ok: true, profile }), request, env);
}

async function authenticatedChatRequest(request, env, auth) {
  if (!auth || !env.AUTH_DB) return request;
  const session = await getSession(auth, request);
  if (!session?.user?.id) return request;
  const profile = await getProfile(env.AUTH_DB, session.user.id);
  if (!profile) return request;

  const headers = new Headers(request.headers);
  headers.set("X-Folkhold-User", session.user.id);
  headers.set("X-Folkhold-Name", profile.display_name || profile.username);
  return new Request(request, { headers });
}

// Only the API, a minimal auth popup and an account-service landing page
// are served by Cloudflare; the complete Folkhold website stays on GitHub Pages.

function authPage(heading, message = "Please wait…") {
  const html = '<!doctype html><html lang="en"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width, initial-scale=1">'
    + '<title>Folkhold Accounts</title>'
    + '<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#241b16;color:#f1dfc2;font-family:Georgia,serif}'
    + 'main{margin:18px;padding:30px;border:2px solid #95734d;border-radius:14px;text-align:center;max-width:400px}'
    + 'p{line-height:1.5}a{color:#e8ca85}</style></head><body><main><h1>' + heading
    + '</h1><p id="status">' + message + '</p>'
    + '<p><a href="https://dereksparks1982.github.io/folkhold/" rel="noopener">Folkhold</a></p>'
    + '</main><script src="/auth/popup.js"></script></body></html>';
  return new Response(html, { headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff",
  } });
}

const popupJavascript = String.raw\`(() => {
  const pathname = location.pathname;
  const query = new URLSearchParams(location.search);
  const nonce = query.get("nonce") || "";
  const status = document.getElementById("status");
  function report(text) { status.textContent = text; }
  async function start() {
    const provider = query.get("provider");
    if (!["google", "apple"].includes(provider) || !/^[0-9a-f-]{36}$/.test(nonce)) {
      report("Invalid sign-in request. Close this window and retry from Folkhold.");
      return;
    }
    report("Connecting to " + provider + "…");
    const finish = location.origin + "/auth/popup/complete?nonce=" + encodeURIComponent(nonce);
    const failed = location.origin + "/auth/popup/error?nonce=" + encodeURIComponent(nonce);
    const response = await fetch("/api/auth/sign-in/social", {
      method: "POST", credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, callbackURL: finish,
        newUserCallbackURL: finish, errorCallbackURL: failed, disableRedirect: true })
    });
    if (!response.ok) throw Error("Could not start sign-in (" + response.status + ").");
    const data = await response.json();
    const destination = data.url || (data.data && data.data.url);
    const address = new URL(destination);
    if (address.protocol !== "https:" ||
        !["accounts.google.com", "appleid.apple.com"].includes(address.hostname)) {
      throw Error("The sign-in provider returned an unexpected location.");
    }
    location.replace(address.href);
  }
  async function complete() {
    if (!/^[0-9a-f-]{36}$/.test(nonce) || !window.opener) {
      report("Please begin sign-in from Folkhold's account button.");
      return;
    }
    const response = await fetch("/api/folkhold/popup-session", {
      credentials: "same-origin", cache: "no-store"
    });
    if (!response.ok) throw Error("No active login session. Please retry from Folkhold.");
    const data = await response.json();
    if (!data.token) throw Error("Login session unavailable.");
    window.opener.postMessage({type:"folkhold:auth-complete",nonce:nonce,token:data.token},
      "https://dereksparks1982.github.io");
    report("Signed in. Returning to Folkhold…");
    setTimeout(() => window.close(), 400);
  }
  if (pathname.endsWith("/error")) {
    report("The identity provider did not complete sign-in. Close this window and retry.");
  } else {
    (pathname.endsWith("/complete") ? complete() : start())
      .catch(error => report(error.message || "Sign-in failed. Please retry."));
  }
})();\`;

function popupScriptResponse() {
  return new Response(popupJavascript, { headers: {
    "Content-Type": "application/javascript; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  } });
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
          accounts: authConfigured(env) ? "ready" : "awaiting-d1",
        }),
        request,
        env,
      );
    }

    if (url.pathname === "/api/account/status") {
      return accountStatus(request, env);
    }

    if (url.pathname === "/auth/popup.js" && request.method === "GET") return popupScriptResponse();
    if (["/auth/popup", "/auth/popup/complete", "/auth/popup/error"].includes(url.pathname)
        && request.method === "GET") return authPage("Folkhold Sign-in");
    if (url.pathname === "/api/folkhold/popup-session" && request.method === "GET") {
      const site = request.headers.get("Sec-Fetch-Site");
      const origin = request.headers.get("Origin");
      // Never turn this one-time cookie-to-bearer bridge into a public CORS endpoint.
      if ((site && site !== "same-origin") || (origin && origin !== requestOrigin(request)))
        return json({error:"Same-origin popup only."},{status:403});
      let auth;
      try { auth = await ensureAuthReady(request, env); } catch { auth = null; }
      const session = auth && await getSession(auth, request);
      if (!session?.user?.id || !session?.session?.token)
        return json({error:"Sign-in required."},{status:401,headers:{"Cache-Control":"no-store"}});
      return json({token:session.session.token},{headers:{
        "Cache-Control":"no-store","Referrer-Policy":"no-referrer"
      }});
    }

    if (url.pathname.startsWith("/api/auth/") || url.pathname === "/api/folkhold/profile") {
      if (!originAllowed(request, env)) {
        return new Response("Origin not allowed", { status: 403 });
      }

      let auth;
      try {
        auth = await ensureAuthReady(request, env);
      } catch (error) {
        console.error("Folkhold auth initialization failed", error);
        return withCors(json({ error: "Account database initialization failed." }, { status: 503 }), request, env);
      }

      if (!auth) {
        return withCors(json({
          error: "Accounts are staged but not activated yet.",
          needs: ["D1 binding AUTH_DB", "BETTER_AUTH_SECRET"],
        }, { status: 503 }), request, env);
      }

      if (url.pathname === "/api/folkhold/profile") {
        return profileRoute(request, env, auth);
      }

      const response = await auth.handler(request);
      return withCors(response, request, env);
    }


    if (url.pathname.startsWith("/api/forum/")) {
      if (!originAllowed(request, env))
        return withCors(json({error:"Origin not allowed."},{status:403}),request,env);
      // Strip forged identity headers before trusting optional Better Auth sessions.
      const headers=new Headers(request.headers);
      headers.delete("X-Folkhold-Name");
      headers.delete("X-Folkhold-User");
      let forwarded=new Request(request,{headers});
      if (request.method==="POST" && authConfigured(env)) {
        try {
          const auth=await ensureAuthReady(request,env);
          forwarded=await authenticatedChatRequest(forwarded,env,auth);
        } catch(error) {
          console.warn("Forum identity temporarily unavailable; posting as guest.",error);
        }
      }
      return withCors(await env.GLOBAL_CHAT.getByName("global").fetch(forwarded),request,env);
    }

    if (url.pathname.startsWith("/api/global/")) {
      if (!originAllowed(request, env)) {
        return new Response("Origin not allowed", { status: 403 });
      }

      let chatRequest = request;
      if (authConfigured(env)) {
        try {
          const auth = await ensureAuthReady(request, env);
          chatRequest = await authenticatedChatRequest(request, env, auth);
        } catch (error) {
          console.warn("Global Chat account identity unavailable; continuing as guest.", error);
        }
      }

      const room = env.GLOBAL_CHAT.getByName("global");
      if (url.pathname.endsWith("/ws")) {
        return room.fetch(chatRequest);
      }

      const response = await room.fetch(chatRequest);
      return withCors(response, request, env);
    }

    if (url.pathname === "/" && request.method === "GET")
      return authPage("Folkhold Accounts", "Authentication service. The website remains on GitHub Pages.");
    return new Response("Not found", { status:404, headers:{"Cache-Control":"no-store"} });
  },
};
