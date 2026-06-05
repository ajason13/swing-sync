import { resolve } from "node:path";
import { defineConfig, mergeConfig } from "vite";
import baseConfig from "./vite.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    build: {
      rollupOptions: {
        input: resolve(__dirname, "src/bundle-license-fixture-entry.ts")
      }
    }
  })
);
