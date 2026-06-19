import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  isSwingMetricPayload,
  metricNames,
  prohibitedMetricPayloadKeys,
  type SwingMetricPayload
} from "../../src/metric-contract";

function fixture(name: string): unknown {
  return JSON.parse(readFileSync(resolve("test/fixtures/metrics", name), "utf8"));
}

function validPayload(): SwingMetricPayload {
  return structuredClone(fixture("valid-payload.json")) as SwingMetricPayload;
}

function firstMetric(overrides: Partial<SwingMetricPayload["metrics"][number]>) {
  const payload = validPayload();
  payload.metrics[0] = { ...payload.metrics[0], ...overrides };
  return payload;
}

describe("metric payload fixtures", () => {
  it("accepts valid, missing, and low-confidence fixtures", () => {
    expect(isSwingMetricPayload(fixture("valid-payload.json"))).toBe(true);
    expect(isSwingMetricPayload(fixture("missing-payload.json"))).toBe(true);
    expect(isSwingMetricPayload(fixture("low-confidence-payload.json"))).toBe(true);
  });

  it("covers the impact metric under low-evidence conditions", () => {
    const payload = fixture("low-confidence-payload.json") as SwingMetricPayload;
    expect(payload.metrics).toContainEqual({
      metricName: "impact-spine-line-angle",
      value: { status: "measured", numericValue: 9.75 },
      units: "degrees",
      phaseId: "impact",
      handedness: "right",
      confidence: { kind: "low-evidence" },
      limitationNotes: ["pose-evidence-low", "impact-not-directly-observed"]
    });
    expect(isSwingMetricPayload(payload)).toBe(true);
  });

  it("covers every allowed metric name with a valid fixture entry", () => {
    const payload = validPayload();
    expect(payload.metrics.map((metric) => metric.metricName).sort()).toEqual(
      [...metricNames].sort()
    );
    expect(isSwingMetricPayload(payload)).toBe(true);
  });
});

