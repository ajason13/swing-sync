# SS-018 Claude QA Planning Response

Date: 2026-07-04

Stage: Pre-implementation QA planning.

Verdict: FAIL.

Claude found the refactor intent sound, but identified six blockers in the
module ownership plan. Codex accepts all six blockers as valid planning defects
and revised `docs/ss-018-preimplementation-spec.md` before implementation.

## Blockers

### B1: Missing State-Mutation Ownership Contract

Claude finding: `app-state.ts` had no explicit contract for whether consuming
modules mutate shared fields directly or use named transitions.

Disposition: Accepted.

Spec response:

- `src/app-state.ts` must own all state mutation through named transition
  functions or a reducer-style API.
- Other modules must not mutate state fields directly.
- The spec names required transition functions for workflow selection, local
  video selection, processing state/progress/output, phase review, keyframe
  selection, overlay result, and Swing Card busy/status.
- `selectCanBeginAnalysis(state, consentAccepted)` is now the single source
  for the `#analysis-button` enablement decision.

### B2: Shared Render Helpers Had No Owner

Claude finding: `escapeHtml`, `formatRemoteDataClass`, and
`formatSwingCardWarning` could be duplicated across renderer modules.

Disposition: Accepted.

Spec response:

- Added `src/render-utils.ts` as the canonical home for those helpers.
- Renderer/action modules must import helpers from `src/render-utils.ts`.
- Added a required escaping regression for user-controlled selected file names.

### B3: Remote-Review-Unavailable Rendering Was Unassigned

Claude finding: `renderRemoteModelReviewPanel` was not assigned to a target
module even though provider/model registry behavior is a protected boundary.

Disposition: Accepted.

Spec response:

- Added `src/remote-model-renderer.ts` for remote-review-unavailable rendering,
  empty-provider registry disclosure, and outbound/blocked data class display.

### B4: Missing `observedSeekTimestampMs` Export-Exclusion Test

Claude finding: moving `prepareSwingCardContent` into `swing-card-actions.ts`
touches a path that must keep `observedSeekTimestampMs` out of exported Swing
Card content.

Disposition: Accepted.

Spec response:

- Added required Swing Card action unit tests that serialize or inspect every
  produced Swing Card content shape and assert `observedSeekTimestampMs` is
  absent.
- The spec explicitly forbids copying `observedSeekTimestampMs` into
  `SwingCardContent`, prompt text, PNG/print content, clipboard content, or
  any serialized/exported value.

### B5: Consent Storage Injection Was Not Explicit

Claude finding: consent failure-path unit tests depend on injectable storage,
but the spec did not require it.

Disposition: Accepted.

Spec response:

- Added an explicit `ConsentStorage` interface with `getItem`, `setItem`, and
  `removeItem`.
- Production construction defaults to `window.localStorage`.
- Unit tests must pass fake storage objects directly.

### B6: Global Lifecycle Handler Contract Was Unspecified

Claude finding: `beforeunload` and `securitypolicyviolation` are
security/privacy-relevant global paths, but the plan did not name the exported
lifecycle methods `main.ts` should call after extraction.

Disposition: Accepted.

Spec response:

- `main.ts` must call `analysisLifecycle.closeActive()` from `beforeunload`.
- `main.ts` must call `analysisLifecycle.abortWithNetworkBlocked()` from
  `securitypolicyviolation`.
- `abortWithNetworkBlocked()` must preserve the current loading/processing-only
  guard and abort code `UNEXPECTED_NETWORK_BLOCKED`.
- Lifecycle unit tests must cover active loading/processing abort, inactive
  no-op behavior, and controller-reference clearing after close.

## Non-Blocking Recommendations Incorporated

- `src/app-events.ts` is now required instead of optional.
- `npm run test:smoke` is required after protected-boundary extraction
  milestones when practical.
- `npm run docs:verify` is explicit in required final verification.
- Imperative canvas helpers are assigned to `src/keyframe-overlay-renderer.ts`
  instead of being mixed into pure HTML renderers.
- Renderer contract tests must directly assert every protected label/selector
  at least once where it appears.

## Current Gate

Implementation remains blocked pending focused Claude B1-B6 re-review PASS.
