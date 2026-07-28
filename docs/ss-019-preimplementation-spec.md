# SS-019 Preimplementation Specification

Date: 2026-07-20

Status: Revised after the second Claude QA-planning FAIL. B2, B5, and B6 are
closed and regression-protected. B1, B3, B4, the lead close/token-race
precision, and accepted N1-N3 remain blocked pending focused Claude re-review.
Implementation and branch creation remain blocked until Claude returns PASS
and explicitly clears every open blocker.

Task: SS-019 Perform accessibility and responsive design hardening.

Branch after QA-planning clearance:
`ss-019-accessibility-design-hardening`, created from confirmed `main` at
`b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`.

## Objective

Make the current MVP workflow a dependable keyboard, screen-reader,
manual-testing, responsive-layout, and public-demo surface without decorative
redesign or changes to product scope. Preserve the current local-first consent,
processing, phase-review, Swing Card, remote-review-unavailable, safety,
privacy, medical-scope, and non-affiliation contracts.

## Protected Baseline

- Preserve all existing protected user-facing labels, workflow copy, safety and
  privacy meaning, and smoke-test selectors unless this specification names the
  exact semantic-only addition.
- Preserve local-only raw-video/frame handling and explicit consent gating.
- Preserve remote review as unavailable; do not add remote sharing, providers,
  SDKs, model assets, cloud services, or hidden identifiers.
- Preserve app-state/exported-data contracts, service-worker behavior, CSP,
  manifest behavior, and persistence behavior.
- Add no telemetry, analytics, remote logging, cloud diagnostics, persistent
  debug artifacts, expanded console output, or runtime operator diagnostics.
- Add no dependency, framework, bundle-policy, license-policy, notice, or SBOM
  change.
- Do not make absolute accessibility, safety, privacy, legal, deletion,
  anonymity, medical, or compliance claims.

## Approved File Scope And Ownership

### `index.html`

- Change only the `#app` host element from `<main id="app">` to
  `<div id="app"></div>` so `src/app-renderer.ts` supplies the page's one main
  landmark.
- Add a stable visually hidden sibling announcer:
  `<div id="app-announcer" class="visually-hidden" role="status"
  aria-live="polite" aria-atomic="true"></div>`.
- The announcer must remain outside the replace-on-render `#app` subtree.
- Keep the CSP meta content, manifest link, description, viewport metadata, and
  static `<title>Swing Sync | New analysis</title>` text otherwise unchanged.
  Runtime code updates it after render to exactly `Swing Sync | Capture`,
  `Swing Sync | Processing`, `Swing Sync | Review`, or
  `Swing Sync | Export` according to the active workflow view.

### New `src/app-accessibility.ts`

Own the DOM-only accessibility coordination contract. It must not import or
mutate app-state persistence.

- Define the exact contracts:

  ```ts
  interface AccessibilityIntent {
    focusKey?: FocusKey;
    announcement?: string;
  }

  interface RenderRequest extends AccessibilityIntent {
    visibleStatusText?: string;
  }
  ```

  A render request may contain a closed focus intent, non-live visible status
  text, and at most one global polite announcement. An absent request means an
  ordinary render with no announcement and the existing consent-derived
  visible status default.
- Own both post-render intent application and
  `applyAccessibilityIntent(root, announcer, intent)`. The latter is a
  no-render path: it validates, focuses, or announces against the existing DOM
  only and must not replace DOM, mutate app state, rebind events, redraw the
  canvas, or touch controller-owned media.
- The closed static focus keys are exactly: `safety-consent`,
  `camera-placeholder`, `video-picker`, `analysis-start`, `stage-heading`,
  `workflow-next`, `stop-analysis`, `retry-analysis`, `review-phases`,
  `phase-declaration:view`, `phase-declaration:handedness`,
  `phase-declaration:mirrored`, `phase-setup`, `phase-confirmation`,
  `phase-confirm`, `open-export`, `phase-review-heading`,
  `swing-card-heading`, `swing-card-download`, `swing-card-print`,
  `swing-card-copy`, and `swing-card-status`.
- The only dynamic keys are exactly
  `workflow-step:<capture|processing|review|export>`,
  `phase-assignment:<0..7>`, and `keyframe:<0..7>`. Validation must reject
  arbitrary strings, selector syntax, unknown prefixes, and out-of-range or
  non-integer indices.
- Capture the prior active element only when its `data-focus-key` passes that
  closed validator. Resolve known keys by comparing attribute values; never
  accept or persist caller-provided CSS selectors.
- Restore focus after render in this order: valid explicit target; valid prior
  target; exact per-view fallback. Capture and processing fall back to
  `stage-heading`; review falls back to `phase-review-heading` when phase
  outputs exist and otherwise `stage-heading`; export falls back to
  `swing-card-heading` when phase outputs exist and otherwise `stage-heading`.
