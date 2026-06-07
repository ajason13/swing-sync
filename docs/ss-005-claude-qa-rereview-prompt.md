# SS-005 Claude Focused QA Re-Review Prompt

Paste this prompt into Claude Chat to re-review the specification response to
the initial SS-005 QA Planning FAIL. This is not implementation or final audit.

## Prompt

Role: You are the lead adversarial QA planner re-reviewing Swing Sync SS-005.

Stage: Focused pre-implementation QA re-review after your initial FAIL.

Return:

- PASS or FAIL for the revised specification response;
- which prior findings are closed, partially closed, or open;
- any new specification blocker;
- whether the remaining provider/rights/fixture blockers are accurately stated;
  and
- explicit instruction to remain at `2. QA Planning (Claude)` or permission to
  move to `3. In Development (ChatGPT)`.

Do not write implementation. Distinguish legal/product decisions from technical
tests. Claude Chat has no filesystem access; use only this embedded context.

## Prior Verdict And Findings

You returned FAIL and identified:

- B-1 provider metrics terms;
- B-2 dependency and compiled-binary obligations;
- B-3 model bundle rights/delivery;
- B-4 fixture provenance;
- B-5 missing worker contract;
- B-6 missing responsiveness contract; and
- B-7 stale `SS-TC-009`.

You also requested decisions for provider metrics, model delivery, SDK version,
fixture generation, network-criterion precision, and responsiveness.

## Codex Response

Accepted:

- B-1, B-3, and B-4 remain implementation-start blockers.
- B-2 remains blocked on compiled-binary obligations/notices and provider terms.
- A reproducibly generated, non-identifying fixture with reviewed provenance is
  required.
- Network tests must separate asset-load, post-ready, offline-from-start, and
  optional service-worker phases.
- Raw frames/resources remain volatile/local and sensitive diagnostics are
  prohibited.

Revised:

- Current `npm run license:audit` checks npm metadata and would likely accept
  the package's Apache-2.0 declaration; passing that automated check would not
  resolve compiled-WASM rights/notices.
- `npm run verify:bundle-license-fixture` checks rejection of a synthetic GPL
  package. It does not validate a MediaPipe NOTICE.
- A geometric/stick-figure or FFmpeg-generated fixture is not automatically
  approved and may not be detectable. Generator/tool/output rights and
  empirical expected behavior are required.
- Responsiveness uses a deterministic UI heartbeat/input behavior as the gate.
  Browser long-task entries are diagnostic, not a universal zero-long-task
  threshold.

Additional correction:

- Exact `@mediapipe/tasks-vision@0.10.35` declarations expose `x`, `y`, `z`,
  and `visibility` on normalized/world landmarks. They do not expose
  per-landmark `presence`.
- `minPosePresenceConfidence` is a configuration threshold, not returned
  per-landmark metadata.
- The result wrapper echoes the input timestamp because the candidate
  `PoseLandmarkerResult` does not itself expose a timestamp.

## Normative Revised Specification

### Current Decisions

- MediaPipe's documented provider metrics are incompatible with Swing Sync's
  approved local-first boundary unless human/legal review approves exact
  disclosure/consent terms or a different candidate is selected.
- Exact `@mediapipe/tasks-vision@0.10.35` and Pose Landmarker Full float16
  version 1 remain blocked candidates.
- No model commit/vendor/serve/cache/download method is approved.
- No fixture or fixture generator is approved.
- Successful initialization/inference must not require or attempt unexpected
  external activity after approved same-origin assets are local. Tests report
  observed behavior and do not claim impossibility.

### Worker Contract

States:

`uninitialized -> initializing -> ready -> processing -> ready`

Terminal:

- `error`: any initialization, inference, protocol, timestamp, or worker failure;
- `torn-down`: teardown completed and worker terminated.

Main-to-worker:

- `init`: approved runtime/model configuration and integrity metadata;
- `frame`: transferable `ImageBitmap` plus finite, non-negative, monotonically
  increasing `timestampMs`, only in `ready`;
- `teardown`: any non-terminal state.

The main thread owns backpressure, permits at most one in-flight frame, and
closes/drops a newly created bitmap rather than posting while busy.

Worker-to-main:

- `ready`;
- `result` with input timestamp and complete normalized/world arrays;
- `frame-dropped` with sanitized reason;
- `init-error` with stable sanitized code;
- `inference-error` with stable sanitized code and optional timestamp; and
- `torn-down`.

Invalid protocol/timestamp and worker `error`/`messageerror` fail closed. Every
owned bitmap closes in `finally`. Teardown closes the task, releases references,
acknowledges completion, and terminates the worker. No degraded inference
continues after error.

### Result Contract

- Preserve all returned poses and all 33 landmarks per detected pose.
- Preserve returned `x`, `y`, `z`, and `visibility` without filtering,
  rounding, or invented guarantees.
- Record configured detection/presence/tracking thresholds separately.
- Do not invent returned `presence`.
- Wrap each result with input `timestampMs`.

### Fixture Contract

Before use/commit, record:

- tool/generator exact version and license;
- reproducible source/script or command;
- deterministic inputs/seed;
- dimensions, duration, frame rate, SHA-256;
- no-real-person declaration;
- output copyright/license decision; and
- empirically validated expected structural behavior.

### Network Contract

1. Load phase permits only documented approved same-origin assets.
2. Post-ready phase blocks/records every request; successful fixture inference
   completes with no attempted request.
3. Offline-from-start phase blocks external activity from navigation start with
   approved local assets already available.
4. Repeat with production service worker only if caching is approved.

Evidence is scoped to controlled observed runs.

### Responsiveness Contract

- A deterministic main-thread heartbeat/input action scheduled after
  initialization starts must complete before worker `ready`.
- UI exposes loading state and remains interactive.
- Long-task entries are captured for diagnosis but are not a hard universal
  zero-long-task gate.

## SS-TC-009 Revision

The tracker now requires:

- complete 33-landmark normalized/world arrays with returned `x`, `y`, `z`,
  and `visibility`; no invented per-landmark presence;
- configured threshold retention separately;
- valid and invalid/non-monotonic timestamp cases;
- init/inference/protocol/worker failure and teardown paths;
- deterministic UI heartbeat/input responsiveness;
- load/post-ready/offline network phases;
- production CSP/worker/WASM/base-path coverage;
- object URL, bitmap, task, worker, storage, and cache cleanup;
- no sensitive console/log output; and
- an approved fixture/provenance prerequisite.

## Remaining Implementation-Start Blockers

- human/legal/product decision on MediaPipe provider metrics and consent;
- exact SDK compiled-binary obligations/notices;
- exact model rights and permitted delivery mechanism;
- approved fixture and provenance; and
- Claude PASS after those blockers are closed.

No SDK, WASM, model, fixture, CSP, service-worker cache, or runtime
implementation has been added. The story remains `2. QA Planning (Claude)`.
