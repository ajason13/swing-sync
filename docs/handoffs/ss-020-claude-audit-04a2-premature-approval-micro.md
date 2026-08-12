# SS-020 04A2

Audit AC4 no-clearance enforcement only. Candidate
`e365204ecb763cf36f6663ac88e8f272744bf0fa`; base `0509999e...`. PASS or
STOP; 04A1/04A2/04A3 must all PASS before 04B.

Claude has no filesystem/repo/shell access; review only pasted evidence.
Excerpts are exact local `git show e365204:<path>` output, not independently
fetched/hash-verified. Omit the 21-path manifest: focused verifier/tests only.

Exact config (`scripts/verify-docs-claims.js`):
```js
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
```js
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
```

Exact dispatch/assertion and common injected-reader handling:
```js
    if (check.kind === "prematureCurrentApproval") {
      assertNoPrematureCurrentApproval(check, fileReader, errors);
      continue;
    }
```
```js
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
```
```js
    const content = fileReader(filePath);
    if (content === null) {
      errors.push(`${filePath}: required file is missing`);
      continue;
    }

    if (!content.trim()) {
      errors.push(`${filePath}: required file is empty`);
      continue;
    }
```

Exact Node 22 names (candidate-identical blobs) and summary:
```text
accepts the current configured public docs and pending release gate
fails on premature completed-review or public-release-clearance assertions
fails on premature current approval in a supporting public document and reports its path
fails when a supporting document says legal review is approved and reports its injected path
fails when a supporting document says legal review approved without a copula
allows negated no-copula legal-review approval statements
      Tests  40 passed (40)
```

Return exactly one mode. Evidence reviewed:
```text
STAGE_ID/CANDIDATE_ID: 04A2/e365204ecb763cf36f6663ac88e8f272744bf0fa
AC4_NO_CLEARANCE: PASS|FAIL
VERDICT: PASS|FAIL
BLOCKERS_OR_MISSING: none|numbered items
NEXT: 04A3|STOP; NO_CLEARANCE
```

Or unavailable:
```text
STAGE_ID: 04A2
STATUS: HANDOFF UNAVAILABLE—NO VERDICT
WHY: reason
EVIDENCE_NEEDED: items
NO_CANDIDATE_VERDICT: true; STOP
```
