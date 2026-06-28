# SS-014 Claude Final Implementation Audit Prompt

> Superseded for paste use after Claude final audit FAIL. Use
> `docs/ss-014-claude-rereview-prompt.md` for the focused re-review.

Role: You are Claude, the independent adversarial implementation auditor for
Swing Sync.

Stage: Final implementation audit after QA planning PASS.

Task: `SS-014 Create fixture swing dataset policy and test fixtures`

Branch: `ss-014-fixtures-policy`

Notion task: https://app.notion.com/p/375834a0c8a681f08c96eeb40e2213f2

## Audit Scope

Audit whether the implementation satisfies SS-014 and the planning contract
you already passed. This is a source-sensitive audit: review the actual focused
implementation diff below, not a summary.

Acceptance criteria:

- Define consent and licensing policy for fixture videos.
- Prefer synthetic/derived landmark fixtures when possible.
- Add at least one non-identifying fixture for math tests.
- Document what cannot be committed to the repo.

Sensitive boundaries:

- Raw swing video remains local-first and is not uploaded by default.
- No remote sharing, telemetry, remote logging, remote review, cloud storage,
  SDK/provider/model asset changes, new workers, or new dependencies are
  approved by SS-014.
- Do not accept medical, injury, professional coaching, guaranteed correctness,
  guaranteed privacy, guaranteed deletion, anonymity, legal, or compliance
  claims.
- Follow `docs/privacy-architecture.md`, `docs/safety-terms.md`,
  `docs/licensing.md`, and `docs/models-licensing.md`.

## Implementation Summary

Codex implemented:

- `docs/fixture-policy.md`
- `scripts/fixture-policy-data.mjs`
- `scripts/verify-fixtures.js`
- `npm run fixture:verify`, wired into `npm run compliance:verify`
- `test/fixtures/math/FIXTURE-MANIFEST.json`
- `test/fixtures/math/synthetic-swing-landmarks.json`
- `test/fixtures/pose-landmarker/FIXTURE-MANIFEST.json`
- `test/unit/fixture-policy.test.ts`
- a geometry metric test that loads the new committed synthetic math fixture

No runtime app behavior was added. Observability is intentionally unchanged
except for local developer verification output from `fixture:verify`, which
prints sanitized fixture manifest paths and stable error codes only. No
telemetry, persistence, remote diagnostics, cloud storage, network behavior,
model/provider SDK, model asset, worker, or dependency was added.

## Verification Evidence

Commands run on 2026-06-27 PDT:

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

No `npm run license:audit`, `npm run verify:bundle-license-fixture`, or
`npm run sbom:generate` was run because SS-014 added no dependency and no
license exception. The unit test `keeps fixture validation zero-dependency`
asserts that `dependencies` and `devDependencies` remain unchanged and that
`fixture:verify` is wired into `compliance:verify`.

## Auditor Instructions

Attack the implementation. In particular, verify:

- the verifier is fail-closed for unknown classes, blocked classes, unknown
  generation methods, blocked licenses, missing provenance, missing file size,
  missing media hashes, size-budget failures, missing approvals, missing
  AI-generation terms metadata, and unsafe claims;
- `scripts/fixture-policy-data.mjs` is the canonical source and the tests prove
  validator behavior is driven by policy data rather than a hard-coded class
  list;
- the `generationMethod` enum is deterministic and does not use prose keyword
  parsing;
- `recorded-real-person` remains blocked by class and does not create a new
  allowed path;
- `aiGeneratedOutputRightsApproval` maps to `FIXTURE_AI_TERMS_MISSING`, while
  `FIXTURE_APPROVAL_REQUIRED` is reserved for general `maintainerApproval`;
- the math fixture is non-identifying, synthetic, and scoped to math tests;
- the existing mannequin fixture is documented without overbroad privacy,
  safety, legal, model-performance, coaching, or phase-accuracy claims;
- fixture size thresholds and exact boundary tests match the passed spec;
- no new dependencies, model/provider assets, SDKs, workers, telemetry,
  storage, remote sharing, or runtime network behavior were introduced;
- the implementation does not overclaim legal, privacy, deletion, anonymity,
  compliance, safety, professional coaching, biomechanical correctness, phase
  accuracy, or representative model accuracy.

Output required:

- PASS/FAIL verdict.
- Blocking findings ordered by severity, with exact file/line references when
  possible.
- Non-blocking recommendations separated from blockers.
- Missing tests or edge cases.
- Explicit statement whether Codex may prepare the PR after addressing any
  blockers.

## Focused Implementation Diff

The diff below is complete for implementation/audit-relevant SS-014 source,
test, manifest, package-script, and policy changes. It intentionally excludes
the earlier planning-prompt artifacts unless they are needed for a finding.

