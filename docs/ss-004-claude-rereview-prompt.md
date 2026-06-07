# SS-004 Claude Adversarial Re-Review Prompt

Paste this prompt into a new Claude Chat conversation.

## Prompt

You are the lead adversarial implementation auditor for Swing Sync, an
open-source, local-first PWA for educational golf swing analysis.

This is a focused follow-up review for SS-004 after your previous verdict:
`PASS WITH MINOR FIXES`, approved for merge contingent on three required fixes.

Important: You do not have filesystem or GitHub access. Evaluate only the prior
findings, applied fixes, current snippets, focused diff, and verification
evidence embedded below. Do not repeat the initial broad audit.

### Previous Required Fixes

1. Wrap `localStorage` reads and writes in `try/catch`, with consent reads
   returning `false` on failure so the analysis path fails closed.
2. Replace `window.alert()` in the runtime consent guard with an inline
   `role="status"` update and focus redirect to the consent checkbox.
3. Remove incomplete service-worker shell caching that omitted hashed Vite
   assets. Use `self.skipWaiting()` until proper asset precaching exists.

### Applied Fixes

- `hasSafetyConsent()` now catches storage read failures and returns `false`.
- `setSafetyConsent()` catches storage write/removal failures and latches a
  session-level failure state so previously stored consent cannot remain active
  after a failed removal.
- The runtime consent guard rerenders an inline status message and focuses the
  acknowledgement checkbox.
- The service worker no longer advertises a broken offline fallback or caches
  an incomplete shell. It only activates the current scaffold worker.
- Playwright coverage now forces localStorage read/write/removal exceptions and
  verifies the checkbox resets unchecked and Begin analysis remains disabled.
- Playwright coverage now forces the runtime guard path, verifies the inline
  status message, verifies checkbox focus, and verifies the workflow remains on
  Capture or upload.

### Recommendations Intentionally Deferred

- The low-severity `data-step` cast remains unchanged because the values are
  generated from the internal typed `workflowSteps` list and no external input
  reaches the attribute.
- Other non-blocking test-maturity recommendations remain future work. The
  blocker-linked storage exception test and accessible runtime-guard test were
  added.
- Proper offline asset precaching is deferred until the PWA deployment strategy
  and base path are defined.

### Current `src/main.ts` Fixes

```typescript
let consentStorageFailed = false;

function hasSafetyConsent(): boolean {
  if (consentStorageFailed) {
    return false;
  }

  try {
    return window.localStorage.getItem(consentStorageKey) === "accepted";
  } catch {
    consentStorageFailed = true;
    return false;
  }
}

function setSafetyConsent(accepted: boolean): void {
  try {
    if (accepted) {
      window.localStorage.setItem(consentStorageKey, "accepted");
      return;
    }

    window.localStorage.removeItem(consentStorageKey);
  } catch {
    consentStorageFailed = true;
  }
}
```

```typescript
document.querySelector<HTMLButtonElement>("#analysis-button")?.addEventListener("click", () => {
  if (!hasSafetyConsent()) {
    renderApp("Please acknowledge the safety terms before starting analysis.");
    document.querySelector<HTMLInputElement>("#safety-consent")?.focus();
    return;
  }

  activeStep = "processing";
  renderApp("Processing preview opened. No analysis or video handling occurred.");
});
```

### Current `public/sw.js`

```javascript
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
```

### Current Blocker-Linked Smoke Tests

```typescript
test("fails closed when local consent storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
  });
  await page.reload();

  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(beginAnalysis).toBeDisabled();

  await consent.click();
  await expect(consent).not.toBeChecked();
  await expect(beginAnalysis).toBeDisabled();
});

test("fails closed when stored consent cannot be removed", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.addInitScript(() => {
    Storage.prototype.removeItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
  });
  await page.reload();

  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(consent).toBeChecked();
  await expect(beginAnalysis).toBeEnabled();

  await consent.click();
  await expect(consent).not.toBeChecked();
  await expect(beginAnalysis).toBeDisabled();
});

test("runtime consent guard reports inline and focuses the acknowledgement", async ({ page }) => {
  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });

  await beginAnalysis.evaluate((button) => button.removeAttribute("disabled"));
  await beginAnalysis.click();

  await expect(page.getByRole("status")).toContainText(
    "Please acknowledge the safety terms before starting analysis"
  );
  await expect(consent).toBeFocused();
  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
});
```

### Focused Fix Diff

