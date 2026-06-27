import { describe, expect, it } from "vitest";
import type { SwingMetricPayload } from "../../src/metric-contract";
import type { PoseOverlayRenderResult } from "../../src/pose-renderer";
import type { SwingCardContent, SwingCardKeyframe } from "../../src/swing-card-contract";
import {
  buildCoachingValidationContext,
  coachingProhibitedTextPatterns,
  maxCoachingResponseItemsPerSection,
  maxCoachingResponseItemTextLength,
  normalizeCoachingText,
  reviewRequiredCoachingText,
  unavailableCoachingText,
  validateCoachingResponse,
  type CoachingResponse
} from "../../src/coaching-contract";
import { buildCoachingPrompt } from "../../src/coaching-prompt";

function overlay(status: PoseOverlayRenderResult["status"] = "rendered"): PoseOverlayRenderResult {
  return {
    status,
    renderedSegments: status === "unavailable" ? 0 : 18,
    skippedSegments: status === "rendered" ? 0 : 1,
    warnings: [],
    width: 640,
    height: 360
  };
}

function preview(): ImageBitmap {
  return { width: 640, height: 360, close: () => undefined } as unknown as ImageBitmap;
}

function keyframe(overrides: Partial<SwingCardKeyframe> = {}): SwingCardKeyframe {
  return {
    phaseId: "address",
    phaseLabel: "Address",
    preview: preview(),
    overlay: overlay(),
    ...overrides
  };
}

function metricPayload(overrides: Partial<SwingMetricPayload["metrics"][number]> = {}): SwingMetricPayload {
  return {
    schemaVersion: "0.1.0",
    caddieSetEquivalence: "not-equivalent",
    metrics: [
      {
        metricName: "address-stance-ratio",
        value: { status: "measured", numericValue: 1.2 },
        units: "ratio",
        phaseId: "address",
        handedness: "right",
        confidence: { kind: "not-calibrated" },
        limitationNotes: ["none"],
        ...overrides
      }
    ]
  };
}

function content(overrides: Partial<SwingCardContent> = {}): SwingCardContent {
  return {
    keyframes: [keyframe()],
    metricPayload: metricPayload(),
    warnings: [],
    analysisPrompt: "Use only the evidence shown in the card.",
    ...overrides
  };
}

function validResponse(overrides: Partial<CoachingResponse> = {}): CoachingResponse {
  return {
    schemaVersion: "0.1.0",
    observations: [{ phaseId: "address", evidenceStatus: "supported", text: "Address setup has usable card evidence." }],
    likelyCauses: [],
    drills: [],
    cautions: [],
    nextFocus: [],
    ...overrides
  };
}

describe("coaching prompt", () => {
  it("states evidence, schema, safety, privacy, and exact bound constraints", () => {
    const prompt = buildCoachingPrompt(
      content({ warnings: ["PROMPT_LIMITED_EVIDENCE", "PHASE_REVIEW_REQUIRED"] })
    );

    expect(prompt).toContain("selected annotated keyframe stills");
    expect(prompt).toContain("confidence states");
    expect(prompt).toContain("Return only JSON");
    expect(prompt).toContain("observations, likelyCauses, drills, cautions, and nextFocus");
    expect(prompt).toContain(`${maxCoachingResponseItemsPerSection} items per section`);
    expect(prompt).toContain(`${maxCoachingResponseItemTextLength} characters per item text`);
    expect(prompt).toContain(unavailableCoachingText);
    expect(prompt).toContain(reviewRequiredCoachingText);
    expect(prompt).toContain("Do not provide medical advice");
    expect(prompt).toContain("overlay rendered");
    expect(prompt).toContain("terms and privacy practices apply");
    expect(prompt).not.toContain("API key");
  });
});

