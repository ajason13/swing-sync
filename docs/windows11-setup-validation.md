# Windows 11 setup evidence

Recorded 2026-11-06 for [#96](https://github.com/ajason13/swing-sync/issues/96).
This is bounded local setup and synthetic browser evidence, not general Windows
certification, real-swing accuracy evidence or public-release approval.

## Environment and candidate

| Item | Observed value |
| --- | --- |
| OS | Microsoft Windows 11 Pro, 25H2, 10.0.26200.9711 |
| Architecture | x64; no ARM64 run |
| Git | 2.53.0.windows.3 |
| Node / npm | 22.22.3 / 10.9.8, official portable Windows distribution, session Path |
| Browser automation | Playwright 1.62.1; launched Chromium 151.0.7922.34 |
| App / lockfile baseline | `e0f2c4511657beb6c0d9135a313cc49b311b0cb2` |

The #96 PR changes documentation only; runtime, fixtures, models, lockfile and
test configuration match that baseline. Win32_OperatingSystem reported Windows
11 Pro; the legacy registry ProductName still said Windows 10 Pro, so that field
alone was not used to identify the OS. No clean OS installation or MSI installer
wizard was tested; Git and the extracted Node distribution were already available.

## Setup commands and results

Two fresh temporary checkouts were used: a no-hardlink clone of the local
repository, and a second clone using exactly
`git clone https://github.com/ajason13/swing-sync.git`. Both contained a fresh
dependency installation; neither reused the original checkout's `node_modules`.

- `git --version`, `node --version`, `npm.cmd --version`: values above.
- `npm.cmd ci`: passed in both clones, 305 packages added. npm reported eight
  moderate dependency findings, already tracked in #117; no forced audit fix.
- `npm.cmd run build` and `npm.cmd run compliance:verify`: passed in both clones,
  including notices, fixture/model hashes, safety, privacy and documentation checks.
- `npm.cmd run dev`: fresh remote clone printed `http://localhost:5173/`;
  an HTTP request to that URL returned 200. The local clone also started with
  `--host 127.0.0.1` and printed `http://127.0.0.1:5173/`.
- Both interactive server sessions were stopped with Ctrl+C. This was a
  PowerShell execution session; the optional Command Prompt batch prompt was
  not exercised.
- Final edited checkout: build/compliance and 51 focused documentation-claims
  tests passed. Browser and hosted final-head results are recorded in the PR.

The portable Node path was selected in the shell before all npm commands. No
execution-policy changes, global Vite install, WSL, API key or provider setup
was used. Playwright's browser cache was already installed; the first-time
browser-download command is documented but no fresh-cache download was needed.

## Bounded browser coverage and limits

Existing CLI suites ran on the fresh local clone with the unchanged baseline
app. Development checks passed 3/3, including real local inference on the
approved mannequin fixture with external requests blocked, eight processed
frames and 33 normalized landmarks. Production-preview CSP passed 1/1.

The standard suite exercises local selection/preview, interval selection,
inference, phase review and event-time selection, actual PNG generation/download,
print-view preparation, prompt generation, Stop/retry, and clearing app data.
Its desktop and Pixel 5 profiles both run Chromium on this Windows machine;
the latter is emulation, not Android hardware evidence. Native file dialogs are
bypassed with file-input assignment; print and clipboard calls are instrumented
in export tests. These establish application behavior, not successful interaction
with the OS print/PDF dialog, system clipboard, or file picker.

The initial full standard run passed 106/108 and encountered 30-second test timeouts in mobile
stalled-seek recovery and desktop silent-worker-init recovery. Their failure
snapshots showed processing completed; that observation does not identify a
cause. Preserve the initial failure record when interpreting later focused or
hosted results; no timeout, retry, skip or runtime changes were made for this PR.
A bounded serial diagnostic run of both recovery cases on both profiles passed
4/4 with unchanged code, separate output and the original failure traces retained.
This is a focused pass, not a complete local suite pass or a proven root cause.

Native Computer Use ended before the app walkthrough because it could not
confidently determine the browser URL. No direct native-browser walkthrough is
claimed. Playwright CLI is the setup verification path for this delivery;
native dialogs, installed-browser manual checks and broader hardware evidence
remain under [#73](https://github.com/ajason13/swing-sync/issues/73).

Only approved synthetic WebM fixtures were used. The mannequin is limited to
pose-extraction plumbing and is not a real golf swing. Other codecs, installed
Chrome/Edge/Firefox, Windows 10 ([#119](https://github.com/ajason13/swing-sync/issues/119)),
ARM64 and physical mobile devices were not validated. No participant media or
remote service interaction was used. Documentation adds no runtime logging,
telemetry, storage or network behavior.
