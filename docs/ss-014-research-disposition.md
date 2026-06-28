# SS-014 Research Disposition

Status: **Claude QA planning returned FAIL; B1-B8 are accepted and revised.
Implementation remains blocked pending focused Claude QA re-review PASS.**

SS-014 defines fixture consent, licensing, provenance, and committed-test-data
rules. It is privacy-, licensing-, compliance-, export/test-fixture-, and
future user-facing-policy sensitive. Codex is acting as the research/spec owner
under the 2026-06-26 LLM-team routing update; Claude remains the independent QA
planning and final-audit reviewer.

## Primary-Source And Repository Checks

Checked on 2026-06-27:

- Creative Commons documents CC licenses as standardized permissions for
  sharing/reuse, and distinguishes license families such as attribution,
  share-alike, no-derivatives, and noncommercial restrictions:
  https://creativecommons.org/cc-licenses/
- SPDX License List version `3.28.0 2026-02-20` provides standardized short
  identifiers, full names, license text, and canonical URLs:
  https://spdx.org/licenses/
- GitHub warns at files larger than 50 MiB, blocks files larger than 100 MiB,
  and recommends repositories remain small, ideally under 1 GB:
  https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
- OpenAI Terms of Use state that the user is responsible for Content, must have
  rights to provide Input, and, as between the user and OpenAI and to the
  extent permitted by law, owns Output. They also warn Output may not be unique
  and must be evaluated before sharing:
  https://openai.com/policies/terms-of-use/
- Repository policy in `docs/licensing.md` allows production-bundle licenses
  `MIT`, `Apache-2.0`, `BSD-2-Clause`, `BSD-3-Clause`, `ISC`, `CC0-1.0`, and
  `0BSD`; blocks GPL/AGPL/LGPL, unknown, custom, proprietary, and unlicensed
  inputs without approval; and requires documented review for reference reuse.
- Repository policy in `docs/privacy-architecture.md` classifies raw swing
  video, derived frames, landmarks, metrics, prompts, and reports as sensitive
  data classes with local-first defaults and no remote sharing unless a future
  explicit opt-in exists.
- Existing `test/fixtures/pose-landmarker/PROVENANCE.md` documents a
  project-approved non-identifying AI-generated mannequin image and derived
  WebM. It is limited to deterministic pose-extraction integration tests and is
  not evidence of swing accuracy, phase detection, biomechanical correctness,
  or performance across devices.
- SS-007 explicitly deferred moving side-on browser fixture policy,
  provenance, and coverage to SS-014. SS-007 uses deterministic programmatic
  pose fixtures only and must not claim moving side-on phase accuracy.

## Adopt

- Create a repository fixture policy that distinguishes allowed fixture classes
  from blocked fixture classes before any new committed video or dataset lands.
- Prefer project-authored synthetic landmarks or small structured fixtures for
  math, contract, and validation tests when browser video behavior is not
  required.
- Require a provenance manifest for every committed media or dataset fixture
  that is not trivial inline test data.
- Permit committed fixtures only when provenance, rights, privacy impact,
  intended test scope, integrity, and limitations are recorded.
- Keep the existing mannequin fixture approved only for deterministic
  pose-extraction integration. Do not upgrade its meaning to golf-swing phase
  or representative accuracy evidence.
- Require fail-closed validation for missing provenance, blocked license
  status, personal or identifying media, hidden metadata, oversized media,
  unclear source rights, and unsafe policy wording.
- Keep fixture data local to tests. Do not add remote upload, telemetry, cloud
  storage, public serving, new SDK/provider/model asset, new worker, or new
  dependency behavior in SS-014 unless separately reviewed and approved.

## Revise Before Adoption

- **Consent language:** do not frame fixture approval as a durable legal
  consent record. Require documented maintainer approval and recorded
  subject/creator permissions where applicable, while preserving the repo's
  "not legal advice" boundary.
- **"Non-identifying" wording:** use "non-identifying by design" or "no known
  personal media" for synthetic fixtures. Do not claim anonymity or guaranteed
  non-identifiability.
- **Creative Commons handling:** accept only CC0-1.0 by default because it is
  already in the allowed license set. Other CC licenses can be useful for
  documentation or external references, but fixture reuse with attribution,
  share-alike, noncommercial, or no-derivatives restrictions requires explicit
  maintainer review before commit.
- **OpenAI/generated output handling:** existing OpenAI-generated fixture
  precedent can be used for project-authored synthetic imagery only when no
  third-party or real-person source input is used, output rights/terms are
  checked, and the maintainer records approval. It is not a blanket approval for
  generated likenesses, celebrity/person outputs, or third-party-derived media.
- **Repository size:** GitHub's hard limit is 100 MiB, but SS-014 should set a
  much smaller fixture-budget rule for ordinary committed test fixtures.

## Defer

- Real-person swing-video fixture collection, release forms, subject revocation
  handling, and storage workflows beyond a documented future approval gate.
- Third-party dataset import, CaddieSet/GolfDB media reuse, or reference-derived
  frame/video reuse until source-specific license, terms, citation, privacy,
  and redistribution analysis is complete.
- Representative moving side-on browser fixture validation and phase accuracy
  claims. SS-014 may define the gate; it does not need to provide a real-person
  or representative moving dataset in this story.
- New dependency-based metadata scanners, video tooling, or dataset management
  systems unless Claude QA and maintainer review approve the added dependency
  and licensing surface.

## Reject

- Reject committing raw personal swing video under generic open-source license
  assumptions.
- Reject using "found online" footage, social-media clips, training videos, or
  commercial dataset samples without explicit rights and redistribution review.
- Reject identifiable faces, logos, license plates, backgrounds, audio, EXIF,
  device identifiers, filenames, account names, timestamps, geolocation, or
  other hidden metadata in committed fixtures.
