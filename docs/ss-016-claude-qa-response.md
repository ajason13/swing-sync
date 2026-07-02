# SS-016 Claude QA Planning Response

Status: FAIL. Implementation remains blocked.

Received: 2026-07-01.

## Verdict

Claude returned a QA planning FAIL for SS-016. This was a planning-gate review
of the research disposition and preimplementation spec. No public docs
implementation existed at the time of review.

## Blockers

- B1: No draft copy existed for any required section except the trademark
  paragraph.
- B2: No structural or automated enforcement existed for prohibited-claim
  language; manual review alone was fail-open for this sensitive docs story.
- B3: Capability-summary wording risked overclaiming active AI coaching because
  the SS-013 remote model adapter remains an inactive scaffold with an empty
  production provider registry.
- B4: Contributor guide placement was unresolved.
- B5: `SS-TC-020` was a single opaque test case rather than decomposed
  per-required-disclosure and per-prohibited-claim-category coverage.

## Codex Disposition

Codex accepts B1-B5 as valid.

Planned response before implementation:

- B1: add full draft README, `docs/limitations.md`, and `CONTRIBUTING.md` prose
  to the preimplementation spec for focused Claude re-review.
- B2: require a dependency-free `scripts/verify-docs-claims.js`, expose
  `npm run docs:verify`, and wire it into `npm run compliance:verify`.
- B3: make the README capability summary separate current local behavior from
  SS-012 prompt contracts and SS-013's inactive empty-registry remote model
  adapter scaffold.
- B4: lock the contributor guide to root-level `CONTRIBUTING.md`.
- B5: decompose `SS-TC-020` into named sub-cases for required disclosures and
  prohibited-claim categories.

## Non-Blocking Recommendations

- Sanity-check the `Checked on: 2026-07-01` date when finalizing artifacts.
- Include the Node 22 `.nvmrc` pin and the known Node 24 browser-smoke hang risk
  in `CONTRIBUTING.md`.
- Cross-reference that `docs/safety-terms.md` and
  `docs/privacy-architecture.md` remain draft/pending human or legal review,
  and that SS-002 legal/human review remains a pre-release gate.

## Sign-Off Status

Claude did not approve implementation start. Focused re-review is required
after the planning artifacts are revised.

## Focused Re-Review Response

Status: FAIL. Implementation remains blocked.

Received: 2026-07-01.

Claude closed B1, B3, and B4; found B5 substantially closed with one required
addition; and held B2 open as B6.

New blockers:

- B6: `docs:verify` as designed would false-positive against the exact draft
  text for three sentences: an `anonymous` denial in limitations, a `diagnosis`
  denial in limitations, and `hidden identifiers` in CONTRIBUTING. The
  link-presence rule was also ambiguous because it said "where applicable."
- B7: `SS-TC-020` needed a golden regression sub-case proving `docs:verify`
  exits zero against the exact final approved README, limitations, and
  CONTRIBUTING content.

Codex accepts B6-B7 as valid.

Planned response before implementation:

- B6: reword the three draft sentences to avoid the bare trigger terms instead
  of adding bespoke exceptions, and make link checks apply uniformly to all
  three docs with explicit path forms.
- B7: add a golden zero-exit `docs:verify` sub-case to `SS-TC-020` and the
  preimplementation spec.

Sign-off remains blocked pending a second focused B6-B7 re-review.

## Second Focused Re-Review Response

Status: FAIL. Implementation remains blocked.

Received: 2026-07-01.

Claude confirmed the three original B6 collisions and the link rule are fixed.
B7's golden regression sub-case remains correctly specified. Claude found one
new blocker:

- B8: the `docs/limitations.md` intro paragraph still contained `diagnose`,
  which collides with the medical/injury banned-term list outside the canonical
  non-medical exception.

Codex accepts B8 as valid.

Planned response before implementation:

- B8: trim the limitations intro paragraph to avoid restating medical/injury
  claim vocabulary outside the canonical non-medical exception.
- Re-run the complete banned-pattern list against the exact final draft public
  docs text and report the result in the B8 closure prompt.

Sign-off remains blocked pending final focused B8 re-review.
