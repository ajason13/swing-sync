# SS-014 Claude QA Planning Prompt

> Superseded for paste use after Claude QA planning FAIL on 2026-06-28. Use
> `docs/ss-014-claude-qa-rereview-prompt.md` for focused B1-B8 re-review.

Role: You are the independent adversarial QA planner for Swing Sync.

Stage: Pre-implementation QA planning.

Objective: Audit the SS-014 fixture dataset policy specification before Codex
implements it. Return PASS only if the plan is specific, fail-closed, testable,
and consistent with Swing Sync privacy/licensing/safety boundaries.

## Repository Context

Swing Sync is an open-source, mobile-first local-first PWA for educational golf
swing analysis. Raw swing video must stay local by default. Remote sharing,
cloud storage, telemetry, remote logging, model/provider SDK changes, model
assets, new dependencies, new workers, and public serving are not approved
unless separately reviewed.

Relevant durable policies:

- `docs/privacy-architecture.md`: raw video, frames, landmarks, metrics,
  prompts, and exports are sensitive. Raw video upload is blocked by default.
  Derived landmarks/metrics require explicit opt-in before any remote sharing.
  Do not make absolute privacy, deletion, anonymity, legal, or compliance
  claims.
- `docs/licensing.md`: allowed production license set is MIT, Apache-2.0,
  BSD-2-Clause, BSD-3-Clause, ISC, CC0-1.0, and 0BSD. GPL/AGPL/LGPL,
  unlicensed, unknown, custom, proprietary, and non-SPDX terms are blocked
  unless explicitly reviewed. Reference or media reuse requires source URL,
  license, notices, and maintainer review.
- `docs/models-licensing.md`: no new model binaries, weights, SDK assets, or
  model-provider assets may be committed, served, cached, or fetched without
  source/version/license/rights/privacy review.
- `docs/safety-terms.md`: user-facing and AI-coaching copy must remain
  educational only, not medical advice, diagnosis, rehabilitation, professional
  instruction, guaranteed safety, or guaranteed correctness.

Current existing fixture:

- `test/fixtures/pose-landmarker/PROVENANCE.md`
- `test/fixtures/pose-landmarker/mannequin-source.png`
- `test/fixtures/pose-landmarker/mannequin-golf-address.webm`

That fixture is a project-approved non-identifying AI-generated mannequin image
and derived WebM. Its provenance states it is limited to deterministic
pose-extraction integration tests and is not evidence of golf-swing accuracy,
phase detection, biomechanical correctness, or performance across devices.

SS-007 deferred moving side-on browser fixture policy/provenance/coverage to
SS-014. SS-007 uses deterministic programmatic pose fixtures only and must not
claim moving side-on phase accuracy.

## Task

Task: `SS-014 Create fixture swing dataset policy and test fixtures`

Branch: `ss-014-fixtures-policy`

Notion status: `2. QA Planning (Claude)`. The task first used
`1. Spec Drafting (Gemini)` for board compatibility, but Codex owns
research/spec drafting under the 2026-06-26 LLM-team routing update.

Task type: Research.

Acceptance criteria:

- Define consent and licensing policy for fixture videos.
- Prefer synthetic/derived landmark fixtures when possible.
- Add at least one non-identifying fixture for math tests.
- Document what cannot be committed to the repo.

Dedicated test case: `SS-TC-017`.

## Research Inputs Checked By Codex

Checked on 2026-06-27:

- Creative Commons license page:
  https://creativecommons.org/cc-licenses/
- SPDX License List:
  https://spdx.org/licenses/
- GitHub large-file guidance:
  https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
- OpenAI Terms of Use:
  https://openai.com/policies/terms-of-use/
- Existing repo docs and fixture provenance listed above.

Codex disposition summary:

- Adopt policy-first fixture classes, required provenance, synthetic/derived
  landmark preference, explicit limitations, and fail-closed validation.
- Revise consent, non-identifying, Creative Commons, generated-output, and
  repository-size language to avoid overclaims.
- Defer real-person fixture collection, third-party dataset imports, and
  representative moving side-on validation.
- Reject committing raw personal video, unknown third-party media, hidden
  identifiers, blocked licenses, and any policy copy promising anonymity,
  legal compliance, deletion, privacy, safety, or phase accuracy.

## Relevant File Contents

The following are the exact current SS-014 research and specification artifacts
for review.

### `docs/ss-014-research-disposition.md`

```markdown
# SS-014 Research Disposition

Status: **Codex-owned research/specification draft. Implementation remains
blocked pending Claude QA planning PASS.**

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
```

