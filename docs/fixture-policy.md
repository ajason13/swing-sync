# Fixture Policy

This policy defines which committed Swing Sync test fixtures are allowed, what
provenance they require, and what fixture content must not be committed. It is
engineering compliance guidance, not legal advice or a guarantee of privacy,
anonymity, deletion, safety, model performance, or legal compliance.

## Default Rule

Committed fixtures must be local test assets with documented provenance. Any
fixture class, generation method, license, source, media file, or approval state
not covered by `scripts/fixture-policy-data.mjs` fails closed.

## Fixture Classes

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

## Generation Methods

Allowed controlled values are:

- `project-authored-manual`
- `project-authored-scripted`
- `third-party-ai-generated`
- `derived-from-approved-source`
- `third-party-source`
- `recorded-real-person`
- `unknown`

Only `third-party-ai-generated` triggers the AI-generation terms metadata
requirements. `unknown` and `recorded-real-person` remain blocked in SS-014
unless a future reviewed policy explicitly approves a narrower path.

## Required Provenance

Fixture directories covered by this policy must include `FIXTURE-MANIFEST.json`
with:

- fixture identifier and file paths;
- fixture class;
- author or creator;
- creation or acquisition date;
- source URL or a project-authored source statement;
- controlled `generationMethod` plus derivation notes;
- license or explicit project approval decision;
- third-party notices or attribution requirements;
- consent or release status;
- privacy review;
- intended test scope;
- explicit limitations;
- integrity hash for each committed binary or media fixture;
- file size; and
- maintainer approval fields where required.

AI-generated fixtures must also record generation tool name, version or model
when available, terms URL, terms review date, input-source statement, and
`aiGeneratedOutputRightsApproval`.

## Blocked Commit Content

Do not commit:

- raw personal swing video without a future source-specific approval;
- identifiable faces, voices, backgrounds, account names, geolocation, license
  plates, logos, or other unnecessary identifiers;
- hidden EXIF, device, location, account, or privacy-sensitive filename data;
- third-party footage, social-media clips, training videos, or dataset samples
  with unclear redistribution rights;
- GPL, AGPL, LGPL, proprietary, unlicensed, unknown, custom, non-SPDX,
  noncommercial, no-derivatives, or share-alike fixture terms without a
  documented exception;
- model weights, model assets, SDK assets, or provider outputs outside existing
  approvals;
- files outside the approved fixture-size budget;
- fixtures that imply representative model accuracy, phase accuracy,
  biomechanical correctness, safety, anonymity, legal compliance, or guaranteed
  deletion; or
- fixtures that require remote upload, cloud storage, telemetry, public
  serving, or network access to run tests.

## Size Budget

| File category | Size | Decision |
| --- | ---: | --- |
| Non-media structured fixture | `<= 100 KiB` | Allowed if other provenance rules pass. |
| Non-media structured fixture | `> 100 KiB` | Requires documented exception and maintainer approval. |
| Media fixture | `<= 1 MiB` | Allowed if other provenance rules pass. |
| Media fixture | `> 1 MiB` and `< 5 MiB` | Requires documented exception and maintainer approval. |
| Any fixture file | `>= 5 MiB` | Blocked in SS-014; requires a future reviewed distribution plan. |

## Existing Mannequin Fixture

`test/fixtures/pose-landmarker` remains approved only for deterministic local
pose-extraction integration. It is not evidence of golf-swing accuracy, phase
detection, biomechanical correctness, coaching correctness, or performance
across devices.
