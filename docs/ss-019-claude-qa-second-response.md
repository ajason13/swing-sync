# SS-019 Claude QA-Planning Second Response

Date: 2026-07-20

Claude verdict: **FAIL**.

Raw response: `docs/ss-019-claude-qa-second-raw-response.md`.

Lead-architect disposition: **B2, B5, and B6 are CLOSED and remain
regression-protected. B1, B3, B4, and the lead close/token-race precision are
OPEN through accepted blockers N1-N3.** Runtime/UI implementation, story-branch
creation, and builder delegation remain blocked pending specification/test-plan
correction and another independent Claude re-review.

## Finding Classification

| Prior finding | Second-review status | Lead disposition |
| --- | --- | --- |
| B1 terminal-state focus/announcement | OPEN via N1 | Accept N1 as blocker |
| Lead close/token-race precision | OPEN via N1 | Accept N1 as blocker |
| B2 file-input cancel/focus return | CLOSED | Preserve and regression-protect |
| B3 single announcement channel | OPEN via N2 | Accept N2 as blocker |
| B4 named container semantics | OPEN via N3 | Accept N3 as blocker |
| B5 focus-key/callsite inventory | CLOSED | Preserve and regression-protect |
| B6 contrast tokens/geometry | CLOSED | Preserve and regression-protect |

Claude found no handoff-completeness blocker and no safety, privacy,
local-first, consent, remote-review, dependency, or observability drift.

## N1 — Existing Test Migration For Render-Free Close Ownership

N1 is accepted. The revised `closeActive()` contract is cleanup-only and
render-free, but two existing tests still require a lifecycle-owned render.
The specification must authorize the exact migration instead of leaving old
and new contradictory tests together.

Lead decision:

- Rename `clears lifecycle-owned controller handles and syncs app-state idle on
  close` to `clears lifecycle-owned controller handles and syncs app-state idle
  on close without rendering`; assert zero `requestRender` and zero
  `applyAccessibilityIntent` calls.
- Remove/replace `re-renders capture controls after async close settles`.
  Relocate its SS-018 stale-capture intent into app-events tests named
  `awaits closeActive before rendering workflow navigation exactly once` and
  `awaits closeActive before selecting a replacement video and renders exactly
  once`. Both use a deferred close and prove the caller owns one typed
  destination render only after cleanup resolves.
- Update `stops active processing and requests an idle capture render` to assert
  the exact typed object with `focusKey: "stage-heading"` plus the existing
  stopped visible status text and announcement.
- Update every legacy `requestRender` mock/type and the camera app-events
  assertion to the exact typed payload. No old/new contradictory tests may
  coexist.

The exact accessibility types are:

```ts
interface AccessibilityIntent {
  focusKey?: FocusKey;
  announcement?: string;
}

interface RenderRequest extends AccessibilityIntent {
  visibleStatusText?: string;
}
```

`requestRender` passes `visibleStatusText` only to the non-live visible
`#app-visible-status` and passes `announcement` only to `#app-announcer`.
When visible text is absent, the existing consent-derived visible default is
used. An event may populate both fields with exact messages; only the announcer
is live.

## N2 — Live-Region And Existing Smoke-Locator Migration

N2 is accepted. The single-announcement-channel architecture is sound, but the
specification must explicitly migrate existing role-based smoke assertions and
close visible/scoped ownership ambiguity.

Lead decision:

- The non-live visible IDs are exactly `#app-visible-status`,
  `#phase-review-status`, `#swing-card-action-status`, and
  `#remote-model-status`.
- The only scoped live IDs are `#processing-status` and
  `#keyframe-overlay-status`.
- The stable global live region is `#app-announcer`.
- Stable visible text remains populated by `request.visibleStatusText`, app
  state, or the existing owning renderer path. Removing a live role must not
  remove state-accurate visible content.
- Replace all three existing unscoped `page.getByRole("status")` assertions —
  camera at line 117, consent guard at line 166, and stopped status at line 497
  of the reviewed smoke baseline — with direct `#app-announcer` assertions plus
  visible `#app-visible-status` text and no-role assertions.
