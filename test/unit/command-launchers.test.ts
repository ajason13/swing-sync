import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { runNodeCli, runNpm } from "../../scripts/run-node-cli.js";

const roots: string[] = [];
function tempRoot() {
  const root = mkdtempSync(join(tmpdir(), "swing sync launchers "));
  roots.push(root);
  return root;
}
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("portable CLI invocation", () => {
  it("preserves cwd, output, status, and literal arguments in paths with spaces", () => {
    const root = tempRoot();
    const cli = join(root, "test cli.cjs");
    writeFileSync(cli, 'console.log(JSON.stringify({ cwd: process.cwd(), args: process.argv.slice(2) })); console.error("diagnostic"); process.exit(7);');
    const args = ["space value", "& echo injected", 'quote"value', "%PATH%", "$(echo injected)"];
    const result = runNodeCli(cli, args, { cwd: root });
    expect(result.status).toBe(7);
    expect(JSON.parse(result.stdout)).toEqual({ cwd: realpathSync(root), args });
    expect(result.stderr.trim()).toBe("diagnostic");
  });

  it("reports missing CLIs and spawn failures as tooling failures", () => {
    expect(() => runNodeCli("missing-cli.js")).toThrow("Tooling failure");
    const cli = join(tempRoot(), "exit.cjs");
    writeFileSync(cli, "process.exit(0)");
    expect(() => runNodeCli(cli, [], { cwd: join(tmpdir(), "missing-cwd-for-swing-sync") })).toThrow("Tooling failure");
  });

  it("rejects terminated children instead of treating them as policy failures", () => {
    const cli = join(tempRoot(), "wait.cjs");
    writeFileSync(cli, "setInterval(() => {}, 1000)");
    expect(() => runNodeCli(cli, [], { timeout: 200 })).toThrow("Tooling failure");
  });

  it("runs the actual npm CLI from a project with spaces", () => {
    const root = tempRoot();
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "launcher-test", version: "1.0.0", private: true }));
    const result = runNpm(["ls", "--omit=dev", "--json", "--long"], { cwd: root });
    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout).name).toBe("launcher-test");
  });
});

describe("license fixture failure classification", () => {
  it("checks permitted, GPL and MPL fixtures with the real installed scanner", () => {
    const result = runNodeCli(resolve("scripts/verify-license-fixtures.js"));
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    expect(result.stdout).toContain("as expected");
  }, 30_000);

  it("rejects an unrelated scanner error and a missing scanner entry", () => {
    const root = tempRoot();
    cpSync("scripts", join(root, "scripts"), { recursive: true });
    writeFileSync(join(root, "package.json"), '{"type":"module"}');
    const scannerDir = join(root, "node_modules/@onebeyond/license-checker");
    mkdirSync(scannerDir, { recursive: true });
    writeFileSync(join(scannerDir, "package.json"), '{"main":"cli.cjs"}');
    writeFileSync(join(scannerDir, "cli.cjs"), 'console.error("scanner crashed: GPL-3.0-only"); process.exit(1);');
    const run = () => runNodeCli(join(root, "scripts/verify-license-fixtures.js"), [], { cwd: root });
    const crashed = run();
    expect(crashed.status).toBe(1);
    expect(crashed.stderr).toContain("did not produce the expected");
    rmSync(join(scannerDir, "cli.cjs"));
    expect(run().status).not.toBe(0);
  });

  it("cannot accept a missing npm entry as a successful bundle rejection", () => {
    const result = spawnSync(process.execPath, ["scripts/verify-bundle-license-fixture.js"], {
      encoding: "utf8", env: {
        ...Object.fromEntries(Object.entries(process.env).filter(([key]) => key.toLowerCase() !== "npm_execpath")),
        npm_execpath: join(tempRoot(), "missing-npm-cli.js")
      }
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Tooling failure");
    expect(result.stdout).not.toContain("as expected");
  });
});
