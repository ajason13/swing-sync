# Swing Sync Context

Last updated: 2026-06-10

## Current State

- Repository: https://github.com/ajason13/swing-sync
- Default branch: `main`
- Latest merged PR: https://github.com/ajason13/swing-sync/pull/5
- Latest merge commit: `1d4aaea207c57f93bf7aa3c96d56cf58059d603a`
- Current completed task: `SS-004 Scaffold mobile-first PWA and local analysis shell`

## Completed Foundation

SS-001 established the project compliance baseline:

- Apache-2.0 root license and project NOTICE.
- Dependency license policy in `docs/licensing.md`.
- Model licensing placeholder and no-model-binary policy in `docs/models-licensing.md`.
- Root `THIRD_PARTY_NOTICES.md`.
- CycloneDX SBOM generation to `docs/sbom.json`.
- GitHub Actions compliance workflow on Node 22.
- Synthetic license fixtures for GPL, MPL, and MIT policy checks.
- Production-scoped NOTICE aggregation with deterministic fixture validation.
- Bundle license validation with a synthetic bundled GPL package.

## Verification Baseline

PR #1 passed GitHub Actions:

- Workflow: `Dependency and License Compliance`
- Run: https://github.com/ajason13/swing-sync/actions/runs/26996587662
- Result: success

Expected local commands:

```bash
nvm use
npm ci
npm run license:audit
npm run verify:bundle-license-fixture
npm run sbom:generate
npm run build
npm run compliance:verify
```

## Next Task

`SS-005 Integrate MediaPipe Pose Landmarker in browser video mode` is next in
the delivery workflow on branch `ss-005-mediapipe-pose`.

Acceptance criteria from Notion:

- Pose Landmarker loads without blocking the UI.
- Landmarks are extracted for fixture video frames.
- Confidence/visibility metadata is retained.
- Network activity is not required after model assets are available.

SS-005 is a sensitive model/SDK, privacy, licensing, and compliance story.
Gemini research/spec disposition and Claude QA planning are required before
implementation. The current `SS-TC-005` Notion test case describes swing-phase
correction rather than Pose Landmarker integration and must be corrected or
replaced before claiming acceptance coverage.

SS-005 coordination status through 2026-06-07:

- Local `main` was confirmed current at `bf650f2`, including PR #5 merge
  `1d4aaea` and post-merge context commit `57cda37`.
- Branch `ss-005-mediapipe-pose` was created from updated `main`.
- Notion acceptance criteria, branch, empty PR field, and initial
  `0. Backlog` status were reconfirmed. The task moved to
  `1. Spec Drafting (Gemini)`.
- `SS-TC-005` was confirmed invalid for this story. `SS-TC-001` provides
  complementary local extraction/no-upload coverage but does not cover all
  SS-005 criteria. Dedicated `SS-TC-009` was created for non-blocking loading,
  metadata retention, timestamps, cleanup, and post-asset network assertions.
- The self-contained Gemini Deep Research handoff is
  `docs/ss-005-gemini-research-prompt.md`.
- `docs/ss-005-research-disposition.md` records initial primary-source checks
  and Codex Adopt / Revise / Defer / Reject decisions after the Gemini
  response.
- Research handoff commit: `b0a6dca` (`Prepare SS-005 research handoff`).
- Pre-handoff verification passed on Node 22: `npm run build`,
  `npm run compliance:verify`, and `git diff --check`.
- Gemini returned a conditional-GO proposal, but Codex rejected its conclusion
  that every blocker was resolved. Current MediaPipe terms explicitly describe
  provider metrics and informed-consent responsibility; the inspected exact
  0.10.35 npm tarball contains compiled WASM and lacks packaged LICENSE/NOTICE
  files; explicit model redistribution/local-serving/caching rights were not
  established; and no generated fixture/provenance exists.
- Exact `@mediapipe/tasks-vision@0.10.35` and Pose Landmarker Full float16
  version 1 are blocked candidates, not approved dependencies/assets.
- `docs/models-licensing.md`, `docs/licensing.md`, and
  `docs/privacy-architecture.md` record the current provider-metrics,
  compiled-binary, model-rights, consent, and network-behavior gates.
- Claude pre-implementation QA-planning handoff:
  `docs/ss-005-claude-qa-planning-prompt.md`.
