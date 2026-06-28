# SS-014 Claude QA Focused Re-Review 2 Prompt

Role: You are the independent adversarial QA planner for Swing Sync.

Stage: Second focused pre-implementation QA re-review.

Objective: Re-review only whether Codex's revised SS-014 planning artifacts
close your new NB1-NB3 blockers. Return PASS only if the revised plan is now
ready for Codex implementation.

## Context

Task: `SS-014 Create fixture swing dataset policy and test fixtures`

Branch: `ss-014-fixtures-policy`

Notion status: `2. QA Planning (Claude)`.

Acceptance criteria:

- Define consent and licensing policy for fixture videos.
- Prefer synthetic/derived landmark fixtures when possible.
- Add at least one non-identifying fixture for math tests.
- Document what cannot be committed to the repo.

You previously confirmed B1-B8 are closed, then returned FAIL with NB1-NB3.

## Prior New Blockers

- NB1: no test proved the validator actually reads from
  `scripts/fixture-policy-data.mjs`; the plan only proved docs match the
  canonical source.
- NB2: no controlled mechanism identified fixtures that used AI generation, so
  `FIXTURE_AI_TERMS_MISSING` could depend on fragile free-text parsing.
- NB3: the general maintainer approval and AI-generated output-rights approval
  were introduced without saying whether they are the same field or separate
  fields.

## Codex Responses

- NB1: accepted. The spec now requires tests to prove both doc-to-source and
  validator-to-source consistency. A valid implementation may use a validator
  API that accepts injected test policy data, a temporary modified copy of the
  canonical data, or a static import/read check that fails if the validator does
  not use `scripts/fixture-policy-data.mjs`.
- NB2: accepted. The spec now requires a controlled `generationMethod` value
  from the canonical source instead of free-text branching. Initial values are
  `project-authored-manual`, `project-authored-scripted`,
  `third-party-ai-generated`, `derived-from-approved-source`,
  `third-party-source`, and `unknown`. Only `third-party-ai-generated` triggers
  AI-generation terms metadata. `unknown` is blocked unless a future reviewed
  policy exception narrows it.
- NB3: accepted. The spec now defines separate provenance fields:
  `maintainerApproval` for general fixture class/content approval and
  `aiGeneratedOutputRightsApproval` for AI-generation tool terms,
  input-source, and output-rights approval. AI-generated fixtures that also
  require general approval must include both fields, even if the same PR review
  approves both decisions.

## Revised Spec Excerpt

~~~markdown
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
hard-coded class list. This can be satisfied with a validator API that accepts a
test policy-data object, by running the validator against a temporary copy of
the canonical data with a changed fixture class, or by a static import check
that fails if validator code does not import/read the canonical source.

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
unknown
```

Only `third-party-ai-generated` triggers the AI-generation terms metadata
requirements. `unknown` is blocked unless a future reviewed policy exception
adds a narrower allowed path. Free-text derivation notes may explain the
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

## Test Plan

Targeted tests should cover:

- a doc/canonical-source consistency test that proves `docs/fixture-policy.md`
  includes every class and blocked/allowed decision from
  `scripts/fixture-policy-data.mjs`;
- a validator/canonical-source consistency test proving validator behavior is
  driven by `scripts/fixture-policy-data.mjs`, not a separate hard-coded class
  list;
~~~

## Output Required

Return:

- PASS or FAIL verdict.
- Whether NB1-NB3 are closed.
- Any new blockers introduced by these precision fixes.
- Non-blocking recommendations separated from blockers.
- Explicit statement whether Codex may move SS-014 to implementation.

Focus only on NB1-NB3 closure and direct side effects of these changes.
