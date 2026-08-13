# SS-020 Claude Audit 03 — Public Claims And Sources

## Role

Claims auditor; no implementation or clearance.

## Stage

03/05 after 01-REREVIEW and 02 PASS. Candidate
`e365204ecb763cf36f6663ac88e8f272744bf0fa`; mismatch is FAIL.

## Scope

AC1/AC3/AC4/AC5: public wording, privacy correction, provider limits, sources.

## Context

Exact 21-path candidate manifest for
`0509999e7de5e609787fe53e8bdac2747aa0be64...e365204ecb763cf36f6663ac88e8f272744bf0fa`:

```text
CONTEXT.md
CONTRIBUTING.md
README.md
docs/handoffs/ss-020-claude-audit-01-governance.md
docs/handoffs/ss-020-claude-audit-01-response.md
docs/handoffs/ss-020-claude-audit-02-inventory-coverage.md
docs/handoffs/ss-020-claude-audit-03-public-claims-sources.md
docs/handoffs/ss-020-claude-audit-04-verifier-tests.md
docs/handoffs/ss-020-claude-audit-05-final-synthesis.md
docs/handoffs/ss-020-claude-final-audit-prompt.md
docs/handoffs/ss-020-claude-final-audit-source-packet.md
docs/limitations.md
docs/privacy-architecture.md
docs/release-review-gate.md
docs/safety-terms.md
docs/ss-020-gemini-research-prompt.md
docs/ss-020-preimplementation-spec.md
docs/ss-020-research-disposition.md
docs/ss-020-research-notes.md
scripts/verify-docs-claims.js
test/unit/docs-claims.test.ts
```

## Acceptance criteria

Check exact strings/treatment, narrow privacy correction, and ten source limits.
Do not infer applicability, compliance, provider behavior, or clearance.

## Protected boundaries

Raw video is local by default; remote transfer needs explicit opt-in. No runtime,
provider, deployment, telemetry, observability, or human-approval change.

## Relevant exact source/excerpts

Short exact candidate excerpts:

```text
README.md — non-medical boundary:
Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance,
physical therapy, or a substitute for qualified medical care or professional
golf coaching.

README.md — local-first/remote opt-in boundary:
Raw swing video is not uploaded by default. Any future feature that sends raw
video, frame pixels, landmarks, metrics, prompts, reports, or model outputs
outside the browser must use a separate, explicit opt-in flow.

README.md — Non-Affiliation:
Swing Sync is an independent open-source project. It is not affiliated with,
endorsed by, sponsored by, or approved by any golf equipment maker, tour,
league, training organization, model provider, or platform vendor. Third-party
names, if referenced, belong to their respective owners.

docs/limitations.md — Privacy And Export Limits:
Derived landmarks, metrics, selected images, prompts, reports, and model outputs
may still be sensitive or identifying. Browser storage and downloaded files are
affected by browser, operating-system, device, and user settings. Swing Sync
cannot guarantee that browser data is retained, erased, kept private, or
protected outside the app's controls.

docs/privacy-architecture.md — Export Policy:
Exports must not be described as anonymous. Landmarks, metrics, images, and
feedback may still be sensitive or identifying.

docs/models-licensing.md — exact 0.10.35 limitation:
- SDK candidate: exact `@mediapipe/tasks-vision@0.10.35`.
- the current Web SDK does not include telemetry;
- future aggregated performance/usage telemetry is planned, without a planned
  opt-out, although outbound requests may be blocked;
Do not claim tests prove all future SDK versions lack telemetry.

src/app-renderer.ts:
No feature will send it elsewhere without a separate, explicit opt-in step you initiate.

src/app-events.ts:
No video data leaves this device.

docs/release-review-gate.md:
PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED
SS-002 qualified legal review of the assumption-of-risk and
release-of-liability language is not completed and blocks public release.
```

Runtime absolutes require human review and remain blocking/Pending. MediaPipe
claims remain unresolved/Pending and future remote rules remain design intent.

Exact factual-correction hunk from the candidate privacy diff:

```diff
diff --git a/docs/privacy-architecture.md b/docs/privacy-architecture.md
index a776bf6..958a7b1 100644
--- a/docs/privacy-architecture.md
+++ b/docs/privacy-architecture.md
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

Exact bounded result: `Current standard claim-scan result: PASS for the four
configured summaries.` It is not human or public-release clearance.

Primary-source register, accessed 2026-08-08; columns retain exact issuer,
direct URL, process question, and inference limit:

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

## Verification

Node 22 recorded: targeted `40/40`, total `244/244`; docs/safety/privacy/
compliance/build/diff-check PASS. The standard prohibited-claim scan covers only
README, CONTRIBUTING, limitations, and deployment; safety, privacy, and the gate
use separate structural/required-string/current-approval controls.

## Non-goals

No source applicability decision, provider guarantee, public-copy approval,
SS-002 rewrite, human sign-off, PR, merge, or release.

## Output

Return one <=2,500-byte block: `STAGE_ID: 03`, exact candidate, `VERDICT`
exactly `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`; `BLOCKERS`, `NON-BLOCKERS`,
`MISSING`, `FUTURE`, `NO-CLEARANCE`, `NEXT_STAGE`; end
`PR PREPARATION NOT PERMITTED`. `NEXT_STAGE: MAY PROCEED TO STAGE 04` requires
exact PASS, blockers none, and missing none; otherwise `NEXT_STAGE: STOP`.
Oversize requires same-chat compact reissue preserving findings. Identity or
manifest mismatch is FAIL.
