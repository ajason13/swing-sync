# SS-007 Claude Final Adversarial Audit Prompt

Paste everything under **Prompt** into Claude Chat. Claude has no filesystem,
Notion, GitHub, prior-chat, or private-link access. Required implementation
context and evidence are embedded below.

## Prompt

Role: You are the lead final adversarial implementation auditor for Swing Sync.

Stage: Final audit for safety- and coaching-sensitive story
`SS-007 Implement swing phase detector with manual correction`.

Do not write implementation. Attack assumptions, identify fail-open behavior,
check malformed/stale/lifecycle paths, and distinguish blockers from future
work.

## Required Output

- `PASS` or `FAIL`.
- Blocking findings ordered by severity, with exact evidence/fix required.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for PR preparation.

## Approved Scope And Acceptance

SS-007 is a manual-review-only phase-label workflow. It does not claim
automatic phase detection, numeric confidence, moving-video phase accuracy, or
biomechanical correctness.

Current acceptance:

1. Proposes a deterministic initial phase assignment from active SS-006 samples
   and presents it for explicit user review.
2. Allows user correction before future metric generation using
   nondecreasing sample references and explicit confirmation.
3. Emits accessible `unsupported-input` and `review-required` warnings; no
   automatic acceptance occurs.
4. Includes deterministic programmatic pose fixture tests covering vocabulary,
   ordering, correction, unsupported input, provenance, and stale rejection.

Moving side-on browser fixture policy/provenance/coverage is deferred to
existing future story `SS-014` and is not claimed by SS-007.

## Protected Boundaries

- Exact approved `@mediapipe/tasks-vision@0.10.35`, same-origin pinned
  model/WASM assets, dedicated worker VIDEO-mode inference, and complete
  returned normalized/world landmarks remain unchanged.
- SS-006 still owns fixed-budget ordered sampling, requested/observed
  timestamps, bounded previews, one inference frame in flight,
  cancellation/retry/stale rejection, bitmap/object-URL/session cleanup.
- `observedSeekTimestampMs`, landmarks, previews, phase assignments, evidence,
  warnings, and corrections are excluded from diagnostics, persistence,
  transit, and export.
- No new dependency, model, asset, provider, worker, framework, remote API,
  telemetry, remote logging, persistence, resampling, metric calculation,
  coaching, export, or remote review.
- Existing safety acknowledgement and educational/non-medical wording remain.
- Observability is intentionally unchanged: local sanitized lifecycle/error
  state only.

## Changed Runtime Surface

- New pure module: `src/phase-review.ts`.
- Existing `src/main.ts` integrates completed SS-006 outputs with review UI and
  lifecycle cleanup.
- Existing `src/styles.css` adds accessible responsive review-control styles.
- New unit tests: `test/unit/phase-review.test.ts`.
- Existing browser suite adds the real local fixture review flow.
- Protected SS-005/SS-006 modules were not edited.
- No package/dependency/asset changes.

## Complete Critical Phase Module

