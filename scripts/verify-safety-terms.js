import { readFileSync } from "node:fs";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function assertIncludes(text, phrase, source) {
  if (!text.toLowerCase().includes(phrase.toLowerCase())) {
    fail(`${source} must include: ${phrase}`);
  }
}

function assertNotIncludes(text, phrase, source) {
  if (text.toLowerCase().includes(phrase.toLowerCase())) {
    fail(`${source} must not include unsafe phrasing: ${phrase}`);
  }
}

function assertNotMatches(text, pattern, source, label) {
  if (pattern.test(text)) {
    fail(`${source} must not match unsafe pattern: ${label}`);
  }
}

const safetyTermsPath = "docs/safety-terms.md";
const researchDispositionPath = "docs/ss-002-research-disposition.md";
const appPath = "src/main.ts";
const safetyTerms = readFileSync(safetyTermsPath, "utf8");
const researchDisposition = readFileSync(researchDispositionPath, "utf8");
const appSource = readFileSync(appPath, "utf8");
const combined = `${safetyTerms}\n${researchDisposition}\n${appSource}`;

for (const phrase of [
  "not legal advice",
  "educational",
  "not medical advice",
  "professional athletic instruction",
  "raw swing video must remain on the user's device by default",
  "consent gate",
  "assumption of risk",
  "release of liability",
  "prohibit diagnosing pain",
  "prohibit medical triage",
  "rehabilitation",
  "aggressive mechanical prescriptions",
  "defense-in-depth"
]) {
  assertIncludes(safetyTerms, phrase, safetyTermsPath);
}

for (const phrase of [
  "Adopt",
  "Revise Before Adoption",
  "Reject For Current Draft",
  "Claude QA Handoff Checklist",
  "not legal advice",
  "approved implementation mandate"
]) {
  assertIncludes(researchDisposition, phrase, researchDispositionPath);
}

for (const phrase of [
  "localStorage",
  "swing-sync:safety-consent:v1",
  "not a durable or legally audited consent record",
  "explicit opt-in step you initiate",
  "physical risk I accept responsibility for",
  "Begin analysis",
  "stop if you feel pain",
  "qualified medical or coaching professionals",
  "Please acknowledge the safety terms before starting analysis"
]) {
  assertIncludes(appSource, phrase, appPath);
}

for (const phrase of [
  "train through pain",
  "ignore pain",
  "diagnose your pain",
  "can diagnose",
  "provides medical advice",
  "guaranteed to prevent injury",
  "guaranteed improvement",
  "absolute ownership",
  "100% block rate",
  "rehab drill",
  "rotator cuff",
  "physical therapy exercises",
  "medical clearance",
  "medically cleared",
  "stretch to fix"
]) {
  assertNotIncludes(combined, phrase, "SS-002 safety content");
}

for (const [label, pattern] of [
  ["positive medical advice claim", /\b(provides?|offers?|gives?)\s+(medical|clinical)\s+advice\b/i],
  ["diagnosis capability claim", /\b(can|will|does)\s+diagnos(e|is)\b/i],
  ["injury prevention guarantee", /\bguarantee[sd]?\s+(to\s+)?(prevent|avoid)\s+injur/i],
  ["performance guarantee", /\bguarantee[sd]?\s+(performance|improvement|results?)\b/i],
  ["rehabilitation instruction", /\b(prescribes?|recommends?|gives?)\s+.*\b(rehab|rehabilitation|therapy)\b/i],
  ["unsafe pain compensation", /\b(swing|train|practice|move)\s+.*\b(through|despite|around)\s+pain\b/i]
]) {
  assertNotMatches(combined, pattern, "SS-002 safety content", label);
}

console.log("Safety terms and consent-gate constraints verified.");
