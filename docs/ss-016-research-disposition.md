# SS-016 Research Disposition

Status: revised candidate research input for focused Claude QA re-review. No
user-facing docs implementation is approved by this document.

Checked on: 2026-07-01.

## Task

`SS-016 Publish README, limitations, and contributor guide`

Acceptance criteria:

- README explains purpose, local-first design, safety limits, and setup.
- Limitations page covers pose accuracy, camera setup, and non-medical scope.
- Contributor guide explains task workflow, testing, licenses, and SBOM
  expectations.
- Trademark/non-affiliation disclaimer is visible.

## Sensitivity Classification

SS-016 is safety-, privacy-, legal/trademark-, medical-scope-, compliance-,
licensing/SBOM-, docs-claim-, and user-facing-copy-sensitive. It requires
Codex-owned research/spec drafting, Adopt / Revise / Defer / Reject
dispositions, a self-contained Claude QA planning handoff, and Claude gate
clearance before implementation.

## Source Checks

| Source | Checked | Relevant finding |
| --- | --- | --- |
| `README.md` | 2026-07-01 | Current README still describes the early SS-001/SS-004 project state and does not yet cover the current MVP purpose, local-first behavior, limitations, contributor workflow, or visible trademark/non-affiliation disclaimer. |
| `docs/privacy-architecture.md` | 2026-07-01 | Raw swing video and frame pixels are blocked from upload by default; derived landmarks, metrics, prompts, and reports may still be sensitive; remote sharing requires separate explicit opt-in; privacy/deletion/anonymity/compliance guarantees are prohibited. |
| `docs/safety-terms.md` | 2026-07-01 | Swing Sync is educational only and is not medical advice, diagnosis, rehabilitation, pain triage, or professional athletic instruction; user-facing copy must avoid guaranteed safety, injury-prevention, performance, or correctness claims. |
| `docs/licensing.md` | 2026-07-01 | Apache-2.0 is the project license; dependency policy requires license audit, notices, SBOM generation, blocked-license controls, model/SDK review, and a preliminary trademark search before broad public promotion. |
| `docs/models-licensing.md` | 2026-07-01 | Exact MediaPipe Pose Landmarker assets and `@mediapipe/tasks-vision@0.10.35` are approved; future model assets, SDKs, API providers, runtime fetches, or service-worker caching require separate review. |
| `docs/fixture-policy.md` | 2026-07-01 | Test fixtures require provenance and must not imply model accuracy, phase accuracy, biomechanical correctness, safety, anonymity, legal compliance, or guaranteed deletion. Existing mannequin fixture is not evidence of golf-swing accuracy. |
| `package.json` | 2026-07-01 | Node/Vite scripts define `build`, `compliance:verify`, `license:audit`, `sbom:generate`, `safety:verify`, `privacy:verify`, `fixture:verify`, unit tests, and smoke tests. |
| `.github/pull_request_template.md` | 2026-07-01 | PRs must confirm reference integrity and record license audit, SBOM generation, build, and compliance verification. |

## Disposition

| Recommendation or finding | Decision | Rationale |
| --- | --- | --- |
| Publish a README that reflects the current MVP rather than SS-001-only state. | Adopt | Acceptance requires README purpose, local-first design, safety limits, and setup. Current README is outdated relative to later stories. |
| Present Swing Sync as an AI golf swing analysis coach without qualification. | Revise | The package description uses that phrase, but public README copy should immediately qualify the app as local-first and educational, with non-medical and non-professional-coaching limits. |
| Claim raw swing video always stays private, anonymous, deleted, encrypted, or never leaves the device. | Reject | Project policy permits only default local-first/no-upload wording and explicitly prohibits absolute privacy, anonymity, deletion, security, legal, and compliance claims. |
| State raw swing video is not uploaded by default and remote sharing requires separate explicit opt-in. | Adopt | This is the durable privacy architecture boundary and must be visible in public docs. |
| Add or imply telemetry, hosted analytics, remote logging, cloud diagnostics, cloud storage, hidden identifiers, or persistent debug artifacts. | Reject | SS-016 is documentation-only. Debugging wording must be limited to existing local test output, browser devtools, sanitized UI status/error codes, and CI/browser failure artifacts. |
| Create a limitations page covering pose accuracy, camera setup, and non-medical scope. | Adopt | Direct acceptance criterion. The page should also clarify that fixture and smoke-test success does not prove real-world swing accuracy or safety. |
| Make medical, injury, rehabilitation, pain-triage, professional coaching, guaranteed correctness, or injury-prevention claims. | Reject | Blocked by `docs/safety-terms.md` and sensitive-story rules. |
| Provide setup commands using Node 22 and current npm scripts. | Adopt | Matches `.nvmrc`, package scripts, CI expectations, and AGENTS.md verification rules. |
| Document contributor workflow across Notion, `CONTEXT.md`, sensitive-story gates, testing, licenses, fixtures, and SBOM. | Adopt | Direct acceptance criterion and necessary to keep future work synchronized. |
| Add new runtime dependencies, model/provider SDKs, camera capture, workers, telemetry, or remote-sharing behavior for SS-016. | Reject | SS-016 is a docs story. Runtime or dependency changes require separate review and expanded verification. |
| Put a visible trademark/non-affiliation disclaimer in public docs. | Adopt | Direct acceptance criterion. Wording should be narrow: no affiliation, endorsement, sponsorship, or approval is implied. It should not overstate legal conclusions or claim trademark ownership analysis is complete. |
| Treat the public README/limitations/trademark wording as legal-approved release text. | Reject | Existing safety and privacy docs remain draft/human-review oriented. SS-016 should flag that separate human/legal review remains a pre-release gate for public promotion. |
| Rely on manual review alone for prohibited safety, privacy, legal, medical, telemetry, and trademark claims. | Reject | Claude QA planning correctly identified manual-only claim safety as fail-open for a sensitive docs story. SS-016 implementation must add `npm run docs:verify`, wire it into `compliance:verify`, and enforce required disclosures plus banned-pattern categories. |
| Leave the contributor guide path open as `CONTRIBUTING.md` or `docs/contributor-guide.md`. | Reject | Root-level `CONTRIBUTING.md` is now locked because GitHub auto-discovers it and the verification script needs a stable path. |
| Treat one umbrella test case as enough for claim-safety coverage. | Reject | `SS-TC-020` must be decomposed into required-disclosure and per-prohibited-claim-category sub-cases. |
| Mention the current app as an active remote AI coach. | Reject | The README capability summary must explicitly separate current local behavior from SS-012 prompt contracts and the SS-013 inactive remote model adapter scaffold with an empty production provider registry. |

