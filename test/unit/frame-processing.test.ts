import { describe, expect, it, vi } from "vitest";
import {
  calculatePreviewDimensions,
  calculateSampleTimestamps,
  FrameProcessingController,
  type FrameProcessingEvents,
  type FrameProcessor,
  type FrameSource
} from "../../src/frame-processing";
import { poseThresholds, type PoseFrameResult } from "../../src/pose-contract";

function bitmap() {
  return { close: vi.fn() } as unknown as ImageBitmap;
}

function pose(timestampMs: number): PoseFrameResult {
  return {
    timestampMs,
    landmarks: [[{ x: 0, y: 0, z: 0, visibility: 1 }]],
    worldLandmarks: [[{ x: 0, y: 0, z: 0, visibility: 1 }]],
    thresholds: poseThresholds
  };
}

class FakeSource implements FrameSource {
  readonly previews: ImageBitmap[] = [];
  readonly inferences: ImageBitmap[] = [];
  readonly sought: number[] = [];
  disposed = false;
  inferenceError?: Error;

  constructor(
    readonly metadata = { durationSeconds: 2, width: 1920, height: 1080 },
    private readonly seekGate?: Promise<void>
  ) {}

  async load() {
    return this.metadata;
  }

  async seek(timestampMs: number) {
    this.sought.push(timestampMs);
    await this.seekGate;
    return timestampMs + 0.25;
  }

  async createPreview() {
    const value = bitmap();
    this.previews.push(value);
    return value;
  }

  async createInference() {
    if (this.inferenceError) throw this.inferenceError;
    const value = bitmap();
    this.inferences.push(value);
    return value;
  }

  dispose() {
    this.disposed = true;
  }
}

class FakeProcessor implements FrameProcessor {
  initialized = false;
  closed = false;
  readonly processed: number[] = [];
  failAtTimestamp?: number;
  closeGate?: Promise<void>;
  processGate?: Promise<void>;

  async initialize() {
    this.initialized = true;
  }

  async process(input: ImageBitmap, timestampMs: number) {
    this.processed.push(timestampMs);
    input.close();
    await this.processGate;
    if (timestampMs === this.failAtTimestamp) throw new Error("LOCAL_INFERENCE_FAILED");
    return pose(timestampMs);
  }

  async close() {
    await this.closeGate;
    this.closed = true;
  }
}

function harness(source: FakeSource, processor = new FakeProcessor()) {
  const states: string[] = [];
  const progress: [number, number][] = [];
  const outputs: PoseFrameResult[] = [];
  const events: FrameProcessingEvents = {
    onState: (state, code) => states.push(code ? `${state}:${code}` : state),
    onProgress: (completed, total) => progress.push([completed, total]),
    onOutput: (output) => outputs.push(output.pose)
  };
  const controller = new FrameProcessingController(
    { createSource: () => source, createProcessor: () => processor },
    events
  );
  return { controller, processor, states, progress, outputs };
}

