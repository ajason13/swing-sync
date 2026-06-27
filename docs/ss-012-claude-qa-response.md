# SS-012 Claude QA Planning Response

Status: **Response to Claude QA planning FAIL.**

Claude returned FAIL with six specification blockers. Codex accepts all six as
valid and revised `docs/ss-012-preimplementation-spec.md` before
implementation.

| ID | Claude finding | Codex response |
| --- | --- | --- |
| B1 | `text` field bound was unspecified. | Addressed. The spec now requires exported `maxCoachingResponseItemTextLength = 280` and validation rejection with `ITEM_TEXT_TOO_LONG`. |
| B2 | Section arrays were unbounded. | Addressed. The spec now requires exported `maxCoachingResponseItemsPerSection = 4` and validation rejection with `ITEM_ARRAY_TOO_LONG`. |
| B3 | `phaseId` was an unconstrained string. | Addressed. The spec now requires `phaseId: PhaseId` from `src/phase-review.ts` and enumerates the eight allowed phase IDs. Invalid values return `INVALID_PHASE_ID`. |
| B4 | Unavailable/review-required evidence could still carry free-form substantive claims. | Addressed. The spec now requires exact exported templates for `unavailable` and `review-required` text, and validation returns `UNAVAILABLE_TEXT_NOT_TEMPLATE`, `REVIEW_REQUIRED_TEXT_NOT_TEMPLATE`, or `FABRICATED_SUPPORTED_EVIDENCE` when status conflicts with validation context. |
| B5 | Stable validation error taxonomy was missing. | Addressed. The spec now requires exhaustive exported `CoachingValidationErrorCode` values and a deterministic `CoachingValidationResult` shape. |
| B6 | Unsafe text detection mechanism was unspecified. | Addressed. The spec now requires exported reviewable `coachingProhibitedTextPatterns` data with deterministic regular-expression checks for medical, rehabilitation, aggressive movement, guarantee, privacy/legal/compliance, hidden payload-key, raw JSON, and coordinate patterns. |

Secondary note: accepted. The spec now explicitly states that SS-012 satisfies
the deferred SS-006 `observedSeekTimestampMs` export-exclusion item by
disallowing raw timestamps in prompt inputs and response text, validation
errors, logs, persistence, and network behavior.

## Verification

- Documentation/spec-only response; no runtime implementation started.
- `git diff --check` must pass after this response and the focused re-review
  prompt are updated.

## Next Gate

Submit `docs/ss-012-claude-qa-rereview-prompt.md` to Claude for focused
pre-implementation QA re-review. Keep SS-012 at `2. QA Planning (Claude)` and
do not move to implementation until Claude returns PASS or all blockers are
resolved and re-reviewed.
