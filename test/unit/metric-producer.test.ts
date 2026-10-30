import { describe, expect, it, vi } from "vitest";
import type { SampledFrameOutput } from "../../src/frame-processing";
import { GEOMETRY_EPSILON, calculateShoulderAngle, calculateShoulderLineAngle, calculateStanceWidthRatio } from "../../src/geometry-metrics";
import { isSwingMetricPayload, metricNames, prohibitedMetricPayloadKeys } from "../../src/metric-contract";
import { produceMetricPayload, type MetricProducerInput } from "../../src/metric-producer";
import { applyPhaseCorrection, createPhaseProposal, createPhaseReviewState, phaseDefinitions } from "../../src/phase-review";
import { poseThresholds, type PoseLandmark } from "../../src/pose-contract";
import {
  assignManualPhaseOutput, completeProcessingWithOutputs, confirmPhaseReview, createInitialAppState,
  invalidatePhaseConfirmation, rebuildPhaseReviewState, resetAppState, resetPhaseReview, selectLocalVideo,
  setAnalysisInterval, setPhaseConfirmation, setPhaseDeclaration, setPhaseDraftAssignment
} from "../../src/app-state";

// Project-authored mathematical points, not captured motion or model-accuracy evidence.
function points(): PoseLandmark[] {
  const result = Array.from({ length: 33 }, () => ({ x: .5, y: .5, z: 0, visibility: 1 }));
  for (const [index, x, y] of [[11, 300, 200], [12, 500, 200], [27, 250, 500], [28, 550, 500]]) {
    result[index] = { x: x / 800, y: y / 600, z: 0, visibility: 1 };
  }
  return result;
}

function output(index: number, time = index * 100, generation = 4): SampledFrameOutput {
  const landmarks = points();
  if (index === 3) {
    landmarks[11] = { x: 600 / 800, y: 200 / 600, z: 0, visibility: 1 };
    landmarks[12] = { x: 400 / 800, y: 300 / 600, z: 0, visibility: 1 };
  }
  const pose = { timestampMs: time, landmarks: [landmarks], worldLandmarks: [points()], thresholds: poseThresholds };
  return { index, runGeneration: generation, requestedTimestampMs: time, observedSeekTimestampMs: time + .25,
    preview: { width: 640, height: 480, close: vi.fn() } as unknown as ImageBitmap,
    pose, inferenceImage: { width: 800, height: 600, pose } };
}

function input(): MetricProducerInput {
  const outputs = phaseDefinitions.map((_, index) => output(index));
  const declarations = { view: "face-on", handedness: "right", mirrored: "no", setup: "confirmed" } as const;
  const proposal = createPhaseProposal(outputs, declarations);
  const review = applyPhaseCorrection(createPhaseReviewState(proposal), proposal.assignments, true, 4, outputs);
  return { outputs, declarations: { ...declarations }, review, activeGeneration: 4 };
}

function geometry(landmarks = points(), imageWidth = 800, imageHeight = 600) {
  return { landmarks, worldLandmarks: [], handedness: "right", mirrored: "no", imageWidth, imageHeight } as const;
}

