# SS-020 Codex Deep Research Notes

Date: 2026-08-08
Research owner: Codex Deep Researcher
Decision informed: the implementation-ready scope for a human legal, privacy,
safety, trademark, and public-release review gate
Status: research input only; Lead Architect disposition required

## Boundary statement

This report is product, engineering, and release-governance research. It is not
legal, medical, privacy, safety, trademark, regulatory, or compliance advice.
It does not establish that a review occurred, that a claim is lawful or
sufficient, or that Swing Sync is cleared for public release.

Qualified humans must make future legal, privacy, safety, medical-scope,
trademark, and release decisions. Claude may audit the completeness and
boundary discipline of the SS-020 package but cannot substitute for those
reviewers.

## Research question and method

Question: what repository evidence, current primary-source context, unresolved
decisions, and operational controls must an SS-020 package expose so qualified
humans can later make a scoped public-release decision?

Method:

1. Search tracked documentation, public metadata, runtime-rendered copy,
   generated/exported copy, verifier scripts, and tests for safety, privacy,
   deletion, anonymity, medical, legal, compliance, export, non-affiliation,
   trademark, limitation, consent, provider, and release language.
2. Classify repository statements as code/test-enforced facts, documented
   design intent, unresolved assumptions, qualified-human-review items, or
   deferred/non-goals.
3. Check current primary sources only where they inform the review process or
   expose a material change. Record direct URLs and the access date.
4. Separate sourced findings from recommendations. Preserve uncertainty and do
   not make jurisdiction-specific or applicability conclusions.

Research write boundary: this phase may create research/specification and
coordination documents only. It does not authorize runtime, test, dependency,
lockfile, generated-artifact, SBOM, notice, deployment, provider, data-flow, or
external-system implementation changes.

## Repository findings

### 1. SS-002 risk and liability language is an unresolved legal blocker

- `docs/safety-terms.md:20-45` contains draft assumption-of-risk and
  release-of-liability language, including “to the maximum extent permitted by
  applicable law.”
- `docs/safety-terms.md:105-117` retains an unchecked human-review checklist.
- `src/app-renderer.ts:53-66` renders the safety acknowledgement, physical-risk
  acknowledgement, and statement that the local acknowledgement is not a
  durable or legally audited consent record.
- `CONTRIBUTING.md:115-119` explicitly preserves qualified legal/human review of
  the SS-002 assumption-of-risk and release-of-liability language as a
  pre-release gate.
- `docs/ss-002-research-disposition.md` frames the language as a draft, rejects
  enforceability claims, and defers jurisdiction-specific decisions.

Finding: repository evidence does not show qualified legal approval. The
SS-002 language must be a named release-blocking checklist item, not a completed
acceptance box.

### 2. Public purpose and medical-scope surfaces

| Surface | Current role | Review concern |
| --- | --- | --- |
| `README.md:3-9` | Product purpose and non-medical boundary | Public net impression of educational analysis and movement feedback |
| `CONTRIBUTING.md:105-123` | Contributor-facing medical/privacy summary | Consistency with authoritative drafts and release gate |
| `docs/safety-terms.md:9-18,47-103` | Intended use, safety, consent, AI-output limits | Qualified legal and safety/medical-scope review remains pending |
| `docs/limitations.md:8-42` | Accuracy, coaching, and medical limitations | Whether limitations are complete, prominent, and consistent |
| `src/app-renderer.ts:53-66` | Runtime acknowledgement | Conspicuousness, audience, consent meaning, and physical-risk language |
| `src/swing-card-generator.ts:72-87` | Copied manual-LLM prompt | Exported non-medical, no-guarantee, and no-anonymity wording |
| `src/coaching-prompt.ts` and `src/coaching-contract.ts` | Generated coaching contract and prohibited output | Test-enforced safety boundary, not medical approval or efficacy evidence |
| `package.json:7` | Package metadata: “AI golf swing analysis coach” | May imply broader AI/coaching behavior than the empty remote-provider registry and no hosted-model call |

Finding: non-medical disclaimers are relevant evidence but cannot alone decide
consumer net impression, regulatory classification, medical scope, or legal
sufficiency.

### 3. Local-first, privacy, storage, and deletion surfaces

