# SS-015 Claude QA Planning Re-Review Prompt

Paste everything between START and END into Claude Chat for focused
preimplementation QA planning re-review.

## START

Role: You are the independent adversarial QA planner for Swing Sync.

Stage: Focused preimplementation QA planning re-review for SS-015 after your
prior FAIL.

Scope: Re-review only prior blockers B1-B7 plus any new blocker introduced by
the revised spec. This is still a planning gate. No SS-015 browser/CI
implementation has started.

Context:
Swing Sync is a local-first browser app for educational golf swing analysis.
Codex is acting as the SS-015 research/spec owner under the 2026-06-26
LLM-team routing update. Claude remains the independent QA planning and final
audit reviewer. Assume you cannot read the repository or GitHub; all relevant
source context for this focused re-review is included below.

Acceptance criteria:
- Test upload/capture placeholder, processing, review, Swing Card export,
  consent gate, and mobile layout.
- Include no-network privacy regression where feasible.
- Capture artifacts for failed runs.
- Tests run in CI.

Protected boundaries:
- Raw swing video and frame pixels must not be uploaded, sent to model
  providers, or shared with remote services unless a future separately reviewed
  feature adds explicit opt-in.
- Derived landmarks, metrics, prompts, reports, and selected images may still
  be sensitive.
- Do not make absolute privacy, deletion, anonymity, legal, compliance, safety,
  medical, injury-prevention, professional coaching, or guaranteed correctness
  claims.
- Do not add remote sharing, telemetry, remote logging, hosted analytics, cloud
  storage, new workers, SDK/provider/model assets, new dependencies, camera
  capture behavior, or raw personal video fixtures for SS-015.
- The approved browser fixture
  `test/fixtures/pose-landmarker/mannequin-golf-address.webm` is approved only
  for deterministic local pose-extraction integration, not golf-swing accuracy,
  phase accuracy, coaching correctness, or performance claims.

Prior findings and Codex responses:
- B1 no-network regression can fail open because hooks attach after
  `beforeEach` navigation. Response: revised spec requires context-level
  route/listener hooks before any `page.goto` or reload and forbids "from
  navigation start" claims when hooks are attached late.
- B2 capture placeholder has zero test coverage. Response: revised spec
  requires visible capture placeholder copy and negative `getUserMedia` or
  camera-permission coverage.
- B3 CI gating language is optional. Response: revised spec requires blocking
  CI, explicit Playwright Chromium/browser installation, no soft-fail patterns,
  and failure-only artifact upload with fixed short retention.
- B4 console-leak assertions are incomplete and hidden IDs are untested.
  Response: revised spec requires a shared sensitive-output denylist reused for
  console and clipboard checks, including hidden IDs and
  `observedSeekTimestampMs`.
- B5 canvas nonblank rendering is unverified. Response: revised spec requires
  pixel-content sampling, not only dimensions or status text.
- B6 mobile overlap/truncation coverage is missing. Response: revised spec
  requires bounding-box overlap and text clipping checks.
- B7 Copy prompt is not functionally tested and its content minimization is not
  verifiable without source. Response: revised spec requires clipboard
  functional testing and sensitive-output denylist checks, and this prompt
  includes exact relevant source excerpts for prompt generation.

Relevant source contents or focused diff:

File: `docs/ss-015-preimplementation-spec.md`

