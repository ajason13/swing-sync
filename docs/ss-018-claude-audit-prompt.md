# SS-018 Claude Implementation Audit Prompt

Superseded for paste use after Claude's SS-018 implementation audit returned
FAIL with B9-B12. Use `docs/ss-018-claude-audit-rereview-prompt.md` for the
focused re-review instead.

Do not treat any prior chat as authoritative. Audit only the packet below and
any complete file contents or diff pasted with it.

## Role

You are the lead adversarial auditor for Swing Sync.

## Stage

Implementation audit for SS-018 after Codex implementation and local
verification.

## Scope

Audit the SS-018 app-shell refactor on branch
`ss-018-frontend-architecture`.

The story intent is to reduce `src/main.ts` orchestration pressure before the
next UI feature wave while preserving existing user-facing behavior. The
refactor separates workflow rendering, state transitions, export controls,
consent handling, and analysis lifecycle into focused modules.

## Context

Swing Sync is a local-first golf swing analysis app. Runtime privacy and safety
boundaries are protected:

- Raw swing video is not uploaded by default.
- Remote sharing requires a separate explicit opt-in.
- Remote model review remains unavailable in the current app shell.
- No telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts may be added.
- Provider/model registry behavior, service-worker behavior, raw-media
  handling, and exported data classes must not change.
- User-facing coaching/safety language must remain bounded and avoid absolute
  medical, legal, deletion, anonymity, or compliance claims.

Claude QA planning previously failed and then passed after blockers B1-B8 were
resolved in the implementation plan. Implementation was not started until the
Round 4 QA planning PASS.

## Acceptance Criteria

- Split the current app shell into focused modules without changing
  user-facing behavior.
- Keep consent gating, local video selection, local pose processing, phase
  review, Swing Card export, and remote-review-unavailable behavior intact.
- Preserve existing accessibility labels and test selectors used by smoke
  tests.
- Add or adjust unit tests around extracted state/renderer behavior where
  useful.
- Add no new framework or dependency unless separately reviewed and approved.

## Protected Boundaries

- Do not change runtime privacy posture, raw-media handling, remote sharing,
  provider/model registry behavior, service-worker behavior, or exported data
  classes.
- Do not add telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts.

## Prior QA Planning Findings To Re-check

Confirm that the implementation actually satisfies the planning fixes:

- B1: `src/app-state.ts` owns state mutation through named transitions or
  selectors; other modules must not directly mutate state fields except through
  the documented lifecycle handle exception.
- B2: shared render helpers, especially `escapeHtml`, are canonical in
  `src/render-utils.ts`; renderer modules must not duplicate escaping logic.
- B3: remote-review-unavailable rendering is explicitly owned by
  `src/remote-model-renderer.ts` and does not alter provider/model registry
  behavior.
- B4: `observedSeekTimestampMs` is excluded from serialized/exported Swing
  Card content surfaces after export extraction.
- B5: consent storage uses an injectable storage interface and fails closed on
  get/set/remove errors.
- B6: `beforeunload` and `securitypolicyviolation` delegate to named lifecycle
  methods and preserve fail-closed `UNEXPECTED_NETWORK_BLOCKED` behavior.
- B7: render/rebind ownership is explicit. `src/main.ts` owns
  `requestRender(statusMessage?)`; `src/app-events.ts` calls it after
  state-changing handlers; `src/app-renderer.ts` owns
  `updateProcessingProgressUi(root, state)`, re-queries processing DOM targets
  on every tick, and no-ops on missing selectors. Lifecycle code must not cache
  progress DOM nodes or write processing UI text directly.
- B8: `src/app-state.ts` holds UI-derived/session state while
  `src/analysis-lifecycle.ts` owns non-serializable controller and abort
  handles as a scoped exception, then synchronizes back through app-state
  transitions.

## Implementation Summary

- `src/main.ts` is now a thin bootstrap/render coordinator.
- `src/app-state.ts` owns state shape, selectors, and named transitions.
- `src/consent-state.ts` owns injectable safety-consent storage and fail-closed
  consent reads/writes.
- `src/app-renderer.ts` owns workflow/export HTML rendering and the processing
  partial-update helper.
- `src/app-events.ts` owns DOM event binding and calls state transitions plus
  `requestRender`.
- `src/analysis-lifecycle.ts` owns frame-processing controller handles,
  lifecycle methods, global-handler methods, and delegates processing UI
  updates to `src/app-renderer.ts`.
- `src/keyframe-overlay-renderer.ts` owns imperative keyframe canvas drawing.
- `src/phase-review-renderer.ts` owns phase review rendering.
- `src/remote-model-renderer.ts` owns remote-review-unavailable rendering.
- `src/render-utils.ts` owns shared escaping and Swing Card warning/data-class
  formatting.
- `src/swing-card-actions.ts` owns Swing Card download, print, clipboard, and
  content preparation.
- `scripts/verify-safety-terms.js` and
  `scripts/verify-privacy-boundaries.js` were updated so safety/privacy
  verifiers follow the extracted app-shell modules.
- Runtime observability is intentionally unchanged.
- No dependency, framework, bundle, license-policy, notice, or SBOM changes
  were made.

## Changed-File Manifest

Runtime source files:

- `src/main.ts`
- `src/analysis-lifecycle.ts`
- `src/app-events.ts`
- `src/app-renderer.ts`
- `src/app-state.ts`
- `src/consent-state.ts`
- `src/keyframe-overlay-renderer.ts`
- `src/phase-review-renderer.ts`
- `src/remote-model-renderer.ts`
- `src/render-utils.ts`
- `src/swing-card-actions.ts`

