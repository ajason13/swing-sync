# SS-018 Claude QA Focused B7/B8 Re-Review Response

Date: 2026-07-05

Stage: Focused pre-implementation QA re-review after Round 2 FAIL.

Verdict: FAIL.

Claude closed B8 and kept B7 open. Codex accepts the residual B7 finding as a
valid planning defect and revised `docs/ss-018-preimplementation-spec.md`
before implementation.

## Closed Finding

### B8: Controller-Handle Ownership

Status: Closed.

Claude accepted the plan that `src/app-state.ts` holds only serializable or
UI-derived fields while `src/analysis-lifecycle.ts` owns the non-serializable
`FrameProcessingController` and abort callback handles as a documented
exception to the app-state mutation rule.

## Open Finding

### B7: Processing Progress Partial-Update Ownership

Status: Still open in Claude Round 3; accepted by Codex.

Claude finding: the prior plan correctly specified the full render/rebind loop
for synchronous user-triggered transitions, but left a vague carve-out for
frame-processing progress/output ticks. That partial-update path could cache
detached DOM nodes or create a second renderer for processing-panel status.

Spec response:

- `src/app-renderer.ts` now owns processing-panel DOM partial updates.
- Required exported API:

```ts
export function updateProcessingProgressUi(root: ParentNode, state: AppState): void;
```

- `src/analysis-lifecycle.ts` owns frame-processing callbacks and
  non-serializable controller handles, but after app-state transitions it must
  delegate processing-panel DOM updates to
  `app-renderer.updateProcessingProgressUi(...)`.
- `src/analysis-lifecycle.ts` must not cache processing DOM nodes or write
  progress/status text directly.
- `updateProcessingProgressUi` must re-query current DOM targets on each call,
  including `[data-pose-summary]`, `[data-retry-analysis]`, and
  `[data-review-phases]`, so updates continue to hit the visible DOM after any
  intervening full `requestRender(...)` replacement.
- Unit tests must trigger a full render during active processing and then
  assert the next progress/output tick updates the visible
  `[data-pose-summary]` text rather than a detached node.
- A composition test must cover stop during processing, controller handle
  clearing, app-state reaching `idle`, and a subsequent `requestRender(...)`
  reflecting the idle/capture UI.

## Non-Blocking Recommendation

Claude suggested considering progress-tick throttling. Codex defers this:
SS-018 preserves current behavior and the existing eight-sample processing
cadence. Throttling can be considered in a future performance story if
profiling shows a need.

## Current Gate

Implementation remains blocked pending focused Claude residual B7 re-review
PASS.
