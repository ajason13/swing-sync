# SS-020 Claude Audit 04 — Verifier And Tests

## Role

Independent verifier/test auditor. Do not implement, grant human clearance, or
infer approval from passing automation.

## Stage

04/05, after recorded PASS results for 01-REREVIEW, 02, and 03. Audit immutable
candidate `e365204ecb763cf36f6663ac88e8f272744bf0fa` on branch
`ss-020-release-review-gate`. A missing/mismatched prerequisite blocks this stage.

## Scope

AC1/AC3/AC4/AC6: declarative/injected fail-closed verification and B1 repair.

## Context

Candidate manifest is exactly `git diff --name-only
0509999e7de5e609787fe53e8bdac2747aa0be64...e365204ecb763cf36f6663ac88e8f272744bf0fa`
and exactly 21 paths:

```text
CONTEXT.md
CONTRIBUTING.md
README.md
docs/handoffs/ss-020-claude-audit-01-governance.md
docs/handoffs/ss-020-claude-audit-01-response.md
docs/handoffs/ss-020-claude-audit-02-inventory-coverage.md
docs/handoffs/ss-020-claude-audit-03-public-claims-sources.md
docs/handoffs/ss-020-claude-audit-04-verifier-tests.md
docs/handoffs/ss-020-claude-audit-05-final-synthesis.md
docs/handoffs/ss-020-claude-final-audit-prompt.md
docs/handoffs/ss-020-claude-final-audit-source-packet.md
docs/limitations.md
docs/privacy-architecture.md
docs/release-review-gate.md
docs/safety-terms.md
docs/ss-020-gemini-research-prompt.md
docs/ss-020-preimplementation-spec.md
docs/ss-020-research-disposition.md
docs/ss-020-research-notes.md
scripts/verify-docs-claims.js
test/unit/docs-claims.test.ts
```

## Acceptance criteria

Confirm four exact B1 anchors/removal tests, injected reads, prior fail-closed
coverage, current PASS, and no parser/refactor.

## Protected boundaries

No runtime/provider/observability/human-review change. Accessibility and
aggregation remain `PENDING`/`BLOCKED`; automation is not clearance.

## Relevant exact source/excerpts

Exact zero-context repair diff from
`git diff --unified=0 e0830d55b34eb7269b6b4abc9a626b5f48c564d0..e365204ecb763cf36f6663ac88e8f272744bf0fa -- scripts/verify-docs-claims.js test/unit/docs-claims.test.ts`:

