# SS-015 Claude QA Planning Prompt

**Superseded for paste use.** Claude returned FAIL on this initial QA planning
prompt. Use `docs/ss-015-claude-qa-rereview-prompt.md` for the focused
B1-B7 re-review.

Paste everything between START and END into Claude Chat for preimplementation
QA planning.

## START

Role: You are the independent adversarial QA planner for Swing Sync.

Stage: Preimplementation QA planning for SS-015.

Scope: Review the proposed browser-regression and CI test plan before Codex
implements SS-015. This is a planning gate, not an implementation audit.

Context:
Swing Sync is a local-first browser app for educational golf swing analysis.
Codex is acting as the SS-015 research/spec owner under the 2026-06-26
LLM-team routing update. Claude remains the independent QA planning and final
audit reviewer. Assume you cannot read the repository or GitHub; all relevant
source context is included below.

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

Relevant source contents or focused diff:
No SS-015 implementation diff exists yet. The following are exact current file
contents that Codex expects Claude to evaluate for planning gaps.

File: `docs/ss-015-preimplementation-spec.md`

```markdown
# SS-015 Preimplementation Spec

Status: candidate spec for Claude QA planning

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
  the browser suite using Node 22 after dependencies and browser binaries are
  available.
- Upload browser-test artifacts in CI, scoped to Playwright output such as
  `test-results` and reports. Do not upload raw personal user media.

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

3. Processing
   - Local analysis enters processing, exposes local progress, and completes
     against the approved fixture.
   - Retry/cancel surfaces that already exist remain covered where practical.
   - Console output must not leak raw landmarks, world landmarks, media
     characteristics, filenames, object URLs, metric payloads, or hidden IDs.

4. Review
   - Review flow exposes explicit phase-review controls.
   - Invalid nondecreasing corrections remain blocked.
   - Valid review confirmation unlocks future metric readiness and keeps
     warning/limitation language scoped.
   - Keyframe overlay canvas renders nonblank and exposes stable accessible
     labels without leaking unnecessary metadata.

5. Swing Card export
   - Export remains unavailable or warning-scoped until phase review is
     complete.
   - After valid review, Download PNG, Print / Save as PDF, and Copy prompt
     controls are present and usable.
   - Download filename remains stable and data-minimized.
   - Raw swing video is not included in Swing Card export tests.

6. Mobile layout
   - Pixel-size mobile viewport has no horizontal document overflow.
   - Key buttons/controls meet at least 44 px touch target height where already
     expected.
   - Main workflow surfaces do not overlap or truncate critical text.

7. No-network privacy regression
   - Route or observe requests from navigation start where feasible.
   - Allow only same-origin `http://127.0.0.1:4174/` preview requests and
     `blob:` URLs.
   - Unexpected external requests fail the test.
   - Assert no IndexedDB or Cache Storage entries are created by the MVP flow.
   - This test is evidence of the current local-first behavior, not a guarantee
     about all future SDK versions or browser behavior.

8. CI and artifacts
   - CI runs `npm run test:smoke` or an equivalent Playwright command.
   - CI installs Playwright Chromium/browser dependencies if needed.
   - Failed runs retain Playwright artifacts. Preferred policy: upload
     `test-results` with `if: failure()` and a short retention period.
   - CI must continue to run existing compliance steps.

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

## Claude QA Planning Questions

- Are the above browser-test contracts sufficient for the SS-015 acceptance
  criteria?
- Is the route-based no-network contract strong enough without adding runtime
  enforcement?
- Should CI artifact upload be `if: failure()` only, or always upload the HTML
  report with short retention?
- Are any existing browser tests over-claiming privacy, model telemetry, or
  fixture coverage?
