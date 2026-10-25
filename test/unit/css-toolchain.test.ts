import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { expect, it } from "vitest";

it("builds production CSS while the MPL-licensed Lightning CSS generator is unavailable", async () => {
  const root = await mkdtemp(join(tmpdir(), "swing-sync-css-"));
  try {
    const loader = join(root, "deny-lightningcss.mjs");
    await writeFile(loader, `
      export async function resolve(specifier, context, nextResolve) {
        if (specifier === "lightningcss" || specifier.startsWith("lightningcss/")) {
          throw new Error("Lightning CSS is unavailable in the production toolchain");
        }
        return nextResolve(specifier, context);
      }
    `);
    const registration = `import { register } from "node:module"; register(${JSON.stringify(pathToFileURL(loader).href)});`;
    const run = (script: string) => spawnSync(process.execPath, [
      "--import", `data:text/javascript,${encodeURIComponent(registration)}`,
      "--input-type=module", "--eval", script
    ], { encoding: "utf8", timeout: 20_000 });

    const blocked = run('await import("lightningcss")');
    expect(blocked.status).not.toBe(0);
    expect(blocked.stderr).toContain("Lightning CSS is unavailable");

    await writeFile(join(root, "index.html"), '<link rel="stylesheet" href="/style.css"><p>CSS fixture</p>');
    await writeFile(join(root, "style.css"), ".css-fixture { color: red; padding: 0px 0px 0px 0px; }");
    const built = run(`
      import { build } from "vite";
      const result = await build({
        configFile: ${JSON.stringify(join(process.cwd(), "vite.config.ts"))},
        root: ${JSON.stringify(root)},
        logLevel: "silent",
        build: { write: false }
      });
      const css = result.output.find(asset => asset.type === "asset" && asset.fileName.endsWith(".css"));
      if (!css || !String(css.source).includes(".css-fixture{color:red;padding:0}")) {
        throw new Error("Expected production CSS to be emitted and minified");
      }
    `);
    expect(built.error).toBeUndefined();
    expect(built.status, `${built.stdout}\n${built.stderr}`).toBe(0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}, 30_000);
