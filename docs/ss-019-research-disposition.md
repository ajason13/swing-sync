# SS-019 Research And Disposition

Date: 2026-07-19

Task: SS-019 Perform accessibility and responsive design hardening.

Status: Approved research/disposition input for the candidate
preimplementation specification. Implementation remains blocked pending the
independent Claude QA-planning gate.

## Classification

SS-019 is accessibility-, frontend-runtime-, user-facing-behavior-,
privacy/safety-copy-sensitive, responsive-design-, smoke-test-selector-, and
manual-QA-sensitive.

The story may change DOM semantics, focus restoration, live-region behavior,
control descriptions, responsive CSS, and browser-test coverage. It must not
change the workflow's safety/privacy/non-affiliation meaning, local-first
raw-media behavior, explicit consent gate, remote-review-disabled posture,
provider/model posture, exported data classes, persistence, service-worker
behavior, or runtime observability posture.

## Primary Sources

Checked 2026-07-19. These are direct W3C normative or WAI-ARIA Authoring
Practices sources, not secondary accessibility summaries:

- WCAG 2.2, 2.1.1 Keyboard:
  https://www.w3.org/TR/WCAG22/#keyboard
- WCAG 2.2, 2.4.3 Focus Order:
  https://www.w3.org/TR/WCAG22/#focus-order
- WCAG 2.2, 2.4.7 Focus Visible:
  https://www.w3.org/TR/WCAG22/#focus-visible
- WCAG 2.2, 2.4.2 Page Titled:
  https://www.w3.org/TR/WCAG22/#page-titled
- WCAG 2.2, 2.4.6 Headings and Labels:
  https://www.w3.org/TR/WCAG22/#headings-and-labels
- WCAG 2.2, 4.1.3 Status Messages:
  https://www.w3.org/TR/WCAG22/#status-messages
- WCAG 2.2, 1.4.3 Contrast (Minimum):
  https://www.w3.org/TR/WCAG22/#contrast-minimum
- WCAG 2.2, 1.4.11 Non-text Contrast:
  https://www.w3.org/TR/WCAG22/#non-text-contrast
- WCAG 2.2, 1.4.10 Reflow:
  https://www.w3.org/TR/WCAG22/#reflow
- WCAG 2.2, 1.4.12 Text Spacing:
  https://www.w3.org/TR/WCAG22/#text-spacing
- WCAG 2.2, 2.5.8 Target Size (Minimum):
  https://www.w3.org/TR/WCAG22/#target-size-minimum
- WAI-ARIA Authoring Practices, Developing a Keyboard Interface:
  https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/

These sources define requirements and interaction guidance, but they do not by
themselves prove that Swing Sync conforms. SS-019 requires automated and manual
evidence for the implemented surface and records residual risks without making
a certification claim.

## Repository Sources And Current Ownership

- `index.html` owns the static document title, CSP meta policy, manifest link,
  viewport metadata, and the current `#app` host. It currently renders
  `<main id="app">`.
- `src/main.ts` owns the stable app-root lookup, full-render coordinator,
  renderer/event/lifecycle composition, selected-keyframe canvas redraw, global
  listeners, and production service-worker registration.
- `src/app-renderer.ts` owns the outer app shell and current inner
  `<main class="workspace">`, workflow navigation, active stage rendering,
  consent panel, capture/processing/review/export stage selection, processing
  partial updates, Swing Card panel, and several status regions.
- `src/app-events.ts` owns keyboard/click-triggered UI event wiring for consent,
  capture, file selection, workflow steps, analysis, phase review, keyframes,
  export, and remote-review-unavailable behavior. Its current
  `requestRender(statusMessage?)` contract cannot express focus intent.
- `src/app-state.ts` owns serializable/UI-derived workflow state and named state
  transitions/selectors. SS-019 does not move DOM focus state into app state.
- `src/consent-state.ts` owns fail-closed local acknowledgement storage; its
  storage and consent semantics remain unchanged.
- `src/analysis-lifecycle.ts` owns frame-processing controller handles,
  start/stop/close/network-blocked behavior, processing callbacks, and render
  requests caused by lifecycle transitions.
- `src/phase-review-renderer.ts` owns phase confirmation controls, assignment
  controls, provisional warnings, keyframe review markup, and the annotated
  keyframe canvas.
- `src/remote-model-renderer.ts` owns the unavailable remote-review panel,
  disclosure text, disabled control, and unavailable status.
- `src/keyframe-overlay-renderer.ts` owns selected-keyframe canvas drawing and
  overlay-status updates after render.
- `src/swing-card-actions.ts` owns local PNG, print, and clipboard action state,
  completion/failure status changes, and render callbacks.
- `src/render-utils.ts` owns canonical escaping and protected-boundary display
  formatting. New dynamic text must continue using safe text/escaping paths.
- `src/styles.css` owns focus styling, colors, responsive rules, layout,
  visually-hidden behavior, control sizing, status/error presentation,
  print/export styles, forced-color behavior, and reduced-motion behavior.
