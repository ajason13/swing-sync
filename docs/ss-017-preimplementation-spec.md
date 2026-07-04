# SS-017 Preimplementation Spec

Date: 2026-07-03

Status: Candidate spec for Claude QA planning. Do not implement public
deployment/security/privacy copy until Claude QA planning passes or blocking
findings are resolved and re-reviewed.

## Story

Document the current frontend-only/no-backend production posture,
deployer-owned security headers, and future backend architecture gates before
any public hosting or backend feature work.

## Acceptance Criteria

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

## Protected Boundaries

- Do not add a backend, auth, accounts, secrets, telemetry, analytics, remote
  logging, cloud storage, provider SDKs, model providers, or remote sharing.
- Do not make legal, compliance, security, privacy, deletion, anonymity,
  medical, or trademark-clearance guarantees.
- Preserve `docs/privacy-architecture.md`, `docs/safety-terms.md`,
  `docs/licensing.md`, `docs/models-licensing.md`, and
  `docs/fixture-policy.md` boundaries.

## Target Files

- Add `docs/deployment.md`.
- Update `README.md` to link `docs/deployment.md` and clarify that local setup
  commands are for development, not production hosting configuration.
- Update `scripts/verify-docs-claims.js` so `npm run docs:verify` validates
  the new deployment documentation and README link.
- Add focused unit coverage in `test/unit/docs-claims.test.ts` for the new
  deployment-doc positive and negative paths.

No runtime source, package dependency, build output, SBOM, license policy,
provider, worker, telemetry, storage, network, or backend files should change.

## Required Deployment Documentation

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

- Include this canonical draft-review banner as the first paragraph under
  `## Draft Review Status`:

```text
**DRAFT - pending human security/privacy review before public production hosting.**
```

- Include this canonical no-guarantee string:

```text
This deployment guidance is product and engineering documentation, not legal,
security, privacy, deletion, anonymity, medical, trademark-clearance, or
regulatory-compliance advice or a guarantee.
```

- State that the current Swing Sync app is a static frontend/browser app for
  deployment purposes and that SS-017 does not add an application backend.
- Explain no-backend implications for auth, accounts, secrets, rate limiting,
  server logs, and data retention:
  - no app-owned account or login system;
  - no app server session or account auth boundary;
  - no server-side secret storage or secret-dependent runtime feature;
  - no app-owned server-side rate limiter;
  - no Swing Sync application server logs;
  - no Swing Sync cloud data-retention or deletion workflow;
  - hosting/CDN/platform logs, TLS, redirects, and retention are deployer-owned
    concerns and are not controlled by the frontend bundle.
- Distinguish local development from production:
  - `npm run dev` is a local Vite development server;
  - `npm run build` creates static output;
  - production deployment requires a chosen static host or web server;
  - the deployer must configure HTTPS, redirects, headers, cache behavior, and
    platform logging/retention according to the deployment environment.
- Preserve this canonical local-first string exactly:

```text
Raw swing video is not uploaded by default. Any future feature that sends raw
video, frame pixels, landmarks, metrics, prompts, reports, or model outputs
outside the browser must use a separate, explicit opt-in flow.
```

- State that the current meta CSP in `index.html` is local/static defense in
  depth and should be moved to deployer-owned HTTP `Content-Security-Policy`
  headers for production hosting where the host supports response headers.
- Do not restate the literal CSP directive value from `index.html` in
  `docs/deployment.md`. `index.html` remains the source of truth for the local
  meta CSP. The deployment doc may identify the current posture as "meta CSP
  in `index.html`" and may describe the migration principle, but it must avoid
  duplicating exact directive values that can drift.
- Document that HTTP CSP supports directives that meta CSP cannot fully cover,
  including `frame-ancestors`, and avoids timing gaps for resources that load
  before a meta policy is parsed.
