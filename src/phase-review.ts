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
  return {
    ...state,
    correction,
    readyForFutureMetrics: true
  };
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
      Number.isFinite(output.requestedTimestampMs) &&
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
