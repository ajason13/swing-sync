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

## Public-Language Inventory

Locations use a heading, exported symbol, metadata field, or representative
string so that reviewers can find the claim without relying on mutable line
numbers. `Pending` means evidence or an accountable human decision is still
required for a public release; it does not mean the wording is rejected.

| Source and stable location | Claim category | Statement or faithful summary | Audience / surface | Evidence classification | Supporting evidence | Review concern / open question | Accountable owner / reviewer type | Evidence or decision required | Release-blocking | Current disposition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `README.md` — title and opening paragraph | Purpose | Local-first browser app for educational golf swing review, pose-derived movement inspection, and Swing Card notes | Repository visitors | `Qualified-human review required` | README; current runtime workflow | Does the overall purpose create an accurate consumer impression? | Product/release owner; safety/medical-scope reviewer | Named-scope intended-use and net-impression decision | Yes | Pending |
| `README.md` — opening non-medical paragraph | Medical scope | Not medical advice, diagnosis, rehabilitation, physical therapy, or a substitute for qualified care/coaching | Repository visitors | `Qualified-human review required` | Safety draft; runtime acknowledgement | Is the disclaimer prominent and sufficient for intended audience/use? | Qualified safety/medical-scope and legal reviewers | Intended-use, audience, and wording decisions | Yes | Pending |
| `README.md` — `Current Capabilities` | Current capability | Local selection/inference, phases, metrics, review, and local export/copy; empty production remote-provider registry | Repository visitors | `Code/test-enforced fact` | `src/app-renderer.ts`; `src/model-consent.ts`; unit/smoke tests | Is the summary complete and appropriately bounded for the candidate? | Engineering owner; product/release owner | Candidate build and named verification evidence | Yes | Pending |
| `README.md` — `Local-First Design`, current-behavior sentences | Privacy and export | Raw video is not uploaded by default; derived/exported data can remain sensitive and leaves app control after download | Repository visitors | `Code/test-enforced fact` | Current runtime/export source; privacy verifier; smoke network/export paths | Browser and environment evidence is bounded; manual sharing leaves app control | Privacy reviewer; engineering owner | Frozen-candidate data-flow inventory, tested build, and privacy disposition | Yes | Pending |
| `README.md` — `Local-First Design`, “Any future feature” sentence | Future remote consent | Future outbound raw video, pixels, landmarks, metrics, prompts, reports, or outputs must use separate explicit opt-in | Repository visitors and implementers | `Documented design intent` | README; privacy architecture; repository governance | Future enforcement and provider/destination specifics are not current implementation facts | Privacy/legal reviewer; future engineering owner | Approved future spec, provider/data review, consent design, and tests | No for current local candidate | Deferred / non-goal |
| `README.md` — draft-review paragraph | Review status | Safety and privacy documents remain drafts and make no guarantees | Repository visitors | `Documented design intent` | Safety/privacy draft banners; docs verifier | Is draft status sufficiently visible wherever claims are published? | Legal/privacy/safety reviewers; release owner | Publication-surface review | Yes | Pending |
| `README.md` — `License` | License | Project source is Apache-2.0; other reuse is governed by linked policies | Repository visitors and distributors | `Qualified-human review required` | `LICENSE`; policy and audit records | Are all candidate artifacts, notices, and distribution duties covered? | Licensing reviewer; release owner | Candidate-specific license/notice review | Yes | Pending |
| `README.md` — `Non-Affiliation` | Affiliation and third-party names | Independent project; no endorsement; third-party names belong to their owners | Repository visitors | `Qualified-human review required` | Canonical README text; docs verifier | Disclaimer is not trademark clearance; name/branding still need review | Qualified trademark/legal reviewer | Preliminary search evidence and branding decision | Yes | Pending |
| `CONTRIBUTING.md` — `Safety, Privacy, And Claims` | Contributor claims boundary | Educational/non-medical and local-first rules apply; draft claims remain pending review | Contributors | `Documented design intent` | Safety/privacy docs; contribution workflow | Do contributor gates cover every public-copy and implementation path? | Maintainer; legal/privacy/safety reviewers | Workflow review and candidate diff | Yes | Pending |
| `CONTRIBUTING.md` — SS-002 pre-release sentence | Legal gate | SS-002 assumption-of-risk and release-of-liability language requires legal/human review | Contributors and release owners | `Qualified-human review required` | Safety draft; SS-002 disposition | Jurisdiction, enforceability, parties, consent, and age/capacity are unresolved | Qualified legal reviewer | Scoped written legal decision | Yes | Pending |
| `docs/safety-terms.md` — draft banner and opening | Safety/legal status | Review-ready product draft; not legal advice or an enforceability guarantee | Reviewers and repository readers | `Qualified-human review required` | Draft banner; safety verifier | Has a qualified reviewer assessed the exact candidate and scope? | Qualified legal and safety reviewers | Authenticated, scoped comments and sign-off | Yes | Pending |
| `docs/safety-terms.md` — `Intended Use` | Medical and product scope | Educational feedback; excludes medical, rehabilitation, diagnosis, triage, and professional instruction | Users/reviewers | `Qualified-human review required` | Runtime acknowledgement; coaching guardrails | Overall intended use and consumer impression remain unresolved | Safety/medical-scope and legal reviewers | Named intended-use and audience decision | Yes | Pending |
| `docs/safety-terms.md` — `Assumption of Risk Draft` | Physical risk | Describes voluntary practice risks and user responsibility | Users/reviewers | `Qualified-human review required` | SS-002 disposition; runtime acknowledgement | Jurisdiction, enforceability, conspicuousness, and parties | Qualified legal reviewer | Exact-language legal disposition for named territories | Yes | Pending |
| `docs/safety-terms.md` — `Release of Liability Draft` | Liability | Draft limitation/release language with applicable-law qualifier | Users/reviewers | `Qualified-human review required` | SS-002 disposition | Rights, waiver limits, entities, contributors, distributors, and local law | Qualified legal reviewer | Exact-language legal disposition for named release scope | Yes | Pending |
| `docs/safety-terms.md` — `Consent Gate Requirement` | Consent | First analysis is blocked until local acknowledgement; consent storage is minimal and local | Users and implementers | `Code/test-enforced fact` | `src/app-renderer.ts`; `src/consent-state.ts`; unit/smoke tests | Legal meaning, conspicuousness, age/capacity, and retention remain unresolved | Legal/privacy reviewer; engineering owner | UX evidence, data evidence, and consent decision | Yes | Pending |
| `docs/safety-terms.md` — `Educational Feedback Boundary`; current `src/coaching-prompt.ts` and `src/coaching-contract.ts` enforcement | Current educational-feedback safety | Current coaching contracts prohibit medical diagnosis, unsafe prescriptions, and guarantees and bound generated observations to available evidence | Users and implementers | `Code/test-enforced fact` | Current coaching prompt/contract source; safety verifier; coaching unit tests | Current guardrails are defense in depth, not safety, medical, or efficacy approval | Safety/medical-scope reviewer; engineering owner | Frozen-candidate guardrail evidence and public-wording review | Yes | Pending |
| `docs/safety-terms.md` — `AI Coach Prompt Constraints`, “Future AI coach prompts” | Future AI prompt safety | Future prompt/system instructions must prohibit diagnosis, treatment, aggressive movement prescriptions, and guarantees and must recommend qualified help where appropriate | Future implementers and reviewers | `Documented design intent` | Safety terms draft; repository safety governance | The future requirements do not prove implementation by a provider, model, or later prompt path | Safety/medical-scope reviewer; future engineering owner | Approved future provider/prompt specification, implementation evidence, and human wording review | Yes if published or implemented | Pending |
| `docs/safety-terms.md` — `Review Checklist` | Open review | Legal/human approval boxes remain unchecked | Release reviewers | `Qualified-human review required` | Current unchecked Markdown list | Reviewer identity, evidence, and decisions are not recorded | Release owner; qualified reviewers | Completed scoped records through this gate | Yes | Pending |
| `docs/privacy-architecture.md` — draft banner and opening | Privacy status | Local-first engineering draft, not privacy/legal advice or a guarantee | Reviewers and repository readers | `Qualified-human review required` | Draft banner; privacy verifier | No qualified privacy decision is recorded | Qualified privacy/legal reviewer | Candidate-specific privacy disposition | Yes | Pending |
| `docs/privacy-architecture.md` — `Default Privacy Posture` | Current implementation | Local file selection, Pose Landmarker inference, local PNG/print/PDF/prompt-copy; no camera, raw-video/landmark persistence, remote sharing, or remote model API | Reviewers and users | `Code/test-enforced fact` | Runtime modules; privacy/unit/smoke tests | Reconfirm against frozen candidate and exact build | Engineering owner; privacy reviewer | Data-flow trace and candidate verification | Yes | Pending |
| `docs/privacy-architecture.md` — `Data Classes` | Data inventory | Classes raw video, frames, landmarks, metrics, exports, prompts/outputs, and acknowledgement state | Reviewers and implementers | `Documented design intent` | Privacy doc; runtime data contracts | Which classes actually exist, persist, or leave control in candidate scope? | Privacy reviewer; engineering owner | Current data map plus export inspection | Yes | Pending |
| `docs/privacy-architecture.md` — `Local-First Processing Flow` | Lifecycle | Fail-closed local processing and explicit opt-in design | Reviewers and implementers | `Documented design intent` | Privacy verifier; network smoke tests | Future-oriented steps must not be mistaken for current behavior | Privacy reviewer; engineering owner | Step-by-step current/future classification | Yes | Pending |
| `docs/privacy-architecture.md` — `Video Lifecycle` deletion bullets | Storage and deletion | Browser/device storage varies; clear-local-data and deletion language is future-oriented and cannot promise erasure | Reviewers and users | `Qualified-human review required` | Storage standard; acknowledgement source | SS-021 behavior is not implemented; device-level deletion cannot be inferred | Privacy reviewer; product owner | Storage evidence, user-copy decision, SS-021 result | Yes | Pending |
| `docs/privacy-architecture.md` — `Export Policy` | Export sensitivity | Local user-initiated exports may contain identifying or sensitive metrics/images/text and exclude raw video by default | Reviewers and users | `Code/test-enforced fact` | Swing Card generator/actions; smoke tests | Exact artifact contents and manual-sharing risks require review | Privacy/safety reviewer; engineering owner | Rendered artifacts and data-class inspection | Yes | Pending |
| `docs/privacy-architecture.md` — `Optional Remote Model or Coach Sharing`, current status; `src/model-consent.ts` registry | Remote sharing | The production provider registry is empty and the current UI exposes no configured remote-send path | Reviewers and users | `Code/test-enforced fact` | Empty provider registry; remote panel; unit and smoke tests | Reconfirm registry and built candidate; absence is bounded to inspected/tested paths | Privacy reviewer; engineering owner | Frozen-candidate registry/build and network evidence | Yes | Pending |
| `docs/privacy-architecture.md` — `Optional Remote Model or Coach Sharing`, “Before any remote” requirements | Future provider review and consent | A future remote provider must document terms, data classes, destinations, retention, human review, and opt-in/revocation before implementation | Reviewers and implementers | `Documented design intent` | Privacy architecture and repository governance | Future provider facts, user flow, and enforcement do not yet exist | Privacy/legal/licensing reviewers; future engineering owner | Approved future provider/data/consent specification, implementation, and tests | No for current local candidate | Deferred / non-goal |
| `docs/privacy-architecture.md` — MediaPipe gate and observability paragraph | Provider metrics and telemetry | Pinned `0.10.35`, version-specific response, observed network checks, and local sanitized errors | Reviewers and implementers | `Unresolved assumption` | Provider issue; generic notice; asset/network tests | Generic current notice and exact-version evidence require human reconciliation | Qualified privacy reviewer; engineering owner | Exact artifact/network evidence and scoped disposition | Yes | Pending |
| `docs/privacy-architecture.md` — `User-Facing Copy Drafts` | Draft privacy copy | Local processing, export, remote sharing, and future clear-data text | Future users/reviewers | `Qualified-human review required` | Draft only; runtime differs by feature status | Which drafts should publish, and when? | Privacy/legal/product reviewers | Copy-to-runtime mapping and wording decision | Yes | Pending |
| `docs/limitations.md` — pose/metric, camera, educational, and fixture sections | Accuracy, evidence, medical, safety | Results are estimates; tests/fixtures do not prove real-world correctness, safety, efficacy, or compliance | Users/reviewers | `Qualified-human review required` | Algorithms, fixtures, unit/smoke tests | SS-022 validation is pending; prominence and evidence sufficiency need review | Product, safety/medical-scope, and evidence reviewers | Validation plan/results and claim review | Yes | Pending |
| `docs/limitations.md` — privacy/export and remote sections | Privacy, export, browser, remote | Exported data can be sensitive; browser controls vary; provider registry is empty | Users/reviewers | `Code/test-enforced fact` | Runtime exports; registry; browser tests | Claims remain environment-bounded and manual sharing is external | Privacy reviewer; engineering owner | Candidate-specific browser/export evidence | Yes | Pending |
| `docs/limitations.md` — document-level accessibility omission; SS-019 evidence | Accessibility | The current limitations page has no dedicated accessibility section; SS-019 automated/manual evidence remains bounded and does not establish certification | Users/reviewers | `Unresolved assumption` | SS-019 tests and manual QA record | Whether public limitations need explicit accessibility wording and which manual risks remain | Accessibility reviewer; release owner | Candidate manual/automated evidence and publication decision | Conditional | Pending |
| `docs/deployment.md` — draft banner, current posture, and no-backend implications | Deployment | Static frontend/no app backend; no app-owned accounts, secrets, server rate limits/logs, or cloud retention | Operators/reviewers | `Code/test-enforced fact` | Source tree; deployment verifier | Chosen host and candidate configuration are not yet named | Security/privacy reviewer; deployer | Frozen host/build configuration and evidence | Yes | Pending |
| `docs/deployment.md` — `Security Headers` | Security ownership | Meta CSP is limited; production response headers are deployer-owned | Operators/reviewers | `Documented design intent` | `index.html`; CSP standard; docs tests | Actual host headers and policy compatibility require inspection | Security reviewer; deployer | Response-header capture and host decision | Yes | Pending |
| `docs/deployment.md` — logging/telemetry and service-worker statements | Runtime/deployment data | No app-owned server logging/telemetry; current service worker has bounded install/activate behavior | Operators/reviewers | `Code/test-enforced fact` | Source/verifiers; `public/sw.js` | Host, third-party, and future-build behavior is not proven generally | Security/privacy reviewer; engineering owner | Candidate network/service-worker evidence | Yes | Pending |
| `docs/deployment.md` — `Backend Architecture Review Gates` | Future architecture | Backend, remote, storage, provider, reporting, and host changes require separate review | Maintainers/operators | `Documented design intent` | Repository governance | Trigger ownership and future enforcement | Lead architect; release owner | Future approved spec and audit | No for current static candidate | Deferred / non-goal |
| `docs/licensing.md` — dependency/reference/provider policy and trademark paragraph | Licensing and trademark | Engineering review rules apply; a preliminary Swing Sync name search is still required | Distributors/reviewers | `Qualified-human review required` | Dependency audit; policy; source/notice records | Audit and search do not establish clearance or all distribution duties | Licensing and qualified trademark/legal reviewers | Candidate bill of materials, notices, search evidence, decision | Yes | Pending |
| `docs/models-licensing.md` — exact `@mediapipe/tasks-vision@0.10.35` entry, 2026-06-10 telemetry bullets, and “Do not claim tests prove all future SDK versions lack telemetry” | Exact-version provider telemetry assertion | Records an attributed statement that the then-current Web SDK lacked telemetry, that future aggregated telemetry was planned without a planned opt-out, and that outbound requests could be blocked | Reviewers and distributors | `Unresolved assumption` | MediaPipe issue #6306 response; pinned package/model records; candidate observed-network and blocked-network tests | The attributed response and tests do not alone establish exact `0.10.35` behavior in every environment or cover upgrades | Qualified privacy reviewer; engineering owner | Authenticate/version-scope the provider evidence, reconcile the generic current notice, inspect exact artifact/network evidence, and record a qualified privacy decision | Yes | Pending |
| `docs/licensing.md` — exact `@mediapipe/tasks-vision@0.10.35` paragraph and fresh-review requirement | Exact-version provider telemetry assertion | States that Google described the current Web SDK as lacking telemetry and requires fresh license/privacy/provider-metrics/network review for later versions | Reviewers and distributors | `Unresolved assumption` | MediaPipe issue #6306 response; lockfile and exact package record; candidate network tests; generic MediaPipe notice | Licensing text repeats a provider claim but does not itself establish telemetry absence, privacy approval, or future behavior | Qualified privacy and licensing reviewers; engineering owner | Reconcile exact-version provider/artifact/network evidence and record qualified privacy and licensing decisions for the named candidate | Yes | Pending |
| `docs/models-licensing.md`, `docs/model-assets/*`, and provider records | Model/provider rights | Exact local model/provider decisions are version- and artifact-scoped | Distributors/reviewers | `Qualified-human review required` | Model asset record; checksums; provider evidence | Upgrade, redistribution, terms, and privacy evidence must match candidate | Licensing/privacy reviewers | Exact-version artifact and terms review | Yes | Pending |
| `docs/fixture-policy.md` and fixture records | Fixture rights/privacy | Only approved, documented test fixtures are permitted; fixtures do not prove real-user accuracy | Contributors/reviewers | `Code/test-enforced fact` | Fixture verifier; provenance records | Publication scope and rights/privacy evidence need confirmation | Licensing/privacy reviewer | Candidate fixture manifest and provenance review | Conditional | Pending |
| `LICENSE`, `NOTICE`, and `THIRD_PARTY_NOTICES.md` | Distribution notices | Project and third-party license/notice evidence | Distributors/reviewers | `Qualified-human review required` | License audit and notice files | Completeness, attribution, versions, and distribution channel | Licensing reviewer; release owner | Candidate artifact/license/notice reconciliation | Yes | Pending |
| `docs/schemas/swing-metric-payload-v0.1.0.schema.json` — structural keywords (`required`, `additionalProperties`, enums, and conditional constraints) | Metric payload structure | Documents the closed version, metric/value/confidence vocabulary, required fields, and conditional structural constraints reflected by the TypeScript validator | Developers, integrators, and repository readers | `Code/test-enforced fact` | JSON Schema; `src/metric-contract.ts`; `test/unit/metric-contract.test.ts` fixture, vocabulary, confidence, field, and prohibited-key cases | The JSON Schema is documentation rather than the runtime validator; candidate alignment and exact enforcement scope must stay explicit | Engineering owner | Frozen schema/validator comparison and named unit evidence | Yes | Pending |
| `docs/schemas/swing-metric-payload-v0.1.0.schema.json` — top-level `description` and `$comment` | Public export, telemetry, and remote limitation wording | States that SS-008 does not approve metric calculation, storage, export, telemetry, remote sharing, or public schema serving, and limits prohibited-key rejection to exact case-sensitive names | Integrators and repository readers | `Qualified-human review required` | Exact schema prose; metric-contract source/tests; current export and remote-provider inventory | Structural validation does not itself prove the broader export, telemetry, remote-sharing, or public-serving limitations | Privacy/product/release reviewers; engineering owner | Public-wording decision plus candidate data-flow, export, telemetry, remote, and validator evidence | Yes | Pending |
| `index.html` — description/title; `public/manifest.webmanifest` — name fields; `package.json` — description | Public metadata | Local-first analysis scaffold, Swing Sync name, and “AI golf swing analysis coach” package description | Search, install, package, and browser surfaces | `Qualified-human review required` | Exact metadata files | Metadata may imply broader AI/coaching or release posture than current runtime | Product, safety/medical-scope, trademark reviewers | Separate metadata/net-impression decision | Yes | Pending |
| `src/app-renderer.ts` — safety acknowledgement and workflow status strings | Runtime consent and status | Educational/risk acknowledgement blocks analysis; selected media and decoded frames remain local/volatile | App users | `Code/test-enforced fact` | App renderer, consent state, unit/smoke tests | Conspicuousness, legal meaning, accessibility, and audience remain human questions | Legal/safety/privacy reviewers; engineering owner | Candidate UX capture and behavior tests | Yes | Pending |
| `src/app-renderer.ts` — “No feature will send it elsewhere without a separate, explicit opt-in step you initiate.” | Public runtime privacy absolute | The consent surface makes an absolute-sounding statement about every feature sending raw swing video | App users | `Qualified-human review required` | Current renderer source; privacy verifier; consent and no-network smoke paths, each bounded to configured source and tested environments | Does “No feature” overstate protection across browsers, hosts, future code, or manual user sharing? | Qualified privacy reviewer; engineering owner | Frozen-candidate source/data-flow trace, network evidence, and public-wording decision | Yes | Pending |
| `src/app-events.ts` — “No video data leaves this device.” | Public runtime privacy absolute | The local-analysis loading status makes an absolute device-boundary statement | App users | `Qualified-human review required` | Current event-handler source; privacy verifier; local-analysis and no-network smoke paths, each bounded to configured source and tested environments | Does “No video data” accurately describe all candidate requests, browser behavior, hosting, and user-controlled export/sharing paths? | Qualified privacy reviewer; engineering owner | Frozen-candidate network/data-flow evidence and public-wording decision | Yes | Pending |
| `src/phase-review-renderer.ts` — review warning and confirmation UI | Runtime phase limits | Eight samples may miss events; impact cannot be confirmed from body landmarks; human confirmation is required | App users | `Code/test-enforced fact` | Renderer and unit/smoke tests | Accuracy evidence and user interpretation need review | Evidence/product/safety reviewers | SS-022 evidence and UI review | Yes | Pending |
| `src/remote-model-renderer.ts` — “Remote model review unavailable” | Runtime remote status | Remote review is unavailable until a provider is separately reviewed/configured | App users | `Code/test-enforced fact` | Empty registry; renderer and smoke tests | Must remain consistent with candidate configuration | Privacy/licensing reviewer; engineering owner | Registry/configuration evidence | Yes | Pending |
| Runtime error/status copy in `src/app-renderer.ts` and analysis lifecycle modules | Runtime errors | Local model/loading/processing failures use bounded status and error codes | App users | `Code/test-enforced fact` | Unit/smoke tests; privacy/safety verifiers | Clarity, completeness, and no sensitive leakage | Product/privacy/safety reviewers | Error-path evidence and copy review | Conditional | Pending |
| `src/app-renderer.ts` — Swing Card export controls and warnings | Export UI | Download PNG, Print / Save as PDF, and Copy prompt; raw video excluded | App users | `Code/test-enforced fact` | Swing Card actions/generator; smoke tests | Actual output, warning prominence, and browser print behavior | Privacy/safety/product reviewers | Candidate artifacts and browser evidence | Yes | Pending |
| `src/swing-card-generator.ts` — PNG/print/prompt content | Generated content | Selected keyframes, metrics, warnings, and manual-upload prompt; no anonymity/privacy guarantee | Export recipients and third-party-service users | `Code/test-enforced fact` | Generator tests and smoke tests | Export can be identifying and leaves app control after sharing | Privacy/safety/legal reviewers | Rendered samples and data-class review | Yes | Pending |
| `src/coaching-prompt.ts` and `src/coaching-contract.ts` | AI coaching contract/output | Evidence-bounded JSON, unavailable/review-required states, prohibited medical/privacy/legal absolutes | Manual model-chat users | `Code/test-enforced fact` | Coaching tests and safety verifier | External model behavior is not controlled; guardrails are not approval | Safety/medical-scope/privacy reviewers | Contract tests, sample outputs, and human review | Yes | Pending |
| Historical `docs/ss-*` and `docs/handoffs/*` research, prompt, response, audit, source-packet, and handoff artifacts | Repository-public evidence | Historical evidence may repeat superseded or sensitive wording and is non-authoritative | Repository readers | `Unresolved assumption` | Tracked history and artifact manifests | Release owner must decide publication boundary and context labels for both historical namespaces | Release owner; legal/privacy/safety/trademark reviewers | Complete `docs/ss-*` and `docs/handoffs/*` manifests plus publication decision | Yes if public | Pending; excluded from normalization and uniqueness checks |

