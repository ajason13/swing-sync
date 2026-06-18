# SS-007 Claude QA Response

Claude's first pre-implementation QA review returned **FAIL**. Codex verified
and accepted all three blocking findings. Implementation remains blocked
pending focused Claude QA re-review PASS.

## Findings Addressed

- **B1 allocation policy:** adopted one sample reference per phase with
  nondecreasing assignments. Multiple phases may share a sample. Every phase
  remains required and ordered.
- **B2 unsatisfiable confidence acceptance:** removed sufficient-confidence,
  numeric-confidence, and automatic-acceptance behavior. Valid input receives a
  deterministic identity initial review layout and always requires explicit
  user review/confirmation.
- **B3 moving side-on fixture gap:** revised SS-007 fixture acceptance to
  deterministic project-authored programmatic pose fixtures. Moving side-on
  browser fixture policy/provenance is deferred to existing `SS-014` and is not
  claimed as SS-007 coverage.
- Added an explicit `undeclared` fail-closed input state for view, handedness,
  and mirrored orientation.
- Removed unreachable `insufficient-evidence`; approved evidence states are
  `unsupported-input` and `review-required`.
- Added immediate invalidation/clearing when owning SS-006 outputs or generation
  are released/superseded.
- Refined `SS-TC-011` with shared-index acceptance, decreasing-index rejection,
  undeclared-input rejection, stale-index cleanup, no-confidence wording, and
  the `SS-014` fixture deferral.

## Verification

- `npm run build`
- `npm run compliance:verify`
- `git diff --check`

## Gate

Keep SS-007 at `2. QA Planning (Claude)`. Do not begin implementation until
Claude focused QA re-review confirms B1-B3 closure and returns PASS.

