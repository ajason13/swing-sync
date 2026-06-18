# SS-007 Claude Focused QA Re-Review Prompt

Paste everything under **Prompt** into Claude Chat. Claude has no filesystem,
Notion, GitHub, or private-link access. Every artifact required for this
focused review is embedded below.

## Prompt

Role: You are the lead adversarial QA planner for Swing Sync.

Stage: Focused pre-implementation re-review for safety- and coaching-sensitive
story `SS-007 Implement swing phase detector with manual correction`.

The first QA review returned FAIL with B1-B3. Review the complete revised
specification and tracker contract embedded below. Do not assume access to any
repository file, Notion page, GitHub page, prior chat, or private link. Do not
write implementation.

## Required Verdict

Return:

- `PASS` or `FAIL` for permission to start implementation.
- Separate closure decisions for B1, B2, and B3.
- Any new blocker introduced by the revisions, ordered by severity.
- Required specification or test-contract revisions, if any.
- Explicit sign-off stating whether SS-007 may move to
  `3. In Development (ChatGPT)`.

## Roles And Authority

- Gemini provided research input.
- Codex independently verified and dispositioned that research.
- Claude owns adversarial QA planning and implementation-start sign-off.
- Codex may implement only after Claude returns PASS.
- SS-007 remains at `2. QA Planning (Claude)`.

## Repository And Runtime Context

- Stack: Node 22, Vite 5, TypeScript, Vitest, Playwright.
- Current branch: `ss-007-phase-detector`.
- Exact approved production dependency: `@mediapipe/tasks-vision@0.10.35`.
- The app is local-first and requires the existing first-analysis safety
  acknowledgement.
- No new dependency, model, asset, provider, worker, framework, remote API,
  telemetry, remote logging, persistence, resampling, metrics, coaching,
  export, or remote review is approved for SS-007.

### Protected SS-005 Boundary

- Exact approved MediaPipe dependency and same-origin pinned model/WASM assets.
- Dedicated worker VIDEO-mode pose inference.
- Complete normalized/world landmark arrays with returned `x`, `y`, `z`, and
  `visibility`.
- Configured detection/presence/tracking thresholds remain separate.
- No invented per-landmark `presence`.
- Local volatile frames/landmarks, closed transferred bitmaps, worker/task and
  object-URL cleanup, fail-closed unexpected network behavior, and no sensitive
  persistence or telemetry.

### Protected SS-006 Boundary

- Fixed-budget ordered sampling with up to eight integer-millisecond requested
  timestamps. Normal accepted videos produce exactly eight samples.
- Sequential processing with one inference frame in flight.
- Cancellation, failure, retry, supersession, stale-generation rejection, and
  complete preview/object-URL/PoseSession cleanup.
- Output contract:

```ts
interface SampledFrameOutput {
  runGeneration: number;
  index: number;
  requestedTimestampMs: number;
  observedSeekTimestampMs: number;
  preview: ImageBitmap;
  pose: PoseFrameResult;
}
```

- `observedSeekTimestampMs` is informational and excluded from diagnostics,
  persistence, network transit, export, and SS-007 phase state.
- Existing local sanitized lifecycle/error state only. No sensitive
  diagnostics.

## Original Claude FAIL And Applied Response

### B1: Allocation policy

Original finding: eight unique ordered samples for eight ordered phases permits
only identity mapping and no meaningful correction.

Applied response:

```text
Each phase is assigned exactly one active sample index.
assignment[i] <= assignment[i + 1]
Multiple phases may share one sample.
Every phase must be assigned exactly once.
No phase may be omitted.
```

The deterministic initial review layout maps phase index `i` to sample index
`i`. It is not described as detection, confidence, accuracy, or physical
verification.

### B2: Unsatisfiable confidence acceptance

Original finding: "detects when confidence is sufficient" cannot be satisfied
without approved calibration and conflicts with the conservative contract.

Applied response: remove numeric confidence, sufficient-confidence language,
and automatic acceptance. Every valid run is `review-required` and requires
explicit review/confirmation.

### B3: Moving side-on fixture gap

