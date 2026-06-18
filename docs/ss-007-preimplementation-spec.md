# SS-007 Pre-Implementation Specification

Status: **Approved for implementation.** Claude focused QA re-review returned
PASS on 2026-06-13. Required pre-merge revisions R1-R3 are incorporated below.

## Scope

SS-007 consumes the existing ordered volatile SS-006 output, creates a
deterministic provisional initial assignment of the eight ordered GolfDB
swing-event labels, exposes clear review/unsupported warnings, and requires
explicit user review or correction before exposing readiness for a future
metric story.

Out of scope: SS-005/SS-006 replacement, resampling, dense video analysis,
club/ball tracking, biomechanical metrics, coaching, automatic view or
handedness inference, persistence, export, remote APIs/sharing/logging,
telemetry, and new dependencies/models/assets/providers.

## Revised Acceptance Criteria

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

## Protected Input Contract

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
- exactly eight records are required for the current candidate;
- each accepted record must contain exactly one pose with complete normalized
  and world landmark arrays;
- source records and landmark arrays remain unmodified;
- `observedSeekTimestampMs` is not consumed, copied, diagnosed, persisted,
  transmitted, or exported by SS-007; and
- phase state cannot outlive the owning SS-006 outputs.

Any invalid input fails closed before phase proposal work.

## Candidate Event Vocabulary

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

## Supported-Input Candidate

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

Unsupported, incomplete, undeclared, multiple-pose, down-the-line, or other-
view inputs fail closed to a clear unsupported state.

## Landmark Evidence Validation

- Preserve all source landmarks.
- Derived evidence may inspect shoulders, elbows, wrists, hips, knees, ankles,
  heels, and feet.
- Reject non-finite required coordinates/visibility and degenerate derived
  denominators.
- Treat absent poses, multiple returned poses, incomplete landmark arrays, and
  non-finite required values as unsupported input. No uncalibrated
  low-visibility or out-of-frame threshold is approved.
- Do not interpolate, clip, fabricate, or silently replace landmark values.
- Do not treat MediaPipe configured thresholds or landmark visibility as phase
  confidence or coordinate accuracy.
- Do not infer club, shaft, ball, contact, camera view, handedness, or mirrored
  orientation from pose-only evidence in this story.

## Proposal And Evidence Contract

No automatic phase-selection heuristic, numeric confidence, or automatic
acceptance threshold is approved.

For a valid active input, the deterministic initial proposal assigns phase
index `i` to sample index `i`. This is an initial review layout only. It is not
described as detected, confident, sufficient, accurate, or physically
verified.

Every run is `review-required`. The user may correct the proposal by assigning
each phase exactly one active sample index. Assignments must be nondecreasing:

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

### Evidence State Triggers

| Condition | Evidence state |
| --- | --- |
| Any required declaration is `undeclared` or unsupported | `unsupported-input` |
| Fewer or more than eight active samples | `unsupported-input` |
| Generation mismatch or invalid ordering/timestamp association | `unsupported-input` |
| Missing pose, incomplete landmark array, or non-finite required value | `unsupported-input` |
| Eight valid active samples and all declarations present | `review-required` |

## Candidate State And Provenance

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

type PhaseWarningCode =
  | "PHASE_REVIEW_REQUIRED"
  | "IMPACT_NOT_CONFIRMED"
  | "UNSUPPORTED_INPUT";

interface PhaseAssignment {
  phaseId: PhaseId;
  sampleIndex: number;
}

interface AutomaticPhaseProposal {
  runGeneration: number;
  assignments: readonly PhaseAssignment[];
  evidenceStatus: PhaseEvidenceStatus;
  warningCodes: readonly PhaseWarningCode[];
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

## Correction Contract

The UI may show the eight existing bounded previews and ordered phase labels.
It must support keyboard and touch operation, programmatic labels, visible
focus, useful status text, and non-color-only warnings.

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

## Ambiguity And User-Facing Wording

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

## Stale Rejection, Cleanup, And Privacy

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

## Fixture And Test Contract

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

## Observability Decision

Observability is intentionally unchanged. Existing local sanitized lifecycle
and stable error state is sufficient for the candidate. No new logs, metrics,
traces, timings, or diagnostics may contain sensitive phase data.

## Implementation Start Gate

B1-B3 were revised as follows:

- B1: adopt nondecreasing repeated sample references.
- B2: revise acceptance to deterministic provisional proposal plus mandatory
  explicit review; remove confidence/sufficient/automatic-acceptance claims.
- B3: revise fixture acceptance to deterministic programmatic pose fixtures
  and defer moving side-on browser fixtures to existing `SS-014`.

Claude focused QA re-review confirmed B1-B3 closure and granted implementation
permission on 2026-06-13.

Required before merge:

- R1: implement only the enumerated `PhaseWarningCode` values above; codes must
  contain no landmarks, timestamps, media characteristics, or identifiers.
- R2: test accepted matching `pose.timestampMs === requestedTimestampMs` and
  rejected mismatched pose/request timestamps.
- R3: verify dedicated `SS-TC-011` records warning-code and timestamp-mismatch
  acceptance coverage before merge.
