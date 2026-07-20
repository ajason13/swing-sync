# Swing Sync Context

Last updated: 2026-07-19

## Current State

- Repository: https://github.com/ajason13/swing-sync
- Default branch: `main`
- Latest merged PR: https://github.com/ajason13/swing-sync/pull/18
- Latest merge commit: `b59842940b7188c7b325a98e2b857e19b6eeadc3`
- Current `main` includes PR #18 merge commit
  `b59842940b7188c7b325a98e2b857e19b6eeadc3`. Local `main` was
  fast-forwarded to `origin/main` by the PR #18 merge flow before this
  post-merge context update.
- Latest post-merge guidance/context commit on `main`:
  `8c8c400b02ccfd90d6c5e6a8aadc63604c881565`.
- Current completed task:
  `SS-017 Document production deployment, backend boundary, and security-header
  posture`
- Active task:
  `SS-018 Refactor frontend app shell into maintainable UI/state modules`
- Active branch: `ss-018-frontend-architecture`
- Active handshake: `4. Final Audit (Claude)`
- Active Pull Request: https://github.com/ajason13/swing-sync/pull/19.
- Remaining visible non-Done backlog tasks: SS-018 through SS-022, created
  from the manual app-readiness gap review on 2026-07-03.

## SS-018 Coordination

SS-018 is privacy-, safety-boundary-, frontend-runtime-, refactor-,
accessibility/test-selector-, and user-facing-behavior-sensitive because it
touches the app shell while preserving consent gating, local-first raw-media
handling, remote-review-disabled behavior, and exported data classes.

Acceptance criteria from Notion:

- Split the current app shell into focused modules without changing
  user-facing behavior.
- Keep consent gating, local video selection, local pose processing, phase
  review, Swing Card export, and remote-review-unavailable behavior intact.
- Preserve existing accessibility labels and test selectors used by smoke
  tests.
- Add or adjust unit tests around extracted state/renderer behavior where
  useful.
- No new framework or dependency unless separately reviewed and approved.

Protected boundaries from Notion:

- Do not change runtime privacy posture, raw-media handling, remote sharing,
  provider/model registry behavior, service-worker behavior, or exported data
  classes.
- Do not add telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts.

Kickoff/spec state on 2026-07-04:

- Local `main` and `origin/main` were confirmed at
  `8c8c400b02ccfd90d6c5e6a8aadc63604c881565`.
- Worktree was clean before selection except for intentional untracked
  `docs/agent-guidance/*new-codex-session-prompt.md` files, which remain
  preserved.
- Notion page:
  https://app.notion.com/p/392834a0c8a68115b23bda9510e07958
- Branch from current `main`: `ss-018-frontend-architecture`.
- Pull Request: none.
- Task Type: `Refactor`.
- Notion task fields were verified before branching: Name
  `SS-018 Refactor frontend app shell into maintainable UI/state modules`,
  Branch `ss-018-frontend-architecture`, Handshake Status `0. Backlog`, Pull
  Request empty, Task Type `Refactor`, acceptance criteria, and protected
  boundaries.
- Notion was moved to `1. Spec Drafting (Gemini)` for board compatibility,
  with Codex acting as research/spec owner under the current routing.
- Existing `SS-TC-018` was inspected and found to belong to SS-015 browser
  regression coverage, not SS-018 app-shell refactor coverage.
- Dedicated test case `SS-TC-022` was created:
  https://app.notion.com/p/393834a0c8a68126b03deeb86d5d67fa
- `SS-TC-022` covers app-shell behavior preservation, consent/local-first
  boundaries, smoke-test selector and accessibility-label preservation,
  unit-test expectations for extracted state/renderers, browser smoke
  expectations, and protected no-telemetry/no-remote/no-dependency boundaries.
- Codex-owned research/disposition note:
  `docs/ss-018-research-disposition.md`.
- Candidate preimplementation spec:
  `docs/ss-018-preimplementation-spec.md`.
- Self-contained Claude QA planning handoff:
  `docs/ss-018-claude-qa-planning-prompt.md`.
- Source checks were recorded against `src/main.ts`, `src/workflow.ts`,
  `test/smoke/app.spec.ts`, `docs/privacy-architecture.md`,
  `docs/safety-terms.md`, and `package.json`.
- Current `src/main.ts` is 869 lines and owns consent storage, workflow
  session state, capture/processing/review/export rendering, event binding,
  local frame-analysis lifecycle, phase review, keyframe overlay rendering,
  Swing Card export actions, global security-policy handling, and production
  service-worker registration.
- Codex dispositions adopt focused module extraction for consent state, app
  state, renderers, analysis lifecycle, and Swing Card actions while keeping
  plain TypeScript/direct DOM patterns; revise any over-splitting into
  behavior-owned modules only; defer framework migration, design/copy changes,
  remote review, provider/model changes, service-worker changes, persistence,
  telemetry, analytics, remote logging, and exported data class changes; reject
  any user-facing behavior, selector/label, privacy, safety, dependency,
  telemetry, remote-sharing, provider registry, service-worker, or exported
  data-class change in this story unless separately reviewed.
- Observability decision: SS-018 intentionally leaves runtime observability
  unchanged. Do not add logs, telemetry, analytics, remote logging, cloud
  diagnostics, hidden identifiers, persistent debug artifacts, or new operator
  diagnostics.
- Notion moved to `2. QA Planning (Claude)` and updated with Round 1/Round 2
  QA planning notes after Notion OAuth access was restored on 2026-07-04.
- Claude QA planning returned FAIL with six blockers:
  - B1: `app-state.ts` needed a clear state-mutation ownership contract.
  - B2: shared render helpers, especially `escapeHtml`, needed a canonical
    module.
  - B3: remote-review-unavailable rendering needed an explicitly assigned
    module.
  - B4: moving Swing Card export preparation required an
    `observedSeekTimestampMs` exclusion regression.
  - B5: consent storage needed explicit injectable storage for failure-path
    unit tests.
  - B6: `beforeunload` and `securitypolicyviolation` needed named lifecycle
    methods to preserve close/abort behavior.
- Claude QA response record:
  `docs/ss-018-claude-qa-response.md`.
- Codex accepted B1-B6 as valid and revised
  `docs/ss-018-preimplementation-spec.md`: `src/app-state.ts` must own state
  mutation through named transitions or a reducer-style API; `src/render-utils.ts`
  is the canonical home for `escapeHtml`, `formatRemoteDataClass`, and
  `formatSwingCardWarning`; `src/remote-model-renderer.ts` owns the
  remote-review-unavailable panel; `src/swing-card-actions.ts` must preserve
  `observedSeekTimestampMs` exclusion with unit coverage; `src/consent-state.ts`
  must accept an injectable `ConsentStorage`; `analysisLifecycle.closeActive()`
  and `analysisLifecycle.abortWithNetworkBlocked()` must preserve global close
  and fail-closed CSP abort behavior; `src/app-events.ts` is required; and
  imperative keyframe canvas helpers belong in `src/keyframe-overlay-renderer.ts`.
- The initial Claude QA planning prompt is superseded for paste use. Focused
  B1-B6 re-review prompt, now also superseded:
  `docs/ss-018-claude-qa-rereview-prompt.md`.
- Claude focused B1-B6 re-review returned FAIL after closing B1-B6, with two
  new blockers:
  - B7: render-to-rebind control-loop ownership was unspecified.
  - B8: `frameController`/`abortFrameController` ownership was ambiguous under
    the app-state mutation contract.
- Claude focused re-review response record:
  `docs/ss-018-claude-qa-rereview-response.md`.
- Codex accepted B7-B8 as valid and revised
  `docs/ss-018-preimplementation-spec.md`: `src/main.ts` owns a
  `requestRender(statusMessage?)` coordinator passed to `src/app-events.ts`;
  state-changing handlers call `requestRender`; each render fully replaces the
  `#app` subtree, binds events on the fresh DOM, and redraws selected keyframe
  canvas; repeated render/bind tests must prove single-effect behavior;
  `src/app-state.ts` holds only serializable or UI-derived session state;
  non-serializable `FrameProcessingController` and abort callback handles are
  owned by `src/analysis-lifecycle.ts` as an explicit scoped exception; and
  lifecycle tests must prove handle clearing stays synchronized with app-state
  transitions.
- Claude B1-B6 non-blocking recommendations incorporated: fixed duplicated
  `confirmation/confirmation` wording, required full-matrix
  `selectCanBeginAnalysis` tests, and required consent storage failure tests
  proving the public consent query function fails closed.
- Focused B7-B8 re-review prompt:
  `docs/ss-018-claude-qa-b7-b8-rereview-prompt.md`.
- Claude focused B7-B8 re-review returned FAIL after closing B8. B7 remains
  open because the prior plan left frame-processing progress/output DOM
  updates as an unspecified partial-render bypass.
- Claude B7/B8 re-review response record:
  `docs/ss-018-claude-qa-b7-rereview-response.md`.
- Codex accepted the residual B7 finding as valid and revised
  `docs/ss-018-preimplementation-spec.md`: `src/app-renderer.ts` owns
  processing-progress DOM updates through
  `updateProcessingProgressUi(root, state)`; `src/analysis-lifecycle.ts` owns
  frame-processing callbacks and controller handles but must call app-state
  transitions and delegate every processing-panel DOM update to
  `app-renderer.updateProcessingProgressUi(...)`; lifecycle code must not
  cache progress DOM nodes or write progress/status text directly;
  `updateProcessingProgressUi` must re-query visible DOM targets such as
  `[data-pose-summary]`, `[data-retry-analysis]`, and `[data-review-phases]`
  on every tick; and tests must prove progress updates survive an intervening
  full `requestRender(...)` plus stop-during-processing composes handle
  clearing, app-state `idle`, and subsequent render.
- Progress throttling is deferred as out of scope for SS-018; the story
  preserves current eight-sample processing behavior.
- The focused B7-B8 re-review prompt is superseded for paste use. Focused
  residual B7 re-review prompt:
  `docs/ss-018-claude-qa-b7-rereview-prompt.md`.
- Claude focused residual B7 re-review returned PASS. B1-B8 are closed, no
  new blockers were introduced, and SS-018 is cleared for implementation.
- Claude B7 PASS response record:
  `docs/ss-018-claude-qa-b7-pass-response.md`.
- Claude non-blocking recommendations were folded into
  `docs/ss-018-preimplementation-spec.md`: `#app` root stability is explicit,
  missing processing selectors no-op, and dynamic progress/status writes use
  `textContent` or element properties unless future user-influenced HTML
  routes through `render-utils.escapeHtml`.
- Notion moved to `3. In Development (ChatGPT)` on 2026-07-05.
- Implementation audit must include executed named tests for render/rebind
  single-effect behavior, `observedSeekTimestampMs` exclusion, consent
  fail-closed behavior, escaping regression coverage, processing-progress
  reattachment after intervening full render, stop-during-processing
  composition, missing-selector no-op behavior, and required
  docs/compliance/safety/privacy/smoke/build/diff checks.
- Codex implementation completed on 2026-07-05. `src/main.ts` is now a thin
  bootstrap/render coordinator; focused modules own state transitions
  (`src/app-state.ts`), consent storage (`src/consent-state.ts`), workflow and
  export rendering (`src/app-renderer.ts`), event binding (`src/app-events.ts`),
  frame-analysis lifecycle and non-serializable controller handles
  (`src/analysis-lifecycle.ts`), keyframe canvas drawing
  (`src/keyframe-overlay-renderer.ts`), phase review rendering
  (`src/phase-review-renderer.ts`), remote-review-unavailable rendering
  (`src/remote-model-renderer.ts`), shared escaping/format helpers
  (`src/render-utils.ts`), and Swing Card export actions
  (`src/swing-card-actions.ts`).
- Verifier maintenance: `scripts/verify-safety-terms.js` and
  `scripts/verify-privacy-boundaries.js` were updated so the protected consent,
  local-first, and no-remote posture checks follow the extracted app-shell
  modules instead of assuming all runtime copy remains in `src/main.ts`.
- Unit coverage added for extracted behavior:
  `test/unit/consent-state.test.ts`, `test/unit/app-state.test.ts`,
  `test/unit/render-utils.test.ts`, `test/unit/app-renderer.test.ts`,
  `test/unit/app-events.test.ts`, `test/unit/analysis-lifecycle.test.ts`, and
  `test/unit/swing-card-actions.test.ts`.
- Audit coverage mapping:
  - Consent fail-closed/injectable storage coverage:
    `test/unit/consent-state.test.ts`.
  - Canonical analysis gate selector coverage:
    `test/unit/app-state.test.ts`.
  - Escaping and shared render-helper coverage:
    `test/unit/render-utils.test.ts`.
  - Protected selector/label rendering, processing-progress re-query, and
    missing-selector no-op coverage: `test/unit/app-renderer.test.ts`.
  - Render/rebind single-effect coverage: `test/unit/app-events.test.ts`.
  - Global handler/lifecycle/controller-handle and stop/idle composition
    coverage: `test/unit/analysis-lifecycle.test.ts`.
  - `observedSeekTimestampMs` export-exclusion coverage:
    `test/unit/swing-card-actions.test.ts`.
- Verification evidence recorded for implementation audit:
  - `npm run test:unit -- consent-state app-state render-utils app-renderer app-events analysis-lifecycle swing-card-actions`
    passed: 7 files, 15 tests.
  - `npm run test:unit` passed: 21 files, 176 tests.
  - `npm run test:smoke` required escalated local-server permissions because
    the managed sandbox blocked localhost binding with `listen EPERM:
    operation not permitted 127.0.0.1:4174`; the direct Playwright equivalent
    with the full desktop/mobile suite then passed: 32 tests.
  - `npm run build` passed.
  - `npm run docs:verify` passed.
  - `npm run compliance:verify` passed.
  - `npm run safety:verify` passed.
  - `npm run privacy:verify` passed.
  - `git diff --check` passed.
- Observability decision remains unchanged after implementation: SS-018 added
  no telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, persistent debug artifacts, or new operator diagnostics.
- Dependency/licensing decision: SS-018 added no framework, dependency,
  bundle, license-policy, notice, or SBOM changes; license/SBOM-specific
  checks were not required.
- Claude implementation audit prompt prepared:
  `docs/ss-018-claude-audit-prompt.md`.
- Notion moved to `4. Final Audit (Claude)` on 2026-07-05 after local
  verification completed.
- Claude first implementation-audit attempt returned no PASS/FAIL because the
  browser-chat paste included the audit prompt but omitted the complete branch
  diff or changed source contents. Codex accepted this as a valid handoff
  defect, not a runtime code defect.
- Self-contained source packet prepared on 2026-07-06:
  `docs/ss-018-claude-audit-source-packet.md`. Paste
  `docs/ss-018-claude-audit-prompt.md` followed by this source packet for the
  next Claude implementation audit attempt.
- Durable workflow lesson captured in
  `.agents/skills/swing-sync-story-delivery/SKILL.md`: browser-chat audit
  handoffs must create the source packet before marking the handoff ready; a
  prompt that only instructs the user to paste source later is insufficient.
- Claude full-source implementation audit returned FAIL with B9-B12:
  - B9: `analysisLifecycle.closeActive()` did not request a render after async
    close/idle completion, so capture could remain visually disabled after
    leaving active processing.
  - B10: renderer unit tests did not directly assert protected review, export,
    and remote-review-unavailable selectors/labels.
  - B11: `observedSeekTimestampMs` exclusion coverage used empty state and did
    not exercise populated sampled-frame output.
  - B12: safety/privacy verifier app-source scan lists covered only a subset
    of extracted runtime modules.
- Codex accepted B9-B12 as valid and patched the focused surfaces:
  `src/analysis-lifecycle.ts`, `test/unit/analysis-lifecycle.test.ts`,
  `test/unit/app-renderer.test.ts`, `test/unit/swing-card-actions.test.ts`,
  `scripts/verify-privacy-boundaries.js`, and
  `scripts/verify-safety-terms.js`.
- B9 fix: `closeActive()` now calls `requestRender()` after close, handle
  clearing, and `setProcessingState(..., "idle")`; lifecycle tests assert the
  render call and cover the stale capture render path where the analysis button
  becomes enabled after the async close promise settles.
- B10 fix: renderer tests now assert protected review selectors/labels
  (`data-confirm-phase-review`, `data-phase-index`, `data-open-export`, Swing
  phase assignments, View, Handedness, Horizontally mirrored, Select keyframe)
  and export/remote-review selectors/labels (`data-download-swing-card`,
  `data-print-swing-card`, `data-copy-swing-card-prompt`,
  `data-swing-card-status`, `data-swing-card-print-host`,
  `data-remote-model-send`, Downloadable summary, Remote model review
  unavailable, Remote model data disclosure).
- B11 fix: Swing Card action tests now build populated eight-sample
  `SampledFrameOutput` fixtures containing `observedSeekTimestampMs`, drive
  real phase-review assignments, and assert the field/value are absent from
  produced keyframes and `analysisPrompt`.
- B12 fix: safety and privacy verifiers now scan `listScannableFiles("src")`
  for app-source protected boundary checks. The safety verifier normalizes
  explicit `Do not provide ...` guardrail sentences before applying affirmative
  unsafe-claim regexes so broad scanning does not fail on negated safety
  constraints.
- Verification after B9-B12 fixes:
  - `npm run test:unit -- analysis-lifecycle app-renderer swing-card-actions`
    passed: 3 files, 9 tests.
  - `npm run test:unit` passed: 21 files, 179 tests.
  - `npm run safety:verify` passed.
  - `npm run privacy:verify` passed.
  - `npm run compliance:verify` passed.
  - `npm run build` passed.
  - `git diff --check` passed before the focused re-review prompt/context
    updates.
- Smoke verification after B9-B12 fixes is not complete: `npm run test:smoke`
  and direct Playwright retries hung before test output. Manual Vite preview
  startup succeeded, but Playwright still hung before browser/test output.
  Orphaned Playwright/Chrome processes from an earlier `@playwright/cli` daemon
  were found, terminated, and confirmed absent; a final clean
  `npm run test:smoke` retry still hung before Vite/browser child startup and
  was interrupted. No Playwright assertion failure or app smoke failure was
  observed in this pass.
- Focused Claude re-review prompt prepared:
  `docs/ss-018-claude-audit-rereview-prompt.md`. The earlier
  `docs/ss-018-claude-audit-prompt.md` and
  `docs/ss-018-claude-audit-source-packet.md` are superseded for paste use.
- Claude focused B9-B12 re-review closed B9, B10, and B11. B12 was
  substantially addressed but yielded B13: the safety verifier's temporary
  broad `src` scan needed either full-file evidence and false-positive
  accounting for SS-012 coaching files, or a narrower explicit app-shell scan
  list.
- Codex accepted B13 as valid and chose the lower-risk explicit-list fix. The
  safety verifier now scans only `src/main.ts`, `src/app-renderer.ts`,
  `src/app-events.ts`, `src/consent-state.ts`,
  `src/phase-review-renderer.ts`, `src/remote-model-renderer.ts`, and
  `src/swing-card-actions.ts` for app-source safety copy. The broad
  `listScannableFiles("src")` safety scan and negated-guardrail normalization
  workaround were removed because they are not needed for SS-018 scope.
- Node-version smoke issue resolved: the default shell was Node `v20.11.0`,
  while `.nvmrc` requires Node `22`. Running through `nvm use` selected
  Node `v22.22.3` and resolved the Playwright hang.
- Verification after B13/smoke follow-up under Node `v22.22.3`:
  - `/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && node --version && npm run test:smoke'`
    passed: 32 desktop/mobile smoke tests.
  - `/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && node --version && npm run test:unit && npm run build && npm run compliance:verify && git diff --check'`
    passed: unit suite 21 files / 179 tests, production build,
    compliance/fixture/pose-assets/safety/privacy/docs verification, and
    whitespace diff check.
- Short Claude follow-up prompt prepared:
  `docs/ss-018-claude-audit-b13-smoke-followup-prompt.md`. The prior focused
  re-review prompt is superseded for paste use.
- Claude B13/smoke follow-up returned PASS on 2026-07-19. Claude closed B13,
  accepted the Node 22 smoke evidence, and cleared SS-018 for PR preparation.
  Response record:
  `docs/ss-018-claude-audit-b13-smoke-followup-response.md`.
- Codex removed the no-longer-needed defensive negative-lookbehind regex from
  `scripts/verify-safety-terms.js` before PR preparation, restoring the
  original affirmative medical-advice claim pattern while keeping the explicit
  app-shell scan list. Follow-up verification under Node `v22.22.3` passed:
  `npm run safety:verify`, `npm run compliance:verify`, and
  `git diff --check`.
- Non-blocking future notes from Claude, not SS-018 gates: consider adding
  `render-utils.ts` and `analysis-lifecycle.ts` to safety verifier scope if
  they grow user-facing safety/status copy, and consider splitting
  `app-renderer.test.ts` branch coverage into per-module renderer tests.
- Branch commit pushed for PR #19:
  `a60a7ff388aaeda7a147562e533f2b8e141edfd7`.
- Pull Request created: https://github.com/ajason13/swing-sync/pull/19.
- Next owner: GitHub PR review/CI and merge readiness. SS-018 must not move to
  `5. Done` until PR merge, local `main` sync, Notion sync, and post-merge
  context updates are complete.

## SS-017 Coordination

SS-017 is privacy-, security-, deployment-, docs-claim-, compliance-, and
user-facing-copy-sensitive. It is a documentation and verification story to
capture the current frontend-only/no-backend production posture,
deployer-owned security-header requirements, and future backend architecture
review gates. Treat it as gated: Codex owns research/spec drafting under the
current routing, and Claude remains the independent QA planning and final
adversarial audit reviewer.

Acceptance criteria from Notion:

- Document the current no-backend production posture and what that means for
  auth, accounts, secrets, rate limiting, server logs, and data retention.
- Define the minimum production hosting requirements for security headers,
  including moving CSP from meta-only posture to deployer-owned HTTP headers
  where hosting supports them.
- Preserve the local-first rule: raw swing video is not uploaded by default
  and remote sharing requires separate explicit opt-in.
- Identify which future features would require a separate backend architecture
  review before implementation.
- Update README or deployment docs with clear local/dev versus
  production-hosting instructions.

Kickoff/spec state on 2026-07-03:

- Local `main` and `origin/main` were confirmed at
  `5ad008b1b2fb1695511dd7cafc24f4e43f2d9b72`.
- Worktree was clean before selection except for intentional untracked
  `docs/agent-guidance/*new-codex-session-prompt.md` files, which remain
  preserved.
- Notion page:
  https://app.notion.com/p/392834a0c8a68182a201f7b30fa45954
- Branch from current `main`: `ss-017-production-deployment-boundary`.
- Pull Request: none.
- Task Type: `Feature`.
- Notion task fields were verified before branching: Name
  `SS-017 Document production deployment, backend boundary, and security-header
  posture`, Branch `ss-017-production-deployment-boundary`, Handshake Status
  `0. Backlog`, Pull Request empty, Task Type `Feature`, and the acceptance
  criteria above.
- Notion was moved to `1. Spec Drafting (Gemini)` for board compatibility,
  with Codex noted as research/spec owner under current routing.
- Existing `SS-TC-017` was inspected and found to belong to SS-014 fixture
  policy coverage, not SS-017 deployment/security-header coverage.
- Dedicated test case `SS-TC-021` was created:
  https://app.notion.com/p/392834a0c8a68199983fc7bc1720ef2f
- `SS-TC-021` covers current frontend-only/no-backend posture,
  auth/accounts/secrets/rate-limiting/server-log/data-retention implications,
  deployer-owned HTTP security headers and CSP migration from meta-only
  posture, local-first raw-video/no-default-upload boundaries, future backend
  architecture review triggers, local/dev versus production-hosting
  instructions, and protected no-backend/no-remote-service/no-absolute-claim
  boundaries.
- Codex-owned research/disposition note:
  `docs/ss-017-research-disposition.md`.
- Candidate preimplementation spec:
  `docs/ss-017-preimplementation-spec.md`.
- Self-contained Claude QA planning handoff:
  `docs/ss-017-claude-qa-planning-prompt.md`.
- Source checks were recorded against `README.md`, `index.html`,
  `docs/privacy-architecture.md`, `docs/safety-terms.md`,
  `scripts/verify-docs-claims.js`, MDN security-header references, and W3C CSP
  meta-policy delivery limitations.
- Codex dispositions adopt a new `docs/deployment.md`, README link/update,
  `docs:verify` enforcement for deployment docs, explicit no-backend
  implications, deployer-owned production HTTP security headers, and exact
  local-first no-default-upload/explicit-remote-opt-in wording; revise security
  header wording to defense-in-depth language without guarantees; defer real
  host configuration and backend/reporting architecture to future reviewed
  stories; reject adding backend, auth, accounts, secrets, telemetry,
  analytics, remote logging, cloud storage, provider SDKs, model providers,
  remote sharing, CSP reporting endpoints, NEL, or absolute privacy/security/
  compliance/deletion/anonymity/medical/trademark-clearance claims.
- Observability decision: SS-017 is docs-only. Do not implement runtime
  logging, telemetry, analytics, remote logging, cloud diagnostics, CSP report
  collection, NEL, Reporting API endpoints, or persistent debug artifacts.
- Notion moved to `2. QA Planning (Claude)` after Codex completed the
  research/spec artifacts and Claude QA planning prompt.
- `git diff --check` PASS for the kickoff/spec package.
- Claude QA planning returned FAIL with five blockers:
  - B1: `docs/deployment.md` needed a required draft/pending-review
    disclaimer and canonical no-guarantee wording.
  - B2: the docs verifier needed a dedicated security-guarantee overclaim
    category.
  - B3: the verifier-extension mechanism needed to require the existing shared
    config path instead of bespoke deployment-doc logic.
  - B4: the verification plan needed to explicitly execute the new/updated
    docs-claim unit tests.
  - B5: the spec needed to prevent drift between deployment CSP prose and the
    actual meta CSP in `index.html`.
- Claude QA response record:
  `docs/ss-017-claude-qa-response.md`.
- Codex accepted B1-B5 as valid and revised
  `docs/ss-017-preimplementation-spec.md`: `docs/deployment.md` now requires
  a canonical draft-review banner and no-guarantee string; `docs:verify` must
  add a separate security-guarantee prohibited-claim category with negative
  fixtures; deployment docs must be registered through the existing
  `files`/`requiredStrings`/`links`/`bannedPatterns`/`negativeFixtures`
  verifier config path; `npm run test:unit -- docs-claims` and
  `git diff --stat` are required verification evidence; and the deployment doc
  must not duplicate the literal `index.html` CSP directive string unless the
  verifier reads `index.html` and proves consistency.
- The initial Claude QA planning prompt is superseded for paste use. Focused
  B1-B5 re-review prompt:
  `docs/ss-017-claude-qa-rereview-prompt.md`.
- Claude focused B1-B5 re-review returned FAIL with one new blocker after
  closing B1-B5:
  - B6: the cross-file CSP non-duplication check needed a named
    config-driven mechanism instead of leaving Codex to choose between
    declarative config and a bespoke one-off helper.
- Codex accepted B6 as valid and revised
  `docs/ss-017-preimplementation-spec.md`: `docs:verify` must add a named
  declarative `crossFileChecks` config array; the SS-017 entry must read
  injected `index.html`, extract the CSP meta `content` attribute, require a
  non-empty extracted value, and reject that exact string in
  `docs/deployment.md`; `verifyDocsClaims(fileReader)` remains the single
  injection point and must cover injected `index.html` in unit tests. The spec
  also now requires deterministic draft-review banner placement under
  `## Draft Review Status`, varied-case/punctuation security-overclaim tests,
  and an approved-doc regression proving the no-guarantee string does not trip
  the security-overclaim category.
- The focused B1-B5 re-review prompt is superseded for paste use. Focused
  B6-only re-review prompt:
  `docs/ss-017-claude-qa-b6-rereview-prompt.md`.
- Claude focused B6 re-review returned FAIL with one new blocker after closing
  B6 at the architecture level:
  - B7: CSP extraction from `index.html` needed robust, fail-closed behavior
    for the actual multiline tag format, attribute order/whitespace variation,
    and no-match cases.
- Codex accepted B7 as valid and revised
  `docs/ss-017-preimplementation-spec.md`: the `crossFileChecks` CSP
  extraction must tolerate `http-equiv` and `content` attributes in either
  order, arbitrary whitespace/newlines, and single- or double-quoted
  attributes; it must fail closed with a structured `docs:verify` error when
  no matching CSP meta tag is found, when `content` cannot be extracted, or
  when the extracted value is empty. Required tests now cover reordered/
  whitespace-varied fake `index.html`, missing CSP meta tag, empty `content`,
  and missing extractable `content` cases.
- The focused B6 re-review prompt is superseded for paste use. Focused
  B7-only re-review prompt:
  `docs/ss-017-claude-qa-b7-rereview-prompt.md`.
- Claude focused B7 re-review returned FAIL with one new blocker after closing
  B7:
  - B8: quote-tolerant CSP extraction needed matched-quote-pair behavior
    because the actual `index.html` CSP is a double-quoted attribute
    containing embedded single quotes such as `'self'`.
- Codex accepted B8 as valid and revised
  `docs/ss-017-preimplementation-spec.md`: CSP `content` extraction must use
  matched quote pairs, where the closing quote is the same character as the
  opening quote; double-quoted values containing embedded single quotes and
  single-quoted values containing embedded double quotes must extract the full
  value; duplication tests must use the full correctly extracted real-shaped
  CSP string; and exact extracted-string containment is the intentional
  automated scope for SS-017 while whitespace-normalized or semantic CSP
  equivalence remains manual review or future work.
- The focused B7 re-review prompt is superseded for paste use. Focused
  B8-only re-review prompt:
  `docs/ss-017-claude-qa-b8-rereview-prompt.md`.
- Claude focused B8 re-review returned PASS. B1-B8 are closed, no new blockers
  were introduced, and SS-017 was cleared for implementation.
- Notion moved to `3. In Development (ChatGPT)` after the B8 PASS.
- Codex implemented the approved docs/verifier/test scope:
  - `docs/deployment.md` documents current frontend-only/no-backend production
    posture, no-backend implications for auth/accounts/secrets/rate limiting/
    server logs/data retention, local development versus production hosting,
    deployer-owned HTTP security-header requirements, local-first data
    boundaries, backend architecture review gates, SS-017 non-goals, and
    verification commands.
  - `README.md` clarifies setup commands are local development commands and
    links `docs/deployment.md`.
  - `scripts/verify-docs-claims.js` registers `docs/deployment.md` in the
    shared file config, adds canonical deployment strings, README deployment
    link enforcement, required deployment terms, deterministic draft-banner
    placement, a dedicated security-guarantee prohibited-claim category,
    production-header overclaim checks, exact allowed units for approved
    protected-boundary lists, and declarative `crossFileChecks` for CSP
    non-duplication against `index.html`.
  - `test/unit/docs-claims.test.ts` covers approved docs success, missing
    deployment doc, missing heading/string/link/banner placement, security and
    production-header overclaims, fake injected CSP duplication, reordered/
    whitespace-varied CSP extraction, fail-closed missing/empty/unextractable
    CSP cases, and matched-quote extraction with embedded quotes.
- Runtime observability decision: SS-017 is docs/verifier-only. No runtime
  logging, telemetry, analytics, remote logging, cloud diagnostics, CSP report
  collection, NEL, Reporting API endpoints, or persistent debug artifacts were
  added.
- No backend, auth, accounts, secrets, server routes, hosted functions, cloud
  storage, provider SDKs, model providers, remote sharing, runtime behavior,
  dependencies, bundle policy, license policy, notice, or SBOM changes were
  added.
- Verification on 2026-07-03 under Node v22.22.3:
  - `npm run test:unit -- docs-claims` PASS (13 tests).
  - `npm run docs:verify` PASS (`docs:verify passed`).
  - `npm run safety:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run build` PASS.
  - `git diff --check` PASS.
  - `git diff --stat` captured tracked-file scope. Note: untracked new files,
    including `docs/deployment.md` and SS-017 planning/audit prompts, are not
    listed by `git diff --stat`; preserved untracked
    `docs/agent-guidance/*new-codex-session-prompt.md` files remain untouched.
- Final Claude implementation audit handoff:
  `docs/ss-017-claude-audit-prompt.md`.
- Notion moved to `4. Final Audit (Claude)`.
- Claude final implementation audit returned FAIL after confirming B1-B8 are
  correctly implemented. New audit-stage findings:
  - B9: `CONTEXT.md` diff was not included in the audit prompt and needed
    review or confirmation as internal tracking state.
  - B10: the new `terms` verifier mechanism needed explicit evidence/scope,
    and the production-header overclaim guard was too narrow.
  - B11: test evidence needed a named checklist mapped to B1-B8, not only a
    pass count.
- Claude audit response record:
  `docs/ss-017-claude-audit-response.md`.
- Codex accepted B9-B11 as valid and responded:
  - B9: `CONTEXT.md` is internal project memory required by AGENTS.md and the
    Swing Sync workflow, not public/user-facing documentation. The focused
    re-review prompt includes the full `CONTEXT.md` diff for audit.
  - B10: retained the `terms` verifier mechanism because required deployment
    term enforcement was part of the accepted spec; the spec now records it as
    a case-insensitive substring guard for the approved deployment doc, with
    future intentional rephrasing requiring verifier/test updates in the same
    reviewed change. Added a missing required deployment term regression and
    broadened production-header overclaim patterns to cover additional
    present-tense phrasings.
  - B11: captured verbose Vitest named test output and mapped every named test
    to B1-B8/B10 in the focused re-review prompt.
- Focused B9-B11 re-review prompt:
  `docs/ss-017-claude-rereview-prompt.md`.
- Verification after B9-B11 response under Node v22.22.3:
  - `npm run test:unit -- docs-claims -- --reporter verbose` PASS (14 tests).
  - `npx vitest run test/unit/docs-claims.test.ts --reporter verbose` PASS
    with full named test list.
  - `npm run docs:verify` PASS.
  - `npm run safety:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run build` PASS.
  - `git diff --check` PASS.
  - `git diff --stat` captured tracked-file scope.
- Claude focused B9-B11 re-review returned PASS. B1-B11 are closed, no
  remaining blockers or B1-B8 regressions were identified, and SS-017 is
  cleared for PR preparation.
- SS-017 PR created on 2026-07-04:
  https://github.com/ajason13/swing-sync/pull/18
- Branch pushed at commit `d503a6f11b50df36f2952a5eed04686f7bef64e3`
  (`SS-017 document deployment boundary`).
- Notion Pull Request property was updated with PR #18 and a PR-created
  status comment was added. SS-017 remains in `4. Final Audit (Claude)` until
  the PR is merged and post-merge Notion/CONTEXT synchronization is complete.
- PR #18 merged on 2026-07-04:
  https://github.com/ajason13/swing-sync/pull/18
- Merge commit: `b59842940b7188c7b325a98e2b857e19b6eeadc3`.
- GitHub `compliance` check passed before merge.
- Local `main` was fast-forwarded to the merged `origin/main` state.
- Notion SS-017 Pull Request property points to PR #18, a merge-complete
  comment was added, and Handshake Status was moved to `5. Done`.
- Non-blocking Claude recommendations after sign-off: consider adding
  individual coverage for all production-header-overclaim phrases and future
  word-boundary anchoring for `terms`/`bannedPatterns`; neither is required
  for SS-017 sign-off.

SS-017 is complete. Next owner: Codex/user task selection from the remaining
backlog. Default next candidate is SS-018 unless the user selects a different
story.

## Delivery Learnings

SS-017 feedback-retention note, added 2026-07-04:

- Sensitive docs/verifier stories should specify verifier architecture before
  implementation. Name the shared config registration points, fixture paths,
  and injected file-reader behavior instead of leaving Codex to invent a
  bespoke check path during implementation.
- Cross-file documentation claims should prefer one canonical source plus an
  automated non-duplication check. SS-017 used `index.html` as the CSP source
  and verified that `docs/deployment.md` does not copy the literal policy.
- Parser or extractor logic in verification scripts needs adversarial tests
  for formatting variation, missing inputs, empty values, embedded delimiters,
  and fail-closed behavior. Named verbose test output should be captured when
  the audit depends on exact scenario coverage.
- Claude audit prompts for sensitive work must include every changed tracked
  file or explicitly justify omissions. Coordination files such as
  `CONTEXT.md` can contain scope-sensitive claims and should be included when
  they changed.
- New verifier helpers, banned-claim categories, or checklist mechanisms added
  during implementation should be added to the reviewed spec and backed by
  explicit tests, or deferred. Unreviewed helpful mechanisms create audit
  friction even when they are technically correct.
- PR creation, merge, and post-merge context synchronization are separate
  state transitions. Record the PR URL before merge, then record the merge
  commit, Notion `5. Done`, and post-merge `main` state after merge.
- Recommended self-improvement loop: classify feedback, fix the spec or tests
  before code when acceptance changes, implement the focused change, rerun
  relevant verification, get focused re-review for sensitive work, and capture
  the repeatable lesson in durable guidance instead of relying on chat memory.

## Current Backlog Snapshot

Created from the post-SS-016 manual readiness review on 2026-07-03. SS-017 is
Done via PR #18. The remaining items are in Notion with `Handshake Status`
`0. Backlog`, empty Pull Request, and the listed branch names:

- `SS-018 Refactor frontend app shell into maintainable UI/state modules`
  - Notion: https://app.notion.com/p/392834a0c8a68115b23bda9510e07958
  - Branch: `ss-018-frontend-architecture`
  - Task Type: `Refactor`
  - Scope: split `src/main.ts` orchestration pressure while preserving current
    consent, local processing, phase review, Swing Card, and remote-unavailable
    behavior.
- `SS-019 Perform accessibility and responsive design hardening`
  - Notion: https://app.notion.com/p/392834a0c8a6814db2f6ea28ae195f75
  - Branch: `ss-019-accessibility-design-hardening`
  - Task Type: `Feature`
  - Scope: keyboard, focus, screen-reader semantics, contrast, mobile layout,
    long text, and error-state review/hardening.
- `SS-020 Prepare human legal/privacy/safety release review gate`
  - Notion: https://app.notion.com/p/392834a0c8a6818b9f8cecd0debacbf6
  - Branch: `ss-020-release-review-gate`
  - Task Type: `Research`
  - Scope: human review package for public safety, privacy, medical-scope,
    non-affiliation, limitation, and SS-002 legal-review gates.
- `SS-021 Add clear-local-data UX and storage lifecycle controls`
  - Notion: https://app.notion.com/p/392834a0c8a6812a9e4af6cd4eeb8358
  - Branch: `ss-021-clear-local-data`
  - Task Type: `Feature`
  - Scope: clear Swing Sync app-level local state with accurate browser/device
    storage-limit copy and fail-closed storage-error handling.
- `SS-022 Define real-world pose, phase, and metric accuracy validation
  protocol`
  - Notion: https://app.notion.com/p/392834a0c8a681f798eafe66945041d6
  - Branch: `ss-022-accuracy-validation-protocol`
  - Task Type: `Research`
  - Scope: validation protocol and evidence language for real-world pose,
    phase, and metric review without overclaiming fixture coverage.

## SS-016 Coordination

SS-016 is safety-, privacy-, legal/trademark-, medical-scope-, compliance-,
licensing/SBOM-, docs-claim-, and user-facing-copy-sensitive. It is a
documentation-only story to publish README, limitations, and contributor
guidance while preserving Swing Sync's local-first, no-default-upload posture.
Treat it as gated: Codex owns research/spec drafting under the current
LLM-team routing update, and Claude remains the independent QA planning and
final adversarial audit reviewer.

Acceptance criteria from Notion:

- README explains purpose, local-first design, safety limits, and setup.
- Limitations page covers pose accuracy, camera setup, and non-medical scope.
- Contributor guide explains task workflow, testing, licenses, and SBOM
  expectations.
- Trademark/non-affiliation disclaimer is visible.

Kickoff/spec state on 2026-07-01:

- Local `main` and `origin/main` were confirmed at
  `b03efbb46578c19119b4b7d286ebc8be97d6749f` after `git fetch origin`.
- Worktree was clean before selection except for intentional untracked
  `docs/agent-guidance/*new-codex-session-prompt.md` files, which remain
  preserved.
- Notion page:
  https://app.notion.com/p/375834a0c8a68152bee5f2842be6c6e0
- Branch from current `main`: `ss-016-docs`.
- Pull Request: none.
- Task Type: `Feature`.
- Notion task fields were verified before branching: Name
  `SS-016 Publish README, limitations, and contributor guide`, Branch
  `ss-016-docs`, Handshake Status `0. Backlog`, Pull Request empty, Task Type
  `Feature`, and the acceptance criteria above.
- Notion was moved to `1. Spec Drafting (Gemini)` for board compatibility,
  with Codex noted as research/spec owner under current routing.
- Existing `SS-TC-016` was inspected and found to belong to SS-012 coaching
  prompt/schema coverage, not SS-016 docs coverage.
- Dedicated test case `SS-TC-020` was created:
  https://app.notion.com/p/390834a0c8a6810e85ccd2ffeff645bb
- `SS-TC-020` covers README purpose/local-first/setup/safety limits, limitations
  page pose/camera/non-medical scope, contributor workflow/testing/license/SBOM
  expectations, visible trademark/non-affiliation disclaimer, and protected
  no-runtime-change/no-telemetry/no-remote-sharing/no-new-dependency/no-unsafe-
  claim boundaries.
- Codex-owned research/disposition note:
  `docs/ss-016-research-disposition.md`.
- Candidate preimplementation spec:
  `docs/ss-016-preimplementation-spec.md`.
- Self-contained Claude QA planning handoff:
  `docs/ss-016-claude-qa-planning-prompt.md`.
- Source checks were recorded against `README.md`,
  `docs/privacy-architecture.md`, `docs/safety-terms.md`,
  `docs/licensing.md`, `docs/models-licensing.md`,
  `docs/fixture-policy.md`, `package.json`, and
  `.github/pull_request_template.md`.
- Codex dispositions adopt current-MVP README updates, local-first/no-default-
  upload wording, a limitations page, contributor workflow/testing/license/SBOM
  documentation, and visible non-affiliation language; revise unqualified "AI
  coach" wording into educational/local-first copy; reject absolute privacy,
  deletion, anonymity, safety, medical, professional-coaching, correctness,
  legal, compliance, or trademark-clearance claims; reject telemetry, hosted
  analytics, remote logging, cloud diagnostics, cloud storage, hidden
  identifiers, new dependencies, camera capture, SDK/provider/model assets,
  workers, and remote-sharing changes for SS-016.
- Observability decision: SS-016 is docs-only. Do not implement new runtime
  logging. Document the existing debugging model only: local test output,
  browser devtools, sanitized UI status/error codes, and CI/browser failure
  artifacts. Do not claim hidden logging, remote diagnostics, telemetry, or
  persistent debug artifacts exist.
- Notion moved to `2. QA Planning (Claude)` after Codex completed the
  research/spec artifacts and Claude QA planning prompt.
- Claude QA planning returned FAIL with five blockers:
  - B1: no draft copy existed for required sections except the trademark
    paragraph.
  - B2: no structural/automated prohibited-claim enforcement existed; manual
    review alone was fail-open for the sensitive docs story.
  - B3: capability-summary wording risked overclaiming active AI coaching
    because SS-013's remote model adapter remains an inactive scaffold with an
    empty production provider registry.
  - B4: contributor guide placement was unresolved.
  - B5: `SS-TC-020` was a single opaque test case instead of decomposed
    required-disclosure and prohibited-claim-category coverage.
- Claude QA response record:
  `docs/ss-016-claude-qa-response.md`.
- Codex accepted B1-B5 as valid and revised
  `docs/ss-016-preimplementation-spec.md` to include exact draft README,
  `docs/limitations.md`, and root-level `CONTRIBUTING.md` prose; lock the
  contributor path to root `CONTRIBUTING.md`; require dependency-free
  `scripts/verify-docs-claims.js`; add `npm run docs:verify`; wire
  `docs:verify` into `compliance:verify`; enforce required headings, canonical
  required strings, draft safety/privacy banners, required links, and
  prohibited-claim categories; and decompose `SS-TC-020` sub-cases.
- Codex revised `docs/ss-016-research-disposition.md` to reject manual-only
  claim enforcement, unresolved contributor-guide placement, a single opaque
  docs test case, and active-remote-AI-coach wording.
