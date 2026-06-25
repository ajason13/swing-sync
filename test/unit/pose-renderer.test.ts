import { describe, expect, it, vi } from "vitest";
import { mapNormalizedPoint, renderPoseOverlayFrame } from "../../src/pose-renderer";
import { poseOverlaySegments } from "../../src/pose-topology";
import type { PoseLandmark } from "../../src/pose-contract";

interface FakeContext {
  operations: string[];
  setTransform: ReturnType<typeof vi.fn>;
  clearRect: ReturnType<typeof vi.fn>;
  drawImage: ReturnType<typeof vi.fn>;
  beginPath: ReturnType<typeof vi.fn>;
  moveTo: ReturnType<typeof vi.fn>;
  lineTo: ReturnType<typeof vi.fn>;
  stroke: ReturnType<typeof vi.fn>;
  arc: ReturnType<typeof vi.fn>;
  fill: ReturnType<typeof vi.fn>;
  strokeStyle: string;
  fillStyle: string;
  lineWidth: number;
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
}

function landmark(overrides: Partial<PoseLandmark> = {}): PoseLandmark {
  return { x: 0.5, y: 0.5, z: 0, visibility: 1, ...overrides };
}

function landmarks(overrides: Record<number, Partial<PoseLandmark> | undefined> = {}) {
  return Array.from({ length: 33 }, (_, index) => {
    const base = landmark({ x: (index % 6) / 6, y: 0.5 });
    return Object.hasOwn(overrides, index) ? { ...base, ...overrides[index] } : base;
  }) as PoseLandmark[];
}

function context(): FakeContext {
  const operations: string[] = [];
  return {
    operations,
    setTransform: vi.fn(() => operations.push("setTransform")),
    clearRect: vi.fn(() => operations.push("clearRect")),
    drawImage: vi.fn(() => operations.push("drawImage")),
    beginPath: vi.fn(() => operations.push("beginPath")),
    moveTo: vi.fn(() => operations.push("moveTo")),
    lineTo: vi.fn(() => operations.push("lineTo")),
    stroke: vi.fn(() => operations.push("stroke")),
    arc: vi.fn(() => operations.push("arc")),
    fill: vi.fn(() => operations.push("fill")),
    strokeStyle: "",
    fillStyle: "",
    lineWidth: 0,
    lineCap: "butt",
    lineJoin: "miter"
  };
}

function canvas(fakeContext = context(), width = 640, height = 360) {
  return {
    width: 0,
    height: 0,
    style: {} as CSSStyleDeclaration,
    getBoundingClientRect: () => ({ width, height }),
    getContext: vi.fn(() => fakeContext)
  } as unknown as HTMLCanvasElement & { getContext: ReturnType<typeof vi.fn> };
}

function preview(width = 640, height = 360) {
  return { width, height, close: vi.fn() } as unknown as ImageBitmap;
}

function withDevicePixelRatio<T>(value: number | undefined, run: () => T): T {
  const previous = (globalThis as { devicePixelRatio?: number }).devicePixelRatio;
  if (value === undefined) {
    delete (globalThis as { devicePixelRatio?: number }).devicePixelRatio;
  } else {
    (globalThis as { devicePixelRatio?: number }).devicePixelRatio = value;
  }
  try {
    return run();
  } finally {
    if (previous === undefined) {
      delete (globalThis as { devicePixelRatio?: number }).devicePixelRatio;
    } else {
      (globalThis as { devicePixelRatio?: number }).devicePixelRatio = previous;
    }
  }
}

describe("pose overlay topology", () => {
  it("exports exactly the approved non-facial segments in order", () => {
    expect(poseOverlaySegments).toEqual([
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
    ]);
    expect(poseOverlaySegments.every((segment) => segment.start > 10 && segment.end > 10)).toBe(
      true
    );
  });
});

describe("pose overlay coordinate mapping", () => {
  it("maps normalized coordinates to rounded CSS pixels", () => {
    expect(mapNormalizedPoint(landmark({ x: 0.5, y: 0.5 }), { width: 640, height: 480 })).toEqual({
      x: 320,
      y: 240
    });
    expect(mapNormalizedPoint(landmark({ x: 0.333333, y: 0.25 }), { width: 640, height: 400 })).toEqual({
      x: 213,
      y: 100
    });
  });

  it("rejects non-finite and out-of-frame coordinates without checking visibility", () => {
    expect(mapNormalizedPoint(landmark({ x: Number.NaN }), { width: 640, height: 480 })).toBeUndefined();
    expect(mapNormalizedPoint(landmark({ x: 1.1 }), { width: 640, height: 480 })).toBeUndefined();
    expect(mapNormalizedPoint(landmark({ visibility: 0.1 }), { width: 640, height: 480 })).toEqual({
      x: 320,
      y: 240
    });
  });
});

