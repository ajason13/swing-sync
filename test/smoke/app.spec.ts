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

async function expectMeaningfulHeadingOrder(page: Page): Promise<void> {
  const headings = await page.locator("h1, h2, h3, h4, h5, h6").evaluateAll((elements) =>
    elements.map((element) => ({
      level: Number(element.tagName.slice(1)),
      text: element.textContent?.trim() ?? ""
    }))
  );
  expect(headings.filter((heading) => heading.level === 1)).toHaveLength(1);
  expect(headings[0]?.level).toBe(1);
  expect(headings.every((heading) => heading.text.length > 0)).toBe(true);
  for (let index = 1; index < headings.length; index += 1) {
    expect(headings[index].level - headings[index - 1].level).toBeLessThanOrEqual(1);
  }
}

async function collectResponsiveGeometry(page: Page, textSelectors: readonly string[]) {
  return page.evaluate((selectors) => {
    // Native checkboxes have intentionally compact glyphs with a >=44px labelled row;
    // the defensive native file input is removed from sequential/visual flow.
    const targetExceptions = ["input[type='checkbox']", "#video-file"];
    const isVisible = (element: HTMLElement) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const texts = selectors.flatMap((selector) => [...document.querySelectorAll<HTMLElement>(selector)])
      .filter(isVisible)
      .map((element) => {
        const style = getComputedStyle(element);
        const overflowX = style.overflowX;
        const overflowY = style.overflowY;
        const scrollWidth = element.scrollWidth;
        const clientWidth = element.clientWidth;
        const scrollHeight = element.scrollHeight;
        const clientHeight = element.clientHeight;
        const clippedX = scrollWidth > clientWidth + 1 && overflowX !== "visible";
        const clippedY = scrollHeight > clientHeight + 1 && overflowY !== "visible";
        return {
          selector: element.id || element.getAttribute("data-focus-key") || element.className || element.tagName,
          clipped: clippedX || clippedY,
          clippedX,
          clippedY,
          scrollWidth,
          clientWidth,
          scrollHeight,
          clientHeight,
          overflowX,
          overflowY,
          rect: element.getBoundingClientRect().toJSON()
        };
      });
    const controls = [...document.querySelectorAll<HTMLElement>("button, select, input")]
      .filter(isVisible)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          name: element.getAttribute("data-focus-key") || element.id || element.tagName,
          width: rect.width,
          height: rect.height,
          excepted: targetExceptions.some((selector) => element.matches(selector)),
          rect: rect.toJSON()
        };
      });
    const overlapControls = controls.filter((control) => !control.excepted);
    const overlaps: string[] = [];
    overlapControls.forEach((control, index) => {
      for (const other of overlapControls.slice(index + 1)) {
        if (
          control.rect.left < other.rect.right && control.rect.right > other.rect.left &&
          control.rect.top < other.rect.bottom && control.rect.bottom > other.rect.top
        ) overlaps.push(`${control.name}/${other.name}`);
      }
    });
    return {
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      textDiagnostics: texts,
      clipped: texts.filter((item) => item.clipped),
      outsideViewport: texts.filter((item) => item.rect.left < 0 || item.rect.right > document.documentElement.clientWidth + 1),
      undersized: controls.filter((control) => !control.excepted && (control.width < 44 || control.height < 44)),
      overlaps
    };
  }, textSelectors);
}

async function expectResponsiveGeometry(page: Page, textSelectors: readonly string[]): Promise<void> {
  const result = await collectResponsiveGeometry(page, textSelectors);
  expect(result.pageOverflow).toBe(false);
  expect(result.clipped).toEqual([]);
  expect(result.outsideViewport).toEqual([]);
  expect(result.undersized).toEqual([]);
  expect(result.overlaps).toEqual([]);
}

