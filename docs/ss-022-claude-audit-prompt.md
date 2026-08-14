# SS-022 Claude Final Audit Handoff

Role and stage: Adversarial reviewer; normal final audit.

Task/candidate: SS-022 Accuracy Validation Protocol, documentation candidate on
`ss-022-accuracy-validation-protocol` based on `16abc6b`. No commit has been
created. Review the complete changed-file manifest below; only `CONTEXT.md` is
coordination state. No runtime, fixture, media, dependency, asset, or provider
file changes are in scope.

Manifest:

- `docs/ss-022-research-notes.md`
- `docs/ss-022-research-disposition.md`
- `docs/ss-022-preimplementation-spec.md`
- `docs/accuracy-validation-protocol.md`
- `CONTEXT.md` (kickoff only; branch/status/protected-worktree record)

Acceptance and protected boundaries:

1. Define a real-world future-study protocol for pose visibility/camera,
   phase-label review, and metric reasonableness across representative videos.
2. Require consent, provenance, privacy, licensing, and fixture controls for
   future real-person/third-party validation media.
3. Use bounded pass/fail/inconclusive language; no correctness, biomechanics,
   medical, professional coaching, safety, performance, privacy, deletion,
   legal, or compliance claims.
4. Distinguish validation-ready output from exploratory output.
5. Recommend staged sample sizes and scenario coverage.

Raw video remains local-first; remote transfer needs separate explicit opt-in
and approval. Existing synthetic/mannequin fixtures prove plumbing/regressions
only. Current phase output is a review-required uniform eight-sample layout,
not detection; Impact is `IMPACT_NOT_CONFIRMED`. Four metric payload names are
contract slots, not calculated/validated outputs. Geometry primitives are not
payload metrics or biomechanical measures. No real media may be committed.

Evidence summary: protocol requires supported versus challenge cohorts; stable
face-on input/whole-body visibility records; blinded dual phase reviewers and
adjudication; per-phase error/missingness; reference-method agreement rather
than correlation; future pre-registered margins and participant-aware counts;
media approval/provenance requirements; readiness table; dry run 8–12 clips,
pilot 24/12 people, future validation 96/24 people. Research cites MediaPipe,
GolfDB, and Bland–Altman and separates open evidence gaps.

Verification (Node 22.22.3): `npm run docs:verify`, `fixture:verify`,
`safety:verify`, `privacy:verify`, `compliance:verify`, and `git diff --check`
all PASS. Observability intentionally unchanged.

Audit for unsupported wording, scope leakage, missing consent/provenance
requirements, insufficient readiness distinctions, misleading sample claims,
and whether evidence supports each acceptance criterion. Return within 1,800
bytes: candidate; exactly `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`; numbered
blockers; non-blocking/future notes; missing evidence; and next gate. Only PASS
permits PR preparation; it is never qualified-human release clearance.
