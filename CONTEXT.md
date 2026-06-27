# Swing Sync Context

Last updated: 2026-06-27

## Current State

- Repository: https://github.com/ajason13/swing-sync
- Default branch: `main`
- Latest merged PR: https://github.com/ajason13/swing-sync/pull/12
- Latest merge commit: `31548a43421dcd45a469d4c6282a8c102b8f1185`
- Current pushed `main` includes PR #12 merge commit
  `31548a43421dcd45a469d4c6282a8c102b8f1185` and post-SS-011 context sync.
  Local `main` and `origin/main` matched after the post-merge sync push.
- Current completed task:
  `SS-011 Generate downloadable Swing Card`
- Active task: `SS-012 Design multimodal coaching prompt and response schema`
- Active branch: `ss-012-coach-prompt`
- Active handshake: `4. Final Audit (Claude)`
- Active Pull Request: https://github.com/ajason13/swing-sync/pull/13

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

Next owner: Codex merge verification. SS-012 remains at
`4. Final Audit (Claude)` until PR merge state is synchronized; do not mark
Done before merge state is recorded.

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
