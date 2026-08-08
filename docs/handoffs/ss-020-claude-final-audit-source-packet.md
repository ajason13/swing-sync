# SS-020 Claude Final Audit Source Packet

## Paste instruction
Paste this entire packet immediately after `ss-020-claude-final-audit-prompt.md`. Together, the prompt and this complete packet are the two supplied delivery-wrapper files. Claude Chat has no repository, GitHub, or Notion access.

## Manifest
- Baseline: `0509999e7de5e609787fe53e8bdac2747aa0be64`.
- Implementation content ends at `eb9b7cb` (`docs: add SS-020 release review gate`); coordination and audit-wrapper artifacts follow in repository history. Wrapper contents are supplied verbatim rather than recursively self-diffed.
- Current branch: `ss-020-release-review-gate`.
- Every changed tracked file after delivery artifacts are committed is enumerated here: 13 substantive baseline-relative files are enclosed as a complete unified diff; two delivery-wrapper files are supplied verbatim in this chat handoff to avoid a circular self-diff.
- Protected unchanged runtime boundary: no runtime TypeScript, HTML, manifest, service-worker, package/dependency/lockfile, provider/model, persistence, network, telemetry, logging, diagnostics, export-format, or deployment file changed.
- Observability: intentionally unchanged; no runtime observability was added or deferred as a separate scope item.
- Protected excluded files: exactly nine intentional untracked `docs/agent-guidance/` files are out of scope and were not touched.

### Substantive baseline-relative tracked files (13; complete diff enclosed)
- `CONTEXT.md` — 4077 lines, 235526 bytes, SHA-256 `5f51edc348e8c65a7272f4c263b0499c0d83f9512f4d44a11298bdf84ebd0d85`
- `CONTRIBUTING.md` — 135 lines, 4775 bytes, SHA-256 `10bedeead2facf670446686a061803df6b3b128188c35d8ef19ccb5cf5ae93d0`
- `README.md` — 108 lines, 3495 bytes, SHA-256 `f36e7a49a80b9ea45fc559b0ac6d7150ba300bd99a1cf0ee40782fe6eb6ad4e7`
- `docs/limitations.md` — 87 lines, 3980 bytes, SHA-256 `f97d467f8a9ab3d7903142a880a4d332e9529352871365a79c819a41b2b021a4`
- `docs/privacy-architecture.md` — 203 lines, 9521 bytes, SHA-256 `f471b0d1b1f43b17261cbfdb8116fb6a95186c3da0f63e7362536fe2c07234b5`
- `docs/release-review-gate.md` — 342 lines, 48552 bytes, SHA-256 `66d237a39a8bfc6d627286e8aac61c6549e3ff0e33e33f7d67475c67c76619f6`
- `docs/safety-terms.md` — 120 lines, 5649 bytes, SHA-256 `8d691ddf1f339c67bfebb9e5ed082a04ce906fcba978f60b7a18d4d31338eda0`
- `docs/ss-020-gemini-research-prompt.md` — 504 lines, 26633 bytes, SHA-256 `8dd03d621cf3e561628fa2ed1419abfac404b9aac3be6763050fdb4c1e5834a9`
- `docs/ss-020-preimplementation-spec.md` — 462 lines, 19957 bytes, SHA-256 `bc47109428945e87c92d5ecb9c7e46da447ec847eea87a04e3f605e2ac383b7c`
- `docs/ss-020-research-disposition.md` — 142 lines, 7620 bytes, SHA-256 `4335970c489efd2608837ee928d1b3fef42d5892d4146ef8d3e3d749f530e944`
- `docs/ss-020-research-notes.md` — 396 lines, 24503 bytes, SHA-256 `21a6cd5ac7a05edda052c8732351d438f0a2164f760aed28f689f0fb6452d9d5`
- `scripts/verify-docs-claims.js` — 737 lines, 26666 bytes, SHA-256 `1af6209d1a00b6c2b6fcd79739fcbec9b78466dc27d56a666841b2136e58a383`
- `test/unit/docs-claims.test.ts` — 543 lines, 19476 bytes, SHA-256 `205ac519034ce676dbaac2a693607168717c326caf3e9433c51fec7f16b47748`

### Delivery-wrapper tracked files (2; supplied verbatim, not recursively diffed)
- `docs/handoffs/ss-020-claude-final-audit-prompt.md` — 126 lines, 5987 bytes, SHA-256 `a4ed4fa888a623895e8d891a10f489ba99214e541a21d813a7714c40e7a9b34e`; supplied first in full.
- `docs/handoffs/ss-020-claude-final-audit-source-packet.md` — supplied second in full as this document; intentionally not self-hashed or recursively diffed because that would be circular.

### Scope classification
- Coordination: `CONTEXT.md`.
- Research/specification/history: `docs/ss-020-research-notes.md`, `docs/ss-020-research-disposition.md`, `docs/ss-020-preimplementation-spec.md`, and `docs/ss-020-gemini-research-prompt.md` (superseded for paste use; retained as historical evidence).
- Approved implementation files: `docs/release-review-gate.md`, `README.md`, `CONTRIBUTING.md`, `docs/limitations.md`, `docs/safety-terms.md`, `docs/privacy-architecture.md`, `scripts/verify-docs-claims.js`, and `test/unit/docs-claims.test.ts`.

