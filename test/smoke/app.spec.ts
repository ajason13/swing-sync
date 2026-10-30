import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";

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
  await expect(page.getByRole("heading", { name: "Review your swing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Choose a local video" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Use camera" })).toHaveCount(0);
  await expect(page.getByText("Camera recording is unavailable. Choose an existing video from your device.")).toBeVisible();
  await expect(page.locator("[data-workflow-status]")).toHaveText("Safety acknowledgement needed");

  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(beginAnalysis).toBeDisabled();
  await expect(beginAnalysis).toHaveAttribute("aria-describedby", "app-visible-status");
  await expect(page.locator("#app-visible-status")).toHaveText(
    "First analysis is blocked until this acknowledgement is checked."
  );
  await page.getByRole("checkbox").check();
  await expect(page.locator("[data-workflow-status]")).toHaveText("Choose a video");
  await expect(beginAnalysis).toBeDisabled();
  await expect(beginAnalysis).toHaveAttribute("aria-describedby", "app-visible-status");
  await expect(page.locator("#app-visible-status")).toHaveText(
    "Consent recorded locally. Choose a local video to begin analysis."
  );
  await page.locator("#video-file").setInputFiles(poseFixture);
  await expect(beginAnalysis).toBeEnabled();
  await expect(page.locator("[data-workflow-status]")).toHaveText("Ready to analyze");
  await expect(page.locator("#app-visible-status")).toHaveText(
    "Local video selected. It has not been analyzed or persisted."
  );
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
  // Media metadata renders interval controls; finish that render before testing tab order.
  await expect(page.locator("#interval-start")).toBeEnabled();
  await expect(page.locator("[data-video-picker]")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#local-video-preview")).toBeFocused();
  await page.locator("[data-preview-toggle]").focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#interval-start")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#interval-end")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("[data-interval-preview]")).toBeFocused();
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
  const secondary = page.getByRole("button", { name: "Choose a video to analyze" });
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

test("renders and fails closed when the localStorage getter is denied at startup", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("private storage failure details", "SecurityError");
      }
    });
  });
  await page.reload();

  await expect(page.getByRole("heading", { name: "Safety acknowledgement", exact: true })).toBeVisible();
  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(consent).not.toBeChecked();
  await expect(beginAnalysis).toBeDisabled();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await consent.click();
  await expect(consent).not.toBeChecked();
  await expect(beginAnalysis).toBeDisabled();
  await expect(page.locator("#app-visible-status")).toContainText("Check browser storage settings and try again");
  await expect(page.locator("#app-announcer")).toContainText("Safety acknowledgement could not be recorded");

  await page.getByRole("button", { name: "Clear local app data" }).click();
  await expect(page.locator("#app-visible-status")).toContainText("Check browser storage settings and try again");
  await expect(consent).not.toBeChecked();
  await expect(beginAnalysis).toBeDisabled();
  await expect(page.locator("#app")).not.toContainText(/SecurityError|private storage failure details/);
  expect(pageErrors).toEqual([]);
  expect(consoleMessagesFor(page).join("\n")).not.toMatch(/SecurityError|private storage failure details/);
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

  await page.getByRole("button", { name: "Clear local app data" }).click();
  await expect(consent).not.toBeChecked();
  await expect(beginAnalysis).toBeDisabled();
  await expect(page.locator("#app-visible-status")).toContainText("could not clear all local app data");
  await expect(page.locator("#app-announcer")).toContainText("could not clear all local app data");
  await expect(page.locator("#app-visible-status")).not.toContainText("SecurityError");
});

test("clears registered local app data and remains cleared after refresh", async ({ page }) => {
  const consent = page.getByRole("checkbox");
  await consent.check();
  await expect(consent).toBeChecked();

  await page.getByRole("button", { name: "Clear local app data" }).click();

  await expect(consent).not.toBeChecked();
  await expect(page.getByRole("button", { name: "Begin analysis" })).toBeDisabled();
  await expect(page.locator("#app-visible-status")).toContainText("Local Swing Sync user state was cleared");
  await expect(page.locator("#app-announcer")).toContainText("Local Swing Sync user state was cleared");
  await expect(page.locator("#safety-consent")).toBeFocused();
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);

  await page.reload();
  await expect(consent).not.toBeChecked();
  await expect(page.getByRole("button", { name: "Begin analysis" })).toBeDisabled();
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
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
  await expect(page.getByRole("heading", { name: "Choose a local video" })).toBeVisible();
});