### `docs/ss-014-preimplementation-spec.md`

```markdown
# SS-014 Pre-Implementation Specification

Status: **Candidate specification for Claude QA planning. Implementation is
blocked pending Claude PASS.**

## Scope

SS-014 defines and verifies Swing Sync's committed fixture policy. It must make
clear which fixture types are allowed, which are blocked, what provenance is
required, and what limitations apply to any committed fixture.

Out of scope: real-person fixture collection workflows, remote storage, cloud
dataset hosting, user-facing upload UX, phase-accuracy validation, new
model/provider assets, new SDKs, new workers, new runtime telemetry, new
dependencies, and remote sharing.

## Acceptance Criteria

- Define consent and licensing policy for fixture videos.
- Prefer synthetic/derived landmark fixtures when possible.
- Add at least one non-identifying fixture for math tests.
- Document what cannot be committed to the repo.

Dedicated Notion test case: `SS-TC-017`.

## Sensitive Classification

SS-014 is privacy-, licensing-, compliance-, export/test-fixture-, and future
user-facing-policy sensitive.

Required boundaries:

- no raw swing video upload or remote sharing;
- no hidden telemetry, remote logging, cloud storage, or public serving;
- no new SDK/provider/model asset/dependency unless separately approved;
- no absolute privacy, deletion, anonymity, legal, compliance, safety, medical,
  professional coaching, or detector-accuracy claims; and
- no committed personal or identifying media without a future explicit,
  source-specific approval process.

Observability: intentionally unchanged unless a local validation script emits
sanitized file-path and error-code output during developer verification. No
runtime logs, telemetry, analytics, traces, remote diagnostics, or fixture data
payload dumps are approved.

## Fixture Classes

`docs/fixture-policy.md` must define these classes.

| Class | Default decision | Notes |
| --- | --- | --- |
| `project-authored-synthetic-landmarks` | Allowed | Preferred for math and contract tests. Must not represent a real person's motion. |
| `project-authored-synthetic-media` | Allowed with provenance | Allowed for browser/video plumbing when synthetic by design, small, and documented. Existing mannequin fixture remains limited to pose-extraction integration. |
| `derived-non-identifying-landmarks` | Review required | May be allowed if source rights, transformation, privacy impact, and non-identifying rationale are recorded. |
| `maintainer-recorded-personal-media` | Blocked by default | Requires future explicit approval, consent/release record, privacy review, licensing decision, and limitation language before commit. |
| `third-party-open-media` | Blocked by default | Requires source-specific license/terms review, attribution/notice plan, privacy review, and maintainer approval. |
| `commercial-or-restricted-dataset-media` | Blocked | Not committable unless a future written permission/contract and policy exception are recorded. |
| `unknown-or-unlicensed-media` | Blocked | No commit. |
| `model-provider-assets` | Blocked unless already approved | Must follow `docs/models-licensing.md`. SS-014 does not approve new model assets. |

## Required Provenance Fields

Every committed fixture directory containing media, landmarks, derived data, or
dataset-like files must have a `PROVENANCE.md` or manifest with:

- fixture identifier and file paths;
- fixture class;
- author/creator;
- creation or acquisition date;
- source URL or statement that it is project-authored;
- generation method or derivation steps;
- license/SPDX identifier or explicit project approval decision;
- third-party notices or attribution requirements, if any;
- consent/release status, or an explicit "not applicable: no real person"
  statement for synthetic fixtures;
- privacy impact review, including whether faces, voices, logos, geolocation,
  filenames, EXIF/device metadata, account names, or other identifiers are
  present;
- intended test scope;
- explicit limitations and claims not supported by the fixture;
- integrity hash for each committed binary/media fixture;
- file size; and
- maintainer approval name/date for any fixture outside
  `project-authored-synthetic-landmarks`.

## Blocked Commit Content

`docs/fixture-policy.md` must state that the repo must not commit:

- raw personal swing video without future source-specific approval;
- identifiable faces, voices, backgrounds, account names, geolocation, license
  plates, logos, or other unnecessary identifiers;
- hidden EXIF/device/location metadata or privacy-sensitive filenames;
- third-party footage, social-media clips, training videos, or dataset samples
  with unclear redistribution rights;
- fixtures under GPL, AGPL, LGPL, proprietary, unlicensed, unknown, custom,
  non-SPDX, noncommercial, no-derivatives, or share-alike terms without a
  documented exception;
- model weights, model assets, SDK assets, or provider outputs outside existing
  approvals;
- files over the approved fixture-size budget;
- fixtures that imply representative model accuracy, phase accuracy,
  biomechanical correctness, safety, anonymity, legal compliance, or guaranteed
  deletion; and
- any fixture requiring remote upload, cloud storage, telemetry, public
  serving, or network access to run tests.

## Fixture Size Budget

The default committed fixture budget is:

- individual non-media structured fixtures should stay below 100 KiB;
- individual media fixtures should stay below 1 MiB unless a documented
  exception is approved;
- any file at or above 5 MiB requires explicit maintainer approval in its
  provenance; and
- any file approaching GitHub warning/block thresholds is out of scope for
  ordinary repo commit and must use a future reviewed distribution plan.

This budget is intentionally stricter than GitHub's hard limits.

## Non-Identifying Math Fixture

Implementation must add at least one small project-authored synthetic landmark
fixture for math tests. It should:

- live under `test/fixtures/math/` or another clearly named test-fixture
  directory;
- contain finite numeric landmark-like points sufficient for geometry-metric
  tests;
- include no raw video, frame pixels, face, voice, real-person source,
  filename-derived personal data, or hidden metadata;
- use project Apache-2.0 licensing unless a different allowed license is
  explicitly documented; and
- have provenance stating it is synthetic and not evidence of real swing
  biomechanics, phase accuracy, model performance, or coaching correctness.

Existing unit tests may be refactored to consume this fixture only after Claude
QA planning passes.

## Validation Contract

Add a local developer validation command or script, likely integrated into
`npm run compliance:verify`, that fails closed on:

- fixture directory missing provenance;
- missing required provenance fields;
- blocked fixture class;
- blocked or unknown license/status text;
- unsafe absolute claims in fixture policy or provenance;
- media file without hash and size metadata;
- media file over budget without approval; and
- policy/provenance text that claims anonymity, guaranteed privacy, guaranteed
  deletion, legal compliance, medical safety, professional coaching validity,
  representative accuracy, or phase-detection proof.

The validator must not inspect or print raw landmark arrays, frame pixels, or
media payloads. Output should be sanitized file paths and stable error codes.

Candidate error codes:

```text
FIXTURE_PROVENANCE_MISSING
FIXTURE_FIELD_MISSING
FIXTURE_CLASS_BLOCKED
FIXTURE_LICENSE_BLOCKED
FIXTURE_MEDIA_HASH_MISSING
FIXTURE_MEDIA_SIZE_MISSING
FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET
FIXTURE_APPROVAL_REQUIRED
FIXTURE_UNSAFE_CLAIM
```

## Test Plan

Targeted tests should cover:

- the new math fixture can be loaded and used by at least one existing geometry
  metric test without fabricated values;
- provenance validation passes for approved synthetic landmark and existing
  approved mannequin fixture records;
- validation fails for missing provenance, missing fields, blocked classes,
  blocked licenses, over-budget media without approval, and unsafe claims;
- policy text includes allowed/blocked fixture classes and commit blockers;
- protected-boundary checks confirm no new network, telemetry, persistence,
  SDK/provider/model asset, worker, dependency, or remote sharing behavior is
  introduced.

Verification plan:

- `npm run test:unit`
- `npm run build`
- `npm run compliance:verify`
- `npm run safety:verify`
- `npm run privacy:verify`
- `git diff --check`

If a dependency/model/provider/license exception is proposed, implementation
must stop for separate approval and add `npm run license:audit`,
`npm run verify:bundle-license-fixture`, and `npm run sbom:generate`.

## Claude QA Questions

Claude should specifically evaluate:

- whether the fixture classes and blocked-content rules are sufficiently
  fail-closed;
- whether the provenance fields capture consent, license, privacy, scope,
  limitation, and integrity needs without overclaiming legal compliance;
- whether the non-identifying math fixture requirement satisfies SS-014 without
  implying moving-video phase accuracy;
- whether the validator contract can catch policy regressions and unsafe
  claims;
- whether `SS-TC-017` matches the acceptance criteria; and
- whether any implementation work can begin after revisions, or whether more
  source-specific research is required.
```