```markdown
# SS-015 Preimplementation Spec

Status: revised candidate spec for focused Claude QA planning re-review

## Task

`SS-015 Add browser regression tests for MVP flow`

Branch: `ss-015-browser-tests`

Acceptance criteria:

- Test upload/capture placeholder, processing, review, Swing Card export,
  consent gate, and mobile layout.
- Include no-network privacy regression where feasible.
- Capture artifacts for failed runs.
- Tests run in CI.

## Sensitivity Classification

SS-015 is privacy-, browser-automation-, CI-, export-, and user-facing-copy
sensitive. It touches tests around raw video handling, local inference, Swing
Card export, and consent gates. It is not expected to add safety/legal copy,
model/provider assets, dependencies, telemetry, remote sharing, or runtime
network behavior.

## Accepted Scope

- Add or refactor Playwright browser tests under `test/smoke`.
- Add helper functions only where they make the test contract clearer and keep
  failure output readable.
- Update `playwright.config.ts` only for artifact policy, CI reliability, or
  project configuration needed by the accepted browser suite.
- Update `.github/workflows/compliance.yml` or an equivalent workflow so CI runs
  the browser suite as a blocking check using Node 22 after dependencies and
  Playwright browser binaries are explicitly installed.
- Upload browser-test artifacts in CI, scoped to Playwright output such as
  `test-results` and reports. Upload artifacts only on failure with a fixed
  short retention period. Do not upload raw personal user media.

## Out of Scope

- Implementing camera capture.
- Adding remote sharing, telemetry, remote logging, hosted analytics, cloud
  storage, model APIs, new provider SDKs, model assets, new workers, or new
  dependencies.
- Changing product claims about privacy, safety, deletion, anonymity, legal
  compliance, coaching correctness, medical use, or injury prevention.
- Adding new raw personal video fixtures or unapproved third-party media.
- Making runtime network enforcement changes beyond test-only observation or
  request blocking.

## Required Browser Test Contracts

1. Consent gate
   - Analysis remains disabled before explicit acknowledgement.
   - Acknowledgement alone is insufficient without a selected local video.
   - Runtime guard remains fail-closed if the button is force-enabled.
   - Storage failure paths keep analysis blocked.

2. Upload and capture placeholder
   - Local file selection with the approved fixture enables analysis after
     consent.
   - The camera/capture placeholder is visible and reports that camera capture
     remains out of scope.
   - The test must not request camera permission or implement camera capture.
   - A negative assertion must fail if the test or app path calls
     `navigator.mediaDevices.getUserMedia` or otherwise requests camera
     permission during placeholder coverage.

3. Processing
   - Local analysis enters processing, exposes local progress, and completes
     against the approved fixture.
   - Retry/cancel surfaces that already exist remain covered where practical.
   - Console output must be checked with a shared sensitive-output denylist that
     includes raw landmarks, `worldLandmarks`, media characteristics, filenames,
     object URLs, metric payloads, timestamps, hidden IDs, and the
     forward-carried `observedSeekTimestampMs` field.
   - The same denylist must be reused for relevant console and clipboard
     content checks so enumerated protected terms do not drift between stages.

4. Review
   - Review flow exposes explicit phase-review controls.
   - Invalid nondecreasing corrections remain blocked.
   - Valid review confirmation unlocks future metric readiness and keeps
     warning/limitation language scoped.
   - Keyframe overlay canvas renders nonblank and exposes stable accessible
     labels without leaking unnecessary metadata.
   - Nonblank rendering must be proven with pixel-content sampling, not only
     nonzero canvas dimensions or status text.

5. Swing Card export
   - Export remains unavailable or warning-scoped until phase review is
     complete.
   - After valid review, Download PNG, Print / Save as PDF, and Copy prompt
     controls are present and usable.
   - Download filename remains stable and data-minimized.
   - Copy prompt must be clicked in a browser test. The test must stub or grant
     clipboard behavior as needed, verify that a clipboard write is attempted,
     verify success or unavailable status text, and assert copied text excludes
     the shared sensitive-output denylist terms.
   - Copied prompt text may contain approved safety/privacy limitation copy and
     bounded unavailable metric summaries. It must not contain filenames, raw
     video references, object URLs, requested/observed seek timestamps, raw
     landmarks, world landmarks, metric payload JSON, hidden IDs, or personal
     identifiers.
   - Raw swing video is not included in Swing Card export tests.

6. Mobile layout
   - Pixel-size mobile viewport has no horizontal document overflow.
   - Key buttons/controls meet at least 44 px touch target height where already
     expected.
   - Main workflow surfaces do not overlap or truncate critical text.
   - Mobile layout tests must include bounding-box overlap checks for adjacent
     critical controls and clipping checks for critical labels/status text, such
     as `scrollHeight <= clientHeight` and `scrollWidth <= clientWidth` on
     selected non-wrapping controls.

7. No-network privacy regression
   - Route or observe requests from navigation start. Install route/listener
     hooks at the browser context level before any `page.goto` or reload used
     by the test. Do not claim "from navigation start" for any test whose
     network hook is attached after the first navigation.
   - Allow only same-origin `http://127.0.0.1:4174/` preview requests and
     `blob:` URLs.
   - Unexpected external requests fail the test.
   - Assert no IndexedDB or Cache Storage entries are created by the MVP flow.
   - This test is evidence of the current local-first behavior, not a guarantee
     about all future SDK versions or browser behavior.

