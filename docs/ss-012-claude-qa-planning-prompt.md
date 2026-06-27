> **Superseded: do not paste this prompt.** Claude completed this review with a
> FAIL result. Use `docs/ss-012-claude-qa-rereview-prompt.md` for the focused
> re-review of the B1-B6 specification response.

Role: You are the lead adversarial QA planner for Swing Sync.
Stage: Pre-implementation QA planning for sensitive story `SS-012 Design
multimodal coaching prompt and response schema`.

## Current State

Repository: `https://github.com/ajason13/swing-sync`
Branch: `ss-012-coach-prompt`
Task status in Notion: `2. QA Planning (Claude)`. Codex completed
research/spec drafting under the 2026-06-26 LLM-team routing update while
preserving the board's literal status labels for compatibility.

SS-012 acceptance criteria:

- Prompt uses frames, metrics, confidence, and safety constraints.
- Response schema separates observations, likely causes, drills, cautions, and
  next focus.
- Prompt refuses medical diagnosis and overconfident biomechanical claims.
- Includes adversarial prompt tests.

Dedicated test case: `SS-TC-016`.

## Relevant Project Boundaries

- Raw swing video is local-first and must not be uploaded by default.
- Remote sharing requires separate explicit opt-in and is not in SS-012 scope.
- Do not add provider SDKs, API calls, API keys, server config, telemetry,
  remote logging, cloud storage, model assets, workers, public serving, or new
  dependencies.
- Do not make medical, injury, rehabilitation, professional coaching,
  guaranteed correctness, guaranteed safety, guaranteed privacy, guaranteed
  deletion, anonymity, legal, or compliance claims.
- User-facing and AI-coaching output must remain educational only.
- Browser-chat prompts must be self-contained because Claude Chat does not have
  filesystem or GitHub access by default.

## Proposed Contract Summary

SS-012 will create a zero-dependency TypeScript prompt and response contract.
Allowed prompt evidence is limited to approved Swing Card inputs: selected
annotated keyframes, bounded metric summaries, confidence states, limitation
notes, and Swing Card warning codes. Disallowed evidence includes raw video,
raw landmarks, coordinates, timestamps, filenames, media dimensions, object
URLs, user identifiers, provider keys, provider destination URLs, telemetry, or
hidden metadata.

The response schema is versioned and must separate:

- observations;
- likely causes;
- drills;
- cautions; and
- next focus.

Each item should carry a phase identifier, bounded evidence status, and bounded
text. Validation should reject unknown top-level keys, wrong schema versions,
missing required sections, unsafe text, raw payload dumps, and attempts to turn
unavailable or review-required evidence into supported coaching claims.

Prompt generation must instruct the model to use only card evidence; avoid
guessing missing, low-evidence, unavailable, limited, or review-required
values; avoid medical diagnosis, pain triage, rehabilitation, aggressive
movement prescriptions, guaranteed injury prevention, guaranteed performance
improvement, and qualified-professional replacement; and avoid privacy,
anonymity, deletion, legal, compliance, provider-retention, or provider-training
guarantees.

Observability is intentionally unchanged. SS-012 should add no logs,
analytics, telemetry, traces, remote diagnostics, storage writes, console
payload dumps, provider calls, or persistent debug artifacts.

## Candidate Artifacts

- `docs/ss-012-research-disposition.md`
- `docs/ss-012-preimplementation-spec.md`
- `src/coaching-contract.ts`
- `src/coaching-prompt.ts`
- `test/unit/coaching-prompt.test.ts`

Implementation must not start until QA planning passes or blockers are resolved
and re-reviewed.

## Full Current File Contents

The following are the exact current planning artifacts to review.

### `docs/ss-012-research-disposition.md`

````markdown
# SS-012 Research and Recommendation Disposition

Status: **Codex-owned specification research for `SS-012 Design multimodal
coaching prompt and response schema`.**

Check date: 2026-06-27.

## Inputs Reviewed

- Notion task `SS-012 Design multimodal coaching prompt and response schema`.
- `docs/privacy-architecture.md`
- `docs/safety-terms.md`
- `docs/licensing.md`
- `docs/models-licensing.md`
- `docs/ss-011-preimplementation-spec.md`
- `src/swing-card-contract.ts`
- `src/swing-card-generator.ts`
- `test/unit/swing-card-generator.test.ts`

No new external provider, pricing, SDK, model, medical, legal, or regulatory
claim is adopted in SS-012. Because the accepted scope can be specified from
existing project policy and current local contracts, this note records internal
source checks rather than live provider research. If implementation expands to
provider-specific behavior, connected API calls, SDKs, model assets, pricing,
retention, or training-use claims, fresh primary-source provider review is
required before implementation.

## Disposition

