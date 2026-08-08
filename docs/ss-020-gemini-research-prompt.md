# SS-020 Gemini Research and Specification Prompt

> **SUPERSEDED — DO NOT PASTE.** On 2026-08-08, the human owner confirmed that
> Gemini free-plan Deep Research is unavailable and directed Codex to own the
> SS-020 research/specification phase under the current Multi-Agent SDLC
> Framework. This file remains only as historical kickoff evidence. The
> authoritative research and lead disposition are recorded in the SS-020 Codex
> research/specification artifacts and `CONTEXT.md`.

The text below was prepared for a Gemini browser-chat handoff before the route
changed. It is preserved verbatim as historical evidence; do not use it as the
current research or implementation baseline.

## Role

You are Gemini acting as the sensitive-story research and specification input
owner for Swing Sync, an open-source, local-first browser app for educational
golf swing review.

You are not the legal, privacy, safety, medical, trademark, or release approver.
Do not provide legal advice, determine enforceability, or imply that review,
clearance, certification, or compliance has occurred. Your output is research
input that a Codex lead architect must disposition as Adopt, Revise, Defer, or
Reject before any implementation begins.

## Stage and objective

Stage: preimplementation research/specification for SS-020, “Prepare human
legal/privacy/safety release review gate.”

Create an implementation-ready recommendation for one authoritative
pre-release package that qualified humans can later use to review existing
draft public language. The package must make clear that existing project text
is not legal, medical, privacy, deletion, compliance, trademark, or public-
release clearance. Make the future human gate operational without pretending
that any approval has occurred.

## Verified project and task state

- Baseline date: 2026-08-08.
- Repository: `https://github.com/ajason13/swing-sync`.
- Refreshed `main` and `origin/main`:
  `0509999e7de5e609787fe53e8bdac2747aa0be64`.
- Latest merged PR: PR #20, merge commit
  `6872897475786e41cc434374224236854bde2846`.
- Story branch: `ss-020-release-review-gate`, created from that baseline.
- Notion task type: `Research`; Pull Request: empty; status:
  `1. Spec Drafting (Gemini)`.
- No earlier SS-020 Gemini prompt, research response, disposition, or approved
  specification exists in the repository.
- Gemini supplies research/specification input; Codex implements and verifies;
  Claude later performs independent adversarial audit; qualified human legal,
  privacy, safety, trademark, and release reviewers make future sign-off
  decisions. Claude cannot substitute for those humans.
- This is intended to remain documentation/release governance only. Runtime
  observability is unchanged. No runtime, dependency, provider, data-flow,
  export-format, persistence, service-worker, deployment, telemetry, analytics,
  remote-logging, remote-sharing, cloud-storage, SDK, model, or model-call
  change is permitted.

## Acceptance criteria

1. Inventory all public-facing safety, privacy, export, medical-scope,
   non-affiliation, and limitation language.
2. Produce a human-review checklist identifying legal/privacy/safety questions,
   open decisions, evidence needed, accountable reviewer roles, and required
   sign-off before public release.
3. Explicitly flag the SS-002 assumption-of-risk and release-of-liability
   language as requiring qualified human/legal review.
4. Confirm public documentation avoids absolute privacy, safety, deletion,
   anonymity, medical, legal, compliance, and trademark-clearance claims.
5. Record whether README, limitations, contributor, deployment, licensing,
   manifests, public UI/export, or other public wording needs separate human or
   legal review before broader publication.
6. Define operational gate entry criteria, required artifacts, decision
   outcomes, sign-off record, blocking conditions, and reopening rules without
   representing approval as complete.

## Protected boundaries and non-goals

- Do not provide legal advice or convert draft text into approved policy.
- Do not claim compliance, trademark clearance, medical approval, complete
  anonymity, guaranteed deletion, guaranteed privacy, guaranteed safety, or
  completed human review.
- Do not silently rewrite sensitive product copy merely to make it appear
  approved. Inventory and flag it. Recommend a narrow correction only when a
  demonstrable factual contradiction prevents accurate inventory or gate use;
  label that recommendation for lead disposition.
- Preserve local-first raw-media handling: raw swing video is not uploaded by
  default; remote sharing requires a separate explicit opt-in.
- Keep future release work and actual human review outside SS-020 acceptance.
- Do not recommend runtime features, dependencies, telemetry, analytics,
  logging, cloud systems, providers, persistence, service-worker changes,
  exported-data changes, deployment changes, legal documents, clickwrap, age
  gates, dispute terms, or jurisdiction-specific clauses as hidden additions to
  this story. Such matters may be recorded only as open questions or deferred
  future work for qualified humans.
