# SS-018 Preimplementation Spec

Date: 2026-07-04

Status: Candidate spec for Claude QA planning. Do not implement the runtime
refactor until Claude QA planning passes or blocking findings are resolved and
re-reviewed.

## Story

Reduce `src/main.ts` orchestration pressure before the next UI feature wave.
Keep behavior unchanged while separating workflow rendering, state
transitions, export controls, consent handling, and analysis lifecycle into
clearer modules.

## Acceptance Criteria

- Split the current app shell into focused modules without changing
  user-facing behavior.
- Keep consent gating, local video selection, local pose processing, phase
  review, Swing Card export, and remote-review-unavailable behavior intact.
- Preserve existing accessibility labels and test selectors used by smoke
  tests.
- Add or adjust unit tests around extracted state/renderer behavior where
  useful.
- No new framework or dependency unless separately reviewed and approved.

## Protected Boundaries

- Do not change runtime privacy posture, raw-media handling, remote sharing,
  provider/model registry behavior, service-worker behavior, or exported data
  classes.
- Do not add telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts.
- Preserve `docs/privacy-architecture.md`, `docs/safety-terms.md`,
  `docs/licensing.md`, and `docs/models-licensing.md` boundaries.

## Target Files

Expected runtime files:

- Keep `src/main.ts` as the app bootstrap and global listener registration
  entry point.
- Add `src/app-state.ts` for state shape, initial state, and reset helpers.
- Add `src/consent-state.ts` for local acknowledgement storage helpers and
  fail-closed storage behavior.
- Add `src/render-utils.ts` as the single canonical home for shared rendering
  helpers: `escapeHtml`, `formatRemoteDataClass`, and
  `formatSwingCardWarning`.
- Add `src/app-renderer.ts` for top-level shell rendering and workflow panel
  dispatch, plus processing-panel partial update helpers.
- Add `src/phase-review-renderer.ts` for phase review, declaration controls,
  and keyframe review HTML.
- Add `src/keyframe-overlay-renderer.ts` for imperative canvas drawing helpers
  such as selected keyframe rendering and annotated keyframe bitmap creation.
- Add `src/remote-model-renderer.ts` for remote-review-unavailable rendering,
  empty-provider registry disclosure, and outbound/blocked data class display.
- Add `src/swing-card-actions.ts` for Swing Card preparation and local export
  actions.
- Add `src/analysis-lifecycle.ts` for frame-processing lifecycle state
  handlers around `FrameProcessingController`.
- Add `src/app-events.ts` for `bindInteractions` ownership and cross-module
  event wiring.

Expected tests:

- Add focused unit tests for `consent-state` fail-closed behavior.
- Add focused unit tests for `app-state` reset behavior, especially phase
  review and Swing Card status reset.
- Add full-matrix `selectCanBeginAnalysis` tests covering consent true/false,
  selected video present/absent, and active processing states so the canonical
  gate cannot drift.
- Add consent-state tests proving get/set/remove storage failures propagate
  through the public consent query function as a fail-closed not-consented
  result, not only that fake storage methods threw.
- Add focused renderer tests that verify protected selectors and labels remain
  present for capture, processing, review, export, and remote-review-disabled
  branches without requiring Playwright.
- Add focused Swing Card action tests that assert `observedSeekTimestampMs` is
  absent from every serialized/exported Swing Card content shape produced by
  the extracted export-preparation module.
- Add focused lifecycle tests that assert `securitypolicyviolation` still maps
  an active loading/processing session to `UNEXPECTED_NETWORK_BLOCKED`.
- Keep the smoke suite as the end-to-end behavior gate.

No dependency, framework, package lock, SBOM, license policy, notice, provider,
model, worker asset, service-worker, telemetry, analytics, remote logging,
backend, or cloud-storage file should change.

## Module Requirements

### `src/main.ts`

- Import `./styles.css`.
- Select `#app`.
- Instantiate app state and dependencies.
- Render the initial app.
- Register `beforeunload`, `securitypolicyviolation`, and production
  service-worker listeners with the same conditions as today.
- Call `analysisLifecycle.closeActive()` from `beforeunload`.
- Call `analysisLifecycle.abortWithNetworkBlocked()` from
  `securitypolicyviolation`; the lifecycle method must preserve the current
  loading/processing-only guard and abort code `UNEXPECTED_NETWORK_BLOCKED`.
- Own a small `requestRender(statusMessage?: string)` coordinator closure that
  calls `app-renderer.renderApp(...)`, fully replaces the `#app` subtree, calls
  `app-events.bindAppEvents(...)` on the fresh DOM, and then calls
  `keyframe-overlay-renderer.renderSelectedKeyframeCanvas(...)`.
