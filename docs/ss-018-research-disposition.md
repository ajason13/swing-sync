# SS-018 Research And Disposition

Date: 2026-07-04

Task: SS-018 Refactor frontend app shell into maintainable UI/state modules.

## Classification

SS-018 is privacy-, safety-boundary-, frontend-runtime-, refactor-,
accessibility/test-selector-, and user-facing-behavior-sensitive.

This is a runtime refactor story. It must preserve consent gating, local video
selection, local pose processing, phase review, Swing Card export, remote model
review unavailable behavior, accessibility labels, smoke-test selectors,
local-first raw-media handling, provider/model registry behavior,
service-worker behavior, and exported data classes.

## Source Checks

- Swing Sync task page, checked 2026-07-04:
  https://app.notion.com/p/392834a0c8a68115b23bda9510e07958
- Dedicated test case created 2026-07-04:
  https://app.notion.com/p/393834a0c8a68126b03deeb86d5d67fa
- Current app shell: `src/main.ts`.
- Existing workflow model: `src/workflow.ts`.
- Current smoke contract: `test/smoke/app.spec.ts`.
- Current local-first and no-default-upload boundary:
  `docs/privacy-architecture.md`.
- Current safety and consent-gate boundary: `docs/safety-terms.md`.
- Current package scripts and dependency baseline: `package.json`.

## Current `src/main.ts` Responsibilities

`src/main.ts` is currently 869 lines and owns all browser-shell orchestration:

- module imports and initial app boot;
- local acknowledgement storage through `swing-sync:safety-consent:v1`;
- mutable workflow/session state for selected video, active step, frame
  processing, phase review, selected keyframe, overlay state, and Swing Card
  export status;
- capture, processing, review, export, remote-review, and keyframe HTML
  rendering;
- event binding for consent, local video picker, workflow navigation,
  analysis start/stop/retry, phase declarations, phase correction, keyframe
  selection, and Swing Card actions;
- local frame-processing lifecycle integration with
  `createBrowserFrameController`;
- phase proposal/review state rebuilds;
- selected keyframe overlay rendering;
- Swing Card content preparation, PNG download, print host rendering, prompt
  copying, and generated bitmap release;
- `beforeunload`, `securitypolicyviolation`, and production service-worker
  registration listeners.

## Existing Protected DOM/Test Surface

Smoke tests and accessibility checks currently depend on these user-facing
labels, selectors, and states:

- headings: `Capture or choose your swing`, `Capture or upload`, `Processing`,
  `Review`, `Export`, `Downloadable summary`, and
  `Remote model review unavailable`;
- controls: `Use camera`, `Choose a video`, `Begin analysis`,
  `Stop local analysis`, `Retry local analysis`, `Review phase labels`,
  `Confirm phase review`, `Open Swing Card export`, `Download PNG`,
  `Print / Save as PDF`, `Copy prompt`, and `Remote review unavailable`;
- selectors: `#video-file`, `#analysis-button`, `[data-pose-summary]`,
  `[data-keyframe-canvas]`, `[data-overlay-status]`,
  `[data-keyframe-index]`, `[data-phase-index]`,
  `[data-confirm-phase-review]`, `[data-open-export]`,
  `[data-download-swing-card]`, `[data-print-swing-card]`,
  `[data-copy-swing-card-prompt]`, `[data-swing-card-status]`,
  `[data-swing-card-print-host]`, and `[data-remote-model-send]`;
- labels: `Local video source`, `Local pose processing`,
  `Selected local video`, `Swing phase assignments`, `View`, `Handedness`,
  `Horizontally mirrored`, `Swing Card contents`, `Swing Card warnings`,
  `Remote model data disclosure`, and `Select keyframe`;
- privacy/safety status strings used by tests, including local-only analysis
  status, storage failure behavior, no-sensitive-console-output assertions,
  external-network blocking, and volatile resource release after stop.

## Adopt

- Split `src/main.ts` into focused modules while keeping the current Vite
  TypeScript stack and direct DOM rendering approach.
- Keep `src/main.ts` as a thin bootstrap that imports styles, creates the app
  shell, renders the initial state, and registers global lifecycle listeners.
- Extract consent storage into a small module with injectable storage-like
  behavior so storage failure and removal-failure paths can be unit tested
  without browser smoke setup.
- Extract app state/session defaults into a module that centralizes initial
  values and reset behavior for phase review and Swing Card status.
- Require app state mutation to flow through named transition functions or a
  reducer-style API. Other modules should not mutate state fields directly.
- Add a shared `render-utils.ts` module for `escapeHtml`,
  `formatRemoteDataClass`, and `formatSwingCardWarning` so security-relevant
  escaping and protected-boundary formatting are not copy-pasted.
- Extract renderers into modules that return existing HTML strings and keep
  stable labels/selectors intact.