- A target is focusable only when connected, visible, not hidden, not
  `aria-hidden`, not disabled, and not inside an inert or hidden ancestor.
  Programmatic headings/status targets may use `tabindex="-1"`; positive
  tabindex is prohibited.
- Focus application is idempotent. When the resolved target already equals
  `document.activeElement`, do not call `.focus()` again. Retry followed by a
  terminal callback without intervening user focus therefore invokes DOM focus
  once total; if the user moves focus after retry, the current terminal callback
  may focus the processing heading once.
- Update the stable `#app-announcer` using `textContent` only. All current
  announcements, including failures, use polite priority. Assertive is
  deliberately rejected because none of these events requires interruption.
- Export pure or DOM-injected seams sufficient for bounded-key, target-order,
  target-eligibility, exact fallback, text-only announcer, and no-render intent
  tests.

### `src/main.ts`

- Replace `requestRender(statusMessage?: string)` with
  `requestRender(request?: RenderRequest)` and expose/inject
  `applyAccessibilityIntent(intent: AccessibilityIntent)` alongside it.
- `requestRender` is the only full-render accessibility path.
  `applyAccessibilityIntent` delegates to the helper against the current root
  and stable announcer and must never replace DOM.
- Before replacing `#app.innerHTML`, capture the current valid focus key.
- Render the current view, bind fresh events, and redraw the selected keyframe
  canvas using the existing ownership order.
- Set `document.title` exactly to `Swing Sync | Capture`,
  `Swing Sync | Processing`, `Swing Sync | Review`, or
  `Swing Sync | Export` for the active view without rewriting protected body
  copy.
- After render, binding, canvas redraw, and title update, restore focus using the
  request's explicit intent, then prior key, then safe current-view fallback.
- Send any explicit request announcement to the stable announcer. Do not
  announce on every full render.
- Pass `request.visibleStatusText` only to the non-live
  `#app-visible-status`. Pass `request.announcement` only to
  `#app-announcer`. An exact event message may populate both fields so the same
  information is visible and announced, but only `#app-announcer` is live.
  When `visibleStatusText` is absent, retain the current consent-derived
  visible default rather than clearing or fabricating status.
- Keep `#app` stable, keep global `beforeunload` and
  `securitypolicyviolation` listeners unchanged in behavior, and keep
  production service-worker registration unchanged.

### Announcement-Channel Invariant

Each semantic event uses exactly one announcement channel: global or scoped,
never both.

- The stable global announcer is canonical for full-render shell, workflow,
  consent, camera, video, phase-review, and Swing Card events.
- The non-live visible IDs are exactly `#app-visible-status`,
  `#phase-review-status`, `#swing-card-action-status`, and
  `#remote-model-status`. They retain state-accurate text from
  `request.visibleStatusText`, app state, or their existing renderer-owned
  paths, but have no `role="status"`, `aria-live`, or other live-region role.
- Scoped live regions exist only at `#processing-status` for in-place
  processing state and `#keyframe-overlay-status` for imperative overlay
  status. An event using either scoped channel passes no global announcement.
- The stable global live region is exactly `#app-announcer`.
- Processing/review tests must not use an unscoped status-role locator because
  the global announcer and a scoped processing status may coexist. Tests target
  the exact owning ID.
- Phase semantic state is keyed exactly as `unsupported-input`,
  `review-required`, or `confirmed`. A phase transition sends one global
  announcement only when the before/after semantic key changes. Rerenders that
  preserve the key do not announce again.
- All channels are polite. Assertive is rejected to avoid interrupting the
  current task.
- A named unit inventory test, `uses exactly one announcement channel for every
  mapped event`, must fail if a mapped callsite has both channels or no declared
  channel.

### Complete Focus And Announcement Callsite Matrix

Every current or approved `requestRender` and no-render accessibility callsite
in `app-events.ts`, `analysis-lifecycle.ts`, and `swing-card-actions.ts` is
normative below. There may be no additional unmapped callsite or intent.

