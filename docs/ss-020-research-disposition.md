# SS-020 Research Disposition

Date: 2026-08-08

This document records Lead Architect candidate dispositions for
`docs/ss-020-research-notes.md`. It is an engineering and release-governance
decision record, not legal, privacy, safety, medical, trademark, compliance, or
public-release advice or approval.

## Routing decision

The current Multi-Agent SDLC Framework makes Codex the default Deep Researcher
and Specification Drafter. The human owner confirmed that Gemini free-plan
Deep Research is unavailable. The earlier
`docs/ss-020-gemini-research-prompt.md` is superseded for paste use and remains
historical evidence only.

SS-020 remains in Gated Delivery. The docs-only governance exception is used to
omit a separate preimplementation Claude QA-planning round because the approved
scope changes no runtime code, production dependency, provider integration,
deployment behavior, or user data flow; Codex checked current primary sources;
and final independent Claude audit remains mandatory.

## Adopt

1. Create one canonical `docs/release-review-gate.md` owning the release-review
   status, public-claim inventory, reviewer checklist, operational lifecycle,
   open decisions, source register, and unfilled sign-off record.
2. Keep safety, privacy, limitations, deployment, licensing, model, fixture,
   and notice documents as their existing domain authorities. Link to the
   canonical gate rather than duplicating its operational rules.
3. Use a prominent current state equivalent to `PUBLIC RELEASE BLOCKED — HUMAN
   SIGN-OFF NOT RECORDED`. The document may define future outcomes without
   implying that an outcome has been selected.
4. Use the evidence taxonomy: code/test-enforced fact; documented design
   intent; unresolved assumption; qualified-human review required; and
   deferred/non-goal.
5. Require each inventory row to record source location, claim/category,
   audience/surface, classification, supporting evidence, review concern,
   accountable reviewer role, required decision, release-blocking status, and
   current disposition.
6. Make SS-002 assumption-of-risk and release-of-liability language an explicit
   qualified-legal-review blocker. Preserve its unchecked status.
7. Require future sign-off to bind reviewer identity, role/qualification,
   candidate commit, release scope, audience, territory, channel/host, evidence,
   date, decision, conditions, expiry, unresolved issues, and reopening rules.
8. Use scoped future outcomes: `PENDING`, `APPROVED FOR NAMED SCOPE`,
   `APPROVED WITH CONDITIONS`, `CHANGES REQUIRED`, `REJECTED / HOLD`, and
   `NOT APPLICABLE WITH RATIONALE`. Current outcome remains `PENDING` and
   release remains blocked.
9. Record source URLs and access date `2026-08-08`, including the unresolved
   relationship between Google's current generic MediaPipe privacy notice and
   exact-version `0.10.35` provider/observed-network evidence.
10. Extend `scripts/verify-docs-claims.js` through its existing declarative
    `files`, `requiredStrings`, and `crossFileChecks` registries and injected
    reader. Add focused tests in `test/unit/docs-claims.test.ts`; do not create
    a second verifier or policy parser.
11. Treat verification as bounded structural/factual evidence, never legal,
    privacy, safety, trademark, compliance, or release approval.
12. Keep runtime observability unchanged. Add no telemetry, analytics, logging,
    diagnostics, hidden identifiers, or persistent debug artifacts.

## Revise

1. Revise blanket “approval” concepts into commit-, scope-, reviewer-, date-,
   evidence-, and condition-bound decisions.
2. Revise local-first/privacy statements into bounded current facts plus
   explicit limitations. Do not infer anonymity, guaranteed privacy, guaranteed
   deletion, or control after export.
3. Revise trademark-search language to preliminary evidence for a qualified
   decision. A search or non-affiliation disclaimer is not clearance.
4. Revise the test name `accepts the current approved public docs` to avoid
   suggesting human approval. The authorized replacement must use
   `current configured public docs` or equivalent structural language without
   changing test behavior.
5. Authorize a narrow factual correction to
   `docs/privacy-architecture.md:16-20`: current local Swing Card PNG,
   print/PDF, and prompt-copy workflows exist, while camera capture, raw-video
   or landmark persistence, remote sharing, and remote model APIs remain
   unimplemented. The edit corrects current behavior only; it does not approve
   the privacy document or any export practice.
6. Revise the research recommendation to scan every historical packet for
   prohibited claims. Immutable audit evidence must instead be inventoried as a
   separate repository-publication category and excluded from normalization or
   policy-source uniqueness checks.

## Defer

- Actual qualified-human legal, privacy, safety/medical-scope, trademark, and
  public-release decisions or signatures.
- Jurisdiction-specific waiver, governing-law, dispute, arbitration,
  class-action, minor/guardian, and privacy-notice language.
- Release territories, intended audience/minor posture, business/legal entity,
  monetization, distribution channels, production host, and support policy.
- Trademark clearance, registration, or branding approval.
- Production provider/host review and any provider upgrade.
- SS-021 clear-local-data behavior and deletion UX.
- SS-022 real-user/video accuracy validation.
- Runtime safety/privacy/export copy changes other than the approved factual
  privacy-document correction, which is documentation only.
- Runtime observability, telemetry, remote logging, or diagnostics.

## Reject

- Treating Codex, Gemini, Claude, automated verification, licenses, notices,
  non-affiliation language, or this package as a substitute for qualified-human
  review.
- Rewriting the SS-002 assumption-of-risk or release-of-liability draft in
  SS-020.
- Claiming enforceability, compliance, trademark clearance, medical approval,
  complete anonymity, guaranteed deletion, guaranteed privacy, guaranteed
  safety, or public-release approval.
- Adding runtime features, providers, model calls, SDKs, dependencies,
  persistence, service-worker behavior, data-flow/export-format behavior,
  remote sharing, deployment changes, telemetry, analytics, cloud storage, or
  logging.
- Creating a parallel verifier/parser or duplicating the canonical operational
  gate across supporting documents.
- Editing, normalizing, or absorbing historical audit packets or the nine
  protected untracked `docs/agent-guidance/` files.

## Weak claims retained

- Repository evidence cannot prove that no external human review exists; any
  claimed external evidence must be authenticated and scoped before use.
- Browser and network tests are environment- and fixture-bounded.
- The current generic MediaPipe notice does not establish exact behavior for
  pinned version `0.10.35`; version-specific evidence does not cover upgrades.
- “Public-facing” requires a human publication-boundary decision, including
  whether historical repository evidence is in scope.
- Non-medical disclaimers do not determine regulatory classification or overall
  consumer impression.

## Decision

These dispositions are the candidate architecture baseline. Builder work may
begin only after a Lead Architect independently confirms the paired
`docs/ss-020-preimplementation-spec.md` and explicitly states
`APPROVED FOR BUILDER`.

No human legal, privacy, safety, medical, trademark, compliance, or
public-release clearance is recorded here.
