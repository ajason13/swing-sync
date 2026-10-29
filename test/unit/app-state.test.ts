import { describe, expect, it } from "vitest";
import {
  createInitialAppState,
  resetAppState,
  resetPhaseReview,
  selectCanBeginAnalysis,
  selectLocalVideo,
  selectWorkflowStep,
  setProcessingState,
  setSwingCardBusy,
  setSwingCardStatus
} from "../../src/app-state";
import { setAnalysisInterval, setVideoDuration } from "../../src/app-state";

function file(): File {
  return new File(["video"], "swing.mp4", { type: "video/mp4" });
}

describe("app state transitions", () => {
  it("initializes a full interval and retains user selection when the same file is decoded again", () => {
    const state = createInitialAppState();
    setVideoDuration(state, NaN);
    expect(state.analysisInterval).toBeUndefined();
    setVideoDuration(state, 2);
    expect(state.analysisInterval).toEqual({ startSeconds: 0, endSeconds: 2 });
    setAnalysisInterval(state, { startSeconds: 0.5, endSeconds: 1.5 });
    setVideoDuration(state, 2);
    expect(state.analysisInterval).toEqual({ startSeconds: 0.5, endSeconds: 1.5 });
    selectLocalVideo(state, file());
    expect(state.analysisInterval).toBeUndefined();
    expect(state.videoDuration).toBeUndefined();
  });

  it("invalidates phase, metric and export readiness even for invalid interval edits", () => {
    const state = createInitialAppState();
    selectLocalVideo(state, file());
    setVideoDuration(state, 2);
    state.phaseConfirmation = true;
    state.phaseOutputs = [{} as never];
    state.phaseDraft = [{ phaseId: "address", sampleIndex: 0 } as never];
    state.phaseReviewState = { readyForFutureMetrics: true } as never;
    state.latestOverlayResult = {} as never;
    state.extractedFrameCount = 8;
    state.swingCardBusy = true;
    const token = state.swingCardToken;
    setAnalysisInterval(state, { startSeconds: 1, endSeconds: 0.5 });
    expect(state.phaseOutputs).toEqual([]);
    expect(state.phaseDraft).toEqual([]);
    expect(state.phaseReviewState).toBeUndefined();
    expect(state.latestOverlayResult).toBeUndefined();
    expect(state.phaseConfirmation).toBe(false);
    expect(state.swingCardBusy).toBe(false);
    expect(state.swingCardToken).not.toBe(token);
    expect(state.extractedFrameCount).toBe(0);
    expect(selectCanBeginAnalysis(state, true)).toBe(false);
    setAnalysisInterval(state, { startSeconds: 0.5, endSeconds: 2 });
    expect(selectCanBeginAnalysis(state, true)).toBe(true);
  });
  it("keeps Begin analysis gating in one selector", () => {
    const state = createInitialAppState();

    expect(selectCanBeginAnalysis(state, false)).toBe(false);
    expect(selectCanBeginAnalysis(state, true)).toBe(false);

    selectLocalVideo(state, file());
    expect(selectCanBeginAnalysis(state, false)).toBe(false);
    expect(selectCanBeginAnalysis(state, true)).toBe(true);

    setProcessingState(state, "processing");
    expect(selectCanBeginAnalysis(state, true)).toBe(false);

    setProcessingState(state, "idle");
    selectWorkflowStep(state, "review");
    expect(selectCanBeginAnalysis(state, true)).toBe(false);
  });

  it("resets phase and Swing Card volatile state without clearing selected video", () => {
    const state = createInitialAppState();
    const selected = file();
    selectLocalVideo(state, selected);
    setSwingCardBusy(state, true);
    setSwingCardStatus(state, "Preparing prompt text.");
    state.phaseConfirmation = true;
    state.selectedKeyframeIndex = 3;

    resetPhaseReview(state);

    expect(state.selectedVideo).toBe(selected);
    expect(state.phaseConfirmation).toBe(false);
    expect(state.selectedKeyframeIndex).toBe(0);
    expect(state.swingCardBusy).toBe(false);
    expect(state.swingCardStatus).toBe("Swing Card export is generated locally after review data exists.");
  });

  it("resets the full volatile analysis session for clear-local-data", () => {
    const state = createInitialAppState();
    selectLocalVideo(state, file());
    selectWorkflowStep(state, "review");
    setProcessingState(state, "completed");
    state.phaseConfirmation = true;
    state.latestLandmarkCount = 33;

    const previousToken = state.swingCardToken;
    resetAppState(state);

    expect(state.swingCardToken).not.toBe(previousToken);
    expect(state).toEqual({ ...createInitialAppState(), swingCardToken: state.swingCardToken });
  });
});