| Owner / event | Render path | Focus target | Sole announcement channel |
| --- | --- | --- | --- |
| Events: consent change | Full render | `safety-consent` | Global consent-ready/required message when meaning changes |
| Events: Begin guard, consent missing | Full render | `safety-consent` | Global guard failure |
| Events: Begin guard, video missing | Full render | `video-picker` | Global guard failure |
| Events: Begin accepted | Full render, then controller start | `stage-heading` | Global loading message; later processing callbacks use scoped channel only |
| Events: workflow step button | Await `closeActive()` cleanup when needed, then one caller-owned full render | `stage-heading` | Global caller-owned `<view> opened` message; close has none |
| Events: next-step button | Full render | `stage-heading` | Global `<view> opened` message |
| Events: visible picker opens chooser | No render | Preserve `video-picker` | None |
| Events: picker `change` with a file | Await `closeActive()` cleanup, then one caller-owned full render | `video-picker` | Global caller-owned local-selection message; close has none |
| Events: picker `cancel` | No render | `video-picker` | None |
| Events: hidden-input `focus`/`focusin` redirect | No render | `video-picker` | None |
| Events: camera placeholder | Full render with typed visible text and announcement | `camera-placeholder` | Global camera-out-of-scope message |
| Events/lifecycle: Stop local analysis | Full render owned by `stopActive`, with exact typed visible text and announcement | Capture `stage-heading` | Global stopped/released message; cancelled callback has none |
| Events/lifecycle: Retry | No render | Processing `stage-heading` once | Scoped subsequent loading/failed/completed processing state; retry call itself has none |
| Events: Review phase labels | Full render | `phase-review-heading` | Global review-ready message |
| Events: view declaration | Full render | `phase-declaration:view` | None unless a new validation result requires one global message |
| Events: handedness declaration | Full render | `phase-declaration:handedness` | None unless a new validation result requires one global message |
| Events: mirrored declaration | Full render | `phase-declaration:mirrored` | None unless a new validation result requires one global message |
| Events: setup declaration | Full render | `phase-setup` | None unless a new validation result requires one global message |
| Events: phase assignment | Full render | Exact bounded `phase-assignment:<0..7>` | None unless a new validation result requires one global message |
| Events: confirmation checkbox | Full render | `phase-confirmation` | None unless a new validation result requires one global message |
| Events: Confirm phase review | Full render | `phase-review-heading` | Global confirmation or validation-failure message |
| Events: Open Swing Card export | Full render | `swing-card-heading` | Global export-opened message |
| Events: keyframe selection | Full render and overlay redraw | Exact bounded `keyframe:<0..7>` | Scoped imperative overlay status only; no global message |
| Lifecycle: loading/processing state callback | Partial DOM update | No change | Scoped processing state only |
| Lifecycle: progress callback | Partial DOM update | No change | None when only numeric progress changes |
| Lifecycle: output callback | Partial DOM update | No change | None |
| Lifecycle: current-controller completed callback | Originating controller/token identity check, partial DOM update, then no-render intent | Processing `stage-heading` only when the captured controller/token equals the active controller and the processing view is current | Scoped processing state only |
| Lifecycle: current-controller failed callback | Originating controller/token identity check, partial DOM update, then no-render intent | Processing `stage-heading` only when the captured controller/token equals the active controller and the processing view is current | Scoped processing state only |
| Lifecycle: late/stale terminal callback or terminal callback outside processing view | Partial/no-op against current DOM | No change | None; no visible scoped target means no announcement |
| Lifecycle: cancelled/closed callback | Partial/no-op | No change | None; `stopActive` owns stopped status, while close and callback are silent |
| Lifecycle: `closeActive()` from workflow navigation | Cleanup and state reset only; no render | No change | None; navigation caller owns one destination render/message |
| Lifecycle: `closeActive()` from picker change | Cleanup and state reset only; no render | No change | None; picker caller owns one selection render/message |
| Lifecycle: `closeActive()` from `beforeunload` | Cleanup and state reset only; no render | No change | None |
| Swing download start | Full render | `swing-card-status` | Global preparing message; visible status is not live |
| Swing download completion/failure | Full render | `swing-card-download` | Global result message |
| Swing print start | Full render | `swing-card-status` | Global preparing message; visible status is not live |
| Swing print completion/failure | Full render | `swing-card-print` | Global result message |
| Swing copy start | Full render | `swing-card-status` | Global preparing message; visible status is not live |
| Swing copy completion/failure | Full render | `swing-card-copy` | Global result message |

The inventory test must cover both runtime guard failures; consent; begin;
workflow and next-step controls; picker success/cancel/redirect; camera;
stop/retry; review; all declaration/setup/assignment/confirmation/confirm
paths; export; keyframe; every lifecycle callback; render-free `closeActive()`
for navigation, picker replacement, and `beforeunload`; and download/print/copy
start, completion, and failure. Delayed terminal callbacks and same-control
focus tests must prove an open phase select cannot lose focus to stale
processing.

### Analysis-Lifecycle Partial/Terminal Contract

- `updateProcessingProgressUi(root, state)` remains a partial renderer and may
  change only safe text and `hidden` properties. The processing **state text**
  element alone has `role="status" aria-live="polite" aria-atomic="true"`.
  Numeric `[data-pose-summary]` remains outside that live region so progress
  ticks are not announced.
- Loading, processing, progress, and output callbacks call the partial update
  only. They never call the global announcer and never move focus.
- Each controller's callback closures capture that originating controller's
  identity or an equivalent unique token. Every callback checks that token
  before any state, output, DOM, focus, or announcement mutation; a stale token
  returns immediately without changing anything. Completed/failed callbacks
  with a current token update state/output and current processing DOM, making
  the scoped processing state the sole announcement. They then call the
  no-render accessibility intent to focus `stage-heading` only when
  `state.activeStep === "processing"` and the captured controller/token still
  equals the active controller/token.