- Provide a production minimum header checklist:
  - `Content-Security-Policy`
  - `Strict-Transport-Security` for HTTPS production domains
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy`
  - restrictive `Permissions-Policy`
- Keep header values conservative and current-state-specific. Do not add
  reporting endpoints or provider origins in this story.
- State that the minimum header checklist is not exhaustive and that future
  features may require additional review for headers such as
  `Cross-Origin-Opener-Policy`, `Cross-Origin-Embedder-Policy`, or
  `Cross-Origin-Resource-Policy`.
- For `Permissions-Policy`, include only an illustrative non-mandatory example
  such as disabling camera, microphone, and geolocation while noting that the
  final value is deployer- and feature-dependent.
- Identify backend architecture review gates before any future feature that
  adds or changes:
  - auth, accounts, roles, sessions, or identity providers;
  - server APIs, hosted functions, queues, jobs, or server middleware;
  - server-side secrets, API keys, signing keys, tokens, or key rotation;
  - app-owned rate limiting, abuse controls, or quota enforcement;
  - application server logs, CSP report collection, NEL, telemetry, analytics,
    cloud diagnostics, or remote error reporting;
  - cloud storage, sync, backups, retention, deletion, export, or account data
    workflows;
  - remote model providers, provider SDKs, model assets, or hosted inference;
  - raw-video, frame-pixel, landmark, metric, prompt, report, or model-output
    remote sharing;
  - production host changes that alter security headers, origins, redirects,
    caching, service workers, or data flow.

## README Requirements

README should add `Deployment` to the documentation link list and clarify that
the setup commands are local development commands. Keep the existing
local-first, non-medical, draft-review, license, and non-affiliation language
intact.

## Verification Requirements

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
- Add a named declarative `crossFileChecks` config array for checks that derive
  a forbidden value from one file and assert it is absent from another file.
  The SS-017 entry must:
  - read source file `index.html`;
  - extract the literal `content` attribute from the
    `<meta http-equiv="Content-Security-Policy" ...>` tag;
  - tolerate `http-equiv` and `content` attributes in either order, with
    arbitrary whitespace or newlines between attributes, matching the current
    multiline `index.html` tag format;
  - tolerate single-quoted or double-quoted attribute values using
    matched-quote-pair extraction: the closing quote must be the same
    character as the opening quote, so a double-quoted CSP value containing
    embedded single quotes such as `default-src 'self'` extracts the full
    value instead of a truncated fragment;
  - fail closed with a structured `docs:verify` error if no matching CSP meta
    tag is found, if the `content` attribute cannot be extracted, or if the
    extracted value is empty;
  - require that extracted CSP directive string to be non-empty;
  - check target file `docs/deployment.md`;
  - fail if the target file contains that exact extracted directive string.
- Keep `verifyDocsClaims(fileReader)` as the single unit-test injection point
  for positive, negative, and cross-file docs-claim tests. The injected
  `fileReader` must cover `index.html` as well as public docs in tests.

The shared verifier must enforce:

- `docs/deployment.md` exists and is non-empty.
- Required deployment headings are present.
- README links to `./docs/deployment.md`.
- The deployment draft-review banner appears in `docs/deployment.md`.
- The canonical no-guarantee deployment string appears in
  `docs/deployment.md`.
- The canonical local-first string appears in `docs/deployment.md`.
- Deployment docs include required no-backend terms: auth, accounts, secrets,
  rate limiting, server logs, and data retention.
- Deployment docs include required security-header terms:
  `Content-Security-Policy`, `Strict-Transport-Security`,
  `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
- Deployment docs include the required backend-review gate terms: auth,
  accounts, secrets, APIs, remote model providers, cloud storage, telemetry,
  analytics, remote logging, CSP report collection, retention, deletion, and
  raw swing video.
- Required deployment terms are intentionally enforced as case-insensitive
  substring checks for SS-017. This is a narrow structural regression guard for
  the approved deployment doc, not a semantic language policy. If a future
  edit intentionally rephrases terms such as `rate limiting`, update the
  verifier and tests in the same reviewed change.
- Existing prohibited-claim categories scan `docs/deployment.md`.
- Add a dedicated prohibited-claim category for security-guarantee overclaims,
  separate from `deletion/security` and `correctness/performance`. It must
  catch phrases such as `secures your data`, `prevents attacks`, `hack-proof`,
  `breach-proof`, `protected against breaches`, `stops attackers`, and
  `guaranteed protection`, unless an exact approved exception is later added
  with explicit audit evidence.
- Add negative fixture coverage for the security-guarantee category.
- Reject present-tense production-header overclaims that imply headers are
  already active in production, such as `Swing Sync is deployed with HSTS` or
  `Swing Sync is protected by production HTTP security headers`.
