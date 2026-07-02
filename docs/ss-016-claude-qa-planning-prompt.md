# SS-016 Claude QA Planning Prompt

**Superseded for paste use.** Claude returned FAIL on this initial QA planning
prompt. Use `docs/ss-016-claude-qa-rereview-prompt.md` for the focused B1-B5
re-review.

Paste everything between START and END into Claude Chat for preimplementation
QA planning.

## START

Role: You are the independent adversarial QA planner for Swing Sync.

Stage: Preimplementation QA planning for SS-016.

Scope: Review the proposed README, limitations page, contributor guide,
trademark/non-affiliation language, protected claims, testing plan, and docs
workflow before Codex implements SS-016. This is a planning gate, not an
implementation audit.

Context:
Swing Sync is a local-first browser app for educational golf swing analysis.
Codex is acting as the SS-016 research/spec owner under the current LLM-team
routing update. Claude remains the independent QA planning and final audit
reviewer. Assume you cannot read the repository, GitHub, or Notion; all
relevant context is included below.

Current repository state:
- Default branch: `main`.
- SS-016 branch: `ss-016-docs`, created from `main` at
  `b03efbb46578c19119b4b7d286ebc8be97d6749f`.
- Latest merged PR before SS-016: PR #16 for SS-013, merge commit
  `a53203788e2cd3f65c25e95a271944b4fb677653`.
- SS-013 added a fail-closed, provider-neutral model adapter scaffold behind
  explicit consent. It ships with an empty production provider registry and no
  provider SDKs, keys, remote calls, telemetry, remote logging, cloud storage,
  raw media upload, new dependencies, or model/provider assets.
- Runtime observability remains local-only: sanitized UI status/error states,
  deterministic tests, and CI/browser failure artifacts. No production logging
  or telemetry was added.

Acceptance criteria:
- README explains purpose, local-first design, safety limits, and setup.
- Limitations page covers pose accuracy, camera setup, and non-medical scope.
- Contributor guide explains task workflow, testing, licenses, and SBOM
  expectations.
- Trademark/non-affiliation disclaimer is visible.

Protected boundaries:
- Raw swing video and frame pixels must not be uploaded, sent to model
  providers, or shared with remote services unless a future separately reviewed
  feature adds explicit opt-in.
- Derived landmarks, metrics, prompts, reports, selected images, and model
  outputs may still be sensitive or identifying.
- Do not make absolute privacy, deletion, anonymity, legal, compliance, safety,
  medical, injury-prevention, professional coaching, trademark-clearance, or
  guaranteed correctness claims.
- Do not add telemetry, remote logging, hosted analytics, cloud diagnostics,
  cloud storage, hidden identifiers, new workers, provider SDKs,
  provider/model assets, new dependencies, camera capture, raw personal video
  fixtures, service workers, API routes, secrets, or remote-sharing behavior.
- Debugging/observability wording for SS-016 must describe only existing local
  test output, browser devtools, sanitized UI status/error codes, and
  CI/browser failure artifacts.
- The docs may say raw swing video is not uploaded by default and remote
  sharing requires separate explicit opt-in. They must not say raw swing video
  can never leave the device, that deletion is guaranteed, or that data is
  anonymous.

Relevant source contents or focused diff:
No SS-016 implementation diff exists yet. The following are exact current
source excerpts and complete candidate planning artifacts. Omitted repository
implementation details are unrelated to the public docs contract.

File: `README.md`

````markdown
# Swing Sync

Swing Sync is a local-first, open-source AI golf swing analysis coach. The first
project milestone establishes licensing, dependency governance, SBOM generation,
and third-party notice handling before analysis features are implemented.

## Project Status