- `SS-TC-020` was revised in Notion with named sub-cases for required README,
  limitations, and `CONTRIBUTING.md` sections; canonical trademark,
  local-first, non-medical, and draft-review strings; negative
  privacy/anonymity, deletion/security, medical/injury, correctness/performance,
  legal/compliance/trademark-clearance, telemetry/analytics, and absolute
  remote-boundary claim checks; and `docs:verify` compliance wiring.
- The initial Claude QA planning prompt is superseded for paste use. Focused
  B1-B5 re-review prompt:
  `docs/ss-016-claude-qa-rereview-prompt.md`.
- Claude focused B1-B5 re-review returned FAIL. B1, B3, and B4 are closed; B5
  is substantially closed but needed one addition; B2 remains blocking as B6.
  New blockers:
  - B6: the proposed `docs:verify` banned-pattern list would false-positive
    against three draft sentences (`anonymous`, `diagnosis`, and
    `hidden identifiers`) and the safety/privacy link rule was ambiguous.
  - B7: `SS-TC-020` needed a golden regression sub-case proving
    `docs:verify` exits zero against exact final approved public docs.
- Codex accepted B6-B7 as valid and revised
  `docs/ss-016-preimplementation-spec.md`: the three colliding draft sentences
  were reworded instead of adding bespoke exceptions; safety/privacy links are
  now required in all three public docs with explicit path forms for README,
  limitations, and `CONTRIBUTING.md`; and `SS-TC-020` now requires a golden
  `docs:verify` zero-exit regression against exact final approved README,
  limitations, and `CONTRIBUTING.md` content.
- `docs/ss-016-research-disposition.md` and
  `docs/ss-016-claude-qa-response.md` were updated with the B6-B7 disposition.
- The focused B1-B5 re-review prompt is superseded for paste use. Second
  focused B6-B7 re-review prompt:
  `docs/ss-016-claude-qa-second-rereview-prompt.md`.
- B6/B7 planning verification on 2026-07-01:
  - Targeted text check confirms the old B6 collision phrases are absent from
    `docs/ss-016-preimplementation-spec.md`. They remain only in the second
    re-review prompt as quoted previous-draft evidence.
  - Manual dry-run of the complete banned-pattern list against the exact
    revised final draft public docs text found zero unresolved matches. Allowed
    matches are limited to the canonical non-medical and draft-review exception
    sentences plus the future checker's own banned-term fixture strings.
  - `git diff --check` PASS.
- Claude second focused B6-B7 re-review returned FAIL with one new blocker:
  - B8: the `docs/limitations.md` intro paragraph still contained `diagnose`,
    colliding with the medical/injury banned-term list outside the canonical
    non-medical exception.
- Codex accepted B8 as valid and revised
  `docs/ss-016-preimplementation-spec.md` to trim the limitations intro instead
  of adding another exception or near-miss phrase. The revised intro says the
  page supports practice notes and visual inspection, then points to the
  detailed educational, safety, privacy, and fixture limits below.
- `docs/ss-016-research-disposition.md` and
  `docs/ss-016-claude-qa-response.md` were updated with the B8 disposition.
- The second focused B6-B7 re-review prompt is superseded for paste use. Final
  focused B8 re-review prompt:
  `docs/ss-016-claude-qa-b8-rereview-prompt.md`.
- B8 planning verification on 2026-07-01:
  - A full extracted-draft dry-run of the complete banned-pattern list against
    the exact revised final draft public docs text reported zero unresolved
    matches.
  - Allowed matches are limited to the exact canonical non-medical exception
    sentence variants, the exact canonical draft-review exception sentence
    variants, and future checker fixture strings.
  - `git diff --check` PASS.
- Claude focused B8 re-review returned PASS, closed B8, and cleared SS-016 for
  implementation.
- Codex implemented the approved docs-only scope:
  - `README.md` now explains current purpose, local-first design, setup,
    verification, safety/non-medical boundaries, current local capabilities,
    inactive SS-013 remote model scaffold state, documentation links, license,
    and visible trademark/non-affiliation disclaimer.
  - `docs/limitations.md` covers pose and metric limits, camera setup,
    educational/non-medical scope, privacy/export limits, remote-review limits,
    fixture/test limits, and draft-review status.
  - Root `CONTRIBUTING.md` covers environment setup, task workflow, Notion and
    `CONTEXT.md` sync, sensitive-story gates, Claude audit/re-review,
    testing, licensing/reference/fixture/model/SBOM expectations, safety/privacy
    claim boundaries, observability wording, and PR requirements.
  - `scripts/verify-docs-claims.js` enforces required docs, headings, canonical
    strings, safety/privacy links, safety/privacy draft banners, prohibited
    claim patterns, and negative fixture coverage.
  - `package.json` adds `npm run docs:verify` and wires it into
    `npm run compliance:verify`.
- Runtime observability decision: SS-016 is docs-only. No runtime
  observability, telemetry, remote logging, analytics, cloud diagnostics,
  persistent debug artifacts, or console logging was added. Public docs describe
  only existing local test output, browser devtools, sanitized UI status/error
  codes, and CI/browser failure artifacts.
- No runtime behavior, dependencies, SDK/provider/model assets, workers, camera
  capture, service workers, API routes, secrets, raw media fixtures, cloud
  storage, telemetry, hosted analytics, remote logging, cloud diagnostics,
  hidden identifiers, or remote-sharing behavior were added.
- Implementation verification on 2026-07-01:
  - `npm run docs:verify` PASS (`docs:verify passed`).
  - `npm run safety:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `git diff --check` PASS.
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS, including `docs:verify` through the
    compliance path.
- Final Claude implementation audit handoff:
  `docs/ss-016-claude-audit-prompt.md`.
- Notion moved to `4. Final Audit (Claude)`.
- Claude final implementation audit returned FAIL after confirming B1-B8 are
  correctly implemented. New blocker:
  - B9: `docs:verify` lacked negative-path test evidence for missing required
    public docs, missing headings, missing canonical strings, missing required
    links, and missing draft banners.
- Codex accepted B9 as valid and responded:
  - `scripts/verify-docs-claims.js` now exports pure `verifyDocsClaims` for
    injected file-reader tests while preserving CLI disk-read and exit-code
    behavior.
  - Missing safety/privacy draft banners now return structured errors instead
    of relying on unhandled `readFileSync` exceptions.
  - `test/unit/docs-claims.test.ts` covers current approved docs success,
    missing required public file, missing required heading, missing canonical
    string, missing required link, and missing draft banner negative paths.
- B9 verification on 2026-07-01:
  - `npm run test:unit -- docs-claims` PASS (6 tests).
  - `npm run docs:verify` PASS.
  - `npm run test:unit` PASS (153 tests across 14 test files).
  - `npm run safety:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `git diff --check` PASS.
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS, including `docs:verify`.
- The initial final audit prompt is superseded for paste use. Focused B9
  re-review prompt:
  `docs/ss-016-claude-rereview-prompt.md`.
- Claude focused B9 implementation re-review returned PASS. B1-B9 are closed,
  and SS-016 is cleared for PR preparation.
- Claude confirmed the `verifyDocsClaims(fileReader)` refactor preserves CLI
  behavior, the negative-path tests genuinely exercise the missing file,
  heading, canonical string, required link, and draft-banner branches, and no
  new protected-boundary regressions were introduced.
- Pull Request opened:
  https://github.com/ajason13/swing-sync/pull/17.
- Branch commit pushed for PR #17:
  `b5f7ea3f06674ae67170b7969afc909136da069f`.
- Notion Pull Request property was updated with PR #17, and a PR-created
  comment was added.
- PR body records that `npm run license:audit` and `npm run sbom:generate`
  were not run because SS-016 has no dependency, bundle, license-policy,
  notice, or SBOM changes.
- GitHub PR #17 merged on 2026-07-02 UTC with merge commit
  `60bda6967d34cdf619c3b3e58ba02e64497645f3`.
- Local `main` was fast-forwarded to `origin/main` at
  `60bda6967d34cdf619c3b3e58ba02e64497645f3`.
- Notion moved to `5. Done` after merge, with a merge-state comment recording
  PR #17, the merge timestamp, the merge commit, and the local `main`
  fast-forward.
- Post-merge Notion query found no visible remaining non-Done tasks.

Next owner: Codex/user to create or select the next backlog task. No active
task is selected in `CONTEXT.md`; start from synchronized `main` and inspect
the Swing Sync Notion task database/board before any next implementation.

## SS-013 Coordination

SS-013 is safety-, privacy-, AI-coaching-, model-provider-, compliance-,
dependency/licensing-, user-facing-copy-, runtime-, and remote-API-sensitive.
It defines an optional model API adapter behind explicit remote-sharing consent
while preserving the local-first MVP and manual Swing Card workflow. Treat it
as gated: Codex owns research/spec drafting under the 2026-06-26 LLM-team
routing update, and Claude remains the independent QA planning and final
adversarial audit reviewer.

Acceptance criteria from Notion:

- API mode is disabled until explicit consent.
- Provider adapter is model-neutral.
- User sees what data will be sent.
- Manual Swing Card workflow remains available without keys or server config.

Kickoff/spec state on 2026-06-30:

- Local `main`, `origin/main`, and branch base were confirmed at
  `f5836311bdb1f871b965bda24ad55322b89817eb` after `git fetch origin`.
- Worktree was clean before selection except for intentional untracked
  `docs/agent-guidance/*new-codex-session-prompt.md` files, which remain
  preserved.
- Notion page:
  https://app.notion.com/p/375834a0c8a6816491e9d73a30dbf3d2
- Branch from current `main`: `ss-013-model-adapter`.
- Pull Request: https://github.com/ajason13/swing-sync/pull/16.
- Task Type: `Feature`.
- User confirmed SS-013 over SS-016 after both backlog candidates were verified
  in Notion and ordering was ambiguous.
- Notion was moved to `1. Spec Drafting (Gemini)` for board compatibility,
  with Codex noted as research/spec owner under the 2026-06-26 routing update.
- Dedicated test case `SS-TC-019` was created:
  https://app.notion.com/p/38f834a0c8a6812db4a5e98c2b01fd4d
- `SS-TC-019` covers API mode disabled until explicit remote-sharing consent,
  model-neutral adapter contract, pre-send data-class/destination disclosure,
  no raw video/frame pixel send by default, revocation/missing-configuration
  fail-closed behavior, manual Swing Card workflow without keys/server config/
  network, provider terms/licensing/privacy review, and protected no-telemetry/
  no-remote-logging/no-cloud-storage/no-unapproved-SDK/no-unsafe-claim
  boundaries.
- Codex-owned research/disposition note:
  `docs/ss-013-research-disposition.md`.
- Candidate preimplementation spec:
  `docs/ss-013-preimplementation-spec.md`.
- Self-contained Claude QA planning handoff:
  `docs/ss-013-claude-qa-planning-prompt.md`.
- Source checks were recorded for OpenAI enterprise/API privacy handling,
  OpenAI consumer privacy/business-data boundary, Anthropic commercial terms,
  Anthropic privacy/retention materials, Gemini API unpaid-service data review
  warning, MDN Fetch API behavior, and MDN AbortController behavior, all
  checked on 2026-06-30.
- Codex dispositions defer real provider integration, reject provider SDKs/new
  dependencies by default, reject raw video/frame-pixel send, reject generic
  provider data-use equivalence, adopt provider-neutral adapter design, adopt
  fail-closed remote consent gating, adopt exact outbound data-class
  disclosure, and preserve manual Swing Card export/copy as the fallback.
- Notion moved to `2. QA Planning (Claude)`.
- Claude QA planning returned FAIL with eight blockers:
  - B1 consent persistence was conditional instead of deterministic.
  - B2 reviewed-provider gating lacked an operational definition and zero-
    provider default.
  - B3 fail-closed checks lacked a single canonical enforcement point.
  - B4 per-error-code negative tests were not required.
  - B5 `UNSAFE_RESPONSE_CONTENT` and safe model-output rendering were
    undefined.
  - B6 `blockedDataClasses` was typed as an open `string[]`.
  - B7 mid-flight consent revocation was unaddressed.
  - B8 prohibited prompt checking had no named validation mechanism.
- Claude QA response record:
  `docs/ss-013-claude-qa-response.md`.
- Codex accepted B1-B8 as valid and revised
  `docs/ss-013-preimplementation-spec.md` to require in-memory-only remote
  consent with default-off reload behavior, no remote-consent storage key, an
  empty production provider registry and unavailable remote UI by default, a
  shared `canSendRemoteRequest` guard for UI and adapter send paths, a closed
  canonical remote-data-class union with typed blocked data classes, text-only
  model-output rendering, concrete `UNSAFE_RESPONSE_CONTENT` criteria,
  mid-flight revocation via `AbortController.abort()`, a named runtime
  `validateRemotePromptPreview`-style validator, explicit
  `observedSeekTimestampMs` exclusion, and required negative coverage for every
  `ModelAdapterErrorCode`.
- Codex revised `docs/ss-013-research-disposition.md` to explicitly reject
  shipping any `ModelProviderDescriptor` entries in production for SS-013.
- `SS-TC-019` was revised in Notion with itemized sub-cases for every adapter
  error code, empty production provider registry, typed blocked data classes,
  prompt-preview validation, mid-flight abort-on-revoke, text-only output
  rendering, and manual workflow regression coverage.
- The initial Claude QA planning prompt is superseded for paste use. Focused
  B1-B8 re-review prompt:
  `docs/ss-013-claude-qa-rereview-prompt.md`.
- Claude focused QA re-review returned PASS for implementation start and
  closed B1-B8. Claude noted two non-blocking recommendations: clarify
  `PROVIDER_NOT_REVIEWED` versus `PROVIDER_NOT_CONFIGURED`, and add an
  outbound prompt size bound.
- Focused re-review response record:
  `docs/ss-013-claude-qa-rereview-response.md`.
- Codex folded both non-blocking recommendations into the spec and
  implementation before coding: `PROVIDER_NOT_REVIEWED` means no descriptor is
  present in the reviewed provider registry; `PROVIDER_NOT_CONFIGURED` means a
  reviewed descriptor exists but runtime send configuration is absent; and
  `UNSAFE_REQUEST_CONTENT` plus `maxRemotePromptCharacters` cover outbound
  prompt size/content failures.
- Notion moved to `3. In Development (ChatGPT)`.
- Codex implemented SS-013 within the approved empty-registry/fail-closed
  scope:
  - `src/model-adapter-contract.ts` defines the provider-neutral data classes,
    provider descriptor, request preview, adapter request/result, and typed
    blocked outbound data class contract.
  - `src/model-consent.ts` ships an empty production `reviewedModelProviders`
    registry, shared `canSendRemoteRequest` guard, prompt/output validators,
    text-only model-output rendering helper, guarded adapter factory, and
    abort-on-consent-revoke helper.
  - `test/unit/model-consent.test.ts` covers empty registry, derived blocked
    data classes, every adapter error code including `UNSAFE_REQUEST_CONTENT`,
    prompt validator pattern families, unsafe output validation, transport
    failure/cancellation, and mid-flight abort-on-revoke.
  - `src/main.ts` and `src/styles.css` add a passive Remote model review panel
    to the Swing Card export surface. Because the production provider registry
    is empty, the panel remains unavailable/configuration-required and does not
    add a network-capable path.
  - `test/smoke/app.spec.ts` extends the Swing Card export regression to
    assert the unavailable remote panel, canonical send/blocked data-class
    disclosures, disabled remote-review button, absence of extra local storage,
    and unchanged manual Download PNG / Print / Copy prompt workflow.
- Runtime source files changed, but runtime observability remains intentionally
  limited to local UI status/error states. No telemetry, remote logging,
  analytics, cloud diagnostics, provider SDKs, provider descriptors, API routes,
  keys, remote calls, new workers, new dependencies, raw video/frame upload,
  camera capture, cloud storage, or model/provider assets were added.
- Verification on 2026-06-30 under Node v22.22.3:
  - `npm run test:unit` PASS (145 tests).
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `npm run safety:verify` PASS.
  - `git diff --check` PASS.
  - `npm run test:smoke -- --project=desktop-chromium -g "downloads a local Swing Card PNG"` PASS (1 test).
  - `npm run test:smoke` PASS (32 tests across desktop Chromium and mobile
    Chromium).
  - After the remote data-class label cleanup, `npm run build` PASS,
    `git diff --check` PASS, and
    `npm run test:smoke -- --project=desktop-chromium -g "downloads a local Swing Card PNG"` PASS (1 test).
- Browser smoke attempts under Node v24.15.0 were interrupted after hanging
  with no output, matching the known Node-version issue already recorded for
  SS-011/SS-015. Required browser verification was rerun under Node v22.22.3
  from `.nvmrc`.
- Final Claude implementation audit handoff:
  `docs/ss-013-claude-audit-prompt.md`.
- Notion moved to `4. Final Audit (Claude)`.
- Claude final implementation audit returned FAIL pending additional evidence,
  while confirming the structural implementation is correct and prior B1-B8 are
  closed. New blockers:
  - B9: audit prompt excerpt omitted full test evidence for
    `REMOTE_REQUEST_FAILED` and `UNSAFE_RESPONSE_CONTENT`, including text-only
    rendering coverage.
  - B10: `REMOTE_REQUEST_CANCELLED` evidence covered the standalone helper but
    not the mid-flight `send()` integration path.
  - B11: Claude needed confirmation that `SS-TC-019` accepts
    `UNSAFE_REQUEST_CONTENT` as the eighth adapter error code.
- Claude audit response record:
  `docs/ss-013-claude-audit-response.md`.
- Codex response:
  - `SS-TC-019` already included `UNSAFE_REQUEST_CONTENT` as a required
    negative sub-case and provider error-code semantics; the test-case current
    gate text was updated to final-audit state.
  - `test/unit/model-consent.test.ts` now includes a mid-flight send-path
    cancellation test where consent revocation aborts the request signal and
    `send()` returns `REMOTE_REQUEST_CANCELLED`.
  - `test/unit/model-consent.test.ts` now includes explicit
    `renderModelOutputText` text-only assignment coverage.
  - `src/model-adapter-contract.ts` now derives runtime blocked outbound data
    classes from `modelOutboundDataClasses`, matching the type-level canonical
    source.
  - The initial final audit prompt is superseded for paste use. Focused B9-B11
    re-review prompt:
    `docs/ss-013-claude-rereview-prompt.md`.
- Verification after B9-B11 response under Node v22.22.3:
  - `npm run test:unit -- model-consent` PASS (25 tests).
  - `npm run build` PASS.
- Claude focused implementation re-review returned PASS for SS-013 PR
  preparation and closed B9-B11. No new blocking findings were introduced.
- Focused implementation re-review response record:
  `docs/ss-013-claude-rereview-response.md`.
- Claude noted non-blocking follow-ups: post-transport
  `abortSignal.aborted` branch is not explicitly tested; full unit suite and
  `git diff --check` should be re-confirmed at PR preparation close; and
  `manualContentAvailable: false` remains bundled under
  `PROVIDER_NOT_CONFIGURED` for SS-013.
- PR-prep verification on 2026-07-01 under Node v22.22.3:
  - `npm run test:unit` PASS (147 tests).
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `npm run safety:verify` PASS.
  - `git diff --check` PASS.
  - `npm run license:audit` PASS.
  - `npm run sbom:generate` PASS. The generated SBOM changed only timestamp
    and serial metadata and was restored because SS-013 has no dependency
    changes.
- Pull Request opened:
  https://github.com/ajason13/swing-sync/pull/16.
- Branch commit pushed for PR #16:
  `bfc38c6f632f1caf13deace92add51680829a20e`.
- Notion Pull Request property was updated with PR #16, and a PR-created
  comment was added.
- Observability decision for the candidate spec: runtime observability should
  remain intentionally limited to stable local UI status/error codes. Do not add
  telemetry, remote logging, analytics, cloud diagnostics, or console logs
  containing prompts, outputs, metrics, landmarks, media details, provider keys,
  or hidden identifiers.

- GitHub PR #16 compliance check passed, and PR #16 merged on 2026-07-01 UTC
  with merge commit `a53203788e2cd3f65c25e95a271944b4fb677653`.
- Notion moved to `5. Done` after merge, with a merge-state comment recording
  PR #16 and merge commit `a53203788e2cd3f65c25e95a271944b4fb677653`.
- Observability decision: runtime observability remains intentionally limited
  to local UI status/error states. No telemetry, remote logging, analytics,
  cloud diagnostics, provider SDKs, provider descriptors, API routes, keys,
  remote calls, new workers, new dependencies, raw video/frame upload, camera
  capture, cloud storage, or model/provider assets were added.

Next owner: Codex/user to select the next backlog task. No active task is
selected in `CONTEXT.md`. Start from synchronized `main`, inspect the Swing
Sync Notion task database/board, and ask the user to confirm the next task if
ordering is ambiguous. Current visible remaining non-Done backlog task is
`SS-016 Publish README, limitations, and contributor guide`.

## SS-015 Coordination

SS-015 is privacy-, browser-automation-, CI-, export-, and user-facing-copy
sensitive. It adds browser regression and CI coverage for the MVP local-first
flow. Treat it as gated: Codex owns research/spec drafting under the
2026-06-26 LLM-team routing update, and Claude remains the independent QA
planning and final adversarial audit reviewer.

Acceptance criteria from Notion:

- Test upload/capture placeholder, processing, review, Swing Card export,
  consent gate, and mobile layout.
- Include no-network privacy regression where feasible.
- Capture artifacts for failed runs.
- Tests run in CI.

Kickoff/spec state on 2026-06-29:

- Local `main`, `origin/main`, and `HEAD` were confirmed at
  `f8b9cd2724c84ffea2c3ba77ec6d1d782111feb0`, with a clean tracked worktree
  and only intentional untracked `docs/agent-guidance/*new-codex-session-prompt.md`
  files present.
- Notion page:
  https://app.notion.com/p/375834a0c8a6813fba47ed015c899a72
- Branch from current `main`: `ss-015-browser-tests`.
- Pull Request: https://github.com/ajason13/swing-sync/pull/15.
- Task Type: `Feature`.
- Notion moved to `1. Spec Drafting (Gemini)` for board compatibility, with
  Codex noted as research/spec owner.
