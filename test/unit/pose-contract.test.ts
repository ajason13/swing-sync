import { describe, expect, it } from "vitest";
import {
  createPoseFrameResult,
  isValidNextTimestamp,
  poseThresholds,
  type ReturnedPoseResult
} from "../../src/pose-contract";

describe("pose result contract", () => {
  it("accepts only finite non-negative monotonically increasing timestamps", () => {
    expect(isValidNextTimestamp(0)).toBe(true);
    expect(isValidNextTimestamp(500, 0)).toBe(true);
    expect(isValidNextTimestamp(0, 0)).toBe(false);
    expect(isValidNextTimestamp(-1)).toBe(false);
    expect(isValidNextTimestamp(Number.NaN)).toBe(false);
    expect(isValidNextTimestamp(Number.POSITIVE_INFINITY)).toBe(false);
  });

  it("retains complete returned coordinates and visibility without inventing presence", () => {
    const returned: ReturnedPoseResult = {
      landmarks: [[{ x: 0.1, y: 0.2, z: -0.3, visibility: 0.4 }]],
      worldLandmarks: [[{ x: 1.1, y: 1.2, z: -1.3, visibility: 0.9 }]]
    };

    const result = createPoseFrameResult(returned, 500);

    expect(result).toEqual({
      timestampMs: 500,
      landmarks: [[{ x: 0.1, y: 0.2, z: -0.3, visibility: 0.4 }]],
      worldLandmarks: [[{ x: 1.1, y: 1.2, z: -1.3, visibility: 0.9 }]],
      thresholds: poseThresholds
    });
    expect(result.landmarks[0][0]).not.toHaveProperty("presence");
  });

  it("copies detector results so downstream changes cannot mutate the source", () => {
    const returned: ReturnedPoseResult = {
      landmarks: [[{ x: 0.1, y: 0.2, z: 0.3, visibility: 0.4 }]],
      worldLandmarks: [[{ x: 1, y: 2, z: 3, visibility: 0.8 }]]
    };

    const result = createPoseFrameResult(returned, 0);
    result.landmarks[0][0].x = 9;

    expect(returned.landmarks[0][0].x).toBe(0.1);
  });
});
