# SS-020 Claude Audit 03 — Public Claims And Sources

## Role

Independent auditor; do not implement, advise legally, or grant clearance.

## Stage

03/05. Candidate `4e5dd4029da053ebb145b0a15416cbd5450b8fb1`; branch `ss-020-release-review-gate`; no PR/sign-off; runtime/observability unchanged.

## Scope

Public additions, privacy diff, high-risk claims, scan result, and sources.

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


Inventory routing is Stage02; SS-002 exact governance is Stage01. Material omission requires blocker + supplement.

## Context

Research/Lead approval is not clearance; qualified humans decide release.

## Acceptance criteria

AC1 high-risk claim coverage; AC3 SS-002 cross-reference; AC4 bounded language; AC5 separate review.

## Protected boundaries

AI/audit/merge is not approval. Raw video local by default; remote needs opt-in. No runtime/dependency/provider/telemetry/storage/deployment change. Nine guidance files untouched.

## Relevant source contents or complete focused diffs

Four link-only additions VERBATIM
```diff
diff --git a/README.md b/README.md
+++ b/README.md
@@ -82,6 +82,8 @@ npm run sbom:generate
+- [Release review gate](./docs/release-review-gate.md) — current public-release
+  decision remains pending qualified-human review.
diff --git a/CONTRIBUTING.md b/CONTRIBUTING.md
+++ b/CONTRIBUTING.md
@@ -120,7 +120,8 @@ release-of-liability language.
+boundaries. The [release review gate](docs/release-review-gate.md) records the
+pending qualified-human review package for any future public release.
diff --git a/docs/limitations.md b/docs/limitations.md
+++ b/docs/limitations.md
@@ -83,4 +83,5 @@ safety, deletion, anonymity, or regulatory compliance.
+boundaries. The [release review gate](./release-review-gate.md) records the
+pending qualified-human review package for any future public release.
diff --git a/docs/safety-terms.md b/docs/safety-terms.md
+++ b/docs/safety-terms.md
@@ -6,6 +6,9 @@ This document is product-compliance draft language for human and legal review.
+The [release review gate](./release-review-gate.md) records the pending
+qualified-human review package for any future public release.
+
```

Privacy architecture zero-context focused diff, VERBATIM output of `git diff --unified=0 0509999e7de5e609787fe53e8bdac2747aa0be64..4e5dd4029da053ebb145b0a15416cbd5450b8fb1 -- docs/privacy-architecture.md`
```diff
diff --git a/docs/privacy-architecture.md b/docs/privacy-architecture.md
index a776bf6..958a7b1 100644
--- a/docs/privacy-architecture.md
+++ b/docs/privacy-architecture.md
@@ -8,0 +9,3 @@ or a guarantee of privacy, security, deletion, or regulatory compliance.
+The [release review gate](./release-review-gate.md) records the pending
+qualified-human review package for any future public release.
+
@@ -16,5 +19,5 @@ for that action.
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
```

