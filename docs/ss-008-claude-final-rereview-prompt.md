# SS-008 Claude Focused Final Re-Review Prompt

Paste this into Claude Chat. Claude does not have filesystem, Notion, or GitHub
access; all required context is embedded here.

## Role

You are the lead adversarial implementation auditor for Swing Sync.

Stage: focused final implementation re-review.

Scope: SS-008 final-audit blockers B5-B7 only.

Return:

- PASS/FAIL verdict.
- Whether B5-B7 are closed.
- Any new blockers introduced by the fixes.
- Missing tests or edge cases that remain blocking.
- Explicit sign-off status for whether Codex may prepare the PR.

## Prior Final Audit FAIL Summary

You returned FAIL with three blockers:

- **B5:** `impact-not-directly-observed` was allowed as a free-floating
  limitation code without metric-name coupling.
- **B6:** `caddieSetEquivalence` needed itemized rejection tests for omitted,
  wrong string, empty string, and non-string values.
- **B7:** Audit input did not clearly prove the impact metric appears in a
  missing or low-evidence fixture.

## Applied Fixes

### B5 Response

Codex chose the stricter route: limitation codes are now constrained by metric
name.

TypeScript validator:

- `impact-not-directly-observed` is valid only on
  `impact-spine-line-angle`.
- The code is rejected on `address-stance-ratio`,
  `top-shoulder-line-angle`, and `finish-balance-line-angle`.

JSON Schema:

- Each metric-name `if`/`then` branch now also constrains `limitationNotes`.
- Only the `impact-spine-line-angle` branch permits
  `impact-not-directly-observed`.

Spec:

- `docs/ss-008-preimplementation-spec.md` now documents metric-specific
  limitation-code mapping and requires rejection of metric/limitation mismatch.

Test:

- `test/unit/metric-contract.test.ts` rejects
  `impact-not-directly-observed` on `address-stance-ratio`.
- The same test accepts `impact-not-directly-observed` on
  `impact-spine-line-angle`.

### B6 Response

The test suite now explicitly rejects these `caddieSetEquivalence` cases:

- omitted key;
- `"equivalent"`;
- `"partial"`;
- empty string;
- boolean `false`.

The only accepted value remains exact string `"not-equivalent"`.

### B7 Response

`test/fixtures/metrics/low-confidence-payload.json` contains:

```json
{
  "metricName": "impact-spine-line-angle",
  "value": {
    "status": "measured",
    "numericValue": 9.75
  },
  "units": "degrees",
  "phaseId": "impact",
  "handedness": "right",
  "confidence": {
    "kind": "low-evidence"
  },
  "limitationNotes": ["pose-evidence-low", "impact-not-directly-observed"]
}
```

`test/unit/metric-contract.test.ts` now has an explicit assertion that this
fixture contains that impact low-evidence metric and validates.

## Verification After Fixes

Run after B5-B7 fixes:

```bash
npm run test:unit -- metric-contract
npm run test:unit
git diff --check
```

Results:

- focused metric tests: PASS, `test/unit/metric-contract.test.ts`
  passed 11 tests
- full unit tests: PASS, 7 files passed and 51 tests passed
- diff check: PASS, no whitespace errors reported

## Scope Reminder

SS-008 remains schema/test-only:

- no metric calculation;
- no runtime UI changes;
- no export;
- no persistence;
- no telemetry or remote logging;
- no remote review;
- no dependencies;
- no model/provider/SDK/asset changes;
- no public schema serving.

## Focused Audit Questions

Please focus only on:

- whether B5 is closed by metric-specific limitation-code mapping;
- whether B6 is closed by itemized `caddieSetEquivalence` rejection coverage;
- whether B7 is closed by explicit low-evidence impact fixture coverage;
- whether the JSON Schema, TypeScript validator, tests, and spec now agree on
  the limitation-code mapping; and
- whether Codex may prepare the PR after this focused re-review.

Return PASS only if PR preparation may start. If FAIL, list only the minimum
blocking fixes and focused tests required.
