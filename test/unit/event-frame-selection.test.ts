import { afterEach, describe, expect, it, vi } from "vitest";
import { AnalysisLifecycle } from "../../src/analysis-lifecycle";
import * as browser from "../../src/browser-frame-processing";
import { FrameProcessingController, type SampledFrameOutput, validateRequestedTimestamps } from "../../src/frame-processing";
import { assignManualPhaseOutput, completeProcessingWithOutputs, confirmPhaseReview, createInitialAppState, getCompleteSwingCardAssignments, getSelectedPhasePreview, rebuildPhaseReviewState, setPhaseConfirmation, setPhaseDeclaration, setPhaseDraftAssignment } from "../../src/app-state";
import { isValidCorrection, phaseDefinitions } from "../../src/phase-review";
import { poseThresholds } from "../../src/pose-contract";

function output(time: number, index = 0): SampledFrameOutput {
  const points = Array.from({ length: 33 }, () => ({ x: .5, y: .5, z: 0, visibility: 1 }));
  return { index, runGeneration: 9, requestedTimestampMs: time, observedSeekTimestampMs: time + .25,
    preview: { close: vi.fn(), width: 320, height: 180 } as unknown as ImageBitmap,
    pose: { timestampMs: time, landmarks: [points], worldLandmarks: [points], thresholds: poseThresholds } };
}
function populated() {
  const state = createInitialAppState();
  state.selectedVideo = new File(["synthetic"], "synthetic.webm");
  state.videoDuration = 2;
  state.analysisInterval = { startSeconds: 0, endSeconds: 2 };
  completeProcessingWithOutputs(state, { getOutputs: () => phaseDefinitions.map((_, i) => output(i * 200, i)) });
  state.phaseDeclarations = { view: "face-on", handedness: "right", mirrored: "no", setup: "confirmed" };
  rebuildPhaseReviewState(state);
  state.activeStep = "review";
  return state;
}
function gate() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => { resolve = done; });
  return { promise, resolve };
}

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("selected phase frame contracts", () => {
  it("orders appended selections by source time rather than storage index, keeps provenance, and clears confirmation/export", () => {
    const state = populated();
    setPhaseConfirmation(state, true);
    confirmPhaseReview(state);
    expect(state.phaseReviewState?.readyForFutureMetrics).toBe(true);
    const token = state.swingCardToken;
    const selected = output(650);
    assignManualPhaseOutput(state, 3, selected);
    expect(state.phaseOutputs).toHaveLength(9);
    expect(getSelectedPhasePreview(state).output).toMatchObject({ requestedTimestampMs: 650, observedSeekTimestampMs: 650.25, pose: selected.pose, preview: selected.preview });
    expect(state.phaseConfirmation).toBe(false);
    expect(state.phaseReviewState?.correction).toBeUndefined();
    expect(state.phaseReviewState?.readyForFutureMetrics).toBe(false);
    expect(state.swingCardToken).not.toBe(token);
    expect(isValidCorrection(state.phaseDraft, state.phaseOutputs)).toBe(true);
    setPhaseConfirmation(state, true);
    confirmPhaseReview(state);
    expect(state.phaseReviewState?.correction?.assignments[3].sampleIndex).toBe(8);
    expect(getCompleteSwingCardAssignments(state)?.[3].sampleIndex).toBe(8);
    setPhaseConfirmation(state, false);
    expect(state.phaseReviewState?.readyForFutureMetrics).toBe(false);
    expect(state.phaseReviewState?.correction).toBeUndefined();
    // Declaration changes retain chosen images but require renewed confirmation.
    setPhaseDeclaration(state, "mirrored", "yes");
    rebuildPhaseReviewState(state);
    expect(state.phaseDraft[3].sampleIndex).toBe(8);
    expect(state.phaseReviewState?.readyForFutureMetrics).toBe(false);
    setPhaseDeclaration(state, "view", "undeclared");
    rebuildPhaseReviewState(state);
    expect(getCompleteSwingCardAssignments(state)).toBeUndefined();
  });

  it("allows repeated requests but rejects decreasing, unavailable, mismatched, stale and nonfinite evidence", () => {
    const state = populated();
    assignManualPhaseOutput(state, 3, output(400));
    expect(isValidCorrection(state.phaseDraft, state.phaseOutputs)).toBe(true);
    assignManualPhaseOutput(state, 3, output(399));
    expect(isValidCorrection(state.phaseDraft, state.phaseOutputs)).toBe(false);
    for (const mutate of [
      (o: SampledFrameOutput) => { o.pose.landmarks = []; },
      (o: SampledFrameOutput) => { o.pose.timestampMs += 1; },
      (o: SampledFrameOutput) => { o.observedSeekTimestampMs = NaN; },
      (o: SampledFrameOutput) => { o.pose.worldLandmarks[0][0].x = Infinity; }
    ]) {
      const selected = output(650); mutate(selected);
      assignManualPhaseOutput(state, 3, selected);
      setPhaseConfirmation(state, true); confirmPhaseReview(state);
      expect(state.phaseReviewState?.readyForFutureMetrics).toBe(false);
      expect(getCompleteSwingCardAssignments(state)).toBeUndefined();
    }
    assignManualPhaseOutput(state, 3, output(650));
    (state.phaseOutputs[8] as SampledFrameOutput).runGeneration += 1;
    expect(isValidCorrection(state.phaseDraft, state.phaseOutputs)).toBe(false);
    expect(state.phaseOutputs).toHaveLength(9);
  });

  it("bounds replacement storage and keeps another phase from aliasing a replaceable selection", () => {
    const state = populated();
    for (let phase = 0; phase < 8; phase++) {
      assignManualPhaseOutput(state, phase, output(phase * 200));
      assignManualPhaseOutput(state, phase, output(phase * 200 + 1));
    }
    expect(state.phaseOutputs).toHaveLength(16);
    expect(new Set(state.manualFrameIndices).size).toBe(8);
    const previous = state.phaseDraft[1];
    setPhaseDraftAssignment(state, 1, state.manualFrameIndices[0]!);
    expect(state.phaseDraft[1]).toBe(previous);
  });
});

