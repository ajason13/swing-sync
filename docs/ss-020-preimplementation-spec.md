# SS-020 Preimplementation Specification

Date: 2026-08-08
Status: candidate; independent Lead Architect confirmation required

## Problem statement

Swing Sync contains public safety, privacy, export, medical-scope,
non-affiliation, trademark, and limitation language, but it has no single
operational package for future qualified-human review. Existing safety and
privacy materials are drafts. SS-020 must make the future release gate usable
without converting draft content, automated checks, or AI audits into approval.

## Goals

- Inventory the complete public claim surface and classify evidence strength.
- Give qualified reviewers explicit questions, evidence, ownership, and
  decision fields.
- Preserve SS-002 assumption-of-risk and release-of-liability review as a
  qualified-legal blocker.
- Make release-gate entry, artifacts, outcomes, sign-off, blocking conditions,
  and reopening rules operational.
- Add bounded automated protection against missing gate warnings,
  contradictory approval claims, and duplicated operational-policy ownership.
- Preserve existing runtime, local-first, consent, data, export, provider,
  deployment, dependency, and observability behavior.

## Non-goals and protected boundaries

- No legal advice, human sign-off, public-release approval, enforceability,
  compliance, trademark-clearance, medical-approval, anonymity, deletion,
  privacy, or safety guarantee.
- No SS-002 risk/release rewrite.
- No runtime TypeScript, HTML, manifest, service-worker, generated output, or UI
  copy change.
- No dependency, lockfile, license policy, notice, SBOM, bundle, SDK, model,
  provider, API, persistence, remote-sharing, cloud-storage, deployment,
  telemetry, analytics, logging, or data-flow/export-format change.
- No change to local-first raw-media handling or explicit consent boundaries.
- No normalization or rewriting of historical audit/source packets.
- No change to the nine intentional untracked `docs/agent-guidance/` files.
- Future human review work, SS-021 deletion UX, and SS-022 accuracy validation
  remain separate.

## Delivery mode and gates

SS-020 uses Gated Delivery. Codex owns research/specification, implementation,
verification, and repository state. The Lead Architect accepts or corrects the
research baseline. Claude owns final independent adversarial audit. Qualified
humans alone own future legal/privacy/safety/trademark/release decisions.

The docs-only governance exception is used to omit separate preimplementation
Claude QA planning. Conditions are satisfied only while implementation remains
documentation and developer-verifier work with no runtime, dependency,
provider, deployment, or data-flow change; current primary sources are recorded
with access dates; and final Claude audit remains mandatory.

Builder gate: an independent Lead Architect must state `APPROVED FOR BUILDER`.
The Workflow Coordinator must synchronize Notion and `CONTEXT.md` when
implementation starts and again when the final-audit handoff is ready.

PR gate: Claude must return `PASS` and explicitly permit PR preparation. If
Claude returns `PASS WITH MINOR FIXES`, apply and verify the fixes, then obtain
any required focused re-review and explicit clearance before PR preparation.
`FAIL` blocks PR preparation. Merge and post-merge synchronization remain
separate events.

Qualified-human sign-off remains a future public-release blocker. It is not a
prerequisite to merge the SS-020 package, which exists to make that later gate
operational without claiming it has passed.

## Authoritative document ownership

Create `docs/release-review-gate.md` as the only operational release-review
gate. It owns:

- current release-review status;
- public-language inventory;
- publication-review matrix;
- qualified-human checklist and open-decision register;
- primary-source register;
- entry criteria and required artifacts;
- decision outcomes and sign-off record;
- blocking conditions and reopening rules;
- deferred work and explicit non-goals.

Existing documents retain domain ownership:

- `docs/safety-terms.md`: SS-002 draft safety, risk, liability, consent, and
  medical-scope language.
- `docs/privacy-architecture.md`: data classes, local-first design, lifecycle,
  export, remote-sharing, and provider privacy design.
- `docs/limitations.md`: public accuracy, evidence, medical, export, browser,
  and accessibility limitations.
- `docs/deployment.md`: deployment/security assumptions and host-owner duties.
- `docs/licensing.md`, `docs/models-licensing.md`, license/notice/model records:
  engineering licensing and distribution evidence, not clearance.
- `README.md` and `CONTRIBUTING.md`: summaries and navigation, not operational
  gate duplicates.
- `docs/ss-020-research-notes.md` and this disposition/spec: research and
  architecture evidence, not policy or approval.

