Superseded: do not paste this prompt for the next Claude pass. Claude returned
FAIL with B9/B10. Use `docs/ss-012-claude-final-rereview-prompt.md` instead.

Role: You are the lead adversarial implementation auditor for Swing Sync.
Stage: Final implementation audit for sensitive story `SS-012 Design multimodal
coaching prompt and response schema`.

Claude Chat does not have filesystem or GitHub access, so this prompt includes
the relevant current source and test contents for direct review.

## Scope

Audit only SS-012 prompt/schema implementation:

- `src/coaching-contract.ts`
- `src/coaching-prompt.ts`
- `test/unit/coaching-prompt.test.ts`
- related documentation/context state summarized below

Out of scope: connected model API calls, provider SDKs, API keys, server
config, remote sharing, cloud storage, telemetry, remote logging, public
serving, model assets, new workers, new dependencies, raw swing video upload,
or UI integration beyond this local prompt/schema contract.

## Acceptance Criteria

- Prompt uses frames, metrics, confidence, and safety constraints.
- Response schema separates observations, likely causes, drills, cautions, and
  next focus.
- Prompt refuses medical diagnosis and overconfident biomechanical claims.
- Includes adversarial prompt tests.

## Prior QA Planning Status

Claude QA planning initially failed B1-B6, then B7/B8. All were closed in QA
planning. Claude cleared SS-012 for implementation. Non-blocking implementation
audit watch items:

- Confirm `limited` evidence status is derived by elimination from real
  `SwingCardContent` evidence rather than maintained as a separate mutable list.
- Confirm `coachingProhibitedTextPatterns.description` is developer/test-only
  and cannot surface through `CoachingValidationResult` or UI-facing paths.

## Protected Boundaries

- Raw swing video remains local-first and is not uploaded by default.
- No remote model/provider behavior is added in SS-012.
- No new dependency, SDK, model asset, worker, persistence, telemetry, logging,
  cloud storage, or public serving is added.
- Do not make medical, injury, rehabilitation, professional coaching,
  guaranteed correctness, guaranteed safety, guaranteed privacy, guaranteed
  deletion, anonymity, legal, or compliance claims.
- Validation errors must return stable codes only, not raw prompt/response
  content, metrics JSON, frames, filenames, timestamps, identifiers,
  coordinates, or object URLs.

## Verification Evidence

Commands already run and passed:

- `npm run test:unit -- coaching-prompt` (12 tests)
- `npm run test:unit` (113 tests across 11 files)
- `npm run build`
- `npm run compliance:verify`
- `npm run safety:verify`
- `npm run privacy:verify`
- `git diff --check`

Observability impact: intentionally unchanged. SS-012 adds no logs, telemetry,
analytics, traces, remote diagnostics, storage writes, console payload dumps,
provider calls, or persistent debug artifacts.

## Current Source

### `src/coaching-contract.ts`

