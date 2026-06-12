# SS-006 Research Disposition

Status: **Gemini response received and independently dispositioned. The
normative specification is ready for Claude pre-implementation QA planning;
implementation remains blocked.**

Gemini recommended even timeline spacing, a sequential bounded queue,
generation identifiers, complete retry reconstruction, explicit bitmap
ownership, volatile local output, and deterministic mock-driven tests. Those
are useful research inputs, but Gemini's GO decision is not implementation
authority.

## Primary-Source And Repository Checks

Checked on 2026-06-12:

- The HTML Living Standard defines media seeking as asynchronous, clamps seeks
  past the media end, may move a requested position to the nearest seekable
  range, sets `seeking` false when complete, and then fires `seeked`:
  https://html.spec.whatwg.org/multipage/media.html#seeking
- The HTML Standard defines `videoWidth` and `videoHeight` as natural video
  dimensions in CSS pixels after format-defined dimensions, aspect ratio,
  clean aperture, resolution, and related adjustments:
  https://html.spec.whatwg.org/multipage/media.html#dom-video-videowidth
- MDN records that `duration` is `NaN` before media data is available and
  `Infinity` when duration is unknown, such as live media:
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/duration
- MDN records that `currentTime` precision may be reduced by browser privacy
  settings, including 2 ms or 100 ms Firefox examples:
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
- `createImageBitmap()` returns a promise and supports orientation and resize
  options. Default orientation is `from-image`:
  https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap
- `ImageBitmap.close()` disposes of graphical resources:
  https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap/close
- Worker transfer lists transfer ownership to the destination; the sender can
  no longer use the transferred object:
  https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
- `requestVideoFrameCallback()` exposes `mediaTime`, but that time is on the
  same media timeline as `currentTime`; it is not required to satisfy SS-006:
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback
- The current repository permits one PoseSession frame in flight, transfers
  accepted bitmaps to the worker, closes rejected bitmaps, closes worker-owned
  bitmaps in a `finally` path, and requires a new worker after failure/close.
- The current ad hoc four-sample loop has no run generation, stale-result
  rejection, retry contract, output frame images, or complete cancellation
  ownership.

## Adopt

- Use deterministic even spacing over a validated integer-millisecond media
  duration.
- Keep the pipeline sequential and ordered with one queued/capturing item and
  at most one inference job.
- Use a monotonically increasing local run generation to reject stale
  callbacks and results after cancel, failure, retry, or supersession.
- Reconstruct a new media adapter and `PoseSession` for every retry.
- Treat seeking, bitmap creation, and in-flight inference as asynchronous work
  that may finish after cancellation; invalidate first, then close or ignore
  stale output.
- Preserve natural orientation/aspect ratio. Do not manually rotate, stretch,
  crop, or flip frames.
- Use deterministic unit fakes for state, ordering, cancellation, retry,
  ownership, and duration edges; use browser tests for real media integration,
  responsiveness, cleanup, and network/privacy boundaries.
- Keep frame images, landmarks, progress, and errors local, volatile, and
  non-persistent.

## Revise Before Adoption

- **Sample budget:** revise Gemini's unsupported configurable default `K=20`
  and `4..60` range to a fixed SS-006 budget of `8`. A fixed reviewed budget
  is easier to test and bounds retained preview memory. Future configurability
  requires a separate product/performance decision.
- **Timestamp units:** calculate and store requested timestamps as integers in
  milliseconds. Convert to seconds only when assigning `video.currentTime`.
- **Final timestamp:** revise the unconditional `duration - 1 ms` rule. Define
  `durationMs = floor(durationSeconds * 1000)` and
  `endTimestampMs = max(0, durationMs - 1)`. This is a deterministic
  application boundary, not a browser guarantee that the last decodable frame
  is exactly one millisecond before duration.
- **Very short media:** do not use an arbitrary `0.1 s` threshold. A validated
  duration whose integer-millisecond end is zero produces exactly `[0]`;
  otherwise generate up to eight unique increasing timestamps.
- **Run identity:** use a monotonically increasing process-local integer
  generation, not `crypto.randomUUID()`. Entropy provides no benefit for local
  stale-result rejection and complicates deterministic tests.
- **Bitmap capacity:** Gemini's maximum of two bitmaps conflicts with the
  acceptance criterion requiring output frame images. Use up to eight retained
  bounded preview bitmaps plus one native inference bitmap: maximum `9`
  application-owned bitmaps. No additional bitmap queue is permitted.
