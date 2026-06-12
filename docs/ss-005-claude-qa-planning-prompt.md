# SS-005 Claude Adversarial QA Planning Prompt

Paste this prompt into Claude Chat before SS-005 implementation. Claude does not
have filesystem, Notion, or GitHub access; all required context is embedded.

## Prompt

Role: You are the lead adversarial QA planner for Swing Sync.

Stage: Pre-implementation QA planning for the sensitive story
`SS-005 Integrate MediaPipe Pose Landmarker in browser video mode`.

Your job is to attack the specification, identify fail-open behavior and
unsupported assumptions, and decide whether implementation may begin. Do not
write the implementation.

## Roles And Authority

- Gemini researched and proposed a specification.
- Codex independently verified and dispositioned the research.
- Claude owns adversarial QA planning and must identify implementation-start
  blockers.
- Codex may implement only after blocking specification/QA questions are
  resolved and the tracker moves to `3. In Development (ChatGPT)`.

## Story Acceptance Criteria

- Pose Landmarker loads without blocking the UI.
- Landmarks are extracted for fixture video frames.
- Confidence/visibility metadata is retained.
- Network activity is not required after model assets are available.

Out of scope: swing-phase detection, biomechanical metrics, coaching, overlays,
exports, remote review, remote model APIs, telemetry, remote logging, cloud
storage, and remote sharing.

## Existing Protected Boundaries

- Swing Sync is an Apache-2.0, Node 22, Vite/TypeScript PWA.
- The current app has no production dependencies and no real video/model
  processing.
- The first analysis path is fail-closed behind an existing local safety
  acknowledgement and runtime guard.
- Raw video and decoded frames must remain local and volatile. Derived
  landmarks are sensitive user data.
- Object URLs and frame/runtime resources must be released.
- No absolute privacy, deletion, safety, legal, anonymity, offline, or
  no-network claims are allowed.
- Observability must remain local and data-minimized; no raw frames, landmarks,
  media characteristics, or user identifiers may be logged.

## Tracker Coverage

- `SS-TC-005` is invalid for this story; it covers future swing-phase/manual
  correction behavior.
- `SS-TC-001` is complementary: a side-on fixture is processed locally and
  produces landmarks without raw video upload.
- Dedicated `SS-TC-009` covers non-blocking initialization, approved local
  fixture processing, presence/visibility retention, timestamps, volatile
  cleanup, and no unexpected network activity after approved assets are local.

## Gemini Proposal Summary

Gemini proposed:

- exact `@mediapipe/tasks-vision@0.10.35`;
- Pose Landmarker Full float16 version 1;
- committing/vendor-serving/caching the model and package WASM;
- worker-based inference with transferable `ImageBitmap` inputs and dropped
  frames while busy;
- CSP to block provider telemetry;
- a synthetic mannequin WebM fixture;
- retaining only 12 landmarks and discarding values below 0.5;
- Playwright external-request blocking; and
- fixed 60 FPS, sub-100 ms, 45 ms, 500-frame, and visibility-score targets.

Gemini marked every blocker resolved.

## Codex Verification And Disposition

Verified:

- Official Web guidance identifies `@mediapipe/tasks-vision`, local model paths
  or buffers, VIDEO mode, millisecond timestamps, and states
  `detectForVideo()` is synchronous/blocking and should run in a worker.
- Official guidance documents 33 normalized and world landmarks with returned
  `x`, `y`, `z`, `visibility`, and `presence`.
- Current MediaPipe API terms, last modified April 7, 2026, state that inputs
  process on-device but Solution APIs contact Google servers from time to time
  and send performance/utilization/app/input/system metadata. The terms assign
  informed-consent responsibility to the app developer:
  https://developers.google.com/edge/mediapipe/legal/tos
- npm metadata for exact 0.10.35 reports Apache-2.0 and no dependencies.
- The inspected npm tarball contains compiled WASM, lacks LICENSE/NOTICE files,
  and contains Google operational-metrics identifiers.
- No reviewed primary source explicitly grants rights to commit, vendor,
  redistribute, locally serve, or cache the proposed model bundle.
- The proposed fixture does not exist and has no generation provenance/license.

