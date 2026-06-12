import type { PoseFrameResult } from "./pose-contract";

export const SAMPLE_BUDGET = 8;
export const PREVIEW_MAX_LONG_EDGE_PX = 640;

export type FrameProcessingState =
  | "idle"
  | "loading"
  | "processing"
  | "completed"
  | "cancelled"
  | "failed"
  | "closed";

export interface SampledFrameOutput {
  runGeneration: number;
  index: number;
  requestedTimestampMs: number;
  observedSeekTimestampMs: number;
  /** The current owner must close this bitmap when releasing the output. */
  preview: ImageBitmap;
  pose: PoseFrameResult;
}

export interface FrameSource {
  load(): Promise<{ durationSeconds: number; width: number; height: number }>;
  seek(timestampMs: number): Promise<number>;
  createPreview(width: number, height: number): Promise<ImageBitmap>;
  createInference(): Promise<ImageBitmap>;
  dispose(): void;
}

export interface FrameProcessor {
  initialize(): Promise<void>;
  process(bitmap: ImageBitmap, timestampMs: number): Promise<PoseFrameResult>;
  close(): Promise<void>;
}

export interface FrameProcessingEvents {
  onState(state: FrameProcessingState, code?: string): void;
  onProgress(completed: number, total: number): void;
  onOutput(output: SampledFrameOutput): void;
}

export interface FrameProcessingDependencies {
  createSource(): FrameSource;
  createProcessor(): FrameProcessor;
}

export function calculateSampleTimestamps(durationSeconds: number): number[] {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new Error("INVALID_DURATION");
  }

  const durationMs = Math.floor(durationSeconds * 1000);
  if (durationMs < 0) {
    throw new Error("INVALID_DURATION");
  }

  const endTimestampMs = Math.max(0, durationMs - 1);
  if (endTimestampMs === 0) return [0];

  const timestamps: number[] = [];
  for (let index = 0; index < SAMPLE_BUDGET; index += 1) {
    const timestamp = Math.round((index * endTimestampMs) / (SAMPLE_BUDGET - 1));
    if (timestamps.at(-1) !== timestamp) timestamps.push(timestamp);
  }
  return timestamps;
}

export function calculatePreviewDimensions(width: number, height: number): {
  width: number;
  height: number;
} {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error("INVALID_VIDEO_DIMENSIONS");
  }

  const scale = Math.min(1, PREVIEW_MAX_LONG_EDGE_PX / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  };
}

export class FrameProcessingController {
  private generation = 0;
  private state: FrameProcessingState = "idle";
  private source?: FrameSource;
  private processor?: FrameProcessor;
  private closingProcessor?: Promise<void>;
  private cleanupPromise?: Promise<void>;
  private outputs: SampledFrameOutput[] = [];
  private currentPreview?: ImageBitmap;
  private totalSamples = 0;

  constructor(
    private readonly dependencies: FrameProcessingDependencies,
    private readonly events: FrameProcessingEvents
  ) {}

  getOutputs(): readonly SampledFrameOutput[] {
    return this.outputs;
  }

  async start(): Promise<void> {
    if (!["idle", "cancelled", "failed"].includes(this.state)) return;
    await this.beginRun();
  }

  async retry(): Promise<void> {
    if (!["cancelled", "failed"].includes(this.state)) return;
    await this.beginRun();
  }

  async cancel(): Promise<void> {
    if (this.cleanupPromise) {
      await this.cleanupPromise;
      return;
    }
    if (["cancelled", "closed", "idle"].includes(this.state)) return;
    this.cleanupPromise = this.cleanup("cancelled");
    await this.cleanupPromise;
  }

  async close(): Promise<void> {
    if (this.cleanupPromise) await this.cleanupPromise;
    if (this.state === "closed") return;
    this.cleanupPromise = this.cleanup("closed");
    await this.cleanupPromise;
  }

  private async cleanup(targetState: "cancelled" | "closed"): Promise<void> {
    this.generation += 1;
    this.releaseOutputs();
    this.source?.dispose();
    this.source = undefined;
    await this.closeProcessor();
    this.setState(targetState);
    this.cleanupPromise = undefined;
  }