8. CI and artifacts
   - CI runs `npm run test:smoke` or an equivalent Playwright command.
   - CI explicitly installs Playwright Chromium/browser dependencies before the
     browser suite.
   - Browser tests are a blocking CI check: no `continue-on-error`, no `|| true`
     soft-fail patterns, and no detached non-gating browser-test job.
   - Failed runs retain Playwright artifacts by uploading `test-results` or an
     equivalent Playwright output directory with `if: failure()` and a fixed
     short retention period such as seven days.
   - CI must continue to run existing compliance steps.
   - If the browser suite runs in a separate job, the job must still be required
     for merge readiness and must not replace the existing compliance job.

## Network Enforcement Clarification

The `UNEXPECTED_NETWORK_BLOCKED` path is pre-existing runtime behavior in
`src/main.ts`: a `securitypolicyviolation` listener aborts active loading or
processing sessions with that sanitized status code. SS-015 may test that
pre-existing behavior but must not introduce new runtime network enforcement.

## Verification Plan

Before PR:

- `npm run test:smoke`
- `npm run build`
- `npm run compliance:verify`
- `npm run privacy:verify`
- `git diff --check`

If dependencies, fixture policy, model/provider assets, or license-sensitive
surfaces change unexpectedly, also run:

- `npm run license:audit`
- `npm run verify:bundle-license-fixture`
- `npm run sbom:generate`

## Observability Decision

Runtime observability is intentionally unchanged. SS-015 should add only local
test diagnostics and CI artifacts for failed browser runs. It must not add
telemetry, remote logging, hosted reporting, production debug endpoints, or
storage of user media.
```

File: `src/main.ts` relevant excerpts

```ts
document.querySelector<HTMLButtonElement>("[data-copy-swing-card-prompt]")?.addEventListener("click", () => {
  void copySwingCardPrompt();
});

async function copySwingCardPrompt(): Promise<void> {
  if (swingCardBusy) return;
  swingCardBusy = true;
  swingCardStatus = "Preparing prompt text.";
  renderApp();
  const prepared = await prepareSwingCardContent();
  try {
    await navigator.clipboard.writeText(prepared.content.analysisPrompt);
    swingCardStatus = "Prompt copied for manual use.";
  } catch {
    swingCardStatus = "Prompt copy unavailable in this browser.";
  } finally {
    prepared.release();
    swingCardBusy = false;
    renderApp();
  }
}

async function prepareSwingCardContent(): Promise<{ content: SwingCardContent; release(): void }> {
  const createdBitmaps: ImageBitmap[] = [];
  const keyframes: SwingCardKeyframe[] = [];
  const assignments = getCompleteSwingCardAssignments();

  for (const phase of phaseDefinitions) {
    const assignment = assignments?.find((item) => item.phaseId === phase.id);
    const output = assignment ? phaseOutputs[assignment.sampleIndex] : undefined;
    const rendered = output ? await renderAnnotatedKeyframe(output) : undefined;
    if (rendered?.preview) createdBitmaps.push(rendered.preview);
    keyframes.push({
      phaseId: phase.id,
      phaseLabel: phase.label,
      preview: rendered?.preview,
      overlay: rendered?.overlay
    });
  }

  const warnings = deriveSwingCardContentWarnings({
    keyframes,
    metricPayload: undefined,
    phaseReviewConfirmed: (phaseReviewState?.readyForFutureMetrics ?? false) && !!assignments
  });
  const base: SwingCardContent = {
    keyframes,
    metricPayload: undefined,
    warnings,
    analysisPrompt: ""
  };
  const content = { ...base, analysisPrompt: buildSwingCardPrompt(base) };
  return {
    content,
    release: () => {
      for (const bitmap of createdBitmaps) bitmap.close();
    }
  };
}

document.addEventListener("securitypolicyviolation", () => {
  if (["loading", "processing"].includes(processingState)) {
    abortFrameController?.("UNEXPECTED_NETWORK_BLOCKED");
  }
});
```

File: `src/swing-card-generator.ts` relevant excerpt

```ts
export function buildSwingCardPrompt(content: SwingCardContent): string {
  const metrics = formatMetricsForPrompt(content.metricPayload);
  const warnings = content.warnings.map(labelContentWarning).join(", ") || "No card warnings.";
  return [
    "Act as an educational golf movement assistant. I may manually upload a Swing Sync Card that contains selected annotated keyframe stills, bounded local metric summaries, and warnings or limitations from my swing review.",
    "",
    "Use only the evidence shown in the card. If a metric or keyframe is marked unavailable, review-required, low-evidence, or limited, do not guess or fill in missing values.",
    "",
    "Provide general educational observations by swing phase. Do not provide medical advice, pain or injury diagnosis, rehabilitation guidance, aggressive movement prescriptions, guaranteed injury prevention, guaranteed performance improvement, or a replacement for a qualified golf coach or qualified medical professional.",
    "",
    "Do not claim the card is anonymous or that uploading it to another service is private. After I upload or share the downloaded file, that service's terms and privacy practices apply.",
    "",
    `Card warnings: ${warnings}`,
    "Metric summary:",
    metrics
  ].join("\n");
}