- A late/stale terminal callback, or any terminal callback after navigation
  away from processing, must not steal focus or announce.
- `stopActive()` synchronously invalidates the active callback token before it
  awaits `cancel()`, while retaining a local controller reference for resource
  release. It then owns the stopped/released full render, announcement, and
  capture-view focus. A terminal callback racing the await sees a stale token
  and returns before mutation; cancelled callbacks do not duplicate the owner.
- `closeActive()` performs controller cleanup, handle clearing, phase/
  processing state reset, and nothing else: no render, focus, or announcement.
  It synchronously invalidates the active callback token before awaiting
  `close()`, while retaining a local controller reference for resource release.
  A racing callback is therefore stale before any mutation. Workflow-navigation
  and picker-change callers await cleanup and then each own their single
  destination render/focus/announcement. They must not render before the close
  promise settles. `beforeunload` calls cleanup with no render.
  Closed callbacks remain silent.
- `retryActive` applies no-render focus to `stage-heading` once and relies on
  the subsequent scoped loading/failed/completed state. It must not full-render
  or replace the controller-owned `#analysis-video` node. If the terminal
  callback resolves the same already-active heading, the idempotent helper does
  not call `.focus()` again; if the user moved elsewhere, the current terminal
  callback may focus it once.
- Existing protected labels/selectors, local resource release, and
  remote-review-unavailable behavior remain unchanged.

### Adopted Claude Precision Notes (Non-Blocking)

The exact four document titles, exact per-view fallback targets, bounded
dynamic focus-key grammar, and polite-only announcement priority are adopted as
precision within B1-B6 remediation. They make the existing keyboard, focus,
status, and test contracts implementation-ready; they do not expand SS-019
acceptance criteria or product scope.

### Closed Findings Retained As Regression Contracts

- B2 is closed, not reopened: keep the file input out of sequential order
  without `aria-hidden`, and preserve named success, native-cancel, and
  defensive focus-return coverage.
- B5 is closed, not reopened: preserve the exact static/bounded dynamic key
  grammar, exact per-view fallbacks, and complete render/no-render callsite
  inventory.
- B6 is closed, not reopened: preserve the exact three tokens, two-layer focus
  geometry, eleven enumerated surface ratios, `>= 3:1` executable threshold,
  CSS-reading unit checks, computed-style smoke checks, and forced-colors
  behavior.

### Renderer Semantics

Apply changes in `src/app-renderer.ts`, `src/phase-review-renderer.ts`, and
`src/remote-model-renderer.ts` while keeping current protected copy, labels,
and selectors byte-for-byte unless an attribute-only change is required.

- Add stable `data-focus-key` attributes to every mapped focus target.
- Keep one renderer-owned `<main class="workspace">` landmark.
- Keep the visible `Choose a video` button as the keyboard trigger and give it
  `data-focus-key="video-picker"`. Give `#video-file` `tabindex="-1"` and the
  accurate defensive accessible label `Choose a local video file`; do **not**
  set `aria-hidden="true"`.
- Add picker `cancel` handling that no-render focuses the current visible
  picker. Add `focus` and/or `focusin` redirection from the file input to the
  visible picker for browsers that return focus to the input after chooser
  close. Successful `change` always full-renders with explicit picker focus.
- Use `role="group"` and retain the exact accessible name for every reviewed
  labelled generic container:
  - `.capture-options`: `Local video source`;
  - `.processing-placeholder`: `Local pose processing`;
  - `.review-placeholder`: `Review placeholder`;
  - `.swing-card-summary`: `Swing Card contents`;
  - `.phase-assignment-list`: `Swing phase assignments`;
  - `.keyframe-strip`: `Select keyframe`.
- Convert `.export-placeholder` to
  `<section class="export-placeholder" aria-labelledby="export-placeholder-heading">`.
  Preserve the existing visible `Swing Card unavailable` heading and give that
  heading stable `id="export-placeholder-heading"`.
- Preserve the native `<dl class="remote-model-disclosure">` role and protected
  class selector. Wrap it in a named `role="group"` container for
  `Remote model data disclosure`; never override the `<dl>` role.
- Render each phase's visible label as a real `<h3>` while preserving its text
  and association with its assignment control.
- Give `[data-keyframe-canvas]` `role="img"` and an `aria-describedby`
  relationship to a stable overlay-status element. Preserve the existing
  protected canvas label text.
- Give only the processing state text exact `id="processing-status"` and the
  imperative overlay status exact `id="keyframe-overlay-status"`, scoped polite
  status semantics, and `aria-atomic="true"`. Keep numeric
  `[data-pose-summary]` outside the processing live region.