| Surface | Current statement/evidence | Classification or concern |
| --- | --- | --- |
| `README.md:24-36` | Raw video is not uploaded by default; separate opt-in for future outbound data; drafts do not guarantee privacy/deletion/anonymity/compliance | Public summary; requires evidence mapping and human privacy review |
| `docs/privacy-architecture.md:3-58` | Draft local-first architecture and data classes | Design authority, not approved privacy notice or guarantee |
| `docs/privacy-architecture.md:60-83` | Browser storage variability and deletion limits | Design intent; clear-data behavior is not current device-level erasure |
| `docs/limitations.md:44-68` | Local processing, export sensitivity, remote unavailability | Public limitations; must stay consistent with runtime |
| `docs/deployment.md:89-98` | Local-first/default network posture | Host- and environment-dependent deployment claim |
| `src/consent-state.ts:12-35` | One local acknowledgement key | Code fact bounded to the current implementation |
| `test/smoke/app.spec.ts` | Checks acknowledgement storage, no unexpected network requests, and export behavior in tested browser paths | Environment/fixture-bounded evidence, not universal privacy proof |
| `public/sw.js` | Install/activate handlers only | Current service-worker fact; not a general no-cache guarantee for all hosts/future builds |

Finding: “local-first” is a scoped product architecture statement, not a
guarantee that outputs are anonymous, that a browser/device retains or erases
data in a particular way, or that every deployment environment has identical
network behavior.

### 4. Confirmed privacy/export contradiction

`docs/privacy-architecture.md:16-20` says the current application does not
implement exports. `README.md:13-15`, the Swing Card runtime modules, and smoke
tests show local PNG download, browser print/PDF, and prompt-copy workflows.

Finding: this is a stale public factual statement. The release package must
classify it as unresolved and release-blocking until corrected or dispositioned.
A narrow factual correction may be proposed by the Lead Architect; research
does not silently authorize editing sensitive copy or represent the corrected
document as approved.

### 5. Export and manual-sharing surfaces

- `docs/privacy-architecture.md:85-102,124-151` defines data-minimized,
  user-initiated exports and warns that exported data may remain identifying.
- `docs/limitations.md:44-57` explains that exported PNG/PDF/prompt content
  leaves application control and that another service's terms apply after
  manual upload.
- `src/app-renderer.ts`, `src/swing-card-actions.ts`, and
  `src/swing-card-generator.ts` own public Swing Card readiness, PNG, print/PDF,
  copy-prompt, warning, and generated-content wording.
- The generated manual prompt says not to claim the card is anonymous or that
  third-party upload is private.

Finding: human review must inspect actual export data classes and rendered
artifacts, not only README summaries. User initiation and local generation do
not establish anonymity, confidentiality after download, or third-party
privacy.

### 6. Remote provider and model surfaces

- `README.md:17-22` states that no production remote model provider, SDK, API
  key, server route, or hosted-model call is configured.
- `src/model-consent.ts` has an empty production provider registry.
- `src/remote-model-renderer.ts` renders an unavailable/off-by-default remote
  review panel and hypothetical outbound data classes.
- `docs/privacy-architecture.md:104-123,168-200`,
  `docs/models-licensing.md`, provider tests, and model asset/notice files
  describe reviewed local inference and future provider gates.

Finding: current absence of a configured remote provider is a bounded code/test
fact. Descriptions of hypothetical sharing or provider approval must not be
read as authorization for a provider, remote transmission, or future version.

### 7. Current MediaPipe privacy notice requires explicit disposition

The repository records a June 10, 2026 response from a MediaPipe repository
collaborator for the evaluated Web SDK. The response says the then-current Web
SDK did not include telemetry, that future aggregated performance/usage
collection was planned, and that outbound requests could be blocked while the
SDK continued to operate. The project pinned `@mediapipe/tasks-vision@0.10.35`
and recorded observed-network verification.

Google's generic MediaPipe Tasks notice was modified June 5, 2026 and currently
states that task inputs are processed on-device and not sent to Google, while
the APIs send performance/utilization metrics and publishers are responsible
for informed consent where required.

Finding: the generic notice does not prove that pinned Web SDK version 0.10.35
transmits metrics, and the version-specific response does not approve future
versions. The apparent tension requires exact-version artifact/network
evidence plus qualified human privacy disposition before release. SS-020 must
not resolve it through inference.