test("responsive geometry distinguishes visible overflow from hidden clipped content", async ({ page }) => {
  await page.locator("body").evaluate((body) => {
    const fixture = document.createElement("div");
    fixture.innerHTML = `
      <div id="visible-overflow-fixture">Visible overflow sample</div>
      <div id="hidden-overflow-fixture">Hidden overflow sample</div>
    `;
    Object.assign(fixture.style, {
      position: "fixed",
      top: "0",
      left: "0",
      zIndex: "-1"
    });
    for (const element of fixture.children) {
      Object.assign((element as HTMLElement).style, {
        width: "20px",
        height: "20px",
        whiteSpace: "nowrap"
      });
    }
    (fixture.children[0] as HTMLElement).style.overflow = "visible";
    (fixture.children[1] as HTMLElement).style.overflow = "hidden";
    body.append(fixture);
  });

  const result = await collectResponsiveGeometry(page, [
    "#visible-overflow-fixture",
    "#hidden-overflow-fixture"
  ]);
  const visible = result.textDiagnostics.find((item) => item.selector === "visible-overflow-fixture");
  const hidden = result.textDiagnostics.find((item) => item.selector === "hidden-overflow-fixture");

  expect(visible).toBeDefined();
  expect(visible!.scrollWidth).toBeGreaterThan(visible!.clientWidth + 1);
  expect(visible).toMatchObject({
    clipped: false,
    clippedX: false,
    overflowX: "visible"
  });
  expect(hidden).toBeDefined();
  expect(hidden!.scrollWidth).toBeGreaterThan(hidden!.clientWidth + 1);
  expect(hidden).toMatchObject({
    clipped: true,
    clippedX: true,
    overflowX: "hidden"
  });
  expect(result.clipped.map((item) => item.selector)).toEqual(["hidden-overflow-fixture"]);
});

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
  await expect(beginAnalysis).toHaveAttribute("aria-describedby", "app-visible-status");
  await expect(page.locator("#app-visible-status")).toHaveText(
    "First analysis is blocked until this acknowledgement is checked."
  );
  await page.getByRole("checkbox").check();
  await expect(beginAnalysis).toBeDisabled();
  await expect(beginAnalysis).toHaveAttribute("aria-describedby", "app-visible-status");
  await expect(page.locator("#app-visible-status")).toHaveText(
    "Consent recorded locally. Choose a local video to begin analysis."
  );
  await page.locator("#video-file").setInputFiles(poseFixture);
  await expect(beginAnalysis).toBeEnabled();
  await expect(page.locator("#app-visible-status")).toHaveText(
    "Local video selected. It has not been analyzed or persisted."
  );
  await page.getByRole("button", { name: "Use camera" }).click();
  await expect(page.locator("#app-announcer")).toContainText("Camera capture remains out of scope");
  await expect(page.locator("#app-visible-status")).toContainText("Camera capture remains out of scope");
  await expect(page.locator("#app-visible-status")).not.toHaveAttribute("role", "status");
  await expect(page.locator("#app-visible-status")).not.toHaveAttribute("aria-live");
});

test("keeps one main landmark dynamic titles and bounded focus targets", async ({ page }) => {
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page).toHaveTitle("Swing Sync | Capture");
  await page.getByRole("button", { name: /Process/ }).click();
  await expect(page).toHaveTitle("Swing Sync | Processing");
  await expect(page.locator("[data-focus-key='stage-heading']")).toBeFocused();
  await page.getByRole("button", { name: /Review/ }).click();
  await expect(page).toHaveTitle("Swing Sync | Review");
  await page.getByRole("button", { name: /Export/ }).click();
  await expect(page).toHaveTitle("Swing Sync | Export");
});

test("returns picker focus for success cancel and defensive hidden-input focus", async ({ page }) => {
  const picker = page.locator("[data-video-picker]");
  await picker.focus();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await expect(picker).toBeFocused();
  await page.locator("#video-file").dispatchEvent("cancel");
  await expect(picker).toBeFocused();
  await page.locator("#video-file").evaluate((input: HTMLInputElement) => input.focus());
  await expect(picker).toBeFocused();
  await expect(page.locator("#video-file")).toHaveAttribute("tabindex", "-1");
  await expect(page.locator("#video-file")).not.toHaveAttribute("aria-hidden", "true");
});

