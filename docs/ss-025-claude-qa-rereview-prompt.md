# SS-025 Claude QA Focused Re-review

Paste this complete prompt into the same Claude chat that issued the SS-025
QA-planning verdict. Claude has no filesystem, Notion, or GitHub access.

```text
Role and stage: Independent adversarial QA focused re-review for Swing Sync
SS-025. This is not final implementation/release approval. Return under 1,800
bytes: candidate/working-tree identity; PASS, PASS WITH MINOR FIXES, or FAIL;
unresolved numbered blockers; non-blocking/future notes; missing evidence; and
next gate.

Prior verdict: PASS WITH MINOR FIXES. Task: restore usable Node 22 Vite dev
styling without weakening production CSP. Branch is
ss-025-vite-dev-csp-styling; no PR/candidate. Protected scope: no media action,
remote sharing, provider, dependency, telemetry, persistence, model, host,
proxy, filesystem, network-destination, or public-claim change. Runtime
observability remains unchanged.

Applied fixes to B1-B5:
B1: unit test extracts the actual transformed CSP and requires exact equality
with the canonical production CSP after only
`style-src 'self'` -> `style-src 'self' 'unsafe-inline'`; this covers every
directive including script-src, object-src, and base-uri.
B2: unit integration starts a real Vite dev server against missing and duplicate
CSP index fixtures, fetches `/`, and requires HTTP 500 plus CSP error text.
B3: isolated Chromium `vite preview` test builds first and requires the served
meta CSP equal the canonical production CSP and omit unsafe-inline.
B4: dedicated red/green Chromium test starts an unconfigured strict-CSP Vite
server, proves `.visually-hidden` no longer computes `position:absolute`, and
observes the CSP console error; the configured dev-server test proves the same
checks pass at 1280 and exact 320 CSS pixels.
B5: configured dev smoke requires `#app-announcer` role=status, no
aria-hidden=true, computed display not none, and a Chromium accessibility-tree
status node while it remains 1px/clipped. It also checks #video-file clipping.

The Vite plugin is explicitly `apply:'serve'`, registers only when Vite command
is `serve`, is idempotent, and throws for absent/duplicate/incompatible CSP.
Production build has no transform. New focused evidence on `.nvmrc` Node 22:
`npm run test:unit -- test/unit/vite-config.test.ts` = 5/5 PASS;
`npm run test:smoke:dev` = 2/2 PASS;
`npm run test:smoke:csp-preview` = 1/1 PASS;
`npm run build`, `npm run compliance:verify`, and `git diff --check` PASS.
No media is selected, captured, uploaded, or analyzed by these checks.

Re-review only B1-B5 plus regressions from their fixes. If PASS, state whether
the builder may advance to `3. In Development (ChatGPT)`; a separate Claude
final audit still remains mandatory before PR preparation.
```