- Preserve the `#app` root element itself. `requestRender(...)` replaces only
  its children, so a reference to the root may be safely passed across
  lifecycle partial-update calls.
- Avoid owning detailed HTML rendering, Swing Card content construction, or
  frame-processing lifecycle internals after extraction.

### `src/consent-state.ts`

- Export a small injectable storage interface:

```ts
export interface ConsentStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
```

- Default production construction must use `window.localStorage`.
- Unit tests must pass fake storage objects directly; they must not require a
  real browser storage implementation.
- Preserve storage key `swing-sync:safety-consent:v1`.
- Preserve fail-closed behavior:
  - if `localStorage.getItem` throws, consent is treated as not accepted;
  - after a storage failure, consent checks return false;
  - if `localStorage.setItem` or `removeItem` throws, future consent checks
    return false.
- Store only the existing local acknowledgement value `accepted`.
- Do not upload, log, persist extra data, or create durable legal/privacy
  consent claims.
- Unit tests must cover accepted, missing, get failure, set failure, and
  remove failure paths, and must assert those failures are observable through
  the public consent query function as `false`.

### `src/app-state.ts`

- Define the mutable app state shape currently represented by top-level
  variables in `src/main.ts`.
- Own all state mutation through named transition functions or a reducer-style
  API. Other modules must not mutate state fields directly.
- Export explicit transition functions for current behaviors, including at
  least:
  - `selectWorkflowStep`;
  - `selectLocalVideo`;
  - `setProcessingState`;
  - `setProcessingProgress`;
  - `recordProcessingOutput`;
  - `completeProcessingWithOutputs`;
  - `resetPhaseReview`;
  - `rebuildPhaseReviewState`;
  - `setPhaseDeclaration`;
  - `setPhaseDraftAssignment`;
  - `setPhaseConfirmation`;
  - `confirmPhaseReview`;
  - `selectKeyframe`;
  - `setOverlayResult`;
  - `setSwingCardBusy`;
  - `setSwingCardStatus`.
- Export a selector such as `selectCanBeginAnalysis(state, consentAccepted)`
  as the single source for the `#analysis-button` enablement decision.
- Keep only serializable or UI-derived session state in `AppState`, including
  `processingState`, `poseStatusCode`, frame counts, landmark count, selected
  video metadata/reference, phase review state, selected keyframe index,
  overlay result, and Swing Card busy/status.
- Do not store non-serializable frame-analysis resource handles such as
  `FrameProcessingController` or the abort callback in `AppState`. Those live
  in `src/analysis-lifecycle.ts` as an explicit scoped exception to the
  direct-state-mutation ban.
- Provide an initial state helper with current defaults:
  - active step `capture`;
  - processing state `idle`;
  - zero frame and landmark counts;
  - empty phase outputs and draft assignments;
  - undeclared phase declarations;
  - selected keyframe index `0`;
  - Swing Card status `Swing Card export is generated locally after review
    data exists.`;
  - no selected video, controller, abort handler, pose status code, review
    state, overlay result, or busy export state.
- Unit tests must verify transition functions preserve existing behavior,
  including that reset helpers clear volatile phase/export state without
  changing unrelated workflow fields.
- Unit tests must enumerate `selectCanBeginAnalysis(state, consentAccepted)`
  across consent true/false, selected video present/absent, and active
  processing states. It should only enable the start action when consent is
  accepted, a selected local video exists, and the workflow is in the current
  allowed pre-analysis state.

### `src/render-utils.ts`

- Export one `escapeHtml` helper used by every string renderer for
  user-controlled text such as selected file names, warnings, and status
  strings.
- Export one `formatRemoteDataClass` helper for
  `src/remote-model-renderer.ts`; do not duplicate remote data class
  formatting in renderer modules.
- Export one `formatSwingCardWarning` helper for Swing Card panel rendering;
  do not duplicate warning-label mapping in renderer or action modules.
- Renderer modules must import these helpers from `src/render-utils.ts`.
- Unit tests must include at least one escaping regression proving
  user-controlled selected file names render escaped.

### Renderers

- Renderer modules may continue returning HTML strings. They should receive
  explicit state and derived dependencies rather than reading unrelated module
  globals.
- Preserve HTML escaping for user-controlled values by importing
  `escapeHtml` from `src/render-utils.ts`.
- Preserve all accessibility labels, status roles, button names, IDs, and
  `data-*` selectors currently used by `test/smoke/app.spec.ts`.
- Preserve remote-review unavailable copy, empty provider registry behavior,
  and outbound/blocked data class rendering from the existing model-consent
  modules through `src/remote-model-renderer.ts`.
- Renderer tests must directly assert every protected label and selector from
  `docs/ss-018-research-disposition.md` at least once in the branch where it
  appears. This is required minimum coverage, not an alternative to smoke
  tests.
