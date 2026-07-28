import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SampledFrameOutput } from "../../src/frame-processing";
import {
  completeProcessingWithOutputs,
  createInitialAppState,
  rebuildPhaseReviewState,
  setPhaseDeclaration
} from "../../src/app-state";
import { phaseDefinitions } from "../../src/phase-review";
import { poseThresholds, type PoseFrameResult, type PoseLandmark } from "../../src/pose-contract";
import {
  copySwingCardPrompt,
  downloadSwingCard,
  prepareSwingCardContent,
  printSwingCard
} from "../../src/swing-card-actions";

const generatorMocks = vi.hoisted(() => ({
  composeSwingCardPng: vi.fn(),
  renderSwingCardPrintSurface: vi.fn(),
  triggerSwingCardDownload: vi.fn()
}));

vi.mock("../../src/swing-card-generator", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../src/swing-card-generator")>()),
  ...generatorMocks
}));

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
    runGeneration: 9,
    index,
    requestedTimestampMs: index * 100,
    observedSeekTimestampMs: 12345 + index,
    preview: { close: vi.fn(), width: 320, height: 180 } as unknown as ImageBitmap,
    pose: pose(index * 100)
  }));
}

describe("swing card actions", () => {
  beforeEach(() => {
    generatorMocks.composeSwingCardPng.mockReset();
    generatorMocks.renderSwingCardPrintSurface.mockReset();
    generatorMocks.triggerSwingCardDownload.mockReset();
    vi.unstubAllGlobals();
  });

  it("uses exact global start and completion requests for Swing Card download", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const blob = new Blob(["png"], { type: "image/png" });
    generatorMocks.composeSwingCardPng.mockResolvedValue({
      status: "ok",
      blob,
      filename: "swing-card.png",
      warnings: []
    });

    await downloadSwingCard(state, requestRender);

    expect(requestRender).toHaveBeenNthCalledWith(1, {
      focusKey: "swing-card-status",
      visibleStatusText: "Preparing local Swing Card PNG.",
      announcement: "Preparing local Swing Card PNG."
    });
    expect(generatorMocks.triggerSwingCardDownload).toHaveBeenCalledWith(blob, "swing-card.png");
    expect(requestRender).toHaveBeenNthCalledWith(2, {
      focusKey: "swing-card-download",
      visibleStatusText: "Swing Card PNG download started.",
      announcement: "Swing Card PNG download started."
    });
    expect(requestRender).toHaveBeenCalledTimes(2);
    expect(state.swingCardStatus).toBe("Swing Card PNG download started.");
    expect(state.swingCardBusy).toBe(false);
  });

  it("uses the exact download failure result and restores download focus", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    generatorMocks.composeSwingCardPng.mockResolvedValue({
      status: "error",
      reason: "CANVAS_UNAVAILABLE",
      warnings: []
    });

    await downloadSwingCard(state, requestRender);

    expect(requestRender).toHaveBeenNthCalledWith(1, {
      focusKey: "swing-card-status",
      visibleStatusText: "Preparing local Swing Card PNG.",
      announcement: "Preparing local Swing Card PNG."
    });
    expect(generatorMocks.triggerSwingCardDownload).not.toHaveBeenCalled();
    expect(requestRender).toHaveBeenNthCalledWith(2, {
      focusKey: "swing-card-download",
      visibleStatusText: "Swing Card PNG export stopped (CANVAS_UNAVAILABLE).",
      announcement: "Swing Card PNG export stopped (CANVAS_UNAVAILABLE)."
    });
    expect(requestRender).toHaveBeenCalledTimes(2);
    expect(state.swingCardStatus).toBe("Swing Card PNG export stopped (CANVAS_UNAVAILABLE).");
    expect(state.swingCardBusy).toBe(false);
  });

  it("uses exact global start and completion requests for Swing Card print", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const replaceChildren = vi.fn();
    const printSurface = {} as HTMLElement;
    const print = vi.fn();
    generatorMocks.renderSwingCardPrintSurface.mockReturnValue(printSurface);
    vi.stubGlobal("window", { print });

    await printSwingCard({
      querySelector: (selector: string) => selector === "[data-swing-card-print-host]" ? { replaceChildren } : null
    } as unknown as ParentNode, state, requestRender);

    expect(requestRender).toHaveBeenNthCalledWith(1, {
      focusKey: "swing-card-status",
      visibleStatusText: "Preparing browser print view.",
      announcement: "Preparing browser print view."
    });
    expect(replaceChildren).toHaveBeenCalledWith(printSurface);
    expect(print).toHaveBeenCalledOnce();
    expect(requestRender).toHaveBeenNthCalledWith(2, {
      focusKey: "swing-card-print",
      visibleStatusText: "Browser print dialog opened. Save as PDF if your browser supports it.",
      announcement: "Browser print dialog opened. Save as PDF if your browser supports it."
    });
    expect(requestRender).toHaveBeenCalledTimes(2);
    expect(state.swingCardStatus).toBe("Browser print dialog opened. Save as PDF if your browser supports it.");
    expect(state.swingCardBusy).toBe(false);
  });

  it("uses the exact print failure result and restores print focus", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    generatorMocks.renderSwingCardPrintSurface.mockReturnValue({} as HTMLElement);
    vi.stubGlobal("window", { print: vi.fn() });

    await printSwingCard({
      querySelector: () => ({
        replaceChildren: () => {
          throw new Error("print surface unavailable");
        }
      })
    } as unknown as ParentNode, state, requestRender);

    expect(requestRender).toHaveBeenNthCalledWith(1, {
      focusKey: "swing-card-status",
      visibleStatusText: "Preparing browser print view.",
      announcement: "Preparing browser print view."
    });
    expect(requestRender).toHaveBeenNthCalledWith(2, {
      focusKey: "swing-card-print",
      visibleStatusText: "Browser print view could not be prepared.",
      announcement: "Browser print view could not be prepared."
    });
    expect(requestRender).toHaveBeenCalledTimes(2);
    expect(state.swingCardStatus).toBe("Browser print view could not be prepared.");
    expect(state.swingCardBusy).toBe(false);
  });

  it("uses global preparing and result announcements with exact action focus", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn() } });
    await copySwingCardPrompt(state, requestRender);
    expect(requestRender).toHaveBeenNthCalledWith(1, {
      focusKey: "swing-card-status",
      visibleStatusText: "Preparing prompt text.",
      announcement: "Preparing prompt text."
    });
    expect(requestRender).toHaveBeenNthCalledWith(2, {
      focusKey: "swing-card-copy",
      visibleStatusText: "Prompt copied for manual use.",
      announcement: "Prompt copied for manual use."
    });
    expect(requestRender).toHaveBeenCalledTimes(2);
    vi.unstubAllGlobals();
  });

  it("uses the same sole global channel for copy failure", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn(() => Promise.reject(new Error("blocked"))) } });
    await copySwingCardPrompt(state, requestRender);
    expect(requestRender).toHaveBeenNthCalledWith(1, {
      focusKey: "swing-card-status",
      visibleStatusText: "Preparing prompt text.",
      announcement: "Preparing prompt text."
    });
    expect(requestRender).toHaveBeenNthCalledWith(2, {
      focusKey: "swing-card-copy",
      visibleStatusText: "Prompt copy unavailable in this browser.",
      announcement: "Prompt copy unavailable in this browser."
    });
    expect(requestRender).toHaveBeenCalledTimes(2);
    vi.unstubAllGlobals();
  });

  it("keeps observedSeekTimestampMs out of prepared export content from populated keyframes", async () => {
    vi.stubGlobal("document", {
      createElement: () => ({
        width: 0,
        height: 0,
        style: {},
        getBoundingClientRect: () => ({ width: 0, height: 0 }),
        getContext: () => null
      })
    });
    const state = createInitialAppState();
    completeProcessingWithOutputs(state, { getOutputs: () => sampledOutputs() });
    setPhaseDeclaration(state, "view", "face-on");
    setPhaseDeclaration(state, "handedness", "right");
    setPhaseDeclaration(state, "mirrored", "no");
    setPhaseDeclaration(state, "setup", "confirmed");
    rebuildPhaseReviewState(state);

    const prepared = await prepareSwingCardContent(state);

    try {
      expect(state.phaseOutputs.map((output) => output.observedSeekTimestampMs)).toContain(12345);
      expect(prepared.content.keyframes).toHaveLength(phaseDefinitions.length);
      expect(prepared.content.keyframes.some((keyframe) => keyframe.overlay.status === "unavailable")).toBe(true);
      expect(JSON.stringify(prepared.content)).not.toContain("observedSeekTimestampMs");
      expect(JSON.stringify(prepared.content.keyframes)).not.toContain("12345");
      expect(prepared.content.analysisPrompt).not.toContain("observedSeekTimestampMs");
      expect(prepared.content.analysisPrompt).not.toContain("12345");
    } finally {
      prepared.release();
      vi.unstubAllGlobals();
    }
  });
});
