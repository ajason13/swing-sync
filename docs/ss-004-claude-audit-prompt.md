# SS-004 Claude Adversarial Audit Prompt

Paste this prompt into a new Claude Chat conversation.

## Prompt

You are the lead adversarial implementation auditor for Swing Sync, an
open-source, local-first PWA for educational golf swing analysis.

This is a voluntary pre-merge implementation audit for:

`SS-004 Scaffold mobile-first PWA and local analysis shell`

Important: You do not have filesystem or GitHub access. Evaluate only the
context, current file contents, and verification evidence embedded below.

### Audit Goal

Challenge whether this MVP application shell is safe and honest to merge.
Prioritize functional defects, fail-open behavior, misleading placeholder
behavior, accessibility regressions, PWA/service-worker risks, insufficient
tests, and violations of the accepted scope.

Visual design polish is explicitly deferred. Do not block merge for subjective
styling preferences unless they create a functional accessibility, overlap,
viewport, or usability defect.

### Required Output

Return:

1. `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`.
2. Merge blockers ordered by severity, with file and code reference.
3. Non-blocking recommendations clearly separated from blockers.
4. Missing tests and edge cases.
5. Explicit answer: `Approved for merge: YES` or `Approved for merge: NO`.

Do not treat future real video capture, storage, analysis, model integration,
exports, or remote sharing as missing SS-004 functionality. Report them only if
the current implementation accidentally performs them or misleadingly implies
they work.

### Story Acceptance Criteria

- App opens directly to capture/upload analysis flow.
- Layout works on mobile and desktop.
- Includes placeholder states for capture, processing, review, and export.
- Basic unit and smoke test setup exists.

### Accepted Scope And Boundaries

- All capture/upload, processing, review, and export behavior must remain
  clearly labeled placeholders.
- No real video access, upload, storage, pose analysis, model calls, export, or
  remote sharing.
- Preserve the existing first-analysis safety acknowledgement and fail-closed
  runtime guard.
- Preserve local-first privacy language.
- No telemetry, remote logging, or other observability was added.
- The service worker may provide same-origin app-shell navigation fallback but
  must not add remote endpoints.
- Cards use an 8px radius or less and avoid nested-card-heavy layout.

### Protected Safety And Privacy Requirements

Relevant `docs/safety-terms.md` requirement:

```markdown
Before the first swing analysis, the app must block analysis until the user has
explicitly acknowledged all of the following:

- Swing Sync is for educational use only.
- Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance, or
  professional athletic instruction.
- Golf practice and movement changes involve risk, and the user accepts
  responsibility for deciding whether and how to practice.
- The user should stop if they feel pain or concerning symptoms and seek
  qualified help when appropriate.
- Raw swing video stays on the device by default unless the user separately
  opts in to a feature that sends it elsewhere.

The consent gate should store only the minimum local acknowledgement state
needed to avoid repeated prompts. It should not upload consent records or raw
video by default.
```

Relevant `docs/privacy-architecture.md` requirements:

```markdown
Swing Sync must process swing video locally by default. Raw swing video and
frame pixels must not be uploaded, sent to model providers, or shared with
remote services unless a future feature adds a separate, explicit opt-in flow
for that action.

The current application does not yet implement video capture, video storage,
pose extraction, model inference, exports, or remote model APIs. The current
consent acknowledgement is a local scaffold, not a durable legal or privacy
record.

Runtime implementation must fail closed. If remote sharing has not been
explicitly enabled for the specific data class and destination, the app should
block the action instead of silently sending data.
```

### Current `src/main.ts`