Supporting documents may add only a concise link/status pointer to the canonical
gate; they must not copy its checklist, decision model, or sign-off template.

## Approved file scope

Builder owns and may change only:

- `docs/release-review-gate.md` — new canonical package.
- `README.md` — add a concise link to the canonical gate.
- `CONTRIBUTING.md` — link existing draft/pre-release guidance to the canonical
  gate.
- `docs/limitations.md` — add a concise release-review pointer.
- `docs/safety-terms.md` — add a pointer while preserving all SS-002 draft text
  and unchecked human-review items.
- `docs/privacy-architecture.md` — add a pointer and make the approved narrow
  factual correction described below.
- `scripts/verify-docs-claims.js` — extend existing declarative configuration
  and named cross-file checks only.
- `test/unit/docs-claims.test.ts` — add named adversarial cases and correct the
  misleading test title without changing its behavior.

Workflow Coordinator alone owns:

- `CONTEXT.md` — coordination, decisions, evidence, and gate state.
- the SS-020 Notion task — status, branch, PR, evidence, and handoffs;
- later audit artifacts: `docs/ss-020-claude-audit-prompt.md` and, when needed,
  `docs/ss-020-claude-audit-source-packet.md`.

These coordination and audit paths remain in delivery scope but are not Builder
write authority.

Any need to change another tracked file, runtime behavior, licensing policy,
notices, SBOM, dependency, bundle, or deployment surface stops implementation
and requires renewed Lead Architect scope approval.

## Authorized narrow factual correction

In `docs/privacy-architecture.md`, replace only the stale assertion that exports
are not implemented. The corrected paragraph must say, without expanding
claims, that the current app implements local file selection, local Pose
Landmarker inference, and user-initiated local Swing Card PNG, print/PDF, and
prompt-copy workflows; it does not implement camera capture, raw-video or
landmark persistence, remote sharing, or remote model APIs. Retain the local
acknowledgement limitation.

This is a current-behavior correction, not privacy review or approval. Runtime
and exported data remain unchanged.

## Canonical package requirements

`docs/release-review-gate.md` must include the following sections and content.

### 1. Prominent current status

At the top, state all of:

- `DRAFT — HUMAN REVIEW PACKAGE`
- `Current outcome: PENDING`
- `PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED`
- no legal/privacy/safety/medical/trademark/compliance/release clearance;
- Claude and automated checks cannot substitute for qualified humans.

### 2. Evidence taxonomy

Define and use exactly these classifications:

1. `Code/test-enforced fact`
2. `Documented design intent`
3. `Unresolved assumption`
4. `Qualified-human review required`
5. `Deferred / non-goal`

Do not collapse design intent into implemented fact or verifier pass into
human approval.

### 3. Traceable public-language inventory

Each row must contain:

- source path and stable section/string location;
- claim category;
- statement or faithful summary;
- audience/surface;
- evidence classification;
- supporting code/test/document evidence;
- review concern or open question;
- accountable owner/reviewer type;
- evidence or decision required;
- release-blocking status;
- current disposition.

Inventory at least:

- README purpose, non-medical, current-capability, local-first, export,
  draft-review, license, non-affiliation, and third-party-name language;
- CONTRIBUTING safety/privacy/claims and explicit SS-002 gate language;
- safety-terms draft banner, medical scope, assumption of risk, release of
  liability, consent, AI constraints, and unchecked reviewer questions;
- privacy draft banner, current implementation, data classes, lifecycle,
  deletion limits, exports, remote sharing, provider/telemetry evidence, and
  user-facing copy drafts;
- limitations accuracy, evidence, medical, safety, privacy/export, remote,
  browser, accessibility, and future validation language;
- deployment draft, no-backend/current-host assumptions, CSP/header ownership,
  logging/telemetry, service worker, and future backend gate language;
- licensing/model/fixture/model-asset/license/notice evidence, including the
  preliminary trademark-search requirement;
- `index.html`, manifest, and package description metadata;
- runtime consent/safety, workflow status, phase limits, remote-unavailable,
  and error/status copy;
- Swing Card PNG/print/copy prompt, warning, and coaching contract/output copy;
- historical `docs/ss-*` artifacts as repository-public evidence, explicitly
  non-authoritative and excluded from normalization.

For runtime/generated content, inventory exact owning files and representative
strings without editing them.

### 4. Publication-review matrix

For README, CONTRIBUTING, limitations, safety, privacy, deployment,
licensing/model/notice materials, metadata, runtime UI, exports/generated
content, and historical repository evidence, record:

