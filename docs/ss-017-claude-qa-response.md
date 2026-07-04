# SS-017 Claude QA Planning Response

Date: 2026-07-03

Stage: Pre-implementation QA planning.

Verdict: FAIL.

## Findings

Claude returned five blocking findings:

- B1: `docs/deployment.md` had no required draft/pending-review disclaimer
  even though it discusses security headers and production hosting.
- B2: `scripts/verify-docs-claims.js` lacked a dedicated prohibited-claim
  category for security-guarantee overclaims such as "secures your data",
  "prevents attacks", "hack-proof", and breach-protection claims.
- B3: The verifier-extension mechanism was underspecified and risked a
  bespoke path instead of adding the new doc to the existing shared verifier
  config model.
- B4: The verification plan did not explicitly execute the new or updated unit
  tests for docs-claim fixtures.
- B5: The spec did not prevent drift between a prose CSP description in
  `docs/deployment.md` and the actual meta CSP in `index.html`.

Claude also recommended optional future wording around legacy
`X-Frame-Options`, COOP/COEP/CORP as future considerations, illustrative
`Permissions-Policy` examples, and traceability to prior boundary stories.

## Codex Disposition

Codex accepts B1-B5 as valid blockers. The spec was revised before
implementation:

- B1 response: `docs/deployment.md` now requires a canonical draft-review
  banner and no-guarantee string, both enforced by `docs:verify` and unit
  tests.
- B2 response: the spec now requires a separate security-guarantee prohibited
  claim category and matching negative fixture coverage.
- B3 response: the spec now requires the new deployment doc to be registered
  through the existing shared `files`, `requiredStrings`, `links`,
  `bannedPatterns`, and `negativeFixtures` config model in
  `scripts/verify-docs-claims.js`, preserving `verifyDocsClaims(fileReader)`
  as the single unit-test injection point.
- B4 response: the verification plan now includes
  `npm run test:unit -- docs-claims` and `git diff --stat` evidence in
  addition to docs, safety, privacy, compliance, build, and whitespace checks.
- B5 response: the spec chooses Claude's non-duplicating option:
  `docs/deployment.md` must not restate the literal `index.html` CSP directive
  string. `index.html` remains the source of truth for exact local meta CSP
  directives. If a later implementation duplicates exact directives, the
  verifier must read `index.html` and prove consistency.

Optional recommendations were folded into the spec as non-blocking guardrails:
the minimum header list is not exhaustive, COOP/COEP/CORP are future review
items, `Permissions-Policy` examples must be illustrative and non-mandatory,
and present-tense claims that production headers are already active are
prohibited.

## Verification

- `git diff --check` pending after focused prompt creation.

## Gate

Round 2 focused re-review closed B1-B5 and returned FAIL on B6. Implementation
remains blocked pending B6-only focused Claude re-review PASS or resolution and
re-review of any remaining blockers.
