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

## Canonical Fixture Class Source

`scripts/fixture-policy-data.mjs` must be the single machine-readable source of
truth for:

- fixture class identifiers;
- default class decisions;
- per-class approval requirements;
- required provenance fields;
- validation error codes; and
- fixture size thresholds.

`docs/fixture-policy.md` must either be generated from that source or
explicitly tested against it. Validator code must import or read the same source
and must not maintain a separate hand-authored class allowlist.

The test suite must prove both doc-to-source and validator-to-source
consistency. It is not sufficient to assert that the documentation matches
`scripts/fixture-policy-data.mjs`; at least one test must prove validator
behavior is driven by that canonical source rather than by an independent
hard-coded class list. Prefer a behavior-driving test: either a validator API
that accepts a test policy-data object, or running the validator against a
temporary copy of the canonical data with a changed fixture class and observing
validator behavior change. A static import/read check may supplement that
evidence, but must not be the only validator-to-source proof unless behavior-
driven proof is impractical and the limitation is documented for Claude final
audit.

## Fixture Classes

`docs/fixture-policy.md` must define these classes from the canonical source.
Any fixture whose declared class is missing, misspelled, or not listed below is
blocked by default and must fail validation with `FIXTURE_CLASS_UNKNOWN`.

| Class | Default decision | Notes |
| --- | --- | --- |
| `project-authored-synthetic-landmarks` | Allowed | Preferred for math and contract tests. Must not represent a real person's motion. |
| `project-authored-synthetic-media` | Allowed with provenance | Allowed for browser/video plumbing when synthetic by design, small, and documented. Existing mannequin fixture remains limited to pose-extraction integration. |
| `derived-non-identifying-landmarks` | Review required | May be allowed if source rights, transformation, privacy impact, and non-identifying rationale are recorded. |
| `maintainer-recorded-personal-media` | Blocked by default | First-party real-person recording; use `recorded-real-person` generation method. Requires future explicit approval, consent/release record, privacy review, licensing decision, and limitation language before commit. |
| `third-party-open-media` | Blocked by default | Requires source-specific license/terms review, attribution/notice plan, privacy review, and maintainer approval. |
| `commercial-or-restricted-dataset-media` | Blocked | Not committable unless a future written permission/contract and policy exception are recorded. |
| `unknown-or-unlicensed-media` | Blocked | No commit. |
| `model-provider-assets` | Blocked unless already approved | Must follow `docs/models-licensing.md`. SS-014 does not approve new model assets. |

Matched-but-blocked classes fail with `FIXTURE_CLASS_BLOCKED`. Unknown or
unmatched classes fail with `FIXTURE_CLASS_UNKNOWN`.

## Required Provenance Fields

Every committed fixture directory containing media, landmarks, derived data, or
dataset-like files must have a `PROVENANCE.md` or manifest with:

- fixture identifier and file paths;
- fixture class;
- author/creator;
- creation or acquisition date;
- source URL or statement that it is project-authored;
- `generationMethod` controlled value plus derivation notes;
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

If the generation method uses a third-party AI or generation tool, provenance
must also include:

- generation tool name;
- generation tool version or model identifier when available;
- applicable terms-of-service or usage-policy URL;
- terms review date;
- input-source statement confirming no real-person, third-party copyrighted, or
  identifying source media was supplied unless separately approved; and
- maintainer approval for the generated output-rights decision.

Missing AI-generation terms metadata must fail with `FIXTURE_AI_TERMS_MISSING`.

`generationMethod` must be a controlled value from the canonical source, not
free text. Initial values:

```text
project-authored-manual
project-authored-scripted
third-party-ai-generated
derived-from-approved-source
third-party-source
recorded-real-person
unknown
```

Only `third-party-ai-generated` triggers the AI-generation terms metadata
requirements. `unknown` is blocked unless a future reviewed policy exception
adds a narrower allowed path. `recorded-real-person` represents a first-party
recording of an actual person and remains blocked in SS-014 through the
`maintainer-recorded-personal-media` class until a future consent/release
workflow is separately approved. Free-text derivation notes may explain the
process, but validator branching must use the controlled `generationMethod`
value, not keyword matching against prose.

For AI-generated fixtures, the generated-output-rights approval must be a
distinct provenance field from the general fixture-class maintainer approval:

- `maintainerApproval`: required for any fixture class outside
  `project-authored-synthetic-landmarks`; records approval to commit the
  fixture class/content under the policy.
- `aiGeneratedOutputRightsApproval`: required only when
  `generationMethod` is `third-party-ai-generated`; records approval of the
  generation tool terms, input-source statement, and output-rights decision.

For an AI-generated fixture whose class also requires maintainer approval, both
fields are required. They may name the same approver/date if the same PR review
approved both decisions, but they must remain separate fields so validation and
audit evidence can distinguish the two decisions.

Missing `aiGeneratedOutputRightsApproval` fails with
`FIXTURE_AI_TERMS_MISSING`, not the generic `FIXTURE_APPROVAL_REQUIRED`.
`FIXTURE_APPROVAL_REQUIRED` is reserved for missing `maintainerApproval`.