Original finding: no approved moving side-on browser fixture exists, making
the original fixture acceptance uncloseable.

Applied response: SS-007 acceptance now requires deterministic project-authored
programmatic `PoseFrameResult` fixtures for contract behavior. Moving side-on
browser fixture policy, provenance, and coverage are deferred to existing
future story `SS-014 Create fixture swing dataset policy and test fixtures`.
SS-007 must not claim moving-video phase accuracy or moving-side-on coverage.

## Active Notion Story Acceptance Criteria

These are the complete current SS-007 acceptance criteria:

1. Proposes an initial phase assignment from active SS-006 samples and presents
   it for explicit user review.
2. Allows user correction before future metric generation, using
   nondecreasing sample references and explicit confirmation.
3. Emits accessible `unsupported-input` and `review-required` warnings; no
   automatic acceptance occurs.
4. Includes deterministic programmatic pose fixture tests covering the full
   phase vocabulary, ordering, correction, unsupported input, provenance, and
   stale rejection.

Moving side-on browser fixture coverage is deferred to `SS-014 Create fixture
swing dataset policy and test fixtures` and is not claimed as SS-007 coverage.

## Complete Revised Normative SS-007 Specification

### Status

Blocked at `2. QA Planning (Claude)`. Claude's first QA review returned FAIL.
This revision attempts to close B1-B3 for focused re-review. Implementation may
begin only after Claude confirms closure and returns PASS.

### Scope

SS-007 consumes the existing ordered volatile SS-006 output, creates a
deterministic provisional initial assignment of the eight ordered GolfDB
swing-event labels, exposes clear review/unsupported warnings, and requires
explicit user review or correction before exposing readiness for a future
metric story.

Out of scope: SS-005/SS-006 replacement, resampling, dense video analysis,
club/ball tracking, biomechanical metrics, coaching, automatic view or
handedness inference, persistence, export, remote APIs/sharing/logging,
telemetry, and new dependencies/models/assets/providers.

### Revised Acceptance Criteria

- Proposes an initial phase assignment from active SS-006 samples and presents
  it for explicit user review.
- Allows user correction before future metric generation, using nondecreasing
  sample references and explicit confirmation.
- Emits accessible `unsupported-input` and `review-required` warnings; no
  automatic acceptance occurs.
- Includes deterministic programmatic pose fixture tests covering the full
  phase vocabulary, ordering, correction, unsupported input, provenance, and
  stale rejection.

Moving side-on browser fixture coverage is deferred to `SS-014 Create fixture
swing dataset policy and test fixtures`. It is not claimed as SS-007 coverage.

### Protected Input Contract

The detector consumes only a completed active SS-006 output collection:

```ts
interface SampledFrameOutput {
  runGeneration: number;
  index: number;
  requestedTimestampMs: number;
  observedSeekTimestampMs: number;
  preview: ImageBitmap;
  pose: PoseFrameResult;
}
```

Rules:

- all records must share the active `runGeneration`;
- records must be in strictly increasing `index` and
  `requestedTimestampMs` order;
- `pose.timestampMs` must equal `requestedTimestampMs`;
- exactly eight records are required;
- each accepted record must contain exactly one pose with complete normalized
  and world landmark arrays;
- source records and landmark arrays remain unmodified;
- `observedSeekTimestampMs` is not consumed, copied, diagnosed, persisted,
  transmitted, or exported by SS-007; and
- phase state cannot outlive the owning SS-006 outputs.

Any invalid input fails closed before phase proposal work.

### Event Vocabulary

| Stable identifier | User-facing name | Bounded definition |
| --- | --- | --- |
| `address` | Address | Moment just before noticeable backswing movement. |
| `toe-up` | Toe-up | Shaft approximately parallel to the ground during backswing. Pose-only evidence cannot observe the shaft. |
| `mid-backswing` | Mid-backswing | Arm approximately parallel to the ground during backswing. |
| `top` | Top | Transition where the club changes direction. Pose-only evidence cannot observe the club directly. |
| `mid-downswing` | Mid-downswing | Arm approximately parallel to the ground during downswing. |
| `impact` | Impact | Clubhead touches the ball. Pose-only evidence cannot directly observe club-ball contact. |
| `mid-follow-through` | Mid-follow-through | Shaft approximately parallel to the ground during follow-through. Pose-only evidence cannot observe the shaft. |
| `finish` | Finish | Moment before the final pose relaxes. |