- **Output frame image:** the bitmap transferred to inference cannot also be
  retained by the sender. Create a separate preview `ImageBitmap`, preserving
  aspect ratio and limiting the long edge to 640 pixels without upscaling.
  Transfer the separate native-size inference bitmap to the worker.
- **Cancellation:** invalidate the run immediately, remove listeners, clear
  queued timestamps, release retained previews/results, and request PoseSession
  teardown. Do not describe in-flight inference completion as safe to reuse.
- **Diagnostics:** restrict diagnostics to local UI lifecycle/progress and
  stable sanitized error codes. Frame index, dimensions, duration, MIME type,
  frame pixels, and landmark values remain prohibited diagnostic output.
- **Privacy copy:** navigation or tab closure releases application references
  but does not justify a claim that data is immediately or permanently
  destroyed.
- **Responsiveness:** verify a deterministic UI action/heartbeat completes
  while processing is active. Sequential worker inference alone does not prove
  main-thread seeking/bitmap capture remains responsive.

## Defer

- Configurable sample budgets, adaptive budgets, hardware-based tuning, dense
  frame processing, optical-flow/relevance sampling, and thermal adaptation.
- `requestVideoFrameCallback()` as a required source of actual presentation
  timestamp. SS-006 records observed `currentTime` after `seeked` as
  informational and does not use it as the worker's monotonic timestamp.
- Full-resolution retained output images, output persistence, history, export,
  overlays, phase detection, keyframe correction, metrics, and coaching.
- New synthetic portrait/landscape/long fixture binaries. Deterministic unit
  adapters cover these contracts; the approved SS-005 fixture remains the real
  browser integration fixture unless QA identifies a blocking gap.
- A universal watchdog duration or latency/FPS/memory threshold.

## Reject

- Reject Gemini's conclusion that the architecture is already ready for
  implementation. Claude QA planning remains a required gate.
- Reject the claim that a fixed `K=20` or `4..60` range is established by
  primary sources.
- Reject claims that the design eliminates iOS out-of-memory crashes or
  guarantees a flat heap profile.
- Reject claims that requested timestamps or `requestVideoFrameCallback()`
  guarantee frame-accurate or pixel-identical cross-browser extraction.
- Reject `fastSeek()` for deterministic requested timestamps because it
  explicitly permits approximate-for-speed adjustment.
- Reject output schemas that retain the same `ImageBitmap` after transferring
  it to the worker.
- Reject console logging of dimensions, duration, MIME type, frame index, or
  other media characteristics.
- Reject claims that local volatility guarantees immediate/permanent
  destruction or compliance.
- Reject Gemini's illustrative tests as completed verification.

## Decision Record

| Question | Codex decision |
| --- | --- |
| Sampling algorithm and budget | Fixed budget `8`; evenly space unique integer millisecond timestamps across `0..max(0, floor(durationSeconds * 1000) - 1)`. |
| Invalid and short duration | Reject non-finite or `<= 0`; an end timestamp of `0` yields `[0]`; otherwise generate up to eight unique increasing integers. |
| Determinism | Same validated observed duration and fixed algorithm produce the same requested timestamps and order. Actual decoded pixels and observed seek positions are not guaranteed identical across browsers/hardware. |
| Queue bounds | Sequential; no prefetch; one capture/queued item and one inference job maximum. |
| Bitmap bound | Up to eight retained 640px-long-edge preview bitmaps plus one native inference bitmap, maximum `9`. |
| Cancellation | Invalidate generation first; detach listeners; clear queue; release outputs; request teardown; close stale bitmap resolutions; reject stale callbacks/results. |
| Retry | New generation, media adapter, PoseSession/worker, queue, progress, and output collection. |
| Output | Ordered records with generation, index, requested timestamp, observed seek time, bounded preview bitmap, complete `PoseFrameResult`, and explicit release ownership. |
| Orientation | Preserve browser-reported natural orientation/aspect ratio; no manual transform or upscaling. |
| Observability | Local sanitized lifecycle/progress/error codes only; sensitive diagnostics prohibited. |
| Acceptance coverage | Dedicated `SS-TC-010`; export-focused `SS-TC-006` remains unrelated. |

## Implementation Gate

Implementation remains blocked pending Claude adversarial QA planning and
explicit closure of any blocking findings.
