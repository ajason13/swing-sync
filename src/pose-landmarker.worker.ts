/// <reference lib="webworker" />

import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import {
  createPoseFrameResult,
  isValidNextTimestamp,
  poseThresholds,
  type PoseWorkerRequest,
  type PoseWorkerResponse
} from "./pose-contract";

declare const self: DedicatedWorkerGlobalScope;

const wasmRoot = "/mediapipe/wasm";
const modelPath = "/models/pose_landmarker_full-float16-v1.task";

let landmarker: PoseLandmarker | undefined;
let state: "uninitialized" | "initializing" | "ready" | "processing" | "error" | "torn-down" =
  "uninitialized";
let previousTimestampMs: number | undefined;

function respond(message: PoseWorkerResponse): void {
  self.postMessage(message);
}

function failInitialization(): void {
  state = "error";
  respond({ type: "init-error", code: "LOCAL_MODEL_INIT_FAILED" });
}

function failInference(code: string, timestampMs?: number): void {
  state = "error";
  respond({ type: "inference-error", code, timestampMs });
}

async function initialize(): Promise<void> {
  if (state !== "uninitialized") {
    failInitialization();
    return;
  }

  state = "initializing";

  try {
    const vision = await FilesetResolver.forVisionTasks(wasmRoot, true);
    const createdLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: modelPath },
      runningMode: "VIDEO",
      numPoses: 1,
      outputSegmentationMasks: false,
      ...poseThresholds
    });
    if (state === "torn-down") {
      createdLandmarker.close();
      return;
    }
    landmarker = createdLandmarker;
    state = "ready";
    respond({ type: "ready" });
  } catch {
    failInitialization();
  }
}

function processFrame(bitmap: ImageBitmap, timestampMs: number): void {
  if (state === "processing") {
    bitmap.close();
    respond({ type: "frame-dropped", reason: "BUSY", timestampMs });
    return;
  }

  if (state !== "ready" || !landmarker) {
    bitmap.close();
    failInference("INVALID_WORKER_STATE", timestampMs);
    return;
  }

  if (!isValidNextTimestamp(timestampMs, previousTimestampMs)) {
    bitmap.close();
    failInference("INVALID_TIMESTAMP", timestampMs);
    return;
  }

  state = "processing";

  try {
    const result = landmarker.detectForVideo(bitmap, timestampMs);
    previousTimestampMs = timestampMs;
    respond({ type: "result", ...createPoseFrameResult(result, timestampMs) });
    state = "ready";
  } catch {
    failInference("LOCAL_INFERENCE_FAILED", timestampMs);
  } finally {
    bitmap.close();
  }
}

function teardown(): void {
  try {
    landmarker?.close();
  } finally {
    landmarker = undefined;
    state = "torn-down";
    respond({ type: "torn-down" });
    self.close();
  }
}

self.addEventListener("message", (event: MessageEvent<PoseWorkerRequest>) => {
  const message = event.data;

  if (message.type === "init") {
    void initialize();
    return;
  }

  if (message.type === "frame") {
    processFrame(message.bitmap, message.timestampMs);
    return;
  }

  if (message.type === "teardown") {
    teardown();
    return;
  }

  failInference("INVALID_PROTOCOL");
});

self.addEventListener("securitypolicyviolation", () => {
  failInference("UNEXPECTED_NETWORK_BLOCKED");
});
