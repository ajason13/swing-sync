# SS-017 Claude QA Focused Re-Review Prompt

Superseded for paste use by
`docs/ss-017-claude-qa-b6-rereview-prompt.md` after Claude Round 2 closed
B1-B5 and returned FAIL on B6. Keep this file as the focused B1-B5 re-review
record.

Paste this prompt into Claude for focused preimplementation QA re-review.
Claude Chat does not have repository, filesystem, GitHub, or Notion access, so
this prompt is self-contained.

```text
Role: You are the lead adversarial QA planner for Swing Sync, a local-first
browser app for educational golf swing review.

Stage: Focused pre-implementation QA re-review after Round 1 FAIL.

Scope: Re-review only Claude Round 1 blockers B1-B5, the applied spec fixes,
and any cross-cutting risk introduced by those fixes. Do not restart broad
numbering unless a genuinely new blocker appears.

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
- Preserve existing privacy, safety, licensing, model-licensing, and
  fixture-policy boundaries.

Prior Round 1 findings:
- B1: No draft/pending-review disclaimer required in docs/deployment.md.
- B2: Missing prohibited-claim category for security-guarantee overclaims.
- B3: Verifier-extension mechanism underspecified and risks a bespoke path.
- B4: Verification plan does not execute the new/updated unit tests.
- B5: No cross-check between docs/deployment.md's CSP description and the
  actual index.html CSP.

Applied spec fixes:
- B1 response: `docs/deployment.md` now requires a canonical draft-review
  banner:

  `**DRAFT - pending human security/privacy review before public production hosting.**`

  It also requires this canonical no-guarantee string:

  `This deployment guidance is product and engineering documentation, not legal,
  security, privacy, deletion, anonymity, medical, trademark-clearance, or
  regulatory-compliance advice or a guarantee.`

  The verifier and unit tests must enforce both.

- B2 response: the spec requires a separate security-guarantee prohibited-claim
  category, distinct from deletion/security and correctness/performance. It
  must catch phrases such as `secures your data`, `prevents attacks`,
  `hack-proof`, `breach-proof`, `protected against breaches`, `stops
  attackers`, and `guaranteed protection`, with matching negative fixture
  coverage.

- B3 response: the spec requires implementation through the existing
  config-driven `scripts/verify-docs-claims.js` path:
  - register `docs/deployment.md` in the existing `files` object;
  - register new canonical strings in `requiredStrings`;
  - register the README deployment link through existing `links` config;
  - register security-overclaim checks in `bannedPatterns`;
  - register matching negative coverage in `negativeFixtures`;
  - preserve `verifyDocsClaims(fileReader)` as the single unit-test injection
    point.

- B4 response: the verification plan now explicitly requires:
  - `npm run test:unit -- docs-claims`
  - `npm run docs:verify`
  - `npm run safety:verify`
  - `npm run privacy:verify`
  - `npm run compliance:verify`
  - `npm run build`
  - `git diff --check`
  - `git diff --stat`

- B5 response: the spec chooses the non-duplicating option. `docs/deployment.md`
  must not restate the literal CSP directive string from `index.html`.
  `index.html` remains the source of truth for exact local meta CSP directives.
  The deployment doc may identify the current posture as "meta CSP in
  `index.html`" and explain the production migration principle. The verifier
  must reject docs that duplicate the literal `index.html` CSP directive string
  in `docs/deployment.md`. If a later implementation duplicates exact
  directives anyway, the verifier must instead read `index.html` and prove
  consistency, but that is not the preferred SS-017 plan.

Additional spec guardrails added from non-blocking recommendations:
- The production header checklist must be described as minimum, not
  exhaustive.
- COOP/COEP/CORP are future review items only if future features need
  cross-origin isolation or change resource-loading behavior.
- `Permissions-Policy` examples must be illustrative and non-mandatory.
- Present-tense claims that production HTTP security headers are already
  active are prohibited.

Relevant revised spec excerpts:

```
`docs/deployment.md` must include these sections:

- `# Deployment`
- `## Draft Review Status`
- `## Current Production Posture`
- `## No-Backend Implications`
- `## Local Development`
- `## Production Hosting Requirements`
- `## Security Headers`
- `## Local-First Data Boundary`
- `## Backend Architecture Review Gates`
- `## Non-Goals For SS-017`
- `## Verification`

Required content:

- Include this canonical draft-review banner immediately after the title or in
  `## Draft Review Status`:

**DRAFT - pending human security/privacy review before public production hosting.**

- Include this canonical no-guarantee string:

This deployment guidance is product and engineering documentation, not legal,
security, privacy, deletion, anonymity, medical, trademark-clearance, or
regulatory-compliance advice or a guarantee.

- State that the current Swing Sync app is a static frontend/browser app for
  deployment purposes and that SS-017 does not add an application backend.
- Explain no-backend implications for auth, accounts, secrets, rate limiting,
  server logs, and data retention.
- State that the current meta CSP in `index.html` is local/static defense in
  depth and should be moved to deployer-owned HTTP `Content-Security-Policy`
  headers for production hosting where the host supports response headers.
- Do not restate the literal CSP directive value from `index.html` in
  `docs/deployment.md`. `index.html` remains the source of truth for the local
  meta CSP.
- Provide a production minimum header checklist:
  `Content-Security-Policy`, `Strict-Transport-Security`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and restrictive
  `Permissions-Policy`.
- State that the minimum header checklist is not exhaustive and that future
  features may require additional review for headers such as
  `Cross-Origin-Opener-Policy`, `Cross-Origin-Embedder-Policy`, or
  `Cross-Origin-Resource-Policy`.
- For `Permissions-Policy`, include only an illustrative non-mandatory example.
```

```
Extend `docs:verify` through the existing shared config-driven verifier path,
not bespoke one-off logic:

- Register `docs/deployment.md` in the existing `files` object in
  `scripts/verify-docs-claims.js`.
- Register new canonical deployment strings in the existing `requiredStrings`
  object and reference them from the `docs/deployment.md` file config.
- Register deployment links from README through the existing `links` config.
- Register new prohibited security-overclaim checks in the existing
  `bannedPatterns` object.
- Register matching negative coverage in the existing `negativeFixtures`
  object.
- Keep `verifyDocsClaims(fileReader)` as the single unit-test injection point
  for positive and negative docs-claim tests.
```

```
`test/unit/docs-claims.test.ts` must include focused tests for:

- current approved docs, including `docs/deployment.md`, pass all checks;
- missing `docs/deployment.md` fails;
- missing any one required deployment heading fails;
- missing deployment draft-review banner fails;
- missing canonical deployment no-guarantee string fails;
- paraphrased or altered local-first string in `docs/deployment.md` fails;
- README missing `./docs/deployment.md` fails;
- security-guarantee overclaim phrase fails;
- present-tense production-header overclaim fails;
- duplicating the literal `index.html` meta CSP directive string in
  `docs/deployment.md` fails.
```

Known non-goals:
- No backend, auth, accounts, secrets, telemetry, analytics, remote logging,
  cloud storage, provider SDKs, model providers, or remote sharing.
- No runtime behavior changes.
- No production hosting provider configuration files until a host is selected.
- No CSP reporting endpoints, NEL, Reporting API endpoints, or remote
  diagnostic collection.
- No legal, compliance, security, privacy, deletion, anonymity, medical, or
  trademark-clearance guarantees.

Verification so far:
- Spec artifacts only; implementation has not started.
- `git diff --check` will be rerun after this prompt is saved.

Output required:
- PASS or FAIL verdict for whether Codex may implement.
- For B1-B5, state whether each is closed or remains blocking.
- Any new blockers introduced by the focused spec changes, ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status.
```