describe("pose overlay rendering", () => {
  it("renders all segments with the expected operation order and does not close the preview", () => {
    const fakeContext = context();
    const source = preview();
    const result = renderPoseOverlayFrame(canvas(fakeContext), {
      preview: source,
      landmarks: landmarks()
    });

    expect(result).toMatchObject({
      status: "rendered",
      renderedSegments: 18,
      skippedSegments: 0,
      warnings: []
    });
    expect(fakeContext.operations.slice(0, 3)).toEqual(["setTransform", "clearRect", "drawImage"]);
    const strokeIndexes = fakeContext.operations
      .map((operation, index) => (operation === "stroke" ? index : -1))
      .filter((index) => index >= 0);
    expect(strokeIndexes.length).toBeGreaterThan(2);
    expect(strokeIndexes[1]).toBeLessThan(fakeContext.operations.indexOf("arc"));
    expect(source.close).not.toHaveBeenCalled();
  });

  it("caps device pixel ratio at 2 including exact and above-cap boundaries", () => {
    withDevicePixelRatio(2, () => {
      const element = canvas(context(), 320, 180);
      renderPoseOverlayFrame(element, { preview: preview(), landmarks: landmarks() });
      expect(element.width).toBe(640);
      expect(element.height).toBe(360);
    });

    withDevicePixelRatio(2.5, () => {
      const element = canvas(context(), 320, 180);
      renderPoseOverlayFrame(element, { preview: preview(), landmarks: landmarks() });
      expect(element.width).toBe(640);
      expect(element.height).toBe(360);
    });
  });

  it("uses warning precedence for multi-failure landmarks", () => {
    const result = renderPoseOverlayFrame(canvas(), {
      preview: preview(),
      landmarks: landmarks({ 11: { x: Number.NaN, y: 2, visibility: 0.1 } })
    });

    expect(result.warnings[0]).toBe("NON_FINITE_COORDINATE");
    expect(result.warnings).not.toContain("OUT_OF_FRAME_COORDINATE");
    expect(result.warnings).not.toContain("LOW_VISIBILITY");
  });

  it("skips affected segments while preserving the segment count invariant", () => {
    const result = renderPoseOverlayFrame(canvas(), {
      preview: preview(),
      landmarks: landmarks({ 13: { visibility: 0.1 } })
    });

    expect(result.status).toBe("partial");
    expect(result.renderedSegments).toBe(16);
    expect(result.skippedSegments).toBe(2);
    expect(result.renderedSegments + result.skippedSegments).toBe(18);
    expect(result.warnings).toEqual(["LOW_VISIBILITY"]);
  });

  it("treats truncated landmark arrays as missing landmarks", () => {
    const result = renderPoseOverlayFrame(canvas(), {
      preview: preview(),
      landmarks: landmarks().slice(0, 20)
    });

    expect(result.renderedSegments + result.skippedSegments).toBe(18);
    expect(result.warnings).toContain("MISSING_LANDMARK");
  });

  it("pins core landmark boundary behavior", () => {
    const fourCore = renderPoseOverlayFrame(canvas(), {
      preview: preview(),
      landmarks: landmarks(
        Object.fromEntries([12, 23, 26, 27].map((index) => [index, { visibility: 0.1 }]))
      )
    });
    expect(fourCore.warnings).not.toContain("INSUFFICIENT_CORE_LANDMARKS");

    const threeCore = renderPoseOverlayFrame(canvas(), {
      preview: preview(),
      landmarks: landmarks(
        Object.fromEntries([12, 23, 24, 26, 27].map((index) => [index, { visibility: 0.1 }]))
      )
    });
    expect(threeCore.status).toBe("unavailable");
    expect(threeCore.warnings).toContain("INSUFFICIENT_CORE_LANDMARKS");
  });

  it("distinguishes no renderable segments from insufficient core landmarks", () => {
    const invalid = Object.fromEntries(
      Array.from({ length: 33 }, (_, index) => [index, { visibility: 0.1 }])
    );
    const noSegments = renderPoseOverlayFrame(canvas(), {
      preview: preview(),
      landmarks: landmarks({
        ...invalid,
        11: { visibility: 1 },
        24: { visibility: 1 },
        25: { visibility: 1 },
        28: { visibility: 1 }
      })
    });
    expect(noSegments.status).toBe("unavailable");
    expect(noSegments.warnings).toContain("NO_RENDERABLE_SEGMENTS");
    expect(noSegments.warnings).not.toContain("INSUFFICIENT_CORE_LANDMARKS");

    const insufficientCore = renderPoseOverlayFrame(canvas(), {
      preview: preview(),
      landmarks: landmarks({
        ...invalid,
        11: { visibility: 1 },
        13: { visibility: 1 },
        15: { visibility: 1 }
      })
    });
    expect(insufficientCore.status).toBe("unavailable");
    expect(insufficientCore.renderedSegments).toBeGreaterThan(0);
    expect(insufficientCore.warnings).toContain("INSUFFICIENT_CORE_LANDMARKS");
    expect(insufficientCore.warnings).not.toContain("NO_RENDERABLE_SEGMENTS");
  });

  it("returns unavailable for missing pose and unavailable canvas context", () => {
    expect(
      renderPoseOverlayFrame(canvas(), { preview: preview(), landmarks: undefined })
    ).toMatchObject({
      status: "unavailable",
      renderedSegments: 0,
      skippedSegments: 18,
      warnings: [
        "MISSING_POSE",
        "MISSING_LANDMARK",
        "NO_RENDERABLE_SEGMENTS",
        "INSUFFICIENT_CORE_LANDMARKS"
      ]
    });

    expect(
      renderPoseOverlayFrame(
        { ...canvas(), getContext: vi.fn(() => null) } as unknown as HTMLCanvasElement,
        { preview: preview(), landmarks: landmarks() }
      )
    ).toMatchObject({
      status: "unavailable",
      renderedSegments: 0,
      skippedSegments: 18,
      warnings: ["CANVAS_UNAVAILABLE"]
    });
  });

  it("does not call serialization or object URL APIs", () => {
    const toBlob = vi.fn();
    const toDataURL = vi.fn();
    const createObjectURL = vi.spyOn(URL, "createObjectURL").mockImplementation(() => "blob:test");
    const element = Object.assign(canvas(), { toBlob, toDataURL });

    renderPoseOverlayFrame(element, { preview: preview(), landmarks: landmarks() });

    expect(toBlob).not.toHaveBeenCalled();
    expect(toDataURL).not.toHaveBeenCalled();
    expect(createObjectURL).not.toHaveBeenCalled();
    createObjectURL.mockRestore();
  });
});