```ts
import { phaseDefinitions, type PhaseId } from "./phase-review";
import type { SwingCardContent } from "./swing-card-contract";

export type CoachingResponseSchemaVersion = "0.1.0";

export const coachingResponseSchemaVersion = "0.1.0" as const;
export const maxCoachingResponseItemTextLength = 280 as const;
export const maxCoachingResponseItemsPerSection = 4 as const;
export const unavailableCoachingText =
  "Evidence is unavailable for this section, so no swing observation is provided." as const;
export const reviewRequiredCoachingText =
  "Phase review is required before this section can be interpreted." as const;

export type CoachingEvidenceStatus =
  | "supported"
  | "limited"
  | "unavailable"
  | "review-required";

export type CoachingValidationErrorCode =
  | "WRONG_SCHEMA_VERSION"
  | "UNKNOWN_TOP_LEVEL_KEY"
  | "MISSING_SECTION"
  | "INVALID_SECTION"
  | "ITEM_ARRAY_TOO_LONG"
  | "INVALID_ITEM"
  | "ITEM_TEXT_TOO_LONG"
  | "INVALID_PHASE_ID"
  | "INVALID_EVIDENCE_STATUS"
  | "UNSAFE_TEXT_CONTENT"
  | "UNAVAILABLE_TEXT_NOT_TEMPLATE"
  | "REVIEW_REQUIRED_TEXT_NOT_TEMPLATE"
  | "FABRICATED_SUPPORTED_EVIDENCE";

export interface CoachingResponseItem {
  readonly phaseId: PhaseId;
  readonly evidenceStatus: CoachingEvidenceStatus;
  readonly text: string;
}

export interface CoachingResponse {
  readonly schemaVersion: typeof coachingResponseSchemaVersion;
  readonly observations: readonly CoachingResponseItem[];
  readonly likelyCauses: readonly CoachingResponseItem[];
  readonly drills: readonly CoachingResponseItem[];
  readonly cautions: readonly CoachingResponseItem[];
  readonly nextFocus: readonly CoachingResponseItem[];
}

export interface CoachingValidationContext {
  readonly unavailablePhaseIds: readonly PhaseId[];
  readonly reviewRequiredPhaseIds: readonly PhaseId[];
}

export type CoachingValidationResult =
  | { readonly ok: true; readonly value: CoachingResponse }
  | { readonly ok: false; readonly errors: readonly CoachingValidationErrorCode[] };

export interface CoachingProhibitedTextPattern {
  readonly code: CoachingValidationErrorCode;
  readonly pattern: RegExp;
  readonly description: string;
}

const responseSectionKeys = ["observations", "likelyCauses", "drills", "cautions", "nextFocus"] as const;
const responseTopLevelKeys = ["schemaVersion", ...responseSectionKeys] as const;
const evidenceStatuses: readonly CoachingEvidenceStatus[] = [
  "supported",
  "limited",
  "unavailable",
  "review-required"
];
const errorOrder: readonly CoachingValidationErrorCode[] = [
  "WRONG_SCHEMA_VERSION",
  "UNKNOWN_TOP_LEVEL_KEY",
  "MISSING_SECTION",
  "INVALID_SECTION",
  "ITEM_ARRAY_TOO_LONG",
  "INVALID_ITEM",
  "ITEM_TEXT_TOO_LONG",
  "INVALID_PHASE_ID",
  "INVALID_EVIDENCE_STATUS",
  "UNSAFE_TEXT_CONTENT",
  "UNAVAILABLE_TEXT_NOT_TEMPLATE",
  "REVIEW_REQUIRED_TEXT_NOT_TEMPLATE",
  "FABRICATED_SUPPORTED_EVIDENCE"
];

const phaseIdSet = new Set<string>(phaseDefinitions.map((phase) => phase.id));
const evidenceStatusSet = new Set<string>(evidenceStatuses);

// Descriptions are for developer/test visibility only; never surface them in validation results or UI.
export const coachingProhibitedTextPatterns: readonly CoachingProhibitedTextPattern[] = [
  {
    code: "UNSAFE_TEXT_CONTENT",
    pattern: /\bdiagnos(?:e|is|ed|ing)\b/i,
    description: "medical diagnosis wording"
  },
  {
    code: "UNSAFE_TEXT_CONTENT",
    pattern: /\b(rehab|rehabilitation|physical therapy|treatment plan)\b/i,
    description: "rehabilitation or treatment wording"
  },
  {
    code: "UNSAFE_TEXT_CONTENT",
    pattern: /\b(play\s+through\s+pain|train\s+through\s+pain|push\s+through\s+pain|force\s+your\s+range)\b/i,
    description: "aggressive movement prescription"
  },
  {
    code: "UNSAFE_TEXT_CONTENT",
    pattern: /\b(guarantee|guaranteed|will\s+prevent\s+injury|prevents\s+injury|will\s+fix|will\s+cure)\b/i,
    description: "guarantee or cure wording"
  },
  {
    code: "UNSAFE_TEXT_CONTENT",
    pattern:
      /\b(anonymous|anonymized|private\s+by\s+default\s+when\s+uploaded|guarantees\s+privacy|guaranteed\s+deletion|GDPR\s+compliant|HIPAA\s+compliant)\b/i,
    description: "absolute privacy/legal/compliance wording"
  },
  {
    code: "UNSAFE_TEXT_CONTENT",
    pattern:
      /\b(fileName|filename|timestampMs|observedSeekTimestampMs|requestedTimestampMs|worldLandmarks|landmarks|objectUrl|userId)\b/i,
    description: "hidden raw payload or identifier key"
  },
  {
    code: "UNSAFE_TEXT_CONTENT",
    pattern: /[{[]\s*"(schemaVersion|metrics|landmarks|worldLandmarks|timestampMs)"/i,
    description: "raw JSON payload dump"
  },
  {
    code: "UNSAFE_TEXT_CONTENT",
    pattern: /\b[xX]\s*:\s*-?\d+(?:\.\d+)?\s*,\s*[yY]\s*:\s*-?\d+(?:\.\d+)?/i,
    description: "raw coordinate pair"
  }
];

export function buildCoachingValidationContext(content: SwingCardContent): CoachingValidationContext {
  const unavailable = new Set<PhaseId>();
  const reviewRequired = new Set<PhaseId>();
  const allPhaseIds = phaseDefinitions.map((phase) => phase.id);

  if (content.warnings.includes("PHASE_REVIEW_REQUIRED")) {
    allPhaseIds.forEach((phaseId) => reviewRequired.add(phaseId));
  }

  if (content.warnings.includes("NO_KEYFRAMES_SELECTED") && content.warnings.includes("METRICS_UNAVAILABLE")) {
    allPhaseIds.forEach((phaseId) => unavailable.add(phaseId));
  } else {
    for (const phaseId of allPhaseIds) {
      if (!hasRenderableKeyframeEvidence(content, phaseId) && !hasMeasuredMetricEvidence(content, phaseId)) {
        unavailable.add(phaseId);
      }
    }
  }

  return {
    unavailablePhaseIds: allPhaseIds.filter((phaseId) => unavailable.has(phaseId)),
    reviewRequiredPhaseIds: allPhaseIds.filter((phaseId) => reviewRequired.has(phaseId))
  };
}

export function validateCoachingResponse(value: unknown, content: SwingCardContent): CoachingValidationResult {
  const context = buildCoachingValidationContext(content);
  const errors = new Set<CoachingValidationErrorCode>();

  if (!isRecord(value)) {
    return invalid(["INVALID_SECTION"]);
  }

  addTopLevelErrors(value, errors);
  for (const section of responseSectionKeys) {
    validateSection(value[section], context, errors);
  }

  if (errors.size > 0) return invalid([...errors]);
  return { ok: true, value: value as CoachingResponse };
}

export function normalizeCoachingText(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function addTopLevelErrors(value: Record<string, unknown>, errors: Set<CoachingValidationErrorCode>): void {
  for (const key of Object.keys(value)) {
    if (!(responseTopLevelKeys as readonly string[]).includes(key)) errors.add("UNKNOWN_TOP_LEVEL_KEY");
  }
  if (value.schemaVersion !== coachingResponseSchemaVersion) errors.add("WRONG_SCHEMA_VERSION");
  for (const section of responseSectionKeys) {
    if (!Object.hasOwn(value, section)) errors.add("MISSING_SECTION");
  }
}

function validateSection(
  value: unknown,
  context: CoachingValidationContext,
  errors: Set<CoachingValidationErrorCode>
): void {
  if (!Array.isArray(value)) {
    errors.add("INVALID_SECTION");
    return;
  }
  if (value.length > maxCoachingResponseItemsPerSection) errors.add("ITEM_ARRAY_TOO_LONG");
  for (const item of value) {
    validateItem(item, context, errors);
  }
}

function validateItem(
  value: unknown,
  context: CoachingValidationContext,
  errors: Set<CoachingValidationErrorCode>
): void {
  if (!isRecord(value) || !hasExactKeys(value, ["phaseId", "evidenceStatus", "text"])) {
    errors.add("INVALID_ITEM");
    return;
  }

  const phaseId = value.phaseId;
  const evidenceStatus = value.evidenceStatus;
  const text = value.text;
  if (!isPhaseId(phaseId)) errors.add("INVALID_PHASE_ID");
  if (!isEvidenceStatus(evidenceStatus)) errors.add("INVALID_EVIDENCE_STATUS");
  if (typeof text !== "string" || text.length < 1) {
    errors.add("INVALID_ITEM");
    return;
  }
  if (text.length > maxCoachingResponseItemTextLength) errors.add("ITEM_TEXT_TOO_LONG");

  const normalizedText = normalizeCoachingText(text);
  if (coachingProhibitedTextPatterns.some(({ pattern }) => pattern.test(normalizedText))) {
    errors.add("UNSAFE_TEXT_CONTENT");
  }

  if (!isPhaseId(phaseId) || !isEvidenceStatus(evidenceStatus)) return;
  validateEvidenceText(phaseId, evidenceStatus, text, context, errors);
}

function validateEvidenceText(
  phaseId: PhaseId,
  evidenceStatus: CoachingEvidenceStatus,
  text: string,
  context: CoachingValidationContext,
  errors: Set<CoachingValidationErrorCode>
): void {
  if (evidenceStatus === "unavailable" && text !== unavailableCoachingText) {
    errors.add("UNAVAILABLE_TEXT_NOT_TEMPLATE");
  }
  if (evidenceStatus === "review-required" && text !== reviewRequiredCoachingText) {
    errors.add("REVIEW_REQUIRED_TEXT_NOT_TEMPLATE");
  }

  if (context.reviewRequiredPhaseIds.includes(phaseId)) {
    if (evidenceStatus !== "review-required") errors.add("FABRICATED_SUPPORTED_EVIDENCE");
    if (text !== reviewRequiredCoachingText) errors.add("REVIEW_REQUIRED_TEXT_NOT_TEMPLATE");
    return;
  }

  if (context.unavailablePhaseIds.includes(phaseId)) {
    if (evidenceStatus === "supported" || evidenceStatus === "limited") {
      errors.add("FABRICATED_SUPPORTED_EVIDENCE");
    }
    if (evidenceStatus !== "review-required" && text !== unavailableCoachingText) {
      errors.add("UNAVAILABLE_TEXT_NOT_TEMPLATE");
    }
  }
}

function hasRenderableKeyframeEvidence(content: SwingCardContent, phaseId: PhaseId): boolean {
  return content.keyframes.some(
    (keyframe) =>
      keyframe.phaseId === phaseId &&
      !!keyframe.preview &&
      !!keyframe.overlay &&
      (keyframe.overlay.status === "rendered" || keyframe.overlay.status === "partial")
  );
}

function hasMeasuredMetricEvidence(content: SwingCardContent, phaseId: PhaseId): boolean {
  return content.metricPayload?.metrics.some((metric) => metric.phaseId === phaseId && metric.value.status === "measured") ?? false;
}

function invalid(errors: readonly CoachingValidationErrorCode[]): CoachingValidationResult {
  const errorSet = new Set(errors);
  return {
    ok: false,
    errors: errorOrder.filter((code) => errorSet.has(code))
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

function isPhaseId(value: unknown): value is PhaseId {
  return typeof value === "string" && phaseIdSet.has(value);
}

function isEvidenceStatus(value: unknown): value is CoachingEvidenceStatus {
  return typeof value === "string" && evidenceStatusSet.has(value);
}
```

