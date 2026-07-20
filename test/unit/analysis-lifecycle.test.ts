import { describe, expect, it, vi } from "vitest";
import { AnalysisLifecycle } from "../../src/analysis-lifecycle";
import {
  createInitialAppState,
  selectLocalVideo,
  selectWorkflowStep,
  setProcessingState
} from "../../src/app-state";
import { renderApp } from "../../src/app-renderer";

class FakeElement {
  innerHTML = "";
}

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("analysis lifecycle ownership", () => {
  it("keeps network-blocked abort scoped to active local processing", () => {
    const state = createInitialAppState();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender: () => undefined
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

  it("clears lifecycle-owned controller handles and syncs app-state idle on close", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const close = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender
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
    expect(requestRender).toHaveBeenCalledTimes(1);
  });

  it("re-renders capture controls after async close settles", async () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createInitialAppState();
    const closeDeferred = deferred();
    const requestRender = vi.fn(() => renderApp(root, state, true));
    const lifecycle = new AnalysisLifecycle({
      root: root as unknown as ParentNode,
      state,
      requestRender
    });
    Object.assign(lifecycle as unknown as { frameController?: { close: () => Promise<void> } }, {
      frameController: { close: () => closeDeferred.promise }
    });
    selectLocalVideo(state, new File(["video"], "swing.mp4", { type: "video/mp4" }));
    selectWorkflowStep(state, "processing");
    setProcessingState(state, "processing");

    const closePromise = lifecycle.closeActive();
    selectWorkflowStep(state, "capture");
    renderApp(root, state, true);

    expect(root.innerHTML).toMatch(/id="analysis-button"[\s\S]*disabled/);

    closeDeferred.resolve();
    await closePromise;

    expect(requestRender).toHaveBeenCalledTimes(1);
    expect(root.innerHTML).toContain('id="analysis-button"');
    expect(root.innerHTML).not.toMatch(/id="analysis-button"[\s\S]*disabled/);
  });

  it("stops active processing and requests an idle capture render", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const cancel = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender
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
    expect(requestRender).toHaveBeenCalledWith("Local analysis stopped and volatile resources were released.");
  });
});
