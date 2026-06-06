import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) {
    fail(`${path} is missing.`);
  }
  return readFileSync(path, "utf8");
}

function assertIncludes(text, phrase, source) {
  if (!text.toLowerCase().includes(phrase.toLowerCase())) {
    fail(`${source} must include: ${phrase}`);
  }
}

function assertHasTerms(text, terms, source, label) {
  const lower = text.toLowerCase();
  for (const term of terms) {
    if (!lower.includes(term.toLowerCase())) {
      fail(`${source} must include ${label}: ${term}`);
    }
  }
}

function assertNotMatches(text, pattern, source, label) {
  if (pattern.test(text)) {
    fail(`${source} must not match prohibited privacy pattern: ${label}`);
  }
}

function listScannableFiles(root) {
  if (!existsSync(root)) {
    return [];
  }

  const files = [];
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      files.push(...listScannableFiles(path));
      continue;
    }

    if (/\.(html|js|jsx|ts|tsx|mjs|cjs)$/.test(path)) {
      files.push(path);
    }
  }
  return files;
}

const privacyDocPath = "docs/privacy-architecture.md";
const dispositionPath = "docs/ss-003-research-disposition.md";
const appPath = "src/main.ts";
const packagePath = "package.json";
const indexPath = "index.html";
const privacyVerifierPath = "scripts/verify-privacy-boundaries.js";

const privacyDoc = readRequired(privacyDocPath);
const disposition = readRequired(dispositionPath);
const appSource = readRequired(appPath);
const packageJson = JSON.parse(readRequired(packagePath));
const packageText = JSON.stringify(packageJson, null, 2);

for (const phrase of [
  "DRAFT - pending human/privacy review",
  "not legal advice",
  "separate, explicit opt-in",
  "Derived landmarks and metrics should be treated as sensitive user data",
  "must not promise",
  "Default analytical exports must not include raw swing video",
  "Exports must not be described as anonymous",
  "Optional remote sharing is not approved yet",
  "not device-level erasure"
]) {
  assertIncludes(privacyDoc, phrase, privacyDocPath);
}

assertHasTerms(
  privacyDoc,
  ["Raw swing video", "frame pixels", "must not be uploaded"],
  privacyDocPath,
  "raw media no-upload boundary"
);

for (const phrase of [
  "Adopt",
  "Revise Before Adoption",
  "Defer",
  "Reject For Current Scope",
  "Source Checks",
  "Claude Review Checklist"
]) {
  assertIncludes(disposition, phrase, dispositionPath);
}

// Cross-check the current SS-002 consent scaffold while SS-003 is still a
// docs-only privacy story. TODO: migrate these checks when the consent gate
// becomes a component or a dedicated privacy/consent module.
for (const phrase of [
  "explicit opt-in step you initiate",
  "Raw swing video stays on your",
  "Consent recorded locally"
]) {
  assertIncludes(appSource, phrase, appPath);
}

const prohibitedClaims = [
  ["absolute privacy guarantee", /\b(guarantee[sd]?|ensure[sd]?)\s+(absolute|complete|total)\s+privacy\b/i],
  ["guaranteed local-only transit", /\bguarantee[sd]?\s+that\s+data\s+never\s+leaves\b/i],
  ["anonymous export claim", /\b(exports?|downloads?|swing cards?)\s+(are|is)\s+anonymous\b/i],
  ["forensic deletion guarantee", /\bguarantee[sd]?\s+.*\b(forensic|physical|permanent)\s+erasure\b/i],
  ["zero retention provider claim", /\bzero[- ]data[- ]retention\b/i],
  ["training-use provider guarantee", /\b(prohibited|forbidden)\s+from\s+.*\b(model\s+training|training)\b/i],
  ["secure storage absolute", /\b(secure|encrypted)\s+browser\s+storage\b/i]
];

for (const [label, pattern] of prohibitedClaims) {
  assertNotMatches(privacyDoc, pattern, privacyDocPath, label);
}

const prohibitedEndpointPatterns = [
  ["Google Analytics", /google-analytics\.com|googletagmanager\.com|gtag\(/i],
  ["DoubleClick", /doubleclick\.net/i],
  ["Amplitude", /amplitude\.com|amplitude-js|@amplitude\//i],
  ["Mixpanel", /mixpanel\.com|mixpanel-browser/i],
  ["Hotjar", /hotjar\.com|hotjar/i],
  ["Segment", /segment\.io|analytics-node|@segment\//i],
  // Blocked pending privacy review; not a permanent categorical ban.
  ["Sentry", /sentry\.io|@sentry\//i],
  ["FullStory", /fullstory\.com|@fullstory\//i]
];

const sourceFiles = [
  indexPath,
  ...listScannableFiles("src"),
  ...listScannableFiles("scripts").filter((path) => path !== privacyVerifierPath)
];

for (const [label, pattern] of prohibitedEndpointPatterns) {
  for (const sourcePath of sourceFiles) {
    assertNotMatches(readRequired(sourcePath), pattern, sourcePath, label);
  }
  assertNotMatches(packageText, pattern, packagePath, label);
}

console.log("Privacy architecture and boundary constraints verified.");
