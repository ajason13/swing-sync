# SS-020 Claude Audit 04 — Verifier And Tests

## Role

Independent audit; no clearance.

## Stage

04/05. Candidate `4e5dd4029da053ebb145b0a15416cbd5450b8fb1`; branch `ss-020-release-review-gate`; no PR/sign-off; runtime/observability unchanged.

## Scope

AC1/3/4/6 enforcement.

Candidate `4e5dd4029da053ebb145b0a15416cbd5450b8fb1`: 20 baseline-relative paths (15 tracked + 5 staged). path|owner|mode|reason; E exact, E+S exact+index, F diff, S summary, W stage; B bounded, H history, N none.
```text
CONTEXT.md|01|E|B
CONTRIBUTING.md|01/03|E|B
README.md|03|E|B
docs/handoffs/ss-020-claude-final-audit-prompt.md|01|E|N
docs/handoffs/ss-020-claude-final-audit-source-packet.md|01|E|N
docs/limitations.md|03|E|B
docs/privacy-architecture.md|03|F|N
docs/release-review-gate.md|01/02/03|E+S|B
docs/safety-terms.md|01/03|E|B
docs/ss-020-gemini-research-prompt.md|01|S|H
docs/ss-020-preimplementation-spec.md|01|S|H
docs/ss-020-research-disposition.md|01|S|H
docs/ss-020-research-notes.md|01|S|H
scripts/verify-docs-claims.js|04|E|B
test/unit/docs-claims.test.ts|04|E|B
docs/handoffs/ss-020-claude-audit-01-governance.md|01|W|N
docs/handoffs/ss-020-claude-audit-02-inventory-coverage.md|02|W|N
docs/handoffs/ss-020-claude-audit-03-public-claims-sources.md|03|W|N
docs/handoffs/ss-020-claude-audit-04-verifier-tests.md|04|W|N
docs/handoffs/ss-020-claude-audit-05-final-synthesis.md|05|W|N
```



Material omission is a blocker.

## Context

No human clearance.

## Acceptance criteria

AC1/3/4/6 controls.

## Protected boundaries

No parallel verifier or runtime/data/provider/deployment change.

## Relevant source contents or complete focused diffs

Bounded scan L102-115 VERBATIM
```markdown
### Bounded Public-Document Standard Claim-Scan Result

The standard prohibited-claim scan covers only the configured public summaries
`README.md`, `CONTRIBUTING.md`, `docs/limitations.md`, and
`docs/deployment.md`. Safety, privacy, and this canonical gate use their
separate structural, required-string, link, and current-approval controls
because their draft and inventory text legitimately names prohibited claim
categories.

**Current standard claim-scan result: PASS for the four configured summaries.**
This result is bounded to the checked files, patterns, and current repository
content. Verifier success is not qualified-human legal, privacy, safety,
medical, trademark, compliance, or public-release clearance.

```

Verifier L28-50 VERBATIM
```javascript
  safetyDraft: "DRAFT - pending legal/human review; not for release.",
  privacyDraft:
    "DRAFT - pending human/privacy review before public release.",
  releaseGateDraft: "DRAFT — HUMAN REVIEW PACKAGE",
  releaseGateOutcome: "Current outcome: PENDING",
  releaseGateBlocked:
    "PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED",
  releaseGateNoClearance:
    "This package records no legal, privacy, safety, medical, trademark, compliance,\n" +
    "or public-release clearance.",
  releaseGateHumanBoundary:
    "Claude and automated checks cannot substitute for\n" +
    "qualified human reviewers.",
  releaseGateSs002Blocker:
    "SS-002 qualified legal review of the assumption-of-risk and\n" +
    "release-of-liability language is not completed and blocks public release.",
  releaseGateSourceDate: "Accessed: 2026-08-08",
  releaseGateCodeFact: "Code/test-enforced fact",
  releaseGateDesignIntent: "Documented design intent",
  releaseGateUnresolved: "Unresolved assumption",
  releaseGateHumanReview: "Qualified-human review required",
  releaseGateDeferred: "Deferred / non-goal",
};
```