- Reject docs that duplicate the literal CSP directive string from
  `index.html` in `docs/deployment.md` through the declarative
  `crossFileChecks` entry. This avoids a second source of truth without adding
  a bespoke one-off verifier branch.

`test/unit/docs-claims.test.ts` must include focused tests for:

- current approved docs, including `docs/deployment.md`, pass all checks;
- missing `docs/deployment.md` fails;
- missing any one required deployment heading fails;
- missing deployment draft-review banner fails;
- deployment draft-review banner present outside `## Draft Review Status`
  fails;
- missing canonical deployment no-guarantee string fails;
- paraphrased or altered local-first string in `docs/deployment.md` fails;
- README missing `./docs/deployment.md` fails;
- security-guarantee overclaim phrase fails;
- security-guarantee overclaim phrase in varied case or punctuation, such as
  `Hack-Proof` or `hack proof`, fails;
- approved `docs/deployment.md` text does not trip the security-guarantee
  category because of the required no-guarantee disclaimer;
- present-tense production-header overclaim fails;
- duplicating a fake injected `index.html` meta CSP directive string in
  `docs/deployment.md` fails through `verifyDocsClaims(fileReader)`, proving
  the cross-file check is independent of the real current CSP value.
- a reordered or whitespace-varied fake `index.html` CSP meta tag still
  extracts correctly, including `content` before `http-equiv`, extra
  newlines, and single-quoted or double-quoted attributes;
- fake `index.html` with no CSP meta tag fails loudly through
  `verifyDocsClaims(fileReader)`;
- fake `index.html` with a CSP meta tag but `content=""` fails loudly through
  `verifyDocsClaims(fileReader)`;
- fake `index.html` with the CSP meta tag present but no extractable
  `content` attribute fails loudly through `verifyDocsClaims(fileReader)`.
- fake `index.html` with double-quoted `content` containing embedded single
  quotes, such as `content="default-src 'self'"`, extracts the full
  `default-src 'self'` value and detects duplication of the full value in
  `docs/deployment.md`;
- fake `index.html` with single-quoted `content` containing embedded double
  quotes extracts the full value and detects duplication of the full value in
  `docs/deployment.md`;
- duplication checking intentionally uses exact extracted-string containment
  for SS-017. Whitespace-normalized or substantively equivalent CSP rewrites
  are outside the automated scope for this story and remain manual review
  concerns unless a future story adds normalized CSP comparison.

Expected verification after implementation:

```bash
npm run test:unit -- docs-claims
npm run docs:verify
npm run safety:verify
npm run privacy:verify
npm run compliance:verify
npm run build
git diff --check
git diff --stat
```

No dependency, bundle, license-policy, notice, or SBOM changes are expected.
If that changes, also run:

```bash
npm run license:audit
npm run verify:bundle-license-fixture
npm run sbom:generate
```

## Prohibited Claims

Do not use public-doc phrasing that claims or implies:

- security, privacy, deletion, anonymity, legal compliance, regulatory
  compliance, medical safety, correctness, performance, or trademark clearance
  is guaranteed;
- local-first means no hosting/CDN/platform logs can exist;
- CSP or security headers make the app secure or private;
- security headers secure user data, prevent attacks, make the app
  breach-proof, or protect against breaches;
- production HTTP security headers are already active before an actual
  deployer-owned hosting configuration is reviewed;
- meta CSP is enough for all production deployments;
- no data can ever leave the device;
- future remote sharing, backend, or provider work is approved by this story.

## Observability Decision

SS-017 is docs-only. Runtime observability remains intentionally unchanged. Do
not add logs, telemetry, analytics, remote logging, cloud diagnostics, CSP
report endpoints, NEL, Reporting API endpoints, or persistent debug artifacts.

## Notion Test Case

Dedicated test case: `SS-TC-021`
https://app.notion.com/p/392834a0c8a68199983fc7bc1720ef2f

`SS-TC-017` is for SS-014 fixture policy coverage and must not be claimed as
SS-017 coverage.

## Implementation Gate

Implementation must wait for Claude QA planning PASS, or for any blocking QA
findings to be resolved and re-reviewed.
