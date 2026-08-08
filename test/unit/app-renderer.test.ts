import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { SampledFrameOutput } from "../../src/frame-processing";
import { renderApp, updateProcessingProgressUi } from "../../src/app-renderer";
import {
  completeProcessingWithOutputs,
  confirmPhaseReview,
  createInitialAppState,
  rebuildPhaseReviewState,
  selectLocalVideo,
  selectWorkflowStep,
  setPhaseDeclaration,
  setPhaseConfirmation,
  setProcessingProgress,
  setProcessingState
} from "../../src/app-state";
import { phaseDefinitions } from "../../src/phase-review";
import { renderSelectedKeyframeCanvas } from "../../src/keyframe-overlay-renderer";
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
    expect(root.innerHTML).toContain('role="group" aria-label="Local video source"');
    expect(root.innerHTML).toContain('accept="video/*" tabindex="-1" aria-label="Choose a local video file"');
    expect(root.innerHTML).not.toContain('id="video-file" aria-hidden="true"');
    expect(root.innerHTML).toContain('id="app-visible-status"');
    expect(root.innerHTML).not.toMatch(/id="app-visible-status"[^>]*(?:role="status"|aria-live)/);
  });

  it("renders exactly one main landmark across the static host and shell", () => {
    const root = new FakeElement() as unknown as HTMLElement;
    renderApp(root, createInitialAppState(), false);
    const index = readFileSync("index.html", "utf8");
    expect(index).toContain('<div id="app"></div>');
    expect(index).not.toContain('<main id="app"');
    expect(root.innerHTML.match(/<main\b/g)).toHaveLength(1);
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
    expect(root.innerHTML).toContain('role="group" aria-label="Swing phase assignments"');
    expect(root.innerHTML).toContain('role="group" aria-label="Select keyframe"');
    expect(root.innerHTML).toContain('data-keyframe-canvas role="img"');
    expect(root.innerHTML).toContain('aria-describedby="keyframe-overlay-status"');
    expect(root.innerHTML).toContain('id="keyframe-overlay-status" data-overlay-status role="status" aria-live="polite"');
    expect(root.innerHTML).toContain("Skeleton overlay availability is determined locally for this keyframe.");
    expect(root.innerHTML).toContain('id="phase-review-status"');
    expect(root.innerHTML).not.toMatch(/id="phase-review-status"[^>]*(?:role="status"|aria-live)/);
    expect(root.innerHTML.match(/<h3>[^<]+<\/h3>/g)).toHaveLength(8);
    expect(root.innerHTML).toContain('<label class="visually-hidden" for="phase-assignment-0">Address sample</label>');
    expect(root.innerHTML).toContain('id="phase-assignment-0" data-phase-index="0" data-focus-key="phase-assignment:0"');
    expect(root.innerHTML).not.toContain('<label class="phase-assignment">');
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
    expect(root.innerHTML).toContain('role="group" aria-label="Swing Card contents"');
    expect(root.innerHTML).toContain('role="group" aria-label="Remote model data disclosure"');
    expect(root.innerHTML).toContain('<dl class="remote-model-disclosure">');
    expect(root.innerHTML).toContain('id="remote-model-status" data-remote-model-status');
    expect(root.innerHTML).not.toMatch(/id="remote-model-status"[^>]*(?:role="status"|aria-live)/);
    expect(root.innerHTML).toContain('aria-describedby="remote-model-status"');
  });

  it("rejects bare labelled generic containers and keeps the exhaustive role inventory", () => {
    const source = ["src/app-renderer.ts", "src/phase-review-renderer.ts", "src/remote-model-renderer.ts"]
      .map((file) => readFileSync(file, "utf8")).join("\n");
    const labelledGeneric = source.match(/<(?:div|span|p)\b[^>]*aria-label="[^"]+"[^>]*>/g) ?? [];
    expect(labelledGeneric.length).toBeGreaterThan(0);
    for (const element of labelledGeneric) expect(element).toContain('role="group"');
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

  it("updates the review description for completed and failed partial terminal states", () => {
    const state = createInitialAppState();
    const root = new FakeElement();
    const reviewStatus = new FakeElement();
    root.set("#phase-review-status", reviewStatus);
    setProcessingState(state, "completed");
    updateProcessingProgressUi(root as unknown as ParentNode, state);
    expect(reviewStatus.textContent).toBe("Local processing output is ready for phase review.");
    setProcessingState(state, "failed", "LOCAL_MODEL_INIT_FAILED");
    updateProcessingProgressUi(root as unknown as ParentNode, state);
    expect(reviewStatus.textContent).toBe(
      "Phase review is unavailable because local pose analysis stopped (LOCAL_MODEL_INIT_FAILED). Retry local analysis."
    );
  });

  it("uses confirmed-specific phase review copy without a review-needed contradiction", () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createReviewReadyState();
    setPhaseConfirmation(state, true);
    confirmPhaseReview(state);
    selectWorkflowStep(state, "review");
    renderApp(root, state, true);
    expect(root.innerHTML).toContain("Phase review is confirmed.");
    expect(root.innerHTML).not.toContain("Swing phase suggestions need review.");
  });

  it("keeps unrelated canvas redraws silent and lets mapped keyframe selection own scoped status", () => {
    const state = createReviewReadyState();
    const root = new FakeElement();
    const canvas = new FakeElement();
    const status = new FakeElement();
    status.textContent = "Existing accurate status.";
    root.set("[data-keyframe-canvas]", canvas);
    root.set("#keyframe-overlay-status", status);
    const partialResult = {
      status: "partial" as const,
      renderedSegments: 1,
      skippedSegments: 1,
      warnings: [],
      width: 320,
      height: 180
    };
    renderSelectedKeyframeCanvas(root as unknown as ParentNode, state, false, () => partialResult);
    expect(state.latestOverlayResult).toEqual(partialResult);
    expect(status.textContent).toBe("Existing accurate status.");

    renderSelectedKeyframeCanvas(root as unknown as ParentNode, state, true, () => ({
      ...partialResult,
      status: "unavailable"
    }));
    expect(status.textContent).toBe("Skeleton overlay unavailable for this keyframe.");
  });

  it("owns processing scoped status and keeps numeric progress outside it", () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createInitialAppState();
    selectWorkflowStep(state, "processing");
    renderApp(root, state, true);
    expect(root.innerHTML).toContain('role="group" aria-label="Local pose processing"');
    expect(root.innerHTML).toContain('id="processing-status" role="status" aria-live="polite" aria-atomic="true"');
    expect(root.innerHTML).toMatch(/<\/strong>\s*<p data-pose-summary>/);
    expect(root.innerHTML).toContain('data-focus-key="stop-analysis"');
    expect(root.innerHTML).toContain('data-focus-key="retry-analysis"');
  });

  it("labels the unavailable export section and describes its disabled control", () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createInitialAppState();
    selectWorkflowStep(state, "export");
    renderApp(root, state, true);
    expect(root.innerHTML).toContain('<section class="export-placeholder" aria-labelledby="export-placeholder-heading">');
    expect(root.innerHTML).toContain('<h3 id="export-placeholder-heading">Swing Card unavailable</h3>');
    expect(root.innerHTML).toContain('disabled aria-describedby="phase-review-status"');
  });
});