- Automated checks may guard wording and package structure, but they cannot
  prove legal sufficiency, compliance, or human approval.

## Current public-claim inventory context

The following are exact or materially complete current excerpts. Treat them as
draft evidence to inventory, not as approved representations.

### `README.md`

```text
Swing Sync is a local-first browser app for educational golf swing review. It
helps users inspect selected swing videos in the browser, review pose-derived
movement signals, and export a Swing Card for their own practice notes.

Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance,
physical therapy, or a substitute for qualified medical care or professional
golf coaching.

The current app runs local video selection, local Pose Landmarker inference on
sampled frames, swing phase detection, geometry and tempo metrics, visual
review surfaces, and local Swing Card export/copy workflows.

SS-012 added local-only educational coaching prompt and response contracts, but
no model call is made from those contracts. SS-013 added a provider-neutral
remote model adapter scaffold behind explicit consent, but the production
provider registry is empty. There are no configured remote model providers,
provider SDKs, API keys, server routes, or active hosted-model calls in the
current production app.

Raw swing video is not uploaded by default. Any future feature that sends raw
video, frame pixels, landmarks, metrics, prompts, reports, or model outputs
outside the browser must use a separate, explicit opt-in flow.

Derived landmarks, metrics, selected images, prompts, reports, and model
outputs may still be sensitive or identifying. Downloaded exports are
controlled by the user after they leave the app.

The safety and privacy documents are engineering and product drafts pending
human/legal review; they are not legal advice and do not guarantee privacy,
safety, deletion, anonymity, or regulatory compliance.

Swing Sync source code is licensed under Apache-2.0.

Swing Sync is an independent open-source project. It is not affiliated with,
endorsed by, sponsored by, or approved by any golf equipment maker, tour,
league, training organization, model provider, or platform vendor. Third-party
names, if referenced, belong to their respective owners.
```

### `CONTRIBUTING.md`

```text
Swing Sync is for educational golf swing review. It is not medical advice, pain
diagnosis, rehabilitation guidance, physical therapy, or a substitute for
qualified medical care or professional golf coaching.

Raw swing video is not uploaded by default. Any future feature that sends raw
video, frame pixels, landmarks, metrics, prompts, reports, or model outputs
outside the browser must use a separate, explicit opt-in flow.

The safety and privacy documents are engineering and product drafts pending
human/legal review; they are not legal advice and do not guarantee privacy,
safety, deletion, anonymity, or regulatory compliance. SS-002 legal/human
review remains a pre-release gate for assumption-of-risk and
release-of-liability language.
```

### `docs/safety-terms.md`

```text
**DRAFT - pending legal/human review; not for release.**

This document is product-compliance draft language for human and legal review.
It is not legal advice, does not guarantee enforceability, and should be
reviewed before release.

Swing Sync provides local-first, educational golf swing feedback. It is not
medical advice, physical therapy, rehabilitation guidance, injury diagnosis,
pain triage, or professional athletic instruction.

Golf practice, swing changes, exercise, and physical movement involve risk.
Those risks may include soreness, strain, falls, impact injuries, equipment
injuries, aggravation of an existing condition, or other injury. Users should
practice in a safe location, warm up appropriately, stop if they feel pain,
dizziness, numbness, weakness, or unusual discomfort, and consult a qualified
professional before changing activity if they have health, mobility, or injury
concerns.

By using Swing Sync for analysis, the user acknowledges that golf practice and
movement changes are voluntary activities and that they are responsible for
deciding whether to participate, how intensely to practice, and whether to seek
professional medical, fitness, or coaching guidance.

To the maximum extent permitted by applicable law, the user agrees that Swing
Sync, its maintainers, contributors, and distributors are not responsible for
injury, loss, or damage arising from the user's practice, swing changes,
equipment use, training decisions, or reliance on educational feedback provided
by the app.

This draft release should not be read as waiving rights that cannot legally be
waived. It is intended as review-ready product language and must be evaluated
for the jurisdictions and release context where Swing Sync is offered.

The consent gate is a product safety acknowledgement, not a substitute for a
lawyer-reviewed contract, medical screening, age verification, or jurisdiction-
specific consent flow.
```

Its unchecked human-review checklist asks reviewers to assess assumptions of
risk, release wording, intended-use boundaries, conspicuous consent, age and
capacity, jurisdiction-specific enforceability, accessibility, and consistency
with privacy disclosures. SS-020 must carry these forward as unresolved, not
check them off.

