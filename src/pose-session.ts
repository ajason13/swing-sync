import type { PoseFrameResult, PoseWorkerRequest, PoseWorkerResponse } from "./pose-contract";

export type PoseSessionStatus = "idle" | "loading" | "ready" | "processing" | "error" | "closed";

export interface PoseSessionEvents {
  onStatus(status: PoseSessionStatus, code?: string): void;
  onResult(result: PoseFrameResult): void;
}

export class PoseSession {
  private worker?: Worker;
  private status: PoseSessionStatus = "idle";
  private frameInFlight = false;

  constructor(
    private readonly events: PoseSessionEvents,
    private readonly createWorker: () => Worker = () =>
      new Worker(new URL("./pose-landmarker.worker.ts", import.meta.url), { type: "module" })
  ) {}

  initialize(): void {
    if (this.status !== "idle") {
      return;
    }

    this.setStatus("loading");
    this.worker = this.createWorker();
    this.worker.addEventListener("message", this.handleMessage);
    this.worker.addEventListener("error", () => this.fail("WORKER_CRASH"));
    this.worker.addEventListener("messageerror", () => this.fail("WORKER_MESSAGE_ERROR"));
    this.post({ type: "init" });
  }

  submitFrame(bitmap: ImageBitmap, timestampMs: number): boolean {
    if (this.status !== "ready" || this.frameInFlight) {
      bitmap.close();
      return false;
    }

    this.frameInFlight = true;
    this.setStatus("processing");
    try {
      this.post({ type: "frame", bitmap, timestampMs }, [bitmap]);
      return true;
    } catch {
      bitmap.close();
      this.frameInFlight = false;
      this.fail("WORKER_MESSAGE_ERROR");
      return false;
    }
  }

  teardown(): void {
    if (!this.worker || this.status === "closed") {
      this.setStatus("closed");
      return;
    }

    this.post({ type: "teardown" });
  }

  abort(code: string): void {
    this.fail(code);
  }

  private readonly handleMessage = (event: MessageEvent<PoseWorkerResponse>): void => {
    const message = event.data;

    if (message.type === "ready") {
      this.setStatus("ready");
      return;
    }

    if (message.type === "result") {
      this.frameInFlight = false;
      this.events.onResult(message);
      this.setStatus("ready");
      return;
    }

    if (message.type === "frame-dropped") {
      this.frameInFlight = false;
      this.setStatus("ready");
      return;
    }

    if (message.type === "torn-down") {
      this.worker?.terminate();
      this.worker = undefined;
      this.frameInFlight = false;
      this.setStatus("closed");
      return;
    }

    this.fail(message.code);
  };

  private fail(code: string): void {
    if (this.status === "error" || this.status === "closed") {
      return;
    }
    this.worker?.terminate();
    this.worker = undefined;
    this.frameInFlight = false;
    this.setStatus("error", code);
  }

  private post(message: PoseWorkerRequest, transfer?: Transferable[]): void {
    this.worker?.postMessage(message, transfer ?? []);
  }

  private setStatus(status: PoseSessionStatus, code?: string): void {
    this.status = status;
    this.events.onStatus(status, code);
  }
}