```diff
diff --git a/docs/fixture-policy.md b/docs/fixture-policy.md
new file mode 100644
index 0000000..b6f309e
--- /dev/null
+++ b/docs/fixture-policy.md
@@ -0,0 +1,105 @@
+# Fixture Policy
+
+This policy defines which committed Swing Sync test fixtures are allowed, what
+provenance they require, and what fixture content must not be committed. It is
+engineering compliance guidance, not legal advice or a guarantee of privacy,
+anonymity, deletion, safety, model performance, or legal compliance.
+
+## Default Rule
+
+Committed fixtures must be local test assets with documented provenance. Any
+fixture class, generation method, license, source, media file, or approval state
+not covered by `scripts/fixture-policy-data.mjs` fails closed.
+
+## Fixture Classes
+
+| Class | Default decision | Notes |
+| --- | --- | --- |
+| `project-authored-synthetic-landmarks` | Allowed | Preferred for math and contract tests. Must not represent a real person's motion. |
+| `project-authored-synthetic-media` | Allowed with provenance | Allowed for browser/video plumbing when synthetic by design, small, and documented. Existing mannequin fixture remains limited to pose-extraction integration. |
+| `derived-non-identifying-landmarks` | Review required | May be allowed if source rights, transformation, privacy impact, and non-identifying rationale are recorded. |
+| `maintainer-recorded-personal-media` | Blocked by default | First-party real-person recording; use `recorded-real-person` generation method. Requires future explicit approval, consent/release record, privacy review, licensing decision, and limitation language before commit. |
+| `third-party-open-media` | Blocked by default | Requires source-specific license/terms review, attribution/notice plan, privacy review, and maintainer approval. |
+| `commercial-or-restricted-dataset-media` | Blocked | Not committable unless a future written permission/contract and policy exception are recorded. |
+| `unknown-or-unlicensed-media` | Blocked | No commit. |
+| `model-provider-assets` | Blocked unless already approved | Must follow `docs/models-licensing.md`. SS-014 does not approve new model assets. |
+
+## Generation Methods
+
+Allowed controlled values are:
+
+- `project-authored-manual`
+- `project-authored-scripted`
+- `third-party-ai-generated`
+- `derived-from-approved-source`
+- `third-party-source`
+- `recorded-real-person`
+- `unknown`
+
+Only `third-party-ai-generated` triggers the AI-generation terms metadata
+requirements. `unknown` and `recorded-real-person` remain blocked in SS-014
+unless a future reviewed policy explicitly approves a narrower path.
+
+## Required Provenance
+
+Fixture directories covered by this policy must include `FIXTURE-MANIFEST.json`
+with:
+
+- fixture identifier and file paths;
+- fixture class;
+- author or creator;
+- creation or acquisition date;
+- source URL or a project-authored source statement;
+- controlled `generationMethod` plus derivation notes;
+- license or explicit project approval decision;
+- third-party notices or attribution requirements;
+- consent or release status;
+- privacy review;
+- intended test scope;
+- explicit limitations;
+- integrity hash for each committed binary or media fixture;
+- file size; and
+- maintainer approval fields where required.
+
+AI-generated fixtures must also record generation tool name, version or model
+when available, terms URL, terms review date, input-source statement, and
+`aiGeneratedOutputRightsApproval`.
+
+## Blocked Commit Content
+
+Do not commit:
+
+- raw personal swing video without a future source-specific approval;
+- identifiable faces, voices, backgrounds, account names, geolocation, license
+  plates, logos, or other unnecessary identifiers;
+- hidden EXIF, device, location, account, or privacy-sensitive filename data;
+- third-party footage, social-media clips, training videos, or dataset samples
+  with unclear redistribution rights;
+- GPL, AGPL, LGPL, proprietary, unlicensed, unknown, custom, non-SPDX,
+  noncommercial, no-derivatives, or share-alike fixture terms without a
+  documented exception;
+- model weights, model assets, SDK assets, or provider outputs outside existing
+  approvals;
+- files outside the approved fixture-size budget;
+- fixtures that imply representative model accuracy, phase accuracy,
+  biomechanical correctness, safety, anonymity, legal compliance, or guaranteed
+  deletion; or
+- fixtures that require remote upload, cloud storage, telemetry, public
+  serving, or network access to run tests.
+
+## Size Budget
+
+| File category | Size | Decision |
+| --- | ---: | --- |
+| Non-media structured fixture | `<= 100 KiB` | Allowed if other provenance rules pass. |
+| Non-media structured fixture | `> 100 KiB` | Requires documented exception and maintainer approval. |
+| Media fixture | `<= 1 MiB` | Allowed if other provenance rules pass. |
+| Media fixture | `> 1 MiB` and `< 5 MiB` | Requires documented exception and maintainer approval. |
+| Any fixture file | `>= 5 MiB` | Blocked in SS-014; requires a future reviewed distribution plan. |
+
+## Existing Mannequin Fixture
+
+`test/fixtures/pose-landmarker` remains approved only for deterministic local
+pose-extraction integration. It is not evidence of golf-swing accuracy, phase
+detection, biomechanical correctness, coaching correctness, or performance
+across devices.
diff --git a/package.json b/package.json
index b1cacbd..e0416dd 100644
--- a/package.json
+++ b/package.json
@@ -16,7 +16,8 @@
     "safety:verify": "node scripts/verify-safety-terms.js",
     "privacy:verify": "node scripts/verify-privacy-boundaries.js",
     "pose-assets:verify": "node scripts/verify-pose-assets.js",
-    "compliance:verify": "node scripts/verify-compliance.js && npm run pose-assets:verify && npm run safety:verify && npm run privacy:verify",
+    "fixture:verify": "node scripts/verify-fixtures.js",
+    "compliance:verify": "node scripts/verify-compliance.js && npm run fixture:verify && npm run pose-assets:verify && npm run safety:verify && npm run privacy:verify",
     "test:unit": "vitest run",
     "test:smoke": "playwright test"
   },
diff --git a/scripts/fixture-policy-data.mjs b/scripts/fixture-policy-data.mjs
new file mode 100644
index 0000000..7e46af7
--- /dev/null
+++ b/scripts/fixture-policy-data.mjs
@@ -0,0 +1,136 @@
+export const allowedFixtureLicenses = [
+  "Apache-2.0",
+  "MIT",
+  "BSD-2-Clause",
+  "BSD-3-Clause",
+  "ISC",
+  "CC0-1.0",
+  "0BSD"
+];
+
+export const fixtureClasses = [
+  {
+    id: "project-authored-synthetic-landmarks",
+    decision: "Allowed",
+    notes: "Preferred for math and contract tests. Must not represent a real person's motion.",
+    requiresMaintainerApproval: false
+  },
+  {
+    id: "project-authored-synthetic-media",
+    decision: "Allowed with provenance",
+    notes:
+      "Allowed for browser/video plumbing when synthetic by design, small, and documented. Existing mannequin fixture remains limited to pose-extraction integration.",
+    requiresMaintainerApproval: true
+  },
+  {
+    id: "derived-non-identifying-landmarks",
+    decision: "Review required",
+    notes:
+      "May be allowed if source rights, transformation, privacy impact, and non-identifying rationale are recorded.",
+    requiresMaintainerApproval: true
+  },
+  {
+    id: "maintainer-recorded-personal-media",
+    decision: "Blocked by default",
+    notes:
+      "First-party real-person recording; use recorded-real-person generation method. Requires future explicit approval, consent/release record, privacy review, licensing decision, and limitation language before commit.",
+    requiresMaintainerApproval: true,
+    blocked: true
+  },
+  {
+    id: "third-party-open-media",
+    decision: "Blocked by default",
+    notes:
+      "Requires source-specific license/terms review, attribution/notice plan, privacy review, and maintainer approval.",
+    requiresMaintainerApproval: true,
+    blocked: true
+  },
+  {
+    id: "commercial-or-restricted-dataset-media",
+    decision: "Blocked",
+    notes:
+      "Not committable unless a future written permission/contract and policy exception are recorded.",
+    requiresMaintainerApproval: true,
+    blocked: true
+  },
+  {
+    id: "unknown-or-unlicensed-media",
+    decision: "Blocked",
+    notes: "No commit.",
+    requiresMaintainerApproval: true,
+    blocked: true
+  },
+  {
+    id: "model-provider-assets",
+    decision: "Blocked unless already approved",
+    notes: "Must follow docs/models-licensing.md. SS-014 does not approve new model assets.",
+    requiresMaintainerApproval: true,
+    blocked: true
+  }
+];
+
+export const generationMethods = [
+  "project-authored-manual",
+  "project-authored-scripted",
+  "third-party-ai-generated",
+  "derived-from-approved-source",
+  "third-party-source",
+  "recorded-real-person",
+  "unknown"
+];
+
+export const requiredManifestFields = [
+  "fixtureId",
+  "files",
+  "fixtureClass",
+  "author",
+  "createdDate",
+  "source",
+  "generationMethod",
+  "derivationNotes",
+  "license",
+  "thirdPartyNotices",
+  "consentReleaseStatus",
+  "privacyReview",
+  "intendedTestScope",
+  "limitations",
+  "maintainerApproval"
+];
+
+export const aiGeneratedRequiredFields = [
+  "generationToolName",
+  "generationToolVersion",
+  "termsUrl",
+  "termsReviewDate",
+  "inputSourceStatement",
+  "aiGeneratedOutputRightsApproval"
+];
+
+export const fixtureValidationErrorCodes = [
+  "FIXTURE_PROVENANCE_MISSING",
+  "FIXTURE_FIELD_MISSING",
+  "FIXTURE_CLASS_UNKNOWN",
+  "FIXTURE_CLASS_BLOCKED",
+  "FIXTURE_LICENSE_BLOCKED",
+  "FIXTURE_AI_TERMS_MISSING",
+  "FIXTURE_MEDIA_HASH_MISSING",
+  "FIXTURE_MEDIA_SIZE_MISSING",
+  "FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET",
+  "FIXTURE_APPROVAL_REQUIRED",
+  "FIXTURE_UNSAFE_CLAIM"
+];
+
+export const fixtureSizePolicy = {
+  structuredMaxBytes: 100 * 1024,
+  mediaMaxBytes: 1024 * 1024,
+  blockedMaxBytes: 5 * 1024 * 1024
+};
+
+export const mediaExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4", ".mov", ".webm"];
+
+export const fixtureManifestFileName = "FIXTURE-MANIFEST.json";
+
+export const fixtureDirectories = [
+  "test/fixtures/math",
+  "test/fixtures/pose-landmarker"
+];
diff --git a/scripts/verify-fixtures.js b/scripts/verify-fixtures.js
new file mode 100644
index 0000000..f817c6d
--- /dev/null
+++ b/scripts/verify-fixtures.js
@@ -0,0 +1,218 @@
+import { createHash } from "node:crypto";
+import { existsSync, readFileSync, statSync } from "node:fs";
+import { extname, join } from "node:path";
+import {
+  aiGeneratedRequiredFields,
+  allowedFixtureLicenses,
+  fixtureClasses,
+  fixtureDirectories,
+  fixtureManifestFileName,
+  fixtureSizePolicy,
+  fixtureValidationErrorCodes,
+  generationMethods,
+  mediaExtensions,
+  requiredManifestFields
+} from "./fixture-policy-data.mjs";
+
+const defaultPolicyData = {
+  aiGeneratedRequiredFields,
+  allowedFixtureLicenses,
+  fixtureClasses,
+  fixtureDirectories,
+  fixtureManifestFileName,
+  fixtureSizePolicy,
+  fixtureValidationErrorCodes,
+  generationMethods,
+  mediaExtensions,
+  requiredManifestFields
+};
+
+const unsafeClaimPatterns = [
+  /\banonymous\b/i,
+  /\bguarantee[sd]?\s+(privacy|deletion|erasure|safety|accuracy|performance|compliance)\b/i,
+  /\blegal(?:ly)?\s+compliant\b/i,
+  /\bprofessional\s+coaching\b/i,
+  /\bphase[- ]detection\s+proof\b/i,
+  /\brepresentative\s+(model\s+)?accuracy\b/i,
+  /\bmedical\s+safety\b/i
+];
+
+function report(errors, code, path, detail) {
+  errors.push({ code, path, detail });
+}
+
+function policyContext(policyData = defaultPolicyData) {
+  return {
+    ...policyData,
+    classById: new Map(policyData.fixtureClasses.map((fixtureClass) => [fixtureClass.id, fixtureClass])),
+    allowedLicenses: new Set(policyData.allowedFixtureLicenses),
+    knownGenerationMethods: new Set(policyData.generationMethods)
+  };
+}
+
+function isPlainObject(value) {
+  return typeof value === "object" && value !== null && !Array.isArray(value);
+}
+
+function isNonEmptyString(value) {
+  return typeof value === "string" && value.trim().length > 0;
+}
+
+function sha256(path) {
+  return createHash("sha256").update(readFileSync(path)).digest("hex");
+}
+
+function validateApproval(errors, manifest, path, fixtureClass) {
+  if (!fixtureClass?.requiresMaintainerApproval) {
+    return;
+  }
+  if (!isPlainObject(manifest.maintainerApproval)) {
+    report(errors, "FIXTURE_APPROVAL_REQUIRED", path, "maintainerApproval is required");
+    return;
+  }
+  for (const field of ["approver", "date", "mechanism"]) {
+    if (!isNonEmptyString(manifest.maintainerApproval[field])) {
+      report(errors, "FIXTURE_APPROVAL_REQUIRED", path, `maintainerApproval.${field} is required`);
+    }
+  }
+}
+
+function validateManifest(manifest, manifestPath, root, context = policyContext()) {
+  const errors = [];
+
+  if (!isPlainObject(manifest)) {
+    report(errors, "FIXTURE_FIELD_MISSING", manifestPath, "manifest must be an object");
+    return errors;
+  }
+
+  for (const field of context.requiredManifestFields) {
+    if (field === "maintainerApproval" && manifest[field] === null) {
+      continue;
+    }
+    if (manifest[field] === undefined || manifest[field] === null || manifest[field] === "") {
+      report(errors, "FIXTURE_FIELD_MISSING", manifestPath, `${field} is required`);
+    }
+  }
+
+  const fixtureClass = context.classById.get(manifest.fixtureClass);
+  if (!fixtureClass) {
+    report(errors, "FIXTURE_CLASS_UNKNOWN", manifestPath, "fixtureClass is unknown");
+  } else if (fixtureClass.blocked) {
+    report(errors, "FIXTURE_CLASS_BLOCKED", manifestPath, `${manifest.fixtureClass} is blocked`);
+  }
+
+  if (!context.allowedLicenses.has(manifest.license)) {
+    report(errors, "FIXTURE_LICENSE_BLOCKED", manifestPath, "license is blocked or unknown");
+  }
+
+  if (!context.knownGenerationMethods.has(manifest.generationMethod)) {
+    report(errors, "FIXTURE_FIELD_MISSING", manifestPath, "generationMethod is unknown");
+  }
+  if (manifest.generationMethod === "unknown") {
+    report(errors, "FIXTURE_CLASS_BLOCKED", manifestPath, "unknown generationMethod is blocked");
+  }
+
+  validateApproval(errors, manifest, manifestPath, fixtureClass);
+
+  if (manifest.generationMethod === "third-party-ai-generated") {
+    for (const field of context.aiGeneratedRequiredFields) {
+      if (manifest[field] === undefined || manifest[field] === null || manifest[field] === "") {
+        report(errors, "FIXTURE_AI_TERMS_MISSING", manifestPath, `${field} is required`);
+      }
+    }
+  }
+
+  const prose = [
+    manifest.derivationNotes,
+    manifest.consentReleaseStatus,
+    manifest.privacyReview,
+    manifest.intendedTestScope,
+    manifest.limitations
+  ]
+    .filter(Boolean)
+    .join("\n");
+  for (const pattern of unsafeClaimPatterns) {
+    if (pattern.test(prose)) {
+      report(errors, "FIXTURE_UNSAFE_CLAIM", manifestPath, pattern.source);
+    }
+  }
+
+  if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
+    report(errors, "FIXTURE_FIELD_MISSING", manifestPath, "files must be a non-empty array");
+    return errors;
+  }
+
+  for (const file of manifest.files) {
+    if (!isPlainObject(file) || !isNonEmptyString(file.path)) {
+      report(errors, "FIXTURE_FIELD_MISSING", manifestPath, "each file requires path");
+      continue;
+    }
+
+    const filePath = join(root, file.path);
+    if (!existsSync(filePath)) {
+      report(errors, "FIXTURE_FIELD_MISSING", manifestPath, `${file.path} is missing`);
+      continue;
+    }
+
+    const actualSize = statSync(filePath).size;
+    const media = context.mediaExtensions.includes(extname(file.path).toLowerCase());
+    const limit = media ? context.fixtureSizePolicy.mediaMaxBytes : context.fixtureSizePolicy.structuredMaxBytes;
+
+    if (file.sizeBytes === undefined) {
+      report(errors, "FIXTURE_MEDIA_SIZE_MISSING", manifestPath, `${file.path} missing sizeBytes`);
+    } else if (file.sizeBytes !== actualSize) {
+      report(errors, "FIXTURE_MEDIA_SIZE_MISSING", manifestPath, `${file.path} sizeBytes mismatch`);
+    }
+
+    if (media && !isNonEmptyString(file.sha256)) {
+      report(errors, "FIXTURE_MEDIA_HASH_MISSING", manifestPath, `${file.path} missing sha256`);
+    }
+    if (isNonEmptyString(file.sha256) && sha256(filePath) !== file.sha256) {
+      report(errors, "FIXTURE_MEDIA_HASH_MISSING", manifestPath, `${file.path} sha256 mismatch`);
+    }
+
+    if (actualSize >= context.fixtureSizePolicy.blockedMaxBytes) {
+      report(errors, "FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET", manifestPath, `${file.path} exceeds budget`);
+    } else if (actualSize > limit) {
+      if (!isNonEmptyString(file.sizeException)) {
+        report(errors, "FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET", manifestPath, `${file.path} missing sizeException`);
+      }
+      validateApproval(errors, manifest, manifestPath, { requiresMaintainerApproval: true });
+    }
+  }
+
+  return errors;
+}
+
+export function validateFixtureManifest(manifest, options = {}) {
+  return validateManifest(
+    manifest,
+    options.manifestPath ?? fixtureManifestFileName,
+    options.root ?? ".",
+    policyContext(options.policyData)
+  );
+}
+
+export function validateFixtureDirectory(root, options = {}) {
+  const context = policyContext(options.policyData);
+  const manifestPath = join(root, context.fixtureManifestFileName);
+  if (!existsSync(manifestPath)) {
+    return [{ code: "FIXTURE_PROVENANCE_MISSING", path: manifestPath, detail: "manifest missing" }];
+  }
+  return validateManifest(JSON.parse(readFileSync(manifestPath, "utf8")), manifestPath, root, context);
+}
+
+export function validateFixtureDirectories(directories = fixtureDirectories, options = {}) {
+  return directories.flatMap((directory) => validateFixtureDirectory(directory, options));
+}
+
+if (import.meta.url === `file://${process.argv[1]}`) {
+  const errors = validateFixtureDirectories(process.argv.slice(2).length ? process.argv.slice(2) : fixtureDirectories);
+  if (errors.length > 0) {
+    for (const error of errors) {
+      console.error(`${error.code}: ${error.path}: ${error.detail}`);
+    }
+    process.exit(1);
+  }
+  console.log("Fixture policy and provenance verified.");
+}
diff --git a/test/fixtures/math/FIXTURE-MANIFEST.json b/test/fixtures/math/FIXTURE-MANIFEST.json
new file mode 100644
index 0000000..1f29753
--- /dev/null
+++ b/test/fixtures/math/FIXTURE-MANIFEST.json
@@ -0,0 +1,22 @@
+{
+  "fixtureId": "synthetic-swing-landmarks-v1",
+  "files": [
+    {
+      "path": "synthetic-swing-landmarks.json",
+      "sizeBytes": 5137
+    }
+  ],
+  "fixtureClass": "project-authored-synthetic-landmarks",
+  "author": "Codex for Swing Sync SS-014",
+  "createdDate": "2026-06-27",
+  "source": "Project-authored synthetic numeric landmark-like coordinates.",
+  "generationMethod": "project-authored-manual",
+  "derivationNotes": "Hand-authored deterministic landmark-like coordinates based on existing geometry unit-test shapes. No raw video, frame pixels, real-person recording, face, voice, logo, background, EXIF, geolocation, account name, or device metadata is included.",
+  "license": "Apache-2.0",
+  "thirdPartyNotices": "None.",
+  "consentReleaseStatus": "Not applicable: no real person or personal media.",
+  "privacyReview": "Contains only synthetic numeric coordinates for local math tests. No known biometric identity, raw swing video, frame pixels, or personal data.",
+  "intendedTestScope": "Geometry metric and fixture-policy tests only.",
+  "limitations": "Not evidence of real swing biomechanics, phase accuracy, model performance, coaching correctness, safety, anonymity, legal compliance, or deletion behavior.",
+  "maintainerApproval": null
+}
diff --git a/test/fixtures/math/synthetic-swing-landmarks.json b/test/fixtures/math/synthetic-swing-landmarks.json
new file mode 100644
index 0000000..7084229
--- /dev/null
+++ b/test/fixtures/math/synthetic-swing-landmarks.json
@@ -0,0 +1,110 @@
+{
+  "fixtureId": "synthetic-swing-landmarks-v1",
+  "handedness": "right",
+  "mirrored": "no",
+  "landmarks": [
+    { "x": 0, "y": -0.7, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0.2, "y": -0.5, "z": 0, "visibility": 1 },
+    { "x": -0.2, "y": -0.5, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0.2, "y": -0.1, "z": 0, "visibility": 1 },
+    { "x": -0.2, "y": -0.1, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0.15, "y": 0, "z": 0, "visibility": 1 },
+    { "x": -0.15, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 }
+  ],
+  "worldLandmarks": [
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0.5, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0.5, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0.3535533906, "y": -0.3535533906, "z": 0, "visibility": 1 },
+    { "x": -0.3535533906, "y": -0.3535533906, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 }
+  ],
+  "baselineLandmarks": [
+    { "x": 0, "y": -0.7, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0.2, "y": -0.5, "z": 0, "visibility": 1 },
+    { "x": -0.2, "y": -0.5, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0.2, "y": -0.1, "z": 0, "visibility": 1 },
+    { "x": -0.2, "y": -0.1, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0.15, "y": 0, "z": 0, "visibility": 1 },
+    { "x": -0.15, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 },
+    { "x": 0, "y": 0, "z": 0, "visibility": 1 }
+  ]
+}
diff --git a/test/fixtures/pose-landmarker/FIXTURE-MANIFEST.json b/test/fixtures/pose-landmarker/FIXTURE-MANIFEST.json
new file mode 100644
index 0000000..09ffa74
--- /dev/null
+++ b/test/fixtures/pose-landmarker/FIXTURE-MANIFEST.json
@@ -0,0 +1,43 @@
+{
+  "fixtureId": "ss-005-pose-landmarker-mannequin",
+  "files": [
+    {
+      "path": "mannequin-source.png",
+      "sizeBytes": 1474887,
+      "sha256": "b5d2a9d4eef284997d49826e1b177ecfa6cce7b439ae0973b307d65bf3e7c605",
+      "sizeException": "Existing SS-005 approved source image is over 1 MiB and under 5 MiB; retained for deterministic pose-extraction fixture provenance."
+    },
+    {
+      "path": "mannequin-golf-address.webm",
+      "sizeBytes": 8697,
+      "sha256": "e52dc416e1196ecd064972a606cc8e488cd46844a0644197735cca1c177ad390"
+    }
+  ],
+  "fixtureClass": "project-authored-synthetic-media",
+  "author": "Codex imagegen for Swing Sync SS-005",
+  "createdDate": "2026-06-11",
+  "source": "Project-authored synthetic faceless mannequin image; derived WebM produced from that image with FFmpeg.",
+  "generationMethod": "third-party-ai-generated",
+  "derivationNotes": "OpenAI image generation produced the source PNG. FFmpeg deterministically derived the WebM from the approved source PNG. No real-person source input was supplied.",
+  "license": "Apache-2.0",
+  "thirdPartyNotices": "OpenAI Terms of Use and Service Terms reviewed for generated output-rights decision. FFmpeg used as a derivation tool; the committed fixture output is distributed under the project approval recorded in PROVENANCE.md.",
+  "consentReleaseStatus": "Not applicable: no real person or personal media.",
+  "privacyReview": "Synthetic faceless mannequin fixture. No real-person recording, real-person face, known biometric identity, voice, account name, geolocation, EXIF, or device metadata is intended.",
+  "intendedTestScope": "Deterministic local pose-extraction integration tests only.",
+  "limitations": "Not evidence of golf-swing accuracy, phase detection, biomechanical correctness, coaching correctness, safety, anonymity, legal compliance, deletion behavior, or performance across devices.",
+  "maintainerApproval": {
+    "approver": "Jason Alvarez",
+    "date": "2026-06-11",
+    "mechanism": "Recorded maintainer approval in PROVENANCE.md before SS-005 implementation."
+  },
+  "generationToolName": "OpenAI image generation through Codex imagegen",
+  "generationToolVersion": "Not exposed by tool",
+  "termsUrl": "https://openai.com/policies/terms-of-use/",
+  "termsReviewDate": "2026-06-11",
+  "inputSourceStatement": "No real-person, third-party copyrighted, or identifying source media was supplied as input.",
+  "aiGeneratedOutputRightsApproval": {
+    "approver": "Jason Alvarez",
+    "date": "2026-06-11",
+    "mechanism": "Recorded project compliance decision in PROVENANCE.md."
+  }
+}
diff --git a/test/unit/fixture-policy.test.ts b/test/unit/fixture-policy.test.ts
new file mode 100644
index 0000000..13ca881
--- /dev/null
+++ b/test/unit/fixture-policy.test.ts
@@ -0,0 +1,298 @@
+import { createHash } from "node:crypto";
+import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
+import { tmpdir } from "node:os";
+import { join } from "node:path";
+import { describe, expect, it } from "vitest";
+// @ts-expect-error JS verifier is exercised directly by SS-014 tests.
+import {
+  validateFixtureDirectory,
+  validateFixtureDirectories,
+  validateFixtureManifest
+} from "../../scripts/verify-fixtures.js";
+// @ts-expect-error Canonical policy data is authored as a zero-dependency Node module.
+import {
+  fixtureClasses,
+  fixtureValidationErrorCodes,
+  generationMethods
+} from "../../scripts/fixture-policy-data.mjs";
+
+function tempRoot(): string {
+  return mkdtempSync(join(tmpdir(), "swing-sync-fixture-policy-"));
+}
+
+function sha256(value: string): string {
+  return createHash("sha256").update(value).digest("hex");
+}
+
+function baseManifest(overrides: Record<string, unknown> = {}, fileName = "fixture.json") {
+  return {
+    fixtureId: "test-fixture",
+    files: [{ path: fileName, sizeBytes: 2 }],
+    fixtureClass: "project-authored-synthetic-landmarks",
+    author: "Fixture policy test",
+    createdDate: "2026-06-27",
+    source: "Project-authored synthetic fixture.",
+    generationMethod: "project-authored-manual",
+    derivationNotes: "Project-authored deterministic test data.",
+    license: "Apache-2.0",
+    thirdPartyNotices: "None.",
+    consentReleaseStatus: "Not applicable: no real person.",
+    privacyReview: "No raw video, frame pixels, or personal data.",
+    intendedTestScope: "Fixture policy validator tests.",
+    limitations: "Not evidence of real swing biomechanics or model performance.",
+    maintainerApproval: null,
+    ...overrides
+  };
+}
+
+function errorsFor(manifest: Record<string, unknown>, contents = "{}") {
+  const root = tempRoot();
+  const fileName = ((manifest.files as Array<{ path: string }> | undefined)?.[0]?.path ?? "fixture.json");
+  writeFileSync(join(root, fileName), contents);
+  try {
+    return validateFixtureManifest(manifest, { root }).map((error: { code: string }) => error.code);
+  } finally {
+    rmSync(root, { recursive: true, force: true });
+  }
+}
+
+describe("fixture policy validation", () => {
+  it("accepts current approved fixture manifests", () => {
+    expect(validateFixtureDirectories()).toEqual([]);
+  });
+
+  it("loads the synthetic math fixture for geometry-style inputs", () => {
+    const fixture = JSON.parse(readFileSync("test/fixtures/math/synthetic-swing-landmarks.json", "utf8"));
+    expect(fixture.landmarks).toHaveLength(33);
+    expect(fixture.worldLandmarks).toHaveLength(33);
+    expect(fixture.baselineLandmarks).toHaveLength(33);
+    expect(fixture.handedness).toBe("right");
+    expect(fixture.mirrored).toBe("no");
+  });
+
+  it("keeps fixture policy documentation aligned with the canonical source", () => {
+    const policy = readFileSync("docs/fixture-policy.md", "utf8");
+    for (const fixtureClass of fixtureClasses) {
+      expect(policy).toContain(fixtureClass.id);
+      expect(policy).toContain(fixtureClass.decision);
+    }
+    for (const method of generationMethods) {
+      expect(policy).toContain(method);
+    }
+  });
+
+  it("drives validation behavior from injected canonical policy data", () => {
+    const manifest = baseManifest({ fixtureClass: "test-only-fixture-class" });
+    expect(errorsFor(manifest)).toContain("FIXTURE_CLASS_UNKNOWN");
+
+    const root = tempRoot();
+    writeFileSync(join(root, "fixture.json"), "{}");
+    try {
+      const policyData = {
+        aiGeneratedRequiredFields: [],
+        allowedFixtureLicenses: ["Apache-2.0"],
+        fixtureClasses: [
+          ...fixtureClasses,
+          {
+            id: "test-only-fixture-class",
+            decision: "Allowed",
+            notes: "Injected test class.",
+            requiresMaintainerApproval: false
+          }
+        ],
+        fixtureDirectories: [],
+        fixtureManifestFileName: "FIXTURE-MANIFEST.json",
+        fixtureSizePolicy: {
+          structuredMaxBytes: 100 * 1024,
+          mediaMaxBytes: 1024 * 1024,
+          blockedMaxBytes: 5 * 1024 * 1024
+        },
+        fixtureValidationErrorCodes,
+        generationMethods,
+        mediaExtensions: [".png"],
+        requiredManifestFields: [
+          "fixtureId",
+          "files",
+          "fixtureClass",
+          "author",
+          "createdDate",
+          "source",
+          "generationMethod",
+          "derivationNotes",
+          "license",
+          "thirdPartyNotices",
+          "consentReleaseStatus",
+          "privacyReview",
+          "intendedTestScope",
+          "limitations",
+          "maintainerApproval"
+        ]
+      };
+      expect(validateFixtureManifest(manifest, { root, policyData })).toEqual([]);
+    } finally {
+      rmSync(root, { recursive: true, force: true });
+    }
+  });
+
+  it("reports each planned validation error code", () => {
+    const missingRoot = tempRoot();
+    try {
+      expect(validateFixtureDirectory(missingRoot).map((error: { code: string }) => error.code)).toContain(
+        "FIXTURE_PROVENANCE_MISSING"
+      );
+    } finally {
+      rmSync(missingRoot, { recursive: true, force: true });
+    }
+
+    expect(errorsFor(baseManifest({ author: "" }))).toContain("FIXTURE_FIELD_MISSING");
+    expect(errorsFor(baseManifest({ fixtureClass: "typo-class" }))).toContain(
+      "FIXTURE_CLASS_UNKNOWN"
+    );
+    expect(errorsFor(baseManifest({ fixtureClass: "third-party-open-media" }))).toContain(
+      "FIXTURE_CLASS_BLOCKED"
+    );
+    expect(errorsFor(baseManifest({ license: "GPL-3.0-only" }))).toContain(
+      "FIXTURE_LICENSE_BLOCKED"
+    );
+    expect(
+      errorsFor(baseManifest({ generationMethod: "third-party-ai-generated" }))
+    ).toContain("FIXTURE_AI_TERMS_MISSING");
+    expect(
+      errorsFor(
+        baseManifest({
+          files: [{ path: "fixture.png", sizeBytes: 4, sha256: sha256("data") }]
+        }),
+        "data"
+      )
+    ).not.toContain("FIXTURE_MEDIA_HASH_MISSING");
+    expect(
+      errorsFor(
+        baseManifest({
+          files: [{ path: "fixture.png", sizeBytes: 4 }]
+        }),
+        "data"
+      )
+    ).toContain("FIXTURE_MEDIA_HASH_MISSING");
+    expect(
+      errorsFor(
+        baseManifest({
+          files: [{ path: "fixture.png", sha256: sha256("data") }]
+        }),
+        "data"
+      )
+    ).toContain("FIXTURE_MEDIA_SIZE_MISSING");
+    expect(
+      errorsFor(
+        baseManifest({
+          files: [{ path: "fixture.json", sizeBytes: 1024 * 100 + 1 }]
+        }),
+        "x".repeat(1024 * 100 + 1)
+      )
+    ).toContain("FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET");
+    expect(
+      errorsFor(
+        baseManifest({
+          fixtureClass: "project-authored-synthetic-media",
+          files: [{ path: "fixture.png", sizeBytes: 4, sha256: sha256("data") }]
+        }),
+        "data"
+      )
+    ).toContain("FIXTURE_APPROVAL_REQUIRED");
+    expect(
+      errorsFor(baseManifest({ limitations: "This fixture guarantees privacy." }))
+    ).toContain("FIXTURE_UNSAFE_CLAIM");
+  });
+
+  it("pins size boundaries and AI terms branching", () => {
+    expect(
+      errorsFor(
+        baseManifest({ files: [{ path: "fixture.json", sizeBytes: 1024 * 100 }] }),
+        "x".repeat(1024 * 100)
+      )
+    ).not.toContain("FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET");
+    expect(
+      errorsFor(
+        baseManifest({ files: [{ path: "fixture.json", sizeBytes: 1024 * 100 + 1 }] }),
+        "x".repeat(1024 * 100 + 1)
+      )
+    ).toContain("FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET");
+    expect(
+      errorsFor(
+        baseManifest({
+          files: [
+            {
+              path: "fixture.png",
+              sizeBytes: 1024 * 1024,
+              sha256: sha256("x".repeat(1024 * 1024))
+            }
+          ]
+        }),
+        "x".repeat(1024 * 1024)
+      )
+    ).not.toContain("FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET");
+    expect(
+      errorsFor(
+        baseManifest({
+          files: [
+            {
+              path: "fixture.png",
+              sizeBytes: 1024 * 1024 + 1,
+              sha256: sha256("x".repeat(1024 * 1024 + 1))
+            }
+          ]
+        }),
+        "x".repeat(1024 * 1024 + 1)
+      )
+    ).toContain("FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET");
+    expect(
+      errorsFor(
+        baseManifest({
+          files: [
+            {
+              path: "fixture.png",
+              sizeBytes: 5 * 1024 * 1024 - 1,
+              sha256: sha256("x".repeat(5 * 1024 * 1024 - 1))
+            }
+          ]
+        }),
+        "x".repeat(5 * 1024 * 1024 - 1)
+      )
+    ).toContain("FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET");
+    expect(
+      errorsFor(
+        baseManifest({
+          files: [
+            {
+              path: "fixture.png",
+              sizeBytes: 5 * 1024 * 1024,
+              sha256: sha256("x".repeat(5 * 1024 * 1024))
+            }
+          ]
+        }),
+        "x".repeat(5 * 1024 * 1024)
+      )
+    ).toContain("FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET");
+    expect(
+      errorsFor(baseManifest({ generationMethod: "project-authored-scripted" }))
+    ).not.toContain(
+      "FIXTURE_AI_TERMS_MISSING"
+    );
+  });
+
+  it("keeps fixture validation zero-dependency", () => {
+    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
+    expect(Object.keys(packageJson.dependencies).sort()).toEqual(["@mediapipe/tasks-vision"]);
+    expect(Object.keys(packageJson.devDependencies).sort()).toEqual([
+      "@cyclonedx/cyclonedx-npm",
+      "@onebeyond/license-checker",
+      "@playwright/test",
+      "@swing-sync-test/bundled-prohibited-package",
+      "rollup-plugin-license",
+      "typescript",
+      "vite",
+      "vitest"
+    ]);
+    expect(packageJson.scripts["fixture:verify"]).toBe("node scripts/verify-fixtures.js");
+    expect(packageJson.scripts["compliance:verify"]).toContain("npm run fixture:verify");
+  });
+});
diff --git a/test/unit/geometry-metrics.test.ts b/test/unit/geometry-metrics.test.ts
index 1936978..c62159b 100644
--- a/test/unit/geometry-metrics.test.ts
+++ b/test/unit/geometry-metrics.test.ts
@@ -1,4 +1,6 @@
 import { describe, expect, it } from "vitest";
+import { readFileSync } from "node:fs";
+import { resolve } from "node:path";
 import {
   calculateHeadDisplacement,
   calculateHipRotationProxy,
@@ -48,6 +50,12 @@ function standardInput(): GeometryMetricInput {
   };
 }
 
+function syntheticFixtureInput(): GeometryMetricInput {
+  return JSON.parse(
+    readFileSync(resolve("test/fixtures/math/synthetic-swing-landmarks.json"), "utf8")
+  ) as GeometryMetricInput;
+}
+
 function expectMeasured(value: ReturnType<typeof calculateShoulderAngle>, expected: number): void {
   expect(value.status).toBe("measured");
   expect(value.warnings).toEqual([]);
@@ -64,6 +72,10 @@ function expectUnavailable(
 }
 
 describe("calculateShoulderAngle", () => {
+  it("uses the committed non-identifying synthetic math fixture", () => {
+    expectMeasured(calculateShoulderAngle(syntheticFixtureInput()), 0);
+  });
+
   it("returns zero for level right-handed shoulders", () => {
     expectMeasured(calculateShoulderAngle(standardInput()), 0);
   });
```
