# SS-006 Claude Final Adversarial Audit Prompt

> Superseded after the initial final-audit FAIL. Do not paste this prompt.
> Use `docs/ss-006-claude-final-rereview-prompt.md` for the focused re-review.

Paste this prompt into Claude Chat for final SS-006 implementation audit.
Claude Chat has no filesystem, Notion, or GitHub access; required context is
embedded below.

## Prompt

Role: You are the lead adversarial implementation auditor for Swing Sync.

Stage: Final implementation audit for privacy-sensitive story
`SS-006 Build frame processing queue and sampling strategy`.

Return:

- PASS or FAIL;
- blockers ordered by severity;
- non-blocking recommendations;
- missing tests or edge cases;
- whether protected SS-005 boundaries regressed; and
- explicit sign-off status for PR preparation.

Attack assumptions, fail-open behavior, asynchronous races, ownership leaks,
stale callbacks, retry/session coexistence, and privacy boundaries. Do not
invent out-of-scope feature requirements.

## Acceptance Criteria

- Video frames are sampled deterministically.
- Processing can be cancelled or retried.
- Queue handles long, short, portrait, and landscape videos.
- Output includes timestamps, frame images, and landmark sets.

Out of scope: model/SDK/asset/provider/dependency changes, persistence,
service-worker model caching, remote APIs/sharing/logging, telemetry, phase
detection, keyframe correction, metrics, coaching, overlays, and export.

## Protected SS-005 Boundary

- Exact `@mediapipe/tasks-vision@0.10.35` and approved same-origin assets.
- Dedicated worker VIDEO-mode inference.
- Complete normalized/world landmark arrays with returned `x`, `y`, `z`, and
  `visibility`; no invented per-landmark presence.
- Finite non-negative strictly increasing input timestamps.
- Worker closes transferred bitmaps in `finally`.
- Object URL, worker, and task cleanup.
- Fail-closed unexpected external requests.
- No telemetry, remote logging, raw-frame persistence, or landmark persistence.
- Existing first-analysis safety acknowledgement.

No dependency, SDK, model, asset, CSP, or service-worker cache change was made.

## Approved Specification

- Fixed sample budget `8`.
- Reject non-finite or `<= 0` duration at the controller before downstream
  work.
- `endTimestampMs = max(0, floor(durationSeconds * 1000) - 1)`.
- Generate eight rounded evenly-spaced candidates, deduplicate in ascending
  order.
- Preserve browser-reported natural orientation/aspect ratio.
- Preview long edge is at most 640 pixels without upscaling.
- Separate native inference bitmap and bounded retained preview bitmap.
- Sequential queue: no prefetch and one inference in flight.
- Maximum application-owned bitmap count: eight previews plus one inference.
- Monotonic local run generation; stale callbacks validate before any work or
  mutation.
- Retry waits for prior processor terminal completion before constructing a
  new processor.
- Output remains ordered, volatile, local, and non-persistent.
- Observability is local sanitized lifecycle/progress/error state only.

## Implemented Core

`src/frame-processing.ts`:

```ts
export function calculateSampleTimestamps(durationSeconds: number): number[] {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new Error("INVALID_DURATION");
  }
  const durationMs = Math.floor(durationSeconds * 1000);
  if (durationMs < 0) throw new Error("INVALID_DURATION");
  const endTimestampMs = Math.max(0, durationMs - 1);
  if (endTimestampMs === 0) return [0];

  const timestamps: number[] = [];
  for (let index = 0; index < 8; index += 1) {
    const timestamp = Math.round((index * endTimestampMs) / 7);
    if (timestamps.at(-1) !== timestamp) timestamps.push(timestamp);
  }
  return timestamps;
}
```

Controller run behavior:

```ts
private async beginRun(): Promise<void> {
  const generation = ++this.generation;
  this.releaseOutputs();
  this.source?.dispose();
  this.source = undefined;
  await this.closeProcessor();
  if (!this.isActive(generation)) return;

  const source = this.dependencies.createSource();
  const processor = this.dependencies.createProcessor();
  this.source = source;
  this.processor = processor;
  this.setState("loading");

  try {
    const metadata = await source.load();
    this.assertActive(generation);
    const timestamps = calculateSampleTimestamps(metadata.durationSeconds);
    const previewDimensions = calculatePreviewDimensions(metadata.width, metadata.height);
    this.totalSamples = timestamps.length;
    this.events.onProgress(0, timestamps.length);
    await processor.initialize();
    this.assertActive(generation);
    this.setState("processing");
    for (let index = 0; index < timestamps.length; index += 1) {
      await this.processSample(generation, index, timestamps[index], previewDimensions);
    }
    this.assertActive(generation);
    this.setState("completed");
  } catch (error) {
    if (!this.isActive(generation)) return;
    await this.fail(generation, error);
  }
}
```

Per-sample ordered ownership:

```ts
const observedSeekTimestampMs = await source.seek(requestedTimestampMs);
this.assertActive(generation);
const preview = await source.createPreview(previewDimensions.width, previewDimensions.height);
if (!this.isActive(generation)) {
  preview.close();
  throw new Error("STALE_RUN");
}
this.currentPreview = preview;

const inference = await source.createInference();
if (!this.isActive(generation)) {
  inference.close();
  throw new Error("STALE_RUN");
}
const pose = await processor.process(inference, requestedTimestampMs);
this.assertActive(generation);
if (pose.timestampMs !== requestedTimestampMs) throw new Error("RESULT_TIMESTAMP_MISMATCH");

const output = { runGeneration: generation, index, requestedTimestampMs,
  observedSeekTimestampMs, preview, pose };
this.outputs.push(output);
this.currentPreview = undefined;
this.events.onOutput(output);
this.events.onProgress(this.outputs.length, this.totalSamples);
```

Cancellation/close serialization:

```ts
async cancel(): Promise<void> {
  if (this.cleanupPromise) {
    await this.cleanupPromise;
    return;
  }
  if (["cancelled", "closed", "idle"].includes(this.state)) return;
  this.cleanupPromise = this.cleanup("cancelled");
  await this.cleanupPromise;
}

private async cleanup(targetState: "cancelled" | "closed"): Promise<void> {
  this.generation += 1;
  this.releaseOutputs();
  this.source?.dispose();
  this.source = undefined;
  await this.closeProcessor();
  this.setState(targetState);
  this.cleanupPromise = undefined;
}
```

Failure closes current/accumulated previews, disposes source, and awaits
processor close before exposing a sanitized stable error code. Retry calls
`beginRun()`, which releases prior output/source and awaits `closeProcessor()`
before constructing the next source/processor.

`src/browser-frame-processing.ts`:

- Each run creates a fresh object URL from the retained selected local `File`.
- Source load waits for `loadedmetadata`; seek waits for `seeked`.
- Preview uses `createImageBitmap(video, { resizeWidth, resizeHeight })`.
- Inference uses separate `createImageBitmap(video)` at natural dimensions.
- Source disposal pauses video, removes `src`, calls `load()`, and revokes URL.
- Promise-based `PoseFrameProcessor` adapts existing callback PoseSession.
- Processor close resolves only on PoseSession terminal `closed` or `error`.

`src/pose-session.ts` transfer hardening:

```ts
try {
  this.post({ type: "frame", bitmap, timestampMs }, [bitmap]);
  return true;
} catch {
  bitmap.close();
  this.frameInFlight = false;
  this.fail("WORKER_MESSAGE_ERROR");
  return false;
}
```

`src/main.ts`:

- Existing consent gate remains.
- Replaces ad hoc four-frame loop with the controller.
- Shows local completed/total progress and sanitized failure state.
- Exposes stop and failure retry controls.
- CSP violation aborts the active processor with
  `UNEXPECTED_NETWORK_BLOCKED`.
- Async close captures the prior controller and does not clear a newer global
  controller reference.

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

Controller owns previews until release. Cancel, failure, retry, supersession,
and close release all retained previews. No output is persisted, logged,
cached, transmitted, or exported.

## Test Evidence

Unit tests: **25 passed**.

- Pinned arrays:
  - 1 ms -> `[0]`
  - 5 ms -> `[0, 1, 2, 3, 4]`
  - 7 ms -> `[0, 1, 2, 3, 4, 5, 6]`
  - 8 ms -> `[0, 1, 2, 3, 4, 5, 6, 7]`
  - 2 s -> `[0, 286, 571, 857, 1142, 1428, 1713, 1999]`
- Invalid duration rejection before processor initialization/seek/bitmap work.
- Portrait/landscape/no-upscale preview dimensions.
- Ordered timestamp/preview/pose output.
- Current and accumulated preview cleanup on failure.
- Stale seek after cancel creates no bitmap.
- Overlapping repeated cancel is idempotent.
- Retry closes prior output/processor before new run.
- PoseSession transfer-throw closes bitmap and fails closed.

Playwright production browser tests: **26 passed** across desktop and mobile
Chromium.

- Eight-frame approved fixture completion with complete landmarks.
- Successful operation with external network blocked from navigation start.
- Initialization failure exposes sanitized local error and retry control.
- Retry reconstructs a fresh local session and completes.
- Loading remains cancel-responsive.
- CSP-blocked outbound request fails closed.
- Object URL creation/revocation parity.
- No sensitive console output, IndexedDB, or CacheStorage persistence.
- Existing safety and mobile-layout behavior.

Final Node 22 verification passed:

- `npm run test:unit`
- `npm run test:smoke`
- `npm run build`
- `npm run compliance:verify`
- `npm run safety:verify`
- `npm run privacy:verify`
- `npm run license:audit`
- `npm run verify:bundle-license-fixture`
- `npm run pose-assets:verify`
- `npm run sbom:generate` (one production component)
- `npm audit --omit=dev --audit-level=high` (zero vulnerabilities)
- `git diff --check`

## Audit Questions

1. Can any stale callback mutate active state or leak a bitmap?
2. Can cancel, close, retry, failure, or supersession allow two processors,
   unreleased previews, or a dangling object URL?
3. Is the maximum-nine application-owned bitmap claim upheld?
4. Does any invalid duration or result timestamp fail open?
5. Does the browser adapter introduce a seek/listener/teardown race?
6. Does the PoseSession transfer hardening preserve SS-005 behavior?
7. Do local progress/retry/error states expose sensitive diagnostics?
8. Is the test matrix sufficient for final sign-off?
