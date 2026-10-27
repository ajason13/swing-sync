import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SampledFrameOutput } from "../../src/frame-processing";
import {
  completeProcessingWithOutputs,
  resetAppState,
  resetPhaseReview,
  selectWorkflowStep,
  createInitialAppState,
  rebuildPhaseReviewState,
  setPhaseDeclaration,
  setPhaseDraftAssignment,
  setPhaseConfirmation,
  confirmPhaseReview,
  selectKeyframe
} from "../../src/app-state";
import { renderPhaseReview } from "../../src/phase-review-renderer";
import * as keyframeRenderer from "../../src/keyframe-overlay-renderer";
import type { PoseOverlayRenderResult } from "../../src/pose-renderer";
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

function populatedState() {
  const state = createInitialAppState();
  state.activeStep = "export";
  completeProcessingWithOutputs(state, { getOutputs: sampledOutputs });
  setPhaseDeclaration(state, "view", "face-on");
  setPhaseDeclaration(state, "handedness", "right");
  setPhaseDeclaration(state, "mirrored", "no");
  setPhaseDeclaration(state, "setup", "confirmed");
  rebuildPhaseReviewState(state);
  return state;
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
}

const unavailableOverlay: PoseOverlayRenderResult = {
  status: "unavailable", renderedSegments: 0, skippedSegments: 0, warnings: [], width: 0, height: 0
};

const actionCases = [
  ["PNG", downloadSwingCard, "LOCAL_EXPORT_FAILED"],
  ["print", (state, render) => printSwingCard({ querySelector: () => null } as unknown as ParentNode, state, render), "Browser print view could not be prepared."],
  ["copy", copySwingCardPrompt, "Prompt copy unavailable in this browser."]
] as const satisfies readonly (readonly [string, typeof downloadSwingCard, string])[];

