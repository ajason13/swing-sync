# SS-007 Claude Adversarial QA Planning Prompt

> **Superseded: do not paste this prompt.** Claude completed this review with a
> FAIL result. Use `docs/ss-007-claude-qa-rereview-prompt.md` for the focused
> re-review.

Paste this prompt into Claude Chat before SS-007 implementation. Claude does
not have filesystem, Notion, or GitHub access; all required context is embedded.

## Prompt

Role: You are the lead adversarial QA planner for Swing Sync.

Stage: Pre-implementation QA planning for safety- and coaching-sensitive story
`SS-007 Implement swing phase detector with manual correction`.

Your job is to attack the candidate specification, identify fail-open behavior
and unsupported assumptions, and decide whether implementation may begin. Do
not write the implementation.

## Roles And Authority

- Gemini researched and proposed a specification.
- Codex independently verified and dispositioned the research.
- Claude owns adversarial QA planning and implementation-start sign-off.
- Codex may implement only after blockers are resolved and Notion moves to
  `3. In Development (ChatGPT)`.

## Acceptance Criteria

- Detects the MVP eight swing frames when confidence is sufficient.
- Allows user correction before metric generation.
- Emits low-confidence warnings for ambiguous swings.
- Includes fixture tests for common side-on videos.

## Protected Repository Contract

- Node 22, Vite, TypeScript, Vitest, Playwright.
- Exact approved `@mediapipe/tasks-vision@0.10.35`, same-origin approved
  model/WASM assets, dedicated worker VIDEO-mode inference.
- Complete normalized/world landmarks retain returned `x`, `y`, `z`, and
  `visibility`; configured thresholds remain separate; no invented presence.
- SS-006 supplies up to eight ordered volatile outputs with generation, index,
  requested timestamp, informational observed seek timestamp, bounded preview,
  and complete pose result.
- Normal videos produce exactly eight samples. Short videos may produce fewer.
- SS-006 is sequential, one inference frame in flight, cancellable/retryable,
  stale-generation rejecting, and responsible for complete resource cleanup.
- `observedSeekTimestampMs` is excluded from diagnostics, persistence, network
  transit, export, and SS-007 phase state.
- Existing first-analysis safety acknowledgement, fail-closed unexpected
  network behavior, and no sensitive persistence/telemetry remain protected.

## Tracker Coverage

- API-consent-focused `SS-TC-007` is invalid SS-007 acceptance coverage.
- Broad `SS-TC-005` is complementary but insufficient.
- Dedicated `SS-TC-011` covers vocabulary/order, deterministic behavior,
  confidence/ambiguity, correction validation/provenance, stale rejection,
  side-on fixtures, accessibility, privacy, and protected boundaries.

## Gemini Proposal And Codex Disposition

Gemini proposed:

- GolfDB event names plus asserted P-System mappings;
- exactly one unique ordered sample for each of eight phases;
- pose posture-cost formulas and dynamic-programming alignment;
- interpolating low-visibility landmarks and clipping jitter;
- numeric phase/run confidence with invented `0.50`/`0.75` thresholds;
- automatic metric-readiness unlock at `>=0.75`;
- closest-person filtering;
- a new detector worker/store/component architecture; and
- synthetic programmatic pose fixtures.

Codex adopted the GolfDB event vocabulary/order, separate immutable automatic
and corrected state, active-generation binding, explicit user review, existing-
sample-only correction, fail-closed ambiguity, programmatic contract fixtures,
accessible warnings, volatile local state, and protected-boundary tests.

Codex revised or rejected unsupported/conflicting parts:

- GolfDB defines eight ordered events but acknowledges subjective frames and
  rarely captured precise Impact in 30 fps video.
- GolfDB's baseline uses dense RGB temporal windows of 32/64 frames; it does
  not validate eight evenly spaced pose samples or Gemini's formulas.
- With exactly eight ordered phases and eight unique ordered samples, the only
  valid assignment is identity mapping. DP cannot meaningfully select, and
  manual correction is impossible under the same constraints.
- No representative moving side-on fixture or calibration evidence supports a
  sufficient-confidence state, numeric confidence, or thresholds.
- Do not infer club/ball Impact, view, handedness, mirrored orientation, or
  closest person from the current pose-only contract.
- Do not interpolate, clip, fabricate fallback assignments, duplicate the
  final frame, or equate visibility/configured thresholds with confidence.
- User confirmation is required for every run; no automatic result unlocks
  future metric readiness.
- No new worker/framework/store/dependency is justified.
- No sensitive diagnostics or timing logs are added.

## Candidate Vocabulary And Input

Ordered stable identifiers:

```text
address
toe-up
mid-backswing
top
mid-downswing
impact
mid-follow-through
finish
```

The UI requires user declaration of face-on side view, handedness, and whether
the source is horizontally mirrored. The user confirms one trimmed complete
full swing, centered/substantially full-body framing, and a reasonably stable
camera. Exact camera distance/height/angle/clothing/lighting thresholds are not
claimed or automatically verified.

