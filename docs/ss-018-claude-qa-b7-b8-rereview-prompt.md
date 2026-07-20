# SS-018 Claude QA B7-B8 Re-Review Prompt

Superseded for paste use by
`docs/ss-018-claude-qa-b7-rereview-prompt.md` after Claude Round 3 closed B8
and returned FAIL on residual B7. Keep this file as the Round 3 re-review
record.

Paste this prompt into Claude for focused preimplementation QA re-review.
Claude Chat does not have repository, filesystem, GitHub, or Notion access, so
this prompt is self-contained.

```text
Role: You are the lead adversarial QA planner for Swing Sync, a local-first
browser app for educational golf swing review.

Stage: Focused pre-implementation QA re-review after Round 2 FAIL.

Scope: Re-review only whether the SS-018 plan now closes B7-B8 without
introducing new planning blockers. B1-B6 were closed in Round 2.

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

B1-B6 status from prior re-review:
- B1 state-mutation ownership: closed.
- B2 shared render helpers: closed.
- B3 remote-review rendering ownership: closed.
- B4 `observedSeekTimestampMs` export exclusion: closed.
- B5 injectable consent storage: closed.
- B6 global listener to lifecycle contract: closed.

Prior Round 2 findings and applied plan fixes:

B7: Render-to-rebind control-loop ownership was unspecified.
Applied fix:
- `src/main.ts` owns a `requestRender(statusMessage?)` coordinator closure.
- `src/app-events.ts` receives `requestRender` as an explicit dependency.
- After every state-changing transition, event handlers call
  `requestRender(statusMessage?)` unless the existing behavior only updates
  current processing DOM through lifecycle progress handlers.
- `requestRender` calls `app-renderer.renderApp(...)`, fully replaces the
  `#app` subtree, calls `app-events.bindAppEvents(...)` against the fresh DOM,
  and then calls `keyframe-overlay-renderer.renderSelectedKeyframeCanvas(...)`
  when a keyframe canvas is present.
- Because each render replaces `#app.innerHTML`, old event listeners are
  discarded with old DOM nodes. No explicit listener teardown is required for
  the current direct-DOM pattern. If a future implementation changes to
  persistent DOM nodes, it must add teardown or delegated-listener coverage in
  the same reviewed change.
- Unit tests must cover repeated render/bind cycles for at least one
  state-changing control and one Swing Card action: after two re-renders,
  triggering the control once must produce a single effect, not a duplicate
  listener effect.

B8: Ownership of `frameController` and `abortFrameController` as
non-serializable resource handles was ambiguous against the B1 state contract.
Applied fix:
- `src/app-state.ts` keeps only serializable or UI-derived session state:
  `processingState`, `poseStatusCode`, frame counts, landmark count, selected
  video metadata/reference, phase review state, selected keyframe index,
  overlay result, and Swing Card busy/status.
- `src/app-state.ts` does not store non-serializable frame-analysis resource
  handles such as `FrameProcessingController` or the abort callback.
- `FrameProcessingController` and abort callback handles live in
  `src/analysis-lifecycle.ts` as an explicit scoped exception to the
  direct-state-mutation ban.
- After lifecycle-owned controller handles are closed or cleared, lifecycle
  code must call app-state transition functions so derived UI state remains in
  sync with lifecycle state.
- Unit tests must prove close clears lifecycle controller handles and drives
  the expected app-state transition, rather than leaving either side stale.

Additional test-plan clarifications:
- `selectCanBeginAnalysis(state, consentAccepted)` must have full-matrix unit
  tests for consent true/false, selected video present/absent, and active
  processing states.
- Consent storage get/set/remove failure tests must prove the public consent
  query function returns false, not merely that fake storage methods throw.
- `src/app-events.ts` has a targeted unit test command:
  `npm run test:unit -- app-events`.
- Final audit evidence must map named tests to render/rebind single-effect
  behavior and lifecycle handle ownership sync.

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
- For B7 and B8, state closed or still open.
- Any new blockers introduced by the revised plan.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for whether implementation may begin.
```