```diff
diff --git a/public/sw.js b/public/sw.js
@@
-const cacheName = "swing-sync-shell-v1";
-const shellPaths = ["/", "/index.html", "/manifest.webmanifest"];
-
-self.addEventListener("install", (event) => {
-  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(shellPaths)));
+self.addEventListener("install", () => {
+  self.skipWaiting();
 });

 self.addEventListener("activate", (event) => {
-  event.waitUntil(
-    caches
-      .keys()
-      .then((keys) => Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))))
-  );
-});
-
-self.addEventListener("fetch", (event) => {
-  if (event.request.mode !== "navigate") {
-    return;
-  }
-
-  event.respondWith(fetch(event.request).catch(() => caches.match("/index.html")));
+  event.waitUntil(self.clients.claim());
 });
diff --git a/src/main.ts b/src/main.ts
@@
 function hasSafetyConsent(): boolean {
-  return window.localStorage.getItem(consentStorageKey) === "accepted";
+  try {
+    return window.localStorage.getItem(consentStorageKey) === "accepted";
+  } catch {
+    return false;
+  }
 }

 function setSafetyConsent(accepted: boolean): void {
-  if (accepted) {
-    window.localStorage.setItem(consentStorageKey, "accepted");
-    return;
-  }
+  try {
+    if (accepted) {
+      window.localStorage.setItem(consentStorageKey, "accepted");
+      return;
+    }

-  window.localStorage.removeItem(consentStorageKey);
+    window.localStorage.removeItem(consentStorageKey);
+  } catch {
+    // Storage failures intentionally leave the analysis path fail closed.
+  }
 }
@@
     if (!hasSafetyConsent()) {
-      window.alert("Please acknowledge the safety terms before starting analysis.");
+      renderApp("Please acknowledge the safety terms before starting analysis.");
+      document.querySelector<HTMLInputElement>("#safety-consent")?.focus();
       return;
     }
diff --git a/test/smoke/app.spec.ts b/test/smoke/app.spec.ts
@@
+test("fails closed when local consent storage is unavailable", async ({ page }) => {
+  await page.addInitScript(() => {
+    Storage.prototype.getItem = () => {
+      throw new DOMException("Storage is unavailable", "SecurityError");
+    };
+    Storage.prototype.setItem = () => {
+      throw new DOMException("Storage is unavailable", "SecurityError");
+    };
+  });
+  await page.reload();
+
+  const consent = page.getByRole("checkbox");
+  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
+  await expect(beginAnalysis).toBeDisabled();
+
+  await consent.click();
+  await expect(consent).not.toBeChecked();
+  await expect(beginAnalysis).toBeDisabled();
+});
+
+test("runtime consent guard reports inline and focuses the acknowledgement", async ({ page }) => {
+  const consent = page.getByRole("checkbox");
+  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
+
+  await beginAnalysis.evaluate((button) => button.removeAttribute("disabled"));
+  await beginAnalysis.click();
+
+  await expect(page.getByRole("status")).toContainText(
+    "Please acknowledge the safety terms before starting analysis"
+  );
+  await expect(consent).toBeFocused();
+  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
+});
```

### Additional Storage-Removal Hardening Diff

The focused fix review found that a failed `removeItem()` could leave a
previously stored `"accepted"` value readable. This additional fail-closed latch
and regression test were applied before re-review:

```diff
diff --git a/src/main.ts b/src/main.ts
@@
+let consentStorageFailed = false;
 let activeStep: WorkflowStepId = "capture";

 function hasSafetyConsent(): boolean {
+  if (consentStorageFailed) {
+    return false;
+  }
+
   try {
     return window.localStorage.getItem(consentStorageKey) === "accepted";
   } catch {
+    consentStorageFailed = true;
     return false;
   }
@@
     window.localStorage.removeItem(consentStorageKey);
   } catch {
-    // Storage failures intentionally leave the analysis path fail closed.
+    consentStorageFailed = true;
   }
 }
diff --git a/test/smoke/app.spec.ts b/test/smoke/app.spec.ts
@@
+test("fails closed when stored consent cannot be removed", async ({ page }) => {
+  await page.getByRole("checkbox").check();
+  await page.addInitScript(() => {
+    Storage.prototype.removeItem = () => {
+      throw new DOMException("Storage is unavailable", "SecurityError");
+    };
+  });
+  await page.reload();
+
+  const consent = page.getByRole("checkbox");
+  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
+  await expect(consent).toBeChecked();
+  await expect(beginAnalysis).toBeEnabled();
+
+  await consent.click();
+  await expect(consent).not.toBeChecked();
+  await expect(beginAnalysis).toBeDisabled();
+});
```

### Verification After Fixes

All commands ran under Node `22.22.3`:

- `npm run test:smoke` -> 12 passed across Desktop Chrome and Pixel 5 projects.
- `npm run test:unit` -> 2 passed.
- `npm run build` -> passed.
- `npm run compliance:verify` -> passed, including safety and privacy verifiers.
- `npm run license:audit` -> passed.
- `npm run verify:bundle-license-fixture` -> passed.
- `npm run sbom:generate` -> passed; 0 production components.
- `git diff --check` -> passed.

### Required Re-Review Output

Return:

1. `PASS` or `FAIL` for the focused fixes.
2. Whether each of the three prior required fixes is closed.
3. Any new merge blockers introduced by the fixes.
4. Explicit answer: `Approved for merge: YES` or `Approved for merge: NO`.

Do not reopen deferred low-severity recommendations as blockers unless the
focused fix diff introduces new evidence that changes their severity.
