# SS-014 Claude Focused Final Audit Re-Review Prompt

> Superseded for paste use after Claude focused re-review FAIL on residual B3.
> Use `docs/ss-014-claude-rereview-2-prompt.md` for the B3-only re-review.

Role: You are Claude, the independent adversarial implementation auditor for
Swing Sync.

Stage: Focused final implementation re-review after Claude's SS-014 final audit
FAIL.

Task: `SS-014 Create fixture swing dataset policy and test fixtures`

Branch: `ss-014-fixtures-policy`

Notion task: https://app.notion.com/p/375834a0c8a681f08c96eeb40e2213f2

## Scope

Re-review only whether Codex closed the four blocking implementation findings
from your final audit, plus direct side effects of these fixes. Do not re-audit
unrelated SS-014 planning artifacts unless a fix creates a cross-cutting risk.

## Prior Findings And Codex Responses

### B1: `recorded-real-person` documented as blocked but not enforced

Accepted. Codex added canonical `blockedGenerationMethods` to
`scripts/fixture-policy-data.mjs` containing both `recorded-real-person` and
`unknown`, changed the validator to enforce that list, and added a regression
test where `generationMethod: "recorded-real-person"` is paired with otherwise
allowed `project-authored-synthetic-landmarks`.

### B2: `aiGeneratedOutputRightsApproval` only truthy-presence checked

Accepted. Codex added `validateApprovalRecord(...)` and now validates
`aiGeneratedOutputRightsApproval.approver`, `.date`, and `.mechanism` under
`FIXTURE_AI_TERMS_MISSING`. `maintainerApproval` continues to use
`FIXTURE_APPROVAL_REQUIRED`. The AI field is no longer separately presence
checked in the generic AI metadata loop, avoiding duplicate reporting.

### B3: zero-dependency guard used a hardcoded current package array

Accepted. Codex added
`test/baselines/package-dependencies.pre-ss-014.json` as the pre-SS-014
dependency baseline and changed the unit test to compare current
`dependencies` and `devDependencies` against that baseline. The existing
`@swing-sync-test/bundled-prohibited-package` entry is pre-existing and is a
local test fixture package for bundled-license/prohibited-package verification,
not an SS-014 dependency addition.

### B4: unsafe-claim regex false negatives and single narrow test

Accepted. Codex expanded unsafe-claim patterns for noun/adjective variants and
project-specific prohibited phrases: `anonymity`, `legal compliance`,
qualified guarantee phrases, `medical advice`, `diagnosis`, and
`biomechanical correctness`. Codex added tests for each of these phrases. The
expanded scanner also flagged the manifests' own negated limitation wording,
so Codex revised the manifests to avoid repeating prohibited phrases instead of
teaching the scanner to parse negation.

## Verification Evidence

Commands rerun after fixes on 2026-06-27 PDT:

```text
npm run fixture:verify
PASS
Fixture policy and provenance verified.

npm run test:unit -- fixture-policy geometry-metrics
PASS
2 files passed, 33 tests passed.

npm run test:unit
PASS
12 files passed, 122 tests passed.

npm run build
PASS
Vite build completed and THIRD_PARTY_NOTICES.txt was generated.

npm run compliance:verify
PASS
Compliance artifacts verified.
Fixture policy and provenance verified.
Approved pose asset hashes verified.
Safety terms and consent-gate constraints verified.
Privacy architecture and boundary constraints verified.

npm run safety:verify
PASS
Safety terms and consent-gate constraints verified.

npm run privacy:verify
PASS
Privacy architecture and boundary constraints verified.

git diff --check
PASS
```

## Focused Current Source

### `scripts/fixture-policy-data.mjs`

```js
export const generationMethods = [
  "project-authored-manual",
  "project-authored-scripted",
  "third-party-ai-generated",
  "derived-from-approved-source",
  "third-party-source",
  "recorded-real-person",
  "unknown"
];

export const blockedGenerationMethods = [
  "recorded-real-person",
  "unknown"
];

export const aiGeneratedRequiredFields = [
  "generationToolName",
  "generationToolVersion",
  "termsUrl",
  "termsReviewDate",
  "inputSourceStatement",
  "aiGeneratedOutputRightsApproval"
];
```

