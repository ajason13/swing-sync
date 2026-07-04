# SS-017 Research And Disposition

Date: 2026-07-03

Task: SS-017 Document production deployment, backend boundary, and
security-header posture.

## Classification

SS-017 is privacy-, security-, deployment-, docs-claim-, compliance-, and
user-facing-copy-sensitive.

This is a documentation and verification story. It must not add a backend,
auth, accounts, secrets, telemetry, analytics, remote logging, cloud storage,
provider SDKs, model providers, or remote sharing.

## Source Checks

- Swing Sync task page, checked 2026-07-03:
  https://app.notion.com/p/392834a0c8a68182a201f7b30fa45954
- Dedicated test case created 2026-07-03:
  https://app.notion.com/p/392834a0c8a68199983fc7bc1720ef2f
- Current CSP source: `index.html`.
- Current local-first and no-default-upload boundary:
  `docs/privacy-architecture.md`.
- Current safety and prohibited-claim boundary: `docs/safety-terms.md`.
- Current public docs claim verifier: `scripts/verify-docs-claims.js`.
- MDN `Content-Security-Policy` reference, checked 2026-07-03:
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy
- W3C CSP Level 2 policy delivery and HTML meta-element limitations, checked
  2026-07-03:
  https://www.w3.org/TR/CSP2/#delivery-html-meta-element
- MDN `Strict-Transport-Security`, checked 2026-07-03:
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security
- MDN `X-Content-Type-Options`, checked 2026-07-03:
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options
- MDN `Referrer-Policy`, checked 2026-07-03:
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy
- MDN `Permissions-Policy`, checked 2026-07-03:
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy

## Current Repository Facts

- The app is built by Vite and currently has no application backend, server
  routes, account system, configured remote model provider, API key handling,
  cloud storage path, hosted analytics, telemetry, or remote logging.
- `index.html` currently ships a meta CSP:
  `default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'self' blob:; worker-src 'self' blob:; img-src 'self' blob: data:; media-src 'self' blob:; style-src 'self'; object-src 'none'; base-uri 'self'`.
- The current meta CSP does not include `frame-ancestors`, `form-action`,
  `upgrade-insecure-requests`, HSTS, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, or cross-origin isolation headers.
- `docs/privacy-architecture.md` requires raw swing video and frame pixels to
  remain blocked by default unless a future feature adds a separate explicit
  opt-in flow.
- `scripts/verify-docs-claims.js` already enforces public docs headings,
  canonical local-first and non-medical strings, required links, and prohibited
  claim patterns for README, limitations, and contributing docs.

## Adopt

- Document the current app as frontend-only/static for production hosting
  purposes. State that there is no Swing Sync application backend in the
  current production posture.
- Document concrete no-backend implications: no app accounts or app auth, no
  server-side secret storage, no app-owned server-side rate limiting, no
  Swing Sync application server logs, and no Swing Sync cloud data-retention
  workflow.
- Preserve the local-first rule exactly: raw swing video is not uploaded by
  default, and any remote sharing requires a separate explicit opt-in.
- Add a dedicated `docs/deployment.md` page and link it from `README.md`.
- Require production deployers to own HTTP response headers at the hosting
  layer where the host supports them. The app repository can keep a meta CSP
  as local/static defense in depth, but production hosting should not rely on
  meta-only CSP when HTTP headers are configurable.
- Include a recommended minimum header set for production hosting docs:
  `Content-Security-Policy`, `Strict-Transport-Security` for HTTPS production
  domains, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a
  restrictive `Permissions-Policy`.
- Extend `docs:verify` to require `docs/deployment.md`, required headings,
  canonical no-backend/local-first/security-header strings, README link
  coverage, and negative prohibited-claim coverage.
- Require `docs/deployment.md` to carry a canonical draft-review banner and
  no-guarantee string because it discusses security headers and production
  hosting.
- Add a dedicated prohibited-claim category for security-guarantee overclaims
  such as "secures your data", "prevents attacks", "hack-proof",
  "breach-proof", and "protected against breaches".
- Register `docs/deployment.md` through the existing shared
  `scripts/verify-docs-claims.js` config objects instead of one-off verifier
  logic.
- Add focused `test/unit/docs-claims.test.ts` coverage for the deployment-doc
  positive path and required negative paths.
- Avoid restating the literal `index.html` meta CSP directive string in
  `docs/deployment.md`; `index.html` remains the source of truth for exact
  local meta CSP directives.
- Enforce the CSP non-duplication rule through a named declarative
  `crossFileChecks` verifier config entry that uses the same
  `verifyDocsClaims(fileReader)` injection point and reads injected
  `index.html` content in unit tests.
