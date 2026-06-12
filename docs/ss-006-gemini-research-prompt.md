# SS-006 Gemini Deep Research Prompt

Paste this prompt into Gemini Deep Research before any SS-006 implementation.
Gemini provides research and a proposed specification; Codex must independently
verify and disposition the response before it becomes implementation authority.

## Prompt

You are Gemini in Deep Research mode acting as the research and specification
assistant for Swing Sync, an Apache-2.0, local-first progressive web app for
educational golf swing analysis.

Task: `SS-006 Build frame processing queue and sampling strategy`.

Important: You do not have filesystem, Notion, or GitHub access. Treat the
embedded repository context below as authoritative. Use current primary sources,
link every material claim, give source access dates, and state uncertainty
rather than guessing. Do not provide implementation code as the primary
deliverable.

## Roles And Implementation Gate

- Gemini researches and drafts the specification.
- Codex independently verifies claims, records Adopt / Revise / Defer / Reject
  decisions, implements only approved scope, verifies, and maintains repository
  and Notion state.
- Claude challenges the proposed specification and QA plan before
  implementation, then performs final adversarial audit and focused re-review.
- SS-006 is privacy-sensitive runtime work because it controls decoded frame
  images and derived landmark sets.
- Do not recommend implementation until the sampling, queue, ownership,
  cancellation, retry, output, cleanup, privacy, and QA contracts below have
  explicit answers.

## Current Repository And Tracker State

- Date at handoff: 2026-06-12.
- Current branch: `ss-006-frame-queue`, created from updated `main` commit
  `2a48417`.
- Latest merged PR:
  https://github.com/ajason13/swing-sync/pull/6
- Latest merge commit:
  `7678add7de6b946cc00328d0bef83772b1a11576`.
- Node 22; Vite 5; TypeScript; Vitest; Playwright.
- Exact approved production dependency:
  `@mediapipe/tasks-vision@0.10.35`.
- SS-006 Notion status: `1. Spec Drafting (Gemini)`.
- SS-006 expected branch: `ss-006-frame-queue`.
- SS-006 Pull Request field: empty.
- `SS-TC-006` is invalid coverage for this story. It describes Swing Card
  export leakage, not frame queue or sampling behavior.
- Dedicated `SS-TC-010` was created for deterministic bounded ordered
  processing, cancellation/retry, orientation/duration cases, timestamp/frame/
  landmark association, cleanup, stale-result rejection, and privacy-preserving
  diagnostics.

## Acceptance Criteria

- Video frames are sampled deterministically.
- Processing can be cancelled or retried.
- Queue handles long, short, portrait, and landscape videos.
- Output includes timestamps, frame images, and landmark sets.

## Existing Runtime Behavior

The current app:

- requires the existing local safety acknowledgement before first analysis;
- lets the user select a local video through an object URL;
- initializes exact approved MediaPipe Pose Landmarker in a dedicated worker;
- samples an ad hoc list derived from `[0, 0.5, 1, finalSample]`;
- seeks an `HTMLVideoElement`, creates an `ImageBitmap`, and submits one frame
  at a time;
- displays only processed-frame count and latest normalized-landmark count;
- clears pending timestamps and requests asynchronous session teardown on stop;
- revokes the selected video object URL; and
- does not persist raw video, frame pixels, or landmarks.

The current four-sample loop is not the approved SS-006 strategy. It lacks a
normative sample budget, run/session identity, stale-result rejection, complete
cancellation semantics, retry reconstruction contract, and output frame-image
ownership contract.

## Protected SS-005 Boundary

SS-005 established the approved local Pose Landmarker integration. Preserve:

- exact `@mediapipe/tasks-vision@0.10.35`;
- approved same-origin model and WASM assets with pinned hashes;
- dedicated worker VIDEO-mode inference;
- complete normalized/world landmark arrays with `x`, `y`, `z`, and
  `visibility`;
- input media timestamps wrapped onto results;
- no invented per-landmark `presence`;
- configured detection/presence/tracking thresholds recorded separately;
- finite, non-negative, strictly increasing timestamps;
- local and volatile raw frames;
- closed transferred `ImageBitmap` resources;
- revoked video object URLs and worker/task cleanup;
- fail-closed unexpected external requests;
- no telemetry, remote logging, raw-frame persistence, or landmark
  persistence; and
- the existing first-analysis safety acknowledgement.

Any SDK, model, asset, provider, or production-dependency change is outside
SS-006 and requires fresh licensing, provider-metrics, privacy, network, and
compliance review. Do not propose changing the approved MediaPipe version or
assets merely to implement the queue.

## Existing Contracts And Constraints

### Pose session and worker

- `PoseSession` owns one worker and permits at most one in-flight inference
  frame.
- `submitFrame(bitmap, timestampMs)` transfers an accepted bitmap to the worker
  and closes a bitmap rejected while the worker is not ready or busy.
- Worker inference is synchronous inside the dedicated worker.
- Worker validates finite, non-negative, strictly increasing millisecond
  timestamps.
- Worker closes each transferred bitmap in a `finally` block.
- Worker errors and main-thread worker `error`/`messageerror` fail closed.
- Recovery from a failed or closed pose session requires constructing a new
  session/worker.

### Privacy and observability

- Raw video and frame pixels must remain local by default and must not be
  uploaded.
- Frame images and landmarks are sensitive user data.
- Remote sharing, remote model APIs, telemetry, remote logging, cloud storage,
  service-worker model caching, and persistence are out of scope.
