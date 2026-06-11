# Swing Sync Licensing and Dependency Policy

Swing Sync uses Apache-2.0 for project source code. This document records the
engineering compliance policy for dependencies, reference repositories, SBOMs,
and notices. It is not legal advice.

## Human License Decision

Apache-2.0 is the approved project license for SS-001 implementation. The
decision was made by the project maintainer, Jason Alvarez, after Claude QA gave
SS-001 a PASS on 2026-06-04.

## License Sets

Allowed in production bundles:

- MIT
- Apache-2.0
- BSD-2-Clause
- BSD-3-Clause
- ISC
- CC0-1.0
- 0BSD

Blocked in production bundles:

- GPL-2.0-only / GPL-2.0-or-later
- GPL-3.0-only / GPL-3.0-or-later
- AGPL-3.0-only / AGPL-3.0-or-later
- LGPL-2.1-only / LGPL-2.1-or-later
- LGPL-3.0-only / LGPL-3.0-or-later
- unlicensed packages
- unknown, custom, or non-SPDX license identifiers
- proprietary packages without written permission or contract

Exception-required:

- MPL-2.0
- dual-license expressions that cannot be parsed cleanly by automation
- model weights, model assets, or SDKs with terms separate from source licenses

## MPL-2.0 Rule

MPL-2.0 is blocked from production bundles by default. An exception may be
approved only when `docs/licensing.md` records all of the following:

- package name and version;
- why the package is needed;
- evidence that the package is architecturally isolated or otherwise compliant;
- whether the package includes a secondary-license incompatibility notice;
- maintainer approval and approval date; and
- the exact CI allowlist/config exception.

No MPL-2.0 exceptions are currently approved.

## Synthetic Fixture Note

The synthetic packages in `test/fixtures/` intentionally omit `private: true`
because `@onebeyond/license-checker` reports private packages as `UNLICENSED`
instead of reading their SPDX `license` field. They are scoped under
`@swing-sync-test/`, are not referenced by publishing automation, and exist only
to validate compliance gates.

## Dual-License Rule

When a dependency is dual-licensed with only permissive options, such as
`MIT OR Apache-2.0`, Swing Sync may use the dependency without a special
exception if every branch is in the allowed set.

When a dual-license expression contains any blocked or exception-required
identifier, such as `GPL-3.0-only OR MIT` or `MPL-2.0 OR Apache-2.0`, automation
must fail the dependency until a maintainer records a documented exception here.
Swing Sync does not silently elect a permissive branch when the same expression
also contains GPL, AGPL, LGPL, MPL-2.0, unknown, custom, or non-SPDX terms.

## Dev-Only Tool Boundary

Dev-only copyleft tools may be considered only if they are not bundled, served,
linked into the application, required at runtime, or used to generate source,
code, model assets, or other files incorporated into the production output.

AGPL dependencies are blocked entirely until a maintainer explicitly approves a
documented exception.

## Reference Repository Reuse

Clean-room reimplementation is the default for reference repositories.

For unlicensed or copyleft references:

- do not copy, fork, port, or adapt code;
- do not copy model weights or datasets without explicit permission;
- high-level concepts may be summarized in a non-code functional specification;
- implementation must be written independently from that specification.

For MIT, Apache-2.0, BSD, ISC, CC0-1.0, or 0BSD references:

- clean-room reimplementation is preferred;
- derivative reuse requires explicit maintainer review in the pull request;
- the PR must identify source URL, file path, and license;
- original copyright/license notices must be preserved when required; and
- `THIRD_PARTY_NOTICES.md` must be updated.

## Reference Catalog

| Repository | License Status | Policy |
| --- | --- | --- |
| `HeleenaRobert/golf-swing-analysis` | MIT at time of SS-001 research | Clean-room preferred; derivative reuse requires notice preservation. |
| `damilab/CaddieSet` | MIT at time of SS-001 research | Cite paper/dataset; runtime code reuse requires notice preservation. |
| `tlouth19/analyze.golf` | No visible license during SS-001 research | Clean-room only; do not copy or adapt code. |
| `ryanboscobanze/GolfPosePro` | MIT at time of SS-001 research | Clean-room preferred; verify notebook/media provenance before reuse. |
| `MingHanLee/GolfPose` | No visible license during SS-001 research | Clean-room only; do not copy code or model weights. |

## SBOM Policy

`docs/sbom.json` is the CycloneDX dependency inventory generated from the npm
dependency graph. It is not proof that the built browser bundle is license-clean.
Bundle compliance is checked separately through a Vite/Rollup license gate that
must be validated against a synthetic prohibited package fixture installed as a
local dev package.

The current scaffold has no production runtime dependencies, so
`docs/sbom.json` may contain an empty `components` array after
`scripts/filter-sbom.js` removes dev-only and extraneous packages from the
CycloneDX generator output. Once runtime dependencies are added, production
components must appear in the SBOM and dev-only packages must remain absent.

The SBOM is stored in `docs/` and may also be attached to GitHub releases. It is
not served from `public/` by default.

## Apache NOTICE Obligations

Apache-2.0 dependencies may include upstream `NOTICE` files that must be
preserved. `scripts/aggregate-notices.js` must source NOTICE files from the
production-resolved dependency graph only, using one of:

- `npm ls --omit=dev --json`;
- `docs/sbom.json`; or
- a lockfile-derived production dependency graph.

The script must not crawl all of `node_modules` indiscriminately.

## Model and SDK Policy

See `docs/models-licensing.md`. No model binaries or model weights may be
committed, vendored, served, or fetched until per-model rights are documented.

Optional model API SDKs require two independent approvals:

- the SDK source license must satisfy this policy; and
- provider service terms must permit Swing Sync's intended local-first,
  opt-in data sharing behavior.

For SS-005, exact `@mediapipe/tasks-vision@0.10.35` remains a pinned candidate
pending explicit maintainer compliance approval. Google has stated that current
Web SDKs are Apache-2.0 and that the current Web SDK does not include telemetry.
The inspected exact package contains compiled WASM and does not package LICENSE
or NOTICE files. Before adding it, the maintainer must approve reliance on
Google's SDK-wide license statement for packaged compiled artifacts and approve
the plan to distribute Apache-2.0 license text plus third-party attribution.
Any later SDK version requires a fresh license, privacy, provider-metrics, and
network review. See `docs/ss-005-google-provider-response.md`.

## Trademark Timing

The name "Swing Sync" requires a preliminary trademark search before the
repository is made broadly public or promoted.