- Are there missing mobile layout assertions that should block implementation?
```

File: `package.json`

```json
{
  "name": "swing-sync",
  "version": "0.1.0",
  "private": true,
  "license": "Apache-2.0",
  "type": "module",
  "description": "Local-first open-source AI golf swing analysis coach.",
  "scripts": {
    "dev": "vite",
    "build": "vite build && node scripts/aggregate-notices.js",
    "build:bundle-license-fixture": "vite build --config vite.config.test.ts",
    "verify:bundle-license-fixture": "node scripts/verify-bundle-license-fixture.js",
    "license:audit": "npm run license:audit:fixtures && node scripts/verify-production-licenses.js",
    "license:audit:fixtures": "node scripts/verify-license-fixtures.js",
    "sbom:generate": "npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file docs/sbom.json --omit dev --validate && node scripts/filter-sbom.js",
    "safety:verify": "node scripts/verify-safety-terms.js",
    "privacy:verify": "node scripts/verify-privacy-boundaries.js",
    "pose-assets:verify": "node scripts/verify-pose-assets.js",
    "fixture:verify": "node scripts/verify-fixtures.js",
    "compliance:verify": "node scripts/verify-compliance.js && npm run fixture:verify && npm run pose-assets:verify && npm run safety:verify && npm run privacy:verify",
    "test:unit": "vitest run",
    "test:smoke": "playwright test"
  },
  "devDependencies": {
    "@cyclonedx/cyclonedx-npm": "^4.2.1",
    "@onebeyond/license-checker": "^2.2.0",
    "@playwright/test": "1.52.0",
    "@swing-sync-test/bundled-prohibited-package": "file:test/fixtures/bundled-prohibited-package",
    "rollup-plugin-license": "^3.7.1",
    "typescript": "^5.8.3",
    "vite": "^5.4.21",
    "vitest": "2.1.9"
  },
  "dependencies": {
    "@mediapipe/tasks-vision": "0.10.35"
  }
}
```

File: `playwright.config.ts`

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./test/smoke",
  outputDir: "test-results",
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4174",
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 5"] }
    }
  ],
  webServer: {
    command: "npm run build && node_modules/.bin/vite preview --host 127.0.0.1 --port 4174",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: false,
    timeout: 60_000
  }
});
```

File: `.github/workflows/compliance.yml`

```yaml
name: Dependency and License Compliance

on:
  pull_request:
    branches: ["main", "master"]
  push:
    branches: ["main", "master"]

permissions:
  contents: read

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Audit dependency licenses
        run: npm run license:audit

      - name: Validate bundle scanner fixture
        run: npm run verify:bundle-license-fixture

      - name: Generate SBOM
        run: npm run sbom:generate

      - name: Build and aggregate notices
        run: npm run build

      - name: Verify compliance artifacts
        run: npm run compliance:verify
```

File: `test/smoke/app.spec.ts`

