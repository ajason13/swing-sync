import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PoseSession, WORKER_INIT_TIMEOUT_MS, WORKER_INFERENCE_TIMEOUT_MS, WORKER_SHUTDOWN_TIMEOUT_MS } from "../../src/pose-session";
import { PoseFrameProcessor, createBrowserFrameController } from "../../src/browser-frame-processing";
import { createPoseFrameResult, type PoseWorkerRequest, type PoseWorkerResponse } from "../../src/pose-contract";

class WorkerStub extends EventTarget {
  static instances: WorkerStub[] = [];
  terminate = vi.fn();
  postMessage = vi.fn((_message: PoseWorkerRequest, _transfer: Transferable[]) => undefined);
  constructor() { super(); WorkerStub.instances.push(this); }
  emit(data: PoseWorkerResponse) { this.dispatchEvent(new MessageEvent("message", { data })); }
}
const result = { type: "result", ...createPoseFrameResult({ landmarks: [], worldLandmarks: [] }, 0) } as const;
const bitmap = () => ({ close: vi.fn() }) as unknown as ImageBitmap;

beforeEach(() => { vi.useFakeTimers(); WorkerStub.instances = []; vi.stubGlobal("Worker", WorkerStub); });
afterEach(() => { expect(vi.getTimerCount()).toBe(0); vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("worker lifecycle watchdogs", () => {
  it("clears watchdogs on normal results/shutdown and preserves a pending result when busy", async () => {
    const processor = new PoseFrameProcessor();
    const initialized = processor.initialize();
    const worker = WorkerStub.instances[0];
    worker.emit({ type: "ready" }); await initialized;
    expect(vi.getTimerCount()).toBe(0);
    const pending = processor.process(bitmap(), 0);
    const dropped = bitmap();
    await expect(processor.process(dropped, 1)).rejects.toThrow("POSE_SESSION_BUSY");
    expect(dropped.close).toHaveBeenCalledOnce();
    worker.emit(result); await expect(pending).resolves.toEqual(result);
    expect(vi.getTimerCount()).toBe(0);
    const closed = processor.close(); worker.emit({ type: "torn-down" }); await closed;
    expect(worker.terminate).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(WORKER_INIT_TIMEOUT_MS);
    expect(worker.terminate).toHaveBeenCalledOnce();
  });

  it.each(["init", "inference", "shutdown"] as const)("aborts immediately during %s and clears its watchdog", async (stage) => {
    const onStatus = vi.fn(), onResult = vi.fn();
    const session = new PoseSession({ onStatus, onResult }); session.initialize();
    const worker = WorkerStub.instances[0];
    if (stage === "inference") { worker.emit({ type: "ready" }); session.submitFrame(bitmap(), 0); }
    if (stage === "shutdown") session.teardown();
    session.abort("UNEXPECTED_NETWORK_BLOCKED");
    expect(onStatus).toHaveBeenLastCalledWith("error", "UNEXPECTED_NETWORK_BLOCKED");
    worker.emit(result); worker.emit({ type: "ready" });
    await vi.advanceTimersByTimeAsync(WORKER_INIT_TIMEOUT_MS);
    expect(onResult).not.toHaveBeenCalled(); expect(worker.terminate).toHaveBeenCalledOnce();
  });

  it.each(["init", "inference"] as const)("fails a silent %s, clears timers and ignores late messages", async (stage) => {
    const onStatus = vi.fn();
    const onResult = vi.fn();
    const session = new PoseSession({ onStatus, onResult });
    session.initialize();
    const worker = WorkerStub.instances[0];
    const input = bitmap();
    if (stage === "inference") { worker.emit({ type: "ready" }); session.submitFrame(input, 0); }
    const timeout = stage === "init" ? WORKER_INIT_TIMEOUT_MS : WORKER_INFERENCE_TIMEOUT_MS;
    await vi.advanceTimersByTimeAsync(timeout - 1);
    expect(worker.terminate).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(onStatus).toHaveBeenLastCalledWith("error", stage === "init" ? "WORKER_INIT_TIMEOUT" : "WORKER_INFERENCE_TIMEOUT");
    worker.emit({ type: "ready" }); worker.emit(result); worker.emit({ type: "torn-down" });
    expect(onResult).not.toHaveBeenCalled();
    expect(worker.terminate).toHaveBeenCalledOnce();
    // A transferred bitmap must not be closed again by its former owner.
    expect(input.close).not.toHaveBeenCalled();
  });

  it.each(["loading", "processing"] as const)("bounds silent shutdown during %s and never extends it on repeated close", async (stage) => {
    const onStatus = vi.fn();
    const onResult = vi.fn();
    const session = new PoseSession({ onStatus, onResult });
    session.initialize();
    const worker = WorkerStub.instances[0];
    if (stage === "processing") { worker.emit({ type: "ready" }); session.submitFrame(bitmap(), 0); }
    session.teardown();
    await vi.advanceTimersByTimeAsync(WORKER_SHUTDOWN_TIMEOUT_MS - 1);
    session.teardown(); worker.emit({ type: "ready" }); worker.emit(result);
    expect(onResult).not.toHaveBeenCalled();
    const dropped = bitmap(); expect(session.submitFrame(dropped, 1)).toBe(false); expect(dropped.close).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(1);
    expect(onStatus).toHaveBeenLastCalledWith("closed", "WORKER_SHUTDOWN_TIMEOUT");
    expect(worker.terminate).toHaveBeenCalledOnce();
    worker.emit(result); session.teardown();
    expect(onStatus).toHaveBeenCalledTimes(stage === "processing" ? 4 : 2);
  });

  it.each(["constructor", "init", "frame", "teardown", "error", "messageerror", "drop"] as const)("settles %s failures without leaking timers or retained input", async (stage) => {
    const processor = new PoseFrameProcessor();
    if (stage === "constructor") vi.stubGlobal("Worker", class { constructor() { throw new Error("private details"); } });
    if (stage === "init") vi.spyOn(WorkerStub.prototype, "addEventListener").mockImplementation(function (this: WorkerStub, ...args) {
      this.postMessage.mockImplementation(() => { throw new Error("private details"); });
      return EventTarget.prototype.addEventListener.apply(this, args);
    });
    const initialized = processor.initialize();
    if (stage === "constructor" || stage === "init") {
      await expect(initialized).rejects.toThrow(stage === "constructor" ? "WORKER_CONSTRUCTION_FAILED" : "WORKER_MESSAGE_ERROR");
    } else {
      const worker = WorkerStub.instances[0];
      worker.emit({ type: "ready" }); await initialized;
      if (stage === "teardown") {
        worker.postMessage.mockImplementation(() => { throw new Error("private details"); });
        await processor.close();
      } else {
        if (stage === "frame") worker.postMessage.mockImplementation(() => { throw new Error("private details"); });
        const input = bitmap();
        const pending = processor.process(input, 0);
        const code = stage === "frame" || stage === "messageerror" ? "WORKER_MESSAGE_ERROR" : stage === "drop" ? "WORKER_FRAME_DROPPED" : "WORKER_CRASH";
        const rejected = expect(pending).rejects.toThrow(code);
        if (stage === "drop") worker.emit({ type: "frame-dropped", reason: "BUSY", timestampMs: 0 });
        else if (stage !== "frame") worker.dispatchEvent(new Event(stage));
        await rejected;
        expect(input.close).toHaveBeenCalledTimes(stage === "frame" ? 1 : 0);
      }
      expect(worker.terminate).toHaveBeenCalledOnce();
    }
    await processor.close();
    const unsubmitted = bitmap(); await expect(processor.process(unsubmitted, 1)).rejects.toThrow("POSE_SESSION_CLOSED");
    expect(unsubmitted.close).toHaveBeenCalledOnce();
  });

  it.each(["init", "inference"] as const)("rejects pending %s immediately on close and shares the shutdown promise", async (stage) => {
    const processor = new PoseFrameProcessor();
    let pending: Promise<unknown> = processor.initialize();
    const worker = WorkerStub.instances[0];
    if (stage === "inference") { worker.emit({ type: "ready" }); await pending; pending = processor.process(bitmap(), 0); }
    const rejected = expect(pending).rejects.toThrow("POSE_SESSION_CLOSED");
    const closed = processor.close();
    expect(processor.close()).toBe(closed);
    await rejected;
    worker.emit(result); worker.emit({ type: "ready" });
    await vi.advanceTimersByTimeAsync(WORKER_SHUTDOWN_TIMEOUT_MS);
    await closed;
    expect(worker.terminate).toHaveBeenCalledOnce();
  });
});

it("cancels a silent initialization, retries with a new worker, and releases retained previews on inference timeout", async () => {
  class VideoStub extends EventTarget {
    duration = 2; videoWidth = 100; videoHeight = 100; currentTime = 0; src = "";
    load() { if (this.src) this.dispatchEvent(new Event("loadedmetadata")); }
    pause() {} removeAttribute() { this.src = ""; }
  }
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test");
  const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
  const preview = bitmap(), input = bitmap();
  vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValueOnce(preview).mockResolvedValueOnce(input));
  const states: string[] = [];
  const { controller } = createBrowserFrameController(new VideoStub() as unknown as HTMLVideoElement, new File(["synthetic"], "clip.webm"), {
    onState: (state, code) => states.push(code ?? state), onOutput: vi.fn(), onProgress: vi.fn()
  });
  const first = controller.start(); await vi.advanceTimersByTimeAsync(0);
  const cancelled = controller.cancel(); await vi.advanceTimersByTimeAsync(WORKER_SHUTDOWN_TIMEOUT_MS);
  await cancelled; await first;
  const retry = controller.retry(); await vi.advanceTimersByTimeAsync(0);
  WorkerStub.instances[0].emit({ type: "ready" });
  WorkerStub.instances[1].emit({ type: "ready" }); await vi.advanceTimersByTimeAsync(0);
  await vi.advanceTimersByTimeAsync(WORKER_INFERENCE_TIMEOUT_MS); await retry;
  expect(states).toEqual(["loading", "cancelled", "loading", "processing", "WORKER_INFERENCE_TIMEOUT"]);
  expect(preview.close).toHaveBeenCalledOnce(); expect(input.close).not.toHaveBeenCalled();
  expect(revoke).toHaveBeenCalledTimes(2); expect(controller.getOutputs()).toEqual([]);
  await controller.close();
});
