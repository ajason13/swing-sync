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
