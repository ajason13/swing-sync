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