### `src/coaching-prompt.ts`

```ts
import { phaseDefinitions } from "./phase-review";
import type { SwingCardContent } from "./swing-card-contract";
import {
  maxCoachingResponseItemsPerSection,
  maxCoachingResponseItemTextLength,
  reviewRequiredCoachingText,
  unavailableCoachingText
} from "./coaching-contract";

export function buildCoachingPrompt(content: SwingCardContent): string {
  return [
    "Act as an educational golf movement assistant. I may manually provide a Swing Sync Card that contains selected annotated keyframe stills, bounded local metric summaries, confidence states, warnings, and limitations from my swing review.",
    "",
    "Use only the evidence shown in the card. If a metric, phase, or keyframe is marked unavailable, review-required, low-evidence, partial, or limited, do not guess, infer, or fill in missing values.",
    "",
    "Return only JSON with exact top-level keys: schemaVersion, observations, likelyCauses, drills, cautions, and nextFocus. Each section must contain no more than 4 items. Each item must include phaseId, evidenceStatus, and text. Each item text must be 280 characters or fewer.",
    "",
    `Use exactly this text for unavailable items: "${unavailableCoachingText}"`,
    `Use exactly this text for review-required items: "${reviewRequiredCoachingText}"`,
    "",
    "Do not provide medical advice, pain or injury diagnosis, rehabilitation guidance, aggressive movement prescriptions, guaranteed injury prevention, guaranteed performance improvement, or a replacement for a qualified golf coach or qualified medical professional.",
    "",
    "Do not claim the card, prompt, or any upload is anonymous, private, deleted, legally compliant, or governed by a specific provider policy. Sharing a downloaded card with another service is my separate action, and that service's terms and privacy practices apply.",
    "",
    `Schema limits: schemaVersion 0.1.0; max ${maxCoachingResponseItemsPerSection} items per section; max ${maxCoachingResponseItemTextLength} characters per item text.`,
    `Allowed phase IDs: ${phaseDefinitions.map((phase) => phase.id).join(", ")}.`,
    `Card warnings: ${content.warnings.join(", ") || "none"}.`,
    "Metric confidence and limitation summary:",
    formatMetricEvidence(content),
    "Keyframe evidence summary:",
    formatKeyframeEvidence(content)
  ].join("\n");
}

function formatMetricEvidence(content: SwingCardContent): string {
  const metrics = content.metricPayload?.metrics ?? [];
  if (metrics.length === 0) return "No approved metric payload is available.";
  return metrics
    .map((metric) => {
      const value =
        metric.value.status === "measured" ? `${metric.value.numericValue} ${metric.units}` : metric.value.status;
      return `${metric.phaseId}: ${metric.metricName}; value ${value}; confidence ${metric.confidence.kind}; limitations ${metric.limitationNotes.join(", ")}.`;
    })
    .join("\n");
}

function formatKeyframeEvidence(content: SwingCardContent): string {
  if (content.keyframes.length === 0) return "No selected keyframes are available.";
  return content.keyframes
    .map((keyframe) => {
      const status = keyframe.preview && keyframe.overlay ? keyframe.overlay.status : "unavailable";
      return `${keyframe.phaseId}: ${keyframe.phaseLabel}; overlay ${status}.`;
    })
    .join("\n");
}
```