```ts
import type { SampledFrameOutput } from "./frame-processing";

export const phaseDefinitions = [
  { id: "address", label: "Address" },
  { id: "toe-up", label: "Toe-up" },
  { id: "mid-backswing", label: "Mid-backswing" },
  { id: "top", label: "Top" },
  { id: "mid-downswing", label: "Mid-downswing" },
  { id: "impact", label: "Impact" },
  { id: "mid-follow-through", label: "Mid-follow-through" },
  { id: "finish", label: "Finish" }
] as const;

export type PhaseId = (typeof phaseDefinitions)[number]["id"];
export type PhaseEvidenceStatus = "unsupported-input" | "review-required";
export type PhaseWarningCode =
  | "PHASE_REVIEW_REQUIRED"
  | "IMPACT_NOT_CONFIRMED"
  | "UNSUPPORTED_INPUT";

export interface PhaseDeclarations {
  view: "undeclared" | "face-on";
  handedness: "undeclared" | "right" | "left";
  mirrored: "undeclared" | "yes" | "no";
  setup: "undeclared" | "confirmed";
}

export interface PhaseAssignment {
  phaseId: PhaseId;
  sampleIndex: number;
}

export interface AutomaticPhaseProposal {
  runGeneration: number;
  assignments: readonly PhaseAssignment[];
  evidenceStatus: PhaseEvidenceStatus;
  warningCodes: readonly PhaseWarningCode[];
}

export interface UserPhaseCorrection {
  runGeneration: number;
  assignments: readonly PhaseAssignment[];
  confirmed: true;
}

export interface PhaseReviewState {
  runGeneration: number;
  automaticProposal: AutomaticPhaseProposal;
  correction?: UserPhaseCorrection;
  readyForFutureMetrics: boolean;
}

export function createPhaseProposal(
  outputs: readonly SampledFrameOutput[],
  declarations: PhaseDeclarations
): AutomaticPhaseProposal {
  const runGeneration = outputs[0]?.runGeneration ?? -1;
  if (!isSupportedInput(outputs, declarations)) {
    return {
      runGeneration,
      assignments: [],
      evidenceStatus: "unsupported-input",
      warningCodes: ["UNSUPPORTED_INPUT"]
    };
  }
  return {
    runGeneration,
    assignments: phaseDefinitions.map((phase, sampleIndex) => ({ phaseId: phase.id, sampleIndex })),
    evidenceStatus: "review-required",
    warningCodes: ["PHASE_REVIEW_REQUIRED", "IMPACT_NOT_CONFIRMED"]
  };
}

export function createPhaseReviewState(proposal: AutomaticPhaseProposal): PhaseReviewState {
  return {
    runGeneration: proposal.runGeneration,
    automaticProposal: proposal,
    readyForFutureMetrics: false
  };
}

export function applyPhaseCorrection(
  state: PhaseReviewState,
  assignments: readonly PhaseAssignment[],
  confirmed: boolean,
  activeGeneration: number
): PhaseReviewState {
  if (
    state.runGeneration !== activeGeneration ||
    state.automaticProposal.evidenceStatus !== "review-required" ||
    !confirmed ||
    !isValidCorrection(assignments)
  ) {
    return state;
  }
  const correction: UserPhaseCorrection = {
    runGeneration: activeGeneration,
    assignments: assignments.map((assignment) => ({ ...assignment })),
    confirmed: true
  };
  return { ...state, correction, readyForFutureMetrics: true };
}

export function isValidCorrection(assignments: readonly PhaseAssignment[]): boolean {
  if (assignments.length !== phaseDefinitions.length) return false;
  for (let index = 0; index < phaseDefinitions.length; index += 1) {
    const assignment = assignments[index];
    const previous = assignments[index - 1];
    if (
      assignment?.phaseId !== phaseDefinitions[index].id ||
      !Number.isInteger(assignment.sampleIndex) ||
      assignment.sampleIndex < 0 ||
      assignment.sampleIndex >= phaseDefinitions.length ||
      (index > 0 && (!previous || previous.sampleIndex > assignment.sampleIndex))
    ) {
      return false;
    }
  }
  return true;
}

function isSupportedInput(
  outputs: readonly SampledFrameOutput[],
  declarations: PhaseDeclarations
): boolean {
  if (
    declarations.view !== "face-on" ||
    declarations.handedness === "undeclared" ||
    declarations.mirrored === "undeclared" ||
    declarations.setup !== "confirmed" ||
    outputs.length !== phaseDefinitions.length
  ) {
    return false;
  }
  const generation = outputs[0]?.runGeneration;
  return phaseDefinitions.every((_, index) => {
    const output = outputs[index];
    if (!output) return false;
    const normalized = output.pose.landmarks;
    const world = output.pose.worldLandmarks;
    return (
      output.runGeneration === generation &&
      output.index === index &&
      output.requestedTimestampMs >= 0 &&
      (index === 0 || outputs[index - 1].requestedTimestampMs < output.requestedTimestampMs) &&
      output.pose.timestampMs === output.requestedTimestampMs &&
      normalized.length === 1 &&
      world.length === 1 &&
      normalized[0].length === 33 &&
      world[0].length === 33 &&
      normalized[0].every(isFiniteLandmark) &&
      world[0].every(isFiniteLandmark)
    );
  });
}

function isFiniteLandmark(landmark: { x: number; y: number; z: number; visibility: number }): boolean {
  return [landmark.x, landmark.y, landmark.z, landmark.visibility].every(Number.isFinite);
}
```

## Main-Thread Integration Contract And Implementation

State:

```ts
let phaseOutputs: readonly SampledFrameOutput[] = [];
let phaseDeclarations: PhaseDeclarations = undeclaredPhaseDeclarations();
let phaseReviewState: PhaseReviewState | undefined;
let phaseDraft: PhaseAssignment[] = [];
let phaseConfirmation = false;
```

On completed SS-006 processing:

```ts
if (state === "completed" && frameController) {
  phaseOutputs = frameController.getOutputs();
  phaseDeclarations = undeclaredPhaseDeclarations();
  rebuildPhaseReview(false);
}
```

An explicit "Review phase labels" action opens the review. The existing Review
workflow step also preserves completed outputs when opened directly. Navigating
away from active processing/review otherwise closes the frame controller and
clears phase state.

Declarations:

- View select: starts undeclared; only supported choice is face-on side view.
- Handedness select: starts undeclared; right or left.
- Mirrored select: starts undeclared; yes or no.
- Setup checkbox: user confirms one trimmed complete swing, substantially
  full-body visible, with reasonably stable camera.

