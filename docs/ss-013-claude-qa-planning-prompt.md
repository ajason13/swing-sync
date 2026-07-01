# SS-013 Claude QA Planning Prompt

**Superseded for paste use.** Claude returned FAIL on this initial QA planning
prompt. Use `docs/ss-013-claude-qa-rereview-prompt.md` for the focused B1-B8
re-review.

Paste everything between START and END into Claude Chat for preimplementation
QA planning.

## START

Role: You are the independent adversarial QA planner for Swing Sync.

Stage: Preimplementation QA planning for SS-013.

Scope: Review the proposed optional model API adapter, consent, privacy,
provider-neutrality, manual fallback, tests, and docs plan before Codex
implements SS-013. This is a planning gate, not an implementation audit.

Context:
Swing Sync is a local-first browser app for educational golf swing analysis.
Codex is acting as the SS-013 research/spec owner under the 2026-06-26
LLM-team routing update. Claude remains the independent QA planning and final
audit reviewer. Assume you cannot read the repository, GitHub, or Notion; all
relevant context is included below.

Acceptance criteria:
- API mode is disabled until explicit consent.
- Provider adapter is model-neutral.
- User sees what data will be sent.
- Manual Swing Card workflow remains available without keys or server config.

Protected boundaries:
- Raw swing video and frame pixels must not be uploaded, sent to model
  providers, or shared with remote services unless a future separately reviewed
  feature adds explicit opt-in.
- Derived landmarks, metrics, prompts, reports, selected images, and model
  outputs may still be sensitive or identifying.
- Do not make absolute privacy, deletion, anonymity, legal, compliance, safety,
  medical, injury-prevention, professional coaching, or guaranteed correctness
  claims.
- Do not add telemetry, remote logging, hosted analytics, cloud storage, new
  workers, provider SDKs, provider/model assets, new dependencies, camera
  capture, raw personal video fixtures, server routes, proxy services, or
  secrets unless separately reviewed and approved.
- Manual Swing Card export and Copy prompt must continue to work without API
  keys, server config, remote consent, provider credentials, or network.

Relevant source contents or focused diff:
No SS-013 implementation diff exists yet. The following are exact current
source excerpts and full candidate planning artifacts. Omitted parts are
unrelated implementation details from earlier stories.

File: `docs/ss-013-research-disposition.md`