Eleven high-risk rows VERBATIM
```markdown
| `docs/safety-terms.md` — `Educational Feedback Boundary`; current `src/coaching-prompt.ts` and `src/coaching-contract.ts` enforcement | Current educational-feedback safety | Current coaching contracts prohibit medical diagnosis, unsafe prescriptions, and guarantees and bound generated observations to available evidence | Users and implementers | `Code/test-enforced fact` | Current coaching prompt/contract source; safety verifier; coaching unit tests | Current guardrails are defense in depth, not safety, medical, or efficacy approval | Safety/medical-scope reviewer; engineering owner | Frozen-candidate guardrail evidence and public-wording review | Yes | Pending |
| `docs/safety-terms.md` — `AI Coach Prompt Constraints`, “Future AI coach prompts” | Future AI prompt safety | Future prompt/system instructions must prohibit diagnosis, treatment, aggressive movement prescriptions, and guarantees and must recommend qualified help where appropriate | Future implementers and reviewers | `Documented design intent` | Safety terms draft; repository safety governance | The future requirements do not prove implementation by a provider, model, or later prompt path | Safety/medical-scope reviewer; future engineering owner | Approved future provider/prompt specification, implementation evidence, and human wording review | Yes if published or implemented | Pending |
| `docs/privacy-architecture.md` — `Optional Remote Model or Coach Sharing`, current status; `src/model-consent.ts` registry | Remote sharing | The production provider registry is empty and the current UI exposes no configured remote-send path | Reviewers and users | `Code/test-enforced fact` | Empty provider registry; remote panel; unit and smoke tests | Reconfirm registry and built candidate; absence is bounded to inspected/tested paths | Privacy reviewer; engineering owner | Frozen-candidate registry/build and network evidence | Yes | Pending |
| `docs/privacy-architecture.md` — `Optional Remote Model or Coach Sharing`, “Before any remote” requirements | Future provider review and consent | A future remote provider must document terms, data classes, destinations, retention, human review, and opt-in/revocation before implementation | Reviewers and implementers | `Documented design intent` | Privacy architecture and repository governance | Future provider facts, user flow, and enforcement do not yet exist | Privacy/legal/licensing reviewers; future engineering owner | Approved future provider/data/consent specification, implementation, and tests | No for current local candidate | Deferred / non-goal |
| `docs/models-licensing.md` — exact `@mediapipe/tasks-vision@0.10.35` entry, 2026-06-10 telemetry bullets, and “Do not claim tests prove all future SDK versions lack telemetry” | Exact-version provider telemetry assertion | Records an attributed statement that the then-current Web SDK lacked telemetry, that future aggregated telemetry was planned without a planned opt-out, and that outbound requests could be blocked | Reviewers and distributors | `Unresolved assumption` | MediaPipe issue #6306 response; pinned package/model records; candidate observed-network and blocked-network tests | The attributed response and tests do not alone establish exact `0.10.35` behavior in every environment or cover upgrades | Qualified privacy reviewer; engineering owner | Authenticate/version-scope the provider evidence, reconcile the generic current notice, inspect exact artifact/network evidence, and record a qualified privacy decision | Yes | Pending |
| `docs/licensing.md` — exact `@mediapipe/tasks-vision@0.10.35` paragraph and fresh-review requirement | Exact-version provider telemetry assertion | States that Google described the current Web SDK as lacking telemetry and requires fresh license/privacy/provider-metrics/network review for later versions | Reviewers and distributors | `Unresolved assumption` | MediaPipe issue #6306 response; lockfile and exact package record; candidate network tests; generic MediaPipe notice | Licensing text repeats a provider claim but does not itself establish telemetry absence, privacy approval, or future behavior | Qualified privacy and licensing reviewers; engineering owner | Reconcile exact-version provider/artifact/network evidence and record qualified privacy and licensing decisions for the named candidate | Yes | Pending |
| `docs/schemas/swing-metric-payload-v0.1.0.schema.json` — structural keywords (`required`, `additionalProperties`, enums, and conditional constraints) | Metric payload structure | Documents the closed version, metric/value/confidence vocabulary, required fields, and conditional structural constraints reflected by the TypeScript validator | Developers, integrators, and repository readers | `Code/test-enforced fact` | JSON Schema; `src/metric-contract.ts`; `test/unit/metric-contract.test.ts` fixture, vocabulary, confidence, field, and prohibited-key cases | The JSON Schema is documentation rather than the runtime validator; candidate alignment and exact enforcement scope must stay explicit | Engineering owner | Frozen schema/validator comparison and named unit evidence | Yes | Pending |
| `docs/schemas/swing-metric-payload-v0.1.0.schema.json` — top-level `description` and `$comment` | Public export, telemetry, and remote limitation wording | States that SS-008 does not approve metric calculation, storage, export, telemetry, remote sharing, or public schema serving, and limits prohibited-key rejection to exact case-sensitive names | Integrators and repository readers | `Qualified-human review required` | Exact schema prose; metric-contract source/tests; current export and remote-provider inventory | Structural validation does not itself prove the broader export, telemetry, remote-sharing, or public-serving limitations | Privacy/product/release reviewers; engineering owner | Public-wording decision plus candidate data-flow, export, telemetry, remote, and validator evidence | Yes | Pending |
| `src/app-renderer.ts` — “No feature will send it elsewhere without a separate, explicit opt-in step you initiate.” | Public runtime privacy absolute | The consent surface makes an absolute-sounding statement about every feature sending raw swing video | App users | `Qualified-human review required` | Current renderer source; privacy verifier; consent and no-network smoke paths, each bounded to configured source and tested environments | Does “No feature” overstate protection across browsers, hosts, future code, or manual user sharing? | Qualified privacy reviewer; engineering owner | Frozen-candidate source/data-flow trace, network evidence, and public-wording decision | Yes | Pending |
| `src/app-events.ts` — “No video data leaves this device.” | Public runtime privacy absolute | The local-analysis loading status makes an absolute device-boundary statement | App users | `Qualified-human review required` | Current event-handler source; privacy verifier; local-analysis and no-network smoke paths, each bounded to configured source and tested environments | Does “No video data” accurately describe all candidate requests, browser behavior, hosting, and user-controlled export/sharing paths? | Qualified privacy reviewer; engineering owner | Frozen-candidate network/data-flow evidence and public-wording decision | Yes | Pending |
| Historical `docs/ss-*` and `docs/handoffs/*` research, prompt, response, audit, source-packet, and handoff artifacts | Repository-public evidence | Historical evidence may repeat superseded or sensitive wording and is non-authoritative | Repository readers | `Unresolved assumption` | Tracked history and artifact manifests | Release owner must decide publication boundary and context labels for both historical namespaces | Release owner; legal/privacy/safety/trademark reviewers | Complete `docs/ss-*` and `docs/handoffs/*` manifests plus publication decision | Yes if public | Pending; excluded from normalization and uniqueness checks |
```

Bounded scan L102-115 VERBATIM
```markdown
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

```

Primary sources accessed 2026-08-08; each line retains issuer, full URL, question, inference limit:
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

## Verification

Node22 bounded scan and docs/safety/privacy/compliance verifiers recorded PASS.

## Known non-goals

No claim approval, SS-002 rewrite, human decision, PR, merge, or release.

## Output required

Fields: `STAGE_ID: 03`; `CANDIDATE_ID: 4e5dd4029da053ebb145b0a15416cbd5450b8fb1`; `VERDICT` exactly one of `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`; blockers; non-blockers; future; missing evidence; no-clearance. No restatement; <=350 words/3500 bytes. End `PR PREPARATION NOT PERMITTED`. Oversize: same-chat compact reissue preserving findings; save both, hash final only. Check absolutes/clearance, MediaPipe, publication review, schema/runtime/history/sources. Non-PASS blocks; changes reopen affected stages.