The required event order is the table order. Names are educational event labels
derived from GolfDB, not guarantees of correctness, biomechanical validity, or
professional instruction.

### Supported Input

The UI must require the user to explicitly declare:

- face-on side view rather than down-the-line/other view;
- right- or left-handed swing; and
- whether the source preview is horizontally mirrored.

Each declaration starts as `undeclared`. An undeclared view, handedness, or
mirrored-orientation value is unsupported input. The app must not default or
infer any declaration.

The user must confirm that the video is a trimmed single complete full swing,
the golfer remains centered and substantially full-body visible, and the
camera is reasonably stable. These are user-confirmed assumptions, not claims
that the detector can verify exact distance, height, angle, lighting, clothing,
or background conditions.

Unsupported, incomplete, undeclared, multiple-person, down-the-line, other-
view, or materially occluded inputs fail closed to a clear review/unsupported
state.

### Landmark Evidence Validation

- Preserve all source landmarks.
- Derived evidence may inspect shoulders, elbows, wrists, hips, knees, ankles,
  heels, and feet.
- Reject non-finite required coordinates/visibility and degenerate derived
  denominators.
- Treat absent poses, multiple returned poses, incomplete landmark arrays, low
  visibility, materially out-of-frame landmarks, and inconsistent evidence as
  unsupported input.
- Do not interpolate, clip, fabricate, or silently replace landmark values.
- Do not treat MediaPipe configured thresholds or landmark visibility as phase
  confidence or coordinate accuracy.
- Do not infer club, shaft, ball, contact, camera view, handedness, or mirrored
  orientation from pose-only evidence in this story.

### Proposal And Evidence Contract

No automatic phase-selection heuristic, numeric confidence, or automatic
acceptance threshold is approved.

For a valid active input, the deterministic initial proposal assigns phase
index `i` to sample index `i`. This is an initial review layout only. It is not
described as detected, confident, sufficient, accurate, or physically
verified.

Every valid run is `review-required`. The user may correct the proposal by
assigning each phase exactly one active sample index. Assignments must be
nondecreasing:

```text
assignment[i] <= assignment[i + 1]
```

Multiple phases may share the same sample. Every phase must be assigned. No
phase may be omitted. This is the minimal relaxation that preserves phase
ordering while making correction possible with the protected eight samples.

Until representative approved data and calibration rationale exist:

- do not emit numeric phase/run confidence;
- do not label automatic output "high confidence" or "sufficient";
- do not unlock readiness automatically;
- do not fabricate complete assignments for missing/ambiguous phases; and
- represent evidence only as `unsupported-input` or `review-required`.

Evidence-state triggers:

| Condition | Evidence state |
| --- | --- |
| Any required declaration is `undeclared` or unsupported | `unsupported-input` |
| Fewer or more than eight active samples | `unsupported-input` |
| Generation mismatch or invalid ordering/timestamp association | `unsupported-input` |
| Missing pose, incomplete landmark array, or non-finite required value | `unsupported-input` |
| Eight valid active samples and all declarations present | `review-required` |

### State And Provenance

```ts
type PhaseId =
  | "address"
  | "toe-up"
  | "mid-backswing"
  | "top"
  | "mid-downswing"
  | "impact"
  | "mid-follow-through"
  | "finish";

type PhaseEvidenceStatus =
  | "unsupported-input"
  | "review-required";

interface PhaseAssignment {
  phaseId: PhaseId;
  sampleIndex: number;
}

interface AutomaticPhaseProposal {
  runGeneration: number;
  assignments: readonly PhaseAssignment[];
  evidenceStatus: PhaseEvidenceStatus;
  warningCodes: readonly string[];
}

interface UserPhaseCorrection {
  runGeneration: number;
  assignments: readonly PhaseAssignment[];
  confirmed: true;
}

interface PhaseReviewState {
  runGeneration: number;
  automaticProposal: AutomaticPhaseProposal;
  correction?: UserPhaseCorrection;
  readyForFutureMetrics: boolean;
}
```

