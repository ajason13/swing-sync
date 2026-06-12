# SS-006 Pre-Implementation Specification

Status: **Blocked at `2. QA Planning (Claude)`. This is the normative candidate
contract; implementation may begin only after Claude PASS and tracker
transition to `3. In Development (ChatGPT)`.**

## Scope

SS-006 replaces the ad hoc four-timestamp processing loop with a deterministic,
bounded, ordered local frame-processing controller that supports cancellation,
retry, and volatile output records containing timestamps, frame previews, and
complete pose landmark results.

Out of scope: model/SDK/asset changes, persistence, service-worker model
caching, remote APIs/sharing/logging, telemetry, phase detection, keyframe
correction, metrics, coaching, overlays, and export.

## Protected SS-005 Contract

Preserve exact `@mediapipe/tasks-vision@0.10.35`, same-origin approved assets,
dedicated worker VIDEO-mode inference, complete normalized/world landmarks,
returned `x`/`y`/`z`/`visibility`, separate configured thresholds, finite
non-negative strictly increasing worker timestamps, closed transferred
bitmaps, object URL and worker/task cleanup, fail-closed unexpected requests,
no sensitive persistence, and the first-analysis safety acknowledgement.

## Deterministic Sampling Contract

Constants:

```text
SAMPLE_BUDGET = 8
PREVIEW_MAX_LONG_EDGE_PX = 640
```

Input duration is accepted only after metadata is available and only when
`durationSeconds` is finite and greater than zero.

```text
durationMs = floor(durationSeconds * 1000)
endTimestampMs = max(0, durationMs - 1)

if endTimestampMs == 0:
  timestamps = [0]
else:
  candidate[i] = round(i * endTimestampMs / (SAMPLE_BUDGET - 1))
  for i = 0..SAMPLE_BUDGET-1
  timestamps = candidates deduplicated in original ascending order
```

Normative properties:

- timestamps are integer milliseconds, finite, non-negative, unique, strictly
  increasing, and no greater than `endTimestampMs`;
- the first timestamp is `0`; the last is `endTimestampMs`;
- output count is between `1` and `8`;
- convert `timestampMs / 1000` only when assigning `video.currentTime`;
- use the requested integer `timestampMs` for worker inference and ordering;
- do not use `fastSeek()`;
- after assigning `currentTime`, wait for the matching active run's `seeked`
  completion before capture; and
- record observed `video.currentTime * 1000` after `seeked` only as
  informational output. It may be rounded/reduced and is not used as the next
  worker timestamp.

Deterministic means the same accepted observed duration and algorithm produce
the same requested timestamps and ordered indices. It does not promise the
same observed duration, seek position, decoded pixels, or landmarks across
browsers, codecs, operating systems, hardware decoders, or privacy settings.

## Media And Orientation Contract

- Reject `NaN`, `Infinity`, zero, negative, missing-video-track, zero natural
  dimension, media error, and unsupported/decode failure with stable sanitized
  local error codes.
- Treat long and short finite prerecorded videos with the same fixed budget.
- Preserve browser-reported natural orientation and aspect ratio.
- Do not manually rotate, flip, crop, stretch, or upscale.
- Native-size inference bitmap capture remains the protected SS-005 input.
- Output preview bitmap capture preserves aspect ratio and limits its long edge
  to 640 pixels without upscaling.

## Queue State And Bounds

States:

```text
idle -> loading-metadata -> initializing-pose -> ready -> seeking
seeking -> capturing-preview -> capturing-inference -> processing -> seeking
processing -> completed
any non-terminal -> cancelling -> cancelled
any non-terminal -> failed
cancelled|failed|completed -> retrying -> loading-metadata
```

Terminal state transitions release active resources. Retry creates a new run.

Bounds:

- one active run;
- one ordered timestamp cursor;
- no prefetched bitmap queue;
- at most one capture operation being accepted for the active sample;
- at most one in-flight worker inference job;
- up to eight retained output preview bitmaps; and
- at most one additional native inference bitmap before/after transfer.

Maximum application-owned `ImageBitmap` count is `9`. Browser-internal decoder
buffers are outside application ownership and are not claimed by this bound.

The next seek must not begin until the active sample's result is accepted and
its ordered output record is complete.

## Run Identity And Stale Rejection

- Maintain a process-local monotonically increasing integer `runGeneration`.
- Every asynchronous closure captures its generation.
- PoseSession callbacks are wrapped with their generation.
- A callback may mutate state only when its generation equals the active
  generation and the controller is in an expected compatible state.
- Stale bitmap resolutions must close the bitmap immediately.
- Stale results/statuses must be ignored and must not append output, advance
  progress, or change the active run's state.
- Retry and supersession increment the generation before constructing new
  resources.

The generation is internal control state, not a user identifier, and must not
be persisted or remotely transmitted.

## Output Contract

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

Rules:

- outputs are appended only in increasing `index` and requested timestamp
  order;
