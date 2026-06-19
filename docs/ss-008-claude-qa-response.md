# SS-008 Claude QA Planning Response

Status: **Claude QA planning returned FAIL on 2026-06-18. B1-B4 are accepted
and addressed in `docs/ss-008-preimplementation-spec.md`. Focused re-review is
required before implementation.**

## Findings Addressed

### B1 - Status / Confidence Pairing

Claude found that the candidate allowed incoherent combinations such as
`measured` plus `unavailable` confidence or `missing` plus `not-calibrated`.

Response:

- Added an explicit status/confidence compatibility table.
- `measured` allows only `not-calibrated` or `low-evidence`.
- `missing`, `unsupported`, and `not-reviewed` require `unavailable`.
- Added validator and test requirements for mismatched-pair rejection.

### B2 - CaddieSet Disclaimer Enforcement

Claude found that `caddieset-not-equivalent` as an optional per-metric
limitation was the wrong enforcement layer and could be omitted from otherwise
valid payloads.

Response:

- Added required payload-level `caddieSetEquivalence: "not-equivalent"`.
- Clarified that this is the mandatory schema-level disclaimer mechanism.
- Removed `caddieset-not-equivalent` from allowed limitation codes so there is
  only one CaddieSet disclaimer path.
- Added validator and fixture requirements for the required constant field.

### B3 - Recursive Prohibited-Key Rejection

Claude found that recursive sensitive-key rejection had no exact key list or
matching strategy, creating unverifiable acceptance coverage.

Response:

- Added a case-sensitive exact-key prohibited list.
- Explicitly included `observedSeekTimestampMs` and `runGeneration`.
- Added required recursive nested-key rejection tests.
- Clarified that the list is conservative and testable, not a guarantee against
  every possible synonym.

### B4 - Exact Version Validation

Claude found version handling was not explicit enough.

Response:

- Added exact literal version validation: only `"0.1.0"` is accepted.
- No SemVer range parsing or compatibility inference is approved.
- Added rejection tests for off-version payloads such as `0.1.1` and `1.0.0`.

## Additional Missing Tests Added

Claude requested five edge cases. The spec now requires:

- finite measured `0` accepted;
- explicit `NaN`, `Infinity`, and `-Infinity` rejection;
- empty `limitationNotes: []` rejection;
- duplicate limitation-code rejection;
- case/whitespace-sensitive enum rejection.

## Verification

- `git diff --check` will be run after this response and focused re-review
  prompt are created.
- No implementation tests were run because implementation remains blocked at
  QA planning.

## Next Gate

Use `docs/ss-008-claude-qa-rereview-prompt.md` for focused Claude re-review.
Do not move to `3. In Development (ChatGPT)` until Claude returns PASS or all
remaining blockers are resolved.
