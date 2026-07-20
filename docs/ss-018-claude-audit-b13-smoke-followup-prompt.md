# SS-018 Claude B13 And Smoke Follow-up Prompt

Do not use prior chat as authoritative. This is the short follow-up Claude
requested after the SS-018 focused B9-B12 re-review.

## Role

You are the lead adversarial auditor for Swing Sync.

## Stage

Focused follow-up for B13 and required smoke evidence.

## Scope

Review only:

- B13: safety verifier scan scope after the B12 remediation.
- Required `test:smoke` evidence under Node 22 from `.nvmrc`.

B9, B10, and B11 were already closed by Claude. Do not reopen them unless the
evidence below introduces a direct new regression.

## Context

SS-018 refactors the frontend app shell into focused TypeScript modules while
preserving consent gating, local video selection, local pose processing, phase
review, Swing Card export, remote-review-unavailable behavior, accessibility
labels, smoke selectors, privacy posture, safety posture, and exported data
classes.

Protected boundaries remain:

- raw swing video is not uploaded by default;
- remote sharing requires separate explicit opt-in;
- remote model review remains unavailable;
- provider/model registry behavior, service-worker behavior, raw-media
  handling, and exported data classes must not change;
- no telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts may be added.

## Prior Focused Re-review Status

Claude's prior focused re-review returned:

- B9 closed.
- B10 closed.
- B11 closed.
- B12 substantially addressed, but B13 required one more piece of evidence.

Claude requested either:

- paste the complete updated `scripts/verify-safety-terms.js` and evidence that
  the broad scan is safe, or
- scope `appSourcePaths` back down to the explicit app-shell modules:
  `main.ts`, `app-renderer.ts`, `app-events.ts`, `consent-state.ts`,
  `phase-review-renderer.ts`, `remote-model-renderer.ts`,
  `swing-card-actions.ts`.

Codex chose the second option because it is lower risk and matches the original
B12 scope without scanning unrelated SS-012 coaching files.

## Applied B13 Fix

`scripts/verify-safety-terms.js` now uses an explicit app-shell module list and
does not scan all of `src/`.

Complete updated file:

```js
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
const appSourcePaths = [
  "src/main.ts",
  "src/app-renderer.ts",
  "src/app-events.ts",
  "src/consent-state.ts",
  "src/phase-review-renderer.ts",
  "src/remote-model-renderer.ts",
  "src/swing-card-actions.ts"
];
const safetyTerms = readFileSync(safetyTermsPath, "utf8");
const researchDisposition = readFileSync(researchDispositionPath, "utf8");
const appSource = appSourcePaths.map((path) => readFileSync(path, "utf8")).join("\n");
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
  assertIncludes(appSource, phrase, appSourcePaths.join(", "));
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
```

## Node Version And Smoke Evidence

`.nvmrc` contains:

```text
22
```

Before using `nvm use`, the default shell was Node `v20.11.0`. This explained
the prior Playwright hang and matches the known project failure mode Claude
identified.

Command rerun with Node from `.nvmrc`:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && node --version && npm run test:smoke'
```

Relevant output:

```text
Found '/Users/jasonalvarez/gitHubRepos/swing-sync/.nvmrc' with version <22>
Now using node v22.22.3 (npm v10.9.8)
v22.22.3

> swing-sync@0.1.0 test:smoke
> playwright test

Running 32 tests using 2 workers
...
32 passed (49.2s)
```

The output included all 32 desktop/mobile smoke tests passing, including:

- capture flow and fail-closed analysis guard;
- consent storage failure paths;
- local worker inference;
- phase review;
- Swing Card PNG/print/prompt controls;
- external-network-blocked local inference;
- CSP-blocked outbound request handling;
- object URL release;
- mobile viewport fit.

## Additional Verification Under Node 22

Command:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && node --version && npm run test:unit && npm run build && npm run compliance:verify && git diff --check'
```

Relevant output:

```text
Now using node v22.22.3 (npm v10.9.8)
v22.22.3

> swing-sync@0.1.0 test:unit
> vitest run
Test Files  21 passed (21)
Tests  179 passed (179)

> swing-sync@0.1.0 build
> vite build && node scripts/aggregate-notices.js
✓ built

> swing-sync@0.1.0 compliance:verify
Compliance artifacts verified.
Fixture policy and provenance verified.
Approved pose asset hashes verified.
Safety terms and consent-gate constraints verified.
Privacy architecture and boundary constraints verified.
docs:verify passed
```

`git diff --check` returned exit code 0.

## Known Non-goals

- No new dependencies.
- No framework migration.
- No telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts.
- No remote-review enablement.
- No provider/model registry, service-worker, raw-media handling, or exported
  data-class behavior change.

## Output Required

Return:

- PASS/FAIL for B13.
- PASS/FAIL for the required smoke evidence.
- Any blockers ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status: whether SS-018 may proceed to PR preparation.
