# SS-018 Claude QA Planning Prompt

Superseded for paste use by
`docs/ss-018-claude-qa-rereview-prompt.md` after Claude Round 1 returned FAIL
with B1-B6. Keep this file as the original QA planning record.

Paste this prompt into Claude for preimplementation QA planning. Claude Chat
does not have repository, filesystem, GitHub, or Notion access, so this prompt
is self-contained.

```text
Role: You are the lead adversarial QA planner for Swing Sync, a local-first
browser app for educational golf swing review.

Stage: Pre-implementation QA planning.

Scope: Review the SS-018 candidate refactor plan before any runtime app-shell
refactor is implemented. Your job is to find blockers, behavior-preservation
risks, missing test contracts, protected-boundary gaps, and fail-open
verification requirements.

Context:
Swing Sync is a local-first Vite/TypeScript browser app. The current app runs
local video selection, local Pose Landmarker inference on sampled frames,
phase review, selected keyframe overlay review, and local Swing Card export.
Raw swing video is not uploaded by default. Remote model review is unavailable
because the production reviewed-provider registry is empty. Manual Swing Card
export and Copy prompt do not require provider configuration. There is no app
backend, account system, telemetry, analytics, remote logging, cloud storage,
or configured remote model provider in the current app.

SS-018 intent:
Reduce `src/main.ts` orchestration pressure before the next UI feature wave.
Keep behavior unchanged while separating workflow rendering, state
transitions, export controls, consent handling, and analysis lifecycle into
clearer modules.

Acceptance criteria:
- Split the current app shell into focused modules without changing
  user-facing behavior.
- Keep consent gating, local video selection, local pose processing, phase
  review, Swing Card export, and remote-review-unavailable behavior intact.
- Preserve existing accessibility labels and test selectors used by smoke
  tests.
- Add or adjust unit tests around extracted state/renderer behavior where
  useful.
- No new framework or dependency unless separately reviewed and approved.

Protected boundaries:
- Do not change runtime privacy posture, raw-media handling, remote sharing,
  provider/model registry behavior, service-worker behavior, or exported data
  classes.
- Do not add telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts.
- Preserve local-first privacy architecture, safety terms, licensing, and
  model-licensing boundaries.

Relevant current source contents:

File: `src/main.ts` responsibility summary
```
Current file length: 869 lines.

Top-level state:
- consent storage key `swing-sync:safety-consent:v1`
- `consentStorageFailed`
- `activeStep`
- `selectedVideo`
- `frameController`
- `abortFrameController`
- `processingState`
- `poseStatusCode`
- extracted/total frame counts
- latest landmark count
- phase outputs/declarations/review state/draft/confirmation
- selected keyframe index
- latest overlay result
- Swing Card busy/status

Current functions:
- `hasSafetyConsent`
- `setSafetyConsent`
- `escapeHtml`
- `renderWorkflowPanel`
- `renderPhaseReview`
- `renderSwingCardExport`
- `renderRemoteModelReviewPanel`
- `renderKeyframeOverlayReview`
- `renderDeclarationSelect`
- `formatRemoteDataClass`
- `renderApp`
- `bindInteractions`
- `handleProcessingState`
- `handleProcessingProgress`
- `handleProcessingOutput`
- `updateProcessingUi`
- `startFrameAnalysis`
- `stopFrameAnalysis`
- `closeFrameAnalysis`
- `rebuildPhaseReview`
- `clearPhaseReview`
- `renderSelectedKeyframeCanvas`
- `undeclaredPhaseDeclarations`
- `downloadSwingCard`
- `printSwingCard`
- `copySwingCardPrompt`
- `prepareSwingCardContent`
- `getCompleteSwingCardAssignments`
- `renderAnnotatedKeyframe`
- `formatSwingCardWarning`

Global listeners:
- initial `renderApp()`
- `beforeunload` closes frame analysis
- `securitypolicyviolation` aborts active loading/processing with
  `UNEXPECTED_NETWORK_BLOCKED`
- production-only service worker registration for `/sw.js`
```

File: `src/workflow.ts`
```
export const workflowSteps = [
  {
    id: "capture",
    shortLabel: "Capture",
    label: "Capture or upload",
    status: "Ready for consent",
    description: "Choose how a future local analysis session will begin."
  },
  {
    id: "processing",
    shortLabel: "Process",
    label: "Processing",
    status: "Local only",
    description: "Load the approved local pose model and process selected video frames."
  },
  {
    id: "review",
    shortLabel: "Review",
    label: "Review",
    status: "No results",
    description: "Preview the stable layout for future swing feedback and metrics."
  },
  {
    id: "export",
    shortLabel: "Export",
    label: "Export",
    status: "Local download",
    description: "Download a local Swing Card or open the browser print dialog."
  }
] as const;

export type WorkflowStepId = (typeof workflowSteps)[number]["id"];

export function getWorkflowStep(id: WorkflowStepId) {
  return workflowSteps.find((step) => step.id === id) ?? workflowSteps[0];
}

export function getNextWorkflowStep(id: WorkflowStepId) {
  const currentIndex = workflowSteps.findIndex((step) => step.id === id);
  return workflowSteps[Math.min(currentIndex + 1, workflowSteps.length - 1)];
}
```

Protected smoke-test labels and selectors:
```
Headings:
- Capture or choose your swing
- Capture or upload
- Processing
- Review
- Export
- Downloadable summary
- Remote model review unavailable

Controls:
- Use camera
- Choose a video
- Begin analysis
- Stop local analysis
- Retry local analysis
- Review phase labels
- Confirm phase review
- Open Swing Card export
- Download PNG
- Print / Save as PDF
- Copy prompt
- Remote review unavailable