SS-001 is complete and merged in
[PR #1](https://github.com/ajason13/swing-sync/pull/1). The repository now has
the Apache-2.0 license, dependency license policy, SBOM workflow, third-party
notice handling, synthetic license fixtures, and CI compliance gates.

Current project context and next-task handoff live in [CONTEXT.md](./CONTEXT.md).

## Compliance Commands

Use Node 22, matching CI:

```bash
nvm use
npm ci
```

```bash
npm run license:audit
npm run sbom:generate
npm run build
npm run compliance:verify
```

The project is licensed under Apache-2.0. Raw swing video handling, model terms,
and sports safety UX are tracked separately from this initial compliance setup.

## Safety Drafts

SS-002 safety and educational-use draft language lives in
[docs/safety-terms.md](./docs/safety-terms.md). The draft is product-compliance
language for human/legal review, not legal advice. The current app scaffold
blocks first analysis behind a local-only educational-use and assumption-of-risk
acknowledgement.

Gemini Deep Research disposition for SS-002 is tracked in
[docs/ss-002-research-disposition.md](./docs/ss-002-research-disposition.md)
so research recommendations stay separate from approved implementation scope.

## Privacy Architecture

SS-003 privacy architecture and video data lifecycle draft guidance lives in
[docs/privacy-architecture.md](./docs/privacy-architecture.md). It defines
local-first data classes, default no-upload behavior for raw swing video,
export and optional remote-sharing boundaries, and deletion-copy limits before
video analysis features are implemented.

Gemini Deep Research disposition for SS-003 is tracked in
[docs/ss-003-research-disposition.md](./docs/ss-003-research-disposition.md).

## Local Application Shell

SS-004 provides a mobile-first PWA shell that opens directly to capture/upload,
processing, review, and export placeholder states. These states do not access,
store, analyze, export, or remotely share video. The existing local safety
acknowledgement still blocks the first analysis action path.

Use Node 22 and start the local app:

```bash
nvm use
npm run dev
```

Run the shell's unit and browser smoke tests:

```bash
npm run test:unit
npm run test:smoke
```

Install the smoke-test browser once per development environment with
`npx playwright install chromium`.
````

File: `docs/privacy-architecture.md` excerpts

```markdown
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

Derived landmarks and metrics should be treated as sensitive user data. Even
without a face or background video, movement patterns, timing, body proportions,
and swing mechanics may be personal or identifying when combined with other
data.

Runtime implementation must fail closed. If remote sharing has not been
explicitly enabled for the specific data class and destination, the app should
block the action instead of silently sending data.

Browser storage behavior varies by engine, device, available space, private
browsing mode, user settings, installed-PWA state, and whether storage is
best-effort or persistent. Swing Sync must not promise that local browser data
is permanent, encrypted, immune to browser eviction, or physically erased from
device storage after deletion.

Exports must not be described as anonymous. Landmarks, metrics, images, and
feedback may still be sensitive or identifying.

Optional remote sharing is not approved yet. Before any remote model, hosted
model API, cloud storage, or coach-review feature is implemented, Swing Sync
must document provider/service terms, data classes transmitted, retention and
training-use terms, destination origins, opt-in/revocation UX, and privacy
impact.

Observability is intentionally limited to local UI state and sanitized stable
error codes. Raw frames, landmarks, media characteristics, and user identifiers
must not be written to console output, logs, storage, or remote systems.
```

File: `docs/safety-terms.md` excerpts

```markdown
# Safety Terms and Educational Use Draft

**DRAFT - pending legal/human review; not for release.**

This document is product-compliance draft language for human and legal review.
It is not legal advice, does not guarantee enforceability, and should be
reviewed before release.

## Intended Use

Swing Sync provides local-first, educational golf swing feedback. It is designed
to help users observe movement patterns and practice general skill awareness.
It is not medical advice, physical therapy, rehabilitation guidance, injury
diagnosis, pain triage, or professional athletic instruction.

Raw swing video must remain on the user's device by default. Any future remote
model, cloud storage, or coach-review feature must require a separate opt-in
flow before raw swing video leaves the device.

User-facing copy and AI coaching output must describe feedback as educational
information only; avoid medical advice, pain diagnosis, rehabilitation,
physical therapy, professional athletic instruction, guarantees of injury
prevention, performance improvement, or swing correctness; encourage users to
stop activity if pain or concerning symptoms occur; and direct users with pain,
injury, medical conditions, or safety concerns to a qualified medical
professional or qualified golf coach as appropriate.
```

File: `docs/licensing.md` excerpts

```markdown
# Swing Sync Licensing and Dependency Policy

Swing Sync uses Apache-2.0 for project source code. This document records the
engineering compliance policy for dependencies, reference repositories, SBOMs,
and notices. It is not legal advice.

Allowed in production bundles: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause,
ISC, CC0-1.0, and 0BSD.

Blocked in production bundles: GPL, AGPL, LGPL, unlicensed packages, unknown,
custom, or non-SPDX license identifiers, and proprietary packages without
written permission or contract.

Exception-required: MPL-2.0, dual-license expressions that cannot be parsed
cleanly by automation, and model weights, model assets, or SDKs with terms
separate from source licenses.

`docs/sbom.json` is the CycloneDX dependency inventory generated from the npm
dependency graph. It is not proof that the built browser bundle is
license-clean. Bundle compliance is checked separately through a Vite/Rollup
license gate.

Optional model API SDKs require two independent approvals: the SDK source
license must satisfy this policy, and provider service terms must permit Swing
Sync's intended local-first, opt-in data sharing behavior.

The name "Swing Sync" requires a preliminary trademark search before the
repository is made broadly public or promoted.
```

File: `docs/models-licensing.md` excerpts

```markdown
# Model Licensing Policy

Do not commit, vendor, serve, cache, or fetch model assets such as `.tflite`,
`.onnx`, WASM weights, or comparable model files until the project documents
model name/version, source URL, license terms, redistribution and caching
rights, commercial-use restrictions, required citations, and privacy impact.

SS-005 approved exact `@mediapipe/tasks-vision@0.10.35` and exact Pose
Landmarker Full float16 version 1 assets. Any later SDK version requires a
fresh license, privacy, provider-metrics, and network review.

Optional model API SDKs must satisfy both code-license policy and provider
service terms. Raw swing video must not be sent to any model provider by
default.
```

File: `docs/fixture-policy.md` excerpts

```markdown
# Fixture Policy

This policy defines which committed Swing Sync test fixtures are allowed, what
provenance they require, and what fixture content must not be committed. It is
engineering compliance guidance, not legal advice or a guarantee of privacy,
anonymity, deletion, safety, model performance, or legal compliance.

Do not commit fixtures that imply representative model accuracy, phase
accuracy, biomechanical correctness, safety, anonymity, legal compliance, or
guaranteed deletion.

`test/fixtures/pose-landmarker` remains approved only for deterministic local
pose-extraction integration. It is not evidence of golf-swing accuracy, phase
detection, biomechanical correctness, coaching correctness, or performance
across devices.
```

File: `package.json` excerpts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build && node scripts/aggregate-notices.js",
    "verify:bundle-license-fixture": "node scripts/verify-bundle-license-fixture.js",
    "license:audit": "npm run license:audit:fixtures && node scripts/verify-production-licenses.js",
    "sbom:generate": "npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file docs/sbom.json --omit dev --validate && node scripts/filter-sbom.js",
    "safety:verify": "node scripts/verify-safety-terms.js",
    "privacy:verify": "node scripts/verify-privacy-boundaries.js",
    "pose-assets:verify": "node scripts/verify-pose-assets.js",
    "fixture:verify": "node scripts/verify-fixtures.js",
    "compliance:verify": "node scripts/verify-compliance.js && npm run fixture:verify && npm run pose-assets:verify && npm run safety:verify && npm run privacy:verify",
    "test:unit": "vitest run",
    "test:smoke": "playwright test"
  }
}
```

File: `docs/ss-016-research-disposition.md`

```markdown
# SS-016 Research Disposition