- Reject noncommercial, no-derivatives, share-alike, unknown, proprietary,
  unlicensed, GPL/AGPL/LGPL, or custom terms as silently acceptable fixture
  inputs.
- Reject fixture policy copy that promises legal compliance, anonymity,
  guaranteed deletion, guaranteed privacy, injury safety, professional coaching
  validity, or model/detector accuracy.
- Reject treating the existing static mannequin WebM as evidence of moving
  side-on phase detection, real swing coverage, or device-wide performance.

## Candidate Contract Direction

SS-014 should add:

- `docs/fixture-policy.md` with allowed/blocked fixture classes, required
  provenance fields, commit checklist, and limitation language.
- `test/fixtures/math/non-identifying-swing-landmarks.json` or equivalent small
  project-authored landmark fixture for math/contract tests.
- `test/fixtures/math/PROVENANCE.md` or a manifest entry documenting authorship,
  license, integrity, intended scope, and limitations.
- A validation script and test coverage that scans fixture manifests/policy for
  required fields, blocked wording, and prohibited fixture classes.

Implementation remains blocked until Claude QA planning confirms this contract
is complete and sufficiently fail-closed.

## Claude QA Planning FAIL Response - 2026-06-28

Claude returned FAIL with eight blockers:

- B1: no default-deny rule for unenumerated fixture classes.
- B2: maintainer approval was only a free-text provenance field, not a
  structural control.
- B3: fixture classes risked being maintained twice in prose and validator
  code.
- B4: size-budget thresholds were ambiguous.
- B5: `FIXTURE_MEDIA_HASH_MISSING`, `FIXTURE_MEDIA_SIZE_MISSING`, and
  `FIXTURE_APPROVAL_REQUIRED` had no matching test-plan entries.
- B6: AI-generation-tool terms-of-service review was not a distinct required
  provenance field.
- B7: the validation contract did not restate the no-new-dependency constraint.
- B8: validator wiring used non-committal "likely integrated" wording.

Codex accepts all eight findings as valid. The candidate specification now:

- requires `scripts/fixture-policy-data.mjs` as the single canonical
  machine-readable source for fixture classes, required fields, error codes,
  and size thresholds;
- requires unknown/unmatched classes to fail with `FIXTURE_CLASS_UNKNOWN` and
  matched blocked classes to fail with `FIXTURE_CLASS_BLOCKED`;
- explicitly states that maintainer approval text is not authenticated by the
  validator and must be backed by PR review, CODEOWNERS/branch protection where
  available, or an explicit documented PR-review limitation;
- replaces ambiguous size language with exact threshold rows and error-code
  mapping;
- adds distinct AI-generation terms metadata fields and
  `FIXTURE_AI_TERMS_MISSING`;
- makes `npm run fixture:verify` mandatory and wires it into
  `npm run compliance:verify`;
- requires zero new dependencies for fixture validation unless separately
  reviewed; and
- maps every validation error code to explicit negative tests, including
  boundary tests and dependency/canonical-source drift guards.

## Claude Focused QA Re-Review FAIL Response - 2026-06-28

Claude focused re-review confirmed B1-B8 are closed, then returned FAIL with
three narrow new blockers:

- NB1: the test plan proved docs match `scripts/fixture-policy-data.mjs`, but
  did not prove the validator actually reads from that canonical source instead
  of a separate hard-coded allowlist.
- NB2: the AI-generation terms branch depended on whether the generation method
  uses third-party AI, but `generation method or derivation steps` was still
  effectively free text.
- NB3: the spec introduced both a general maintainer approval and an
  AI-generated output-rights maintainer approval without saying whether these
  are the same field or distinct fields.

Codex accepts NB1-NB3 as valid. The candidate specification now:

- requires tests to prove both doc-to-source and validator-to-source
  consistency with `scripts/fixture-policy-data.mjs`;
- allows a validator API with injected test policy data, a temporary modified
  policy-data copy, or a static import check to prove validator behavior is
  driven by the canonical source;
- replaces free-text generation-method branching with a controlled
  `generationMethod` value from the canonical source;
- defines initial `generationMethod` values and requires only
  `third-party-ai-generated` to trigger AI terms metadata;
- blocks `unknown` generation method unless a future reviewed policy exception
  adds a narrower allowed path; and
- defines `maintainerApproval` and `aiGeneratedOutputRightsApproval` as
  distinct provenance fields. AI-generated fixtures that also require general
  maintainer approval must include both fields, even if the same PR review
  approves both decisions.

## Claude Focused NB1-NB3 Re-Review FAIL Response - 2026-06-28

Claude confirmed NB1-NB3 are closed, then returned FAIL with one narrow
blocker:

- NB4: the `generationMethod` enum had no value for first-party real-person
  recordings, leaving `maintainer-recorded-personal-media` unrepresentable
  without mislabeling it as `third-party-source` or `unknown`.

Codex accepts NB4 as valid. The candidate specification now:

- adds `recorded-real-person` as a controlled `generationMethod` value;
- maps the `maintainer-recorded-personal-media` row to
  `recorded-real-person`;
- states that `recorded-real-person` remains blocked in SS-014 through the
  `maintainer-recorded-personal-media` class until a future consent/release
  workflow is separately approved;
- prefers behavior-driving validator-to-canonical-source tests over static
  import checks;
- explicitly maps missing `aiGeneratedOutputRightsApproval` to
  `FIXTURE_AI_TERMS_MISSING`, while reserving `FIXTURE_APPROVAL_REQUIRED` for
  missing `maintainerApproval`; and
- requires a negative test showing non-AI `generationMethod` values do not
  trigger `FIXTURE_AI_TERMS_MISSING`.