```typescript
import "./styles.css";
import {
  getNextWorkflowStep,
  getWorkflowStep,
  workflowSteps,
  type WorkflowStepId
} from "./workflow";

const app = document.querySelector<HTMLDivElement>("#app");
// Minimal SS-002 scaffold state; not a durable or legally audited consent record.
const consentStorageKey = "swing-sync:safety-consent:v1";
let activeStep: WorkflowStepId = "capture";

function hasSafetyConsent(): boolean {
  return window.localStorage.getItem(consentStorageKey) === "accepted";
}

function setSafetyConsent(accepted: boolean): void {
  if (accepted) {
    window.localStorage.setItem(consentStorageKey, "accepted");
    return;
  }

  window.localStorage.removeItem(consentStorageKey);
}

function renderWorkflowPanel(consentAccepted: boolean): string {
  if (activeStep === "capture") {
    return `
      <div class="capture-options" aria-label="Capture and upload placeholders">
        <button class="source-option" type="button" data-placeholder-action="camera">
          <span class="source-option__title">Use camera</span>
          <span>Camera capture placeholder</span>
        </button>
        <button class="source-option" type="button" data-placeholder-action="upload">
          <span class="source-option__title">Choose a video</span>
          <span>Local file selection placeholder</span>
        </button>
      </div>
      <div class="action-row">
        <button id="analysis-button" class="primary-action" type="button" ${consentAccepted ? "" : "disabled"}>
          Begin analysis
        </button>
        <p class="action-note">No video is selected, stored, or analyzed in this scaffold.</p>
      </div>
    `;
  }

  if (activeStep === "processing") {
    return `
      <div class="processing-placeholder" aria-label="Processing placeholder">
        <div class="processing-mark" aria-hidden="true"></div>
        <div>
          <strong>Local processing preview</strong>
          <p>Future analysis progress and cancellation controls will appear here.</p>
        </div>
      </div>
      <button class="secondary-action" type="button" data-next-step>
        Preview review state
      </button>
    `;
  }

  if (activeStep === "review") {
    return `
      <div class="review-placeholder" aria-label="Review placeholder">
        <div class="swing-frame">
          <span>Video and pose preview</span>
        </div>
        <dl class="metric-list">
          <div><dt>Tempo</dt><dd>--</dd></div>
          <div><dt>Balance</dt><dd>--</dd></div>
          <div><dt>Rotation</dt><dd>--</dd></div>
        </dl>
      </div>
      <button class="secondary-action" type="button" data-next-step>
        Preview export state
      </button>
    `;
  }

  return `
    <div class="export-placeholder" aria-label="Export placeholder">
      <p class="placeholder-kicker">Future local export</p>
      <h3>Swing summary</h3>
      <p>
        A future export may include selected metrics, feedback, or keyframes.
        Raw swing video will not be included by default.
      </p>
    </div>
    <button class="secondary-action" type="button" disabled>
      Export is not available yet
    </button>
  `;
}

function renderApp(statusMessage?: string): void {
  if (!app) {
    return;
  }

  const consentAccepted = hasSafetyConsent();
  const step = getWorkflowStep(activeStep);
  const currentStatus =
    statusMessage ??
    (consentAccepted
      ? "Consent recorded locally. Analysis can start when analysis features are implemented."
      : "First analysis is blocked until this acknowledgement is checked.");

  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <a class="wordmark" href="/" aria-label="Swing Sync home">Swing Sync</a>
        <span class="local-badge">Local-first scaffold</span>
      </header>

      <main class="workspace">
        <section class="workflow" aria-labelledby="workflow-heading">
          <div class="workflow-intro">
            <div>
              <p class="eyebrow">New analysis</p>
              <h1 id="workflow-heading">Capture or choose your swing</h1>
            </div>
            <p>
              Preview the future local analysis flow. Raw swing video stays on your
              device. No feature will send it elsewhere without a separate,
              explicit opt-in step you initiate.
            </p>
          </div>

          <nav class="step-nav" aria-label="Analysis workflow placeholders">
            ${workflowSteps
              .map(
                (item, index) => `
                  <button
                    class="step-button ${item.id === activeStep ? "is-active" : ""}"
                    type="button"
                    data-step="${item.id}"
                    aria-current="${item.id === activeStep ? "step" : "false"}"
                  >
                    <span class="step-number">${index + 1}</span>
                    <span>${item.shortLabel}</span>
                  </button>
                `
              )
              .join("")}
          </nav>

          <section class="stage" aria-labelledby="stage-heading">
            <div class="stage-heading">
              <div>
                <p class="placeholder-kicker">Placeholder state</p>
                <h2 id="stage-heading">${step.label}</h2>
              </div>
              <span class="stage-status">${step.status}</span>
            </div>
            <p class="stage-description">${step.description}</p>
            ${renderWorkflowPanel(consentAccepted)}
          </section>
        </section>

        <aside class="consent-panel" aria-labelledby="consent-heading">
          <p class="eyebrow">Required before first analysis</p>
          <h2 id="consent-heading">Safety acknowledgement</h2>
          <p>
            Swing Sync is for educational use only. It is not medical advice,
            pain diagnosis, rehabilitation guidance, or professional athletic
            instruction.
          </p>
          <ul>
            <li>Golf practice and swing changes involve injury risk.</li>
            <li>Stop if you feel pain, dizziness, numbness, weakness, or unusual discomfort.</li>
            <li>Consult qualified medical or coaching professionals for personal concerns.</li>
          </ul>
          <label class="consent-check">
            <input id="safety-consent" type="checkbox" ${consentAccepted ? "checked" : ""} />
            <span>I understand Swing Sync is educational only and that golf practice involves physical risk I accept responsibility for.</span>
          </label>
          <p class="privacy-note">
            Only this acknowledgement is stored locally. It is not a durable consent record.
          </p>
          <p class="status" role="status">${currentStatus}</p>
        </aside>
      </main>
    </div>
  `;

  document.querySelector<HTMLInputElement>("#safety-consent")?.addEventListener("change", (event) => {
    setSafetyConsent((event.currentTarget as HTMLInputElement).checked);
    renderApp();
  });

  document.querySelector<HTMLButtonElement>("#analysis-button")?.addEventListener("click", () => {
    if (!hasSafetyConsent()) {
      window.alert("Please acknowledge the safety terms before starting analysis.");
      return;
    }

    activeStep = "processing";
    renderApp("Processing preview opened. No analysis or video handling occurred.");
  });

  document.querySelectorAll<HTMLButtonElement>("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      activeStep = button.dataset.step as WorkflowStepId;
      renderApp(`${getWorkflowStep(activeStep).label} placeholder opened.`);
    });
  });

  document.querySelector<HTMLButtonElement>("[data-next-step]")?.addEventListener("click", () => {
    activeStep = getNextWorkflowStep(activeStep).id;
    renderApp(`${getWorkflowStep(activeStep).label} placeholder opened.`);
  });

  document.querySelectorAll<HTMLButtonElement>("[data-placeholder-action]").forEach((button) => {
    button.addEventListener("click", () => {
      renderApp("Capture and file selection are placeholders. No video was accessed.");
    });
  });
}