## Complete focused unified diff for substantive files
```diff
diff --git a/CONTEXT.md b/CONTEXT.md
index 0ab84df..8b4e40e 100644
--- a/CONTEXT.md
+++ b/CONTEXT.md
@@ -12,9 +12,11 @@ Last updated: 2026-08-08
   `6872897475786e41cc434374224236854bde2846`.
 - Current completed task:
   `SS-019 Perform accessibility and responsive design hardening`.
-- Active task: none. Next backlog task:
+- Active task:
   `SS-020 Prepare human legal/privacy/safety release review gate`.
-- Active branch: `main`.
+- Active branch: `ss-020-release-review-gate`, created from refreshed `main`
+  commit `0509999e7de5e609787fe53e8bdac2747aa0be64`.
+- SS-020 handshake status: `4. Final Audit (Claude)`.
 - SS-019 handshake status: `5. Done`.
 - Latest Pull Request: [PR #20](https://github.com/ajason13/swing-sync/pull/20),
   merged on 2026-08-08.
@@ -31,6 +33,153 @@ Last updated: 2026-08-08
 - Remaining visible non-Done backlog tasks: SS-020 through SS-022, created
   from the manual app-readiness gap review on 2026-07-03.

+## SS-020 Coordination
+
+SS-020 is legal-, privacy-, safety-, medical-scope-, trademark-, and
+release-governance-sensitive. It is operating in Gated Delivery Mode. The
+board's `1. Spec Drafting (Gemini)` label is retained for legacy compatibility,
+but the current owner is Codex as Deep Researcher and Specification Drafter.
+Gemini may supplement only; the human decision is that Gemini free-plan Deep
+Research is unavailable. Codex owns repository implementation and verification,
+Claude owns independent final adversarial audit, and qualified human reviewers
+own future legal, privacy, safety, trademark, and public-release decisions.
+Specialist and research outputs are advice requiring lead-architect
+disposition.
+
+Kickoff state on 2026-08-08:
+
+- `git fetch origin` completed successfully. Local `main` and `origin/main`
+  remain synchronized at post-merge context commit
+  `0509999e7de5e609787fe53e8bdac2747aa0be64`; PR #20 is merged as
+  `6872897475786e41cc434374224236854bde2846`.
+- The story branch `ss-020-release-review-gate` was created directly from the
+  confirmed `0509999e7de5e609787fe53e8bdac2747aa0be64` baseline.
+- Live Notion task:
+  https://app.notion.com/p/392834a0c8a6818b9f8cecd0debacbf6
+- Notion fields were confirmed before branching: Name
+  `SS-020 Prepare human legal/privacy/safety release review gate`, Branch
+  `ss-020-release-review-gate`, Handshake Status `0. Backlog`, Pull Request
+  empty, and Task Type `Research`. The task was then moved to
+  `1. Spec Drafting (Gemini)` with the branch retained and Pull Request empty.
+- Initial kickoff records are committed at
+  `845a5324d98f01406c14f21732556ebc1184f679` (`docs: start SS-020 release
+  review research`). `docs/ss-020-gemini-research-prompt.md` is historical and
+  superseded for paste use; do not wait for or solicit a Gemini response as an
+  implementation gate. Codex Deep Researcher/Specification Drafter now owns
+  research and the candidate specification. The Lead Architect remains the
+  disposition authority; Builder edits have not started.
+- Role pins: Lead Architect approves delivery mode, scope, acceptance mapping,
+  document ownership, and verification; Codex Deep Researcher/Specification
+  Drafter verifies primary sources and drafts the specification; Builder later
+  implements only the approved scope; Workflow Coordinator records durable
+  state without changing technical direction; Claude independently audits the
+  final package; qualified humans alone may provide legal/privacy/safety,
+  trademark, or release clearance.
+- The narrow docs-only governance exception is used to omit a separate
+  preimplementation Claude QA-planning round: this story changes no runtime,
+  dependency, data flow, provider, deployment, or exported-data behavior;
+  material current external facts must be checked against primary sources with
+  URLs and 2026-08-08 access dates; and independent final Claude audit remains
+  required. The exception does not waive lead approval, final Claude audit, or
+  future qualified-human release review.
+- Required later gates are: Codex research/specification and Lead Architect
+  disposition with approved implementation-ready scope; Codex documentation/
+  verifier implementation and Node 22 verification; Claude final adversarial
+  audit and explicit PR-preparation decision; PR creation; merge; and
+  post-merge synchronization.
+  Qualified-human legal/privacy/safety sign-off remains a future public-release
+  gate and must not be represented as completed by this story or Claude.
+- Runtime observability is intentionally unchanged because SS-020 is
+  documentation/release governance only. No telemetry, analytics, remote
+  logging, cloud diagnostics, runtime feature, provider/model, persistence,
+  service-worker, exported-data, remote-sharing, or deployment change is in
+  scope.
+- Exactly nine intentional untracked files under `docs/agent-guidance/` remain
+  preserved byte-for-byte and out of scope. No dependency, licensing, bundle,
+  notices, or SBOM surface has changed.
+- Pull Request: none. Claude audit: not started. Human release review/sign-off:
+  not started. Next owner: Codex Deep Researcher/Specification Drafter.
+  Minimum next action: complete Codex-owned primary-source research and
+  candidate specification, then obtain Lead Architect disposition. This
+  establishes an operational future human gate; it is not human, legal,
+  privacy, safety, trademark, medical, compliance, or release approval.
+
+Implementation-ready transition on 2026-08-08:
+
+- Codex research is committed at `03f18d4a0d8f9953bd6db54c393594a1b35a62c1`
+  (`docs: record SS-020 Codex research`); the independently reviewed Lead
+  Architect approval is committed at
+  `913718c9c4de6b36a14cb81e3567c92654fc3da2`
+  (`docs: approve SS-020 implementation scope`) and returned exact
+  `APPROVED FOR BUILDER`. The research-routing and Architect write-delegate
+  attempts stalled; the primary Codex research/specification fallback was
+  followed by independent Lead Architect review and disposition. This records
+  an availability exception, not a silent role or technical-direction change.
+- Approved artifacts: `docs/ss-020-research-notes.md`,
+  `docs/ss-020-research-disposition.md`, and
+  `docs/ss-020-preimplementation-spec.md`. The historical
+  `docs/ss-020-gemini-research-prompt.md` remains superseded for paste use.
+- Lead dispositions: Adopt one canonical, currently blocked release-review
+  package; traceable claim inventory, evidence taxonomy, qualified-reviewer
+  checklist, open-decision/source register, SS-002 legal blocker, scoped future
+  outcomes, and declarative verifier coverage. Revise approval, privacy,
+  trademark-search, and stale export wording into bounded factual or
+  reviewer-scoped language. Defer actual human signatures and decisions,
+  jurisdiction/territory/audience/business/host/trademark choices, SS-021,
+  SS-022, and other runtime-copy changes. Reject any automated or AI clearance,
+  SS-002 draft rewrite, absolute/professional claims, runtime/data/deployment
+  changes, parallel verifier, or changes to historical packets/protected files.
+- Builder is authorized only for these eight files:
+  `docs/release-review-gate.md`, `README.md`, `CONTRIBUTING.md`,
+  `docs/limitations.md`, `docs/safety-terms.md`,
+  `docs/privacy-architecture.md`, `scripts/verify-docs-claims.js`, and
+  `test/unit/docs-claims.test.ts`. The sole approved factual correction is the
+  bounded current-behavior export paragraph in `docs/privacy-architecture.md`;
+  it is not privacy approval. Any other tracked surface or runtime, dependency,
+  licensing, bundle, notice, SBOM, deployment, or data-flow change stops work
+  for renewed Lead Architect approval.
+- Verifier contract: extend only the existing declarative
+  `files`/`requiredStrings`/`crossFileChecks` registries and injected reader in
+  `scripts/verify-docs-claims.js`; add named adversarial unit cases for missing
+  files, formatting changes, empty values, embedded delimiters, fail-closed
+  paths, and positive paths. Do not add a policy parser or parallel verifier.
+- Builder must use Node 22 and record exact results for
+  `npm run test:unit -- docs-claims --reporter=verbose`, `npm run docs:verify`,
+  `npm run safety:verify`, `npm run privacy:verify`,
+  `npm run compliance:verify`, `npm run build`, and `git diff --check`.
+  Observability remains unchanged; no runtime telemetry, logging, diagnostics,
+  or behavior is authorized.
+- Implementation is recorded at `eb9b7cb` (`docs: add SS-020 release review
+  gate`) after the approved baseline commits `845a532`, `03f18d4`, `913718c`,
+  and `a802532`. Internal Lead disposition is `APPROVED FOR CLAUDE AUDIT` and
+  Codex research is `PASS`; these are engineering gate inputs, not Claude or
+  qualified-human approval.
+- The independent-audit handoff is ready at
+  `docs/handoffs/ss-020-claude-final-audit-prompt.md` with its companion
+  `docs/handoffs/ss-020-claude-final-audit-source-packet.md`. The source packet
+  enumerates the complete focused diff from baseline
+  `0509999e7de5e609787fe53e8bdac2747aa0be64` for all 13 changed tracked files,
+  including this context, research/specification records, the superseded Gemini
+  prompt, and the eight approved implementation files. It must be pasted with
+  the prompt because Claude Chat has no repository access.
+- Verification on Node `22.22.3` passed: targeted `docs-claims` 36/36,
+  `npm run docs:verify`, `npm run safety:verify`, `npm run privacy:verify`,
+  `npm run compliance:verify`, `npm run build`, and `git diff --check`.
+  Runtime observability is intentionally unchanged: no telemetry, analytics,
+  logging, diagnostics, providers, persistence, data flow, or deployment
+  behavior changed.
+- Notion is now `4. Final Audit (Claude)`; branch remains
+  `ss-020-release-review-gate` and Pull Request remains empty. Claude must
+  return `PASS` and explicitly permit PR preparation before a PR may be
+  prepared. `PASS WITH MINOR FIXES` requires fixes, verification, and focused
+  re-review; `FAIL` blocks PR preparation. PR creation, merge, and post-merge
+  synchronization remain separate later gates. The future qualified-human
+  release gate is deliberately not a package-merge prerequisite, and no human,
+  legal, privacy, safety, trademark, medical, compliance, or release approval
+  has occurred.
+- Exactly nine intentional untracked `docs/agent-guidance/` files remain
+  preserved byte-for-byte and out of scope.
+
 ## SS-019 Coordination

 SS-019 is accessibility-, frontend-runtime-, user-facing-behavior-,
diff --git a/CONTRIBUTING.md b/CONTRIBUTING.md
index 778dcbe..0bc136d 100644
--- a/CONTRIBUTING.md
+++ b/CONTRIBUTING.md
@@ -120,7 +120,8 @@ release-of-liability language.

 See [Safety terms draft](docs/safety-terms.md) and
 [Privacy architecture](docs/privacy-architecture.md) for the current project
-boundaries.
+boundaries. The [release review gate](docs/release-review-gate.md) records the
+pending qualified-human review package for any future public release.

 For runtime changes, state whether observability was added, intentionally
 unchanged, or deferred. For SS-016 docs-only work, no new runtime observability
diff --git a/README.md b/README.md
index f8dc6dc..53b1694 100644
--- a/README.md
+++ b/README.md
@@ -82,6 +82,8 @@ npm run sbom:generate

 ## Documentation

+- [Release review gate](./docs/release-review-gate.md) — current public-release
+  decision remains pending qualified-human review.
 - [Limitations](./docs/limitations.md)
 - [Deployment](./docs/deployment.md)
 - [Contributor guide](./CONTRIBUTING.md)
diff --git a/docs/limitations.md b/docs/limitations.md
index bb7f885..56fe216 100644
--- a/docs/limitations.md
+++ b/docs/limitations.md
@@ -83,4 +83,5 @@ safety, deletion, anonymity, or regulatory compliance.

 See [Safety terms draft](./safety-terms.md) and
 [Privacy architecture](./privacy-architecture.md) for the current project
-boundaries.
+boundaries. The [release review gate](./release-review-gate.md) records the
+pending qualified-human review package for any future public release.
diff --git a/docs/privacy-architecture.md b/docs/privacy-architecture.md
index a776bf6..958a7b1 100644
--- a/docs/privacy-architecture.md
+++ b/docs/privacy-architecture.md
@@ -6,6 +6,9 @@ This document defines Swing Sync's local-first privacy architecture for future
 video analysis work. It is product and engineering guidance, not legal advice
 or a guarantee of privacy, security, deletion, or regulatory compliance.

+The [release review gate](./release-review-gate.md) records the pending
+qualified-human review package for any future public release.
+
 ## Default Privacy Posture

 Swing Sync must process swing video locally by default. Raw swing video and
@@ -13,11 +16,11 @@ frame pixels must not be uploaded, sent to model providers, or shared with
 remote services unless a future feature adds a separate, explicit opt-in flow
 for that action.

-The current application implements local file selection and local Pose
-Landmarker inference for sampled video frames. It does not implement camera
-capture, raw-video or landmark persistence, exports, remote sharing, or remote
-model APIs. The current consent acknowledgement is a local scaffold, not a
-durable legal or privacy record.
+The current application implements local file selection, local Pose Landmarker
+inference, and user-initiated local Swing Card PNG, print/PDF, and prompt-copy
+workflows. It does not implement camera capture, raw-video or landmark
+persistence, remote sharing, or remote model APIs. The current consent
+acknowledgement is a local scaffold, not a durable legal or privacy record.

 ## Data Classes

diff --git a/docs/release-review-gate.md b/docs/release-review-gate.md
new file mode 100644
index 0000000..43bcf21
--- /dev/null
+++ b/docs/release-review-gate.md
@@ -0,0 +1,342 @@
+# Release Review Gate
+
+## Current Status
+
+**DRAFT — HUMAN REVIEW PACKAGE**
+
+**Current outcome: PENDING**
+
+**PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED**
+
+This package records no legal, privacy, safety, medical, trademark, compliance,
+or public-release clearance. Claude and automated checks cannot substitute for
+qualified human reviewers. A verifier pass establishes only the bounded
+document structure and repository facts that the verifier checks.
+
+SS-002 qualified legal review of the assumption-of-risk and
+release-of-liability language is not completed and blocks public release.
+
+## Evidence Taxonomy
+
+Every inventory, checklist, and decision entry uses one of these exact
+classifications:
+
+1. `Code/test-enforced fact` — behavior or content supported by named current
+   source and bounded automated evidence.
+2. `Documented design intent` — an intended boundary or future requirement;
+   not proof that every path implements it.
+3. `Unresolved assumption` — a release fact or applicability question that the
+   repository does not establish.
+4. `Qualified-human review required` — a decision reserved for an accountable
+   reviewer with relevant qualifications and a named release scope.
+5. `Deferred / non-goal` — work explicitly outside this package and not
+   completed by merging it.
+
+Design intent must not be reported as an implemented fact. Automated
+verification and AI audit must not be reported as human approval.
+
+## Public-Language Inventory
+
+Locations use a heading, exported symbol, metadata field, or representative
+string so that reviewers can find the claim without relying on mutable line
+numbers. `Pending` means evidence or an accountable human decision is still
+required for a public release; it does not mean the wording is rejected.
+
+| Source and stable location | Claim category | Statement or faithful summary | Audience / surface | Evidence classification | Supporting evidence | Review concern / open question | Accountable owner / reviewer type | Evidence or decision required | Release-blocking | Current disposition |
+| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
+| `README.md` — title and opening paragraph | Purpose | Local-first browser app for educational golf swing review, pose-derived movement inspection, and Swing Card notes | Repository visitors | `Qualified-human review required` | README; current runtime workflow | Does the overall purpose create an accurate consumer impression? | Product/release owner; safety/medical-scope reviewer | Named-scope intended-use and net-impression decision | Yes | Pending |
+| `README.md` — opening non-medical paragraph | Medical scope | Not medical advice, diagnosis, rehabilitation, physical therapy, or a substitute for qualified care/coaching | Repository visitors | `Qualified-human review required` | Safety draft; runtime acknowledgement | Is the disclaimer prominent and sufficient for intended audience/use? | Qualified safety/medical-scope and legal reviewers | Intended-use, audience, and wording decisions | Yes | Pending |
+| `README.md` — `Current Capabilities` | Current capability | Local selection/inference, phases, metrics, review, and local export/copy; empty production remote-provider registry | Repository visitors | `Code/test-enforced fact` | `src/app-renderer.ts`; `src/model-consent.ts`; unit/smoke tests | Is the summary complete and appropriately bounded for the candidate? | Engineering owner; product/release owner | Candidate build and named verification evidence | Yes | Pending |
+| `README.md` — `Local-First Design`, current-behavior sentences | Privacy and export | Raw video is not uploaded by default; derived/exported data can remain sensitive and leaves app control after download | Repository visitors | `Code/test-enforced fact` | Current runtime/export source; privacy verifier; smoke network/export paths | Browser and environment evidence is bounded; manual sharing leaves app control | Privacy reviewer; engineering owner | Frozen-candidate data-flow inventory, tested build, and privacy disposition | Yes | Pending |
+| `README.md` — `Local-First Design`, “Any future feature” sentence | Future remote consent | Future outbound raw video, pixels, landmarks, metrics, prompts, reports, or outputs must use separate explicit opt-in | Repository visitors and implementers | `Documented design intent` | README; privacy architecture; repository governance | Future enforcement and provider/destination specifics are not current implementation facts | Privacy/legal reviewer; future engineering owner | Approved future spec, provider/data review, consent design, and tests | No for current local candidate | Deferred / non-goal |
+| `README.md` — draft-review paragraph | Review status | Safety and privacy documents remain drafts and make no guarantees | Repository visitors | `Documented design intent` | Safety/privacy draft banners; docs verifier | Is draft status sufficiently visible wherever claims are published? | Legal/privacy/safety reviewers; release owner | Publication-surface review | Yes | Pending |
+| `README.md` — `License` | License | Project source is Apache-2.0; other reuse is governed by linked policies | Repository visitors and distributors | `Qualified-human review required` | `LICENSE`; policy and audit records | Are all candidate artifacts, notices, and distribution duties covered? | Licensing reviewer; release owner | Candidate-specific license/notice review | Yes | Pending |
+| `README.md` — `Non-Affiliation` | Affiliation and third-party names | Independent project; no endorsement; third-party names belong to their owners | Repository visitors | `Qualified-human review required` | Canonical README text; docs verifier | Disclaimer is not trademark clearance; name/branding still need review | Qualified trademark/legal reviewer | Preliminary search evidence and branding decision | Yes | Pending |
+| `CONTRIBUTING.md` — `Safety, Privacy, And Claims` | Contributor claims boundary | Educational/non-medical and local-first rules apply; draft claims remain pending review | Contributors | `Documented design intent` | Safety/privacy docs; contribution workflow | Do contributor gates cover every public-copy and implementation path? | Maintainer; legal/privacy/safety reviewers | Workflow review and candidate diff | Yes | Pending |
+| `CONTRIBUTING.md` — SS-002 pre-release sentence | Legal gate | SS-002 assumption-of-risk and release-of-liability language requires legal/human review | Contributors and release owners | `Qualified-human review required` | Safety draft; SS-002 disposition | Jurisdiction, enforceability, parties, consent, and age/capacity are unresolved | Qualified legal reviewer | Scoped written legal decision | Yes | Pending |
+| `docs/safety-terms.md` — draft banner and opening | Safety/legal status | Review-ready product draft; not legal advice or an enforceability guarantee | Reviewers and repository readers | `Qualified-human review required` | Draft banner; safety verifier | Has a qualified reviewer assessed the exact candidate and scope? | Qualified legal and safety reviewers | Authenticated, scoped comments and sign-off | Yes | Pending |
+| `docs/safety-terms.md` — `Intended Use` | Medical and product scope | Educational feedback; excludes medical, rehabilitation, diagnosis, triage, and professional instruction | Users/reviewers | `Qualified-human review required` | Runtime acknowledgement; coaching guardrails | Overall intended use and consumer impression remain unresolved | Safety/medical-scope and legal reviewers | Named intended-use and audience decision | Yes | Pending |
+| `docs/safety-terms.md` — `Assumption of Risk Draft` | Physical risk | Describes voluntary practice risks and user responsibility | Users/reviewers | `Qualified-human review required` | SS-002 disposition; runtime acknowledgement | Jurisdiction, enforceability, conspicuousness, and parties | Qualified legal reviewer | Exact-language legal disposition for named territories | Yes | Pending |
+| `docs/safety-terms.md` — `Release of Liability Draft` | Liability | Draft limitation/release language with applicable-law qualifier | Users/reviewers | `Qualified-human review required` | SS-002 disposition | Rights, waiver limits, entities, contributors, distributors, and local law | Qualified legal reviewer | Exact-language legal disposition for named release scope | Yes | Pending |
+| `docs/safety-terms.md` — `Consent Gate Requirement` | Consent | First analysis is blocked until local acknowledgement; consent storage is minimal and local | Users and implementers | `Code/test-enforced fact` | `src/app-renderer.ts`; `src/consent-state.ts`; unit/smoke tests | Legal meaning, conspicuousness, age/capacity, and retention remain unresolved | Legal/privacy reviewer; engineering owner | UX evidence, data evidence, and consent decision | Yes | Pending |
+| `docs/safety-terms.md` — `Educational Feedback Boundary`; current `src/coaching-prompt.ts` and `src/coaching-contract.ts` enforcement | Current educational-feedback safety | Current coaching contracts prohibit medical diagnosis, unsafe prescriptions, and guarantees and bound generated observations to available evidence | Users and implementers | `Code/test-enforced fact` | Current coaching prompt/contract source; safety verifier; coaching unit tests | Current guardrails are defense in depth, not safety, medical, or efficacy approval | Safety/medical-scope reviewer; engineering owner | Frozen-candidate guardrail evidence and public-wording review | Yes | Pending |
+| `docs/safety-terms.md` — `AI Coach Prompt Constraints`, “Future AI coach prompts” | Future AI prompt safety | Future prompt/system instructions must prohibit diagnosis, treatment, aggressive movement prescriptions, and guarantees and must recommend qualified help where appropriate | Future implementers and reviewers | `Documented design intent` | Safety terms draft; repository safety governance | The future requirements do not prove implementation by a provider, model, or later prompt path | Safety/medical-scope reviewer; future engineering owner | Approved future provider/prompt specification, implementation evidence, and human wording review | Yes if published or implemented | Pending |
+| `docs/safety-terms.md` — `Review Checklist` | Open review | Legal/human approval boxes remain unchecked | Release reviewers | `Qualified-human review required` | Current unchecked Markdown list | Reviewer identity, evidence, and decisions are not recorded | Release owner; qualified reviewers | Completed scoped records through this gate | Yes | Pending |
+| `docs/privacy-architecture.md` — draft banner and opening | Privacy status | Local-first engineering draft, not privacy/legal advice or a guarantee | Reviewers and repository readers | `Qualified-human review required` | Draft banner; privacy verifier | No qualified privacy decision is recorded | Qualified privacy/legal reviewer | Candidate-specific privacy disposition | Yes | Pending |
+| `docs/privacy-architecture.md` — `Default Privacy Posture` | Current implementation | Local file selection, Pose Landmarker inference, local PNG/print/PDF/prompt-copy; no camera, raw-video/landmark persistence, remote sharing, or remote model API | Reviewers and users | `Code/test-enforced fact` | Runtime modules; privacy/unit/smoke tests | Reconfirm against frozen candidate and exact build | Engineering owner; privacy reviewer | Data-flow trace and candidate verification | Yes | Pending |
+| `docs/privacy-architecture.md` — `Data Classes` | Data inventory | Classes raw video, frames, landmarks, metrics, exports, prompts/outputs, and acknowledgement state | Reviewers and implementers | `Documented design intent` | Privacy doc; runtime data contracts | Which classes actually exist, persist, or leave control in candidate scope? | Privacy reviewer; engineering owner | Current data map plus export inspection | Yes | Pending |
+| `docs/privacy-architecture.md` — `Local-First Processing Flow` | Lifecycle | Fail-closed local processing and explicit opt-in design | Reviewers and implementers | `Documented design intent` | Privacy verifier; network smoke tests | Future-oriented steps must not be mistaken for current behavior | Privacy reviewer; engineering owner | Step-by-step current/future classification | Yes | Pending |
+| `docs/privacy-architecture.md` — `Video Lifecycle` deletion bullets | Storage and deletion | Browser/device storage varies; clear-local-data and deletion language is future-oriented and cannot promise erasure | Reviewers and users | `Qualified-human review required` | Storage standard; acknowledgement source | SS-021 behavior is not implemented; device-level deletion cannot be inferred | Privacy reviewer; product owner | Storage evidence, user-copy decision, SS-021 result | Yes | Pending |
+| `docs/privacy-architecture.md` — `Export Policy` | Export sensitivity | Local user-initiated exports may contain identifying or sensitive metrics/images/text and exclude raw video by default | Reviewers and users | `Code/test-enforced fact` | Swing Card generator/actions; smoke tests | Exact artifact contents and manual-sharing risks require review | Privacy/safety reviewer; engineering owner | Rendered artifacts and data-class inspection | Yes | Pending |
+| `docs/privacy-architecture.md` — `Optional Remote Model or Coach Sharing`, current status; `src/model-consent.ts` registry | Remote sharing | The production provider registry is empty and the current UI exposes no configured remote-send path | Reviewers and users | `Code/test-enforced fact` | Empty provider registry; remote panel; unit and smoke tests | Reconfirm registry and built candidate; absence is bounded to inspected/tested paths | Privacy reviewer; engineering owner | Frozen-candidate registry/build and network evidence | Yes | Pending |
+| `docs/privacy-architecture.md` — `Optional Remote Model or Coach Sharing`, “Before any remote” requirements | Future provider review and consent | A future remote provider must document terms, data classes, destinations, retention, human review, and opt-in/revocation before implementation | Reviewers and implementers | `Documented design intent` | Privacy architecture and repository governance | Future provider facts, user flow, and enforcement do not yet exist | Privacy/legal/licensing reviewers; future engineering owner | Approved future provider/data/consent specification, implementation, and tests | No for current local candidate | Deferred / non-goal |
+| `docs/privacy-architecture.md` — MediaPipe gate and observability paragraph | Provider metrics and telemetry | Pinned `0.10.35`, version-specific response, observed network checks, and local sanitized errors | Reviewers and implementers | `Unresolved assumption` | Provider issue; generic notice; asset/network tests | Generic current notice and exact-version evidence require human reconciliation | Qualified privacy reviewer; engineering owner | Exact artifact/network evidence and scoped disposition | Yes | Pending |
+| `docs/privacy-architecture.md` — `User-Facing Copy Drafts` | Draft privacy copy | Local processing, export, remote sharing, and future clear-data text | Future users/reviewers | `Qualified-human review required` | Draft only; runtime differs by feature status | Which drafts should publish, and when? | Privacy/legal/product reviewers | Copy-to-runtime mapping and wording decision | Yes | Pending |
+| `docs/limitations.md` — pose/metric, camera, educational, and fixture sections | Accuracy, evidence, medical, safety | Results are estimates; tests/fixtures do not prove real-world correctness, safety, efficacy, or compliance | Users/reviewers | `Qualified-human review required` | Algorithms, fixtures, unit/smoke tests | SS-022 validation is pending; prominence and evidence sufficiency need review | Product, safety/medical-scope, and evidence reviewers | Validation plan/results and claim review | Yes | Pending |
+| `docs/limitations.md` — privacy/export and remote sections | Privacy, export, browser, remote | Exported data can be sensitive; browser controls vary; provider registry is empty | Users/reviewers | `Code/test-enforced fact` | Runtime exports; registry; browser tests | Claims remain environment-bounded and manual sharing is external | Privacy reviewer; engineering owner | Candidate-specific browser/export evidence | Yes | Pending |
+| `docs/limitations.md` — document-level accessibility omission; SS-019 evidence | Accessibility | The current limitations page has no dedicated accessibility section; SS-019 automated/manual evidence remains bounded and does not establish certification | Users/reviewers | `Unresolved assumption` | SS-019 tests and manual QA record | Whether public limitations need explicit accessibility wording and which manual risks remain | Accessibility reviewer; release owner | Candidate manual/automated evidence and publication decision | Conditional | Pending |
+| `docs/deployment.md` — draft banner, current posture, and no-backend implications | Deployment | Static frontend/no app backend; no app-owned accounts, secrets, server rate limits/logs, or cloud retention | Operators/reviewers | `Code/test-enforced fact` | Source tree; deployment verifier | Chosen host and candidate configuration are not yet named | Security/privacy reviewer; deployer | Frozen host/build configuration and evidence | Yes | Pending |
+| `docs/deployment.md` — `Security Headers` | Security ownership | Meta CSP is limited; production response headers are deployer-owned | Operators/reviewers | `Documented design intent` | `index.html`; CSP standard; docs tests | Actual host headers and policy compatibility require inspection | Security reviewer; deployer | Response-header capture and host decision | Yes | Pending |
+| `docs/deployment.md` — logging/telemetry and service-worker statements | Runtime/deployment data | No app-owned server logging/telemetry; current service worker has bounded install/activate behavior | Operators/reviewers | `Code/test-enforced fact` | Source/verifiers; `public/sw.js` | Host, third-party, and future-build behavior is not proven generally | Security/privacy reviewer; engineering owner | Candidate network/service-worker evidence | Yes | Pending |
+| `docs/deployment.md` — `Backend Architecture Review Gates` | Future architecture | Backend, remote, storage, provider, reporting, and host changes require separate review | Maintainers/operators | `Documented design intent` | Repository governance | Trigger ownership and future enforcement | Lead architect; release owner | Future approved spec and audit | No for current static candidate | Deferred / non-goal |
+| `docs/licensing.md` — dependency/reference/provider policy and trademark paragraph | Licensing and trademark | Engineering review rules apply; a preliminary Swing Sync name search is still required | Distributors/reviewers | `Qualified-human review required` | Dependency audit; policy; source/notice records | Audit and search do not establish clearance or all distribution duties | Licensing and qualified trademark/legal reviewers | Candidate bill of materials, notices, search evidence, decision | Yes | Pending |
+| `docs/models-licensing.md` — exact `@mediapipe/tasks-vision@0.10.35` entry, 2026-06-10 telemetry bullets, and “Do not claim tests prove all future SDK versions lack telemetry” | Exact-version provider telemetry assertion | Records an attributed statement that the then-current Web SDK lacked telemetry, that future aggregated telemetry was planned without a planned opt-out, and that outbound requests could be blocked | Reviewers and distributors | `Unresolved assumption` | MediaPipe issue #6306 response; pinned package/model records; candidate observed-network and blocked-network tests | The attributed response and tests do not alone establish exact `0.10.35` behavior in every environment or cover upgrades | Qualified privacy reviewer; engineering owner | Authenticate/version-scope the provider evidence, reconcile the generic current notice, inspect exact artifact/network evidence, and record a qualified privacy decision | Yes | Pending |
+| `docs/licensing.md` — exact `@mediapipe/tasks-vision@0.10.35` paragraph and fresh-review requirement | Exact-version provider telemetry assertion | States that Google described the current Web SDK as lacking telemetry and requires fresh license/privacy/provider-metrics/network review for later versions | Reviewers and distributors | `Unresolved assumption` | MediaPipe issue #6306 response; lockfile and exact package record; candidate network tests; generic MediaPipe notice | Licensing text repeats a provider claim but does not itself establish telemetry absence, privacy approval, or future behavior | Qualified privacy and licensing reviewers; engineering owner | Reconcile exact-version provider/artifact/network evidence and record qualified privacy and licensing decisions for the named candidate | Yes | Pending |
+| `docs/models-licensing.md`, `docs/model-assets/*`, and provider records | Model/provider rights | Exact local model/provider decisions are version- and artifact-scoped | Distributors/reviewers | `Qualified-human review required` | Model asset record; checksums; provider evidence | Upgrade, redistribution, terms, and privacy evidence must match candidate | Licensing/privacy reviewers | Exact-version artifact and terms review | Yes | Pending |
+| `docs/fixture-policy.md` and fixture records | Fixture rights/privacy | Only approved, documented test fixtures are permitted; fixtures do not prove real-user accuracy | Contributors/reviewers | `Code/test-enforced fact` | Fixture verifier; provenance records | Publication scope and rights/privacy evidence need confirmation | Licensing/privacy reviewer | Candidate fixture manifest and provenance review | Conditional | Pending |
+| `LICENSE`, `NOTICE`, and `THIRD_PARTY_NOTICES.md` | Distribution notices | Project and third-party license/notice evidence | Distributors/reviewers | `Qualified-human review required` | License audit and notice files | Completeness, attribution, versions, and distribution channel | Licensing reviewer; release owner | Candidate artifact/license/notice reconciliation | Yes | Pending |
+| `docs/schemas/swing-metric-payload-v0.1.0.schema.json` — structural keywords (`required`, `additionalProperties`, enums, and conditional constraints) | Metric payload structure | Documents the closed version, metric/value/confidence vocabulary, required fields, and conditional structural constraints reflected by the TypeScript validator | Developers, integrators, and repository readers | `Code/test-enforced fact` | JSON Schema; `src/metric-contract.ts`; `test/unit/metric-contract.test.ts` fixture, vocabulary, confidence, field, and prohibited-key cases | The JSON Schema is documentation rather than the runtime validator; candidate alignment and exact enforcement scope must stay explicit | Engineering owner | Frozen schema/validator comparison and named unit evidence | Yes | Pending |
+| `docs/schemas/swing-metric-payload-v0.1.0.schema.json` — top-level `description` and `$comment` | Public export, telemetry, and remote limitation wording | States that SS-008 does not approve metric calculation, storage, export, telemetry, remote sharing, or public schema serving, and limits prohibited-key rejection to exact case-sensitive names | Integrators and repository readers | `Qualified-human review required` | Exact schema prose; metric-contract source/tests; current export and remote-provider inventory | Structural validation does not itself prove the broader export, telemetry, remote-sharing, or public-serving limitations | Privacy/product/release reviewers; engineering owner | Public-wording decision plus candidate data-flow, export, telemetry, remote, and validator evidence | Yes | Pending |
+| `index.html` — description/title; `public/manifest.webmanifest` — name fields; `package.json` — description | Public metadata | Local-first analysis scaffold, Swing Sync name, and “AI golf swing analysis coach” package description | Search, install, package, and browser surfaces | `Qualified-human review required` | Exact metadata files | Metadata may imply broader AI/coaching or release posture than current runtime | Product, safety/medical-scope, trademark reviewers | Separate metadata/net-impression decision | Yes | Pending |
+| `src/app-renderer.ts` — safety acknowledgement and workflow status strings | Runtime consent and status | Educational/risk acknowledgement blocks analysis; selected media and decoded frames remain local/volatile | App users | `Code/test-enforced fact` | App renderer, consent state, unit/smoke tests | Conspicuousness, legal meaning, accessibility, and audience remain human questions | Legal/safety/privacy reviewers; engineering owner | Candidate UX capture and behavior tests | Yes | Pending |
+| `src/app-renderer.ts` — “No feature will send it elsewhere without a separate, explicit opt-in step you initiate.” | Public runtime privacy absolute | The consent surface makes an absolute-sounding statement about every feature sending raw swing video | App users | `Qualified-human review required` | Current renderer source; privacy verifier; consent and no-network smoke paths, each bounded to configured source and tested environments | Does “No feature” overstate protection across browsers, hosts, future code, or manual user sharing? | Qualified privacy reviewer; engineering owner | Frozen-candidate source/data-flow trace, network evidence, and public-wording decision | Yes | Pending |
+| `src/app-events.ts` — “No video data leaves this device.” | Public runtime privacy absolute | The local-analysis loading status makes an absolute device-boundary statement | App users | `Qualified-human review required` | Current event-handler source; privacy verifier; local-analysis and no-network smoke paths, each bounded to configured source and tested environments | Does “No video data” accurately describe all candidate requests, browser behavior, hosting, and user-controlled export/sharing paths? | Qualified privacy reviewer; engineering owner | Frozen-candidate network/data-flow evidence and public-wording decision | Yes | Pending |
+| `src/phase-review-renderer.ts` — review warning and confirmation UI | Runtime phase limits | Eight samples may miss events; impact cannot be confirmed from body landmarks; human confirmation is required | App users | `Code/test-enforced fact` | Renderer and unit/smoke tests | Accuracy evidence and user interpretation need review | Evidence/product/safety reviewers | SS-022 evidence and UI review | Yes | Pending |
+| `src/remote-model-renderer.ts` — “Remote model review unavailable” | Runtime remote status | Remote review is unavailable until a provider is separately reviewed/configured | App users | `Code/test-enforced fact` | Empty registry; renderer and smoke tests | Must remain consistent with candidate configuration | Privacy/licensing reviewer; engineering owner | Registry/configuration evidence | Yes | Pending |
+| Runtime error/status copy in `src/app-renderer.ts` and analysis lifecycle modules | Runtime errors | Local model/loading/processing failures use bounded status and error codes | App users | `Code/test-enforced fact` | Unit/smoke tests; privacy/safety verifiers | Clarity, completeness, and no sensitive leakage | Product/privacy/safety reviewers | Error-path evidence and copy review | Conditional | Pending |
+| `src/app-renderer.ts` — Swing Card export controls and warnings | Export UI | Download PNG, Print / Save as PDF, and Copy prompt; raw video excluded | App users | `Code/test-enforced fact` | Swing Card actions/generator; smoke tests | Actual output, warning prominence, and browser print behavior | Privacy/safety/product reviewers | Candidate artifacts and browser evidence | Yes | Pending |
+| `src/swing-card-generator.ts` — PNG/print/prompt content | Generated content | Selected keyframes, metrics, warnings, and manual-upload prompt; no anonymity/privacy guarantee | Export recipients and third-party-service users | `Code/test-enforced fact` | Generator tests and smoke tests | Export can be identifying and leaves app control after sharing | Privacy/safety/legal reviewers | Rendered samples and data-class review | Yes | Pending |
+| `src/coaching-prompt.ts` and `src/coaching-contract.ts` | AI coaching contract/output | Evidence-bounded JSON, unavailable/review-required states, prohibited medical/privacy/legal absolutes | Manual model-chat users | `Code/test-enforced fact` | Coaching tests and safety verifier | External model behavior is not controlled; guardrails are not approval | Safety/medical-scope/privacy reviewers | Contract tests, sample outputs, and human review | Yes | Pending |
+| Historical `docs/ss-*` and `docs/handoffs/*` research, prompt, response, audit, source-packet, and handoff artifacts | Repository-public evidence | Historical evidence may repeat superseded or sensitive wording and is non-authoritative | Repository readers | `Unresolved assumption` | Tracked history and artifact manifests | Release owner must decide publication boundary and context labels for both historical namespaces | Release owner; legal/privacy/safety/trademark reviewers | Complete `docs/ss-*` and `docs/handoffs/*` manifests plus publication decision | Yes if public | Pending; excluded from normalization and uniqueness checks |
+
+### Bounded Public-Document Standard Claim-Scan Result
+
+The standard prohibited-claim scan covers only the configured public summaries
+`README.md`, `CONTRIBUTING.md`, `docs/limitations.md`, and
+`docs/deployment.md`. Safety, privacy, and this canonical gate use their
+separate structural, required-string, link, and current-approval controls
+because their draft and inventory text legitimately names prohibited claim
+categories.
+
+**Current standard claim-scan result: PASS for the four configured summaries.**
+This result is bounded to the checked files, patterns, and current repository
+content. Verifier success is not qualified-human legal, privacy, safety,
+medical, trademark, compliance, or public-release clearance.
+
+## Publication-Review Matrix
+
+Existing wording and automated evidence do not imply approval. Sensitive
+surfaces stay `Pending` until authenticated, candidate-scoped human evidence is
+attached.
+
+| Publication surface | Separate review | Required reviewer role | Evidence required | Current status | Release-blocking effect |
+| --- | --- | --- | --- | --- | --- |
+| README | Yes | Product/release, legal, privacy, safety/medical-scope, trademark | Exact candidate text, capability/data evidence, branding decision | Pending | Blocks |
+| CONTRIBUTING | Yes | Maintainer and affected qualified reviewers | Workflow text and enforcement evidence | Pending | Blocks if repository is public or contributor-facing |
+| Limitations | Yes | Product/evidence and safety/medical-scope/privacy reviewers | Validation limits, browser evidence, future-work mapping | Pending | Blocks |
+| Safety terms | Yes | Qualified legal and safety/medical-scope reviewers | Exact SS-002 text, territories, audience, consent UX | Pending | Blocks |
+| Privacy architecture | Yes | Qualified privacy/legal reviewer | Data map, storage/export/network evidence, notices | Pending | Blocks |
+| Deployment | Yes | Security/privacy reviewer and named deployer | Host configuration, headers, service-worker/network evidence | Pending | Blocks |
+| Licensing/model/fixture/notice materials | Yes | Licensing, privacy, and trademark reviewers as applicable | Candidate SBOM, assets, terms, provenance, notices, search evidence | Pending | Blocks |
+| Metadata (`index.html`, manifest, package description) | Yes | Product, safety/medical-scope, trademark reviewers | Exact candidate metadata and distribution-channel context | Pending | Blocks |
+| Runtime UI | Yes | Product, legal, privacy, safety/medical-scope, accessibility reviewers | Candidate build, screenshots/flows, named tests, manual review | Pending | Blocks |
+| Exports and generated content | Yes | Privacy, safety/medical-scope, product/legal reviewers | Actual PNG, print/PDF, prompt, warning, and coaching samples | Pending | Blocks |
+| Historical repository evidence | Conditional | Release owner plus reviewers for exposed sensitive content | Complete tracked manifest and publication-boundary decision | Pending | Blocks if included in public distribution |
+
+## Qualified-Human Checklist And Open Decisions
+
+Every row is deliberately unresolved. Attach evidence; do not change a result
+without the accountable reviewer and release owner recording a scoped decision.
+
+| Question / open decision | Accountable reviewer role | Evidence required | Required sign-off | Blocking status | Current result |
+| --- | --- | --- | --- | --- | --- |
+| Are the SS-002 assumption-of-risk and release-of-liability drafts appropriate for the named jurisdictions, entities, maintainers, contributors, and distributors? | Qualified legal reviewer | Exact candidate text, parties, territories, release model | Legal reviewer and release owner | Blocking | Pending |
+| What governing-law, dispute, waiver, enforceability, and non-waivable-rights treatment is required? | Qualified legal reviewer | Entity, territory, channel, and business facts | Legal reviewer | Blocking | Pending |
+| Is consent conspicuous and meaningful, and what age/capacity or guardian posture is required? | Qualified legal and privacy reviewers | UX flow, storage behavior, audience/minor decision | Legal/privacy reviewers and release owner | Blocking | Pending |
+| Are intended use, educational/non-medical positioning, safety instructions, and consumer net impression appropriate? | Qualified safety/medical-scope and legal reviewers | Full public copy, runtime/export samples, audience/channels | Safety/medical-scope and legal reviewers | Blocking | Pending |
+| Are evidence, accuracy, and limitation statements supported and prominent, and are reviewer qualifications adequate? | Evidence/domain reviewer and release owner | Named tests, fixture limits, SS-022 status, reviewer credentials | Evidence reviewer and release owner | Blocking | Pending |
+| Is the current data inventory complete across local memory, browser storage, exports, logs, network, and service-worker paths? | Qualified privacy reviewer and engineering owner | Data-flow map, source trace, browser/network evidence | Privacy reviewer | Blocking | Pending |
+| Are local-storage and deletion limitations accurate, including the absence of SS-021 clear-local-data behavior and device-level erasure guarantees? | Qualified privacy reviewer | Storage APIs, browser behavior, SS-021 status, copy | Privacy reviewer | Blocking | Pending |
+| Are export sensitivity and third-party manual-sharing warnings adequate for PNG, print/PDF, copied prompt, and generated coaching content? | Privacy/legal/safety reviewers | Actual candidate artifacts and third-party-sharing flow | Privacy reviewer and release owner | Blocking | Pending |
+| What are the intended audience/age posture, release territories, and required privacy or consumer notices? | Legal/privacy/product reviewers | Product plan, territories, audience research, data practices | Legal/privacy reviewers and release owner | Blocking | Pending |
+| How should the current generic MediaPipe notice be reconciled with exact `@mediapipe/tasks-vision@0.10.35` evidence and observed network behavior? | Qualified privacy reviewer and engineering owner | Generic notice, issue response, lockfile/artifact, network tests | Privacy reviewer | Blocking | Pending |
+| Do non-affiliation language, the Swing Sync name, logo/branding, and preliminary search evidence support the named use? | Qualified trademark/legal reviewer | Name/logo inventory, channel/territory plan, preliminary and broader search evidence | Trademark/legal reviewer and release owner | Blocking | Pending |
+| Are licenses, notices, fixtures, model assets, SDK/provider evidence, and exact distribution artifacts complete? | Licensing reviewer | SBOM, lockfile, notice/model/fixture records, built artifact | Licensing reviewer and release owner | Blocking | Pending |
+| What legal entity/business model, monetization, distribution channels, host, security headers, support policy, and incident/contact ownership apply? | Release owner with legal/security/privacy reviewers | Business/release plan, host evidence, support/incident plan | Release owner and affected reviewers | Blocking | Pending |
+| Are historical `docs/ss-*` and `docs/handoffs/*` evidence files included in the public publication boundary, and what context is required? | Release owner with legal/privacy/safety/trademark reviewers | Complete tracked manifests for both namespaces and repository/distribution plan | Release owner | Blocking if public | Pending |
+
+## Operational Gate Contract
+
+### Entry Criteria
+
+Do not begin qualified-human release review until all entry criteria are met:
+
+- an immutable candidate commit, pull request, or release target is named;
+- the release scope, channels, territories, audience/age posture, production
+  host, legal owner, and release owner are named;
+- the complete public-surface inventory and current focused diff are attached;
+- current verification, runtime/data/deployment posture, and source register
+  are attached;
+- qualified reviewer roles and intended reviewers are named;
+- every open decision has an owner and required evidence; and
+- the candidate is frozen so no sensitive change can bypass review.
+
+### Required Artifacts
+
+- this canonical package and its current inventory;
+- immutable candidate commit and complete focused diff;
+- named verification evidence and environments;
+- current external primary-source register;
+- open-decision and reviewer-response log;
+- authenticated reviewer comments or attachments;
+- completed sign-off record; and
+- conditions, residual risks, expiry, and follow-up evidence where applicable.
+
+### Permitted Future Outcomes
+
+These labels define the only outcomes a qualified reviewer may record for a
+named scope. They do not select or imply a current approval:
+
+- `PENDING` — required evidence or decisions remain open.
+- `APPROVED FOR NAMED SCOPE` — the identified reviewer accepts only the
+  recorded candidate, audience, territories, channels, host, and conditions.
+- `APPROVED WITH CONDITIONS` — the identified reviewer accepts the named scope
+  only while recorded conditions and expiry remain satisfied.
+- `CHANGES REQUIRED` — specified blockers must be resolved and reviewed.
+- `REJECTED / HOLD` — the named candidate or scope must not proceed.
+- `NOT APPLICABLE WITH RATIONALE` — the reviewer records why a question does
+  not apply to the named scope and who accepts that rationale.
+
+The current outcome remains `PENDING`.
+
+### Sign-Off Record
+
+No sign-off is recorded. Each future record must include every field below;
+blank, ambiguous, or unauthenticated fields block release.
+
+#### Durable Authenticated Record Location
+
+The canonical durable record for a candidate must be
+`docs/release-review-signoffs/<candidate-commit>/index.md`. That manifest must
+reference the exact candidate and release scope and must identify every
+reviewer artifact. Signed attachments may be stored beside the manifest or in
+a durable external review system only when the manifest records an immutable
+artifact identifier, access-controlled location, checksum where available, and
+authentication method. An unchecked Markdown box, unauthenticated chat text,
+or unscoped approval statement is not an authenticated sign-off.
+
+| Field | Current value |
+| --- | --- |
+| Candidate commit and release version/scope | Not recorded |
+| Territories, audience, channels, and host | Not recorded |
+| Reviewer identity | Not recorded |
+| Accountable role and qualification basis | Not recorded |
+| Artifact and evidence versions | Not recorded |
+| Decision and date | `PENDING`; date not recorded |
+| Conditions and expiry | Not recorded |
+| Residual risks and unresolved issues | Not recorded |
+| Required follow-up owner and date | Not recorded |
+| Confirmation that post-review changes were checked | Not recorded |
+
+#### Required Reviewer Domain Status
+
+Each required domain has its own current row. Evidence, identity and
+qualification, decision date, and candidate/release scope must be recorded in
+the durable authenticated record before its status can change.
+
+| Required reviewer domain | Current status | Evidence | Reviewer identity / qualification | Decision date | Candidate / release scope |
+| --- | --- | --- | --- | --- | --- |
+| Legal | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
+| Privacy | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
+| Safety / medical-scope | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
+| Trademark | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
+| Licensing | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
+| Product / evidence | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
+| Security / deployment | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
+| Accessibility | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
+| Release owner | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
+
+#### Aggregation Authority And Rule
+
+The named release owner is the aggregation authority. The release owner must
+derive the aggregate outcome from the authenticated domain records and cannot
+waive, reinterpret, or replace a required qualified-reviewer decision.
+
+If any required record or field is missing; any required domain is `PENDING`,
+`CHANGES REQUIRED`, or `REJECTED / HOLD`; any condition is expired or unmet; or
+the candidate/scope differs between records, the aggregate outcome must remain
+`PENDING` and public release must remain `BLOCKED`.
+
+Public release can be allowed only when every required domain has a current,
+authenticated, candidate- and scope-matched sign-off (`APPROVED FOR NAMED
+SCOPE`, `APPROVED WITH CONDITIONS` with every condition current, or `NOT
+APPLICABLE WITH RATIONALE` where the accountable reviewer accepts that
+rationale) and the release owner records a final decision for that same
+candidate and scope. No domain sign-off or release-owner decision is recorded
+for the current package.
+
+### Blocking Conditions
+
+Public release remains blocked when any of these conditions is true:
+
+- the release scope, candidate, reviewer identity, qualification, evidence, or
+  sign-off field is missing or ambiguous;
+- SS-002 legal review of assumption-of-risk and release-of-liability language
+  is not completed for the named scope;
+- absolute, medical, privacy, deletion, anonymity, compliance, trademark, or
+  contradictory public wording remains unresolved;
+- exact-version MediaPipe/provider evidence remains unresolved;
+- trademark/branding or repository-publication decisions are missing;
+- a required verifier, build, or independent audit fails;
+- the candidate changes or contains an unreviewed sensitive diff; or
+- a source or conditional decision is stale or expired.
+
+### Reopening Rules
+
+Reopen the affected qualified-human review after any of these events:
+
+- public safety, privacy, medical, legal, trademark, or accuracy copy changes;
+- project name, logo, entity, business model, audience/minor posture,
+  territory, channel, host, support model, or incident ownership changes;
+- runtime, data class, storage, deletion, export, remote sharing, provider,
+  model, dependency, license, service-worker, logging, telemetry, or deployment
+  changes;
+- a material provider term, source, standard, law, or guidance change; or
+- an incident, complaint, audit finding, expired condition, or post-review
+  candidate diff.
+
+A reopening trigger invalidates every affected prior sign-off. The affected
+domain outcome and the aggregate outcome must reset to `PENDING`, public release
+must reset to `BLOCKED`, and a fresh authenticated review must cover the new
+candidate and scope before aggregation can be reconsidered. Unaffected records
+may remain as historical evidence but cannot allow release while any affected
+review is pending.
+
+## Primary-Source Register
+
+Accessed: 2026-08-08. These sources define process questions and evidence
+limits only. The register does not decide applicability or compliance.
+
+| Issuer / source | Direct URL | Process question | Limit on inference |
+| --- | --- | --- | --- |
+| Google, MediaPipe Tasks Privacy Notice | https://developers.google.com/edge/mediapipe/solutions/tasks#mediapipe_tasks_privacy_notice | How should on-device input processing and performance/utilization metrics be represented? | Does not establish exact `0.10.35` network behavior or a project consent duty |
+| MediaPipe repository collaborator response, issue #6306 | https://github.com/google-ai-edge/mediapipe/issues/6306#issuecomment-4673728357 | What version-context evidence exists for Web SDK telemetry and blocking outbound requests? | Not a future-version guarantee, legal opinion, or release decision |
+| WHATWG Storage Living Standard | https://storage.spec.whatwg.org/ | What browser storage variability and best-effort behavior must reviewers consider? | Does not prove retention or device-level erasure for every browser/device |
+| W3C Content Security Policy Level 3, meta delivery | https://www.w3.org/TR/CSP3/#meta-element | What limits distinguish meta CSP from host response headers? | Does not prove a named host's production security posture |
+| U.S. FDA, General Wellness: Policy for Low Risk Devices | https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices | Which intended-use and product-context facts should the reviewer assess? | No Swing Sync classification or approval is inferred |
+| U.S. FTC, Health Products Compliance Guidance | https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance | Which express/implied claims, substantiation, disclosures, audience, and net-impression questions require review? | Not a project-specific decision or safe harbor |
+| U.S. FTC, Health Breach Notification Rule: The Basics for Business | https://www.ftc.gov/business-guidance/resources/health-breach-notification-rule-basics-business | Which actual data-practice and identifying-health-information facts are needed? | Applicability depends on unresolved release, data, and business facts |
+| U.S. FTC, Children's Privacy | https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy | What intended-audience and under-13 posture must be decided? | No audience or COPPA applicability conclusion is made |
+| USPTO, Federal trademark searching | https://www.uspto.gov/trademarks/search/federal-trademark-searching | What preliminary federal search evidence should feed broader clearance work? | A search or disclaimer is not trademark clearance |
+| Apache Software Foundation, Apache License 2.0 | https://www.apache.org/licenses/LICENSE-2.0 | What source-license and trademark-permission limits are relevant? | Does not substitute for product, privacy, safety, branding, or release review |
+
+## Non-Goals And Deferred Work
+
+This package does not perform or record qualified-human legal, privacy,
+safety/medical-scope, trademark, compliance, or public-release review. It does
+not draft jurisdiction-specific waivers, governing-law/dispute/arbitration/
+class-action/minor/guardian terms, a privacy notice, or a production support or
+incident policy.
+
+Deferred work includes production-host approval; release entity, business,
+territory, audience, and distribution decisions; trademark clearance; any
+provider/model upgrade or remote provider decision; SS-021 clear-local-data
+behavior and deletion UX; and SS-022 real-user/video accuracy validation.
+
+SS-020 changes no runtime behavior or copy, export format/data class, provider,
+model, SDK, dependency, lockfile, licensing policy, notice, SBOM, bundle,
+persistence, service worker, remote sharing, cloud storage, deployment,
+telemetry, analytics, logging, diagnostics, or runtime observability. Historical
+audit/source packets, `docs/handoffs/*`, and the protected
+`docs/agent-guidance/` files remain unchanged and outside automated
+normalization.
diff --git a/docs/safety-terms.md b/docs/safety-terms.md
index 7a4a626..715770a 100644
--- a/docs/safety-terms.md
+++ b/docs/safety-terms.md
@@ -6,6 +6,9 @@ This document is product-compliance draft language for human and legal review.
 It is not legal advice, does not guarantee enforceability, and should be
 reviewed before release.

+The [release review gate](./release-review-gate.md) records the pending
+qualified-human review package for any future public release.
+
 ## Intended Use

 Swing Sync provides local-first, educational golf swing feedback. It is designed
diff --git a/docs/ss-020-gemini-research-prompt.md b/docs/ss-020-gemini-research-prompt.md
new file mode 100644
index 0000000..b4875a7
--- /dev/null
+++ b/docs/ss-020-gemini-research-prompt.md
@@ -0,0 +1,504 @@
+# SS-020 Gemini Research and Specification Prompt
+
+> **SUPERSEDED — DO NOT PASTE.** On 2026-08-08, the human owner confirmed that
+> Gemini free-plan Deep Research is unavailable and directed Codex to own the
+> SS-020 research/specification phase under the current Multi-Agent SDLC
+> Framework. This file remains only as historical kickoff evidence. The
+> authoritative research and lead disposition are recorded in the SS-020 Codex
+> research/specification artifacts and `CONTEXT.md`.
+
+The text below was prepared for a Gemini browser-chat handoff before the route
+changed. It is preserved verbatim as historical evidence; do not use it as the
+current research or implementation baseline.
+
+## Role
+
+You are Gemini acting as the sensitive-story research and specification input
+owner for Swing Sync, an open-source, local-first browser app for educational
+golf swing review.
+
+You are not the legal, privacy, safety, medical, trademark, or release approver.
+Do not provide legal advice, determine enforceability, or imply that review,
+clearance, certification, or compliance has occurred. Your output is research
+input that a Codex lead architect must disposition as Adopt, Revise, Defer, or
+Reject before any implementation begins.
+
+## Stage and objective
+
+Stage: preimplementation research/specification for SS-020, “Prepare human
+legal/privacy/safety release review gate.”
+
+Create an implementation-ready recommendation for one authoritative
+pre-release package that qualified humans can later use to review existing
+draft public language. The package must make clear that existing project text
+is not legal, medical, privacy, deletion, compliance, trademark, or public-
+release clearance. Make the future human gate operational without pretending
+that any approval has occurred.
+
+## Verified project and task state
+
+- Baseline date: 2026-08-08.
+- Repository: `https://github.com/ajason13/swing-sync`.
+- Refreshed `main` and `origin/main`:
+  `0509999e7de5e609787fe53e8bdac2747aa0be64`.
+- Latest merged PR: PR #20, merge commit
+  `6872897475786e41cc434374224236854bde2846`.
+- Story branch: `ss-020-release-review-gate`, created from that baseline.
+- Notion task type: `Research`; Pull Request: empty; status:
+  `1. Spec Drafting (Gemini)`.
+- No earlier SS-020 Gemini prompt, research response, disposition, or approved
+  specification exists in the repository.
+- Gemini supplies research/specification input; Codex implements and verifies;
+  Claude later performs independent adversarial audit; qualified human legal,
+  privacy, safety, trademark, and release reviewers make future sign-off
+  decisions. Claude cannot substitute for those humans.
+- This is intended to remain documentation/release governance only. Runtime
+  observability is unchanged. No runtime, dependency, provider, data-flow,
+  export-format, persistence, service-worker, deployment, telemetry, analytics,
+  remote-logging, remote-sharing, cloud-storage, SDK, model, or model-call
+  change is permitted.
+
+## Acceptance criteria
+
+1. Inventory all public-facing safety, privacy, export, medical-scope,
+   non-affiliation, and limitation language.
+2. Produce a human-review checklist identifying legal/privacy/safety questions,
+   open decisions, evidence needed, accountable reviewer roles, and required
+   sign-off before public release.
+3. Explicitly flag the SS-002 assumption-of-risk and release-of-liability
+   language as requiring qualified human/legal review.
+4. Confirm public documentation avoids absolute privacy, safety, deletion,
+   anonymity, medical, legal, compliance, and trademark-clearance claims.
+5. Record whether README, limitations, contributor, deployment, licensing,
+   manifests, public UI/export, or other public wording needs separate human or
+   legal review before broader publication.
+6. Define operational gate entry criteria, required artifacts, decision
+   outcomes, sign-off record, blocking conditions, and reopening rules without
+   representing approval as complete.
+
+## Protected boundaries and non-goals
+
+- Do not provide legal advice or convert draft text into approved policy.
+- Do not claim compliance, trademark clearance, medical approval, complete
+  anonymity, guaranteed deletion, guaranteed privacy, guaranteed safety, or
+  completed human review.
+- Do not silently rewrite sensitive product copy merely to make it appear
+  approved. Inventory and flag it. Recommend a narrow correction only when a
+  demonstrable factual contradiction prevents accurate inventory or gate use;
+  label that recommendation for lead disposition.
+- Preserve local-first raw-media handling: raw swing video is not uploaded by
+  default; remote sharing requires a separate explicit opt-in.
+- Keep future release work and actual human review outside SS-020 acceptance.
+- Do not recommend runtime features, dependencies, telemetry, analytics,
+  logging, cloud systems, providers, persistence, service-worker changes,
+  exported-data changes, deployment changes, legal documents, clickwrap, age
+  gates, dispute terms, or jurisdiction-specific clauses as hidden additions to
+  this story. Such matters may be recorded only as open questions or deferred
+  future work for qualified humans.
+- Automated checks may guard wording and package structure, but they cannot
+  prove legal sufficiency, compliance, or human approval.
+
+## Current public-claim inventory context
+
+The following are exact or materially complete current excerpts. Treat them as
+draft evidence to inventory, not as approved representations.
+
+### `README.md`
+
+```text
+Swing Sync is a local-first browser app for educational golf swing review. It
+helps users inspect selected swing videos in the browser, review pose-derived
+movement signals, and export a Swing Card for their own practice notes.
+
+Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance,
+physical therapy, or a substitute for qualified medical care or professional
+golf coaching.
+
+The current app runs local video selection, local Pose Landmarker inference on
+sampled frames, swing phase detection, geometry and tempo metrics, visual
+review surfaces, and local Swing Card export/copy workflows.
+
+SS-012 added local-only educational coaching prompt and response contracts, but
+no model call is made from those contracts. SS-013 added a provider-neutral
+remote model adapter scaffold behind explicit consent, but the production
+provider registry is empty. There are no configured remote model providers,
+provider SDKs, API keys, server routes, or active hosted-model calls in the
+current production app.
+
+Raw swing video is not uploaded by default. Any future feature that sends raw
+video, frame pixels, landmarks, metrics, prompts, reports, or model outputs
+outside the browser must use a separate, explicit opt-in flow.
+
+Derived landmarks, metrics, selected images, prompts, reports, and model
+outputs may still be sensitive or identifying. Downloaded exports are
+controlled by the user after they leave the app.
+
+The safety and privacy documents are engineering and product drafts pending
+human/legal review; they are not legal advice and do not guarantee privacy,
+safety, deletion, anonymity, or regulatory compliance.
+
+Swing Sync source code is licensed under Apache-2.0.
+
+Swing Sync is an independent open-source project. It is not affiliated with,
+endorsed by, sponsored by, or approved by any golf equipment maker, tour,
+league, training organization, model provider, or platform vendor. Third-party
+names, if referenced, belong to their respective owners.
+```
+
+### `CONTRIBUTING.md`
+
+```text
+Swing Sync is for educational golf swing review. It is not medical advice, pain
+diagnosis, rehabilitation guidance, physical therapy, or a substitute for
+qualified medical care or professional golf coaching.
+
+Raw swing video is not uploaded by default. Any future feature that sends raw
+video, frame pixels, landmarks, metrics, prompts, reports, or model outputs
+outside the browser must use a separate, explicit opt-in flow.
+
+The safety and privacy documents are engineering and product drafts pending
+human/legal review; they are not legal advice and do not guarantee privacy,
+safety, deletion, anonymity, or regulatory compliance. SS-002 legal/human
+review remains a pre-release gate for assumption-of-risk and
+release-of-liability language.
+```
+
+### `docs/safety-terms.md`
+
+```text
+**DRAFT - pending legal/human review; not for release.**
+
+This document is product-compliance draft language for human and legal review.
+It is not legal advice, does not guarantee enforceability, and should be
+reviewed before release.
+
+Swing Sync provides local-first, educational golf swing feedback. It is not
+medical advice, physical therapy, rehabilitation guidance, injury diagnosis,
+pain triage, or professional athletic instruction.
+
+Golf practice, swing changes, exercise, and physical movement involve risk.
+Those risks may include soreness, strain, falls, impact injuries, equipment
+injuries, aggravation of an existing condition, or other injury. Users should
+practice in a safe location, warm up appropriately, stop if they feel pain,
+dizziness, numbness, weakness, or unusual discomfort, and consult a qualified
+professional before changing activity if they have health, mobility, or injury
+concerns.
+
+By using Swing Sync for analysis, the user acknowledges that golf practice and
+movement changes are voluntary activities and that they are responsible for
+deciding whether to participate, how intensely to practice, and whether to seek
+professional medical, fitness, or coaching guidance.
+
+To the maximum extent permitted by applicable law, the user agrees that Swing
+Sync, its maintainers, contributors, and distributors are not responsible for
+injury, loss, or damage arising from the user's practice, swing changes,
+equipment use, training decisions, or reliance on educational feedback provided
+by the app.
+
+This draft release should not be read as waiving rights that cannot legally be
+waived. It is intended as review-ready product language and must be evaluated
+for the jurisdictions and release context where Swing Sync is offered.
+
+The consent gate is a product safety acknowledgement, not a substitute for a
+lawyer-reviewed contract, medical screening, age verification, or jurisdiction-
+specific consent flow.
+```
+
+Its unchecked human-review checklist asks reviewers to assess assumptions of
+risk, release wording, intended-use boundaries, conspicuous consent, age and
+capacity, jurisdiction-specific enforceability, accessibility, and consistency
+with privacy disclosures. SS-020 must carry these forward as unresolved, not
+check them off.
+
+### `docs/ss-002-research-disposition.md`
+
+```text
+SS-002 produces draft language for qualified human/legal review. It does not
+provide legal advice or claim enforceability.
+
+Adopt: a conspicuous pre-analysis assumption-of-risk acknowledgement;
+educational-use and non-medical boundaries; stop-on-pain guidance; no injury-
+prevention or performance guarantees; and a separate consent step.
+
+Revise: broad waiver recommendations into jurisdiction-neutral draft language;
+do not imply all claims can be waived; keep consent storage a local scaffold,
+not a durable legal record.
+
+Defer: jurisdiction-specific governing-law, dispute, arbitration, class-action,
+minor/guardian, privacy-notice, and production release mechanics to qualified
+human/legal review.
+
+Reject: presenting external research as legal advice; claiming enforceability;
+medical diagnosis or rehabilitation; guaranteed safety or performance; and
+remote upload without separate explicit opt-in.
+```
+
+### `docs/privacy-architecture.md`
+
+```text
+**DRAFT - pending human/privacy review before public release.**
+
+This document defines Swing Sync's local-first privacy architecture for future
+video analysis work. It is product and engineering guidance, not legal advice
+or a guarantee of privacy, security, deletion, or regulatory compliance.
+
+Swing Sync must process swing video locally by default. Raw swing video and
+frame pixels must not be uploaded, sent to model providers, or shared with
+remote services unless a future feature adds a separate, explicit opt-in flow.
+
+The current application implements local file selection and local Pose
+Landmarker inference for sampled video frames. It does not implement camera
+capture, raw-video or landmark persistence, exports, remote sharing, or remote
+model APIs. The current consent acknowledgement is a local scaffold, not a
+durable legal or privacy record.
+
+Derived landmarks and metrics should be treated as sensitive user data. Even
+without a face or background video, movement patterns, timing, body proportions,
+and swing mechanics may be personal or identifying when combined with other
+data.
+
+Browser storage behavior varies by engine, device, available space, private
+browsing mode, user settings, installed-PWA state, and whether storage is best-
+effort or persistent. Swing Sync must not promise that local browser data is
+permanent, encrypted, immune to browser eviction, or physically erased from
+device storage after deletion.
+
+Default analytical exports must not include raw swing video. Exports must not
+be described as anonymous. Landmarks, metrics, images, and feedback may still
+be sensitive or identifying.
+
+Optional remote sharing is not approved yet.
+```
+
+Important factual tension to analyze, not silently repair: the privacy document
+says the current application “does not implement … exports,” while current
+README/runtime evidence says local Swing Card PNG, print/PDF, and prompt-copy
+workflows exist. Recommend whether SS-020 should only inventory/block this
+statement or authorize a narrow factual correction, and explain why.
+
+### `docs/limitations.md`
+
+This public page states that automated phase/metric/keyframe results can be
+partial or wrong; the app is not a medical tool or professional coaching;
+educational outputs are not safety guarantees; local processing does not make
+derived outputs anonymous; exported PNG/PDF/prompt content leaves app control;
+manual uploads to another service use that service's terms/privacy practices;
+remote model review is unavailable; browser/device variability remains; and
+the page links to the safety/privacy drafts. Determine every claim category and
+whether this page requires separate qualified review before broad publication.
+
+### `docs/deployment.md`
+
+```text
+**DRAFT - pending human security/privacy review before public production
+hosting.**
+
+This deployment guidance is product and engineering documentation, not legal,
+security, privacy, deletion, anonymity, medical, trademark-clearance, or
+regulatory-compliance advice or a guarantee.
+```
+
+It documents static-host assumptions, CSP/network behavior, no application
+backend, no app-owned server logging/telemetry, local-only processing defaults,
+service-worker scope, and a required separate architecture review before auth,
+servers, secrets, enforcement logs, cloud storage, remote providers/sharing, or
+production-host data-flow changes. Determine whether these are code/test-
+enforced facts, design intent, environment-dependent claims, or human-review
+questions.
+
+### Licensing and model-provider documents
+
+- `docs/licensing.md` says it is engineering policy, not legal advice; records
+  Apache-2.0 and dependency/reference/notice rules; and says broader public
+  naming or branding review requires a separate trademark search and human
+  legal decision before release.
+- `docs/models-licensing.md` says no provider SDK, remote API, or model binary is
+  approved without source/license/terms/privacy review; exact local MediaPipe
+  version `0.10.35` is approved under recorded project gates; the remote
+  provider registry remains empty; and future upgrades/providers require fresh
+  review. Inventory policy claims separately from public release clearance.
+
+### Public runtime and export wording
+
+Current exact representative strings include:
+
+```text
+Safety acknowledgement
+Swing Sync is for educational use only. It is not medical advice, pain
+diagnosis, rehabilitation guidance, or professional athletic instruction.
+Only this acknowledgement is stored locally. It is not a durable or legally
+audited consent record.
+
+Complete local analysis before creating a Swing Card. Raw swing video is not
+included in Swing Card exports.
+
+Remote model review unavailable
+Remote model review is optional and requires a separately reviewed provider
+before any data can leave this device. Manual Swing Card export and Copy prompt
+do not require provider configuration.
+No reviewed provider is configured for this story.
+Remote model review is unavailable until a provider is separately reviewed and
+configured.
+
+Generated in your browser for user-controlled download. Browser print can be
+used to print or save as PDF where supported.
+
+Do not claim the card is anonymous or that uploading it to another service is
+private. After I upload or share the downloaded file, that service's terms and
+privacy practices apply.
+```
+
+Also inventory public metadata: `index.html`, `public/manifest.webmanifest`,
+and `package.json` describe Swing Sync as local-first/open-source/AI-assisted
+educational golf swing analysis. Identify whether those summaries need review
+because “local-first,” “AI,” “coach,” or similar phrasing could be read more
+broadly than current behavior.
+
+### Existing automated governance
+
+- `scripts/verify-docs-claims.js` uses a shared declarative `docsClaimConfig`
+  for required headings, canonical disclaimer/non-affiliation blocks, links,
+  and named cross-file checks. It scans README, limitations, CONTRIBUTING, and
+  deployment for broad prohibited absolute-claim patterns. Safety/privacy files
+  receive required draft-banner checks but are not currently in the same broad
+  public-claims scan. Runtime UI, export text, metadata, licensing/model docs,
+  and the future SS-020 package are not all in that broad scan.
+- The prohibited categories cover privacy/anonymity, deletion, safety/accuracy,
+  medical/athletic, and legal/compliance/trademark claims. Allowed exact
+  disclaimers are carved out to avoid rejecting negated warnings.
+- `scripts/verify-safety-terms.js` checks required SS-002 draft/medical/risk/
+  release/consent language, runtime consent strings, and prohibited positive
+  medical/safety claims.
+- `scripts/verify-privacy-boundaries.js` checks the privacy draft banner,
+  local-first/export/remote-sharing boundaries, consent/runtime source, and
+  prohibited absolute privacy/deletion/anonymity wording; it also scans source
+  and scripts for protected network/data patterns.
+- `test/unit/docs-claims.test.ts` injects an in-memory file reader and covers
+  required files/links/blocks, empty or malformed cross-file values, embedded
+  delimiters, renamed headings, missing headings, prohibited claims, allowed
+  negated disclaimers, positive cases, and config validation. One test title
+  currently says “keeps approved public docs free of prohibited absolute
+  claims”; analyze whether “approved” is itself misleading even though it is
+  test-only wording.
+- Any verifier change must extend the shared/declarative registration and
+  injected-reader mechanism. It must add adversarial tests for missing files,
+  formatting changes, empty values, embedded delimiters, failure cases, and
+  positive cases. Do not propose a one-off parser/check.
+
+Repository-publication boundary to analyze: the tracked repository contains a
+large historical set of `docs/ss-*` prompts, source packets, raw responses, and
+review records. They are audit evidence rather than current policy, but they may
+be publicly readable if the repository is published. Recommend how the release
+inventory should distinguish authoritative live claims from immutable evidence,
+and ask the human publication owner whether those artifacts are in scope. Do
+not propose rewriting mechanically verified historical packets.
+
+## Primary-source facts already checked by Codex
+
+The following authoritative sources were accessed on `2026-08-08`. They are
+inputs to human questions, not determinations that any law, rule, classification,
+or clearance applies:
+
+- Google, “MediaPipe Tasks Privacy Notice,” last modified June 5, 2026:
+  `https://developers.google.com/edge/mediapipe/solutions/tasks#mediapipe_tasks_privacy_notice`.
+  The current generic notice says task inputs are processed on-device and not
+  sent to Google, while performance/utilization metrics are sent to Google and
+  publishers are responsible for informed consent where required. This creates
+  a material review question beside the repository's exact-version 0.10.35
+  provider-response and observed-network evidence. Do not infer that the generic
+  notice proves what version 0.10.35 transmits; require exact-version evidence
+  and qualified human privacy disposition.
+- WHATWG Storage Living Standard:
+  `https://storage.spec.whatwg.org/`. Local storage buckets are initially
+  best-effort and browser storage behavior is user-agent controlled; use this
+  only to support cautious retention/deletion questions, not erasure claims.
+- W3C Content Security Policy Level 3:
+  `https://www.w3.org/TR/CSP3/#meta-element`. Use it only to frame the limits of
+  meta-delivered CSP versus deployment headers, not to assert production
+  security.
+- U.S. FDA, “General Wellness: Policy for Low Risk Devices”:
+  `https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices`.
+  A qualified reviewer must assess intended use and actual product context; do
+  not classify Swing Sync.
+- U.S. FTC, “Health Products Compliance Guidance”:
+  `https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance`;
+  “Health Breach Notification Rule: The Basics for Business”:
+  `https://www.ftc.gov/business-guidance/resources/health-breach-notification-rule-basics-business`;
+  and “Children's Privacy”:
+  `https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy`.
+  Use these only to identify substantiation, actual-data-practice, audience,
+  and age-posture questions. Applicability remains unresolved.
+- USPTO, “Federal trademark searching”:
+  `https://www.uspto.gov/trademarks/search/federal-trademark-searching`.
+  Treat searching as evidence for a qualified trademark-review process, never
+  as clearance by itself.
+- Apache Software Foundation, Apache License 2.0:
+  `https://www.apache.org/licenses/LICENSE-2.0`. Project/dependency license
+  evidence does not substitute for product risk, trademark, privacy, or release
+  review.
+
+No release territory, intended audience or minor posture, hosting provider,
+monetization/legal entity, support model, or distribution channel is established
+in the embedded context. Do not fill those gaps with assumptions.
+
+## Research requirements
+
+Use current authoritative primary sources only when an external proposition is
+material to the gate design. For each such source, give the direct URL, issuing
+authority, page/document title, and access date `2026-08-08`. Prefer process-
+level guidance about substantiating public representations, privacy/security
+claims, health-product scope, endorsement/non-affiliation or trademark review,
+and release governance. Do not research or draft jurisdiction-specific legal
+clauses, decide enforceability, or infer that a source makes Swing Sync
+compliant. State clearly where jurisdiction, audience, distribution model, age
+group, data practice, or reviewer qualifications are unknown and require human
+decision.
+
+## Output required
+
+Return one structured response with these sections:
+
+1. **Executive boundary statement** — concise statement that this is research,
+   not advice or approval, and that qualified-human release sign-off remains
+   future and blocking.
+2. **Primary-source evidence register** — only material current sources, with
+   issuer, title, direct URL, access date, supported process question, and
+   limits on inference.
+3. **Traceable public-language inventory specification** — proposed schema and
+   populated inventory rows/categories mapping source path/location, exact or
+   faithful claim, category, audience/surface, status (`code/test-enforced
+   fact`, `documented design intent`, `unresolved assumption`, `qualified-human
+   review required`, or `non-goal/deferred`), concern/question, accountable
+   owner/reviewer type, evidence needed, decision required, and release-
+   blocking status. Include all surfaces named above and identify gaps.
+4. **Human-review checklist specification** — legal, privacy, safety/medical,
+   trademark/non-affiliation, and release-owner questions; open decisions;
+   evidence; accountable roles; sign-off fields. Explicitly make SS-002
+   assumption-of-risk and release-of-liability review a legal-review blocker.
+5. **Operational release-gate specification** — entry criteria, mandatory
+   artifacts, reviewer independence/qualification assumptions, permitted
+   outcomes (`APPROVED`, `APPROVED WITH CONDITIONS`, `CHANGES REQUIRED`,
+   `REJECTED`, or recommend safer labels), sign-off record fields, blocking
+   conditions, expiry/change triggers, reopening rules, and separation between
+   package completeness, Claude audit, human review, and actual public release.
+6. **Absolute-claim and contradiction assessment** — evaluate public docs,
+   runtime/export copy, metadata, and verifier coverage without claiming legal
+   sufficiency. Address the stale privacy/export sentence and test-only
+   “approved public docs” label explicitly.
+7. **Document ownership plan** — recommend one authoritative SS-020 package and
+   links from supporting docs rather than duplicated policy text. Name any
+   narrow supporting-doc correction separately and explain whether it belongs
+   in SS-020 or future work.
+8. **Verification plan** — documentation/verifier tests needed to prevent
+   contradictory approval claims, duplicate policy sources, missing warnings,
+   or fail-open inventory/gate structure. Distinguish automation from human
+   judgment and preserve the existing declarative/injected-reader architecture.
+9. **Recommendations for lead disposition** — list every broad recommendation
+   separately so the lead can mark it Adopt, Revise, Defer, or Reject. Keep
+   current acceptance criteria separate from future work.
+10. **Open questions and minimum human inputs** — smallest unresolved facts or
+    decisions needed from qualified reviewers; do not answer them yourself.
+
+End with the exact sentence:
+
+`No legal, privacy, safety, medical, trademark, compliance, or public-release clearance is asserted by this research response.`
diff --git a/docs/ss-020-preimplementation-spec.md b/docs/ss-020-preimplementation-spec.md
new file mode 100644
index 0000000..dc7ea30
--- /dev/null
+++ b/docs/ss-020-preimplementation-spec.md
@@ -0,0 +1,462 @@
+# SS-020 Preimplementation Specification
+
+Date: 2026-08-08
+Status: candidate; independent Lead Architect confirmation required
+
+## Problem statement
+
+Swing Sync contains public safety, privacy, export, medical-scope,
+non-affiliation, trademark, and limitation language, but it has no single
+operational package for future qualified-human review. Existing safety and
+privacy materials are drafts. SS-020 must make the future release gate usable
+without converting draft content, automated checks, or AI audits into approval.
+
+## Goals
+
+- Inventory the complete public claim surface and classify evidence strength.
+- Give qualified reviewers explicit questions, evidence, ownership, and
+  decision fields.
+- Preserve SS-002 assumption-of-risk and release-of-liability review as a
+  qualified-legal blocker.
+- Make release-gate entry, artifacts, outcomes, sign-off, blocking conditions,
+  and reopening rules operational.
+- Add bounded automated protection against missing gate warnings,
+  contradictory approval claims, and duplicated operational-policy ownership.
+- Preserve existing runtime, local-first, consent, data, export, provider,
+  deployment, dependency, and observability behavior.
+
+## Non-goals and protected boundaries
+
+- No legal advice, human sign-off, public-release approval, enforceability,
+  compliance, trademark-clearance, medical-approval, anonymity, deletion,
+  privacy, or safety guarantee.
+- No SS-002 risk/release rewrite.
+- No runtime TypeScript, HTML, manifest, service-worker, generated output, or UI
+  copy change.
+- No dependency, lockfile, license policy, notice, SBOM, bundle, SDK, model,
+  provider, API, persistence, remote-sharing, cloud-storage, deployment,
+  telemetry, analytics, logging, or data-flow/export-format change.
+- No change to local-first raw-media handling or explicit consent boundaries.
+- No normalization or rewriting of historical audit/source packets.
+- No change to the nine intentional untracked `docs/agent-guidance/` files.
+- Future human review work, SS-021 deletion UX, and SS-022 accuracy validation
+  remain separate.
+
+## Delivery mode and gates
+
+SS-020 uses Gated Delivery. Codex owns research/specification, implementation,
+verification, and repository state. The Lead Architect accepts or corrects the
+research baseline. Claude owns final independent adversarial audit. Qualified
+humans alone own future legal/privacy/safety/trademark/release decisions.
+
+The docs-only governance exception is used to omit separate preimplementation
+Claude QA planning. Conditions are satisfied only while implementation remains
+documentation and developer-verifier work with no runtime, dependency,
+provider, deployment, or data-flow change; current primary sources are recorded
+with access dates; and final Claude audit remains mandatory.
+
+Builder gate: an independent Lead Architect must state `APPROVED FOR BUILDER`.
+The Workflow Coordinator must synchronize Notion and `CONTEXT.md` when
+implementation starts and again when the final-audit handoff is ready.
+
+PR gate: Claude must return `PASS` and explicitly permit PR preparation. If
+Claude returns `PASS WITH MINOR FIXES`, apply and verify the fixes, then obtain
+any required focused re-review and explicit clearance before PR preparation.
+`FAIL` blocks PR preparation. Merge and post-merge synchronization remain
+separate events.
+
+Qualified-human sign-off remains a future public-release blocker. It is not a
+prerequisite to merge the SS-020 package, which exists to make that later gate
+operational without claiming it has passed.
+
+## Authoritative document ownership
+
+Create `docs/release-review-gate.md` as the only operational release-review
+gate. It owns:
+
+- current release-review status;
+- public-language inventory;
+- publication-review matrix;
+- qualified-human checklist and open-decision register;
+- primary-source register;
+- entry criteria and required artifacts;
+- decision outcomes and sign-off record;
+- blocking conditions and reopening rules;
+- deferred work and explicit non-goals.
+
+Existing documents retain domain ownership:
+
+- `docs/safety-terms.md`: SS-002 draft safety, risk, liability, consent, and
+  medical-scope language.
+- `docs/privacy-architecture.md`: data classes, local-first design, lifecycle,
+  export, remote-sharing, and provider privacy design.
+- `docs/limitations.md`: public accuracy, evidence, medical, export, browser,
+  and accessibility limitations.
+- `docs/deployment.md`: deployment/security assumptions and host-owner duties.
+- `docs/licensing.md`, `docs/models-licensing.md`, license/notice/model records:
+  engineering licensing and distribution evidence, not clearance.
+- `README.md` and `CONTRIBUTING.md`: summaries and navigation, not operational
+  gate duplicates.
+- `docs/ss-020-research-notes.md` and this disposition/spec: research and
+  architecture evidence, not policy or approval.
+
+Supporting documents may add only a concise link/status pointer to the canonical
+gate; they must not copy its checklist, decision model, or sign-off template.
+
+## Approved file scope
+
+Builder owns and may change only:
+
+- `docs/release-review-gate.md` — new canonical package.
+- `README.md` — add a concise link to the canonical gate.
+- `CONTRIBUTING.md` — link existing draft/pre-release guidance to the canonical
+  gate.
+- `docs/limitations.md` — add a concise release-review pointer.
+- `docs/safety-terms.md` — add a pointer while preserving all SS-002 draft text
+  and unchecked human-review items.
+- `docs/privacy-architecture.md` — add a pointer and make the approved narrow
+  factual correction described below.
+- `scripts/verify-docs-claims.js` — extend existing declarative configuration
+  and named cross-file checks only.
+- `test/unit/docs-claims.test.ts` — add named adversarial cases and correct the
+  misleading test title without changing its behavior.
+
+Workflow Coordinator alone owns:
+
+- `CONTEXT.md` — coordination, decisions, evidence, and gate state.
+- the SS-020 Notion task — status, branch, PR, evidence, and handoffs;
+- later audit artifacts: `docs/ss-020-claude-audit-prompt.md` and, when needed,
+  `docs/ss-020-claude-audit-source-packet.md`.
+
+These coordination and audit paths remain in delivery scope but are not Builder
+write authority.
+
+Any need to change another tracked file, runtime behavior, licensing policy,
+notices, SBOM, dependency, bundle, or deployment surface stops implementation
+and requires renewed Lead Architect scope approval.
+
+## Authorized narrow factual correction
+
+In `docs/privacy-architecture.md`, replace only the stale assertion that exports
+are not implemented. The corrected paragraph must say, without expanding
+claims, that the current app implements local file selection, local Pose
+Landmarker inference, and user-initiated local Swing Card PNG, print/PDF, and
+prompt-copy workflows; it does not implement camera capture, raw-video or
+landmark persistence, remote sharing, or remote model APIs. Retain the local
+acknowledgement limitation.
+
+This is a current-behavior correction, not privacy review or approval. Runtime
+and exported data remain unchanged.
+
+## Canonical package requirements
+
+`docs/release-review-gate.md` must include the following sections and content.
+
+### 1. Prominent current status
+
+At the top, state all of:
+
+- `DRAFT — HUMAN REVIEW PACKAGE`
+- `Current outcome: PENDING`
+- `PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED`
+- no legal/privacy/safety/medical/trademark/compliance/release clearance;
+- Claude and automated checks cannot substitute for qualified humans.
+
+### 2. Evidence taxonomy
+
+Define and use exactly these classifications:
+
+1. `Code/test-enforced fact`
+2. `Documented design intent`
+3. `Unresolved assumption`
+4. `Qualified-human review required`
+5. `Deferred / non-goal`
+
+Do not collapse design intent into implemented fact or verifier pass into
+human approval.
+
+### 3. Traceable public-language inventory
+
+Each row must contain:
+
+- source path and stable section/string location;
+- claim category;
+- statement or faithful summary;
+- audience/surface;
+- evidence classification;
+- supporting code/test/document evidence;
+- review concern or open question;
+- accountable owner/reviewer type;
+- evidence or decision required;
+- release-blocking status;
+- current disposition.
+
+Inventory at least:
+
+- README purpose, non-medical, current-capability, local-first, export,
+  draft-review, license, non-affiliation, and third-party-name language;
+- CONTRIBUTING safety/privacy/claims and explicit SS-002 gate language;
+- safety-terms draft banner, medical scope, assumption of risk, release of
+  liability, consent, AI constraints, and unchecked reviewer questions;
+- privacy draft banner, current implementation, data classes, lifecycle,
+  deletion limits, exports, remote sharing, provider/telemetry evidence, and
+  user-facing copy drafts;
+- limitations accuracy, evidence, medical, safety, privacy/export, remote,
+  browser, accessibility, and future validation language;
+- deployment draft, no-backend/current-host assumptions, CSP/header ownership,
+  logging/telemetry, service worker, and future backend gate language;
+- licensing/model/fixture/model-asset/license/notice evidence, including the
+  preliminary trademark-search requirement;
+- `index.html`, manifest, and package description metadata;
+- runtime consent/safety, workflow status, phase limits, remote-unavailable,
+  and error/status copy;
+- Swing Card PNG/print/copy prompt, warning, and coaching contract/output copy;
+- historical `docs/ss-*` artifacts as repository-public evidence, explicitly
+  non-authoritative and excluded from normalization.
+
+For runtime/generated content, inventory exact owning files and representative
+strings without editing them.
+
+### 4. Publication-review matrix
+
+For README, CONTRIBUTING, limitations, safety, privacy, deployment,
+licensing/model/notice materials, metadata, runtime UI, exports/generated
+content, and historical repository evidence, record:
+
+- whether separate review is `Yes`, `Conditional`, or `No with rationale`;
+- required reviewer role;
+- evidence required;
+- current status;
+- release-blocking effect.
+
+Every current sensitive surface should remain `Pending` unless authenticated,
+scoped human evidence is attached. Do not infer approval from existing wording.
+
+### 5. Qualified-human checklist and open decisions
+
+Use unchecked checklist rows or a table with, at minimum:
+
+- question/open decision;
+- accountable reviewer role;
+- evidence required;
+- required sign-off;
+- blocking status;
+- current result.
+
+Cover:
+
+- SS-002 risk/release language, jurisdiction, enforceability, consent
+  conspicuousness, age/capacity, and contributor/maintainer/distributor scope;
+- intended use, non-medical positioning, safety instructions, consumer net
+  impression, evidence/accuracy limitations, and reviewer qualifications;
+- data inventory, local storage, export sensitivity, deletion limitations,
+  third-party manual sharing, audience/age posture, territories, and notices;
+- current generic MediaPipe notice versus exact `0.10.35` evidence;
+- non-affiliation, project name/branding, preliminary search evidence, and
+  trademark decision;
+- licenses, notices, model/provider evidence, release entity/business model,
+  distribution channels, host/security headers, support, and incident/contact
+  ownership;
+- publication boundary for historical repository evidence.
+
+### 6. Operational gate contract
+
+Entry criteria:
+
+- immutable candidate commit/PR/release target;
+- named release scope, channels, territories, audience/age posture, host, and
+  legal/release owner;
+- complete public-surface inventory and current focused diff;
+- current verification, runtime/data/deployment posture, and source register;
+- named qualified reviewer roles;
+- assigned open decisions with evidence;
+- no unreviewed sensitive change after candidate freeze.
+
+Required artifacts:
+
+- canonical package and inventory;
+- candidate commit/focused diff;
+- verification evidence;
+- external-source register;
+- open-decision and response log;
+- reviewer comments or attachments;
+- completed sign-off record;
+- conditions, residual risks, and expiry where applicable.
+
+Permitted future outcomes:
+
+- `PENDING`
+- `APPROVED FOR NAMED SCOPE`
+- `APPROVED WITH CONDITIONS`
+- `CHANGES REQUIRED`
+- `REJECTED / HOLD`
+- `NOT APPLICABLE WITH RATIONALE`
+
+The package must define these labels but leave the current outcome `PENDING`.
+
+Sign-off record fields:
+
+- candidate commit and release version/scope;
+- territories, audience, channels, and host;
+- reviewer identity, accountable role, and qualification basis;
+- artifact/evidence versions;
+- decision and date;
+- conditions, expiry, residual risks, and unresolved issues;
+- required follow-up owner/date;
+- confirmation that post-review changes were checked.
+
+Blocking conditions:
+
+- missing/ambiguous release scope, candidate, reviewer, qualification, evidence,
+  or sign-off field;
+- SS-002 legal review not completed;
+- unresolved absolute, medical, privacy, deletion, anonymity, compliance,
+  trademark, or contradictory public wording;
+- unresolved MediaPipe/provider evidence;
+- missing trademark/publication decision;
+- failed required verifier/build/audit;
+- changed candidate or unreviewed sensitive diff;
+- stale/expired source or conditional approval.
+
+Reopening rules:
+
+- public safety/privacy/medical/legal/trademark/accuracy copy changes;
+- project name, logo, entity, business model, audience, minor posture,
+  territory, channel, host, or support model changes;
+- runtime, data class, storage, deletion, export, remote sharing, provider,
+  model, dependency, license, service-worker, logging, telemetry, or deployment
+  changes;
+- material provider terms, source, standard, law, or guidance change;
+- incident, complaint, audit finding, expired condition, or post-review diff.
+
+### 7. Primary-source register
+
+Carry forward the direct URLs and `2026-08-08` access date from
+`docs/ss-020-research-notes.md`. For each source, record its process question
+and limit on inference. Do not claim applicability or compliance.
+
+### 8. Non-goals and deferred work
+
+List actual human review, jurisdiction-specific drafting, production-host
+approval, trademark clearance, SS-021 deletion UX, SS-022 validation, provider
+changes, runtime-copy changes, and all protected implementation boundaries.
+
+## Verifier design
+
+Extend the existing declarative `files`, `requiredStrings`, and
+`crossFileChecks` registries and injected `fileReader` mechanism in
+`scripts/verify-docs-claims.js`. Do not rename or broadly refactor those
+registries.
+
+Required declarative registrations:
+
+- add `docs/release-review-gate.md` to `files` as a required configured
+  document;
+- add its top status strings, evidence-taxonomy labels, SS-002 blocker,
+  operational headings, source date, and no-clearance boundary;
+- require README, CONTRIBUTING, limitations, safety, and privacy documents to
+  link to `./docs/release-review-gate.md` or the correct relative equivalent;
+- keep the existing standard prohibited-claim scan on its current configured
+  public summaries; do not add safety, privacy, or the canonical gate to that
+  standard scan because their draft/inventory text legitimately names
+  prohibited claim categories;
+- register safety, privacy, and the canonical gate through structural,
+  required-string, and link checks instead;
+- add a dedicated declarative premature-current-approval check for the
+  canonical gate. It must reject assertions that legal, privacy, safety,
+  trademark, or public-release review “is complete,” “has passed,” or “is
+  cleared,” while allowing future outcome definitions and negated/no-clearance
+  statements;
+- add a normalized unique-owner cross-file check for the exact
+  `PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED` anchor across the
+  canonical gate and the named supporting documents. The anchor must occur
+  exactly once, in the canonical gate; supporting docs link to it without
+  copying it;
+- make every new structural, link, premature-approval, and unique-owner read use
+  the injected `fileReader`;
+- keep historical audit artifacts outside normalization and uniqueness scans.
+
+Do not introduce a general Markdown parser. If implementation determines that
+new extraction/parsing is unavoidable, stop for renewed architecture approval
+and add the full missing/empty/formatting/embedded-delimiter/fail-closed test
+matrix before proceeding.
+
+## Required named unit coverage
+
+In `test/unit/docs-claims.test.ts`, add or rename tests with clear names proving:
+
+- accepts the current configured public docs and pending release gate;
+- fails when the canonical release-gate file is missing;
+- fails when the canonical release-gate file is empty;
+- fails when the draft/pending/blocked banner or current outcome is missing;
+- fails when the SS-002 legal-review blocker is removed;
+- fails when an operational heading or required supporting link is removed;
+- fails when canonical status/sign-off control text is duplicated in a
+  supporting document;
+- fails on a premature completed-review or public-release-clearance assertion;
+- allows future outcome definitions that do not assert a current approval;
+- allows negated no-clearance language;
+- tolerates harmless heading/whitespace formatting already supported by the
+  declarative mechanism;
+- preserves existing missing/empty/cross-file/embedded-delimiter/fail-closed
+  coverage.
+
+Rename the existing “approved public docs” test to “configured public docs” or
+equivalent. This is test-only terminology correction; behavior remains the
+same.
+
+## Acceptance-criteria mapping
+
+1. Inventory: canonical traceable inventory plus publication-surface manifest.
+2. Human checklist: question/evidence/role/sign-off/blocking table and open-
+   decision register.
+3. SS-002: explicit qualified-legal-review blocker in status, inventory,
+   checklist, and verifier.
+4. Absolute claims: repository-wide research inventory, current public-doc
+   verifier, premature-approval checks, and human-review limits.
+5. Separate public wording review: publication-review matrix covering README,
+   limitations, contributor, deployment, metadata, UI/export, licensing, and
+   repository evidence.
+6. Operational gate: entry criteria, artifacts, outcomes, sign-off record,
+   blockers, and reopening rules with current `PENDING/BLOCKED` state.
+
+## Verification plan
+
+Use Node 22 from `.nvmrc`. Run, in order:
+
+1. `npm run test:unit -- docs-claims --reporter=verbose`
+2. `npm run docs:verify`
+3. `npm run safety:verify`
+4. `npm run privacy:verify`
+5. `npm run compliance:verify`
+6. `npm run build`
+7. `git diff --check`
+
+Record exact outcomes. No dependency/licensing/bundle/notice/SBOM change is
+expected. If any occurs, stop and obtain renewed scope approval before running
+the additional licensing suite required by `AGENTS.md`.
+
+## Observability decision
+
+Runtime observability is unchanged because SS-020 is documentation/release
+governance only. Do not add logs, telemetry, analytics, remote logging, cloud
+diagnostics, hidden identifiers, persistent debug artifacts, or runtime
+operator instrumentation.
+
+## Audit handoff requirements
+
+After implementation and verification, create a self-contained Claude final-
+audit prompt with Role, Stage, Scope, Context, Acceptance criteria, Protected
+boundaries, exact changed-file contents or complete focused diffs, Verification,
+Known non-goals, and Output required. Enumerate every changed tracked file,
+including `CONTEXT.md`; provide a mechanically checkable source packet if the
+prompt cannot inline all evidence.
+
+Require one verdict: `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`; separate
+blockers from non-blockers; and explicitly state whether PR preparation is
+allowed. Claude audits package completeness and boundary discipline only.
+
+## Approval
+
+Independent Lead Architect confirmation is pending. Builder must not begin
+until the Lead Architect returns `APPROVED FOR BUILDER` against this exact spec.
diff --git a/docs/ss-020-research-disposition.md b/docs/ss-020-research-disposition.md
new file mode 100644
index 0000000..c3afc8d
--- /dev/null
+++ b/docs/ss-020-research-disposition.md
@@ -0,0 +1,142 @@
+# SS-020 Research Disposition
+
+Date: 2026-08-08
+
+This document records Lead Architect candidate dispositions for
+`docs/ss-020-research-notes.md`. It is an engineering and release-governance
+decision record, not legal, privacy, safety, medical, trademark, compliance, or
+public-release advice or approval.
+
+## Routing decision
+
+The current Multi-Agent SDLC Framework makes Codex the default Deep Researcher
+and Specification Drafter. The human owner confirmed that Gemini free-plan
+Deep Research is unavailable. The earlier
+`docs/ss-020-gemini-research-prompt.md` is superseded for paste use and remains
+historical evidence only.
+
+SS-020 remains in Gated Delivery. The docs-only governance exception is used to
+omit a separate preimplementation Claude QA-planning round because the approved
+scope changes no runtime code, production dependency, provider integration,
+deployment behavior, or user data flow; Codex checked current primary sources;
+and final independent Claude audit remains mandatory.
+
+## Adopt
+
+1. Create one canonical `docs/release-review-gate.md` owning the release-review
+   status, public-claim inventory, reviewer checklist, operational lifecycle,
+   open decisions, source register, and unfilled sign-off record.
+2. Keep safety, privacy, limitations, deployment, licensing, model, fixture,
+   and notice documents as their existing domain authorities. Link to the
+   canonical gate rather than duplicating its operational rules.
+3. Use a prominent current state equivalent to `PUBLIC RELEASE BLOCKED — HUMAN
+   SIGN-OFF NOT RECORDED`. The document may define future outcomes without
+   implying that an outcome has been selected.
+4. Use the evidence taxonomy: code/test-enforced fact; documented design
+   intent; unresolved assumption; qualified-human review required; and
+   deferred/non-goal.
+5. Require each inventory row to record source location, claim/category,
+   audience/surface, classification, supporting evidence, review concern,
+   accountable reviewer role, required decision, release-blocking status, and
+   current disposition.
+6. Make SS-002 assumption-of-risk and release-of-liability language an explicit
+   qualified-legal-review blocker. Preserve its unchecked status.
+7. Require future sign-off to bind reviewer identity, role/qualification,
+   candidate commit, release scope, audience, territory, channel/host, evidence,
+   date, decision, conditions, expiry, unresolved issues, and reopening rules.
+8. Use scoped future outcomes: `PENDING`, `APPROVED FOR NAMED SCOPE`,
+   `APPROVED WITH CONDITIONS`, `CHANGES REQUIRED`, `REJECTED / HOLD`, and
+   `NOT APPLICABLE WITH RATIONALE`. Current outcome remains `PENDING` and
+   release remains blocked.
+9. Record source URLs and access date `2026-08-08`, including the unresolved
+   relationship between Google's current generic MediaPipe privacy notice and
+   exact-version `0.10.35` provider/observed-network evidence.
+10. Extend `scripts/verify-docs-claims.js` through its existing declarative
+    `files`, `requiredStrings`, and `crossFileChecks` registries and injected
+    reader. Add focused tests in `test/unit/docs-claims.test.ts`; do not create
+    a second verifier or policy parser.
+11. Treat verification as bounded structural/factual evidence, never legal,
+    privacy, safety, trademark, compliance, or release approval.
+12. Keep runtime observability unchanged. Add no telemetry, analytics, logging,
+    diagnostics, hidden identifiers, or persistent debug artifacts.
+
+## Revise
+
+1. Revise blanket “approval” concepts into commit-, scope-, reviewer-, date-,
+   evidence-, and condition-bound decisions.
+2. Revise local-first/privacy statements into bounded current facts plus
+   explicit limitations. Do not infer anonymity, guaranteed privacy, guaranteed
+   deletion, or control after export.
+3. Revise trademark-search language to preliminary evidence for a qualified
+   decision. A search or non-affiliation disclaimer is not clearance.
+4. Revise the test name `accepts the current approved public docs` to avoid
+   suggesting human approval. The authorized replacement must use
+   `current configured public docs` or equivalent structural language without
+   changing test behavior.
+5. Authorize a narrow factual correction to
+   `docs/privacy-architecture.md:16-20`: current local Swing Card PNG,
+   print/PDF, and prompt-copy workflows exist, while camera capture, raw-video
+   or landmark persistence, remote sharing, and remote model APIs remain
+   unimplemented. The edit corrects current behavior only; it does not approve
+   the privacy document or any export practice.
+6. Revise the research recommendation to scan every historical packet for
+   prohibited claims. Immutable audit evidence must instead be inventoried as a
+   separate repository-publication category and excluded from normalization or
+   policy-source uniqueness checks.
+
+## Defer
+
+- Actual qualified-human legal, privacy, safety/medical-scope, trademark, and
+  public-release decisions or signatures.
+- Jurisdiction-specific waiver, governing-law, dispute, arbitration,
+  class-action, minor/guardian, and privacy-notice language.
+- Release territories, intended audience/minor posture, business/legal entity,
+  monetization, distribution channels, production host, and support policy.
+- Trademark clearance, registration, or branding approval.
+- Production provider/host review and any provider upgrade.
+- SS-021 clear-local-data behavior and deletion UX.
+- SS-022 real-user/video accuracy validation.
+- Runtime safety/privacy/export copy changes other than the approved factual
+  privacy-document correction, which is documentation only.
+- Runtime observability, telemetry, remote logging, or diagnostics.
+
+## Reject
+
+- Treating Codex, Gemini, Claude, automated verification, licenses, notices,
+  non-affiliation language, or this package as a substitute for qualified-human
+  review.
+- Rewriting the SS-002 assumption-of-risk or release-of-liability draft in
+  SS-020.
+- Claiming enforceability, compliance, trademark clearance, medical approval,
+  complete anonymity, guaranteed deletion, guaranteed privacy, guaranteed
+  safety, or public-release approval.
+- Adding runtime features, providers, model calls, SDKs, dependencies,
+  persistence, service-worker behavior, data-flow/export-format behavior,
+  remote sharing, deployment changes, telemetry, analytics, cloud storage, or
+  logging.
+- Creating a parallel verifier/parser or duplicating the canonical operational
+  gate across supporting documents.
+- Editing, normalizing, or absorbing historical audit packets or the nine
+  protected untracked `docs/agent-guidance/` files.
+
+## Weak claims retained
+
+- Repository evidence cannot prove that no external human review exists; any
+  claimed external evidence must be authenticated and scoped before use.
+- Browser and network tests are environment- and fixture-bounded.
+- The current generic MediaPipe notice does not establish exact behavior for
+  pinned version `0.10.35`; version-specific evidence does not cover upgrades.
+- “Public-facing” requires a human publication-boundary decision, including
+  whether historical repository evidence is in scope.
+- Non-medical disclaimers do not determine regulatory classification or overall
+  consumer impression.
+
+## Decision
+
+These dispositions are the candidate architecture baseline. Builder work may
+begin only after a Lead Architect independently confirms the paired
+`docs/ss-020-preimplementation-spec.md` and explicitly states
+`APPROVED FOR BUILDER`.
+
+No human legal, privacy, safety, medical, trademark, compliance, or
+public-release clearance is recorded here.
diff --git a/docs/ss-020-research-notes.md b/docs/ss-020-research-notes.md
new file mode 100644
index 0000000..9003fe8
--- /dev/null
+++ b/docs/ss-020-research-notes.md
@@ -0,0 +1,396 @@
+# SS-020 Codex Deep Research Notes
+
+Date: 2026-08-08
+Research owner: Codex Deep Researcher
+Decision informed: the implementation-ready scope for a human legal, privacy,
+safety, trademark, and public-release review gate
+Status: research input only; Lead Architect disposition required
+
+## Boundary statement
+
+This report is product, engineering, and release-governance research. It is not
+legal, medical, privacy, safety, trademark, regulatory, or compliance advice.
+It does not establish that a review occurred, that a claim is lawful or
+sufficient, or that Swing Sync is cleared for public release.
+
+Qualified humans must make future legal, privacy, safety, medical-scope,
+trademark, and release decisions. Claude may audit the completeness and
+boundary discipline of the SS-020 package but cannot substitute for those
+reviewers.
+
+## Research question and method
+
+Question: what repository evidence, current primary-source context, unresolved
+decisions, and operational controls must an SS-020 package expose so qualified
+humans can later make a scoped public-release decision?
+
+Method:
+
+1. Search tracked documentation, public metadata, runtime-rendered copy,
+   generated/exported copy, verifier scripts, and tests for safety, privacy,
+   deletion, anonymity, medical, legal, compliance, export, non-affiliation,
+   trademark, limitation, consent, provider, and release language.
+2. Classify repository statements as code/test-enforced facts, documented
+   design intent, unresolved assumptions, qualified-human-review items, or
+   deferred/non-goals.
+3. Check current primary sources only where they inform the review process or
+   expose a material change. Record direct URLs and the access date.
+4. Separate sourced findings from recommendations. Preserve uncertainty and do
+   not make jurisdiction-specific or applicability conclusions.
+
+Research write boundary: this phase may create research/specification and
+coordination documents only. It does not authorize runtime, test, dependency,
+lockfile, generated-artifact, SBOM, notice, deployment, provider, data-flow, or
+external-system implementation changes.
+
+## Repository findings
+
+### 1. SS-002 risk and liability language is an unresolved legal blocker
+
+- `docs/safety-terms.md:20-45` contains draft assumption-of-risk and
+  release-of-liability language, including “to the maximum extent permitted by
+  applicable law.”
+- `docs/safety-terms.md:105-117` retains an unchecked human-review checklist.
+- `src/app-renderer.ts:53-66` renders the safety acknowledgement, physical-risk
+  acknowledgement, and statement that the local acknowledgement is not a
+  durable or legally audited consent record.
+- `CONTRIBUTING.md:115-119` explicitly preserves qualified legal/human review of
+  the SS-002 assumption-of-risk and release-of-liability language as a
+  pre-release gate.
+- `docs/ss-002-research-disposition.md` frames the language as a draft, rejects
+  enforceability claims, and defers jurisdiction-specific decisions.
+
+Finding: repository evidence does not show qualified legal approval. The
+SS-002 language must be a named release-blocking checklist item, not a completed
+acceptance box.
+
+### 2. Public purpose and medical-scope surfaces
+
+| Surface | Current role | Review concern |
+| --- | --- | --- |
+| `README.md:3-9` | Product purpose and non-medical boundary | Public net impression of educational analysis and movement feedback |
+| `CONTRIBUTING.md:105-123` | Contributor-facing medical/privacy summary | Consistency with authoritative drafts and release gate |
+| `docs/safety-terms.md:9-18,47-103` | Intended use, safety, consent, AI-output limits | Qualified legal and safety/medical-scope review remains pending |
+| `docs/limitations.md:8-42` | Accuracy, coaching, and medical limitations | Whether limitations are complete, prominent, and consistent |
+| `src/app-renderer.ts:53-66` | Runtime acknowledgement | Conspicuousness, audience, consent meaning, and physical-risk language |
+| `src/swing-card-generator.ts:72-87` | Copied manual-LLM prompt | Exported non-medical, no-guarantee, and no-anonymity wording |
+| `src/coaching-prompt.ts` and `src/coaching-contract.ts` | Generated coaching contract and prohibited output | Test-enforced safety boundary, not medical approval or efficacy evidence |
+| `package.json:7` | Package metadata: “AI golf swing analysis coach” | May imply broader AI/coaching behavior than the empty remote-provider registry and no hosted-model call |
+
+Finding: non-medical disclaimers are relevant evidence but cannot alone decide
+consumer net impression, regulatory classification, medical scope, or legal
+sufficiency.
+
+### 3. Local-first, privacy, storage, and deletion surfaces
+
+| Surface | Current statement/evidence | Classification or concern |
+| --- | --- | --- |
+| `README.md:24-36` | Raw video is not uploaded by default; separate opt-in for future outbound data; drafts do not guarantee privacy/deletion/anonymity/compliance | Public summary; requires evidence mapping and human privacy review |
+| `docs/privacy-architecture.md:3-58` | Draft local-first architecture and data classes | Design authority, not approved privacy notice or guarantee |
+| `docs/privacy-architecture.md:60-83` | Browser storage variability and deletion limits | Design intent; clear-data behavior is not current device-level erasure |
+| `docs/limitations.md:44-68` | Local processing, export sensitivity, remote unavailability | Public limitations; must stay consistent with runtime |
+| `docs/deployment.md:89-98` | Local-first/default network posture | Host- and environment-dependent deployment claim |
+| `src/consent-state.ts:12-35` | One local acknowledgement key | Code fact bounded to the current implementation |
+| `test/smoke/app.spec.ts` | Checks acknowledgement storage, no unexpected network requests, and export behavior in tested browser paths | Environment/fixture-bounded evidence, not universal privacy proof |
+| `public/sw.js` | Install/activate handlers only | Current service-worker fact; not a general no-cache guarantee for all hosts/future builds |
+
+Finding: “local-first” is a scoped product architecture statement, not a
+guarantee that outputs are anonymous, that a browser/device retains or erases
+data in a particular way, or that every deployment environment has identical
+network behavior.
+
+### 4. Confirmed privacy/export contradiction
+
+`docs/privacy-architecture.md:16-20` says the current application does not
+implement exports. `README.md:13-15`, the Swing Card runtime modules, and smoke
+tests show local PNG download, browser print/PDF, and prompt-copy workflows.
+
+Finding: this is a stale public factual statement. The release package must
+classify it as unresolved and release-blocking until corrected or dispositioned.
+A narrow factual correction may be proposed by the Lead Architect; research
+does not silently authorize editing sensitive copy or represent the corrected
+document as approved.
+
+### 5. Export and manual-sharing surfaces
+
+- `docs/privacy-architecture.md:85-102,124-151` defines data-minimized,
+  user-initiated exports and warns that exported data may remain identifying.
+- `docs/limitations.md:44-57` explains that exported PNG/PDF/prompt content
+  leaves application control and that another service's terms apply after
+  manual upload.
+- `src/app-renderer.ts`, `src/swing-card-actions.ts`, and
+  `src/swing-card-generator.ts` own public Swing Card readiness, PNG, print/PDF,
+  copy-prompt, warning, and generated-content wording.
+- The generated manual prompt says not to claim the card is anonymous or that
+  third-party upload is private.
+
+Finding: human review must inspect actual export data classes and rendered
+artifacts, not only README summaries. User initiation and local generation do
+not establish anonymity, confidentiality after download, or third-party
+privacy.
+
+### 6. Remote provider and model surfaces
+
+- `README.md:17-22` states that no production remote model provider, SDK, API
+  key, server route, or hosted-model call is configured.
+- `src/model-consent.ts` has an empty production provider registry.
+- `src/remote-model-renderer.ts` renders an unavailable/off-by-default remote
+  review panel and hypothetical outbound data classes.
+- `docs/privacy-architecture.md:104-123,168-200`,
+  `docs/models-licensing.md`, provider tests, and model asset/notice files
+  describe reviewed local inference and future provider gates.
+
+Finding: current absence of a configured remote provider is a bounded code/test
+fact. Descriptions of hypothetical sharing or provider approval must not be
+read as authorization for a provider, remote transmission, or future version.
+
+### 7. Current MediaPipe privacy notice requires explicit disposition
+
+The repository records a June 10, 2026 response from a MediaPipe repository
+collaborator for the evaluated Web SDK. The response says the then-current Web
+SDK did not include telemetry, that future aggregated performance/usage
+collection was planned, and that outbound requests could be blocked while the
+SDK continued to operate. The project pinned `@mediapipe/tasks-vision@0.10.35`
+and recorded observed-network verification.
+
+Google's generic MediaPipe Tasks notice was modified June 5, 2026 and currently
+states that task inputs are processed on-device and not sent to Google, while
+the APIs send performance/utilization metrics and publishers are responsible
+for informed consent where required.
+
+Finding: the generic notice does not prove that pinned Web SDK version 0.10.35
+transmits metrics, and the version-specific response does not approve future
+versions. The apparent tension requires exact-version artifact/network
+evidence plus qualified human privacy disposition before release. SS-020 must
+not resolve it through inference.
+
+### 8. Accuracy, limitation, and safety-evidence surfaces
+
+- `docs/limitations.md:8-42,70-82` documents algorithm, video-quality,
+  keyframe, metric, browser, and accessibility limitations.
+- `src/phase-review-renderer.ts`, Swing Card warning labels, fixture policy,
+  and unit/smoke tests expose partial, unavailable, review-required, and
+  limited-evidence states.
+- SS-022 is separately planned for real-user/video accuracy validation.
+
+Finding: these are design limitations and bounded test evidence. They do not
+establish scientific validation, universal accuracy, injury prevention,
+performance improvement, or safe use for every person.
+
+### 9. Non-affiliation, trademark, licensing, and notices
+
+- `README.md:101-106` contains the canonical public non-affiliation statement.
+- `scripts/verify-docs-claims.js` enforces that block in configured public docs.
+- `docs/licensing.md` says preliminary trademark searching and a qualified
+  human/legal decision remain required before broader naming or branding use.
+- `LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.md`, model-asset records, and
+  provider notices are distribution evidence.
+- Apache-2.0 section 6 addresses trademark permission within the license but is
+  not project-name clearance or product release approval.
+
+Finding: a non-affiliation disclaimer, license audit, notice aggregation, or
+preliminary search is not trademark clearance. Broader publication requires a
+separately recorded qualified decision.
+
+### 10. Deployment, security, and compliance surfaces
+
+- `docs/deployment.md:3-9` is prominently draft and disclaims legal, security,
+  privacy, deletion, anonymity, medical, trademark-clearance, and regulatory-
+  compliance advice or guarantees.
+- The file documents current frontend/no-backend assumptions, meta CSP,
+  deployer-owned headers, no app-owned server logging, local-first processing,
+  service-worker scope, and future architecture-review triggers.
+- `index.html` includes a meta-delivered CSP. Production response headers and
+  host behavior are not established by that markup alone.
+
+Finding: a release candidate needs chosen-host and response-header evidence.
+Repository configuration cannot establish every production deployment control
+or a general security/compliance conclusion.
+
+### 11. Public repository and historical evidence boundary
+
+The repository contains many tracked `docs/ss-*` prompts, responses, source
+packets, and audit records that repeat historical sensitive language. These
+files are evidence, not active product policy, but may be publicly readable if
+the repository is published.
+
+Finding: the release owner must define the publication boundary and classify
+historical evidence separately from authoritative live claims. Automated
+non-duplication checks must not rewrite, normalize, or invalidate immutable
+audited packets.
+
+## Candidate public-surface manifest
+
+The implementation inventory should explicitly cover at least:
+
+- Root/public summaries: `README.md`, `CONTRIBUTING.md`, `index.html`,
+  `public/manifest.webmanifest`, `package.json`.
+- Core public docs: `docs/limitations.md`, `docs/privacy-architecture.md`,
+  `docs/safety-terms.md`, `docs/deployment.md`, `docs/licensing.md`,
+  `docs/models-licensing.md`, and `docs/fixture-policy.md`.
+- License/notice/model evidence: `LICENSE`, `NOTICE`,
+  `THIRD_PARTY_NOTICES.md`, `docs/model-assets/*`, and
+  `docs/third-party-notices/*`.
+- Historical decision evidence: `docs/ss-002-research-disposition.md` and
+  repository-public `docs/ss-*` research/audit artifacts, clearly labeled as
+  evidence rather than current policy.
+- Runtime-rendered copy: consent/safety acknowledgement, workflow status,
+  phase limitations, remote-review-unavailable panel, and error/status copy.
+- Generated or user-controlled outputs: Swing Card PNG, print/PDF surface,
+  copied prompt, warning labels, coaching prompt and response boundaries.
+- Verification evidence: safety, privacy, documentation, compliance, unit, and
+  smoke verifiers/tests. These substantiate bounded facts but are not public-
+  release approval.
+
+Each final inventory row should record source location, statement or claim
+category, audience/surface, evidence status, review concern, accountable
+reviewer role, evidence needed, required decision, release-blocking status, and
+current disposition.
+
+## Existing verifier architecture and gaps
+
+### Existing strengths
+
+- `scripts/verify-docs-claims.js` uses shared declarative `files`,
+  `requiredStrings`, and `crossFileChecks` registries, prohibited-claim
+  categories, allowed negated disclaimers, and an injected file reader.
+- `test/unit/docs-claims.test.ts` covers current positive behavior; missing
+  documents/headings/strings/links; placement; reordered/whitespace formatting;
+  missing, empty, or unextractable cross-file values; embedded delimiters; and
+  negative claim fixtures.
+- `scripts/verify-safety-terms.js` checks required SS-002 draft, medical, risk,
+  liability, consent, and runtime boundaries.
+- `scripts/verify-privacy-boundaries.js` checks the privacy draft banner,
+  local-first/export/remote boundaries, consent/runtime source, prohibited
+  absolute claims, and known network/data patterns.
+- `npm run compliance:verify` composes the project governance checks.
+
+### Gaps requiring Lead Architect disposition
+
+- Broad prohibited-claim scanning currently covers only README, limitations,
+  CONTRIBUTING, and deployment. Safety/privacy documents receive targeted
+  checks, while runtime/export copy, metadata, licensing/model docs, and the
+  future release package are not all covered by the same public-claim registry.
+- No canonical release-gate document, pending sign-off schema, unique control
+  anchor, or supporting-link requirement exists.
+- A unit-test title says “approved public docs,” although the relevant public
+  materials are explicitly drafts pending human review. Test pass should mean
+  structurally verified, not human/legal approved.
+- Automation does not and cannot establish reviewer qualification, legal
+  sufficiency, trademark clearance, privacy-law applicability, medical status,
+  or public-release authorization.
+
+If the verifier changes, it should extend the existing declarative config and
+injected-reader architecture. A one-off parser or disconnected scanner would
+create a second policy source. Required adversarial tests should cover missing
+and empty gate files, banner/heading/link removal, missing SS-002 warning,
+missing current-blocked status, duplicate canonical control text, premature
+approval claims, positive outcome definitions that do not assert approval,
+formatting changes, failure cases, and positive cases. If new parsing is
+introduced, add embedded-delimiter and fail-closed cases explicitly.
+
+## Primary-source register
+
+All sources below were accessed on 2026-08-08. They inform questions and
+evidence requirements only; no applicability or compliance conclusion is made.
+
+| Issuer/source | Direct URL | Process finding | Limit on inference |
+| --- | --- | --- | --- |
+| Google, MediaPipe Tasks Privacy Notice | https://developers.google.com/edge/mediapipe/solutions/tasks#mediapipe_tasks_privacy_notice | Current generic notice distinguishes on-device input processing from performance/utilization metrics | Does not establish exact `0.10.35` network behavior or project consent duty |
+| MediaPipe repository collaborator response, issue #6306 | https://github.com/google-ai-edge/mediapipe/issues/6306#issuecomment-4673728357 | Version-context evidence says the then-current Web SDK lacked telemetry and future collection was planned | Repository comment is not a future-version guarantee, legal opinion, or release approval |
+| WHATWG Storage Living Standard | https://storage.spec.whatwg.org/ | Local storage buckets begin as best-effort; user-agent storage behavior varies | Does not prove device-level retention or erasure behavior for every browser/device |
+| W3C Content Security Policy Level 3, meta delivery | https://www.w3.org/TR/CSP3/#meta-element | Meta-delivered policy has timing/directive limits compared with response headers | Does not prove a specific host's production security posture |
+| U.S. FDA, General Wellness: Policy for Low Risk Devices | https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices | Intended use and product context are material review inputs | No Swing Sync classification or approval is inferred |
+| U.S. FTC, Health Products Compliance Guidance | https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance | Express and implied claims, substantiation, disclosures, audience, and net impression require review | Guidance is not a project-specific decision or safe harbor |
+| U.S. FTC, Health Breach Notification Rule: The Basics for Business | https://www.ftc.gov/business-guidance/resources/health-breach-notification-rule-basics-business | Actual data practices and identifying-health-information questions may affect review | Applicability cannot be resolved without release/data/business facts |
+| U.S. FTC, Children's Privacy | https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy | Intended audience and under-13 posture must be decided | No audience or COPPA applicability conclusion is made |
+| USPTO, Federal trademark searching | https://www.uspto.gov/trademarks/search/federal-trademark-searching | Federal search is one part of a broader clearance process | A search or disclaimer is not trademark clearance |
+| Apache Software Foundation, Apache License 2.0 | https://www.apache.org/licenses/LICENSE-2.0 | Authoritative project-license text and trademark limitation | Does not substitute for product, privacy, safety, or branding review |
+
+## Sourced facts versus recommendations
+
+### Sourced facts
+
+- The project labels the safety/privacy materials as drafts pending human
+  review and disclaims guarantees.
+- SS-002 risk/release language has no recorded qualified legal sign-off.
+- Local Swing Card exports exist, contradicting one current privacy-document
+  sentence.
+- The production remote-provider registry is empty.
+- Existing automated checks verify bounded strings, source structures, and
+  tested runtime paths; they do not provide human clearance.
+- Current generic MediaPipe privacy language and the pinned-version response
+  require explicit evidence-based reconciliation.
+- Release territory, intended audience/minor posture, host, distribution
+  channels, monetization/legal entity, and qualified reviewer identities are
+  not established in inspected repository evidence.
+
+### Recommendations for Lead Architect disposition
+
+1. Adopt one canonical `docs/release-review-gate.md` as the operational package
+   and keep domain docs as their own content authorities linked from it.
+2. Adopt a prominent current state such as `PUBLIC RELEASE BLOCKED — HUMAN
+   SIGN-OFF NOT RECORDED` and prohibit automation from changing it to approved.
+3. Adopt the five-part evidence taxonomy: code/test-enforced fact, documented
+   design intent, unresolved assumption, qualified-human review required, and
+   deferred/non-goal.
+4. Adopt an inventory, reviewer checklist, primary-source register, open-
+   decision log, and unfilled sign-off record in the canonical package.
+5. Adopt SS-002 assumption-of-risk and release-of-liability review as an
+   explicit qualified-legal-review blocker.
+6. Adopt scoped outcomes: pending, approved for a named scope, approved with
+   recorded conditions, changes required, rejected/hold, and not applicable
+   with rationale. Outcome definitions must not imply a current decision.
+7. Revise broad approval language so every future approval binds a reviewer,
+   qualification/role, candidate commit, release scope, date, evidence,
+   conditions, expiry, and unresolved issues.
+8. Revise local-first/privacy claims into bounded implementation facts plus
+   limitations rather than universal guarantees.
+9. Revise trademark-search language to preliminary evidence feeding a
+   qualified decision, never clearance by itself.
+10. Consider a narrow factual correction to the stale privacy/export sentence,
+    but authorize it separately from human approval and test it as factual
+    consistency only.
+11. Extend the shared declarative docs verifier and injected-reader unit tests;
+    do not add a parallel policy parser.
+12. Defer actual human decisions/signatures, jurisdiction-specific terms or
+    privacy notice, production-host review, trademark clearance, SS-021 deletion
+    UX, SS-022 accuracy validation, and runtime-copy changes not expressly
+    approved by the Lead Architect.
+13. Reject any statement that Codex, Gemini, Claude, tests, licenses,
+    non-affiliation language, or the SS-020 package itself grants public-release
+    clearance.
+
+## Weak claims and unresolved questions
+
+- Repository absence does not prove no qualified-human evidence exists
+  externally. Any external evidence must be authenticated, attached, scoped to
+  a candidate commit/release, and evaluated by the accountable release owner.
+- “Public-facing” is unresolved. It may include README-linked docs, runtime UI,
+  generated exports, package/manifest metadata, and all tracked repository
+  evidence if the repository is public.
+- Browser/network tests are environment-, browser-, build-, and fixture-bounded.
+- The current generic MediaPipe notice does not identify the exact behavior of
+  the pinned package artifact; observed-network evidence does not prove every
+  environment or future version.
+- Release territory, audience/age posture, legal entity/business model,
+  distribution channel, host, support model, and branding plan remain unknown.
+- Non-affiliation wording is not trademark clearance.
+- Non-medical disclaimers do not determine regulatory classification or remove
+  the need to review the overall product and marketing impression.
+- Local processing does not imply anonymity, guaranteed privacy, guaranteed
+  deletion, device-level erasure, or control after export.
+- A Claude PASS may establish package completeness and boundary discipline only;
+  it is not qualified-human legal/privacy/safety approval.
+
+## Research conclusion
+
+The implementation-ready baseline should create an operational, currently
+blocked human-review gate rather than rewrite drafts into apparently approved
+policy. The package must expose the complete claim surface, evidence limits,
+open decisions, qualified reviewer roles, SS-002 legal blocker, source dates,
+decision record, blocking conditions, and reopening rules. Lead Architect
+disposition is required before Builder edits begin.
+
+No legal, privacy, safety, medical, trademark, compliance, or public-release
+clearance is asserted by this research report.
diff --git a/scripts/verify-docs-claims.js b/scripts/verify-docs-claims.js
index 3a552bd..9af72be 100644
--- a/scripts/verify-docs-claims.js
+++ b/scripts/verify-docs-claims.js
@@ -25,6 +25,28 @@ const requiredStrings = {
     "This deployment guidance is product and engineering documentation, not legal,\n" +
     "security, privacy, deletion, anonymity, medical, trademark-clearance, or\n" +
     "regulatory-compliance advice or a guarantee.",
+  safetyDraft: "DRAFT - pending legal/human review; not for release.",
+  privacyDraft:
+    "DRAFT - pending human/privacy review before public release.",
+  releaseGateDraft: "DRAFT — HUMAN REVIEW PACKAGE",
+  releaseGateOutcome: "Current outcome: PENDING",
+  releaseGateBlocked:
+    "PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED",
+  releaseGateNoClearance:
+    "This package records no legal, privacy, safety, medical, trademark, compliance,\n" +
+    "or public-release clearance.",
+  releaseGateHumanBoundary:
+    "Claude and automated checks cannot substitute for\n" +
+    "qualified human reviewers.",
+  releaseGateSs002Blocker:
+    "SS-002 qualified legal review of the assumption-of-risk and\n" +
+    "release-of-liability language is not completed and blocks public release.",
+  releaseGateSourceDate: "Accessed: 2026-08-08",
+  releaseGateCodeFact: "Code/test-enforced fact",
+  releaseGateDesignIntent: "Documented design intent",
+  releaseGateUnresolved: "Unresolved assumption",
+  releaseGateHumanReview: "Qualified-human review required",
+  releaseGateDeferred: "Deferred / non-goal",
 };

 const files = {
@@ -49,6 +71,7 @@ const files = {
       "./docs/safety-terms.md",
       "./docs/privacy-architecture.md",
       "./docs/deployment.md",
+      "./docs/release-review-gate.md",
     ],
     placement: [
       {
@@ -69,7 +92,11 @@ const files = {
       "## Draft Review Status",
     ],
     requiredStrings: ["localFirst", "nonMedical", "draftReview"],
-    links: ["./safety-terms.md", "./privacy-architecture.md"],
+    links: [
+      "./safety-terms.md",
+      "./privacy-architecture.md",
+      "./release-review-gate.md",
+    ],
   },
   "CONTRIBUTING.md": {
     headings: [
@@ -82,7 +109,11 @@ const files = {
       "## Pull Requests",
     ],
     requiredStrings: ["localFirst", "nonMedical"],
-    links: ["docs/safety-terms.md", "docs/privacy-architecture.md"],
+    links: [
+      "docs/safety-terms.md",
+      "docs/privacy-architecture.md",
+      "docs/release-review-gate.md",
+    ],
   },
   "docs/deployment.md": {
     headings: [
@@ -131,6 +162,76 @@ const files = {
       },
     ],
   },
+  "docs/safety-terms.md": {
+    headings: [
+      "# Safety Terms and Educational Use Draft",
+      "## Intended Use",
+      "## Assumption of Risk Draft",
+      "## Release of Liability Draft",
+      "## Educational Feedback Boundary",
+      "## Consent Gate Requirement",
+      "## AI Coach Prompt Constraints",
+      "## Review Checklist",
+    ],
+    requiredStrings: ["safetyDraft"],
+    links: ["./release-review-gate.md"],
+    scanBannedClaims: false,
+  },
+  "docs/privacy-architecture.md": {
+    headings: [
+      "# Privacy Architecture and Video Data Lifecycle",
+      "## Default Privacy Posture",
+      "## Data Classes",
+      "## Local-First Processing Flow",
+      "## Video Lifecycle",
+      "## Export Policy",
+      "## Optional Remote Model or Coach Sharing",
+      "## User-Facing Copy Drafts",
+      "## Future Implementation Gates",
+      "## SS-005 MediaPipe Provider-Metrics Gate",
+    ],
+    requiredStrings: ["privacyDraft"],
+    links: ["./release-review-gate.md"],
+    scanBannedClaims: false,
+  },
+  "docs/release-review-gate.md": {
+    headings: [
+      "# Release Review Gate",
+      "## Current Status",
+      "## Evidence Taxonomy",
+      "## Public-Language Inventory",
+      "## Publication-Review Matrix",
+      "## Qualified-Human Checklist And Open Decisions",
+      "## Operational Gate Contract",
+      "### Entry Criteria",
+      "### Required Artifacts",
+      "### Permitted Future Outcomes",
+      "### Sign-Off Record",
+      "#### Durable Authenticated Record Location",
+      "#### Required Reviewer Domain Status",
+      "#### Aggregation Authority And Rule",
+      "### Blocking Conditions",
+      "### Reopening Rules",
+      "## Primary-Source Register",
+      "## Non-Goals And Deferred Work",
+    ],
+    requiredStrings: [
+      "releaseGateDraft",
+      "releaseGateOutcome",
+      "releaseGateBlocked",
+      "releaseGateNoClearance",
+      "releaseGateHumanBoundary",
+      "releaseGateSs002Blocker",
+      "releaseGateSourceDate",
+      "releaseGateCodeFact",
+      "releaseGateDesignIntent",
+      "releaseGateUnresolved",
+      "releaseGateHumanReview",
+      "releaseGateDeferred",
+    ],
+    links: [],
+    scanBannedClaims: false,
+  },
 };

 const bannedPatterns = {
@@ -250,13 +351,65 @@ const negativeFixtures = {
     "Swing Sync ships with CSP enforced in production and production headers are already configured.",
 };

+const releaseReviewPublicPaths = [
+  "docs/release-review-gate.md",
+  "README.md",
+  "CONTRIBUTING.md",
+  "docs/limitations.md",
+  "docs/safety-terms.md",
+  "docs/privacy-architecture.md",
+  "docs/deployment.md",
+];
+
 const crossFileChecks = [
   {
+    kind: "nonDuplication",
     sourcePath: "index.html",
     targetPath: "docs/deployment.md",
     extract: extractCspMetaContent,
     description: "CSP meta directive string",
   },
+  {
+    kind: "prematureCurrentApproval",
+    targetPaths: releaseReviewPublicPaths,
+    description: "premature current human-review approval",
+    patterns: [
+      /\b(?:legal|privacy|safety|trademark|public-release) review is complete\b/i,
+      /\b(?:legal|privacy|safety|trademark|public-release) review has passed\b/i,
+      /\b(?:legal|privacy|safety|trademark|public-release) review is cleared\b/i,
+      /\bpublic release (?:is cleared|has passed|is approved)\b/i,
+      /(?<!\bno )\bhuman sign-off is recorded\b/i,
+      /(?<!\bno )\b(?:legal|privacy|safety|trademark|public(?:-| )release) review completed\b/i,
+      /(?<!\bno )\b(?:legal|privacy|safety|trademark|licensing|accessibility|product(?:\/| and )evidence|security(?:\/| and )deployment|public(?:-| )release) review is approved\b/i,
+      /(?<!\bno )\b(?:legal|privacy|safety|trademark|licensing|accessibility|product(?:\/| and )evidence|security(?:\/| and )deployment|public(?:-| )release) review approved\b/i,
+      /\bpublic release approved\b/i,
+      /(?<!\bnot )\bcleared for public release\b/i,
+      /(?<!\bnot )\ball required reviews are complete\b/i,
+    ],
+  },
+  {
+    kind: "currentOutcome",
+    ownerPath: "docs/release-review-gate.md",
+    paths: releaseReviewPublicPaths,
+    expectedOutcome: "PENDING",
+    extractPattern:
+      /^\s*(?:\*\*)?current outcome\s*:\s*([^*\r\n]+?)(?:\*\*)?\s*$/gim,
+    description: "current outcome",
+  },
+  {
+    kind: "uniqueNormalizedOwner",
+    ownerPath: "docs/release-review-gate.md",
+    paths: [
+      "docs/release-review-gate.md",
+      "README.md",
+      "CONTRIBUTING.md",
+      "docs/limitations.md",
+      "docs/safety-terms.md",
+      "docs/privacy-architecture.md",
+    ],
+    text: requiredStrings.releaseGateBlocked,
+    description: "canonical blocked-status anchor",
+  },
 ];

 export function verifyDocsClaims(fileReader = readFileFromDisk) {
@@ -285,7 +438,11 @@ export function verifyDocsClaims(fileReader = readFileFromDisk) {
         stringKey === "readmeNonMedical"
           ? "Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance,\nphysical therapy, or a substitute for qualified medical care or professional\ngolf coaching."
           : requiredStrings[stringKey];
-      if (!content.includes(expected)) {
+      const hasExpected =
+        stringKey === "releaseGateBlocked"
+          ? normalizeText(content).includes(normalizeText(expected))
+          : content.includes(expected);
+      if (!hasExpected) {
         errors.push(`${filePath}: missing canonical ${stringKey} string`);
       }
     }
@@ -306,13 +463,15 @@ export function verifyDocsClaims(fileReader = readFileFromDisk) {
       assertPlacement(filePath, content, placement, errors);
     }

-    for (const unit of scanUnits(content)) {
-      for (const [category, patterns] of Object.entries(bannedPatterns)) {
-        for (const pattern of patterns) {
-          if (unit.includes(pattern) && !allowedMatchUnits.has(unit)) {
-            errors.push(
-              `${filePath}: prohibited ${category} phrase "${pattern}" in "${unit}"`,
-            );
+    if (config.scanBannedClaims !== false) {
+      for (const unit of scanUnits(content)) {
+        for (const [category, patterns] of Object.entries(bannedPatterns)) {
+          for (const pattern of patterns) {
+            if (unit.includes(pattern) && !allowedMatchUnits.has(unit)) {
+              errors.push(
+                `${filePath}: prohibited ${category} phrase "${pattern}" in "${unit}"`,
+              );
+            }
           }
         }
       }
@@ -347,6 +506,19 @@ export function verifyDocsClaims(fileReader = readFileFromDisk) {
   }

   for (const check of crossFileChecks) {
+    if (check.kind === "prematureCurrentApproval") {
+      assertNoPrematureCurrentApproval(check, fileReader, errors);
+      continue;
+    }
+    if (check.kind === "currentOutcome") {
+      assertCurrentOutcome(check, fileReader, errors);
+      continue;
+    }
+    if (check.kind === "uniqueNormalizedOwner") {
+      assertUniqueNormalizedOwner(check, fileReader, errors);
+      continue;
+    }
+
     const source = fileReader(check.sourcePath);
     const target = fileReader(check.targetPath);
     if (source === null) {
@@ -434,6 +606,96 @@ function assertPlacement(filePath, content, placement, errors) {
   }
 }

+function assertNoPrematureCurrentApproval(check, fileReader, errors) {
+  for (const targetPath of check.targetPaths) {
+    const content = fileReader(targetPath);
+    if (content === null) {
+      continue;
+    }
+
+    const normalized = normalizeText(content);
+    for (const pattern of check.patterns) {
+      const match = normalized.match(pattern);
+      if (match) {
+        errors.push(
+          `${targetPath}: ${check.description} assertion "${match[0]}"`,
+        );
+      }
+    }
+  }
+}
+
+function assertCurrentOutcome(check, fileReader, errors) {
+  for (const filePath of check.paths) {
+    const content = fileReader(filePath);
+    if (content === null) {
+      continue;
+    }
+
+    const extractPattern = new RegExp(
+      check.extractPattern.source,
+      check.extractPattern.flags,
+    );
+    const outcomes = [...content.matchAll(extractPattern)].map((match) =>
+      normalizeText(match[1]).toUpperCase(),
+    );
+    const found = outcomes.length
+      ? outcomes.map((outcome) => `"${outcome}"`).join(", ")
+      : "none";
+
+    if (filePath === check.ownerPath) {
+      if (outcomes.length !== 1 || outcomes[0] !== check.expectedOutcome) {
+        errors.push(
+          `${filePath}: ${check.description} must be declared exactly once as ${check.expectedOutcome} (found ${found})`,
+        );
+      }
+    } else if (outcomes.length > 0) {
+      errors.push(
+        `${filePath}: ${check.description} declaration is reserved for ${check.ownerPath} (found ${found})`,
+      );
+    }
+  }
+}
+
+function assertUniqueNormalizedOwner(check, fileReader, errors) {
+  const normalizedText = normalizeText(check.text);
+  let totalOccurrences = 0;
+  let ownerOccurrences = 0;
+
+  for (const filePath of check.paths) {
+    const content = fileReader(filePath);
+    if (content === null) {
+      continue;
+    }
+
+    const occurrences = countOccurrences(normalizeText(content), normalizedText);
+    totalOccurrences += occurrences;
+    if (filePath === check.ownerPath) {
+      ownerOccurrences = occurrences;
+    } else if (occurrences > 0) {
+      errors.push(
+        `${filePath}: duplicates ${check.description} owned by ${check.ownerPath}`,
+      );
+    }
+  }
+
+  if (ownerOccurrences !== 1) {
+    errors.push(
+      `${check.ownerPath}: ${check.description} must occur exactly once in its owner (found ${ownerOccurrences})`,
+    );
+  }
+  if (totalOccurrences !== 1) {
+    errors.push(
+      `${check.ownerPath}: ${check.description} must be uniquely owned across configured public docs (found ${totalOccurrences})`,
+    );
+  }
+}
+
+function countOccurrences(value, search) {
+  if (!search) return 0;
+  return value.split(search).length - 1;
+}
+
 function extractCspMetaContent(html) {
   const metaTags = html.match(/<meta\b[^>]*>/gis) ?? [];
   for (const tag of metaTags) {
diff --git a/test/unit/docs-claims.test.ts b/test/unit/docs-claims.test.ts
index 9c6cdc1..fceed61 100644
--- a/test/unit/docs-claims.test.ts
+++ b/test/unit/docs-claims.test.ts
@@ -10,6 +10,7 @@ const currentDocs = {
   "docs/deployment.md": readFileSync("docs/deployment.md", "utf8"),
   "docs/safety-terms.md": readFileSync("docs/safety-terms.md", "utf8"),
   "docs/privacy-architecture.md": readFileSync("docs/privacy-architecture.md", "utf8"),
+  "docs/release-review-gate.md": readFileSync("docs/release-review-gate.md", "utf8"),
   "index.html": readFileSync("index.html", "utf8")
 };

@@ -30,10 +31,286 @@ function without(value: string, requiredText: string) {
 }

 describe("docs claim verification", () => {
-  it("accepts the current approved public docs", () => {
+  it("accepts the current configured public docs and pending release gate", () => {
     expect(errorsFor()).toEqual([]);
   });

+  it("fails when the canonical release-gate file is missing", () => {
+    expect(errorsFor({ "docs/release-review-gate.md": null })).toContain(
+      "docs/release-review-gate.md: required file is missing"
+    );
+  });
+
+  it("fails when the canonical release-gate file is empty", () => {
+    expect(errorsFor({ "docs/release-review-gate.md": "   \n" })).toContain(
+      "docs/release-review-gate.md: required file is empty"
+    );
+  });
+
+  it("fails when the release-gate draft, pending, blocked, or outcome status is missing", () => {
+    const gate = currentDocs["docs/release-review-gate.md"];
+    const cases = [
+      ["DRAFT — HUMAN REVIEW PACKAGE", "releaseGateDraft"],
+      ["Current outcome: PENDING", "releaseGateOutcome"],
+      [
+        "PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED",
+        "releaseGateBlocked"
+      ]
+    ] as const;
+
+    for (const [requiredText, stringKey] of cases) {
+      expect(
+        errorsFor({
+          "docs/release-review-gate.md": without(gate, requiredText)
+        })
+      ).toContain(
+        `docs/release-review-gate.md: missing canonical ${stringKey} string`
+      );
+    }
+  });
+
+  it("fails when the SS-002 legal-review blocker is removed", () => {
+    const blocker =
+      "SS-002 qualified legal review of the assumption-of-risk and\n" +
+      "release-of-liability language is not completed and blocks public release.";
+
+    expect(
+      errorsFor({
+        "docs/release-review-gate.md": without(
+          currentDocs["docs/release-review-gate.md"],
+          blocker
+        )
+      })
+    ).toContain(
+      "docs/release-review-gate.md: missing canonical releaseGateSs002Blocker string"
+    );
+  });
+
+  it("fails when a release-gate operational heading or supporting link is removed", () => {
+    expect(
+      errorsFor({
+        "docs/release-review-gate.md": without(
+          currentDocs["docs/release-review-gate.md"],
+          "### Reopening Rules"
+        )
+      })
+    ).toContain(
+      'docs/release-review-gate.md: missing required heading "### Reopening Rules"'
+    );
+
+    expect(
+      errorsFor({
+        "docs/safety-terms.md": without(
+          currentDocs["docs/safety-terms.md"],
+          "./release-review-gate.md"
+        )
+      })
+    ).toContain(
+      "docs/safety-terms.md: missing required link ./release-review-gate.md"
+    );
+  });
+
+  it("fails when canonical blocked-status control text is duplicated in a supporting document", () => {
+    const duplicate =
+      `${currentDocs["README.md"]}\n\n` +
+      "PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED";
+
+    expect(errorsFor({ "README.md": duplicate })).toEqual(
+      expect.arrayContaining([
+        "README.md: duplicates canonical blocked-status anchor owned by docs/release-review-gate.md",
+        "docs/release-review-gate.md: canonical blocked-status anchor must be uniquely owned across configured public docs (found 2)"
+      ])
+    );
+  });
+
+  it("fails on premature completed-review or public-release-clearance assertions", () => {
+    const gate = currentDocs["docs/release-review-gate.md"];
+    const assertions = [
+      "Legal review is complete.",
+      "Privacy review has passed.",
+      "Safety review is cleared.",
+      "Public release is cleared."
+    ];
+
+    for (const assertion of assertions) {
+      expect(
+        errorsFor({
+          "docs/release-review-gate.md": `${gate}\n\n${assertion}`
+        })
+      ).toEqual(
+        expect.arrayContaining([
+          expect.stringContaining("premature current human-review approval")
+        ])
+      );
+    }
+  });
+
+  it("fails on recorded sign-off, completed review, and public-release approval assertions", () => {
+    const gate = currentDocs["docs/release-review-gate.md"];
+    const assertions = [
+      "Human sign-off is recorded.",
+      "Legal review completed.",
+      "Public release approved.",
+      "Cleared for public release.",
+      "All required reviews are complete."
+    ];
+
+    for (const assertion of assertions) {
+      expect(
+        errorsFor({
+          "docs/release-review-gate.md": `${gate}\n\n${assertion}`
+        })
+      ).toEqual(
+        expect.arrayContaining([
+          expect.stringContaining("premature current human-review approval")
+        ])
+      );
+    }
+  });
+
+  it("fails on premature current approval in a supporting public document and reports its path", () => {
+    const content =
+      `${currentDocs["docs/safety-terms.md"]}\n\n` +
+      "Human sign-off is recorded.";
+
+    expect(errorsFor({ "docs/safety-terms.md": content })).toContain(
+      'docs/safety-terms.md: premature current human-review approval assertion "human sign-off is recorded"'
+    );
+  });
+
+  it("fails when a supporting document says legal review is approved and reports its injected path", () => {
+    const content =
+      `${currentDocs["CONTRIBUTING.md"]}\n\n` +
+      "Legal review is approved.";
+
+    expect(errorsFor({ "CONTRIBUTING.md": content })).toContain(
+      'CONTRIBUTING.md: premature current human-review approval assertion "legal review is approved"'
+    );
+  });
+
+  it("fails when a supporting document says legal review approved without a copula", () => {
+    const content =
+      `${currentDocs["CONTRIBUTING.md"]}\n\n` +
+      "Legal review approved.";
+
+    expect(errorsFor({ "CONTRIBUTING.md": content })).toContain(
+      'CONTRIBUTING.md: premature current human-review approval assertion "legal review approved"'
+    );
+  });
+
+  it("allows negated no-copula legal-review approval statements", () => {
+    const content =
+      `${currentDocs["CONTRIBUTING.md"]}\n\n` +
+      "No legal review approved. Legal review not approved.";
+
+    expect(errorsFor({ "CONTRIBUTING.md": content })).toEqual([]);
+  });
+
+  it("accepts exactly one canonical PENDING current outcome and no supporting declarations", () => {
+    expect(errorsFor()).toEqual([]);
+  });
+
+  it("fails when a supporting document declares an approved current outcome and reports its value", () => {
+    const content =
+      `${currentDocs["README.md"]}\n\n` +
+      "**Current outcome: APPROVED FOR NAMED SCOPE**";
+
+    expect(errorsFor({ "README.md": content })).toContain(
+      'README.md: current outcome declaration is reserved for docs/release-review-gate.md (found "APPROVED FOR NAMED SCOPE")'
+    );
+  });
+
+  it("fails when a supporting document duplicates the PENDING current outcome", () => {
+    const content =
+      `${currentDocs["docs/privacy-architecture.md"]}\n\n` +
+      "**Current outcome: PENDING**";
+
+    expect(errorsFor({ "docs/privacy-architecture.md": content })).toContain(
+      'docs/privacy-architecture.md: current outcome declaration is reserved for docs/release-review-gate.md (found "PENDING")'
+    );
+  });
+
+  it("fails when an injected canonical document declares a contradictory approved current outcome", () => {
+    const content =
+      `${currentDocs["docs/release-review-gate.md"]}\n\n` +
+      "**Current outcome: APPROVED FOR NAMED SCOPE**";
+
+    expect(errorsFor({ "docs/release-review-gate.md": content })).toContain(
+      'docs/release-review-gate.md: current outcome must be declared exactly once as PENDING (found "PENDING", "APPROVED FOR NAMED SCOPE")'
+    );
+  });
+
+  it("fails when the canonical current outcome is non-PENDING", () => {
+    const content = currentDocs["docs/release-review-gate.md"].replace(
+      "Current outcome: PENDING",
+      "Current outcome: APPROVED FOR NAMED SCOPE"
+    );
+
+    expect(errorsFor({ "docs/release-review-gate.md": content })).toContain(
+      'docs/release-review-gate.md: current outcome must be declared exactly once as PENDING (found "APPROVED FOR NAMED SCOPE")'
+    );
+  });
+
+  it("allows an injected supporting document to say no legal review completed", () => {
+    const content =
+      `${currentDocs["docs/limitations.md"]}\n\n` +
+      "No legal review completed.";
+
+    expect(errorsFor({ "docs/limitations.md": content })).toEqual([]);
+  });
+
+  it("allows future outcome definitions that do not assert a current approval", () => {
+    const gate =
+      `${currentDocs["docs/release-review-gate.md"]}\n\n` +
+      "A future qualified reviewer may select APPROVED FOR NAMED SCOPE or APPROVED WITH CONDITIONS.";
+
+    expect(errorsFor({ "docs/release-review-gate.md": gate })).toEqual([]);
+  });
+
+  it("allows negated no-clearance language", () => {
+    const gate =
+      `${currentDocs["docs/release-review-gate.md"]}\n\n` +
+      "Legal review is not complete. Privacy review has not passed. " +
+      "Safety review is not cleared. No human sign-off is recorded. " +
+      "Legal review not completed. Public release not approved. " +
+      "Not cleared for public release. Not all required reviews are complete.";
+
+    expect(errorsFor({ "docs/release-review-gate.md": gate })).toEqual([]);
+  });
+
+  it("allows future outcome definitions, negations, and no-clearance language in every scanned public document", () => {
+    const safeText =
+      "A future reviewer may select APPROVED FOR NAMED SCOPE. " +
+      "Human sign-off is not recorded. Public release is not approved. " +
+      "No legal, privacy, safety, trademark, or public-release clearance is recorded.";
+    const scannedPaths = [
+      "docs/release-review-gate.md",
+      "README.md",
+      "CONTRIBUTING.md",
+      "docs/limitations.md",
+      "docs/safety-terms.md",
+      "docs/privacy-architecture.md",
+      "docs/deployment.md"
+    ] as const;
+
+    for (const filePath of scannedPaths) {
+      expect(
+        errorsFor({
+          [filePath]: `${currentDocs[filePath]}\n\n${safeText}`
+        })
+      ).toEqual([]);
+    }
+  });
+
+  it("tolerates normalized whitespace in the unique blocked-status anchor", () => {
+    const gate = currentDocs["docs/release-review-gate.md"].replace(
+      "PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED",
+      "PUBLIC   RELEASE BLOCKED —\n  HUMAN SIGN-OFF NOT RECORDED"
+    );
+
+    expect(errorsFor({ "docs/release-review-gate.md": gate })).toEqual([]);
+  });
+
   it("rejects missing required public docs", () => {
     expect(errorsFor({ "README.md": null })).toContain(
       "README.md: required file is missing"
```

## Wrapper integrity note
The prompt is supplied verbatim before this packet and its hash is recorded above. This packet is supplied verbatim as the second paste. Its own contents are the source record, so recursive inclusion or a self-hash would change the bytes being asserted. Review the entire pasted packet, including this manifest and the complete enclosed diff.
The serialized diff intentionally preserves source whitespace; do not normalize evidence inside the fenced diff.