- Give visible `.status` exact `id="app-visible-status"`, `.phase-warning`
  exact `id="phase-review-status"`, `[data-swing-card-status]` exact
  `id="swing-card-action-status"`, and `[data-remote-model-status]` exact
  `id="remote-model-status"`. Remove `role="status"`, `aria-live`, and other
  live-region roles from all four. They remain populated, visible,
  state-accurate text and valid `aria-describedby` targets.
- The complete renderer inventory must reject any bare `aria-label` on a
  generic element that lacks a naming role or equivalent native named
  structure. The listed groups/regions and the wrapped native `<dl>` are the
  exhaustive current-main remediation set.
- Do not add live-region semantics to static explanatory paragraphs.
- Keep dynamic status text on `textContent`/escaped paths.

Disabled controls must have both a visible dynamic prerequisite/explanation
and an exact `aria-describedby` relationship when disabled:

- `#analysis-button` describes `#app-visible-status`: explain whether safety
  acknowledgement, local video, or processing availability is the current
  prerequisite.
- `[data-review-phases]` and `[data-confirm-phase-review]`: explain whether
  processing output, declaration completeness, phase assignments, or explicit
  confirmation is missing through exact target `#phase-review-status`.
- Unavailable export/open-export controls describe exact target
  `#phase-review-status`, which explains which valid/confirmed phase state is
  required.
- `[data-remote-model-send]` describes exact target `#remote-model-status`,
  retaining the provider-review/configuration and explicit remote-sharing
  boundary explanation.
- Busy `[data-download-swing-card]`, `[data-print-swing-card]`, and
  `[data-copy-swing-card-prompt]` describe exact target
  `#swing-card-action-status`, which reports the current local export action;
  restore focus to the initiating action after completion or failure.

Descriptions must reflect current state and must not claim remote availability,
successful persistence, privacy guarantees, or completed analysis when those
states are not true. Every description ID is unique in the rendered document.
Unit and smoke tests directly assert the owning control-to-ID relationship and
the state-accurate visible text. Manual QA includes browse-mode verification
that disabled controls expose their descriptions in the tested AT/browser.

### `src/styles.css`

- Define exact custom properties `--focus-inner: #ffffff`,
  `--focus-outer: #17211b`, and `--interactive-boundary: #607367`.
- The two-color `:focus-visible` geometry is exactly a 2 CSS-pixel white inner
  outline with 2-pixel offset plus a dark outer ring that leaves at least 2 CSS
  pixels visible beyond the inner ring; a 6-pixel outer spread is an approved
  implementation. Cover links, buttons, inputs, selects, and programmatically
  focused headings/status targets.
- Forced-colors mode must retain UA/system focus and semantic boundaries.
  `forced-color-adjust: none` is prohibited.
- Required computed contrast ratios are:

| Token pair | Required ratio |
| --- | ---: |
| `#17211b` vs `#ffffff` | 16.54:1 |
| `#17211b` vs `#f3f5f1` | 15.07:1 |
| `#17211b` vs `#f8faf7` | 15.76:1 |
| `#17211b` vs `#e7f0e9` | 14.21:1 |
| `#17211b` vs `#eaf3ec` | 14.59:1 |
| `#ffffff` vs `#17211b` | 16.54:1 |
| `#ffffff` vs `#245b3b` | 7.97:1 |
| `#607367` vs `#ffffff` | 5.07:1 |
| `#607367` vs `#f3f5f1` | 4.62:1 |
| `#607367` vs `#f8faf7` | 4.83:1 |
| `#607367` vs `#e7f0e9` | 4.35:1 |
| `#607367` vs `#eaf3ec` | 4.47:1 |

Every enumerated focus/interactive-boundary pair must remain at least 3:1.
- Give scoped interactive controls a 44-by-44 CSS-pixel minimum target where
  practical. Do not inflate passive content or apply a global layout minimum.
- Ensure programmatically focused stage/phase/export headings are visibly
  indicated and not obscured.
- Add `min-width: 0`, wrapping, flex/grid stacking, and `overflow-wrap` rules to
  action rows, disclosure/metadata values, phase assignments, keyframe controls,
  statuses/errors, and Swing Card controls as required.
- Add readable failed-processing styling that does not rely on color alone and
  preserves actionable retry/review distinctions.
- At 320 CSS pixels, the primary workflow must reflow without two-dimensional
  page scrolling, clipped text, overlapping controls, or an unreadable export
  panel, except for content that WCAG explicitly permits to remain two
  dimensional. No such exception is currently planned for the app workflow.
- Support forced-colors mode by retaining semantic borders/focus indicators and
  system color adaptation. Do not use `forced-color-adjust: none` to opt the app
  out.
- Preserve the existing reduced-motion behavior.
- Make no decorative redesign, workflow-obscuring restyle, or brand refresh.

## Automated Test Plan

All sign-off evidence must list named tests and map them to the acceptance
criterion and any future Claude blocker they cover.

