# SS-019 Claude QA-Planning Response

Date: 2026-07-20

Claude verdict: **FAIL**.

Lead-architect disposition: **B1-B6 Accepted as blockers**. SS-019 remains at
`2. QA Planning (Claude)`. Runtime/UI implementation, story-branch creation,
and builder delegation remain blocked pending focused Claude re-review PASS.

## Finding Classification

All six findings expose missing architecture or verification contracts in the
candidate preimplementation specification. They are not implementation defects
because no SS-019 implementation exists. Each blocker changes the reviewed
plan and tests before builder work may begin.

Claude's precision notes about exact document titles, exact per-view fallback
targets, bounded dynamic focus keys, and one polite announcement policy are
adopted as non-blocking precision within B1-B6 remediation. They clarify the
existing acceptance criteria; they do not expand SS-019 product scope.

## B1 — Analysis-Lifecycle Terminal States Need A No-Render Accessibility Path

Claude finding, faithfully summarized:

The original plan prohibited full renders for processing progress but did not
define how current completed/failed callbacks could focus the processing
heading and announce a terminal state without replacing the controller-owned
video DOM. It also did not prevent stale terminal callbacks, cancelled/closed
callbacks, or retry behavior from stealing focus or duplicating announcements.

Disposition: **Accepted / blocker**.

Required correction:

- `src/app-accessibility.ts` owns both
  `applyAccessibilityIntent(root, announcer, intent)` for existing DOM and the
  post-render intent application path.
- `src/main.ts` injects both `requestRender(RenderRequest?)` and
  `applyAccessibilityIntent(AccessibilityIntent)`; the no-render function may
  only validate/focus/announce existing DOM.
- `updateProcessingProgressUi` stays partial and changes only safe text and
  `hidden` properties. The processing state text alone is a polite atomic
  status; numeric `[data-pose-summary]` stays outside it.
- Loading, processing, progress, and output callbacks perform partial DOM
  updates only, with no global announcement and no focus change.
- Each controller's callback closures capture that controller's identity or an
  equivalent unique token. Every callback checks the token before any state,
  output, DOM, focus, or announcement mutation; stale callbacks return
  immediately. Current-token completed/failed callbacks update state/output and
  the visible processing DOM, use the scoped processing status as the only
  announcement channel, then apply no-render focus to `stage-heading` only
  while the active view is processing and the captured controller/token equals
  the active controller/token.
- Late/stale terminal callbacks outside the current processing view neither
  focus nor announce. `stopActive()` alone owns the stopped/released full
  render, announcement, and focus. Both `stopActive()` and `closeActive()`
  synchronously invalidate the active callback token before awaiting
  `cancel()`/`close()`, while retaining a local controller reference for
  resource release; a racing terminal callback is inert before mutation.
  `closeActive()` performs cleanup/state reset only with no render, focus, or
  announcement; workflow-navigation and picker-change callers own one
  destination render, while `beforeunload` performs cleanup with no render.
  Cancelled/closed callbacks remain silent.
- `retryActive` focuses the stage heading through the no-render path and relies
  on subsequent scoped processing status without replacing the video node.
- Add the five named lifecycle tests required by the revised spec.

## B2 — Proxy File Input Needs Cancel And Browser Focus-Return Contracts

Claude finding, faithfully summarized:

The original `aria-hidden="true"` proposal could hide a file input that a
browser may focus after a native chooser closes, and the plan tested successful
selection but not cancel or defensive focus redirection. The proxy button/file
input pair therefore lacked a complete keyboard focus-return contract.

Disposition: **Accepted / blocker**.

Required correction:

- Remove the proposed `aria-hidden="true"`.
- Keep `#video-file` at `tabindex="-1"` with an accurate accessible label as a
  defensive fallback.
- Give the visible picker button a known focus key.
- Successful `change` always full-renders with explicit picker focus.
- A native `cancel` listener returns focus to the current visible picker
  without a render.
- Defensive `focus`/`focusin` handling redirects input focus to the visible
  picker after chooser close. Positive tabindex remains prohibited.
- Add named unit/smoke coverage for keyboard-opened success, cancel recovery,
  and hidden-input redirect, plus a manual native-chooser cancel row for each
  tested browser/AT environment.

## B3 — Every Semantic Event Needs One Announcement Owner

Claude finding, faithfully summarized:

The stable global announcer plus existing shell, phase-warning, Swing Card,
remote-model, processing, and overlay live regions could announce one semantic
event multiple times. The plan did not assign every callsite to exactly one
global, scoped, or no-announcement channel.

Disposition: **Accepted / blocker**.

Required correction:

- Enforce exactly one announcement channel per semantic event: global or
  scoped, never both.
- The stable global announcer owns full-render shell/workflow/consent/camera/
  video/phase/Swing Card events.
- Visible `.status`, `.phase-warning`, `[data-swing-card-status]`, and static
  `[data-remote-model-status]` lose live-region roles but remain visible text
  and descriptions.
- Scoped live regions are limited to in-place processing state and imperative
  overlay status; those events pass no global announcement.
- All announcements, including failures, are polite. Assertive announcement is
  rejected because none of the current events requires interruption.
- Add a complete channel/callsite matrix, a named one-channel inventory test,
  smoke checks, and manual duplicate-announcement evidence.

## B4 — Generic Labels Need A Naming Role Or Native Structure

Claude finding, faithfully summarized:

Adding `aria-label` to generic containers does not provide a reliable named
group unless the element also has an appropriate role/native semantic. Applying
`role="group"` directly to the remote-model `<dl>` would overwrite its native
list semantics.

Disposition: **Accepted / blocker**.

Required correction:

- `.capture-options`, `.keyframe-strip`, `.phase-assignment-list`, and
  `.swing-card-summary` become named `role="group"` containers or named native
  equivalents.
- Preserve `<dl class="remote-model-disclosure">` semantics and its protected
  class/label by wrapping it in a named `role="group"` container.
- Add renderer and smoke role/name assertions for `Swing Card contents` and
  `Remote model data disclosure`, and include both in 320-pixel/long-text
  geometry evidence.

## B5 — Focus Keys And Every Render/No-Render Callsite Need A Closed Inventory

Claude finding, faithfully summarized:

The focus-key examples and event table were incomplete. They did not enumerate
all existing render/lifecycle/export callsites, bounded dynamic keys, the camera
placeholder, exact fallbacks, or guards against delayed terminal callbacks
stealing focus from open phase controls.

Disposition: **Accepted / blocker**.

Required correction:

- Enumerate all static keys for consent, camera, picker, analysis, stage,
  workflow, stop/retry/review, phase declarations/setup/assignment/
  confirmation/confirm, export, review/export headings, and each Swing action/
  status.
- Permit only these dynamic bounded forms:
  `workflow-step:<capture|processing|review|export>`,
  `phase-assignment:<0..7>`, and `keyframe:<0..7>`. Reject arbitrary or
  out-of-range values.
- Give the camera placeholder a key; its full render returns to the same button
  and uses the global status.
- Inventory every current `requestRender` and no-render accessibility call in
  `app-events.ts`, `analysis-lifecycle.ts`, and `swing-card-actions.ts`,
  including guard failures and every asynchronous Swing action phase.
- Use exact fallbacks: capture/processing `stage-heading`; review
  `phase-review-heading` when outputs exist else `stage-heading`; export
  `swing-card-heading` when outputs exist else `stage-heading`.
- Add a unit inventory test proving no unmapped callsite/intent exists, and
  guard same-control focus against delayed terminal focus theft.

## B6 — Focus And Boundary Styling Needs Exact Tokens, Geometry, And Ratios

Claude finding, faithfully summarized:

The visual plan described two-color focus and 3:1 boundaries but did not name
exact tokens, ring geometry, adjacent surfaces, computed ratios, or an
executable contrast contract. It was therefore not implementation- or
audit-ready.

Disposition: **Accepted / blocker**.

Required correction:

- Exact tokens: `--focus-inner: #ffffff`, `--focus-outer: #17211b`, and
  `--interactive-boundary: #607367`.
- Exact geometry: 2 CSS-pixel white outline with 2-pixel offset plus a dark
  outer ring that leaves at least 2 CSS pixels visible beyond the inner ring,
  such as a 6-pixel spread.
- Preserve UA/system forced-color focus and prohibit
  `forced-color-adjust: none`.
- Require the exact corrected contrast matrix in the revised spec: outer
  ratios 16.54/15.07/15.76/14.21/14.59 against white, `#f3f5f1`, `#f8faf7`,
  `#e7f0e9`, `#eaf3ec`; inner ratios 16.54 and 7.97 against `#17211b` and
  `#245b3b`; interactive-boundary ratios 5.07/4.62/4.83/4.35/4.47 against the
  same five light surfaces. Required threshold is at least 3:1.
- Add named `test/unit/accessibility-contrast.test.ts` that reads exact CSS
  custom properties and computes every ratio, plus smoke evidence for applied
  tokens, two-layer geometry, and forced-colors emulation.

## Adopted Non-Blocking Precision

- Runtime titles are exactly `Swing Sync | Capture`,
  `Swing Sync | Processing`, `Swing Sync | Review`, and
  `Swing Sync | Export`.
- Per-view fallbacks and dynamic key bounds are exact rather than illustrative.
- All current announcements use polite priority; assertive is deliberately
  rejected to prevent unnecessary interruption.
- Manual QA explicitly adds native chooser cancel, duplicate-announcement,
  terminal completion/failure, named group, and forced-colors/token-surface
  rows.

These decisions tighten the existing keyboard, semantics, status, responsive,
and manual-risk acceptance criteria. They add no product feature or public
claim.

## Protected-Boundary Disposition

- Safety/privacy/local-first copy and meaning: unchanged.
- Raw media, remote sharing, providers, SDKs, model assets, persistence,
  service worker, exported data, and analysis behavior: unchanged.
- Dependencies, bundle policy, license policy, notices, and SBOM: unchanged;
  no additions planned.
- Observability: unchanged. No telemetry, analytics, remote logging, cloud
  diagnostics, hidden identifiers, persistent debug artifacts, expanded
  console output, or runtime operator instrumentation is added.

## Process Lessons

- Cross-cutting focus and live-region specifications require complete callsite
  inventories plus a single-owner channel matrix before implementation.
- Proxy file controls require success, cancel, browser focus-return, and
  defensive redirect coverage; a successful selection test is insufficient.
- Generic `aria-label` requires a naming role or named native structure;
  protected native semantics such as `<dl>` must not be overwritten.
- Visual-token corrections must name exact tokens, geometry, adjacent surfaces,
  ratios, thresholds, and executable tests rather than relying on qualitative
  contrast language.
- Focused re-review packets must include prior findings, revised spec, exact
  spec diff, relevant current sources/tests, coordination diff, and explicit
  omission rationales before a blocker can be considered closed.

## Next Gate

Use `docs/ss-019-claude-qa-rereview-prompt.md` followed immediately by
`docs/ss-019-claude-qa-rereview-source-packet.md`. Claude must return PASS and
explicitly clear B1-B6 without introducing an unresolved blocker before branch
creation or builder delegation.