- Keep pure HTML-string renderers separate from imperative canvas drawing.
  `src/phase-review-renderer.ts` owns phase-review/keyframe HTML;
  `src/keyframe-overlay-renderer.ts` owns canvas drawing and bitmap creation.
- `src/app-renderer.ts` owns processing-progress DOM updates through exported
  partial-update functions. `analysis-lifecycle.ts` must not mutate processing
  DOM nodes directly.
- Required processing partial-update API:

```ts
export function updateProcessingProgressUi(root: ParentNode, state: AppState): void;
```

- `updateProcessingProgressUi` must re-query current DOM targets on each call
  using selectors such as `[data-pose-summary]`, `[data-retry-analysis]`, and
  `[data-review-phases]`; it must not cache element references across ticks.
  This keeps progress updates attached to the visible DOM after any
  intervening full `requestRender(...)` replacement.
- If the processing-panel selectors are absent, `updateProcessingProgressUi`
  must no-op rather than throw. This covers close/abort timing where a late
  callback arrives after the processing panel has been replaced.
- `updateProcessingProgressUi` must use `textContent` or element properties for
  dynamic status/progress writes. If future user-influenced HTML is added to
  this function, it must route through `render-utils.escapeHtml`.
- Unit tests must trigger an intervening full render during active processing
  and then assert the next progress/output tick updates the visible
  `[data-pose-summary]` text rather than a detached node.
- Unit tests must cover no-op behavior when processing selectors are absent.

### Analysis Lifecycle

- Preserve `createBrowserFrameController(video, selectedVideo, callbacks)` as
  the runtime path for local pose processing.
- Preserve progress, output, completed, failed, cancelled, and closed status
  text.
- Own frame-processing callbacks and controller handles, but delegate every
  processing-panel DOM update to `app-renderer.updateProcessingProgressUi(...)`
  after calling app-state transition functions. `analysis-lifecycle.ts` must
  not cache progress DOM nodes or write progress/status text directly.
- Preserve behavior where completed processing captures outputs, resets
  selected keyframe index, clears declarations, and rebuilds phase review.
- Preserve `securitypolicyviolation` abort behavior while loading or
  processing with code `UNEXPECTED_NETWORK_BLOCKED`.
- Export `closeActive()` for the `beforeunload` path.
- Export `abortWithNetworkBlocked()` for the `securitypolicyviolation` path.
  It must check current processing state and only abort when state is
  `loading` or `processing`, preserving current behavior.
- Preserve close/cancel behavior that releases volatile resources and clears
  controller references when appropriate.
- Lifecycle unit tests must cover active loading/processing abort,
  non-active idle/completed no-op behavior, and controller-reference clearing
  after close.
- After lifecycle-owned controller handles are closed or cleared, lifecycle
  code must call app-state transition functions so derived UI state remains in
  sync with the lifecycle state. Unit tests must prove close clears lifecycle
  controller handles and drives the expected app-state transition, rather than
  leaving either side stale.
- Add a compose test for the stop-during-processing path: user action calls
  lifecycle stop/close, controller handles are cleared, app-state reaches
  `idle`, and a subsequent `requestRender(...)` reflects the idle/capture UI.
- Do not add persistence, network calls, telemetry, logging, or debug
  artifacts.

### Swing Card Actions

- Preserve local content preparation from phase definitions and selected
  assignments.
- Preserve generated bitmap release behavior.
- Preserve PNG download, print-host rendering, and clipboard prompt copy
  status strings.
- Preserve raw-video exclusion and manual-sharing-only behavior.
- Preserve disabled/busy behavior for Swing Card controls.
- Do not change `SwingCardContent`, `SwingCardKeyframe`, outbound data class
  unions, or exported report contents.
- Do not copy `observedSeekTimestampMs` from `SampledFrameOutput` into
  `SwingCardContent`, prompt text, PNG/print content, clipboard content, or
  any serialized/exported value. SS-018 touches export preparation by moving
  it, so this exclusion must be asserted in new unit coverage.
- Unit tests must serialize or inspect every produced Swing Card content shape
  from the extracted module and assert `observedSeekTimestampMs` is absent.

### `src/app-events.ts`

- Own DOM event binding currently in `bindInteractions`.
- Export `bindAppEvents(root, dependencies)` as the only event-binding entry
  point.
- Receive state transition functions, consent helpers, `requestRender`
  callback,
  analysis lifecycle, phase-review actions, and Swing Card actions as explicit
  dependencies.
- After every state-changing transition, handler code must call
  `requestRender(statusMessage?)`. Frame-processing progress/output ticks are
  the only partial-update path, and they are owned by `analysis-lifecycle.ts`
  delegating to `app-renderer.updateProcessingProgressUi(...)`.
