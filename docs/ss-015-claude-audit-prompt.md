# SS-015 Claude Implementation Audit Prompt

Paste everything between START and END into Claude Chat for final implementation
audit.

## START

Role: You are the independent adversarial implementation auditor for Swing Sync.

Stage: Final implementation audit for SS-015.

Scope: Audit the SS-015 implementation after Claude QA planning PASS. Focus on
browser regression coverage, CI execution/artifact behavior, no-network privacy
coverage, mobile layout assertions, Swing Card export/copy prompt coverage, and
whether implementation stayed within the approved test/CI-only scope.

Context:
Swing Sync is a local-first browser app for educational golf swing analysis.
Codex owns implementation and repository state. Claude owns adversarial audit
and sign-off. Assume you cannot read the repository or GitHub; relevant source
excerpts and verification are included below.

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

Prior QA planning status:
- Initial QA planning returned FAIL with B1-B7.
- Focused QA planning re-review returned PASS and cleared implementation start.
- Implementation-audit follow-ups from PASS: ensure early hooks include
  `beforeEach` navigation, consider suite-wide `getUserMedia` detection, track
  branch-protection required-check configuration manually, implement shared
  sensitive-output checks, define concrete hidden-ID patterns, prefer
  multi-point/region canvas sampling, and exercise both Copy prompt success and
  unavailable paths if feasible.

Relevant source contents or focused diff:

File: `.github/workflows/compliance.yml` complete current contents

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

      - name: Install Playwright Chromium
        run: npx playwright install --with-deps chromium

      - name: Run browser regression tests
        run: npm run test:smoke

      - name: Upload Playwright failure artifacts
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-test-results
          path: test-results/
          retention-days: 7
```

File: `test/smoke/app.spec.ts` focused excerpts of changed or SS-015-relevant
sections

```ts
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { resolve } from "node:path";

const poseFixture = resolve("test/fixtures/pose-landmarker/mannequin-golf-address.webm");
const allowedRequestPattern = /^http:\/\/127\.0\.0\.1:4174\/|^blob:/;
const sensitiveOutputPattern =
  /\b(?:landmarks?|worldLandmarks|media characteristics|file\s?name|object\s?url|objectUrl|metricPayload|requestedTimestampMs|observedSeekTimestampMs|timestamp|hidden\s?(?:id|identifier)|trace\s?id|session\s?id|user\s?id|account\s?id|device\s?id|request\s?id|raw video)\b|blob:http/i;

const requestLogByContext = new WeakMap<BrowserContext, string[]>();
const blockedExternalByContext = new WeakMap<BrowserContext, string[]>();
const consoleLogByPage = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }, testInfo) => {
  const context = page.context();
  const requests: string[] = [];
  const blockedExternal: string[] = [];
  const consoleMessages: string[] = [];
  requestLogByContext.set(context, requests);
  blockedExternalByContext.set(context, blockedExternal);
  consoleLogByPage.set(page, consoleMessages);

  context.on("request", (request) => requests.push(request.url()));
  page.on("console", (message) => consoleMessages.push(message.text()));

  if (testInfo.title.includes("external network is blocked from navigation start")) {
    await context.route("**/*", (route) => {
      const url = route.request().url();
      if (allowedRequestPattern.test(url)) {
        void route.continue();
        return;
      }
      blockedExternal.push(url);
      void route.abort();
    });
  }

  await page.addInitScript(() => {
    const calls: string[] = [];
    Object.assign(window, { __swingSyncCameraCalls: calls });
    const existingMediaDevices = navigator.mediaDevices ?? {};
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        ...existingMediaDevices,
        getUserMedia: () => {
          calls.push("getUserMedia");
          return Promise.reject(new DOMException("Camera capture is out of scope", "NotAllowedError"));
        }
      }
    });
  });

  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.afterEach(async ({ page }) => {
  const cameraCalls = await page.evaluate(
    () => ((window as typeof window & { __swingSyncCameraCalls?: string[] }).__swingSyncCameraCalls ?? [])
  );
  expect(cameraCalls).toEqual([]);
});

function requestsFor(page: Page): string[] {
  return requestLogByContext.get(page.context()) ?? [];
}

function blockedExternalFor(page: Page): string[] {
  return blockedExternalByContext.get(page.context()) ?? [];
}

function consoleMessagesFor(page: Page): string[] {
  return consoleLogByPage.get(page) ?? [];
}

function externalRequests(urls: readonly string[]): readonly string[] {
  return urls.filter((url) => !allowedRequestPattern.test(url));
}

function expectNoSensitiveOutput(output: string): void {
  expect(output).not.toMatch(sensitiveOutputPattern);
}