### Bounded Public-Document Standard Claim-Scan Result

The standard prohibited-claim scan covers only the configured public summaries
`README.md`, `CONTRIBUTING.md`, `docs/limitations.md`, and
`docs/deployment.md`. Safety, privacy, and this canonical gate use their
separate structural, required-string, link, and current-approval controls
because their draft and inventory text legitimately names prohibited claim
categories.

**Current standard claim-scan result: PASS for the four configured summaries.**
This result is bounded to the checked files, patterns, and current repository
content. Verifier success is not qualified-human legal, privacy, safety,
medical, trademark, compliance, or public-release clearance.

## Publication-Review Matrix

Existing wording and automated evidence do not imply approval. Sensitive
surfaces stay `Pending` until authenticated, candidate-scoped human evidence is
attached.

| Publication surface | Separate review | Required reviewer role | Evidence required | Current status | Release-blocking effect |
| --- | --- | --- | --- | --- | --- |
| README | Yes | Product/release, legal, privacy, safety/medical-scope, trademark | Exact candidate text, capability/data evidence, branding decision | Pending | Blocks |
| CONTRIBUTING | Yes | Maintainer and affected qualified reviewers | Workflow text and enforcement evidence | Pending | Blocks if repository is public or contributor-facing |
| Limitations | Yes | Product/evidence and safety/medical-scope/privacy reviewers | Validation limits, browser evidence, future-work mapping | Pending | Blocks |
| Safety terms | Yes | Qualified legal and safety/medical-scope reviewers | Exact SS-002 text, territories, audience, consent UX | Pending | Blocks |
| Privacy architecture | Yes | Qualified privacy/legal reviewer | Data map, storage/export/network evidence, notices | Pending | Blocks |
| Deployment | Yes | Security/privacy reviewer and named deployer | Host configuration, headers, service-worker/network evidence | Pending | Blocks |
| Licensing/model/fixture/notice materials | Yes | Licensing, privacy, and trademark reviewers as applicable | Candidate SBOM, assets, terms, provenance, notices, search evidence | Pending | Blocks |
| Metadata (`index.html`, manifest, package description) | Yes | Product, safety/medical-scope, trademark reviewers | Exact candidate metadata and distribution-channel context | Pending | Blocks |
| Runtime UI | Yes | Product, legal, privacy, safety/medical-scope, accessibility reviewers | Candidate build, screenshots/flows, named tests, manual review | Pending | Blocks |
| Exports and generated content | Yes | Privacy, safety/medical-scope, product/legal reviewers | Actual PNG, print/PDF, prompt, warning, and coaching samples | Pending | Blocks |
| Historical repository evidence | Conditional | Release owner plus reviewers for exposed sensitive content | Complete tracked manifest and publication-boundary decision | Pending | Blocks if included in public distribution |

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
| Are the candidate accessibility evidence, remaining manual risks, and exact public/UI accessibility and limitation wording appropriate for the named scope without implying certification or compliance? | Accessibility reviewer and release owner | SS-019 named automated/manual results, remaining-risk record, and exact candidate UI/public copy | Accessibility reviewer and release owner | Blocking | Pending |

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
- candidate accessibility evidence or the accountable accessibility reviewer
  decision is missing or unresolved;
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
- accessibility public copy, UI/interaction behavior, or candidate evidence
  changes, including semantics/names, keyboard/focus, announcements, reflow,
  nonvisual operation, or assistive-technology scope;