- Assign remote-review-unavailable rendering to an explicit
  `remote-model-renderer.ts` module because provider/model registry behavior is
  a protected boundary.
- Extract app-event binding into a controller module that receives state,
  rendering, and lifecycle dependencies rather than relying on unrelated
  global functions.
- Extract frame-analysis lifecycle handling so `start`, `stop`, `close`,
  progress, output, and state transitions have a clear boundary around
  `FrameProcessingController`.
- Give the analysis lifecycle explicit `closeActive()` and
  `abortWithNetworkBlocked()` exports for the `beforeunload` and
  `securitypolicyviolation` paths.
- Extract Swing Card actions/content preparation into an export controller
  module while preserving local-only generation and downloaded/printed/copied
  behavior.
- Add `observedSeekTimestampMs` export-exclusion regression coverage when
  Swing Card content preparation moves, because that field is carried on
  `SampledFrameOutput` but must stay out of exported/serialized content.
- Add focused unit tests for pure extracted state and consent behavior, plus
  renderer selector/label preservation where useful.
- Keep the existing smoke suite as the behavioral gate for the primary
  browser workflow.
- Keep observability unchanged. This refactor does not add logs, telemetry,
  analytics, remote logging, cloud diagnostics, hidden identifiers, persistent
  debug artifacts, or new operator diagnostics.
- Add no dependency, framework, bundle-license, notice, or SBOM changes.

## Revise Before Adoption

- Avoid a broad component framework or virtual DOM abstraction. The repo
  currently uses plain TypeScript, Vite, string renderers, and direct DOM
  event binding; SS-018 should improve maintainability inside that pattern.
- Avoid splitting every small helper into its own file. The useful boundary is
  behavior ownership: consent, app state, rendering, event wiring, analysis
  lifecycle, and export controls.
- Treat renderer tests as contract checks for labels/selectors and branching,
  not pixel or layout tests. Layout remains covered by existing smoke/mobile
  checks.
- Keep event-binding tests focused on pure transition helpers or injected
  dependencies where practical. Do not re-create the full Playwright workflow
  in unit tests.
- If extraction reveals a behavior bug, record it as a separate issue or
  explicit spec change before fixing it in SS-018.

## Defer

- Framework migration, router introduction, state-management libraries, and
  component libraries are deferred.
- Design refresh, visual changes, copy rewrites, and new user-facing workflow
  states are deferred.
- New remote review, provider registry, model-provider configuration, API,
  cloud storage, persistence, telemetry, analytics, remote logging, and debug
  artifact behavior is deferred.
- Service-worker registration changes are deferred.
- Exported data class changes are deferred.
- Additional browser network guards or runtime diagnostics are deferred unless
  a later reviewed story approves them.

## Reject For Current Scope

- Reject any behavior change to consent gating, local video selection, local
  pose processing, phase review, Swing Card export, or remote-review disabled
  behavior.
- Reject any change to runtime privacy posture, raw-media handling, remote
  sharing, provider/model registry behavior, service-worker behavior, or
  exported data classes.
- Reject telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, persistent debug artifacts, or expanded console output.
- Reject new framework or dependency additions.
- Reject changing smoke-test selectors or accessibility labels unless Claude
  QA planning and the task acceptance criteria explicitly approve the change.

## Observability Decision

Runtime observability remains intentionally unchanged for SS-018. The story
refactors ownership boundaries and does not add new externally observable
runtime behavior. Existing local UI status text and sanitized stable error
codes remain the only user-visible diagnostics in scope.

## Claude QA Planning Round 1 Disposition

Claude QA planning returned FAIL with six blockers. Codex accepts all six as
valid and revised `docs/ss-018-preimplementation-spec.md` accordingly.

- B1: Accepted. The spec now requires `src/app-state.ts` to own state mutation
  through named transition functions or a reducer-style API. Other modules must
  not mutate state fields directly, and `selectCanBeginAnalysis` is the single
  selector for the `#analysis-button` enablement decision.
- B2: Accepted. The spec now adds `src/render-utils.ts` as the canonical home
  for `escapeHtml`, `formatRemoteDataClass`, and `formatSwingCardWarning`.
  Renderer modules must import these helpers instead of duplicating them.
- B3: Accepted. The spec now assigns remote-review-unavailable rendering,
  empty-provider registry disclosure, and outbound/blocked data class display
  to `src/remote-model-renderer.ts`.
- B4: Accepted. The spec now requires unit coverage proving
  `observedSeekTimestampMs` is absent from every serialized/exported Swing
  Card content shape produced by the extracted Swing Card action module.
- B5: Accepted. The spec now requires `src/consent-state.ts` to accept an
  injectable storage interface while defaulting production construction to
  `window.localStorage`.