describe("explicit source-time processing", () => {
  it("validates requests against interval bounds and snapshots mutable caller input", async () => {
    expect(validateRequestedTimestamps(2, { startSeconds: .5, endSeconds: 1.5 }, [650])).toEqual([650]);
    for (const requests of [[], [NaN], [Infinity], [499], [1500], [650, 650], [700, 600], Array(9).fill(650)]) {
      expect(() => validateRequestedTimestamps(2, { startSeconds: .5, endSeconds: 1.5 }, requests)).toThrow("INVALID_EVENT_TIME");
    }
    const seek = vi.fn(async (t: number) => t + .25);
    const inference = { width: 801, height: 603, close: vi.fn() } as unknown as ImageBitmap;
    const frame = output(650);
    const process = vi.fn(async (bitmap: ImageBitmap, time: number) => { bitmap.close(); return { ...frame.pose, timestampMs: time }; });
    const dispose = vi.fn(), close = vi.fn(async () => undefined);
    const requests = [650];
    const controller = new FrameProcessingController({
      createSource: () => ({ load: async () => ({ durationSeconds: 2, width: 320, height: 180 }), seek, createPreview: async () => frame.preview, createInference: async () => inference, dispose }),
      createProcessor: () => ({ initialize: async () => undefined, process, close })
    }, { onState: vi.fn(), onOutput: vi.fn(), onProgress: vi.fn() }, { startSeconds: .5, endSeconds: 1.5 }, requests);
    requests[0] = 1700;
    await controller.start();
    const retained = controller.takeOutputs();
    expect(seek).toHaveBeenCalledWith(650);
    expect(process).toHaveBeenCalledWith(inference, 650);
    expect(retained[0]).toMatchObject({ requestedTimestampMs: 650, observedSeekTimestampMs: 650.25, preview: frame.preview, pose: frame.pose });
    expect(retained[0].inferenceImage).toEqual({ width: 801, height: 603, pose: retained[0].pose });
    expect(retained[0].inferenceImage?.pose).toBe(retained[0].pose);
    await controller.close();
    expect(dispose).toHaveBeenCalledOnce(); expect(close).toHaveBeenCalledOnce();
    expect(frame.preview.close).not.toHaveBeenCalled();
    retained[0].preview.close();
  });
});

