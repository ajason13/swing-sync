# SS-017 Claude QA Planning Prompt

Superseded for paste use by
`docs/ss-017-claude-qa-rereview-prompt.md` after Claude Round 1 returned FAIL
with B1-B5. Keep this file as the original QA planning record.

Paste this prompt into Claude for preimplementation QA planning. Claude Chat
does not have repository, filesystem, GitHub, or Notion access, so this prompt
is self-contained.

```text
Role: You are the lead adversarial QA planner for Swing Sync, a local-first
browser app for educational golf swing review.

Stage: Pre-implementation QA planning.

Scope: Review the SS-017 candidate research/spec plan before any public
deployment, security-header, privacy, or backend-boundary documentation copy is
implemented. Your job is to find blockers, overclaims, missing checks, and
fail-open verification requirements.

Context:
Swing Sync is a local-first browser app. The current app runs local video
selection, local Pose Landmarker inference on sampled frames, swing phase
detection, geometry and tempo metrics, visual review surfaces, and local Swing
Card export/copy workflows. SS-013 added a provider-neutral remote model
adapter scaffold behind explicit consent, but the production provider registry
is empty. There are no configured remote model providers, provider SDKs, API
keys, server routes, active hosted-model calls, cloud storage paths, hosted
analytics, telemetry, or remote logging in the current production app.

SS-017 intent:
Document the current frontend-only/no-backend production posture,
deployer-owned security headers, and future backend architecture gates before
any public hosting or backend feature work.

Acceptance criteria:
- Document the current no-backend production posture and what that means for
  auth, accounts, secrets, rate limiting, server logs, and data retention.
- Define the minimum production hosting requirements for security headers,
  including moving CSP from meta-only posture to deployer-owned HTTP headers
  where hosting supports them.
- Preserve the local-first rule: raw swing video is not uploaded by default
  and remote sharing requires separate explicit opt-in.
- Identify which future features would require a separate backend architecture
  review before implementation.
- Update README or deployment docs with clear local/dev versus
  production-hosting instructions.

Protected boundaries:
- Do not add a backend, auth, accounts, secrets, telemetry, analytics, remote
  logging, cloud storage, provider SDKs, model providers, or remote sharing in
  this story.
- Do not make legal, compliance, security, privacy, deletion, anonymity,
  medical, or trademark-clearance guarantees.
- Preserve the existing privacy, safety, licensing, model-licensing, and
  fixture-policy boundaries.

Relevant current source contents:

File: README.md excerpt
```
# Swing Sync

Swing Sync is a local-first browser app for educational golf swing review. It
helps users inspect selected swing videos in the browser, review pose-derived
movement signals, and export a Swing Card for their own practice notes.

Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance,
physical therapy, or a substitute for qualified medical care or professional
golf coaching.

## Current Capabilities

The current app runs local video selection, local Pose Landmarker inference on
sampled frames, swing phase detection, geometry and tempo metrics, visual
review surfaces, and local Swing Card export/copy workflows.

SS-012 added local-only educational coaching prompt and response contracts, but
no model call is made from those contracts. SS-013 added a provider-neutral
remote model adapter scaffold behind explicit consent, but the production
provider registry is empty. There are no configured remote model providers,
provider SDKs, API keys, server routes, or active hosted-model calls in the
current production app.

## Local-First Design

Raw swing video is not uploaded by default. Any future feature that sends raw
video, frame pixels, landmarks, metrics, prompts, reports, or model outputs
outside the browser must use a separate, explicit opt-in flow.

Derived landmarks, metrics, selected images, prompts, reports, and model
outputs may still be sensitive or identifying. Downloaded exports are controlled
by the user after they leave the app.

The safety and privacy documents are engineering and product drafts pending
human/legal review; they are not legal advice and do not guarantee privacy,
safety, deletion, anonymity, or regulatory compliance.
```

File: docs/privacy-architecture.md excerpt
```
# Privacy Architecture and Video Data Lifecycle

**DRAFT - pending human/privacy review before public release.**

This document defines Swing Sync's local-first privacy architecture for future
video analysis work. It is product and engineering guidance, not legal advice
or a guarantee of privacy, security, deletion, or regulatory compliance.

## Default Privacy Posture

Swing Sync must process swing video locally by default. Raw swing video and
frame pixels must not be uploaded, sent to model providers, or shared with
remote services unless a future feature adds a separate, explicit opt-in flow
for that action.