### 8. Accuracy, limitation, and safety-evidence surfaces

- `docs/limitations.md:8-42,70-82` documents algorithm, video-quality,
  keyframe, metric, browser, and accessibility limitations.
- `src/phase-review-renderer.ts`, Swing Card warning labels, fixture policy,
  and unit/smoke tests expose partial, unavailable, review-required, and
  limited-evidence states.
- SS-022 is separately planned for real-user/video accuracy validation.

Finding: these are design limitations and bounded test evidence. They do not
establish scientific validation, universal accuracy, injury prevention,
performance improvement, or safe use for every person.

### 9. Non-affiliation, trademark, licensing, and notices

- `README.md:101-106` contains the canonical public non-affiliation statement.
- `scripts/verify-docs-claims.js` enforces that block in configured public docs.
- `docs/licensing.md` says preliminary trademark searching and a qualified
  human/legal decision remain required before broader naming or branding use.
- `LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.md`, model-asset records, and
  provider notices are distribution evidence.
- Apache-2.0 section 6 addresses trademark permission within the license but is
  not project-name clearance or product release approval.

Finding: a non-affiliation disclaimer, license audit, notice aggregation, or
preliminary search is not trademark clearance. Broader publication requires a
separately recorded qualified decision.

### 10. Deployment, security, and compliance surfaces

- `docs/deployment.md:3-9` is prominently draft and disclaims legal, security,
  privacy, deletion, anonymity, medical, trademark-clearance, and regulatory-
  compliance advice or guarantees.
- The file documents current frontend/no-backend assumptions, meta CSP,
  deployer-owned headers, no app-owned server logging, local-first processing,
  service-worker scope, and future architecture-review triggers.
- `index.html` includes a meta-delivered CSP. Production response headers and
  host behavior are not established by that markup alone.

Finding: a release candidate needs chosen-host and response-header evidence.
Repository configuration cannot establish every production deployment control
or a general security/compliance conclusion.

### 11. Public repository and historical evidence boundary

The repository contains many tracked `docs/ss-*` prompts, responses, source
packets, and audit records that repeat historical sensitive language. These
files are evidence, not active product policy, but may be publicly readable if
the repository is published.

Finding: the release owner must define the publication boundary and classify
historical evidence separately from authoritative live claims. Automated
non-duplication checks must not rewrite, normalize, or invalidate immutable
audited packets.

## Candidate public-surface manifest

The implementation inventory should explicitly cover at least:

- Root/public summaries: `README.md`, `CONTRIBUTING.md`, `index.html`,
  `public/manifest.webmanifest`, `package.json`.
- Core public docs: `docs/limitations.md`, `docs/privacy-architecture.md`,
  `docs/safety-terms.md`, `docs/deployment.md`, `docs/licensing.md`,
  `docs/models-licensing.md`, and `docs/fixture-policy.md`.
- License/notice/model evidence: `LICENSE`, `NOTICE`,
  `THIRD_PARTY_NOTICES.md`, `docs/model-assets/*`, and
  `docs/third-party-notices/*`.
- Historical decision evidence: `docs/ss-002-research-disposition.md` and
  repository-public `docs/ss-*` research/audit artifacts, clearly labeled as
  evidence rather than current policy.
- Runtime-rendered copy: consent/safety acknowledgement, workflow status,
  phase limitations, remote-review-unavailable panel, and error/status copy.
- Generated or user-controlled outputs: Swing Card PNG, print/PDF surface,
  copied prompt, warning labels, coaching prompt and response boundaries.
- Verification evidence: safety, privacy, documentation, compliance, unit, and
  smoke verifiers/tests. These substantiate bounded facts but are not public-
  release approval.

Each final inventory row should record source location, statement or claim
category, audience/surface, evidence status, review concern, accountable
reviewer role, evidence needed, required decision, release-blocking status, and
current disposition.

## Existing verifier architecture and gaps

### Existing strengths

- `scripts/verify-docs-claims.js` uses a shared declarative
  `docsClaimConfig`, named cross-file checks, prohibited-claim categories,
  allowed negated disclaimers, and an injected file reader.
