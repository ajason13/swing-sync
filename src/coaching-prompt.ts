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