describe("metric payload validation", () => {
  it("requires exact schema version and CaddieSet non-equivalence marker", () => {
    for (const schemaVersion of ["0.1.1", "1.0.0", "", "^0.1.0", 0.1]) {
      expect(isSwingMetricPayload({ ...validPayload(), schemaVersion })).toBe(false);
    }
    const omitted = validPayload() as Partial<SwingMetricPayload>;
    delete omitted.caddieSetEquivalence;
    expect(isSwingMetricPayload(omitted)).toBe(false);
    expect(isSwingMetricPayload({ ...validPayload(), caddieSetEquivalence: "equivalent" })).toBe(false);
    expect(isSwingMetricPayload({ ...validPayload(), caddieSetEquivalence: "partial" })).toBe(false);
    expect(isSwingMetricPayload({ ...validPayload(), caddieSetEquivalence: "" })).toBe(false);
    expect(isSwingMetricPayload({ ...validPayload(), caddieSetEquivalence: false })).toBe(false);
  });

  it("rejects unknown, non-canonical, and mismatched vocabularies", () => {
    expect(isSwingMetricPayload(firstMetric({ metricName: "unknown" as never }))).toBe(false);
    expect(isSwingMetricPayload(firstMetric({ metricName: "Address-Stance-Ratio" as never }))).toBe(false);
    expect(isSwingMetricPayload(firstMetric({ metricName: " address-stance-ratio" as never }))).toBe(false);
    expect(isSwingMetricPayload(firstMetric({ units: "meters" as never }))).toBe(false);
    expect(isSwingMetricPayload(firstMetric({ units: "degrees" }))).toBe(false);
    expect(isSwingMetricPayload(firstMetric({ phaseId: "finish" }))).toBe(false);
    expect(isSwingMetricPayload(firstMetric({ handedness: "ambidextrous" as never }))).toBe(false);
    expect(
      isSwingMetricPayload(firstMetric({ confidence: { kind: "high" as never } }))
    ).toBe(false);
    expect(isSwingMetricPayload(firstMetric({ limitationNotes: ["unsafe" as never] }))).toBe(false);
  });

  it("enforces value and confidence pairing without fabricating unavailable values", () => {
    expect(isSwingMetricPayload(firstMetric({ value: { status: "measured", numericValue: 0 } }))).toBe(true);
    expect(isSwingMetricPayload(firstMetric({ value: { status: "measured", numericValue: null } as never }))).toBe(false);
    expect(isSwingMetricPayload(firstMetric({ value: { status: "measured", numericValue: Number.NaN } }))).toBe(false);
    expect(
      isSwingMetricPayload(firstMetric({ value: { status: "measured", numericValue: Number.POSITIVE_INFINITY } }))
    ).toBe(false);
    expect(
      isSwingMetricPayload(firstMetric({ value: { status: "measured", numericValue: Number.NEGATIVE_INFINITY } }))
    ).toBe(false);
    expect(
      isSwingMetricPayload(
        firstMetric({
          value: { status: "missing", numericValue: 1 } as never,
          confidence: { kind: "unavailable" }
        })
      )
    ).toBe(false);
    expect(
      isSwingMetricPayload(firstMetric({ confidence: { kind: "unavailable" } }))
    ).toBe(false);
    expect(
      isSwingMetricPayload(
        firstMetric({
          value: { status: "missing", numericValue: null },
          confidence: { kind: "not-calibrated" }
        })
      )
    ).toBe(false);
  });

  it("rejects measured undeclared handedness and invalid limitation arrays", () => {
    expect(isSwingMetricPayload(firstMetric({ handedness: "undeclared" }))).toBe(false);
    expect(isSwingMetricPayload(firstMetric({ limitationNotes: [] }))).toBe(false);
    expect(
      isSwingMetricPayload(firstMetric({ limitationNotes: ["pose-evidence-low", "pose-evidence-low"] }))
    ).toBe(false);
    expect(
      isSwingMetricPayload(firstMetric({ limitationNotes: ["none", "pose-evidence-low"] }))
    ).toBe(false);
    expect(
      isSwingMetricPayload(firstMetric({ limitationNotes: ["impact-not-directly-observed"] }))
    ).toBe(false);
    const impact = validPayload();
    expect(
      isSwingMetricPayload({
        ...impact,
        metrics: [
          {
            ...impact.metrics[2],
            limitationNotes: ["impact-not-directly-observed"]
          }
        ]
      })
    ).toBe(true);
  });

  it("rejects missing required fields and additional properties at every level", () => {
    const missingMetric = validPayload();
    delete (missingMetric.metrics[0] as Partial<SwingMetricPayload["metrics"][number]>).units;
    expect(isSwingMetricPayload(missingMetric)).toBe(false);

    expect(isSwingMetricPayload({ ...validPayload(), extra: true })).toBe(false);
    expect(isSwingMetricPayload(firstMetric({ extra: true } as never))).toBe(false);
    expect(
      isSwingMetricPayload(firstMetric({ value: { status: "measured", numericValue: 1, extra: true } as never }))
    ).toBe(false);
    expect(
      isSwingMetricPayload(firstMetric({ confidence: { kind: "not-calibrated", extra: true } as never }))
    ).toBe(false);
  });

  it("rejects exact prohibited sensitive keys recursively", () => {
    for (const key of prohibitedMetricPayloadKeys) {
      expect(
        isSwingMetricPayload({
          ...validPayload(),
          metrics: [
            {
              ...validPayload().metrics[0],
              value: {
                status: "measured",
                numericValue: 0,
                nested: { [key]: "blocked" }
              }
            }
          ]
        })
      ).toBe(false);
    }
    expect(
      isSwingMetricPayload(firstMetric({ Frame: "case variant is still an extra property" } as never))
    ).toBe(false);
  });

  it("keeps fixtures and schema free of sensitive and unsafe wording", () => {
    const combined = [
      readFileSync(resolve("docs/schemas/swing-metric-payload-v0.1.0.schema.json"), "utf8"),
      readFileSync(resolve("test/fixtures/metrics/valid-payload.json"), "utf8"),
      readFileSync(resolve("test/fixtures/metrics/missing-payload.json"), "utf8"),
      readFileSync(resolve("test/fixtures/metrics/low-confidence-payload.json"), "utf8")
    ].join("\n");

    expect(combined).not.toMatch(
      /landmarks|worldLandmarks|preview|requestedTimestampMs|observedSeekTimestampMs|runGeneration|userId|golferId|ballSpeed/i
    );
    expect(combined).not.toMatch(
      /diagnosis|injury|rehab|prescription|drill|coach should|professional instruction|fix your swing/i
    );
  });

  it("returns false instead of throwing for malformed input", () => {
    for (const value of [undefined, null, true, 1, "payload", [], () => undefined]) {
      expect(isSwingMetricPayload(value)).toBe(false);
    }
  });
});
