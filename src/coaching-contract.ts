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
  | "LIMITED_EVIDENCE_REQUIRES_LIMITED_STATUS"
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
  readonly limitedPhaseIds: readonly PhaseId[];
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
  "LIMITED_EVIDENCE_REQUIRES_LIMITED_STATUS",
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
  const limited = new Set<PhaseId>();
  const reviewRequired = new Set<PhaseId>();
  const allPhaseIds = phaseDefinitions.map((phase) => phase.id);

  if (content.warnings.includes("PHASE_REVIEW_REQUIRED")) {
    allPhaseIds.forEach((phaseId) => reviewRequired.add(phaseId));
  }

  if (content.warnings.includes("NO_KEYFRAMES_SELECTED") && content.warnings.includes("METRICS_UNAVAILABLE")) {
    allPhaseIds.forEach((phaseId) => unavailable.add(phaseId));
  } else {
    for (const phaseId of allPhaseIds) {
      const keyframeEvidence = keyframeEvidenceStatus(content, phaseId);
      const measuredMetric = hasMeasuredMetricEvidence(content, phaseId);
      if (keyframeEvidence === "none" && !measuredMetric) {
        unavailable.add(phaseId);
      } else if (keyframeEvidence !== "rendered" || !measuredMetric) {
        limited.add(phaseId);
      }
    }
  }

  return {
    unavailablePhaseIds: allPhaseIds.filter((phaseId) => unavailable.has(phaseId)),
    limitedPhaseIds: allPhaseIds.filter((phaseId) => limited.has(phaseId)),
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
    return;
  }

  if (context.limitedPhaseIds.includes(phaseId) && evidenceStatus === "supported") {
    errors.add("LIMITED_EVIDENCE_REQUIRES_LIMITED_STATUS");
  }
}

function keyframeEvidenceStatus(content: SwingCardContent, phaseId: PhaseId): "none" | "partial" | "rendered" {
  let hasPartial = false;
  for (const keyframe of content.keyframes) {
    if (keyframe.phaseId !== phaseId || !keyframe.preview || !keyframe.overlay) continue;
    if (keyframe.overlay.status === "rendered") return "rendered";
    if (keyframe.overlay.status === "partial") hasPartial = true;
  }
  return hasPartial ? "partial" : "none";
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