- whether separate review is `Yes`, `Conditional`, or `No with rationale`;
- required reviewer role;
- evidence required;
- current status;
- release-blocking effect.

Every current sensitive surface should remain `Pending` unless authenticated,
scoped human evidence is attached. Do not infer approval from existing wording.

### 5. Qualified-human checklist and open decisions

Use unchecked checklist rows or a table with, at minimum:

- question/open decision;
- accountable reviewer role;
- evidence required;
- required sign-off;
- blocking status;
- current result.

Cover:

- SS-002 risk/release language, jurisdiction, enforceability, consent
  conspicuousness, age/capacity, and contributor/maintainer/distributor scope;
- intended use, non-medical positioning, safety instructions, consumer net
  impression, evidence/accuracy limitations, and reviewer qualifications;
- data inventory, local storage, export sensitivity, deletion limitations,
  third-party manual sharing, audience/age posture, territories, and notices;
- current generic MediaPipe notice versus exact `0.10.35` evidence;
- non-affiliation, project name/branding, preliminary search evidence, and
  trademark decision;
- licenses, notices, model/provider evidence, release entity/business model,
  distribution channels, host/security headers, support, and incident/contact
  ownership;
- publication boundary for historical repository evidence.

### 6. Operational gate contract

Entry criteria:

- immutable candidate commit/PR/release target;
- named release scope, channels, territories, audience/age posture, host, and
  legal/release owner;
- complete public-surface inventory and current focused diff;
- current verification, runtime/data/deployment posture, and source register;
- named qualified reviewer roles;
- assigned open decisions with evidence;
- no unreviewed sensitive change after candidate freeze.

Required artifacts:

- canonical package and inventory;
- candidate commit/focused diff;
- verification evidence;
- external-source register;
- open-decision and response log;
- reviewer comments or attachments;
- completed sign-off record;
- conditions, residual risks, and expiry where applicable.

Permitted future outcomes:

- `PENDING`
- `APPROVED FOR NAMED SCOPE`
- `APPROVED WITH CONDITIONS`
- `CHANGES REQUIRED`
- `REJECTED / HOLD`
- `NOT APPLICABLE WITH RATIONALE`

The package must define these labels but leave the current outcome `PENDING`.

Sign-off record fields:

- candidate commit and release version/scope;
- territories, audience, channels, and host;
- reviewer identity, accountable role, and qualification basis;
- artifact/evidence versions;
- decision and date;
- conditions, expiry, residual risks, and unresolved issues;
- required follow-up owner/date;
- confirmation that post-review changes were checked.

Blocking conditions:

- missing/ambiguous release scope, candidate, reviewer, qualification, evidence,
  or sign-off field;
- SS-002 legal review not completed;
- unresolved absolute, medical, privacy, deletion, anonymity, compliance,
  trademark, or contradictory public wording;
- unresolved MediaPipe/provider evidence;
- missing trademark/publication decision;
- failed required verifier/build/audit;
- changed candidate or unreviewed sensitive diff;
- stale/expired source or conditional approval.

Reopening rules:

- public safety/privacy/medical/legal/trademark/accuracy copy changes;
- project name, logo, entity, business model, audience, minor posture,
  territory, channel, host, or support model changes;
- runtime, data class, storage, deletion, export, remote sharing, provider,
  model, dependency, license, service-worker, logging, telemetry, or deployment
  changes;
- material provider terms, source, standard, law, or guidance change;
- incident, complaint, audit finding, expired condition, or post-review diff.

### 7. Primary-source register

Carry forward the direct URLs and `2026-08-08` access date from
`docs/ss-020-research-notes.md`. For each source, record its process question
and limit on inference. Do not claim applicability or compliance.

### 8. Non-goals and deferred work

List actual human review, jurisdiction-specific drafting, production-host
approval, trademark clearance, SS-021 deletion UX, SS-022 validation, provider
changes, runtime-copy changes, and all protected implementation boundaries.

## Verifier design

Extend the existing declarative `files`, `requiredStrings`, and
`crossFileChecks` registries and injected `fileReader` mechanism in
`scripts/verify-docs-claims.js`. Do not rename or broadly refactor those
registries.

Required declarative registrations:

- add `docs/release-review-gate.md` to `files` as a required configured
  document;
- add its top status strings, evidence-taxonomy labels, SS-002 blocker,
  operational headings, source date, and no-clearance boundary;