Status: candidate research input for Claude QA planning. No user-facing docs
implementation is approved by this document.

Checked on: 2026-07-01.

## Task

`SS-016 Publish README, limitations, and contributor guide`

Acceptance criteria:

- README explains purpose, local-first design, safety limits, and setup.
- Limitations page covers pose accuracy, camera setup, and non-medical scope.
- Contributor guide explains task workflow, testing, licenses, and SBOM
  expectations.
- Trademark/non-affiliation disclaimer is visible.

## Sensitivity Classification

SS-016 is safety-, privacy-, legal/trademark-, medical-scope-, compliance-,
licensing/SBOM-, docs-claim-, and user-facing-copy-sensitive. It requires
Codex-owned research/spec drafting, Adopt / Revise / Defer / Reject
dispositions, a self-contained Claude QA planning handoff, and Claude gate
clearance before implementation.

## Disposition

| Recommendation or finding | Decision | Rationale |
| --- | --- | --- |
| Publish a README that reflects the current MVP rather than SS-001-only state. | Adopt | Acceptance requires README purpose, local-first design, safety limits, and setup. Current README is outdated relative to later stories. |
| Present Swing Sync as an AI golf swing analysis coach without qualification. | Revise | The package description uses that phrase, but public README copy should immediately qualify the app as local-first and educational, with non-medical and non-professional-coaching limits. |
| Claim raw swing video always stays private, anonymous, deleted, encrypted, or never leaves the device. | Reject | Project policy permits only default local-first/no-upload wording and explicitly prohibits absolute privacy, anonymity, deletion, security, legal, and compliance claims. |
| State raw swing video is not uploaded by default and remote sharing requires separate explicit opt-in. | Adopt | This is the durable privacy architecture boundary and must be visible in public docs. |
| Add or imply telemetry, hosted analytics, remote logging, cloud diagnostics, cloud storage, hidden identifiers, or persistent debug artifacts. | Reject | SS-016 is documentation-only. Debugging wording must be limited to existing local test output, browser devtools, sanitized UI status/error codes, and CI/browser failure artifacts. |
| Create a limitations page covering pose accuracy, camera setup, and non-medical scope. | Adopt | Direct acceptance criterion. The page should also clarify that fixture and smoke-test success does not prove real-world swing accuracy or safety. |
| Make medical, injury, rehabilitation, pain-triage, professional coaching, guaranteed correctness, or injury-prevention claims. | Reject | Blocked by `docs/safety-terms.md` and sensitive-story rules. |
| Provide setup commands using Node 22 and current npm scripts. | Adopt | Matches `.nvmrc`, package scripts, CI expectations, and AGENTS.md verification rules. |
| Document contributor workflow across Notion, `CONTEXT.md`, sensitive-story gates, testing, licenses, fixtures, and SBOM. | Adopt | Direct acceptance criterion and necessary to keep future work synchronized. |
| Add new runtime dependencies, model/provider SDKs, camera capture, workers, telemetry, or remote-sharing behavior for SS-016. | Reject | SS-016 is a docs story. Runtime or dependency changes require separate review and expanded verification. |
| Put a visible trademark/non-affiliation disclaimer in public docs. | Adopt | Direct acceptance criterion. Wording should be narrow: no affiliation, endorsement, sponsorship, or approval is implied. It should not overstate legal conclusions or claim trademark ownership analysis is complete. |
| Treat the public README/limitations/trademark wording as legal-approved release text. | Reject | Existing safety and privacy docs remain draft/human-review oriented. SS-016 should flag that separate human/legal review remains a pre-release gate for public promotion. |
```

File: `docs/ss-016-preimplementation-spec.md`

```markdown
# SS-016 Preimplementation Spec

