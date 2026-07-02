# SS-016 Claude Focused Implementation Re-Review Prompt

Paste everything between START and END into Claude Chat for focused
implementation re-review.

## START

Role: You are the independent adversarial implementation auditor for Swing Sync.

Stage: Focused implementation re-review for SS-016 after final audit returned
FAIL with B9.

Scope: Re-review only B9 and cross-cutting risk from the B9 fix. Confirm
negative-path test evidence for `docs:verify` presence-checking logic, confirm
the CLI verifier still passes against real files, and confirm no new protected
boundary regressions were introduced.

Context:
Swing Sync is a local-first browser app for educational golf swing analysis.
SS-016 is safety-, privacy-, legal/trademark-, medical-scope-, compliance-,
licensing/SBOM-, docs-claim-, and user-facing-copy-sensitive. Claude QA
planning blockers B1-B8 were closed before implementation. Claude final
implementation audit verified B1-B8 in implementation but returned FAIL with
B9: missing negative-path test evidence for `docs:verify` presence-checking
logic.

Acceptance criteria:
- README explains purpose, local-first design, safety limits, and setup.
- Limitations page covers pose accuracy, camera setup, and non-medical scope.
- Contributor guide explains task workflow, testing, licenses, and SBOM
  expectations.
- Trademark/non-affiliation disclaimer is visible.

Prior B9 finding:
`scripts/verify-docs-claims.js` self-tested banned-pattern negative fixtures,
but had no executed evidence that missing required files, headings, canonical
strings, required links, or draft banners fail with structured errors.

Protected boundaries:
- Raw swing video and frame pixels must not be uploaded, sent to model
  providers, or shared with remote services unless a future separately reviewed
  feature adds explicit opt-in.
- Derived landmarks, metrics, prompts, reports, selected images, and model
  outputs may still be sensitive or identifying.
- Do not make absolute privacy, deletion, anonymity, legal, compliance, safety,
  medical, injury-prevention, professional coaching, trademark-clearance, or
  guaranteed correctness claims.
- Do not add telemetry, remote logging, hosted analytics, cloud diagnostics,
  cloud storage, hidden identifiers, new workers, provider SDKs,
  provider/model assets, new dependencies, camera capture, raw personal video
  fixtures, service workers, API routes, secrets, or remote-sharing behavior.

Relevant source contents or focused diff:

File: `scripts/verify-docs-claims.js`