- Dedicated test case `SS-TC-018` was created:
  https://app.notion.com/p/38e834a0c8a681c3a146fae2d8c332cc
- `SS-TC-018` covers upload/capture placeholder, processing, review, Swing
  Card export, consent fail-closed behavior, mobile layout, no-network privacy
  regression, failed-run artifacts, CI execution, and protected no-telemetry/
  no-remote-sharing/no-new-dependency/no-unapproved-fixture boundaries.
- Codex-owned research/disposition note:
  `docs/ss-015-research-disposition.md`.
- Candidate preimplementation spec:
  `docs/ss-015-preimplementation-spec.md`.
- Self-contained Claude QA planning handoff:
  `docs/ss-015-claude-qa-planning-prompt.md`.
- Source checks were recorded for Playwright configuration/artifact output,
  Playwright network routing/monitoring, Playwright CI guidance, and GitHub
  Actions artifact retention.
- Claude QA planning returned FAIL with seven blockers: no-network hooks can
  miss initial navigation/model-load requests; capture placeholder lacks
  explicit test coverage; CI/browser-artifact requirements were too soft;
  console sensitive-output assertions were incomplete and omitted hidden IDs;
  canvas nonblank rendering was not proven by pixel sampling; mobile
  overlap/truncation coverage was promised but underspecified; and Copy prompt
  usability/content-minimization needed source-backed test requirements.
- Claude QA response record:
  `docs/ss-015-claude-qa-response.md`.
- Codex accepted B1-B7 as valid and revised
  `docs/ss-015-preimplementation-spec.md` with mandatory context-level
  network hooks before navigation, explicit capture-placeholder and
  no-camera-permission coverage, blocking CI/no-soft-fail/browser-install/
  failure-artifact requirements, shared sensitive-output denylist coverage,
  pixel-content canvas nonblank checks, mobile overlap/clipping assertions, and
  clipboard Copy prompt usability plus content-minimization checks.
- The original Claude QA planning prompt is superseded for paste use. Focused
  B1-B7 re-review prompt:
  `docs/ss-015-claude-qa-rereview-prompt.md`.
- Claude focused B1-B7 re-review returned PASS and cleared SS-015 for
  implementation start.
- Claude QA re-review response record:
  `docs/ss-015-claude-qa-rereview-response.md`.
- Notion moved to `3. In Development (ChatGPT)`.
- Codex implemented SS-015 within the approved test/CI-only scope:
  `test/smoke/app.spec.ts` now includes early context-level request recording
  and route blocking before `beforeEach` navigation for the no-network test,
  suite-wide `getUserMedia` negative detection, capture-placeholder assertions,
  shared sensitive-output checks for console and clipboard text, browser
  storage checks, multi-point keyframe canvas pixel sampling, Copy prompt
  clipboard success and unavailable-path coverage, no-external-network checks,
  and mobile overlap/clipping assertions. `.github/workflows/compliance.yml`
  now installs Playwright Chromium, runs `npm run test:smoke` as a blocking CI
  step, and uploads `test-results/` only on failure with seven-day retention.
- Runtime source files were not changed. No telemetry, remote logging, remote
  sharing, camera capture, new workers, model/provider assets, new dependencies,
  or raw personal video fixtures were added.
- Verification on 2026-06-29 PDT under Node v22.22.3:
  - `npm run test:smoke -- --project=desktop-chromium` PASS (16 tests).
  - `npm run test:smoke` PASS (32 tests across desktop Chromium and mobile
    Chromium).
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `git diff --check` PASS.
- Initial `npm run test:smoke` under Node v24.15.0 was interrupted after no
  output for several minutes and is not used as required verification evidence.
- Final Claude implementation audit handoff:
  `docs/ss-015-claude-audit-prompt.md`.
- Claude final implementation audit returned PASS and cleared SS-015 for PR
  preparation. Claude noted no blockers. The highest-value non-blocking
  recommendation was to strengthen hidden-ID coverage from literal phrase
  matching to include opaque identifier shapes such as UUIDs, long hashes, and
  long URL-safe tokens.
- Claude audit response record:
  `docs/ss-015-claude-audit-response.md`.
- Codex implemented the hidden-ID recommendation as a small test-only follow-up:
  the shared sensitive-output denylist in `test/smoke/app.spec.ts` now also
  matches UUID-shaped identifiers, long hex tokens, and long URL-safe opaque
  tokens.
- Verification after the hidden-ID denylist follow-up on 2026-06-29 PDT under
  Node v22.22.3:
  - `npm run test:smoke` PASS (32 tests across desktop Chromium and mobile
    Chromium).
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `git diff --check` PASS.
- Focused Claude re-review prompt for the post-PASS denylist delta:
  `docs/ss-015-claude-rereview-prompt.md`.
- Claude focused implementation re-review returned PASS and confirmed the
  hidden-ID/token denylist concern is closed, with no new blockers. Claude
  cleared SS-015 for PR preparation.
- Focused re-review response record:
  `docs/ss-015-claude-rereview-response.md`.
- After the first focused PASS, the focused prompt was updated to include the
  full current `test/smoke/app.spec.ts` file contents. Claude re-reviewed the
  full-file prompt, confirmed the hidden-ID/token denylist concern remains
  closed, cross-checked that 16 smoke tests across two Playwright projects
  account for the reported 32 passing tests, found no new blockers, and again
  cleared SS-015 for PR preparation.
- Additional PR-template verification on 2026-06-29 PDT under Node v22.22.3:
  - `npm run license:audit` PASS.
  - `npm run sbom:generate` PASS. The generated SBOM timestamp/serial metadata
    changed only because of regeneration and was restored because SS-015 has no
    dependency changes.
- Pull Request opened:
  https://github.com/ajason13/swing-sync/pull/15.
- Branch commit pushed for PR #15:
  `bbe2d49b6b29f4be81f619fd7a4c7983869ae70f`.
- PR #15 context-sync commit pushed:
  `f2b82c7dfdb607d8a5ebd5a519e0db24e68e408f`.
- GitHub PR #15 compliance check passed in 1m18s.
- PR #15 merged on 2026-06-30 UTC with merge commit
  `ef19c5df819b37669533500fe4f86a031eb817df`.
- Notion moved to `4. Final Audit (Claude)`.
- Notion Pull Request property was updated with PR #15, and a PR-created
  comment was added.
- Notion moved to `5. Done` after merge, with a merge-state comment recording
  PR #15 and merge commit `ef19c5df819b37669533500fe4f86a031eb817df`.
- Observability decision: runtime observability should remain unchanged for
  SS-015. No runtime observability was added. Only local Playwright diagnostics
  and CI artifacts for failed browser runs were added.

Next owner: Codex/user to select the next backlog task. No active task is
selected in `CONTEXT.md`. Start from synchronized `main`, inspect the Swing
Sync Notion task database/board, and ask the user to confirm the next task if
ordering is ambiguous.

Next-task kickoff check on 2026-06-30:

- Local `main`, `origin/main`, and `HEAD` were confirmed at
  `f5836311bdb1f871b965bda24ad55322b89817eb` after `git fetch origin`.
- Worktree is clean except for intentional untracked
  `docs/agent-guidance/*new-codex-session-prompt.md` files, which remain
  preserved.
- Swing Sync Tasks database still uses handshake values:
  `0. Backlog`, `1. Spec Drafting (Gemini)`,
  `2. QA Planning (Claude)`, `3. In Development (ChatGPT)`,
  `4. Final Audit (Claude)`, and `5. Done`. For board compatibility, use the
  literal `1. Spec Drafting (Gemini)` value after selection while treating
  Codex as research/spec owner under the 2026-06-26 routing update.
