import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { expect, it } from "vitest";
import { runNodeCli } from "../../scripts/run-node-cli.js";

it("excludes the privacy verifier itself while scanning other scripts on every host", () => {
  const root = mkdtempSync(join(tmpdir(), "swing sync privacy "));
  try {
    for (const dir of ["src", "scripts"]) cpSync(dir, join(root, dir), { recursive: true });
    mkdirSync(join(root, "docs"));
    for (const name of ["privacy-architecture.md", "ss-003-research-disposition.md"]) {
      cpSync(join("docs", name), join(root, "docs", name));
    }
    for (const file of ["package.json", "index.html"]) cpSync(file, join(root, file));
    const run = () => runNodeCli(resolve(root, "scripts/verify-privacy-boundaries.js"), [], { cwd: root });
    const clean = run();
    expect(clean.status, clean.stderr).toBe(0);
    expect(clean.stdout).toContain("Privacy architecture and boundary constraints verified.");
    writeFileSync(join(root, "scripts/prohibited-endpoint.js"), 'const endpoint = "https://amplitude.com";');
    const prohibited = run();
    expect(prohibited.status).toBe(1);
    expect(prohibited.stderr).toContain("prohibited-endpoint.js must not match prohibited privacy pattern: Amplitude");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