describe("coaching validation context", () => {
  it("derives unavailable phases from missing keyframes and metrics", () => {
    const context = buildCoachingValidationContext(
      content({ keyframes: [], metricPayload: undefined, warnings: ["NO_KEYFRAMES_SELECTED", "METRICS_UNAVAILABLE"] })
    );

    expect(context.unavailablePhaseIds).toEqual([
      "address",
      "toe-up",
      "mid-backswing",
      "top",
      "mid-downswing",
      "impact",
      "mid-follow-through",
      "finish"
    ]);
  });

  it("derives review-required phases with priority over unavailable phases", () => {
    const context = buildCoachingValidationContext(
      content({
        keyframes: [],
        metricPayload: undefined,
        warnings: ["NO_KEYFRAMES_SELECTED", "METRICS_UNAVAILABLE", "PHASE_REVIEW_REQUIRED"]
      })
    );

    expect(context.reviewRequiredPhaseIds).toContain("address");
    const result = validateCoachingResponse(
      validResponse({
        observations: [{ phaseId: "address", evidenceStatus: "unavailable", text: unavailableCoachingText }]
      }),
      content({ warnings: ["PHASE_REVIEW_REQUIRED"] })
    );
    expect(result).toEqual({
      ok: false,
      errors: ["REVIEW_REQUIRED_TEXT_NOT_TEMPLATE", "FABRICATED_SUPPORTED_EVIDENCE"]
    });
  });

  it("allows limited status by elimination for partial renderable evidence", () => {
    const card = content({ keyframes: [keyframe({ phaseId: "top", phaseLabel: "Top", overlay: overlay("partial") })] });
    const context = buildCoachingValidationContext(card);

    expect(context.unavailablePhaseIds).not.toContain("top");
    expect(context.limitedPhaseIds).toContain("top");
    expect(context.reviewRequiredPhaseIds).not.toContain("top");
    expect(
      validateCoachingResponse(
        validResponse({
          observations: [{ phaseId: "top", evidenceStatus: "limited", text: "Top has partial overlay evidence." }]
        }),
        card
      )
    ).toEqual({ ok: true, value: expect.any(Object) });
    expect(
      validateCoachingResponse(
        validResponse({
          observations: [{ phaseId: "top", evidenceStatus: "supported", text: "Top is fully supported." }]
        }),
        card
      )
    ).toEqual({ ok: false, errors: ["LIMITED_EVIDENCE_REQUIRES_LIMITED_STATUS"] });
  });

  it("derives metric-only phases as limited and missing metric phases as unavailable", () => {
    const card = content({
      keyframes: [],
      metricPayload: metricPayload({
        metricName: "impact-spine-line-angle",
        units: "degrees",
        phaseId: "impact"
      })
    });
    const context = buildCoachingValidationContext(card);

    expect(context.unavailablePhaseIds).not.toContain("impact");
    expect(context.limitedPhaseIds).toContain("impact");
    expect(context.unavailablePhaseIds).toContain("top");
    expect(
      validateCoachingResponse(
        validResponse({
          observations: [{ phaseId: "impact", evidenceStatus: "supported", text: "Impact has full evidence." }]
        }),
        card
      )
    ).toEqual({ ok: false, errors: ["LIMITED_EVIDENCE_REQUIRES_LIMITED_STATUS"] });
  });

  it("uses Swing Card content internally instead of accepting caller supplied context", () => {
    expect(validateCoachingResponse.length).toBe(2);
    const card = content({ keyframes: [], metricPayload: undefined, warnings: ["NO_KEYFRAMES_SELECTED", "METRICS_UNAVAILABLE"] });
    const result = validateCoachingResponse(
      validResponse({
        observations: [{ phaseId: "top", evidenceStatus: "supported", text: "Top is supported." }]
      }),
      card
    );

    expect(result).toEqual({
      ok: false,
      errors: ["UNAVAILABLE_TEXT_NOT_TEMPLATE", "FABRICATED_SUPPORTED_EVIDENCE"]
    });
  });
});

