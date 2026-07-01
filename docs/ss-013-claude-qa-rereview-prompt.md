# SS-013 Claude QA Re-Review Prompt

Paste everything between START and END into Claude Chat for focused
preimplementation QA re-review.

## START

Role: You are the independent adversarial QA planner for Swing Sync.

Stage: Focused preimplementation QA re-review for SS-013 after an initial FAIL.

Scope: Re-review only whether Codex resolved the prior SS-013 QA planning
blockers B1-B8 in the revised research disposition, preimplementation spec, and
`SS-TC-019`. This is still a planning gate, not an implementation audit.

Context:
Swing Sync is a local-first browser app for educational golf swing analysis.
Codex is acting as SS-013 research/spec owner under the 2026-06-26 LLM-team
routing update. Claude remains the independent QA planning and final audit
reviewer. Assume you cannot read the repository, GitHub, or Notion; all
relevant current content is included below.

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

Prior findings and applied fixes:
- B1 consent persistence open choice: fixed by requiring in-memory-only remote
  consent, default off on every page load/reload/tab reopen, and no new remote
  consent storage key.
- B2 reviewed provider undefined/zero provider default missing: fixed by
  requiring an empty production provider registry and unavailable/configuration
  UI by default; research disposition rejects shipping provider descriptors.
- B3 no canonical enforcement point: fixed by requiring a shared
  `canSendRemoteRequest(state): RemoteSendGuardResult` guard used by UI and
  adapter `send()`.
- B4 no per-error-code negative tests: fixed by requiring explicit negative
  tests for every `ModelAdapterErrorCode`.
- B5 unsafe output undefined: fixed by defining `UNSAFE_RESPONSE_CONTENT`
  criteria and text-only rendering rules.
- B6 `blockedDataClasses` open string list: fixed by defining one closed data
  class union, allowed outbound subset, and blocked outbound subset.
- B7 mid-flight revoke unaddressed: fixed by requiring in-flight revocation to
  call `AbortController.abort()` and return `REMOTE_REQUEST_CANCELLED`.
- B8 prohibited prompt check unnamed: fixed by requiring a named runtime
  validator such as `validateRemotePromptPreview(prompt)` with positive and
  negative tests per pattern family.

Relevant source contents or focused diff:
No implementation diff exists yet. The following are the exact revised
review-critical contents and revised Notion test case content that must be
evaluated for this focused planning gate. Unrelated unchanged source files are
omitted because B1-B8 concern the planning contract, not implementation code.

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
| Ship any `ModelProviderDescriptor` entries in production for SS-013. | Reject | SS-013 may define contracts and unavailable UI, but the production provider registry must be empty. Any non-empty registry requires a separately reviewed story with provider terms, destination origins, retention/training-use review, secret handling, and verification. |
| Make remote API mode disabled by default and fail closed. | Adopt | Matches acceptance and local-first privacy architecture. Missing consent, missing reviewed provider config, missing API key/server route, revoked consent, blocked network, or unsupported data classes must prevent send attempts. |
| Show exact outbound data classes before send. | Adopt | Acceptance requires the user to see what data will be sent. The disclosure should identify destination/provider category, destination origin when known, and whether the payload includes Swing Card summary text, metric values, warnings, selected images, landmarks, prompts, or model outputs. |
| Preserve manual Swing Card copy/export with no keys or server config. | Adopt | Manual workflow is a protected fallback and must not depend on remote consent, API key state, provider availability, or network. |
| Describe provider data as anonymous or guaranteed private/deleted. | Reject | Project policy blocks anonymity, guaranteed privacy, guaranteed deletion, legal, and compliance claims. Providers may retain/process content under their own terms. |
| Add telemetry, remote logging, hosted analytics, cloud storage, workers, camera capture, or raw personal fixtures. | Reject | Out of scope for SS-013 unless separately reviewed and approved. |

## Candidate Scope

The lowest-risk SS-013 path is a zero-dependency contract and UI scaffold that
adds:

- a provider-neutral model adapter contract;
- an empty production provider registry and reviewed-provider configuration
  placeholder with no default enabled provider;