### New `test/unit/app-accessibility.test.ts`

Add named tests for:

- accepting only known `data-focus-key` values and rejecting arbitrary selector
  strings;
- explicit focus target taking precedence over prior and fallback targets;
- previous known focus restoration when no explicit intent is supplied;
- visible/enabled fallback behavior when explicit/prior targets are absent;
- hidden, disconnected, disabled, `aria-hidden`, inert, and hidden-ancestor
  targets being rejected;
- no valid target producing a safe no-op;
- programmatic `tabindex="-1"` target focus with no positive tabindex;
- stable announcer update through `textContent`, including no update when the
  render request has no announcement.
- `applyAccessibilityIntent` operating without DOM replacement and sharing the
  same bounded-key/target validation as post-render intent application;
- exact bounded dynamic-key rejection and exact per-view fallbacks;
- file-picker cancel and hidden-input focus redirection to `video-picker`;
- every current mapped callsite using exactly one declared announcement
  channel.
- idempotent focus application that does not call `.focus()` when the resolved
  target already equals `document.activeElement`, including retry followed by
  terminal focus with and without intervening user focus.

Picker coverage must use the exact named tests
`returns focus to the picker after successful keyboard-opened selection`,
`returns focus to the picker on native chooser cancel without rendering`, and
`redirects hidden file input focus to the picker without positive tabindex`.

### New `test/unit/accessibility-contrast.test.ts`

Add a named unit suite that reads the exact CSS custom properties, asserts the
three required token values, computes the ratio matrix for every enumerated
surface, and fails below 3:1 or when a token/surface mapping changes.

### Renderer And Event Unit Tests

Extend existing focused unit suites to directly assert:

- exactly one main landmark across the static host and rendered shell;
- protected labels/selectors remain present;
- `#video-file` retains its selector/accept behavior but has
  `tabindex="-1"`, no `aria-hidden="true"`, and the exact defensive label;
- stage, phase-review, Swing Card, same-control, and action-status focus keys;
- exact named group/native semantics for `Local video source`,
  `Local pose processing`, `Review placeholder`, `Swing Card contents`,
  `Swing phase assignments`, and `Select keyframe`; the named export-placeholder
  section and `Swing Card unavailable` heading relationship; and the named
  remote-disclosure wrapper with its nested native `<dl>` semantics;
- an exhaustive inventory test that rejects bare labelled generic containers;
- heading, canvas `role="img"`, `aria-describedby`, processing/overlay status
  IDs, scoped status semantics, and removed live roles from global-owner text;
- exact disabled-control `aria-describedby` targets and visible dynamic
  prerequisite text for Begin analysis, review/confirm, export, remote review,
  and busy Swing Card actions;
- every event/lifecycle/export path in the complete callsite table issues the
  exact typed focus/announcement request and has no unmapped callsite;
- render/rebind behavior remains single-effect and progress ticks do not
  refocus or announce every tick.
- Exact migration of existing tests is mandatory:
  - rename `clears lifecycle-owned controller handles and syncs app-state idle
    on close` to `clears lifecycle-owned controller handles and syncs app-state
    idle on close without rendering`; assert zero `requestRender` and zero
    `applyAccessibilityIntent` calls;
  - remove/replace `re-renders capture controls after async close settles`;
    relocate its SS-018 stale-capture intent into app-events tests named
    `awaits closeActive before rendering workflow navigation exactly once` and
    `awaits closeActive before selecting a replacement video and renders
    exactly once`; both use a deferred close and prove no render before it
    settles followed by one caller-owned typed request;
  - update `stops active processing and requests an idle capture render` to
    assert the exact typed request containing `focusKey: "stage-heading"`, the
    existing stopped `visibleStatusText`, and the same `announcement`;
  - update all legacy `requestRender` mocks/types and the camera app-events
    assertion to the exact `RenderRequest` payload.
  No old and new contradictory test may coexist.
- named lifecycle tests exactly:
  - `keeps progress ticks partial without global announcements or focus changes`;
  - `focuses the processing heading and uses only scoped status for current completed and failed terminal states`;
  - `does not steal focus for late terminal callbacks outside the processing view`;
  - `keeps stopped announcement owned by stop and close cleanup silent until the caller destination render`;
  - `retries without replacing the video DOM and moves focus once`.
- Additional named lifecycle/callsite tests:
  - `keeps closeActive cleanup render-free for navigation picker replacement and beforeunload`;
  - `lets navigation and picker callers own exactly one destination render`;
  - `binds terminal callback focus to the originating active controller token`;
  - `invalidates the active callback token before awaited stop or close so racing terminal callbacks are inert`.
- named renderer/smoke role/name assertions for `Swing Card contents` and
  `Remote model data disclosure`, expanded to every named group/region and the
  nested native `<dl>` listed above.

### Browser Smoke Tests In `test/smoke/app.spec.ts`

