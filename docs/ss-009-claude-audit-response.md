# SS-009 Claude Final Audit Response

Status: **Claude final implementation audit returned FAIL due to missing source
content in the audit prompt. B7 is accepted and addressed with a source-inclusive
focused final re-review prompt. Implementation remains blocked pending Claude
PASS.**

Claude could not verify the implementation from a summary and test counts alone.
Codex accepts this as a valid process blocker for a sensitive story.

## B7 - No source code was provided

Finding: the final audit prompt summarized `src/geometry-metrics.ts` and
`test/unit/geometry-metrics.test.ts` rather than including the actual file
contents, so Claude could not perform direct line-by-line audit.

Response:

- Created `docs/ss-009-claude-final-rereview-prompt.md`.
- The new prompt embeds the complete current contents of:
  - `src/geometry-metrics.ts`
  - `test/unit/geometry-metrics.test.ts`
- The new prompt asks Claude to verify B7 plus conditional checks C1-C4 and the
  named missing-test confirmations.

## Additional Test Hardening

Before creating the source-inclusive prompt, Codex added focused coverage for
the conditional concerns Claude listed:

- active low visibility returns `LOW_VISIBILITY`;
- unused-array corruption does not affect lead/trail knee flex;
- single warning-only failures across all public primitives return
  `unavailable` and `value: null`;
- ratio primitives already assert mirrored/unmirrored results and warnings are
  identical.

Targeted verification after hardening:

```bash
npm run test:unit -- geometry-metrics
```

Result: 24 tests passed.

## Remaining Gate

## Focused Re-Review 2 Response

Claude's source-inclusive focused final re-review closed B7 and confirmed C2,
C3, and C4, but returned FAIL on C1. The active blocker was the `finalize`
fallback that guessed `["ZERO_LENGTH_VECTOR"]` if a null or non-finite value
reached finalization with no collected warnings.

Response:

- Removed the fabricated `["ZERO_LENGTH_VECTOR"]` fallback from `finalize`.
- `finalize` now returns `unavailable` only with real collected warnings.
- If `value` is `null` or non-finite with no warnings, `finalize` throws an
  invariant error instead of guessing a diagnostic warning.
- `sideIndex`, `leadSide`, and `trailSide` now receive `WarningCollector`, and
  side-selection failure records `UNDECLARED_HANDEDNESS` at the source.
- Side-selecting primitives now route side lookup through
  `sideIndex(..., collector)` rather than depending on separate caller-level
  handedness validation.
- Added a focused cumulative-warning test for low visibility plus zero-length
  geometry, matching Claude's non-blocking N10 recommendation.

Verification after the C1 fix:

```bash
npm run test:unit -- geometry-metrics
npm run test:unit
npm run build
npm run compliance:verify
npm run safety:verify
npm run privacy:verify
git diff --check
```

Result: all passed. Geometry test file now has 25 tests; the full unit suite now
has 76 tests across 8 files.

Focused re-review prompt:
`docs/ss-009-claude-final-rereview-2-prompt.md`.

## Focused Re-Review 3 Response

Claude's second focused final re-review confirmed the C1 structural fix and
retracted the suspected B10 failure path. The remaining request was B11/N13:
explicitly confirm that `calculateSpineAngle` intentionally relies on standalone
`validateHandedness` because it does not side-select and `signedHorizontal` has
no undefined/error path where a warning can be emitted structurally.

Response:

- Confirmed this asymmetry is intentional and accepted.
- Added a code comment at `calculateSpineAngle`:
  `Spine angle does not side-select; validate handedness before signedHorizontal can default.`
- Created the narrow sign-off prompt:
  `docs/ss-009-claude-final-rereview-3-prompt.md`.

Focused verification after the comment:

```bash
npm run test:unit -- geometry-metrics
git diff --check
```

Result: both passed. Geometry test file remains at 25 tests.

SS-009 remains in `4. Final Audit (Claude)`. Do not prepare PR or mark Done
until Claude returns PASS or any further blockers are resolved.