- Notion moved to `2. QA Planning (Claude)`. Implementation remains blocked
  pending Claude's response and closure of every implementation-start blocker.
- Gemini disposition and Claude QA-planning handoff commit: `48a7376`.
- Claude QA Planning returned FAIL with six implementation-start blockers.
  Codex accepted the provider-metrics, compiled-binary, model-rights, fixture,
  worker-contract, responsiveness-contract, and tracker-coverage concerns while
  revising technically overbroad recommendations.
- `docs/ss-005-preimplementation-spec.md` now defines the normative scope,
  conservative maintainer decisions, exact candidate result schema, worker
  protocol, fixture provenance, network phases, responsiveness behavior, and
  implementation-start gate.
- Exact 0.10.35 API verification corrected the metadata contract: returned
  normalized/world landmarks expose `x`, `y`, `z`, and `visibility`, but not
  per-landmark `presence`. Presence remains a configured threshold.
- `docs/ss-005-claude-qa-response.md` records each finding as accepted, revised,
  or fixed. SS-005 remains `2. QA Planning (Claude)`.
- `SS-TC-009` was revised in Notion to match the exact candidate API, worker
  contract, network phases, fixture prerequisite, responsiveness behavior, and
  cleanup/privacy coverage.
- Focused Claude QA re-review handoff:
  `docs/ss-005-claude-qa-rereview-prompt.md`.
- Post-Claude-response Node 22 verification passed: `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, `npm run sbom:generate`, and
  `git diff --check`.
- Claude QA findings response and focused re-review handoff commit: `4d616ee`.
- Claude focused QA re-review returned FAIL while confirming the revised
  technical specification is sound. Worker contract, responsiveness contract,
  revised `SS-TC-009`, absence of returned per-landmark presence, and wrapper
  timestamp behavior are closed.
- Four blockers remain open: provider metrics decision, compiled-binary
  obligations/notices, model rights/delivery, and an approved empirically
  validated fixture/provenance record. Fixture validation depends on resolution
  of the provider/model blockers.
- On 2026-06-10, the maintainer supplied a response attributed to Google stating
  that the current Web SDK has no telemetry, future aggregated usage/performance
  telemetry is planned, current Web SDKs are Apache-2.0, and the exact Pose
  Landmarker Full float16 version 1 URL is Apache-2.0.
- `docs/ss-005-google-provider-response.md` records the response and Codex
  disposition. It materially supports closure of provider-metrics, SDK-license,
  and model-rights blockers, but durable response provenance and explicit
  maintainer compliance approval are still required before reliance.
- Proposed exact-version policy: pin `@mediapipe/tasks-vision@0.10.35`, require
  fresh review for every upgrade, fail closed on any unexpected external
  request, distribute Apache-2.0 text and third-party attribution, and vendor
  the exact model same-origin with a pinned hash. Runtime provider fetch is not
  approved; service-worker caching remains separate.
- `docs/ss-005-claude-qa-rereview-response.md` records the focused result.
- The pre-implementation spec now tracks the deferred production response to an
  observed provider-metrics request. No behavior may silently allow, block, or
  ignore it before the provider decision is approved.
- Post-focused-re-review Node 22 verification passed: `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, `npm run sbom:generate`, and
  `git diff --check`.
