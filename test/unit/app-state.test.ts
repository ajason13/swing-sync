import { describe, expect, it } from "vitest";
import {
  createInitialAppState,
  resetPhaseReview,
  selectCanBeginAnalysis,
  selectLocalVideo,
  selectWorkflowStep,
  setProcessingState,
  setSwingCardBusy,
  setSwingCardStatus
} from "../../src/app-state";

function file(): File {
  return new File(["video"], "swing.mp4", { type: "video/mp4" });
}

describe("app state transitions", () => {
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
});
