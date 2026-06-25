export type PoseOverlayWarningCode =
  | "MISSING_POSE"
  | "MISSING_LANDMARK"
  | "NON_FINITE_COORDINATE"
  | "OUT_OF_FRAME_COORDINATE"
  | "LOW_VISIBILITY"
  | "INSUFFICIENT_CORE_LANDMARKS"
  | "NO_RENDERABLE_SEGMENTS"
  | "CANVAS_UNAVAILABLE";

export interface PoseSegment {
  id: string;
  start: number;
  end: number;
}

export const poseOverlaySegments = [
  { id: "shoulders", start: 11, end: 12 },
  { id: "left-upper-arm", start: 11, end: 13 },
  { id: "left-lower-arm", start: 13, end: 15 },
  { id: "right-upper-arm", start: 12, end: 14 },
  { id: "right-lower-arm", start: 14, end: 16 },
  { id: "left-torso", start: 11, end: 23 },
  { id: "right-torso", start: 12, end: 24 },
  { id: "hips", start: 23, end: 24 },
  { id: "left-upper-leg", start: 23, end: 25 },
  { id: "left-lower-leg", start: 25, end: 27 },
  { id: "right-upper-leg", start: 24, end: 26 },
  { id: "right-lower-leg", start: 26, end: 28 },
  { id: "left-heel", start: 27, end: 29 },
  { id: "left-toe", start: 27, end: 31 },
  { id: "left-foot", start: 29, end: 31 },
  { id: "right-heel", start: 28, end: 30 },
  { id: "right-toe", start: 28, end: 32 },
  { id: "right-foot", start: 30, end: 32 }
] as const satisfies readonly PoseSegment[];

export const poseOverlayCoreLandmarks = [11, 12, 23, 24, 25, 26, 27, 28] as const;
