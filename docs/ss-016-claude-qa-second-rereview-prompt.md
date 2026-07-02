# SS-016 Claude QA Second Focused Re-Review Prompt

**Superseded for paste use.** Claude returned FAIL on this second focused
B6-B7 re-review. Use `docs/ss-016-claude-qa-b8-rereview-prompt.md` for the
focused B8 closure check.

Paste everything between START and END into Claude Chat for focused
preimplementation QA re-review.

## START

Role: You are the independent adversarial QA planner for Swing Sync.

Stage: Second focused preimplementation QA re-review for SS-016 after focused
B1-B5 re-review returned FAIL.

Scope: Re-review only B6 and B7: the `docs:verify` false-positive/link-rule
fixes and the `SS-TC-020` golden zero-exit sub-case. This is a planning gate,
not an implementation audit.

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
- SS-013 added a fail-closed, provider-neutral model adapter scaffold behind
  explicit consent. It ships with an empty production provider registry and no
  provider SDKs, keys, remote calls, telemetry, remote logging, cloud storage,
  raw media upload, new dependencies, or model/provider assets.

Acceptance criteria:
- README explains purpose, local-first design, safety limits, and setup.
- Limitations page covers pose accuracy, camera setup, and non-medical scope.
- Contributor guide explains task workflow, testing, licenses, and SBOM
  expectations.
- Trademark/non-affiliation disclaimer is visible.

Prior focused re-review status:
- B1 closed.
- B3 closed.
- B4 closed.
- B5 substantially closed but required B7.
- B2 remained open as B6.

Remaining blockers to re-review:
- B6: `docs:verify` would false-positive against three draft sentences and had
  an ambiguous link-presence rule.
- B7: `SS-TC-020` needed a golden regression sub-case proving `docs:verify`
  exits zero against the exact final approved README, limitations, and
  CONTRIBUTING content.

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

## B6 Response: Reworded Draft Sentences

Claude identified three verifier collisions. Codex chose the rewording path,
not bespoke exceptions.

1. `docs/limitations.md`, `Pose And Metric Limits`

Previous draft:

> Low-confidence, missing, or inconsistent landmarks should be interpreted as a
> reason to review the video manually or record another clip, not as a diagnosis
> of the user's movement.

Revised draft:

> Low-confidence, missing, or inconsistent landmarks should be interpreted as a
> reason to review the video manually or record another clip, not as a statement
> about the user's health or movement quality.

2. `docs/limitations.md`, `Privacy And Export Limits`

Previous draft:

> Derived landmarks, metrics, selected images, prompts, reports, and model
> outputs may still be sensitive or identifying. Browser storage and downloaded
> files are affected by browser, operating-system, device, and user settings.
> Swing Sync cannot guarantee that browser data is retained, erased, anonymous,
> or protected outside the app's controls.

Revised draft:

> Derived landmarks, metrics, selected images, prompts, reports, and model
> outputs may still be sensitive or identifying. Browser storage and downloaded
> files are affected by browser, operating-system, device, and user settings.
> Swing Sync cannot guarantee that browser data is retained, erased, kept
> private, or protected outside the app's controls.

3. `CONTRIBUTING.md`, `Licensing, References, Fixtures, And Models`

Previous draft:

> Follow `docs/fixture-policy.md` before adding or changing fixtures. Do not
> commit raw personal swing video, unidentified third-party media, unclear media
> rights, hidden identifiers, or fixtures that imply real-world accuracy,
> safety, anonymity, deletion, or legal compliance.

Revised draft:

> Follow `docs/fixture-policy.md` before adding or changing fixtures. Do not
> commit raw personal swing video, unidentified third-party media, unclear media
> rights, personally identifying material, or fixtures that imply real-world
> accuracy, safety, anonymity, deletion, or legal compliance.

## B6 Response: Resolved Link Rule

The ambiguous "where applicable" rule is removed. The verifier must require all
three public docs to link to both safety and privacy docs, with explicit path
forms appropriate to each file:

- `README.md`: `./docs/safety-terms.md` and
  `./docs/privacy-architecture.md`.
- `docs/limitations.md`: `./safety-terms.md` and
  `./privacy-architecture.md`.
- `CONTRIBUTING.md`: `docs/safety-terms.md` and
  `docs/privacy-architecture.md`.

Draft `docs/limitations.md` now adds:

> See [Safety terms draft](./safety-terms.md) and
> [Privacy architecture](./privacy-architecture.md) for the current project
> boundaries.

Draft `CONTRIBUTING.md` now adds:

> See [Safety terms draft](docs/safety-terms.md) and
> [Privacy architecture](docs/privacy-architecture.md) for the current project
> boundaries.

## B6 Response: Manual Dry-Run Result

Codex manually dry-ran the complete banned-pattern list from the revised spec
against the exact revised final draft prose for `README.md`,
`docs/limitations.md`, and `CONTRIBUTING.md`.

Result: zero unresolved matches.

Allowed matches are limited to the already planned canonical exceptions:

- the non-medical educational boundary sentence that says Swing Sync is not
  medical advice, pain diagnosis, rehabilitation guidance, physical therapy, or
  a substitute for qualified care/coaching;
- the draft-review boundary sentence that says the draft safety/privacy docs
  are not legal advice and do not guarantee privacy, safety, deletion,
  anonymity, or regulatory compliance;
- prohibited-claim terms that appear only inside the checker's own banned-term
  fixture strings, not public docs.

No bespoke exceptions are needed for the three B6 collision sentences after the
rewording above.

## B7 Response: Golden SS-TC-020 Sub-Case

`SS-TC-020` and `docs/ss-016-preimplementation-spec.md` now require:

> Golden regression that `docs:verify` executes against the exact final
> approved content of `README.md`, `docs/limitations.md`, and
> `CONTRIBUTING.md` and exits zero, with no banned-pattern false positives and
> no missing-link failures.

Verification:
- Planning artifact verification: `git diff --check` PASS after B6/B7
  revisions.
- No public docs or script implementation has started.

Known non-goals:
- Do not implement README, limitations, CONTRIBUTING, or `docs:verify` before
  this focused QA planning gate passes or blockers are resolved and re-reviewed.
- Do not add runtime behavior, telemetry, logging, analytics, dependencies,
  model/provider integrations, camera capture, workers, service workers, cloud
  storage, remote sharing, raw media fixtures, or API routes.

Output required:
- PASS/FAIL verdict for implementation start.
- For B6 and B7, state closed or still blocking.
- New blockers, if any, ordered by severity with exact required changes.
- Non-blocking recommendations separated from blockers.
- Required verification changes before implementation or PR.
- Explicit sign-off status for whether Codex may begin SS-016 docs and
  `docs:verify` implementation.

## END
