# SS-006 Claude Focused QA Re-Review Prompt

Paste this prompt into Claude Chat to re-review the response to the initial
SS-006 QA Planning FAIL. This is a focused pre-implementation review, not
implementation or final audit.

## Prompt

Role: You are the lead adversarial QA planner re-reviewing Swing Sync SS-006.

Stage: Focused pre-implementation QA re-review after your initial FAIL.

Claude Chat has no filesystem, Notion, or GitHub access. Use only this embedded
context. Do not write implementation.

Return:

- PASS or FAIL for permission to begin implementation;
- each prior blocker marked closed, partially closed, or open;
- any new specification blocker;
- whether revised `SS-TC-010` is adequate; and
- explicit instruction to remain at `2. QA Planning (Claude)` or permission to
  move to `3. In Development (ChatGPT)`.

## Story And Protected Boundary

Acceptance criteria:

- deterministic frame sampling;
- cancellation and retry;
- long, short, portrait, and landscape video handling; and
- ordered output containing timestamps, frame images, and landmark sets.

Preserve exact approved SS-005 MediaPipe integration, one in-flight pose
inference, complete returned landmark arrays, finite increasing worker
timestamps, worker-owned transferred bitmap cleanup, fail-closed unexpected
network behavior, first-analysis safety acknowledgement, and no sensitive
persistence/telemetry.

## Prior Verdict

You returned **FAIL** and denied implementation permission with:

- **B1:** negative duration prose/formula contradiction;
- **B2:** `NaN`/`Infinity` invalid duration not guaranteed to fail at the
  queue/controller layer before work;
- **B3:** failure-path bitmap cleanup unspecified;
- **B4:** stale-generation check placement not specified before mutation/work;
  and
- **B5:** retry could create a new PoseSession before old-session teardown was
  confirmed.

You also recommended specifying bitmap creation order, object URL retry policy,
`cancelling` semantics, inference dimensions, consumer close responsibility,
programmatic orientation test sources, floating-point conservatism, and
observed-timestamp export/privacy boundaries.

## Applied Normative Fixes

### B1 And B2: Queue-Layer Duration Guard

Before timestamp generation, seeking, bitmap creation, PoseSession
initialization, or worker calls:

```text
if durationSeconds is not finite or durationSeconds <= 0:
  fail with INVALID_DURATION and produce no timestamps

durationMs = floor(durationSeconds * 1000)
if durationMs < 0:
  fail with INVALID_DURATION and produce no timestamps

endTimestampMs = max(0, durationMs - 1)
```

The spec explicitly requires queue-layer rejection of negative, zero, `NaN`,
and infinite duration before any downstream work. It states that a positive
duration shorter than eight milliseconds may deduplicate to fewer than eight
samples.

### B3: Failure Cleanup And Atomic Ownership

Per-sample creation/assembly order:

1. Create and accept bounded preview bitmap.
2. Create separate natural-frame inference bitmap.
3. Immediately submit/transfer inference bitmap to PoseSession.
4. Accept matching pose result.
5. Atomically append output and transfer preview ownership into output.

If any step after preview creation fails or becomes stale, the current preview
closes before failure/return. If inference creation fails, no inference
transfer occurs. PoseSession closes rejected submissions. Output-assembly
failure closes the uncommitted preview.

Failure invalidates generation before state mutation and closes:

- current uncommitted preview;
- all previously retained output previews; and
- any application-owned inference bitmap not accepted/closed by PoseSession.

A transferred inference bitmap remains worker-owned and closes in the protected
worker `finally` path.

### B4: Stale Check Placement

Every metadata, media-error, `seeked`, bitmap-resolution, PoseSession status,
and PoseSession result callback must validate generation and expected state
**before** any state transition, bitmap creation, output mutation, progress
change, or new asynchronous work.

A stale callback returns without state mutation and closes any
application-owned bitmap it carries/resolves.

### B5: Retry Session Ordering

Retry:

- intentionally retains the selected local `File` but revokes the prior active
  object URL;
- waits for the prior PoseSession to reach confirmed terminal `closed` or
  `error` before creating a new PoseSession/worker;
- prohibits two controller PoseSessions from coexisting;
- creates a fresh object URL and media adapter; and
- creates a new generation, queue, progress state, and empty output.

## Applied Non-Blocking Clarifications

- `cancelling` is an internal cleanup phase; UI exposes `cancelled`.
- Inference captures the browser's natural video frame and is not governed by
  preview scaling.
- `SampledFrameOutput.preview` documents current-owner close responsibility.
- Programmatically generated canvas sources are preferred for orientation
  bitmap tests.
- Conservative `floor(durationSeconds * 1000)` behavior is accepted without an
  unreviewed tolerance workaround.
- `observedSeekTimestampMs` remains excluded from diagnostics, persistence,
  network transit, and future export unless a later reviewed story changes it.

## Revised SS-TC-010 Evidence Contract

Dedicated `SS-TC-010` now explicitly requires:

- negative, zero, `NaN`, and infinite duration queue-layer rejection before
  seek, bitmap, PoseSession initialization, or worker call;
- exact sub-eight-millisecond deduplication;
- current preview and accumulated preview cleanup for inference-bitmap
  creation, submission, inference, output-assembly, and mid-run failures;
- stale generation validation before state mutation, bitmap creation, output
  assembly, progress, or follow-on work;
- stale `seeked` after cancellation creates no bitmap and changes no state;
- prior PoseSession terminal confirmation before retry creates a new session;
- observed seek timestamp excluded from diagnostics/storage/transit;
- cancel coverage at every stage, no persistence/sensitive diagnostics, no
  unexpected external network activity, and protected SS-005 regression
  coverage.

## Focused Review Questions

1. Are B1 and B2 closed by the explicit queue-layer guard and no-work rule?
2. Does the preview-first atomic ownership/failure contract close B3?
3. Does the before-any-work/mutation stale check close B4?
4. Does confirmed prior terminal state and no-coexistence close B5?
5. Do the clarifications introduce a new contradiction with cancellation,
   retry, output acceptance, or the protected SS-005 worker contract?
6. Is revised `SS-TC-010` sufficient to permit implementation?

## Current Gate And Evidence

- Repository branch: `ss-006-frame-queue`.
- Story remains `2. QA Planning (Claude)`.
- No runtime implementation or dependency/model/asset change has begun.
- Documentation verification passed on Node 22: unit tests, build, compliance,
  safety, privacy, license audit, bundle-license fixture, pose-asset hashes,
  SBOM generation, production vulnerability audit, and `git diff --check`.
- Observability remains specified as local sanitized lifecycle/progress/error
  states only, with no sensitive diagnostics.

Return explicit PASS only if all five prior blockers are closed and no new
implementation-start blocker remains.