- Keep observability unchanged. This is docs-only. Do not add runtime logs,
  telemetry, analytics, remote logging, cloud diagnostics, or CSP reporting
  endpoints.

## Revise Before Adoption

- Treat CSP as defense in depth, not as a security guarantee. User-facing copy
  should avoid saying headers make the app secure, private, compliant, or safe.
- Describe HSTS as a deployer-owned HTTPS production-domain setting. Avoid
  telling local development or preview hosts to force HSTS.
- Mention CSP reports only as future backend/reporting work that would require
  separate review. Do not add `report-uri`, `report-to`,
  `Reporting-Endpoints`, or Network Error Logging in SS-017.
- Keep `connect-src` documentation aligned with the current no-active-provider
  state. Do not pre-approve provider origins or remote endpoints.
- Document backend architecture review gates as future gates, not approval for
  those features.
- Treat the production security-header checklist as a minimum, not exhaustive.
  Mention COOP/COEP/CORP only as future review items when a future feature
  needs cross-origin isolation or changes resource-loading behavior.
- Use an illustrative, non-mandatory `Permissions-Policy` example rather than
  claiming a single value is correct for every host.

## Defer

- Real hosting provider configuration files are deferred until a specific
  production host is chosen.
- Backend architecture, server API design, auth/account flows, secret
  management, rate limiting implementation, server logs, retention/deletion
  workflows, cloud storage, remote model providers, CSP report collection, and
  NEL/Reporting API collection are deferred to separate reviewed stories.
- Automated live-header checks against a deployed URL are deferred until there
  is an actual production deployment target.
- Cross-origin isolation headers are deferred unless a future feature requires
  `SharedArrayBuffer`, stronger worker isolation, or a deployment target with
  third-party subresources that must be reviewed.

## Reject For Current Scope

- Reject adding any backend, auth, accounts, secrets, server routes, hosted
  functions, telemetry, analytics, remote logging, cloud diagnostics, cloud
  storage, provider SDKs, model providers, or remote sharing.
- Reject production copy that promises security, privacy, deletion,
  anonymity, legal compliance, regulatory compliance, medical safety, or
  trademark clearance.
- Reject implying that lack of an application backend means no hosting access
  logs exist. Hosting/CDN/platform logs may exist and are deployer-owned.
- Reject treating a meta CSP as equivalent to a deployer-owned HTTP CSP for
  production hosting where headers are supported.
- Reject approving future remote sharing or backend work by documenting the
  gates. Gates identify when a separate review is required.
- Reject bespoke `docs/deployment.md` verification paths that bypass the
  existing shared `files`, `requiredStrings`, `bannedPatterns`, and
  `negativeFixtures` config model in `scripts/verify-docs-claims.js`.
- Reject duplicating exact CSP directive values in deployment prose unless the
  verifier reads `index.html` through a declarative cross-file config and
  proves consistency. The preferred SS-017 approach is to reject duplication.
- Reject present-tense language that implies production HTTP security headers
  are already active before an actual deployer-owned hosting configuration is
  reviewed.

## Claude QA Planning Round 1 Disposition

Claude QA planning returned FAIL with five blockers. Codex accepts all five as
valid and revised `docs/ss-017-preimplementation-spec.md` accordingly.

- B1: Accepted. `docs/deployment.md` now requires a canonical draft-review
  banner and no-guarantee string, with verifier and unit-test requirements.
- B2: Accepted. The spec now requires a dedicated security-guarantee
  prohibited-claim category and negative fixture coverage.
- B3: Accepted. The spec now requires registration through the existing shared
  `files`, `requiredStrings`, `links`, `bannedPatterns`, and
  `negativeFixtures` config path, preserving `verifyDocsClaims(fileReader)` as
  the single unit-test injection point.
- B4: Accepted. The verification plan now explicitly includes
  `npm run test:unit -- docs-claims` and captured `git diff --stat` scope
  evidence.
- B5: Accepted with the non-duplicating option. The spec now requires
  `docs/deployment.md` to avoid restating the literal `index.html` CSP
  directive string. If exact directives are duplicated later, the verifier must
  read `index.html` and assert consistency, but that is not the preferred
  SS-017 path.

## Claude QA Planning Round 2 Disposition

Claude focused QA re-review returned FAIL with one new blocker after closing
B1-B5:

- B6: the cross-file CSP non-duplication check needed a named config-driven
  mechanism instead of leaving Codex to choose between declarative config and a
  bespoke one-off helper.

Codex accepts B6 as valid and revised `docs/ss-017-preimplementation-spec.md`
to require:

- a named declarative `crossFileChecks` config array;
- an SS-017 entry that reads injected `index.html`, extracts the literal
  `content` attribute from the CSP meta tag, verifies it is non-empty, and
  rejects that exact string in `docs/deployment.md`;