- `pose.timestampMs` must equal `requestedTimestampMs`;
- `observedSeekTimestampMs` must be finite and non-negative but is
  informational and may differ from the request;
- `preview` is a separate bounded bitmap and is never transferred to the pose
  worker;
- the active controller owns all outputs until ownership is explicitly handed
  to a consumer;
- the owner must call `preview.close()` on cancel, failure, retry,
  supersession, controller disposal, or consumer release; and
- output landmarks and previews remain volatile and must not be written to
  storage, logs, caches, service workers, remote endpoints, or exports.

## Bitmap Ownership Matrix

| Stage | Owner | Required release/transition |
| --- | --- | --- |
| Preview creation pending | Browser operation for captured generation | On resolution, active controller accepts it or stale handler closes it. |
| Retained preview | Active controller/output consumer | Close on release, cancel, failure, retry, supersession, or disposal. |
| Inference creation pending | Browser operation for captured generation | On resolution, active controller submits it or stale handler closes it. |
| Inference before submit | Active controller | `PoseSession.submitFrame` accepts transfer or closes rejection. |
| Inference after accepted transfer | Pose worker | Worker closes in `finally`; sender must not reuse it. |
| Inference worker crash | Terminated worker/browser | Main releases all locally owned previews and references; no claim is made that main can close a transferred bitmap. |

No bitmap may appear in both preview output and the worker transfer.

## Cancellation, Failure, Teardown, And Retry

Cancellation:

1. Increment/invalidate the active generation before other cleanup.
2. Transition UI to `cancelling`/`cancelled` without waiting for native work.
3. Remove media listeners and clear pending timestamps.
4. Close all retained preview outputs and clear landmarks/results.
5. Request PoseSession teardown, then drop the active session reference.
6. Pause media, remove `src`, call `load()`, and revoke the object URL when the
   selected video is no longer needed.
7. Any later stale bitmap resolution closes itself; stale status/result
   callbacks are ignored.

Failure follows the same resource-release rules and exposes only a stable
sanitized local error code.

Retry after cancel or failure:

- requires the selected local `File` to remain intentionally available for the
  retry action; if the object URL was revoked, create a fresh object URL;
- creates a new media element/adapter and new PoseSession/worker;
- creates a new generation, timestamp cursor, progress state, and empty output;
- never reuses prior output, pending operations, worker, or failed state; and
- restarts from requested timestamp `0`.

Starting a different video is supersession and performs full prior-run cleanup.

## Error And Progress Contract

Stable error categories must cover:

- invalid/unknown duration;
- missing/invalid dimensions or video track;
- media load/decode/seek failure;
- preview or inference bitmap creation failure;
- PoseSession initialization/inference/worker/protocol/network failure; and
- unexpected controller state.

UI exposes local states and progress count (`completed / total`) plus cancel
and retry actions where valid. Diagnostics must not log or persist frame
pixels, landmarks, dimensions, orientation, duration, MIME type, file name,
timestamps, frame index, or user identifiers.

## Responsiveness Contract

- Model inference remains in the dedicated worker.
- The pipeline yields between ordered asynchronous seek/capture/inference
  transitions; it performs no dense synchronous loop.
- A deterministic UI heartbeat/input action must complete while processing is
  active on desktop and mobile Chromium test projects.
- Do not claim universal FPS, latency, memory, thermal, or battery behavior.

## Required Test Contract

Unit tests:

- exact timestamp arrays for normal, long, short, sub-millisecond,
  fractional, invalid, zero, and infinite durations;
- stable ordering and requested/result timestamp association;
- fixed queue/inference/bitmap bounds;
- portrait and landscape dimension/aspect-ratio preview calculations;
- cancel before start and during metadata, seek, preview creation, inference
  creation, in-flight inference, result delivery, and teardown;
- retry after cancellation and failure;
- stale bitmap/status/result rejection across generations;
- exact close/release ownership on success, cancel, failure, retry, and
  supersession; and
- sanitized error/progress output.

Browser tests:

- approved fixture ordered completion with eight bounded preview images and
  complete pose results;
- real cancel/retry user states and object URL/session cleanup;
- useful local failure state for malformed/unsupported media;
- desktop/mobile UI responsiveness during processing;
- no sensitive console output or persistence;
- no unexpected external network activity; and
- protected SS-005 safety, asset, worker, landmark, and cleanup behavior.

Orientation, long-duration, short-duration, invalid-duration, concurrency, and
stale-result contracts may use deterministic adapters in unit tests. Additional
committed media fixture binaries require separate provenance and scope review.

## Observability Decision

Add only local sanitized lifecycle, progress, cancellation, retry, completion,
and stable error states needed by the user and tests. Do not add telemetry,
remote logging, developer-console media diagnostics, or sensitive values.

## Implementation Start Gate

Implementation remains prohibited until Claude QA planning returns PASS,
blocking findings are resolved, `SS-TC-010` matches the approved contract, and
Notion moves to `3. In Development (ChatGPT)`.
