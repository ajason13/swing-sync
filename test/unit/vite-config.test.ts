import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "vite";
import { describe, expect, it } from "vitest";
import { addDevelopmentStyleSource, createViteConfig } from "../../vite.config";

function cspFrom(html: string): string {
  return html.match(/http-equiv="Content-Security-Policy"[\s\S]*?content="([^"]+)"/)?.[1] ?? "";
}

const productionCsp = cspFrom(readFileSync("index.html", "utf8"));
const indexHtml = `<meta http-equiv="Content-Security-Policy" content="${productionCsp}" />`;
const developmentCsp = productionCsp.replace("style-src 'self'", "style-src 'self' 'unsafe-inline'");

describe("Vite development CSP", () => {
  it("adds inline styles only to the serve-time style-src directive", () => {
    const transformed = addDevelopmentStyleSource(indexHtml);
    expect(cspFrom(transformed)).toBe(developmentCsp);
    expect(addDevelopmentStyleSource(transformed)).toBe(transformed);
  });

  it("fails closed for missing, ambiguous, or incompatible CSP markup", () => {
    expect(() => addDevelopmentStyleSource("<html></html>")).toThrow(/exactly one Content-Security-Policy/);
    expect(() => addDevelopmentStyleSource(`${indexHtml}${indexHtml}`)).toThrow(/exactly one Content-Security-Policy/);
    expect(() => addDevelopmentStyleSource(indexHtml.replace("style-src 'self'", "style-src https:"))).toThrow(/style-src/);
  });

  it("registers the CSP transform for serve only", () => {
    expect(createViteConfig({ command: "serve" }).plugins).toHaveLength(2);
    expect(createViteConfig({ command: "build" }).plugins).toEqual([]);
    const productionHtml = readFileSync("index.html", "utf8");
    expect(productionHtml).toContain("style-src 'self';");
    expect(productionHtml).not.toContain("style-src 'self' 'unsafe-inline'");
  });

  it.each([
    ["missing", "<html><body>missing</body></html>"],
    ["duplicate", `${indexHtml}${indexHtml}`],
    ["incompatible", indexHtml.replace("style-src 'self'", "style-src https:")]
  ])(
    "B2: fails the actual Vite dev-server request for %s CSP HTML",
    async (_fixtureName, html) => {
      // Windows temp paths can use 8.3 aliases, which Vite intentionally rejects.
      const root = await realpath(await mkdtemp(join(tmpdir(), "swing-sync-csp-")));
      await writeFile(join(root, "index.html"), html);
      const server = await createServer({ ...createViteConfig({ command: "serve" }), root, logLevel: "silent", server: { host: "127.0.0.1", port: 0 } });
      try {
        await server.listen();
        const address = server.httpServer?.address();
        if (!address || typeof address === "string") throw new Error("Vite dev server did not expose a TCP address.");
        const response = await fetch(`http://127.0.0.1:${address.port}/`);
        const body = await response.text();
        expect(response.status, body).toBe(500);
        expect(body).toMatch(/Content-Security-Policy/);
      } finally {
        await server.close();
        await rm(root, { recursive: true, force: true });
      }
    }
  );
});

describe("Vite development WASM loader", () => {
  it("serves the pinned module bytes for the SDK import without opening other public imports", async () => {
    const server = await createServer({ ...createViteConfig({ command: "serve" }), configFile: false, logLevel: "silent", server: { host: "127.0.0.1", port: 0 } });
    try {
      await server.listen();
      const address = server.httpServer?.address();
      if (!address || typeof address === "string") throw new Error("Vite dev server did not expose a TCP address.");
      const base = `http://127.0.0.1:${address.port}`;
      const path = "/mediapipe/wasm/vision_wasm_module_internal.js";
      const expectedHash = createHash("sha256").update(readFileSync(`public${path}`)).digest("hex");
      for (const suffix of ["", "?import"]) {
        const response = await fetch(`${base}${path}${suffix}`);
        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toMatch(/javascript/);
        expect(createHash("sha256").update(Buffer.from(await response.arrayBuffer())).digest("hex")).toBe(expectedHash);
      }
      for (const rejected of [
        "/mediapipe/wasm/vision_wasm_internal.js?import",
        `${path}?import&other=1`
      ]) {
        const response = await fetch(`${base}${rejected}`);
        expect(response.status).toBe(500);
        expect(await response.text()).toContain("should not be imported from source code");
      }
    } finally {
      await server.close();
    }
  });
});