describe("coaching response validation", () => {
  it("accepts a minimal valid educational response", () => {
    expect(validateCoachingResponse(validResponse(), content())).toEqual({ ok: true, value: validResponse() });
  });

  it("rejects wrong version, unknown keys, missing sections, and invalid section shapes", () => {
    const result = validateCoachingResponse(
      {
        schemaVersion: "0.2.0",
        observations: "bad",
        likelyCauses: [],
        drills: [],
        cautions: [],
        extra: true
      },
      content()
    );

    expect(result).toEqual({
      ok: false,
      errors: ["WRONG_SCHEMA_VERSION", "UNKNOWN_TOP_LEVEL_KEY", "MISSING_SECTION", "INVALID_SECTION"]
    });
  });

  it("rejects overlong arrays, overlong text, invalid phase IDs, and invalid evidence statuses", () => {
    const overlong = "a".repeat(maxCoachingResponseItemTextLength + 1);
    const result = validateCoachingResponse(
      validResponse({
        observations: Array.from({ length: maxCoachingResponseItemsPerSection + 1 }, () => ({
          phaseId: "not-a-phase",
          evidenceStatus: "certain",
          text: overlong
        })) as never
      }),
      content()
    );

    expect(result).toEqual({
      ok: false,
      errors: ["ITEM_ARRAY_TOO_LONG", "ITEM_TEXT_TOO_LONG", "INVALID_PHASE_ID", "INVALID_EVIDENCE_STATUS"]
    });
  });

  it("rejects unavailable and review-required free text", () => {
    const unavailableResult = validateCoachingResponse(
      validResponse({
        observations: [{ phaseId: "top", evidenceStatus: "unavailable", text: "Top probably has an issue." }]
      }),
      content({ keyframes: [], metricPayload: undefined, warnings: ["NO_KEYFRAMES_SELECTED", "METRICS_UNAVAILABLE"] })
    );
    const reviewResult = validateCoachingResponse(
      validResponse({
        observations: [{ phaseId: "address", evidenceStatus: "review-required", text: "Review this setup carefully." }]
      }),
      content({ warnings: ["PHASE_REVIEW_REQUIRED"] })
    );

    expect(unavailableResult).toEqual({
      ok: false,
      errors: ["UNAVAILABLE_TEXT_NOT_TEMPLATE"]
    });
    expect(reviewResult).toEqual({
      ok: false,
      errors: ["REVIEW_REQUIRED_TEXT_NOT_TEMPLATE"]
    });
  });

  it("rejects unsafe medical, privacy, payload, and coordinate text without returning raw content", () => {
    const result = validateCoachingResponse(
      validResponse({
        observations: [
          {
            phaseId: "address",
            evidenceStatus: "supported",
            text: 'This will diagnose pain and guarantees privacy. {"metrics":[]}'
          },
          {
            phaseId: "address",
            evidenceStatus: "supported",
            text: "x: 0.12, y: 0.44"
          }
        ]
      }),
      content()
    );

    expect(result).toEqual({ ok: false, errors: ["UNSAFE_TEXT_CONTENT"] });
    expect(JSON.stringify(result)).not.toContain("diagnose pain");
    expect(JSON.stringify(result)).not.toContain("metrics");
  });

  it("normalizes text before prohibited pattern matching", () => {
    expect(normalizeCoachingText("  ＧＵＡＲＡＮＴＥＥＤ\u200b\n\nprivacy  ")).toBe("GUARANTEED privacy");
    expect(
      validateCoachingResponse(
        validResponse({
          observations: [{ phaseId: "address", evidenceStatus: "supported", text: "GUA RAN TEE D privacy" }]
        }),
        content()
      )
    ).toEqual({ ok: true, value: expect.any(Object) });
    expect(
      validateCoachingResponse(
        validResponse({
          observations: [{ phaseId: "address", evidenceStatus: "supported", text: "This gives GUARANTEED privacy." }]
        }),
        content()
      )
    ).toEqual({ ok: false, errors: ["UNSAFE_TEXT_CONTENT"] });
    expect(
      validateCoachingResponse(
        validResponse({
          observations: [{ phaseId: "address", evidenceStatus: "supported", text: "This guaran\u200bteed deletion." }]
        }),
        content()
      )
    ).toEqual({ ok: false, errors: ["UNSAFE_TEXT_CONTENT"] });
    expect(
      validateCoachingResponse(
        validResponse({
          observations: [{ phaseId: "address", evidenceStatus: "supported", text: "This has guaranteed\n\t deletion." }]
        }),
        content()
      )
    ).toEqual({ ok: false, errors: ["UNSAFE_TEXT_CONTENT"] });
    expect(
      validateCoachingResponse(
        validResponse({
          observations: [{ phaseId: "address", evidenceStatus: "supported", text: "This gu\u0430ranteed phrasing is a documented lookalike limitation." }]
        }),
        content()
      )
    ).toEqual({ ok: true, value: expect.any(Object) });
  });

  it("exports prohibited pattern descriptions for tests only", () => {
    expect(coachingProhibitedTextPatterns.every((entry) => entry.code === "UNSAFE_TEXT_CONTENT")).toBe(true);
    expect(coachingProhibitedTextPatterns.map((entry) => entry.description)).toContain("medical diagnosis wording");
  });
});
