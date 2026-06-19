# SS-009 Claude Final Implementation Audit Prompt

Use this prompt in Claude Chat for the final implementation audit. Claude does
not have filesystem or GitHub access, so this prompt is self-contained.

## Role

You are Claude acting as the adversarial final implementation auditor for Swing
Sync story `SS-009 Implement joint angle and coordinate normalization
utilities`.

Stage: **final implementation audit**.

Prior QA planning status:

- Initial QA planning returned FAIL with B1-B5.
- Focused QA re-review returned FAIL with B6.
- Second focused QA re-review returned PASS. B1-B6 are closed, and Codex was
  authorized to implement from `docs/ss-009-preimplementation-spec.md`.

## Required Verdict Format

Return:

- `PASS` or `FAIL`;
- blockers ordered by severity;
- non-blocking recommendations;
- missing tests or edge cases;
- explicit sign-off status.

Treat blockers as implementation gates, not suggestions.

## Story Acceptance Criteria

- Computes shoulder angle, spine angle, knee flex, arm plane, hip rotation
  proxy, and head displacement.
- Handles left/right handedness.
- Unit tests cover synthetic coordinates and edge cases.
- Invalid or missing landmarks return warnings, not fabricated metrics.

## Protected Boundaries

- Raw swing video remains local-first and is not uploaded by default.
- Landmarks, movement patterns, phase labels, and metric primitives are
  sensitive derived data.
- SS-009 must not add export, persistence, telemetry, remote logging, cloud
  storage, network calls, SDK/model/provider changes, dependencies, workers, or
  public serving.
- SS-009 must not expand `src/metric-contract.ts` or
  `docs/schemas/swing-metric-payload-v0.1.0.schema.json`.
- SS-009 must not create `SwingMetricPayload` objects.
- SS-009 must not make medical, injury-prevention, professional coaching,
  calibration, benchmark, CaddieSet equivalence, guaranteed correctness, or
  absolute privacy/deletion claims.
- Implementation must be clean-room TypeScript using common vector geometry.

## Implemented Files

Implemented:

- `src/geometry-metrics.ts`
- `test/unit/geometry-metrics.test.ts`

Supporting docs created/updated:

- `docs/ss-009-research-disposition.md`
- `docs/ss-009-preimplementation-spec.md`
- `docs/ss-009-claude-qa-response.md`
- `docs/ss-009-claude-qa-rereview-prompt.md`
- `docs/ss-009-claude-audit-prompt.md`
- `CONTEXT.md`

No dependencies, runtime UI, worker, schema, export, persistence, telemetry,
remote logging, network, SDK/model/provider, or public-serving changes were
made.

Observability decision: intentionally unchanged. No logs, diagnostics,
analytics, traces, telemetry, storage writes, or debug payloads were added.

## Source Implementation

```ts
import type { PoseLandmark } from "./pose-contract";

export const MIN_LANDMARK_VISIBILITY = 0.5;
export const GEOMETRY_EPSILON = 1e-6;

export type GeometryWarningCode =
  | "MISSING_LANDMARK"
  | "NON_FINITE_COORDINATE"
  | "LOW_VISIBILITY"
  | "ZERO_LENGTH_VECTOR"
  | "UNDECLARED_HANDEDNESS"
  | "UNDECLARED_MIRRORING"
  | "MISSING_BASELINE"
  | "INSUFFICIENT_BASELINE";

export type GeometryMetricStatus = "measured" | "unavailable";
export type GeometryHandedness = "undeclared" | "right" | "left";
export type GeometryMirroring = "undeclared" | "yes" | "no";

export interface GeometryMetricInput {
  landmarks: readonly PoseLandmark[];
  worldLandmarks: readonly PoseLandmark[];
  baselineLandmarks?: readonly PoseLandmark[];
  handedness: GeometryHandedness;
  mirrored: GeometryMirroring;
}

export interface GeometryMetricResult {
  status: GeometryMetricStatus;
  value: number | null;
  /** Any warning forces an unavailable result; measured results have no warnings. */
  warnings: readonly GeometryWarningCode[];
}
```

Public functions implemented:

```ts
calculateShoulderAngle(input)
calculateSpineAngle(input)
calculateLeadKneeFlex(input)
calculateTrailKneeFlex(input)
calculateLeadArmPlane(input)
calculateHipRotationProxy(input)
calculateHeadDisplacement(input)
```

Key implementation behavior:

- `WarningCollector` returns warning codes in canonical order:
  `UNDECLARED_HANDEDNESS`, `UNDECLARED_MIRRORING`, `MISSING_BASELINE`,
  `MISSING_LANDMARK`, `NON_FINITE_COORDINATE`, `LOW_VISIBILITY`,
  `ZERO_LENGTH_VECTOR`, `INSUFFICIENT_BASELINE`.
- `finalize` returns `measured` only when value is finite and warnings are
  empty. Any warning forces `unavailable` and `value: null`.
- Missing indexes, `null`, non-object entries, and missing/non-number fields
  produce `MISSING_LANDMARK`.
- Numeric `NaN`, `Infinity`, and `-Infinity` produce
  `NON_FINITE_COORDINATE`.
- Visibility below `0.5` produces `LOW_VISIBILITY`; exactly `0.5` is accepted.
- Vector and denominator checks use `<= GEOMETRY_EPSILON`.
- Ratio primitives use raw normalized distances and ignore mirroring/
  handedness sign normalization.
- Knee flex uses world landmarks with clamped cosine before `acos`.
- Inputs are not mutated.

## Test Coverage Implemented

`test/unit/geometry-metrics.test.ts` includes 21 tests covering:

- level shoulder angle;
- signed shoulder projection and mirrored angle behavior;
- warning-only undeclared handedness/mirroring returning unavailable/null;
- cumulative warning order;
- vertical and leaned spine angle;
- lead/trail knee flex;
- left-handed lead-side selection;
- corruption in unused arrays not affecting knee flex;
- near-parallel knee vectors with clamped cosine behavior;
- lead arm plane relative angle and wrapping;
- hip rotation proxy ratio;
- mirrored declaration not changing ratio primitive results or warnings;
- missing baseline, baseline low visibility, and insufficient baseline;
- head displacement ratio;
- malformed present landmark entries, missing indexes, and non-finite numeric
  fields;
- exact visibility threshold acceptance;
- exactly-at-epsilon zero-length rejection; and
- no mutation of arrays or nested landmark objects.

## Verification Evidence

Passed:

```bash
npm run test:unit -- geometry-metrics
# 1 file, 21 tests passed

npm run test:unit
# 8 files, 72 tests passed

npm run build
# Vite build passed; notices generated under dist only

npm run compliance:verify
# Compliance, pose assets, safety, and privacy verification passed

npm run safety:verify
# Passed

npm run privacy:verify
# Passed

git diff --check
# Passed
```

## Audit Focus

Attack the implementation for:

- any path that returns `measured` with a warning;
- any path that returns a finite value for malformed, missing, low-visibility,
  undeclared, zero-length, missing-baseline, or insufficient-baseline inputs;
- warning order mismatches;
- unsafe dereferencing of malformed landmarks;
- baseline visibility not being checked for ratio primitives;
- mirroring/handedness accidentally affecting magnitude ratios;
- left/right lead/trail side selection mistakes;
- coordinate-space mixing beyond the approved scope;
- mutation of input arrays or nested landmarks;
- accidental schema expansion or payload creation;
- logging/storage/network/telemetry/export regressions; and
- missing tests that would allow the above regressions.

Return PASS only if SS-009 is ready for PR preparation after Codex addresses no
further blockers.