### `scripts/verify-fixtures.js`

```js
import {
  aiGeneratedRequiredFields,
  allowedFixtureLicenses,
  blockedGenerationMethods,
  fixtureClasses,
  fixtureDirectories,
  fixtureManifestFileName,
  fixtureSizePolicy,
  fixtureValidationErrorCodes,
  generationMethods,
  mediaExtensions,
  requiredManifestFields
} from "./fixture-policy-data.mjs";

const defaultPolicyData = {
  aiGeneratedRequiredFields,
  allowedFixtureLicenses,
  blockedGenerationMethods,
  fixtureClasses,
  fixtureDirectories,
  fixtureManifestFileName,
  fixtureSizePolicy,
  fixtureValidationErrorCodes,
  generationMethods,
  mediaExtensions,
  requiredManifestFields
};

const unsafeClaimPatterns = [
  /\banonym(?:ous|ity)\b/i,
  /\bguarantee[sd]?\b.{0,48}\b(privacy|deletion|erasure|safety|accuracy|performance|compliance)\b/i,
  /\blegal(?:ly)?\s+compliant\b/i,
  /\blegal\s+compliance\b/i,
  /\bprofessional\s+coaching\b/i,
  /\bmedical\s+(advice|diagnosis|safety)\b/i,
  /\bdiagnos(?:e|is|tic)\b/i,
  /\bphase[- ]detection\s+proof\b/i,
  /\bbiomechanical\s+correctness\b/i,
  /\brepresentative\s+(model\s+)?accuracy\b/i
];

function policyContext(policyData = defaultPolicyData) {
  return {
    ...policyData,
    classById: new Map(policyData.fixtureClasses.map((fixtureClass) => [fixtureClass.id, fixtureClass])),
    allowedLicenses: new Set(policyData.allowedFixtureLicenses),
    blockedGenerationMethods: new Set(policyData.blockedGenerationMethods),
    knownGenerationMethods: new Set(policyData.generationMethods)
  };
}

function validateApproval(errors, manifest, path, fixtureClass) {
  if (!fixtureClass?.requiresMaintainerApproval) {
    return;
  }
  validateApprovalRecord(errors, manifest.maintainerApproval, path, "maintainerApproval", "FIXTURE_APPROVAL_REQUIRED");
}

function validateApprovalRecord(errors, value, path, fieldName, errorCode) {
  if (!isPlainObject(value)) {
    report(errors, errorCode, path, `${fieldName} is required`);
    return;
  }
  for (const field of ["approver", "date", "mechanism"]) {
    if (!isNonEmptyString(value[field])) {
      report(errors, errorCode, path, `${fieldName}.${field} is required`);
    }
  }
}

if (!context.knownGenerationMethods.has(manifest.generationMethod)) {
  report(errors, "FIXTURE_FIELD_MISSING", manifestPath, "generationMethod is unknown");
}
if (context.blockedGenerationMethods.has(manifest.generationMethod)) {
  report(errors, "FIXTURE_CLASS_BLOCKED", manifestPath, `${manifest.generationMethod} generationMethod is blocked`);
}

if (manifest.generationMethod === "third-party-ai-generated") {
  for (const field of context.aiGeneratedRequiredFields) {
    if (field === "aiGeneratedOutputRightsApproval") {
      continue;
    }
    if (manifest[field] === undefined || manifest[field] === null || manifest[field] === "") {
      report(errors, "FIXTURE_AI_TERMS_MISSING", manifestPath, `${field} is required`);
    }
  }
  validateApprovalRecord(
    errors,
    manifest.aiGeneratedOutputRightsApproval,
    manifestPath,
    "aiGeneratedOutputRightsApproval",
    "FIXTURE_AI_TERMS_MISSING"
  );
}
```

### `test/unit/fixture-policy.test.ts`