```ts
import { expect, test } from "@playwright/test";
import { resolve } from "node:path";

const poseFixture = resolve("test/fixtures/pose-landmarker/mannequin-golf-address.webm");

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

test("fails closed when local consent storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
  });
  await page.reload();

  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(beginAnalysis).toBeDisabled();

  await consent.click();
  await expect(consent).not.toBeChecked();
  await expect(beginAnalysis).toBeDisabled();
});

test("fails closed when stored consent cannot be removed", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.addInitScript(() => {
    Storage.prototype.removeItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
  });
  await page.reload();

  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(consent).toBeChecked();
  await expect(beginAnalysis).toBeDisabled();

  await consent.click();
  await expect(consent).not.toBeChecked();
  await expect(beginAnalysis).toBeDisabled();
});

test("runtime consent guard reports inline and focuses the acknowledgement", async ({ page }) => {
  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });

  await beginAnalysis.evaluate((button) => button.removeAttribute("disabled"));
  await beginAnalysis.click();

  await expect(page.getByRole("status")).toContainText(
    "Please acknowledge the safety terms before starting analysis"
  );
  await expect(consent).toBeFocused();
  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
});

test("shows every required placeholder state", async ({ page }) => {
  for (const [buttonName, headingName] of [
    ["Process", "Processing"],
    ["Review", "Review"],
    ["Export", "Export"]
  ]) {
    await page.getByRole("button", { name: new RegExp(buttonName) }).click();
    await expect(page.getByRole("heading", { name: headingName })).toBeVisible();
    await expect(page.getByText("Local workflow")).toBeVisible();
  }
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

  const storage = await page.evaluate(async () => ({
    indexedDb: "databases" in indexedDB ? await indexedDB.databases() : [],
    caches: await caches.keys()
  }));
  expect(storage.indexedDb).toEqual([]);
  expect(storage.caches).toEqual([]);
});

test("requires accessible explicit review and accepts only valid nondecreasing phase correction", async ({
  page
}) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({
    timeout: 30_000
  });
  await page.getByRole("button", { name: "Review phase labels" }).click();

  await expect(page.locator(".phase-warning")).toContainText("Unsupported input");
  await expect(page.locator(".phase-warning")).toHaveAttribute("aria-live", "polite");
  const canvas = page.locator("[data-keyframe-canvas]");
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toHaveAttribute("aria-label", "Annotated keyframe: Address");
  await expect(page.locator("[data-overlay-status]")).toContainText(/Skeleton overlay/);
  await page.locator("[data-keyframe-index='3']").click();
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toHaveAttribute("aria-label", "Annotated keyframe: Top");
  const canvasState = await page.evaluate(() => {
    const element = document.querySelector("[data-keyframe-canvas]") as HTMLCanvasElement;
    const label = element.getAttribute("aria-label") ?? "";
    return {
      width: element.width,
      height: element.height,
      label,
      canvasCount: document.querySelectorAll("[data-keyframe-canvas]").length
    };
  });
  expect(canvasState.width).toBeGreaterThan(0);
  expect(canvasState.height).toBeGreaterThan(0);
  expect(canvasState.canvasCount).toBe(1);
  expect(canvasState.label).not.toMatch(/right|left|face-on|mirrored|warning|confidence|filename|timestamp|correct/i);
  await expect(page.getByLabel("View", { exact: true })).toHaveValue("undeclared");
  await expect(page.getByLabel("Handedness", { exact: true })).toHaveValue("undeclared");
  await expect(page.getByLabel("Horizontally mirrored", { exact: true })).toHaveValue("undeclared");
  await expect(page.getByLabel(/I confirm this is one trimmed/)).not.toBeChecked();
  await expect(page.getByRole("button", { name: "Confirm phase review" })).toBeDisabled();

  await page.getByLabel("View", { exact: true }).selectOption("face-on");
  await page.getByLabel("Handedness", { exact: true }).selectOption("right");
  await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
  await page.getByLabel(/I confirm this is one trimmed/).check();

  await expect(page.locator(".phase-warning")).toContainText("Review required");
  for (const phase of [
    "Address",
    "Toe-up",
    "Mid-backswing",
    "Top",
    "Mid-downswing",
    "Impact",
    "Mid-follow-through",
    "Finish"
  ]) {
    await expect(page.locator(".phase-assignment").getByText(phase, { exact: true })).toBeVisible();
  }

  const assignments = page.locator("[data-phase-index]");
  await assignments.nth(1).selectOption("2");
  await assignments.nth(2).selectOption("1");
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await expect(page.getByRole("button", { name: "Confirm phase review" })).toBeDisabled();
  await assignments.nth(1).selectOption("1");
  await assignments.nth(2).selectOption("1");
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await expect(page.getByRole("button", { name: "Confirm phase review" })).toBeEnabled();
  await page.getByRole("button", { name: "Confirm phase review" }).click();
  await expect(page.locator(".phase-warning")).toContainText("Phase review confirmed");
  await expect(page.getByText(/Future metric readiness is available/)).toBeVisible();

  await page.getByRole("button", { name: /Export/ }).click();
  await page.getByRole("button", { name: /Review/ }).click();
  await expect(page.getByRole("heading", { name: "Review" })).toBeVisible();
  await expect(page.getByText("Annotated keyframes")).toBeVisible();
});

test("downloads a local Swing Card PNG and exposes print and prompt controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const requests: string[] = [];
  const consoleMessages: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  page.on("console", (message) => consoleMessages.push(message.text()));

  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({
    timeout: 30_000
  });
  await page.getByRole("button", { name: "Review phase labels" }).click();
  await page.getByLabel("View", { exact: true }).selectOption("face-on");
  await page.getByLabel("Handedness", { exact: true }).selectOption("right");
  await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
  await page.getByLabel(/I confirm this is one trimmed/).check();
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await page.getByRole("button", { name: "Confirm phase review" }).click();
  await page.getByRole("button", { name: "Open Swing Card export" }).click();

  await expect(page.getByRole("heading", { name: "Downloadable summary" })).toBeVisible();
  const controlLayout = await page.evaluate(() => {
    const buttons = [
      ...document.querySelectorAll("[data-download-swing-card], [data-print-swing-card], [data-copy-swing-card-prompt]")
    ];
    return {
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      minButtonHeight: Math.min(...buttons.map((button) => button.getBoundingClientRect().height))
    };
  });
  expect(controlLayout.hasOverflow).toBe(false);
  expect(controlLayout.minButtonHeight).toBeGreaterThanOrEqual(44);

  await page.evaluate(() => {
    Object.assign(window, { __swingCardPrintCalls: 0 });
    window.print = () => {
      (window as typeof window & { __swingCardPrintCalls: number }).__swingCardPrintCalls += 1;
    };
  });
  await page.getByRole("button", { name: "Print / Save as PDF" }).click();
  await expect.poll(() => page.evaluate(() => (window as typeof window & { __swingCardPrintCalls: number }).__swingCardPrintCalls)).toBe(1);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^swing-sync-card-\d{8}-[a-f0-9]{8}\.png$/);

  const requestsAtDownload = requests.length;
  await page.waitForTimeout(500);
  expect(requests).toHaveLength(requestsAtDownload);
  const external = requests.filter(
    (url) => !url.startsWith("http://127.0.0.1:4174/") && !url.startsWith("blob:")
  );
  expect(external).toEqual([]);

  const storage = await page.evaluate(async () => ({
    indexedDb: "databases" in indexedDB ? await indexedDB.databases() : [],
    caches: await caches.keys()
  }));
  expect(storage.indexedDb).toEqual([]);
  expect(storage.caches).toEqual([]);
  expect(consoleMessages.join("\n")).not.toMatch(
    /landmarks|worldLandmarks|requestedTimestampMs|observedSeekTimestampMs|filename|media characteristics|objectUrl|metricPayload/i
  );
});

test("keeps Swing Card keyframes unavailable until phase review is complete", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({
    timeout: 30_000
  });
  await page.getByRole("button", { name: "Review phase labels" }).click();
  await expect(page.locator(".phase-warning")).toContainText("Unsupported input");
  await page.getByRole("button", { name: "Open Swing Card export" }).click();
  await expect(page.getByRole("heading", { name: "Downloadable summary" })).toBeVisible();
  await expect(page.getByLabel("Swing Card warnings")).toContainText("Phase review is required");

  await page.evaluate(() => {
    Object.assign(window, { __swingCardUnavailablePrintKeyframes: 0 });
    window.print = () => {
      (window as typeof window & { __swingCardUnavailablePrintKeyframes: number }).__swingCardUnavailablePrintKeyframes =
        document.querySelectorAll(".swing-card-print__placeholder").length;
    };
  });
  await page.getByRole("button", { name: "Print / Save as PDF" }).click();

  const unavailableCount = await page.evaluate(
    () => (window as typeof window & { __swingCardUnavailablePrintKeyframes: number }).__swingCardUnavailablePrintKeyframes
  );
  expect(unavailableCount).toBe(8);
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

test("reports a useful local error when model initialization fails", async ({ page }) => {
  await page.route("**/models/pose_landmarker_full-float16-v1.task", (route) => route.abort());
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.getByText(/Local pose analysis stopped \(LOCAL_MODEL_INIT_FAILED\)/)).toBeVisible({
    timeout: 20_000
  });
  await expect(page.locator("[data-pose-summary]")).toContainText("0 of 8 video frames processed");
  await expect(page.getByRole("button", { name: "Retry local analysis" })).toBeVisible();
});

test("retries with a fresh local session after initialization failure", async ({ page }) => {
  let shouldFail = true;
  await page.route("**/models/pose_landmarker_full-float16-v1.task", (route) => {
    if (shouldFail) {
      void route.abort();
      return;
    }
    void route.continue();
  });
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.getByText(/Local pose analysis stopped \(LOCAL_MODEL_INIT_FAILED\)/)).toBeVisible({
    timeout: 20_000
  });
  shouldFail = false;
  await page.getByRole("button", { name: "Retry local analysis" }).click();

  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", {
    timeout: 30_000
  });
});

test("keeps the UI responsive while the local model loads", async ({ page }) => {
  await page.route("**/models/pose_landmarker_full-float16-v1.task", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    await route.continue();
  });
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await page.getByRole("button", { name: "Stop local analysis" }).click();

  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("volatile resources were released");
});

test("fails closed and reports a CSP-blocked outbound request", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await page.evaluate(() => {
    void fetch("https://example.com/blocked-by-swing-sync-csp").catch(() => undefined);
  });

  await expect(page.getByText(/Local pose analysis stopped \(UNEXPECTED_NETWORK_BLOCKED\)/)).toBeVisible();
});

test("releases the selected object URL when analysis stops", async ({ page }) => {
  await page.addInitScript(() => {
    const created: string[] = [];
    const revoked: string[] = [];
    const originalCreate = URL.createObjectURL.bind(URL);
    const originalRevoke = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = (value) => {
      const url = originalCreate(value);
      created.push(url);
      return url;
    };
    URL.revokeObjectURL = (url) => {
      revoked.push(url);
      originalRevoke(url);
    };
    Object.assign(window, { __poseObjectUrls: { created, revoked } });
  });
  await page.reload();

  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await page.getByRole("button", { name: "Stop local analysis" }).click();

  const urls = await page.evaluate(
    () =>
      (
        window as typeof window & {
          __poseObjectUrls: { created: string[]; revoked: string[] };
        }
      ).__poseObjectUrls
  );
  expect(urls.revoked).toEqual(urls.created);
});

test("fits the mobile viewport without horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );

  expect(hasOverflow).toBe(false);
  await expect(page.getByRole("checkbox")).toBeVisible();

  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({
    timeout: 30_000
  });
  await page.getByRole("button", { name: "Review phase labels" }).click();

  const layout = await page.evaluate(() => {
    const canvas = document.querySelector("[data-keyframe-canvas]") as HTMLCanvasElement;
    const canvasRect = canvas.getBoundingClientRect();
    const buttonRects = [...document.querySelectorAll("[data-keyframe-index]")].map((button) =>
      button.getBoundingClientRect()
    );
    return {
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      canvasWidth: canvasRect.width,
      canvasHeight: canvasRect.height,
      minButtonHeight: Math.min(...buttonRects.map((rect) => rect.height))
    };
  });

  expect(layout.hasOverflow).toBe(false);
  expect(layout.canvasWidth).toBeGreaterThan(300);
  expect(layout.canvasHeight).toBeGreaterThan(160);
  expect(layout.minButtonHeight).toBeGreaterThanOrEqual(44);
});
```