The current application implements local file selection and local Pose
Landmarker inference for sampled video frames. It does not implement camera
capture, raw-video or landmark persistence, exports, remote sharing, or remote
model APIs. The current consent acknowledgement is a local scaffold, not a
durable legal or privacy record.
```

File: index.html current CSP excerpt
```
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'self' blob:; worker-src 'self' blob:; img-src 'self' blob: data:; media-src 'self' blob:; style-src 'self'; object-src 'none'; base-uri 'self'"
/>
```

Current docs claim verifier summary:
`scripts/verify-docs-claims.js` currently verifies README, docs/limitations.md,
and CONTRIBUTING.md. It enforces required headings, canonical local-first and
non-medical strings, safety/privacy links, safety/privacy draft banners,
prohibited claim categories, and negative fixtures for privacy/anonymity,
deletion/security, medical/injury, correctness/performance,
legal/compliance/trademark, telemetry/analytics, and absolute remote-boundary
phrases.

Candidate implementation plan:
- Add `docs/deployment.md`.
- Update README to link `docs/deployment.md` and clarify local setup commands
  are local development commands, not production hosting configuration.
- Extend `scripts/verify-docs-claims.js` so `npm run docs:verify` validates the
  new deployment doc and README link.
- Add focused unit coverage in `test/unit/docs-claims.test.ts` for new
  deployment-doc positive and negative verifier paths if the verifier changes
  are not already covered.
- Do not change runtime source, package dependencies, build output, SBOM,
  license policy, provider, worker, telemetry, storage, network, or backend
  files.

Required deployment doc headings:
- `# Deployment`
- `## Current Production Posture`
- `## No-Backend Implications`
- `## Local Development`
- `## Production Hosting Requirements`
- `## Security Headers`
- `## Local-First Data Boundary`
- `## Backend Architecture Review Gates`
- `## Non-Goals For SS-017`
- `## Verification`

Required deployment content:
- State the current app is a static frontend/browser app for deployment
  purposes and that SS-017 does not add an application backend.
- Explain no-backend implications for auth, accounts, secrets, rate limiting,
  server logs, and data retention.
- State that hosting/CDN/platform logs, TLS, redirects, and retention are
  deployer-owned concerns and are not controlled by the frontend bundle.
- Distinguish local Vite development from production static hosting.
- Preserve this canonical local-first string exactly:

Raw swing video is not uploaded by default. Any future feature that sends raw
video, frame pixels, landmarks, metrics, prompts, reports, or model outputs
outside the browser must use a separate, explicit opt-in flow.

- State that the current meta CSP in `index.html` is local/static defense in
  depth and should be moved to deployer-owned HTTP `Content-Security-Policy`
  headers for production hosting where the host supports response headers.
- Document that HTTP CSP supports directives that meta CSP cannot fully cover,
  including `frame-ancestors`, and avoids timing gaps for resources that load
  before a meta policy is parsed.
- Provide a production minimum header checklist:
  `Content-Security-Policy`, `Strict-Transport-Security` for HTTPS production
  domains, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and
  restrictive `Permissions-Policy`.
- Keep header values conservative and current-state-specific. Do not add
  reporting endpoints or provider origins in this story.
- Identify backend architecture review gates before any future feature that
  adds auth/accounts/identity, server APIs/functions/jobs/middleware,
  server-side secrets, rate limiting, application server logs, CSP report
  collection, NEL, telemetry, analytics, cloud diagnostics, remote error
  reporting, cloud storage, sync, backups, retention, deletion, remote model
  providers, provider SDKs, model assets, hosted inference, raw-video or
  derived-data remote sharing, or production host changes that alter security
  headers, origins, redirects, caching, service workers, or data flow.

Verification plan after implementation:
- `npm run docs:verify`
- `npm run safety:verify`
- `npm run privacy:verify`
- `npm run compliance:verify`
- `npm run build`
- `git diff --check`

No dependency, bundle, license-policy, notice, or SBOM changes are expected.

Known non-goals:
- No backend, auth, accounts, secrets, telemetry, analytics, remote logging,
  cloud storage, provider SDKs, model providers, or remote sharing.
- No runtime behavior changes.
- No production hosting provider configuration files until a host is selected.
- No CSP reporting endpoints, NEL, Reporting API endpoints, or remote
  diagnostic collection.
- No legal, compliance, security, privacy, deletion, anonymity, medical, or
  trademark-clearance guarantees.

Output required:
- PASS or FAIL verdict for implementation readiness.
- Blockers ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Any wording categories likely to overclaim security, privacy, legal,
  deletion, anonymity, medical, or compliance posture.
- Explicit sign-off status for whether Codex may implement the docs and
  verifier changes.
```