### `docs/ss-002-research-disposition.md`

```text
SS-002 produces draft language for qualified human/legal review. It does not
provide legal advice or claim enforceability.

Adopt: a conspicuous pre-analysis assumption-of-risk acknowledgement;
educational-use and non-medical boundaries; stop-on-pain guidance; no injury-
prevention or performance guarantees; and a separate consent step.

Revise: broad waiver recommendations into jurisdiction-neutral draft language;
do not imply all claims can be waived; keep consent storage a local scaffold,
not a durable legal record.

Defer: jurisdiction-specific governing-law, dispute, arbitration, class-action,
minor/guardian, privacy-notice, and production release mechanics to qualified
human/legal review.

Reject: presenting external research as legal advice; claiming enforceability;
medical diagnosis or rehabilitation; guaranteed safety or performance; and
remote upload without separate explicit opt-in.
```

### `docs/privacy-architecture.md`

```text
**DRAFT - pending human/privacy review before public release.**

This document defines Swing Sync's local-first privacy architecture for future
video analysis work. It is product and engineering guidance, not legal advice
or a guarantee of privacy, security, deletion, or regulatory compliance.

Swing Sync must process swing video locally by default. Raw swing video and
frame pixels must not be uploaded, sent to model providers, or shared with
remote services unless a future feature adds a separate, explicit opt-in flow.

The current application implements local file selection and local Pose
Landmarker inference for sampled video frames. It does not implement camera
capture, raw-video or landmark persistence, exports, remote sharing, or remote
model APIs. The current consent acknowledgement is a local scaffold, not a
durable legal or privacy record.

Derived landmarks and metrics should be treated as sensitive user data. Even
without a face or background video, movement patterns, timing, body proportions,
and swing mechanics may be personal or identifying when combined with other
data.

Browser storage behavior varies by engine, device, available space, private
browsing mode, user settings, installed-PWA state, and whether storage is best-
effort or persistent. Swing Sync must not promise that local browser data is
permanent, encrypted, immune to browser eviction, or physically erased from
device storage after deletion.

Default analytical exports must not include raw swing video. Exports must not
be described as anonymous. Landmarks, metrics, images, and feedback may still
be sensitive or identifying.

Optional remote sharing is not approved yet.
```

Important factual tension to analyze, not silently repair: the privacy document
says the current application “does not implement … exports,” while current
README/runtime evidence says local Swing Card PNG, print/PDF, and prompt-copy
workflows exist. Recommend whether SS-020 should only inventory/block this
statement or authorize a narrow factual correction, and explain why.

### `docs/limitations.md`

This public page states that automated phase/metric/keyframe results can be
partial or wrong; the app is not a medical tool or professional coaching;
educational outputs are not safety guarantees; local processing does not make
derived outputs anonymous; exported PNG/PDF/prompt content leaves app control;
manual uploads to another service use that service's terms/privacy practices;
remote model review is unavailable; browser/device variability remains; and
the page links to the safety/privacy drafts. Determine every claim category and
whether this page requires separate qualified review before broad publication.

### `docs/deployment.md`

```text
**DRAFT - pending human security/privacy review before public production
hosting.**

This deployment guidance is product and engineering documentation, not legal,
security, privacy, deletion, anonymity, medical, trademark-clearance, or
regulatory-compliance advice or a guarantee.
```

It documents static-host assumptions, CSP/network behavior, no application
backend, no app-owned server logging/telemetry, local-only processing defaults,
service-worker scope, and a required separate architecture review before auth,
servers, secrets, enforcement logs, cloud storage, remote providers/sharing, or
production-host data-flow changes. Determine whether these are code/test-
enforced facts, design intent, environment-dependent claims, or human-review
questions.

### Licensing and model-provider documents

- `docs/licensing.md` says it is engineering policy, not legal advice; records
  Apache-2.0 and dependency/reference/notice rules; and says broader public
  naming or branding review requires a separate trademark search and human
  legal decision before release.
- `docs/models-licensing.md` says no provider SDK, remote API, or model binary is
  approved without source/license/terms/privacy review; exact local MediaPipe
  version `0.10.35` is approved under recorded project gates; the remote
  provider registry remains empty; and future upgrades/providers require fresh
  review. Inventory policy claims separately from public release clearance.

### Public runtime and export wording

Current exact representative strings include:

```text
Safety acknowledgement
Swing Sync is for educational use only. It is not medical advice, pain
diagnosis, rehabilitation guidance, or professional athletic instruction.
Only this acknowledgement is stored locally. It is not a durable or legally
audited consent record.

Complete local analysis before creating a Swing Card. Raw swing video is not
included in Swing Card exports.

Remote model review unavailable
Remote model review is optional and requires a separately reviewed provider
before any data can leave this device. Manual Swing Card export and Copy prompt
do not require provider configuration.
No reviewed provider is configured for this story.
Remote model review is unavailable until a provider is separately reviewed and
configured.

Generated in your browser for user-controlled download. Browser print can be
used to print or save as PDF where supported.

Do not claim the card is anonymous or that uploading it to another service is
private. After I upload or share the downloaded file, that service's terms and
privacy practices apply.
```

Also inventory public metadata: `index.html`, `public/manifest.webmanifest`,
and `package.json` describe Swing Sync as local-first/open-source/AI-assisted
educational golf swing analysis. Identify whether those summaries need review
because “local-first,” “AI,” “coach,” or similar phrasing could be read more
broadly than current behavior.

### Existing automated governance

- `scripts/verify-docs-claims.js` uses a shared declarative `docsClaimConfig`
  for required headings, canonical disclaimer/non-affiliation blocks, links,
  and named cross-file checks. It scans README, limitations, CONTRIBUTING, and
  deployment for broad prohibited absolute-claim patterns. Safety/privacy files
  receive required draft-banner checks but are not currently in the same broad
  public-claims scan. Runtime UI, export text, metadata, licensing/model docs,
  and the future SS-020 package are not all in that broad scan.
- The prohibited categories cover privacy/anonymity, deletion, safety/accuracy,
  medical/athletic, and legal/compliance/trademark claims. Allowed exact
  disclaimers are carved out to avoid rejecting negated warnings.
- `scripts/verify-safety-terms.js` checks required SS-002 draft/medical/risk/
  release/consent language, runtime consent strings, and prohibited positive
  medical/safety claims.
- `scripts/verify-privacy-boundaries.js` checks the privacy draft banner,
  local-first/export/remote-sharing boundaries, consent/runtime source, and
  prohibited absolute privacy/deletion/anonymity wording; it also scans source
  and scripts for protected network/data patterns.
- `test/unit/docs-claims.test.ts` injects an in-memory file reader and covers
  required files/links/blocks, empty or malformed cross-file values, embedded
  delimiters, renamed headings, missing headings, prohibited claims, allowed
  negated disclaimers, positive cases, and config validation. One test title
  currently says “keeps approved public docs free of prohibited absolute
  claims”; analyze whether “approved” is itself misleading even though it is
  test-only wording.
- Any verifier change must extend the shared/declarative registration and
  injected-reader mechanism. It must add adversarial tests for missing files,
  formatting changes, empty values, embedded delimiters, failure cases, and
  positive cases. Do not propose a one-off parser/check.

Repository-publication boundary to analyze: the tracked repository contains a
large historical set of `docs/ss-*` prompts, source packets, raw responses, and
review records. They are audit evidence rather than current policy, but they may
be publicly readable if the repository is published. Recommend how the release
inventory should distinguish authoritative live claims from immutable evidence,
and ask the human publication owner whether those artifacts are in scope. Do
not propose rewriting mechanically verified historical packets.

## Primary-source facts already checked by Codex

The following authoritative sources were accessed on `2026-08-08`. They are
inputs to human questions, not determinations that any law, rule, classification,
or clearance applies:

- Google, “MediaPipe Tasks Privacy Notice,” last modified June 5, 2026:
  `https://developers.google.com/edge/mediapipe/solutions/tasks#mediapipe_tasks_privacy_notice`.
  The current generic notice says task inputs are processed on-device and not
  sent to Google, while performance/utilization metrics are sent to Google and
  publishers are responsible for informed consent where required. This creates
  a material review question beside the repository's exact-version 0.10.35
  provider-response and observed-network evidence. Do not infer that the generic
  notice proves what version 0.10.35 transmits; require exact-version evidence
  and qualified human privacy disposition.
- WHATWG Storage Living Standard:
  `https://storage.spec.whatwg.org/`. Local storage buckets are initially
  best-effort and browser storage behavior is user-agent controlled; use this
  only to support cautious retention/deletion questions, not erasure claims.
- W3C Content Security Policy Level 3:
  `https://www.w3.org/TR/CSP3/#meta-element`. Use it only to frame the limits of
  meta-delivered CSP versus deployment headers, not to assert production
  security.