- require README, CONTRIBUTING, limitations, safety, and privacy documents to
  link to `./docs/release-review-gate.md` or the correct relative equivalent;
- keep the existing standard prohibited-claim scan on its current configured
  public summaries; do not add safety, privacy, or the canonical gate to that
  standard scan because their draft/inventory text legitimately names
  prohibited claim categories;
- register safety, privacy, and the canonical gate through structural,
  required-string, and link checks instead;
- add a dedicated declarative premature-current-approval check for the
  canonical gate. It must reject assertions that legal, privacy, safety,
  trademark, or public-release review “is complete,” “has passed,” or “is
  cleared,” while allowing future outcome definitions and negated/no-clearance
  statements;
- add a normalized unique-owner cross-file check for the exact
  `PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED` anchor across the
  canonical gate and the named supporting documents. The anchor must occur
  exactly once, in the canonical gate; supporting docs link to it without
  copying it;
- make every new structural, link, premature-approval, and unique-owner read use
  the injected `fileReader`;
- keep historical audit artifacts outside normalization and uniqueness scans.

Do not introduce a general Markdown parser. If implementation determines that
new extraction/parsing is unavoidable, stop for renewed architecture approval
and add the full missing/empty/formatting/embedded-delimiter/fail-closed test
matrix before proceeding.

## Required named unit coverage

In `test/unit/docs-claims.test.ts`, add or rename tests with clear names proving:

- accepts the current configured public docs and pending release gate;
- fails when the canonical release-gate file is missing;
- fails when the canonical release-gate file is empty;
- fails when the draft/pending/blocked banner or current outcome is missing;
- fails when the SS-002 legal-review blocker is removed;
- fails when an operational heading or required supporting link is removed;
- fails when canonical status/sign-off control text is duplicated in a
  supporting document;
- fails on a premature completed-review or public-release-clearance assertion;
- allows future outcome definitions that do not assert a current approval;
- allows negated no-clearance language;
- tolerates harmless heading/whitespace formatting already supported by the
  declarative mechanism;
- preserves existing missing/empty/cross-file/embedded-delimiter/fail-closed
  coverage.

Rename the existing “approved public docs” test to “configured public docs” or
equivalent. This is test-only terminology correction; behavior remains the
same.

## Acceptance-criteria mapping

1. Inventory: canonical traceable inventory plus publication-surface manifest.
2. Human checklist: question/evidence/role/sign-off/blocking table and open-
   decision register.
3. SS-002: explicit qualified-legal-review blocker in status, inventory,
   checklist, and verifier.
4. Absolute claims: repository-wide research inventory, current public-doc
   verifier, premature-approval checks, and human-review limits.
5. Separate public wording review: publication-review matrix covering README,
   limitations, contributor, deployment, metadata, UI/export, licensing, and
   repository evidence.
6. Operational gate: entry criteria, artifacts, outcomes, sign-off record,
   blockers, and reopening rules with current `PENDING/BLOCKED` state.

## Verification plan

Use Node 22 from `.nvmrc`. Run, in order:

1. `npm run test:unit -- docs-claims --reporter=verbose`
2. `npm run docs:verify`
3. `npm run safety:verify`
4. `npm run privacy:verify`
5. `npm run compliance:verify`
6. `npm run build`
7. `git diff --check`

Record exact outcomes. No dependency/licensing/bundle/notice/SBOM change is
expected. If any occurs, stop and obtain renewed scope approval before running
the additional licensing suite required by `AGENTS.md`.

## Observability decision

Runtime observability is unchanged because SS-020 is documentation/release
governance only. Do not add logs, telemetry, analytics, remote logging, cloud
diagnostics, hidden identifiers, persistent debug artifacts, or runtime
operator instrumentation.

## Audit handoff requirements

After implementation and verification, create a self-contained Claude final-
audit prompt with Role, Stage, Scope, Context, Acceptance criteria, Protected
boundaries, exact changed-file contents or complete focused diffs, Verification,
Known non-goals, and Output required. Enumerate every changed tracked file,
including `CONTEXT.md`; provide a mechanically checkable source packet if the
prompt cannot inline all evidence.

Require one verdict: `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`; separate
blockers from non-blockers; and explicitly state whether PR preparation is
allowed. Claude audits package completeness and boundary discipline only.

## Approval

Independent Lead Architect confirmation is pending. Builder must not begin
until the Lead Architect returns `APPROVED FOR BUILDER` against this exact spec.
