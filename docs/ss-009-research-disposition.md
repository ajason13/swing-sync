# SS-009 Research Disposition

Status: **Gemini Chat Deep Research response dispositioned. Implementation
remains blocked pending Claude QA planning PASS.**

Gemini recommended a local TypeScript geometry layer, no new dependencies,
synthetic fixtures, finite-coordinate validation, structured warnings, and
clean-room vector formulas for the requested metric primitives. The response is
research input, not implementation authority.

## Primary-Source And Repository Checks

Checked on 2026-06-19:

- MediaPipe Pose Landmarker for Web outputs body pose landmarks in image
  coordinates and 3D world coordinates:
  https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js
- MediaPipe normalized `Landmarks` use `x` and `y` normalized by image width
  and height, `z` with hip-midpoint origin where smaller values are closer to
  the camera and roughly `x` scale, and `visibility` as likelihood of being
  visible:
  https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js#handle_and_display_results
- MediaPipe `WorldLandmarks` use real-world 3D coordinates in meters with the
  hip midpoint as origin and include `visibility`; the current official Web
  guide does not define enough axis-orientation semantics for Swing Sync to
  claim a target-line canonical 3D frame:
  https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js#handle_and_display_results
- `src/pose-contract.ts` intentionally preserves only `x`, `y`, `z`, and
  `visibility`; it does not preserve MediaPipe `presence`.
- `src/phase-review.ts` requires exactly one normalized pose and one world pose
  with 33 finite landmarks for each of the eight samples, plus explicit
  face-on, handedness, mirrored, and setup declarations before future metrics
  are ready.
- `src/metric-contract.ts` currently allows only four SS-008 metric names:
  `address-stance-ratio`, `top-shoulder-line-angle`,
  `impact-spine-line-angle`, and `finish-balance-line-angle`.
- `docs/privacy-architecture.md` treats landmarks, movement patterns, phase
  labels, and metrics as sensitive derived data. Export, persistence, telemetry,
  remote logging, cloud storage, and remote review remain unapproved.
- `docs/safety-terms.md` requires educational-only boundaries and prohibits
  medical, injury-prevention, professional-coaching, diagnosis, rehabilitation,
  guaranteed correctness, and aggressive movement-prescription claims.
- `docs/licensing.md` prefers clean-room reimplementation and prohibits copying
  reference repository code, datasets, model assets, media, formulas, or
  identifiers without separate review.

## Adopt

- Implement SS-009 as zero-dependency local TypeScript geometry utilities and
  focused Vitest coverage.
- Use project-authored synthetic coordinates only; no live video, external
  fixtures, CaddieSet data, media, code, formulas, or identifiers.
- Use common vector geometry for angles: `atan2` for projected line angles,
  dot-product angle with clamped cosine for joint angles, and scale-normalized
  displacement ratios.
- Validate required landmarks before calculation and return structured
  warnings or unavailable results rather than fabricating numeric values.
- Treat non-finite coordinates, missing required landmarks, incomplete arrays,
  undeclared handedness, undeclared mirrored orientation, unsupported view, and
  missing baseline frames as fail-closed conditions.
- Use a small epsilon for zero-length vector and denominator checks to avoid
  division by zero and unstable trigonometric inputs.
- Use side-aware lead/trail mapping from declared handedness.
- Keep utilities pure and stateless. Inputs must not be mutated.
- Keep observability unchanged. SS-009 needs no console logs, telemetry,
  traces, analytics, storage writes, or remote diagnostics.
- Record low-visibility landmark evidence as a warning. Do not treat
  MediaPipe visibility as calibrated metric confidence or coordinate accuracy.

## Revise Before Adoption

- **Coordinate system claims:** Gemini's canonical 3D right-handed target-line
  transformation is too strong. The official Web guide documents normalized
  coordinate semantics and world-coordinate origin/units, but not enough
  target-line or world-axis semantics to approve a universal 3D target frame in
  SS-009. Use explicit 2D projection helpers and limited world-vector helpers
  instead.
- **World axis orientation:** Gemini claimed world `y` points downward and
  world `z` mirroring behavior. Treat those as unverified for this story unless
  a primary source is added. Do not encode z-axis mirroring as normative.
- **Metric contract mapping:** Gemini proposed schema identifiers such as
  `shoulder_tilt`, `spine_lateral_tilt`, `lead_knee_flexion`,
  `trail_knee_flexion`, `lead_arm_angle`, `hip_rotation_proxy`, and
  `head_displacement`. These are not valid SS-008 metric names. SS-009 should
  return internal primitive names and warnings, not emit SS-008 payloads or
  expand the schema.
