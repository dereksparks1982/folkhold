# Native Square forum integration

**October 8, 2026. Status: source candidate, not yet an accepted live release.**

The owner rejected NodeBB installation, subscriptions and separate hosting. This is original Folkhold code using general NodeBB-inspired design: large clickable categories, titled topics and permanent replies integrated into the **existing Public Square**, not a separate page. Desktop has forum beside the unchanged live chat; iPhone has an internal Discussions / Live Chat switch.

GitHub Pages serves `square-forum.js`; existing Cloudflare Worker adds `GET /api/forum/categories`, `GET/POST /api/forum/topics` and `GET/POST /api/forum/topic?id=N`. To avoid blocked/unconfigured D1 and any new host, this first slice stores permanent topics/replies in new tables in Folkhold's **already-bound SQLite Durable Object**. This replaces the initial proposed D1 storage choice; an account/D1 migration is later work. Existing chat table and WebSocket logic remain unchanged.

Stable categories: General Conversation, The Workshop, Games & Pastimes, Journeys & Places, Questions & Help. Forum posts are plain text, length-checked on the server, and shown chronologically by most recent reply. Lists show 50 latest topics and newest 100 replies. A basic in-memory per-IP/member cooldown slows repeated posts; it resets with Durable Object restarts and is not production-grade anti-spam.

Unauthenticated names share the chat's browser nickname, which **is not verified identity**. If Better Auth is deployed and a member has a saved profile, the Worker can attach that verified identity to writes. Authentication is still not provisioned in the repository. No administrator powers have been exposed.

**Still outstanding:** Deploy the changed Cloudflare Worker, verify public GET/POST and unchanged WebSocket chat, check Firefox/iPhone layout and receive owner acceptance. Further slices: authenticated identities, moderation, edit/delete, abuse prevention, notification, search, topic/reply pagination, links to individual topics and export. Do not describe this as live based only on a GitHub Pages commit.