- Focused Claude QA re-review result commit: `c4f961e`.
- Post-disposition Node 22 verification passed: `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, `npm run sbom:generate`, and
  `git diff --check`.
- No SDK dependency, model/WASM asset, fixture video, runtime implementation,
  or asset fetch/cache behavior has been added.
- Observability decision: use only local, sanitized lifecycle/error states
  needed to debug initialization and inference. Do not log raw frames,
  landmarks, media characteristics, or sensitive user data.

Next owner: maintainer/human compliance decision maker. Record durable
provenance for Google's response and explicitly approve or reject reliance on
its current-Web-no-telemetry and Apache-2.0 statements, including packaged
compiled artifacts and missing package files. Then approve and empirically
validate a generated fixture and return the result for a third focused Claude
QA review. Do not begin implementation.

## Completed Task

`SS-004 Scaffold mobile-first PWA and local analysis shell` merged in
[PR #5](https://github.com/ajason13/swing-sync/pull/5) on 2026-06-06.

Acceptance criteria from Notion:

- App opens directly to capture/upload analysis flow.
- Layout works on mobile and desktop.
- Includes placeholder states for capture, processing, review, and export.
- Basic unit and smoke test setup exists.

SS-004 implementation status through 2026-06-06:

- The app opens directly to a responsive capture/upload workflow rather than a
  marketing page.
- Capture/upload, processing, review, and export are clearly labeled
  placeholders and do not access, store, analyze, export, or remotely share
  video.
- The existing local safety acknowledgement and runtime guard continue to block
  the first analysis action path until consent is checked.
- PWA scaffold metadata and a same-origin navigation shell service worker are
  included without adding remote endpoints.
- Vitest unit coverage validates the workflow model. Playwright smoke coverage
  validates the fail-closed consent path, all placeholder states, and mobile
  viewport overflow across desktop and Pixel 5 projects.
- Desktop and Pixel 5 full-page screenshots were reviewed with no text/control
  overlap; the mobile workflow navigation was revised to show all four states.
- Final Node 22 verification passed: `npm run test:unit`,
  `npm run test:smoke`, `npm run build`, `npm run compliance:verify`,
  `npm run license:audit`, `npm run verify:bundle-license-fixture`,
  `npm run sbom:generate`, `npm audit --omit=dev --audit-level=high`, and
  `git diff --check`.
- Observability is intentionally unchanged. SS-004 adds no telemetry, remote
  logging, remote calls, video handling, model behavior, or remote sharing.
- PR #5 created: https://github.com/ajason13/swing-sync/pull/5
- A self-contained voluntary Claude Chat adversarial audit handoff is available
  at `docs/ss-004-claude-audit-prompt.md`. It embeds the current runtime, PWA,
  test, configuration, protected-boundary, and verification context because
  Claude Chat has no filesystem or GitHub access.
- Claude returned `PASS WITH MINOR FIXES` and conditional merge approval. The
  three required fixes were applied: consent storage failures now fail closed,
  the runtime guard reports inline and focuses the acknowledgement, and the
  incomplete service-worker offline cache was removed.
- Blocker-linked Playwright coverage was added for storage denial and the
  accessible runtime guard. A storage-failure latch and removal-failure
  regression case ensure previously stored consent cannot remain active after a
  failed removal. Final verification after fixes passed with 12 smoke cases, 2
  unit cases, build, compliance, license, bundle-fixture, SBOM, and diff checks.
- The original audit prompt is marked superseded. Use the focused
  `docs/ss-004-claude-rereview-prompt.md` for Claude's final sign-off.
- Claude focused re-review returned PASS. All three prior blockers are closed,
  no new merge blockers were introduced, and Claude approved SS-004 for merge.
- The final GitHub Actions compliance run passed after Claude sign-off.
- PR #5 merged with merge commit
  `1d4aaea207c57f93bf7aa3c96d56cf58059d603a`.
- Observability remains unchanged because SS-004 adds no telemetry, remote
  logging, remote calls, real video handling, model behavior, or remote sharing.

## Completed Task

`SS-003 Define privacy architecture and video data lifecycle` merged in
[PR #3](https://github.com/ajason13/swing-sync/pull/3) on 2026-06-06.

SS-003 status through 2026-06-06:

- Gemini Deep Research response received and distilled into
  `docs/ss-003-research-disposition.md`.
- Primary-source checks were recorded for browser storage, OPFS, persistent
  storage, WebKit tracking prevention, CSP, and MediaPipe policy references.
- Initial Claude adversarial review returned PASS WITH MINOR FIXES: clarify the
  consent-copy cross-checks in `scripts/verify-privacy-boundaries.js` and widen
  prohibited-endpoint scanning beyond `src/main.ts`.
- Claude blocker fixes were applied: the verifier now labels inherited SS-002
  consent scaffold checks, recursively scans `src/**` and `scripts/**` while
  excluding its own pattern-list file, records Sentry as blocked pending privacy
  review, clarifies Class G scaffold scope, and defers fail-closed verifier
  assertions until a real network/API boundary exists.
- Claude focused re-review returned PASS. Both blockers are closed, no new
  blockers were introduced, and Claude approved SS-003 for PR creation.
- Final pre-PR verification passed: `npm run privacy:verify`,
  `npm run compliance:verify`, `npm run build`, and
  `git diff --cached --check`.
- PR #3 created: https://github.com/ajason13/swing-sync/pull/3
- PR #3 merged with merge commit
  `28341d6df34774805fab341f342500d583c0986b`.
- Observability remains unchanged because SS-003 adds no runtime video,
  storage, network, model, telemetry, or remote-sharing behavior.

`SS-002 Draft sports injury waiver and educational-use terms` merged in
[PR #2](https://github.com/ajason13/swing-sync/pull/2) on 2026-06-05.

Acceptance criteria from Notion:

- Draft assumption-of-risk and release-of-liability language for review.
- State feedback is educational and not medical or professional athletic instruction.
- Define consent gate before first analysis.
- Add prompt constraints that avoid diagnosing pain or prescribing unsafe movements.

Planned/active artifacts:

- `docs/safety-terms.md`: product-compliance draft language for human/legal
  review, including assumption of risk, release of liability, educational-use
  boundaries, local-first privacy, consent-gate requirements, prompt
  constraints, and a review checklist.
- `src/main.ts`: minimal first-analysis consent gate scaffold that stores only
  local acknowledgement state.
- `scripts/verify-safety-terms.js`: safety-boundary regression checks wired
  into `npm run compliance:verify`.
- `docs/ss-002-research-disposition.md`: Gemini Deep Research disposition,
  separating adopted guidance from revised, deferred, or rejected
  recommendations.

SS-002 verification on 2026-06-05:

- `npm run safety:verify` passed.
- `npm run build` passed.
- `npm run compliance:verify` passed.
- `git diff --check` passed.
- Gemini Deep Research response received and distilled into
  `docs/ss-002-research-disposition.md`.
- Initial Claude audit returned conditional pass with two blockers: add a runtime
  consent check in the analysis click handler, and strengthen
  `scripts/verify-safety-terms.js` to avoid false confidence.
- Claude re-review returned PASS and granted sign-off for PR creation after the
  blocker fixes.
- PR #2 created: https://github.com/ajason13/swing-sync/pull/2
- Claude PR review returned APPROVED FOR MERGE with no blockers. Remaining
  notes are future-story items: verifier regex maintenance, unit tests for
  consent helpers once a real analysis pipeline exists, adversarial prompt tests
  for the first AI coaching pipeline, and private-browsing consent UX.

Remaining SS-002 pre-release gate:

- Legal/human review of draft assumption-of-risk and release-of-liability copy
  remains pending before public release.

## Persistent Learnings

- For safety, legal, medical, or compliance-sensitive stories, keep
  multi-agent roles explicit: Gemini for research/spec disposition, Codex for
  implementation and repo hygiene, and Claude for adversarial audit/re-review.
- Treat external model research as input, not implementation authority. Record
  adopted, revised, deferred, and rejected recommendations in a disposition file
  when research is broad or over-scoped.
- Avoid absolute claims in product safety/privacy copy. Prefer scoped language:
  draft only, not legal advice, no enforceability guarantee, local-first by
  default, and separate explicit opt-in before any remote sharing.
- For consent gates, use both UI gating and a runtime guard on the action path.
  `localStorage` acknowledgement is acceptable only as a scaffold unless legal
  review asks for durable consent records.
- Safety verifiers should check required user-facing copy and prohibited claim
  patterns. Exact phrase checks alone create false confidence.
- Future AI-coaching stories should convert deferred adversarial prompts into
  tests before any model output is exposed.
- Browser-chat research and audit prompts must embed any required repository
  context because Gemini and Claude Chat do not have filesystem or GitHub
  access.
- Initial audit prompts may include broad context, but re-review prompts should
  contain only prior findings, applied fixes, relevant current snippets, and a
  focused diff. Duplicating full contents and a full diff can cause the auditor
  to treat the handoff as repeated stale input.
- Keep the original audit prompt and focused re-review prompt in separate,
  clearly named files. Mark superseded prompt files with a do-not-paste
  redirect.

## Operating Notes

- Keep legal language framed as product/compliance drafting, not legal advice.
- Preserve the local-first privacy posture: no raw swing video upload by default.
- User-facing safety copy should be clear, plain, and explicit before analysis.
- Any connected model or coaching prompt must avoid medical diagnosis, pain triage, or aggressive mechanical prescriptions.
- Observability: SS-002 adds no runtime logging, telemetry, remote calls, or raw
  video handling. Consent acknowledgement is local-only browser state.