describe("manual selection lifecycle", () => {
  function harness(defer?: Promise<void>, fail?: string) {
    const state = populated();
    const frames: SampledFrameOutput[] = [];
    const sources: { dispose: ReturnType<typeof vi.fn> }[] = [];
    vi.stubGlobal("document", { createElement: () => ({}) });
    vi.spyOn(browser, "createBrowserFrameController").mockImplementation((_video, _file, events, interval, requests) => {
      const selected = output(requests![0]); frames.push(selected);
      const source = { load: async () => ({ durationSeconds: 2, width: 320, height: 180 }),
        seek: async (time: number) => { await defer; if (fail) throw new Error(fail); return time + .25; },
        createPreview: async () => selected.preview, createInference: async () => ({ width: 801, height: 603, close() {} }) as ImageBitmap,
        dispose: vi.fn() };
      sources.push(source);
      const controller = new FrameProcessingController({ createSource: () => source,
        createProcessor: () => ({ initialize: async () => undefined, process: async (bitmap, time) => { bitmap.close(); return { ...selected.pose, timestampMs: time }; }, close: async () => undefined })
      }, events, interval, requests);
      return { controller, abort: (code) => { void controller.abort(code); } };
    });
    const requestRender = vi.fn();
    const lifecycle = new AnalysisLifecycle({ state, root: {} as ParentNode, requestRender, applyAccessibilityIntent: vi.fn() });
    setPhaseConfirmation(state, true); confirmPhaseReview(state);
    expect(state.metricPayload).toBeDefined();
    return { state, lifecycle, requestRender, frames, sources };
  }

  it("supports backward requests in fresh sessions, closes replaced images and releases all selected images", async () => {
    const h = harness();
    await h.lifecycle.assignEventFrame(3, 650);
    expect(h.state.metricPayload).toBeUndefined();
    expect(h.state.phaseDraft[3].sampleIndex).toBe(8);
    expect(h.state.phaseOutputs[8].inferenceImage).toMatchObject({ width: 801, height: 603 });
    expect(h.state.phaseOutputs[8].inferenceImage?.pose).toBe(h.state.phaseOutputs[8].pose);
    setPhaseConfirmation(h.state, true); confirmPhaseReview(h.state);
    expect(h.state.metricPayload).toBeDefined();
    await h.lifecycle.assignEventFrame(3, 620);
    expect(h.state.phaseOutputs).toHaveLength(9);
    expect(h.frames[0].preview.close).toHaveBeenCalledOnce();
    expect(h.frames[1].preview.close).not.toHaveBeenCalled();
    expect(h.sources.every(s => s.dispose.mock.calls.length === 1)).toBe(true);
    await h.lifecycle.closeActive();
    expect(h.state.metricPayload).toBeUndefined();
    expect(h.frames[1].preview.close).toHaveBeenCalledOnce();
    expect(h.state.phaseOutputs).toEqual([]);
  });

  it("reports invalid/failed requests locally while preserving assignments and clearing readiness", async () => {
    const h = harness(undefined, "MEDIA_SEEK_TIMEOUT");
    setPhaseConfirmation(h.state, true); confirmPhaseReview(h.state);
    await h.lifecycle.assignEventFrame(3, NaN);
    expect(h.state.eventFrameStatus).toContain("INVALID_EVENT_TIME");
    expect(h.state.phaseReviewState?.readyForFutureMetrics).toBe(false);
    await h.lifecycle.assignEventFrame(3, 650);
    expect(h.state.eventFrameStatus).toContain("MEDIA_SEEK_TIMEOUT");
    expect(h.state.phaseDraft[3].sampleIndex).toBe(3);
    expect(h.state.phaseOutputs).toHaveLength(8);
    expect(h.state.eventFrameBusy).toBe(false);
    expect(h.sources[0].dispose).toHaveBeenCalledOnce();
  });

  it.each(["stop", "close"])("ignores late selection after %s and prevents overlapping requests", async (operation) => {
    const pendingSeek = gate();
    const h = harness(pendingSeek.promise);
    const pending = h.lifecycle.assignEventFrame(3, 650);
    expect(h.state.metricPayload).toBeUndefined();
    await vi.waitFor(() => expect(h.state.eventFrameBusy).toBe(true));
    await h.lifecycle.assignEventFrame(4, 900);
    expect(h.frames).toHaveLength(1);
    const cleanup = operation === "stop" ? h.lifecycle.stopEventFrame() : h.lifecycle.closeActive();
    pendingSeek.resolve();
    await Promise.all([pending, cleanup]);
    expect(h.state.eventFrameBusy).toBe(false);
    expect(h.state.metricPayload).toBeUndefined();
    expect(h.state.phaseOutputs.length).toBe(operation === "stop" ? 8 : 0);
    expect(h.state.phaseDraft[3]?.sampleIndex).toBe(operation === "stop" ? 3 : undefined);
    expect(h.sources[0].dispose).toHaveBeenCalledOnce();
  });
});