- a remote-consent disclosure model that is separate from the existing safety
  acknowledgement;
- fail-closed send gating;
- unit and smoke coverage for no-send-before-consent and manual fallback.

The story should not create a working hosted model call unless Claude QA and
maintainer review explicitly approve the concrete provider, terms, destination,
secret handling, and verification plan.
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

The consent disclosure must use one canonical closed union for every data class:

- `raw-video`
- `frame-pixels`
- `selected-keyframe-images`
- `pose-landmarks`
- `metrics`
- `warnings-and-limitations`
- `manual-swing-card-prompt`
- `model-output`

For SS-013, the allowed outbound subset is only `metrics`,
`warnings-and-limitations`, and `manual-swing-card-prompt`, and those classes
remain unavailable unless explicit remote consent and provider review gates are
met. `raw-video`, `frame-pixels`, `selected-keyframe-images`, and
`pose-landmarks` are blocked in SS-013. `model-output` is inbound only, treated
as sensitive, not persisted by default, and rendered only through text-only DOM
APIs if ever displayed.

The default SS-013 API request should be text-only and data-minimized:
Swing Card prompt text, bounded metric summaries, warning/limitation labels,
schema/version metadata, and no hidden filenames, object URLs, raw landmarks,
coordinates, timestamps, observed seek timestamps such as
`observedSeekTimestampMs`, media dimensions, user IDs, raw video, or frame
pixels.

## Provider-Neutral Contract

Candidate contract shape:

```ts
export type ModelRemoteDataClass =
  | "raw-video"
  | "frame-pixels"
  | "selected-keyframe-images"
  | "pose-landmarks"
  | "metrics"
  | "warnings-and-limitations"
  | "manual-swing-card-prompt"
  | "model-output";

export type ModelOutboundDataClass =
  | "metrics"
  | "warnings-and-limitations"
  | "manual-swing-card-prompt";

export type ModelBlockedOutboundDataClass = Exclude<
  ModelRemoteDataClass,
  ModelOutboundDataClass | "model-output"
>;

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
  readonly dataClasses: readonly ModelOutboundDataClass[];
  readonly promptPreview: string;
  readonly blockedDataClasses: readonly ModelBlockedOutboundDataClass[];
}

export interface ModelAdapterRequest {
  readonly providerId: string;
  readonly prompt: string;
  readonly dataClasses: readonly ModelOutboundDataClass[];
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

## Provider Registry

SS-013 must ship with an empty production provider registry. The "Remote model
review" UI must therefore remain in an unavailable/configuration-required state
by default. Any non-empty registry, real destination origin, API route, API key
handling, provider SDK, provider model name, or working hosted call requires a
separately reviewed story and cannot be smuggled into SS-013 implementation.

## Consent Gate

Remote model consent must be separate from the existing local safety
acknowledgement. The current safety acknowledgement is not a durable legal or
privacy record and does not authorize remote sharing.

Rules:

- Remote consent state is in-memory only for SS-013.
- Default remote consent state is off on every page load, refresh, tab reopen,
  provider change, request content change, unsupported data-class detection, or
  missing provider/configuration state.
- SS-013 must not add a new storage key for remote consent and must not persist
  prompts, outputs, metrics, keys, provider secrets, or remote consent state.
- Remote send controls are disabled unless a reviewed provider is configured,
  a request preview exists, and the user explicitly opts in for that action.
- Consent copy must show the provider display name, destination origin when
  known, terms URL, privacy URL, data classes to be sent, and blocked data
  classes that will not be sent.
- Revoking consent, changing provider, changing request contents, missing
  provider config, missing API route/key, or unsupported data class resets or
  blocks send.
- Revoking consent while a request is in flight must immediately call
  `AbortController.abort()` for that request's `abortSignal` and surface
  `REMOTE_REQUEST_CANCELLED` with sanitized UI text.

## Enforcement

Both UI disable logic and any adapter `send()` implementation must call a
single canonical guard function, such as:

```ts
export type RemoteSendGuardResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly code: ModelAdapterErrorCode };