### `SS-TC-017` Notion Test Case

```markdown
# SS-TC-017

Scenario Description:
Fixture dataset policy defines approved fixture classes,
consent/licensing/provenance metadata, non-identifying synthetic or derived
landmark fixture preference, and at least one repo-committable non-identifying
math-test fixture without approving raw personal video, unverified third-party
media, hidden identifiers, telemetry, remote storage, or overbroad
privacy/compliance claims.

Failure Condition:
The policy allows committed raw personal swing video, unverified third-party
footage, unclear consent/license/provenance, identifying media, hidden
metadata, remote upload/storage, telemetry, provider/model/dependency changes,
absolute privacy/deletion/anonymity/legal/compliance claims, or tests that
imply moving-video phase accuracy without approved representative fixture
evidence.

## Coverage Status

- Created on 2026-06-27 as dedicated acceptance coverage for `SS-014 Create
  fixture swing dataset policy and test fixtures`.
- SS-TC-011 through SS-TC-016 remain complementary protected-boundary,
  phase-review, overlay, export, and coaching coverage but are insufficient for
  SS-014 fixture dataset policy acceptance.

## Required Contract Coverage

- Define allowed fixture classes, including project-authored synthetic media,
  project-authored synthetic landmarks, derived/non-identifying landmark
  fixtures, and explicitly approved externally sourced or maintainer-recorded
  media only when consent, license, provenance, redistribution, privacy impact,
  and required notices are documented.
- Prefer synthetic or derived landmark fixtures for math and contract tests
  when browser/video behavior is not required.
- Add at least one non-identifying fixture suitable for math tests, with clear
  provenance and no raw personal video or identifying media.
- Document what cannot be committed to the repo: raw personal swing video
  without explicit approval, unverified third-party footage, media with unclear
  rights, identifiable people or backgrounds without reviewed consent, hidden
  identifiers, unnecessary metadata, provider/model assets outside existing
  approvals, and generated or reference-derived files without documented
  rights.
- Include validation or test coverage that rejects missing provenance, blocked
  fixture classes, unclear license/consent, identifying metadata, and unsafe
  absolute privacy/deletion/anonymity/legal/compliance wording.
- Preserve local-first boundaries: no remote upload, telemetry, cloud storage,
  new SDK/provider/model asset, new worker, public serving, or dependency
  change unless separately reviewed and approved.
- Do not claim moving side-on video phase accuracy, representative model
  performance, anonymity, guaranteed non-identifiability, legal compliance, or
  deletion guarantees from fixture presence alone.

## Current Gate

Implementation remains blocked pending Codex-owned research/specification
artifacts and Claude QA planning PASS.
```