describe("deterministic sample timestamps", () => {
  it("pins representative short and normal duration arrays", () => {
    expect(calculateSampleTimestamps(0.001)).toEqual([0]);
    expect(calculateSampleTimestamps(0.005)).toEqual([0, 1, 2, 3, 4]);
    expect(calculateSampleTimestamps(0.007)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(calculateSampleTimestamps(0.008)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(calculateSampleTimestamps(2)).toEqual([0, 286, 571, 857, 1142, 1428, 1713, 1999]);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, 0, -1])(
    "rejects invalid duration %s before producing timestamps",
    (duration) => {
      expect(() => calculateSampleTimestamps(duration)).toThrow("INVALID_DURATION");
    }
  );
});

describe("preview dimensions", () => {
  it("preserves portrait and landscape aspect ratios without upscaling", () => {
    expect(calculatePreviewDimensions(1920, 1080)).toEqual({ width: 640, height: 360 });
    expect(calculatePreviewDimensions(1080, 1920)).toEqual({ width: 360, height: 640 });
    expect(calculatePreviewDimensions(320, 240)).toEqual({ width: 320, height: 240 });
  });
});

describe("frame processing controller", () => {
  it("produces ordered timestamp, preview, and pose outputs with one inference at a time", async () => {
    const source = new FakeSource();
    const { controller, processor, states, progress, outputs } = harness(source);

    await controller.start();

    expect(states).toEqual(["loading", "processing", "completed"]);
    expect(source.sought).toEqual(calculateSampleTimestamps(2));
    expect(processor.processed).toEqual(source.sought);
    expect(outputs.map((result) => result.timestampMs)).toEqual(source.sought);
    expect(controller.getOutputs().map((output) => output.index)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(controller.getOutputs().map((output) => output.observedSeekTimestampMs)).toEqual(
      source.sought.map((timestamp) => timestamp + 0.25)
    );
    expect(progress.at(-1)).toEqual([8, 8]);
    expect(source.inferences.every((input) => vi.mocked(input.close).mock.calls.length === 1)).toBe(true);
  });

  it("rejects invalid duration before initialization, seek, or bitmap creation", async () => {
    const source = new FakeSource({ durationSeconds: Number.NaN, width: 1920, height: 1080 });
    const { controller, processor, states } = harness(source);

    await controller.start();

    expect(states).toEqual(["loading", "failed:INVALID_DURATION"]);
    expect(processor.initialized).toBe(false);
    expect(source.sought).toEqual([]);
    expect(source.previews).toEqual([]);
    expect(source.inferences).toEqual([]);
  });

  it("closes the current preview and accumulated outputs when inference creation fails", async () => {
    const source = new FakeSource();
    source.inferenceError = new Error("INFERENCE_BITMAP_FAILED");
    const { controller, states } = harness(source);

    await controller.start();

    expect(states).toEqual(["loading", "processing", "failed:INFERENCE_BITMAP_FAILED"]);
    expect(source.previews).toHaveLength(1);
    expect(source.previews[0].close).toHaveBeenCalledOnce();
    expect(controller.getOutputs()).toEqual([]);
  });

  it("invalidates cancellation before a stale seek can create a bitmap", async () => {
    let releaseSeek = () => undefined;
    const seekGate = new Promise<void>((resolve) => {
      releaseSeek = resolve;
    });
    const source = new FakeSource(undefined, seekGate);
    const { controller, states } = harness(source);

    const start = controller.start();
    await vi.waitFor(() => expect(source.sought).toHaveLength(1));
    await controller.cancel();
    releaseSeek();
    await start;

    expect(states).toEqual(["loading", "processing", "cancelled"]);
    expect(source.previews).toEqual([]);
    expect(source.inferences).toEqual([]);
  });

  it("treats a second cancel during cleanup as a no-op", async () => {
    const source = new FakeSource({ durationSeconds: 0.001, width: 10, height: 10 });
    const { controller, processor, states } = harness(source);
    let releaseClose = () => undefined;
    processor.closeGate = new Promise<void>((resolve) => {
      releaseClose = resolve;
    });

    await controller.start();
    const firstCancel = controller.cancel();
    const secondCancel = controller.cancel();
    releaseClose();
    await Promise.all([firstCancel, secondCancel]);

    expect(states).toEqual(["loading", "processing", "completed", "cancelled"]);
    expect(processor.closed).toBe(true);
    expect(source.previews[0].close).toHaveBeenCalledOnce();
  });

  it("closes accumulated and current previews when a later inference fails", async () => {
    const source = new FakeSource();
    const processor = new FakeProcessor();
    processor.failAtTimestamp = calculateSampleTimestamps(2)[1];
    const { controller, states } = harness(source, processor);

    await controller.start();

    expect(states).toEqual(["loading", "processing", "failed:LOCAL_INFERENCE_FAILED"]);
    expect(source.previews).toHaveLength(2);
    expect(source.previews.every((preview) => vi.mocked(preview.close).mock.calls.length === 1)).toBe(true);
    expect(controller.getOutputs()).toEqual([]);
  });

  it("closes the current preview when cancellation races a completed inference", async () => {
    const source = new FakeSource({ durationSeconds: 0.001, width: 10, height: 10 });
    const processor = new FakeProcessor();
    let releaseProcess = () => undefined;
    processor.processGate = new Promise<void>((resolve) => {
      releaseProcess = resolve;
    });
    const { controller, states } = harness(source, processor);

    const start = controller.start();
    await vi.waitFor(() => expect(source.previews).toHaveLength(1));
    await controller.cancel();
    releaseProcess();
    await start;

    expect(states).toEqual(["loading", "processing", "cancelled"]);
    expect(source.previews[0].close).toHaveBeenCalledOnce();
    expect(controller.getOutputs()).toEqual([]);
  });

  it("closes prior outputs and processor before retry constructs the next run", async () => {
    const sources = [new FakeSource({ durationSeconds: 0.001, width: 10, height: 10 }), new FakeSource({
      durationSeconds: 0.001,
      width: 10,
      height: 10
    })];
    const processors = [new FakeProcessor(), new FakeProcessor()];
    let sourceIndex = 0;
    let processorIndex = 0;
    const states: string[] = [];
    const controller = new FrameProcessingController(
      {
        createSource: () => sources[sourceIndex++],
        createProcessor: () => processors[processorIndex++]
      },
      {
        onState: (state) => states.push(state),
        onProgress: () => undefined,
        onOutput: () => undefined
      }
    );

    await controller.start();
    const firstPreview = sources[0].previews[0];
    await controller.cancel();
    await controller.retry();

    expect(processors[0].closed).toBe(true);
    expect(processors[1].initialized).toBe(true);
    expect(firstPreview.close).toHaveBeenCalledOnce();
    expect(states).toEqual(["loading", "processing", "completed", "cancelled", "loading", "processing", "completed"]);
  });

  it("queues retry behind an in-progress cancellation", async () => {
    const sources = [new FakeSource({ durationSeconds: 0.001, width: 10, height: 10 }), new FakeSource({
      durationSeconds: 0.001,
      width: 10,
      height: 10
    })];
    const processors = [new FakeProcessor(), new FakeProcessor()];
    let releaseClose = () => undefined;
    processors[0].closeGate = new Promise<void>((resolve) => {
      releaseClose = resolve;
    });
    let sourceIndex = 0;
    let processorIndex = 0;
    const controller = new FrameProcessingController(
      {
        createSource: () => sources[sourceIndex++],
        createProcessor: () => processors[processorIndex++]
      },
      { onState: () => undefined, onProgress: () => undefined, onOutput: () => undefined }
    );

    await controller.start();
    const cancel = controller.cancel();
    const retry = controller.retry();
    expect(processors[1].initialized).toBe(false);
    releaseClose();
    await Promise.all([cancel, retry]);

    expect(processors[0].closed).toBe(true);
    expect(processors[1].initialized).toBe(true);
  });
});
