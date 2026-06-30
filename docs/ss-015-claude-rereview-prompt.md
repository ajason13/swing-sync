# SS-015 Claude Focused Implementation Re-Review Prompt

Paste everything between START and END into Claude Chat for focused
implementation re-review.

## START

Role: You are the independent adversarial implementation auditor for Swing Sync.

Stage: Focused implementation re-review after SS-015 final audit PASS.

Scope: Re-review only the post-PASS test-only hidden-ID denylist change and the
fresh verification evidence. Do not re-litigate prior B1-B7 unless this delta
reopens them or introduces a new blocker.

Context:
You previously returned PASS for SS-015 final implementation audit and cleared
PR preparation. Your highest-value non-blocking recommendation was that
hidden-ID coverage was phrase-based and would not catch opaque identifiers
such as UUIDs, long hashes, or long URL-safe tokens. Codex chose to fix that
small test-only gap before PR preparation. Assume you cannot read the
repository or GitHub; relevant source and verification are included below.

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

Relevant source contents or focused diff:

File: `test/smoke/app.spec.ts` sensitive-output denylist before:

```ts
const sensitiveOutputPattern =
  /\b(?:landmarks?|worldLandmarks|media characteristics|file\s?name|object\s?url|objectUrl|metricPayload|requestedTimestampMs|observedSeekTimestampMs|timestamp|hidden\s?(?:id|identifier)|trace\s?id|session\s?id|user\s?id|account\s?id|device\s?id|request\s?id|raw video)\b|blob:http/i;
```

File: `test/smoke/app.spec.ts` sensitive-output denylist after:

```ts
const sensitiveOutputPattern =
  /\b(?:landmarks?|worldLandmarks|media characteristics|file\s?name|object\s?url|objectUrl|metricPayload|requestedTimestampMs|observedSeekTimestampMs|timestamp|hidden\s?(?:id|identifier)|trace\s?id|session\s?id|user\s?id|account\s?id|device\s?id|request\s?id|raw video)\b|\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b|\b[0-9a-f]{24,}\b|\b[A-Za-z0-9_-]{32,}\b|blob:http/i;
```

File: `test/smoke/app.spec.ts` full current contents after the denylist
follow-up:

```ts
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { resolve } from "node:path";

const poseFixture = resolve("test/fixtures/pose-landmarker/mannequin-golf-address.webm");
const allowedRequestPattern = /^http:\/\/127\.0\.0\.1:4174\/|^blob:/;
const sensitiveOutputPattern =
  /\b(?:landmarks?|worldLandmarks|media characteristics|file\s?name|object\s?url|objectUrl|metricPayload|requestedTimestampMs|observedSeekTimestampMs|timestamp|hidden\s?(?:id|identifier)|trace\s?id|session\s?id|user\s?id|account\s?id|device\s?id|request\s?id|raw video)\b|\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b|\b[0-9a-f]{24,}\b|\b[A-Za-z0-9_-]{32,}\b|blob:http/i;

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

async function completePhaseReview(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Review phase labels" }).click();
  await page.getByLabel("View", { exact: true }).selectOption("face-on");
  await page.getByLabel("Handedness", { exact: true }).selectOption("right");
  await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
  await page.getByLabel(/I confirm this is one trimmed/).check();
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await page.getByRole("button", { name: "Confirm phase review" }).click();
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

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^swing-sync-card-\d{8}-[a-f0-9]{8}\.png$/);

  const requests = requestsFor(page);
  const requestsAtDownload = requests.length;
  await page.waitForTimeout(500);
  expect(requests).toHaveLength(requestsAtDownload);
  expect(externalRequests(requests)).toEqual([]);

  await expectNoBrowserStorage(page);
  expectNoSensitiveOutput(consoleMessagesFor(page).join("\n"));
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
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", {
    timeout: 30_000
  });
  expect(blockedExternalFor(page)).toEqual([]);
  expect(externalRequests(requestsFor(page))).toEqual([]);
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
});
```

Delta summary:
- Added UUID-shaped identifier detection.
- Added long lowercase hex token detection for opaque IDs/hashes.
- Added long URL-safe alphanumeric token detection for opaque IDs.
- No runtime source files changed.
- No CI workflow behavior changed after your PASS.
- No dependencies, fixtures, workers, telemetry, remote logging, remote sharing,
  camera capture, model/provider assets, or product claims were added.

Verification after this delta:
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

Output required:
- PASS or FAIL verdict for PR preparation after this delta.
- Whether the hidden-ID/token denylist concern is closed, still non-blocking,
  or blocking.
- Any new blockers introduced by the denylist expansion.
- Explicit sign-off status.

Adversarial focus:
- Check whether the broader regex creates an unacceptable false-positive risk
  for legitimate Swing Card prompt text, console messages, or expected test
  strings.
- Check whether the broader regex is meaningful for hidden/opaque identifier
  coverage.
- Check whether this test-only change broadens runtime behavior or protected
  claims.

## END