### `test/unit/coaching-prompt.test.ts`

The complete current test file is included for audit. It defines local fixture
helpers only; no network, storage, or provider behavior is introduced.

```ts
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
    expect(context.reviewRequiredPhaseIds).not.toContain("top");
    expect(
      validateCoachingResponse(
        validResponse({
          observations: [{ phaseId: "top", evidenceStatus: "limited", text: "Top has partial overlay evidence." }]
        }),
        card
      )
    ).toEqual({ ok: true, value: expect.any(Object) });
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
```

## Requested Audit

Return:

- PASS or FAIL verdict.
- Blockers ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for whether SS-012 is ready for PR preparation.

Focus especially on:

- Whether the implementation matches the approved SS-012 specification.
- Whether `limited` evidence status is truly derived by elimination rather than
  a separate mutable list.
- Whether pattern `description` values can leak through validation results,
  UI, logs, or user-facing paths.
- Whether validation can be bypassed with caller-supplied context, malformed
  responses, missing sections, wrong schema versions, unsafe text, raw payload
  dumps, coordinates, timestamps, or fabricated supported evidence.
- Whether prompt text stays educational and avoids medical, rehabilitation,
  aggressive prescription, professional coaching replacement, guaranteed
  correctness, privacy, deletion, anonymity, legal, provider, or compliance
  claims.
- Whether tests adequately cover `SS-TC-016` and the protected boundaries.