```diff
diff --git a/scripts/verify-docs-claims.js b/scripts/verify-docs-claims.js
index 9af72be..a14661d 100644
--- a/scripts/verify-docs-claims.js
+++ b/scripts/verify-docs-claims.js
@@ -43,0 +44,11 @@ const requiredStrings = {
+  releaseGateAccessibilityChecklist:
+    "| Are the candidate accessibility evidence, remaining manual risks, and exact public/UI accessibility and limitation wording appropriate for the named scope without implying certification or compliance? | Accessibility reviewer and release owner | SS-019 named automated/manual results, remaining-risk record, and exact candidate UI/public copy | Accessibility reviewer and release owner | Blocking | Pending |",
+  releaseGateAccessibilityPending:
+    "| Accessibility | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |",
+  releaseGateAccessibilityBlocker:
+    "- candidate accessibility evidence or the accountable accessibility reviewer\n" +
+    "  decision is missing or unresolved;",
+  releaseGateAccessibilityReopening:
+    "- accessibility public copy, UI/interaction behavior, or candidate evidence\n" +
+    "  changes, including semantics/names, keyboard/focus, announcements, reflow,\n" +
+    "  nonvisual operation, or assistive-technology scope;",
@@ -224,0 +236,4 @@ const files = {
+      "releaseGateAccessibilityChecklist",
+      "releaseGateAccessibilityPending",
+      "releaseGateAccessibilityBlocker",
+      "releaseGateAccessibilityReopening",
diff --git a/test/unit/docs-claims.test.ts b/test/unit/docs-claims.test.ts
index fceed61..a410460 100644
--- a/test/unit/docs-claims.test.ts
+++ b/test/unit/docs-claims.test.ts
@@ -86,0 +87,67 @@ describe("docs claim verification", () => {
+  });
+
+  it("fails when the accessibility checklist decision anchor is removed", () => {
+    const anchor =
+      "| Are the candidate accessibility evidence, remaining manual risks, and exact public/UI accessibility and limitation wording appropriate for the named scope without implying certification or compliance? | Accessibility reviewer and release owner | SS-019 named automated/manual results, remaining-risk record, and exact candidate UI/public copy | Accessibility reviewer and release owner | Blocking | Pending |";
+
+    expect(
+      errorsFor({
+        "docs/release-review-gate.md": without(
+          currentDocs["docs/release-review-gate.md"],
+          anchor
+        )
+      })
+    ).toContain(
+      "docs/release-review-gate.md: missing canonical releaseGateAccessibilityChecklist string"
+    );
+  });
+
+  it("fails when the Accessibility PENDING domain-row anchor is removed", () => {
+    const anchor =
+      "| Accessibility | `PENDING` | Not recorded | Not recorded | Not recorded | Not recorded |";
+
+    expect(
+      errorsFor({
+        "docs/release-review-gate.md": without(
+          currentDocs["docs/release-review-gate.md"],
+          anchor
+        )
+      })
+    ).toContain(
+      "docs/release-review-gate.md: missing canonical releaseGateAccessibilityPending string"
+    );
+  });
+
+  it("fails when the accessibility blocking-condition anchor is removed", () => {
+    const anchor =
+      "- candidate accessibility evidence or the accountable accessibility reviewer\n" +
+      "  decision is missing or unresolved;";
+
+    expect(
+      errorsFor({
+        "docs/release-review-gate.md": without(
+          currentDocs["docs/release-review-gate.md"],
+          anchor
+        )
+      })
+    ).toContain(
+      "docs/release-review-gate.md: missing canonical releaseGateAccessibilityBlocker string"
+    );
+  });
+
+  it("fails when the accessibility reopening-rule anchor is removed", () => {
+    const anchor =
+      "- accessibility public copy, UI/interaction behavior, or candidate evidence\n" +
+      "  changes, including semantics/names, keyboard/focus, announcements, reflow,\n" +
+      "  nonvisual operation, or assistive-technology scope;";
+
+    expect(
+      errorsFor({
+        "docs/release-review-gate.md": without(
+          currentDocs["docs/release-review-gate.md"],
+          anchor
+        )
+      })
+    ).toContain(
+      "docs/release-review-gate.md: missing canonical releaseGateAccessibilityReopening string"
+    );
```

Exact existing fail-closed/injected-reader excerpts:

```javascript
export function verifyDocsClaims(fileReader = readFileFromDisk) {
  const errors = [];

  for (const [filePath, config] of Object.entries(files)) {
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

```javascript
    for (const stringKey of config.requiredStrings) {
      const expected =
        stringKey === "readmeNonMedical"
          ? "Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance,\nphysical therapy, or a substitute for qualified medical care or professional\ngolf coaching."
          : requiredStrings[stringKey];
      const hasExpected =
        stringKey === "releaseGateBlocked"
          ? normalizeText(content).includes(normalizeText(expected))
          : content.includes(expected);
      if (!hasExpected) {
        errors.push(`${filePath}: missing canonical ${stringKey} string`);
      }
    }
```

```typescript
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
```

The repair diff above retains the exact required-string index and four named
removal tests; these excerpts establish fail-closed reads and self-verification.

## Verification

Node 22 recorded: targeted `40/40`, total `244/244`, all required verifiers,
build, and diff-check PASS. Any discrepancy is a blocker.

## Non-goals

No parser/refactor, policy decision, sign-off, PR, merge, or release.

## Output

Return one structured block no larger than 2,500 UTF-8 bytes: `STAGE_ID: 04`,
exact candidate ID, `VERDICT` exactly `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`,
then `BLOCKERS`, `NON-BLOCKERS`, `MISSING`, `FUTURE`, `NO-CLEARANCE`, and
`NEXT_STAGE`. End `PR PREPARATION NOT PERMITTED`. `NEXT_STAGE: MAY PROCEED TO
STAGE 05` requires exact PASS, blockers none, and missing none; otherwise
`NEXT_STAGE: STOP`. Oversize requires same-chat compact reissue without losing
findings. Any mismatch is FAIL and reopens affected prior stages.