| Recommendation | Decision | Rationale |
| --- | --- | --- |
| Build on the existing SS-011 manual Swing Card prompt instead of replacing it with provider-specific instructions. | Adopt | SS-012 acceptance is prompt/schema design. Provider selection and connected API behavior belong to SS-013 or later and require separate consent, terms, privacy, and licensing review. |
| Require structured output sections for observations, likely causes, drills, cautions, and next focus. | Adopt | This directly maps to acceptance criteria and keeps model output auditable. |
| Treat missing, low-confidence, review-required, or unavailable evidence as schema-level constraints. | Adopt | Existing SS-011 prompt already says not to guess missing values. SS-012 should make that behavior machine-checkable. |
| Include adversarial prompt tests for medical diagnosis, rehabilitation, prompt injection, fabricated metrics, and overconfident claims. | Adopt | SS-002 and `docs/safety-terms.md` explicitly require future AI-coaching adversarial tests. |
| Add automatic upload, remote model calls, provider SDKs, keys, cloud storage, telemetry, or model selection while designing the prompt. | Reject | These are outside SS-012 and conflict with local-first and explicit-opt-in boundaries unless separately reviewed. |
| Claim the prompt guarantees safe, accurate, private, anonymous, compliant, or medically appropriate output. | Reject | Existing safety and privacy policies prohibit absolute safety, privacy, anonymity, deletion, legal, compliance, medical, and correctness claims. |
| Add a runtime output filter or classifier as the primary safety control. | Defer | Defense-in-depth filters may be useful later, but SS-012 can satisfy acceptance with deterministic prompt/schema contracts and tests. Runtime model integration is not in scope. |
| Add new dependencies for schema validation. | Defer | The repo currently uses hand-authored TypeScript contracts and zero-dependency validation patterns. A dependency needs separate license/bundle review and is not required for the spec. |

## Sensitivity Classification

SS-012 is safety-, AI-coaching-, model-provider-adjacent, export-adjacent, and
user-facing-copy sensitive. Implementation remains blocked until Claude QA
planning returns PASS or all blocking findings are resolved and re-reviewed.
````

### `docs/ss-012-preimplementation-spec.md`

````markdown
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
export type CoachingResponseSchemaVersion = "0.1.0";

export type CoachingEvidenceStatus =
  | "supported"
  | "limited"
  | "unavailable"
  | "review-required";

export interface CoachingResponseItem {
  readonly phaseId: string;
  readonly evidenceStatus: CoachingEvidenceStatus;
  readonly text: string;
}

export interface CoachingResponse {
  readonly schemaVersion: CoachingResponseSchemaVersion;
  readonly observations: readonly CoachingResponseItem[];
  readonly likelyCauses: readonly CoachingResponseItem[];
  readonly drills: readonly CoachingResponseItem[];
  readonly cautions: readonly CoachingResponseItem[];
  readonly nextFocus: readonly CoachingResponseItem[];
}
```

Codex may revise names during implementation if the final contract remains
bounded, versioned, and acceptance-aligned.

Validation rules:

- Accept only exact `schemaVersion: "0.1.0"`.
- Require all five top-level sections.
- Reject unknown top-level keys.
- Each item must include a bounded phase identifier, evidence status, and text.
- Empty sections are allowed when evidence is unavailable, but section keys must
  still exist.
- Text must be bounded in length and must not contain raw JSON payload dumps,
  coordinates, hidden identifiers, provider claims, medical diagnosis, pain
  triage, rehabilitation plans, aggressive movement prescriptions, or absolute
  safety/privacy/legal/compliance claims.
- Unavailable or review-required evidence must not be converted into
  supported coaching claims.

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
  or provider-training-use guarantees; and
- state that sharing a downloaded card with another service is the user's
  separate action and that the other service's terms and privacy practices
  apply.

The prompt must not name or require a specific provider in SS-012.

## Fail-Closed Behavior

- Prompt generation with missing Swing Card content may still return a prompt,
  but it must include explicit limited-evidence constraints.
- Response validation must reject malformed, overbroad, unsafe, or unknown-key
  output rather than silently accepting it.
- Rejected output must produce stable local error or warning codes suitable for
  UI handling without logging sensitive prompt or response contents.

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
- prompt rejects medical diagnosis, pain triage, rehabilitation, aggressive
  movement, overconfident biomechanics, guaranteed correctness, and privacy or
  anonymity guarantees;
- schema accepts a minimal valid educational response;
- schema rejects unknown top-level keys, wrong version, missing sections,
  unsafe section text, fabricated supported evidence from unavailable inputs,
  and raw-coordinate or raw-payload dumps;
- adversarial cases for prompt injection and unsafe medical/coaching requests;
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
````

## Requested Review

Please adversarially review the proposed SS-012 specification before
implementation. Attack assumptions and identify blockers.

Output required:

- PASS or FAIL verdict.
- Blockers ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for whether Codex may move SS-012 to
  `3. In Development (ChatGPT)` after resolving any findings.

Focus especially on:

- fail-open prompt or schema behavior;
- unsafe medical, pain, rehabilitation, or aggressive movement advice;
- overconfident biomechanics or fabricated metrics;
- insufficient handling of low-confidence, missing, unavailable, or
  review-required evidence;
- prompt-injection resistance expectations that are realistic and testable;
- privacy leaks through prompt text, response text, validation errors, logs, or
  hidden metadata;
- accidental provider-specific or remote API scope;
- whether `SS-TC-016` and the proposed unit tests cover acceptance criteria and
  protected boundaries.
