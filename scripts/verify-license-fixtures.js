import { createRequire } from "node:module";
import { runNodeCli } from "./run-node-cli.js";

const require = createRequire(import.meta.url);
const scanner = require.resolve("@onebeyond/license-checker");

const allowed = ["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC", "CC0-1.0", "0BSD"];

function runFixture(name, expectedLicense) {
  const result = runNodeCli(
    scanner,
    [
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

  const output = `${result.stdout}\n${result.stderr}`;
  const passed = expectedLicense === null
    ? result.status === 0
    : result.status === 1 && output.includes("packages with licenses defined by the provided option:") && output.includes(expectedLicense);
  if (!passed) {
    console.error(`License fixture ${name} did not produce the expected ${expectedLicense ?? "permitted"} policy result (exit ${result.status}).`);
    console.error(output);
    process.exit(1);
  }
}

runFixture("prohibited-license", "GPL-3.0-only");
runFixture("permitted-license", null);
runFixture("mpl-license", "MPL-2.0");

console.log("Synthetic license fixtures behaved as expected.");
