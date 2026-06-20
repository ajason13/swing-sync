# SS-009 Claude Final Implementation Focused Re-Review 3 Prompt

Use this prompt in Claude Chat for the final narrow confirmation requested in
Claude's second focused final re-review.

```text
You are Claude acting as the adversarial final implementation auditor for Swing
Sync story SS-009.

This prompt responds only to the remaining non-code-defect documentation point
from your prior review.

Prior result:
- Verdict: FAIL only pending explicit confirmation of B11/N13.
- You retracted B10.
- You confirmed C1's structural fix is sound: the fallback is gone,
  throw-on-invariant-violation is correctly defensive-only, and side-selecting
  functions now emit `UNDECLARED_HANDEDNESS` at the source.
- You found no concrete code blocker.
- You requested explicit confirmation that `calculateSpineAngle` intentionally
  relies on standalone `validateHandedness` because it does not side-select and
  `signedHorizontal` has no undefined/error path to emit from.

Codex confirmation:

Yes, `calculateSpineAngle`'s standalone `validateHandedness` call is an
intentional accepted asymmetry. Unlike shoulder angle, lead arm plane, and
lead/trail knee flex, spine angle does not map lead/trail sides through
`sideIndex`, `leadSide`, or `trailSide`. Its handedness dependency is the sign
normalization inside `signedHorizontal`, which has no index lookup or undefined
return path where a warning could be emitted structurally. Therefore
`validateHandedness` is the correct warning source for spine angle, and
`finalize` still forces `unavailable`/`value: null` whenever that warning is
present.

Applied N13 comment:

```ts
export function calculateSpineAngle(input: GeometryMetricInput): GeometryMetricResult {
  const collector = new WarningCollector();
  // Spine angle does not side-select; validate handedness before signedHorizontal can default.
  validateHandedness(input, collector);
  validateMirroring(input, collector);

  const leftShoulder = getNormalizedPoint(input, landmarkIndex.leftShoulder, collector);
  const rightShoulder = getNormalizedPoint(input, landmarkIndex.rightShoulder, collector);
  const leftHip = getNormalizedPoint(input, landmarkIndex.leftHip, collector);
  const rightHip = getNormalizedPoint(input, landmarkIndex.rightHip, collector);
  const value =
    leftShoulder && rightShoulder && leftHip && rightHip
      ? spineAngle(input, leftShoulder, rightShoulder, leftHip, rightHip, collector)
      : null;
  return finalize(value, collector);
}
```

Focused verification after the comment:

```bash
npm run test:unit -- geometry-metrics
# 1 file, 25 tests passed

git diff --check
# passed
```

Previously passed after the C1 fix:

```bash
npm run test:unit
# 8 files, 76 tests passed

npm run build
npm run compliance:verify
npm run safety:verify
npm run privacy:verify
git diff --check
# all passed
```

Question for Claude:
Does this explicit confirmation and comment close B11/N13, leaving no remaining
SS-009 final-audit blockers? Return PASS only if SS-009 is ready for PR
preparation.
```