Verifier L165-235 VERBATIM
```javascript
  "docs/safety-terms.md": {
    headings: [
      "# Safety Terms and Educational Use Draft",
      "## Intended Use",
      "## Assumption of Risk Draft",
      "## Release of Liability Draft",
      "## Educational Feedback Boundary",
      "## Consent Gate Requirement",
      "## AI Coach Prompt Constraints",
      "## Review Checklist",
    ],
    requiredStrings: ["safetyDraft"],
    links: ["./release-review-gate.md"],
    scanBannedClaims: false,
  },
  "docs/privacy-architecture.md": {
    headings: [
      "# Privacy Architecture and Video Data Lifecycle",
      "## Default Privacy Posture",
      "## Data Classes",
      "## Local-First Processing Flow",
      "## Video Lifecycle",
      "## Export Policy",
      "## Optional Remote Model or Coach Sharing",
      "## User-Facing Copy Drafts",
      "## Future Implementation Gates",
      "## SS-005 MediaPipe Provider-Metrics Gate",
    ],
    requiredStrings: ["privacyDraft"],
    links: ["./release-review-gate.md"],
    scanBannedClaims: false,
  },
  "docs/release-review-gate.md": {
    headings: [
      "# Release Review Gate",
      "## Current Status",
      "## Evidence Taxonomy",
      "## Public-Language Inventory",
      "## Publication-Review Matrix",
      "## Qualified-Human Checklist And Open Decisions",
      "## Operational Gate Contract",
      "### Entry Criteria",
      "### Required Artifacts",
      "### Permitted Future Outcomes",
      "### Sign-Off Record",
      "#### Durable Authenticated Record Location",
      "#### Required Reviewer Domain Status",
      "#### Aggregation Authority And Rule",
      "### Blocking Conditions",
      "### Reopening Rules",
      "## Primary-Source Register",
      "## Non-Goals And Deferred Work",
    ],
    requiredStrings: [
      "releaseGateDraft",
      "releaseGateOutcome",
      "releaseGateBlocked",
      "releaseGateNoClearance",
      "releaseGateHumanBoundary",
      "releaseGateSs002Blocker",
      "releaseGateSourceDate",
      "releaseGateCodeFact",
      "releaseGateDesignIntent",
      "releaseGateUnresolved",
      "releaseGateHumanReview",
      "releaseGateDeferred",
    ],
    links: [],
    scanBannedClaims: false,
  },
};
```

Verifier L354-362 VERBATIM
```javascript
const releaseReviewPublicPaths = [
  "docs/release-review-gate.md",
  "README.md",
  "CONTRIBUTING.md",
  "docs/limitations.md",
  "docs/safety-terms.md",
  "docs/privacy-architecture.md",
  "docs/deployment.md",
];
```

Verifier L372-413 VERBATIM
```javascript
  {
    kind: "prematureCurrentApproval",
    targetPaths: releaseReviewPublicPaths,
    description: "premature current human-review approval",
    patterns: [
      /\b(?:legal|privacy|safety|trademark|public-release) review is complete\b/i,
      /\b(?:legal|privacy|safety|trademark|public-release) review has passed\b/i,
      /\b(?:legal|privacy|safety|trademark|public-release) review is cleared\b/i,
      /\bpublic release (?:is cleared|has passed|is approved)\b/i,
      /(?<!\bno )\bhuman sign-off is recorded\b/i,
      /(?<!\bno )\b(?:legal|privacy|safety|trademark|public(?:-| )release) review completed\b/i,
      /(?<!\bno )\b(?:legal|privacy|safety|trademark|licensing|accessibility|product(?:\/| and )evidence|security(?:\/| and )deployment|public(?:-| )release) review is approved\b/i,
      /(?<!\bno )\b(?:legal|privacy|safety|trademark|licensing|accessibility|product(?:\/| and )evidence|security(?:\/| and )deployment|public(?:-| )release) review approved\b/i,
      /\bpublic release approved\b/i,
      /(?<!\bnot )\bcleared for public release\b/i,
      /(?<!\bnot )\ball required reviews are complete\b/i,
    ],
  },
  {
    kind: "currentOutcome",
    ownerPath: "docs/release-review-gate.md",
    paths: releaseReviewPublicPaths,
    expectedOutcome: "PENDING",
    extractPattern:
      /^\s*(?:\*\*)?current outcome\s*:\s*([^*\r\n]+?)(?:\*\*)?\s*$/gim,
    description: "current outcome",
  },
  {
    kind: "uniqueNormalizedOwner",
    ownerPath: "docs/release-review-gate.md",
    paths: [
      "docs/release-review-gate.md",
      "README.md",
      "CONTRIBUTING.md",
      "docs/limitations.md",
      "docs/safety-terms.md",
      "docs/privacy-architecture.md",
    ],
    text: requiredStrings.releaseGateBlocked,
    description: "canonical blocked-status anchor",
  },
];
```

Verifier L418-427 VERBATIM
```javascript
  for (const [filePath, config] of Object.entries(files)) {
    const content = fileReader(filePath);
    if (content === null) {
      errors.push(`${filePath}: required file is missing`);
      continue;
    }

    if (!content.trim()) {
      errors.push(`${filePath}: required file is empty`);
      continue;
```

Verifier L441-448 VERBATIM
```javascript
      const hasExpected =
        stringKey === "releaseGateBlocked"
          ? normalizeText(content).includes(normalizeText(expected))
          : content.includes(expected);
      if (!hasExpected) {
        errors.push(`${filePath}: missing canonical ${stringKey} string`);
      }
    }
```

Verifier L466-478 VERBATIM
```javascript
    if (config.scanBannedClaims !== false) {
      for (const unit of scanUnits(content)) {
        for (const [category, patterns] of Object.entries(bannedPatterns)) {
          for (const pattern of patterns) {
            if (unit.includes(pattern) && !allowedMatchUnits.has(unit)) {
              errors.push(
                `${filePath}: prohibited ${category} phrase "${pattern}" in "${unit}"`,
              );
            }
          }
        }
      }
    }
```

