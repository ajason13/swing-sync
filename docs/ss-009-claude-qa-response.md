# SS-009 Claude QA Planning Response

Status: **Claude QA planning and first focused re-review returned FAIL.
B1-B6 are addressed. Second focused Claude QA re-review returned PASS, clearing
SS-009 for implementation.**

Claude reviewed the pre-implementation specification and found five blockers.
Codex accepted all five as valid specification gaps.

## B1 - `lead-arm-plane-degrees` references undefined landmarks

Finding: the arm-plane primitive did not precisely enumerate the exact wrist,
shoulder vector, and relative reference frame.

Response: fixed in `docs/ss-009-preimplementation-spec.md`.

- The primitive now requires normalized lead shoulder, normalized trail
  shoulder, and normalized lead wrist.
- The formula is explicit:
  `leadArm = leadWrist2d - leadShoulder2d` and
  `shoulderReference = leadShoulder2d - trailShoulder2d`.
- The returned angle is the projected lead-arm angle minus the projected
  shoulder-reference angle, wrapped to `[-180, 180]`.

## B2 - Ratio primitives lack fail-closed denominator guards

Finding: hip rotation proxy and head displacement could return finite but
absurd ratios if denominator checks use strict zero instead of epsilon.

Response: fixed in `docs/ss-009-preimplementation-spec.md`.

- Added a central warning-applicability table.
- Added a central denominator/vector threshold table.
- Hip rotation baseline hip width and head-displacement baseline shoulder
  width must use `<= GEOMETRY_EPSILON` and return
  `INSUFFICIENT_BASELINE`.
- Angle vectors and knee vectors must use `<= GEOMETRY_EPSILON` and return
  `ZERO_LENGTH_VECTOR`.

## B3 - Mirroring sign rule unclear for magnitude primitives

Finding: magnitude ratios could be incorrectly sign-normalized, producing
negative or undefined ratio semantics.

Response: fixed in `docs/ss-009-preimplementation-spec.md`.

- Magnitude primitives now explicitly use raw normalized Euclidean distances
  only.
- `xTarget`, `mirrorSign`, and `handednessSign` are prohibited for hip rotation
  proxy and head displacement ratio.
- The test matrix now requires mirrored declarations not to change those ratio
  magnitudes.

## B4 - Missing landmarks did not distinguish malformed entries

Finding: correct-length arrays with missing fields could cause uncaught
runtime exceptions or inconsistent warning codes.

Response: fixed in `docs/ss-009-preimplementation-spec.md`.

- Missing required indexes return `MISSING_LANDMARK`.
- Present array entries that are not objects, are `null`, or lack numeric `x`,
  `y`, `z`, or `visibility` fields return `MISSING_LANDMARK`.
- Present numeric but non-finite values return `NON_FINITE_COORDINATE`.
- The test matrix now requires coverage for both missing indexes and present
  entries with missing or undefined fields.

## B5 - Warning priority and short-circuit order unstated

Finding: deterministic warning arrays require a canonical collection strategy
and order.

Response: fixed in `docs/ss-009-preimplementation-spec.md`.

- Validation is now cumulative.
- A canonical warning order is specified:
  `UNDECLARED_HANDEDNESS`, `UNDECLARED_MIRRORING`, `MISSING_BASELINE`,
  `MISSING_LANDMARK`, `NON_FINITE_COORDINATE`, `LOW_VISIBILITY`,
  `ZERO_LENGTH_VECTOR`, `INSUFFICIENT_BASELINE`.
- Later checks may be skipped only when evaluating them would require
  dereferencing missing or malformed data.
- The test matrix now requires undeclared fixtures to assert cumulative warning
  order.

## Non-Blocking Recommendations

- N1 accepted: the spec now defines seven public calculation functions.
- N2 accepted: absent `baselineLandmarks` now maps to `MISSING_BASELINE`;
  present but insufficient baseline denominators map to
  `INSUFFICIENT_BASELINE`.
- N3 accepted: the input contract now states arrays are assumed to use the
  same MediaPipe 33-point pose topology as `PoseFrameResult`.

## Additional Test Coverage Added To Spec

The test matrix now includes:

- malformed present landmark entries;
- present numeric non-finite fields;
- exactly-at-threshold visibility;
- exactly-at-epsilon vector lengths;
- cosine clamping before `acos`;
- mirrored declarations not changing ratio magnitudes;
- unused-array corruption not affecting primitives that do not consume that
  array;
- cumulative warning order; and
- nested landmark object immutability.

## Verification

No implementation exists yet, so no runtime tests were run.

Documentation verification:

```bash
git diff --check
```

Result: passed after B1-B5 response.

## Focused Re-Review Result

Claude focused re-review closed B1, B3, B4, and B5. B2's denominator threshold
table was accepted, but Claude identified a new cross-cutting blocker, B6.

### B6 - Warning/status contract and baseline visibility scope

Finding: cumulative warnings introduced an ambiguity about whether a primitive
with a warning but technically computable geometry could still return a finite
measured value. Claude also identified that baseline-landmark visibility scope
for hip rotation proxy and head displacement was not explicit.

Response: fixed in `docs/ss-009-preimplementation-spec.md`.

- The return contract now states that `measured` requires a finite value and an
  empty warning array.
- Any non-empty `warnings` array now forces `status: "unavailable"` and
  `value: null`, regardless of whether arithmetic could have technically
  produced a finite number.
- Baseline landmarks consumed by hip rotation proxy and head displacement now
  use the same malformed, non-finite, and `MIN_LANDMARK_VISIBILITY` validation
  as active landmarks.
- Low-visibility baseline landmarks now produce `LOW_VISIBILITY` and force
  `unavailable`.
- The test matrix now requires warning-only failures to return unavailable/null
  and baseline low-visibility landmarks to return `LOW_VISIBILITY`.

## Second Focused Re-Review Result

Claude second focused QA re-review returned PASS.

- B6a is closed: any warning now forces `unavailable` and `value: null`.
- B6b is closed: baseline landmarks use the same visibility and malformed/
  non-finite validation as active landmarks.
- No new blockers were introduced by the B6 fixes.
- Claude signed off that Codex may move SS-009 to
  `3. In Development (ChatGPT)` and implement from
  `docs/ss-009-preimplementation-spec.md`.