## Candidate Scope

The lowest-risk SS-016 path is documentation-only:

- rewrite `README.md` around current purpose, local-first posture, setup,
  safety/medical limits, current capabilities, project status, verification,
  and visible non-affiliation language;
- add `docs/limitations.md` for pose/camera/non-medical/privacy/export/model
  limitations without guarantees;
- add root-level `CONTRIBUTING.md` for task workflow,
  testing, licensing, fixture, SBOM, Notion, Claude audit, and `CONTEXT.md`
  expectations;
- add dependency-free `scripts/verify-docs-claims.js`, expose it as
  `npm run docs:verify`, and wire it into `npm run compliance:verify`; and
- keep all implementation, dependency, runtime, telemetry, provider, remote
  sharing, and camera-capture behavior unchanged.

## Claude QA Planning Disposition

Claude returned FAIL on the initial SS-016 QA planning prompt. Codex accepts all
five blockers as valid.

| Finding | Decision | Response |
| --- | --- | --- |
| B1: no draft copy existed for required sections except trademark. | Adopt | `docs/ss-016-preimplementation-spec.md` now includes full draft README, limitations, and `CONTRIBUTING.md` prose for focused re-review before implementation. |
| B2: no structural/automated prohibited-claim enforcement. | Adopt | The spec now requires `scripts/verify-docs-claims.js`, `npm run docs:verify`, `compliance:verify` wiring, required heading/string/link checks, draft-banner checks, and banned-pattern categories. |
| B3: capability summary risked overclaiming active AI coaching. | Adopt | Draft README prose now explicitly distinguishes local pose/phase/metric/Swing Card behavior from SS-012 prompt contracts and SS-013's inactive empty-registry remote model scaffold. |
| B4: contributor guide path was unresolved. | Adopt | The path is locked to root-level `CONTRIBUTING.md`. |
| B5: `SS-TC-020` coverage was a single opaque test case. | Adopt | The spec and Notion test case now decompose required disclosures and negative claim checks by category. |

Claude returned FAIL on the focused B1-B5 re-review. Codex accepts B6-B7 as
valid.

| Finding | Decision | Response |
| --- | --- | --- |
| B6: `docs:verify` would false-positive against three draft sentences and had an ambiguous link-presence rule. | Adopt | The spec now rewords the three collisions to avoid the bare trigger terms, keeps the exception model narrow, and requires all three public docs to link to both safety and privacy docs using explicit path forms. |
| B7: `SS-TC-020` needed a golden regression proving `docs:verify` exits zero against exact final docs. | Adopt | The spec and Notion test case now require a golden `docs:verify` zero-exit sub-case against final approved README, limitations, and CONTRIBUTING content. |

Claude returned FAIL on the second focused B6-B7 re-review. Codex accepts B8 as
valid.

| Finding | Decision | Response |
| --- | --- | --- |
| B8: `docs/limitations.md` intro paragraph still used `diagnose` outside the canonical non-medical exception. | Adopt | The limitations intro now avoids restating medical/injury claim vocabulary and points readers to the detailed limits below. |
