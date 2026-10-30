import type { FrameProcessingController, FrameProcessingState, SampledFrameOutput } from "./frame-processing";
import {
  applyPhaseCorrection,
  createPhaseProposal,
  createPhaseReviewState,
  isValidCorrection,
  phaseDefinitions,
  type PhaseAssignment,
  type PhaseDeclarations,
  type PhaseReviewState
} from "./phase-review";
import type { PoseOverlayRenderResult } from "./pose-renderer";
import type { WorkflowStepId } from "./workflow";
import { isValidAnalysisInterval, type AnalysisInterval } from "./analysis-interval";
import { produceMetricPayload } from "./metric-producer";
import type { SwingMetricPayload } from "./metric-contract";

export const initialSwingCardStatus = "Swing Card export is generated locally after review data exists.";

export interface AppState {
  activeStep: WorkflowStepId;
  selectedVideo: File | undefined;
  videoDuration: number | undefined;
  analysisInterval: AnalysisInterval | undefined;
  processingState: FrameProcessingState;
  poseStatusCode: string | undefined;
  extractedFrameCount: number;
  totalFrameCount: number;
  latestLandmarkCount: number;
  phaseOutputs: readonly SampledFrameOutput[];
  manualFrameIndices: (number | undefined)[];
  eventFrameBusy: boolean;
  eventFrameStatus: string;
  phaseDeclarations: PhaseDeclarations;
  phaseReviewState: PhaseReviewState | undefined;
  metricPayload: SwingMetricPayload | undefined;
  phaseDraft: PhaseAssignment[];
  phaseConfirmation: boolean;
  selectedKeyframeIndex: number;
  latestOverlayResult: PoseOverlayRenderResult | undefined;
  // Replaced on navigation/reset so pending exports cannot complete into another session.
  swingCardToken: symbol;
  swingCardBusy: boolean;
  swingCardStatus: string;
}

export function createInitialAppState(): AppState {
  return {
    activeStep: "capture",
    selectedVideo: undefined,
    videoDuration: undefined,
    analysisInterval: undefined,
    processingState: "idle",
    poseStatusCode: undefined,
    extractedFrameCount: 0,
    totalFrameCount: 0,
    latestLandmarkCount: 0,
    phaseOutputs: [],
    manualFrameIndices: [],
    eventFrameBusy: false,
    eventFrameStatus: "",
    phaseDeclarations: undeclaredPhaseDeclarations(),
    phaseReviewState: undefined,
    metricPayload: undefined,
    phaseDraft: [],
    phaseConfirmation: false,
    selectedKeyframeIndex: 0,
    latestOverlayResult: undefined,
    swingCardToken: Symbol("swing-card-session"),
    swingCardBusy: false,
    swingCardStatus: initialSwingCardStatus
  };
}

export function resetAppState(state: AppState): void {
  Object.assign(state, createInitialAppState());
}

export function undeclaredPhaseDeclarations(): PhaseDeclarations {
  return {
    view: "undeclared",
    handedness: "undeclared",
    mirrored: "undeclared",
    setup: "undeclared"
  };
}

export function selectCanBeginAnalysis(state: AppState, consentAccepted: boolean): boolean {
  return (
    state.activeStep === "capture" &&
    consentAccepted &&
    !!state.selectedVideo &&
    (!state.analysisInterval || isValidAnalysisInterval(state.videoDuration ?? NaN, state.analysisInterval)) &&
    !["loading", "processing"].includes(state.processingState)
  );
}

export function selectWorkflowStep(state: AppState, step: WorkflowStepId): void {
  if (state.activeStep !== step) cancelSwingCardExport(state);
  state.activeStep = step;
}

export function selectLocalVideo(state: AppState, video: File): void {
  resetPhaseReview(state);
  resetProcessingCounters(state);
  state.selectedVideo = video;
  state.videoDuration = undefined;
  state.analysisInterval = undefined;
}

export function setVideoDuration(state: AppState, duration: number): void {
  if (!isValidAnalysisInterval(duration, { startSeconds: 0, endSeconds: duration })) return;
  if (state.videoDuration === duration) return;
  state.videoDuration = duration;
  setAnalysisInterval(state, { startSeconds: 0, endSeconds: duration });
}

export function setAnalysisInterval(state: AppState, interval: AnalysisInterval): void {
  if (state.analysisInterval?.startSeconds === interval.startSeconds && state.analysisInterval.endSeconds === interval.endSeconds) return;
  state.analysisInterval = { ...interval };
  resetPhaseReview(state);
  resetProcessingCounters(state);
}

export function setProcessingState(state: AppState, processingState: FrameProcessingState, code?: string): void {
  state.processingState = processingState;
  state.poseStatusCode = code;
}

export function setProcessingProgress(state: AppState, completed: number, total: number): void {
  state.extractedFrameCount = completed;
  state.totalFrameCount = total;
}

export function recordProcessingOutput(state: AppState, output: SampledFrameOutput): void {
  state.latestLandmarkCount = output.pose.landmarks[0]?.length ?? 0;
}

export function completeProcessingWithOutputs(
  state: AppState,
  controller: Pick<FrameProcessingController, "getOutputs">
): void {
  state.phaseOutputs = controller.getOutputs();
  state.selectedKeyframeIndex = 0;
  state.phaseDeclarations = undeclaredPhaseDeclarations();
  rebuildPhaseReviewState(state);
}

export function resetProcessingCounters(state: AppState): void {
  state.extractedFrameCount = 0;
  state.totalFrameCount = 0;
  state.latestLandmarkCount = 0;
}

