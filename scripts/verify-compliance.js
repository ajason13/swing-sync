import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function assertNonEmpty(path) {
  if (!existsSync(path) || readFileSync(path, "utf8").trim().length === 0) {
    fail(`${path} is missing or empty.`);
  }
}

function assertSbom() {
  assertNonEmpty("docs/sbom.json");
  const sbom = JSON.parse(readFileSync("docs/sbom.json", "utf8"));

  if (sbom.bomFormat !== "CycloneDX") {
    fail("docs/sbom.json is not a CycloneDX SBOM.");
  }

  // CycloneDX currently uses 1.x single-digit minor versions; keep this check
  // strict enough for CI while avoiding a dependency on jq in local scripts.
  if (!["1.4", "1.5", "1.6"].includes(sbom.specVersion)) {
    fail(`docs/sbom.json has unsupported CycloneDX specVersion: ${sbom.specVersion}`);
  }

  if (!Array.isArray(sbom.components)) {
    fail("docs/sbom.json components field is missing or not an array.");
  }

  const names = sbom.components.map((component) => component.name).filter(Boolean);
  for (const devOnly of ["vitest", "eslint", "playwright", "@playwright/test"]) {
    if (names.includes(devOnly)) {
      fail(`docs/sbom.json includes dev-only package: ${devOnly}`);
    }
  }

  const mediaPipe = sbom.components.find(
    (component) =>
      component.group === "@mediapipe" &&
      component.name === "tasks-vision" &&
      component.version === "0.10.35"
  );
  if (!mediaPipe) {
    fail("docs/sbom.json must include exact @mediapipe/tasks-vision@0.10.35.");
  }
}

function assertNoticeFixture() {
  const result = spawnSync("node", ["scripts/aggregate-notices.js", "--target=test/fixtures/compliance-notice"], {
    encoding: "utf8",
    stdio: "pipe"
  });

  if (result.status !== 0) {
    console.error(result.stdout);
    console.error(result.stderr);
    fail("NOTICE aggregation fixture failed.");
  }

  assertNonEmpty("dist/THIRD_PARTY_NOTICES.txt");
  const notices = readFileSync("dist/THIRD_PARTY_NOTICES.txt", "utf8");
  if (!notices.includes("Apache Notice Harness Test")) {
    fail("NOTICE aggregation did not include the deterministic fixture content.");
  }
  for (const devOnly of ["playwright", "vitest"]) {
    if (notices.includes(devOnly)) {
      fail(`NOTICE aggregation leaked dev-only package text: ${devOnly}`);
    }
  }
}

function assertMediaPipeNotice() {
  const noticePath = "docs/third-party-notices/mediapipe.md";
  assertNonEmpty(noticePath);
  const notice = readFileSync(noticePath, "utf8");
  for (const phrase of [
    "@mediapipe/tasks-vision@0.10.35",
    "Pose Landmarker Full float16 version 1",
    "Apache License 2.0",
    "mediapipe/issues/6306"
  ]) {
    if (!notice.includes(phrase)) {
      fail(`${noticePath} must include: ${phrase}`);
    }
  }
}

assertSbom();
assertNoticeFixture();
assertMediaPipeNotice();
console.log("Compliance artifacts verified.");
