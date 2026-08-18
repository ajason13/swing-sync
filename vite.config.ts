import { defineConfig, type ConfigEnv, type Plugin, type UserConfig } from "vite";
import license from "rollup-plugin-license";

const allowedLicenses = "(MIT OR Apache-2.0 OR BSD-2-Clause OR BSD-3-Clause OR ISC OR CC0-1.0 OR 0BSD)";
const developmentStyleSource = "style-src 'self'";
const developmentStyleSourceWithInline = "style-src 'self' 'unsafe-inline'";

export function addDevelopmentStyleSource(html: string): string {
  const cspMetaTags = html.match(/<meta\b[^>]*\bhttp-equiv\s*=\s*(['"])Content-Security-Policy\1[^>]*>/gi) ?? [];
  if (cspMetaTags.length !== 1) throw new Error("Expected exactly one Content-Security-Policy meta tag.");

  const cspMetaTag = cspMetaTags[0];
  const contentMatch = cspMetaTag.match(/\bcontent\s*=\s*(['"])([\s\S]*?)\1/i);
  if (!contentMatch) throw new Error("Expected the Content-Security-Policy meta tag to have content.");

  const [, quote, csp] = contentMatch;
  if (csp.includes(developmentStyleSourceWithInline)) return html;
  if (csp.split(developmentStyleSource).length !== 2) {
    throw new Error("Expected exactly one style-src 'self' directive in the Content-Security-Policy meta tag.");
  }

  const developmentCsp = csp.replace(developmentStyleSource, developmentStyleSourceWithInline);
  return html.replace(cspMetaTag, cspMetaTag.replace(`${quote}${csp}${quote}`, `${quote}${developmentCsp}${quote}`));
}

export function developmentCspPlugin(): Plugin {
  return {
    name: "swing-sync-development-csp",
    apply: "serve",
    transformIndexHtml: addDevelopmentStyleSource
  };
}

export function createViteConfig({ command }: Pick<ConfigEnv, "command">): UserConfig {
  return {
  worker: {
    format: "es"
  },
  plugins: command === "serve" ? [developmentCspPlugin()] : [],
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
  };
}

export default defineConfig(createViteConfig);
