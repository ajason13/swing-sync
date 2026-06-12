import { defineConfig } from "vite";
import license from "rollup-plugin-license";

const allowedLicenses = "(MIT OR Apache-2.0 OR BSD-2-Clause OR BSD-3-Clause OR ISC OR CC0-1.0 OR 0BSD)";

export default defineConfig({
  worker: {
    format: "es"
  },
  build: {
    rollupOptions: {
      plugins: [
        license({
          sourcemap: true,
          thirdParty: {
            includePrivate: true,
            multipleVersions: true,
            allow: {
              test: allowedLicenses,
              failOnUnlicensed: true,
              failOnViolation: true
            },
            output: {
              file: "dist/THIRD_PARTY_NOTICES.rollup.txt"
            }
          }
        })
      ]
    }
  }
});