Verifier L508-519 VERBATIM
```javascript
  for (const check of crossFileChecks) {
    if (check.kind === "prematureCurrentApproval") {
      assertNoPrematureCurrentApproval(check, fileReader, errors);
      continue;
    }
    if (check.kind === "currentOutcome") {
      assertCurrentOutcome(check, fileReader, errors);
      continue;
    }
    if (check.kind === "uniqueNormalizedOwner") {
      assertUniqueNormalizedOwner(check, fileReader, errors);
      continue;
```

Verifier L609-698 VERBATIM
```javascript
function assertNoPrematureCurrentApproval(check, fileReader, errors) {
  for (const targetPath of check.targetPaths) {
    const content = fileReader(targetPath);
    if (content === null) {
      continue;
    }

    const normalized = normalizeText(content);
    for (const pattern of check.patterns) {
      const match = normalized.match(pattern);
      if (match) {
        errors.push(
          `${targetPath}: ${check.description} assertion "${match[0]}"`,
        );
      }
    }
  }
}

function assertCurrentOutcome(check, fileReader, errors) {
  for (const filePath of check.paths) {
    const content = fileReader(filePath);
    if (content === null) {
      continue;
    }

    const extractPattern = new RegExp(
      check.extractPattern.source,
      check.extractPattern.flags,
    );
    const outcomes = [...content.matchAll(extractPattern)].map((match) =>
      normalizeText(match[1]).toUpperCase(),
    );
    const found = outcomes.length
      ? outcomes.map((outcome) => `"${outcome}"`).join(", ")
      : "none";

    if (filePath === check.ownerPath) {
      if (outcomes.length !== 1 || outcomes[0] !== check.expectedOutcome) {
        errors.push(
          `${filePath}: ${check.description} must be declared exactly once as ${check.expectedOutcome} (found ${found})`,
        );
      }
    } else if (outcomes.length > 0) {
      errors.push(
        `${filePath}: ${check.description} declaration is reserved for ${check.ownerPath} (found ${found})`,
      );
    }
  }
}

function assertUniqueNormalizedOwner(check, fileReader, errors) {
  const normalizedText = normalizeText(check.text);
  let totalOccurrences = 0;
  let ownerOccurrences = 0;

  for (const filePath of check.paths) {
    const content = fileReader(filePath);
    if (content === null) {
      continue;
    }

    const occurrences = countOccurrences(normalizeText(content), normalizedText);
    totalOccurrences += occurrences;
    if (filePath === check.ownerPath) {
      ownerOccurrences = occurrences;
    } else if (occurrences > 0) {
      errors.push(
        `${filePath}: duplicates ${check.description} owned by ${check.ownerPath}`,
      );
    }
  }

  if (ownerOccurrences !== 1) {
    errors.push(
      `${check.ownerPath}: ${check.description} must occur exactly once in its owner (found ${ownerOccurrences})`,
    );
  }
  if (totalOccurrences !== 1) {
    errors.push(
      `${check.ownerPath}: ${check.description} must be uniquely owned across configured public docs (found ${totalOccurrences})`,
    );
  }
}

function countOccurrences(value, search) {
  if (!search) return 0;
  return value.split(search).length - 1;
}

```

Verifier L735-737 VERBATIM
```javascript
function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}
```

Tests L6-26 VERBATIM
```typescript
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
```

Tests L38-48 VERBATIM
```typescript
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
```

Tests L113-125 VERBATIM
```typescript
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

```

Tests L191-207 VERBATIM
```typescript
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
```

Tests L213-241 VERBATIM
```typescript
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
```

Tests L281-303 VERBATIM
```typescript
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
```

Tests L305-312 VERBATIM
```typescript
  it("tolerates normalized whitespace in the unique blocked-status anchor", () => {
    const gate = currentDocs["docs/release-review-gate.md"].replace(
      "PUBLIC RELEASE BLOCKED — HUMAN SIGN-OFF NOT RECORDED",
      "PUBLIC   RELEASE BLOCKED —\n  HUMAN SIGN-OFF NOT RECORDED"
    );

    expect(errorsFor({ "docs/release-review-gate.md": gate })).toEqual([]);
  });
```

Tests L522-542 VERBATIM
```typescript
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
```

T1-7 package/missing/status/SS002/link/duplicate; T8-13 approvals/copula/negation; T14-18 PENDING owner/conflicts (T18 retained); T19-23 future/seven paths/normalized; T24-30 docs/structure/links/banners; T31-36 security/CSP/extraction/fail-closed. 36/36 PASS.

## Verification

Recorded: Node22 36/36 + verifiers/build/diff PASS.

## Known non-goals

No runtime/PR/merge/release.

## Output required

Fields: `STAGE_ID: 04`; `CANDIDATE_ID: 4e5dd4029da053ebb145b0a15416cbd5450b8fb1`; `VERDICT` exactly one of `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`; blockers/non-blockers/future/missing/no-clearance. <=350 words/3500 bytes; no restatement. End `PR PREPARATION NOT PERMITTED`. Oversize: same-chat compact reissue preserving findings; save both, hash final. Check fail-open, missing/empty, registration, PENDING owner, negation, duplicate, reader, formatting/parser. Non-PASS blocks; reopen affected.