test("applies approved focus geometry tokens and forced-colors focus", async ({ page }) => {
  const picker = page.locator("[data-video-picker]");
  await picker.focus();
  const styles = await picker.evaluate((element) => {
    const computed = getComputedStyle(element);
    const root = getComputedStyle(document.documentElement);
    return {
      inner: root.getPropertyValue("--focus-inner").trim(),
      outer: root.getPropertyValue("--focus-outer").trim(),
      boundary: root.getPropertyValue("--interactive-boundary").trim(),
      outlineWidth: computed.outlineWidth,
      outlineOffset: computed.outlineOffset,
      boxShadow: computed.boxShadow
    };
  });
  expect(styles).toMatchObject({ inner: "#ffffff", outer: "#17211b", boundary: "#607367", outlineWidth: "2px", outlineOffset: "2px" });
  expect(styles.boxShadow).toContain("6px");
  expect(await picker.evaluate((element) => getComputedStyle(element).borderColor)).toBe("rgb(96, 115, 103)");
  await expect(page.locator("[data-step='capture']")).toHaveCSS("border-color", "rgb(96, 115, 103)");

  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  const primary = page.locator("#analysis-button");
  await expect(page.locator("[data-video-picker]")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(primary).toBeFocused();
  await expect(primary).toHaveCSS("background-color", "rgb(36, 91, 59)");
  const primaryFocus = await primary.evaluate((element) => ({
    outline: getComputedStyle(element).outlineWidth,
    offset: getComputedStyle(element).outlineOffset,
    shadow: getComputedStyle(element).boxShadow
  }));
  expect(primaryFocus).toMatchObject({ outline: "2px", offset: "2px" });
  expect(primaryFocus.shadow).toContain("6px");

  await page.getByRole("button", { name: /Review/ }).click();
  const secondary = page.locator("[data-next-step]");
  await expect(secondary).toHaveCSS("border-color", "rgb(96, 115, 103)");
  await page.getByRole("button", { name: /Capture/ }).click();
  await page.emulateMedia({ forcedColors: "active" });
  await picker.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(picker).toBeFocused();
  const forced = await picker.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      borderStyle: style.borderStyle,
      borderWidth: style.borderWidth,
      boxShadow: style.boxShadow,
      forcedColorAdjust: style.forcedColorAdjust
    };
  });
  expect(forced.outlineStyle).not.toBe("none");
  expect(forced.outlineWidth).toBe("2px");
  expect(forced.borderStyle).not.toBe("none");
  expect(forced.borderWidth).not.toBe("0px");
  expect(forced.boxShadow).toBe("none");
  expect(forced.forcedColorAdjust).toBe("auto");
});

test("reflows long status text at 320 CSS pixels without clipping or overlap", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.locator("#app-visible-status").evaluate((element) => {
    element.textContent = "A very long local-only prerequisite explanation that must wrap without clipping, overlap, or horizontal scrolling even when system text is enlarged.";
  });
  const layout = await page.evaluate(() => {
    const status = document.querySelector("#app-visible-status") as HTMLElement;
    const rect = status.getBoundingClientRect();
    return {
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      clipped: status.scrollWidth > status.clientWidth || status.scrollHeight > status.clientHeight,
      withinViewport: rect.left >= 0 && rect.right <= document.documentElement.clientWidth
    };
  });
  expect(layout).toEqual({ pageOverflow: false, clipped: false, withinViewport: true });
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

  await expect(page.locator("#app-announcer")).toContainText(
    "Please acknowledge the safety terms before starting analysis"
  );
  await expect(page.locator("#app-visible-status")).toContainText("Please acknowledge the safety terms");
  await expect(consent).toBeFocused();
  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
});

