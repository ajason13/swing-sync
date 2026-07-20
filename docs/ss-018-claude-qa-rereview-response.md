# SS-018 Claude QA Focused Re-Review Response

Date: 2026-07-04

Stage: Focused pre-implementation QA re-review after Round 1 FAIL.

Verdict: FAIL.

Claude closed B1-B6 and introduced two new blockers, B7-B8. Codex accepts both
new blockers as valid planning defects and revised
`docs/ss-018-preimplementation-spec.md` before implementation.

## Closed Findings

- B1: Closed. State mutation ownership through named transitions and
  `selectCanBeginAnalysis(state, consentAccepted)` is accepted.
- B2: Closed. `src/render-utils.ts` is accepted as canonical shared render
  helper ownership.
- B3: Closed. `src/remote-model-renderer.ts` is accepted as the
  remote-review-unavailable owner.
- B4: Closed. Required `observedSeekTimestampMs` export-exclusion coverage is
  accepted.
- B5: Closed. Injectable `ConsentStorage` is accepted.
- B6: Closed. `closeActive()` and `abortWithNetworkBlocked()` lifecycle
  methods are accepted.

## New Blockers

### B7: Render-To-Rebind Control Loop Unspecified

Claude finding: splitting rendering into `app-renderer.ts` and event binding
into `app-events.ts` did not specify who triggers re-render after transitions
or how listener reattachment avoids stale UI or double-fired actions.

Disposition: Accepted.

Spec response:

- `src/main.ts` owns a `requestRender(statusMessage?)` coordinator closure.
- `src/app-events.ts` receives `requestRender` as an explicit dependency and
  calls it after every state-changing transition unless existing behavior only
  updates current processing DOM through lifecycle progress handlers.
- `requestRender` calls `app-renderer.renderApp(...)`, fully replaces the
  `#app` subtree, calls `app-events.bindAppEvents(...)` on the fresh DOM, and
  redraws the selected keyframe canvas when present.
- Because the subtree is replaced, old listeners are discarded with old nodes;
  no explicit teardown is required for the current direct-DOM pattern.
- Unit tests must cover repeated render/bind cycles and prove a single
  interaction produces a single effect after multiple re-renders.

### B8: Non-Serializable Frame Controller Handle Ownership Ambiguous

Claude finding: B1's app-state ownership rule conflicted with B6 lifecycle
tests because `frameController` and `abortFrameController` are live resource
handles that may not belong in reducer-style state.

Disposition: Accepted.

Spec response:

- `src/app-state.ts` holds only serializable or UI-derived session state.
- `FrameProcessingController` and abort callback handles are owned by
  `src/analysis-lifecycle.ts` as an explicit scoped exception to the
  direct-state-mutation ban.
- Lifecycle code must call app-state transition functions so derived UI state
  remains synchronized after close/abort.
- Unit tests must prove close clears lifecycle controller handles and drives
  the expected app-state transition.

## Non-Blocking Recommendations Incorporated

- Cleaned up duplicated `confirmation/confirmation` wording.
- Required full-matrix `selectCanBeginAnalysis` unit tests.
- Required consent storage failure tests proving the public consent query
  function fails closed after get/set/remove failures.

## Current Gate

Implementation remains blocked pending focused Claude B7-B8 re-review PASS.
