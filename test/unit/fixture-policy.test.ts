import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error JS verifier is exercised directly by SS-014 tests.
import {
  validateFixtureDirectory,
  validateFixtureDirectories,
  validateFixtureManifest
} from "../../scripts/verify-fixtures.js";
// @ts-expect-error Canonical policy data is authored as a zero-dependency Node module.
import {
  blockedGenerationMethods,
  fixtureClasses,
  fixtureValidationErrorCodes,
  generationMethods
} from "../../scripts/fixture-policy-data.mjs";

function tempRoot(): string {
  return mkdtempSync(join(tmpdir(), "swing-sync-fixture-policy-"));
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function baseManifest(overrides: Record<string, unknown> = {}, fileName = "fixture.json") {
  return {
    fixtureId: "test-fixture",
    files: [{ path: fileName, sizeBytes: 2 }],
    fixtureClass: "project-authored-synthetic-landmarks",
    author: "Fixture policy test",
    createdDate: "2026-06-27",
    source: "Project-authored synthetic fixture.",
    generationMethod: "project-authored-manual",
    derivationNotes: "Project-authored deterministic test data.",
    license: "Apache-2.0",
    thirdPartyNotices: "None.",
    consentReleaseStatus: "Not applicable: no real person.",
    privacyReview: "No raw video, frame pixels, or personal data.",
    intendedTestScope: "Fixture policy validator tests.",
    limitations: "Not evidence of real swing biomechanics or model performance.",
    maintainerApproval: null,
    ...overrides
  };
}

function errorsFor(manifest: Record<string, unknown>, contents = "{}") {
  const root = tempRoot();
  const fileName = ((manifest.files as Array<{ path: string }> | undefined)?.[0]?.path ?? "fixture.json");
  writeFileSync(join(root, fileName), contents);
  try {
    return validateFixtureManifest(manifest, { root }).map((error: { code: string }) => error.code);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe("fixture policy validation", () => {
  it("accepts current approved fixture manifests", () => {
    expect(validateFixtureDirectories()).toEqual([]);
  });

  it("loads the synthetic math fixture for geometry-style inputs", () => {
    const fixture = JSON.parse(readFileSync("test/fixtures/math/synthetic-swing-landmarks.json", "utf8"));
    expect(fixture.landmarks).toHaveLength(33);
    expect(fixture.worldLandmarks).toHaveLength(33);
    expect(fixture.baselineLandmarks).toHaveLength(33);
    expect(fixture.handedness).toBe("right");
    expect(fixture.mirrored).toBe("no");
  });

  it("keeps fixture policy documentation aligned with the canonical source", () => {
    const policy = readFileSync("docs/fixture-policy.md", "utf8");
    for (const fixtureClass of fixtureClasses) {
      expect(policy).toContain(fixtureClass.id);
      expect(policy).toContain(fixtureClass.decision);
    }
    for (const method of generationMethods) {
      expect(policy).toContain(method);
    }
  });

  it("drives validation behavior from injected canonical policy data", () => {
    const manifest = baseManifest({ fixtureClass: "test-only-fixture-class" });
    expect(errorsFor(manifest)).toContain("FIXTURE_CLASS_UNKNOWN");

    const root = tempRoot();
    writeFileSync(join(root, "fixture.json"), "{}");
    try {
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
      expect(validateFixtureManifest(manifest, { root, policyData })).toEqual([]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("reports each planned validation error code", () => {
    const missingRoot = tempRoot();
    try {
      expect(validateFixtureDirectory(missingRoot).map((error: { code: string }) => error.code)).toContain(
        "FIXTURE_PROVENANCE_MISSING"
      );
    } finally {
      rmSync(missingRoot, { recursive: true, force: true });
    }

    expect(errorsFor(baseManifest({ author: "" }))).toContain("FIXTURE_FIELD_MISSING");
    expect(errorsFor(baseManifest({ fixtureClass: "typo-class" }))).toContain(
      "FIXTURE_CLASS_UNKNOWN"
    );
    expect(errorsFor(baseManifest({ fixtureClass: "third-party-open-media" }))).toContain(
      "FIXTURE_CLASS_BLOCKED"
    );
    expect(errorsFor(baseManifest({ generationMethod: "recorded-real-person" }))).toContain(
      "FIXTURE_CLASS_BLOCKED"
    );
    expect(errorsFor(baseManifest({ license: "GPL-3.0-only" }))).toContain(
      "FIXTURE_LICENSE_BLOCKED"
    );
    expect(
      errorsFor(baseManifest({ generationMethod: "third-party-ai-generated" }))
    ).toContain("FIXTURE_AI_TERMS_MISSING");
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
    expect(
      errorsFor(
        baseManifest({
          files: [{ path: "fixture.png", sizeBytes: 4, sha256: sha256("data") }]
        }),
        "data"
      )
    ).not.toContain("FIXTURE_MEDIA_HASH_MISSING");
    expect(
      errorsFor(
        baseManifest({
          files: [{ path: "fixture.png", sizeBytes: 4 }]
        }),
        "data"
      )
    ).toContain("FIXTURE_MEDIA_HASH_MISSING");
    expect(
      errorsFor(
        baseManifest({
          files: [{ path: "fixture.png", sha256: sha256("data") }]
        }),
        "data"
      )
    ).toContain("FIXTURE_MEDIA_SIZE_MISSING");
    expect(
      errorsFor(
        baseManifest({
          files: [{ path: "fixture.json", sizeBytes: 1024 * 100 + 1 }]
        }),
        "x".repeat(1024 * 100 + 1)
      )
    ).toContain("FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET");
    expect(
      errorsFor(
        baseManifest({
          fixtureClass: "project-authored-synthetic-media",
          files: [{ path: "fixture.png", sizeBytes: 4, sha256: sha256("data") }]
        }),
        "data"
      )
    ).toContain("FIXTURE_APPROVAL_REQUIRED");
    expect(
      errorsFor(baseManifest({ limitations: "This fixture guarantees privacy." }))
    ).toContain("FIXTURE_UNSAFE_CLAIM");
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
  });

  it("pins size boundaries and AI terms branching", () => {
    expect(
      errorsFor(
        baseManifest({ files: [{ path: "fixture.json", sizeBytes: 1024 * 100 }] }),
        "x".repeat(1024 * 100)
      )
    ).not.toContain("FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET");
    expect(
      errorsFor(
        baseManifest({ files: [{ path: "fixture.json", sizeBytes: 1024 * 100 + 1 }] }),
        "x".repeat(1024 * 100 + 1)
      )
    ).toContain("FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET");
    expect(
      errorsFor(
        baseManifest({
          files: [
            {
              path: "fixture.png",
              sizeBytes: 1024 * 1024,
              sha256: sha256("x".repeat(1024 * 1024))
            }
          ]
        }),
        "x".repeat(1024 * 1024)
      )
    ).not.toContain("FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET");
    expect(
      errorsFor(
        baseManifest({
          files: [
            {
              path: "fixture.png",
              sizeBytes: 1024 * 1024 + 1,
              sha256: sha256("x".repeat(1024 * 1024 + 1))
            }
          ]
        }),
        "x".repeat(1024 * 1024 + 1)
      )
    ).toContain("FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET");
    expect(
      errorsFor(
        baseManifest({
          files: [
            {
              path: "fixture.png",
              sizeBytes: 5 * 1024 * 1024 - 1,
              sha256: sha256("x".repeat(5 * 1024 * 1024 - 1))
            }
          ]
        }),
        "x".repeat(5 * 1024 * 1024 - 1)
      )
    ).toContain("FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET");
    expect(
      errorsFor(
        baseManifest({
          files: [
            {
              path: "fixture.png",
              sizeBytes: 5 * 1024 * 1024,
              sha256: sha256("x".repeat(5 * 1024 * 1024))
            }
          ]
        }),
        "x".repeat(5 * 1024 * 1024)
      )
    ).toContain("FIXTURE_MEDIA_SIZE_EXCEEDS_BUDGET");
    expect(
      errorsFor(baseManifest({ generationMethod: "project-authored-scripted" }))
    ).not.toContain(
      "FIXTURE_AI_TERMS_MISSING"
    );
  });

  it("keeps fixture validation zero-dependency", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
    const basePackageJson = JSON.parse(
      execFileSync("git", ["show", "7399ea0403da4ad4da41f7d18cb1312e3445bcc7:package.json"], {
        encoding: "utf8"
      })
    );
    expect(packageJson.dependencies).toEqual(basePackageJson.dependencies);
    expect(packageJson.devDependencies).toEqual(basePackageJson.devDependencies);
    expect(packageJson.scripts["fixture:verify"]).toBe("node scripts/verify-fixtures.js");
    expect(packageJson.scripts["compliance:verify"]).toContain("npm run fixture:verify");
  });
});