export function resetPhaseReview(state: AppState): void {
  state.metricPayload = undefined;
  state.phaseOutputs = [];
  state.manualFrameIndices = [];
  state.eventFrameBusy = false;
  state.eventFrameStatus = "";
  state.phaseDeclarations = undeclaredPhaseDeclarations();
  state.phaseReviewState = undefined;
  state.phaseDraft = [];
  state.phaseConfirmation = false;
  state.selectedKeyframeIndex = 0;
  state.latestOverlayResult = undefined;
  cancelSwingCardExport(state);
}

export function rebuildPhaseReviewState(state: AppState): void {
  state.metricPayload = undefined;
  cancelSwingCardExport(state);
  const proposal = createPhaseProposal(state.phaseOutputs.slice(0, phaseDefinitions.length), state.phaseDeclarations);
  state.phaseReviewState = createPhaseReviewState(proposal);
  if (!state.phaseDraft.length && proposal.assignments.length) {
    state.phaseDraft = proposal.assignments.map((assignment) => ({ ...assignment }));
  }
  state.phaseConfirmation = false;
}

export function setPhaseDeclaration<K extends keyof PhaseDeclarations>(
  state: AppState,
  key: K,
  value: PhaseDeclarations[K]
): void {
  invalidatePhaseConfirmation(state);
  state.phaseDeclarations[key] = value;
}

export function setPhaseDraftAssignment(state: AppState, phaseIndex: number, sampleIndex: number): void {
  if (!phaseDefinitions[phaseIndex] || !state.phaseOutputs[sampleIndex] ||
    (sampleIndex >= phaseDefinitions.length && sampleIndex !== state.manualFrameIndices[phaseIndex])) return;
  invalidatePhaseConfirmation(state);
  state.phaseDraft[phaseIndex] = {
    phaseId: phaseDefinitions[phaseIndex].id,
    sampleIndex
  };
  state.phaseConfirmation = false;
  selectKeyframe(state, phaseIndex);
}

export function invalidatePhaseConfirmation(state: AppState): void {
  state.metricPayload = undefined;
  state.phaseConfirmation = false;
  if (state.phaseReviewState) state.phaseReviewState = { ...state.phaseReviewState, correction: undefined, readyForFutureMetrics: false };
  cancelSwingCardExport(state);
}

// Bitmap ownership stays with the lifecycle's bounded per-phase selection map.
export function assignManualPhaseOutput(state: AppState, phaseIndex: number, output: SampledFrameOutput): void {
  const index = state.manualFrameIndices[phaseIndex] ?? state.phaseOutputs.length;
  const outputs = [...state.phaseOutputs];
  outputs[index] = { ...output, index, runGeneration: outputs[0].runGeneration };
  state.phaseOutputs = outputs;
  state.manualFrameIndices[phaseIndex] = index;
  setPhaseDraftAssignment(state, phaseIndex, index);
}

export function setPhaseConfirmation(state: AppState, confirmed: boolean): void {
  if (!confirmed) invalidatePhaseConfirmation(state);
  else state.phaseConfirmation = true;
}

export function confirmPhaseReview(state: AppState): void {
  if (!state.phaseReviewState || state.eventFrameBusy) return;
  cancelSwingCardExport(state);
  state.phaseReviewState = applyPhaseCorrection(
    state.phaseReviewState,
    state.phaseDraft,
    state.phaseConfirmation,
    state.phaseOutputs[0]?.runGeneration ?? -1,
    state.phaseOutputs
  );
  state.metricPayload = state.phaseReviewState.readyForFutureMetrics ? produceMetricPayload({
    outputs: state.phaseOutputs,
    declarations: state.phaseDeclarations,
    review: state.phaseReviewState,
    activeGeneration: state.phaseOutputs[0]?.runGeneration ?? -1
  }) : undefined;
}

export function selectKeyframe(state: AppState, keyframeIndex: number): void {
  state.selectedKeyframeIndex = keyframeIndex;
  state.latestOverlayResult = undefined;
}

// The selected keyframe index identifies a phase; its draft identifies the sample.
export function getSelectedPhasePreview(state: AppState) {
  const phaseIndex = phaseDefinitions[state.selectedKeyframeIndex] ? state.selectedKeyframeIndex : 0;
  const sampleIndex = state.phaseDraft[phaseIndex]?.sampleIndex ?? phaseIndex;
  return {
    phase: phaseDefinitions[phaseIndex],
    sampleIndex,
    output: state.phaseOutputs[sampleIndex]
  };
}

export function setOverlayResult(state: AppState, overlayResult: PoseOverlayRenderResult): void {
  state.latestOverlayResult = overlayResult;
}

export function cancelSwingCardExport(state: AppState): void {
  state.swingCardToken = Symbol("swing-card-session");
  state.swingCardBusy = false;
  state.swingCardStatus = initialSwingCardStatus;
}

export function setSwingCardBusy(state: AppState, busy: boolean): void {
  state.swingCardBusy = busy;
}

export function setSwingCardStatus(state: AppState, status: string): void {
  state.swingCardStatus = status;
}

export function getCompleteSwingCardAssignments(state: AppState): readonly PhaseAssignment[] | undefined {
  if (state.phaseReviewState?.automaticProposal.evidenceStatus !== "review-required") return undefined;
  const assignments = state.phaseReviewState?.correction?.assignments ?? state.phaseDraft;
  return assignments && isValidCorrection(assignments, state.phaseOutputs) && !state.eventFrameBusy ? assignments : undefined;
}
