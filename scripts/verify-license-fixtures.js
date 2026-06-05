import { spawnSync } from "node:child_process";

const allowed = ["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC", "CC0-1.0", "0BSD"];

function runFixture(name, expectedStatus) {
  const result = spawnSync(
    "npx",
    [
      "@onebeyond/license-checker",
      "scan",
      "--start",
      `./test/fixtures/${name}`,
      "--allowOnly",
      ...allowed,
      "--disableReport",
      "--disableErrorReport"
    ],
    { encoding: "utf8", stdio: "pipe" }
  );

  if (expectedStatus === "fail" && result.status === 0) {
    console.error(`Expected ${name} to fail license audit, but it passed.`);
    process.exit(1);
  }

  if (expectedStatus === "pass" && result.status !== 0) {
    console.error(`Expected ${name} to pass license audit, but it failed.`);
    console.error(result.stdout);
    console.error(result.stderr);
    process.exit(1);
  }
}

runFixture("prohibited-license", "fail");
runFixture("permitted-license", "pass");
runFixture("mpl-license", "fail");

console.log("Synthetic license fixtures behaved as expected.");