Add or extend named tests that:

- traverse the primary capture, consent, processing, review, phase-confirmation,
  and Swing Card export path with keyboard input only;
- open the native file chooser from the visible `Choose a video` button by
  keyboard, then inject the approved pose fixture through the test harness so
  the risky analysis path remains real without relying on a machine-specific
  chooser UI;
- cover successful keyboard-opened selection, a synthetic native `cancel`
  event returning focus, and defensive file-input focus redirection;
- verify focus continuity across consent, selection, begin, processing
  completion, review, same-control edits, confirmation, export, and local Swing
  Card actions after full rerenders;
- assert one main landmark, meaningful heading order, dynamic document titles,
  scoped status semantics, and no duplicate blanket live regions;
- replace all three reviewed unscoped `page.getByRole("status")` assertions —
  camera, consent guard, and stopped status — with direct `#app-announcer`
  assertions plus exact visible `#app-visible-status` text and assertions that
  the visible element has no status role or `aria-live`;
- retain every `.phase-warning` text assertion, but replace the reviewed
  `aria-live="polite"` assertion with exact `id="phase-review-status"`, no
  status role, no `aria-live`, and the exact `aria-describedby` relationship;
- prohibit unscoped status-role locators in processing/review smoke coverage;
  target `#app-announcer`, `#processing-status`, or
  `#keyframe-overlay-status` according to the declared owner;
- verify representative focus visibility and approved focus/control contrast
  tokens in rendered light and dark-adjacent states, the applied two-layer
  indicator geometry, and forced-colors emulation;
- assert scoped interactive targets are at least 44 CSS pixels in each required
  dimension, allowing only spec-reviewed exceptions;
- at desktop and 320 CSS-pixel viewports, exercise long status/error text,
  failed processing, phase review, keyframe controls, and Swing Card export;
  assert no viewport overflow, clipped required text, overlap, or unusable
  control geometry;
- preserve the existing 390-pixel mobile coverage, protected selectors/labels,
  external-network guard, no-sensitive-console-output checks, and real
  pose-fixture output assertions.
- assert exactly one announcement owner for consent, processing terminal,
  phase validation/confirmation, and each Swing action without claiming that
  Playwright substitutes for manual screen-reader evidence;
- assert phase announcements occur only when the semantic state key changes
  among `unsupported-input`, `review-required`, and `confirmed`;
- include named group/region assertions and 320-pixel/long-text geometry for
  every exhaustive renderer-semantic entry, including the nested native remote
  disclosure `<dl>`.

Geometry checks must identify the relevant elements and required relationships;
a screenshot alone or an empty-state-only page-width assertion is insufficient.

## Acceptance-Criteria Coverage Matrix

| Acceptance criterion | Automated evidence | Manual evidence |
| --- | --- | --- |
| Keyboard-only traversal through capture, consent, processing, review, phase confirmation, and export | Real keyboard-only pose-fixture smoke path; focus-request unit tests; event mapping tests | Full keyboard walkthrough, focus order/recovery, browser and input recorded |
| Understandable focus, labels, headings, statuses, and disabled explanations | Accessibility helper, renderer, event, lifecycle, and Swing Card tests; one-main/title/status smoke checks | Screen-reader/keyboard review, focus appearance, announcement timing, prerequisite clarity |
| No desktop/mobile overlap, clipping, unusable controls, or unreadable export | 320/390/desktop geometry, overflow, long/error/review/export, 44-pixel, and token tests | 200%/400% zoom or equivalent 320 reflow, text spacing, actual mobile, forced colors, print/export review |
| Practical automated regression coverage | Named unit/smoke tests mapped here and to Claude blockers | Record gaps that remain manual-only |
| Remaining manual-only risks documented | Artifact-presence/docs review where practical | Required `docs/ss-019-manual-accessibility-qa.md` risk table |

## Required Manual QA Artifact

Implementation must create `docs/ss-019-manual-accessibility-qa.md`. It is an
evidence record, not a conformance statement. For every run or scenario record:

- tested commit SHA and build/serve command;
- date, OS, browser/version, viewport or physical device, zoom, text-spacing
  override if used, input method, and assistive technology/version;
- workflow step and test scenario;
- expected result and actual result;
- evidence reference such as screenshot, recording, or concise observation;
- defect link/status when failed;
- residual risk, affected user/surface, severity or impact, workaround if any,
  and Adopt/Fix/Defer disposition.

Minimum manual scope:

- complete keyboard traversal, visible focus, logical order, and focus recovery;
- VoiceOver and/or NVDA announcements and landmarks where available; record an
  unavailable combination explicitly and do not claim it passed;
- consent, processing progress/failure/completion, phase-review validation,
  confirmation, and export announcements without over-announcement;
- actual native chooser cancel and focus return in every tested browser/AT
  environment;
