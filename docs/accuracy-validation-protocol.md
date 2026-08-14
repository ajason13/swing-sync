# Future Accuracy Validation Protocol

## Purpose and boundary

This protocol specifies how a future, separately approved study may evaluate
Swing Sync pose availability, phase-review behavior, and candidate metric
methods on real-world swing video. It does not validate the current MVP.
Synthetic landmarks and the mannequin video validate plumbing and regressions,
not real-world pose, phase, metric, biomechanics, safety, coaching, medical,
or performance outcomes.

Run an immutable app/model/configuration version locally and record that version
with each study result. Do not collect or commit media under this Task.

## Eligibility and camera record

The supported-input cohort contains one complete, trimmed, face-on swing per
clip with confirmed setup and declared handedness and mirror state. Before a
run, record camera stability, approximate distance/height, resolution, frame
rate, lighting, body-in-frame margin, cropping, occlusion, clothing, background
complexity, device/browser, and exclusions. Require a stable camera, usable
lighting, and substantially visible whole body; record club visibility when it
affects review. These are eligibility observations, not guarantees.

Keep a separate challenge cohort for unsupported or adverse inputs: non-face-on
or oblique view, multiple people, incomplete swing, camera movement, crop,
occlusion, blur, dim or backlit scenes, and clutter. Challenge results test
warnings, withholding, and review behavior—not accuracy for those inputs.

## Pose and phase review

For every requested and observed sample, record pose count, 33-landmark
completeness, required-landmark availability, visibility values, overlay state,
warnings, and the reviewer’s assessability decision. Visibility is a
renderability/evaluability signal; it is not a calibrated coordinate-accuracy
score.

At least two independent reviewers label phase event frames before seeing Swing
Sync’s proposal. Record their disagreement and adjudicate it with the reason.
Compare the reviewed proposal with the adjudicated label using pre-registered
absolute frame/time error and tolerance, reporting each phase, denominator,
missing event, and unreviewable clip. Report Impact separately: the current
output explicitly says `IMPACT_NOT_CONFIRMED`; do not force a label.

The current eight labels are Address, Toe-up, Mid-backswing, Top,
Mid-downswing, Impact, Mid-follow-through, and Finish. They are a
review-required eight-sample layout, not automatic phase detection.

## Metric reasonableness

For an approved future reference method, pair each candidate geometry value with
the independently reviewed/reference value. Report signed bias, median/mean
absolute error, dispersion, missingness, warnings, and scenario strata; use
participant-aware analysis and do not treat repeated swings from one person as
independent. Correlation alone is insufficient evidence of agreement.

“Reasonable” means agreement with a defined study reference under the
pre-registered condition. It does not mean biomechanical truth or coaching
correctness.

## Media, consent, privacy, licensing, and provenance gate

Before any real-person media is used, a separate reviewed task must approve a
purpose-limited consent/release, participant or guardian authority, data
classes, face/audio/background treatment, reviewer/access controls, retention
plan, withdrawal handling and its limits, and privacy review. Use opaque study
IDs and data minimization. Copyright permission is not consent or privacy
clearance.

For third-party media, record source URL and date, owner/licensor, exact
license/terms version, rights to download/process/annotate/derive/share/publish,
attribution/notices, provenance chain, transformations, integrity hash, privacy
or publicity review, and maintainer approval. Commercial, restricted, unknown,
or unlicensed sources remain blocked without a future written decision.

Raw video stays local-first and must not be committed to Git. Remote transfer
remains prohibited unless a separate feature supplies explicit user opt-in and
approved destination, terms, and privacy review. A withdrawal request does not
justify a deletion guarantee.

## Readiness classification

| Output | SS-022 classification |
| --- | --- |
| Landmark availability/visibility, overlay state, supported-input eligibility, warnings, and review correction provenance | Ready for future validation on supported face-on inputs only |
| Eight phase proposals | Ready for review-workflow validation; not automatic-detection validation |
| Impact proposal | Exploratory; separately report `IMPACT_NOT_CONFIRMED` |
| Seven geometry primitives | Future method-design candidates; require an independent reference and margins |
| Four metric payload slots | Exploratory/not validation-ready: they are contract slots, not calculated validated outputs |
| Biomechanical, medical, safety, coaching, improvement, or unsupported-view inference | Not ready |

## Outcomes and reporting language

Pre-register endpoint-specific margins, tolerances, exclusions, and analysis
rules before a future study. Use only: “protocol completed / not completed,”
“met / did not meet the pre-registered study criterion for this sample and
scenario,” or “insufficient or inconclusive evidence.” Always include tested
version, scenario, denominators, missingness, uncertainty, and limitations.

Do not translate a pass into guaranteed correctness, biomechanical proof,
medical usefulness, safety, professional coaching correctness, performance
improvement, privacy, deletion, legal, or compliance claims.

## Staged sample and scenario matrix

| Stage | Minimum operational recommendation | Purpose |
| --- | --- | --- |
| Dry run | 8–12 clips | Exercise consent, review, recording, and failure handling only |
| Pilot | 24 clips from at least 12 people | Estimate feasibility and variance; no accuracy claim |
| Future validation | 96 clips from at least 24 people | Support a separately powered, endpoint-specific design |

Use a pre-registered pairwise-balanced matrix across handedness, mirror state,
indoor/outdoor setting, lighting, background complexity, clothing/occlusion,
tempo, camera distance/height, resolution/frame rate, and supported
device/browser strata. Repeated clips improve within-person coverage but do not
increase the participant count. These recommendations are operational, not a
power calculation or representative-accuracy guarantee.
