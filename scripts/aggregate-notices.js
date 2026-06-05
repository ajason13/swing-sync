import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const NOTICE_NAMES = ["NOTICE", "NOTICE.txt", "NOTICE.md"];
const targetArg = process.argv.find((arg) => arg.startsWith("--target="));
const targetRoot = resolve(targetArg ? targetArg.slice("--target=".length) : ".");
const outputPath = resolve("dist/THIRD_PARTY_NOTICES.txt");
const rollupNoticePath = resolve("dist/THIRD_PARTY_NOTICES.rollup.txt");
const viteNoticePath = resolve("dist/.vite/license.md");

function collectProductionPackagesFromFixture(root) {
  const packageRoot = join(root, "packages");
  return existsSync(packageRoot)
    ? [{ name: "@swing-sync-test/notice-fixture", path: join(packageRoot, "notice-fixture") }]
    : [];
}

function flattenNpmTree(node, packages = []) {
  if (!node?.dependencies) return packages;

  for (const [name, dependency] of Object.entries(node.dependencies)) {
    if (dependency?.path) {
      packages.push({ name, path: dependency.path });
    }
    flattenNpmTree(dependency, packages);
  }

  return packages;
}

function collectProductionPackages(root) {
  if (targetArg) {
    return collectProductionPackagesFromFixture(root);
  }

  const result = spawnSync("npm", ["ls", "--omit=dev", "--json", "--long"], {
    encoding: "utf8",
    stdio: "pipe"
  });

  if (result.status !== 0 && !result.stdout) {
    console.error(result.stderr);
    throw new Error("Unable to resolve production dependency tree.");
  }

  const tree = JSON.parse(result.stdout);
  return flattenNpmTree(tree);
}

function readExistingNotice() {
  const parts = [];

  for (const path of [viteNoticePath, rollupNoticePath]) {
    if (existsSync(path)) {
      parts.push(readFileSync(path, "utf8").trim());
    }
  }

  if (parts.length === 0) {
    parts.push("Swing Sync third-party notices.");
  }

  return parts.filter(Boolean).join("\n\n");
}

function readNoticeFiles(packages) {
  const seen = new Set();
  const notices = [];

  for (const pkg of packages) {
    for (const noticeName of NOTICE_NAMES) {
      const noticePath = join(pkg.path, noticeName);
      if (!existsSync(noticePath) || seen.has(noticePath)) continue;
      seen.add(noticePath);
      notices.push(`Package: ${pkg.name}\nSource: ${noticePath}\n\n${readFileSync(noticePath, "utf8").trim()}`);
    }
  }

  return notices;
}

const packages = collectProductionPackages(targetRoot);
const upstreamNotices = readNoticeFiles(packages);
const content = [
  readExistingNotice(),
  upstreamNotices.length > 0 ? "Apache NOTICE Aggregation\n\n" + upstreamNotices.join("\n\n---\n\n") : ""
]
  .filter(Boolean)
  .join("\n\n");

mkdirSync(resolve("dist"), { recursive: true });
writeFileSync(outputPath, content + "\n");
console.log(`Wrote ${outputPath}`);