test("shows actionable empty states without unavailable feature mockups", async ({ page }, testInfo) => {
  if (testInfo.project.name === "mobile-chromium") await page.setViewportSize({ width: 320, height: 800 });
  await expect(page.getByRole("group", { name: "Local video source" })).toBeVisible();
  for (const [buttonName, headingName, status] of [
    ["Process", "Processing", "No analysis running"],
    ["Review", "Review", "No frames to review"],
    ["Export", "Export", "No card available"]
  ]) {
    await page.getByRole("button", { name: new RegExp(buttonName) }).click();
    await expect(page.getByRole("heading", { name: headingName, exact: true })).toBeVisible();
    await expect(page.getByText("Local workflow")).toBeVisible();
    await expect(page.locator("[data-workflow-status]")).toHaveText(status);
    await expect(page.locator("[data-step='capture']")).toHaveCount(1);
    await expect(page.locator("#app")).not.toContainText(/SS-\d+|for this story|Future metric readiness|Preview export state|Tempo|Balance|Rotation/);
    await expectResponsiveGeometry(page, [".stage-description", "[data-workflow-status]", ".action-note"]);
    const returnAction = page.getByRole("button", { name: "Choose a video to analyze" });
    await returnAction.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Choose a local video" })).toBeFocused();
    await expect(page.locator("#app-announcer")).toHaveText("Choose a local video opened.");
  }
  await page.getByRole("button", { name: /Process/ }).click();
  await expect(page.getByRole("group", { name: "Local pose processing" })).toBeVisible();
  await expect(page.locator(".processing-mark")).toBeHidden();
  await expect(page.locator("#analysis-video")).toBeHidden();
  await expect(page.getByRole("button", { name: "Stop local analysis" })).toBeHidden();
  await expect(page.getByRole("button", { name: "Retry local analysis" })).toBeHidden();
  await page.getByRole("button", { name: /Review/ }).click();
  await expect(page.getByRole("group", { name: "No frames to review" })).toBeVisible();
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
  await expect(page.locator("[data-workflow-status]")).toHaveText("Loading local model");
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
  await expect(page.locator("[data-workflow-status]")).toHaveText("Ready for review");
  await expect(page.locator(".processing-mark")).toBeHidden();
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
    window.createImageBitmap = async (...arguments_: [ImageBitmapSource, ImageBitmapOptions?] | [ImageBitmapSource, number, number, number, number, ImageBitmapOptions?]) => {
      await gate;
      return Reflect.apply(originalCreateImageBitmap, window, arguments_);
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
    window.createImageBitmap = async (...arguments_: [ImageBitmapSource, ImageBitmapOptions?] | [ImageBitmapSource, number, number, number, number, ImageBitmapOptions?]) => {
      await gate;
      return Reflect.apply(originalCreateImageBitmap, window, arguments_);
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
  await expect(canvas).toHaveAttribute("aria-label", "Annotated keyframe: Address, Sample 1");
  await expect(page.locator("[data-overlay-status]")).toContainText(/Skeleton overlay/);
  await page.locator("[data-keyframe-index='3']").click();
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toHaveAttribute("aria-label", "Annotated keyframe: Top, Sample 4");
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
  await expect(page.locator("[data-workflow-status]")).toHaveText("Review confirmed");
  await expect(page.locator("#phase-review-status p")).toHaveText(
    "Phase review is confirmed. Open Swing Card export to save the reviewed keyframes. Labels remain provisional, Impact remains unconfirmed. Experimental image measurements are shown below; metric values are not exported."
  );
  await expect(page.locator(".phase-review > .action-row .action-note")).toHaveText(
    "Save a PNG, print a card, or copy its prompt from export. Metric values are shown only in review and are not exported."
  );

  await page.getByRole("button", { name: /Export/ }).click();
  await page.getByRole("button", { name: /Review/ }).click();
  await expect(page.getByRole("heading", { name: "Review", exact: true })).toBeVisible();
  await expect(page.getByText("Annotated keyframes")).toBeVisible();
});

test("shows the corrected phase sample consistently in preview and export at desktop and 320px", async ({ page }, testInfo) => {
  if (testInfo.project.name === "mobile-chromium") {
    await page.setViewportSize({ width: 320, height: 720 });
  }
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Review phase labels" }).click();
  await page.getByLabel("View", { exact: true }).selectOption("face-on");
  await page.getByLabel("Handedness", { exact: true }).selectOption("right");
  await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
  await page.getByLabel(/I confirm this is one trimmed/).check();
  const canvas = page.locator("[data-keyframe-canvas]");
  await page.locator("[data-keyframe-index='2']").click();
  const assignedImage = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL());
  await page.locator("[data-keyframe-index='3']").click();
  const originalImage = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL());
  expect(originalImage).not.toBe(assignedImage);
  await page.getByLabel(/I reviewed these provisional labels/).check();
  const assignment = page.locator("[data-phase-index='3']");
  await assignment.selectOption("2");
  await expect(assignment).toBeFocused();
  await expect(page.getByLabel(/I reviewed these provisional labels/)).not.toBeChecked();
  await expect(canvas).toHaveAttribute("aria-label", "Annotated keyframe: Top, Sample 3");
  await expect(page.locator("#keyframe-review-heading")).toHaveText("Top");
  await expect(page.locator(".keyframe-review__heading")).toContainText("Sample 3");
  expect(await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())).toBe(assignedImage);
  await page.locator("[data-keyframe-index='7']").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-keyframe-index='7']")).toBeFocused();
  await page.locator("[data-keyframe-index='3']").click();
  expect(await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())).toBe(assignedImage);
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await page.getByRole("button", { name: "Confirm phase review" }).click();
  await page.getByRole("button", { name: "Open Swing Card export" }).click();
  await page.evaluate(() => {
    window.print = () => {
      Object.assign(window, { __printedKeyframes: [...document.querySelectorAll<HTMLCanvasElement>(
        "[data-swing-card-print-host] canvas"
      )].map((canvas) => canvas.toDataURL()) });
    };
  });
  await page.getByRole("button", { name: "Print / Save as PDF" }).click();
  await expect(page.locator("[data-swing-card-status]")).toContainText("Browser print dialog opened");
  const printed = await page.evaluate(() =>
    (window as typeof window & { __printedKeyframes: string[] }).__printedKeyframes
  );
  expect(printed).toHaveLength(8);
  // Mid-backswing and corrected Top both use sample 3; export redraws at a
  // different size from the responsive review canvas, so compare export tiles.
  expect(printed[3] === printed[2]).toBe(true);
  expect(printed[3] === printed[4]).toBe(false);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  expect((await downloadPromise).suggestedFilename()).toMatch(/\.png$/);
  await expect(page.locator("[data-swing-card-status]")).toHaveText("Swing Card PNG download started.");
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
  await expect(page.locator("[data-workflow-status]")).toHaveText("Ready to export");
  await expect(page.locator("#app")).not.toContainText(/SS-\d+|for this story|Future metric readiness/);
  await expect(page.getByRole("heading", { name: "Remote model review unavailable" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Swing Card contents" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Remote model data disclosure" })).toBeVisible();
  await expect(page.locator("dl.remote-model-disclosure")).toHaveCount(1);
  await expect(page.getByText("No reviewed provider is configured.")).toBeVisible();
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

  await expect(page.getByRole("heading", { name: "Choose a local video" })).toBeVisible();
  await expect(page.locator("#app-announcer")).toContainText("volatile resources were released");
  await expect(page.locator("#app-visible-status")).toContainText("volatile resources were released");
});

