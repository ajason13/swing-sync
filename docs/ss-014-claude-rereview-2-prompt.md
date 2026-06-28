# SS-014 Claude Focused Final Audit Re-Review 2 Prompt

Role: You are Claude, the independent adversarial implementation auditor for
Swing Sync.

Stage: Focused final implementation re-review after Claude confirmed B1, B2,
and B4 closed but returned FAIL on residual B3.

Task: `SS-014 Create fixture swing dataset policy and test fixtures`

Branch: `ss-014-fixtures-policy`

Notion task: https://app.notion.com/p/375834a0c8a681f08c96eeb40e2213f2

## Scope

Re-review only whether Codex closed the residual B3 blocker about dependency
baseline provenance, plus direct side effects of that fix.

Claude already confirmed:

- B1 closed: `recorded-real-person` enforcement now uses canonical
  `blockedGenerationMethods`.
- B2 closed: `aiGeneratedOutputRightsApproval` now validates
  approver/date/mechanism under `FIXTURE_AI_TERMS_MISSING`.
- B4 closed: unsafe-claim variants and tests now cover the audited phrases.

## Prior Residual B3 Finding

Claude found that `test/baselines/package-dependencies.pre-ss-014.json` was a
checked-in static baseline with no demonstrated tie to actual pre-SS-014 git
history. That meant the dependency guard could still be self-referential and
editable by the same change.

## Codex Fix

Codex removed the checked-in baseline file and changed the dependency guard to
compare current `package.json` against the actual SS-014 branch base commit:

`7399ea0403da4ad4da41f7d18cb1312e3445bcc7`

This is the commit recorded in `CONTEXT.md` as the synchronized post-SS-012
main state and the commit from which `ss-014-fixtures-policy` was created.

The existing `@swing-sync-test/bundled-prohibited-package` devDependency remains
present in that base commit. It is a pre-existing local package fixture for the
bundled-license/prohibited-package verification tooling, not an SS-014
dependency addition.

## Current Test Code

Relevant excerpt from `test/unit/fixture-policy.test.ts`:

```ts
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
```

```ts
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
```

There is no longer a checked-in `test/baselines/package-dependencies.pre-ss-014.json`.

## Verification Evidence

Commands rerun after this B3 fix on 2026-06-27 PDT:

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

## Output Required

- PASS/FAIL verdict for this B3-only focused re-review.
- Blocking findings ordered by severity, if any.
- Non-blocking recommendations separated from blockers.
- Missing tests or edge cases.
- Explicit statement whether Codex may prepare the PR after addressing any
  blockers.