```markdown
# SS-013 Research Disposition

Status: candidate research input for Claude QA planning. No implementation is
approved by this document.

Checked on: 2026-06-30.

## Task

`SS-013 Add optional model API adapter behind consent gate`

Acceptance criteria:

- API mode is disabled until explicit consent.
- Provider adapter is model-neutral.
- User sees what data will be sent.
- Manual Swing Card workflow remains available without keys or server config.

## Source Checks

| Source | Checked | Relevant finding |
| --- | --- | --- |
| OpenAI enterprise privacy, https://openai.com/enterprise-privacy/ | 2026-06-30 | API Platform/business data is described as customer-controlled; OpenAI states it does not train on that data by default and may retain API inputs/outputs for up to 30 days except listed endpoints/features or eligible zero-retention cases. |
| OpenAI privacy policy, https://openai.com/policies/row-privacy-policy/ | 2026-06-30 | OpenAI's consumer privacy policy says API/business-offering content is governed by customer agreements, and third-party sharing is governed by that third party's terms and privacy policies. |
| Anthropic commercial terms, https://www.anthropic.com/legal/commercial-terms | 2026-06-30 | Customer content is treated as customer confidential information; customers must evaluate outputs and notify users that factual assertions may be false or incomplete; terms restrict building competing products or training competing models from the service. |
| Anthropic privacy policy, https://www.anthropic.com/legal/privacy | 2026-06-30 | Published 2026-06-08 with effective date 2026-07-08. Consumer policy says inputs/outputs may be used to train unless opted out and third-party services process data under their own privacy policies. It says business-offering content is governed by customer agreements. |
| Anthropic privacy center retention article, https://privacy.claude.com/en/articles/10023548-how-long-do-you-store-my-data | 2026-06-30 | Consumer retention article points commercial/API users to separate commercial handling and records longer retention for consumer training, safety, and feedback cases. |
| Gemini API Additional Terms, https://ai.google.dev/gemini-api/terms | 2026-06-30 | For unpaid services, Google says human reviewers may read, annotate, and process API input/output and warns not to submit sensitive, confidential, or personal information to unpaid services. |
| MDN Fetch API, https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API | 2026-06-30 | `fetch()` is available in Window and Worker contexts, returns after response headers even for HTTP error status, and has a deferred fetch API surface that should remain out of scope for a fail-closed adapter unless explicitly reviewed. |
| MDN AbortController, https://developer.mozilla.org/en-US/docs/Web/API/AbortController | 2026-06-30 | AbortController can abort fetch requests and response body consumption, supporting cancel/revoke behavior in a provider-neutral adapter. |

## Disposition

| Recommendation or finding | Decision | Rationale |
| --- | --- | --- |
| Implement a real provider integration as part of SS-013. | Defer | The story asks for an optional adapter behind consent, not a specific provider launch. Provider terms differ and can change. A real integration requires a separately approved provider, destination origins, retention/training-use review, and possibly secrets/server design. |
| Add provider SDKs or new runtime dependencies. | Reject | The adapter can be specified and implemented with built-in browser primitives or no network implementation in this story. SDK source licenses and provider terms require separate review under `docs/licensing.md` and `docs/models-licensing.md`. |
| Send raw swing video or frame pixels to any model API. | Reject | `docs/privacy-architecture.md` blocks raw video/frame pixels by default. SS-013 acceptance can be satisfied by data-class disclosure and consent for data-minimized prompts or summaries, not raw media upload. |
| Treat all providers as equivalent for data use, retention, training, human review, or terms. | Reject | Current primary sources show materially different provider terms and separate consumer/business handling. The UI/spec must avoid generic promises and show provider-specific facts only when a provider is explicitly configured and reviewed. |
| Keep the adapter provider-neutral. | Adopt | Acceptance requires model-neutral design. Core app code should depend on stable local interfaces and data classes rather than provider SDK types, model names, or payload shapes. |
| Make remote API mode disabled by default and fail closed. | Adopt | Matches acceptance and local-first privacy architecture. Missing consent, missing reviewed provider config, missing API key/server route, revoked consent, blocked network, or unsupported data classes must prevent send attempts. |
| Show exact outbound data classes before send. | Adopt | Acceptance requires the user to see what data will be sent. The disclosure should identify destination/provider category, destination origin when known, and whether the payload includes Swing Card summary text, metric values, warnings, selected images, landmarks, prompts, or model outputs. |
| Preserve manual Swing Card copy/export with no keys or server config. | Adopt | Manual workflow is a protected fallback and must not depend on remote consent, API key state, provider availability, or network. |
| Describe provider data as anonymous or guaranteed private/deleted. | Reject | Project policy blocks anonymity, guaranteed privacy, guaranteed deletion, legal, and compliance claims. Providers may retain/process content under their own terms. |
| Add telemetry, remote logging, hosted analytics, cloud storage, workers, camera capture, or raw personal fixtures. | Reject | Out of scope for SS-013 unless separately reviewed and approved. |
```

File: `docs/ss-013-preimplementation-spec.md`

```markdown
# SS-013 Preimplementation Spec

Status: candidate spec for Claude QA planning. Implementation remains blocked
until Claude QA planning returns PASS or blocking findings are resolved and
re-reviewed.

## Scope

SS-013 defines an optional model API adapter behind explicit remote-sharing
consent while preserving Swing Sync's local-first MVP and manual Swing Card
workflow.

In scope:

- provider-neutral TypeScript contracts for model requests, responses,
  provider configuration, consent state, and data-class disclosure;
- fail-closed gating before any remote send can be attempted;
- UI copy and controls that disclose what data would be sent before the user
  opts in;
- tests proving manual Swing Card export/copy remains available without keys,
  server config, provider credentials, remote consent, or network access; and
- documentation of provider-review requirements before any real provider is
  enabled.

Out of scope:

- enabling a real provider by default;
- provider SDKs, new runtime dependencies, provider/model assets, hosted
  analytics, telemetry, remote logging, cloud storage, new workers, camera
  capture, or raw personal video fixtures;
- committing API keys, server routes, proxy services, or environment-specific
  secrets;
- sending raw swing video or frame pixels;
- absolute privacy, deletion, anonymity, legal, compliance, medical,
  injury-prevention, professional coaching, or guaranteed correctness claims.

## Data Classes

The consent disclosure must use explicit data classes:

- `raw-video`: blocked for SS-013.
- `frame-pixels`: blocked for SS-013.
- `selected-keyframe-images`: blocked unless a future provider/image review
  explicitly approves it.
- `pose-landmarks`: blocked unless a future provider/privacy review explicitly
  approves it.
- `metrics`: allowed only after explicit remote consent and only as bounded
  Swing Card-derived values.
- `warnings-and-limitations`: allowed only after explicit remote consent.
- `manual-swing-card-prompt`: allowed only after explicit remote consent.
- `model-output`: remote response text or JSON, treated as sensitive and not
  persisted by default.

The default SS-013 API request should be text-only and data-minimized:
Swing Card prompt text, bounded metric summaries, warning/limitation labels,
schema/version metadata, and no hidden filenames, object URLs, raw landmarks,
coordinates, timestamps, media dimensions, user IDs, raw video, or frame
pixels.

## Provider-Neutral Contract

Candidate contract shape:

```ts
export type ModelDataClass =
  | "metrics"
  | "warnings-and-limitations"
  | "manual-swing-card-prompt";

