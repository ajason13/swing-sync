# SS-006 Claude Adversarial QA Planning Prompt

> **Superseded: do not paste this prompt.** Claude completed this review with a
> FAIL result. Use `docs/ss-006-claude-qa-rereview-prompt.md` for the focused
> re-review.

Paste this prompt into Claude Chat before SS-006 implementation. Claude does
not have filesystem, Notion, or GitHub access; all required context is embedded.

## Prompt

Role: You are the lead adversarial QA planner for Swing Sync.

Stage: Pre-implementation QA planning for privacy-sensitive story
`SS-006 Build frame processing queue and sampling strategy`.

Your job is to attack the candidate specification, identify fail-open behavior
and unsupported assumptions, and decide whether implementation may begin. Do
not write the implementation.

## Roles And Authority

- Gemini researched and proposed a specification.
- Codex independently verified and dispositioned the research.
- Claude owns adversarial QA planning and implementation-start sign-off.
- Codex may implement only after blockers are resolved and Notion moves to
  `3. In Development (ChatGPT)`.

## Acceptance Criteria And Scope

- Video frames are sampled deterministically.
- Processing can be cancelled or retried.
- Queue handles long, short, portrait, and landscape videos.
- Output includes timestamps, frame images, and landmark sets.

Out of scope: SDK/model/asset/provider/dependency changes, persistence,
service-worker model caching, remote APIs/sharing/logging, telemetry, phase
detection, keyframe correction, metrics, coaching, overlays, and export.

## Current Repository Contract

- Node 22, Vite, TypeScript, Vitest, Playwright.
- Exact approved `@mediapipe/tasks-vision@0.10.35`, same-origin approved
  model/WASM assets, dedicated worker VIDEO-mode inference.
- Complete normalized/world landmarks retain returned `x`, `y`, `z`, and
  `visibility`; configured thresholds are separate; no invented presence.
- Worker requires finite non-negative strictly increasing millisecond
  timestamps and closes transferred bitmaps in `finally`.
- `PoseSession` permits one inference frame in flight, transfers accepted
  bitmaps, closes rejected bitmaps, and requires a new session after
  failure/close.
- Existing app requires the first-analysis safety acknowledgement, uses a local
  object URL, and does not persist raw video, frames, or landmarks.
- Existing ad hoc four-sample loop lacks normative sampling, run identity,
  complete cancellation/retry, stale rejection, and output frame images.

## Tracker Coverage

- `SS-TC-006` is invalid SS-006 coverage because it describes Swing Card export
  leakage.
- Dedicated `SS-TC-010` covers deterministic bounded ordered processing,
  cancellation/retry, orientation/duration cases, output association, cleanup,
  stale-result rejection, and privacy-preserving diagnostics.

## Gemini Proposal And Codex Disposition

Gemini proposed even spacing, default `K=20` configurable up to 60, a
one-millisecond final clamp, maximum two bitmaps, random UUID run IDs,
`requestVideoFrameCallback()` actual timestamps, retained frame-image output,
retry reconstruction, media characteristics in local console diagnostics, and
claims that the design eliminates iOS OOM risk and permanently destroys data.

Codex adopted the sequential queue, even spacing, stale rejection, retry
reconstruction, explicit ownership, natural orientation, local volatility, and
deterministic fake-driven tests.

Codex revised or rejected unsupported/conflicting parts:

- fixed SS-006 sample budget is `8`, not configurable;
- requested timestamps are unique integer milliseconds over
  `0..max(0, floor(durationSeconds * 1000) - 1)`;
- `NaN`, `Infinity`, zero, and negative duration fail closed;
- deterministic means same accepted observed duration produces the same
  requested timestamps/order, not identical decoded pixels;
- run generation is a monotonically increasing local integer, not a UUID;
- no prefetch; one active capture/sample and one inference job;
- the inference bitmap is transferred and cannot also be retained as output;
- each sample creates a separate aspect-preserving preview bitmap whose long
  edge is at most 640 px without upscaling;
- up to eight retained output previews plus one inference bitmap means maximum
  `9` application-owned bitmaps;
- `requestVideoFrameCallback()` is deferred; observed `currentTime` after
  `seeked` is informational only;
- cancellation invalidates first, closes outputs, detaches listeners, clears
  queue, requests teardown, and rejects stale callbacks/results;
- retry constructs a new media adapter, object URL if needed, PoseSession,
  generation, queue, progress state, and output collection; and
- diagnostics expose only local sanitized lifecycle/progress/error codes, not
  dimensions, duration, MIME, names, timestamps, frame index, pixels,
  landmarks, or identifiers.

## Normative Candidate Sampling

```text
SAMPLE_BUDGET = 8
PREVIEW_MAX_LONG_EDGE_PX = 640
durationMs = floor(durationSeconds * 1000)
endTimestampMs = max(0, durationMs - 1)

if endTimestampMs == 0:
  timestamps = [0]
else:
  candidate[i] = round(i * endTimestampMs / 7), i = 0..7
  timestamps = candidates deduplicated in original ascending order
```

