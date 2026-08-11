# SS-020 Claude Audit 01 — Governance

## Role

Independent audit.

## Stage

01/05. Candidate `4e5dd4029da053ebb145b0a15416cbd5450b8fb1`; branch `ss-020-release-review-gate`; no PR/sign-off; runtime/observability unchanged.

## Scope

AC2/AC3/AC6.

Candidate `4e5dd4029da053ebb145b0a15416cbd5450b8fb1`: 20 baseline-relative paths (15 tracked + 5 staged). path|owner|mode|reason; E exact, E+S exact+index, F diff, S summary, W stage; B bounded, H history, N none.
```text
CONTEXT.md|01|E|B
CONTRIBUTING.md|01/03|E|B
README.md|03|E|B
docs/handoffs/ss-020-claude-final-audit-prompt.md|01|E|N
docs/handoffs/ss-020-claude-final-audit-source-packet.md|01|E|N
docs/limitations.md|03|E|B
docs/privacy-architecture.md|03|F|N
docs/release-review-gate.md|01/02/03|E+S|B
docs/safety-terms.md|01/03|E|B
docs/ss-020-gemini-research-prompt.md|01|S|H
docs/ss-020-preimplementation-spec.md|01|S|H
docs/ss-020-research-disposition.md|01|S|H
docs/ss-020-research-notes.md|01|S|H
scripts/verify-docs-claims.js|04|E|B
test/unit/docs-claims.test.ts|04|E|B
docs/handoffs/ss-020-claude-audit-01-governance.md|01|W|N
docs/handoffs/ss-020-claude-audit-02-inventory-coverage.md|02|W|N
docs/handoffs/ss-020-claude-audit-03-public-claims-sources.md|03|W|N
docs/handoffs/ss-020-claude-audit-04-verifier-tests.md|04|W|N
docs/handoffs/ss-020-claude-audit-05-final-synthesis.md|05|W|N
```

## Context

No clearance.

## Acceptance criteria

Checklist; SS-002; gate.

## Protected boundaries

Raw video local; remote opt-in; no runtime/data/provider change.

## Relevant source contents or complete focused diffs

Gate L1-37 VERBATIM
```markdown
# Release Review Gate

## Current Status

**DRAFT — HUMAN REVIEW PACKAGE**

**Current outcome: PENDING**

**PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED**

This package records no legal, privacy, safety, medical, trademark, compliance,
or public-release clearance. Claude and automated checks cannot substitute for
qualified human reviewers. A verifier pass establishes only the bounded
document structure and repository facts that the verifier checks.

SS-002 qualified legal review of the assumption-of-risk and
release-of-liability language is not completed and blocks public release.

## Evidence Taxonomy

Every inventory, checklist, and decision entry uses one of these exact
classifications:

1. `Code/test-enforced fact` — behavior or content supported by named current
   source and bounded automated evidence.
2. `Documented design intent` — an intended boundary or future requirement;
   not proof that every path implements it.
3. `Unresolved assumption` — a release fact or applicability question that the
   repository does not establish.
4. `Qualified-human review required` — a decision reserved for an accountable
   reviewer with relevant qualifications and a named release scope.
5. `Deferred / non-goal` — work explicitly outside this package and not
   completed by merging it.

Design intent must not be reported as an implemented fact. Automated
verification and AI audit must not be reported as human approval.

```