test("fails closed and reports a CSP-blocked outbound request", async ({ page }) => {
  // Hold metadata delivery so the CSP violation occurs before a worker session exists.
  await page.evaluate(() => {
    const holdMetadata = (event: Event) => {
      const video = event.target;
      if (!(video instanceof HTMLVideoElement) || video.id !== "analysis-video") return;
      event.stopImmediatePropagation();
      Object.assign(window, {
        __releaseAnalysisMetadata: () => {
          document.removeEventListener("loadedmetadata", holdMetadata, true);
          video.dispatchEvent(new Event("loadedmetadata"));
        }
      });
    };
    document.addEventListener("loadedmetadata", holdMetadata, true);
  });
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect.poll(() => page.evaluate(() => typeof (window as typeof window & {
    __releaseAnalysisMetadata?: () => void;
  }).__releaseAnalysisMetadata)).toBe("function");
  await page.evaluate(() => new Promise<void>((resolve) => {
    document.addEventListener("securitypolicyviolation", () => resolve(), { once: true });
    void fetch("https://example.com/blocked-by-swing-sync-csp").catch(() => undefined);
  }));
  await page.evaluate(() => {
    (window as typeof window & { __releaseAnalysisMetadata(): void }).__releaseAnalysisMetadata();
  });

  await expect(page.getByText(/Local pose analysis stopped \(UNEXPECTED_NETWORK_BLOCKED\)/)).toBeVisible();
  expect(requestsFor(page).filter((url) => url.includes("/models/"))).toEqual([]);
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
  const activePreviewUrl = await page.locator("#local-video-preview").getAttribute("src");
  expect(activePreviewUrl).toBeTruthy();
  expect(urls.revoked).toEqual(urls.created.filter((url) => url !== activePreviewUrl));
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
  await expect(page.getByRole("group", { name: "No frames to review" })).toBeVisible();
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

async function openConfirmedSwingCard(page: Page): Promise<void> {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Review phase labels" }).click();
  await page.getByLabel("View", { exact: true }).selectOption("face-on");
  await page.getByLabel("Handedness", { exact: true }).selectOption("right");
  await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
  await page.getByLabel(/I confirm this is one trimmed/).check();
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await page.getByRole("button", { name: "Confirm phase review" }).click();
  await page.getByRole("button", { name: "Open Swing Card export" }).click();
}

test("exports uncropped portrait keyframes with aligned annotation markers in a real PNG", async ({ page }, testInfo) => {
  await openConfirmedSwingCard(page);
  // Replace only the prepared export bitmaps with generated geometry, not person media.
  // A circle stands in for a composited annotation: it must remain round and centered.
  await page.evaluate(() => {
    const createBitmap = window.createImageBitmap.bind(window);
    window.createImageBitmap = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 360;
      canvas.height = 640;
      const context = canvas.getContext("2d")!;
      context.fillStyle = "#ff0000";
      context.fillRect(0, 0, 360, 640);
      context.fillStyle = "#00ff00";
      context.fillRect(20, 20, 320, 600);
      context.fillStyle = "#00ffff";
      context.beginPath();
      context.arc(180, 320, 60, 0, Math.PI * 2);
      context.fill();
      return createBitmap(canvas);
    };
  });
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  const download = await downloadPromise;
  const artifact = testInfo.outputPath("portrait-swing-card.png");
  await download.saveAs(artifact);
  await testInfo.attach("portrait Swing Card PNG", { path: artifact, contentType: "image/png" });
  const png = await readFile(artifact);
  expect([...png.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  const geometry = await page.evaluate(async (bytes) => {
    // Decode the downloaded bytes with the native image decoder.
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "image/png" }));
    });
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d")!;
    context.drawImage(image, 0, 0);
    URL.revokeObjectURL(image.src);
    const dpr = canvas.width / 960;
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const bounds = (red: number, green: number, blue: number) => {
      let left = Infinity, top = Infinity, right = -1, bottom = -1;
      // First tile only; the remaining rows and labels are covered by unit geometry checks.
      for (let y = 100 * dpr; y < 400 * dpr; y++) {
        for (let x = 40 * dpr; x < 460 * dpr; x++) {
          const offset = (y * canvas.width + x) * 4;
          if (data[offset] === red && data[offset + 1] === green && data[offset + 2] === blue) {
            left = Math.min(left, x); right = Math.max(right, x);
            top = Math.min(top, y); bottom = Math.max(bottom, y);
          }
        }
      }
      return { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 };
    };
    return { width: canvas.width, height: canvas.height, dpr, frame: bounds(255, 0, 0), marker: bounds(0, 255, 255) };
  }, [...png]);
  expect(geometry.height / geometry.dpr).toBe(1600);
  expect(Math.abs(geometry.frame.width - 132.75 * geometry.dpr)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.frame.height - 236 * geometry.dpr)).toBeLessThanOrEqual(1);
  expect((geometry.frame.left + geometry.frame.right + 1) / (2 * geometry.dpr)).toBeCloseTo(250, 0);
  expect(Math.abs(geometry.marker.width - geometry.marker.height)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.marker.left + geometry.marker.right - geometry.frame.left - geometry.frame.right)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.marker.top + geometry.marker.bottom - geometry.frame.top - geometry.frame.bottom)).toBeLessThanOrEqual(1);
  expect(externalRequests(requestsFor(page))).toEqual([]);
});

test("recovers all Swing Card actions after partial canvas preparation failure", async ({ page }) => {
  await openConfirmedSwingCard(page);
  for (const [selector, failure] of [
    ["[data-download-swing-card]", "LOCAL_EXPORT_FAILED"],
    ["[data-print-swing-card]", "Browser print view could not be prepared."],
    ["[data-copy-swing-card-prompt]", "Prompt copy unavailable in this browser."]
  ]) {
    await page.evaluate(() => {
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      const originalCreate = window.createImageBitmap.bind(window);
      const closes: number[] = [];
      let calls = 0;
      Object.assign(window, { __partialExportCloses: closes });
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof originalGetContext>) {
        if (++calls === 3) {
          HTMLCanvasElement.prototype.getContext = originalGetContext;
          throw new Error("private preparation detail");
        }
        return originalGetContext.apply(this, args);
      } as typeof originalGetContext;
      window.createImageBitmap = async (...args: [ImageBitmapSource, ImageBitmapOptions?] | [ImageBitmapSource, number, number, number, number, ImageBitmapOptions?]) => {
        const bitmap = await Reflect.apply(originalCreate, window, args);
        const index = closes.push(0) - 1;
        const close = bitmap.close.bind(bitmap);
        bitmap.close = () => { closes[index] += 1; close(); };
        if (closes.length === 2) window.createImageBitmap = originalCreate;
        return bitmap;
      };
    });
    await page.locator(selector).click();
    await expect(page.locator("#swing-card-action-status")).toContainText(failure);
    await expect(page.locator(selector)).toBeEnabled();
    await expect(page.locator(selector)).toBeFocused();
    expect(await page.evaluate(() => (window as typeof window & { __partialExportCloses: number[] }).__partialExportCloses)).toEqual([1, 1]);
    expect(consoleMessagesFor(page).join("\n")).not.toContain("private preparation detail");
  }
});

