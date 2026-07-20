# SS-018 Claude QA Residual B7 Re-Review Prompt

Paste this prompt into Claude for focused preimplementation QA re-review.
Claude Chat does not have repository, filesystem, GitHub, or Notion access, so
this prompt is self-contained.

```text
Role: You are the lead adversarial QA planner for Swing Sync, a local-first
browser app for educational golf swing review.

Stage: Focused pre-implementation QA re-review after Round 3 FAIL.

Scope: Re-review only whether the SS-018 plan now closes residual B7 without
introducing new planning blockers. B1-B6 were closed in Round 2. B8 was closed
in Round 3.

Context:
Swing Sync is a local-first Vite/TypeScript browser app. SS-018 is a runtime
refactor story to reduce `src/main.ts` orchestration pressure while preserving
current behavior. Raw swing video is not uploaded by default. Remote model
review remains unavailable because the production reviewed-provider registry is
empty. There is no app backend, telemetry, analytics, remote logging, cloud
storage, or configured remote model provider in the current app.

Acceptance criteria:
- Split the current app shell into focused modules without changing
  user-facing behavior.
- Keep consent gating, local video selection, local pose processing, phase
  review, Swing Card export, and remote-review-unavailable behavior intact.
- Preserve existing accessibility labels and test selectors used by smoke
  tests.
- Add or adjust unit tests around extracted state/renderer behavior where
  useful.
- No new framework or dependency unless separately reviewed and approved.

Protected boundaries:
- Do not change runtime privacy posture, raw-media handling, remote sharing,
  provider/model registry behavior, service-worker behavior, or exported data
  classes.
- Do not add telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts.

Prior status:
- B1 state-mutation ownership: closed.
- B2 shared render helpers: closed.
- B3 remote-review rendering ownership: closed.
- B4 `observedSeekTimestampMs` export exclusion: closed.
- B5 injectable consent storage: closed.
- B6 global listener to lifecycle contract: closed.
- B8 controller-handle ownership: closed.

Residual B7 finding:
The Round 2 plan specified the full render/rebind path, but left processing
progress/output updates as an unspecified partial-update bypass. Claude noted
that if lifecycle code caches DOM node references or mutates processing status
text directly, a full `requestRender(...)` between progress ticks could leave
the next tick writing to detached nodes or create a second processing-panel
renderer outside `app-renderer.ts`.

Applied B7 fix:
- `src/app-renderer.ts` owns processing-progress DOM updates through exported
  partial-update functions.
- Required API:

```ts
export function updateProcessingProgressUi(root: ParentNode, state: AppState): void;
```

- `src/analysis-lifecycle.ts` owns frame-processing callbacks and controller
  handles, but it must delegate every processing-panel DOM update to
  `app-renderer.updateProcessingProgressUi(...)` after calling app-state
  transition functions.
- `src/analysis-lifecycle.ts` must not cache progress DOM nodes or write
  progress/status text directly.
- `updateProcessingProgressUi(root, state)` must re-query current DOM targets
  on each call using selectors such as `[data-pose-summary]`,
  `[data-retry-analysis]`, and `[data-review-phases]`.
- Re-querying on every tick is required so progress updates attach to the
  visible DOM after any intervening full `requestRender(...)` replacement.
- Unit tests must trigger an intervening full render during active processing
  and then assert the next progress/output tick updates the visible
  `[data-pose-summary]` text rather than a detached node.
- A composition test must cover stop during processing: user action calls
  lifecycle stop/close, controller handles are cleared, app-state reaches
  `idle`, and a subsequent `requestRender(...)` reflects the idle/capture UI.

Throttling note:
Progress-tick throttling is deferred. SS-018 preserves current behavior and
the existing eight-sample processing cadence; throttling can be considered in a
future performance story if profiling shows a need.

Known non-goals:
- No framework migration or new dependency.
- No design refresh, copy rewrite, or new user-facing workflow.
- No backend, auth, accounts, secrets, telemetry, analytics, remote logging,
  cloud diagnostics, cloud storage, provider SDK, model provider, remote model
  review enablement, or remote sharing.
- No service-worker behavior change.
- No exported data class change.
- No additional console output, hidden identifiers, or persistent debug
  artifacts.

Observability decision:
Runtime observability remains intentionally unchanged. Existing local UI status
text and sanitized stable error codes remain the only diagnostics in scope.

Verification so far:
- Planning/spec-only changes.
- No runtime implementation has started.
- `git diff --check` will be run after this focused prompt is finalized.

Output required:
- PASS/FAIL verdict.
- State whether residual B7 is closed or still open.
- Any new blockers introduced by the revised plan.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for whether implementation may begin.
```