Status: candidate spec for Claude QA planning. Implementation remains blocked
until Claude QA planning returns PASS or blocking findings are resolved and
re-reviewed.

## Scope

SS-016 publishes public-facing project documentation for Swing Sync without
changing runtime behavior.

In scope:

- update `README.md` to explain purpose, current MVP state, local-first design,
  setup, verification, safety limits, privacy boundaries, and visible
  trademark/non-affiliation language;
- add a limitations page that covers pose accuracy, camera setup, non-medical
  scope, confidence/warnings, fixture limitations, export boundaries, and
  remote-sharing boundaries;
- add a contributor guide that explains the task workflow, Notion and
  `CONTEXT.md` synchronization, sensitive-story roles, Claude gates, testing,
  license checks, fixture policy, dependency review, model/provider review,
  SBOM expectations, and PR checklist alignment; and
- update internal context and Notion state as the story progresses.

Out of scope:

- runtime behavior changes;
- new dependencies, SDKs, provider integrations, model/provider assets, workers,
  camera capture, service workers, API routes, secrets, telemetry, hosted
  analytics, remote logging, cloud diagnostics, cloud storage, hidden
  identifiers, raw media fixtures, or remote-sharing changes;
- claiming legal approval, trademark clearance, medical safety, injury
  prevention, guaranteed correctness, guaranteed privacy, guaranteed deletion,
  anonymity, regulatory compliance, or professional coaching equivalence.

