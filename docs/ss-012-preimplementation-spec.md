# SS-012 Pre-Implementation Specification

Status: **Blocked at `2. QA Planning (Claude)` once submitted. This
specification defines the candidate SS-012 contract and may be used only after
Claude QA planning returns PASS or blocking findings are resolved.**

## Scope

SS-012 designs a multimodal coaching prompt and response schema for educational
golf movement feedback grounded in a user-controlled Swing Card. It must use
only approved evidence from selected annotated keyframe stills, metric
summaries, confidence states, warnings, and safety/privacy constraints.

In scope:

- a zero-dependency TypeScript prompt/response contract;
- bounded prompt construction from existing Swing Card content;
- a structured response schema separating observations, likely causes, drills,
  cautions, and next focus;
- deterministic validation and warning/error semantics for malformed coaching
  responses;
- adversarial prompt and schema tests; and
- documentation of no remote API behavior in SS-012.

Out of scope:

- connected model API calls, provider SDKs, API keys, server config, remote
  sharing, cloud storage, telemetry, remote logging, public serving, model
  assets, new workers, or new dependencies;
- raw swing video upload or embedding;
- automatic upload of Swing Cards, frames, metrics, prompts, or responses;
- provider-specific pricing, retention, training-use, safety, or accuracy
  claims;
- medical diagnosis, pain triage, rehabilitation guidance, professional
  coaching replacement, guaranteed correctness, injury-prevention claims,
  guaranteed privacy, guaranteed deletion, anonymity, legal, or compliance
  claims.

## Protected Inputs

Allowed prompt inputs:

- selected annotated keyframe still references already approved for Swing Card
  export;
- bounded metric display values from `SwingMetricPayload`;
- content warning codes from `SwingCardContentWarningCode`;
- approved limitation/confidence states;
- bounded safety and privacy constraints from project docs.

Disallowed prompt inputs:

- raw swing video;
- raw landmarks, world landmarks, coordinates, timestamps, observed seek
  timestamps, filenames, media dimensions, object URLs, user identifiers, or
  hidden metadata;
- provider keys, provider model names, provider destination URLs, remote
  logging details, or telemetry payloads.

## Proposed Artifacts

Create:

- `src/coaching-contract.ts`
- `src/coaching-prompt.ts`
- `test/unit/coaching-prompt.test.ts`

Modify only if needed:

- `src/swing-card-generator.ts`
- `test/unit/swing-card-generator.test.ts`

Do not add a dependency. Do not add runtime remote behavior.

## Response Contract

`src/coaching-contract.ts` should export bounded response types:

```ts
import type { PhaseId } from "./phase-review";
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

export function buildCoachingValidationContext(content: SwingCardContent): CoachingValidationContext;
export function validateCoachingResponse(
  value: unknown,
  content: SwingCardContent
): CoachingValidationResult;
```

Codex may revise names during implementation if the final contract remains
bounded, versioned, and acceptance-aligned.

Validation rules:

- `validateCoachingResponse` must require the same `SwingCardContent` value
  used to build the coaching prompt. It must not accept caller-supplied
  `CoachingValidationContext`.
- `validateCoachingResponse` must call `buildCoachingValidationContext(content)`
  internally before validating evidence-status claims.
- `buildCoachingValidationContext` is exported for test visibility, but it is
  the only sanctioned way to produce `CoachingValidationContext`.
- Accept only exact `schemaVersion: "0.1.0"`; otherwise return
  `WRONG_SCHEMA_VERSION`.
- Require all five top-level sections.
- Reject unknown top-level keys with `UNKNOWN_TOP_LEVEL_KEY`.
- Each top-level section must be an array with no more than
  `maxCoachingResponseItemsPerSection` items. Longer arrays are
  `ITEM_ARRAY_TOO_LONG`.
- Each item must include exactly `phaseId`, `evidenceStatus`, and `text`.
- Empty sections are allowed when evidence is unavailable, but section keys must
  still exist.
- `phaseId` must be one of the existing `PhaseId` values exported from
  `src/phase-review.ts`: `address`, `toe-up`, `mid-backswing`, `top`,
  `mid-downswing`, `impact`, `mid-follow-through`, or `finish`.
- `evidenceStatus` must be one of `supported`, `limited`, `unavailable`, or
  `review-required`.
- `text` must be a string with length from 1 through
  `maxCoachingResponseItemTextLength` characters. Longer text is
  `ITEM_TEXT_TOO_LONG`.
- Text must not contain raw JSON payload dumps, coordinates, hidden
  identifiers, provider claims, medical diagnosis, pain triage, rehabilitation
  plans, aggressive movement prescriptions, or absolute
  safety/privacy/legal/compliance claims. Deterministic detection uses exported
  prohibited text patterns described below.
- Items with `evidenceStatus: "unavailable"` must use exactly
  `unavailableCoachingText`.
- Items with `evidenceStatus: "review-required"` must use exactly
  `reviewRequiredCoachingText`.
- Items for `phaseId` values listed in
  `CoachingValidationContext.unavailablePhaseIds` must not use `supported` or
  `limited`; doing so returns `FABRICATED_SUPPORTED_EVIDENCE`.