export interface ModelProviderDescriptor {
  readonly id: string;
  readonly displayName: string;
  readonly destinationOrigin: string;
  readonly termsUrl: string;
  readonly privacyUrl: string;
  readonly checkedAt: string;
  readonly sdkRequired: false;
}

export interface ModelRequestPreview {
  readonly provider: ModelProviderDescriptor;
  readonly dataClasses: readonly ModelDataClass[];
  readonly promptPreview: string;
  readonly blockedDataClasses: readonly string[];
}

export interface ModelAdapterRequest {
  readonly providerId: string;
  readonly prompt: string;
  readonly dataClasses: readonly ModelDataClass[];
  readonly abortSignal?: AbortSignal;
}

export type ModelAdapterResult =
  | { readonly status: "ok"; readonly text: string }
  | { readonly status: "error"; readonly code: ModelAdapterErrorCode };

export type ModelAdapterErrorCode =
  | "REMOTE_CONSENT_REQUIRED"
  | "PROVIDER_NOT_REVIEWED"
  | "PROVIDER_NOT_CONFIGURED"
  | "UNSUPPORTED_DATA_CLASS"
  | "REMOTE_REQUEST_FAILED"
  | "REMOTE_REQUEST_CANCELLED"
  | "UNSAFE_RESPONSE_CONTENT";

export interface ModelAdapter {
  readonly provider: ModelProviderDescriptor;
  preview(request: Omit<ModelAdapterRequest, "abortSignal">): ModelRequestPreview;
  send(request: ModelAdapterRequest): Promise<ModelAdapterResult>;
}
```

Implementation may revise names if the final contract remains provider-neutral,
bounded, typed, and fail-closed.

## Consent Gate

Remote model consent must be separate from the existing local safety
acknowledgement. The current safety acknowledgement is not a durable legal or
privacy record and does not authorize remote sharing.

Rules:

- Default remote consent state is off.
- Remote send controls are disabled unless a reviewed provider is configured,
  a request preview exists, and the user explicitly opts in for that action.
- Consent copy must show the provider display name, destination origin when
  known, terms URL, privacy URL, data classes to be sent, and blocked data
  classes that will not be sent.
- Revoking consent, changing provider, changing request contents, missing
  provider config, missing API route/key, or unsupported data class resets or
  blocks send.
- Consent state may be held in memory for SS-013. If persisted, it must use a
  separate local key and store only minimal acknowledgement state, not prompts,
  outputs, metrics, keys, or provider secrets.

## UI Contract

Add an optional "Remote model review" surface near the existing Swing Card
export area. It must be visually and behaviorally secondary to the manual
workflow.

Required UI behavior:

- Manual `Download PNG`, `Print / Save as PDF`, and `Copy prompt` remain
  visible and usable without provider configuration.
- Remote model controls show an unavailable/configuration-required state by
  default.
- Before consent, the UI says remote review is optional and off by default.
- The disclosure says what would be sent and what will not be sent.
- User-facing text says provider terms and privacy practices apply. It must not
  claim anonymity, guaranteed privacy, guaranteed deletion, legal compliance,
  medical safety, or professional coaching equivalence.

## Fail-Closed Behavior

The remote send path must fail before network when:

- remote consent is absent;
- no reviewed provider descriptor is available;
- provider config is missing;
- request includes blocked data classes;
- prompt preview contains prohibited raw payload keys, coordinate pairs, object
  URLs, filenames, timestamps, hidden identifiers, or raw JSON dumps;
- manual Swing Card content is unavailable; or
- the user revokes consent before send.

Network errors, aborts, or unsafe response validation failures must return
stable error codes and sanitized UI text. They must not log raw prompts,
metrics, landmarks, media details, provider keys, or user identifiers.

## Verification Plan

Required before PR:

- `npm run test:smoke`
- `npm run build`
- `npm run compliance:verify`
- `npm run privacy:verify`
- `npm run safety:verify`
- `git diff --check`

If any dependency, provider SDK, model asset, bundle, or licensing-sensitive
surface is added unexpectedly, also run:

- `npm run license:audit`
- `npm run verify:bundle-license-fixture`
- `npm run sbom:generate`

## Observability Decision

Runtime observability should remain intentionally limited for SS-013. Use
stable local UI status/error codes for user-visible state. Do not add telemetry,
remote logging, analytics, cloud diagnostics, or console logs containing
prompts, outputs, metrics, landmarks, media details, provider keys, or hidden
identifiers.

## Current Gate

Implementation remains blocked pending Claude QA planning PASS against this
specification, `docs/ss-013-research-disposition.md`, and `SS-TC-019`.
```

