# SS-006 Claude Focused Final Re-Review Prompt

Paste this prompt into Claude Chat for focused final re-review after the SS-006
implementation audit FAIL. Claude Chat has no filesystem or GitHub access.

## Prompt

Role: You are the final adversarial implementation auditor re-reviewing focused
SS-006 fixes.

Stage: Focused final re-review. Do not broaden scope or rewrite implementation.

Return:

- PASS or FAIL;
- B1 and B2 closed/open status;
- whether N1-N4 are adequately addressed or deferred;
- any regression/new blocker introduced by the fixes; and
- explicit authorization or denial for PR preparation.

## Prior Verdict

You returned FAIL with:

- **B1:** possible `currentPreview` leak when cancellation invalidates a run and
  the stale `beginRun` catch returns without `fail()`;
- **B2:** `VideoFrameSource.dispose()` might leave pending seek promises alive.

Non-blocking:

- N1 retry during cancellation could silently abort;
- N2 `fail()` implementation was omitted from audit evidence;
- N3 prior-session terminal ordering lacked direct Playwright evidence; and
- N4 future export must exclude `observedSeekTimestampMs`.

## B1 Evidence And Direct Race Test

B1 was already closed by implementation, but the initial audit prompt omitted
the relevant method:

```ts
private releaseOutputs(): void {
  this.currentPreview?.close();
  this.currentPreview = undefined;
  for (const output of this.outputs) output.preview.close();
  this.outputs = [];
}
```

Cancellation/close invalidates generation, then immediately calls
`releaseOutputs()` before source/processor teardown:

```ts
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

Failure also closes current and accumulated previews:

```ts
private async fail(generation: number, error: unknown): Promise<void> {
  if (!this.isActive(generation)) return;
  this.generation += 1;
  this.currentPreview?.close();
  this.currentPreview = undefined;
  this.releaseOutputs();
  this.source?.dispose();
  this.source = undefined;
  await this.closeProcessor();
  this.setState("failed", toErrorCode(error));
}
```

New direct test:

- start a one-sample run;
- wait until preview exists and inference promise is pending;
- cancel, which invalidates generation and closes `currentPreview`;
- resolve stale inference;
- assert exactly one preview close, no output, and only cancelled terminal
  state.

This proves the stale catch-return cannot leak the current preview because the
concurrent invalidating cleanup owns and releases it.

## B2 Fix: Explicit Pending Operation Rejection

`VideoFrameSource` now tracks pending metadata/seek rejection callbacks:

```ts
private disposed = false;
private pendingRejects = new Set<(error: Error) => void>();
```

Both `load()` and `seek()`:

- reject immediately when already disposed;
- register an `onDisposed` rejection handler;
- remove media listeners and the pending rejection handler on any resolution,
  error, or disposal.

Disposal:

```ts
dispose(): void {
  if (this.disposed) return;
  this.disposed = true;
  const error = new Error("MEDIA_SOURCE_DISPOSED");
  for (const reject of [...this.pendingRejects]) reject(error);
  this.pendingRejects.clear();
  this.video.pause();
  this.video.removeAttribute("src");
  this.video.load();
  URL.revokeObjectURL(this.objectUrl);
}
```

Focused unit tests prove:

- in-flight seek rejects with `MEDIA_SOURCE_DISPOSED`, listeners no longer
  react, and URL is revoked;
- in-flight metadata load rejects with `MEDIA_SOURCE_DISPOSED`.

## N1-N4 Disposition

- **N1 fixed:** `retry()` awaits `cleanupPromise` before state validation and
  `beginRun()`. Test proves retry called during cancel waits and initializes
  the next processor rather than silently aborting.
- **N2 closed:** `fail()` and `releaseOutputs()` are embedded above. Tests prove
  current preview cleanup on inference creation failure and current plus
  accumulated preview cleanup on later inference failure.
- **N3 closed with stronger unit evidence:** tests prove prior processor closes
  before next processor initializes and retry queues behind in-progress
  cancellation. Existing Playwright retry proves end-to-end fresh-session
  success. No test-only browser instrumentation was added to production.
- **N4 explicitly deferred:** export is out of SS-006 scope. The normative spec
  prohibits observed seek timestamp diagnostics, persistence, network transit,
  and export absent a later reviewed story.

## Focused Diff Summary

- `src/browser-frame-processing.ts`: pending operation rejection and idempotent
  source disposal.
- `src/frame-processing.ts`: retry awaits active cleanup.
- `test/unit/browser-frame-processing.test.ts`: disposal rejects pending seek
  and metadata load.
- `test/unit/frame-processing.test.ts`: direct current-preview cancellation
  race and retry-during-cancel sequencing.

No dependency, SDK, model, asset, CSP, service-worker, data contract, or
observability expansion was introduced.

## Verification

Passed on Node 22 after focused fixes:

- 29 unit tests;
- 26 desktop/mobile Chromium production browser tests;
- build;
- compliance, safety, privacy;
- license audit and bundle-license fixture;
- approved pose-asset hashes;
- one-component production SBOM;
- zero production vulnerabilities; and
- `git diff --check`.

Return PASS only if B1 and B2 are closed, N1-N4 are adequately resolved or
deferred, and no new blocker was introduced. Explicitly state whether PR
preparation is authorized.