- **Payload generation:** Gemini's `TS-05` payload mapper is out of scope.
  SS-009 may expose primitives that future stories can map into payloads, but
  must not create new payload schema entries in this story.
- **Warning handling:** Gemini's table inconsistently says low visibility
  suppresses metrics and also says to proceed with low-evidence confidence.
  SS-009 should use a deterministic rule: missing/invalid/low-visibility
  required landmarks make the affected primitive unavailable with warnings.
- **Warning vocabulary:** Prefer stable string literal warning codes over
  numeric identifiers. Avoid logging-oriented terms because logging is not
  approved.
- **Visibility threshold:** Reusing `0.5` is acceptable as a default evidence
  threshold because it matches existing MediaPipe pose thresholds, but the spec
  must state it is a local evidence gate, not a calibrated accuracy threshold.
- **Privacy wording:** Replace "destroyed immediately" and "eliminates" privacy
  claims with scoped volatile-state and no-approved-persistence language.
- **Logging:** Gemini's console diagnostic example includes wall-clock time and
  context labels. SS-009 should add no logging and should not output metric
  values, warning payloads, landmarks, timestamps, phase labels, handedness, or
  identifiers to console/storage/network.
- **Ranges and success metrics:** Gemini's proposed biological ranges, runtime
  targets, and "100% accuracy" success metrics are unsupported and out of
  scope. Tests should assert deterministic math on synthetic coordinates only.
- **Test tolerance:** `1e-5` is likely unnecessarily strict for general
  trigonometric calculations. Use explicit tolerances per test, defaulting to a
  pragmatic `1e-4` degree or ratio tolerance unless a simpler exact value is
  asserted.
- **File placement:** Use existing repo style: source under `src/` and tests
  under `test/unit/`, for example `src/geometry-metrics.ts` and
  `test/unit/geometry-metrics.test.ts`, not `src/utils/__tests__/`.

## Defer

- Any expansion of `src/metric-contract.ts` or the SS-008 JSON Schema.
- Mapping geometry primitives into Swing metric payloads.
- Runtime UI, overlays, coaching copy, user-facing thresholds, drill
  recommendations, or corrective instructions.
- Calibration, representative validation, benchmark claims, biomechanical
  correctness claims, medical or injury-prevention claims, and professional
  coaching claims.
- Automatic view, handedness, mirrored-orientation, phase, club, ball, shaft,
  impact, or camera inference.
- Dense resampling, temporal smoothing, 3D avatar rigging, body-size
  estimation, local analytics history, export, persistence, remote review,
  telemetry, remote logging, cloud storage, service-worker changes, new
  dependencies, SDK/model/provider changes, workers, or public serving.

## Reject

- Reject treating Gemini's raw report as implementation-ready.
- Reject the canonical target-line 3D transformation matrix as normative for
  SS-009.
- Reject claims that world landmarks provide precise biomechanical accuracy or
  that 3D calculations are unaffected by camera distance, zoom, model
  inference error, browser behavior, or single-camera depth uncertainty.
- Reject logging warning payloads or any diagnostics containing timestamps,
  metric names/values, phase labels, handedness, landmarks, media
  characteristics, identifiers, or local wall/performance times.
- Reject "destroyed immediately", "eliminates privacy concerns", and similar
  absolute privacy claims.
- Reject copying CaddieSet formulas, code, data, fixtures, model outputs,
  media, or identifiers.
- Reject new dependencies or external math libraries.
- Reject Gemini's proposed schema identifiers and range bounds as current
  contract changes.

## Candidate Direction For Claude QA

Codex should draft SS-009 around a narrow geometry primitive API:

- `src/geometry-metrics.ts`
- `test/unit/geometry-metrics.test.ts`

The module should expose deterministic pure functions over pose-landmark-like
arrays and return either a finite value or an unavailable result with bounded
warning codes. It should not emit `SwingMetricPayload` objects.

Approved primitive outputs for the candidate spec:

- `shoulder-angle-degrees`
- `spine-angle-degrees`
- `lead-knee-flex-degrees`
- `trail-knee-flex-degrees`
- `lead-arm-plane-degrees`
- `hip-rotation-proxy-ratio`
- `head-displacement-ratio`

All outputs are local educational primitives, not validated biomechanical
measurements.

## Implementation Gate

Implementation must not begin until Claude QA planning reviews
`docs/ss-009-preimplementation-spec.md`, confirms the revised contract closes
the risks above, and returns PASS or all blocking findings are addressed.