- `test/smoke/app.spec.ts` owns the current real-browser desktop/mobile workflow,
  real pose-fixture analysis path, protected network/local-first checks,
  selectors/labels, export behavior, and existing 390 CSS-pixel mobile layout
  assertions.
- Relevant `test/unit` files own renderer, event, lifecycle, state, escaping,
  phase-review, remote-model, overlay, and Swing Card contracts. SS-019 adds a
  focused `app-accessibility` unit surface rather than duplicating the full
  smoke workflow in unit tests.
- `docs/privacy-architecture.md`, `docs/safety-terms.md`, `docs/licensing.md`,
  and `docs/models-licensing.md` remain the protected product/compliance
  sources for local-first, consent, claim, dependency, SDK, and model-asset
  boundaries.

## Current-Main Findings

1. **Nested main landmarks.** `index.html` supplies `<main id="app">`, while
   `src/app-renderer.ts` supplies `<main class="workspace">`. The rendered page
   therefore has nested main landmarks instead of one main landmark.
2. **Full-render focus loss.** `src/main.ts` replaces `#app.innerHTML` on every
   `requestRender(...)`. The focused DOM node is removed and no explicit,
   previous, or fallback focus is restored after event binding and canvas
   redraw.
3. **Hidden file input remains a tab stop.** `#video-file` uses the current
   visually-hidden class, which hides it visually but does not remove it from
   sequential keyboard focus. The visible `Choose a video` button already owns
   the intended picker trigger.
4. **Inconsistent live/status semantics.** The shell status, processing status,
   phase warning, overlay status, Swing Card status, and remote-model status do
   not use one deliberate announcement contract. Some status text has
   `role="status"`, some has explicit `aria-live`, some has neither, and current
   render calls can announce routine rerenders rather than only meaningful
   transitions.
5. **Focus indicator contrast is insufficient.** The current `#d7972d` focus
   color has a measured contrast ratio of approximately 2.51:1 against white
   and 2.29:1 against `#f3f5f1`. A single-color outline therefore does not
   provide dependable separation across the app's adjacent light surfaces.
6. **Low-contrast interactive boundaries.** Several form/control borders rely
   on pale neutral colors that do not consistently reach 3:1 against adjacent
   surfaces where the boundary is required to identify the component.
7. **Long-text and reflow risks.** Action rows, metadata/disclosure layouts,
   phase assignment rows, keyframe controls, status/error strings, and Swing
   Card controls can receive long text or narrow widths without consistent
   `min-width: 0`, wrapping, overflow wrapping, or stacking rules. The current
   mobile rules do not prove 320 CSS-pixel reflow or text-spacing resilience.
8. **Existing useful coverage.** The smoke suite already covers desktop and a
   390 CSS-pixel mobile project, the real pose fixture, responsive workflow
   geometry, protected network behavior, Swing Card actions, and important
   selectors/labels. SS-019 should extend that real path rather than replace it
   with empty-state-only accessibility assertions.
9. **Canvas alternative remains limited.** The annotated keyframe canvas has an
   accessible label but not a stable description relationship to its overlay
   status. The canvas remains visual output; SS-019 can improve its name and
   description but cannot claim a fully equivalent nonvisual swing-analysis
   experience.

## Adopt

- Use one main landmark by changing only the static `#app` host element from
  `main` to `div` and retaining the renderer-owned workspace main.
- Add a stable announcer outside the replace-on-render subtree so meaningful
  status announcements survive full rerenders.
- Add `src/app-accessibility.ts` to own typed render/focus requests, a closed
  safe focus-key contract, focus capture/restore, focusability/fallback checks,
  and stable-announcer updates.
- Extend `requestRender` from an optional string to an object describing only
  approved focus and announcement intents.
- Use stable `data-focus-key` values. Compare attribute values and query the
  known attribute contract; never accept caller-provided CSS selectors.
- Restore focus only after render, event binding, and selected-keyframe canvas
  redraw. Prefer an explicit valid target, then the prior safe key, then a
  visible programmatic-focus fallback.
- Update `document.title` to the current workflow view after render while
  retaining the existing product/title wording pattern.
- Assign intent-specific focus and announcement behavior across events,
  lifecycle transitions, and Swing Card actions. Do not announce every render.
- Add semantic groups/headings/descriptions and scoped status regions while
  preserving protected copy, labels, and selectors.
- Remove `#video-file` from sequential keyboard focus with `tabindex="-1"` and
  `aria-hidden="true"`; keep the visible `Choose a video` button as the
  keyboard-operable trigger.
- Use a two-color focus treatment, stronger required control boundaries,
  scoped 44 CSS-pixel targets, wrapping/reflow hardening, readable failure
  styling, forced-color support, and existing reduced-motion behavior.
- Extend unit and Playwright coverage through the real pose-fixture path and
  add the required manual QA artifact during implementation.
- Keep runtime observability unchanged and add no dependencies.

## Revise Before Adoption

- Treat WCAG success criteria as design/test inputs, not as proof of project or
  product-wide conformance. Report what was tested, the environment, and
  residual limitations.