- `test/unit/docs-claims.test.ts` covers current positive behavior; missing
  documents/headings/strings/links; placement; reordered/whitespace formatting;
  missing, empty, or unextractable cross-file values; embedded delimiters; and
  negative claim fixtures.
- `scripts/verify-safety-terms.js` checks required SS-002 draft, medical, risk,
  liability, consent, and runtime boundaries.
- `scripts/verify-privacy-boundaries.js` checks the privacy draft banner,
  local-first/export/remote boundaries, consent/runtime source, prohibited
  absolute claims, and known network/data patterns.
- `npm run compliance:verify` composes the project governance checks.

### Gaps requiring Lead Architect disposition

- Broad prohibited-claim scanning currently covers only README, limitations,
  CONTRIBUTING, and deployment. Safety/privacy documents receive targeted
  checks, while runtime/export copy, metadata, licensing/model docs, and the
  future release package are not all covered by the same public-claim registry.
- No canonical release-gate document, pending sign-off schema, unique control
  anchor, or supporting-link requirement exists.
- A unit-test title says “approved public docs,” although the relevant public
  materials are explicitly drafts pending human review. Test pass should mean
  structurally verified, not human/legal approved.
- Automation does not and cannot establish reviewer qualification, legal
  sufficiency, trademark clearance, privacy-law applicability, medical status,
  or public-release authorization.

If the verifier changes, it should extend the existing declarative config and
injected-reader architecture. A one-off parser or disconnected scanner would
create a second policy source. Required adversarial tests should cover missing
and empty gate files, banner/heading/link removal, missing SS-002 warning,
missing current-blocked status, duplicate canonical control text, premature
approval claims, positive outcome definitions that do not assert approval,
formatting changes, failure cases, and positive cases. If new parsing is
introduced, add embedded-delimiter and fail-closed cases explicitly.

## Primary-source register

All sources below were accessed on 2026-08-08. They inform questions and
evidence requirements only; no applicability or compliance conclusion is made.

| Issuer/source | Direct URL | Process finding | Limit on inference |
| --- | --- | --- | --- |
| Google, MediaPipe Tasks Privacy Notice | https://developers.google.com/edge/mediapipe/solutions/tasks#mediapipe_tasks_privacy_notice | Current generic notice distinguishes on-device input processing from performance/utilization metrics | Does not establish exact `0.10.35` network behavior or project consent duty |
| MediaPipe repository collaborator response, issue #6306 | https://github.com/google-ai-edge/mediapipe/issues/6306#issuecomment-4673728357 | Version-context evidence says the then-current Web SDK lacked telemetry and future collection was planned | Repository comment is not a future-version guarantee, legal opinion, or release approval |
| WHATWG Storage Living Standard | https://storage.spec.whatwg.org/ | Local storage buckets begin as best-effort; user-agent storage behavior varies | Does not prove device-level retention or erasure behavior for every browser/device |
| W3C Content Security Policy Level 3, meta delivery | https://www.w3.org/TR/CSP3/#meta-element | Meta-delivered policy has timing/directive limits compared with response headers | Does not prove a specific host's production security posture |
| U.S. FDA, General Wellness: Policy for Low Risk Devices | https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices | Intended use and product context are material review inputs | No Swing Sync classification or approval is inferred |
| U.S. FTC, Health Products Compliance Guidance | https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance | Express and implied claims, substantiation, disclosures, audience, and net impression require review | Guidance is not a project-specific decision or safe harbor |
| U.S. FTC, Health Breach Notification Rule: The Basics for Business | https://www.ftc.gov/business-guidance/resources/health-breach-notification-rule-basics-business | Actual data practices and identifying-health-information questions may affect review | Applicability cannot be resolved without release/data/business facts |
| U.S. FTC, Children's Privacy | https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy | Intended audience and under-13 posture must be decided | No audience or COPPA applicability conclusion is made |
| USPTO, Federal trademark searching | https://www.uspto.gov/trademarks/search/federal-trademark-searching | Federal search is one part of a broader clearance process | A search or disclaimer is not trademark clearance |
| Apache Software Foundation, Apache License 2.0 | https://www.apache.org/licenses/LICENSE-2.0 | Authoritative project-license text and trademark limitation | Does not substitute for product, privacy, safety, or branding review |