## Required Documentation Contracts

### README

`README.md` must include a purpose statement, current capability summary,
local-first statement, setup commands, verification commands, links to policy
docs, safety and non-medical disclaimer, and visible trademark/non-affiliation
disclaimer.

### Limitations Page

Create `docs/limitations.md`. It must cover pose-estimation limits,
camera/setup guidance, non-medical and non-professional-coaching scope,
fixture/test limitations, privacy/export limits, and optional remote review
limits.

### Contributor Guide

Create `CONTRIBUTING.md` unless Claude identifies a stronger repository-local
placement. It must cover `AGENTS.md`/`CONTEXT.md`, Notion task confirmation,
branching, sensitive-story gates, Claude audit, testing, license and SBOM
expectations, fixture and model/provider review, PR checklist requirements, and
observability wording.

## Trademark / Non-Affiliation Wording

Candidate visible wording:

> Swing Sync is an independent open-source project. It is not affiliated with,
> endorsed by, sponsored by, or approved by any golf equipment maker, tour,
> league, training organization, model provider, or platform vendor. Third-party
> names, if referenced, belong to their respective owners.

Do not say trademark clearance is complete. Keep `docs/licensing.md` language
that a preliminary trademark search remains required before broad public
promotion.

## Verification Plan

Before PR:

- `npm run build`
- `npm run compliance:verify`
- `npm run safety:verify`
- `npm run privacy:verify`
- `git diff --check`

Run `npm run license:audit`, `npm run verify:bundle-license-fixture`, and
`npm run sbom:generate` only if dependency, bundle, notice, license-policy, or
SBOM behavior changes.
```

Verification:
- No SS-016 implementation has been started.
- Notion task SS-016 was moved from `0. Backlog` to
  `1. Spec Drafting (Gemini)` for board compatibility. Codex is acting as
  research/spec owner.
- Dedicated Notion test case `SS-TC-020` was created:
  https://app.notion.com/p/390834a0c8a6810e85ccd2ffeff645bb
- Local branch is `ss-016-docs` from synchronized `main`.

Known non-goals:
- Do not implement README, limitations, or contributor-guide changes before
  this QA planning gate passes or blockers are resolved and re-reviewed.
- Do not add runtime behavior, telemetry, logging, analytics, dependencies,
  model/provider integrations, camera capture, workers, service workers, cloud
  storage, remote sharing, raw media fixtures, or API routes.
- Do not convert draft safety/privacy/legal language into claims of legal
  approval or compliance.

Output required:
- PASS/FAIL verdict for implementation start.
- Blockers ordered by severity, with exact missing contract/test/doc language.
- Non-blocking recommendations separated from blockers.
- Missing protected-boundary checks or prohibited-claim risks.
- Required verification changes before implementation or PR.
- Explicit sign-off status for whether Codex may begin SS-016 docs
  implementation.

## END