- B6: Accepted. The spec now requires `analysisLifecycle.closeActive()` for
  `beforeunload` and `analysisLifecycle.abortWithNetworkBlocked()` for
  `securitypolicyviolation`, preserving the loading/processing-only guard and
  abort code `UNEXPECTED_NETWORK_BLOCKED`.

Claude non-blocking recommendations were also incorporated where they reduced
future ambiguity without expanding runtime behavior: `src/app-events.ts` is now
required instead of optional, smoke tests are required after protected-boundary
extraction milestones when practical, `npm run docs:verify` is explicit in
final verification, and imperative canvas helpers are split into
`src/keyframe-overlay-renderer.ts` rather than mixed with pure HTML renderers.

## Claude QA Planning Round 2 Disposition

Claude focused B1-B6 re-review returned FAIL after closing B1-B6. Claude
introduced two new blockers created by the revised module split. Codex accepts
B7-B8 as valid and revised `docs/ss-018-preimplementation-spec.md`
accordingly.

- B7: Accepted. The spec now defines the render-to-rebind control loop:
  `src/main.ts` owns a `requestRender(statusMessage?)` coordinator closure
  passed to `src/app-events.ts`; state-changing handlers call it after
  transitions; `requestRender` fully replaces the `#app` subtree via
  `app-renderer.renderApp(...)`, calls `app-events.bindAppEvents(...)` on the
  fresh DOM, and redraws the selected keyframe canvas. Since the subtree is
  replaced, old listeners are discarded with old DOM nodes. The spec now
  requires repeated render/bind unit coverage proving a single click produces
  a single effect after multiple re-renders.
- B8: Accepted. The spec now states that `src/app-state.ts` holds only
  serializable or UI-derived session state, while `src/analysis-lifecycle.ts`
  owns non-serializable `FrameProcessingController` and abort callback handles
  as an explicit scoped exception to the direct-state-mutation ban. Lifecycle
  code must call app-state transition functions so derived UI state stays in
  sync after close/abort, and unit tests must cover handle clearing plus app
  state synchronization.

Claude non-blocking recommendations were incorporated: the duplicated
`confirmation/confirmation` wording was cleaned up in the focused prompt,
`selectCanBeginAnalysis` full-matrix tests are required, and consent storage
failure tests must prove the public consent query function fails closed.

## Claude QA Planning Round 3 Disposition

Claude focused B7-B8 re-review returned FAIL after closing B8. B7 remains open
because the prior plan left frame-processing progress DOM updates as an
unspecified partial-render bypass. Codex accepts the residual B7 finding as
valid and revised `docs/ss-018-preimplementation-spec.md` accordingly.

- B7 residual: Accepted. The spec now assigns processing-progress DOM updates
  to `src/app-renderer.ts` through
  `updateProcessingProgressUi(root, state)`. `src/analysis-lifecycle.ts` owns
  frame-processing callbacks and controller handles, but it must call
  app-state transition functions and delegate processing-panel DOM updates to
  `app-renderer.updateProcessingProgressUi(...)`; it must not cache progress
  DOM nodes or write progress/status text directly.
- `updateProcessingProgressUi(root, state)` must re-query current DOM targets
  such as `[data-pose-summary]`, `[data-retry-analysis]`, and
  `[data-review-phases]` on every tick, so progress updates survive any
  intervening full `requestRender(...)` replacement.
- Required B7 regression: trigger an intervening full render during active
  processing and assert the next progress/output tick updates the visible
  `[data-pose-summary]` rather than a detached node.
- Required B7/B8 composition regression: stop during processing, clear
  lifecycle controller handles, drive app-state to `idle`, then call
  `requestRender(...)` and assert the rendered UI reflects the idle/capture
  state.

Claude's non-blocking throttling recommendation is deferred. SS-018 preserves
the current eight-sample processing cadence; throttling progress ticks would be
a behavior/performance change only if future profiling proves it necessary.

## Claude QA Planning Round 4 Disposition

Claude focused residual B7 re-review returned PASS. B1-B8 are closed, no new
blockers were introduced, and SS-018 is cleared for implementation.

Claude noted three non-blocking recommendations, which Codex folded into
`docs/ss-018-preimplementation-spec.md` before implementation:

- `#app` root stability is now explicit: `requestRender(...)` replaces only
  children, so a root reference may be held across processing partial-update
  calls.
- `updateProcessingProgressUi(...)` must no-op when processing selectors are
  absent, covering close/abort timing around late callbacks.
- Dynamic progress/status writes in `updateProcessingProgressUi(...)` must use
  `textContent` or element properties. Future user-influenced HTML in that
  helper must use `render-utils.escapeHtml`.

Implementation audit evidence must include executed named tests, not summary
claims, for render/rebind single-effect behavior,
`observedSeekTimestampMs` export exclusion, consent fail-closed behavior,
escaping regression coverage, processing-progress reattachment after
intervening full render, stop-during-processing composition, and no-op
missing-selector behavior.