renderApp();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}
```

### Current `src/workflow.ts`

```typescript
export const workflowSteps = [
  {
    id: "capture",
    shortLabel: "Capture",
    label: "Capture or upload",
    status: "Ready for consent",
    description: "Choose how a future local analysis session will begin."
  },
  {
    id: "processing",
    shortLabel: "Process",
    label: "Processing",
    status: "Preview only",
    description: "See where local processing progress and controls will appear."
  },
  {
    id: "review",
    shortLabel: "Review",
    label: "Review",
    status: "No results",
    description: "Preview the stable layout for future swing feedback and metrics."
  },
  {
    id: "export",
    shortLabel: "Export",
    label: "Export",
    status: "Unavailable",
    description: "Review how future user-initiated local exports will be explained."
  }
] as const;

export type WorkflowStepId = (typeof workflowSteps)[number]["id"];

export function getWorkflowStep(id: WorkflowStepId) {
  return workflowSteps.find((step) => step.id === id) ?? workflowSteps[0];
}

export function getNextWorkflowStep(id: WorkflowStepId) {
  const currentIndex = workflowSteps.findIndex((step) => step.id === id);
  return workflowSteps[Math.min(currentIndex + 1, workflowSteps.length - 1)];
}
```

### Current PWA Files

`index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#f3f5f1" />
    <meta
      name="description"
      content="A local-first golf swing analysis workflow scaffold."
    />
    <link rel="manifest" href="/manifest.webmanifest" />
    <title>Swing Sync | New analysis</title>
  </head>
  <body>
    <main id="app"></main>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

`public/manifest.webmanifest`:

```json
{
  "name": "Swing Sync",
  "short_name": "Swing Sync",
  "description": "Local-first golf swing analysis workflow scaffold.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f3f5f1",
  "theme_color": "#f3f5f1"
}
```

`public/sw.js`:

```javascript
const cacheName = "swing-sync-shell-v1";
const shellPaths = ["/", "/index.html", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(shellPaths)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") {
    return;
  }

  event.respondWith(fetch(event.request).catch(() => caches.match("/index.html")));
});
```

### Current Tests And Test Configuration

`test/unit/workflow.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { getNextWorkflowStep, getWorkflowStep, workflowSteps } from "../../src/workflow";

describe("analysis workflow model", () => {
  it("opens directly to capture and includes every required placeholder state", () => {
    expect(workflowSteps.map((step) => step.id)).toEqual([
      "capture",
      "processing",
      "review",
      "export"
    ]);
    expect(getWorkflowStep("capture").label).toBe("Capture or upload");
  });

  it("advances through the workflow without moving beyond export", () => {
    expect(getNextWorkflowStep("capture").id).toBe("processing");
    expect(getNextWorkflowStep("processing").id).toBe("review");
    expect(getNextWorkflowStep("review").id).toBe("export");
    expect(getNextWorkflowStep("export").id).toBe("export");
  });
});
```

`test/smoke/app.spec.ts`:

```typescript
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("opens to capture flow and keeps analysis fail closed", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Capture or choose your swing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();

  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(beginAnalysis).toBeDisabled();
  await page.getByRole("checkbox").check();
  await expect(beginAnalysis).toBeEnabled();
  await beginAnalysis.click();

  await expect(page.getByRole("heading", { name: "Processing" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("No analysis or video handling occurred");
});

test("shows every required placeholder state", async ({ page }) => {
  for (const [buttonName, headingName] of [
    ["Process", "Processing"],
    ["Review", "Review"],
    ["Export", "Export"]
  ]) {
    await page.getByRole("button", { name: new RegExp(buttonName) }).click();
    await expect(page.getByRole("heading", { name: headingName })).toBeVisible();
    await expect(page.getByText("Placeholder state")).toBeVisible();
  }
});

test("fits the mobile viewport without horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );

  expect(hasOverflow).toBe(false);
  await expect(page.getByRole("checkbox")).toBeVisible();
});
```

`playwright.config.ts`:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./test/smoke",
  outputDir: "test-results",
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4174",
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 5"] }
    }
  ],
  webServer: {
    command: "node_modules/.bin/vite --host 127.0.0.1 --port 4174",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: true,
    timeout: 20_000
  }
});
```

`vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/unit/**/*.test.ts"]
  }
});
```

### Current `package.json`

```json
{
  "name": "swing-sync",
  "version": "0.1.0",
  "private": true,
  "license": "Apache-2.0",
  "type": "module",
  "description": "Local-first open-source AI golf swing analysis coach.",
  "scripts": {
    "dev": "vite",
    "build": "vite build && node scripts/aggregate-notices.js",
    "build:bundle-license-fixture": "vite build --config vite.config.test.ts",
    "verify:bundle-license-fixture": "node scripts/verify-bundle-license-fixture.js",
    "license:audit": "npm run license:audit:fixtures && node scripts/verify-production-licenses.js",
    "license:audit:fixtures": "node scripts/verify-license-fixtures.js",
    "sbom:generate": "npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file docs/sbom.json --omit dev --validate && node scripts/filter-sbom.js",
    "safety:verify": "node scripts/verify-safety-terms.js",
    "privacy:verify": "node scripts/verify-privacy-boundaries.js",
    "compliance:verify": "node scripts/verify-compliance.js && npm run safety:verify && npm run privacy:verify",
    "test:unit": "vitest run",
    "test:smoke": "playwright test"
  },
  "devDependencies": {
    "@cyclonedx/cyclonedx-npm": "^4.2.1",
    "@onebeyond/license-checker": "^2.2.0",
    "@playwright/test": "1.52.0",
    "@swing-sync-test/bundled-prohibited-package": "file:test/fixtures/bundled-prohibited-package",
    "rollup-plugin-license": "^3.7.1",
    "typescript": "^5.8.3",
    "vite": "^5.4.21",
    "vitest": "2.1.9"
  }
}
```

### Files Intentionally Not Embedded

- `src/styles.css`: reviewed through desktop and Pixel 5 full-page browser
  screenshots. Design polish is deferred. Audit functional CSS concerns only
  when inferable from the DOM/tests/evidence.
- `package-lock.json` and `docs/sbom.json`: generated files. Dependency and SBOM
  verification evidence is provided below.
- Existing compliance scripts and full safety/privacy documents: unchanged by
  SS-004. Relevant protected requirements are embedded above.

### Verification Evidence

All commands ran under Node `22.22.3`:

- `npm run test:unit` -> 2 passed.
- `npm run test:smoke` -> 6 passed across Desktop Chrome and Pixel 5 projects.
- `npm run build` -> passed.
- `npm run compliance:verify` -> passed, including safety and privacy verifiers.
- `npm run license:audit` -> passed.
- `npm run verify:bundle-license-fixture` -> passed.
- `npm run sbom:generate` -> passed; 0 production components.
- `npm audit --omit=dev --audit-level=high` -> 0 vulnerabilities.
- `git diff --check` -> passed.
- GitHub Actions `Dependency and License Compliance` -> passed.
- Desktop and Pixel 5 full-page screenshots were reviewed. No text/control
  overlap was observed. The mobile workflow navigation was revised to display
  all four states without clipping.

### Focus Areas

Attack these assumptions:

- Does the first-analysis action remain fail closed in both UI and runtime?
- Can a placeholder action be mistaken for real capture, processing, review, or
  export?
- Can users bypass consent through workflow navigation in a way that violates
  the actual consent requirement, given that no real analysis exists?
- Is unvalidated `data-step` casting exploitable or likely to create a runtime
  failure?
- Does repeated `innerHTML` rendering introduce a practical security or
  accessibility issue with the current static data?
- Does localStorage failure, denial, or corruption cause a crash or fail-open
  behavior?
- Can the service worker cache/fallback behavior cause stale or broken app
  behavior, especially after deployment under a subpath?
- Are PWA manifest/service-worker claims accurate enough for this scaffold?
- Are the smoke and unit tests sufficient for the accepted scope, and which
  missing tests are genuine merge blockers?

Give a rigorous verdict. Distinguish merge blockers from future hardening and
later visual design work.
