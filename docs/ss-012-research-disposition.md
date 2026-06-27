# SS-012 Research and Recommendation Disposition

Status: **Codex-owned specification research for `SS-012 Design multimodal
coaching prompt and response schema`.**

Check date: 2026-06-27.

## Inputs Reviewed

- Notion task `SS-012 Design multimodal coaching prompt and response schema`.
- `docs/privacy-architecture.md`
- `docs/safety-terms.md`
- `docs/licensing.md`
- `docs/models-licensing.md`
- `docs/ss-011-preimplementation-spec.md`
- `src/swing-card-contract.ts`
- `src/swing-card-generator.ts`
- `test/unit/swing-card-generator.test.ts`

No new external provider, pricing, SDK, model, medical, legal, or regulatory
claim is adopted in SS-012. Because the accepted scope can be specified from
existing project policy and current local contracts, this note records internal
source checks rather than live provider research. If implementation expands to
provider-specific behavior, connected API calls, SDKs, model assets, pricing,
retention, or training-use claims, fresh primary-source provider review is
required before implementation.

## Disposition

| Recommendation | Decision | Rationale |
| --- | --- | --- |
| Build on the existing SS-011 manual Swing Card prompt instead of replacing it with provider-specific instructions. | Adopt | SS-012 acceptance is prompt/schema design. Provider selection and connected API behavior belong to SS-013 or later and require separate consent, terms, privacy, and licensing review. |
| Require structured output sections for observations, likely causes, drills, cautions, and next focus. | Adopt | This directly maps to acceptance criteria and keeps model output auditable. |
| Treat missing, low-confidence, review-required, or unavailable evidence as schema-level constraints. | Adopt | Existing SS-011 prompt already says not to guess missing values. SS-012 should make that behavior machine-checkable. |
| Include adversarial prompt tests for medical diagnosis, rehabilitation, prompt injection, fabricated metrics, and overconfident claims. | Adopt | SS-002 and `docs/safety-terms.md` explicitly require future AI-coaching adversarial tests. |
| Add automatic upload, remote model calls, provider SDKs, keys, cloud storage, telemetry, or model selection while designing the prompt. | Reject | These are outside SS-012 and conflict with local-first and explicit-opt-in boundaries unless separately reviewed. |
| Claim the prompt guarantees safe, accurate, private, anonymous, compliant, or medically appropriate output. | Reject | Existing safety and privacy policies prohibit absolute safety, privacy, anonymity, deletion, legal, compliance, medical, and correctness claims. |
| Add a runtime output filter or classifier as the primary safety control. | Defer | Defense-in-depth filters may be useful later, but SS-012 can satisfy acceptance with deterministic prompt/schema contracts and tests. Runtime model integration is not in scope. |
| Add new dependencies for schema validation. | Defer | The repo currently uses hand-authored TypeScript contracts and zero-dependency validation patterns. A dependency needs separate license/bundle review and is not required for the spec. |

## Sensitivity Classification

SS-012 is safety-, AI-coaching-, model-provider-adjacent, export-adjacent, and
user-facing-copy sensitive. Implementation remains blocked until Claude QA
planning returns PASS or all blocking findings are resolved and re-reviewed.
