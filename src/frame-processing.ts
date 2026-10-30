import type { PoseFrameResult } from "./pose-contract";
import { isValidAnalysisInterval, type AnalysisInterval } from "./analysis-interval";

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
  /** Exact oriented inference size, paired by pose identity; volatile, never exported. */
  inferenceImage?: Readonly<{ width: number; height: number; pose: PoseFrameResult }>;
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

export function calculateSampleTimestamps(durationSeconds: number, interval?: AnalysisInterval): number[] {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0 || !Number.isFinite(durationSeconds * 1000)) {
    throw new Error("INVALID_DURATION");
  }

  const selected = interval ?? { startSeconds: 0, endSeconds: durationSeconds };
  if (!isValidAnalysisInterval(durationSeconds, selected)) throw new Error("INVALID_ANALYSIS_INTERVAL");
  const startTimestampMs = selected.startSeconds * 1000;
  // Stay before the selected end, including the media's undecodable terminal edge.
  // Sub-millisecond intervals still have one usable request at their exact start.
  const endTimestampMs = Math.max(startTimestampMs, Math.floor(selected.endSeconds * 1000) - 1);
  if (endTimestampMs === startTimestampMs) return [startTimestampMs];

  const timestamps: number[] = [];
  for (let index = 0; index < SAMPLE_BUDGET; index += 1) {
    const timestamp = Math.min(endTimestampMs, startTimestampMs + Math.round((index * (endTimestampMs - startTimestampMs)) / (SAMPLE_BUDGET - 1)));
    if (timestamps.at(-1) !== timestamp) timestamps.push(timestamp);
  }
  return timestamps;
}

// Explicit requests use the same source-time bounds as uniform sampling.
export function validateRequestedTimestamps(duration: number, interval: AnalysisInterval | undefined, requests: readonly number[]): number[] {
  const samples = calculateSampleTimestamps(duration, interval);
  if (!requests.length || requests.length > SAMPLE_BUDGET || requests.some((time, index) =>
    !Number.isFinite(time) || time < samples[0] || time > samples[samples.length - 1] ||
    (index > 0 && time <= requests[index - 1]))) throw new Error("INVALID_EVENT_TIME");
  return [...requests];
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
  private readonly interval?: AnalysisInterval;
  private readonly requestedTimestamps?: readonly number[];

  constructor(
    private readonly dependencies: FrameProcessingDependencies,
    private readonly events: FrameProcessingEvents,
    interval?: AnalysisInterval,
    requestedTimestamps?: readonly number[]
  ) {
    // A run/retry owns a snapshot, even if a caller later edits its selection.
    this.interval = interval ? { ...interval } : undefined;
    this.requestedTimestamps = requestedTimestamps ? [...requestedTimestamps] : undefined;
  }

  getOutputs(): readonly SampledFrameOutput[] {
    return this.outputs;
  }

  /** Transfer bitmap ownership to the caller before closing the source/processor. */
  takeOutputs(): SampledFrameOutput[] {
    if (this.state !== "completed") return [];
    const outputs = this.outputs;
    this.outputs = [];
    return outputs;
  }

  async start(): Promise<void> {
    if (!["idle", "cancelled", "failed"].includes(this.state)) return;
    await this.beginRun();
  }

  async retry(): Promise<void> {
    if (this.cleanupPromise) await this.cleanupPromise;
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

  async abort(code: string): Promise<void> {
    if (this.cleanupPromise || !["loading", "processing"].includes(this.state)) return;
    this.cleanupPromise = this.fail(this.generation, new Error(code)).finally(() => {
      this.cleanupPromise = undefined;
    });
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
      const timestamps = this.requestedTimestamps
        ? validateRequestedTimestamps(metadata.durationSeconds, this.interval, this.requestedTimestamps)
        : calculateSampleTimestamps(metadata.durationSeconds, this.interval);
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

    // Transfer/closure can zero a bitmap's dimensions. Capture before handing it off.
    const { width, height } = inference;
    const pose = await processor.process(inference, requestedTimestampMs);
    this.assertActive(generation);
    if (pose.timestampMs !== requestedTimestampMs) throw new Error("RESULT_TIMESTAMP_MISMATCH");

    const output: SampledFrameOutput = {
      runGeneration: generation,
      index,
      requestedTimestampMs,
      observedSeekTimestampMs,
      preview,
      pose,
      inferenceImage: Object.freeze({ width, height, pose })
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
