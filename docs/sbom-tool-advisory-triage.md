# SBOM tooling advisory triage

## Disposition and scope

On 2026-11-06, [#115](https://github.com/ajason13/swing-sync/issues/115)
investigated the remaining Glob/Minimatch findings on main
`198c36d8394f52765d7fc908444a2dac27e89fbe` with Node 22.22.3/npm 10.9.8
on Windows x64. The disposition is **unresolved upstream compatibility**.
The findings remain; this record grants no security clearance or license-policy
exception. No dependency, installation setting, validation command, application
behavior, logging, storage, or network boundary changes are introduced.

## Reproduction and dependency paths

From a clean lockfile install under Node 22:

```sh
npm ci
npm audit --json
npm audit --omit=dev --json
npm ls glob minimatch cacache make-fetch-happen node-gyp libxmljs2
```

The full audit exits 1 with eight moderate affected package entries, including
two underlying advisories. Production-only audit exits 0 with no findings.
These are dated registry results, not a claim that other vulnerabilities are
absent. The installed affected path is:

```text
@cyclonedx/cyclonedx-npm 6.0.0
  -> optional libxmljs2 0.37.0
  -> node-gyp 11.5.0
  -> make-fetch-happen 14.0.3
  -> cacache 19.0.1
  -> glob 10.5.0
  -> minimatch 9.0.9
```

CycloneDX npm also directly depends on `@cyclonedx/cyclonedx-library` 10.1.0,
which declares `libxmljs2` as an optional peer dependency.

The scanner's separate Glob 7.2.3/Minimatch 3.1.5 path is outside the affected
ranges of these two advisories; this is not a general safety assessment of that
older path.

## Exposure evidence and limits

The [Glob advisory](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4)
reports continued filesystem traversal after cancellation for versions
9.0.0 through 14.0.1; the fix is 14.0.2. The
[Minimatch advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249)
reports pattern amplification at optimization level 2 or higher in versions
7.0.0 through versions below 11.0.1; the fix is 11.0.1.

Installed-source inspection found the following boundaries:

- `cacache/lib/verify.js` and `lib/rm.js` call its Glob wrapper with cache-root
  paths plus fixed suffixes (`**` and `*(content-*|index-*)`). These calls supply
  neither an AbortSignal nor an optimization-level override. The installed
  Glob implementation selects Minimatch optimization level 2, so its pattern
  preprocessing remains relevant even without caller-supplied options.
- Cache-root paths come from tooling configuration and are incorporated into
  patterns. They must not be described as universally trusted or escaped.
  `make-fetch-happen/lib/cache/entry.js` uses entry/content removal, distinct
  from the cache-wide removal that invokes Glob. This bounded inspection does
  not prove all transitive tooling entry points unreachable.
- `libxmljs2` installs using `prebuild-install || node-gyp rebuild`. Missing
  prebuilt binaries can activate native build/download tooling; OS, Node ABI,
  network access, and build prerequisites affect the executed path. Optional
  installation failure or a prebuilt-binary success is not vulnerability
  remediation. Lockfile and installed-tree evidence must be distinguished.
- The repository's `sbom:generate` command requests JSON and `--validate`.
  CycloneDX's JSON validator loads AJV, AJV formats, and draft-2019 support;
  `libxmljs2` supplies optional XML validation. JSON generation does not require
  XML validation, but normal installation still includes that optional path.
  The CLI can warn and skip validation when validator dependencies are missing,
  even with `--validate`; verification must confirm actual validation succeeds.
- No app-supplied video or swing pattern input was identified at these cache
  calls. Project exploitability is **unverified**. There is no adversarial
  traversal/pattern reproduction or exhaustive reachability proof in this work.

## Compatibility investigation

Published npm metadata checked on 2026-11-06 showed:

| Candidate | Evidence and limit |
| --- | --- |
| CycloneDX npm 6.0.1 / library 10.4.0 | Both retain `libxmljs2` range `^0.35\|\|^0.37`; a patch update alone does not resolve the chain. |
| libxmljs2 0.37.0 | Latest published version; requires node-gyp `^11.2.0`. Installed 11.5.0 is the latest published 11.x. |
| libxmljs2 0.35.0 alternative | Reaches Glob 10 via node-gyp 10 / make-fetch-happen 13 / cacache 18; selecting it does not remove the findings. |
| Installed compatible ranges | Latest make-fetch-happen 14.0.3, cacache 19.0.1, Glob 10.5.0, and Minimatch 9.0.9 retain the affected path. |
| Newer major versions | node-gyp 13.1.0 no longer lists make-fetch-happen, but is outside libxmljs2's range. Glob 14.0.2 and Minimatch 11.0.1 are outside their installed consumers' ranges. Forced cross-major overrides are not a supported fix demonstrated here. |
| npm audit's CycloneDX 4.0.1 suggestion | A major downgrade recommendation is not compatibility, inventory, or validation evidence. It was not applied. |

Metadata can be rechecked with `npm view <package>@<version> dependencies
optionalDependencies peerDependencies engines --json`. The
[CycloneDX 6.0.1 release](https://github.com/CycloneDX/cyclonedx-node-npm/releases/tag/v6.0.1)
is a maintenance release; it does not establish remediation of these advisories.
No global omission of optional dependencies, removal of JSON validation, or
policy relaxation is adopted by this disposition.

## Verification and next action

The delivery evidence, including exact reviewed head, actual install/validation
results, production inventory comparison, license/fixture/bundle/notice gates,
type/unit/build/compliance checks, and hosted Ubuntu/Windows results, belongs
in [#115](https://github.com/ajason13/swing-sync/issues/115) and its linked PR.
Passing those checks establishes bounded compatibility of the unchanged
toolchain; it does not remediate the reported advisories.

[Follow-up #117](https://github.com/ajason13/swing-sync/issues/117) owns the
remaining remediation. Recheck upstream CycloneDX/libxmljs2/build-tool release
metadata for a supported patched chain. If none is available, prepare a bounded
SBOM-tool replacement or installation-design proposal for maintainer decision.
Promote that work to Ready only after its plan preserves actual JSON schema
validation, production inventory, notices, license policy, and Node 22
Ubuntu/Windows behavior. No background monitor or upstream contact is started.