Selectors:
- #video-file
- #analysis-button
- [data-pose-summary]
- [data-keyframe-canvas]
- [data-overlay-status]
- [data-keyframe-index]
- [data-phase-index]
- [data-confirm-phase-review]
- [data-open-export]
- [data-download-swing-card]
- [data-print-swing-card]
- [data-copy-swing-card-prompt]
- [data-swing-card-status]
- [data-swing-card-print-host]
- [data-remote-model-send]

Accessible labels:
- Local video source
- Local pose processing
- Selected local video
- Swing phase assignments
- View
- Handedness
- Horizontally mirrored
- Swing Card contents
- Swing Card warnings
- Remote model data disclosure
- Select keyframe
```

Current smoke coverage summary:
```
test/smoke/app.spec.ts verifies:
- opening capture flow and analysis disabled until consent and selected video;
- local consent storage unavailable and removal-failure paths fail closed;
- runtime consent guard focuses acknowledgement when disabled state is bypassed;
- placeholder states for processing, review, and export;
- local worker processing extracts 8 of 8 fixture frames and avoids external
  network requests, sensitive console output, IndexedDB, and Cache storage;
- accessible phase review, keyframe canvas labels, overlay status, and valid
  nondecreasing phase correction;
- Swing Card PNG download, print, prompt copy success and failure states;
- remote model review remains unavailable with empty reviewed-provider
  registry and expected outbound/blocked data class text;
- Swing Card keyframes remain unavailable until phase review is complete;
- pose model initialization failure, retry, cancel, and unexpected-network
  failure behavior;
- mobile layout keeps key controls visible and non-overlapping.
```

File: `docs/privacy-architecture.md` boundary excerpt
```
Swing Sync must process swing video locally by default. Raw swing video and
frame pixels must not be uploaded, sent to model providers, or shared with
remote services unless a future feature adds a separate, explicit opt-in flow
for that action.

The current application implements local file selection and local Pose
Landmarker inference for sampled video frames. It does not implement camera
capture, raw-video or landmark persistence, exports, remote sharing, or remote
model APIs. The current consent acknowledgement is a local scaffold, not a
durable legal or privacy record.
```

File: `docs/safety-terms.md` consent boundary excerpt
```
Before the first swing analysis, the app must block analysis until the user has
explicitly acknowledged all of the following:

- Swing Sync is for educational use only.
- Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance, or
  professional athletic instruction.
- Golf practice and movement changes involve risk, and the user accepts
  responsibility for deciding whether and how to practice.
- The user should stop if they feel pain or concerning symptoms and seek
  qualified help when appropriate.
- Raw swing video stays on the device by default unless the user separately
  opts in to a feature that sends it elsewhere.

The consent gate should store only the minimum local acknowledgement state
needed to avoid repeated prompts. It should not upload consent records or raw
video by default.
```

Candidate module plan:
- Keep `src/main.ts` as thin bootstrap for styles, app creation, initial render,
  global listeners, and production service-worker registration.
- Add `src/app-state.ts` for app state shape, initial state, and reset helpers.
- Add `src/consent-state.ts` for local acknowledgement storage and fail-closed
  behavior.
- Add `src/app-renderer.ts` for top-level shell rendering and workflow panel
  dispatch.
- Add `src/phase-review-renderer.ts` for phase review, declaration controls,
  and keyframe review HTML.
- Add `src/swing-card-actions.ts` for Swing Card preparation and local export
  actions.
- Add `src/analysis-lifecycle.ts` for frame-processing lifecycle state
  handlers around `FrameProcessingController`.
- Optionally add `src/app-events.ts` if event binding remains large after
  renderer and lifecycle extraction.

Candidate unit-test plan:
- Add `test/unit/consent-state.test.ts` for accepted, missing, get failure,
  set failure, and remove failure paths.
- Add `test/unit/app-state.test.ts` for initial defaults and phase/export reset
  behavior.
- Add `test/unit/app-renderer.test.ts` or focused renderer tests for protected
  selectors and labels across capture, processing, review, export, and
  remote-review-disabled branches.
- Continue relying on `test/smoke/app.spec.ts` for browser behavior,
  local-processing, no-network, storage, canvas, export, mobile, and
  accessibility checks.

Required final verification after implementation:
- targeted unit tests for extracted logic;
- `npm run test:smoke`;
- `npm run build`;
- `npm run compliance:verify`;
- `npm run safety:verify`;
- `npm run privacy:verify`;
- `git diff --check`.

No dependency, bundle, license-policy, notice, or SBOM changes are expected. If
that changes, the implementation must also run `npm run license:audit`,
`npm run verify:bundle-license-fixture`, and `npm run sbom:generate`.

Known non-goals:
- No framework migration or new dependency.
- No design refresh, copy rewrite, or new user-facing workflow.
- No backend, auth, accounts, secrets, telemetry, analytics, remote logging,
  cloud diagnostics, cloud storage, provider SDK, model provider, remote model
  review enablement, or remote sharing.
- No service-worker behavior change.
- No exported data class change.
- No additional console output, hidden identifiers, or persistent debug
  artifacts.

Observability decision:
Runtime observability remains intentionally unchanged. Existing local UI status
text and sanitized stable error codes remain the only diagnostics in scope.

Output required:
- PASS/FAIL verdict.
- Blockers ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Any behavior-preservation risks in the proposed module boundaries.
- Any protected-boundary risks around privacy, safety, remote sharing,
  provider registry, service worker, exported data classes, dependencies, or
  observability.
- Explicit sign-off status for whether implementation may begin.
```
