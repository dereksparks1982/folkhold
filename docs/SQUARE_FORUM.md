# Village Square Forum: NodeBB reference and integration choices

**Status:** concept/technical comparison approved for roadmap documentation, **not an installed forum** (October 8, 2026). Product owner prefers NodeBB's modern, category-first visual design and its close association with live chat. Final architecture and visual mockup are not approved.

## Experience to preserve

Folkhold already has real-time **Square / Global Chat** powered by Cloudflare Durable Objects. Keep it working and visible inside the Square. The forum becomes a separate durable discussion mode within that **same** destination, not a replacement for live chat.

Desired layout:
- Spacious, entire-card clickable categories, not dense rows of tiny text links.
- Enter a category to browse titled topics, original posters, reply counts, recent replies, and straightforward topic composition/replies.
- Desktop: category/forum content in the main area with live chat nearby, subject to owner layout review. iPhone: a Forum / Live Chat tab or equally simple within-Square switch, avoiding another permanent footer button.
- Match the existing Folkhold materials, room identity and approved artwork, and maintain readable touch targets.
- One Folkhold account and clear server-side permission rules for both modes. Prefer chronological social conversation, consistent with the Square's existing design; do not add engagement-ranked feed mechanics by default.

## Option A: Real NodeBB, independently hosted and integrated

Official upstream: https://github.com/NodeBB/NodeBB ; https://docs.nodebb.org/

NodeBB is downloadable open-source forum server software. Upstream uses Node.js and a configured server/database (official setup documents Redis/MongoDB choices and other possible data-store options); it is **not** a static GitHub Pages dependency. It brings its own administration, categories, threads, real-time features and plugin interfaces. Possible path: standalone service on a controlled host, proxied or linked into a unified Folkhold route; authenticate users through a securely designed SSO adapter or verified account linking rather than introducing surprise duplicate accounts; theme the forum to preserve Folkhold's interface; retain Folkhold's existing chat as a distinct existing service until a migration is explicitly approved.

**License gate:** NodeBB's official project lists **GNU GPL-3.0**. Folkhold is proprietary source-available. Before embedding, modifying or redistributing NodeBB source inside Folkhold, review licensing obligations and any available alternate commercial license with the right holder. **Do not import NodeBB code into the Folkhold repository** merely to imitate its UI. This is a technical licensing flag, not legal clearance.

**Operations gate:** hosting/costs, TLS/reverse proxy, account/session boundaries, rate limits, upgrades/security response, data backup/export, moderator/admin controls, and the potential need for another database are unprovisioned. Do not present NodeBB as running just because its files can be downloaded.

## Option B: Native Folkhold forum with NodeBB-inspired presentation

Build original code in the existing Folkhold Square, borrowing general interaction concepts such as large category cards, thread detail, and good mobile navigation without copying third-party source or theme assets. Use authenticated Cloudflare Worker routes and durable tables for category, topic, post, edits, member ID and moderation/permission state. Existing live-chat service remains intact. This avoids NodeBB runtime operations and code-license integration, but puts the burden of building a secure, accessible, full forum on Folkhold.

## Review and build order

1. Compare actual integration complexity, cost, license, login, API support, hosting burden and forum data export for Options A and B; owner selects the architecture.
2. Owner reviews one Square layout proposal: forums and existing chat present together.
3. Define persistence, user identity, URL/deep-link routing, moderator powers, post editing/deletion, anti-spam/rate limits and notification hooks.
4. Build a small **fully functional** category/topic/reply slice with test accounts; check the unchanged realtime chat alongside it.
5. Verify on Firefox desktop and iPhone, update accessibility and mobile performance, and obtain owner acceptance.

**Out of scope today:** downloading or installing NodeBB, deploying an extra server, changing Cloudflare Global Chat, adding a new top-level page/button, modifying the legal license, or storing forum posts in localStorage as if they were durable production data.

**Source references:** NodeBB upstream repository and https://docs.nodebb.org/ (platform/runtime and GPL-3.0 terms should be rechecked for the exact version before any installation).
