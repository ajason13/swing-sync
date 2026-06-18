# SS-007 Research Disposition

Status: **Gemini response dispositioned and Claude first QA FAIL addressed.
Implementation remains blocked pending focused Claude QA re-review PASS.**

Gemini proposed the GolfDB eight-event vocabulary, pose-derived posture costs,
dynamic-programming alignment, numeric phase/run confidence, synthetic pose
fixtures, a manual timeline, and a metric-readiness gate. Gemini's conditional
GO is research input, not implementation authority.

## Primary-Source And Repository Checks

Checked on 2026-06-13:

- GolfDB defines the ordered events Address, Toe-up, Mid-backswing, Top,
  Mid-downswing, Impact, Mid-follow-through, and Finish. It also states that
  definitions can be subjective, precise Impact was rarely captured in
  real-time 30 fps samples, and annotators chose the closest frame:
  https://arxiv.org/abs/1903.06528
- GolfDB uses dense RGB video sequences and temporal context. It states that
  Address and Top cannot generally be identified from a single frame and that
  Mid-backswing and Mid-downswing look similar. Its baseline consumes sequence
  windows of 32 or 64 frames, not eight evenly spaced pose samples:
  https://arxiv.org/abs/1903.06528
- GolfDB includes face-on, down-the-line, and other views. It does not establish
  Gemini's waist/chest camera-height, distance, clothing, lighting, or
  face-on-only ranges as validated SS-007 thresholds.
- The official MediaPipe guide documents normalized image coordinates, world
  coordinates, 33 landmarks, configured confidence thresholds, and a default
  maximum of one pose. It does not state that landmark `visibility` is phase
  confidence or coordinate accuracy:
  https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker
- The repository configures `numPoses: 1`; it exposes no person bounding boxes
  or multi-person selection contract. Gemini's proposed closest-person
  filtering is unavailable.
- The repository preserves complete normalized/world landmark arrays. A
  downstream detector may derive a subset, but must not alter the protected
  source result.
- The SS-006 input contains up to eight ordered samples. Normal videos produce
  exactly eight. If eight ordered phases must each use a unique ordered sample,
  the only possible mapping is phase index `i` to sample index `i`; no cost
  function or dynamic program can select a different valid mapping.
- Under the same unique one-to-one ordering rule, manual phase-to-sample
  correction is impossible. A meaningful correction requires repeated sample
  assignments, relaxed ordering, fewer required phases, or more than eight
  candidate samples. Each changes a blocking product contract.
- The approved browser fixture is a static synthetic address pose and
  explicitly is not phase-detection evidence. Gemini supplied no validated
  moving side-on fixture or calibration evidence.

## Adopt

- Use the GolfDB event vocabulary and order as the candidate MVP terminology:
  `address`, `toe-up`, `mid-backswing`, `top`, `mid-downswing`, `impact`,
  `mid-follow-through`, and `finish`.
- Describe these as ordered event labels, not guaranteed physical truth or
  professional-coaching terminology.
- Keep automatic output provisional and preserve it separately from any user
  correction.
- Bind phase state and every correction to the active SS-006 `runGeneration`.
- Restrict any correction to existing active SS-006 samples in SS-007.
- Keep metric generation out of scope. SS-007 may expose only a readiness
  boolean for a future separately reviewed metric consumer.
- Fail closed on malformed input, insufficient pose evidence, ambiguity, stale
  results, stale corrections, cancellation, retry, and supersession.
- Use deterministic programmatic `PoseFrameResult` fixtures for contract tests,
  with project-authored Apache-2.0 provenance.
- Keep all phase labels, warnings, confidence/evidence, and corrections local,
  sensitive, volatile, non-persistent, and non-transmitted.
- Provide accessible keyboard and touch review controls with educational,
  non-medical, non-diagnostic, non-guaranteed wording.

## Revise Before Adoption

- **P-System claims:** retain GolfDB event names but remove the unsupported
  assertion that the mapping is an absolute GolfDB/P-System standard. The
  candidate display name for `mid-follow-through` remains "Mid-follow-through,"
  not Gemini's changed "Release."
- **Side-on definition:** use the explicit term "face-on side view" for the
  candidate supported view. The user must declare handedness and confirm the
  view; pose-only inference must not guess them. Exact camera distance, height,
  clothing, lighting, and angle tolerances are guidance, not enforceable
  detector thresholds without validation.
- **Landmarks:** derived calculations may inspect shoulders, elbows, wrists,
  hips, knees, ankles, and feet when available. Do not claim a restricted
  subset improves performance, discard the complete source arrays, or treat
  hands as club/ball proxies.
- **Visibility:** treat low/non-finite visibility as insufficient evidence. Do
  not linearly interpolate occluded landmarks or equate visibility with spatial
  accuracy.
- **Coordinates:** reject non-finite required values and degenerate derived
  denominators. Do not reject normalized coordinates solely because they fall
  outside `[0,1]`; out-of-frame coordinates instead lower evidence and require
  review.
- **Handedness/mirroring:** a declared handedness may inform deterministic
  normalization, but horizontal mirroring does not prove lead-side correctness
  or support mirrored-source videos. Mirrored-source orientation requires an
  explicit user input or review state.
