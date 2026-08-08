# SS-019 Compact Claude Final Re-review — CI Verifier Fix

Single-paste evidence; judge only this artifact.

## Role

Independent final auditor for Swing Sync SS-019. Be adversarial; do not implement or expand scope.

## Stage

Final focused re-review. PR #20 is open/unmerged at `4. Final Audit (Claude)`.

## Scope

Review only post-clearance verifier correction `038ce90ce4027199e710e1c81bc01aeedadbd8a0`: revert failed CSS slack and distinguish visible overflow from clipping.

## Context

B-NEW1 previously passed/cleared PR preparation for `ba564f…9721`, not this later test change. Linux `30369511639`, `30369792132`, and `30371137617` failed 320px keyframe geometry; the last used `797023d` with 52px CSS. `038ce90ce4027199e710e1c81bc01aeedadbd8a0` reverts CSS and adds test-only semantics: retain diagnostics; clip only non-visible computed axis overflow; prove visible/hidden overflow using the collector. Linux `30372254895` passed browser regression and compliance at `038ce90ce4027199e710e1c81bc01aeedadbd8a0`.

## Acceptance criteria

Assess AC3 responsive usability and AC4 regression coverage; note any evidenced AC1/AC2/AC5 impact.

## Protected boundaries

No product behavior, copy/selectors, telemetry, dependency/licensing, provider/model, local-first, consent, remote-sharing, service-worker, persistence, exported-data, or manual-execution change. `src/styles.css` returns to pre-experiment state.

## Relevant source contents or focused diff

The three exact final diffs cover every changed tracked file from `797023df056ebc15790ed802acd21502c637c383` to `038ce90ce4027199e710e1c81bc01aeedadbd8a0`; the smoke diff contains complete changed collector/test code. Unchanged runtime/tests, historical artifacts, and nine session prompts are unrelated and preserved.

## Verification

Node `v22.22.3`: helper 2/2, 320 case 2/2, smoke 50/50, build, compliance, safety, privacy, docs, and diff PASS. Linux `30372254895` PASS at `038ce90ce4027199e710e1c81bc01aeedadbd8a0`.

## Known non-goals

No redesign/CSS tuning, manual execution, or dependency/observability work. Deferred non-blockers remain deferred.

## Output required

Verify manifest blocks, then PASS/FAIL; blockers with exact block/minimum fix; collector/test closure; drift analysis; non-blockers; and exactly `CLEARED FOR MERGE` or `NOT CLEARED FOR MERGE`.

## Manifest

| Kind | Path | Lines | Bytes | SHA-256 |
| --- | --- | ---: | ---: | --- |
| Exact final diff | `src/styles.css` | 15 | 297 | `b7ea35f2a1b0175b7083733a0fb94b4c3c03b1a75ca65167fc2066137e4c864e` |
| Exact final diff | `test/smoke/app.spec.ts` | 125 | 5510 | `6158c9352257523b9c1d2145f8913e1f19e07b8015986d80f7049c58a9c8b6e4` |
| Exact final diff | `CONTEXT.md` | 77 | 4894 | `05365940aef8cf0395c458937e728e8a3bc03ae468028271cd16d3740a7e4cf6` |

### 01 Exact final diff: src/styles.css

Lines: 15  
Bytes: 297  
SHA-256: `b7ea35f2a1b0175b7083733a0fb94b4c3c03b1a75ca65167fc2066137e4c864e`  
Basis: reverts the failed 52px CSS experiment

<!-- BEGIN EXACT BLOCK: 01 Exact final diff: src/styles.css -->
````````````````````````````````````````````````
diff --git a/src/styles.css b/src/styles.css
index a2aab21..6e96766 100644
--- a/src/styles.css
+++ b/src/styles.css
@@ -889,10 +889,6 @@ button:disabled {
     padding: 4px;
   }
 
-  .keyframe-button {
-    min-height: 52px;
-  }
-
   .swing-card-summary {
     grid-template-columns: 1fr;
   }
