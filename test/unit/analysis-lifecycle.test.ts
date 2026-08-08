import { describe, expect, it, vi } from "vitest";
import { AnalysisLifecycle } from "../../src/analysis-lifecycle";
import { createInitialAppState, selectWorkflowStep, setProcessingState } from "../../src/app-state";
import type { SampledFrameOutput } from "../../src/frame-processing";

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => { resolve = done; });
  return { promise, resolve };
}

class ProcessingRoot {
  readonly status = { textContent: "", hidden: false };
  readonly summary = { textContent: "", hidden: false };
  readonly retry = { textContent: "", hidden: false };
  readonly review = { textContent: "", hidden: false };
  readonly reviewStatus = { textContent: "", hidden: false };

  querySelector(selector: string) {
    return {
      "#processing-status": this.status,
      "[data-pose-summary]": this.summary,
      "[data-retry-analysis]": this.retry,
      "[data-review-phases]": this.review,
      "#phase-review-status": this.reviewStatus
    }[selector] ?? null;
  }
}

describe("analysis lifecycle ownership", () => {
  it("keeps network-blocked abort scoped to active local processing", () => {
    const state = createInitialAppState();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender: () => undefined,
      applyAccessibilityIntent: () => undefined
    });
    const abort = vi.fn();
    Object.assign(lifecycle as unknown as { abortFrameController?: (code: string) => void }, {
      abortFrameController: abort
    });

    setProcessingState(state, "idle");
    lifecycle.abortWithNetworkBlocked();
    expect(abort).not.toHaveBeenCalled();

    setProcessingState(state, "loading");
    lifecycle.abortWithNetworkBlocked();
    expect(abort).toHaveBeenCalledWith("UNEXPECTED_NETWORK_BLOCKED");
  });

  it("clears lifecycle-owned controller handles and syncs app-state idle on close without rendering", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const close = vi.fn();
    const applyAccessibilityIntent = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender,
      applyAccessibilityIntent
    });
    Object.assign(
      lifecycle as unknown as {
        frameController?: { close: () => Promise<void> };
        abortFrameController?: (code: string) => void;
      },
      {
        frameController: { close },
        abortFrameController: vi.fn()
      }
    );
    setProcessingState(state, "processing");

    await lifecycle.closeActive();

    expect(close).toHaveBeenCalledTimes(1);
    expect(lifecycle.hasActiveController()).toBe(false);
    expect(state.processingState).toBe("idle");
    expect(requestRender).not.toHaveBeenCalled();
    expect(applyAccessibilityIntent).not.toHaveBeenCalled();
  });

  it("keeps stopped announcement owned by stop and close cleanup silent until the caller destination render", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const cancel = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender,
      applyAccessibilityIntent: vi.fn()
    });
    Object.assign(lifecycle as unknown as { frameController?: { cancel: () => Promise<void> } }, {
      frameController: { cancel }
    });
    selectWorkflowStep(state, "processing");
    setProcessingState(state, "processing");

    await lifecycle.stopActive();

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(lifecycle.hasActiveController()).toBe(false);
    expect(state.activeStep).toBe("capture");
    expect(state.processingState).toBe("idle");
    expect(requestRender).toHaveBeenCalledWith({
      focusKey: "stage-heading",
      visibleStatusText: "Local analysis stopped and volatile resources were released.",
      announcement: "Local analysis stopped and volatile resources were released."
    });

    requestRender.mockClear();
    Object.assign(lifecycle as unknown as { frameController?: { close: () => Promise<void> } }, {
      frameController: { close: vi.fn() }
    });
    await lifecycle.closeActive();
    expect(requestRender).not.toHaveBeenCalled();
    requestRender({ focusKey: "stage-heading", announcement: "Capture or upload opened." });
    expect(requestRender).toHaveBeenCalledOnce();
  });

  it("keeps progress ticks partial without global announcements or focus changes", () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const applyAccessibilityIntent = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: { querySelector: () => null } as unknown as ParentNode,
      state,
      requestRender,
      applyAccessibilityIntent
    });
    const token = Symbol("current");
    Object.assign(lifecycle as unknown as { activeCallbackToken: symbol }, { activeCallbackToken: token });
    (lifecycle as unknown as { handleProcessingProgress(token: symbol, complete: number, total: number): void })
      .handleProcessingProgress(token, 3, 8);
    (lifecycle as unknown as { handleProcessingOutput(token: symbol, output: SampledFrameOutput): void })
      .handleProcessingOutput(token, {
        pose: { landmarks: [Array.from({ length: 33 }, () => ({}))] }
      } as unknown as SampledFrameOutput);
    expect(state.extractedFrameCount).toBe(3);
    expect(state.latestLandmarkCount).toBe(33);
    expect(requestRender).not.toHaveBeenCalled();
    expect(applyAccessibilityIntent).not.toHaveBeenCalled();
  });

  it("keeps same-token trailing processing callbacks from overwriting confirmed review DOM", () => {
    const state = createInitialAppState();
    selectWorkflowStep(state, "processing");
    const root = new ProcessingRoot();
    const requestRender = vi.fn();
    const applyAccessibilityIntent = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: root as unknown as ParentNode,
      state,
      requestRender,
      applyAccessibilityIntent
    });
    const token = Symbol("current");
    Object.assign(lifecycle as unknown as {
      activeCallbackToken: symbol;
      frameController: { getOutputs(): [] };
    }, {
      activeCallbackToken: token,
      frameController: { getOutputs: () => [] }
    });
    const callbacks = lifecycle as unknown as {
      handleProcessingState(token: symbol, state: "completed"): void;
      handleProcessingProgress(token: symbol, complete: number, total: number): void;
      handleProcessingOutput(token: symbol, output: SampledFrameOutput): void;
    };

    callbacks.handleProcessingState(token, "completed");
    expect(root.status.textContent).toBe("Local frame processing completed.");

    selectWorkflowStep(state, "review");
    root.reviewStatus.textContent =
      "Phase review is confirmed. Future metric readiness is available for a separately reviewed story; no metrics are generated here.";
    const confirmedReviewStatus = root.reviewStatus.textContent;
    const querySelector = vi.spyOn(root, "querySelector");
    applyAccessibilityIntent.mockClear();

    callbacks.handleProcessingProgress(token, 7, 8);
    callbacks.handleProcessingOutput(token, {
      pose: { landmarks: [Array.from({ length: 33 }, () => ({}))] }
    } as unknown as SampledFrameOutput);
    callbacks.handleProcessingState(token, "completed");

    expect(state.processingState).toBe("completed");
    expect(state.extractedFrameCount).toBe(7);
    expect(state.totalFrameCount).toBe(8);
    expect(state.latestLandmarkCount).toBe(33);
    expect(root.reviewStatus.textContent).toBe(confirmedReviewStatus);
    expect(querySelector).not.toHaveBeenCalled();
    expect(requestRender).not.toHaveBeenCalled();
    expect(applyAccessibilityIntent).not.toHaveBeenCalled();
  });

  it("keeps current loading processing cancelled and closed callbacks partial without focus or global announcements", () => {
    const state = createInitialAppState();
    selectWorkflowStep(state, "processing");
    const root = new ProcessingRoot();
    const requestRender = vi.fn();
    const applyAccessibilityIntent = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: root as unknown as ParentNode,
      state,
      requestRender,
      applyAccessibilityIntent
    });
    const token = Symbol("current");
    Object.assign(lifecycle as unknown as { activeCallbackToken: symbol }, { activeCallbackToken: token });
    const callback = lifecycle as unknown as {
      handleProcessingState(token: symbol, state: "loading" | "processing" | "cancelled" | "closed"): void;
    };

    const cases = [
      {
        state: "loading",
        status: "Loading the local pose model in a background worker.",
        reviewStatus: "Phase review requires local pose model loading and processing to complete."
      },
      {
        state: "processing",
        status: "Processing a local video frame.",
        reviewStatus: "Phase review requires local video frame processing to complete."
      },
      {
        state: "cancelled",
        status: "Local frame processing cancelled.",
        reviewStatus: "Phase review is unavailable because local processing was cancelled."
      },
      {
        state: "closed",
        status: "Local pose session closed.",
        reviewStatus: "Phase review is unavailable because the local pose session was closed."
      }
    ] as const;

    for (const current of cases) {
      callback.handleProcessingState(token, current.state);
      expect(state.processingState).toBe(current.state);
      expect(root.status.textContent).toBe(current.status);
      expect(root.reviewStatus.textContent).toBe(current.reviewStatus);
      expect(root.retry.hidden).toBe(true);
      expect(root.review.hidden).toBe(true);
    }
    expect(requestRender).not.toHaveBeenCalled();
    expect(applyAccessibilityIntent).not.toHaveBeenCalled();
  });

  it("focuses the processing heading and uses only scoped status for current completed and failed terminal states", () => {
    const state = createInitialAppState();
    selectWorkflowStep(state, "processing");
    const requestRender = vi.fn();
    const applyAccessibilityIntent = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: { querySelector: () => null } as unknown as ParentNode,
      state,
      requestRender,
      applyAccessibilityIntent
    });
    const token = Symbol("current");
    Object.assign(lifecycle as unknown as { activeCallbackToken: symbol; frameController: { getOutputs(): [] } }, {
      activeCallbackToken: token,
      frameController: { getOutputs: () => [] }
    });
    const terminal = lifecycle as unknown as { handleProcessingState(token: symbol, state: "completed" | "failed", code?: string): void };
    terminal.handleProcessingState(token, "completed");
    terminal.handleProcessingState(token, "failed", "LOCAL_FAILURE");
    expect(applyAccessibilityIntent).toHaveBeenNthCalledWith(1, { focusKey: "stage-heading" });
    expect(applyAccessibilityIntent).toHaveBeenNthCalledWith(2, { focusKey: "stage-heading" });
    expect(requestRender).not.toHaveBeenCalled();
  });

  it("does not steal focus for late terminal callbacks outside the processing view", () => {
    const state = createInitialAppState();
    selectWorkflowStep(state, "review");
    const applyAccessibilityIntent = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: { querySelector: () => null } as unknown as ParentNode,
      state,
      requestRender: vi.fn(),
      applyAccessibilityIntent
    });
    const token = Symbol("current");
    Object.assign(lifecycle as unknown as { activeCallbackToken: symbol }, { activeCallbackToken: token });
    (lifecycle as unknown as { handleProcessingState(token: symbol, state: "failed"): void })
      .handleProcessingState(token, "failed");
    expect(applyAccessibilityIntent).not.toHaveBeenCalled();
  });

  it("binds terminal callback focus to the originating active controller token", () => {
    const state = createInitialAppState();
    selectWorkflowStep(state, "processing");
    setProcessingState(state, "processing");
    const applyAccessibilityIntent = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: { querySelector: () => null } as unknown as ParentNode,
      state,
      requestRender: vi.fn(),
      applyAccessibilityIntent
    });
    const activeToken = Symbol("active");
    const staleToken = Symbol("stale");
    Object.assign(lifecycle as unknown as { activeCallbackToken: symbol; frameController: { getOutputs(): [] } }, {
      activeCallbackToken: activeToken,
      frameController: { getOutputs: () => [] }
    });
    const terminal = lifecycle as unknown as { handleProcessingState(token: symbol, state: "failed"): void };
    terminal.handleProcessingState(staleToken, "failed");
    expect(state.processingState).toBe("processing");
    expect(applyAccessibilityIntent).not.toHaveBeenCalled();
    terminal.handleProcessingState(activeToken, "failed");
    expect(state.processingState).toBe("failed");
    expect(applyAccessibilityIntent).toHaveBeenCalledOnce();
  });

  it("retries without replacing the video DOM and moves focus once", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const applyAccessibilityIntent = vi.fn();
    const retry = vi.fn();
    const lifecycle = new AnalysisLifecycle({ root: {} as ParentNode, state, requestRender, applyAccessibilityIntent });
    Object.assign(lifecycle as unknown as { frameController: { retry(): Promise<void> } }, {
      frameController: { retry }
    });
    await lifecycle.retryActive();
    expect(retry).toHaveBeenCalledOnce();
    expect(requestRender).not.toHaveBeenCalled();
    expect(applyAccessibilityIntent).toHaveBeenCalledOnce();
  });

  it("invalidates the active callback token before awaited stop or close so racing terminal callbacks are inert", async () => {
    for (const operation of ["stop", "close"] as const) {
      const state = createInitialAppState();
      selectWorkflowStep(state, "processing");
      setProcessingState(state, "processing");
      const gate = deferred();
      const requestRender = vi.fn();
      const applyAccessibilityIntent = vi.fn();
      const lifecycle = new AnalysisLifecycle({
        root: { querySelector: () => null } as unknown as ParentNode,
        state,
        requestRender,
        applyAccessibilityIntent
      });
      const token = Symbol(operation);
      const cleanup = () => gate.promise;
      Object.assign(lifecycle as unknown as {
        activeCallbackToken: symbol;
        frameController: { cancel(): Promise<void>; close(): Promise<void> };
      }, {
        activeCallbackToken: token,
        frameController: { cancel: cleanup, close: cleanup }
      });
      const pending = operation === "stop" ? lifecycle.stopActive() : lifecycle.closeActive();
      const callbacks = lifecycle as unknown as {
        handleProcessingState(token: symbol, state: "failed"): void;
        handleProcessingProgress(token: symbol, complete: number, total: number): void;
        handleProcessingOutput(token: symbol, output: SampledFrameOutput): void;
      };
      callbacks.handleProcessingState(token, "failed");
      callbacks.handleProcessingProgress(token, 7, 8);
      callbacks.handleProcessingOutput(token, {
        pose: { landmarks: [Array.from({ length: 33 }, () => ({}))] }
      } as unknown as SampledFrameOutput);
      expect(state.processingState).toBe("processing");
      expect(state.extractedFrameCount).toBe(0);
      expect(state.latestLandmarkCount).toBe(0);
      expect(applyAccessibilityIntent).not.toHaveBeenCalled();
      gate.resolve();
      await pending;
      expect(state.processingState).toBe("idle");
      expect(requestRender).toHaveBeenCalledTimes(operation === "stop" ? 1 : 0);
    }
  });

  it("keeps closeActive cleanup render-free for navigation picker replacement and beforeunload", async () => {
    for (const owner of ["navigation", "picker replacement", "beforeunload"]) {
      const state = createInitialAppState();
      const requestRender = vi.fn();
      const applyAccessibilityIntent = vi.fn();
      const lifecycle = new AnalysisLifecycle({ root: {} as ParentNode, state, requestRender, applyAccessibilityIntent });
      const close = vi.fn();
      Object.assign(lifecycle as unknown as { frameController: { close(): Promise<void> } }, {
        frameController: { close }
      });
      await lifecycle.closeActive();
      expect(close, owner).toHaveBeenCalledOnce();
      expect(requestRender, owner).not.toHaveBeenCalled();
      expect(applyAccessibilityIntent, owner).not.toHaveBeenCalled();
    }
  });
});