## Sourced facts versus recommendations

### Sourced facts

- The project labels the safety/privacy materials as drafts pending human
  review and disclaims guarantees.
- SS-002 risk/release language has no recorded qualified legal sign-off.
- Local Swing Card exports exist, contradicting one current privacy-document
  sentence.
- The production remote-provider registry is empty.
- Existing automated checks verify bounded strings, source structures, and
  tested runtime paths; they do not provide human clearance.
- Current generic MediaPipe privacy language and the pinned-version response
  require explicit evidence-based reconciliation.
- Release territory, intended audience/minor posture, host, distribution
  channels, monetization/legal entity, and qualified reviewer identities are
  not established in inspected repository evidence.

### Recommendations for Lead Architect disposition

1. Adopt one canonical `docs/release-review-gate.md` as the operational package
   and keep domain docs as their own content authorities linked from it.
2. Adopt a prominent current state such as `PUBLIC RELEASE BLOCKED — HUMAN
   SIGN-OFF NOT RECORDED` and prohibit automation from changing it to approved.
3. Adopt the five-part evidence taxonomy: code/test-enforced fact, documented
   design intent, unresolved assumption, qualified-human review required, and
   deferred/non-goal.
4. Adopt an inventory, reviewer checklist, primary-source register, open-
   decision log, and unfilled sign-off record in the canonical package.
5. Adopt SS-002 assumption-of-risk and release-of-liability review as an
   explicit qualified-legal-review blocker.
6. Adopt scoped outcomes: pending, approved for a named scope, approved with
   recorded conditions, changes required, rejected/hold, and not applicable
   with rationale. Outcome definitions must not imply a current decision.
7. Revise broad approval language so every future approval binds a reviewer,
   qualification/role, candidate commit, release scope, date, evidence,
   conditions, expiry, and unresolved issues.
8. Revise local-first/privacy claims into bounded implementation facts plus
   limitations rather than universal guarantees.
9. Revise trademark-search language to preliminary evidence feeding a
   qualified decision, never clearance by itself.
10. Consider a narrow factual correction to the stale privacy/export sentence,
    but authorize it separately from human approval and test it as factual
    consistency only.
11. Extend the shared declarative docs verifier and injected-reader unit tests;
    do not add a parallel policy parser.
12. Defer actual human decisions/signatures, jurisdiction-specific terms or
    privacy notice, production-host review, trademark clearance, SS-021 deletion
    UX, SS-022 accuracy validation, and runtime-copy changes not expressly
    approved by the Lead Architect.
13. Reject any statement that Codex, Gemini, Claude, tests, licenses,
    non-affiliation language, or the SS-020 package itself grants public-release
    clearance.

## Weak claims and unresolved questions

- Repository absence does not prove no qualified-human evidence exists
  externally. Any external evidence must be authenticated, attached, scoped to
  a candidate commit/release, and evaluated by the accountable release owner.
- “Public-facing” is unresolved. It may include README-linked docs, runtime UI,
  generated exports, package/manifest metadata, and all tracked repository
  evidence if the repository is public.
- Browser/network tests are environment-, browser-, build-, and fixture-bounded.
- The current generic MediaPipe notice does not identify the exact behavior of
  the pinned package artifact; observed-network evidence does not prove every
  environment or future version.
- Release territory, audience/age posture, legal entity/business model,
  distribution channel, host, support model, and branding plan remain unknown.
- Non-affiliation wording is not trademark clearance.
- Non-medical disclaimers do not determine regulatory classification or remove
  the need to review the overall product and marketing impression.
- Local processing does not imply anonymity, guaranteed privacy, guaranteed
  deletion, device-level erasure, or control after export.
- A Claude PASS may establish package completeness and boundary discipline only;
  it is not qualified-human legal/privacy/safety approval.

## Research conclusion

The implementation-ready baseline should create an operational, currently
blocked human-review gate rather than rewrite drafts into apparently approved
policy. The package must expose the complete claim surface, evidence limits,
open decisions, qualified reviewer roles, SS-002 legal blocker, source dates,
decision record, blocking conditions, and reopening rules. Lead Architect
disposition is required before Builder edits begin.

No legal, privacy, safety, medical, trademark, compliance, or public-release
clearance is asserted by this research report.