Relevant source omissions:
- `src/main.ts` and `src/styles.css` are not embedded because this is a
  preimplementation test-plan review and the current browser test file above
  provides the exact exercised selectors, UI text, and assertions. If you need
  runtime or CSS source to decide a blocker, mark that as a blocker and ask
  Codex to regenerate this prompt with the required exact excerpts.
- Large policy files are summarized in Protected boundaries. If you need exact
  policy text for a source-sensitive blocker, ask Codex to regenerate with the
  relevant policy excerpts.

Verification:
- No SS-015 implementation has started.
- No SS-015 verification commands have been run yet.
- Planned verification before PR:
  - `npm run test:smoke`
  - `npm run build`
  - `npm run compliance:verify`
  - `npm run privacy:verify`
  - `git diff --check`
- If dependencies, fixture policy, model/provider assets, or license-sensitive
  surfaces change unexpectedly, also run:
  - `npm run license:audit`
  - `npm run verify:bundle-license-fixture`
  - `npm run sbom:generate`

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
- Blockers ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status.

Adversarial focus:
- Identify any acceptance criteria not covered by the proposed contracts.
- Challenge whether the no-network regression can fail open.
- Challenge CI artifact policy for privacy leakage or insufficient debugging.
- Challenge mobile layout assertions for false confidence.
- Challenge any overbroad privacy, model telemetry, fixture, export, or safety
  claims.
- Keep future work separate from SS-015 blockers.

## END