describe("accepted image geometry", () => {
  it("uses same-frame 2D separations, not just horizontal widths", () => {
    expect(calculateStanceWidthRatio(geometry()).value).toBeCloseTo(1.5, 9);
    const p = points(); p[27].y = 450 / 600; p[28].y = 550 / 600;
    expect(calculateStanceWidthRatio(geometry(p)).value).toBeCloseTo(1.5811388300841898, 9);
  });

  it.each([
    [600, 200, 400, 200, 0], [600, 200, 400, 300, 26.56505117707799],
    [600, 300, 400, 200, -26.56505117707799], [400, 200, 400, 400, -90]
  ])("computes the documented line angle (%s,%s) (%s,%s)", (lx, ly, rx, ry, expected) => {
    const p = points(); Object.assign(p[11], { x: lx / 800, y: ly / 600 }); Object.assign(p[12], { x: rx / 800, y: ry / 600 });
    expect(calculateShoulderLineAngle(geometry(p)).value).toBeCloseTo(expected, 6);
  });

  it("corrects aspect, preserves uniform scaling/translation and legacy directed semantics", () => {
    const i = input(); const p = i.outputs[3].pose.landmarks[0];
    expect(calculateShoulderLineAngle(geometry(p, 600, 800)).value).toBeCloseTo(41.6335393365702, 6);
    expect(calculateShoulderLineAngle(geometry(p, 1600, 1200)).value).toBeCloseTo(26.56505117707799, 6);
    const moved = p.map(point => ({ ...point, x: point.x - .1, y: point.y + .1 }));
    expect(calculateShoulderLineAngle(geometry(moved)).value).toBeCloseTo(26.56505117707799, 6);
    expect(calculateStanceWidthRatio(geometry(points(), 1600, 1200)).value).toBeCloseTo(1.5, 9);
    expect(calculateStanceWidthRatio(geometry(points().map(point => ({ ...point, x: point.x - .1, y: point.y - .1 })))).value).toBeCloseTo(1.5, 9);
    // Existing utility keeps its directed normalized-coordinate result.
    expect(calculateShoulderAngle(geometry(p)).value).toBeCloseTo(33.690067525979785, 6);
  });

  it.each([false, true])("preserves ratio/angle for left-handed counterparts and mirroring=%s", (mirror) => {
    for (const left of [false, true]) {
      const i = input();
      i.declarations.handedness = left ? "left" : "right";
      i.declarations.mirrored = mirror ? "yes" : "no";
      for (const o of i.outputs) {
        const p = o.pose.landmarks[0];
        if (left) {
          for (const point of p) point.x = 1 - point.x;
          [p[11], p[12]] = [p[12], p[11]]; [p[27], p[28]] = [p[28], p[27]];
        }
        if (mirror) for (const point of p) point.x = 1 - point.x;
      }
      const metrics = produceMetricPayload(i).metrics;
      expect(metrics[0].value.numericValue).toBeCloseTo(1.5, 9);
      expect(metrics[1].value.numericValue).toBeCloseTo(26.56505117707799, 6);
    }
  });

  it("wraps both sides of vertical and rejects spans below/at epsilon", () => {
    for (const dx of [-1e-8, 0, 1e-8]) {
      const p = points(); p[11].x = .5 + dx; p[12].x = .5; p[11].y = .2; p[12].y = .6;
      const result = calculateShoulderLineAngle(geometry(p)).value!;
      expect(result).toBeGreaterThanOrEqual(-90); expect(result).toBeLessThan(90);
      expect(Math.abs(result)).toBeCloseTo(90, 4);
      if (dx < 0) expect(result).toBeLessThan(0);
      if (dx > 0) expect(result).toBeGreaterThan(0);
    }
    for (const span of [0, GEOMETRY_EPSILON / 2, GEOMETRY_EPSILON, GEOMETRY_EPSILON * 2]) {
      const p = points(); p[11].x = 0; p[12].x = span; p[11].y = p[12].y = 0;
      expect(calculateShoulderLineAngle(geometry(p)).status).toBe(span > GEOMETRY_EPSILON ? "measured" : "unavailable");
      expect(calculateStanceWidthRatio(geometry(p)).status).toBe(span > GEOMETRY_EPSILON ? "measured" : "unavailable");
      p[11].x = .1; p[12].x = .3; p[27].x = 0; p[28].x = span; p[27].y = p[28].y = 0;
      expect(calculateStanceWidthRatio(geometry(p)).status).toBe(span > GEOMETRY_EPSILON ? "measured" : "unavailable");
    }
  });
});

