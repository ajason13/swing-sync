# SS-020 Claude Audit 02 — Inventory Coverage

## Role

Independent audit; no implementation or clearance.

## Stage

02/05. Candidate `4e5dd4029da053ebb145b0a15416cbd5450b8fb1`; branch `ss-020-release-review-gate`; no PR/sign-off; runtime/observability unchanged.

## Scope

AC1/AC2/AC5 inventory and review routing.

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

Humans decide release; research is not clearance.

## Acceptance criteria

Every row47-100 retains locator, claim, class, reviewer, blocking, disposition, supporting evidence, concern, and required evidence/decision.

## Protected boundaries

Raw video local; remote opt-in; no runtime/data/provider/deployment change.

## Relevant source contents or complete focused diffs

Publication matrix L116-135 VERBATIM
```markdown
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

```

Inventory grouped by source. Entry row:locator|claim|class|reviewer|blocking|disposition|support|concern|required. CF fact, DI intent, UA assumption, QH human, DG deferred. Exact reviewer roles: R1=Product/release owner; safety/medical-scope reviewer; R2=Qualified safety/medical-scope and legal reviewers; R3=Engineering owner; product/release owner; R4=Privacy reviewer; engineering owner; R5=Privacy/legal reviewer; future engineering owner; R6=Legal/privacy/safety reviewers; release owner; R7=Licensing reviewer; release owner; R8=Qualified trademark/legal reviewer; R9=Maintainer; legal/privacy/safety reviewers; R10=Qualified legal reviewer; R11=Qualified legal and safety reviewers; R12=Safety/medical-scope and legal reviewers; R13=Legal/privacy reviewer; engineering owner; R14=Safety/medical-scope reviewer; engineering owner; R15=Safety/medical-scope reviewer; future engineering owner; R16=Release owner; qualified reviewers; R17=Qualified privacy/legal reviewer; R18=Engineering owner; privacy reviewer; R19=Privacy reviewer; product owner; R20=Privacy/safety reviewer; engineering owner; R21=Privacy/legal/licensing reviewers; future engineering owner; R22=Qualified privacy reviewer; engineering owner; R23=Privacy/legal/product reviewers; R24=Product, safety/medical-scope, and evidence reviewers; R25=Accessibility reviewer; release owner; R26=Security/privacy reviewer; deployer; R27=Security reviewer; deployer; R28=Security/privacy reviewer; engineering owner; R29=Lead architect; release owner; R30=Licensing and qualified trademark/legal reviewers; R31=Qualified privacy and licensing reviewers; engineering owner; R32=Licensing/privacy reviewers; R33=Licensing/privacy reviewer; R34=Engineering owner; R35=Privacy/product/release reviewers; engineering owner; R36=Product, safety/medical-scope, trademark reviewers; R37=Legal/safety/privacy reviewers; engineering owner; R38=Evidence/product/safety reviewers; R39=Privacy/licensing reviewer; engineering owner; R40=Product/privacy/safety reviewers; R41=Privacy/safety/product reviewers; R42=Privacy/safety/legal reviewers; R43=Safety/medical-scope/privacy reviewers; R44=Release owner; legal/privacy/safety/trademark reviewers
```text
`README.md`
47:title and opening paragraph|Local-first browser app for…|QH|R1|Yes|Pending|S:README; current runtime workflow|Q:Does the overall purpose create an…|D:Named-scope intended-use and…
48:opening non-medical paragraph|Not medical advice, diagnosis,…|QH|R2|Yes|Pending|S:Safety draft; runtime…|Q:Is the disclaimer prominent and…|D:Intended-use, audience, and wording…
49:`Current Capabilities`|Local selection/inference, phases,…|CF|R3|Yes|Pending|S:src/app-renderer.ts;…|Q:Is the summary complete and…|D:Candidate build and named…
50:`Local-First Design`, current-behavior sentences|Raw video is not uploaded by default;…|CF|R4|Yes|Pending|S:Current runtime/export source;…|Q:Browser and environment evidence is…|D:Frozen-candidate data-flow…
51:`Local-First Design`, “Any future feature” sentence|Future outbound raw video, pixels,…|DI|R5|No for current local candidate|Deferred / non-goal|S:README; privacy architecture;…|Q:Future enforcement and provider/destinat…|D:Approved future spec, provider/data…
52:draft-review paragraph|Safety and privacy documents remain…|DI|R6|Yes|Pending|S:Safety/privacy draft banners;…|Q:Is draft status sufficiently visible…|D:Publication-surface review
53:`License`|Project source is Apache-2.0; other…|QH|R7|Yes|Pending|S:LICENSE; policy and audit…|Q:Are all candidate artifacts, notices,…|D:Candidate-specific license/notice…
54:`Non-Affiliation`|Independent project; no endorsement;…|QH|R8|Yes|Pending|S:Canonical README text; docs…|Q:Disclaimer is not trademark clearance;…|D:Preliminary search evidence and…
`CONTRIBUTING.md`
55:`Safety, Privacy, And Claims`|Educational/non-medical and…|DI|R9|Yes|Pending|S:Safety/privacy docs;…|Q:Do contributor gates cover every…|D:Workflow review and candidate diff
56:SS-002 pre-release sentence|SS-002 assumption-of-risk and…|QH|R10|Yes|Pending|S:Safety draft; SS-002 disposition|Q:Jurisdiction, enforceability, parties,…|D:Scoped written legal decision
`docs/safety-terms.md`
57:draft banner and opening|Review-ready product draft; not legal…|QH|R11|Yes|Pending|S:Draft banner; safety verifier|Q:Has a qualified reviewer assessed the…|D:Authenticated, scoped comments and…
58:`Intended Use`|Educational feedback; excludes…|QH|R12|Yes|Pending|S:Runtime acknowledgement;…|Q:Overall intended use and consumer…|D:Named intended-use and audience…
59:`Assumption of Risk Draft`|Describes voluntary practice risks and…|QH|R10|Yes|Pending|S:SS-002 disposition; runtime…|Q:Jurisdiction, enforceability,…|D:Exact-language legal disposition for…
60:`Release of Liability Draft`|Draft limitation/release language with…|QH|R10|Yes|Pending|S:SS-002 disposition|Q:Rights, waiver limits, entities,…|D:Exact-language legal disposition for…
61:`Consent Gate Requirement`|First analysis is blocked until local…|CF|R13|Yes|Pending|S:src/app-renderer.ts;…|Q:Legal meaning, conspicuousness,…|D:UX evidence, data evidence, and…
62:`Educational Feedback Boundary`; current `src/coaching-prompt.ts` and `src/coaching-contract.ts` enforcement|Current coaching contracts prohibit…|CF|R14|Yes|Pending|S:Current coaching prompt/contract…|Q:Current guardrails are defense in depth,…|D:Frozen-candidate guardrail evidence…
63:`AI Coach Prompt Constraints`, “Future AI coach prompts”|Future prompt/system instructions must…|DI|R15|Yes if published or implemented|Pending|S:Safety terms draft; repository…|Q:The future requirements do not prove…|D:Approved future provider/prompt…
64:`Review Checklist`|Legal/human approval boxes remain…|QH|R16|Yes|Pending|S:Current unchecked Markdown list|Q:Reviewer identity, evidence, and…|D:Completed scoped records through…
`docs/privacy-architecture.md`
65:draft banner and opening|Local-first engineering draft, not…|QH|R17|Yes|Pending|S:Draft banner; privacy verifier|Q:No qualified privacy decision is…|D:Candidate-specific privacy…
66:`Default Privacy Posture`|Local file selection, Pose Landmarker…|CF|R18|Yes|Pending|S:Runtime modules; privacy/unit/sm…|Q:Reconfirm against frozen candidate and…|D:Data-flow trace and candidate…
67:`Data Classes`|Classes raw video, frames, landmarks,…|DI|R4|Yes|Pending|S:Privacy doc; runtime data…|Q:Which classes actually exist, persist,…|D:Current data map plus export…
68:`Local-First Processing Flow`|Fail-closed local processing and…|DI|R4|Yes|Pending|S:Privacy verifier; network smoke…|Q:Future-oriented steps must not be…|D:Step-by-step current/future…
69:`Video Lifecycle` deletion bullets|Browser/device storage varies;…|QH|R19|Yes|Pending|S:Storage standard; acknowledgemen…|Q:SS-021 behavior is not implemented;…|D:Storage evidence, user-copy…
70:`Export Policy`|Local user-initiated exports may…|CF|R20|Yes|Pending|S:Swing Card generator/actions;…|Q:Exact artifact contents and…|D:Rendered artifacts and data-class…
71:`Optional Remote Model or Coach Sharing`, current status; `src/model-consent.ts` registry|The production provider registry is…|CF|R4|Yes|Pending|S:Empty provider registry; remote…|Q:Reconfirm registry and built candidate;…|D:Frozen-candidate registry/build and…
72:`Optional Remote Model or Coach Sharing`, “Before any remote” requirements|A future remote provider must document…|DI|R21|No for current local candidate|Deferred / non-goal|S:Privacy architecture and…|Q:Future provider facts, user flow, and…|D:Approved future provider/data/consen…
73:MediaPipe gate and observability paragraph|Pinned 0.10.35, version-specific…|UA|R22|Yes|Pending|S:Provider issue; generic notice;…|Q:Generic current notice and exact-version…|D:Exact artifact/network evidence and…
74:`User-Facing Copy Drafts`|Local processing, export, remote…|QH|R23|Yes|Pending|S:Draft only; runtime differs by…|Q:Which drafts should publish, and when?|D:Copy-to-runtime mapping and wording…
`docs/limitations.md`
75:pose/metric, camera, educational, and fixture sections|Results are estimates; tests/fixtures…|QH|R24|Yes|Pending|S:Algorithms, fixtures, unit/smoke…|Q:SS-022 validation is pending; prominence…|D:Validation plan/results and claim…
76:privacy/export and remote sections|Exported data can be sensitive;…|CF|R4|Yes|Pending|S:Runtime exports; registry;…|Q:Claims remain environment-bounded and…|D:Candidate-specific browser/export…
77:document-level accessibility omission; SS-019 evidence|The current limitations page has no…|UA|R25|Conditional|Pending|S:SS-019 tests and manual QA…|Q:Whether public limitations need explicit…|D:Candidate manual/automated evidence…
`docs/deployment.md`
78:draft banner, current posture, and no-backend implications|Static frontend/no app backend; no…|CF|R26|Yes|Pending|S:Source tree; deployment verifier|Q:Chosen host and candidate configuration…|D:Frozen host/build configuration and…
79:`Security Headers`|Meta CSP is limited; production…|DI|R27|Yes|Pending|S:index.html; CSP standard; docs…|Q:Actual host headers and policy…|D:Response-header capture and host…
80:logging/telemetry and service-worker statements|No app-owned server logging/telemetry;…|CF|R28|Yes|Pending|S:Source/verifiers; public/sw.js|Q:Host, third-party, and future-build…|D:Candidate network/service-worker…
81:`Backend Architecture Review Gates`|Backend, remote, storage, provider,…|DI|R29|No for current static candidate|Deferred / non-goal|S:Repository governance|Q:Trigger ownership and future enforcement|D:Future approved spec and audit
`docs/licensing.md`
82:dependency/reference/provider policy and trademark paragraph|Engineering review rules apply; a…|QH|R30|Yes|Pending|S:Dependency audit; policy;…|Q:Audit and search do not establish…|D:Candidate bill of materials,…
84:exact `@mediapipe/tasks-vision@0.10.35` paragraph and fresh-review requirement|States that Google described the…|UA|R31|Yes|Pending|S:MediaPipe issue #6306 response;…|Q:Licensing text repeats a provider claim…|D:Reconcile exact-version…
`docs/models-licensing.md`
83:exact `@mediapipe/tasks-vision@0.10.35` entry, 2026-06-10 telemetry bullets, and “Do not claim tests prove all future SDK versions lack telemetry”|Records an attributed statement that…|UA|R22|Yes|Pending|S:MediaPipe issue #6306 response;…|Q:The attributed response and tests do not…|D:Authenticate/version-scope the…
`docs/models-licensing.md`, `docs/model-assets/*`, and provider records
85:`docs/models-licensing.md`, `docs/model-assets/*`, and provider records|Exact local model/provider decisions…|QH|R32|Yes|Pending|S:Model asset record; checksums;…|Q:Upgrade, redistribution, terms, and…|D:Exact-version artifact and terms…
`docs/fixture-policy.md` and fixture records
86:`docs/fixture-policy.md` and fixture records|Only approved, documented test…|CF|R33|Conditional|Pending|S:Fixture verifier; provenance…|Q:Publication scope and rights/privacy…|D:Candidate fixture manifest and…
`LICENSE`, `NOTICE`, and `THIRD_PARTY_NOTICES.md`
87:`LICENSE`, `NOTICE`, and `THIRD_PARTY_NOTICES.md`|Project and third-party license/notice…|QH|R7|Yes|Pending|S:License audit and notice files|Q:Completeness, attribution, versions, and…|D:Candidate artifact/license/notice…
`docs/schemas/swing-metric-payload-v0.1.0.schema.json`
88:structural keywords (`required`, `additionalProperties`, enums, and conditional constraints)|Documents the closed version,…|CF|R34|Yes|Pending|S:JSON Schema; src/metric-contract…|Q:The JSON Schema is documentation rather…|D:Frozen schema/validator comparison…
89:top-level `description` and `$comment`|States that SS-008 does not approve…|QH|R35|Yes|Pending|S:Exact schema prose; metric-contr…|Q:Structural validation does not itself…|D:Public-wording decision plus…
`index.html`
90:description/title; `public/manifest.webmanifest` — name fields; `package.json` — description|Local-first analysis scaffold, Swing…|QH|R36|Yes|Pending|S:Exact metadata files|Q:Metadata may imply broader AI/coaching…|D:Separate metadata/net-impression…
`src/app-renderer.ts`
91:safety acknowledgement and workflow status strings|Educational/risk acknowledgement…|CF|R37|Yes|Pending|S:App renderer, consent state,…|Q:Conspicuousness, legal meaning,…|D:Candidate UX capture and behavior…
92:“No feature will send it elsewhere without a separate, explicit opt-in step you initiate.”|The consent surface makes an…|QH|R22|Yes|Pending|S:Current renderer source; privacy…|Q:Does “No feature” overstate protection…|D:Frozen-candidate source/data-flow…
97:Swing Card export controls and warnings|Download PNG, Print / Save as PDF, and…|CF|R41|Yes|Pending|S:Swing Card actions/generator;…|Q:Actual output, warning prominence, and…|D:Candidate artifacts and browser…
`src/app-events.ts`
93:“No video data leaves this device.”|The local-analysis loading status…|QH|R22|Yes|Pending|S:Current event-handler source;…|Q:Does “No video data” accurately describe…|D:Frozen-candidate network/data-flow…
`src/phase-review-renderer.ts`
94:review warning and confirmation UI|Eight samples may miss events; impact…|CF|R38|Yes|Pending|S:Renderer and unit/smoke tests|Q:Accuracy evidence and user…|D:SS-022 evidence and UI review
`src/remote-model-renderer.ts`
95:“Remote model review unavailable”|Remote review is unavailable until a…|CF|R39|Yes|Pending|S:Empty registry; renderer and…|Q:Must remain consistent with candidate…|D:Registry/configuration evidence
Runtime error/status copy in `src/app-renderer.ts` and analysis lifecycle modules
96:Runtime error/status copy in `src/app-renderer.ts` and analysis lifecycle modules|Local model/loading/processing…|CF|R40|Conditional|Pending|S:Unit/smoke tests; privacy/safety…|Q:Clarity, completeness, and no sensitive…|D:Error-path evidence and copy review
`src/swing-card-generator.ts`
98:PNG/print/prompt content|Selected keyframes, metrics, warnings,…|CF|R42|Yes|Pending|S:Generator tests and smoke tests|Q:Export can be identifying and leaves app…|D:Rendered samples and data-class…
`src/coaching-prompt.ts` and `src/coaching-contract.ts`
99:`src/coaching-prompt.ts` and `src/coaching-contract.ts`|Evidence-bounded JSON, unavailable/rev…|CF|R43|Yes|Pending|S:Coaching tests and safety…|Q:External model behavior is not…|D:Contract tests, sample outputs, and…
Historical `docs/ss-*` and `docs/handoffs/*` research, prompt, response, audit, source-packet, and handoff artifacts
100:Historical `docs/ss-*` and `docs/handoffs/*` research, prompt, response, audit, source-packet, and handoff artifacts|Historical evidence may repeat…|UA|R44|Yes if public|Pending; excluded from normalization and uniqueness checks|S:Tracked history and artifact…|Q:Release owner must decide publication…|D:Complete docs/ss-* and…
```

Exact SS-002 row detail is Stage01; exact other high-risk detail is Stage03.

## Verification

Rows47-100 once; canonical reviewers.

## Known non-goals

No approval, verifier audit, PR, merge, release.

## Output required

Fields: `STAGE_ID: 02`; `CANDIDATE_ID: 4e5dd4029da053ebb145b0a15416cbd5450b8fb1`; `VERDICT` exactly one of `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`; blockers; non-blockers; future; missing evidence; no-clearance. No restatement; <=350 words/3500 bytes. End `PR PREPARATION NOT PERMITTED`. Oversize: same-chat compact reissue preserving findings; save both, hash final only. Check all fields; especially reviewer roles rows64/75/94. Non-PASS blocks; changes reopen affected.
