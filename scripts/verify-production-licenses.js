import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const allowed = new Set(["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC", "CC0-1.0", "0BSD"]);
const blocked = new Set([
  "GPL-2.0",
  "GPL-2.0-only",
  "GPL-2.0-or-later",
  "GPL-3.0",
  "GPL-3.0-only",
  "GPL-3.0-or-later",
  "AGPL-3.0",
  "AGPL-3.0-only",
  "AGPL-3.0-or-later",
  "LGPL-2.1",
  "LGPL-2.1-only",
  "LGPL-2.1-or-later",
  "LGPL-3.0",
  "LGPL-3.0-only",
  "LGPL-3.0-or-later",
  "MPL-2.0"
]);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function flattenDependencies(node, packages = []) {
  if (!node?.dependencies) return packages;

  for (const [name, dependency] of Object.entries(node.dependencies)) {
    if (dependency?.dev === true || dependency?.extraneous === true) continue;
    packages.push({
      name,
      version: dependency.version,
      license: dependency.license,
      path: dependency.path
    });
    flattenDependencies(dependency, packages);
  }

  return packages;
}

function normalizeLicense(license) {
  if (typeof license === "string") return license.trim();
  if (license?.type) return String(license.type).trim();
  return "";
}

function isAllowedExpression(expression) {
  if (allowed.has(expression)) return true;
  if (blocked.has(expression)) return false;

  const orParts = expression.split(/\s+OR\s+/);
  if (orParts.length > 1) {
    const trimmedParts = orParts.map((part) => part.trim());
    if (trimmedParts.some((part) => blocked.has(part))) {
      return false;
    }
    return trimmedParts.every((part) => allowed.has(part));
  }

  return false;
}

function selfTestLicenseExpressions() {
  const cases = [
    ["MIT", true],
    ["MIT OR Apache-2.0", true],
    ["GPL-3.0-only", false],
    ["GPL-3.0-only OR MIT", false],
    ["MPL-2.0 OR Apache-2.0", false],
    ["Custom-License", false]
  ];

  for (const [expression, expected] of cases) {
    const actual = isAllowedExpression(expression);
    if (actual !== expected) {
      fail(`License expression self-test failed for "${expression}". Expected ${expected}, got ${actual}.`);
    }
  }
}

const result = spawnSync("npm", ["ls", "--omit=dev", "--json", "--long"], {
  encoding: "utf8",
  stdio: "pipe"
});

if (result.status !== 0 && !result.stdout) {
  console.error(result.stderr);
  fail("Unable to resolve production dependency tree.");
}

const tree = JSON.parse(result.stdout);
const packages = flattenDependencies(tree);

selfTestLicenseExpressions();

for (const pkg of packages) {
  const license = normalizeLicense(pkg.license);
  if (!license) {
    fail(`Production dependency ${pkg.name}@${pkg.version} has missing license metadata.`);
  }
  if (!isAllowedExpression(license)) {
    fail(`Production dependency ${pkg.name}@${pkg.version} has disallowed or exception-required license: ${license}`);
  }
}

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
if (Object.keys(packageJson.dependencies ?? {}).length === 0) {
  console.log("No production dependencies declared.");
}
console.log("Production dependency licenses passed policy.");
