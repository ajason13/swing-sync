# SS-022 Pre-Implementation Specification

Status: **Approved for Builder by the Lead Architect.** This Task writes a
future-study protocol only. It does not authorize a study, media collection,
fixtures, runtime behavior, or public accuracy claim.

## Owned artifacts

- `docs/ss-022-research-notes.md`
- `docs/ss-022-research-disposition.md`
- `docs/ss-022-preimplementation-spec.md`
- `docs/accuracy-validation-protocol.md`
- later audit handoff/response files and coordinator-owned `CONTEXT.md`

No source, tests, scripts, package files, fixtures, media, assets, or
dependencies may change.

## Acceptance contract

The protocol must define supported input screening, camera and pose visibility
review, blinded phase-label review, metric-reasonableness reporting,
media-consent/provenance gates, bounded verdict language, output readiness, and
a staged sample/scenario matrix. It must state that current mannequin and
synthetic fixtures prove plumbing/regressions only.

It must preserve local-first raw video and require separate explicit opt-in and
approval before any remote transfer. It must not define a universal threshold:
future thresholds require pre-registration for the tested version, endpoint,
sample, and scenario.

## Verification

Use Node 22 and run `npm run docs:verify`, `npm run fixture:verify`,
`npm run safety:verify`, `npm run privacy:verify`, `npm run compliance:verify`,
and `git diff --check`. Claude PASS is required before PR preparation; PR,
merge, Notion, and `CONTEXT.md` must agree before Done.

## Observability

Intentionally unchanged. There is no runtime surface in this Task.
