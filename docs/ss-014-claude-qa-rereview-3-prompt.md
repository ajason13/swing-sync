# SS-014 Claude QA Focused Re-Review 3 Prompt

Role: You are the independent adversarial QA planner for Swing Sync.

Stage: Final focused pre-implementation QA confirmation.

Objective: Confirm whether Codex's revised SS-014 planning artifacts close NB4.
You already confirmed B1-B8 and NB1-NB3 are closed. Return PASS only if NB4 is
closed and no new blocker is introduced by the NB4 fix.

## Context

Task: `SS-014 Create fixture swing dataset policy and test fixtures`

Branch: `ss-014-fixtures-policy`

Notion status: `2. QA Planning (Claude)`.

Acceptance criteria:

- Define consent and licensing policy for fixture videos.
- Prefer synthetic/derived landmark fixtures when possible.
- Add at least one non-identifying fixture for math tests.
- Document what cannot be committed to the repo.

## Prior NB4 Finding

`generationMethod` had no value for first-party real-person recordings, leaving
`maintainer-recorded-personal-media` unrepresentable without mislabeling it as
`third-party-source` or `unknown`.

## Codex Response

NB4 accepted. The spec now:

- adds `recorded-real-person` as a controlled `generationMethod` value;
- maps `maintainer-recorded-personal-media` to `recorded-real-person`;
- states that `recorded-real-person` represents a first-party recording of an
  actual person and remains blocked in SS-014 through the
  `maintainer-recorded-personal-media` class until a future consent/release
  workflow is separately approved.

Codex also incorporated your non-blocking recommendations:

- behavior-driving validator-to-canonical-source tests are preferred over a
  static import/read check alone;
- missing `aiGeneratedOutputRightsApproval` maps to
  `FIXTURE_AI_TERMS_MISSING`, while `FIXTURE_APPROVAL_REQUIRED` is reserved for
  missing `maintainerApproval`;
- tests must show non-AI `generationMethod` values such as
  `project-authored-scripted` do not trigger `FIXTURE_AI_TERMS_MISSING` when
  AI-only fields are absent.

## Revised Spec Excerpt

~~~markdown
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

| `maintainer-recorded-personal-media` | Blocked by default | First-party real-person recording; use `recorded-real-person` generation method. Requires future explicit approval, consent/release record, privacy review, licensing decision, and limitation language before commit. |

Initial `generationMethod` values:

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

Missing `aiGeneratedOutputRightsApproval` fails with
`FIXTURE_AI_TERMS_MISSING`, not the generic `FIXTURE_APPROVAL_REQUIRED`.
`FIXTURE_APPROVAL_REQUIRED` is reserved for missing `maintainerApproval`.

Targeted tests should cover:

- `FIXTURE_AI_TERMS_MISSING` for AI-generated fixture provenance without terms
  metadata;
- a non-AI `generationMethod`, such as `project-authored-scripted`, does not
  trigger `FIXTURE_AI_TERMS_MISSING` when the AI-only terms fields are absent;
~~~

## Output Required

Return:

- PASS or FAIL verdict.
- Whether NB4 is closed.
- Any new blocker introduced by the NB4 fix.
- Explicit statement whether Codex may move SS-014 to implementation.

Focus only on NB4 closure and direct side effects of the NB4 fix.