- Diagnostics must remain local, sanitized, and must not contain frame pixels,
  landmark values, media characteristics, or user identifiers.
- Do not make absolute privacy, deletion, anonymity, security, performance, or
  browser-determinism claims.

### Scope exclusions

Do not include swing-phase detection, keyframe correction, biomechanical
metrics, coaching, overlays, export, remote review, or a broad fixture-dataset
policy in SS-006.

## Required Research

Use primary sources, especially browser standards and official browser
documentation, to research and propose a specification for:

1. Deterministic timestamp sampling across short and long prerecorded videos.
   Compare practical fixed-budget/even-spacing strategies and explain why the
   recommendation is appropriate without hardware-dependent promises.
2. Exact handling of finite positive duration, zero/invalid/infinite duration,
   very short duration, fractional timestamps, millisecond conversion,
   rounding, duplicate timestamps, final-sample selection, and end-of-video
   behavior.
3. What deterministic can and cannot mean across repeated runs and browser
   engines when media seeking may resolve to nearby decodable/key frames.
   Separate deterministic requested timestamps/order from pixel-identical
   decoded-frame guarantees.
4. `HTMLMediaElement` duration/currentTime/seeking/seeked behavior and browser
   media-seeking precision or reduced-time-precision implications.
5. `createImageBitmap(video)` ownership, failure behavior, and cleanup, plus
   any relevant limits on transferable `ImageBitmap` use.
6. Portrait and landscape dimension handling. Preserve intrinsic orientation
   and aspect ratio without unnecessary resizing, stretching, or
   orientation-specific assumptions.
7. A sequential, bounded, ordered pipeline compatible with the existing
   one-in-flight `PoseSession`. Define the maximum number of frame images owned
   simultaneously and when backpressure applies.
8. Cancellation during metadata loading, seeking, bitmap creation, queued
   work, in-flight inference, result delivery, and teardown. Distinguish work
   that can be interrupted from work whose result must instead be ignored and
   cleaned up.
9. Retry after cancellation and retry after failure. Define clean session
   reconstruction, generation/run identifiers, stale callback/result
   rejection, and reset state.
10. An ordered output schema that pairs requested/actual timestamp information,
    a volatile frame image, and its complete landmark result without copying or
    persisting sensitive pixels unnecessarily.
11. Ownership transfer and cleanup for every `ImageBitmap` from creation,
    queueing, inference transfer, output retention, cancellation, failure,
    retry, supersession, and consumer release.
12. Mobile/browser resource constraints, memory bounding, and UI
    responsiveness. Recommend behavioral tests rather than universal latency,
    FPS, memory, or duration guarantees.
13. Deterministic unit and browser testing, including controlled fake media/
    bitmap/session adapters where real browser decoding is nondeterministic.
14. Fixture coverage for short, long, portrait, landscape, malformed, and
    zero/invalid-duration cases without committing identifiable real-person
    footage or creating unjustified fixture scope.
15. Privacy implications of retaining frame images and landmarks in output,
    including lifetime, consumer release, no persistence, no logging, and no
    remote transit.
16. Local progress, cancel, retry, failure, and completion states that are
    useful without exposing sensitive diagnostics.

## Blocking Questions To Answer Explicitly

- What exact deterministic timestamp algorithm and sample budget are used?
- How are duration, zero/invalid duration, fractional timestamps, rounding,
  duplicate timestamps, and the final sample handled?
- What does deterministic mean across runs and browsers, and what limitations
  must be documented?
- Is the pipeline sequential, bounded, and ordered? What is the maximum number
  of owned frame images and in-flight inference jobs?
- Which component owns and closes each `ImageBitmap` at every transition?
- What happens when cancellation occurs during seeking, bitmap creation,
  queued work, in-flight inference, result delivery, or teardown?
- What state is reset for retry, and how are stale outputs rejected?
- What exact output schema pairs timestamps, frame images, and landmark sets?
- How long do output frame images and landmarks remain in memory, who releases
  them, and what persistence remains prohibited?
- How do portrait, landscape, long, short, malformed, and invalid-duration
  videos behave?
- How are UI responsiveness and useful local progress/error/cancel/retry states
  verified without hardware-dependent promises?
- How should dedicated `SS-TC-010` be refined into accurate acceptance
  coverage?

## Required Output

Return a self-contained report with:

1. Executive recommendation and explicit GO / NO-GO for specification
   readiness, not implementation authority.
2. Primary-source evidence table with URLs, access dates, and supported claims.
3. Normative deterministic sampling proposal with pseudocode and edge-case
   examples.
4. Normative queue state machine and bounded-capacity/backpressure proposal.
5. Cancellation, retry, run-identity, and stale-result rejection contract.
6. Complete `ImageBitmap` ownership and cleanup matrix.
7. Ordered output schema and consumer-release contract.
8. Portrait/landscape, duration-edge, malformed-media, mobile, and
   responsiveness behavior.
9. Privacy/data-lifecycle and local-observability proposal.
10. Deterministic unit/browser test strategy and fixture recommendations.
11. Recommended refinement for dedicated `SS-TC-010`.
12. A table of broad recommendations labeled Proposed Adopt, Proposed Revise,
    Proposed Defer, or Proposed Reject.
13. A final blocker checklist marking every blocking question Resolved, Human
    Decision Required, or Unresolved.

Do not claim requested timestamps guarantee pixel-identical decoded frames
across browsers. Do not propose unbounded queues, retained frame-image
persistence, sensitive logging, remote APIs, new production dependencies, or
changes to the protected SS-005 MediaPipe boundary.
