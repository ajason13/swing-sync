# SS-025 Claude QA-Planning Handoff — Superseded

Do not paste this prompt. Use
[`ss-025-claude-qa-rereview-prompt.md`](./ss-025-claude-qa-rereview-prompt.md),
which contains the QA findings and applied fixes.

Paste this complete prompt into a fresh Claude Chat. Claude has no filesystem,
Notion, or GitHub access.

```text
Role and stage: Independent adversarial QA planner for Swing Sync. This is
pre-implementation gate review, not final implementation sign-off.

Task: SS-025 Restore usable Vite development styling under CSP. Task type:
Bug; risk: CSP/security boundary plus accessibility. Branch:
ss-025-vite-dev-csp-styling. No PR or candidate exists. Return one verdict:
PASS, PASS WITH MINOR FIXES, or FAIL; numbered blockers; non-blocking/future
notes; missing evidence; and next gate. Stay under 1,800 bytes.

Known reproduction: Node 22 `npm run dev -- --host 127.0.0.1`; Chromium blocks
Vite's injected inline CSS because index.html has `style-src 'self'`. Desktop
and 320px show browser defaults, including a visible `.visually-hidden` live
announcer. The existing production CSP meta is:
`default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'self' blob:; worker-src 'self' blob:; img-src 'self' blob: data:; media-src 'self' blob:; style-src 'self'; object-src 'none'; base-uri 'self'`.

Proposed smallest correction: Vite config registers a `serve`-only
`transformIndexHtml` plugin. It finds exactly one CSP meta and replaces exactly
one `style-src 'self'` with `style-src 'self' 'unsafe-inline'`; it is idempotent
and throws for missing, duplicate, or incompatible CSP markup. `build` registers
no transform. No host, proxy, allowed-host, filesystem, output, dependency,
runtime, CSP network directive, or outbound destination changes are proposed.

Planned automated evidence under Node 22:
1. Unit tests prove transform idempotence; missing/duplicate/incompatible CSP
fails closed; serve has one plugin and build has none; source production CSP
excludes unsafe-inline and retains connect/worker/img/media directives.
2. Dedicated Vite dev-server Chromium test starts
`npm run dev -- --host 127.0.0.1 --port 4173`, captures console errors,
securitypolicyviolation events, and requests before navigation; at 1280 and
exactly 320 CSS pixels it asserts no inline-style CSP violation or external
origin, no horizontal overflow, expected desktop/tiny layout, and computed
clipping for `#app-announcer` and `#video-file`.
3. `npm run build` must retain the production CSP above; run
`npm run compliance:verify`. Do not select, capture, upload, or analyze media.

Protected boundaries: raw video stays local by default; no media action at all
in this Task; no sharing, provider/SDK, telemetry, persistence, model, or
public-claim changes; no guarantees about privacy, safety, accessibility, or
compliance. Runtime observability is intentionally unchanged; test-only console
and request capture is regression evidence.

Attack this plan for fail-open CSP behavior, Vite mode mistakes, production
regressions, false-positive style/hidden/layout evidence, network expansion,
and missing tests. If PASS, state exactly what the builder may implement and
what final Claude audit must still verify. Do not treat this as release approval.
```