````````````````````````````````````````````````
<!-- END EXACT BLOCK: 01 Exact final diff: src/styles.css -->

### 02 Exact final diff: test/smoke/app.spec.ts

Lines: 125  
Bytes: 5510  
SHA-256: `6158c9352257523b9c1d2145f8913e1f19e07b8015986d80f7049c58a9c8b6e4`  
Basis: complete changed collector semantics and behavioral regression

<!-- BEGIN EXACT BLOCK: 02 Exact final diff: test/smoke/app.spec.ts -->
````````````````````````````````````````````````
diff --git a/test/smoke/app.spec.ts b/test/smoke/app.spec.ts
index 7dd9234..eddee89 100644
--- a/test/smoke/app.spec.ts
+++ b/test/smoke/app.spec.ts
@@ -106,8 +106,8 @@ async function expectMeaningfulHeadingOrder(page: Page): Promise<void> {
   }
 }
 
-async function expectResponsiveGeometry(page: Page, textSelectors: readonly string[]): Promise<void> {
-  const result = await page.evaluate((selectors) => {
+async function collectResponsiveGeometry(page: Page, textSelectors: readonly string[]) {
+  return page.evaluate((selectors) => {
     // Native checkboxes have intentionally compact glyphs with a >=44px labelled row;
     // the defensive native file input is removed from sequential/visual flow.
     const targetExceptions = ["input[type='checkbox']", "#video-file"];
@@ -118,11 +118,30 @@ async function expectResponsiveGeometry(page: Page, textSelectors: readonly stri
     };
     const texts = selectors.flatMap((selector) => [...document.querySelectorAll<HTMLElement>(selector)])
       .filter(isVisible)
-      .map((element) => ({
-        selector: element.id || element.getAttribute("data-focus-key") || element.className || element.tagName,
-        clipped: element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1,
-        rect: element.getBoundingClientRect().toJSON()
-      }));
+      .map((element) => {
+        const style = getComputedStyle(element);
+        const overflowX = style.overflowX;
+        const overflowY = style.overflowY;
+        const scrollWidth = element.scrollWidth;
+        const clientWidth = element.clientWidth;
+        const scrollHeight = element.scrollHeight;
+        const clientHeight = element.clientHeight;
+        const clippedX = scrollWidth > clientWidth + 1 && overflowX !== "visible";
+        const clippedY = scrollHeight > clientHeight + 1 && overflowY !== "visible";
+        return {
+          selector: element.id || element.getAttribute("data-focus-key") || element.className || element.tagName,
+          clipped: clippedX || clippedY,
+          clippedX,
+          clippedY,
+          scrollWidth,
+          clientWidth,
+          scrollHeight,
+          clientHeight,
+          overflowX,
+          overflowY,
+          rect: element.getBoundingClientRect().toJSON()
+        };
+      });
     const controls = [...document.querySelectorAll<HTMLElement>("button, select, input")]
       .filter(isVisible)
       .map((element) => {
@@ -147,12 +166,17 @@ async function expectResponsiveGeometry(page: Page, textSelectors: readonly stri
     });
     return {
       pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
+      textDiagnostics: texts,
       clipped: texts.filter((item) => item.clipped),
       outsideViewport: texts.filter((item) => item.rect.left < 0 || item.rect.right > document.documentElement.clientWidth + 1),
       undersized: controls.filter((control) => !control.excepted && (control.width < 44 || control.height < 44)),
       overlaps
     };
   }, textSelectors);
+}
+
+async function expectResponsiveGeometry(page: Page, textSelectors: readonly string[]): Promise<void> {
+  const result = await collectResponsiveGeometry(page, textSelectors);
   expect(result.pageOverflow).toBe(false);
   expect(result.clipped).toEqual([]);
   expect(result.outsideViewport).toEqual([]);
@@ -160,6 +184,55 @@ async function expectResponsiveGeometry(page: Page, textSelectors: readonly stri
   expect(result.overlaps).toEqual([]);
 }
 
+test("responsive geometry distinguishes visible overflow from hidden clipped content", async ({ page }) => {
+  await page.locator("body").evaluate((body) => {
+    const fixture = document.createElement("div");
+    fixture.innerHTML = `
+      <div id="visible-overflow-fixture">Visible overflow sample</div>
+      <div id="hidden-overflow-fixture">Hidden overflow sample</div>
+    `;
+    Object.assign(fixture.style, {
+      position: "fixed",
+      top: "0",
+      left: "0",
+      zIndex: "-1"
+    });
+    for (const element of fixture.children) {
+      Object.assign((element as HTMLElement).style, {
+        width: "20px",
+        height: "20px",
+        whiteSpace: "nowrap"
+      });
+    }
+    (fixture.children[0] as HTMLElement).style.overflow = "visible";
+    (fixture.children[1] as HTMLElement).style.overflow = "hidden";
+    body.append(fixture);
+  });
+
+  const result = await collectResponsiveGeometry(page, [
+    "#visible-overflow-fixture",
+    "#hidden-overflow-fixture"
+  ]);
+  const visible = result.textDiagnostics.find((item) => item.selector === "visible-overflow-fixture");
+  const hidden = result.textDiagnostics.find((item) => item.selector === "hidden-overflow-fixture");
+
+  expect(visible).toBeDefined();
+  expect(visible!.scrollWidth).toBeGreaterThan(visible!.clientWidth + 1);
+  expect(visible).toMatchObject({
+    clipped: false,
+    clippedX: false,
+    overflowX: "visible"
+  });
+  expect(hidden).toBeDefined();
+  expect(hidden!.scrollWidth).toBeGreaterThan(hidden!.clientWidth + 1);
+  expect(hidden).toMatchObject({
+    clipped: true,
+    clippedX: true,
+    overflowX: "hidden"
+  });
+  expect(result.clipped.map((item) => item.selector)).toEqual(["hidden-overflow-fixture"]);
+});
+
 async function completePhaseReview(page: Page): Promise<void> {
   await page.getByRole("button", { name: "Review phase labels" }).click();
   await page.getByLabel("View", { exact: true }).selectOption("face-on");
````````````````````````````````````````````````
<!-- END EXACT BLOCK: 02 Exact final diff: test/smoke/app.spec.ts -->

### 03 Exact final diff: CONTEXT.md

Lines: 77  
Bytes: 4894  
SHA-256: `05365940aef8cf0395c458937e728e8a3bc03ae468028271cd16d3740a7e4cf6`  
Basis: commit-time delivery-state change

<!-- BEGIN EXACT BLOCK: 03 Exact final diff: CONTEXT.md -->
````````````````````````````````````````````````
diff --git a/CONTEXT.md b/CONTEXT.md
index 4c83d3f..b862016 100644
--- a/CONTEXT.md
+++ b/CONTEXT.md
@@ -32,9 +32,10 @@ Last updated: 2026-07-28
   branch. The exact reviewed commit spans 43 files. Full Node 22 verification
   passes at 24 files / 218 unit tests and 48 desktop/mobile smoke tests.
   Claude focused re-review returned PASS, closed B-NEW1, and explicitly cleared
-  PR preparation. A narrow approved CSS correction is implemented and locally
-  verified for the 320 CSS-pixel keyframe geometry failure; PR #20 remains open
-  and unmerged pending CI and focused Claude re-review before merge.
+  PR preparation. The final verifier fix is test-only and locally verified for
+  the 320 CSS-pixel keyframe geometry failure; `src/styles.css` is restored
+  byte-for-byte to pre-experiment `b1a82c6`. PR #20 remains open and unmerged
+  pending Linux CI and focused Claude re-review before merge.
 - Remaining visible non-Done backlog tasks: SS-019 through SS-022, created
   from the manual app-readiness gap review on 2026-07-03.
 
@@ -584,30 +585,41 @@ SS-019 PR preparation state on 2026-07-28:
   `30369511639` and `30369792132`: 46/48 smoke tests pass, but desktop and
   mobile `keeps real failure review and confirmed export usable at 320 CSS
   pixels` report `keyframe:4` clipped at `119×48.6875`. All preceding
-  license/SBOM/build/compliance steps pass. The approved correction changes
-  only `src/styles.css`: the base keyframe minimum remains 48px and the
-  existing `@media (max-width: 480px)` adds a 52px minimum for 3.3px
-  system-font slack. Local Node 22 targeted 2/2, full smoke 48, build,
-  compliance, safety, privacy, docs, and diff checks pass. PR CI and focused
-  Claude re-review remain required before merge.
+  license/SBOM/build/compliance steps pass. A third run, `30371137617`, on
+  commit `797023d` fails the same 2/48 case despite the exact 52px CSS height;
+  layout slack did not resolve it and the CSS change is being reverted to the
+  audited state. Lead approved a test-only correction: retain raw
+  scroll/client+overflow diagnostics, classify overflow as clipped only when
+  the computed axis overflow is non-visible, and add behavioral visible-vs-
+  hidden overflow regression using the same collector. The final test-only fix
+  now passes under Node `v22.22.3`: named helper 2/2, named 320 case 2/2, and
+  isolated full smoke 50/50, plus build, compliance, safety, privacy, docs, and
+  diff checks. `src/styles.css` is restored byte-for-byte to pre-experiment
+  `b1a82c6`. Linux CI and focused Claude re-review remain required before
+  merge.
 - Next owner: builder/lead for CI review and PR readiness. Observability,
   dependency, protected-copy, selector, local-first, and manual-execution
   posture remain unchanged.
 
 SS-019 PR #20 CI failure state on 2026-07-28:
 
-- PR #20 remains open and unmerged at audited commit
-  `ba564f368df654c07b1a73ad91aa46762cfa9721`; handshake remains
-  `4. Final Audit (Claude)`. Lead approved a narrow correction now implemented
-  in `src/styles.css`: retain the base 48px keyframe minimum and add a 52px
-  minimum inside the existing `@media (max-width: 480px)` for 3.3px
-  system-font slack. The strict verifier is unchanged; no selector, copy,
-  dependency, or observability drift is introduced.
-- Local Node 22 verification passes: targeted 2/2, full smoke 48, build,
-  compliance, safety, privacy, docs, and `git diff --check`. Commit the narrow
-  correction before CI reruns; PR CI and focused Claude re-review remain
+- PR #20 remains open and unmerged; it includes audited implementation commit
+  `ba564f368df654c07b1a73ad91aa46762cfa9721`, coordination commit `b1a82c6`,
+  and failed CSS experiment `797023d`. Handshake remains `4. Final Audit
+  (Claude)`. Run `30371137617` on `797023d` fails the same 2/48 320px keyframe
+  case despite the exact 52px CSS height. The final pending commit will revert
+  CSS and add the test-only verifier/CONTEXT correction; do not infer a PR HEAD
+  hash until it is committed.
+- Lead revised the correction to test-only verifier semantics: preserve raw
+  scroll/client+overflow diagnostics; classify overflow as clipped only when
+  the computed axis overflow is non-visible; add a behavioral visible-vs-hidden
+  overflow regression using the same collector. The completed final fix is
+  test-only and locally passes under Node `v22.22.3`: named helper 2/2, named
+  320 case 2/2, isolated full smoke 50/50, build, compliance, safety, privacy,
+  docs, and diff checks. `src/styles.css` is restored byte-for-byte to
+  pre-experiment `b1a82c6`. Linux CI and focused Claude re-review remain
   required before merge. The existing audit clearance applies only to the
-  audited commit, not this later implementation change.
+  audited commit, not this later test change.
 
 SS-019 feedback-retention note on 2026-07-28:
 
````````````````````````````````````````````````
<!-- END EXACT BLOCK: 03 Exact final diff: CONTEXT.md -->
