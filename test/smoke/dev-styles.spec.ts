import { expect, test, type Browser } from "@playwright/test";
import { resolve } from "node:path";
import { createServer } from "vite";

const cspStyleViolation = /content security policy|style-src|style-src-elem|blocked.*inline/i;

async function expectStyledDevelopmentPage(browser: Browser, width: number): Promise<void> {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  const consoleErrors: string[] = [];
  const cspViolations: Array<{ blockedURI: string; violatedDirective: string }> = [];
  const requests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("request", (request) => requests.push(request.url()));
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      (window as typeof window & { __cspViolations?: unknown[] }).__cspViolations ??= [];
      (window as typeof window & { __cspViolations: unknown[] }).__cspViolations.push({
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective
      });
    });
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Capture or choose your swing" })).toBeVisible();

  for (const selector of ["#app-announcer", "#video-file"]) {
    const styles = await page.locator(selector).evaluate((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return { position: style.position, width: style.width, height: style.height, overflow: style.overflow, clipPath: style.clipPath, whiteSpace: style.whiteSpace, rect: rect.toJSON() };
    });
    expect(styles).toMatchObject({ position: "absolute", width: "1px", height: "1px", clipPath: "inset(50%)", whiteSpace: "nowrap" });
    // Chromium normalizes overflow on native file inputs to clip; both values retain clipping.
    expect(styles.overflow).toMatch(/^(hidden|clip)$/);
    expect(styles.rect.width).toBeLessThanOrEqual(1);
    expect(styles.rect.height).toBeLessThanOrEqual(1);
  }
  const announcer = page.locator("#app-announcer");
  await expect(announcer).toHaveAttribute("role", "status");
  await expect(announcer).not.toHaveAttribute("aria-hidden", "true");
  await expect(announcer).not.toHaveCSS("display", "none");
  expect(JSON.stringify(await page.accessibility.snapshot({ interestingOnly: false }))).toContain('"role":"status"');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  const layout = await page.evaluate(() => ({
    workspaceColumns: getComputedStyle(document.querySelector(".workspace")!).gridTemplateColumns.trim().split(/\s+/).length,
    topbarDirection: getComputedStyle(document.querySelector(".topbar")!).flexDirection
  }));
  expect(layout.workspaceColumns).toBe(width === 320 ? 1 : 2);
  expect(layout.topbarDirection).toBe(width === 320 ? "column" : "row");

  cspViolations.push(...await page.evaluate(() => (window as typeof window & { __cspViolations?: Array<{ blockedURI: string; violatedDirective: string }> }).__cspViolations ?? []));
  expect(cspViolations.filter((violation) => cspStyleViolation.test(`${violation.violatedDirective} ${violation.blockedURI}`))).toEqual([]);
  expect(consoleErrors.filter((message) => cspStyleViolation.test(message))).toEqual([]);
  expect(requests.filter((url) => !url.startsWith("http://127.0.0.1:4173/") && !url.startsWith("blob:"))).toEqual([]);
  await page.close();
}

test("B5: Vite development styling keeps the announcer in the accessibility tree at desktop and 320 CSS pixels", async ({ browser }) => {
  await expectStyledDevelopmentPage(browser, 1280);
  await expectStyledDevelopmentPage(browser, 320);
});

test("B4: hidden-style checks fail against the unfixed strict-CSP development baseline", async ({ browser }) => {
  const server = await createServer({ configFile: false, root: resolve("."), logLevel: "silent", server: { host: "127.0.0.1", port: 0 } });
  try {
    await server.listen();
    const address = server.httpServer?.address();
    if (!address || typeof address === "string") throw new Error("Vite dev server did not expose a TCP address.");
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(`http://127.0.0.1:${address.port}/`);
    await expect(page.locator("#app-announcer")).toHaveCSS("position", "static");
    expect(errors.join("\n")).toMatch(cspStyleViolation);
    await page.close();
  } finally {
    await server.close();
  }
});
