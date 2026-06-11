import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

const approved = new Map([
  [
    "public/models/pose_landmarker_full-float16-v1.task",
    "5134a3aad27a58b93da0088d431f366da362b44e3ccfbe3462b3827a839011b1"
  ],
  [
    "public/mediapipe/wasm/vision_wasm_internal.js",
    "e7fd9858e8e8f221d9b96eddc11f8e077f263e0b7bbd79d3cbe882b134274f8c"
  ],
  [
    "public/mediapipe/wasm/vision_wasm_internal.wasm",
    "6a5c64584c2ab61c763b6e204afbdbc7ce1caf7f5216187322bca8df94f646bc"
  ],
  [
    "public/mediapipe/wasm/vision_wasm_module_internal.js",
    "1f1d6215324a1fe62f6742d49a3db911170987ca18ad8c1b75f1a1c82acf2b44"
  ],
  [
    "public/mediapipe/wasm/vision_wasm_module_internal.wasm",
    "617b8e0248dbd27e9d7ece4218004eae4cefb499196d1bb4fa0e3fef21708756"
  ],
  [
    "public/mediapipe/wasm/vision_wasm_nosimd_internal.js",
    "438d1fe8ff7f4d946025bc211c291543c037d8a3785ed4eee60f1f521b236296"
  ],
  [
    "public/mediapipe/wasm/vision_wasm_nosimd_internal.wasm",
    "8a3092d34c79d3f57e6ba8592105e8a90f6b07c27891ffecd14cca428bfd3e31"
  ]
]);

for (const [path, expected] of approved) {
  if (!existsSync(path)) {
    throw new Error(`Approved pose asset is missing: ${path}`);
  }
  const actual = createHash("sha256").update(readFileSync(path)).digest("hex");
  if (actual !== expected) {
    throw new Error(`Approved pose asset hash mismatch: ${path}`);
  }
}

console.log("Approved pose asset hashes verified.");
