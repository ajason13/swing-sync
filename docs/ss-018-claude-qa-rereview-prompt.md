# SS-018 Claude QA B1-B6 Re-Review Prompt

Superseded for paste use by
`docs/ss-018-claude-qa-b7-b8-rereview-prompt.md` after Claude Round 2 closed
B1-B6 and returned FAIL with B7-B8. Keep this file as the Round 2 re-review
record.

Paste this prompt into Claude for focused preimplementation QA re-review.
Claude Chat does not have repository, filesystem, GitHub, or Notion access, so
this prompt is self-contained.

```text
Role: You are the lead adversarial QA planner for Swing Sync, a local-first
browser app for educational golf swing review.

Stage: Focused pre-implementation QA re-review after Round 1 FAIL.

Scope: Re-review only whether the SS-018 plan now closes Round 1 blockers
B1-B6 without introducing new planning blockers. Do not re-audit unrelated
future implementation details unless the revised plan creates a new blocker.

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

Prior Round 1 findings and applied plan fixes:

B1: No state-mutation ownership contract.
Applied fix:
- `src/app-state.ts` must own all state mutation through named transition
  functions or a reducer-style API.
- Other modules must not mutate state fields directly.
- Required transition functions are named for workflow selection, local video
  selection, processing state/progress/output, processing completion, phase
  reset/rebuild/declarations/draft/confirmation, keyframe
  selection, overlay result, and Swing Card busy/status.
- `selectCanBeginAnalysis(state, consentAccepted)` is the single source for
  the `#analysis-button` enablement decision.

B2: Shared render helpers had no assigned home.
Applied fix:
- `src/render-utils.ts` is the canonical home for `escapeHtml`,
  `formatRemoteDataClass`, and `formatSwingCardWarning`.
- Renderer modules must import these helpers from `src/render-utils.ts`.
- Unit tests must include at least one escaping regression proving
  user-controlled selected file names render escaped.

B3: Remote-review-unavailable rendering had no assigned module.
Applied fix:
- `src/remote-model-renderer.ts` owns remote-review-unavailable rendering,
  empty-provider registry disclosure, and outbound/blocked data class display.

B4: `observedSeekTimestampMs` exclusion had no export-module regression test.
Applied fix:
- `src/swing-card-actions.ts` must not copy `observedSeekTimestampMs` from
  `SampledFrameOutput` into `SwingCardContent`, prompt text, PNG/print
  content, clipboard content, or any serialized/exported value.
- New Swing Card action tests must serialize or inspect every produced Swing
  Card content shape from the extracted module and assert
  `observedSeekTimestampMs` is absent.

B5: Consent storage access was not specified as injectable.
Applied fix:
- `src/consent-state.ts` exports an injectable `ConsentStorage` interface with
  `getItem`, `setItem`, and `removeItem`.
- Production construction defaults to `window.localStorage`.
- Unit tests pass fake storage objects directly and cover accepted, missing,
  get failure, set failure, and remove failure paths.

B6: Cross-module contract for `beforeunload` and `securitypolicyviolation` was
unspecified.
Applied fix:
- `main.ts` must call `analysisLifecycle.closeActive()` from `beforeunload`.
- `main.ts` must call `analysisLifecycle.abortWithNetworkBlocked()` from
  `securitypolicyviolation`.
- `abortWithNetworkBlocked()` must check current processing state and only
  abort when state is `loading` or `processing`, preserving abort code
  `UNEXPECTED_NETWORK_BLOCKED`.
- Lifecycle unit tests must cover active loading/processing abort,
  non-active idle/completed no-op behavior, and controller-reference clearing
  after close.

Other incorporated recommendations:
- `src/app-events.ts` is required, not optional, for DOM event binding.
- `src/keyframe-overlay-renderer.ts` owns imperative canvas/bitmap helpers,
  while `src/phase-review-renderer.ts` owns pure phase-review/keyframe HTML.
- Renderer tests must directly assert every protected label and selector at
  least once in the branch where it appears.
- `npm run test:smoke` must run after protected-boundary extraction milestones
  when practical and before final audit.
- Final verification explicitly includes `npm run docs:verify`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, `npm run build`, `npm run test:smoke`, targeted
  unit tests, and `git diff --check`.

Relevant revised target modules:
- `src/main.ts`: bootstrap and global listener registration only.
- `src/app-state.ts`: state shape, initial state, selectors, and named
  transitions/reducer-style API.
- `src/consent-state.ts`: injectable local acknowledgement storage and
  fail-closed behavior.
- `src/render-utils.ts`: shared escaping and formatting helpers.
- `src/app-renderer.ts`: top-level shell and workflow dispatch.
- `src/phase-review-renderer.ts`: phase review, declaration controls, and
  keyframe HTML.
- `src/keyframe-overlay-renderer.ts`: selected keyframe canvas drawing and
  annotated keyframe bitmap creation.
- `src/remote-model-renderer.ts`: remote-review-unavailable panel and data
  class disclosure.
- `src/swing-card-actions.ts`: Swing Card content preparation and local export
  actions.
- `src/analysis-lifecycle.ts`: frame-processing lifecycle and global handler
  methods.
- `src/app-events.ts`: DOM event binding and cross-module event wiring.

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
- For each prior blocker B1-B6, state closed or still open.
- Any new blockers introduced by the revised plan.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for whether implementation may begin.
```