Requested timestamps drive worker inference and ordering. The pipeline waits
for the active generation's `seeked` event, then records observed
`currentTime * 1000` only as informational output.

## Normative Candidate Output

```ts
interface SampledFrameOutput {
  runGeneration: number;
  index: number;
  requestedTimestampMs: number;
  observedSeekTimestampMs: number;
  preview: ImageBitmap;
  pose: PoseFrameResult;
}
```

The controller owns outputs until explicit consumer handoff. The owner closes
every preview on cancel, failure, retry, supersession, disposal, or consumer
release. Preview bitmaps are never transferred to inference. Outputs remain
volatile and non-persistent.

## Normative Candidate State And Bounds

```text
idle -> loading-metadata -> initializing-pose -> ready -> seeking
seeking -> capturing-preview -> capturing-inference -> processing -> seeking
processing -> completed
any non-terminal -> cancelling -> cancelled
any non-terminal -> failed
cancelled|failed|completed -> retrying -> loading-metadata
```

- one active run and ordered timestamp cursor;
- no prefetched bitmap queue;
- at most one accepted capture/sample operation;
- at most one in-flight worker inference job;
- up to eight retained output preview bitmaps;
- at most one additional native inference bitmap; and
- maximum `9` application-owned bitmaps, excluding browser-internal decoder
  resources.

The next seek starts only after the active result is accepted and its output
record is complete.

## Cancellation And Retry Candidate Contract

Cancellation invalidates the generation first, updates UI without waiting for
native work, removes media listeners, clears timestamps, closes retained
previews/results, requests PoseSession teardown, drops the session reference,
cleans media source/object URL when no longer needed, closes later stale bitmap
resolutions, and ignores stale statuses/results.

Retry keeps the selected local `File` intentionally available, creates a fresh
object URL if needed, and creates a new media adapter, PoseSession/worker,
generation, timestamp cursor, progress state, and empty output. It restarts
from timestamp zero and reuses no prior run output or asynchronous state.

## Privacy And Observability Candidate Contract

- Raw video, frame images, and landmarks remain local, sensitive, volatile,
  and non-persistent.
- No telemetry, remote logging, remote sharing, cloud storage, cache/storage
  persistence, or sensitive console output.
- UI exposes only local sanitized lifecycle, progress count, cancellation,
  retry, completion, and stable error codes.
- No absolute privacy, deletion, memory, performance, determinism, or
  compliance claims.

## Required Verification After Approval

At minimum:

- `npm run test:unit`
- `npm run test:smoke`
- `npm run build`
- `npm run compliance:verify`
- `npm run safety:verify`
- `npm run privacy:verify`
- `npm run license:audit`
- `npm run verify:bundle-license-fixture`
- `npm run pose-assets:verify`
- `npm run sbom:generate`
- `npm audit --omit=dev`
- `git diff --check`

Targeted tests must cover timestamp arrays, ordering, bounds, portrait/
landscape calculations, invalid/short/long duration, cancellation at every
stage, retry after cancel/failure, stale rejection, bitmap closure, object URL/
session cleanup, UI responsiveness, no persistence/sensitive diagnostics,
unexpected-network blocking, and protected SS-005 behavior.

## Questions You Must Answer

1. Is the fixed budget `8` and integer-millisecond grid sufficiently explicit,
   deterministic, and safe for all accepted duration edges?
2. Does `floor(durationSeconds * 1000) - 1` introduce any correctness or
   browser-seeking issue that should block implementation?
3. Is the preview-plus-inference design compatible with the acceptance
   criterion and SS-005 transfer/cleanup boundary?
4. Is maximum `9` application-owned bitmaps a defensible bounded contract, or
   must output release/streaming or preview dimensions change before work?
5. Are state transitions and stale-generation checks sufficient for
   cancellation during metadata, seeking, bitmap creation, in-flight
   inference, result delivery, and teardown?
6. Can retry safely keep the selected local `File` while releasing the old
   object URL and all run resources?
7. Which cleanup paths or ownership transitions remain ambiguous or fail-open?
8. Does the output schema need a release method/handle instead of raw bitmap
   ownership, or other fields to avoid misuse?
9. Are portrait/landscape and malformed/unsupported video contracts testable
   without adding new committed fixture binaries?
10. Does observed `currentTime` add value or privacy/risk without being used for
    inference?
11. What exact unit/browser tests are implementation-start blockers?
12. Is `SS-TC-010` accurate, or what revisions are required?

## Output Required

- `PASS` or `FAIL` for permission to start implementation.
- Blockers ordered by severity with closure evidence required.
- Required revisions to the specification and `SS-TC-010`.
- Minimum deterministic unit, integration, Playwright, privacy, cleanup,
  network, responsiveness, and protected-boundary test matrix.
- Non-blocking recommendations separated from blockers.
- Explicit sign-off: permission to move to `3. In Development (ChatGPT)` or
  instruction to remain at `2. QA Planning (Claude)`.