Exactly eight active ordered SS-006 samples, one returned pose per sample,
finite required landmark values, complete arrays, and matching active
generation are required. Unsupported or insufficient input fails closed.

## Candidate Evidence, State, And Correction

No numeric confidence or automatic sufficient-confidence detector is approved.
Candidate evidence states are:

```text
unsupported-input
insufficient-evidence
review-required
```

Automatic proposal and user correction are separate immutable records bound to
the active generation. Phase state stores sample indices only, not timestamps,
landmarks, previews, or local wall/performance times.

Readiness is only a boolean for a future separately reviewed metric story. It
requires a valid active-generation correction/review and explicit user
confirmation. SS-007 calculates no metrics.

Every correction must contain all phases exactly once, reference only active
in-range samples, satisfy the approved ordering/repetition policy, remain
separate from automatic output, and be explicitly confirmed. The ordering/
repetition policy is currently unresolved.

## Blocking Contradictions

### B1: Allocation and correction

```text
8 ordered required phases
+ 8 ordered candidate samples
+ every phase uses one unique sample
+ strict phase/sample order
= only identity mapping is possible
```

This does not provide meaningful detection or manual correction. A maintainer
must choose whether repeated sample references are allowed, another invariant
is relaxed, or more candidate frames become a separate reviewed story.

### B2: Confidence acceptance

No representative approved data, moving side-on fixture, heuristic validation,
or calibration supports "confidence is sufficient." Numeric confidence and
automatic acceptance are prohibited. The current conservative contract cannot
yet satisfy this acceptance criterion.

### B3: Side-on browser fixture

Programmatic pose fixtures can verify deterministic contracts but cannot prove
common side-on video acceptance. The approved static address mannequin fixture
explicitly is not phase-detection evidence. No approved moving side-on browser
fixture currently exists.

## Candidate Privacy, Safety, And Observability

- Raw video, previews, landmarks, phase labels, evidence, warnings, and
  corrections remain local, sensitive, volatile, non-persistent, and
  non-transmitted.
- Clear phase state on cancel, failure, retry, new-file supersession, owning
  output release, controller close, or navigation away.
- Reject stale proposals/corrections by active generation.
- Diagnostics exclude phase assignments, evidence, warnings, corrections,
  timestamps, landmarks, derived values, media characteristics, and
  identifiers.
- Observability is intentionally unchanged: local sanitized lifecycle/error
  state only.
- Wording remains educational and avoids correctness, medical, diagnostic,
  rehabilitation, injury-prevention, professional-coaching, and guaranteed-
  accuracy claims.

## Required Verification After Approval

At minimum:

- `npm run test:unit`
- `npm run test:smoke`
- `npm run build`
- `npm run compliance:verify`
- `npm run safety:verify`
- `npm run privacy:verify`
- `npm run license:audit`
- `npm run verify:bundle-license-fixture`
- `npm run pose-assets:verify`
- `npm run sbom:generate`
- `npm audit --omit=dev`
- `git diff --check`

Targeted tests must cover vocabulary/order, deterministic identical input,
malformed/incomplete/low-visibility/out-of-frame/multiple/no-pose input,
ambiguity, correction validation and every invalid surface, separate
provenance, readiness gating, cancellation/retry/supersession/stale rejection,
accessible warnings/controls, fixture provenance, no persistence/sensitive
diagnostics/network, and protected SS-005/SS-006 behavior.

## Questions You Must Answer

1. Is Codex correct that strict unique one-to-one ordered assignment makes
   meaningful detection and correction impossible with exactly eight samples?
2. Which allocation-policy decision is minimally sufficient and safe:
   nondecreasing repeated sample references, a different explicit relaxation,
   or a separate more-candidate-frame story?
3. Can SS-007 satisfy "detects ... when confidence is sufficient" without
   approved calibration evidence? If not, what exact evidence or acceptance
   revision is required?
4. Is manual-review-only behavior a permissible intermediate implementation,
   or would it fail current acceptance?
5. What moving side-on browser fixture/provenance evidence is an
   implementation-start blocker?
6. Are the candidate GolfDB vocabulary and bounded definitions appropriate?
7. Are user-declared face-on side view, handedness, and mirrored orientation
   sufficient, or are additional declarations/unsupported states required?
8. Does the candidate reject every unsafe interpolation, fallback, fabricated
   assignment, and confidence claim?
9. Are state/provenance, stale rejection, cleanup, privacy, safety, and
   observability contracts complete?
10. What exact revisions to the specification and `SS-TC-011` are required?
11. What minimum deterministic unit/browser test matrix is required after the
    blockers close?

## Output Required

- `PASS` or `FAIL` for permission to start implementation.
- Blockers ordered by severity with exact closure evidence required.
- A direct decision on B1, B2, and B3.
- Required revisions to the specification and `SS-TC-011`.
- Minimum deterministic unit, integration, Playwright, accessibility, privacy,
  cleanup, network, and protected-boundary test matrix.
- Non-blocking recommendations separated from blockers.
- Explicit sign-off: permission to move to `3. In Development (ChatGPT)` or
  instruction to remain at `2. QA Planning (Claude)`.