```js
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const requiredStrings = {
  nonAffiliation:
    "Swing Sync is an independent open-source project. It is not affiliated with,\n" +
    "endorsed by, sponsored by, or approved by any golf equipment maker, tour,\n" +
    "league, training organization, model provider, or platform vendor. Third-party\n" +
    "names, if referenced, belong to their respective owners.",
  localFirst:
    "Raw swing video is not uploaded by default. Any future feature that sends raw\n" +
    "video, frame pixels, landmarks, metrics, prompts, reports, or model outputs\n" +
    "outside the browser must use a separate, explicit opt-in flow.",
  nonMedical:
    "Swing Sync is for educational golf swing review. It is not medical advice, pain\n" +
    "diagnosis, rehabilitation guidance, physical therapy, or a substitute for\n" +
    "qualified medical care or professional golf coaching.",
  draftReview:
    "The safety and privacy documents are engineering and product drafts pending\n" +
    "human/legal review; they are not legal advice and do not guarantee privacy,\n" +
    "safety, deletion, anonymity, or regulatory compliance.",
};

const files = {
  "README.md": {
    headings: [
      "# Swing Sync",
      "## Current Capabilities",
      "## Local-First Design",
      "## Setup",
      "## Verification",
      "## Documentation",
      "## License",
      "## Non-Affiliation",
    ],
    requiredStrings: [
      "nonAffiliation",
      "localFirst",
      "draftReview",
      "readmeNonMedical",
    ],
    links: ["./docs/safety-terms.md", "./docs/privacy-architecture.md"],
  },
  "docs/limitations.md": {
    headings: [
      "# Limitations",
      "## Pose And Metric Limits",
      "## Camera Setup",
      "## Educational And Non-Medical Scope",
      "## Privacy And Export Limits",
      "## Remote Review Limits",
      "## Fixture And Test Limits",
      "## Draft Review Status",
    ],
    requiredStrings: ["localFirst", "nonMedical", "draftReview"],
    links: ["./safety-terms.md", "./privacy-architecture.md"],
  },
  "CONTRIBUTING.md": {
    headings: [
      "# Contributing",
      "## Environment",
      "## Task Workflow",
      "## Testing",
      "## Licensing, References, Fixtures, And Models",
      "## Safety, Privacy, And Claims",
      "## Pull Requests",
    ],
    requiredStrings: ["localFirst", "nonMedical"],
    links: ["docs/safety-terms.md", "docs/privacy-architecture.md"],
  },
};

const bannedPatterns = {
  "privacy/anonymity": [
    "anonymous",
    "anonymized",
    "de-identified",
    "private by default",
    "privacy guaranteed",
    "guaranteed privacy",
    "never leaves your device",
    "never leaves the device",
  ],
  "deletion/security": [
    "guaranteed deletion",
    "permanent deletion",
    "permanently deleted",
    "physically erased",
    "encrypted by default",
    "secure by default",
    "security guaranteed",
  ],
  "medical/injury": [
    "medical advice",
    "diagnosis",
    "diagnose",
    "rehabilitation plan",
    "physical therapy",
    "injury prevention",
    "prevents injury",
    "treats pain",
    "pain triage",
    "clinically",
  ],
  "correctness/performance": [
    "guaranteed correctness",
    "guaranteed accurate",
    "proves correctness",
    "guaranteed improvement",
    "guaranteed performance",
  ],
  "legal/compliance/trademark": [
    "legally compliant",
    "compliance guaranteed",
    "trademark cleared",
    "trademark-cleared",
    "legally approved",
    "legal advice",
  ],
  "telemetry/analytics": [
    "telemetry",
    "hosted analytics",
    "remote logging",
    "cloud diagnostics",
    "persistent debug artifact",
    "hidden identifier",
  ],
  "absolute remote boundary": [
    "cannot be uploaded",
    "can never be sent",
    "impossible to send",
    "no data ever leaves",
  ],
};

const allowedMatchUnits = new Set(
  [
    "Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance, physical therapy, or a substitute for qualified medical care or professional golf coaching.",
    "It is not medical advice, pain diagnosis, rehabilitation guidance, physical therapy, or a substitute for qualified medical care or professional golf coaching.",
    "Swing Sync is for educational golf swing review. It is not medical advice, pain diagnosis, rehabilitation guidance, physical therapy, or a substitute for qualified medical care or professional golf coaching.",
    "The safety and privacy documents are engineering and product drafts pending human/legal review; they are not legal advice and do not guarantee privacy, safety, deletion, anonymity, or regulatory compliance.",
    "The safety and privacy documents are engineering and product drafts pending human/legal review; they are not legal advice and do not guarantee privacy, safety, deletion, anonymity, or regulatory compliance. SS-002 legal/human review remains a pre-release gate for assumption-of-risk and release-of-liability language.",
  ].map(normalizeText),
);

const negativeFixtures = {
  "privacy/anonymity": "Swing Sync is anonymous and never leaves your device.",
  "deletion/security": "Swing Sync provides guaranteed deletion.",
  "medical/injury": "Swing Sync can diagnose pain and prevents injury.",
  "correctness/performance": "Swing Sync provides guaranteed accurate metrics.",
  "legal/compliance/trademark":
    "Swing Sync is legally compliant and trademark cleared.",
  "telemetry/analytics":
    "Swing Sync uses telemetry and remote logging with a hidden identifier.",
  "absolute remote boundary": "Raw video cannot be uploaded by the app.",
};

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

    for (const heading of config.headings) {
      if (!content.includes(heading)) {
        errors.push(`${filePath}: missing required heading "${heading}"`);
      }
    }

    for (const stringKey of config.requiredStrings) {
      const expected =
        stringKey === "readmeNonMedical"
          ? "Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance,\nphysical therapy, or a substitute for qualified medical care or professional\ngolf coaching."
          : requiredStrings[stringKey];
      if (!content.includes(expected)) {
        errors.push(`${filePath}: missing canonical ${stringKey} string`);
      }
    }

    for (const link of config.links) {
      if (!content.includes(link)) {
        errors.push(`${filePath}: missing required link ${link}`);
      }
    }

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

  assertDraftBanner(
    "docs/safety-terms.md",
    "DRAFT - pending legal/human review; not for release.",
    fileReader,
    errors,
  );
  assertDraftBanner(
    "docs/privacy-architecture.md",
    "DRAFT - pending human/privacy review before public release.",
    fileReader,
    errors,
  );

  for (const [category, fixture] of Object.entries(negativeFixtures)) {
    const fixtureMatches = [];
    for (const unit of scanUnits(fixture)) {
      for (const pattern of bannedPatterns[category]) {
        if (unit.includes(pattern)) {
          fixtureMatches.push(pattern);
        }
      }
    }
    if (fixtureMatches.length === 0) {
      errors.push(`negative fixture for ${category} did not trigger a pattern`);
    }
  }

  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = verifyDocsClaims();

  if (errors.length > 0) {
    console.error("docs:verify failed");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("docs:verify passed");
}

function readFileFromDisk(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, "utf8");
}

function assertDraftBanner(filePath, requiredBanner, fileReader, errors) {
  const content = fileReader(filePath);
  if (content === null) {
    errors.push(`${filePath}: required file is missing`);
    return;
  }
  if (!content.includes(requiredBanner)) {
    errors.push(`${filePath}: missing required draft banner`);
  }
}

function scanUnits(markdown) {
  return markdown
    .split(/\n(?=# )|\n(?=## )|\n\s*\n/g)
    .flatMap((chunk) =>
      chunk
        .replace(/^#+\s+.*$/gm, "")
        .split(/(?<=\.)\s+(?=[A-Z`])/),
    )
    .map(normalizeText)
    .filter(Boolean);
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}
```

File: `test/unit/docs-claims.test.ts`

```ts
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
```

Verification:
- `npm run test:unit -- docs-claims` PASS:
  - `test/unit/docs-claims.test.ts` PASS, 6 tests.
- `npm run docs:verify` PASS: `docs:verify passed`.
- `npm run test:unit` PASS:
  - 14 test files passed.
  - 153 tests passed.
- `npm run safety:verify` PASS:
  - `Safety terms and consent-gate constraints verified.`
- `npm run privacy:verify` PASS:
  - `Privacy architecture and boundary constraints verified.`
- `git diff --check` PASS.
- `npm run build` PASS.
- `npm run compliance:verify` PASS, including `docs:verify` through the
  compliance path.

Known non-goals:
- No runtime behavior changes.
- No dependencies, SDKs, provider integrations, model/provider assets, workers,
  camera capture, service workers, API routes, secrets, telemetry, hosted
  analytics, remote logging, cloud diagnostics, cloud storage, hidden
  identifiers, raw media fixtures, or remote-sharing behavior.
- No PR has been opened yet.

Output required:
- PASS/FAIL verdict for SS-016 PR preparation.
- State whether B9 is closed or still blocking.
- New blockers, if any, ordered by severity with exact required changes.
- Non-blocking recommendations separated from blockers.
- Missing tests, missing claim checks, or edge cases.
- Explicit sign-off status for whether Codex may prepare the SS-016 PR.

## END