describe("swing card actions", () => {
  afterEach(() => vi.restoreAllMocks());
  beforeEach(() => {
    generatorMocks.composeSwingCardPng.mockReset();
    generatorMocks.renderSwingCardPrintSurface.mockReset();
    generatorMocks.triggerSwingCardDownload.mockReset();
    vi.unstubAllGlobals();
  });

  it("uses the corrected sample for the phase label, canvas, and exported image", async () => {
    const state = populatedState();
    setPhaseConfirmation(state, true);
    selectKeyframe(state, 7);
    setPhaseDraftAssignment(state, 3, 2);
    expect(state.selectedKeyframeIndex).toBe(3);
    expect(state.phaseConfirmation).toBe(false);
    const html = renderPhaseReview(state);
    expect(html).toContain('id="keyframe-review-heading">Top</h3>');
    expect(html).toContain('aria-label="Annotated keyframe: Top, Sample 3"');
    const draw = vi.fn(() => unavailableOverlay);
    const root = { querySelector: () => ({}) } as unknown as ParentNode;
    keyframeRenderer.renderSelectedKeyframeCanvas(root, state, false, draw);
    expect(draw).toHaveBeenCalledWith(expect.anything(), {
      preview: state.phaseOutputs[2].preview,
      landmarks: state.phaseOutputs[2].pose.landmarks[0]
    });
    setPhaseConfirmation(state, true);
    confirmPhaseReview(state);
    expect(state.phaseReviewState?.readyForFutureMetrics).toBe(true);
    const renderer = vi.spyOn(keyframeRenderer, "renderAnnotatedKeyframe")
      .mockImplementation(async (output) => ({ preview: output.preview, overlay: unavailableOverlay }));
    const prepared = await prepareSwingCardContent(state);
    expect(renderer.mock.calls[3][0]).toBe(state.phaseOutputs[2]);
    expect(prepared.content.keyframes[3]).toMatchObject({
      phaseLabel: "Top", preview: state.phaseOutputs[2].preview
    });
    prepared.release();

    setPhaseDeclaration(state, "mirrored", "yes");
    rebuildPhaseReviewState(state);
    expect(state.phaseReviewState?.readyForFutureMetrics).toBe(false);
    expect(state.phaseConfirmation).toBe(false);
    draw.mockClear();
    keyframeRenderer.renderSelectedKeyframeCanvas(root, state, false, draw);
    expect(draw).toHaveBeenCalledWith(expect.anything(), {
      preview: state.phaseOutputs[3].preview,
      landmarks: state.phaseOutputs[3].pose.landmarks[0]
    });
    expect(renderPhaseReview(state)).toContain('aria-label="Annotated keyframe: Top, Sample 4"');
  });

  it.each(actionCases)("recovers %s from partial preparation failure with sanitized status", async (_name, action, failure) => {
    const state = populatedState();
    const outputs = state.phaseOutputs;
    const bitmaps = [0, 1].map(() => ({ close: vi.fn() } as unknown as ImageBitmap));
    const renderer = vi.spyOn(keyframeRenderer, "renderAnnotatedKeyframe")
      .mockResolvedValueOnce({ preview: bitmaps[0], overlay: unavailableOverlay })
      .mockResolvedValueOnce({ preview: bitmaps[1], overlay: unavailableOverlay })
      .mockRejectedValueOnce(new Error("secret-file-and-landmarks"));
    const render = vi.fn();
    await action(state, render);
    expect(renderer).toHaveBeenCalledTimes(3);
    for (const bitmap of bitmaps) expect(bitmap.close).toHaveBeenCalledOnce();
    for (const output of outputs) expect(output.preview?.close).not.toHaveBeenCalled();
    expect(state.swingCardBusy).toBe(false);
    expect(state.swingCardStatus).toContain(failure);
    expect(JSON.stringify(render.mock.calls)).not.toContain("secret-file-and-landmarks");
    expect(render).toHaveBeenCalledTimes(2);
  });

  for (const [cancelName, cancel] of [
    ["navigation", (state) => { selectWorkflowStep(state, "review"); selectWorkflowStep(state, "export"); }],
    ["clear-local-data", resetAppState],
    ["analysis reset", resetPhaseReview]
  ] as const satisfies readonly (readonly [string, (state: ReturnType<typeof createInitialAppState>) => void])[]) {
    it.each(actionCases)(`discards pending %s preparation after ${cancelName}`, async (_name, action) => {
      const state = populatedState();
      const gate = deferred<Awaited<ReturnType<typeof keyframeRenderer.renderAnnotatedKeyframe>>>();
      const renderer = vi.spyOn(keyframeRenderer, "renderAnnotatedKeyframe").mockReturnValueOnce(gate.promise);
      const print = vi.fn();
      const writeText = vi.fn();
      vi.stubGlobal("window", { print });
      vi.stubGlobal("navigator", { clipboard: { writeText } });
      const render = vi.fn();
      const pending = action(state, render);
      cancel(state);
      // A replacement operation must retain its own busy/status values.
      state.swingCardBusy = true;
      state.swingCardStatus = "New session operation";
      const bitmap = { close: vi.fn() } as unknown as ImageBitmap;
      gate.resolve({ preview: bitmap, overlay: unavailableOverlay });
      await pending;
      expect(bitmap.close).toHaveBeenCalledOnce();
      expect(renderer).toHaveBeenCalledOnce();
      expect(generatorMocks.composeSwingCardPng).not.toHaveBeenCalled();
      expect(generatorMocks.renderSwingCardPrintSurface).not.toHaveBeenCalled();
      expect(generatorMocks.triggerSwingCardDownload).not.toHaveBeenCalled();
      expect(print).not.toHaveBeenCalled();
      expect(writeText).not.toHaveBeenCalled();
      expect(state.swingCardBusy).toBe(true);
      expect(state.swingCardStatus).toBe("New session operation");
      expect(render).toHaveBeenCalledOnce();
    });
  }

  it("discards PNG serialization after navigation and releases all prepared bitmaps", async () => {
    const state = populatedState();
    const bitmaps = phaseDefinitions.map(() => ({ close: vi.fn() } as unknown as ImageBitmap));
    let index = 0;
    vi.spyOn(keyframeRenderer, "renderAnnotatedKeyframe").mockImplementation(async () => ({
      preview: bitmaps[index++], overlay: unavailableOverlay
    }));
    const gate = deferred<unknown>();
    const started = deferred<void>();
    generatorMocks.composeSwingCardPng.mockImplementation(() => { started.resolve(); return gate.promise; });
    const render = vi.fn();
    const pending = downloadSwingCard(state, render);
    await started.promise;
    selectWorkflowStep(state, "review");
    const status = state.swingCardStatus;
    gate.resolve({ status: "ok", blob: new Blob(["png"]), filename: "card.png" });
    await pending;
    expect(generatorMocks.triggerSwingCardDownload).not.toHaveBeenCalled();
    for (const bitmap of bitmaps) expect(bitmap.close).toHaveBeenCalledOnce();
    expect(state.swingCardBusy).toBe(false);
    expect(state.swingCardStatus).toBe(status);
    expect(render).toHaveBeenCalledOnce();
  });

  it.each(["resolve", "reject"] as const)("ignores clipboard %s after reset once a write has already been requested", async (completion) => {
    const state = createInitialAppState();
    const gate = deferred<void>();
    const started = deferred<void>();
    vi.stubGlobal("navigator", { clipboard: { writeText: () => { started.resolve(); return gate.promise; } } });
    const render = vi.fn();
    const pending = copySwingCardPrompt(state, render);
    await started.promise;
    resetAppState(state);
    const status = state.swingCardStatus;
    if (completion === "resolve") gate.resolve();
    else gate.reject(new Error("private clipboard failure"));
    await pending;
    expect(state.swingCardStatus).toBe(status);
    expect(state.swingCardBusy).toBe(false);
    expect(render).toHaveBeenCalledOnce();
  });

  it("releases successful preparation exactly once even if release is repeated", async () => {
    const state = populatedState();
    const bitmaps = phaseDefinitions.map(() => ({ close: vi.fn() } as unknown as ImageBitmap));
    let index = 0;
    vi.spyOn(keyframeRenderer, "renderAnnotatedKeyframe").mockImplementation(async () => ({
      preview: bitmaps[index++], overlay: unavailableOverlay
    }));
    const prepared = await prepareSwingCardContent(state);
    expect(prepared.content.keyframes.map((frame) => frame.preview)).toEqual(bitmaps);
    prepared.release();
    prepared.release();
    for (const bitmap of bitmaps) expect(bitmap.close).toHaveBeenCalledOnce();
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
