# Native Windows setup

This path is for local development on Windows 11. The recorded
[Windows 11 x64 checks](windows11-setup-validation.md) cover a specific environment,
not every Windows device, browser or video codec. Windows 10 setup and workflow
are unverified and tracked separately in [#119](https://github.com/ajason13/swing-sync/issues/119).
ARM64 and the broader browser/physical-device matrix remain unverified in
[#73](https://github.com/ajason13/swing-sync/issues/73).

## Prerequisites

- Install [Git for Windows](https://git-scm.com/install/windows), with Git available
  from PowerShell/Command Prompt.
- Get **Node 22** with its bundled npm from the [official Node downloads](https://nodejs.org/en/download).
  Select version 22 and the Windows architecture for your machine; the site's
  default major may differ from this repository's `.nvmrc`. The Windows `.msi`
  installer is one option. Alternatively extract the official Windows `.zip`
  distribution into a user-owned directory and add that extracted directory
  (containing `node.exe` and `npm.cmd`) to the current shell's `Path` as below.
  No global Vite install, Python, API key or remote model provider is required
  for the verified workflow.
- Have a browser available. Automated evidence uses Playwright's Chromium;
  installed Chrome/Edge/Firefox and their native dialogs are separate checks.

For an extracted Node distribution, replace the example with your actual path:

```powershell
$env:Path = 'C:\Tools\node-v22.22.3-win-x64;' + $env:Path
```

This changes only that PowerShell session. Reopen your terminal after using an
installer so it sees the updated `Path`. These instructions do not require
nvm-sh, Git Bash or WSL. An existing version manager is also fine if the version
checks below resolve to Node 22 and its bundled npm.

## Clone, install and start

In PowerShell, from the parent directory where you want the checkout:

```powershell
git --version
node --version
npm.cmd --version
git clone https://github.com/ajason13/swing-sync.git
cd swing-sync
Get-Content .nvmrc
npm.cmd ci
npm.cmd run dev
```

Confirm `node --version` starts with `v22.` and `.nvmrc` says `22` before
installing. `npm ci` downloads the locked dependencies; first-time setup needs
network access. Keep the terminal open and open Vite's printed local URL in the
browser (normally `http://localhost:5173`; if occupied, Vite can choose another
port). Follow [Using Swing Sync](../README.md#using-swing-sync).

Press `Ctrl+C` in the server terminal to shut down. If Command Prompt asks
`Terminate batch job (Y/N)?`, enter `Y`. Start again with `npm.cmd run dev`.
Windows Command Prompt can run the same Git/Node/npm commands; use `type .nvmrc`
instead of `Get-Content .nvmrc`.

The explicit `npm.cmd` and `npx.cmd` commands avoid PowerShell choosing the
`npm.ps1`/`npx.ps1` shims when script execution is restricted. Do not weaken the
machine's execution policy for this project. If a command is not found, check
`where.exe node` and `where.exe npm.cmd`, fix the installed/extracted Node path,
and verify the major again. A path containing spaces must be quoted.

## Verification and synthetic workflow

From the repository directory, with Node 22 still active:

```powershell
npm.cmd run build
npm.cmd run compliance:verify
npm.cmd run typecheck
npm.cmd run test:unit
npx.cmd playwright install chromium
npm.cmd run test:smoke
npm.cmd run test:smoke:dev
npm.cmd run test:smoke:csp-preview
```

The browser suites start and stop their own local servers. Stop manual servers
on their test ports (4173, 4174, 4175) first. A Playwright browser download is
separate from `npm ci`. See [Contributing](../CONTRIBUTING.md#testing) for licensing
checks required for dependency changes; do not use `npm audit fix --force` as a
setup step. Existing SBOM-tool advisory remediation is tracked in
[#117](https://github.com/ajason13/swing-sync/issues/117).

For a synthetic walkthrough, use only the approved
`test/fixtures/pose-landmarker/mannequin-golf-address.webm` for local
pose-extraction plumbing; its provenance and limitations are recorded beside it.
Exercise selection and preview, an analysis interval, local inference, phase
review, PNG download, print/PDF, prompt copy, Stop/retry and Clear local app data.
The fixture is not a real swing and establishes no accuracy or coaching claim.
Copy only into a local scratch destination during verification; no service
upload is needed. Codec support depends on the browser; an accepted file
extension does not guarantee decoding. On preview/decode failure, choose a
different readable local clip. Clipboard and print can be unavailable under
browser policy; report the actual result rather than treating a status message
as proof that a native dialog or clipboard operation completed.

Playwright's [current native runner requirements](https://playwright.dev/docs/intro#system-requirements)
list Windows 11+, Windows Server 2019+ or WSL (checked 2026-11-06). Windows 10
app/setup validation is a separate question from runner support. WSL is an
optional Linux development environment; these commands and local evidence do
not require it or establish WSL coverage.
