# SS-014 Claude QA Planning Response

Status: **FAIL. B1-B8 accepted by Codex and revised in
`docs/ss-014-preimplementation-spec.md`.**

Claude reviewed the SS-014 planning artifacts and found the spec strong but not
yet sufficiently fail-closed or unambiguous for implementation.

## Blocking Findings

| Finding | Claude claim | Codex response |
| --- | --- | --- |
| B1 | No default-deny rule for unenumerated fixture classes. | Accepted. The spec now requires missing, misspelled, or unlisted classes to fail with `FIXTURE_CLASS_UNKNOWN`, while matched blocked classes fail with `FIXTURE_CLASS_BLOCKED`. |
| B2 | Maintainer approval was specified as a free-text field, not a structural control. | Accepted. The spec now states the validator only checks approval-field presence; real approval is a PR-review gate, using CODEOWNERS/branch protection where available or documented PR-review limitation plus explicit maintainer approval otherwise. |
| B3 | Fixture class definitions risked drifting between prose and validator code. | Accepted. The spec now requires `scripts/fixture-policy-data.mjs` as the single canonical source for classes, decisions, required fields, error codes, and thresholds. |
| B4 | Size-budget thresholds were ambiguous. | Accepted. The spec now includes exact size threshold rows, decisions, and error-code mapping. |
| B5 | Three candidate error codes lacked corresponding tests. | Accepted. The spec now maps every validation error code to explicit negative tests, including hash-missing, size-missing, and approval-required cases. |
| B6 | AI-generation-tool terms review was not a distinct required provenance field. | Accepted. The spec now requires AI-generation tool name, version/model when available, terms URL, terms review date, input-source statement, and maintainer approval for generated output-rights decisions; missing metadata fails with `FIXTURE_AI_TERMS_MISSING`. |
| B7 | The validation contract did not restate no-new-dependency constraints. | Accepted. The spec now requires built-in Node APIs and existing repo tooling only for fixture validation, and stops implementation for separate dependency/licensing review if a new dependency appears necessary. |
| B8 | Validator wiring used non-committal "likely integrated" language. | Accepted. The spec now requires `npm run fixture:verify` wired into `npm run compliance:verify`. |

## Non-Blocking Recommendations

Claude also recommended clarifying fixture-license scope, future synthetic-media
style limits, documentation-vs-validator test separation, protected-boundary
test reuse, and confirming the 2026-06-26 LLM-team routing update. Codex
addressed the documentation-vs-validator split in the revised test plan and
preserved the remaining items as review context for implementation/final audit.

## Current Gate

Claude focused re-review confirmed B1-B8 are closed and returned a narrower
FAIL with NB1-NB3. Codex accepted NB1-NB3 and revised
`docs/ss-014-preimplementation-spec.md`.

## Focused Re-Review Findings

| Finding | Claude claim | Codex response |
| --- | --- | --- |
| NB1 | The plan proved docs match `scripts/fixture-policy-data.mjs`, but did not prove validator behavior reads from the canonical source. | Accepted. The spec now requires validator-to-canonical-source consistency tests in addition to doc-to-source consistency tests. |
| NB2 | AI-generation detection could depend on free-text parsing. | Accepted. The spec now requires a controlled `generationMethod` value from the canonical source and blocks `unknown` by default. |
| NB3 | General maintainer approval and AI-generated output-rights approval were not clearly the same or separate fields. | Accepted. The spec now defines distinct `maintainerApproval` and `aiGeneratedOutputRightsApproval` fields. AI-generated fixtures requiring general approval must include both. |

Implementation remains blocked. Use the latest focused re-review prompt for
NB1-NB3 closure.

## Focused NB1-NB3 Re-Review Finding

Claude confirmed NB1-NB3 are closed and returned FAIL with one narrow blocker:

| Finding | Claude claim | Codex response |
| --- | --- | --- |
| NB4 | `generationMethod` had no value for first-party real-person recordings, leaving `maintainer-recorded-personal-media` unrepresentable without mislabeling it as `third-party-source` or `unknown`. | Accepted. The spec now adds `recorded-real-person`, maps `maintainer-recorded-personal-media` to it, and states this remains blocked in SS-014 until a future consent/release workflow is separately approved. |

Codex also incorporated Claude's non-blocking clarifications: prefer behavior-
driving validator-to-source tests over static import-only checks; map missing
`aiGeneratedOutputRightsApproval` to `FIXTURE_AI_TERMS_MISSING`; and test that
non-AI `generationMethod` values do not trigger AI-terms errors.

Implementation remains blocked pending final NB4 confirmation.