- preservation of `verifyDocsClaims(fileReader)` as the single injection point
  for cross-file tests as well as doc-content tests;
- unit coverage with a fake injected `index.html` CSP value;
- deterministic draft-review banner placement under `## Draft Review Status`;
- security-overclaim varied-case/punctuation coverage; and
- a positive approved-doc regression proving the no-guarantee string does not
  trip the security-guarantee category.

## Claude QA Planning Round 3 Disposition

Claude focused B6 re-review returned FAIL with one new blocker after closing
B6 at the architecture level:

- B7: CSP extraction from `index.html` needed robust, fail-closed behavior for
  the actual multiline tag format, attribute order/whitespace variation, and
  no-match cases.

Codex accepts B7 as valid and revised `docs/ss-017-preimplementation-spec.md`
to require:

- extraction that tolerates `http-equiv` and `content` attributes in either
  order;
- arbitrary whitespace or newlines between attributes;
- single-quoted and double-quoted attribute values;
- hard `docs:verify` failure when no CSP meta tag is found, when the content
  attribute cannot be extracted, or when the extracted content is empty; and
- unit coverage for reordered/whitespace-varied fake `index.html`, missing CSP
  meta tag, empty `content`, and missing extractable `content` cases.

## Claude QA Planning Round 4 Disposition

Claude focused B7 re-review returned FAIL with one new blocker after closing
B7:

- B8: quote-tolerant CSP extraction needed matched-quote-pair behavior because
  the actual `index.html` CSP is a double-quoted attribute containing embedded
  single quotes such as `'self'`.

Codex accepts B8 as valid and revised `docs/ss-017-preimplementation-spec.md`
to require:

- matched-quote-pair extraction, where the closing quote must be the same
  character as the opening quote;
- a double-quoted `content` value containing embedded single quotes to extract
  the full value, not a truncated fragment;
- the mirror case for single-quoted `content` containing embedded double
  quotes;
- duplication tests that use the full correctly extracted real-shaped CSP
  string; and
- an explicit scope note that SS-017 uses exact extracted-string containment,
  while whitespace-normalized or substantively equivalent CSP rewrites remain
  manual review concerns unless a future story adds normalized CSP comparison.

## Claude Implementation Audit Round 1 Disposition

Claude final implementation audit returned FAIL with three audit-stage
findings. Codex accepts B9-B11 as valid audit findings.

- B9: `CONTEXT.md` was not included in the audit prompt. Response:
  `CONTEXT.md` is an internal project-memory/tracker artifact required by
  AGENTS.md and the Swing Sync workflow, not public/user-facing deployment
  documentation. The focused re-review prompt includes the `CONTEXT.md` diff
  and asks Claude to verify it does not introduce user-facing claims or
  protected-boundary drift.
- B10: the new `terms` verifier mechanism and narrow production-header
  overclaim list needed explicit evidence. Response: the preimplementation
  spec now records `terms` as an intentional case-insensitive substring guard
  for the approved deployment doc, with future rephrasing requiring verifier
  and test updates in the same reviewed change. `test/unit/docs-claims.test.ts`
  now includes a missing required deployment term regression. The
  production-header overclaim list now covers additional present-tense
  phrasings including `ships with CSP enforced in production`, `production
  headers are already configured`, `production security headers are
  configured`, `HSTS is enabled in production`, `CSP is enforced in
  production`, and `Content-Security-Policy is enforced in production`, with a
  focused test covering multiple phrasings.
- B11: test evidence needed named test output mapped against B1-B8. Response:
  `npx vitest run test/unit/docs-claims.test.ts --reporter verbose` was run
  under Node v22.22.3 and produced the full 14-test name list. The focused
  re-review prompt maps each named test to B1-B8 and the B10 response.

Claude focused B9-B11 re-review returned PASS. B9, B10, and B11 are closed;
no remaining blockers or B1-B8 regressions were identified. Non-blocking
recommendations were deferred: broader individual production-header-overclaim
test coverage for every phrase and future word-boundary anchoring for
`terms`/`bannedPatterns`.

## Claude QA Planning Questions

1. Are the proposed docs and verifier changes sufficient to satisfy SS-017
   without adding runtime behavior?
2. Does the required security-header wording avoid overclaiming and correctly
   distinguish meta CSP from HTTP response headers?
3. Are all future backend architecture review triggers explicit enough?
4. Does the plan preserve local-first raw-video and explicit remote-sharing
   opt-in boundaries?
5. Are the proposed prohibited-claim and protected-boundary checks broad
   enough for a sensitive deployment/security/privacy documentation story?