- a material provider term, source, standard, law, or guidance change; or
- an incident, complaint, audit finding, expired condition, or post-review
  candidate diff.

A reopening trigger invalidates every affected prior sign-off. The affected
domain outcome and the aggregate outcome must reset to `PENDING`, public release
must reset to `BLOCKED`, and a fresh authenticated review must cover the new
candidate and scope before aggregation can be reconsidered. Unaffected records
may remain as historical evidence but cannot allow release while any affected
review is pending.

## Primary-Source Register

Accessed: 2026-08-08. These sources define process questions and evidence
limits only. The register does not decide applicability or compliance.

| Issuer / source | Direct URL | Process question | Limit on inference |
| --- | --- | --- | --- |
| Google, MediaPipe Tasks Privacy Notice | https://developers.google.com/edge/mediapipe/solutions/tasks#mediapipe_tasks_privacy_notice | How should on-device input processing and performance/utilization metrics be represented? | Does not establish exact `0.10.35` network behavior or a project consent duty |
| MediaPipe repository collaborator response, issue #6306 | https://github.com/google-ai-edge/mediapipe/issues/6306#issuecomment-4673728357 | What version-context evidence exists for Web SDK telemetry and blocking outbound requests? | Not a future-version guarantee, legal opinion, or release decision |
| WHATWG Storage Living Standard | https://storage.spec.whatwg.org/ | What browser storage variability and best-effort behavior must reviewers consider? | Does not prove retention or device-level erasure for every browser/device |
| W3C Content Security Policy Level 3, meta delivery | https://www.w3.org/TR/CSP3/#meta-element | What limits distinguish meta CSP from host response headers? | Does not prove a named host's production security posture |
| U.S. FDA, General Wellness: Policy for Low Risk Devices | https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices | Which intended-use and product-context facts should the reviewer assess? | No Swing Sync classification or approval is inferred |
| U.S. FTC, Health Products Compliance Guidance | https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance | Which express/implied claims, substantiation, disclosures, audience, and net-impression questions require review? | Not a project-specific decision or safe harbor |
| U.S. FTC, Health Breach Notification Rule: The Basics for Business | https://www.ftc.gov/business-guidance/resources/health-breach-notification-rule-basics-business | Which actual data-practice and identifying-health-information facts are needed? | Applicability depends on unresolved release, data, and business facts |
| U.S. FTC, Children's Privacy | https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy | What intended-audience and under-13 posture must be decided? | No audience or COPPA applicability conclusion is made |
| USPTO, Federal trademark searching | https://www.uspto.gov/trademarks/search/federal-trademark-searching | What preliminary federal search evidence should feed broader clearance work? | A search or disclaimer is not trademark clearance |
| Apache Software Foundation, Apache License 2.0 | https://www.apache.org/licenses/LICENSE-2.0 | What source-license and trademark-permission limits are relevant? | Does not substitute for product, privacy, safety, branding, or release review |

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
