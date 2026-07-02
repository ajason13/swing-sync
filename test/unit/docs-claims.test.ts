import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
// @ts-expect-error JS verifier is exercised directly by SS-016 tests.
import { verifyDocsClaims } from "../../scripts/verify-docs-claims.js";

const currentDocs = {
  "README.md": readFileSync("README.md", "utf8"),
  "docs/limitations.md": readFileSync("docs/limitations.md", "utf8"),
  "CONTRIBUTING.md": readFileSync("CONTRIBUTING.md", "utf8"),
  "docs/safety-terms.md": readFileSync("docs/safety-terms.md", "utf8"),
  "docs/privacy-architecture.md": readFileSync("docs/privacy-architecture.md", "utf8")
};

type DocPath = keyof typeof currentDocs;

function errorsFor(overrides: Partial<Record<DocPath, string | null>> = {}) {
  return verifyDocsClaims((filePath: DocPath) => {
    if (filePath in overrides) {
      return overrides[filePath] ?? null;
    }
    return currentDocs[filePath];
  });
}

function without(value: string, requiredText: string) {
  expect(value).toContain(requiredText);
  return value.replace(requiredText, "");
}

describe("docs claim verification", () => {
  it("accepts the current approved public docs", () => {
    expect(errorsFor()).toEqual([]);
  });

  it("rejects missing required public docs", () => {
    expect(errorsFor({ "README.md": null })).toContain(
      "README.md: required file is missing"
    );
  });

  it("rejects missing required headings", () => {
    const content = without(currentDocs["README.md"], "## Current Capabilities");

    expect(errorsFor({ "README.md": content })).toContain(
      'README.md: missing required heading "## Current Capabilities"'
    );
  });

  it("rejects missing canonical strings", () => {
    const canonical =
      "Raw swing video is not uploaded by default. Any future feature that sends raw\n" +
      "video, frame pixels, landmarks, metrics, prompts, reports, or model outputs\n" +
      "outside the browser must use a separate, explicit opt-in flow.";
    const content = without(currentDocs["docs/limitations.md"], canonical);

    expect(errorsFor({ "docs/limitations.md": content })).toContain(
      "docs/limitations.md: missing canonical localFirst string"
    );
  });

  it("rejects missing required links", () => {
    const content = without(currentDocs["CONTRIBUTING.md"], "docs/privacy-architecture.md");

    expect(errorsFor({ "CONTRIBUTING.md": content })).toContain(
      "CONTRIBUTING.md: missing required link docs/privacy-architecture.md"
    );
  });

  it("rejects missing draft banners with structured errors", () => {
    const content = without(
      currentDocs["docs/safety-terms.md"],
      "DRAFT - pending legal/human review; not for release."
    );

    expect(errorsFor({ "docs/safety-terms.md": content })).toContain(
      "docs/safety-terms.md: missing required draft banner"
    );
  });
});