- duplicate-announcement checks for consent, terminal completion/failure,
  phase validation/confirmation, and Swing actions;
- named-group checks for `Swing Card contents` and
  `Remote model data disclosure`, plus `Local video source`,
  `Local pose processing`, `Review placeholder`, `Swing phase assignments`,
  `Select keyframe`, the `Swing Card unavailable` labelled section, and the
  remote wrapper's retained nested `<dl>` semantics;
- browse-mode checks that each disabled control exposes its exact, unique,
  state-accurate visible `aria-describedby` target;
- 200% and 400% zoom or an equivalent 320 CSS-pixel reflow setup;
- WCAG text-spacing overrides;
- forced-colors/high-contrast behavior where the environment supports it;
- every exact focus/boundary token surface from the required ratio matrix;
- long consent/status/error/prerequisite text;
- representative actual mobile-device interaction where available;
- annotated-canvas name/description and the residual nonvisual-equivalence
  limitation;
- Swing Card on-screen export panel, print preview, and locally generated
  download/copy status.

The artifact must explicitly say that SS-019 does not establish WCAG
certification, legal compliance, universal assistive-technology compatibility,
or complete nonvisual equivalence.

## Migration And Rollback

This is a DOM, CSS, focus-coordination, test, and manual-evidence change only.
There is no persisted-state migration, data-schema migration, exported-data
change, dependency migration, service-worker migration, or remote-service
rollout.

Implementation order:

1. Add the stable host/announcer and `app-accessibility` unit contract.
2. Convert the render request and focus/announcement call sites with focused
   unit tests.
3. Add renderer semantics/descriptions while preserving protected
   labels/selectors/copy.
4. Apply scoped CSS focus, contrast, target-size, failure, reflow, forced-color,
   and wrapping changes.
5. Extend the real pose-fixture smoke suite and run targeted checks.
6. Complete the manual QA artifact against the implementation commit.
7. Run the full required verification and prepare a self-contained Claude final
   audit packet containing every changed tracked file or explicit omission
   rationale.

Rollback is a revert of the focused SS-019 implementation commit. Because no
schema, persistence, dependency, provider, or remote behavior changes, no data
rollback is required. Validate the restored baseline with the existing unit,
smoke, build, compliance, safety, and privacy gates.

Primary migration risks are:

- focus regression from stale/missing focus keys or incorrectly forced focus;
- over-announcement, duplicate status messages, or lost important status;
- protected selector, label, or sensitive-copy drift;
- layout regressions introduced by control sizing or wrap rules;
- false confidence from automation that does not match manual AT/browser
  behavior.

## Required Verification

Use Node 22 from `.nvmrc`. Record exact commands, versions, named test output,
and results in the final audit and PR handoffs.

Targeted tests, adjusted to the exact implemented files:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:unit -- app-accessibility accessibility-contrast app-renderer app-events analysis-lifecycle phase-review-renderer remote-model-renderer swing-card-actions'
```

Required smoke command:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:smoke'
```

Required baseline and protected-boundary checks under Node 22:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run build'
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run compliance:verify'
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run safety:verify'
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run privacy:verify'
```

Run when documentation or generated-document claims change, including the
required manual QA artifact:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run docs:verify'
```

Always run:

```sh
git diff --check
```

No dependency, bundle, license-policy, notice, or SBOM change is expected. If
that boundary changes, stop implementation, return to review, and additionally
run the dependency/licensing/SBOM checks required by `AGENTS.md`.

## Claude QA-Planning Gate

Before implementation, the lead architect and workflow coordinator must create
a durable, self-contained Claude prompt and source packet using the standard
adversarial-review skeleton: Role, Stage, Scope, Context, Acceptance criteria,
Protected boundaries, Relevant source contents or focused diff, Verification,
Known non-goals, and Output required.

Claude's first QA-planning review returned FAIL with B1-B6. The first focused
B1-B6 re-review also returned FAIL: B2, B5, and B6 closed, while B1, B3, B4,
the lead close/token-race precision, and accepted N1-N3 remain open. Exact
second-review artifacts are
`docs/ss-019-claude-qa-second-raw-response.md` and
`docs/ss-019-claude-qa-second-response.md`.

`docs/ss-019-claude-qa-rereview-prompt.md` is superseded for paste use. Its
existing source packet remains unchanged as the exact first-re-review evidence
record. A new prompt/packet is not part of this specification-revision step and
must be created only after these N1-N3 contracts and the corresponding durable
context are approved.

The next focused packet must include the prior raw response, lead disposition,
this complete revised specification, exact relevant current baseline sources
and tests, complete focused diffs, and explicit omission rationales. Claude
must independently close B1, B3, B4, the lead close/token-race precision, and
N1-N3 with PASS before the builder creates the story branch or changes runtime
UI. B2, B5, and B6 remain closed regression contracts and must not be reopened
by the N1-N3 corrections.
