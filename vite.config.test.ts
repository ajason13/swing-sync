import { resolve } from "node:path";
import { defineConfig, mergeConfig } from "vite";
import { createViteConfig } from "./vite.config";

export default defineConfig((configEnv) =>
  mergeConfig(
    createViteConfig(configEnv),
    defineConfig({
      build: {
        rollupOptions: {
          input: resolve(__dirname, "src/bundle-license-fixture-entry.ts")
        }
      }
    })
  )
);