File: `SS-TC-019` Notion test case

```markdown
Scenario Description:
Optional model API adapter remains disabled until explicit remote-sharing
consent, exposes a model-neutral request contract, shows the exact data classes
and destination before any send action, and preserves the manual Swing Card
workflow with no API key or server configuration.

Failure Condition:
API mode can send data before explicit consent; adapter code is
provider-specific or embeds provider SDK assumptions; user cannot inspect what
will be sent and where; manual Swing Card export/copy workflow requires keys,
server config, or network; raw video/frame pixels are sent; provider
terms/licensing/privacy review is missing; or implementation adds telemetry,
remote logging, cloud storage, unapproved SDK/model assets, new dependencies,
hidden identifiers, or unsafe medical/professional-coaching/privacy/legal/
compliance claims.
```

File: `docs/privacy-architecture.md` excerpts

```markdown
Raw swing video and frame pixels must not be uploaded, sent to model providers,
or shared with remote services unless a future feature adds a separate,
explicit opt-in flow for that action.

Derived landmarks and metrics should be treated as sensitive user data.

Optional remote sharing is not approved yet. Before any remote model, hosted
model API, cloud storage, or coach-review feature is implemented, Swing Sync
must document:

- provider name and service terms;
- SDK source license;
- model or model-asset rights, if applicable;
- data classes transmitted;
- retention and training-use terms;
- whether human review may occur;
- destination origins;
- user opt-in and revocation UX; and
- privacy impact for raw video, frames, landmarks, metrics, prompts, and
  generated outputs.

Raw swing video and frame pixels remain blocked by default. Derived landmarks,
metrics, prompts, and reports require explicit opt-in before remote sharing.
```

File: `docs/safety-terms.md` excerpts

```markdown
Swing Sync provides local-first, educational golf swing feedback. It is designed
to help users observe movement patterns and practice general skill awareness.
It is not medical advice, physical therapy, rehabilitation guidance, injury
diagnosis, pain triage, or professional athletic instruction.

Future AI coach prompts and system instructions must include constraints that:

- prohibit diagnosing pain, injuries, medical conditions, mobility limits, or
  causes of symptoms;
- prohibit medical triage, rehabilitation plans, therapy exercises, or
  treatment instructions;
- prohibit aggressive mechanical prescriptions such as forcing range of motion,
  training through pain, or making abrupt high-load changes;
- frame suggestions as optional, low-intensity, educational observations;
- recommend stopping activity when pain, numbness, dizziness, weakness, or
  unusual discomfort is present;
- recommend qualified medical review for pain, injury, or health concerns; and
- recommend qualified coaching review for sport-specific instruction beyond
  general educational feedback.
```

File: `docs/models-licensing.md` excerpts

```markdown
Optional model API SDKs must satisfy both code-license policy and provider
service terms. Raw swing video must not be sent to any model provider by default.
```

File: `docs/licensing.md` excerpts

```markdown
Optional model API SDKs require two independent approvals:

- the SDK source license must satisfy this policy; and
- provider service terms must permit Swing Sync's intended local-first,
  opt-in data sharing behavior.
```

