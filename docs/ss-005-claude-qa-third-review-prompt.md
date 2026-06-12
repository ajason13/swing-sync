# SS-005 Claude Third Focused QA Review Prompt

Paste this prompt into Claude Chat for the third focused pre-implementation
review. This is the implementation-start gate, not the final implementation
audit.

## Prompt

Role: You are the lead adversarial QA planner performing the third focused
pre-implementation review for Swing Sync SS-005.

Stage: Focused review after maintainer approval, public provider evidence, and
empirical fixture validation. No application implementation has started.

Return:

- PASS or FAIL for moving SS-005 from `2. QA Planning (Claude)` to
  `3. In Development (ChatGPT)`;
- whether prior blockers B-1, B-2, B-3, and B-4 are closed, partially closed,
  or open;
- any new implementation-start blocker, ordered by severity;
- whether the exact SDK/model rights decisions and fixture evidence are
  adequate for implementation to begin;
- non-blocking recommendations clearly separated from blockers; and
- explicit sign-off instruction to remain at `2. QA Planning (Claude)` or
  permission to move to `3. In Development (ChatGPT)`.

Attack assumptions and identify fail-open behavior, but do not write
implementation. Distinguish implementation verification work from evidence
that must exist before implementation starts. Claude Chat has no filesystem or
GitHub access; use only this embedded context.

## Story And Acceptance Criteria

Story: `SS-005 Integrate MediaPipe Pose Landmarker in browser video mode`

Branch: `ss-005-mediapipe-pose`

Current tracker status: `2. QA Planning (Claude)`

Pull request: none

Acceptance criteria:

- Pose Landmarker loads without blocking the UI.
- Landmarks are extracted for fixture video frames.
- Confidence/visibility metadata is retained.
- Network activity is not required after model assets are available.

SS-005 is privacy-, model-provider-, model-asset-, licensing-, and
compliance-sensitive. Raw video remains local and volatile. No remote model
API, telemetry, remote logging, cloud storage, or remote sharing is allowed in
scope.

## Prior Focused Review Result

Your prior focused review returned FAIL but found the revised specification
technically sound. You closed:

- B-5 worker message/state/error contract;
- B-6 deterministic UI-heartbeat responsiveness contract;
- B-7 revised `SS-TC-009`;
- NF-1 correction that exact 0.10.35 does not return per-landmark `presence`;
  and
- NF-2 wrapper responsibility for echoing input timestamps.

You left open:

- B-1 provider metrics terms and human/legal/product decision;
- B-2 compiled-binary obligations/notices;
- B-3 model rights and permitted delivery;
- B-4 empirically validated fixture/provenance; and
- a required third focused Claude review after those blockers close.

## Durable Provider Evidence And Maintainer Decision

Public MediaPipe issue:

`https://github.com/google-ai-edge/mediapipe/issues/6306`

Provider response from repository collaborator `schmidt-sebastian`:

`https://github.com/google-ai-edge/mediapipe/issues/6306#issuecomment-4673728357`

The public issue explicitly asks about exact
`@mediapipe/tasks-vision@0.10.35` and exact model:

`https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task`

Google's response states:

- the current Web SDK does not include telemetry;
- future performance and aggregated usage telemetry is planned;
- input data will not be sent to Google;
- no opt-out is currently planned, but applications may block outgoing
  requests or the destination host and continue using the SDK normally;
- the exact Pose Landmarker model URL above is released under Apache-2.0;
- current Web SDKs are Apache-2.0 as noted on npm; and
- future npm packages will include NOTICE and LICENSE files.

On 2026-06-11, the maintainer explicitly approved reliance on this public
provider response for:

- exact `@mediapipe/tasks-vision@0.10.35`;
- the exact package's compiled artifacts despite missing packaged LICENSE and
  NOTICE files;
- the exact Pose Landmarker Full float16 version 1 model;
- same-origin model vendoring and serving;
- Apache-2.0 license text and third-party attribution handling;
- fail-closed handling of any unexpected external request; and
- mandatory fresh license, privacy, provider-metrics, and network review before
  every SDK upgrade.

Approved delivery decisions:

- Pin exact `@mediapipe/tasks-vision@0.10.35`.
- Vendor and serve the exact model same-origin with its source URL, pinned
  SHA-256, Apache-2.0 license text, and attribution.
- Runtime provider model fetch is not approved.
- Service-worker model caching remains a separate implementation decision.
- Unexpected external requests fail closed pending investigation. The
  production response must not silently allow, block, or ignore observed
  provider-metrics activity.

Codex considers B-1, B-2, and B-3 closed by the durable evidence plus explicit
maintainer compliance approval. This is a project compliance decision, not a
claim that the evidence is a legal opinion or that future SDK versions have the
same behavior or terms.

## Approved Fixture And Empirical Validation

Approved fixture:

`test/fixtures/pose-landmarker/mannequin-golf-address.webm`

Committed source:

`test/fixtures/pose-landmarker/mannequin-source.png`

The source is an AI-generated image of a clearly synthetic, faceless wooden
artist mannequin. It contains no recording of a real person, no real-person
face, and no known biometric or personal data. It was generated through
OpenAI's Codex `imagegen` tool. Swing Sync distributes the source and derived
fixture under Apache-2.0, subject to applicable OpenAI generated-output terms.