export function canSendRemoteRequest(state: RemoteSendState): RemoteSendGuardResult;
```

The guard owns checks for remote consent, provider review, provider
configuration, allowed data classes, prompt validation, and manual-content
availability. UI code may add presentation-only disabled states, but it must
not reimplement independent security decisions. Adapter `send()` must call the
guard before any network-capable operation and return the guard error code when
the guard fails.

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
- Any model output that is ever displayed must be assigned through text-only
  rendering such as `textContent` or equivalent framework text binding. It must
  not be interpolated into `innerHTML`, parsed as trusted HTML, or rendered as
  markdown/HTML.

## Fail-Closed Behavior

The remote send path must fail before network when:

- remote consent is absent;
- no reviewed provider descriptor is available;
- provider config is missing;
- request includes blocked data classes;
- prompt preview contains prohibited raw payload keys, coordinate pairs, object
  URLs, filenames, timestamps, hidden identifiers, or raw JSON dumps;
- manual Swing Card content is unavailable; or
- the user revokes consent before or during send.

Network errors, aborts, or unsafe response validation failures must return
stable error codes and sanitized UI text. They must not log raw prompts,
metrics, landmarks, media details, provider keys, or user identifiers.

`UNSAFE_RESPONSE_CONTENT` must be returned when remote output violates the
bounded response contract. Candidate criteria:

- response body exceeds the implementation cap selected in tests;
- response content type is not a reviewed text or JSON type;
- JSON response lacks the expected top-level shape;
- response text contains unsafe medical, rehabilitation, aggressive movement,
  guarantee, privacy/legal/compliance, raw payload, coordinate, object URL,
  filename, timestamp, hidden identifier, or HTML/script content patterns; or
- response cannot be rendered safely as plain text.

The prohibited prompt check must use a named runtime validator, such as
`validateRemotePromptPreview(prompt)`, with positive and negative tests. It
must reject raw payload keys, coordinate pairs, object URLs, filenames,
timestamps including `observedSeekTimestampMs`, hidden identifiers, and raw JSON
dumps. Structural construction from existing prompt builders is useful but not
sufficient for SS-013 because future UI paths could pass different text.

## Verification Plan

Required unit coverage before implementation can be considered complete:

- one explicit negative test for `REMOTE_CONSENT_REQUIRED`;
- one explicit negative test for `PROVIDER_NOT_REVIEWED`;
- one explicit negative test for `PROVIDER_NOT_CONFIGURED`;
- one explicit negative test for `UNSUPPORTED_DATA_CLASS`;
- one explicit negative test for `REMOTE_REQUEST_FAILED`;
- one explicit negative test for `REMOTE_REQUEST_CANCELLED`, including
  mid-flight consent revocation calling `AbortController.abort()`;
- one explicit negative test for `UNSAFE_RESPONSE_CONTENT`;
- tests proving the production provider registry is empty by default;
- tests proving `blockedDataClasses` is derived from the canonical data-class
  union;
- prompt-preview validator positive/negative tests for every prohibited pattern
  family listed above; and
- manual Swing Card workflow regression coverage proving Download PNG,
  Print / Save as PDF, and Copy prompt remain available without provider
  configuration, API keys, remote consent, server config, or network.

Required before PR:

- `npm run test:smoke`
- `npm run build`
- `npm run compliance:verify`
- `npm run privacy:verify`
- `npm run safety:verify`
- `git diff --check`
```

File: `SS-TC-019` revised Notion test case