File: `src/main.ts` current relevant excerpts

```ts
// Minimal SS-002 scaffold state; not a durable or legally audited consent record.
const consentStorageKey = "swing-sync:safety-consent:v1";

function hasSafetyConsent(): boolean {
  if (consentStorageFailed) return false;

  try {
    return window.localStorage.getItem(consentStorageKey) === "accepted";
  } catch {
    consentStorageFailed = true;
    return false;
  }
}

function renderSwingCardExport(): string {
  return `
    <section class="swing-card-panel" aria-labelledby="swing-card-heading">
      ...
      <p>This card can include annotated keyframes, unavailable metric states,
      warnings, and prompt text for a manual LLM chat upload. Raw swing video
      is not included.</p>
      ...
      <button class="primary-action" type="button" data-download-swing-card>Download PNG</button>
      <button class="secondary-action" type="button" data-print-swing-card>Print / Save as PDF</button>
      <button class="secondary-action" type="button" data-copy-swing-card-prompt>Copy prompt</button>
    </section>
  `;
}

function bindInteractions(): void {
  document.querySelector<HTMLInputElement>("#safety-consent")?.addEventListener("change", (event) => {
    setSafetyConsent((event.currentTarget as HTMLInputElement).checked);
    renderApp();
  });

  document.querySelector<HTMLButtonElement>("#analysis-button")?.addEventListener("click", () => {
    if (!hasSafetyConsent()) {
      renderApp("Please acknowledge the safety terms before starting analysis.");
      document.querySelector<HTMLInputElement>("#safety-consent")?.focus();
      return;
    }
    if (!selectedVideo) {
      renderApp("Choose a local video before starting analysis.");
      return;
    }
    activeStep = "processing";
    renderApp("Loading approved local pose assets. No video data leaves this device.");
    void startFrameAnalysis();
  });
}
```

File: `src/coaching-prompt.ts` current relevant excerpts

```ts
export function buildCoachingPrompt(content: SwingCardContent): string {
  return [
    "Act as an educational golf movement assistant. I may manually provide a Swing Sync Card that contains selected annotated keyframe stills, bounded local metric summaries, confidence states, warnings, and limitations from my swing review.",
    "",
    "Use only the evidence shown in the card. If a metric, phase, or keyframe is marked unavailable, review-required, low-evidence, partial, or limited, do not guess, infer, or fill in missing values.",
    "",
    "Return only JSON with exact top-level keys: schemaVersion, observations, likelyCauses, drills, cautions, and nextFocus. Each section must contain no more than 4 items. Each item must include phaseId, evidenceStatus, and text. Each item text must be 280 characters or fewer.",
    "",
    "Do not provide medical advice, pain or injury diagnosis, rehabilitation guidance, aggressive movement prescriptions, guaranteed injury prevention, guaranteed performance improvement, or a replacement for a qualified golf coach or qualified medical professional.",
    "",
    "Do not claim the card, prompt, or any upload is anonymous, private, deleted, legally compliant, or governed by a specific provider policy. Sharing a downloaded card with another service is my separate action, and that service's terms and privacy practices apply.",
  ].join("\n");
}
```

Verification:
No SS-013 implementation verification has run yet. Required before PR:
- `npm run test:smoke`
- `npm run build`
- `npm run compliance:verify`
- `npm run privacy:verify`
- `npm run safety:verify`
- `git diff --check`

Known non-goals:
- No real provider launch by default.
- No provider SDK or dependency addition.
- No API keys, server config, hosted proxy, or secrets.
- No raw video, frame pixel, selected image, landmark, coordinate, filename,
  timestamp, media dimension, object URL, or hidden identifier transmission.
- No telemetry, remote logging, cloud storage, hosted analytics, new workers,
  camera capture, or raw personal fixtures.
- No medical, legal, compliance, privacy, deletion, anonymity, professional
  coaching, injury-prevention, or guaranteed correctness claims.

Output required:
1. Verdict: PASS or FAIL for implementation start.
2. Blocking findings, each with severity, exact quoted evidence from this
   prompt, and the required change.
3. Non-blocking recommendations, clearly separated.
4. Test-case adequacy assessment for SS-TC-019.
5. Provider/privacy/consent gaps that must be resolved before implementation.
6. Any required changes to `docs/ss-013-research-disposition.md` or
   `docs/ss-013-preimplementation-spec.md`.

## END
