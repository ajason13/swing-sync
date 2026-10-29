import {
  FrameProcessingController,
  type FrameProcessingDependencies,
  type FrameProcessingEvents,
  type FrameProcessor,
  type FrameSource
} from "./frame-processing";
import type { PoseFrameResult } from "./pose-contract";
import type { AnalysisInterval } from "./analysis-interval";
import { PoseSession, type PoseSessionStatus } from "./pose-session";

// Per metadata load or seek; browser timer throttling can delay delivery.
export const MEDIA_WAIT_TIMEOUT_MS = 30_000;

export class VideoFrameSource implements FrameSource {
  private disposed = false;
  private pendingRejects = new Set<(error: Error) => void>();

  constructor(
    private readonly video: HTMLVideoElement,
    private readonly objectUrl: string
  ) {}

  load(): Promise<{ durationSeconds: number; width: number; height: number }> {
    if (this.disposed) return Promise.reject(new Error("MEDIA_SOURCE_DISPOSED"));
    return this.waitForMedia(
      "loadedmetadata",
      () => ({
        durationSeconds: this.video.duration,
        width: this.video.videoWidth,
        height: this.video.videoHeight
      }),
      () => {
        this.video.src = this.objectUrl;
        this.video.load();
      },
      "MEDIA_LOAD_FAILED",
      "MEDIA_LOAD_TIMEOUT"
    );
  }

  seek(timestampMs: number): Promise<number> {
    if (this.disposed) return Promise.reject(new Error("MEDIA_SOURCE_DISPOSED"));
    const timestampSeconds = timestampMs / 1000;
    // Even t=0 needs an explicit seek: an offscreen video may report loaded
    // data at its initial position before a frame is usable for bitmap reads.
    return this.waitForMedia(
      "seeked",
      () => this.video.currentTime * 1000,
      () => { this.video.currentTime = timestampSeconds; },
      "MEDIA_SEEK_FAILED",
      "MEDIA_SEEK_TIMEOUT"
    );
  }

  private waitForMedia<T>(
    event: "loadedmetadata" | "seeked",
    result: () => T,
    start: () => void,
    failureCode: string,
    timeoutCode: string
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      let settled = false;
      const cleanup = () => {
        settled = true;
        clearTimeout(timer);
        this.video.removeEventListener(event, onComplete);
        this.video.removeEventListener("error", onError);
        this.pendingRejects.delete(onRejected);
      };
      const onRejected = (error: Error) => {
        if (settled) return;
        cleanup();
        reject(error);
      };
      const onError = () => onRejected(new Error(failureCode));
      const onComplete = () => {
        if (settled) return;
        try {
          const value = result();
          cleanup();
          resolve(value);
        } catch {
          onError();
        }
      };
      const timer = setTimeout(() => onRejected(new Error(timeoutCode)), MEDIA_WAIT_TIMEOUT_MS);
      this.pendingRejects.add(onRejected);
      this.video.addEventListener(event, onComplete);
      this.video.addEventListener("error", onError);
      try {
        start();
      } catch {
        onError();
      }
    });
  }

  createPreview(width: number, height: number): Promise<ImageBitmap> {
    return createImageBitmap(this.video, { resizeWidth: width, resizeHeight: height });
  }

  createInference(): Promise<ImageBitmap> {
    return createImageBitmap(this.video);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    const error = new Error("MEDIA_SOURCE_DISPOSED");
    for (const reject of [...this.pendingRejects]) reject(error);
    this.pendingRejects.clear();
    this.video.pause();
    this.video.removeAttribute("src");
    this.video.load();
    URL.revokeObjectURL(this.objectUrl);
  }
}

export class PoseFrameProcessor implements FrameProcessor {
  private session?: PoseSession;
  private initializeResolve?: () => void;
  private initializeReject?: (error: Error) => void;
  private resultResolve?: (result: PoseFrameResult) => void;
  private resultReject?: (error: Error) => void;
  private closeResolve?: () => void;
  private closePromise?: Promise<void>;

  initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.initializeResolve = resolve;
      this.initializeReject = reject;
      this.session = new PoseSession({
        onStatus: (status, code) => this.handleStatus(status, code),
        onResult: (result) => {
          const resolveResult = this.resultResolve;
          this.resultResolve = undefined;
          this.resultReject = undefined;
          resolveResult?.(result);
        }
      });
      this.session.initialize();
    });
  }

  process(bitmap: ImageBitmap, timestampMs: number): Promise<PoseFrameResult> {
    if (this.resultReject) {
      bitmap.close();
      return Promise.reject(new Error("POSE_SESSION_BUSY"));
    }
    return new Promise((resolve, reject) => {
      this.resultResolve = resolve;
      this.resultReject = reject;
      if (!this.session) {
        bitmap.close();
        this.resultResolve = undefined;
        this.resultReject = undefined;
        reject(new Error("POSE_SESSION_CLOSED"));
        return;
      }
      if (!this.session.submitFrame(bitmap, timestampMs)) {
        this.resultResolve = undefined;
        this.resultReject = undefined;
        reject(new Error("POSE_SESSION_BUSY"));
      }
    });
  }

  close(): Promise<void> {
    if (this.closePromise) return this.closePromise;
    if (!this.session) return Promise.resolve();
    this.rejectPending(new Error("POSE_SESSION_CLOSED"));
    this.closePromise = new Promise((resolve) => {
      this.closeResolve = resolve;
    });
    this.session.teardown();
    return this.closePromise;
  }

  abort(code: string): void {
    this.session?.abort(code);
  }

  private handleStatus(status: PoseSessionStatus, code?: string): void {
    if (status === "ready" && this.initializeResolve) {
      const resolve = this.initializeResolve;
      this.initializeResolve = undefined;
      this.initializeReject = undefined;
      resolve();
      return;
    }
    if (status === "error") {
      const error = new Error(code ?? "POSE_SESSION_FAILED");
      this.rejectPending(error);
      this.closeResolve?.();
      this.closeResolve = undefined;
      this.session = undefined;
      return;
    }
    if (status === "closed") {
      this.rejectPending(new Error(code ?? "POSE_SESSION_CLOSED"));
      this.closeResolve?.();
      this.closeResolve = undefined;
      this.session = undefined;
    }
  }

  private rejectPending(error: Error): void {
    this.initializeReject?.(error);
    this.resultReject?.(error);
    this.initializeResolve = undefined;
    this.initializeReject = undefined;
    this.resultResolve = undefined;
    this.resultReject = undefined;
  }
}

export function createBrowserFrameController(
  video: HTMLVideoElement,
  file: File,
  events: FrameProcessingEvents,
  interval?: AnalysisInterval
): { controller: FrameProcessingController; abort(code: string): void } {
  let activeProcessor: PoseFrameProcessor | undefined;
  const dependencies: FrameProcessingDependencies = {
    createSource: () => new VideoFrameSource(video, URL.createObjectURL(file)),
    createProcessor: () => {
      activeProcessor = new PoseFrameProcessor();
      return activeProcessor;
    }
  };
  const controller = new FrameProcessingController(dependencies, events, interval);
  return {
    controller,
    abort: (code) => {
      activeProcessor?.abort(code);
      void controller.abort(code);
    }
  };
}
