import { expect, test } from "@playwright/test";

test("Vite preview preserves the production CSP", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content");
  expect(csp).toBe("default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'self' blob:; worker-src 'self' blob:; img-src 'self' blob: data:; media-src 'self' blob:; style-src 'self'; object-src 'none'; base-uri 'self'");
  expect(csp).not.toContain("unsafe-inline");
});
