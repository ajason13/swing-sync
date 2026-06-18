import { describe, expect, it, vi } from "vitest";
import type { SampledFrameOutput } from "../../src/frame-processing";
import {
  applyPhaseCorrection,
  createPhaseProposal,
  createPhaseReviewState,
  isValidCorrection,
  phaseDefinitions,
  type PhaseAssignment,
  type PhaseDeclarations
} from "../../src/phase-review";
import { poseThresholds, type PoseFrameResult, type PoseLandmark } from "../../src/pose-contract";

const declarations: PhaseDeclarations = {
  view: "face-on",
  handedness: "right",
  mirrored: "no",
  setup: "confirmed"
};

function landmark(): PoseLandmark {
  return { x: 0.5, y: 0.5, z: 0, visibility: 1 };
}

function pose(timestampMs: number): PoseFrameResult {
  return {
    timestampMs,
    landmarks: [Array.from({ length: 33 }, landmark)],
    worldLandmarks: [Array.from({ length: 33 }, landmark)],
    thresholds: poseThresholds
  };
}

function outputs(generation = 4): SampledFrameOutput[] {
  return phaseDefinitions.map((_, index) => ({
    runGeneration: generation,
    index,
    requestedTimestampMs: index * 100,
    observedSeekTimestampMs: index * 100 + 0.25,
    preview: { close: vi.fn() } as unknown as ImageBitmap,
    pose: pose(index * 100)
  }));
}

function identityAssignments(): PhaseAssignment[] {
  return phaseDefinitions.map((phase, sampleIndex) => ({ phaseId: phase.id, sampleIndex }));
}

describe("phase proposal", () => {
  it("creates the deterministic review-required identity layout with stable warnings", () => {
    const proposal = createPhaseProposal(outputs(), declarations);

    expect(proposal.evidenceStatus).toBe("review-required");
    expect(proposal.assignments).toEqual(identityAssignments());
    expect(proposal.warningCodes).toEqual(["PHASE_REVIEW_REQUIRED", "IMPACT_NOT_CONFIRMED"]);
    expect(createPhaseProposal(outputs(), declarations)).toEqual(proposal);
    expect(JSON.stringify(proposal)).not.toMatch(/timestamp|landmarks|preview|observed/i);
  });

  it.each([
    { view: "undeclared", handedness: "right", mirrored: "no", setup: "confirmed" },
    { view: "face-on", handedness: "undeclared", mirrored: "no", setup: "confirmed" },
    { view: "face-on", handedness: "right", mirrored: "undeclared", setup: "confirmed" }
  ] as PhaseDeclarations[])("rejects undeclared input %#", (value) => {
    expect(createPhaseProposal(outputs(), value).evidenceStatus).toBe("unsupported-input");
  });

  it("rejects undeclared setup confirmation", () => {
    expect(
      createPhaseProposal(outputs(), { ...declarations, setup: "undeclared" }).evidenceStatus
    ).toBe("unsupported-input");
  });

  it("rejects invalid sample count and generation", () => {
    expect(createPhaseProposal(outputs().slice(0, 7), declarations).evidenceStatus).toBe(
      "unsupported-input"
    );
    expect(
      createPhaseProposal([...outputs(), { ...outputs()[7], index: 8 }], declarations).evidenceStatus
    ).toBe("unsupported-input");
    const mismatched = outputs();
    mismatched[7].runGeneration = 5;
    expect(createPhaseProposal(mismatched, declarations).evidenceStatus).toBe("unsupported-input");
  });

  it("accepts matching pose/request timestamps and rejects mismatches", () => {
    expect(createPhaseProposal(outputs(), declarations).evidenceStatus).toBe("review-required");
    const mismatched = outputs();
    mismatched[3].pose = pose(301);
    expect(createPhaseProposal(mismatched, declarations).evidenceStatus).toBe("unsupported-input");
  });

  it("rejects malformed, incomplete, and non-finite poses", () => {
    const incomplete = outputs();
    incomplete[2].pose.landmarks[0].pop();
    expect(createPhaseProposal(incomplete, declarations).evidenceStatus).toBe("unsupported-input");

    const nonFinite = outputs();
    nonFinite[2].pose.worldLandmarks[0][0].x = Number.NaN;
    expect(createPhaseProposal(nonFinite, declarations).evidenceStatus).toBe("unsupported-input");

    const infiniteTimestamp = outputs();
    infiniteTimestamp[2].requestedTimestampMs = Number.POSITIVE_INFINITY;
    infiniteTimestamp[2].pose = pose(Number.POSITIVE_INFINITY);
    expect(createPhaseProposal(infiniteTimestamp, declarations).evidenceStatus).toBe(
      "unsupported-input"
    );

    const missing = outputs();
    missing[2].pose.landmarks = [];
    expect(createPhaseProposal(missing, declarations).evidenceStatus).toBe("unsupported-input");

    const sparse = outputs();
    delete sparse[2];
    expect(createPhaseProposal(sparse, declarations).evidenceStatus).toBe("unsupported-input");
  });
});

describe("phase correction", () => {
  it("accepts confirmed nondecreasing assignments with shared sample indices", () => {
    const proposal = createPhaseProposal(outputs(), declarations);
    const state = createPhaseReviewState(proposal);
    const assignments = identityAssignments();
    assignments[2].sampleIndex = 1;

    const corrected = applyPhaseCorrection(state, assignments, true, proposal.runGeneration);

    expect(corrected.readyForFutureMetrics).toBe(true);
    expect(corrected.correction?.assignments).toEqual(assignments);
    expect(corrected.automaticProposal.assignments).toEqual(identityAssignments());
  });

  it("rejects decreasing, missing, duplicate-phase, out-of-range, stale, and unconfirmed input", () => {
    const proposal = createPhaseProposal(outputs(), declarations);
    const state = createPhaseReviewState(proposal);
    const decreasing = identityAssignments();
    decreasing[2].sampleIndex = 0;
    decreasing[1].sampleIndex = 2;
    expect(isValidCorrection(decreasing)).toBe(false);

    const missing = identityAssignments().slice(0, 7);
    const duplicatePhase = identityAssignments();
    duplicatePhase[2] = { ...duplicatePhase[2], phaseId: "toe-up" };
    const outOfRange = identityAssignments();
    outOfRange[7].sampleIndex = 8;
    const tooMany = [...identityAssignments(), { phaseId: "finish", sampleIndex: 7 } as const];
    const sparse = identityAssignments();
    delete sparse[2];

    for (const assignments of [decreasing, missing, duplicatePhase, outOfRange, tooMany, sparse]) {
      expect(applyPhaseCorrection(state, assignments, true, proposal.runGeneration)).toBe(state);
    }
    expect(applyPhaseCorrection(state, identityAssignments(), false, proposal.runGeneration)).toBe(
      state
    );
    expect(applyPhaseCorrection(state, identityAssignments(), true, proposal.runGeneration + 1)).toBe(
      state
    );
  });

  it("keeps unsupported proposals unready", () => {
    const state = createPhaseReviewState(
      createPhaseProposal(outputs(), { ...declarations, view: "undeclared" })
    );
    expect(applyPhaseCorrection(state, identityAssignments(), true, state.runGeneration)).toBe(state);
    expect(state.readyForFutureMetrics).toBe(false);
  });
});