test("cancels pending Swing Card actions on navigation and clear-local-data", async ({ page }) => {
  await openConfirmedSwingCard(page);
  const downloads: string[] = [];
  page.on("download", (download) => downloads.push(download.suggestedFilename()));
  for (const [index, selector] of ["[data-download-swing-card]", "[data-print-swing-card]", "[data-copy-swing-card-prompt]"].entries()) {
    await page.evaluate(() => {
      const originalCreate = window.createImageBitmap.bind(window);
      let release!: () => void;
      const gate = new Promise<void>((resolveGate) => { release = resolveGate; });
      const effects = { print: 0, copy: 0, created: 0, closed: 0 };
      Object.assign(window, { __exportEffects: effects, __releasePendingExport: release });
      window.print = () => { effects.print += 1; };
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { effects.copy += 1; } } });
      window.createImageBitmap = async (...args: [ImageBitmapSource, ImageBitmapOptions?] | [ImageBitmapSource, number, number, number, number, ImageBitmapOptions?]) => {
        await gate;
        const bitmap = await Reflect.apply(originalCreate, window, args);
        effects.created += 1;
        const close = bitmap.close.bind(bitmap);
        bitmap.close = () => { effects.closed += 1; close(); };
        return bitmap;
      };
      Object.assign(window, { __restoreExportBitmap: () => { window.createImageBitmap = originalCreate; } });
    });
    await page.locator(selector).click();
    await expect(page.locator(selector)).toBeDisabled();
    if (index === 2) await page.locator("#clear-local-data").click();
    else {
      await page.locator("[data-step='review']").click();
      await page.getByRole("button", { name: "Open Swing Card export" }).click();
    }
    await expect(page.locator("#app-announcer")).toContainText(index === 2 ? "Local Swing Sync user state was cleared" : "Swing Card export opened.");
    const status = await page.locator("#app-announcer").textContent();
    await page.evaluate(() => (window as typeof window & { __releasePendingExport: () => void }).__releasePendingExport());
    await expect.poll(() => page.evaluate(() => (window as typeof window & { __exportEffects: { closed: number } }).__exportEffects.closed)).toBe(1);
    expect(await page.evaluate(() => (window as typeof window & { __exportEffects: unknown }).__exportEffects)).toEqual({ print: 0, copy: 0, created: 1, closed: 1 });
    expect(downloads).toEqual([]);
    await expect(page.locator("#app-announcer")).toHaveText(status ?? "");
    await page.evaluate(() => (window as typeof window & { __restoreExportBitmap: () => void }).__restoreExportBitmap());
    if (index < 2) await expect(page.locator(selector)).toBeEnabled();
    else await expect(page.getByRole("button", { name: "Begin analysis" })).toBeDisabled();
  }
});

for (const operation of ["load", "seek"] as const) {
  test(`recovers from a stalled media ${operation} with a fresh local retry`, async ({ page }) => {
    await page.clock.install();
    await page.evaluate((operation) => {
      const originalAdd = HTMLMediaElement.prototype.addEventListener;
      const originalRevoke = URL.revokeObjectURL;
      const control = { stall: true, revoked: 0 };
      Object.assign(window, { __mediaStall: control });
      URL.revokeObjectURL = (url) => {
        control.revoked += 1;
        originalRevoke.call(URL, url);
      };
      HTMLMediaElement.prototype.addEventListener = function (
        type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions
      ) {
        if (control.stall && type === (operation === "load" ? "loadedmetadata" : "seeked")) {
          this.dataset.mediaWaitStalled = "true";
          return;
        }
        originalAdd.call(this, type, listener, options);
      };
    }, operation);
    await page.getByRole("checkbox").check();
    await page.locator("#video-file").setInputFiles(poseFixture);
    await page.getByRole("button", { name: "Begin analysis" }).click();
    await expect(page.locator("#analysis-video")).toHaveAttribute("data-media-wait-stalled", "true", {
      timeout: 20_000
    });
    await page.clock.fastForward(30_000);
    const code = operation === "load" ? "MEDIA_LOAD_TIMEOUT" : "MEDIA_SEEK_TIMEOUT";
    await expect(page.locator("#processing-status")).toContainText(`Local pose analysis stopped (${code})`);
    await expect(page.getByRole("button", { name: "Retry local analysis" })).toBeVisible();
    await expect(page.locator("#analysis-video")).not.toHaveAttribute("src");
    await expect(page.locator("[data-pose-summary]")).toContainText(
      operation === "load" ? "0 of 0 video frames processed" : "0 of 8 video frames processed"
    );
    expect(await page.evaluate(() =>
      (window as typeof window & { __mediaStall: { revoked: number } }).__mediaStall.revoked
    )).toBe(2);
    await page.evaluate(() => {
      (window as typeof window & { __mediaStall: { stall: boolean } }).__mediaStall.stall = false;
    });
    await page.getByRole("button", { name: "Retry local analysis" }).click();
    await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", {
      timeout: 30_000
    });
    expect(externalRequests(requestsFor(page))).toEqual([]);
  });
}

for (const stage of ["init", "inference", "shutdown"] as const) {
  test(`bounds silent worker ${stage} and recovers locally`, async ({ page }) => {
    await page.clock.install();
    await page.evaluate((stage) => {
      const control = { silence: true, observed: "", terminated: 0 };
      Object.assign(window, { __workerStall: control });
      const OriginalWorker = window.Worker;
      window.Worker = class extends OriginalWorker {
        constructor(url: string | URL, options?: WorkerOptions) {
          super(url, options);
          // Intercept only delivery to the application. The real worker still
          // owns and closes transferred bitmaps as in normal inference.
        }
        override addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
          if (type !== "message") return super.addEventListener(type, listener, options);
          super.addEventListener(type, (event: MessageEvent) => {
            if (control.silence && event.data.type === (stage === "init" ? "ready" : stage === "inference" ? "result" : "torn-down")) {
              control.observed = event.data.type;
              return;
            }
            if (typeof listener === "function") listener.call(this, event);
            else listener.handleEvent(event);
          }, options);
        }
        override terminate() { control.terminated += 1; super.terminate(); }
      };
    }, stage);
    await page.getByRole("checkbox").check();
    await page.locator("#video-file").setInputFiles(poseFixture);
    await page.getByRole("button", { name: "Begin analysis" }).click();
    if (stage === "shutdown") {
      await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", { timeout: 30_000 });
      await page.locator("#clear-local-data").click();
    }
    await expect.poll(() => page.evaluate(() =>
      (window as typeof window & { __workerStall: { observed: string } }).__workerStall.observed
    ), { timeout: 30_000 }).toBe(stage === "init" ? "ready" : stage === "inference" ? "result" : "torn-down");
    await page.clock.fastForward(stage === "init" ? 60_000 : stage === "inference" ? 30_000 : 2_000);
    if (stage === "shutdown") {
      await expect(page.locator("#app-announcer")).toContainText("Local Swing Sync user state was cleared");
      await expect(page.locator("#video-file")).toHaveValue("");
      await expect(page.getByRole("button", { name: "Begin analysis" })).toBeDisabled();
    } else {
      await expect(page.locator("#processing-status")).toContainText(stage === "init" ? "WORKER_INIT_TIMEOUT" : "WORKER_INFERENCE_TIMEOUT");
    }
    if (stage === "shutdown") await expect(page.locator("#analysis-video")).toHaveCount(0);
    else await expect(page.locator("#analysis-video")).not.toHaveAttribute("src");
    expect(await page.evaluate(() =>
      (window as typeof window & { __workerStall: { terminated: number } }).__workerStall.terminated
    )).toBe(1);
    await page.evaluate(() => {
      (window as typeof window & { __workerStall: { silence: boolean } }).__workerStall.silence = false;
    });
    if (stage === "shutdown") {
      await page.getByRole("checkbox").check();
      await page.locator("#video-file").setInputFiles(poseFixture);
      await page.getByRole("button", { name: "Begin analysis" }).click();
    } else await page.getByRole("button", { name: "Retry local analysis" }).click();
    await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", { timeout: 30_000 });
    // Exercise Stop while the initialized worker withholds its shutdown reply.
    if (stage === "shutdown") {
      await page.evaluate(() => {
        const control = (window as typeof window & { __workerStall: { silence: boolean; observed: string } }).__workerStall;
        control.silence = true; control.observed = "";
      });
      await page.getByRole("button", { name: "Stop local analysis" }).click();
      await expect.poll(() => page.evaluate(() =>
        (window as typeof window & { __workerStall: { observed: string } }).__workerStall.observed
      )).toBe("torn-down");
      await page.clock.fastForward(2_000);
      await expect(page.locator("#app-announcer")).toContainText("Local analysis stopped and volatile resources were released.");
    }
    expect(externalRequests(requestsFor(page))).toEqual([]);
    expectNoSensitiveOutput(consoleMessagesFor(page).join("\n"));
    await expectNoBrowserStorage(page);
  });
}

