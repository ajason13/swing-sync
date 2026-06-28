export const allowedFixtureLicenses = [
  "Apache-2.0",
  "MIT",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "ISC",
  "CC0-1.0",
  "0BSD"
];

export const fixtureClasses = [
  {
    id: "project-authored-synthetic-landmarks",
    decision: "Allowed",
    notes: "Preferred for math and contract tests. Must not represent a real person's motion.",
    requiresMaintainerApproval: false
  },
  {
    id: "project-authored-synthetic-media",
    decision: "Allowed with provenance",
    notes:
      "Allowed for browser/video plumbing when synthetic by design, small, and documented. Existing mannequin fixture remains limited to pose-extraction integration.",
    requiresMaintainerApproval: true
  },
  {
    id: "derived-non-identifying-landmarks",
    decision: "Review required",
    notes:
      "May be allowed if source rights, transformation, privacy impact, and non-identifying rationale are recorded.",
    requiresMaintainerApproval: true
  },
  {
    id: "maintainer-recorded-personal-media",
    decision: "Blocked by default",
    notes:
      "First-party real-person recording; use recorded-real-person generation method. Requires future explicit approval, consent/release record, privacy review, licensing decision, and limitation language before commit.",
    requiresMaintainerApproval: true,
    blocked: true
  },
  {
    id: "third-party-open-media",
    decision: "Blocked by default",
    notes:
      "Requires source-specific license/terms review, attribution/notice plan, privacy review, and maintainer approval.",
    requiresMaintainerApproval: true,
    blocked: true
  },
  {
    id: "commercial-or-restricted-dataset-media",
    decision: "Blocked",
    notes:
      "Not committable unless a future written permission/contract and policy exception are recorded.",
    requiresMaintainerApproval: true,
    blocked: true
  },
  {
    id: "unknown-or-unlicensed-media",
    decision: "Blocked",
    notes: "No commit.",
    requiresMaintainerApproval: true,
    blocked: true
  },
  {
    id: "model-provider-assets",
    decision: "Blocked unless already approved",
    notes: "Must follow docs/models-licensing.md. SS-014 does not approve new model assets.",
    requiresMaintainerApproval: true,
    blocked: true
  }
];

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

export const requiredManifestFields = [
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
];

export const aiGeneratedRequiredFields = [
  "generationToolName",
  "generationToolVersion",
  "termsUrl",
  "termsReviewDate",
  "inputSourceStatement",
  "aiGeneratedOutputRightsApproval"
];

export const fixtureValidationErrorCodes = [
  "FIXTURE_PROVENANCE_MISSING",
  "FIXTURE_FIELD_MISSING",
  "FIXTURE_CLASS_UNKNOWN",
  "FIXTURE_CLASS_BLOCKED",
  "FIXTURE_LICENSE_BLOCKED",
  "FIXTURE_AI_TERMS_MISSING",
  "FIXTURE_MEDIA_HASH_MISSING",
  "FIXTURE_MEDIA_SIZE_MISSING",
  "FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET",
  "FIXTURE_APPROVAL_REQUIRED",
  "FIXTURE_UNSAFE_CLAIM"
];

export const fixtureSizePolicy = {
  structuredMaxBytes: 100 * 1024,
  mediaMaxBytes: 1024 * 1024,
  blockedMaxBytes: 5 * 1024 * 1024
};

export const mediaExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4", ".mov", ".webm"];

export const fixtureManifestFileName = "FIXTURE-MANIFEST.json";

export const fixtureDirectories = [
  "test/fixtures/math",
  "test/fixtures/pose-landmarker"
];