```markdown
## Coverage Status
- Created on 2026-06-30 as dedicated acceptance coverage for `SS-013 Add optional model API adapter behind consent gate`.
- No implementation evidence is claimed yet. SS-013 is in QA planning with Codex acting as research/spec owner under the 2026-06-26 LLM-team routing update.
- Claude QA planning returned FAIL on the initial spec. This test case is revised to remain the umbrella acceptance scenario while requiring itemized sub-case coverage before implementation can be considered complete.
- Prior SS-TC records remain complementary protected-boundary, runtime, schema, metric, export, coaching prompt, fixture, and browser-regression coverage, but they are insufficient for SS-013 remote-model consent and adapter acceptance.
## Required Contract Coverage
- API-backed model mode is unavailable by default and fails closed until the user gives explicit, separate, in-memory-only consent for the specific remote model action.
- Production provider registry is empty for SS-013. Remote model review UI remains unavailable/configuration-required by default. Any non-empty provider registry requires a separately reviewed story.
- Consent UI shows the destination/provider category, destination origin when known, and the exact outbound data classes before any send action. It must distinguish raw swing video, frame pixels, selected keyframes, landmarks, metrics, Swing Card summaries, prompts, and model outputs.
- Adapter contract is provider-neutral: core app code depends on a stable local interface, not provider SDK types, provider-specific payload shapes, hosted analytics, or hard-coded model branding.
- Manual Swing Card workflow remains fully available without API keys, server config, provider credentials, network access, or remote consent.
- Tests or review evidence prove no raw video or frame pixels are sent by default, no remote call starts before consent, revocation or missing configuration blocks remote send attempts, and mid-flight consent revocation aborts the in-flight request.
- Provider/API facts, terms, retention/training-use assumptions, SDK/license implications, and model-neutral data contracts are recorded in Codex research/spec artifacts with source URLs and check dates where relevant.
## Required Sub-Cases
- Negative test for `REMOTE_CONSENT_REQUIRED`.
- Negative test for `PROVIDER_NOT_REVIEWED`.
- Negative test for `PROVIDER_NOT_CONFIGURED`.
- Negative test for `UNSUPPORTED_DATA_CLASS`.
- Negative test for `REMOTE_REQUEST_FAILED`.
- Negative test for `REMOTE_REQUEST_CANCELLED`, including mid-flight consent revocation calling `AbortController.abort()`.
- Negative test for `UNSAFE_RESPONSE_CONTENT`, including unsafe output content and text-only rendering protections.
- Production provider registry is empty by default and remote UI remains unavailable/configuration-required.
- `blockedDataClasses` is typed/derived from the canonical data-class union, not an open string list.
- Prompt-preview validation rejects raw payload keys, coordinate pairs, object URLs, filenames, timestamps including `observedSeekTimestampMs`, hidden identifiers, and raw JSON dumps.
- Manual workflow regression proves Download PNG, Print / Save as PDF, and Copy prompt remain usable without provider config, API keys, remote consent, server config, or network.
## Protected Boundaries
- Do not add remote sharing, telemetry, remote logging, hosted analytics, cloud storage, new workers, provider SDKs, provider/model assets, new dependencies, camera capture, or raw personal video fixtures unless separately reviewed and approved.
- Do not make medical, injury-prevention, professional coaching, guaranteed correctness, guaranteed privacy, deletion, anonymity, legal, or compliance claims.
- Do not describe exports, landmarks, metrics, prompts, or model outputs as anonymous.
- Any model output that is ever displayed must be rendered as text only, not trusted HTML, markdown, or `innerHTML`.
## Current Gate
Implementation remains blocked pending Codex-owned research/disposition, preimplementation specification, self-contained focused Claude QA re-review prompt, and Claude QA planning PASS.
```

Verification:
- No implementation verification has run because implementation is still
  blocked.
- `git diff --check` will be run after this prompt is written.

Known non-goals:
- No implementation work in this re-review.
- No provider SDK, provider registry entry, destination origin, API route, key
  handling, or working hosted model call.
- No raw video, frame pixel, selected image, landmark, coordinate, filename,
  timestamp, observed seek timestamp, media dimension, object URL, or hidden
  identifier transmission.
- No telemetry, remote logging, hosted analytics, cloud storage, new workers,
  camera capture, raw personal fixtures, or new dependencies.
- No medical, legal, compliance, privacy, deletion, anonymity, professional
  coaching, injury-prevention, or guaranteed correctness claims.

Output required:
1. Verdict: PASS or FAIL for implementation start.
2. For each prior blocker B1-B8, state closed or still blocking.
3. Any new blocking findings introduced by the revisions, with exact quoted
   evidence and required change.
4. Non-blocking recommendations, clearly separated.
5. Whether revised `SS-TC-019` is adequate as umbrella acceptance plus
   itemized sub-cases.

## END