test("previews and pauses a local clip before model initialization with keyboard and narrow controls", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.locator("#video-file").setInputFiles(poseFixture);
  const video = page.getByLabel("Local video preview", { exact: true });
  const play = page.getByRole("button", { name: "Play preview", exact: true });
  await expect(play).toBeEnabled();
  expect(requestsFor(page).filter((url) => /pose_landmarker|\.wasm|pose-worker/.test(url))).toEqual([]);
  await play.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Pause preview", exact: true })).toBeEnabled();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  await page.keyboard.press("Space");
  await expect(play).toBeEnabled();
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  // A consent render preserves the decoded element and current position.
  await video.evaluate((element: HTMLVideoElement) => { element.currentTime = 0.5; });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.seeking)).toBe(false);
  const url = await video.getAttribute("src");
  await page.getByRole("checkbox").check();
  await expect(video).toHaveAttribute("src", url!);
  expect(await video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeCloseTo(0.5, 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(externalRequests(requestsFor(page))).toEqual([]);
  await expectNoBrowserStorage(page);
});

test("releases local preview on replacement clearing navigation and analysis without stale clip callbacks", async ({ page }) => {
  await page.evaluate(() => {
    const revoke = URL.revokeObjectURL;
    const revoked: string[] = [];
    Object.assign(window, { __previewRevoked: revoked, __oldPreview: undefined });
    URL.revokeObjectURL = (url) => { revoked.push(url); revoke.call(URL, url); };
  });
  const video = page.locator("#local-video-preview");
  const revoked = () => page.evaluate(() => (window as typeof window & { __previewRevoked: string[] }).__previewRevoked);
  await page.locator("#video-file").setInputFiles(poseFixture);
  await expect(page.getByRole("button", { name: "Play preview", exact: true })).toBeEnabled();
  const firstUrl = await video.getAttribute("src");
  await page.evaluate(() => Object.assign(window, { __oldPreview: document.querySelector("#local-video-preview") }));
  await page.locator("#video-file").setInputFiles(poseFixture);
  await expect(page.getByRole("button", { name: "Play preview", exact: true })).toBeEnabled();
  expect(await revoked()).toEqual([firstUrl]);
  await page.evaluate(() => {
    const old = (window as typeof window & { __oldPreview: HTMLVideoElement }).__oldPreview;
    if (old.hasAttribute("src") || !old.paused) throw new Error("Old preview still owns media");
    old.dispatchEvent(new Event("error"));
    old.dispatchEvent(new Event("loadeddata"));
  });
  await expect(page.locator("#local-preview-status")).toContainText("Preview ready");
  const secondUrl = await video.getAttribute("src");
  await page.locator("[data-step='review']").click();
  expect(await revoked()).toEqual([firstUrl, secondUrl]);
  await expect(video).toHaveCount(0);
  await page.locator("[data-step='capture']").click();
  await expect(page.getByRole("button", { name: "Play preview", exact: true })).toBeEnabled();
  const thirdUrl = await video.getAttribute("src");
  await page.getByRole("button", { name: "Clear local app data" }).click();
  expect(await revoked()).toEqual([firstUrl, secondUrl, thirdUrl]);
  await expect(video).toHaveCount(0);
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await expect(page.getByRole("button", { name: "Play preview", exact: true })).toBeEnabled();
  const fourthUrl = await video.getAttribute("src");
  await page.getByRole("button", { name: "Begin analysis" }).click();
  expect(await revoked()).toContain(fourthUrl);
  await expect(video).toHaveCount(0);
  await expect(page.locator("#processing-status")).toContainText("Local frame processing completed", { timeout: 20_000 });
});

test("shows accessible local preview decode guidance and recovers by replacing an unreadable clip", async ({ page }) => {
  await page.locator("#video-file").setInputFiles({ name: "unreadable.webm", mimeType: "video/webm", buffer: Buffer.from("invalid synthetic input") });
  await expect(page.locator("#local-preview-status")).toHaveAttribute("role", "status");
  await expect(page.locator("#local-preview-status")).toContainText("Choose another local video");
  await expect(page.locator("#local-preview-status")).toContainText("PREVIEW_LOAD_FAILED");
  await expect(page.getByRole("button", { name: "Play preview", exact: true })).toBeDisabled();
  await expect(page.locator("#local-video-preview")).not.toHaveAttribute("src");
  expect(requestsFor(page).filter((url) => /pose_landmarker|\.wasm|pose-worker/.test(url))).toEqual([]);
  await page.locator("#video-file").setInputFiles(poseFixture);
  await expect(page.getByRole("button", { name: "Play preview", exact: true })).toBeEnabled();
  expect(externalRequests(requestsFor(page))).toEqual([]);
  expectNoSensitiveOutput(consoleMessagesFor(page).join("\n"));
});