- Items for `phaseId` values listed in
  `CoachingValidationContext.limitedPhaseIds` must not use `supported`; doing
  so returns `LIMITED_EVIDENCE_REQUIRES_LIMITED_STATUS`.
- Items for `phaseId` values listed in
  `CoachingValidationContext.reviewRequiredPhaseIds` must not use `supported`
  or `limited`; doing so returns `FABRICATED_SUPPORTED_EVIDENCE`.

## Coaching Validation Context Derivation

`buildCoachingValidationContext(content)` must derive evidence state
deterministically from `SwingCardContent`; no hand-authored context object is
allowed in production validation.

Context derivation rules:

- Start from the canonical `phaseDefinitions` list in `src/phase-review.ts`.
- A phase has renderable keyframe evidence only when `content.keyframes`
  contains that `phaseId`, `preview` is defined, `overlay` is defined, and
  `overlay.status` is `rendered` or `partial`.
- A phase has measured metric evidence only when `content.metricPayload`
  contains a metric for that `phaseId` with `value.status === "measured"`.
- A phase is added to `unavailablePhaseIds` when it has neither renderable
  keyframe evidence nor measured metric evidence.
- A phase is added to `limitedPhaseIds` when it has some evidence but not full
  evidence: partial renderable keyframe evidence, renderable keyframe evidence
  without measured metric evidence, or measured metric evidence without
  renderable keyframe evidence.
- If `content.warnings` includes `NO_KEYFRAMES_SELECTED` and
  `METRICS_UNAVAILABLE`, all phases must be listed in `unavailablePhaseIds`.
- If `content.warnings` includes `PHASE_REVIEW_REQUIRED`, all phases must be
  listed in `reviewRequiredPhaseIds`.
- `reviewRequiredPhaseIds` has validation priority over
  `unavailablePhaseIds`: an item for a review-required phase must use
  `evidenceStatus: "review-required"` and exactly `reviewRequiredCoachingText`.
- A phase with partial evidence must use `limited`, not `supported`; the prompt
  must still instruct the model not to fill in missing or low-confidence
  values.

Implementation tests must prove that validation cannot be made to pass by
supplying an empty or incorrect context because no validator accepts a context
parameter. Tests must also cover context derivation from real `SwingCardContent`
fixtures for no keyframes, metrics unavailable, phase review required,
rendered keyframe evidence, partial overlay evidence, and measured metric
evidence.

## Deterministic Unsafe Text Detection

`src/coaching-contract.ts` must export reviewable prohibited text patterns as
data, not bury them only inside validation logic:

```ts
export interface CoachingProhibitedTextPattern {
  readonly code: CoachingValidationErrorCode;
  readonly pattern: RegExp;
  readonly description: string;
}

export const coachingProhibitedTextPatterns: readonly CoachingProhibitedTextPattern[] = [
  { code: "UNSAFE_TEXT_CONTENT", pattern: /\bdiagnos(?:e|is|ed|ing)\b/i, description: "medical diagnosis wording" },
  { code: "UNSAFE_TEXT_CONTENT", pattern: /\b(rehab|rehabilitation|physical therapy|treatment plan)\b/i, description: "rehabilitation or treatment wording" },
  { code: "UNSAFE_TEXT_CONTENT", pattern: /\b(play through pain|train through pain|push through pain|force your range)\b/i, description: "aggressive movement prescription" },
  { code: "UNSAFE_TEXT_CONTENT", pattern: /\b(guarantee|guaranteed|will prevent injury|prevents injury|will fix|will cure)\b/i, description: "guarantee or cure wording" },
  { code: "UNSAFE_TEXT_CONTENT", pattern: /\b(anonymous|anonymized|private by default when uploaded|guarantees privacy|guaranteed deletion|GDPR compliant|HIPAA compliant)\b/i, description: "absolute privacy/legal/compliance wording" },
  { code: "UNSAFE_TEXT_CONTENT", pattern: /\b(fileName|filename|timestampMs|observedSeekTimestampMs|requestedTimestampMs|worldLandmarks|landmarks|objectUrl|userId)\b/i, description: "hidden raw payload or identifier key" },
  { code: "UNSAFE_TEXT_CONTENT", pattern: /[{[]\s*"(schemaVersion|metrics|landmarks|worldLandmarks|timestampMs)"/i, description: "raw JSON payload dump" },
  { code: "UNSAFE_TEXT_CONTENT", pattern: /\b[xX]\s*:\s*-?\d+(?:\.\d+)?\s*,\s*[yY]\s*:\s*-?\d+(?:\.\d+)?/i, description: "raw coordinate pair" }
];
```

Codex may split or expand the exact patterns during implementation, but the
final contract must keep them exported, deterministic, and covered by tests.
The denylist is defense-in-depth for bounded generated text; it must not be
described as a complete safety guarantee.

Before pattern matching, validation must normalize item text with
`String.prototype.normalize("NFKC")`, remove zero-width characters, collapse all
Unicode whitespace runs to a single ASCII space, and trim leading/trailing
whitespace. Pattern matching is performed on that normalized text. This
normalization is a deterministic floor for adversarial testing, not a claim to
catch every homoglyph or obfuscation.