test("shows every required placeholder state", async ({ page }) => {
  await expect(page.getByRole("group", { name: "Local video source" })).toBeVisible();
  for (const [buttonName, headingName] of [
    ["Process", "Processing"],
    ["Review", "Review"],
    ["Export", "Export"]
  ]) {
    await page.getByRole("button", { name: new RegExp(buttonName) }).click();
    await expect(page.getByRole("heading", { name: headingName })).toBeVisible();
    await expect(page.getByText("Local workflow")).toBeVisible();
  }
  await page.getByRole("button", { name: /Process/ }).click();
  await expect(page.getByRole("group", { name: "Local pose processing" })).toBeVisible();
  await page.getByRole("button", { name: /Review/ }).click();
  await expect(page.getByRole("group", { name: "Review placeholder" })).toBeVisible();
  await page.getByRole("button", { name: /Export/ }).click();
  await expect(page.getByRole("region", { name: "Swing Card unavailable" })).toBeVisible();
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

test("keeps completed and failed processing terminal updates scoped to processing status", async ({ page }) => {
  let releaseSuccessfulModel!: () => void;
  const successfulModelGate = new Promise<void>((resolveGate) => {
    releaseSuccessfulModel = resolveGate;
  });
  await page.route("**/models/pose_landmarker_full-float16-v1.task", async (route) => {
    await successfulModelGate;
    await route.continue();
  });
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.locator("#processing-status")).toContainText("Loading the local pose model");
  const completedGlobalBefore = await page.locator("#app-announcer").textContent();
  await page.evaluate(() => {
    const counts = { global: 0, processing: 0 };
    Object.assign(window, { __terminalStatusMutations: counts });
    new MutationObserver(() => { counts.global += 1; }).observe(document.querySelector("#app-announcer")!, {
      childList: true,
      characterData: true,
      subtree: true
    });
    new MutationObserver(() => { counts.processing += 1; }).observe(document.querySelector("#processing-status")!, {
      childList: true,
      characterData: true,
      subtree: true
    });
  });
  releaseSuccessfulModel();
  await expect(page.locator("#processing-status")).toHaveText("Local frame processing completed.", {
    timeout: 30_000
  });
  await expect(page.locator("#app-announcer")).toHaveText(completedGlobalBefore ?? "");
  await expect.poll(() => page.evaluate(() =>
    (window as typeof window & { __terminalStatusMutations: { global: number; processing: number } })
      .__terminalStatusMutations
  )).toMatchObject({ global: 0 });
  expect(await page.evaluate(() =>
    (window as typeof window & { __terminalStatusMutations: { global: number; processing: number } })
      .__terminalStatusMutations.processing
  )).toBeGreaterThan(0);

  await page.unroute("**/models/pose_landmarker_full-float16-v1.task");
  await page.reload();
  let releaseFailedModel!: () => void;
  const failedModelGate = new Promise<void>((resolveGate) => {
    releaseFailedModel = resolveGate;
  });
  await page.route("**/models/pose_landmarker_full-float16-v1.task", async (route) => {
    await failedModelGate;
    await route.abort();
  });
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.locator("#processing-status")).toContainText("Loading the local pose model");
  const failedGlobalBefore = await page.locator("#app-announcer").textContent();
  await page.evaluate(() => {
    const counts = { global: 0, processing: 0 };
    Object.assign(window, { __terminalStatusMutations: counts });
    new MutationObserver(() => { counts.global += 1; }).observe(document.querySelector("#app-announcer")!, {
      childList: true,
      characterData: true,
      subtree: true
    });
    new MutationObserver(() => { counts.processing += 1; }).observe(document.querySelector("#processing-status")!, {
      childList: true,
      characterData: true,
      subtree: true
    });
  });
  releaseFailedModel();
  await expect(page.locator("#processing-status")).toHaveText(
    "Local pose analysis stopped (LOCAL_MODEL_INIT_FAILED).",
    { timeout: 20_000 }
  );
  await expect(page.locator("#app-announcer")).toHaveText(failedGlobalBefore ?? "");
  await expect.poll(() => page.evaluate(() =>
    (window as typeof window & { __terminalStatusMutations: { global: number; processing: number } })
      .__terminalStatusMutations
  )).toMatchObject({ global: 0 });
  expect(await page.evaluate(() =>
    (window as typeof window & { __terminalStatusMutations: { global: number; processing: number } })
      .__terminalStatusMutations.processing
  )).toBeGreaterThan(0);
});