test("analyzes the initial frame after preview when the processing video starts below the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 600 });
  await page.evaluate(() => {
    const create = window.createImageBitmap.bind(window);
    const observations: { offscreen: boolean; atStart: boolean }[] = [];
    Object.assign(window, { __initialFrameObservations: observations });
    window.createImageBitmap = ((...args: Parameters<typeof createImageBitmap>) => {
      const source = args[0];
      if (source instanceof HTMLVideoElement && source.id === "analysis-video" && observations.length === 0) {
        observations.push({ offscreen: source.getBoundingClientRect().top >= innerHeight, atStart: source.currentTime === 0 });
      }
      return (create as (...args: Parameters<typeof createImageBitmap>) => Promise<ImageBitmap>)(...args);
    }) as typeof createImageBitmap;
  });
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Play preview", exact: true }).click();
  await page.getByRole("button", { name: "Pause preview", exact: true }).click();
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", { timeout: 30_000 });
  expect(await page.evaluate(() => (window as typeof window & {
    __initialFrameObservations: { offscreen: boolean; atStart: boolean }[];
  }).__initialFrameObservations)).toEqual([{ offscreen: true, atStart: true }]);
  expect(externalRequests(requestsFor(page))).toEqual([]);
  expectNoSensitiveOutput(consoleMessagesFor(page).join("\n"));
});

test("bounds preview loading and releases media across page exit and restore", async ({ page }) => {
  await page.clock.install();
  await page.evaluate(() => {
    const add = HTMLMediaElement.prototype.addEventListener;
    Object.assign(window, { __stallPreviewReady: true });
    HTMLMediaElement.prototype.addEventListener = function (
      type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions
    ) {
      if (this.id === "local-video-preview" && type === "loadeddata" &&
        (window as typeof window & { __stallPreviewReady: boolean }).__stallPreviewReady) return;
      add.call(this, type, listener, options);
    };
  });
  await page.locator("#video-file").setInputFiles(poseFixture);
  await expect(page.locator("#local-preview-status")).toContainText("Loading");
  await page.clock.fastForward(30_000);
  await expect(page.locator("#local-preview-status")).toContainText("PREVIEW_LOAD_TIMEOUT");
  await expect(page.locator("#local-video-preview")).not.toHaveAttribute("src");
  await page.evaluate(() => { (window as typeof window & { __stallPreviewReady: boolean }).__stallPreviewReady = false; });
  await page.locator("#video-file").setInputFiles(poseFixture);
  await expect(page.getByRole("button", { name: "Play preview", exact: true })).toBeEnabled();
  const originalUrl = await page.locator("#local-video-preview").getAttribute("src");
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true })));
  await expect(page.locator("#local-video-preview")).not.toHaveAttribute("src");
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
  await expect(page.getByRole("button", { name: "Play preview", exact: true })).toBeEnabled();
  await expect(page.locator("#local-video-preview")).not.toHaveAttribute("src", originalUrl!);
  expect(externalRequests(requestsFor(page))).toEqual([]);
});

test("previews a selected interval and analyzes only its source times with invalidation at narrow width", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.evaluate(() => {
    const requests: number[] = [];
    const seeks: number[] = [];
    Object.assign(window, { __intervalEvidence: { requests, seeks } });
    const OriginalWorker = window.Worker;
    window.Worker = class extends OriginalWorker {
      override postMessage(message: unknown, options?: Transferable[] | StructuredSerializeOptions) {
        const frame = message as { type?: string; timestampMs?: number };
        if (frame.type === "frame") requests.push(frame.timestampMs!);
        if (Array.isArray(options)) super.postMessage(message, options);
        else super.postMessage(message, options);
      }
    };
    const create = window.createImageBitmap.bind(window);
    window.createImageBitmap = ((...args: [ImageBitmapSource, ImageBitmapOptions?] | [ImageBitmapSource, number, number, number, number, ImageBitmapOptions?]) => {
      const source = args[0];
      if (source instanceof HTMLVideoElement && source.id === "analysis-video" && args.length === 2) {
        seeks.push(source.currentTime * 1000);
      }
      return Reflect.apply(create, window, args);
    }) as typeof createImageBitmap;
  });
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  const start = page.getByLabel("Start (seconds)", { exact: true });
  const end = page.getByLabel("End (seconds)", { exact: true });
  const begin = page.getByRole("button", { name: "Begin analysis", exact: true });
  await expect(start).toBeEnabled();
  await start.fill("0.6");
  await start.press("Tab");
  await expect(end).toBeFocused();
  await end.fill("0.2");
  await end.press("Tab");
  await expect(begin).toBeDisabled();
  await expect(page.locator("#interval-status")).toContainText("Analysis is blocked");
  await expect(page.getByRole("button", { name: "Preview interval", exact: true })).toBeDisabled();
  await start.fill("");
  await start.press("Tab");
  await expect(begin).toBeDisabled();
  await start.fill("0.2");
  await start.press("Tab");
  await end.fill("0.6");
  await end.press("Tab");
  await expect(begin).toBeEnabled();
  await page.getByRole("button", { name: "Preview interval", exact: true }).focus();
  await page.keyboard.press("Enter");
  const video = page.locator("#local-video-preview");
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThanOrEqual(0.2);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  expect(await video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeCloseTo(0.6, 2);
  expect(requestsFor(page).filter((url) => /pose_landmarker|\.wasm|pose-worker/.test(url))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await begin.click();
  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", { timeout: 30_000 });
  const evidence = await page.evaluate(() => (window as typeof window & {
    __intervalEvidence: { requests: number[]; seeks: number[] };
  }).__intervalEvidence);
  expect(evidence.requests).toEqual([200, 257, 314, 371, 428, 485, 542, 599]);
  expect(evidence.seeks).toHaveLength(8);
  evidence.seeks.forEach((time, index) => expect(time).toBeCloseTo(evidence.requests[index], 2));
  await page.getByRole("button", { name: "Review phase labels", exact: true }).click();
  await expect(page.locator("[data-phase-index]")).toHaveCount(8);
  await page.locator("[data-step='capture']").click();
  await expect(start).toHaveValue("0.2");
  await expect(end).toHaveValue("0.6");
  await start.fill("0.3");
  await start.press("Tab");
  await page.locator("[data-step='export']").click();
  await expect(page.getByRole("heading", { name: "Swing Card unavailable" })).toBeVisible();
  await page.locator("[data-step='capture']").click();
  await expect(start).toHaveValue("0.3");
  await begin.click();
  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", { timeout: 30_000 });
  const rerun = await page.evaluate(() => (window as typeof window & { __intervalEvidence: { requests: number[] } }).__intervalEvidence.requests.slice(8));
  expect(rerun).toHaveLength(8);
  expect(rerun[0]).toBe(300);
  expect(rerun.at(-1)).toBe(599);
  await page.getByRole("button", { name: "Clear local app data" }).click();
  await expect(start).toHaveCount(0);
  expect(externalRequests(requestsFor(page))).toEqual([]);
  expectNoSensitiveOutput(consoleMessagesFor(page).join("\n"));
  await expectNoBrowserStorage(page);
});

test("waits for current frame data after a settled zero-time seek before reading local bitmaps", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 600 });
  await page.evaluate(() => {
    const evidence = { held: false, released: false, reads: [] as number[] };
    Object.assign(window, { __currentDataEvidence: evidence });
    const add = HTMLMediaElement.prototype.addEventListener;
    const readyState = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "readyState")!.get!;
    let firstSeek = true;
    HTMLMediaElement.prototype.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
      if (this.id !== "analysis-video" || type !== "seeked") return add.call(this, type, listener, options);
      const video = this;
      add.call(this, type, (event) => {
        if (firstSeek) {
          firstSeek = false;
          evidence.held = true;
          Object.defineProperty(video, "readyState", { configurable: true, get: () => evidence.held ? 1 : readyState.call(video) });
          setTimeout(() => {
            evidence.held = false;
            evidence.released = true;
            video.dispatchEvent(new Event("loadeddata"));
          }, 50);
        }
        if (typeof listener === "function") listener.call(video, event);
        else listener.handleEvent(event);
      }, { once: true });
    };
    const create = window.createImageBitmap.bind(window);
    window.createImageBitmap = ((...args: [ImageBitmapSource, ImageBitmapOptions?] | [ImageBitmapSource, number, number, number, number, ImageBitmapOptions?]) => {
      if (args[0] instanceof HTMLVideoElement && args[0].id === "analysis-video") evidence.reads.push(args[0].readyState);
      return Reflect.apply(create, window, args);
    }) as typeof createImageBitmap;
  });
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", { timeout: 30_000 });
  const evidence = await page.evaluate(() => (window as typeof window & {
    __currentDataEvidence: { released: boolean; reads: number[] };
  }).__currentDataEvidence);
  expect(evidence.released).toBe(true);
  expect(evidence.reads).toHaveLength(16);
  expect(evidence.reads.every((state) => state >= 2)).toBe(true);
  expect(externalRequests(requestsFor(page))).toEqual([]);
  expectNoSensitiveOutput(consoleMessagesFor(page).join("\n"));
});