describe("reviewed metric producer", () => {
  it("emits canonical schema slots, status, units and limitations without internal inputs", () => {
    const payload = produceMetricPayload(input());
    expect(isSwingMetricPayload(payload)).toBe(true);
    expect(payload.schemaVersion).toBe("0.1.0"); expect(payload.caddieSetEquivalence).toBe("not-equivalent");
    expect(payload.metrics.map(m => m.metricName)).toEqual(metricNames);
    expect(payload.metrics.map(m => [m.phaseId, m.units])).toEqual([["address", "ratio"], ["top", "degrees"], ["impact", "degrees"], ["finish", "degrees"]]);
    expect(payload.metrics[0].value.numericValue).toBeCloseTo(1.5, 9);
    expect(payload.metrics[1].value.numericValue).toBeCloseTo(26.56505117707799, 6);
    for (const metric of payload.metrics.slice(0, 2)) {
      expect(metric.confidence.kind).toBe("not-calibrated"); expect(metric.limitationNotes).toEqual(["none"]);
    }
    expect(payload.metrics[2].limitationNotes).toEqual(["metric-not-calculated", "impact-not-directly-observed"]);
    expect(payload.metrics[3].limitationNotes).toEqual(["metric-not-calculated"]);
    expect(payload.metrics.slice(2).every(m => m.value.status === "unsupported" && m.value.numericValue === null && m.confidence.kind === "unavailable")).toBe(true);
    const keys = (value: unknown): string[] => typeof value === "object" && value !== null ? Object.entries(value).flatMap(([key, child]) => [key, ...keys(child)]) : [];
    expect(keys(payload).some(key => (prohibitedMetricPayloadKeys as readonly string[]).includes(key))).toBe(false);
  });

  it("resolves corrected phase assignments, including appended frames and reused times", () => {
    const i = input(); const outputs = [...i.outputs];
    const chosen = output(8, 250); chosen.pose.landmarks[0][11].y = chosen.pose.landmarks[0][12].y;
    outputs.push(chosen); i.outputs = outputs;
    const assignments = i.review!.correction!.assignments.map(a => a.phaseId === "top" ? { ...a, sampleIndex: 8 } : a);
    i.review = applyPhaseCorrection(i.review!, assignments, true, 4, outputs);
    expect(produceMetricPayload(i).metrics[1].value.numericValue).toBe(0);
    assignments[3].sampleIndex = 2;
    i.review = applyPhaseCorrection(i.review!, assignments, true, 4, outputs);
    expect(produceMetricPayload(i).metrics[1].value.numericValue).toBe(0);
  });

  it.each(["view", "handedness", "mirrored", "setup"] as const)("blocks unsupported %s before review/evidence", key => {
    const i = input(); i.declarations[key] = "undeclared"; i.review = undefined;
    const payload = produceMetricPayload(i);
    expect(payload.metrics.every(m => m.value.status === "unsupported" && m.value.numericValue === null)).toBe(true);
    expect(payload.metrics[0].limitationNotes).toContain("phase-unsupported");
    expect(new Set(payload.metrics[2].limitationNotes).size).toBe(payload.metrics[2].limitationNotes.length);
  });

  it("rejects absent/stale/unconfirmed/malformed review without reusing prior values", () => {
    for (const change of [
      (i: MetricProducerInput) => { i.review = undefined; },
      (i: MetricProducerInput) => { i.activeGeneration++; },
      (i: MetricProducerInput) => { i.review!.readyForFutureMetrics = false; },
      (i: MetricProducerInput) => { i.review!.correction = undefined; },
      (i: MetricProducerInput) => { i.review!.correction!.runGeneration++; },
      (i: MetricProducerInput) => { i.review!.automaticProposal.runGeneration++; },
      (i: MetricProducerInput) => { i.review!.correction!.assignments = []; },
      (i: MetricProducerInput) => { i.review!.correction!.assignments[3].sampleIndex = 7; }
    ]) {
      const i = input(); change(i);
      expect(produceMetricPayload(i).metrics.slice(0, 2).every(m => m.value.status === "not-reviewed" && m.value.numericValue === null && m.limitationNotes.includes("phase-review-required"))).toBe(true);
    }
  });

  it("uses the visibility boundary and never emits a numeric low-evidence value", () => {
    for (const visibility of [.5, .5 - Number.EPSILON]) {
      const i = input(); i.outputs[0].pose.landmarks[0][27].visibility = visibility;
      const metric = produceMetricPayload(i).metrics[0];
      expect(metric.value.status).toBe(visibility === .5 ? "measured" : "missing");
      if (visibility < .5) { expect(metric.value.numericValue).toBeNull(); expect(metric.confidence.kind).toBe("unavailable"); }
    }
  });

  it("fails closed on missing, invalid, mismatched and degenerate paired evidence", () => {
    for (const mutate of [
      (o: SampledFrameOutput) => { delete o.inferenceImage; },
      ...[0, -1, .5, NaN, Infinity].map(width => (o: SampledFrameOutput) => { o.inferenceImage = { ...o.inferenceImage!, width }; }),
      (o: SampledFrameOutput) => { o.inferenceImage = { ...o.inferenceImage!, height: 0 }; },
      (o: SampledFrameOutput) => { o.inferenceImage = { ...o.inferenceImage!, pose: { ...o.pose } }; },
      (o: SampledFrameOutput) => { o.pose.timestampMs++; },
      (o: SampledFrameOutput) => { o.runGeneration++; },
      (o: SampledFrameOutput) => { o.index++; },
      (o: SampledFrameOutput) => { o.observedSeekTimestampMs = NaN; },
      (o: SampledFrameOutput) => { o.pose.worldLandmarks[0][0].x = Infinity; },
      (o: SampledFrameOutput) => { delete o.pose.landmarks[0][11]; },
      ...[NaN, Infinity, -0.01, 1.01].flatMap(value => ["x", "y", "visibility"].map(key => (o: SampledFrameOutput) => { o.pose.landmarks[0][11][key as "x"] = value; })),
      (o: SampledFrameOutput) => { o.pose.landmarks[0][11] = { ...o.pose.landmarks[0][12] }; }
    ]) {
      for (const [index, slot] of [[0, 0], [3, 1]]) {
        const i = input(); mutate(i.outputs[index]);
        const metric = produceMetricPayload(i).metrics[slot];
        expect(metric.value).toEqual({ status: "missing", numericValue: null });
        expect(metric.limitationNotes).toContain("pose-evidence-low");
      }
    }
  });
});