async function expectNoBrowserStorage(page: Page): Promise<void> {
  const storage = await page.evaluate(async () => ({
    indexedDb: "databases" in indexedDB ? await indexedDB.databases() : [],
    caches: await caches.keys()
  }));
  expect(storage.indexedDb).toEqual([]);
  expect(storage.caches).toEqual([]);
}

test("opens to capture flow and keeps analysis fail closed until consent and video", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Capture or choose your swing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Use camera" })).toBeVisible();
  await expect(page.getByText("Camera capture is not part of this story")).toBeVisible();

  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(beginAnalysis).toBeDisabled();
  await page.getByRole("checkbox").check();
  await expect(beginAnalysis).toBeDisabled();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await expect(beginAnalysis).toBeEnabled();
  await page.getByRole("button", { name: "Use camera" }).click();
  await expect(page.getByRole("status")).toContainText("Camera capture remains out of scope");
});

test("loads locally in a worker and extracts complete fixture landmarks", async ({ page }) => {
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

  const requests = requestsFor(page);
  const requestsAtReady = requests.length;
  await page.waitForTimeout(500);
  expect(requests).toHaveLength(requestsAtReady);
  expect(externalRequests(requests)).toEqual([]);
  expectNoSensitiveOutput(consoleMessagesFor(page).join("\n"));

  await expectNoBrowserStorage(page);
});

// Review-flow test keeps existing phase correction assertions and adds this
// multi-point canvas sampling check.
const canvasState = await page.evaluate(() => {
  const element = document.querySelector("[data-keyframe-canvas]") as HTMLCanvasElement;
  const label = element.getAttribute("aria-label") ?? "";
  const context = element.getContext("2d");
  const samples: number[] = [];
  if (context) {
    const image = context.getImageData(0, 0, element.width, element.height).data;
    const points = [
      [0.25, 0.25],
      [0.5, 0.5],
      [0.75, 0.75],
      [0.25, 0.75],
      [0.75, 0.25]
    ];
    for (const [xRatio, yRatio] of points) {
      const x = Math.min(element.width - 1, Math.max(0, Math.floor(element.width * xRatio)));
      const y = Math.min(element.height - 1, Math.max(0, Math.floor(element.height * yRatio)));
      const offset = (y * element.width + x) * 4;
      samples.push(image[offset] ?? 0, image[offset + 1] ?? 0, image[offset + 2] ?? 0, image[offset + 3] ?? 0);
    }
  }
  return {
    width: element.width,
    height: element.height,
    label,
    canvasCount: document.querySelectorAll("[data-keyframe-canvas]").length,
    nonTransparentSamples: samples.filter((_, index) => index % 4 === 3 && samples[index] > 0).length,
    uniqueSampleValues: new Set(samples.join(",").split(",")).size
  };
});
expect(canvasState.width).toBeGreaterThan(0);
expect(canvasState.height).toBeGreaterThan(0);
expect(canvasState.canvasCount).toBe(1);
expect(canvasState.nonTransparentSamples).toBeGreaterThan(0);
expect(canvasState.uniqueSampleValues).toBeGreaterThan(1);
expect(canvasState.label).not.toMatch(/right|left|face-on|mirrored|warning|confidence|filename|timestamp|correct/i);

// Swing Card export test exercises print, copy success, copy failure, download,
// request stability, browser storage, and sensitive console output.
await page.evaluate(() => {
  const writes: string[] = [];
  Object.assign(window, { __swingCardClipboardWrites: writes });
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: async (text: string) => {
        writes.push(text);
      }
    }
  });
});
await page.getByRole("button", { name: "Copy prompt" }).click();
await expect(page.locator("[data-swing-card-status]")).toContainText("Prompt copied for manual use");
const copiedPrompts = await page.evaluate(
  () =>
    (window as typeof window & { __swingCardClipboardWrites?: string[] }).__swingCardClipboardWrites ?? []
);
expect(copiedPrompts).toHaveLength(1);
expect(copiedPrompts[0]).toContain("Metric summary:");
expect(copiedPrompts[0]).toContain("unavailable");
expectNoSensitiveOutput(copiedPrompts[0]);

await page.evaluate(() => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: async () => {
        throw new DOMException("Clipboard unavailable", "NotAllowedError");
      }
    }
  });
});
await page.getByRole("button", { name: "Copy prompt" }).click();
await expect(page.locator("[data-swing-card-status]")).toContainText("Prompt copy unavailable in this browser");

test("completes local inference when external network is blocked from navigation start", async ({
  page
}) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", {
    timeout: 30_000
  });
  expect(blockedExternalFor(page)).toEqual([]);
  expect(externalRequests(requestsFor(page))).toEqual([]);
});

