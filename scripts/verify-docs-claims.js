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
  deploymentDraft:
    "**DRAFT - pending human security/privacy review before public production hosting.**",
  deploymentNoGuarantee:
    "This deployment guidance is product and engineering documentation, not legal,\n" +
    "security, privacy, deletion, anonymity, medical, trademark-clearance, or\n" +
    "regulatory-compliance advice or a guarantee.",
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
    links: [
      "./docs/safety-terms.md",
      "./docs/privacy-architecture.md",
      "./docs/deployment.md",
    ],
    placement: [
      {
        heading: "## Documentation",
        text: "- [Deployment](./docs/deployment.md)",
      },
    ],
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
  "docs/deployment.md": {
    headings: [
      "# Deployment",
      "## Draft Review Status",
      "## Current Production Posture",
      "## No-Backend Implications",
      "## Local Development",
      "## Production Hosting Requirements",
      "## Security Headers",
      "## Local-First Data Boundary",
      "## Backend Architecture Review Gates",
      "## Non-Goals For SS-017",
      "## Verification",
    ],
    requiredStrings: ["deploymentDraft", "deploymentNoGuarantee", "localFirst"],
    links: ["./privacy-architecture.md", "./safety-terms.md"],
    terms: [
      "auth",
      "accounts",
      "secrets",
      "rate limiting",
      "server logs",
      "data-retention",
      "Content-Security-Policy",
      "Strict-Transport-Security",
      "X-Content-Type-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "APIs",
      "remote model providers",
      "cloud storage",
      "telemetry",
      "analytics",
      "remote logging",
      "CSP report collection",
      "retention",
      "deletion",
      "raw swing video",
    ],
    placement: [
      {
        heading: "## Draft Review Status",
        text: requiredStrings.deploymentDraft,
        firstParagraph: true,
      },
    ],
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
  "security guarantee": [
    "secures your data",
    "prevents attacks",
    "hack-proof",
    "hack proof",
    "breach-proof",
    "breach proof",
    "protected against breaches",
    "stops attackers",
    "guaranteed protection",
  ],
  "production header overclaim": [
    "swing sync is deployed with hsts",
    "swing sync is protected by production http security headers",
    "swing sync ships with csp enforced in production",
    "production headers are already configured",
    "production security headers are configured",
    "hsts is enabled in production",
    "csp is enforced in production",
    "content-security-policy is enforced in production",
  ],
};

