import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const sbomPath = "docs/sbom.json";

function flattenProductionNames(node, names = new Set()) {
  if (!node?.dependencies) return names;

  for (const [name, dependency] of Object.entries(node.dependencies)) {
    if (dependency?.dev === true || dependency?.extraneous === true) continue;
    names.add(name);
    flattenProductionNames(dependency, names);
  }

  return names;
}

const result = spawnSync("npm", ["ls", "--omit=dev", "--json", "--long"], {
  encoding: "utf8",
  stdio: "pipe"
});

if (result.status !== 0 && !result.stdout) {
  console.error(result.stderr);
  throw new Error("Unable to resolve production dependency tree for SBOM filtering.");
}

const productionNames = flattenProductionNames(JSON.parse(result.stdout));
const sbom = JSON.parse(readFileSync(sbomPath, "utf8"));
sbom.components = (sbom.components ?? []).filter((component) => {
  const packageName = component.group ? `${component.group}/${component.name}` : component.name;
  return productionNames.has(packageName);
});

writeFileSync(sbomPath, JSON.stringify(sbom, null, 2) + "\n");
console.log(`Filtered ${sbomPath} to ${sbom.components.length} production component(s).`);