// Mobile layout test adds overlap and clipping assertions.
const layout = await page.evaluate(() => {
  const canvas = document.querySelector("[data-keyframe-canvas]") as HTMLCanvasElement;
  const canvasRect = canvas.getBoundingClientRect();
  const buttonRects = [...document.querySelectorAll("[data-keyframe-index]")].map((button) =>
    button.getBoundingClientRect()
  );
  const criticalTextSelectors = [
    ".phase-warning",
    ".keyframe-review__heading",
    "[data-overlay-status]",
    "[data-confirm-phase-review]",
    "[data-open-export]"
  ];
  const criticalText = criticalTextSelectors
    .flatMap((selector) => [...document.querySelectorAll<HTMLElement>(selector)])
    .filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
    })
    .map((element) => ({
      selector: element.matches("[data-confirm-phase-review]")
        ? "confirm"
        : element.matches("[data-open-export]")
          ? "export"
          : element.className || element.tagName,
      clipped:
        Math.ceil(element.scrollHeight) > Math.ceil(element.clientHeight) ||
        Math.ceil(element.scrollWidth) > Math.ceil(element.clientWidth)
    }));
  const overlaps = buttonRects.some((rect, index) =>
    buttonRects.slice(index + 1).some(
      (other) =>
        rect.left < other.right &&
        rect.right > other.left &&
        rect.top < other.bottom &&
        rect.bottom > other.top
    )
  );
  return {
    hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    canvasWidth: canvasRect.width,
    canvasHeight: canvasRect.height,
    minButtonHeight: Math.min(...buttonRects.map((rect) => rect.height)),
    hasButtonOverlap: overlaps,
    clippedCriticalText: criticalText.filter((item) => item.clipped)
  };
});

expect(layout.hasOverflow).toBe(false);
expect(layout.canvasWidth).toBeGreaterThan(300);
expect(layout.canvasHeight).toBeGreaterThan(160);
expect(layout.minButtonHeight).toBeGreaterThanOrEqual(44);
expect(layout.hasButtonOverlap).toBe(false);
expect(layout.clippedCriticalText).toEqual([]);
```

Source omissions:
- The full `test/smoke/app.spec.ts` file is 600+ lines. The excerpt above
  includes the newly added shared helpers and every SS-015-relevant changed
  assertion. Unchanged pre-existing tests for consent storage failure, phase
  review correction, model-init failure/retry, CSP violation reporting, object
  URL release, and Swing Card unavailable keyframes remain in the file and
  passed in the full smoke suite.
- Runtime source files were not changed for SS-015.

Verification:
- Initial `npm run test:smoke` under Node v24.15.0 was interrupted after no
  output for several minutes; this was not used as required verification.
- `source "$HOME/.nvm/nvm.sh" && nvm use && node --version && npm run test:smoke -- --project=desktop-chromium`
  - PASS under Node v22.22.3.
  - 16 desktop Chromium tests passed.
- `source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:smoke`
  - PASS under Node v22.22.3.
  - 32 tests passed across desktop Chromium and mobile Chromium.
- `source "$HOME/.nvm/nvm.sh" && nvm use && npm run build && npm run compliance:verify && npm run privacy:verify && git diff --check`
  - PASS under Node v22.22.3.
  - Build passed.
  - Compliance artifacts, fixture policy, pose assets, safety terms, and
    privacy boundaries verified.
  - `privacy:verify` passed.
  - `git diff --check` passed.

Known non-goals:
- No camera capture implementation.
- No remote sharing, telemetry, remote logging, hosted analytics, cloud
  storage, model APIs, new provider SDKs, model assets, new workers, or new
  dependencies.
- No new raw personal video fixtures or unapproved third-party media.
- No runtime feature behavior change.
- No new or stronger product claims about privacy, safety, deletion, anonymity,
  legal compliance, coaching correctness, medical use, or injury prevention.
- Branch-protection required-check configuration remains a manual
  merge-readiness follow-up outside the source diff.

Output required:
- PASS or FAIL verdict.
- Blockers ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status.

Adversarial focus:
- Check whether B1-B7 were implemented, not only specified.
- Check whether the no-network test really observes/blocks from before
  `beforeEach` navigation.
- Check whether the sensitive-output pattern is concrete enough and whether
  hidden-ID coverage is meaningful.
- Check whether Copy prompt clipboard success/failure and content minimization
  are adequate.
- Check whether CI browser tests are blocking and artifact upload is
  failure-only.
- Check whether any implementation accidentally broadens runtime behavior,
  privacy claims, fixture claims, or dependencies.

## END