Rules:

- automatic proposal and correction are separate immutable records;
- assignments reference active sample indices only;
- no phase state stores requested/observed timestamps, landmarks, previews, or
  local wall/performance times;
- warning codes are stable sanitized categories;
- `readyForFutureMetrics` never causes metrics in SS-007; and
- readiness requires an active-generation valid nondecreasing correction/review
  and explicit confirmation.

### Correction Contract

The UI may show the eight existing bounded previews and ordered phase labels.
It must support keyboard and touch operation, programmatic labels, visible
focus, useful status text, and non-color-only warnings.

A correction must:

- contain every phase exactly once;
- reference only active in-range sample indices;
- use nondecreasing sample indices;
- permit multiple phases to share a sample;
- match the active `runGeneration`;
- remain separate from automatic output; and
- require explicit user confirmation.

Duplicate phase identifiers, missing phases, unknown phases, out-of-range
indices, decreasing ordering, stale generations, malformed arrays, or
unconfirmed submissions fail closed without changing readiness.

### Ambiguity And User-Facing Wording

Warnings must be factual and bounded:

- "Swing phase suggestions need review. Eight sampled frames may not contain
  each exact swing event."
- "Impact cannot be confirmed from body landmarks alone."
- "Review and confirm the frame labels before future measurements become
  available."
- "This educational review does not assess swing correctness or provide
  medical or professional coaching advice."

Do not tell users to change movement, claim injury prevention, diagnose faults,
guarantee correctness, or imply manual confirmation makes an event physically
verified.

### Stale Rejection, Cleanup, And Privacy

- Bind every proposal, UI action, correction, warning, and readiness update to
  the active `runGeneration`.
- Cancel, failure, retry, new-file supersession, output release, controller
  close, and navigation away clear phase state before accepting later work.
- Phase state referencing indices from a superseded or released generation is
  immediately invalidated and cleared.
- A stale proposal or correction is rejected by the active-generation check
  without mutating active state.
- Phase state remains local, sensitive, volatile, and non-persistent.
- Prohibit storage, cache, service-worker messages, remote transit, export,
  telemetry, remote logging, and console output containing phase assignments,
  warnings, evidence status, corrections, timestamps, landmarks, media
  characteristics, or identifiers.
- Do not claim instant erasure, garbage-collection timing, zero leakage, or
  absolute privacy.

### Fixture And Test Contract

Programmatic project-authored `PoseFrameResult` fixtures may prove:

- input validation;
- deterministic behavior for identical inputs;
- event vocabulary/order;
- ambiguity and malformed-input handling;
- correction validation and provenance;
- stale-result/correction rejection; and
- privacy/diagnostic boundaries.

They do not prove common side-on video acceptance, detector accuracy, or
confidence calibration. The static approved address fixture remains
complementary protected-pipeline regression coverage only.

Moving side-on browser fixture policy, provenance, and fixtures are deferred to
existing story `SS-014 Create fixture swing dataset policy and test fixtures`.
That work is a prerequisite for any future story that claims moving side-on
video acceptance, detector accuracy, or confidence calibration.

### Observability Decision

Observability is intentionally unchanged. Existing local sanitized lifecycle
and stable error state is sufficient. No new logs, metrics, traces, timings, or
diagnostics may contain sensitive phase data.

### Implementation Start Gate

- B1: adopt nondecreasing repeated sample references.
- B2: revise acceptance to deterministic provisional proposal plus mandatory
  explicit review; remove confidence/sufficient/automatic-acceptance claims.
- B3: revise fixture acceptance to deterministic programmatic pose fixtures
  and defer moving side-on browser fixtures to existing `SS-014`.

Implementation remains blocked until this focused Claude QA re-review confirms
these revisions and returns PASS.

## Complete Active SS-TC-011 Contract

Scenario:

> Deterministic local phase review proposes the ordered eight phase labels from
> active SS-006 samples, supports nondecreasing shared-index correction, emits
> accessible unsupported/review-required warnings, and requires valid explicit
> confirmation before future metric readiness.

Failure condition:

> The phase review defaults undeclared inputs; accepts decreasing, missing,
> duplicate-phase, out-of-range, malformed, unconfirmed, or stale corrections;
> fabricates confidence or automatic acceptance; overwrites proposal
> provenance; exposes readiness before valid review; persists/transmits
> sensitive state; or weakens protected SS-005/SS-006 behavior.

Required coverage:

- all eight stable identifiers, names, and ordering invariants;
- deterministic identity initial review layout for identical valid ordered
  inputs, never described as detected/confident/accurate/physically verified;
- explicit declarations for face-on view, handedness, and mirrored orientation,
  all starting `undeclared`;
- only `unsupported-input` and `review-required`, with no numeric confidence or
  automatic acceptance;
- corrections reference active existing samples, contain every phase exactly
  once, permit shared indices, require nondecreasing order and confirmation;
- accept valid shared-index correction;
- reject decreasing, missing, duplicate-phase, unknown, out-of-range,
  malformed, unconfirmed, and stale corrections;
- preserve separate initial proposal and correction provenance;
- keep future metric readiness locked until valid explicit confirmation;
- clear/reject phase state on cancel, retry, new-file supersession, navigation,
  owning-output release, and stale result/correction;
- deterministic project-authored programmatic pose fixtures;
- moving side-on browser fixture coverage deferred to `SS-014` and not claimed
  by SS-007;
- accessible keyboard/touch controls and bounded warnings;
- protected SS-005/SS-006 regression; and
- no sensitive persistence, transit, or diagnostics.

## Planned Minimum Verification After PASS

### Unit Tests

- Valid eight-sample input with declarations produces deterministic identity
  proposal and `review-required`.
- Invalid sample count, generation, ordering/timestamp association, missing
  pose, incomplete arrays, and non-finite values produce `unsupported-input`.
- Undeclared view, handedness, and mirrored orientation each produce
  `unsupported-input`.
- Identical valid input produces identical proposals.
- Valid nondecreasing correction with shared sample indices is accepted.
- Decreasing, missing, duplicate-phase, unknown, out-of-range, malformed,
  unconfirmed, and stale corrections are rejected without active-state change.
- Initial proposal and correction remain separate immutable records.
- Readiness requires active-generation valid correction/review and explicit
  confirmation.
- Cancel, retry, new file, navigation, output release, and supersession clear
  phase state; stale indices/results/corrections are rejected.
- Phase module output/state exposes no timestamps, landmarks, previews, or raw
  sample data.
- No sensitive values enter diagnostics.

### Browser And Accessibility Tests

- Ordered vocabulary and warnings render accessibly.
- Correction/review/confirmation flow works with keyboard and touch controls,
  visible focus, accessible names, and announced status changes.
- No automatic readiness.
- Cleanup occurs on navigation, cancellation, retry, and new file.
- No phase-state writes to localStorage, sessionStorage, IndexedDB, OPFS,
  caches, or service workers.
- No unexpected network request or sensitive console output.
- Existing SS-005/SS-006 smoke and protected-boundary tests remain green.

### Full Required Verification

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

## Current Verification Evidence

The current documentation-only B1-B3 revisions passed:

- `npm run build`
- `npm run compliance:verify`
- `git diff --check`

No implementation files have been edited and no implementation tests are
claimed complete.

## Focused Review Questions

1. Does the nondecreasing repeated-reference policy close B1 without weakening
   temporal semantics or protected SS-006 behavior?
2. Does the revised manual-review-only acceptance close B2 without retaining
   any unreachable or misleading confidence contract?
3. Does explicit deferral to existing `SS-014` close B3 for SS-007 while
   accurately preventing moving-side-on coverage claims?
4. Are `undeclared`, evidence triggers, correction validation, stale-index
   cleanup, provenance, readiness, privacy, safety, accessibility, and
   observability complete?
5. Did any revision introduce a new implementation-start blocker?