Gate VERBATIM L136-304 + L323-345; one packet blank line
```markdown
## Qualified-Human Checklist And Open Decisions

Every row is deliberately unresolved. Attach evidence; do not change a result
without the accountable reviewer and release owner recording a scoped decision.

| Question / open decision | Accountable reviewer role | Evidence required | Required sign-off | Blocking status | Current result |
| --- | --- | --- | --- | --- | --- |
| Are the SS-002 assumption-of-risk and release-of-liability drafts appropriate for the named jurisdictions, entities, maintainers, contributors, and distributors? | Qualified legal reviewer | Exact candidate text, parties, territories, release model | Legal reviewer and release owner | Blocking | Pending |
| What governing-law, dispute, waiver, enforceability, and non-waivable-rights treatment is required? | Qualified legal reviewer | Entity, territory, channel, and business facts | Legal reviewer | Blocking | Pending |
| Is consent conspicuous and meaningful, and what age/capacity or guardian posture is required? | Qualified legal and privacy reviewers | UX flow, storage behavior, audience/minor decision | Legal/privacy reviewers and release owner | Blocking | Pending |
| Are intended use, educational/non-medical positioning, safety instructions, and consumer net impression appropriate? | Qualified safety/medical-scope and legal reviewers | Full public copy, runtime/export samples, audience/channels | Safety/medical-scope and legal reviewers | Blocking | Pending |
| Are evidence, accuracy, and limitation statements supported and prominent, and are reviewer qualifications adequate? | Evidence/domain reviewer and release owner | Named tests, fixture limits, SS-022 status, reviewer credentials | Evidence reviewer and release owner | Blocking | Pending |
| Is the current data inventory complete across local memory, browser storage, exports, logs, network, and service-worker paths? | Qualified privacy reviewer and engineering owner | Data-flow map, source trace, browser/network evidence | Privacy reviewer | Blocking | Pending |
| Are local-storage and deletion limitations accurate, including the absence of SS-021 clear-local-data behavior and device-level erasure guarantees? | Qualified privacy reviewer | Storage APIs, browser behavior, SS-021 status, copy | Privacy reviewer | Blocking | Pending |
| Are export sensitivity and third-party manual-sharing warnings adequate for PNG, print/PDF, copied prompt, and generated coaching content? | Privacy/legal/safety reviewers | Actual candidate artifacts and third-party-sharing flow | Privacy reviewer and release owner | Blocking | Pending |
| What are the intended audience/age posture, release territories, and required privacy or consumer notices? | Legal/privacy/product reviewers | Product plan, territories, audience research, data practices | Legal/privacy reviewers and release owner | Blocking | Pending |
| How should the current generic MediaPipe notice be reconciled with exact `@mediapipe/tasks-vision@0.10.35` evidence and observed network behavior? | Qualified privacy reviewer and engineering owner | Generic notice, issue response, lockfile/artifact, network tests | Privacy reviewer | Blocking | Pending |
| Do non-affiliation language, the Swing Sync name, logo/branding, and preliminary search evidence support the named use? | Qualified trademark/legal reviewer | Name/logo inventory, channel/territory plan, preliminary and broader search evidence | Trademark/legal reviewer and release owner | Blocking | Pending |
| Are licenses, notices, fixtures, model assets, SDK/provider evidence, and exact distribution artifacts complete? | Licensing reviewer | SBOM, lockfile, notice/model/fixture records, built artifact | Licensing reviewer and release owner | Blocking | Pending |
| What legal entity/business model, monetization, distribution channels, host, security headers, support policy, and incident/contact ownership apply? | Release owner with legal/security/privacy reviewers | Business/release plan, host evidence, support/incident plan | Release owner and affected reviewers | Blocking | Pending |
| Are historical `docs/ss-*` and `docs/handoffs/*` evidence files included in the public publication boundary, and what context is required? | Release owner with legal/privacy/safety/trademark reviewers | Complete tracked manifests for both namespaces and repository/distribution plan | Release owner | Blocking if public | Pending |

## Operational Gate Contract

### Entry Criteria

Do not begin qualified-human release review until all entry criteria are met:

- an immutable candidate commit, pull request, or release target is named;
- the release scope, channels, territories, audience/age posture, production
  host, legal owner, and release owner are named;
- the complete public-surface inventory and current focused diff are attached;
- current verification, runtime/data/deployment posture, and source register
  are attached;
- qualified reviewer roles and intended reviewers are named;
- every open decision has an owner and required evidence; and
- the candidate is frozen so no sensitive change can bypass review.

### Required Artifacts

- this canonical package and its current inventory;
- immutable candidate commit and complete focused diff;
- named verification evidence and environments;
- current external primary-source register;
- open-decision and reviewer-response log;
- authenticated reviewer comments or attachments;
- completed sign-off record; and
- conditions, residual risks, expiry, and follow-up evidence where applicable.

### Permitted Future Outcomes

These labels define the only outcomes a qualified reviewer may record for a
named scope. They do not select or imply a current approval:

- `PENDING` — required evidence or decisions remain open.
- `APPROVED FOR NAMED SCOPE` — the identified reviewer accepts only the
  recorded candidate, audience, territories, channels, host, and conditions.
- `APPROVED WITH CONDITIONS` — the identified reviewer accepts the named scope
  only while recorded conditions and expiry remain satisfied.
- `CHANGES REQUIRED` — specified blockers must be resolved and reviewed.
- `REJECTED / HOLD` — the named candidate or scope must not proceed.
- `NOT APPLICABLE WITH RATIONALE` — the reviewer records why a question does
  not apply to the named scope and who accepts that rationale.

The current outcome remains `PENDING`.

### Sign-Off Record

No sign-off is recorded. Each future record must include every field below;
blank, ambiguous, or unauthenticated fields block release.

#### Durable Authenticated Record Location

The canonical durable record for a candidate must be
`docs/release-review-signoffs/<candidate-commit>/index.md`. That manifest must
reference the exact candidate and release scope and must identify every
reviewer artifact. Signed attachments may be stored beside the manifest or in
a durable external review system only when the manifest records an immutable
artifact identifier, access-controlled location, checksum where available, and
authentication method. An unchecked Markdown box, unauthenticated chat text,
or unscoped approval statement is not an authenticated sign-off.

| Field | Current value |
| --- | --- |
| Candidate commit and release version/scope | Not recorded |
| Territories, audience, channels, and host | Not recorded |
| Reviewer identity | Not recorded |
| Accountable role and qualification basis | Not recorded |
| Artifact and evidence versions | Not recorded |
| Decision and date | `PENDING`; date not recorded |
| Conditions and expiry | Not recorded |
| Residual risks and unresolved issues | Not recorded |
| Required follow-up owner and date | Not recorded |
| Confirmation that post-review changes were checked | Not recorded |

#### Required Reviewer Domain Status

Each required domain has its own current row. Evidence, identity and
qualification, decision date, and candidate/release scope must be recorded in
the durable authenticated record before its status can change.

| Required reviewer domain | Current status | Evidence | Reviewer identity / qualification | Decision date | Candidate / release scope |
| --- | --- | --- | --- | --- | --- |
| Legal | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
| Privacy | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
| Safety / medical-scope | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
| Trademark | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
| Licensing | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
| Product / evidence | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
| Security / deployment | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
| Accessibility | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |
| Release owner | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |

#### Aggregation Authority And Rule

The named release owner is the aggregation authority. The release owner must
derive the aggregate outcome from the authenticated domain records and cannot
waive, reinterpret, or replace a required qualified-reviewer decision.

If any required record or field is missing; any required domain is `PENDING`,
`CHANGES REQUIRED`, or `REJECTED / HOLD`; any condition is expired or unmet; or
the candidate/scope differs between records, the aggregate outcome must remain
`PENDING` and public release must remain `BLOCKED`.

Public release can be allowed only when every required domain has a current,
authenticated, candidate- and scope-matched sign-off (`APPROVED FOR NAMED
SCOPE`, `APPROVED WITH CONDITIONS` with every condition current, or `NOT
APPLICABLE WITH RATIONALE` where the accountable reviewer accepts that
rationale) and the release owner records a final decision for that same
candidate and scope. No domain sign-off or release-owner decision is recorded
for the current package.

### Blocking Conditions

Public release remains blocked when any of these conditions is true:

- the release scope, candidate, reviewer identity, qualification, evidence, or
  sign-off field is missing or ambiguous;
- SS-002 legal review of assumption-of-risk and release-of-liability language
  is not completed for the named scope;
- absolute, medical, privacy, deletion, anonymity, compliance, trademark, or
  contradictory public wording remains unresolved;
- exact-version MediaPipe/provider evidence remains unresolved;
- trademark/branding or repository-publication decisions are missing;
- a required verifier, build, or independent audit fails;
- the candidate changes or contains an unreviewed sensitive diff; or
- a source or conditional decision is stale or expired.

### Reopening Rules

Reopen the affected qualified-human review after any of these events:

- public safety, privacy, medical, legal, trademark, or accuracy copy changes;
- project name, logo, entity, business model, audience/minor posture,
  territory, channel, host, support model, or incident ownership changes;
- runtime, data class, storage, deletion, export, remote sharing, provider,
  model, dependency, license, service-worker, logging, telemetry, or deployment
  changes;
- a material provider term, source, standard, law, or guidance change; or
- an incident, complaint, audit finding, expired condition, or post-review
  candidate diff.

A reopening trigger invalidates every affected prior sign-off. The affected
domain outcome and the aggregate outcome must reset to `PENDING`, public release
must reset to `BLOCKED`, and a fresh authenticated review must cover the new
candidate and scope before aggregation can be reconsidered. Unaffected records
may remain as historical evidence but cannot allow release while any affected
review is pending.


## Non-Goals And Deferred Work

This package does not perform or record qualified-human legal, privacy,
safety/medical-scope, trademark, compliance, or public-release review. It does
not draft jurisdiction-specific waivers, governing-law/dispute/arbitration/
class-action/minor/guardian terms, a privacy notice, or a production support or
incident policy.

Deferred work includes production-host approval; release entity, business,
territory, audience, and distribution decisions; trademark clearance; any
provider/model upgrade or remote provider decision; SS-021 clear-local-data
behavior and deletion UX; and SS-022 real-user/video accuracy validation.

SS-020 changes no runtime behavior or copy, export format/data class, provider,
model, SDK, dependency, lockfile, licensing policy, notice, SBOM, bundle,
persistence, service worker, remote sharing, cloud storage, deployment,
telemetry, analytics, logging, diagnostics, or runtime observability. Historical
audit/source packets that predate the current SS-020 staged handoff remain
unchanged and outside automated normalization. The current SS-020 staged
handoff artifacts are audit-delivery evidence only; they do not alter policy or
runtime behavior and do not constitute legal, privacy, safety, medical,
trademark, compliance, or public-release clearance. The protected
`docs/agent-guidance/` files remain unchanged.
```

SS-002 rows L56,59,60 VERBATIM
```markdown
| `CONTRIBUTING.md` — SS-002 pre-release sentence | Legal gate | SS-002 assumption-of-risk and release-of-liability language requires legal/human review | Contributors and release owners | `Qualified-human review required` | Safety draft; SS-002 disposition | Jurisdiction, enforceability, parties, consent, and age/capacity are unresolved | Qualified legal reviewer | Scoped written legal decision | Yes | Pending |
| `docs/safety-terms.md` — `Assumption of Risk Draft` | Physical risk | Describes voluntary practice risks and user responsibility | Users/reviewers | `Qualified-human review required` | SS-002 disposition; runtime acknowledgement | Jurisdiction, enforceability, conspicuousness, and parties | Qualified legal reviewer | Exact-language legal disposition for named territories | Yes | Pending |
| `docs/safety-terms.md` — `Release of Liability Draft` | Liability | Draft limitation/release language with applicable-law qualifier | Users/reviewers | `Qualified-human review required` | SS-002 disposition | Rights, waiver limits, entities, contributors, distributors, and local law | Qualified legal reviewer | Exact-language legal disposition for named release scope | Yes | Pending |
```

Current CONTEXT L157-167 VERBATIM
```markdown
- The independent-audit handoff is five fresh-chat artifacts: `01` governance,
  `02` inventory coverage, `03` public claims/sources, `04` verifier/tests,
  and `05` synthesis. Artifacts `01`–`04` target at most 20 KB each and cannot
  permit PR preparation; `05` targets at most 8 KB before exact component
  responses and only an exact synthesis `PASS` after four matching component
  `PASS` results with no blockers may permit PR preparation. The current
  pre-response manifest has 20 baseline-relative candidate paths: 15 existing
  tracked paths plus five new staged-audit paths; all are intended for the
  audit candidate. B1 clarification: the prior two-wrapper handoff is
  historical and superseded; the five fresh-chat artifacts are the current
  handoff. These targets do not guarantee any chat-platform behavior.
```

Byte-identical redirects `docs/handoffs/ss-020-claude-final-audit-prompt.md` and `docs/handoffs/ss-020-claude-final-audit-source-packet.md`: SHA-256 `b587b7ac338ac0072ee2c8f00c007c9d8ab50eee54468845e71beeb0fcd3498a`; 613 bytes. First redirect VERBATIM:
```markdown
# SUPERSEDED — DO NOT PASTE

Candidate: `4e5dd4029da053ebb145b0a15416cbd5450b8fb1`.

Use one fresh chat per staged file, in this exact order:

1. `docs/handoffs/ss-020-claude-audit-01-governance.md`
2. `docs/handoffs/ss-020-claude-audit-02-inventory-coverage.md`
3. `docs/handoffs/ss-020-claude-audit-03-public-claims-sources.md`
4. `docs/handoffs/ss-020-claude-audit-04-verifier-tests.md`
5. `docs/handoffs/ss-020-claude-audit-05-final-synthesis.md`

Save each final compact response unchanged with its metadata. Components cannot permit PR preparation; only Stage 05 may do so under its fail-closed contract.
```

## Verification

Recorded verification PASS.

## Known non-goals

No decision, PR, merge, release.

## Output required

Fields: `STAGE_ID: 01`; `CANDIDATE_ID: 4e5dd4029da053ebb145b0a15416cbd5450b8fb1`; `VERDICT` exactly one of `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`; blockers/non-blockers/future/missing/no-clearance. No restatement; <=350 words/3500 bytes. End `PR PREPARATION NOT PERMITTED`. Oversize: same-chat compact reissue preserving findings; save both, hash final. Check approval, SS-002, gate/records. Non-PASS blocks; fixes re-review.
