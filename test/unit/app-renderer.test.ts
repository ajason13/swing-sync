import { describe, expect, it } from "vitest";
import type { SampledFrameOutput } from "../../src/frame-processing";
import { renderApp, updateProcessingProgressUi } from "../../src/app-renderer";
import {
  completeProcessingWithOutputs,
  createInitialAppState,
  rebuildPhaseReviewState,
  selectLocalVideo,
  selectWorkflowStep,
  setPhaseDeclaration,
  setProcessingProgress,
  setProcessingState
} from "../../src/app-state";
import { phaseDefinitions } from "../../src/phase-review";
import { poseThresholds, type PoseFrameResult, type PoseLandmark } from "../../src/pose-contract";

class FakeElement {
  innerHTML = "";
  textContent = "";
  hidden = false;
  private readonly selectors = new Map<string, FakeElement>();

  querySelector<T>(_selector: string): T | null {
    return (this.selectors.get(_selector) ?? null) as T | null;
  }

  set(selector: string, element: FakeElement): void {
    this.selectors.set(selector, element);
  }
}

function landmark(): PoseLandmark {
  return { x: 0.5, y: 0.5, z: 0, visibility: 1 };
}

function pose(timestampMs: number): PoseFrameResult {
  return {
    timestampMs,
    landmarks: [Array.from({ length: 33 }, landmark)],
    worldLandmarks: [Array.from({ length: 33 }, landmark)],
    thresholds: poseThresholds
  };
}

function sampledOutputs(): SampledFrameOutput[] {
  return phaseDefinitions.map((_, index) => ({
    runGeneration: 1,
    index,
    requestedTimestampMs: index * 100,
    observedSeekTimestampMs: index * 100 + 0.5,
    preview: { close: () => undefined, width: 320, height: 180 } as unknown as ImageBitmap,
    pose: pose(index * 100)
  }));
}

function createReviewReadyState() {
  const state = createInitialAppState();
  completeProcessingWithOutputs(state, { getOutputs: () => sampledOutputs() });
  setPhaseDeclaration(state, "view", "face-on");
  setPhaseDeclaration(state, "handedness", "right");
  setPhaseDeclaration(state, "mirrored", "no");
  setPhaseDeclaration(state, "setup", "confirmed");
  rebuildPhaseReviewState(state);
  return state;
}

describe("app renderer contracts", () => {
  it("preserves protected capture selectors and escapes selected file names", () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createInitialAppState();
    selectLocalVideo(state, new File(["video"], `<bad "name">.mp4`, { type: "video/mp4" }));

    renderApp(root, state, true);

    expect(root.innerHTML).toContain('id="analysis-button"');
    expect(root.innerHTML).toContain('id="video-file"');
    expect(root.innerHTML).toContain("Local video source");
    expect(root.innerHTML).toContain("&lt;bad &quot;name&quot;&gt;.mp4");
    expect(root.innerHTML).not.toContain(`<bad "name">.mp4`);
  });

  it("preserves protected phase-review selectors and labels", () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createReviewReadyState();
    selectWorkflowStep(state, "review");

    renderApp(root, state, true);

    for (const value of [
      "Swing phase assignments",
      "View",
      "Handedness",
      "Horizontally mirrored",
      "Select keyframe",
      "data-confirm-phase-review",
      "data-phase-index",
      "data-open-export"
    ]) {
      expect(root.innerHTML).toContain(value);
    }
  });

  it("preserves protected export and remote-review-unavailable selectors and labels", () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createReviewReadyState();
    selectWorkflowStep(state, "export");

    renderApp(root, state, true);

    for (const value of [
      "Downloadable summary",
      "Remote model review unavailable",
      "Remote model data disclosure",
      "data-download-swing-card",
      "data-print-swing-card",
      "data-copy-swing-card-prompt",
      "data-swing-card-status",
      "data-swing-card-print-host",
      "data-remote-model-send"
    ]) {
      expect(root.innerHTML).toContain(value);
    }
  });

  it("updates current processing DOM by re-querying targets and no-ops when absent", () => {
    const state = createInitialAppState();
    selectWorkflowStep(state, "processing");
    setProcessingState(state, "processing");
    setProcessingProgress(state, 1, 8);

    const detachedSummary = new FakeElement();
    const oldRoot = new FakeElement();
    oldRoot.set("[data-pose-summary]", detachedSummary);
    updateProcessingProgressUi(oldRoot as unknown as ParentNode, state);
    expect(detachedSummary.textContent).toContain("1 of 8");

    setProcessingProgress(state, 2, 8);
    const visibleSummary = new FakeElement();
    const nextRoot = new FakeElement();
    nextRoot.set("[data-pose-summary]", visibleSummary);
    updateProcessingProgressUi(nextRoot as unknown as ParentNode, state);

    expect(visibleSummary.textContent).toContain("2 of 8");
    expect(detachedSummary.textContent).toContain("1 of 8");
    expect(() => updateProcessingProgressUi(new FakeElement() as unknown as ParentNode, state)).not.toThrow();
  });
});