test("selects new event times with paired local inference and consistent moving-frame review and exports", async ({ page }, testInfo) => {
  if (testInfo.project.name === "mobile-chromium") await page.setViewportSize({ width: 320, height: 720 });
  await page.evaluate(() => {
    const times: number[] = [];
    Object.assign(window, { __eventTimes: times });
    const post = Worker.prototype.postMessage;
    Worker.prototype.postMessage = function(message: { type?: string; timestampMs?: number }, ...rest: unknown[]) {
      if (message.type === "frame") times.push(message.timestampMs!);
      return Reflect.apply(post, this, [message, ...rest]);
    };
  });
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.locator("[data-review-phases]")).toBeVisible({ timeout: 30_000 });
  await completePhaseReview(page);
  await page.locator("[data-keyframe-index='3']").click();
  const canvas = page.locator("[data-keyframe-canvas]");
  const original = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  const time = page.getByLabel("Source time (seconds)", { exact: true });
  await time.fill("0.730");
  await page.getByRole("button", { name: "Use time for Top", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#event-frame-status")).toContainText("Selected event frame assigned", { timeout: 30_000 });
  await expect(time).toBeFocused();
  await expect(canvas).toHaveAttribute("aria-label", "Annotated keyframe: Top, Selected event");
  await expect(page.locator(".keyframe-review__heading")).toContainText("Requested 0.730 s; observed seek 0.730 s.");
  await expect(page.getByLabel(/I reviewed these provisional labels/)).not.toBeChecked();
  await expect(page.locator("#phase-review-heading")).toHaveText("Review required");
  const selected = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  expect(selected).not.toBe(original);
  await page.getByRole("button", { name: "Earlier (0.033 s)", exact: true }).click();
  await expect(time).toHaveValue("0.697", { timeout: 30_000 });
  await expect(page.locator("#event-frame-status")).toContainText("Selected event frame assigned");
  await expect(page.locator(".keyframe-review__heading")).toContainText("Requested 0.697 s");
  // Repeated events have explicit semantics and both phase images agree.
  await time.fill("0.73");
  await page.getByRole("button", { name: "Use time for Top", exact: true }).click();
  await expect(page.locator("#event-frame-status")).toContainText("Selected event frame assigned", { timeout: 30_000 });
  await page.locator("[data-keyframe-index='2']").click();
  await time.fill("0.73");
  await page.getByRole("button", { name: "Use time for Mid-backswing", exact: true }).click();
  await expect(page.locator("#event-frame-status")).toContainText("Selected event frame assigned", { timeout: 30_000 });
  expect(await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL())).toBe(selected);
  await expect(page.locator("#phase-order-status")).toContainText("Reusing a time is allowed");
  await expect(page.locator("#phase-order-status")).toContainText("Impact remains unconfirmed");
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await page.getByRole("button", { name: "Confirm phase review" }).click();
  await expect(page.locator("#phase-review-heading")).toHaveText("Phase review confirmed");
  // A confirmed review remains editable; decreasing times lock confirmation.
  await time.fill("1.9");
  await page.getByRole("button", { name: "Use time for Mid-backswing", exact: true }).click();
  await expect(page.locator("#event-frame-status")).toContainText("Selected event frame assigned", { timeout: 30_000 });
  await expect(page.locator("#phase-order-status")).toContainText("nondecreasing source times");
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await expect(page.getByRole("button", { name: "Confirm phase review" })).toBeDisabled();
  await time.fill("0.73");
  await page.getByRole("button", { name: "Use time for Mid-backswing", exact: true }).click();
  await expect(page.locator("#event-frame-status")).toContainText("Selected event frame assigned", { timeout: 30_000 });
  await expectResponsiveGeometry(page, [".event-frame-controls", "#event-frame-help", "#event-frame-status", "#phase-order-status"]);
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await page.getByRole("button", { name: "Confirm phase review" }).click();
  await page.getByRole("button", { name: "Open Swing Card export" }).click();
  await page.evaluate(() => {
    window.print = () => Object.assign(window, { __eventPrint: [...document.querySelectorAll<HTMLCanvasElement>("[data-swing-card-print-host] canvas")].map(c => c.toDataURL()) });
  });
  await page.getByRole("button", { name: "Print / Save as PDF" }).click();
  await expect(page.locator("[data-swing-card-status]")).toContainText("Browser print dialog opened");
  const printed = await page.evaluate(() => (window as typeof window & { __eventPrint: string[] }).__eventPrint);
  expect(printed).toHaveLength(8);
  expect(printed[2]).toBe(printed[3]);
  expect(printed[3]).not.toBe(printed[4]);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  expect((await download).suggestedFilename()).toMatch(/\.png$/);
  const times = await page.evaluate(() => (window as typeof window & { __eventTimes: number[] }).__eventTimes);
  expect(times.slice(0, 8)).not.toContain(730);
  expect(times.slice(8)).toEqual([730, 697, 730, 730, 1900, 730]);
  await page.getByRole("button", { name: "Clear local app data" }).click();
  await expect(page.locator("#event-time")).toHaveCount(0);
  expect(externalRequests(requestsFor(page))).toEqual([]);
  expectNoSensitiveOutput(consoleMessagesFor(page).join("\n"));
  await expectNoBrowserStorage(page);
});