## Maintainer Approval Control

The `maintainer approval name/date` provenance field is a record of the human
decision, not by itself proof that approval occurred.

For SS-014 implementation:

- the automated validator checks that the field exists where required and emits
  `FIXTURE_APPROVAL_REQUIRED` when missing;
- the PR checklist and final audit evidence must identify the approving
  maintainer review for any fixture class that requires approval;
- if this repository has CODEOWNERS or branch-protection support available for
  fixture paths, use it as the structural approval mechanism; and
- if CODEOWNERS or branch-protection enforcement is unavailable, document the
  limitation in the PR and require explicit maintainer approval in the PR
  discussion before merge.

The validator must not claim it can authenticate free-text maintainer approval.
It only enforces presence and format; real approval remains a PR-review gate.

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

The default committed fixture budget is the following exact contract:

| File category | Size | Decision | Missing requirement error |
| --- | ---: | --- | --- |
| Non-media structured fixture | `<= 100 KiB` | Allowed if other provenance rules pass | n/a |
| Non-media structured fixture | `> 100 KiB` | Requires documented exception and maintainer approval | `FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET` and, if approval missing, `FIXTURE_APPROVAL_REQUIRED` |
| Media fixture | `<= 1 MiB` | Allowed if other provenance rules pass | n/a |
| Media fixture | `> 1 MiB` and `< 5 MiB` | Requires documented exception and maintainer approval | `FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET` and, if approval missing, `FIXTURE_APPROVAL_REQUIRED` |
| Any fixture file | `>= 5 MiB` | Blocked in SS-014; requires a future reviewed distribution plan | `FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET` |

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

Add `npm run fixture:verify` and wire it into `npm run compliance:verify`.
The validator must be implemented with built-in Node APIs and existing
repository tooling only. Do not add new npm dependencies for fixture validation,
SPDX parsing, metadata inspection, hashing, Markdown parsing, or test-data
management in SS-014. If implementation appears to require a new dependency,
stop and perform separate dependency/licensing review before continuing.

`npm run fixture:verify` must fail closed on:

- fixture directory missing provenance;
- missing required provenance fields;
- unknown fixture class;
- blocked fixture class;
- blocked or unknown license/status text;
- missing AI-generation terms metadata when applicable;
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
FIXTURE_CLASS_UNKNOWN
FIXTURE_CLASS_BLOCKED
FIXTURE_LICENSE_BLOCKED
FIXTURE_AI_TERMS_MISSING
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
- `FIXTURE_PROVENANCE_MISSING` for a fixture directory without provenance;
- `FIXTURE_FIELD_MISSING` for missing required provenance fields;
- `FIXTURE_CLASS_UNKNOWN` for a missing, misspelled, or unlisted fixture class;
- `FIXTURE_CLASS_BLOCKED` for a matched blocked class;
- `FIXTURE_LICENSE_BLOCKED` for blocked or unknown license/status text;
- `FIXTURE_AI_TERMS_MISSING` for AI-generated fixture provenance without terms
  metadata;
- a non-AI `generationMethod`, such as `project-authored-scripted`, does not
  trigger `FIXTURE_AI_TERMS_MISSING` when the AI-only terms fields are absent;
- `FIXTURE_MEDIA_HASH_MISSING` for media provenance without an integrity hash;
- `FIXTURE_MEDIA_SIZE_MISSING` for media provenance without file size metadata;
- `FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET` for files above exact configured
  thresholds, including boundary tests at exactly 100 KiB, just over 100 KiB,
  exactly 1 MiB, just over 1 MiB, just under 5 MiB, and exactly 5 MiB;
- `FIXTURE_APPROVAL_REQUIRED` for a fixture that requires maintainer approval
  but lacks the approval field;
- `FIXTURE_UNSAFE_CLAIM` for unsafe absolute privacy, deletion, anonymity,
  legal, compliance, safety, professional-coaching, model-performance, or phase-
  accuracy claims;
- a doc/canonical-source consistency test that proves `docs/fixture-policy.md`
  includes every class and blocked/allowed decision from
  `scripts/fixture-policy-data.mjs`;
- a validator/canonical-source consistency test proving validator behavior is
  driven by `scripts/fixture-policy-data.mjs`, not a separate hard-coded class
  list;
- a dependency guard proving SS-014 fixture validation did not add package.json
  dependencies or lockfile production/development packages;
- policy text includes allowed/blocked fixture classes and commit blockers as a
  documentation completeness check separate from validator behavior;
- protected-boundary checks confirm no new network, telemetry, persistence,
  SDK/provider/model asset, worker, dependency, or remote sharing behavior is
  introduced.

Baseline verification after implementation:

- `npm run test:unit`
- `npm run build`
- `npm run compliance:verify`
- `npm run safety:verify`
- `npm run privacy:verify`
- `git diff --check`

If a new dependency, model/provider asset, or license exception is proposed,
stop and perform separate approval plus `npm run license:audit`,
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