- Do not blanket every dynamic paragraph with `role="status"`. Use the stable
  announcer for concise workflow transitions and scoped local status regions
  where action-specific updates need proximity.
- Do not restore focus by replaying arbitrary selectors. The focus-key type and
  resolver must be internal and closed to known values.
- Do not force focus after same-control edits such as declarations, assignments,
  confirmations, or keyframe selection when the original control remains the
  clearest target; request that same control by key.
- Do not use positive `tabindex` or construct a parallel keyboard order. DOM
  order remains the source of sequential focus order.
- Do not set a global 44-pixel minimum on noninteractive layout elements.
  Apply target sizing to scoped controls and preserve usable dense desktop
  layouts.
- Do not treat 320-pixel screenshots alone as proof of reflow. Assert overflow,
  control usability, important geometry, long/error content, and review/export
  readability, then retain manual zoom/text-spacing checks.

## Defer

- Full accessibility certification, a formal WCAG conformance claim, and a
  third-party audit are deferred.
- Cross-browser/screen-reader combinations unavailable in the implementation
  environment are recorded as unavailable/residual risk, not claimed as
  passing.
- Complete nonvisual equivalence for pose-overlay canvas content is deferred;
  SS-019 improves its programmatic label/description and documents the limit.
- Localization and a production string-expansion system are deferred; long-text
  fixtures exercise structural resilience only.
- Camera capture, remote model review, remote sharing, providers, SDKs, model
  assets, telemetry, analytics, cloud diagnostics, and new operator diagnostics
  remain deferred.
- Broad design-system or decorative redesign work is deferred.

## Reject For Current Scope

- Reject positive `tabindex`, caller-provided focus selectors, focus traps, or
  focus changes that obscure the user's current task.
- Reject nested main landmarks, blanket live regions, or routine-rerender
  announcements.
- Reject changing protected user-facing safety, privacy, medical-scope,
  non-affiliation, consent, remote-review-unavailable, or local-first copy.
- Reject selector/label churn unless the approved spec names and directly
  updates the protected contract tests.
- Reject raw-media upload, remote sharing, provider/model registry enablement,
  service-worker changes, exported data-class changes, new persistence, or
  telemetry/logging/analytics/cloud diagnostics.
- Reject new dependencies, framework/component-library adoption, provider SDKs,
  model assets, bundle-policy changes, license-policy changes, notice changes,
  or SBOM changes.
- Reject claims that the story makes Swing Sync certified, fully accessible,
  universally screen-reader compatible, or compliant in every environment.

## Acceptance-Criteria Mapping

1. **Keyboard-only traversal:** typed focus intents, safe focus restoration,
   visible file-picker trigger, no positive tabindex, event/lifecycle/export
   focus mapping, a real keyboard-only smoke path, and manual keyboard evidence.
2. **Focus, labels, headings, status, disabled explanations:** one main,
   dynamic title, real stage/phase headings, grouped controls, canvas
   description, scoped live/status semantics, visible prerequisites, and direct
   renderer/event/unit assertions.
3. **Desktop/mobile layout:** focus/control contrast tokens, 44-pixel scoped
   targets, wrapping/flex/min-width hardening, readable failure styling,
   320-pixel and desktop long/error/review/export smoke checks, plus manual zoom,
   text-spacing, forced-colors, mobile, and print/export evidence.
4. **Practical automation:** new `app-accessibility` unit tests, focused
   renderer/event tests, and real pose-fixture Playwright coverage mapped by
   test name to acceptance criteria and future Claude blockers.
5. **Manual-only risks:** implementation must add
   `docs/ss-019-manual-accessibility-qa.md` with exact environment/evidence,
   defects, unavailable AT combinations, and residual-risk disclosures.

## Weak Claims And Evidence Limits

- Static source review identifies likely risks; it does not prove assistive
  technology behavior.
- Computed color ratios apply to the named color pairs only. Final rendered
  states, forced colors, opacity, antialiasing, and adjacent-color combinations
  still require implementation-time verification.
- Automated DOM, geometry, keyboard, and contrast-token checks can prevent
  known regressions but cannot establish full accessibility.
- A passing Playwright mobile viewport does not establish usability on every
  physical device, browser UI configuration, font setting, or input method.
- VoiceOver/NVDA evidence is recorded only when actually executed. An
  unavailable combination remains an explicit residual risk.
- Improved canvas semantics do not make the visual overlay fully equivalent for
  nonvisual users.
- The story must not claim WCAG certification, legal compliance, guaranteed
  accessibility, or universal compatibility.

## Observability And Dependency Decisions

Runtime observability remains intentionally unchanged. SS-019 may improve
existing local UI status text and announcement semantics, but it adds no
telemetry, analytics, remote logging, cloud diagnostics, hidden identifiers,
persistent debug artifacts, expanded console output, or new operator
instrumentation.

No dependency, framework, provider SDK, model asset, bundle, license-policy,
notice, or SBOM change is planned. If implementation changes that decision, the
story must return to specification review and run the additional licensing and
SBOM checks required by `AGENTS.md`.