test("traverses capture processing review confirmation and export with keyboard input", async ({ page }) => {
  await expectMeaningfulHeadingOrder(page);
  await expect(page.locator("[role='status']")).toHaveCount(1);
  await expect(page.locator("#app-announcer")).toHaveAttribute("aria-live", "polite");
  await page.getByRole("checkbox").focus();
  await page.keyboard.press("Space");
  const chooserPromise = page.waitForEvent("filechooser");
  await page.locator("[data-video-picker]").focus();
  await page.keyboard.press("Enter");
  const chooser = await chooserPromise;
  await chooser.setFiles(poseFixture);
  await expect(page.locator("[data-video-picker]")).toBeFocused();
  await page.getByRole("button", { name: "Begin analysis" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator("#processing-status")).toContainText("completed");
  await expect(page.locator("#app-announcer, #processing-status")).toHaveCount(2);
  await expect(page.locator("#app-announcer")).toHaveAttribute("role", "status");
  await expect(page.locator("#processing-status")).toHaveAttribute("role", "status");
  await expect(page.locator("#processing-status")).toHaveAttribute("aria-live", "polite");
  await expect(page.locator("[data-review-phases]")).toHaveAttribute("aria-describedby", "phase-review-status");
  await expect(page.locator("#phase-review-status")).toHaveText(
    "Local processing output is ready for phase review."
  );
  await page.getByRole("button", { name: "Review phase labels" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-focus-key='phase-review-heading']")).toBeFocused();
  await expectMeaningfulHeadingOrder(page);
  await expect(page.locator("#app-announcer, #keyframe-overlay-status")).toHaveCount(2);
  await expect(page.locator("#app-announcer")).toHaveAttribute("role", "status");
  await expect(page.locator("#keyframe-overlay-status")).toHaveAttribute("role", "status");
  await expect(page.locator("#keyframe-overlay-status")).toHaveAttribute("aria-live", "polite");
  await expect(page.locator("#phase-review-status")).not.toHaveAttribute("role", "status");
  await expect(page.locator("#phase-review-status")).not.toHaveAttribute("aria-live");

  for (const [label, key] of [["View", "f"], ["Handedness", "r"], ["Horizontally mirrored", "n"]]) {
    await page.getByLabel(label, { exact: true }).focus();
    await page.keyboard.press(key);
    await page.keyboard.press("Tab");
  }
  await page.getByLabel(/I confirm this is one trimmed/).focus();
  await page.keyboard.press("Space");
  await page.getByLabel(/I reviewed these provisional labels/).focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Confirm phase review" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-focus-key='phase-review-heading']")).toBeFocused();
  await page.getByRole("button", { name: "Open Swing Card export" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-focus-key='swing-card-heading']")).toBeFocused();
  await expect(page).toHaveTitle("Swing Sync | Export");
  await expectMeaningfulHeadingOrder(page);
  await expect(page.locator("#swing-card-action-status")).not.toHaveAttribute("role", "status");
  await expect(page.locator("#swing-card-action-status")).not.toHaveAttribute("aria-live");
  await expect(page.locator("#remote-model-status")).not.toHaveAttribute("role", "status");
  await expect(page.locator("#remote-model-status")).not.toHaveAttribute("aria-live");
  await expect(page.locator("[role='status']")).toHaveCount(1);

  await page.evaluate(() => {
    Object.assign(window, { __keyboardPrintCalls: 0 });
    window.print = () => {
      (window as typeof window & { __keyboardPrintCalls: number }).__keyboardPrintCalls += 1;
    };
  });
  await page.evaluate(() => {
    const originalCreateImageBitmap = window.createImageBitmap.bind(window);
    let release!: () => void;
    const gate = new Promise<void>((resolveGate) => { release = resolveGate; });
    Object.assign(window, { __releaseKeyboardPrint: release });
    window.createImageBitmap = async (...arguments_) => {
      await gate;
      return originalCreateImageBitmap(...arguments_);
    };
  });
  const print = page.locator("[data-print-swing-card]");
  await print.focus();
  await page.keyboard.press("Enter");
  await expect(print).toBeDisabled();
  await expect(print).toHaveAttribute("aria-describedby", "swing-card-action-status");
  await expect(page.locator("#swing-card-action-status")).toHaveText("Preparing browser print view.");
  await page.evaluate(() =>
    (window as typeof window & { __releaseKeyboardPrint: () => void }).__releaseKeyboardPrint()
  );
  await expect.poll(() => page.evaluate(() => (window as typeof window & { __keyboardPrintCalls: number }).__keyboardPrintCalls)).toBe(1);
  await expect(page.locator("#swing-card-action-status")).toContainText("Browser print dialog opened");
  await expect(page.locator("#app-announcer")).toContainText("Browser print dialog opened");
  await expect(print).toBeFocused();

  await page.evaluate(() => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => { release = resolve; });
    Object.assign(window, { __releaseKeyboardCopy: release });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => gate }
    });
  });
  const copy = page.locator("[data-copy-swing-card-prompt]");
  await copy.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#swing-card-action-status")).toHaveText("Preparing prompt text.");
  await expect(page.locator("#app-announcer")).toHaveText("Preparing prompt text.");
  await expect(copy).toBeDisabled();
  await expect(copy).toHaveAttribute("aria-describedby", "swing-card-action-status");
  await page.evaluate(() => (window as typeof window & { __releaseKeyboardCopy: () => void }).__releaseKeyboardCopy());
  await expect(page.locator("#swing-card-action-status")).toHaveText("Prompt copied for manual use.");
  await expect(copy).toBeFocused();

  const downloadPromise = page.waitForEvent("download");
  const downloadButton = page.locator("[data-download-swing-card]");
  await page.evaluate(() => {
    const originalCreateImageBitmap = window.createImageBitmap.bind(window);
    let release!: () => void;
    const gate = new Promise<void>((resolveGate) => { release = resolveGate; });
    Object.assign(window, { __releaseKeyboardDownload: release });
    window.createImageBitmap = async (...arguments_) => {
      await gate;
      return originalCreateImageBitmap(...arguments_);
    };
  });
  await downloadButton.focus();
  await page.keyboard.press("Enter");
  await expect(downloadButton).toBeDisabled();
  await expect(downloadButton).toHaveAttribute("aria-describedby", "swing-card-action-status");
  await expect(page.locator("#swing-card-action-status")).toHaveText("Preparing local Swing Card PNG.");
  await page.evaluate(() =>
    (window as typeof window & { __releaseKeyboardDownload: () => void }).__releaseKeyboardDownload()
  );
  await downloadPromise;
  await expect(page.locator("#swing-card-action-status")).toHaveText("Swing Card PNG download started.");
  await expect(page.locator("#app-announcer")).toHaveText("Swing Card PNG download started.");
  await expect(downloadButton).toBeFocused();
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
  await expect(page.locator(".phase-warning")).toHaveAttribute("id", "phase-review-status");
  await expect(page.locator(".phase-warning")).not.toHaveAttribute("role", "status");
  await expect(page.locator(".phase-warning")).not.toHaveAttribute("aria-live");
  await expect(page.locator("[data-confirm-phase-review]")).toHaveAttribute("aria-describedby", "phase-review-status");
  const canvas = page.locator("[data-keyframe-canvas]");
  await expect(page.getByRole("group", { name: "Swing phase assignments" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Select keyframe" })).toBeVisible();
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
  await expect(page.locator("#phase-review-status p")).toHaveText(
    "Phase review is confirmed. Future metric readiness is available for a separately reviewed story; no metrics are generated here."
  );
  await expect(page.locator(".phase-review > .action-row .action-note")).toHaveText(
    "Future metric readiness is available for a separately reviewed story. No metrics are generated here."
  );

  await page.getByRole("button", { name: /Export/ }).click();
  await page.getByRole("button", { name: /Review/ }).click();
  await expect(page.getByRole("heading", { name: "Review", exact: true })).toBeVisible();
  await expect(page.getByText("Annotated keyframes")).toBeVisible();
});

test("keeps phase semantic announcements and overlay ownership mutually exclusive", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Review phase labels" }).click();

  const announcer = page.locator("#app-announcer");
  const overlay = page.locator("#keyframe-overlay-status");
  const initialGlobal = await announcer.textContent();
  await page.getByLabel("View", { exact: true }).selectOption("face-on");
  await expect(announcer).toHaveText(initialGlobal ?? "");
  const stableOverlay = await overlay.textContent();
  await page.getByLabel("Handedness", { exact: true }).selectOption("right");
  await expect(announcer).toHaveText(initialGlobal ?? "");
  await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
  await expect(announcer).toHaveText(initialGlobal ?? "");

  await page.getByLabel(/I confirm this is one trimmed/).check();
  await expect(announcer).toContainText("ready for review");
  await expect(overlay).toHaveText(stableOverlay ?? "");
  const reviewRequiredGlobal = await announcer.textContent();

  const firstAssignment = page.locator("[data-phase-index='0']");
  await firstAssignment.selectOption("1");
  await expect(announcer).toHaveText(reviewRequiredGlobal ?? "");
  await firstAssignment.selectOption("0");
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await expect(announcer).toHaveText(reviewRequiredGlobal ?? "");
  await page.getByRole("button", { name: "Confirm phase review" }).click();
  await expect(announcer).toHaveText("Phase review confirmed.");
  const confirmedGlobal = await announcer.textContent();

  await page.evaluate(() => {
    const counts = { global: 0, overlay: 0 };
    Object.assign(window, { __semanticMutationCounts: counts });
    new MutationObserver(() => { counts.global += 1; }).observe(
      document.querySelector("#app-announcer")!,
      { childList: true, characterData: true, subtree: true }
    );
    new MutationObserver((records) => {
      counts.overlay += records.filter((record) => (record.target as Element).id === "keyframe-overlay-status").length;
    }).observe(document.querySelector("#app")!, { childList: true, characterData: true, subtree: true });
  });
  await page.locator("[data-keyframe-index='3']").click();
  await expect(announcer).toHaveText(confirmedGlobal ?? "");
  await expect.poll(() => page.evaluate(() =>
    (window as typeof window & { __semanticMutationCounts: { global: number; overlay: number } }).__semanticMutationCounts
  )).toEqual({ global: 0, overlay: 1 });
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
  await expect(page.getByRole("heading", { name: "Remote model review unavailable" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Swing Card contents" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Remote model data disclosure" })).toBeVisible();
  await expect(page.locator("dl.remote-model-disclosure")).toHaveCount(1);
  await expect(page.getByText("No reviewed provider is configured for this story.")).toBeVisible();
  await expect(page.getByText("Metrics, Warnings and Limitations, Manual Swing Card Prompt")).toBeVisible();
  await expect(page.getByText("Raw Video, Frame Pixels, Selected Keyframe Images, Pose Landmarks")).toBeVisible();
  await expect(page.getByRole("button", { name: "Remote review unavailable" })).toBeDisabled();
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
  const localStorageKeys = await page.evaluate(() => Object.keys(localStorage));
  expect(localStorageKeys).toEqual(["swing-sync:safety-consent:v1"]);
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
  await expect(page.locator("#app-announcer")).toContainText("volatile resources were released");
  await expect(page.locator("#app-visible-status")).toContainText("volatile resources were released");
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

test("keeps real failure review and confirmed export usable at 320 CSS pixels", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await expect(page.getByRole("group", { name: "Local video source" })).toBeVisible();
  await page.locator("#app-visible-status").evaluate((element) => {
    element.textContent = "A deliberately long local consent and video prerequisite that must wrap without clipping at the narrowest supported reflow width.";
  });
  await expectResponsiveGeometry(page, ["#app-visible-status", ".capture-options", ".source-option"]);

  await page.getByRole("button", { name: /Review/ }).click();
  await expect(page.getByRole("group", { name: "Review placeholder" })).toBeVisible();
  await expectResponsiveGeometry(page, [".review-placeholder", ".metric-list"]);
  await page.getByRole("button", { name: /Export/ }).click();
  await expect(page.getByRole("region", { name: "Swing Card unavailable" })).toBeVisible();
  await expectResponsiveGeometry(page, [".export-placeholder", "#phase-review-status"]);
  await page.getByRole("button", { name: /Capture/ }).click();

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
  await expect(page.locator("#processing-status")).toContainText("LOCAL_MODEL_INIT_FAILED", { timeout: 20_000 });
  await expect(page.getByRole("group", { name: "Local pose processing" })).toBeVisible();
  await page.locator("#processing-status").evaluate((element) => {
    element.textContent += " — LOCAL_MODEL_INITIALIZATION_FAILED_WITH_A_DELIBERATELY_LONG_UNBROKEN_DIAGNOSTIC_CODE";
  });
  await page.locator("#phase-review-status").evaluate((element) => {
    element.textContent += " Retry remains local and this deliberately long prerequisite must stay readable.";
  });
  await expectResponsiveGeometry(page, [".processing-placeholder", "#processing-status", "#phase-review-status", "[data-pose-summary]"]);

  await page.unroute("**/models/pose_landmarker_full-float16-v1.task");
  await page.reload();
  await page.setViewportSize({ width: 320, height: 800 });
  const consent = page.getByRole("checkbox");
  if (!(await consent.isChecked())) await consent.check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Review phase labels" }).click();
  await expect(page.getByRole("group", { name: "Swing phase assignments" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Select keyframe" })).toBeVisible();
  await expect(page.locator("[data-phase-index='0']")).toHaveCSS("border-color", "rgb(96, 115, 103)");
  await expect(page.locator("[data-keyframe-index='0']")).toHaveCSS("border-color", "rgb(96, 115, 103)");
  await page.locator("#phase-review-status p").evaluate((element) => {
    element.textContent += " This deliberately extended validation explanation exercises wrapping without changing the protected workflow decision.";
  });
  await expectResponsiveGeometry(page, [
    "#phase-review-status", ".phase-declarations", ".phase-assignment-list", ".phase-assignment",
    "#keyframe-overlay-status", ".keyframe-strip", ".keyframe-button"
  ]);

  await page.getByLabel("View", { exact: true }).selectOption("face-on");
  await page.getByLabel("Handedness", { exact: true }).selectOption("right");
  await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
  await page.getByLabel(/I confirm this is one trimmed/).check();
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await page.getByRole("button", { name: "Confirm phase review" }).click();
  await page.getByRole("button", { name: "Open Swing Card export" }).click();
  await expect(page.getByRole("group", { name: "Swing Card contents" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Remote model data disclosure" })).toBeVisible();
  await expect(page.locator("dl.remote-model-disclosure")).toHaveCount(1);
  await page.locator(".swing-card-panel > p").evaluate((element) => {
    element.textContent += " This deliberately long export explanation must remain readable without horizontal scrolling or an unusable panel.";
  });
  await page.locator("#swing-card-action-status").evaluate((element) => {
    element.textContent = "A deliberately long local export status covering download, print, and copy preparation without claiming remote persistence.";
  });
  await page.locator("#remote-model-status").evaluate((element) => {
    element.textContent += " This deliberately long unavailable-provider prerequisite must wrap and remain associated with the disabled control.";
  });
  await expectResponsiveGeometry(page, [
    ".swing-card-panel", ".swing-card-summary", ".swing-card-warning-list", "#swing-card-action-status",
    ".remote-model-panel", ".remote-model-disclosure", ".remote-model-disclosure dd", "#remote-model-status"
  ]);
});