const allowedMatchUnits = new Set(
  [
    "Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance, physical therapy, or a substitute for qualified medical care or professional golf coaching.",
    "It is not medical advice, pain diagnosis, rehabilitation guidance, physical therapy, or a substitute for qualified medical care or professional golf coaching.",
    "Swing Sync is for educational golf swing review. It is not medical advice, pain diagnosis, rehabilitation guidance, physical therapy, or a substitute for qualified medical care or professional golf coaching.",
    "The safety and privacy documents are engineering and product drafts pending human/legal review; they are not legal advice and do not guarantee privacy, safety, deletion, anonymity, or regulatory compliance.",
    "The safety and privacy documents are engineering and product drafts pending human/legal review; they are not legal advice and do not guarantee privacy, safety, deletion, anonymity, or regulatory compliance. SS-002 legal/human review remains a pre-release gate for assumption-of-risk and release-of-liability language.",
    "This deployment guidance is product and engineering documentation, not legal, security, privacy, deletion, anonymity, medical, trademark-clearance, or regulatory-compliance advice or a guarantee.",
    "Swing Sync is currently a static frontend browser app for deployment purposes. SS-017 does not add an application backend, server routes, hosted functions, accounts, authentication, server-side secrets, telemetry, analytics, remote logging, cloud storage, model providers, provider SDKs, or remote sharing.",
    "SS-017 does not add an application backend, server routes, hosted functions, accounts, authentication, server-side secrets, telemetry, analytics, remote logging, cloud storage, model providers, provider SDKs, or remote sharing.",
    "Do not place app secrets, provider keys, model-provider credentials, account tokens, telemetry endpoints, analytics collectors, remote logging sinks, cloud storage buckets, or remote sharing destinations into production hosting as part of SS-017.",
    "A separate backend architecture review is required before any future feature adds or changes: - auth, accounts, roles, sessions, identity providers, or account recovery; - server APIs, hosted functions, queues, jobs, webhooks, or server middleware; - server-side secrets, API keys, signing keys, tokens, credential storage, or key rotation; - app-owned rate limiting, abuse controls, quotas, or enforcement logs; - application server logs, CSP report collection, Network Error Logging, telemetry, analytics, cloud diagnostics, or remote error reporting; - cloud storage, sync, backups, retention, deletion, export, or account data workflows; - remote model providers, provider SDKs, model assets, hosted inference, or provider-specific terms; - raw-video, frame-pixel, landmark, metric, prompt, report, or model-output remote sharing; or - production host changes that alter security headers, origins, redirects, caching, service workers, or data flow.",
    "- auth, accounts, roles, sessions, identity providers, or account recovery; - server APIs, hosted functions, queues, jobs, webhooks, or server middleware; - server-side secrets, API keys, signing keys, tokens, credential storage, or key rotation; - app-owned rate limiting, abuse controls, quotas, or enforcement logs; - application server logs, CSP report collection, Network Error Logging, telemetry, analytics, cloud diagnostics, or remote error reporting; - cloud storage, sync, backups, retention, deletion, export, or account data workflows; - remote model providers, provider SDKs, model assets, hosted inference, or provider-specific terms; - raw-video, frame-pixel, landmark, metric, prompt, report, or model-output remote sharing; or - production host changes that alter security headers, origins, redirects, caching, service workers, or data flow.",
    "application server logs, CSP report collection, Network Error Logging, telemetry, analytics, cloud diagnostics, or remote error reporting;",
    "SS-017 does not add backend services, auth, accounts, secrets, telemetry, analytics, remote logging, cloud storage, provider SDKs, model providers, remote sharing, CSP reporting endpoints, Network Error Logging, or production hosting provider configuration files.",
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
  "security guarantee": "Swing Sync is hack-proof and secures your data.",
  "production header overclaim":
    "Swing Sync ships with CSP enforced in production and production headers are already configured.",
};

const crossFileChecks = [
  {
    sourcePath: "index.html",
    targetPath: "docs/deployment.md",
    extract: extractCspMetaContent,
    description: "CSP meta directive string",
  },
];

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

    for (const term of config.terms ?? []) {
      if (!content.toLowerCase().includes(term.toLowerCase())) {
        errors.push(`${filePath}: missing required term ${term}`);
      }
    }

    for (const placement of config.placement ?? []) {
      assertPlacement(filePath, content, placement, errors);
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

  for (const check of crossFileChecks) {
    const source = fileReader(check.sourcePath);
    const target = fileReader(check.targetPath);
    if (source === null) {
      errors.push(`${check.sourcePath}: required file is missing`);
      continue;
    }
    if (target === null) {
      errors.push(`${check.targetPath}: required file is missing`);
      continue;
    }
    const extracted = check.extract(source);
    if (!extracted) {
      errors.push(
        `${check.sourcePath}: could not extract non-empty ${check.description}`,
      );
      continue;
    }
    if (target.includes(extracted)) {
      errors.push(
        `${check.targetPath}: duplicates ${check.description} from ${check.sourcePath}`,
      );
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

function assertPlacement(filePath, content, placement, errors) {
  const headingIndex = content.indexOf(placement.heading);
  if (headingIndex === -1) {
    return;
  }

  const afterHeading = content.slice(headingIndex + placement.heading.length);
  const nextHeadingIndex = afterHeading.search(/\n##?\s+/);
  const section =
    nextHeadingIndex === -1 ? afterHeading : afterHeading.slice(0, nextHeadingIndex);

  if (!section.includes(placement.text)) {
    errors.push(
      `${filePath}: missing required placement for "${placement.text}" under "${placement.heading}"`,
    );
    return;
  }

  if (placement.firstParagraph) {
    const firstParagraph = section.trimStart().split(/\n\s*\n/)[0]?.trim();
    if (firstParagraph !== placement.text) {
      errors.push(
        `${filePath}: "${placement.text}" must be the first paragraph under "${placement.heading}"`,
      );
    }
  }
}

function extractCspMetaContent(html) {
  const metaTags = html.match(/<meta\b[^>]*>/gis) ?? [];
  for (const tag of metaTags) {
    const attributes = parseAttributes(tag);
    if (
      attributes["http-equiv"]?.toLowerCase() === "content-security-policy" &&
      Object.hasOwn(attributes, "content")
    ) {
      return attributes.content.trim() || null;
    }
  }
  return null;
}

function parseAttributes(tag) {
  const attributes = {};
  const attributePattern = /([^\s=<>"'\/]+)\s*=\s*(["'])([\s\S]*?)\2/g;
  let match;
  while ((match = attributePattern.exec(tag)) !== null) {
    attributes[match[1].toLowerCase()] = match[3];
  }
  return attributes;
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