test("stops a pending event selection and releases it on navigation without restoring stale confirmation", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.locator("[data-review-phases]")).toBeVisible({ timeout: 30_000 });
  await completePhaseReview(page);
  await page.evaluate(() => {
    const post = Worker.prototype.postMessage;
    Worker.prototype.postMessage = function(message: { type?: string; timestampMs?: number; bitmap?: ImageBitmap }, ...rest: unknown[]) {
      if (message.type === "frame" && message.timestampMs === 730) {
        message.bitmap?.close();
        Object.assign(window, { __eventHeld: true });
        return;
      }
      return Reflect.apply(post, this, [message, ...rest]);
    };
  });
  await page.locator("[data-keyframe-index='3']").click();
  await page.getByLabel("Source time (seconds)", { exact: true }).fill("0.73");
  await page.getByRole("button", { name: "Use time for Top", exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as typeof window & { __eventHeld?: boolean }).__eventHeld)).toBe(true);
  await expect(page.locator("[data-open-export]")).toBeDisabled();
  await page.getByRole("button", { name: "Stop frame selection", exact: true }).click();
  await expect(page.locator("#event-frame-status")).toContainText("selection stopped");
  await expect(page.locator("#event-time")).toBeFocused();
  await expect(page.locator("#phase-review-heading")).toHaveText("Review required");
  await expect(page.locator("[data-keyframe-canvas]")).toHaveAttribute("aria-label", "Annotated keyframe: Top, Sample 4");
  await page.getByLabel("Source time (seconds)", { exact: true }).fill("0.73");
  await page.getByRole("button", { name: "Use time for Top", exact: true }).click();
  await page.locator("[data-step='capture']").click();
  await expect(page.locator("#video-file")).toBeAttached();
  await page.locator("[data-step='export']").click();
  await expect(page.getByRole("heading", { name: "Swing Card unavailable" })).toBeVisible();
  expect(externalRequests(requestsFor(page))).toEqual([]);
  expectNoSensitiveOutput(consoleMessagesFor(page).join("\n"));
});

for (const missing of [false, true]) {
  test(`presents ${missing ? "unavailable" : "measured"} review measurements accessibly at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    if (missing) {
      // Keep real local inference; lower only ankle evidence in the returned synthetic pose.
      await page.evaluate(() => {
        const OriginalWorker = window.Worker;
        window.Worker = class extends OriginalWorker {
          constructor(url: string | URL, options?: WorkerOptions) {
            super(url, options);
            this.addEventListener("message", (event: MessageEvent) => {
              if (event.data.type === "result") event.data.landmarks[0][27].visibility = .49;
            });
          }
        };
      });
    }
    await page.getByRole("checkbox").check();
    await page.locator("#video-file").setInputFiles(poseFixture);
    await page.getByRole("button", { name: "Begin analysis" }).click();
    await page.getByRole("button", { name: "Review phase labels" }).click({ timeout: 30_000 });
    const region = page.getByRole("region", { name: "Image measurements", exact: true });
    await expect(region).toHaveAccessibleDescription(/Camera angle, roll, occlusion/);
    await expect(region.locator("[data-review-metric]")).toHaveText(["Unavailable", "Unavailable"]);
    await page.getByLabel("View", { exact: true }).selectOption("face-on");
    await page.getByLabel("Handedness", { exact: true }).selectOption("right");
    await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
    await page.getByLabel(/I confirm this is one trimmed/).focus();
    await page.keyboard.press("Space");
    await page.getByLabel(/I reviewed these provisional labels/).focus();
    await page.keyboard.press("Space");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Confirm phase review" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#phase-review-heading")).toBeFocused();
    const ratio = region.locator('[data-review-metric="address-stance-ratio"]');
    await expect(ratio).toHaveText(missing ? "Unavailable" : /^\d+\.\d{2} ratio$/);
    if (missing) await expect(region).toContainText("lacks usable pose evidence");
    await expect(region.locator('[data-review-metric="top-shoulder-line-angle"]')).toHaveText(/^-?\d+\.\d{2} degrees$/);
    await expect(region).toContainText("Experimental, unvalidated 2D image measurement");
    await expect(region).toContainText("Impact remains unconfirmed");
    await expectResponsiveGeometry(page, [".metric-review", ".metric-review__item", ".metric-review dd", ".metric-review p"]);
    await expect(region.locator(".metric-review__item").nth(0)).toMatchAriaSnapshot(`
      - term: Address stance-width ratio (2D)
      - definition:
        - strong: ${missing ? "Unavailable" : "/[0-9]+[.][0-9]{2} ratio/"}
        - paragraph
        - paragraph: Projected ankle separation relative to shoulder separation in the reviewed Address image.
    `);
    await expect(region.locator(".metric-review__item").nth(1)).toMatchAriaSnapshot(`
      - term: Top shoulder-line angle (2D)
      - definition:
        - strong: /-?[0-9]+[.][0-9]{2} degrees/
        - paragraph: Measured from the reviewed image; evidence is not calibrated.
        - paragraph
    `);
    await page.locator('[data-phase-index="3"]').selectOption("2");
    await expect(region.locator("[data-review-metric]")).toHaveText(["Unavailable", "Unavailable"]);
    await expect(region).toContainText("Confirm the current phase review");
    expect(externalRequests(requestsFor(page))).toEqual([]);
  });
}