Verifier files:

- `scripts/verify-privacy-boundaries.js`
- `scripts/verify-safety-terms.js`

Unit tests:

- `test/unit/analysis-lifecycle.test.ts`
- `test/unit/app-events.test.ts`
- `test/unit/app-renderer.test.ts`
- `test/unit/app-state.test.ts`
- `test/unit/consent-state.test.ts`
- `test/unit/render-utils.test.ts`
- `test/unit/swing-card-actions.test.ts`

Planning, audit, and context files:

- `.agents/skills/swing-sync-story-delivery/SKILL.md`
- `CONTEXT.md`
- `docs/ss-018-research-disposition.md`
- `docs/ss-018-preimplementation-spec.md`
- `docs/ss-018-claude-qa-planning-prompt.md`
- `docs/ss-018-claude-qa-response.md`
- `docs/ss-018-claude-qa-rereview-prompt.md`
- `docs/ss-018-claude-qa-rereview-response.md`
- `docs/ss-018-claude-qa-b7-b8-rereview-prompt.md`
- `docs/ss-018-claude-qa-b7-rereview-response.md`
- `docs/ss-018-claude-qa-b7-rereview-prompt.md`
- `docs/ss-018-claude-qa-b7-pass-response.md`
- `docs/ss-018-claude-audit-prompt.md`

The intentional untracked
`docs/agent-guidance/*new-codex-session-prompt.md` files predate SS-018 and are
not part of this audit.

## Source Packet Requirement

If this prompt is pasted into Claude Chat, paste
`docs/ss-018-claude-audit-source-packet.md` immediately after this prompt. That
packet contains the complete changed file contents for the runtime source,
verifier, unit-test, planning, audit, and context files listed in the manifest
above. Do not pass/fail from the summary alone.

Claude's first implementation-audit attempt returned no PASS/FAIL because only
this prompt was pasted and the source packet was omitted. Treat that as a
handoff defect already corrected by `docs/ss-018-claude-audit-source-packet.md`,
not as a runtime implementation finding.

For source-sensitive review, treat summaries as orientation only. The audit
should inspect the actual changed code for cross-module ownership violations,
selector/label regressions, privacy/safety boundary drift, and missing test
coverage.

## Verification Evidence

Executed local commands and results:

- `npm run test:unit -- consent-state app-state render-utils app-renderer app-events analysis-lifecycle swing-card-actions`
  passed: 7 files, 15 tests.
- `npm run test:unit` passed: 21 files, 176 tests.
- `npm run test:smoke` initially could not bind localhost in the managed
  sandbox and reported `listen EPERM: operation not permitted 127.0.0.1:4174`.
  The direct Playwright equivalent was rerun with approved local-server
  permissions:
  `DEBUG=pw:webserver node_modules/.bin/playwright test --reporter=line`
  passed: 32 desktop/mobile tests.
- `npm run build` passed.
- `npm run docs:verify` passed.
- `npm run compliance:verify` passed.
- `npm run safety:verify` passed.
- `npm run privacy:verify` passed.
- `git diff --check` passed.

Coverage mapping:

- Consent fail-closed and injectable storage:
  `test/unit/consent-state.test.ts`.
- Canonical `selectCanBeginAnalysis` gate selector:
  `test/unit/app-state.test.ts`.
- Escaping and canonical render helpers:
  `test/unit/render-utils.test.ts`.
- Protected selector/label preservation, processing progress re-query, and
  missing-selector no-op:
  `test/unit/app-renderer.test.ts`.
- Render/rebind single-effect behavior:
  `test/unit/app-events.test.ts`.
- Global handler/lifecycle/controller clearing and stop/idle composition:
  `test/unit/analysis-lifecycle.test.ts`.
- `observedSeekTimestampMs` export exclusion:
  `test/unit/swing-card-actions.test.ts`.
- Primary workflow selector/label preservation:
  full Playwright smoke suite.
- Protected safety/privacy text and local-first boundaries:
  `npm run safety:verify`, `npm run privacy:verify`, and
  `npm run compliance:verify`.

## Known Non-goals

- No UI copy, layout, or workflow behavior redesign.
- No framework migration.
- No progress throttling changes.
- No remote review enablement.
- No provider/model registry changes.
- No service-worker behavior changes.
- No telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, persistent debug artifacts, or new operator diagnostics.
- No dependency, bundle, license-policy, notice, or SBOM changes.
- No PR has been created yet; this audit is the gate before PR preparation.

## Output Required

Return:

- PASS or FAIL verdict.
- Blockers ordered by severity, with file/line references where possible.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status: whether SS-018 may proceed to PR preparation, or
  whether fixes and focused re-review are required.

Focus especially on:

- Any hidden direct state mutation outside `src/app-state.ts`.
- Any duplicated or bypassed escaping/render-helper logic.
- Any stale-DOM or double-binding risk after render/rebind extraction.
- Any processing-progress path that writes DOM outside `src/app-renderer.ts`.
- Any controller-handle state sync bug in `src/analysis-lifecycle.ts`.
- Any consent fail-open behavior.
- Any `observedSeekTimestampMs` leak in export surfaces.
- Any selector/accessibility label regression that smoke tests could miss.
- Any verifier update that creates a false positive or false negative for
  safety/privacy boundaries.
