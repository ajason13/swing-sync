export const poseThresholds = {
  minPoseDetectionConfidence: 0.5,
  minPosePresenceConfidence: 0.5,
  minTrackingConfidence: 0.5
} as const;

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface PoseFrameResult {
  timestampMs: number;
  landmarks: PoseLandmark[][];
  worldLandmarks: PoseLandmark[][];
  thresholds: typeof poseThresholds;
}

export type PoseWorkerRequest =
  | { type: "init" }
  | { type: "frame"; bitmap: ImageBitmap; timestampMs: number }
  | { type: "teardown" };

export type PoseWorkerResponse =
  | { type: "ready" }
  | ({ type: "result" } & PoseFrameResult)
  | { type: "frame-dropped"; reason: "BUSY"; timestampMs: number }
  | { type: "init-error"; code: string }
  | { type: "inference-error"; code: string; timestampMs?: number }
  | { type: "torn-down" };

interface ReturnedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface ReturnedPoseResult {
  landmarks: ReturnedLandmark[][];
  worldLandmarks: ReturnedLandmark[][];
}

export function isValidNextTimestamp(timestampMs: number, previousTimestampMs?: number): boolean {
  return (
    Number.isFinite(timestampMs) &&
    timestampMs >= 0 &&
    (previousTimestampMs === undefined || timestampMs > previousTimestampMs)
  );
}

function copyLandmark(landmark: ReturnedLandmark): PoseLandmark {
  return {
    x: landmark.x,
    y: landmark.y,
    z: landmark.z,
    visibility: landmark.visibility ?? 0
  };
}

export function createPoseFrameResult(
  result: ReturnedPoseResult,
  timestampMs: number
): PoseFrameResult {
  return {
    timestampMs,
    landmarks: result.landmarks.map((pose) => pose.map(copyLandmark)),
    worldLandmarks: result.worldLandmarks.map((pose) => pose.map(copyLandmark)),
    thresholds: poseThresholds
  };
}
