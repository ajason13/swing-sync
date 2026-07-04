import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
// @ts-expect-error JS verifier is exercised directly by SS-016 tests.
import { verifyDocsClaims } from "../../scripts/verify-docs-claims.js";

const currentDocs = {
  "README.md": readFileSync("README.md", "utf8"),
  "docs/limitations.md": readFileSync("docs/limitations.md", "utf8"),
  "CONTRIBUTING.md": readFileSync("CONTRIBUTING.md", "utf8"),
  "docs/deployment.md": readFileSync("docs/deployment.md", "utf8"),
  "docs/safety-terms.md": readFileSync("docs/safety-terms.md", "utf8"),
  "docs/privacy-architecture.md": readFileSync("docs/privacy-architecture.md", "utf8"),
  "index.html": readFileSync("index.html", "utf8")
};

type DocPath = keyof typeof currentDocs;

function errorsFor(overrides: Partial<Record<string, string | null>> = {}) {
  return verifyDocsClaims((filePath: string) => {
    if (filePath in overrides) {
      return overrides[filePath] ?? null;
    }
    return currentDocs[filePath as DocPath];
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

    expect(errorsFor({ "docs/deployment.md": null })).toContain(
      "docs/deployment.md: required file is missing"
    );
  });

  it("rejects missing required headings", () => {
    const content = without(currentDocs["README.md"], "## Current Capabilities");

    expect(errorsFor({ "README.md": content })).toContain(
      'README.md: missing required heading "## Current Capabilities"'
    );

    const deploymentContent = without(
      currentDocs["docs/deployment.md"],
      "## Security Headers"
    );

    expect(errorsFor({ "docs/deployment.md": deploymentContent })).toContain(
      'docs/deployment.md: missing required heading "## Security Headers"'
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

    const deploymentContent = without(
      currentDocs["docs/deployment.md"],
      canonical
    );

    expect(errorsFor({ "docs/deployment.md": deploymentContent })).toContain(
      "docs/deployment.md: missing canonical localFirst string"
    );

    const noGuarantee =
      "This deployment guidance is product and engineering documentation, not legal,\n" +
      "security, privacy, deletion, anonymity, medical, trademark-clearance, or\n" +
      "regulatory-compliance advice or a guarantee.";

    expect(
      errorsFor({
        "docs/deployment.md": without(
          currentDocs["docs/deployment.md"],
          noGuarantee
        )
      })
    ).toContain(
      "docs/deployment.md: missing canonical deploymentNoGuarantee string"
    );
  });

  it("rejects missing required deployment terms", () => {
    const content = without(currentDocs["docs/deployment.md"], "rate limiting");

    expect(errorsFor({ "docs/deployment.md": content })).toContain(
      "docs/deployment.md: missing required term rate limiting"
    );
  });

  it("rejects missing required links", () => {
    const content = without(currentDocs["CONTRIBUTING.md"], "docs/privacy-architecture.md");

    expect(errorsFor({ "CONTRIBUTING.md": content })).toContain(
      "CONTRIBUTING.md: missing required link docs/privacy-architecture.md"
    );

    const readmeContent = without(currentDocs["README.md"], "./docs/deployment.md");

    expect(errorsFor({ "README.md": readmeContent })).toContain(
      "README.md: missing required link ./docs/deployment.md"
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

    const deploymentContent = without(
      currentDocs["docs/deployment.md"],
      "**DRAFT - pending human security/privacy review before public production hosting.**"
    );

    expect(errorsFor({ "docs/deployment.md": deploymentContent })).toContain(
      "docs/deployment.md: missing canonical deploymentDraft string"
    );
  });

  it("rejects deployment draft banners outside the draft status section", () => {
    const banner =
      "**DRAFT - pending human security/privacy review before public production hosting.**";
    const content =
      currentDocs["docs/deployment.md"].replace(`${banner}\n\n`, "") +
      `\n\n${banner}\n`;

    expect(errorsFor({ "docs/deployment.md": content })).toContain(
      `docs/deployment.md: missing required placement for "${banner}" under "## Draft Review Status"`
    );
  });

  it("rejects deployment security overclaims", () => {
    const content = `${currentDocs["docs/deployment.md"]}\n\nSwing Sync is Hack-Proof and secures your data.`;

    expect(errorsFor({ "docs/deployment.md": content })).toEqual(
      expect.arrayContaining([
        expect.stringContaining('prohibited security guarantee phrase "hack-proof"'),
        expect.stringContaining('prohibited security guarantee phrase "secures your data"')
      ])
    );
  });

  it("rejects production header overclaims", () => {
    const content =
      `${currentDocs["docs/deployment.md"]}\n\n` +
      "Swing Sync is protected by production HTTP security headers. " +
      "Swing Sync ships with CSP enforced in production. " +
      "Production headers are already configured.";

    expect(errorsFor({ "docs/deployment.md": content })).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'prohibited production header overclaim phrase "swing sync is protected by production http security headers"'
        ),
        expect.stringContaining(
          'prohibited production header overclaim phrase "swing sync ships with csp enforced in production"'
        ),
        expect.stringContaining(
          'prohibited production header overclaim phrase "production headers are already configured"'
        ),
      ])
    );
  });

  it("rejects duplicated CSP directives from an injected index file", () => {
    const csp = "default-src 'self'; script-src 'self'";
    const index = `<meta http-equiv="Content-Security-Policy" content="${csp}" />`;
    const content = `${currentDocs["docs/deployment.md"]}\n\n${csp}`;

    expect(
      errorsFor({
        "index.html": index,
        "docs/deployment.md": content
      })
    ).toContain(
      "docs/deployment.md: duplicates CSP meta directive string from index.html"
    );
  });

  it("extracts CSP directives with reordered attributes and varied whitespace", () => {
    const csp = "default-src 'self'; script-src 'self'";
    const index = `<meta
      content='${csp}'
      data-extra="ignored"
      http-equiv="Content-Security-Policy"
    >`;
    const content = `${currentDocs["docs/deployment.md"]}\n\n${csp}`;

    expect(
      errorsFor({
        "index.html": index,
        "docs/deployment.md": content
      })
    ).toContain(
      "docs/deployment.md: duplicates CSP meta directive string from index.html"
    );
  });

  it("fails closed when CSP extraction cannot establish a source value", () => {
    expect(errorsFor({ "index.html": "<html></html>" })).toContain(
      "index.html: could not extract non-empty CSP meta directive string"
    );

    expect(
      errorsFor({
        "index.html":
          '<meta http-equiv="Content-Security-Policy" content="" />'
      })
    ).toContain(
      "index.html: could not extract non-empty CSP meta directive string"
    );

    expect(
      errorsFor({
        "index.html": '<meta http-equiv="Content-Security-Policy" />'
      })
    ).toContain(
      "index.html: could not extract non-empty CSP meta directive string"
    );
  });

  it("extracts CSP directives with matched quote pairs around embedded quotes", () => {
    const doubleQuoted = "default-src 'self'";
    expect(
      errorsFor({
        "index.html": `<meta http-equiv="Content-Security-Policy" content="${doubleQuoted}" />`,
        "docs/deployment.md": `${currentDocs["docs/deployment.md"]}\n\n${doubleQuoted}`
      })
    ).toContain(
      "docs/deployment.md: duplicates CSP meta directive string from index.html"
    );

    const singleQuoted = 'script-src "self"';
    expect(
      errorsFor({
        "index.html": `<meta http-equiv="Content-Security-Policy" content='${singleQuoted}' />`,
        "docs/deployment.md": `${currentDocs["docs/deployment.md"]}\n\n${singleQuoted}`
      })
    ).toContain(
      "docs/deployment.md: duplicates CSP meta directive string from index.html"
    );
  });
});