Codex disposition:

- Candidate SDK/model selection is blocked, not approved.
- Adopt a dedicated worker, bounded queue/backpressure, cancellation, teardown,
  monotonic media-timeline millisecond timestamps, transferable/closed
  `ImageBitmap` inputs, complete resource cleanup, and local sanitized states.
- Retain complete 33-landmark normalized/world arrays and returned
  presence/visibility values. Do not filter to 12 joints or discard low scores
  in SS-005.
- Prefer a generated non-identifying fixture, but require documented tool/source,
  license, provenance, reproducibility, and expected behavior before approval.
- Use CSP and network interception only as defense in depth. Do not assume local
  paths prevent telemetry or that blocking provider calls satisfies terms.
- Reject fixed performance/accuracy thresholds without an approved measurable
  contract.
- Defer service-worker caching unless needed to meet the accepted criterion.
- Preserve the existing safety acknowledgement; do not invent a privacy-consent
  screen. Provider-metrics consent is a blocking product/privacy decision.

## Current Blocking Decision Record

1. SDK: exact 0.10.35 is a candidate, blocked on provider metrics terms and
   compiled-binary obligations/notices.
2. Model: Full float16 version 1 is a candidate, blocked on variant evidence and
   model rights.
3. No model commit/vendor/serve/cache/download action is approved.
4. Same-origin local delivery is preferred only after rights/provider approval.
5. No-network proof must block and record external attempts while successful
   initialization and inference continue; intermittent "from time to time"
   behavior remains a risk.
6. Generated non-identifying video is preferred, but no fixture is approved.
7. Volatile frame lifecycle and complete 33-landmark schema are specified.
8. Worker architecture is specified, but detailed message/error/test contracts
   require QA review.

## Required Verification After Implementation Is Eventually Approved

At minimum:

- `npm run test:unit`
- `npm run test:smoke`
- new targeted model/fixture/network/resource tests
- `npm run build`
- `npm run compliance:verify`
- `npm run safety:verify`
- `npm run privacy:verify`
- `npm run license:audit`
- `npm run verify:bundle-license-fixture`
- `npm run sbom:generate`
- `git diff --check`

Production dependency, bundle notices, SBOM, model provenance, and browser
network evidence must be inspected.

## Questions You Must Answer

1. Is Codex correct that implementation must remain blocked? Identify each
   implementation-start blocker and the minimum evidence/human decision needed
   to close it.
2. Can Swing Sync use or deliberately block a provider's documented metrics
   behavior without violating provider terms or the local-first product
   boundary? Treat legal conclusions cautiously and flag human/legal review.
3. What exact test design can demonstrate the acceptance criterion "network
   activity is not required after model assets are available" without making an
   absolute claim or missing intermittent/worker/service-worker requests?
4. What worker message/state/error contract is required to fail closed on
   initialization, invalid timestamps, inference errors, cancellation, worker
   crashes, blocked requests, and cleanup failures?
5. What deterministic, non-identifying fixture approach is acceptable before a
   fixture exists? What provenance and license evidence must be recorded?
6. What assertions should validate landmark extraction and metadata retention
   without brittle coordinate/visibility thresholds?
7. What responsiveness test should replace unsupported 60 FPS/sub-100 ms
   promises on desktop and mobile Chromium?
8. Which CSP, worker, WASM, service-worker, and Vite base-path risks need tests
   or further specification?
9. Which resource cleanup and no-persistence assertions are feasible and
   meaningful in browser tests?
10. Does `SS-TC-009` need revision before implementation starts?

## Output Required

- `PASS` or `FAIL` for permission to start implementation.
- Blockers ordered by severity, each with closure evidence required.
- Required revisions to the specification and `SS-TC-009`.
- Concrete pre-implementation decisions the maintainer must make.
- Minimum unit, integration, Playwright, compliance, licensing, CSP, network,
  responsiveness, cleanup, and privacy test matrix.
- Non-blocking recommendations clearly separated from blockers.
- Explicit sign-off status: either permission to move to
  `3. In Development (ChatGPT)` or instruction to remain at
  `2. QA Planning (Claude)`.