### Existing Fixture Provenance Summary

The existing `test/fixtures/pose-landmarker/PROVENANCE.md` states:

- the mannequin fixture was approved for SS-005 QA planning on 2026-06-11 after
  empirical validation against exact `@mediapipe/tasks-vision@0.10.35` and the
  exact Pose Landmarker Full float16 version 1 model;
- the fixture is limited to deterministic pose-extraction integration tests;
- it is not evidence of golf-swing accuracy, phase detection, biomechanical
  correctness, or performance across devices;
- `mannequin-source.png` is an AI-generated synthetic faceless wooden artist
  mannequin, with no recording of a real person, real-person face, or known
  biometric/personal data;
- the generator was OpenAI image generation through Codex `imagegen` on
  2026-06-11;
- OpenAI Terms and Service Terms were reviewed on 2026-06-11;
- the maintainer approved distributing the committed source and derived fixture
  under Apache-2.0 as a project compliance decision, not legal advice or a
  guarantee of exclusive rights;
- `mannequin-golf-address.webm` was deterministically derived with FFmpeg;
- integrity hashes are recorded for the PNG and WebM; and
- empirical validation checked structural pose output at 0, 500, 1000, and
  1500 ms without asserting fixed coordinates or minimum visibility values.

## Output Required

Return:

- PASS or FAIL verdict.
- Blocking findings ordered by severity.
- Non-blocking recommendations separated from blockers.
- Missing tests or edge cases.
- Explicit statement whether Codex may move SS-014 to implementation after
  addressing any blockers.

Please attack assumptions. In particular, check:

- whether fixture classes are complete and fail-closed;
- whether provenance fields are sufficient for consent/licensing/privacy
  without pretending to be legal advice;
- whether CC/OpenAI/generated-output handling is too permissive or too vague;
- whether the size and metadata rules catch realistic repo-risk cases;
- whether `SS-TC-017` actually covers the acceptance criteria;
- whether validation can be implemented without leaking fixture data or adding
  unnecessary dependencies; and
- whether any wording still implies anonymity, guaranteed non-identifiability,
  legal compliance, deletion, privacy, safety, professional coaching validity,
  model performance, or phase accuracy.