```ts
import {
  blockedGenerationMethods,
  fixtureClasses,
  fixtureValidationErrorCodes,
  generationMethods
} from "../../scripts/fixture-policy-data.mjs";

// In the injected-policy-data test:
const policyData = {
  aiGeneratedRequiredFields: [],
  allowedFixtureLicenses: ["Apache-2.0"],
  blockedGenerationMethods,
  fixtureClasses: [
    ...fixtureClasses,
    {
      id: "test-only-fixture-class",
      decision: "Allowed",
      notes: "Injected test class.",
      requiresMaintainerApproval: false
    }
  ],
  fixtureDirectories: [],
  fixtureManifestFileName: "FIXTURE-MANIFEST.json",
  fixtureSizePolicy: {
    structuredMaxBytes: 100 * 1024,
    mediaMaxBytes: 1024 * 1024,
    blockedMaxBytes: 5 * 1024 * 1024
  },
  fixtureValidationErrorCodes,
  generationMethods,
  mediaExtensions: [".png"],
  requiredManifestFields: [
    "fixtureId",
    "files",
    "fixtureClass",
    "author",
    "createdDate",
    "source",
    "generationMethod",
    "derivationNotes",
    "license",
    "thirdPartyNotices",
    "consentReleaseStatus",
    "privacyReview",
    "intendedTestScope",
    "limitations",
    "maintainerApproval"
  ]
};

expect(errorsFor(baseManifest({ generationMethod: "recorded-real-person" }))).toContain(
  "FIXTURE_CLASS_BLOCKED"
);

expect(
  errorsFor(
    baseManifest({
      generationMethod: "third-party-ai-generated",
      generationToolName: "Test generator",
      generationToolVersion: "test-model",
      termsUrl: "https://example.test/terms",
      termsReviewDate: "2026-06-27",
      inputSourceStatement: "No real-person or third-party source input.",
      aiGeneratedOutputRightsApproval: {}
    })
  )
).toContain("FIXTURE_AI_TERMS_MISSING");

for (const limitations of [
  "This fixture provides anonymity.",
  "This fixture proves legal compliance.",
  "This fixture guarantees full privacy.",
  "This fixture provides medical advice.",
  "This fixture supports diagnosis.",
  "This fixture proves biomechanical correctness."
]) {
  expect(errorsFor(baseManifest({ limitations }))).toContain("FIXTURE_UNSAFE_CLAIM");
}

it("keeps fixture validation zero-dependency", () => {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  const baseline = JSON.parse(readFileSync("test/baselines/package-dependencies.pre-ss-014.json", "utf8"));
  expect(packageJson.dependencies).toEqual(baseline.dependencies);
  expect(packageJson.devDependencies).toEqual(baseline.devDependencies);
  expect(packageJson.scripts["fixture:verify"]).toBe("node scripts/verify-fixtures.js");
  expect(packageJson.scripts["compliance:verify"]).toContain("npm run fixture:verify");
});
```

### `test/baselines/package-dependencies.pre-ss-014.json`

```json
{
  "dependencies": {
    "@mediapipe/tasks-vision": "0.10.35"
  },
  "devDependencies": {
    "@cyclonedx/cyclonedx-npm": "^4.2.1",
    "@onebeyond/license-checker": "^2.2.0",
    "@playwright/test": "1.52.0",
    "@swing-sync-test/bundled-prohibited-package": "file:test/fixtures/bundled-prohibited-package",
    "rollup-plugin-license": "^3.7.1",
    "typescript": "^5.8.3",
    "vite": "^5.4.21",
    "vitest": "2.1.9"
  }
}
```

### Updated manifest limitation wording

```json
{
  "path": "test/fixtures/math/FIXTURE-MANIFEST.json",
  "limitations": "Not evidence of real swing mechanics, phase timing, model performance, coaching correctness, safety, identity protection, legal status, or deletion behavior."
}
```

```json
{
  "path": "test/fixtures/pose-landmarker/FIXTURE-MANIFEST.json",
  "limitations": "Not evidence of golf-swing accuracy, phase timing, swing-mechanics quality, coaching correctness, safety, identity protection, legal status, deletion behavior, or performance across devices."
}
```

## Output Required

- PASS/FAIL verdict for this focused re-review.
- Blocking findings ordered by severity, if any.
- Non-blocking recommendations separated from blockers.
- Missing tests or edge cases.
- Explicit statement whether Codex may prepare the PR after addressing any
  blockers.