- U.S. FDA, “General Wellness: Policy for Low Risk Devices”:
  `https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices`.
  A qualified reviewer must assess intended use and actual product context; do
  not classify Swing Sync.
- U.S. FTC, “Health Products Compliance Guidance”:
  `https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance`;
  “Health Breach Notification Rule: The Basics for Business”:
  `https://www.ftc.gov/business-guidance/resources/health-breach-notification-rule-basics-business`;
  and “Children's Privacy”:
  `https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy`.
  Use these only to identify substantiation, actual-data-practice, audience,
  and age-posture questions. Applicability remains unresolved.
- USPTO, “Federal trademark searching”:
  `https://www.uspto.gov/trademarks/search/federal-trademark-searching`.
  Treat searching as evidence for a qualified trademark-review process, never
  as clearance by itself.
- Apache Software Foundation, Apache License 2.0:
  `https://www.apache.org/licenses/LICENSE-2.0`. Project/dependency license
  evidence does not substitute for product risk, trademark, privacy, or release
  review.

No release territory, intended audience or minor posture, hosting provider,
monetization/legal entity, support model, or distribution channel is established
in the embedded context. Do not fill those gaps with assumptions.

## Research requirements

Use current authoritative primary sources only when an external proposition is
material to the gate design. For each such source, give the direct URL, issuing
authority, page/document title, and access date `2026-08-08`. Prefer process-
level guidance about substantiating public representations, privacy/security
claims, health-product scope, endorsement/non-affiliation or trademark review,
and release governance. Do not research or draft jurisdiction-specific legal
clauses, decide enforceability, or infer that a source makes Swing Sync
compliant. State clearly where jurisdiction, audience, distribution model, age
group, data practice, or reviewer qualifications are unknown and require human
decision.

## Output required

Return one structured response with these sections:

1. **Executive boundary statement** — concise statement that this is research,
   not advice or approval, and that qualified-human release sign-off remains
   future and blocking.
2. **Primary-source evidence register** — only material current sources, with
   issuer, title, direct URL, access date, supported process question, and
   limits on inference.
3. **Traceable public-language inventory specification** — proposed schema and
   populated inventory rows/categories mapping source path/location, exact or
   faithful claim, category, audience/surface, status (`code/test-enforced
   fact`, `documented design intent`, `unresolved assumption`, `qualified-human
   review required`, or `non-goal/deferred`), concern/question, accountable
   owner/reviewer type, evidence needed, decision required, and release-
   blocking status. Include all surfaces named above and identify gaps.
4. **Human-review checklist specification** — legal, privacy, safety/medical,
   trademark/non-affiliation, and release-owner questions; open decisions;
   evidence; accountable roles; sign-off fields. Explicitly make SS-002
   assumption-of-risk and release-of-liability review a legal-review blocker.
5. **Operational release-gate specification** — entry criteria, mandatory
   artifacts, reviewer independence/qualification assumptions, permitted
   outcomes (`APPROVED`, `APPROVED WITH CONDITIONS`, `CHANGES REQUIRED`,
   `REJECTED`, or recommend safer labels), sign-off record fields, blocking
   conditions, expiry/change triggers, reopening rules, and separation between
   package completeness, Claude audit, human review, and actual public release.
6. **Absolute-claim and contradiction assessment** — evaluate public docs,
   runtime/export copy, metadata, and verifier coverage without claiming legal
   sufficiency. Address the stale privacy/export sentence and test-only
   “approved public docs” label explicitly.
7. **Document ownership plan** — recommend one authoritative SS-020 package and
   links from supporting docs rather than duplicated policy text. Name any
   narrow supporting-doc correction separately and explain whether it belongs
   in SS-020 or future work.
8. **Verification plan** — documentation/verifier tests needed to prevent
   contradictory approval claims, duplicate policy sources, missing warnings,
   or fail-open inventory/gate structure. Distinguish automation from human
   judgment and preserve the existing declarative/injected-reader architecture.
9. **Recommendations for lead disposition** — list every broad recommendation
   separately so the lead can mark it Adopt, Revise, Defer, or Reject. Keep
   current acceptance criteria separate from future work.
10. **Open questions and minimum human inputs** — smallest unresolved facts or
    decisions needed from qualified reviewers; do not answer them yourself.

End with the exact sentence:

`No legal, privacy, safety, medical, trademark, compliance, or public-release clearance is asserted by this research response.`
