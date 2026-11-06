import { expect, test } from "@playwright/test";
import { resolve } from "node:path";

test("development server completes real local inference with external network blocked", async ({ page, context }) => {
  const external: string[] = [];
  const consoleMessages: string[] = [];
  page.on("console", message => consoleMessages.push(message.text()));
  await page.addInitScript(() => {
    Object.assign(window, { __devCspViolations: [] as string[] });
    document.addEventListener("securitypolicyviolation", event => {
      (window as typeof window & { __devCspViolations: string[] }).__devCspViolations.push(event.violatedDirective);
    });
  });
  const assetResponses: Array<{ path: string; status: number }> = [];
  await context.route("**/*", route => {
    const url = new URL(route.request().url());
    if (url.origin === "http://127.0.0.1:4173" || url.protocol === "blob:") return route.continue();
    external.push(url.origin);
    return route.abort();
  });
  context.on("response", response => {
    const url = new URL(response.url());
    if (url.pathname.startsWith("/mediapipe/") || url.pathname.startsWith("/models/")) {
      assetResponses.push({ path: url.pathname, status: response.status() });
    }
  });
  await page.goto("/");
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(resolve("test/fixtures/pose-landmarker/mannequin-golf-address.webm"));
  await expect(page.locator("#local-preview-status")).toContainText("Preview ready");
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", { timeout: 30_000 });
  await expect(page.locator("[data-pose-summary]")).toContainText("33 normalized landmarks retained");
  expect(external).toEqual([]);
  expect(await page.evaluate(() => (window as typeof window & { __devCspViolations: string[] }).__devCspViolations)).toEqual([]);
  expect(consoleMessages.join("\n")).not.toMatch(/mannequin-golf-address|\b(?:worldLandmarks|landmarks|metricPayload|fileName|objectUrl|requestedTimestampMs)\b|blob:http/i);
  expect(assetResponses).toEqual(expect.arrayContaining([
    { path: "/mediapipe/wasm/vision_wasm_module_internal.js", status: 200 },
    { path: "/mediapipe/wasm/vision_wasm_module_internal.wasm", status: 200 },
    { path: "/models/pose_landmarker_full-float16-v1.task", status: 200 }
  ]));
});
