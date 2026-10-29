import { spawnSync } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import { dirname, resolve } from "node:path";

// Keep executable paths and arguments separate: Windows .cmd shims require a
// shell, while the underlying JavaScript CLIs run directly on every host.
export function runNodeCli(entry, args = [], options = {}) {
  if (!existsSync(resolve(options.cwd ?? process.cwd(), entry))) {
    throw new Error(`Tooling failure: CLI entry point is missing: ${entry}`);
  }
  const result = spawnSync(process.execPath, [entry, ...args], {
    encoding: "utf8",
    stdio: "pipe",
    ...options,
    shell: false
  });
  if (result.error || result.signal || result.status === null) {
    throw new Error(`Tooling failure running ${entry}: ${result.error?.message ?? result.signal ?? "no exit status"}`);
  }
  return result;
}

export function runNpm(args, options = {}) {
  // npm sets npm_execpath for lifecycle scripts, including nonstandard installs.
  // The fallbacks support direct `node scripts/...` on standard Node installs.
  const nodeDir = dirname(realpathSync(process.execPath));
  const entry = process.env.npm_execpath ?? [
    resolve(nodeDir, "node_modules/npm/bin/npm-cli.js"),
    resolve(nodeDir, "../lib/node_modules/npm/bin/npm-cli.js")
  ].find(existsSync);
  if (!entry || !existsSync(entry)) {
    throw new Error("Tooling failure: cannot locate npm-cli.js. Run this check through its npm script.");
  }
  return runNodeCli(entry, args, options);
}