describe("current review state integration", () => {
  function reviewed() {
    const state = createInitialAppState(); const i = input();
    completeProcessingWithOutputs(state, { getOutputs: () => i.outputs });
    state.phaseDeclarations = i.declarations; rebuildPhaseReviewState(state);
    setPhaseConfirmation(state, true); confirmPhaseReview(state);
    expect(state.metricPayload?.metrics[0].value.numericValue).toBeCloseTo(1.5, 9);
    return state;
  }

  it("clears payload and export revision for every invalidating state transition", () => {
    const changes = [
      (s: ReturnType<typeof reviewed>) => selectLocalVideo(s, new File(["synthetic"], "synthetic.webm")),
      (s: ReturnType<typeof reviewed>) => setAnalysisInterval(s, { startSeconds: .1, endSeconds: .7 }),
      ...(["view", "handedness", "mirrored", "setup"] as const).map(key => (s: ReturnType<typeof reviewed>) => setPhaseDeclaration(s, key, "undeclared")),
      (s: ReturnType<typeof reviewed>) => setPhaseDraftAssignment(s, 3, 2),
      (s: ReturnType<typeof reviewed>) => assignManualPhaseOutput(s, 3, output(8, 250)),
      (s: ReturnType<typeof reviewed>) => setPhaseConfirmation(s, false),
      (s: ReturnType<typeof reviewed>) => invalidatePhaseConfirmation(s),
      (s: ReturnType<typeof reviewed>) => resetPhaseReview(s),
      (s: ReturnType<typeof reviewed>) => resetAppState(s),
      (s: ReturnType<typeof reviewed>) => rebuildPhaseReviewState(s),
      (s: ReturnType<typeof reviewed>) => completeProcessingWithOutputs(s, { getOutputs: () => phaseDefinitions.map((_, index) => output(index, index * 100, 5)) })
    ];
    for (const change of changes) {
      const s = reviewed(); const token = s.swingCardToken;
      change(s); expect(s.metricPayload).toBeUndefined(); expect(s.swingCardToken).not.toBe(token);
    }
  });

  it("requires reconfirmation after a replacement and cannot confirm while selection is pending", () => {
    const s = reviewed(); invalidatePhaseConfirmation(s); s.eventFrameBusy = true;
    setPhaseConfirmation(s, true); confirmPhaseReview(s); expect(s.metricPayload).toBeUndefined();
    s.eventFrameBusy = false; assignManualPhaseOutput(s, 3, output(8, 250));
    expect(s.metricPayload).toBeUndefined(); setPhaseConfirmation(s, true); confirmPhaseReview(s);
    expect(s.metricPayload?.metrics[1].value.numericValue).toBe(0);
  });
});
