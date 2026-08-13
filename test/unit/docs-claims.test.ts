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
  "docs/release-review-gate.md": readFileSync("docs/release-review-gate.md", "utf8"),
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
  it("accepts the current configured public docs and pending release gate", () => {
    expect(errorsFor()).toEqual([]);
  });

  it("fails when the canonical release-gate file is missing", () => {
    expect(errorsFor({ "docs/release-review-gate.md": null })).toContain(
      "docs/release-review-gate.md: required file is missing"
    );
  });

  it("fails when the canonical release-gate file is empty", () => {
    expect(errorsFor({ "docs/release-review-gate.md": "   \n" })).toContain(
      "docs/release-review-gate.md: required file is empty"
    );
  });

  it("fails when the release-gate draft, pending, blocked, or outcome status is missing", () => {
    const gate = currentDocs["docs/release-review-gate.md"];
    const cases = [
      ["DRAFT — HUMAN REVIEW PACKAGE", "releaseGateDraft"],
      ["Current outcome: PENDING", "releaseGateOutcome"],
      [
        "PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED",
        "releaseGateBlocked"
      ]
    ] as const;

    for (const [requiredText, stringKey] of cases) {
      expect(
        errorsFor({
          "docs/release-review-gate.md": without(gate, requiredText)
        })
      ).toContain(
        `docs/release-review-gate.md: missing canonical ${stringKey} string`
      );
    }
  });

  it("fails when the SS-002 legal-review blocker is removed", () => {
    const blocker =
      "SS-002 qualified legal review of the assumption-of-risk and\n" +
      "release-of-liability language is not completed and blocks public release.";

    expect(
      errorsFor({
        "docs/release-review-gate.md": without(
          currentDocs["docs/release-review-gate.md"],
          blocker
        )
      })
    ).toContain(
      "docs/release-review-gate.md: missing canonical releaseGateSs002Blocker string"
    );
  });

  it("fails when the accessibility checklist decision anchor is removed", () => {
    const anchor =
      "| Are the candidate accessibility evidence, remaining manual risks, and exact public/UI accessibility and limitation wording appropriate for the named scope without implying certification or compliance? | Accessibility reviewer and release owner | SS-019 named automated/manual results, remaining-risk record, and exact candidate UI/public copy | Accessibility reviewer and release owner | Blocking | Pending |";

    expect(
      errorsFor({
        "docs/release-review-gate.md": without(
          currentDocs["docs/release-review-gate.md"],
          anchor
        )
      })
    ).toContain(
      "docs/release-review-gate.md: missing canonical releaseGateAccessibilityChecklist string"
    );
  });

  it("fails when the Accessibility PENDING domain-row anchor is removed", () => {
    const anchor =
      "| Accessibility | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |";

    expect(
      errorsFor({
        "docs/release-review-gate.md": without(
          currentDocs["docs/release-review-gate.md"],
          anchor
        )
      })
    ).toContain(
      "docs/release-review-gate.md: missing canonical releaseGateAccessibilityPending string"
    );
  });

  it("fails when the accessibility blocking-condition anchor is removed", () => {
    const anchor =
      "- candidate accessibility evidence or the accountable accessibility reviewer\n" +
      "  decision is missing or unresolved;";

    expect(
      errorsFor({
        "docs/release-review-gate.md": without(
          currentDocs["docs/release-review-gate.md"],
          anchor
        )
      })
    ).toContain(
      "docs/release-review-gate.md: missing canonical releaseGateAccessibilityBlocker string"
    );
  });

  it("fails when the accessibility reopening-rule anchor is removed", () => {
    const anchor =
      "- accessibility public copy, UI/interaction behavior, or candidate evidence\n" +
      "  changes, including semantics/names, keyboard/focus, announcements, reflow,\n" +
      "  nonvisual operation, or assistive-technology scope;";

    expect(
      errorsFor({
        "docs/release-review-gate.md": without(
          currentDocs["docs/release-review-gate.md"],
          anchor
        )
      })
    ).toContain(
      "docs/release-review-gate.md: missing canonical releaseGateAccessibilityReopening string"
    );
  });

  it("fails when a release-gate operational heading or supporting link is removed", () => {
    expect(
      errorsFor({
        "docs/release-review-gate.md": without(
          currentDocs["docs/release-review-gate.md"],
          "### Reopening Rules"
        )
      })
    ).toContain(
      'docs/release-review-gate.md: missing required heading "### Reopening Rules"'
    );

    expect(
      errorsFor({
        "docs/safety-terms.md": without(
          currentDocs["docs/safety-terms.md"],
          "./release-review-gate.md"
        )
      })
    ).toContain(
      "docs/safety-terms.md: missing required link ./release-review-gate.md"
    );
  });

  it("fails when canonical blocked-status control text is duplicated in a supporting document", () => {
    const duplicate =
      `${currentDocs["README.md"]}\n\n` +
      "PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED";

    expect(errorsFor({ "README.md": duplicate })).toEqual(
      expect.arrayContaining([
        "README.md: duplicates canonical blocked-status anchor owned by docs/release-review-gate.md",
        "docs/release-review-gate.md: canonical blocked-status anchor must be uniquely owned across configured public docs (found 2)"
      ])
    );
  });

  it("fails on premature completed-review or public-release-clearance assertions", () => {
    const gate = currentDocs["docs/release-review-gate.md"];
    const assertions = [
      "Legal review is complete.",
      "Privacy review has passed.",
      "Safety review is cleared.",
      "Public release is cleared."
    ];

    for (const assertion of assertions) {
      expect(
        errorsFor({
          "docs/release-review-gate.md": `${gate}\n\n${assertion}`
        })
      ).toEqual(
        expect.arrayContaining([
          expect.stringContaining("premature current human-review approval")
        ])
      );
    }
  });

  it("fails on recorded sign-off, completed review, and public-release approval assertions", () => {
    const gate = currentDocs["docs/release-review-gate.md"];
    const assertions = [
      "Human sign-off is recorded.",
      "Legal review completed.",
      "Public release approved.",
      "Cleared for public release.",
      "All required reviews are complete."
    ];

    for (const assertion of assertions) {
      expect(
        errorsFor({
          "docs/release-review-gate.md": `${gate}\n\n${assertion}`
        })
      ).toEqual(
        expect.arrayContaining([
          expect.stringContaining("premature current human-review approval")
        ])
      );
    }
  });

  it("fails on premature current approval in a supporting public document and reports its path", () => {
    const content =
      `${currentDocs["docs/safety-terms.md"]}\n\n` +
      "Human sign-off is recorded.";

    expect(errorsFor({ "docs/safety-terms.md": content })).toContain(
      'docs/safety-terms.md: premature current human-review approval assertion "human sign-off is recorded"'
    );
  });

  it("fails when a supporting document says legal review is approved and reports its injected path", () => {
    const content =
      `${currentDocs["CONTRIBUTING.md"]}\n\n` +
      "Legal review is approved.";

    expect(errorsFor({ "CONTRIBUTING.md": content })).toContain(
      'CONTRIBUTING.md: premature current human-review approval assertion "legal review is approved"'
    );
  });

  it("fails when a supporting document says legal review approved without a copula", () => {
    const content =
      `${currentDocs["CONTRIBUTING.md"]}\n\n` +
      "Legal review approved.";

    expect(errorsFor({ "CONTRIBUTING.md": content })).toContain(
      'CONTRIBUTING.md: premature current human-review approval assertion "legal review approved"'
    );
  });

  it("allows negated no-copula legal-review approval statements", () => {
    const content =
      `${currentDocs["CONTRIBUTING.md"]}\n\n` +
      "No legal review approved. Legal review not approved.";

    expect(errorsFor({ "CONTRIBUTING.md": content })).toEqual([]);
  });

  it("accepts exactly one canonical PENDING current outcome and no supporting declarations", () => {
    expect(errorsFor()).toEqual([]);
  });

  it("fails when a supporting document declares an approved current outcome and reports its value", () => {
    const content =
      `${currentDocs["README.md"]}\n\n` +
      "**Current outcome: APPROVED FOR NAMED SCOPE**";

    expect(errorsFor({ "README.md": content })).toContain(
      'README.md: current outcome declaration is reserved for docs/release-review-gate.md (found "APPROVED FOR NAMED SCOPE")'
    );
  });

  it("fails when a supporting document duplicates the PENDING current outcome", () => {
    const content =
      `${currentDocs["docs/privacy-architecture.md"]}\n\n` +
      "**Current outcome: PENDING**";

    expect(errorsFor({ "docs/privacy-architecture.md": content })).toContain(
      'docs/privacy-architecture.md: current outcome declaration is reserved for docs/release-review-gate.md (found "PENDING")'
    );
  });

  it("fails when an injected canonical document declares a contradictory approved current outcome", () => {
    const content =
      `${currentDocs["docs/release-review-gate.md"]}\n\n` +
      "**Current outcome: APPROVED FOR NAMED SCOPE**";

    expect(errorsFor({ "docs/release-review-gate.md": content })).toContain(
      'docs/release-review-gate.md: current outcome must be declared exactly once as PENDING (found "PENDING", "APPROVED FOR NAMED SCOPE")'
    );
  });

  it("fails when the canonical current outcome is non-PENDING", () => {
    const content = currentDocs["docs/release-review-gate.md"].replace(
      "Current outcome: PENDING",
      "Current outcome: APPROVED FOR NAMED SCOPE"
    );

    expect(errorsFor({ "docs/release-review-gate.md": content })).toContain(
      'docs/release-review-gate.md: current outcome must be declared exactly once as PENDING (found "APPROVED FOR NAMED SCOPE")'
    );
  });

  it("allows an injected supporting document to say no legal review completed", () => {
    const content =
      `${currentDocs["docs/limitations.md"]}\n\n` +
      "No legal review completed.";

    expect(errorsFor({ "docs/limitations.md": content })).toEqual([]);
  });

  it("allows future outcome definitions that do not assert a current approval", () => {
    const gate =
      `${currentDocs["docs/release-review-gate.md"]}\n\n` +
      "A future qualified reviewer may select APPROVED FOR NAMED SCOPE or APPROVED WITH CONDITIONS.";

    expect(errorsFor({ "docs/release-review-gate.md": gate })).toEqual([]);
  });

  it("allows negated no-clearance language", () => {
    const gate =
      `${currentDocs["docs/release-review-gate.md"]}\n\n` +
      "Legal review is not complete. Privacy review has not passed. " +
      "Safety review is not cleared. No human sign-off is recorded. " +
      "Legal review not completed. Public release not approved. " +
      "Not cleared for public release. Not all required reviews are complete.";

    expect(errorsFor({ "docs/release-review-gate.md": gate })).toEqual([]);
  });

  it("allows future outcome definitions, negations, and no-clearance language in every scanned public document", () => {
    const safeText =
      "A future reviewer may select APPROVED FOR NAMED SCOPE. " +
      "Human sign-off is not recorded. Public release is not approved. " +
      "No legal, privacy, safety, trademark, or public-release clearance is recorded.";
    const scannedPaths = [
      "docs/release-review-gate.md",
      "README.md",
      "CONTRIBUTING.md",
      "docs/limitations.md",
      "docs/safety-terms.md",
      "docs/privacy-architecture.md",
      "docs/deployment.md"
    ] as const;

    for (const filePath of scannedPaths) {
      expect(
        errorsFor({
          [filePath]: `${currentDocs[filePath]}\n\n${safeText}`
        })
      ).toEqual([]);
    }
  });

  it("tolerates normalized whitespace in the unique blocked-status anchor", () => {
    const gate = currentDocs["docs/release-review-gate.md"].replace(
      "PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED",
      "PUBLIC   RELEASE BLOCKED —\n  HUMAN SIGN-OFF NOT RECORDED"
    );

    expect(errorsFor({ "docs/release-review-gate.md": gate })).toEqual([]);
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
