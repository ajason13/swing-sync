# SS-022 Research Notes

Checked 2026-08-13. This research defines a future validation protocol; it is
not evidence that Swing Sync is accurate on real golf swings.

## Repository facts

- `src/frame-processing.ts` selects no more than eight timestamps across a
  clip. It is not dense motion analysis.
- `src/phase-review.ts` maps the eight reviewed samples to Address, Toe-up,
  Mid-backswing, Top, Mid-downswing, Impact, Mid-follow-through, and Finish.
  It always requires review and reports `IMPACT_NOT_CONFIRMED`; it does not
  detect phases automatically.
- `src/metric-contract.ts` defines four payload slots: address stance ratio,
  top shoulder-line angle, impact spine-line angle, and finish balance-line
  angle. They are contract entries, not current calculated or calibrated
  outputs. Their confidence vocabulary includes `not-calibrated` and
  `low-evidence`.
- `src/geometry-metrics.ts` contains seven isolated educational primitives.
  They are synthetic-coordinate utilities, not mapped payload outputs or
  validated biomechanical measures.
- `docs/fixture-policy.md` and `docs/limitations.md` limit synthetic and
  mannequin fixtures to plumbing and regressions. Real-person and third-party
  media are blocked by default under `scripts/fixture-policy-data.mjs`.
- `docs/privacy-architecture.md`, `docs/safety-terms.md`, and
  `docs/licensing.md` require local-first raw video handling and reject privacy,
  medical, coaching, performance, and unreviewed-media claims.

## Primary sources

- MediaPipe's [Pose Landmarker Web guide](https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js)
  documents 33 normalized and world landmarks and describes visibility as a
  likelihood of being visible. It does not establish golf-specific spatial
  accuracy; SS-022 therefore uses visibility as an evaluability observation,
  not a coordinate-accuracy score.
- [GolfDB](https://openaccess.thecvf.com/content_CVPRW_2019/papers/CVSports/McNally_GolfDB_A_Video_Database_for_Golf_Swing_Sequencing_CVPRW_2019_paper.pdf)
  describes reviewed eight-event swing labels and notes that impact may be
  represented by the nearest captured frame. It supports adjudication and
  tolerance reporting, not equivalence to Swing Sync's uniform samples.
- [Bland and Altman](https://pubmed.ncbi.nlm.nih.gov/2868172/) explains why
  correlation alone is not agreement evidence for paired measurements. Paired
  metric studies should report bias and error distributions, with participant
  clustering respected.

## Open evidence gaps

No approved reference system, qualified reviewer definition, numeric acceptance
margin, statistically powered sample size, or golf-specific accuracy evidence
exists. Camera geometry limits and the participant/accessibility matrix require
future qualified-human and study-specific decisions.