The committed source PNG is the fixed deterministic input. FFmpeg 8.1.1 with
`libvpx-vp9` deterministically derives the WebM. The provenance record contains
the exact prompt, derivation command, tool/version, output properties, hashes,
no-real-person declaration, output license decision, empirical validation, and
limitations.

Fixture properties:

- VP9, 640 x 360, 10 fps, 2 seconds, no audio;
- source PNG SHA-256:
  `b5d2a9d4eef284997d49826e1b177ecfa6cce7b439ae0973b307d65bf3e7c605`;
- WebM SHA-256:
  `e52dc416e1196ecd064972a606cc8e488cd46844a0644197735cca1c177ad390`;
  and
- validation model SHA-256:
  `5134a3aad27a58b93da0088d431f366da362b44e3ccfbe3462b3827a839011b1`.

Empirical validation used a disposable browser harness outside the repository
with exact `@mediapipe/tasks-vision@0.10.35`, same-origin package WASM, and the
exact approved model. It configured `runningMode: "VIDEO"` and called
`detectForVideo()` using monotonically increasing media timestamps.

Observed results:

| Timestamp | Normalized landmarks | World landmarks | Normalized visibility range |
| --- | ---: | ---: | --- |
| 0 ms | 33 | 33 | 0.5057702661 to 0.9999644756 |
| 500 ms | 33 | 33 | 0.4956441224 to 0.9999638796 |
| 1000 ms | 33 | 33 | 0.4965527654 to 0.9999650121 |
| 1500 ms | 33 | 33 | 0.4880312681 to 0.9999654889 |

Approved structural expectations:

- one detected pose at the four sampled timestamps;
- exactly 33 normalized and 33 world landmarks;
- numeric returned `x`, `y`, `z`, and `visibility` retained without filtering
  or invented `presence`; and
- no fixed-coordinate or minimum-visibility assertion.

Fixture limitations:

- It is approved only for deterministic pose-extraction integration tests.
- It is not evidence of golf-swing accuracy, swing-phase detection,
  biomechanical correctness, or performance across devices.
- The disposable validation did not prove the full post-ready/offline network
  acceptance criterion. That remains required implementation verification.

Codex considers B-4 closed.

## Normative Implementation Contracts Already Closed

### Worker And Failure Contract

- Dedicated worker owns model initialization and synchronous video inference.
- Main thread permits at most one in-flight frame and drops/closes new frames
  while busy.
- Finite, non-negative, monotonically increasing media-timeline timestamps are
  required.
- Initialization, inference, protocol, timestamp, worker `error`, and
  `messageerror` failures fail closed.
- Every owned bitmap closes in `finally`.
- Teardown closes the task, releases references, acknowledges completion, and
  terminates the worker.
- No degraded inference continues after error.

### Result Contract

- Preserve all returned poses and all 33 normalized/world landmarks per pose.
- Preserve returned `x`, `y`, `z`, and `visibility` without filtering,
  rounding, or invented guarantees.
- Record configured detection/presence/tracking thresholds separately.
- Do not invent returned per-landmark `presence`.
- Wrap results with the input `timestampMs`.

### Responsiveness Contract

- A deterministic main-thread heartbeat/input action scheduled after
  initialization starts must complete before worker ready.
- UI exposes loading state and remains interactive.
- Browser long-task entries are diagnostic, not a universal hard gate.

### Network Contract

1. Load phase permits only documented approved same-origin assets.
2. Post-ready phase blocks and records every request; successful fixture
   inference completes with no attempted request.
3. Offline-from-start phase blocks external activity from navigation start
   while approved local assets are available.
4. Repeat with the production service worker only if caching is approved.

Evidence is scoped to observed controlled runs and does not claim impossibility
of future or intermittent provider behavior.

## Correct Acceptance Test Coverage

`SS-TC-009` replaces the mismatched `SS-TC-005` for this story. Its revised
contract covers:

- exact approved SDK/model and approved fixture/provenance prerequisites;
- complete normalized/world arrays and returned metadata;
- configured confidence threshold retention;
- valid and invalid/non-monotonic timestamp cases;
- initialization, inference, protocol, worker, cancellation, and teardown
  behavior;
- deterministic UI-heartbeat responsiveness;
- load, post-ready, offline-from-start, and optional service-worker network
  phases;
- production CSP, worker, WASM, and base-path behavior;
- object URL, bitmap, task, worker, storage, and cache cleanup; and
- no raw frames, landmarks, media characteristics, or sensitive user data in
  diagnostics.

## Current Repository Boundary

- No MediaPipe production dependency has been added.
- No SDK WASM or model asset has been committed or added to the application.
- No runtime, CSP, or service-worker implementation has started.
- The approved source PNG and derived fixture WebM are the only new test
  assets.
- No application observability was added; privacy-preserving local diagnostics
  remain an implementation requirement.
- Swing-phase detection, metrics, coaching, exports, and remote review remain
  out of scope.

## Focused Review Questions

1. Does the durable public Google response plus explicit maintainer compliance
   approval adequately close B-1, B-2, and B-3 for implementation to begin?
2. Does the fixture provenance and empirical exact-model validation adequately
   close B-4?
3. Is any remaining concern truly an implementation-start blocker, or should
   it instead be verified during implementation and final audit?
4. Is the approved scope sufficiently constrained to protect local-first,
   privacy, licensing, and fail-closed boundaries?
5. May SS-005 move to `3. In Development (ChatGPT)`?

End with an explicit `PASS` or `FAIL` implementation-start verdict.
