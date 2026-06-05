import { spawnSync } from "node:child_process";

const result = spawnSync("npm", ["run", "build:bundle-license-fixture"], {
  encoding: "utf8",
  stdio: "pipe"
});

if (result.status === 0) {
  console.error("Bundle license scanner did not catch the synthetic GPL fixture.");
  process.exit(1);
}

const output = `${result.stdout}\n${result.stderr}`;
if (!output.includes("@swing-sync-test/bundled-prohibited-package") || !output.includes("GPL-3.0-only")) {
  console.error("Bundle fixture failed, but not for the expected synthetic GPL package.");
  console.error(output);
  process.exit(1);
}

console.log("Bundle license scanner rejected the synthetic GPL fixture as expected.");