Review UI:

- Accessible live status shows Unsupported input, Review required, or Phase
  review confirmed.
- Eight ordered phase selects have stable accessible names.
- Selects are disabled until input is supported and after confirmation.
- Editing any assignment clears the confirmation checkbox.
- Confirm button is disabled unless evidence is `review-required`, correction
  is valid/nondecreasing, explicit confirmation is checked, and state is not
  already ready.
- User-facing copy states suggestions need review, eight samples may not
  contain exact events, Impact cannot be confirmed from body landmarks alone,
  and no metrics are generated by SS-007.

Correction application:

```ts
phaseReviewState = applyPhaseCorrection(
  phaseReviewState,
  phaseDraft,
  phaseConfirmation,
  phaseOutputs[0]?.runGeneration ?? -1
);
```

Cleanup:

```ts
function clearPhaseReview(): void {
  phaseOutputs = [];
  phaseDeclarations = undeclaredPhaseDeclarations();
  phaseReviewState = undefined;
  phaseDraft = [];
  phaseConfirmation = false;
}
```

`clearPhaseReview()` runs before start, retry, cancellation, frame-controller
close, new-file supersession through close, navigation away, and unload close.
The owning SS-006 controller then closes/releases retained previews and output
resources.

No phase state is written to storage, diagnostics, service workers, network,
export, or console.

## Implemented Test Evidence

Unit tests verify:

- deterministic identity proposal and exact enumerated warning codes;
- proposal JSON contains no timestamp, landmark, preview, or observed-seek
  fields;
- undeclared view, handedness, mirrored status, and setup confirmation fail
  closed;
- invalid sample count/generation fail closed;
- matching `pose.timestampMs === requestedTimestampMs` succeeds and mismatch
  fails closed;
- missing, incomplete, non-finite, and sparse pose/sample input fail closed;
- valid confirmed nondecreasing shared-index correction succeeds;
- initial proposal remains unchanged after correction;
- decreasing, missing, duplicate-phase, out-of-range, sparse, stale, and
  unconfirmed corrections are rejected without changing state; and
- unsupported proposal cannot become ready.

Browser tests verify on both desktop and mobile Chromium:

- real approved local fixture completes protected SS-005/SS-006 processing;
- explicit Review action opens with all declarations undeclared and confirm
  disabled;
- all declarations plus setup confirmation produce Review required;
- all eight ordered labels render;
- decreasing correction keeps confirm disabled;
- shared-index nondecreasing correction plus explicit confirmation succeeds;
- future-readiness copy appears while no metrics are generated;
- navigation away clears phase state;
- existing network, storage, consent, worker, failure/retry, cleanup,
  responsiveness, and viewport tests remain green.

## Verification Evidence

Final clean results:

- `npm run test:unit`: PASS, 40 tests.
- `npm run test:smoke`: PASS, 28 desktop/mobile tests.
- `npm run build`: PASS.
- `npm run compliance:verify`: PASS.
- `npm run safety:verify`: PASS.
- `npm run privacy:verify`: PASS.
- `npm run license:audit`: PASS.
- `npm run verify:bundle-license-fixture`: PASS.
- `npm run pose-assets:verify`: PASS.
- `npm run sbom:generate`: PASS, one production component:
  `@mediapipe/tasks-vision@0.10.35`.
- `npm audit --omit=dev`: PASS, zero vulnerabilities.
- `git diff --check`: PASS.

One smoke run was invalid because build/SBOM generation was mistakenly run
concurrently with Playwright's preview server and rewrote `dist`; it was
discarded. The subsequent clean standalone full smoke run passed 28/28.

## Deferred And Non-Claims

- No moving side-on browser fixture or phase-accuracy claim; deferred to
  `SS-014`.
- No numeric confidence or automatic acceptance.
- No automatic phase-selection heuristic beyond the explicit identity initial
  review layout.
- No club/ball/Impact detection.
- No metric calculation, coaching, export, persistence, or remote sharing.
- No new observability.

## Audit Questions

1. Can unsupported or malformed input reach `review-required` or readiness?
2. Can a decreasing, stale, sparse, duplicate-phase, out-of-range, or
   unconfirmed correction reach readiness?
3. Is generation binding and cleanup sufficient across cancel, retry, new file,
   navigation, close, and release?
4. Does retaining `phaseOutputs` during review preserve SS-006 ownership and
   cleanup safely?
5. Does any phase state expose timestamps, landmarks, previews, sensitive
   warning content, or diagnostics?
6. Are the UI warnings, declarations, correction controls, and readiness gate
   accessible and safety-bounded?
7. Are protected SS-005/SS-006 behavior and dependency/model/network/privacy
   boundaries preserved?
8. Do the tests adequately cover current acceptance and likely fail-open
   paths?

