# SS-016 Claude QA B8 Focused Re-Review Prompt

Paste everything between START and END into Claude Chat for focused
preimplementation QA re-review.

## START

Role: You are the independent adversarial QA planner for Swing Sync.

Stage: Final focused preimplementation QA re-review for SS-016 after B8 was
found.

Scope: Re-review only B8: the remaining `diagnose` banned-term collision in
the `docs/limitations.md` intro paragraph, plus the reported complete
banned-pattern dry-run result. This is a planning gate, not an implementation
audit.

Context:
Swing Sync is a local-first browser app for educational golf swing analysis.
Codex is acting as the SS-016 research/spec owner. Claude remains the
independent QA planning and final audit reviewer. Assume you cannot read the
repository, GitHub, or Notion; all relevant context is included below.

Current repository state:
- Default branch: `main`.
- SS-016 branch: `ss-016-docs`, created from `main` at
  `b03efbb46578c19119b4b7d286ebc8be97d6749f`.
- SS-016 remains at `2. QA Planning (Claude)`.
- No public docs implementation has started. Only planning artifacts and Notion
  test-case text have been revised.

Acceptance criteria:
- README explains purpose, local-first design, safety limits, and setup.
- Limitations page covers pose accuracy, camera setup, and non-medical scope.
- Contributor guide explains task workflow, testing, licenses, and SBOM
  expectations.
- Trademark/non-affiliation disclaimer is visible.

Prior status:
- B1, B3, and B4 are closed.
- B5 is substantially closed with the B7 golden regression added.
- The original B6 collisions and ambiguous link rule are fixed.
- B7's golden `docs:verify` zero-exit sub-case is correctly specified.
- Remaining blocker B8: `docs/limitations.md` intro paragraph still contained
  `diagnose`, outside the canonical non-medical exception.

Protected boundaries:
- Raw swing video and frame pixels must not be uploaded, sent to model
  providers, or shared with remote services unless a future separately reviewed
  feature adds explicit opt-in.
- Derived landmarks, metrics, prompts, reports, selected images, and model
  outputs may still be sensitive or identifying.
- Do not make absolute privacy, deletion, anonymity, legal, compliance, safety,
  medical, injury-prevention, professional coaching, trademark-clearance, or
  guaranteed correctness claims.
- Do not add telemetry, remote logging, hosted analytics, cloud diagnostics,
  cloud storage, hidden identifiers, new workers, provider SDKs,
  provider/model assets, new dependencies, camera capture, raw personal video
  fixtures, service workers, API routes, secrets, or remote-sharing behavior.

Relevant source contents or focused diff:
No SS-016 public docs implementation diff exists yet. Codex revised the
planning contract only.

## B8 Response: Reworded `docs/limitations.md` Intro

Previous draft:

> Swing Sync provides educational golf swing review in a local-first browser
> app. It is designed to support practice notes and visual inspection, not to
> certify swing correctness, diagnose pain, prevent injury, or replace qualified
> medical care or professional golf coaching.

Revised draft:

> Swing Sync provides educational golf swing review in a local-first browser
> app. It is designed to support practice notes and visual inspection. The
> detailed educational, safety, privacy, and fixture limits below define what
> the app does and does not claim.

Codex chose trimming over another near-miss wording because the canonical
non-medical disclaimer already appears later in `Educational And Non-Medical
Scope`.

## Manual Banned-Pattern Dry-Run Result

Codex manually reran the complete banned-pattern list from the revised spec
against the exact revised final draft prose for `README.md`,
`docs/limitations.md`, and `CONTRIBUTING.md`.

Result: zero unresolved matches.

Allowed matches are limited to:

- the canonical non-medical educational boundary sentence that says Swing Sync
  is not medical advice, pain diagnosis, rehabilitation guidance, physical
  therapy, or a substitute for qualified care/coaching. In implementation, this
  means the exact sentence `It is not medical advice, pain diagnosis,
  rehabilitation guidance, physical therapy, or a substitute for qualified
  medical care or professional golf coaching.` and the README variant prefixed
  with `Swing Sync is not`;
- the canonical draft-review boundary sentence that says the draft
  safety/privacy docs are not legal advice and do not guarantee privacy,
  safety, deletion, anonymity, or regulatory compliance;
- prohibited-claim terms that appear only inside the future checker's own
  banned-term fixture strings, not public docs.

No bespoke exception is needed for the B8 intro paragraph after this revision.

## Unchanged From Prior Review

- The original B6 `diagnosis`, `anonymous`, and `hidden identifiers` collisions
  remain fixed.
- The safety/privacy link rule remains deterministic and applies to all three
  public docs with explicit path forms.
- `SS-TC-020` still requires a golden regression that `docs:verify` executes
  against the exact final approved content of `README.md`,
  `docs/limitations.md`, and `CONTRIBUTING.md` and exits zero.

Verification:
- Targeted text check confirms `diagnose pain` and `prevent injury` are absent
  from `docs/ss-016-preimplementation-spec.md`.
- Planning artifact verification: `git diff --check` PASS after B8 revision.
- No public docs or script implementation has started.

Known non-goals:
- Do not implement README, limitations, CONTRIBUTING, or `docs:verify` before
  this focused QA planning gate passes or blockers are resolved and re-reviewed.
- Do not add runtime behavior, telemetry, logging, analytics, dependencies,
  model/provider integrations, camera capture, workers, service workers, cloud
  storage, remote sharing, raw media fixtures, or API routes.

Output required:
- PASS/FAIL verdict for implementation start.
- For B8, state closed or still blocking.
- New blockers, if any, ordered by severity with exact required changes.
- Non-blocking recommendations separated from blockers.
- Required verification changes before implementation or PR.
- Explicit sign-off status for whether Codex may begin SS-016 docs and
  `docs:verify` implementation.

## END