- `requestRender(statusMessage?)` is owned by the bootstrap coordinator in
  `src/main.ts`: it fully replaces the `#app` subtree via
  `app-renderer.renderApp(...)`, calls `bindAppEvents(...)` against the fresh
  subtree, and then redraws the selected keyframe canvas when present.
- Because each render replaces `#app.innerHTML`, old event listeners are
  discarded with the old DOM nodes. No explicit listener teardown is required
  for the current direct-DOM pattern. If a future implementation changes to
  persistent DOM nodes, it must add teardown or delegated-listener coverage in
  the same reviewed change.
- Do not mutate state fields directly; call `src/app-state.ts` transition
  functions.
- Do not duplicate `selectCanBeginAnalysis`; use the selector from
  `src/app-state.ts`.
- Unit tests must cover repeated render/bind cycles for at least one
  state-changing control and one Swing Card action: after two re-renders,
  triggering the control once must produce a single effect, not a duplicate
  listener effect.

## Migration Steps

1. Add `src/app-state.ts`, transition functions/selectors, and
   `src/consent-state.ts` with injectable storage. Run targeted unit tests.
2. Add `src/render-utils.ts` and extract pure renderers, including
   `src/remote-model-renderer.ts`, while keeping protected labels/selectors
   equivalent. Add `app-renderer.updateProcessingProgressUi(...)` and run
   renderer/partial-update contract tests.
3. Add `src/keyframe-overlay-renderer.ts` for canvas/bitmap helpers.
4. Extract `src/analysis-lifecycle.ts` with `closeActive()` and
   `abortWithNetworkBlocked()`. Run lifecycle tests including the CSP abort
   path.
5. Extract `src/swing-card-actions.ts` and add the
   `observedSeekTimestampMs` exclusion regression.
6. Extract `src/app-events.ts` and keep `src/main.ts` as bootstrap only.
7. Run `npm run test:smoke` after each protected-boundary extraction
   milestone: consent/app-state, remote-model rendering, analysis lifecycle,
   and Swing Card actions.
8. Keep any behavior bug discovered during extraction out of scope unless it
   becomes a documented blocker and receives focused QA review.

## Test Plan

Targeted unit tests:

- `npm run test:unit -- consent-state`
- `npm run test:unit -- app-state`
- `npm run test:unit -- render-utils`
- `npm run test:unit -- app-renderer`
- `npm run test:unit -- phase-review-renderer`
- `npm run test:unit -- remote-model-renderer`
- `npm run test:unit -- analysis-lifecycle`
- `npm run test:unit -- app-events`
- `npm run test:unit -- swing-card-actions`
- Existing related tests such as `npm run test:unit -- workflow`,
  `npm run test:unit -- phase-review`, and
  `npm run test:unit -- swing-card-generator` as changed surfaces require.

Browser smoke:

- `npm run test:smoke`
- Run after each protected-boundary extraction milestone when practical, and
  always before final audit handoff.

Required final verification:

- `npm run build`
- `npm run docs:verify`
- `npm run compliance:verify`
- `npm run safety:verify`
- `npm run privacy:verify`
- `git diff --check`

No dependency, bundle, license-policy, notice, or SBOM changes are expected. If
that changes, run `npm run license:audit`,
`npm run verify:bundle-license-fixture`, and `npm run sbom:generate` before PR
handoff.

Test evidence for the final audit must map named tests to acceptance criteria,
protected boundaries, and any QA blockers, especially selector/label
preservation, consent fail-closed behavior, local-first processing,
`securitypolicyviolation` fail-closed behavior, remote-review-disabled
behavior, render/rebind single-effect behavior, processing-progress
partial-update survival after intervening full render, lifecycle handle
ownership sync with app-state transitions, stop-during-processing render
composition, `observedSeekTimestampMs` export exclusion, and no
dependency/telemetry changes.

## Rollback Risk

The primary risk is behavioral drift caused by moving shared mutable state and
DOM event binding across modules. Keep the migration reversible by preserving
plain TypeScript modules, direct imports, existing public function behavior,
and current smoke-test selectors.

The fallback is to keep a smaller extraction if a proposed module boundary
adds complexity without reducing `src/main.ts` orchestration pressure.

## Audit Packet Requirements

Claude QA planning and final audit packets must be self-contained. Include:

- every changed tracked file, or a concrete rationale for omission;
- focused diffs or complete coherent excerpts for runtime modules under
  review;
- named test results mapped to acceptance criteria and any audit blockers;
- explicit observability decision;
- protected no-telemetry/no-remote/no-dependency boundaries.

## Observability Decision

SS-018 intentionally leaves runtime observability unchanged. No logs,
telemetry, analytics, remote logging, cloud diagnostics, hidden identifiers,
persistent debug artifacts, or new operator diagnostics should be added.