- Retain every `.phase-warning` text assertion. Replace the reviewed line 221
  `aria-live="polite"` assertion with assertions for no status role, no
  `aria-live`, stable `id="phase-review-status"`, and the exact
  `aria-describedby` relationship.
- Unscoped status-role locators are prohibited in processing/review tests
  because global and scoped live regions coexist. Target exact IDs.
- Define the phase semantic transition key as exactly
  `unsupported-input | review-required | confirmed`. Send one global
  announcement only when the before/after key changes.
- The one-channel-per-event inventory must prove that each event has exactly
  one declared announcement owner.

## N3 — Exhaustive Generic-Container Naming Remediation

N3 is accepted. The semantic inventory must cover every reviewed instance of
the same unsupported generic-container naming pattern, not only the instances
identified in the first review.

Lead decision:

- Add `role="group"` while retaining the exact accessible name for:
  - `.capture-options`: `Local video source`;
  - `.processing-placeholder`: `Local pose processing`;
  - `.review-placeholder`: `Review placeholder`;
  - `.swing-card-summary`: `Swing Card contents`;
  - `.phase-assignment-list`: `Swing phase assignments`;
  - `.keyframe-strip`: `Select keyframe`.
- Convert `.export-placeholder` to
  `<section aria-labelledby="export-placeholder-heading">`, using the existing
  `Swing Card unavailable` heading with stable
  `id="export-placeholder-heading"`.
- Wrap the native `.remote-model-disclosure` `<dl>` in a named
  `role="group"` with exact name `Remote model data disclosure`; retain the
  nested native `<dl>` semantics.
- Add named renderer, smoke, and manual assertions for every listed group or
  region and the nested `<dl>`.
- Add an inventory test that rejects bare labelled generic containers.

## Adopted Precision

Retry focus is idempotent: the focus helper does not call `.focus()` when the
target is already `document.activeElement`. Retry followed by a terminal state
without intervening focus therefore invokes DOM focus once total; a terminal
state may focus once when the user has moved elsewhere.

Every visible description target has an exact, unique ID, retains
state-accurate text, and has direct relationship assertions from the described
control. Manual QA includes browse-mode verification for disabled controls.

## Closed Findings Retained As Regression Contracts

- B2 remains closed: `#video-file` is not `aria-hidden`, and success, native
  cancel, and defensive focus return restore the visible picker through named
  automated/manual cases.
- B5 remains closed: the static and bounded dynamic focus-key grammar, exact
  fallbacks, and complete render/no-render callsite inventory remain required.
- B6 remains closed: exact focus/boundary tokens, two-layer geometry, eleven
  enumerated surface ratios, the `>= 3:1` threshold, CSS-reading unit coverage,
  computed-style smoke checks, and forced-colors behavior remain required.

## Protected Boundaries And Observability

Protected safety/privacy/non-affiliation copy, local-first raw-media handling,
consent, remote-review-disabled behavior, service-worker behavior, exported
data classes, protected labels, and smoke selectors remain unchanged.

Observability remains intentionally unchanged. Do not add telemetry, analytics,
remote logging, cloud diagnostics, provider SDKs, model assets, hidden
identifiers, persistent debug artifacts, or expanded console output. No
dependency, framework, bundle, license-policy, notice, or SBOM change is
approved.

## Notion Synchronization Exception

Live refetches of SS-019 and SS-TC-023 failed on 2026-07-20 because the Notion
connector returned `Auth error: OAuth authorization required`. No Notion
mutation occurred. The last verified status remains `2. QA Planning (Claude)`,
but that is not a fresh live tracker verification.

## Next Gate

The lead architect must revise the preimplementation specification and exact
named test-migration contracts for N1-N3. The workflow coordinator must then
persist a new self-contained focused re-review prompt and complete source packet.
Claude must independently close B1, B3, B4, the lead close/token-race precision,
and N1-N3 before implementation, story-branch creation, or builder delegation.