function formatMetricsForPrompt(metricPayload: SwingMetricPayload | undefined): string {
  return formatMetricLines(metricPayload).join("\n");
}

function formatMetricLines(metricPayload: SwingMetricPayload | undefined): readonly string[] {
  if (!metricPayload || metricPayload.metrics.length === 0) {
    return metricNames.map((name) => `${name}: unavailable`);
  }
  return metricPayload.metrics.map(formatMetric);
}
```

File: `test/smoke/app.spec.ts` relevant excerpts showing current gaps that the
revised spec is intended to fix during implementation

```ts
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("opens to capture flow and keeps analysis fail closed until consent and video", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Capture or choose your swing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();

  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(beginAnalysis).toBeDisabled();
  await page.getByRole("checkbox").check();
  await expect(beginAnalysis).toBeDisabled();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await expect(beginAnalysis).toBeEnabled();
});

test("loads locally in a worker and extracts complete fixture landmarks", async ({ page }) => {
  const requests: string[] = [];
  const consoleMessages: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  page.on("console", (message) => consoleMessages.push(message.text()));

  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.getByRole("button", { name: "Stop local analysis" })).toBeEnabled();
  await expect(page.locator("[data-pose-summary]")).toContainText(
    "33 normalized landmarks retained",
    { timeout: 30_000 }
  );
  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", {
    timeout: 30_000
  });

  const requestsAtReady = requests.length;
  await page.waitForTimeout(500);
  expect(requests).toHaveLength(requestsAtReady);
  const external = requests.filter(
    (url) => !url.startsWith("http://127.0.0.1:4174/") && !url.startsWith("blob:")
  );
  expect(external).toEqual([]);
  expect(consoleMessages.join("\n")).not.toMatch(/landmarks|worldLandmarks|media characteristics/i);
});

test("completes local inference when external network is blocked from navigation start", async ({
  page
}) => {
  const blockedExternal: string[] = [];
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith("http://127.0.0.1:4174/") || url.startsWith("blob:")) {
      void route.continue();
      return;
    }
    blockedExternal.push(url);
    void route.abort();
  });

  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", {
    timeout: 30_000
  });
  expect(blockedExternal).toEqual([]);
});
```

Source omissions:
- Full `test/smoke/app.spec.ts` was included in the initial QA prompt. This
  focused re-review includes only the current excerpts relevant to B1, B2, and
  B4. The revised spec, not the current tests, is the re-review target.
- `src/main.ts` and `src/swing-card-generator.ts` excerpts are limited to
  B7/copy-prompt and the pre-existing `UNEXPECTED_NETWORK_BLOCKED` clarification
  because those were the exact source-sensitive areas from the prior review.

Verification:
- No SS-015 implementation has started.
- No browser/CI verification commands have been run for SS-015 yet.
- `git diff --check` passed after the spec/prompt edits.

Known non-goals:
- No camera capture implementation.
- No remote sharing, telemetry, remote logging, hosted analytics, cloud
  storage, model APIs, new provider SDKs, model assets, new workers, or new
  dependencies.
- No new raw personal video fixtures or unapproved third-party media.
- No runtime network enforcement change beyond test-only observation or request
  blocking.
- No new or stronger product claims about privacy, safety, deletion, anonymity,
  legal compliance, coaching correctness, medical use, or injury prevention.

Output required:
- PASS or FAIL for implementation start.
- For each prior blocker B1-B7, state closed or still open.
- Any new blockers introduced by the revised spec, ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases that should remain future work rather than
  implementation blockers.
- Explicit sign-off status.

Adversarial focus:
- Re-review whether B1-B7 are closed at the planning/spec level.
- Verify that the copy-prompt source provided is enough to define the required
  clipboard test and content-minimization assertions.
- Verify that `UNEXPECTED_NETWORK_BLOCKED` is correctly scoped as pre-existing
  behavior that SS-015 may test but must not newly implement.
- Keep future work separate from SS-015 blockers.

## END