  private async beginRun(): Promise<void> {
    const generation = ++this.generation;
    this.releaseOutputs();
    this.source?.dispose();
    this.source = undefined;
    await this.closeProcessor();
    if (!this.isActive(generation)) return;

    const source = this.dependencies.createSource();
    const processor = this.dependencies.createProcessor();
    this.source = source;
    this.processor = processor;
    this.setState("loading");

    try {
      const metadata = await source.load();
      this.assertActive(generation);
      const timestamps = calculateSampleTimestamps(metadata.durationSeconds);
      const previewDimensions = calculatePreviewDimensions(metadata.width, metadata.height);
      this.totalSamples = timestamps.length;
      this.events.onProgress(0, timestamps.length);

      await processor.initialize();
      this.assertActive(generation);
      this.setState("processing");

      for (let index = 0; index < timestamps.length; index += 1) {
        await this.processSample(generation, index, timestamps[index], previewDimensions);
      }

      this.assertActive(generation);
      this.setState("completed");
    } catch (error) {
      if (!this.isActive(generation)) return;
      await this.fail(generation, error);
    }
  }

  private async processSample(
    generation: number,
    index: number,
    requestedTimestampMs: number,
    previewDimensions: { width: number; height: number }
  ): Promise<void> {
    const source = this.source;
    const processor = this.processor;
    if (!source || !processor) throw new Error("INVALID_CONTROLLER_STATE");

    const observedSeekTimestampMs = await source.seek(requestedTimestampMs);
    this.assertActive(generation);

    const preview = await source.createPreview(previewDimensions.width, previewDimensions.height);
    if (!this.isActive(generation)) {
      preview.close();
      throw new Error("STALE_RUN");
    }
    this.currentPreview = preview;

    const inference = await source.createInference();
    if (!this.isActive(generation)) {
      inference.close();
      throw new Error("STALE_RUN");
    }

    const pose = await processor.process(inference, requestedTimestampMs);
    this.assertActive(generation);
    if (pose.timestampMs !== requestedTimestampMs) throw new Error("RESULT_TIMESTAMP_MISMATCH");

    const output: SampledFrameOutput = {
      runGeneration: generation,
      index,
      requestedTimestampMs,
      observedSeekTimestampMs,
      preview,
      pose
    };
    this.outputs.push(output);
    this.currentPreview = undefined;
    this.events.onOutput(output);
    this.events.onProgress(this.outputs.length, this.totalSamples);
  }

  private async fail(generation: number, error: unknown): Promise<void> {
    if (!this.isActive(generation)) return;
    this.generation += 1;
    this.currentPreview?.close();
    this.currentPreview = undefined;
    this.releaseOutputs();
    this.source?.dispose();
    this.source = undefined;
    await this.closeProcessor();
    this.setState("failed", toErrorCode(error));
  }

  private async closeProcessor(): Promise<void> {
    if (this.closingProcessor) {
      await this.closingProcessor;
      return;
    }
    const processor = this.processor;
    this.processor = undefined;
    if (!processor) return;
    this.closingProcessor = processor.close().finally(() => {
      this.closingProcessor = undefined;
    });
    await this.closingProcessor;
  }

  private releaseOutputs(): void {
    this.currentPreview?.close();
    this.currentPreview = undefined;
    for (const output of this.outputs) output.preview.close();
    this.outputs = [];
  }

  private isActive(generation: number): boolean {
    return generation === this.generation;
  }

  private assertActive(generation: number): void {
    if (!this.isActive(generation)) throw new Error("STALE_RUN");
  }

  private setState(state: FrameProcessingState, code?: string): void {
    this.state = state;
    this.events.onState(state, code);
  }
}

function toErrorCode(error: unknown): string {
  if (error instanceof Error && /^[A-Z0-9_]+$/.test(error.message)) return error.message;
  return "LOCAL_FRAME_PROCESSING_FAILED";
}
