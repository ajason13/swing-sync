import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
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

function report(errors, code, path, detail) {
  errors.push({ code, path, detail });
}

function policyContext(policyData = defaultPolicyData) {
  return {
    ...policyData,
    classById: new Map(policyData.fixtureClasses.map((fixtureClass) => [fixtureClass.id, fixtureClass])),
    allowedLicenses: new Set(policyData.allowedFixtureLicenses),
    blockedGenerationMethods: new Set(policyData.blockedGenerationMethods),
    knownGenerationMethods: new Set(policyData.generationMethods)
  };
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
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

function validateManifest(manifest, manifestPath, root, context = policyContext()) {
  const errors = [];

  if (!isPlainObject(manifest)) {
    report(errors, "FIXTURE_FIELD_MISSING", manifestPath, "manifest must be an object");
    return errors;
  }

  for (const field of context.requiredManifestFields) {
    if (field === "maintainerApproval" && manifest[field] === null) {
      continue;
    }
    if (manifest[field] === undefined || manifest[field] === null || manifest[field] === "") {
      report(errors, "FIXTURE_FIELD_MISSING", manifestPath, `${field} is required`);
    }
  }

  const fixtureClass = context.classById.get(manifest.fixtureClass);
  if (!fixtureClass) {
    report(errors, "FIXTURE_CLASS_UNKNOWN", manifestPath, "fixtureClass is unknown");
  } else if (fixtureClass.blocked) {
    report(errors, "FIXTURE_CLASS_BLOCKED", manifestPath, `${manifest.fixtureClass} is blocked`);
  }

  if (!context.allowedLicenses.has(manifest.license)) {
    report(errors, "FIXTURE_LICENSE_BLOCKED", manifestPath, "license is blocked or unknown");
  }

  if (!context.knownGenerationMethods.has(manifest.generationMethod)) {
    report(errors, "FIXTURE_FIELD_MISSING", manifestPath, "generationMethod is unknown");
  }
  if (context.blockedGenerationMethods.has(manifest.generationMethod)) {
    report(errors, "FIXTURE_CLASS_BLOCKED", manifestPath, `${manifest.generationMethod} generationMethod is blocked`);
  }

  validateApproval(errors, manifest, manifestPath, fixtureClass);

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

  const prose = [
    manifest.derivationNotes,
    manifest.consentReleaseStatus,
    manifest.privacyReview,
    manifest.intendedTestScope,
    manifest.limitations
  ]
    .filter(Boolean)
    .join("\n");
  for (const pattern of unsafeClaimPatterns) {
    if (pattern.test(prose)) {
      report(errors, "FIXTURE_UNSAFE_CLAIM", manifestPath, pattern.source);
    }
  }

  if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
    report(errors, "FIXTURE_FIELD_MISSING", manifestPath, "files must be a non-empty array");
    return errors;
  }

  for (const file of manifest.files) {
    if (!isPlainObject(file) || !isNonEmptyString(file.path)) {
      report(errors, "FIXTURE_FIELD_MISSING", manifestPath, "each file requires path");
      continue;
    }

    const filePath = join(root, file.path);
    if (!existsSync(filePath)) {
      report(errors, "FIXTURE_FIELD_MISSING", manifestPath, `${file.path} is missing`);
      continue;
    }

    const actualSize = statSync(filePath).size;
    const media = context.mediaExtensions.includes(extname(file.path).toLowerCase());
    const limit = media ? context.fixtureSizePolicy.mediaMaxBytes : context.fixtureSizePolicy.structuredMaxBytes;

    if (file.sizeBytes === undefined) {
      report(errors, "FIXTURE_MEDIA_SIZE_MISSING", manifestPath, `${file.path} missing sizeBytes`);
    } else if (file.sizeBytes !== actualSize) {
      report(errors, "FIXTURE_MEDIA_SIZE_MISSING", manifestPath, `${file.path} sizeBytes mismatch`);
    }

    if (media && !isNonEmptyString(file.sha256)) {
      report(errors, "FIXTURE_MEDIA_HASH_MISSING", manifestPath, `${file.path} missing sha256`);
    }
    if (isNonEmptyString(file.sha256) && sha256(filePath) !== file.sha256) {
      report(errors, "FIXTURE_MEDIA_HASH_MISSING", manifestPath, `${file.path} sha256 mismatch`);
    }

    if (actualSize >= context.fixtureSizePolicy.blockedMaxBytes) {
      report(errors, "FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET", manifestPath, `${file.path} exceeds budget`);
    } else if (actualSize > limit) {
      if (!isNonEmptyString(file.sizeException)) {
        report(errors, "FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET", manifestPath, `${file.path} missing sizeException`);
      }
      validateApproval(errors, manifest, manifestPath, { requiresMaintainerApproval: true });
    }
  }

  return errors;
}

export function validateFixtureManifest(manifest, options = {}) {
  return validateManifest(
    manifest,
    options.manifestPath ?? fixtureManifestFileName,
    options.root ?? ".",
    policyContext(options.policyData)
  );
}

export function validateFixtureDirectory(root, options = {}) {
  const context = policyContext(options.policyData);
  const manifestPath = join(root, context.fixtureManifestFileName);
  if (!existsSync(manifestPath)) {
    return [{ code: "FIXTURE_PROVENANCE_MISSING", path: manifestPath, detail: "manifest missing" }];
  }
  return validateManifest(JSON.parse(readFileSync(manifestPath, "utf8")), manifestPath, root, context);
}

export function validateFixtureDirectories(directories = fixtureDirectories, options = {}) {
  return directories.flatMap((directory) => validateFixtureDirectory(directory, options));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const errors = validateFixtureDirectories(process.argv.slice(2).length ? process.argv.slice(2) : fixtureDirectories);
  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`${error.code}: ${error.path}: ${error.detail}`);
    }
    process.exit(1);
  }
  console.log("Fixture policy and provenance verified.");
}
