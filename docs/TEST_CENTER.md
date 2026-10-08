# Folkhold Test Center (candidate)

This is the first diagnostic slice: a **read-only** Node.js checker running inside GitHub Actions. The runner saves Markdown, JSON and plain-text reports even when a test fails.

## Run and inspect

1. Open **GitHub → Folkhold → Actions → Folkhold Test Center**.
2. The runner starts on every change pushed to the sole main branch. It can also be triggered with **Run workflow**.
3. Open the run and download **folkhold-test-center-report** under Artifacts. Inside are report.md, report.json and report.log.
4. Local source-only option: node scripts/test-center.mjs --offline (from repository root).

## Coverage

- Consistency of root and nested Wrangler configuration and D1 / Durable Object bindings.
- Source declarations for Better Auth email/password, Google and Apple.
- Live Worker health and **runtime** account readiness.
- Read-only GET tests for Square forum categories/topics, GitHub Pages, Worker frontend proxy and approved favicon.
- Cloudflare Workers Build check linked to the GitHub commit.
- PASS / FAIL / SKIP, so an untested feature is not called healthy.

## Current issue

The owner has entered and verified BETTER_AUTH_SECRET in the Cloudflare dashboard. The live account endpoint last reported ready:false and needs:["BETTER_AUTH_SECRET"], while AUTH_DB was recognized. The successful Cloudflare build log lists BETTER_AUTH_SECRET as a **build variable**, but this does not verify runtime presence. The Test Center reports only the runtime status and never requests or stores the secret value.

## Guardrails and next slices

These checks use GET only; they do **not** register accounts, attempt real OAuth sign-in, create forum posts, mutate D1, or inspect private configuration. No extra diagnostic hosting is required. Later slices can add isolated Worker/D1 tests with Cloudflare's maintained Vitest plugin and browser checks with Playwright, then an owner-only panel once real administrator authentication exists.

A GitHub Pages or Cloudflare build success is different from verified runtime behavior. Owner acceptance of this candidate and a first successful Actions artifact review remain outstanding.