## Prompt Contract

The prompt must:

- identify the model role as an educational golf movement assistant;
- say the user may manually provide a Swing Sync Card;
- require use of only card evidence;
- require missing, unavailable, low-evidence, limited, or review-required
  inputs to remain constrained;
- require output in the response schema sections;
- prohibit medical advice, pain or injury diagnosis, rehabilitation guidance,
  aggressive movement prescriptions, guaranteed injury prevention, guaranteed
  performance improvement, and replacement for a qualified golf coach or
  qualified medical professional;
- prohibit privacy, anonymity, deletion, legal, compliance, provider-retention,
  or provider-training-use guarantees;
- state that sharing a downloaded card with another service is the user's
  separate action and that the other service's terms and privacy practices
  apply;
- require a JSON response with exact top-level keys `schemaVersion`,
  `observations`, `likelyCauses`, `drills`, `cautions`, and `nextFocus`;
- state that each response section may contain at most
  `maxCoachingResponseItemsPerSection` items and each item text may contain at
  most `maxCoachingResponseItemTextLength` characters;
- instruct unavailable and review-required items to use the exact exported
  template text rather than free-form claims.

The prompt must not name or require a specific provider in SS-012.

## Fail-Closed Behavior

- Prompt generation with missing Swing Card content may still return a prompt,
  but it must include explicit limited-evidence constraints.
- Response validation must reject malformed, overbroad, unsafe, or unknown-key
  output rather than silently accepting it.
- Rejected output must return stable local
  `CoachingValidationErrorCode` values suitable for UI handling without logging
  sensitive prompt or response contents.
- Validation may accumulate multiple error codes, but returned code order must
  be deterministic and documented in implementation tests.
- Validation errors must not include raw prompt text, response text, metrics
  JSON, frames, filenames, timestamps, identifiers, coordinates, or object
  URLs.

## SS-006 Timestamp Non-Regression

SS-012 satisfies the deferred `observedSeekTimestampMs` export-exclusion item
by listing all raw timestamps, including `observedSeekTimestampMs`, as
disallowed prompt inputs and by requiring prohibited text patterns to reject
hidden timestamp keys in responses. Implementation must not include requested
or observed seek timestamps in prompt inputs, response text, validation errors,
logs, persistence, or network behavior.

## Observability

Observability is intentionally unchanged for SS-012. The story should not add
logs, analytics, telemetry, traces, remote diagnostics, storage writes, console
payload dumps, provider calls, or persistent debug artifacts. If implementation
needs user-visible validation failure state, use stable sanitized local codes
without including prompt text, response text, metrics JSON, frames, filenames,
or identifiers.

## Test Requirements

Unit tests must cover:

- prompt includes frames/metrics/confidence/warnings/safety constraints;
- prompt requires the five response sections;
- prompt states the exact item-count, text-length, unavailable-template, and
  review-required-template constraints;
- prompt rejects medical diagnosis, pain triage, rehabilitation, aggressive
  movement, overconfident biomechanics, guaranteed correctness, and privacy or
  anonymity guarantees;
- schema accepts a minimal valid educational response;
- schema rejects unknown top-level keys, wrong version, missing sections,
  invalid section shapes, item arrays longer than
  `maxCoachingResponseItemsPerSection`, item text longer than
  `maxCoachingResponseItemTextLength`, invalid phase IDs, invalid evidence
  statuses, unavailable or review-required items that use free text, unsafe
  section text, fabricated supported evidence from unavailable or
  review-required inputs, hidden timestamp keys, and raw-coordinate or
  raw-payload dumps;
- validation requires `SwingCardContent`, derives context internally, and
  exposes no production validator that accepts caller-supplied context;
- `buildCoachingValidationContext` derives unavailable and review-required
  phases from Swing Card warnings, renderable keyframes, partial overlays, and
  measured metrics, and derives `limitedPhaseIds` for partial overlay,
  keyframe-only, and metric-only evidence;
- validation rejects `supported` claims for limited phases and accepts
  `limited` claims for the same evidence;
- validation returns only exported `CoachingValidationErrorCode` values in
  deterministic order and never includes raw response content in error
  payloads;
- prohibited text pattern data is exported and directly covered by tests;
- text normalization uses NFKC, zero-width character removal, whitespace
  collapse, and trim before prohibited-pattern matching;
- adversarial cases for prompt injection and unsafe medical/coaching requests,
  including mixed-case prohibited phrases, whitespace-padded prohibited
  phrases, zero-width character insertion, and a documented Unicode-lookalike
  limitation case;
- no provider-specific assumptions, API calls, SDKs, persistence, telemetry, or
  raw-video behavior are introduced.

Required verification before final audit:

- `npm run test:unit`
- `npm run build`
- `npm run compliance:verify`
- `npm run safety:verify`
- `npm run privacy:verify`
- `git diff --check`

Dependency checks are required if the implementation unexpectedly changes
dependencies.
