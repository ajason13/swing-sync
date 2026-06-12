import {
  FrameProcessingController,
  type FrameProcessingDependencies,
  type FrameProcessingEvents,
  type FrameProcessor,
  type FrameSource
} from "./frame-processing";
import type { PoseFrameResult } from "./pose-contract";
import { PoseSession, type PoseSessionStatus } from "./pose-session";

export class VideoFrameSource implements FrameSource {
  private disposed = false;
  private pendingRejects = new Set<(error: Error) => void>();

  constructor(
    private readonly video: HTMLVideoElement,
    private readonly objectUrl: string
  ) {}

  load(): Promise<{ durationSeconds: number; width: number; height: number }> {
    if (this.disposed) return Promise.reject(new Error("MEDIA_SOURCE_DISPOSED"));
    this.video.src = this.objectUrl;
    return new Promise((resolve, reject) => {
      const onLoaded = () => {
        cleanup();
        resolve({
          durationSeconds: this.video.duration,
          width: this.video.videoWidth,
          height: this.video.videoHeight
        });
      };
      const onError = () => {
        cleanup();
        reject(new Error("MEDIA_LOAD_FAILED"));
      };
      const cleanup = () => {
        this.video.removeEventListener("loadedmetadata", onLoaded);
        this.video.removeEventListener("error", onError);
        this.pendingRejects.delete(onDisposed);
      };
      const onDisposed = (error: Error) => {
        cleanup();
        reject(error);
      };
      this.pendingRejects.add(onDisposed);
      this.video.addEventListener("loadedmetadata", onLoaded);
      this.video.addEventListener("error", onError);
      this.video.load();
    });
  }

  seek(timestampMs: number): Promise<number> {
    if (this.disposed) return Promise.reject(new Error("MEDIA_SOURCE_DISPOSED"));
    const timestampSeconds = timestampMs / 1000;
    if (Math.abs(this.video.currentTime - timestampSeconds) <= 0.0005) {
      return Promise.resolve(this.video.currentTime * 1000);
    }
    return new Promise((resolve, reject) => {
      const onSeeked = () => {
        cleanup();
        resolve(this.video.currentTime * 1000);
      };
      const onError = () => {
        cleanup();
        reject(new Error("MEDIA_SEEK_FAILED"));
      };
      const cleanup = () => {
        this.video.removeEventListener("seeked", onSeeked);
        this.video.removeEventListener("error", onError);
        this.pendingRejects.delete(onDisposed);
      };
      const onDisposed = (error: Error) => {
        cleanup();
        reject(error);
      };
      this.pendingRejects.add(onDisposed);
      this.video.addEventListener("seeked", onSeeked);
      this.video.addEventListener("error", onError);
      this.video.currentTime = timestampSeconds;
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

class PoseFrameProcessor implements FrameProcessor {
  private session?: PoseSession;
  private initializeResolve?: () => void;
  private initializeReject?: (error: Error) => void;
  private resultResolve?: (result: PoseFrameResult) => void;
  private resultReject?: (error: Error) => void;
  private closeResolve?: () => void;

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
    return new Promise((resolve, reject) => {
      this.resultResolve = resolve;
      this.resultReject = reject;
      if (!this.session?.submitFrame(bitmap, timestampMs)) {
        this.resultResolve = undefined;
        this.resultReject = undefined;
        reject(new Error("POSE_SESSION_BUSY"));
      }
    });
  }

  close(): Promise<void> {
    if (!this.session) return Promise.resolve();
    return new Promise((resolve) => {
      this.closeResolve = resolve;
      this.session?.teardown();
    });
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
      this.initializeReject?.(error);
      this.resultReject?.(error);
      this.initializeResolve = undefined;
      this.initializeReject = undefined;
      this.resultResolve = undefined;
      this.resultReject = undefined;
      this.closeResolve?.();
      this.closeResolve = undefined;
      this.session = undefined;
      return;
    }
    if (status === "closed") {
      this.closeResolve?.();
      this.closeResolve = undefined;
      this.session = undefined;
    }
  }
}

export function createBrowserFrameController(
  video: HTMLVideoElement,
  file: File,
  events: FrameProcessingEvents
): { controller: FrameProcessingController; abort(code: string): void } {
  let activeProcessor: PoseFrameProcessor | undefined;
  const dependencies: FrameProcessingDependencies = {
    createSource: () => new VideoFrameSource(video, URL.createObjectURL(file)),
    createProcessor: () => {
      activeProcessor = new PoseFrameProcessor();
      return activeProcessor;
    }
  };
  return {
    controller: new FrameProcessingController(dependencies, events),
    abort: (code) => activeProcessor?.abort(code)
  };
}