- **Input validation:** require exactly one returned pose per accepted sample
  and exactly eight active samples for the current candidate. The configured
  `numPoses: 1` cannot detect or isolate the closest of multiple people.
- **Algorithm:** replace Gemini's unsupported cost formulas and DP claims with
  an unresolved detector-algorithm gate. Any heuristic must be specified,
  independently justified, and empirically validated before it can emit
  sufficient confidence.
- **Confidence:** replace invented `0.50`/`0.75`, `tanh`, variance, and
  15-millisecond thresholds with an evidence-status contract. Numeric phase or
  run confidence is prohibited until calibration evidence and threshold
  rationale are approved.
- **Readiness:** user confirmation is required for every run. No automatic
  confidence level may unlock future metric readiness.
- **Ambiguity:** do not fabricate a sequential fallback, duplicate the final
  frame for missing phases, clip coordinates into plausibility, or discard the
  automatic record. Preserve warnings and require correction/review.
- **Lifecycle:** release phase state when the owning SS-006 outputs are
  released, cancelled, retried, superseded, or closed. Do not claim instant
  garbage collection or app-uninstallation erasure.
- **Observability:** keep existing local sanitized lifecycle/error state.
  Do not add performance timings, phase states, confidence, warnings,
  corrections, timestamps, landmarks, or derived quantities to diagnostics.

## Defer

- Dense/resampled analysis, more than eight candidate frames, club/ball
  tracking, automatic view classification, automatic handedness detection, and
  mirrored-video detection.
- Numeric phase/run confidence, automatic acceptance thresholds, broad
  accuracy claims, and biomechanical validation until representative approved
  data and calibration exist.
- P-System translation, biomechanical metrics, X-Factor, Crunch Factor,
  coaching recommendations, overlays, export, persistence, and remote review.
- A second phase-detection worker. Eight-sample deterministic pure computation
  is not shown to threaten UI responsiveness; introducing or reusing a worker
  requires a concrete need and protected-boundary design.
- Real-person or third-party moving fixtures pending provenance, license,
  consent, privacy, and representativeness review.

## Reject

- Reject Gemini's conditional GO and its claim that all blocking questions are
  resolved.
- Reject the unsupported posture-cost formulas, numeric confidence formulas,
  thresholds, static-variance threshold, jitter clipping, and interpolation.
- Reject claims of scale or perspective invariance from spine normalization.
- Reject using pose-only wrists, knees, hips, or body rotation to identify
  exact club/ball Impact.
- Reject mapping missing phases to the final frame, sequential zero-confidence
  fallback, or any fabricated complete assignment.
- Reject unlocking metric readiness automatically at `runConfidence >= 0.75`.
- Reject `observedSeekTimestampMs`, local detection timestamps, or correction
  timestamps in phase state. Use active generation and ordered sample indices;
  protected observed seek times remain excluded.
- Reject closest-person filtering because the current worker requests one pose
  and exposes no person bounding boxes.
- Reject new React/store/worker architecture that does not match the current
  TypeScript/Vite application and has no demonstrated need.
- Reject claims of zero leakage, guaranteed 60 FPS, fixed latency, exact
  cleanup timing, garbage collection, or offline operation.
- Reject a Notion "volatile state database"; runtime-sensitive state must not
  be written to Notion or any database.
- Reject Gemini's illustrative tests as executable or completed verification.

## Blocking Decision Record

| Question | Status | Codex decision |
| --- | --- | --- |
| Eight phase vocabulary | Candidate resolved | Use GolfDB event names/order with terminology and accuracy caveats. |
| Phase-to-sample allocation | Revised for focused review | Each phase uses one sample; assignments are nondecreasing; repeated sample references are permitted. |
| Deterministic proposal | Revised for focused review | Valid input receives an identity initial review layout only; it is never described as detected/confident/accurate. |
| Confidence contract | Revised for focused review | Remove numeric confidence and sufficient-confidence acceptance; every valid run is `review-required`. |
| Supported common side-on input | Candidate resolved | Explicit user-declared face-on side view, handedness, and mirrored orientation; complete centered single swing; limitations shown. Exact physical ranges remain unsupported. |
| Ambiguity and malformed input | Candidate resolved | Fail closed to review-required/unsupported state; never fabricate assignments. |
| Manual correction surface | Revised for focused review | User assigns each ordered phase an active sample index; nondecreasing repeated references are valid. |
| Correction invariants | Revised for focused review | Active generation, in-range references, all phases exactly once, nondecreasing indices, and explicit confirmation. |
| Provenance | Candidate resolved | Separate immutable automatic proposal and correction record. |
| Stale rejection and cleanup | Candidate resolved | Bind to active generation; clear with owning SS-006 output lifecycle. |
| Fixtures | Revised for focused review | SS-007 accepts deterministic programmatic pose fixtures; moving side-on browser fixtures are deferred to existing `SS-014`. |
| Accurate tracker coverage | Resolved for planning | Dedicated `SS-TC-011`; API-consent `SS-TC-007` remains unrelated. |

## Implementation Gate

Claude's first QA review returned FAIL and directed the B1-B3 revisions now
recorded in `docs/ss-007-preimplementation-spec.md`. Implementation must not
begin until focused Claude QA re-review confirms closure and returns PASS.