- Visible non-Done backlog candidates verified in Notion:
  - `SS-013 Add optional model API adapter behind consent gate`
    (https://app.notion.com/p/375834a0c8a6816491e9d73a30dbf3d2):
    branch `ss-013-model-adapter`, status `0. Backlog`, empty Pull Request,
    Task Type `Feature`. Acceptance: API mode disabled until explicit consent;
    provider adapter is model-neutral; user sees what data will be sent; manual
    Swing Card workflow remains available without keys or server config.
  - `SS-016 Publish README, limitations, and contributor guide`
    (https://app.notion.com/p/375834a0c8a68152bee5f2842be6c6e0):
    branch `ss-016-docs`, status `0. Backlog`, empty Pull Request,
    Task Type `Feature`. Acceptance: README explains purpose, local-first
    design, safety limits, and setup; limitations page covers pose accuracy,
    camera setup, and non-medical scope; contributor guide explains task
    workflow, testing, licenses, and SBOM expectations; trademark/
    non-affiliation disclaimer is visible.
- Sensitivity classification:
  - SS-013 is safety-, privacy-, AI-coaching-, model-provider-, compliance-,
    dependency/licensing-, user-facing-copy-, runtime-, and remote-API-
    sensitive. It requires Codex-owned research/spec drafting, primary-source
    checks for any provider/API facts, Adopt / Revise / Defer / Reject
    dispositions, a self-contained Claude QA planning handoff, and Claude gate
    clearance before implementation.
  - SS-016 is safety-, privacy-, legal/trademark-, medical-scope-,
    compliance-, licensing/SBOM-, and user-facing-copy-sensitive. It requires
    Codex-owned docs-claim research/spec drafting, protected-boundary language
    review, a self-contained Claude QA planning handoff, and Claude gate
    clearance before implementation.
- Notion search found prior `SS-TC-009` through `SS-TC-018` records and the
  Swing Sync Test Cases database, but no obvious dedicated SS-013 or SS-016
  test case. After task selection, create or reconcile a dedicated
  acceptance-aligned test case before implementation.
- User confirmed SS-013 as the next task. Branch `ss-013-model-adapter` was
  created from current `main`; Notion was moved through spec drafting to
  `2. QA Planning (Claude)` after Codex created `SS-TC-019` and the
  research/spec/Claude QA planning artifacts.

Next-task kickoff check on 2026-06-27:

- Local `main` was confirmed at
  `7399ea0403da4ad4da41f7d18cb1312e3445bcc7`, matching the post-SS-012
  context-sync handoff, with a clean tracked worktree and only intentional
  untracked `docs/agent-guidance/*new-codex-session-prompt.md` files present.
- Codex recorded on the SS-012 Notion page that it can emulate the former Deep
  Research workflow for Swing Sync kickoff/spec work: structured research
  questions, source discovery, primary-source verification where needed,
  source URLs/check dates, Adopt / Revise / Defer / Reject dispositions, and
  self-contained spec plus Claude QA planning handoff. This is a Codex-owned
  workflow using available tools, not a separate ChatGPT Deep Research product
  mode invocation in this environment.
- Swing Sync Tasks database view sorts by `Name`. Visible backlog candidates
  inspected in Notion:
  - `SS-014 Create fixture swing dataset policy and test fixtures`, branch
    `ss-014-fixtures-policy`, status `0. Backlog`, empty Pull Request, Task
    Type `Research`.
  - `SS-015 Add browser regression tests for MVP flow`, branch
    `ss-015-browser-tests`, status `0. Backlog`, empty Pull Request, Task Type
    `Feature`.
- SS-014 has a prior SS-007 Notion comment noting that moving side-on browser
  fixture policy, provenance, and coverage were deferred to SS-014 and that it
  is a prerequisite for future stories that make moving-side-on video phase
  accuracy or coverage claims.
- User confirmed SS-014 as the next task. Branch `ss-014-fixtures-policy` was
  created from `main` at `7399ea0403da4ad4da41f7d18cb1312e3445bcc7`.
- Notion was moved to `1. Spec Drafting (Gemini)` for board compatibility,
  with Codex noted as research/spec owner under the 2026-06-26 routing update.

## SS-014 Coordination

SS-014 is privacy-, licensing-, compliance-, export/test-fixture-, and future
user-facing-policy sensitive. It will define fixture consent, licensing,
provenance, preferred synthetic/derived landmark fixture usage, and blocked
repo-commit content. Treat it as gated: Codex owns research/spec drafting under
the 2026-06-26 LLM-team routing update, and Claude remains the independent QA
planning and final adversarial audit reviewer.

Acceptance criteria from Notion:

- Define consent and licensing policy for fixture videos.
- Prefer synthetic/derived landmark fixtures when possible.
- Add at least one non-identifying fixture for math tests.
- Document what cannot be committed to the repo.

Kickoff/spec state on 2026-06-27:

- Local `main`, `origin/main`, and `HEAD` were confirmed at
  `7399ea0403da4ad4da41f7d18cb1312e3445bcc7` after `git fetch origin`.
- Worktree was clean except for the SS-014 kickoff `CONTEXT.md` update and
  intentional untracked `docs/agent-guidance/*new-codex-session-prompt.md`
  files, which remain preserved.
- Notion page:
  https://app.notion.com/p/375834a0c8a681f08c96eeb40e2213f2
- Branch from current `main`: `ss-014-fixtures-policy`.
- Pull Request: none.
- Task Type: `Research`.
- Dedicated test case `SS-TC-017` was created:
  https://app.notion.com/p/38d834a0c8a681ffb241edf6cfe45788
- `SS-TC-017` covers allowed/blocked fixture classes, consent/licensing/
  provenance metadata, non-identifying synthetic or derived landmark fixture
  preference, at least one repo-committable non-identifying math-test fixture,
  protected no-raw-personal-video/no-unverified-third-party-media boundaries,
  no hidden identifiers, no telemetry/remote storage, and no overbroad privacy,
  deletion, anonymity, legal, compliance, safety, professional coaching, or
  moving-video phase-accuracy claims.
- Codex-owned research/disposition note:
  `docs/ss-014-research-disposition.md`.
- Candidate normative specification:
  `docs/ss-014-preimplementation-spec.md`.
- Self-contained Claude QA planning handoff:
  `docs/ss-014-claude-qa-planning-prompt.md`.
- The Claude QA planning prompt embeds the exact current contents of
  `docs/ss-014-research-disposition.md`,
  `docs/ss-014-preimplementation-spec.md`, and the `SS-TC-017` Notion test
  case, plus a source-sensitive summary of the existing mannequin fixture
  provenance, so it can be pasted into Claude Chat without filesystem access.
- Source checks were recorded for Creative Commons license constraints, SPDX
  identifiers, GitHub large-file guidance, OpenAI output terms for the existing
  generated-fixture precedent, and current repo privacy/licensing/model/safety
  policies.
- Notion moved to `2. QA Planning (Claude)`.
- Claude QA planning returned FAIL with eight blockers:
  unenumerated fixture classes lacked a default-deny rule; maintainer approval
  was only a free-text field; fixture classes risked prose/code drift; size
  thresholds were ambiguous; three validator error codes lacked explicit
  tests; AI-generation terms review was not a distinct provenance field; the
  validation contract did not restate zero-new-dependency implementation; and
  validator wiring used non-committal `likely` language.
- Claude QA response:
  `docs/ss-014-claude-qa-response.md`.
- Codex accepted B1-B8 as valid and revised
  `docs/ss-014-preimplementation-spec.md` with a canonical
  `scripts/fixture-policy-data.mjs` source, `FIXTURE_CLASS_UNKNOWN`
  default-deny behavior, explicit PR-review/CODEOWNERS approval semantics,
  exact size threshold/error-code mapping, `FIXTURE_AI_TERMS_MISSING`,
  mandatory zero-new-dependency `npm run fixture:verify` wired into
  `npm run compliance:verify`, and explicit tests for every error code plus
  boundary/dependency/canonical-source drift checks.
- The original Claude QA planning prompt is superseded for paste use. Focused
  B1-B8 re-review prompt: `docs/ss-014-claude-qa-rereview-prompt.md`.
- Claude focused B1-B8 re-review confirmed B1-B8 are closed and returned FAIL
  with three narrow new blockers: no test proving the validator reads from the
  canonical source, no controlled mechanism to identify AI-generated fixtures,
  and ambiguous general approval versus AI-generated output-rights approval
  fields.
- Codex accepted NB1-NB3 as valid and revised
  `docs/ss-014-preimplementation-spec.md` with validator-to-canonical-source
  test requirements, controlled `generationMethod` values from the canonical
  source, `unknown` generation method blocked by default, and distinct
  `maintainerApproval` versus `aiGeneratedOutputRightsApproval` fields.
- Focused NB1-NB3 re-review prompt:
  `docs/ss-014-claude-qa-rereview-2-prompt.md`.
- Claude focused NB1-NB3 re-review confirmed NB1-NB3 are closed and returned
  FAIL with one narrow new blocker: `generationMethod` lacked a value for
  first-party real-person recordings, leaving
  `maintainer-recorded-personal-media` unrepresentable without mislabeling it
  as `third-party-source` or `unknown`.
- Codex accepted NB4 as valid and revised
  `docs/ss-014-preimplementation-spec.md` with `recorded-real-person` as a
  controlled `generationMethod`, mapped `maintainer-recorded-personal-media` to
  it, and stated that `recorded-real-person` remains blocked in SS-014 through
  the `maintainer-recorded-personal-media` class until a future consent/release
  workflow is separately approved. Codex also incorporated Claude's
  non-blocking clarifications: prefer behavior-driving validator-to-canonical-
  source tests, map missing `aiGeneratedOutputRightsApproval` to
  `FIXTURE_AI_TERMS_MISSING`, and require a negative test showing non-AI
  `generationMethod` values do not trigger AI-terms errors.
- Focused NB4 confirmation prompt:
  `docs/ss-014-claude-qa-rereview-3-prompt.md`.
- Claude focused NB4 confirmation returned PASS. Claude explicitly cleared
  Codex to move SS-014 to implementation and stated that final implementation
  audit should include actual source for `scripts/fixture-policy-data.mjs`,
  `scripts/verify-fixtures.js`, and executed evidence for all eleven validator
  error codes plus validator-to-source behavior.
- Codex moved Notion to `3. In Development (ChatGPT)` and implemented SS-014:
  `docs/fixture-policy.md`, canonical `scripts/fixture-policy-data.mjs`,
  zero-dependency `scripts/verify-fixtures.js`, `npm run fixture:verify` wired
  into `npm run compliance:verify`, fixture manifests for
  `test/fixtures/math` and existing `test/fixtures/pose-landmarker`, a
  non-identifying synthetic math landmark fixture, fixture-policy unit
  coverage, and a geometry metric test that loads the committed fixture.
- Final Claude implementation audit handoff:
  `docs/ss-014-claude-audit-prompt.md`.
- The final audit prompt embeds the focused implementation diff for the policy,
  canonical policy data, verifier, manifests, synthetic math fixture, package
  scripts, fixture-policy tests, and geometry fixture-load test.
- Verification on 2026-06-27 PDT:
  - `npm run fixture:verify` PASS.
  - `npm run test:unit -- fixture-policy geometry-metrics` PASS
    (2 files, 33 tests).
  - `npm run test:unit` PASS (12 files, 122 tests).
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run safety:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `git diff --check` PASS.
- Dependency/license exception checks (`npm run license:audit`,
  `npm run verify:bundle-license-fixture`, `npm run sbom:generate`) were not
  run because SS-014 added no dependency and no license exception. The new unit
  coverage asserts dependencies/devDependencies are unchanged and that
  `fixture:verify` is wired into `compliance:verify`.
- Observability/runtime state: no runtime app behavior was added. No telemetry,
  remote logging, storage, network behavior, SDK/provider/model asset, worker,
  dependency, or remote sharing was added. Only local developer verification
  output from `fixture:verify` is introduced, using sanitized paths and stable
  error codes.
- Notion was moved to `4. Final Audit (Claude)` and a comment recorded the
  implementation summary, final audit prompt path, verification evidence, and
  unchanged runtime/observability boundaries.
- Claude final implementation audit returned FAIL with four blockers:
  `recorded-real-person` generation method was documented as blocked but not
  enforced by the validator; `aiGeneratedOutputRightsApproval` was checked only
  for truthy presence instead of approver/date/mechanism shape; the
  zero-dependency guard used a hardcoded current dependency array rather than a
  pre-SS-014 baseline; and unsafe-claim detection missed several prohibited
  phrase variants including anonymity, legal compliance, qualified privacy
  guarantees, medical advice/diagnosis, and biomechanical correctness.
- Codex accepted all four findings as valid and fixed them:
  `scripts/fixture-policy-data.mjs` now exposes canonical
  `blockedGenerationMethods` with `recorded-real-person` and `unknown`;
  `scripts/verify-fixtures.js` enforces that canonical blocked-generation list;
  `aiGeneratedOutputRightsApproval` now uses the same approver/date/mechanism
  shape validation under `FIXTURE_AI_TERMS_MISSING`; unsafe-claim patterns were
  expanded for the audited phrase variants; manifest limitation wording was
  revised to avoid repeating prohibited phrases even in negated disclaimers;
  and the zero-dependency guard was revised again after focused review to
  compare current dependency sets against the branch-base `package.json`
  retrieved from git history.
- Focused Claude final audit re-review prompt:
  `docs/ss-014-claude-rereview-prompt.md`. The original
  `docs/ss-014-claude-audit-prompt.md` is now marked superseded for paste use.
- Verification after audit fixes on 2026-06-27 PDT:
  - `npm run fixture:verify` PASS.
  - `npm run test:unit -- fixture-policy geometry-metrics` PASS
    (2 files, 33 tests).
  - `npm run test:unit` PASS (12 files, 122 tests).
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run safety:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `git diff --check` PASS.
- Claude focused final audit re-review confirmed B1, B2, and B4 are closed and
  returned FAIL on one residual B3 issue: the checked-in dependency baseline
  file was not itself tied to actual pre-SS-014 git history.
- Codex accepted the residual B3 finding as valid, removed the checked-in
  `test/baselines/package-dependencies.pre-ss-014.json`, and changed the
  zero-dependency guard to compare current `package.json` dependency sets
  against `git show 7399ea0403da4ad4da41f7d18cb1312e3445bcc7:package.json`.
  That commit is the synchronized post-SS-012 main state recorded as the
  branch base for SS-014. The existing
  `@swing-sync-test/bundled-prohibited-package` dependency is therefore
  verified against the base commit as pre-existing bundled-license fixture
  tooling, not an SS-014 addition.
- Focused B3-only Claude re-review prompt:
  `docs/ss-014-claude-rereview-2-prompt.md`. The previous focused prompt is
  now marked superseded for paste use.
- Verification after the residual B3 fix on 2026-06-27 PDT:
  - `npm run fixture:verify` PASS.
  - `npm run test:unit -- fixture-policy geometry-metrics` PASS
    (2 files, 33 tests).
  - `npm run test:unit` PASS (12 files, 122 tests).
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run safety:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `git diff --check` PASS.
- Claude B3-only focused re-review returned PASS. Claude stated all
  implementation findings are closed and explicitly cleared Codex to prepare
  the PR. Claude's non-blocking PR notes: mention that
  `@swing-sync-test/bundled-prohibited-package` is pre-existing local
  bundled-license/prohibited-package fixture tooling, mention the fixture
  unsafe-claim scanner intentionally fails closed on risky words even in
  negated/disclaiming phrasing, and optionally add a future hardening check
  that the pinned branch-base commit remains an ancestor of `HEAD`.
- Claude final audit response record:
  `docs/ss-014-claude-audit-response.md`.
- Codex committed SS-014 implementation and audit artifacts at
  `54283df292272e6679ec8c0e65da46290ef168d1` and pushed branch
  `ss-014-fixtures-policy`.
- Pull Request: https://github.com/ajason13/swing-sync/pull/14.
- Notion Pull Request property was updated with PR #14, and a Notion comment
  recorded the commit, PR URL, Claude PASS, verification evidence, unchanged
  runtime/observability boundaries, and non-blocking PR review notes.
- PR #14 GitHub compliance check completed successfully on head
  `88bf01bbd4c1d839dce13ec5ad14e4d4bdd8dc6e`; PR remained open and
  mergeable.
- PR #14 was merged on 2026-06-27 local time. Merge commit:
  `5e8c0c93b165806ad4911db6a0e53d2a6041f2da`.
- Local checkout is back on `main` at the PR #14 merge commit and matched
  `origin/main` before this post-merge context sync. The story branch was
  deleted on GitHub by `gh pr merge --merge --delete-branch`.
- SS-014 completed scope:
  - fixture consent/licensing/blocklist policy in `docs/fixture-policy.md`;
  - canonical fixture policy data and zero-dependency validator in
    `scripts/fixture-policy-data.mjs` and `scripts/verify-fixtures.js`;
  - `npm run fixture:verify` wired into `npm run compliance:verify`;
  - non-identifying synthetic math fixture plus provenance under
    `test/fixtures/math`;
  - provenance manifest for the existing mannequin pose-landmarker fixture;
  - fixture-policy unit coverage and geometry metric coverage loading the
    committed fixture.
- SS-014 Notion was updated with PR #14 and merge state and moved to `5. Done`.

Next owner: Codex/user to select the next backlog task. No active task is
selected in `CONTEXT.md`.

## SS-012 Coordination

SS-012 is safety-, AI-coaching-, model-provider-adjacent, export-adjacent, and
user-facing-copy sensitive. It will design a multimodal coaching prompt and
response schema for educational golf movement feedback grounded in approved
Swing Card evidence. Treat it as gated: Codex owns research/spec drafting under
the 2026-06-26 LLM-team routing update, and Claude remains the independent QA
planning and final adversarial audit reviewer.

Acceptance criteria from Notion:

- Prompt uses frames, metrics, confidence, and safety constraints.
- Response schema separates observations, likely causes, drills, cautions, and
  next focus.
- Prompt refuses medical diagnosis and overconfident biomechanical claims.
- Includes adversarial prompt tests.

Kickoff state on 2026-06-27:

- Local `main`, `origin/main`, and `HEAD` were confirmed at
  `ac5aed1b840a9f881b5875cca0b82cf2ac50d3f8` after `git fetch origin`.
- Worktree was clean except for intentional untracked
  `docs/agent-guidance/*new-codex-session-prompt.md` files, which remain
  preserved.
- Notion page:
  https://app.notion.com/p/375834a0c8a681659faaf9db57c6f759
- Branch from current `main`: `ss-012-coach-prompt`.
- Notion first moved to `1. Spec Drafting (Gemini)` for board compatibility,
  with Codex noted as the research/spec owner under the 2026-06-26 LLM-team
  routing update. After Codex-owned planning artifacts were drafted, Notion was
  moved to `2. QA Planning (Claude)`.
- Pull Request: https://github.com/ajason13/swing-sync/pull/13.
- Task Type: `Feature`.
- Dedicated test case `SS-TC-016` was created for acceptance-aligned coverage:
  prompt inputs from approved frames, metrics, confidence, warnings, and safety
  constraints; structured observations/likely-causes/drills/cautions/next-focus
  output; medical, rehabilitation, pain-triage, aggressive-prescription,
  overconfident-biomechanics, prompt-injection, fabricated-metric, and
  provider-specific adversarial cases; and protected no-raw-video, no-remote
  API, no-telemetry, no-persistence, no-new-SDK/provider/model/dependency
  boundaries.
- Codex-owned research/disposition note:
  `docs/ss-012-research-disposition.md`.
- Candidate normative specification:
  `docs/ss-012-preimplementation-spec.md`.
- Self-contained Claude QA planning handoff:
  `docs/ss-012-claude-qa-planning-prompt.md`.
- Claude QA planning returned FAIL with six specification blockers:
  unspecified item text length, unbounded response-section arrays,
  unconstrained `phaseId`, no structural unavailable/review-required text
  rule, missing validation error-code taxonomy, and unspecified unsafe-text
  detection.
- Codex accepted B1-B6 as valid and revised
  `docs/ss-012-preimplementation-spec.md` with exported text/count bounds,
  closed `PhaseId` use, exact unavailable/review-required templates,
  validation context for fabricated supported evidence, exhaustive
  `CoachingValidationErrorCode` values, exported prohibited text patterns, and
  explicit SS-006 `observedSeekTimestampMs` non-regression.
- Claude QA response:
  `docs/ss-012-claude-qa-response.md`.
- Focused re-review handoff:
  `docs/ss-012-claude-qa-rereview-prompt.md`.
- Claude focused QA re-review returned FAIL after confirming B1-B6 are closed.
  New blocker B7 identified `CoachingValidationContext` as a potential second
  source of truth unless tied by construction to actual Swing Card evidence.
  Minor issue B8 asked for an explicit prohibited-text normalization floor and
  adversarial evasion test expectations.
- B7/B8 response: `docs/ss-012-claude-qa-rereview-response.md`.
- `docs/ss-012-preimplementation-spec.md` now requires
  `validateCoachingResponse(value, content: SwingCardContent)` to derive
  `CoachingValidationContext` internally from the same Swing Card content used
  for prompt generation; production validation must not accept caller-supplied
  context. The spec also requires NFKC normalization, zero-width character
  removal, Unicode whitespace collapse, and trim before prohibited-pattern
  matching, with adversarial tests for mixed case, whitespace padding,
  zero-width insertion, and a documented Unicode-lookalike limitation case.
- Focused B7/B8 re-review handoff:
  `docs/ss-012-claude-qa-rereview-2-prompt.md`.
- Claude focused B7/B8 QA re-review returned PASS. B7 and B8 are closed with no
  new blockers, and Claude cleared SS-012 to move to
  `3. In Development (ChatGPT)`.
- Claude B7/B8 PASS response:
  `docs/ss-012-claude-qa-rereview-2-response.md`.
- Non-blocking implementation audit watch items: confirm `limited` evidence
  status derives by elimination rather than a separate mutable list, and add a
  code comment that `coachingProhibitedTextPatterns.description` is
  developer/test-only and must not be surfaced through validation results or UI.
- Notion moved to `3. In Development (ChatGPT)`.
- Implementation completed for approved prompt/schema scope only:
  `src/coaching-contract.ts`, `src/coaching-prompt.ts`, and
  `test/unit/coaching-prompt.test.ts`.
- The implementation adds a zero-dependency educational coaching prompt
  builder, versioned coaching response contract, deterministic validation
  result codes, Swing Card-derived validation context, exact unavailable and
  review-required templates, prohibited text pattern data, text normalization,
  and SS-TC-016 adversarial unit coverage.
- `limited` evidence status is derived by elimination from real
  `SwingCardContent` evidence and is not tracked in a separate mutable list.
  `coachingProhibitedTextPatterns.description` has a code comment documenting
  that descriptions are developer/test-only and must not surface through
  validation results or UI.
- No connected model API calls, provider SDKs, API keys, server config, remote
  sharing, cloud storage, telemetry, remote logging, public serving, model
  assets, new workers, new dependencies, raw swing video upload, persistence,
  or UI integration were added.
- Observability is intentionally unchanged; no logs, analytics, telemetry,
  traces, remote diagnostics, storage writes, console payload dumps, provider
  calls, or persistent debug artifacts were added.
- Verification passed: `npm run test:unit -- coaching-prompt` (12 tests),
  `npm run test:unit` (113 tests across 11 files), `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, and `git diff --check`.
- Source-inclusive final audit prompt:
  `docs/ss-012-claude-audit-prompt.md`.
- Notion moved to `4. Final Audit (Claude)`.
- Claude final implementation audit returned FAIL with B9/B10:
  `supported` was not rejected for limited-evidence phases, and the
  partial-overlay test only asserted the permissive `limited` path.
- B9/B10 response: `docs/ss-012-claude-audit-response.md`.
- `src/coaching-contract.ts` now derives `limitedPhaseIds` from
  `SwingCardContent` and rejects `supported` on limited-evidence phases with
  `LIMITED_EVIDENCE_REQUIRES_LIMITED_STATUS`. Limited evidence is present but
  incomplete evidence, such as partial overlay without measured metric,
  rendered keyframe without measured metric, or measured metric without rendered
  keyframe.
- `test/unit/coaching-prompt.test.ts` now asserts partial-overlay evidence
  accepts `limited` and rejects `supported`, and separately covers metric-only
  limited evidence plus missing-metric unavailable evidence.
- B9/B10 verification passed: `npm run test:unit -- coaching-prompt` (13
  tests), `npm run test:unit` (114 tests across 11 files), `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, and `git diff --check`.
- The original final audit prompt is superseded. Focused B9/B10 re-review
  prompt: `docs/ss-012-claude-final-rereview-prompt.md`.
- Claude focused B9/B10 final re-review returned PASS with no new blockers.
  Response: `docs/ss-012-claude-final-rereview-response.md`.
- Non-blocking recommendation from Claude: add a future regression test for a
  rendered-overlay phase with no measured metric to complete the evidence
  matrix. This does not block SS-012 PR preparation.

- Pull Request created: https://github.com/ajason13/swing-sync/pull/13.

- PR #13 merged on 2026-06-27 with merge commit
  `befbceda9a191c94e6090abd8d9f62b35b56f8f8`.
- Notion marked `5. Done`.
- Post-merge context sync pushed to `main`.

Next owner: Codex/user to select the next backlog task. No active task is
selected after SS-012.

## SS-009 Coordination

SS-009 is safety-, coaching-, and privacy-sensitive metric-calculation support
work. It will implement local joint angle and coordinate-normalization
utilities that consume pose landmark-like inputs and return bounded educational
metric primitives or warnings. Treat this as sensitive: Gemini researches and
drafts the specification, Codex verifies and implements only after approved
planning gates, and Claude performs adversarial QA planning plus final audit.

Acceptance criteria:

- Computes shoulder angle, spine angle, knee flex, arm plane, hip rotation
  proxy, and head displacement.
- Handles left/right handedness.
- Unit tests cover synthetic coordinates and edge cases.
- Invalid or missing landmarks return warnings, not fabricated metrics.

Kickoff state on 2026-06-19:

- Local `main` and `origin/main` include post-SS-008 context sync and merge
  commit
  `35a569941b46744338f274f70d5eb826cfabdb1f`.
- SS-008 is merged and marked `5. Done` in Notion.
- SS-009 Notion page:
  https://app.notion.com/p/375834a0c8a68184b16fed21d44b5394
- Notion reconfirmed branch `ss-009-angle-utils`, initial `0. Backlog`
  status, empty PR, and the acceptance criteria above.
- Branch `ss-009-angle-utils` was created from current `main` at
  `8e2b44942a15fde9863853c6be30dc2b4ceaeb3d` after `git fetch origin`
  confirmed `HEAD` and `origin/main` matched.
- Notion moved to `1. Spec Drafting (Gemini)`.
- No SS-009-specific test case existed in Notion. Dedicated `SS-TC-013` was
  created for deterministic synthetic coordinate coverage, left/right and
  mirrored handedness behavior, missing/invalid landmark warnings, edge cases,
  and protected local-first safety/privacy boundaries.
- The Gemini Chat Deep Research handoff is
  `docs/handoffs/ss-009-gemini-chat-deep-research-prompt.md`. It uses a lean
  steering prompt, a 10-file maximum attachment list for Gemini Chat, embedded
  summaries of omitted prior-story artifacts, and a required task-specific
  research plan before the deep research run.
- Gemini Chat Deep Research returned a broad metric-utilities report. Codex
  dispositioned it in `docs/ss-009-research-disposition.md`, adopting the
  zero-dependency geometry direction while revising or rejecting the global 3D
  target-line transform, unverified world-axis claims, payload/schema expansion,
  diagnostic logging, absolute privacy claims, unsupported biological ranges,
  and CaddieSet formula/data reuse.
- The candidate normative specification is
  `docs/ss-009-preimplementation-spec.md`.
- The self-contained Claude QA planning handoff is
  `docs/ss-009-claude-qa-planning-prompt.md`.
- Notion moved to `2. QA Planning (Claude)`.
- Claude QA planning returned FAIL with five specification blockers:
  underspecified lead-arm-plane landmarks/reference, missing ratio denominator
  guards, unclear mirroring rules for magnitude primitives, ambiguous malformed
  landmark handling, and undefined warning collection order.
- `docs/ss-009-preimplementation-spec.md` now addresses B1-B5 with explicit
  public functions, exact lead-arm-plane vectors/formula, cumulative warning
  order, malformed-landmark classification, warning-applicability and
  denominator-threshold tables, raw-distance-only ratio semantics, and expanded
  synthetic edge-case test requirements.
- Claude QA response: `docs/ss-009-claude-qa-response.md`.
- Focused re-review handoff:
  `docs/ss-009-claude-qa-rereview-prompt.md`.
- Claude focused QA re-review returned FAIL with one new blocker, B6: warning
  results could be ambiguous if geometry was technically computable, and
  baseline landmark visibility scope was unclear for ratio primitives.
- B6 is now addressed in `docs/ss-009-preimplementation-spec.md`: any
  non-empty warning array forces `status: "unavailable"` and `value: null`;
  `measured` requires zero warnings; baseline landmarks use the same malformed,
  non-finite, and `MIN_LANDMARK_VISIBILITY` validation as active landmarks; and
  the test matrix covers warning-only unavailable results plus baseline
  low-visibility cases.
- Claude second focused QA re-review returned PASS. B1-B6 are closed, and
  Claude authorized moving SS-009 to `3. In Development (ChatGPT)`.
- Implementation completed for geometry utility/test scope only:
  `src/geometry-metrics.ts` and `test/unit/geometry-metrics.test.ts`.
- The implementation adds pure zero-dependency geometry primitives for
  shoulder angle, spine angle, lead/trail knee flex, lead arm plane, hip
  rotation proxy, and head displacement. Invalid, missing, low-visibility,
  undeclared, malformed, zero-length, missing-baseline, or insufficient-
  baseline inputs return deterministic warnings with `status: "unavailable"`
  and `value: null`.
- No metric payload generation, schema expansion, runtime UI, export,
  persistence, telemetry, remote logging, network behavior, dependencies,
  SDK/model/provider changes, workers, or public serving were added.
- Observability is intentionally unchanged; no logs, diagnostics, analytics,
  traces, telemetry, storage writes, or debug payloads were added.
- Pre-audit verification passed before the final audit: `npm run test:unit -- geometry-metrics`
  (21 tests), `npm run test:unit` (72 tests across 8 files),
  `npm run build`, `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, and `git diff --check`.
- Final audit prompt: `docs/ss-009-claude-audit-prompt.md`.
- Claude final implementation audit returned FAIL with B7: the audit prompt
  summarized `src/geometry-metrics.ts` and
  `test/unit/geometry-metrics.test.ts` instead of embedding the actual source,
  so Claude could not directly verify the implementation.
- B7 is accepted as a valid process blocker for this sensitive story.
  Response recorded in `docs/ss-009-claude-audit-response.md`.
- Codex added focused hardening tests for active low visibility, unused-array
  corruption independence for lead/trail knee flex, and single-warning-only
  unavailable results across all public primitives.
- Targeted verification after B7 response passed:
  `npm run test:unit -- geometry-metrics` (24 tests).
- Full verification after B7 response passed: `npm run test:unit` (75 tests
  across 8 files), `npm run build`, `npm run compliance:verify`,
  `npm run safety:verify`, `npm run privacy:verify`, and `git diff --check`.
- Source-inclusive focused final re-review prompt:
  `docs/ss-009-claude-final-rereview-prompt.md`. It embeds the full current
  contents of `src/geometry-metrics.ts` and
  `test/unit/geometry-metrics.test.ts` for direct Claude audit.
- Claude source-inclusive focused final re-review returned FAIL. B7 was closed
  and C2-C4 were confirmed closed, but C1 remained blocking because `finalize`
  guessed `["ZERO_LENGTH_VECTOR"]` when a null or non-finite value reached
  finalization with no collected warnings.
- C1 is now addressed: `finalize` no longer fabricates a fallback warning;
  null or non-finite values without collected warnings throw an invariant error;
  and side selection now records `UNDECLARED_HANDEDNESS` at `leadSide` /
  `trailSide` through `sideIndex(..., collector)`.
- Added a focused cumulative-warning regression for low visibility plus
  zero-length geometry warnings.
- Verification after the C1 fix passed: `npm run test:unit -- geometry-metrics`
  (25 tests), `npm run test:unit` (76 tests across 8 files),
  `npm run build`, `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, and `git diff --check`.
- Focused final re-review 2 prompt:
  `docs/ss-009-claude-final-rereview-2-prompt.md`.
- Claude second focused final re-review returned FAIL only pending explicit
  confirmation of the intentional `calculateSpineAngle` handedness-validation
  asymmetry. Claude retracted B10 and confirmed the C1 structural fix.
- B11/N13 response: `calculateSpineAngle` intentionally relies on standalone
  `validateHandedness` because it does not side-select and `signedHorizontal`
  has no undefined/error path where a warning can be emitted structurally. A
  code comment now records this at the validation call.
- Focused verification after the B11/N13 comment passed:
  `npm run test:unit -- geometry-metrics` (25 tests) and `git diff --check`.
- Focused final re-review 3 prompt:
  `docs/ss-009-claude-final-rereview-3-prompt.md`.
- Claude final implementation audit closing review returned PASS. All B1-B7,
  C1-C4, B10, and B11/N13 items are closed or confirmed, and Claude signed off
  that SS-009 is ready for PR preparation.
- Pre-PR verification passed: `npm run test:unit` (76 tests across 8 files),
  `npm run build`, `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, `npm run license:audit`, `npm run sbom:generate`,
  and `git diff --check`. `docs/sbom.json` timestamp/serial churn from
  generation was restored because SS-009 adds no dependencies.
- Pull Request: https://github.com/ajason13/swing-sync/pull/10
- PR #10 merged on 2026-06-20 at merge commit
  `3d7ad6cb0c0b8b7d18baf36a3079c6bd6666bb86`. Local `main` and `origin/main`
  both include that merge plus post-SS-009 context/prompt sync commits.
- Post-merge Notion sync is complete. Notion auth was restored, SS-009 is
  marked `5. Done`, PR #10 is recorded, and a comment records merge commit
  `3d7ad6cb0c0b8b7d18baf36a3079c6bd6666bb86` plus post-merge context sync.
- A new Codex session prompt is available at
  `docs/agent-guidance/post-ss-009-next-codex-session-prompt.md`.
- Preserve the existing untracked agent-guidance prompt files unless the user
  explicitly asks to clean or commit them.

## SS-010 Coordination

SS-010 is a privacy- and export-sensitive rendering story. It will add readable
skeleton overlays to selected keyframes while preserving the local-first raw
video boundary and avoiding unapproved raw-video export. Treat it as gated:
Gemini researches and drafts the rendering/privacy specification, Codex verifies
and implements after approved planning gates, and Claude performs adversarial QA
planning plus final audit.

Acceptance criteria from Notion:

- Keyframes render with readable skeleton overlays.
- Overlays preserve user privacy by favoring annotated stills over raw video
  export.
- Mobile preview is legible.
- Export pipeline can reuse rendered frames.

Kickoff state on 2026-06-20:

- Notion page:
  https://app.notion.com/p/375834a0c8a681c280ccc35381721a27
- Branch: `ss-010-skeleton-overlays`
- Handshake Status: `4. Final Audit (Claude)`
- Pull Request: https://github.com/ajason13/swing-sync/pull/11
- Task Type: `Feature`
- Local `main` and `origin/main` were confirmed at
  `850b012652ca4c1553f852aec48188c04bd49202` after `git fetch origin`.
- Worktree was clean except for intentional untracked
  `docs/agent-guidance/ss-00*-new-codex-session-prompt.md` files, which remain
  preserved.
- Branch `ss-010-skeleton-overlays` was created from current `main`.
- Notion moved to `1. Spec Drafting (Gemini)`.
- No dedicated SS-010 test case existed in Notion. Dedicated `SS-TC-014` was
  created for readable skeleton overlays, mobile preview legibility,
  privacy-preserving annotated still output, reusable export-frame boundaries,
  malformed or unavailable landmark/keyframe handling, and protected
  local-first privacy/safety boundaries.
- The Gemini Chat Deep Research handoff is
  `docs/handoffs/ss-010-gemini-chat-deep-research-prompt.md`. It uses a
  10-file maximum attachment list, embedded summaries of omitted prior-story
  artifacts, and a required task-specific research plan before the deep
  research run.
- Gemini Chat Deep Research returned a broad skeleton-overlay rendering report.
  Codex dispositioned it in `docs/ss-010-research-disposition.md`, adopting the
  zero-dependency Canvas 2D direction, DPR-aware rendering with a local cap,
  facial-landmark exclusion, explicit 18-segment topology, and segment-level
  visibility gating while revising or rejecting guaranteed-contrast claims,
  whole-overlay occlusion thresholds, mirroring transforms for overlay
  alignment, and `toBlob`/Object URL export serialization in SS-010.
- The candidate normative specification is
  `docs/ss-010-preimplementation-spec.md`. It defines `src/pose-topology.ts`,
  `src/pose-renderer.ts`, reusable caller-provided canvas rendering, review UI
  integration, mobile/desktop verification, and strict no-serialization,
  no-download, no-persistence, no-remote-sharing boundaries.
- The self-contained Claude QA planning handoff is
  `docs/ss-010-claude-qa-planning-prompt.md`.
- Notion moved to `2. QA Planning (Claude)`.
- Claude QA planning returned FAIL with seven specification blockers:
  ambiguous `mapNormalizedPoint` validation ownership, missing warning
  precedence for multi-failure landmarks, underdetermined core-evidence versus
  no-renderable-segment status semantics, undefined segment count invariants,
  unconstrained accessible-label content, unstated canvas/`ImageBitmap`
  lifecycle ownership across keyframe switches, and unclear re-render versus
  caching expectations.
- `docs/ss-010-preimplementation-spec.md` now addresses B1-B7 with explicit
  mapper versus renderer validation ownership, exact per-landmark warning
  precedence, deterministic segment-count invariants, independent
  `NO_RENDERABLE_SEGMENTS` and `INSUFFICIENT_CORE_LANDMARKS` fixtures,
  accessible-label privacy/copy constraints, synchronous render semantics,
  `ImageBitmap` ownership retained by `FrameProcessingController`, and a
  no-cached-annotated-pixels rule for keyframe switching.
- Claude QA response: `docs/ss-010-claude-qa-response.md`.
- Focused re-review handoff:
  `docs/ss-010-claude-qa-rereview-prompt.md`.
- Claude focused QA re-review returned PASS. B1-B7 are closed, no new blockers
  were introduced, and Claude signed off that Codex may move to implementation.
- Notion moved to `3. In Development (ChatGPT)`.
- Implementation completed for approved overlay-rendering scope only:
  `src/pose-topology.ts`, `src/pose-renderer.ts`,
  `test/unit/pose-renderer.test.ts`, plus focused integration changes in
  `src/main.ts`, `src/styles.css`, and `test/smoke/app.spec.ts`.
- The implementation adds a zero-dependency Canvas 2D annotated-still renderer
  for selected sampled keyframes, explicit 18-segment non-facial topology,
  deterministic warning/status semantics, DPR capping, one reused primary
  review canvas, bounded accessible labels, mobile keyframe controls, and
  no-cached-annotated-pixel keyframe switching.
- No raw-video export, image serialization, `toBlob`, `toDataURL`,
  `URL.createObjectURL`, downloads, persistence, remote sharing, telemetry,
  remote logging, dependencies, SDK/model/provider changes, workers, public
  serving, metric payload export, or coaching/correctness claims were added.
- Observability is intentionally unchanged; no logs, analytics, metrics,
  traces, telemetry, debug payloads, storage writes, or console diagnostics
  were added.
- Verification passed: `npm run test:unit` (88 tests across 9 files),
  `npm run build`, `npm run compliance:verify`, and `git diff --check`.
- Browser verification: direct built-preview Chromium overlay smoke check
  passed. It served the built app, selected the local fixture video, opened
  review after local inference, switched to the `Top` keyframe, verified one
  annotated canvas with positive dimensions and mobile layout, no horizontal
  overflow, no IndexedDB or Cache API entries, no external requests, no
  sensitive console logs matching landmarks/worldLandmarks/media
  characteristics/filename, and no forbidden export/privacy text matching
  download/raw video export/anonymous/guaranteed.
- `npm run test:smoke` was attempted in sandboxed and escalated modes but hung
  before Playwright emitted test progress. `node_modules/.bin/playwright test
  --list --no-deps` also hung, including after temporarily removing new smoke
  blocks, so Codex treated this as a local Playwright runner/environment issue
  and used the direct built-preview Chromium check as browser evidence.
- Source-inclusive final audit prompt:
  `docs/ss-010-claude-audit-prompt.md`.
- Notion moved to `4. Final Audit (Claude)`.
- Claude final implementation audit returned FAIL with three blockers:
  duplicated finite/range validation ownership between `classifyLandmark` and
  `mapNormalizedPoint`, hardcoded no-pose segment/core warning derivation, and
  incomplete direct browser smoke evidence for exact mobile viewport,
  touch-target, and keyframe-switch single-canvas assertions.
- Audit response: `docs/ss-010-claude-audit-response.md`.
- B1 is addressed in `src/pose-renderer.ts`: one `classifyCoordinate` helper
  now owns coordinate finite/range checks for both `mapNormalizedPoint` and
  `classifyLandmark`; `validateLandmark` calls non-validating
  `mapValidatedPoint` only after classification succeeds; and the dead
  `mapNormalizedPoint` fallback warning path is removed.
- B2 is addressed in `src/pose-renderer.ts`: the missing-pose path adds
  `MISSING_POSE`, uses an empty landmark array, and lets the standard segment
  and core loops derive `MISSING_LANDMARK`, `NO_RENDERABLE_SEGMENTS`, and
  `INSUFFICIENT_CORE_LANDMARKS`.
- B3 is addressed with expanded direct built-preview Chromium verification at
  exact viewport `390x844`, asserting one canvas after switching to `Top`,
  bounded accessible label, canvas rect `306x172`, no horizontal overflow,
  `minButtonHeight: 48`, no IndexedDB or Cache API entries, no external
  requests, no sensitive console logs, and no forbidden export/privacy text.
- Verification after the audit fixes passed:
  `npm run test:unit -- pose-renderer` (12 tests), `npm run test:unit` (88
  tests across 9 files), `npm run build`, `npm run compliance:verify`,
  expanded direct built-preview Chromium overlay smoke check, and
  `git diff --check`.
- Observability remains intentionally unchanged after the audit fixes; no logs,
  analytics, metrics, traces, telemetry, debug payloads, storage writes, or
  console diagnostics were added.
- The superseded final audit prompt now redirects to the source-focused
  re-review prompt:
  `docs/ss-010-claude-final-rereview-prompt.md`.
- Claude focused final re-review returned PASS. B1-B3 are closed, no new
  blockers were introduced, and Claude signed off that SS-010 may proceed to
  PR preparation.
- Claude final re-review response:
  `docs/ss-010-claude-final-rereview-response.md`.
- Final pre-PR verification passed after Claude PASS:
  `npm run test:unit` (88 tests across 9 files), `npm run build`,
  `npm run compliance:verify`, `npm run license:audit`,
  `npm run sbom:generate`, and `git diff --check`. `docs/sbom.json`
  changed only generated serial/timestamp metadata, so that churn was restored
  because SS-010 adds no dependencies.
- Pull Request opened:
  https://github.com/ajason13/swing-sync/pull/11. Notion Pull Request is
  recorded and a Notion comment records Claude PASS, final verification, the
  restored SBOM metadata churn, and the remaining local Playwright runner
  limitation.
- PR #11 merged on 2026-06-25 at merge commit
  `1bb76b1c9dbfd1943cb65ad0176f859417d52eec`. Local `main` and `origin/main`
  both resolve to that merge commit after fast-forward.
- Post-merge Notion sync is complete. SS-010 is marked `5. Done`, PR #11 is
  recorded, and a Notion comment records the merge commit and post-merge state.
- A new Codex session prompt for SS-011 is available at
  `docs/agent-guidance/ss-011-new-codex-session-prompt.md`.

SS-010 is complete.

## SS-011 Coordination

SS-011 is an export-, privacy-, safety/copy-, and AI-chat-prompt-sensitive
story. It will generate a downloadable Swing Card that can include selected
annotated keyframes, bounded metric outputs, warnings/limitations, and an
analysis prompt suitable for manual upload to an LLM chat interface. Treat it
as gated: Gemini researches and drafts the export/privacy/prompt
specification, Codex verifies and implements after approved planning gates, and
Claude performs adversarial QA planning plus final audit.

Acceptance criteria from Notion:

- Swing Card includes selected keyframes, metrics, warnings, and analysis
  prompt.
- Export works as PNG or PDF.
- No unapproved raw video is included.
- Output remains usable for manual upload to an LLM chat interface.

Kickoff state on 2026-06-25:

- Notion page:
  https://app.notion.com/p/375834a0c8a6813ba976c741f4837614
- Branch: `ss-011-swing-card`
- Handshake Status: `5. Done`
- Pull Request: https://github.com/ajason13/swing-sync/pull/12
- Task Type: `Feature`
- Local `main` and `origin/main` include SS-010 merge commit
  `1bb76b1c9dbfd1943cb65ad0176f859417d52eec` and post-SS-010 context/prompt
  sync commits.
- Existing untracked `docs/agent-guidance/ss-00*-new-codex-session-prompt.md`
  files remain preserved unless the user explicitly asks to clean or commit
  them.
- `git fetch origin` confirmed local `main` and `origin/main` matched at
  `c28ebbca5b0b60dc0cb54f3967e0d0150b7904c7`; branch
  `ss-011-swing-card` was created from that commit.
- Notion moved to `1. Spec Drafting (Gemini)`.
- No SS-011-specific test case existed in Notion. Dedicated `SS-TC-015` was
  created for downloadable PNG/PDF Swing Card export, selected annotated
  keyframes, bounded metric and warning inclusion, no raw-video inclusion,
  prompt-copy safety, privacy boundaries, and manual LLM upload usability.
- The Gemini Chat Deep Research handoff is
  `docs/handoffs/ss-011-gemini-chat-deep-research-prompt.md`. It uses a
  10-file maximum attachment list, embedded summaries of omitted prior-story
  artifacts, and a required task-specific research plan before the deep
  research run.
- Gemini Chat Deep Research returned a broad export architecture report.
  Codex dispositioned it in `docs/ss-011-research-disposition.md`, adopting
  the zero-dependency Canvas 2D PNG direction, same-origin/local draw inputs,
  user-initiated Blob/Object URL downloads, bounded text wrapping, and
  browser-native print/save-to-PDF path while revising or rejecting hard memory
  cleanup timing guarantees, app-generated PDF binaries, `vitest-canvas-mock`,
  free-form metric schemas, numeric confidence values, `Math.random`
  filenames, absolute privacy/security claims, dependency additions,
  automatic AI upload, and local card history.
- The candidate normative specification is
  `docs/ss-011-preimplementation-spec.md`. It defines
  `src/swing-card-contract.ts`, `src/swing-card-generator.ts`, local PNG
  composition via `toBlob("image/png")`, browser print/save-to-PDF via
  `window.print()`, object URL cleanup, bounded prompt copy for manual LLM
  upload only, no raw-video inclusion, no persistence, no telemetry, no remote
  sharing, no provider changes, and no new dependencies.
- The self-contained Claude QA planning handoff is
  `docs/ss-011-claude-qa-planning-prompt.md`.
- Notion moved to `2. QA Planning (Claude)`.
- Claude QA planning returned FAIL with ten specification blockers:
  undefined `SwingCardPngResult`, conflated content warnings versus PNG export
  failures, contradictory metric-payload prose, undefined missing-overlay
  behavior, unenforced PNG/print parity, permissive alternate overlay-renderer
  wording, unspecified canvas caps, underspecified object URL lifecycle,
  unpinned filename date source, and unpinned `PoseOverlayRenderResult` import.
- Claude QA response is recorded in
  `docs/ss-011-claude-qa-response.md`.
- `docs/ss-011-preimplementation-spec.md` now addresses B1-B10 with a
  discriminated PNG result union, separate content-warning and PNG-failure
  types, strict `SwingMetricPayload | undefined`, mandatory
  `renderPoseOverlayFrame` reuse, `Keyframe unavailable` fallback for missing
  overlays, shared `renderSwingCardPrintSurface(content)`, exact canvas caps,
  module-scoped object URL lifecycle rules, wall-clock export-click filename
  dates, imported SS-010 `PoseOverlayRenderResult`, a content warning decision
  table, and focused test requirements.
- Focused Claude QA re-review handoff:
  `docs/ss-011-claude-qa-rereview-prompt.md`.
- Claude focused QA re-review returned FAIL with one narrow new blocker, B11:
  `SwingCardPngResult.warnings` lacked an explicit invariant requiring exact
  unchanged passthrough of `content.warnings`.
- Claude confirmed B1-B10 are closed.
- B11 response is recorded in
  `docs/ss-011-claude-qa-rereview-response.md`.
- `docs/ss-011-preimplementation-spec.md` now states that
  `SwingCardPngResult.warnings` must be exactly `content.warnings` in both
  success and error variants, and `composeSwingCardPng` must not add, remove,
  reorder, filter, or recompute warning codes before returning them. Unit test
  requirements now cover unchanged passthrough for both result branches.
- B11-only focused re-review handoff:
  `docs/ss-011-claude-qa-rereview-2-prompt.md`.
- Claude B11-only focused QA re-review returned PASS. B1-B11 are closed with
  concrete, testable mechanisms, and Claude authorized moving SS-011 to
  `3. In Development (ChatGPT)`.
- Notion moved to `3. In Development (ChatGPT)`.
- Implementation completed for the approved SS-011 scope:
  `src/swing-card-contract.ts`, `src/swing-card-generator.ts`,
  `test/unit/swing-card-generator.test.ts`, Swing Card export wiring in
  `src/main.ts`, print/export styles in `src/styles.css`, workflow copy in
  `src/workflow.ts`, and smoke coverage in `test/smoke/app.spec.ts`.
- The implementation adds local PNG composition, browser print/save-to-PDF,
  prompt copy, selected annotated keyframe rendering through SS-010
  `renderPoseOverlayFrame`, deterministic content warnings, exact PNG result
  failure variants, crypto-based sanitized filenames, module-scoped object URL
  cleanup, print-surface parity, and export-control busy guards.
- No raw-video export, remote sharing, telemetry, remote logging, remote review,
  cloud storage, SDK/provider/model/asset changes, new workers, new
  dependencies, local card history, or public serving behavior was added.
- Runtime observability is intentionally unchanged/deferred for SS-011: no new
  logs, traces, analytics, telemetry, or remote diagnostics were added because
  acceptance criteria cover local user-initiated export rather than diagnostics.
- Post-implementation verification passed after the final all-selected-keyframe
  renderer fix: `npm run test:unit -- swing-card-generator` (13 tests),
  `npm run test:unit` (101 tests across 10 files), `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, and `git diff --check`.
- `npm run test:smoke` was attempted earlier but hung before useful progress in
  this local repo state. Codex also ran a built-preview Chromium verification
  against the current UI flow at `390x844`: sanitized PNG
  `swing-sync-card-20260626-f8a09047.png`, 398432 bytes, print invoked once,
  no horizontal overflow, minimum export button height 46px, zero external
  requests, zero export-time requests, zero IndexedDB/cache entries, and zero
  sensitive console output under the SS-011 check regex.
- Final Claude implementation audit handoff:
  `docs/ss-011-claude-audit-prompt.md`.
- Notion moved to `4. Final Audit (Claude)` with the implementation summary and
  verification evidence recorded in a comment.
- Claude final implementation audit returned FAIL with two implementation-stage
  blockers after confirming B1-B11 were correctly implemented:
  - B12: `prepareSwingCardContent` could silently fabricate phase-to-frame
    mappings on assignment length mismatch.
  - B13: the committed smoke suite was unconfirmed because prior
    `npm run test:smoke` attempts were run under shell-default Node 24 instead
    of repo-required Node 22 and appeared to hang.
- B12 fix: Swing Card export preparation now uses
  `getCompleteSwingCardAssignments()`, which returns assignments only when
  `isValidCorrection(assignments)` accepts them. Unsupported or incomplete
  review states now export `Keyframe unavailable` slots and force
  `PHASE_REVIEW_REQUIRED` rather than falling back to positional phase/sample
  mappings.
- B12 regression coverage: `test/smoke/app.spec.ts` now includes
  `keeps Swing Card keyframes unavailable until phase review is complete`,
  which opens export from an unsupported review state, checks phase-review
  warning copy, stubs `window.print`, inspects the print DOM at print-call time,
  and asserts eight unavailable keyframe placeholders.
- B13 fix: verification now runs with Node 22 from `.nvmrc`; under Node 22,
  `npm run test:smoke -- --list` completes and the full committed smoke suite
  passes. A stale smoke assertion after Export -> Review navigation was updated
  from removed copy (`Video and pose preview`) to the current `Review` heading
  and `Annotated keyframes` surface.
- Claude audit response: `docs/ss-011-claude-audit-response.md`.
- Focused Claude B12/B13 re-review handoff:
  `docs/ss-011-claude-audit-rereview-prompt.md`.
- Post-fix verification with Node 22 passed:
  `npm run test:unit -- swing-card-generator` (13 tests),
  `npm run test:unit` (101 tests across 10 files),
  `npm run test:smoke -- --list` (32 tests listed),
  `npm run test:smoke -- --project=desktop-chromium --grep "Swing Card"`
  (2 tests), `npm run test:smoke` (32 tests across desktop and mobile
  Chromium), `npm run build`, `npm run compliance:verify`,
  `npm run safety:verify`, `npm run privacy:verify`, and `git diff --check`.
- Claude focused final-audit re-review returned PASS for B12 and B13. Claude
  confirmed B12 is closed by the `isValidCorrection` assignment gate plus
  unavailable-keyframe/`PHASE_REVIEW_REQUIRED` regression coverage, and B13 is
  closed by running the committed smoke suite under Node 22. No new blockers
  were introduced.
- Claude focused final-audit re-review response:
  `docs/ss-011-claude-audit-rereview-response.md`.
- Pull request created: https://github.com/ajason13/swing-sync/pull/12.
- Notion `Pull Request` property was updated to PR #12, with a PR-created
  comment recorded.
- GitHub compliance check passed for PR #12.
- PR #12 merged on 2026-06-27 at merge commit
  `31548a43421dcd45a469d4c6282a8c102b8f1185`. Local `main` and `origin/main`
  both resolve to this merge commit after fast-forward.
- Post-merge Notion sync is complete. SS-011 is marked `5. Done`, PR #12 is
  recorded, and a Notion comment records the merge commit and post-merge state.
- A Notion search for `SS-012 Swing Sync` did not surface a next SS-012 task
  page. The next task should be selected from the Notion board at the start of
  the next session instead of guessed from search results.

SS-011 is complete.

## SS-008 Coordination

SS-008 is safety- and coaching-sensitive schema work. It defines the contract
future metric generation and review features may consume. Gemini Chat Deep
Research performs research and draft-specification support with attached
repository files, Codex verifies research and implements only after approved
planning gates, and Claude performs adversarial QA planning plus final audit.
The Notion tracker status is `5. Done`.

Acceptance criteria:

- Schema includes metric name, value, units, phase, handedness, confidence, and
  limitation notes.
- Aligns naming with CaddieSet-inspired concepts without overclaiming
  equivalence.
- Has fixtures for valid, missing, and low-confidence data.

Kickoff state on 2026-06-18:

- Local `main` and `origin/main` were confirmed at `186ae4e`; PR #8 merge
  commit `3cd1d3eefe4af94d95369771d36d8c09d557f8c1` is an ancestor.
- `git diff --check` passed before branch creation.
- Branch `ss-008-metric-schema` was created from verified `main`.
- The intentional untracked story-guidance files for SS-004, SS-006, SS-007,
  and SS-008 are preserved.
- Notion reconfirmed branch `ss-008-metric-schema`, initial `0. Backlog`
  status, empty PR, and the acceptance criteria above. The task moved to
  `1. Spec Drafting (Gemini)`.
- No SS-008-specific test case existed in Notion. Dedicated `SS-TC-012` was
  created for accurate acceptance coverage of metric schema validation,
  bounded vocabulary, synthetic valid/missing/low-confidence fixtures,
  CaddieSet naming boundaries, and privacy/safety/protected-boundary checks.
- The first `agy`/Antigravity CLI route returned no artifacts before the user
  identified likely rate-limit exhaustion. Per the 2026-06-18 Multi-Agent SDLC
  Framework routing note, SS-008 is now routed through Gemini Chat Deep
  Research with attached files instead of local `agy`.
- The Gemini Chat Deep Research handoff is
  `docs/handoffs/ss-008-gemini-chat-deep-research-prompt.md`. It uses a lean
  steering prompt, explicit file-attachment list, and a required task-specific
  research plan before the deep research run.
- Gemini Chat Deep Research returned a broad report. Codex dispositioned it in
  `docs/ss-008-research-disposition.md`, rejecting the malformed schema and
  overclaims while revising the useful zero-dependency, versioned-payload, and
  synthetic-fixture recommendations.
- The candidate normative specification is
  `docs/ss-008-preimplementation-spec.md`.
- The self-contained Claude QA planning handoff is
  `docs/ss-008-claude-qa-planning-prompt.md`.
- Notion moved to `2. QA Planning (Claude)`.
- Claude QA planning returned FAIL with four blockers: missing
  status/confidence pairing, optional per-metric CaddieSet disclaimer, undefined
  recursive prohibited-key strategy, and undefined off-version validation.
- `docs/ss-008-preimplementation-spec.md` now addresses the blockers with an
  explicit status/confidence compatibility table, required payload-level
  `caddieSetEquivalence: "not-equivalent"`, exact case-sensitive recursive
  prohibited-key list, exact `schemaVersion: "0.1.0"` rejection rules, and
  required tests for finite zero, explicit non-finite values, empty/duplicate
  limitation notes, and case/whitespace-sensitive enum rejection.
- Claude QA response: `docs/ss-008-claude-qa-response.md`.
- Focused re-review handoff:
  `docs/ss-008-claude-qa-rereview-prompt.md`.
- Claude focused QA re-review returned PASS. B1-B4 are closed and Claude
  authorized moving to `3. In Development (ChatGPT)`.
- Implementation completed for schema/test scope only:
  `docs/schemas/swing-metric-payload-v0.1.0.schema.json`,
  `src/metric-contract.ts`, `test/fixtures/metrics/valid-payload.json`,
  `test/fixtures/metrics/missing-payload.json`,
  `test/fixtures/metrics/low-confidence-payload.json`, and
  `test/unit/metric-contract.test.ts`.
- The implementation adds a versioned payload wrapper, required
  `caddieSetEquivalence: "not-equivalent"`, bounded metric/unit/phase/
  handedness/value/confidence/limitation vocabularies, status/confidence
  pairing, exact `0.1.0` version acceptance, exact case-sensitive recursive
  prohibited-key rejection, and deterministic synthetic fixtures.
- Claude final implementation audit returned FAIL with three narrow blockers:
  unconstrained `impact-not-directly-observed` limitation-code usage, missing
  itemized negative tests for `caddieSetEquivalence`, and insufficiently
  explicit low-evidence impact fixture coverage.
- Final audit response: `docs/ss-008-claude-audit-response.md`.
- B5-B7 fixes are implemented: `impact-not-directly-observed` is valid only
  for `impact-spine-line-angle` in the TypeScript validator, JSON Schema,
  spec, and tests; `caddieSetEquivalence` now has omitted/wrong/empty/non-string
  rejection assertions; and the low-confidence fixture's
  `impact-spine-line-angle` entry is asserted directly.
- No runtime UI, metric calculation, export, persistence, telemetry, remote
  logging, remote review, dependency, model/SDK/asset, worker, or public schema
  serving behavior was added.
- Pre-audit verification passed: `npm run test:unit -- metric-contract`
  (10 tests), `npm run test:unit` (50 tests across 7 files),
  `npm run build`, `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, `npm run sbom:generate`,
  `npm audit --omit=dev` (0 vulnerabilities), and `git diff --check`.
- Focused post-fix verification passed: `npm run test:unit -- metric-contract`
  (11 tests), `npm run test:unit` (51 tests across 7 files), and
  `git diff --check`.
- `npm run sbom:generate` changed only generated metadata
  (UUID/timestamp/npm tool version) because no production dependency changed;
  that metadata churn was restored after verification.
- Final audit prompt: `docs/ss-008-claude-audit-prompt.md`.
- Focused final re-review prompt:
  `docs/ss-008-claude-final-rereview-prompt.md`.
- Claude focused final re-review returned PASS. B5-B7 are closed, no new
  blockers were introduced, and Claude signed off that Codex may prepare the
  PR. Response: `docs/ss-008-claude-final-rereview-response.md`.
- PR opened: https://github.com/ajason13/swing-sync/pull/9.
- Post-PASS PR verification passed: `npm run test:unit` (51 tests across
  7 files), `npm run build`, `npm run compliance:verify`,
  `npm run safety:verify`, `npm run privacy:verify`,
  `npm run license:audit`, `npm run verify:bundle-license-fixture`,
  `npm run sbom:generate`, `npm audit --omit=dev` (0 vulnerabilities), and
  `git diff --check`. `npm run sbom:generate` again changed only generated
  SBOM serial/timestamp metadata, and that metadata churn was restored.
- Observability decision at kickoff: no runtime behavior is approved yet.
  Prefer no new observability; if diagnostics are proposed, they must not
  contain metric values, confidence values, limitation text, phase labels,
  handedness, timestamps, landmarks, media characteristics, or identifiers.

SS-008 is complete. PR #9 is merged, Notion is marked `5. Done`, and local
`main` has been fast-forwarded to the merge commit.

## SS-006 Coordination

SS-006 is privacy-sensitive runtime work controlling decoded frame images and
derived landmark sets. Gemini researches/specifies, Codex verifies and
implements, and Claude performs pre-implementation QA planning plus final
adversarial audit.

Acceptance criteria:

- Video frames are sampled deterministically.
- Processing can be cancelled or retried.
- Queue handles long, short, portrait, and landscape videos.
- Output includes timestamps, frame images, and landmark sets.

Kickoff state on 2026-06-12:

- Local and `origin/main` were confirmed at `2a48417`, including PR #6 merge
  `7678add`; `git diff --check` passed.
- The unrelated untracked
  `docs/agent-guidance/ss-004-new-codex-session-prompt.md` and intentional
  `docs/agent-guidance/ss-006-new-codex-session-prompt.md` are preserved.
- Notion reconfirmed branch `ss-006-frame-queue`, initial `0. Backlog` status,
  empty PR, and the acceptance criteria above. The task moved to
  `1. Spec Drafting (Gemini)`.
- `SS-TC-006` was confirmed invalid for SS-006 because it describes Swing Card
  export leakage. The mismatch was recorded in Notion. Dedicated `SS-TC-010`
  was created for deterministic bounded ordered processing, cancellation/retry,
  orientation/duration cases, output association, cleanup, stale-result
  rejection, and privacy-preserving diagnostics.
- The protected SS-005 boundary remains exact
  `@mediapipe/tasks-vision@0.10.35`, approved same-origin model/WASM assets,
  dedicated worker VIDEO-mode inference, complete returned landmark arrays,
  finite increasing timestamps, volatile local frames, resource cleanup,
  fail-closed unexpected requests, and no sensitive persistence or telemetry.
- The self-contained Gemini Deep Research handoff is
  `docs/ss-006-gemini-research-prompt.md`.
- Implementation is blocked pending Gemini response disposition, a normative
  SS-006 specification, and Claude pre-implementation QA planning PASS.
- Observability decision at kickoff: retain only local sanitized lifecycle,
  progress, cancellation, retry, and error states. Do not log frame pixels,
  landmarks, media characteristics, or user identifiers.

Next owner: Gemini Deep Research. Paste
`docs/ss-006-gemini-research-prompt.md`, then return the complete response to
Codex for primary-source verification and Adopt / Revise / Defer / Reject
disposition. Do not begin implementation.

Gemini response disposition on 2026-06-12:

- Gemini recommended even spacing, a sequential queue, generation identifiers,
  explicit bitmap ownership, full retry reconstruction, and deterministic
  adapter-based tests. Codex adopted those concepts with revisions.
- `docs/ss-006-research-disposition.md` records primary-source verification and
  explicit Adopt / Revise / Defer / Reject decisions.
- Gemini's unsupported configurable `K=20`, one-millisecond clamp rationale,
  two-bitmap bound, random UUID generation, required
  `requestVideoFrameCallback()`, sensitive console diagnostics, OOM-elimination
  claim, and permanent-destruction claim were revised or rejected.
- `docs/ss-006-preimplementation-spec.md` defines the normative candidate:
  fixed budget `8`; unique integer-millisecond timestamps; one queued/in-flight
  inference item; separate aspect-preserving previews bounded to 640 px long
  edge; maximum nine application-owned bitmaps; monotonic run generations;
  fail-closed cancellation/retry/stale rejection; volatile ordered output; and
  sanitized local-only observability.
- Claude pre-implementation QA handoff:
  `docs/ss-006-claude-qa-planning-prompt.md`.

Next owner: Claude QA planning. SS-006 must remain
`2. QA Planning (Claude)` until explicit PASS and closure of any blocking
findings. Do not begin implementation.

Claude QA planning returned FAIL on 2026-06-12 with five specification
blockers: invalid-duration guard contradiction, queue-layer `NaN`/`Infinity`
defense, failure-path bitmap cleanup, stale-check placement, and prior-worker
teardown ordering before retry.

Codex accepted and fixed all five in
`docs/ss-006-preimplementation-spec.md`. The response is recorded in
`docs/ss-006-claude-qa-response.md`; `SS-TC-010` is refined with explicit
closure evidence. Focused re-review handoff:
`docs/ss-006-claude-qa-rereview-prompt.md`.

Next owner: Claude focused QA re-review. Keep SS-006 at
`2. QA Planning (Claude)` and do not begin implementation before explicit PASS.

Claude focused QA re-review returned PASS on 2026-06-12. B1-B5 are closed,
`SS-TC-010` is sufficient, and Claude granted permission to move to
`3. In Development (ChatGPT)`. Response:
`docs/ss-006-claude-qa-rereview-response.md`.

SS-006 implementation is in progress:

- `src/frame-processing.ts` implements fixed-budget timestamp sampling,
  aspect-preserving preview sizing, ordered volatile output, monotonic run
  generations, cancellation/retry, stale rejection, and exact bitmap cleanup.
- `src/browser-frame-processing.ts` adapts local video/object URLs and the
  protected SS-005 PoseSession without changing SDK/model/assets.
- `src/main.ts` replaces the ad hoc four-frame loop with local progress,
  cancellation, failure, completion, and retry behavior.
- Focused unit coverage pins timestamp arrays, invalid-duration no-work
  behavior, orientation sizing, output ordering, failure cleanup, stale seek
  cancellation, repeated-cancel idempotence, and non-overlapping retry.
- Browser coverage validates eight-frame desktop/mobile completion and real
  initialization failure/retry while preserving SS-005 network/privacy/safety
  behavior.
- Observability impact: added only local sanitized lifecycle, progress, retry,
  completion, and stable error states. No telemetry or sensitive diagnostics.

SS-006 implementation completed on 2026-06-12 and is ready for final Claude
audit:

- Fixed-budget eight-sample deterministic queue, bounded previews, ordered
  timestamp/frame/pose output, cancellation, failure cleanup, stale rejection,
  and clean retry are implemented.
- Protected SS-005 inference remains dedicated-worker, one-frame-in-flight,
  same-origin, fail-closed, and volatile. Transfer failure now closes the
  main-owned bitmap before failing closed.
- Final verification passed on Node 22: 25 unit tests, 26 desktop/mobile
  production browser tests, build, compliance, safety, privacy, license audit,
  bundle-license fixture, approved asset hashes, one-component production SBOM,
  zero production vulnerabilities, and `git diff --check`.
- Final audit prompt: `docs/ss-006-claude-audit-prompt.md`.

Next owner: Claude final adversarial implementation audit. Keep SS-006 at
`4. Final Audit (Claude)` until explicit PASS and any required focused
re-review.

Claude final audit returned FAIL with two focused blockers. B1 was an evidence
gap: `releaseOutputs()` already closes and clears the current uncommitted
preview during invalidating cleanup. A direct cancellation/post-inference race
test now proves that ownership path. B2 was valid and is fixed:
`VideoFrameSource.dispose()` now rejects pending metadata/seek operations and
removes their listeners before media teardown.

Codex also fixed retry-during-cancel serialization and added direct unit
evidence for source disposal, current-preview cleanup, and retry sequencing.
Post-fix verification passed: 29 unit tests, 26 desktop/mobile browser tests,
full required compliance/privacy/licensing/assets/SBOM checks, zero production
vulnerabilities, and `git diff --check`.

Final audit response: `docs/ss-006-claude-audit-response.md`.
Focused final re-review prompt:
`docs/ss-006-claude-final-rereview-prompt.md`.

Next owner: Claude focused final re-review. Keep SS-006 at
`4. Final Audit (Claude)` and do not prepare the PR until focused PASS.

Claude focused final re-review returned PASS on 2026-06-12:

- B1 and B2 are closed.
- N1-N3 are closed and N4 is appropriately deferred to a separately reviewed
  future export story.
- No new blocker was introduced and the protected SS-005 boundary remains
  intact.
- PR preparation is authorized.

Next owner: Codex PR preparation. Keep SS-006 at `4. Final Audit (Claude)`
until merge; record the PR URL in Notion and this context after creation.

SS-006 pull request created on 2026-06-12:

- PR: https://github.com/ajason13/swing-sync/pull/7
- Claude focused final re-review: PASS.
- Final local verification: 29 unit tests, 26 desktop/mobile browser tests,
  build, full compliance/privacy/safety/licensing/assets/SBOM checks, zero
  production vulnerabilities, and `git diff --check`.

Next owner: PR review and CI. Keep SS-006 at `4. Final Audit (Claude)` until PR
#7 is merged; after merge, update local `main`, synchronize Notion and this
context, mark SS-006 `5. Done`, and identify the next task.

SS-006 completed on 2026-06-12:

- PR #7 merged with required compliance CI passing:
  https://github.com/ajason13/swing-sync/pull/7
- Merge commit: `9d937745fe8e446769d6806c21f8e4635bc5ad04`.
- Local `main` was fast-forwarded to the merge commit.
- Claude focused final re-review PASS, final local verification, accurate
  SS-TC-010 coverage, and Notion synchronization are complete.
- SS-006 is `5. Done`.

Next task: `SS-007 Implement swing phase detector with manual correction`.

- Branch: `ss-007-phase-detector`
- Handshake: `0. Backlog`
- Pull request: none
- Revised acceptance after Claude QA: propose a deterministic initial phase
  assignment for explicit review; allow nondecreasing shared-sample correction
  with confirmation before future metric readiness; emit accessible
  `unsupported-input`/`review-required` warnings with no automatic acceptance;
  and cover the contract with deterministic programmatic pose fixtures.
- Moving side-on browser fixture coverage is deferred to existing `SS-014` and
  is not claimed as SS-007 coverage.

Next owner: start SS-007 from updated `main`, confirm tracker/test-case
coverage, classify its coaching/safety sensitivity, and begin the required
Gemini specification workflow before implementation.

## SS-007 Coordination

SS-007 is safety- and coaching-sensitive runtime work. It converts the
protected ordered SS-006 pose outputs into named swing phases, confidence and
warnings, and a manual-review gate before future metric generation. Gemini
researches/specifies, Codex independently dispositions and implements, and
Claude performs pre-implementation QA planning plus final adversarial audit.

Kickoff state on 2026-06-13:

- Local and `origin/main` were confirmed at `b261b29`, including PR #7 merge
  `9d937745fe8e446769d6806c21f8e4635bc5ad04`; `git diff --check` passed.
- Branch `ss-007-phase-detector` was created from the verified updated main.
- The unrelated intentional untracked guidance files for SS-004, SS-006, and
  SS-007 are preserved.
- Notion reconfirmed branch `ss-007-phase-detector`, initial `0. Backlog`
  status, empty PR, and the four SS-007 acceptance criteria. The task moved to
  `1. Spec Drafting (Gemini)`.
- `SS-TC-007` was confirmed invalid for SS-007 because it describes API-backed
  coaching consent/provider notice. The mismatch is recorded in Notion.
- Existing `SS-TC-005` remains complementary broad eight-keyframe/manual-
  correction coverage but is insufficient for confidence, ambiguity,
  ordering, stale-result, provenance, fixture, and protected-queue behavior.
- Dedicated `SS-TC-011` was created for accurate SS-007 acceptance coverage.
- The self-contained Gemini Deep Research handoff is
  `docs/ss-007-gemini-research-prompt.md`.
- Implementation is blocked pending Gemini response disposition, a normative
  SS-007 specification, and Claude pre-implementation QA planning PASS.
- Observability decision at kickoff: retain local sanitized lifecycle/error
  state only. Do not add diagnostics containing landmarks, phase assignments,
  confidence, warnings, corrections, timestamps, media characteristics, or
  identifiers.

Next owner: Gemini Deep Research. Paste
`docs/ss-007-gemini-research-prompt.md`, then return the complete response to
Codex for primary-source verification and Adopt / Revise / Defer / Reject
disposition. Do not begin implementation.

Gemini response disposition on 2026-06-13:

- Gemini proposed GolfDB event vocabulary, posture-cost heuristics, dynamic-
  programming alignment, numeric confidence, a manual timeline, and synthetic
  pose fixtures. Codex adopted the bounded vocabulary, separate provenance,
  active-generation binding, fail-closed ambiguity, accessible review, and
  volatile local state with revisions.
- `docs/ss-007-research-disposition.md` records primary-source/repository
  verification and explicit Adopt / Revise / Defer / Reject decisions.
- Gemini's unsupported posture formulas, interpolation, clipping, closest-
  person selection, numeric thresholds, automatic metric-readiness unlock,
  worker/framework additions, and absolute performance/privacy claims were
  rejected.
- The protected eight-sample input exposes a blocking contradiction: eight
  unique ordered samples assigned to eight ordered phases permits only identity
  mapping and no meaningful correction.
- Numeric sufficient-confidence detection is also blocked because no approved
  moving side-on fixture, representative validation set, heuristic validation,
  or calibration evidence exists.
- `docs/ss-007-preimplementation-spec.md` defines the conservative blocked
  candidate and the required allocation, confidence/acceptance, and fixture
  decisions.
- Claude pre-implementation QA handoff:
  `docs/ss-007-claude-qa-planning-prompt.md`.

Next owner: Claude QA planning. SS-007 must remain
`2. QA Planning (Claude)` until explicit PASS and closure of the allocation,
confidence/acceptance, and moving side-on fixture blockers. Do not begin
implementation.

Claude first QA planning returned FAIL on 2026-06-13 with three blockers:
unresolved allocation/correction policy, unsatisfiable sufficient-confidence
acceptance, and unavailable moving side-on browser fixture coverage.

Codex accepted and revised all three:

- B1 adopts nondecreasing repeated sample references for meaningful correction
  while preserving ordered phases.
- B2 revises acceptance to a deterministic provisional initial assignment plus
  mandatory explicit review; numeric confidence and automatic acceptance remain
  prohibited.
- B3 revises SS-007 fixture acceptance to deterministic programmatic pose
  fixtures and explicitly defers moving side-on browser fixture policy and
  coverage to existing `SS-014`.
- `undeclared` inputs fail closed, unreachable `insufficient-evidence` was
  removed, and stale indices clear immediately with owning output release.
- Response: `docs/ss-007-claude-qa-response.md`.
- Focused re-review handoff:
  `docs/ss-007-claude-qa-rereview-prompt.md`.

Next owner: Claude focused QA re-review. Keep SS-007 at
`2. QA Planning (Claude)` and do not begin implementation before explicit PASS.

Claude focused QA re-review returned PASS on 2026-06-13:

- B1-B3 are closed and SS-007 may move to `3. In Development (ChatGPT)`.
- Required pre-merge revisions: enumerate stable sanitized warning codes; add
  matching/mismatched pose/request timestamp tests; and align `SS-TC-011` with
  those cases.
- Response: `docs/ss-007-claude-qa-rereview-response.md`.

SS-007 implementation is in progress under the approved manual-review-only
contract. Observability remains intentionally unchanged: local sanitized
lifecycle/error state only, with no phase assignments, evidence, warnings,
corrections, timestamps, landmarks, media characteristics, or identifiers in
diagnostics.

SS-007 implementation completed on 2026-06-13 and is ready for final Claude
audit:

- `src/phase-review.ts` implements deterministic identity initial review
  layout, typed stable warning codes, strict protected-input validation,
  nondecreasing shared-index correction, separate provenance, explicit
  confirmation, and generation-bound stale rejection.
- `src/main.ts` integrates explicit declarations and accessible review controls
  after completed SS-006 processing while clearing phase state before cancel,
  retry, new file, navigation, close, and owning-output release.
- No protected SS-005/SS-006 module, dependency, model, asset, network,
  persistence, export, metric, coaching, or observability boundary changed.
- R1-R3 are closed: warning codes are enumerated; matching/mismatched pose/
  request timestamps are tested; and `SS-TC-011` records those cases.
- Final clean verification passed: 40 unit tests, 28 desktop/mobile browser
  tests, build, compliance, safety, privacy, license audit, bundle-license
  fixture, approved asset hashes, one-component production SBOM, zero
  production vulnerabilities, and `git diff --check`.
- Final audit prompt: `docs/ss-007-claude-audit-prompt.md`.

Next owner: Claude final adversarial implementation audit. Keep SS-007 at
`4. Final Audit (Claude)` until explicit PASS and any required focused
re-review. Do not prepare the PR before audit PASS.

Claude final audit returned PASS on 2026-06-17 and cleared SS-007 for PR
preparation. Claude identified no blocking findings and five non-blocking
recommendations. Codex applied the cheap defensive/test clarifications before
PR:

- added an explicit finite guard for `requestedTimestampMs`;
- confirmed and tested the review status uses `aria-live="polite"`;
- added explicit over-count sample coverage;
- split setup confirmation into a named fail-closed unit test; and
- added explicit over-count correction coverage.

Final audit response: `docs/ss-007-claude-audit-response.md`.

Post-audit verification passed on Node 22: 40 unit tests, 28 desktop/mobile
browser tests, build, compliance, safety, privacy, license audit,
bundle-license fixture, approved asset hashes, one-component production SBOM,
zero production vulnerabilities, and `git diff --check`.

Next owner: Codex PR preparation. Keep SS-007 at `4. Final Audit (Claude)`
until PR checks and merge complete; record the PR URL in Notion and this
context after creation. Do not mark Done before post-merge repository, Notion,
and context synchronization.

SS-007 pull request created on 2026-06-17:

- PR: https://github.com/ajason13/swing-sync/pull/8
- Branch: `ss-007-phase-detector`
- Claude final implementation audit: PASS.
- Final local verification: 40 unit tests, 28 desktop/mobile browser tests,
  build, full compliance/privacy/safety/licensing/assets/SBOM checks, zero
  production vulnerabilities, and `git diff --check`.

Next owner: PR review and CI. Keep SS-007 at `4. Final Audit (Claude)` until
PR #8 is merged; after merge, update local `main`, synchronize Notion and this
context, mark SS-007 `5. Done`, and identify the next task.

SS-007 completed locally on 2026-06-17:

- PR #8 merged with required compliance CI passing:
  https://github.com/ajason13/swing-sync/pull/8
- Merge commit: `3cd1d3eefe4af94d95369771d36d8c09d557f8c1`.
- Local `main` is fast-forwarded to the merge commit.
- Claude final implementation audit returned PASS.
- Required local verification and GitHub compliance checks passed.
- Notion synchronization completed after OAuth reauthorization: SS-007 is
  marked `5. Done`, PR #8 is recorded, and merge/verification evidence is
  commented on the task.

Next task: `SS-008 Define Swing Sync metric JSON schema`.

- Branch: `ss-008-metric-schema`
- Handshake: `0. Backlog`
- Pull request: none
- Acceptance: schema includes metric name, value, units, phase, handedness,
  confidence, and limitation notes; naming aligns with CaddieSet-inspired
  concepts without overclaiming equivalence; fixtures cover valid, missing,
  and low-confidence data.
- Existing known deferred work includes `SS-014 Create fixture swing dataset
  policy and test fixtures`, which owns moving side-on browser fixture coverage
  deferred from SS-007.

## Completed Foundation

SS-001 established the project compliance baseline:

- Apache-2.0 root license and project NOTICE.
- Dependency license policy in `docs/licensing.md`.
- Model licensing placeholder and no-model-binary policy in `docs/models-licensing.md`.
- Root `THIRD_PARTY_NOTICES.md`.
- CycloneDX SBOM generation to `docs/sbom.json`.
- GitHub Actions compliance workflow on Node 22.
- Synthetic license fixtures for GPL, MPL, and MIT policy checks.
- Production-scoped NOTICE aggregation with deterministic fixture validation.
- Bundle license validation with a synthetic bundled GPL package.

## Verification Baseline

PR #1 passed GitHub Actions:

- Workflow: `Dependency and License Compliance`
- Run: https://github.com/ajason13/swing-sync/actions/runs/26996587662
- Result: success

Expected local commands:

```bash
nvm use
npm ci
npm run license:audit
npm run verify:bundle-license-fixture
npm run sbom:generate
npm run build
npm run compliance:verify
```

## Next Task

`SS-005 Integrate MediaPipe Pose Landmarker in browser video mode` is next in
the delivery workflow on branch `ss-005-mediapipe-pose`.

Acceptance criteria from Notion:

- Pose Landmarker loads without blocking the UI.
- Landmarks are extracted for fixture video frames.
- Confidence/visibility metadata is retained.
- Network activity is not required after model assets are available.

SS-005 is a sensitive model/SDK, privacy, licensing, and compliance story.
Gemini research/spec disposition and Claude QA planning are required before
implementation. The current `SS-TC-005` Notion test case describes swing-phase
correction rather than Pose Landmarker integration and must be corrected or
replaced before claiming acceptance coverage.

SS-005 coordination status through 2026-06-07:

- Local `main` was confirmed current at `bf650f2`, including PR #5 merge
  `1d4aaea` and post-merge context commit `57cda37`.
- Branch `ss-005-mediapipe-pose` was created from updated `main`.
- Notion acceptance criteria, branch, empty PR field, and initial
  `0. Backlog` status were reconfirmed. The task moved to
  `1. Spec Drafting (Gemini)`.
- `SS-TC-005` was confirmed invalid for this story. `SS-TC-001` provides
  complementary local extraction/no-upload coverage but does not cover all
  SS-005 criteria. Dedicated `SS-TC-009` was created for non-blocking loading,
  metadata retention, timestamps, cleanup, and post-asset network assertions.
- The self-contained Gemini Deep Research handoff is
  `docs/ss-005-gemini-research-prompt.md`.
- `docs/ss-005-research-disposition.md` records initial primary-source checks
  and Codex Adopt / Revise / Defer / Reject decisions after the Gemini
  response.
- Research handoff commit: `b0a6dca` (`Prepare SS-005 research handoff`).
- Pre-handoff verification passed on Node 22: `npm run build`,
  `npm run compliance:verify`, and `git diff --check`.
- Gemini returned a conditional-GO proposal, but Codex rejected its conclusion
  that every blocker was resolved. Current MediaPipe terms explicitly describe
  provider metrics and informed-consent responsibility; the inspected exact
  0.10.35 npm tarball contains compiled WASM and lacks packaged LICENSE/NOTICE
  files; explicit model redistribution/local-serving/caching rights were not
  established; and no generated fixture/provenance exists.
- Exact `@mediapipe/tasks-vision@0.10.35` and Pose Landmarker Full float16
  version 1 are blocked candidates, not approved dependencies/assets.
- `docs/models-licensing.md`, `docs/licensing.md`, and
  `docs/privacy-architecture.md` record the current provider-metrics,
  compiled-binary, model-rights, consent, and network-behavior gates.
- Claude pre-implementation QA-planning handoff:
  `docs/ss-005-claude-qa-planning-prompt.md`.
- Notion moved to `2. QA Planning (Claude)`. Implementation remains blocked
  pending Claude's response and closure of every implementation-start blocker.
- Gemini disposition and Claude QA-planning handoff commit: `48a7376`.
- Claude QA Planning returned FAIL with six implementation-start blockers.
  Codex accepted the provider-metrics, compiled-binary, model-rights, fixture,
  worker-contract, responsiveness-contract, and tracker-coverage concerns while
  revising technically overbroad recommendations.
- `docs/ss-005-preimplementation-spec.md` now defines the normative scope,
  conservative maintainer decisions, exact candidate result schema, worker
  protocol, fixture provenance, network phases, responsiveness behavior, and
  implementation-start gate.
- Exact 0.10.35 API verification corrected the metadata contract: returned
  normalized/world landmarks expose `x`, `y`, `z`, and `visibility`, but not
  per-landmark `presence`. Presence remains a configured threshold.
- `docs/ss-005-claude-qa-response.md` records each finding as accepted, revised,
  or fixed. SS-005 remains `2. QA Planning (Claude)`.
- `SS-TC-009` was revised in Notion to match the exact candidate API, worker
  contract, network phases, fixture prerequisite, responsiveness behavior, and
  cleanup/privacy coverage.
- Focused Claude QA re-review handoff:
  `docs/ss-005-claude-qa-rereview-prompt.md`.
- Post-Claude-response Node 22 verification passed: `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, `npm run sbom:generate`, and
  `git diff --check`.
- Claude QA findings response and focused re-review handoff commit: `4d616ee`.
- Claude focused QA re-review returned FAIL while confirming the revised
  technical specification is sound. Worker contract, responsiveness contract,
  revised `SS-TC-009`, absence of returned per-landmark presence, and wrapper
  timestamp behavior are closed.
- Four blockers remain open: provider metrics decision, compiled-binary
  obligations/notices, model rights/delivery, and an approved empirically
  validated fixture/provenance record. Fixture validation depends on resolution
  of the provider/model blockers.
- On 2026-06-10, the maintainer supplied a response attributed to Google stating
  that the current Web SDK has no telemetry, future aggregated usage/performance
  telemetry is planned, current Web SDKs are Apache-2.0, and the exact Pose
  Landmarker Full float16 version 1 URL is Apache-2.0.
- `docs/ss-005-google-provider-response.md` records the response and Codex
  disposition. Public MediaPipe issue #6306 and collaborator response comment
  `4673728357` provide durable provenance and explicitly scope the questions to
  exact `@mediapipe/tasks-vision@0.10.35` and the exact model URL. Explicit
  maintainer compliance approval was recorded on 2026-06-11.
- Proposed exact-version policy: pin `@mediapipe/tasks-vision@0.10.35`, require
  fresh review for every upgrade, fail closed on any unexpected external
  request, distribute Apache-2.0 text and third-party attribution, and vendor
  the exact model same-origin with a pinned hash. Runtime provider fetch is not
  approved; service-worker caching remains separate.
- Google provider-response evidence/disposition commit: `5b22e5d`.
- On 2026-06-11, the maintainer explicitly approved reliance on Google's public
  response for exact `@mediapipe/tasks-vision@0.10.35`, its packaged compiled
  artifacts, and the exact Pose Landmarker Full float16 version 1 model. The
  maintainer approved same-origin model vendoring/serving, Apache-2.0 license
  and attribution handling, fail-closed unexpected-network behavior, and fresh
  review before every SDK upgrade. B-1, B-2, and B-3 are closed.
- Gate B-4 is closed. The approved fixture is
  `test/fixtures/pose-landmarker/mannequin-golf-address.webm`, deterministically
  derived from a committed AI-generated faceless wooden-mannequin source.
  `test/fixtures/pose-landmarker/PROVENANCE.md` records the prompt, no-real-
  person declaration, FFmpeg 8.1.1 derivation, hashes, Apache-2.0 output
  decision, and exact-model VIDEO-mode validation.
- Disposable validation with exact `@mediapipe/tasks-vision@0.10.35` and the
  exact approved model returned one complete 33-normalized-landmark and
  33-world-landmark pose at 0, 500, 1000, and 1500 ms. The dependency and model
  remained outside the repository during validation.
- Third focused pre-implementation Claude QA prompt:
  `docs/ss-005-claude-qa-third-review-prompt.md`. The prior focused re-review
  prompt is marked superseded and must not be pasted.
- `docs/ss-005-claude-qa-rereview-response.md` records the focused result.
- The pre-implementation spec now tracks the deferred production response to an
  observed provider-metrics request. No behavior may silently allow, block, or
  ignore it before the provider decision is approved.
- Post-focused-re-review Node 22 verification passed: `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, `npm run sbom:generate`, and
  `git diff --check`.
- Focused Claude QA re-review result commit: `c4f961e`.
- Post-disposition Node 22 verification passed: `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, `npm run sbom:generate`, and
  `git diff --check`.
- No SDK dependency, model/WASM asset, fixture video, runtime implementation,
  or asset fetch/cache behavior has been added.
- Observability decision: use only local, sanitized lifecycle/error states
  needed to debug initialization and inference. Do not log raw frames,
  landmarks, media characteristics, or sensitive user data.

Next owner: Claude QA. Perform the third focused pre-implementation review of
the closed provider, licensing, model-delivery, and fixture gates. Do not begin
application implementation before Claude PASS.

Claude returned PASS on 2026-06-11. All implementation-start blockers B-1
through B-4 are closed and SS-005 may move to `3. In Development (ChatGPT)`.
The response is recorded in
`docs/ss-005-claude-qa-third-review-response.md`. Implementation must manually
provide auditable MediaPipe notice/attribution, verify the generated fixture
terms before release, preserve fail-closed unexpected-network handling, and
complete the full SS-TC-009 verification matrix before final audit.

Next owner: Codex implementation and verification on
`ss-005-mediapipe-pose`.

SS-005 implementation completed on 2026-06-11 and is ready for final Claude
audit:

- Exact `@mediapipe/tasks-vision@0.10.35`, packaged WASM, and approved Pose
  Landmarker Full float16 version 1 model are vendored and served same-origin.
- Dedicated worker VIDEO-mode inference preserves complete normalized/world
  landmarks and returned visibility, validates media timestamps, applies
  one-frame backpressure, closes transferred bitmaps, and fails closed.
- Existing safety acknowledgement remains required. Local video object URLs
  are revoked, video/frame/landmark persistence is absent, and CSP-blocked
  unexpected external requests visibly terminate the active session.
- Manual MediaPipe attribution is aggregated into production notices. Exact
  model/WASM hashes and the exact MediaPipe SBOM component are verified.
- Generated fixture terms review is recorded in its provenance file.
- Observability impact: intentionally limited to local UI state and sanitized
  stable error codes; no telemetry or sensitive diagnostics were added.
- Verification passed on Node 22: 9 unit tests, 22 desktop/mobile production
  browser tests, build, compliance, safety, privacy, license audit,
  bundle-license fixture, exact asset hashes, one-component production SBOM,
  production notice inspection, zero production audit vulnerabilities, and
  `git diff --check`.
- Final audit prompt: `docs/ss-005-claude-audit-prompt.md`.

Next owner: Claude final adversarial implementation audit. Story must remain
`4. Final Audit (Claude)` until explicit PASS.

Claude returned final-audit PASS on 2026-06-11 and permitted PR preparation,
with eight non-blocking findings. Codex applied focused fixes before PR:

- removed misleading unreachable worker-side backpressure code;
- removed the invented missing-visibility fallback;
- made repeated session failure signals idempotent;
- added worker `messageerror` and repeated-failure unit coverage;
- pinned Vite ES worker output;
- documented timestamp-deduplication and asynchronous teardown ownership; and
- added the missing offline-from-start positive browser test.

Post-fix verification passed: 11 unit tests, 24 desktop/mobile production
browser tests, build, compliance, safety, privacy, license audit,
bundle-license fixture, exact asset hashes, one-component production SBOM,
zero production vulnerabilities, and `git diff --check`.

Final audit response: `docs/ss-005-claude-audit-response.md`.
Focused re-review prompt: `docs/ss-005-claude-final-rereview-prompt.md`.

Next owner: Claude focused final re-review. Keep SS-005 at
`4. Final Audit (Claude)` and do not create the PR until focused PASS.

Claude returned focused final re-review PASS on 2026-06-11. All focused fixes
were accepted, no regression or new blocker was identified, the
offline-from-start positive test was accepted as closing the highest-priority
network gap, and Claude explicitly authorized PR preparation.

Focused response:
`docs/ss-005-claude-final-rereview-response.md`.

Next owner: Codex PR preparation. Keep SS-005 at `4. Final Audit (Claude)`
until PR checks and merge complete; do not mark Done before post-merge
repository, Notion, and context synchronization.

SS-005 PR created on 2026-06-11:

- PR #6: https://github.com/ajason13/swing-sync/pull/6
- Branch: `ss-005-mediapipe-pose`
- Claude final audit: PASS.
- Claude focused final re-review after fixes: PASS.
- Verification recorded in the PR: 11 unit tests, 24 desktop/mobile production
  browser tests, build, compliance, safety, privacy, license audit,
  bundle-license fixture, exact asset hashes, one-component production SBOM,
  zero production vulnerabilities, and `git diff --check`.
- PR records exact SDK/model terms, fixture provenance, observed network
  behavior, deferred work, and intentionally privacy-limited observability.

Next owner: GitHub PR checks and merge review. Keep SS-005 at
`4. Final Audit (Claude)` until PR #6 is merged, then update local `main`,
Notion, and this file before moving to `5. Done`.

SS-005 completed on 2026-06-11:

- PR #6 merged: https://github.com/ajason13/swing-sync/pull/6
- Merge commit: `7678add7de6b946cc00328d0bef83772b1a11576`
- Local `main` fast-forwarded to the merge commit.
- Claude final implementation audit and focused final re-review both returned
  PASS.
- Required local verification and GitHub compliance checks passed.
- Notion SS-005 moved to `5. Done`.
- The unrelated untracked
  `docs/agent-guidance/ss-004-new-codex-session-prompt.md` remains preserved.

Next task: `SS-006 Build frame processing queue and sampling strategy`.

- Expected branch: `ss-006-frame-queue`
- Notion status at handoff: `0. Backlog`
- Acceptance criteria: deterministic frame sampling; cancellation/retry;
  long/short/portrait/landscape handling; and output containing timestamps,
  frame images, and landmark sets.

Next owner: begin SS-006 from updated `main` using the Swing Sync story
delivery workflow.

## Completed Task

`SS-004 Scaffold mobile-first PWA and local analysis shell` merged in
[PR #5](https://github.com/ajason13/swing-sync/pull/5) on 2026-06-06.

Acceptance criteria from Notion:

- App opens directly to capture/upload analysis flow.
- Layout works on mobile and desktop.
- Includes placeholder states for capture, processing, review, and export.
- Basic unit and smoke test setup exists.

SS-004 implementation status through 2026-06-06:

- The app opens directly to a responsive capture/upload workflow rather than a
  marketing page.
- Capture/upload, processing, review, and export are clearly labeled
  placeholders and do not access, store, analyze, export, or remotely share
  video.
- The existing local safety acknowledgement and runtime guard continue to block
  the first analysis action path until consent is checked.
- PWA scaffold metadata and a same-origin navigation shell service worker are
  included without adding remote endpoints.
- Vitest unit coverage validates the workflow model. Playwright smoke coverage
  validates the fail-closed consent path, all placeholder states, and mobile
  viewport overflow across desktop and Pixel 5 projects.
- Desktop and Pixel 5 full-page screenshots were reviewed with no text/control
  overlap; the mobile workflow navigation was revised to show all four states.
- Final Node 22 verification passed: `npm run test:unit`,
  `npm run test:smoke`, `npm run build`, `npm run compliance:verify`,
  `npm run license:audit`, `npm run verify:bundle-license-fixture`,
  `npm run sbom:generate`, `npm audit --omit=dev --audit-level=high`, and
  `git diff --check`.
- Observability is intentionally unchanged. SS-004 adds no telemetry, remote
  logging, remote calls, video handling, model behavior, or remote sharing.
- PR #5 created: https://github.com/ajason13/swing-sync/pull/5
- A self-contained voluntary Claude Chat adversarial audit handoff is available
  at `docs/ss-004-claude-audit-prompt.md`. It embeds the current runtime, PWA,
  test, configuration, protected-boundary, and verification context because
  Claude Chat has no filesystem or GitHub access.
- Claude returned `PASS WITH MINOR FIXES` and conditional merge approval. The
  three required fixes were applied: consent storage failures now fail closed,
  the runtime guard reports inline and focuses the acknowledgement, and the
  incomplete service-worker offline cache was removed.
- Blocker-linked Playwright coverage was added for storage denial and the
  accessible runtime guard. A storage-failure latch and removal-failure
  regression case ensure previously stored consent cannot remain active after a
  failed removal. Final verification after fixes passed with 12 smoke cases, 2
  unit cases, build, compliance, license, bundle-fixture, SBOM, and diff checks.
- The original audit prompt is marked superseded. Use the focused
  `docs/ss-004-claude-rereview-prompt.md` for Claude's final sign-off.
- Claude focused re-review returned PASS. All three prior blockers are closed,
  no new merge blockers were introduced, and Claude approved SS-004 for merge.
- The final GitHub Actions compliance run passed after Claude sign-off.
- PR #5 merged with merge commit
  `1d4aaea207c57f93bf7aa3c96d56cf58059d603a`.
- Observability remains unchanged because SS-004 adds no telemetry, remote
  logging, remote calls, real video handling, model behavior, or remote sharing.

## Completed Task

`SS-003 Define privacy architecture and video data lifecycle` merged in
[PR #3](https://github.com/ajason13/swing-sync/pull/3) on 2026-06-06.

SS-003 status through 2026-06-06:

- Gemini Deep Research response received and distilled into
  `docs/ss-003-research-disposition.md`.
- Primary-source checks were recorded for browser storage, OPFS, persistent
  storage, WebKit tracking prevention, CSP, and MediaPipe policy references.
- Initial Claude adversarial review returned PASS WITH MINOR FIXES: clarify the
  consent-copy cross-checks in `scripts/verify-privacy-boundaries.js` and widen
  prohibited-endpoint scanning beyond `src/main.ts`.
- Claude blocker fixes were applied: the verifier now labels inherited SS-002
  consent scaffold checks, recursively scans `src/**` and `scripts/**` while
  excluding its own pattern-list file, records Sentry as blocked pending privacy
  review, clarifies Class G scaffold scope, and defers fail-closed verifier
  assertions until a real network/API boundary exists.
- Claude focused re-review returned PASS. Both blockers are closed, no new
  blockers were introduced, and Claude approved SS-003 for PR creation.
- Final pre-PR verification passed: `npm run privacy:verify`,
  `npm run compliance:verify`, `npm run build`, and
  `git diff --cached --check`.
- PR #3 created: https://github.com/ajason13/swing-sync/pull/3
- PR #3 merged with merge commit
  `28341d6df34774805fab341f342500d583c0986b`.
- Observability remains unchanged because SS-003 adds no runtime video,
  storage, network, model, telemetry, or remote-sharing behavior.

`SS-002 Draft sports injury waiver and educational-use terms` merged in
[PR #2](https://github.com/ajason13/swing-sync/pull/2) on 2026-06-05.

Acceptance criteria from Notion:

- Draft assumption-of-risk and release-of-liability language for review.
- State feedback is educational and not medical or professional athletic instruction.
- Define consent gate before first analysis.
- Add prompt constraints that avoid diagnosing pain or prescribing unsafe movements.

Planned/active artifacts:

- `docs/safety-terms.md`: product-compliance draft language for human/legal
  review, including assumption of risk, release of liability, educational-use
  boundaries, local-first privacy, consent-gate requirements, prompt
  constraints, and a review checklist.
- `src/main.ts`: minimal first-analysis consent gate scaffold that stores only
  local acknowledgement state.
- `scripts/verify-safety-terms.js`: safety-boundary regression checks wired
  into `npm run compliance:verify`.
- `docs/ss-002-research-disposition.md`: Gemini Deep Research disposition,
  separating adopted guidance from revised, deferred, or rejected
  recommendations.

SS-002 verification on 2026-06-05:

- `npm run safety:verify` passed.
- `npm run build` passed.
- `npm run compliance:verify` passed.
- `git diff --check` passed.
- Gemini Deep Research response received and distilled into
  `docs/ss-002-research-disposition.md`.
- Initial Claude audit returned conditional pass with two blockers: add a runtime
  consent check in the analysis click handler, and strengthen
  `scripts/verify-safety-terms.js` to avoid false confidence.
- Claude re-review returned PASS and granted sign-off for PR creation after the
  blocker fixes.
- PR #2 created: https://github.com/ajason13/swing-sync/pull/2
- Claude PR review returned APPROVED FOR MERGE with no blockers. Remaining
  notes are future-story items: verifier regex maintenance, unit tests for
  consent helpers once a real analysis pipeline exists, adversarial prompt tests
  for the first AI coaching pipeline, and private-browsing consent UX.

Remaining SS-002 pre-release gate:

- Legal/human review of draft assumption-of-risk and release-of-liability copy
  remains pending before public release.

## Persistent Learnings

- For safety, legal, medical, or compliance-sensitive stories, keep
  multi-agent roles explicit: Gemini for research/spec disposition, Codex for
  implementation and repo hygiene, and Claude for adversarial audit/re-review.
- Treat external model research as input, not implementation authority. Record
  adopted, revised, deferred, and rejected recommendations in a disposition file
  when research is broad or over-scoped.
- Avoid absolute claims in product safety/privacy copy. Prefer scoped language:
  draft only, not legal advice, no enforceability guarantee, local-first by
  default, and separate explicit opt-in before any remote sharing.
- For consent gates, use both UI gating and a runtime guard on the action path.
  `localStorage` acknowledgement is acceptable only as a scaffold unless legal
  review asks for durable consent records.
- Safety verifiers should check required user-facing copy and prohibited claim
  patterns. Exact phrase checks alone create false confidence.
- Future AI-coaching stories should convert deferred adversarial prompts into
  tests before any model output is exposed.
- Browser-chat research and audit prompts must embed any required repository
  context because Gemini and Claude Chat do not have filesystem or GitHub
  access.
- Initial audit prompts may include broad context, but re-review prompts should
  contain only prior findings, applied fixes, relevant current snippets, and a
  focused diff. Duplicating full contents and a full diff can cause the auditor
  to treat the handoff as repeated stale input.
- Keep the original audit prompt and focused re-review prompt in separate,
  clearly named files. Mark superseded prompt files with a do-not-paste
  redirect.

## Operating Notes

- Keep legal language framed as product/compliance drafting, not legal advice.
- Preserve the local-first privacy posture: no raw swing video upload by default.
- User-facing safety copy should be clear, plain, and explicit before analysis.
- Any connected model or coaching prompt must avoid medical diagnosis, pain triage, or aggressive mechanical prescriptions.
- Observability: SS-002 adds no runtime logging, telemetry, remote calls, or raw
  video handling. Consent acknowledgement is local-only browser state.
