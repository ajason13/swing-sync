import { describe, expect, it, vi } from "vitest";
import { PoseSession, type PoseSessionStatus } from "../../src/pose-session";
import type { PoseWorkerRequest, PoseWorkerResponse } from "../../src/pose-contract";

class FakeWorker {
  readonly posted: PoseWorkerRequest[] = [];
  terminated = false;
  throwOnPost = false;
  private listeners = new Map<string, ((event: MessageEvent<PoseWorkerResponse>) => void)[]>();

  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    const callback = listener as (event: MessageEvent<PoseWorkerResponse>) => void;
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), callback]);
  }

  postMessage(message: PoseWorkerRequest): void {
    if (this.throwOnPost) throw new DOMException("Clone failed", "DataCloneError");
    this.posted.push(message);
  }

  terminate(): void {
    this.terminated = true;
  }

  emit(message: PoseWorkerResponse): void {
    for (const listener of this.listeners.get("message") ?? []) {
      listener({ data: message } as MessageEvent<PoseWorkerResponse>);
    }
  }

  emitEvent(type: "error" | "messageerror"): void {
    for (const listener of this.listeners.get(type) ?? []) {
      listener({} as MessageEvent<PoseWorkerResponse>);
    }
  }
}

function createHarness() {
  const worker = new FakeWorker();
  const statuses: PoseSessionStatus[] = [];
  const onResult = vi.fn();
  const session = new PoseSession(
    { onStatus: (status) => statuses.push(status), onResult },
    () => worker as unknown as Worker
  );
  return { worker, statuses, onResult, session };
}

describe("pose session controller", () => {
  it("initializes, accepts one frame, returns a result, and tears down", () => {
    const { worker, statuses, onResult, session } = createHarness();
    const close = vi.fn();
    const bitmap = { close } as unknown as ImageBitmap;

    session.initialize();
    worker.emit({ type: "ready" });
    expect(session.submitFrame(bitmap, 0)).toBe(true);
    worker.emit({
      type: "result",
      timestampMs: 0,
      landmarks: [],
      worldLandmarks: [],
      thresholds: {
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      }
    });
    session.teardown();
    worker.emit({ type: "torn-down" });

    expect(worker.posted.map((message) => message.type)).toEqual(["init", "frame", "teardown"]);
    expect(statuses).toEqual(["loading", "ready", "processing", "ready", "closed"]);
    expect(onResult).toHaveBeenCalledOnce();
    expect(worker.terminated).toBe(true);
  });

  it("closes a frame instead of queueing while the worker is busy", () => {
    const { worker, session } = createHarness();
    const first = { close: vi.fn() } as unknown as ImageBitmap;
    const dropped = { close: vi.fn() } as unknown as ImageBitmap;

    session.initialize();
    worker.emit({ type: "ready" });
    expect(session.submitFrame(first, 0)).toBe(true);
    expect(session.submitFrame(dropped, 1)).toBe(false);

    expect(dropped.close).toHaveBeenCalledOnce();
    expect(worker.posted.filter((message) => message.type === "frame")).toHaveLength(1);
  });

  it("closes the frame and fails closed when worker transfer throws", () => {
    const { worker, statuses, session } = createHarness();
    const input = { close: vi.fn() } as unknown as ImageBitmap;

    session.initialize();
    worker.emit({ type: "ready" });
    worker.throwOnPost = true;

    expect(session.submitFrame(input, 0)).toBe(false);
    expect(input.close).toHaveBeenCalledOnce();
    expect(statuses).toEqual(["loading", "ready", "processing", "error"]);
    expect(worker.terminated).toBe(true);
  });

  it("fails closed and terminates on initialization error", () => {
    const { worker, statuses, session } = createHarness();

    session.initialize();
    worker.emit({ type: "init-error", code: "LOCAL_MODEL_INIT_FAILED" });

    expect(statuses).toEqual(["loading", "error"]);
    expect(worker.terminated).toBe(true);
  });

  it("aborts immediately when the application detects an unexpected request", () => {
    const { worker, statuses, session } = createHarness();

    session.initialize();
    session.abort("UNEXPECTED_NETWORK_BLOCKED");

    expect(statuses).toEqual(["loading", "error"]);
    expect(worker.terminated).toBe(true);
  });

  it("fails closed on a worker messageerror", () => {
    const { worker, statuses, session } = createHarness();

    session.initialize();
    worker.emitEvent("messageerror");

    expect(statuses).toEqual(["loading", "error"]);
    expect(worker.terminated).toBe(true);
  });

  it("keeps repeated failure signals idempotent", () => {
    const { worker, statuses, session } = createHarness();

    session.initialize();
    session.abort("UNEXPECTED_NETWORK_BLOCKED");
    worker.emit({ type: "inference-error", code: "UNEXPECTED_NETWORK_BLOCKED" });

    expect(statuses).toEqual(["loading", "error"]);
    expect(worker.terminated).toBe(true);
  });
});
