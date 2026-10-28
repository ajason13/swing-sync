import type { PoseFrameResult, PoseWorkerRequest, PoseWorkerResponse } from "./pose-contract";

// Per operation, not a wall-clock guarantee: suspended tabs can delay browser timers.
export const WORKER_INIT_TIMEOUT_MS = 60_000;
export const WORKER_INFERENCE_TIMEOUT_MS = 30_000;
export const WORKER_SHUTDOWN_TIMEOUT_MS = 2_000;

export type PoseSessionStatus = "idle" | "loading" | "ready" | "processing" | "error" | "closed";

export interface PoseSessionEvents {
  onStatus(status: PoseSessionStatus, code?: string): void;
  onResult(result: PoseFrameResult): void;
}

export class PoseSession {
  private worker?: Worker;
  private status: PoseSessionStatus = "idle";
  private closing = false;
  private timer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly events: PoseSessionEvents,
    private readonly createWorker: () => Worker = () =>
      new Worker(new URL("./pose-landmarker.worker.ts", import.meta.url), { type: "module" })
  ) {}

  initialize(): void {
    if (this.status !== "idle") return;
    this.setStatus("loading");
    try {
      this.worker = this.createWorker();
    } catch {
      this.fail("WORKER_CONSTRUCTION_FAILED");
      return;
    }
    this.worker.addEventListener("message", this.handleMessage);
    this.worker.addEventListener("error", this.handleError);
    this.worker.addEventListener("messageerror", this.handleMessageError);
    this.watch(WORKER_INIT_TIMEOUT_MS, () => this.fail("WORKER_INIT_TIMEOUT"));
    try {
      this.post({ type: "init" });
    } catch {
      this.fail("WORKER_MESSAGE_ERROR");
    }
  }

  submitFrame(bitmap: ImageBitmap, timestampMs: number): boolean {
    if (this.status !== "ready" || this.closing) {
      bitmap.close();
      return false;
    }
    this.setStatus("processing");
    this.watch(WORKER_INFERENCE_TIMEOUT_MS, () => this.fail("WORKER_INFERENCE_TIMEOUT"));
    try {
      this.post({ type: "frame", bitmap, timestampMs }, [bitmap]);
      // A successful transfer makes the worker responsible for closing the bitmap.
      // On a hang/crash, termination releases that worker's transferred resources.
      return true;
    } catch {
      bitmap.close();
      this.fail("WORKER_MESSAGE_ERROR");
      return false;
    }
  }

  teardown(): void {
    if (this.closing) return;
    if (!this.worker) {
      this.finishClose();
      return;
    }
    this.closing = true;
    this.watch(WORKER_SHUTDOWN_TIMEOUT_MS, () => this.finishClose("WORKER_SHUTDOWN_TIMEOUT"));
    try {
      this.post({ type: "teardown" });
    } catch {
      this.finishClose("WORKER_MESSAGE_ERROR");
    }
  }

  abort(code: string): void {
    this.fail(code);
  }

  private readonly handleError = (): void => this.fail("WORKER_CRASH");
  private readonly handleMessageError = (): void => this.fail("WORKER_MESSAGE_ERROR");

  private readonly handleMessage = (event: MessageEvent<PoseWorkerResponse>): void => {
    if (!this.worker || this.status === "error" || this.status === "closed") return;
    const message = event.data;
    if (this.closing) {
      if (message.type === "torn-down") this.finishClose();
      return;
    }
    if (message.type === "ready" && this.status === "loading") {
      this.clearWatch();
      this.setStatus("ready");
      return;
    }
    if (message.type === "result" && this.status === "processing") {
      this.clearWatch();
      this.setStatus("ready");
      this.events.onResult(message);
      return;
    }
    if (message.type === "frame-dropped") {
      this.fail("WORKER_FRAME_DROPPED");
      return;
    }
    if (message.type === "init-error" || message.type === "inference-error") {
      this.fail(message.code);
      return;
    }
    this.fail("WORKER_PROTOCOL_ERROR");
  };

  private watch(timeoutMs: number, callback: () => void): void {
    this.clearWatch();
    this.timer = setTimeout(callback, timeoutMs);
  }

  private clearWatch(): void {
    clearTimeout(this.timer);
    this.timer = undefined;
  }

  private releaseWorker(): void {
    this.clearWatch();
    this.worker?.removeEventListener("message", this.handleMessage);
    this.worker?.removeEventListener("error", this.handleError);
    this.worker?.removeEventListener("messageerror", this.handleMessageError);
    this.worker?.terminate();
    this.worker = undefined;
  }

  private finishClose(code?: string): void {
    if (this.status === "closed") return;
    this.releaseWorker();
    this.closing = false;
    this.setStatus("closed", code);
  }

  private fail(code: string): void {
    if (this.status === "error" || this.status === "closed") return;
    this.releaseWorker();
    this.closing = false;
    this.setStatus("error", code);
  }

  private post(message: PoseWorkerRequest, transfer?: Transferable[]): void {
    this.worker!.postMessage(message, transfer ?? []);
  }

  private setStatus(status: PoseSessionStatus, code?: string): void {
    this.status = status;
    this.events.onStatus(status, code);
  }
}
