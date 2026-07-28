import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function luminance(hex: string): number {
  const values = hex.slice(1).match(/.{2}/g)!.map((item) => Number.parseInt(item, 16) / 255);
  const linear = values.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function ratio(first: string, second: string): number {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

describe("approved accessibility contrast tokens", () => {
  it("keeps exact token values and every enumerated surface above 3 to 1", () => {
    const css = readFileSync("src/styles.css", "utf8");
    expect(css).toMatch(/--focus-inner:\s*#ffffff/);
    expect(css).toMatch(/--focus-outer:\s*#17211b/);
    expect(css).toMatch(/--interactive-boundary:\s*#607367/);
    expect(css).toMatch(/\.secondary-action\s*\{[^}]*border:\s*1px solid var\(--interactive-boundary\)/s);
    expect(css).toMatch(/\.source-option,\s*\.step-button,\s*\.keyframe-button\s*\{[^}]*border-color:\s*var\(--interactive-boundary\)/s);
    expect(css).toMatch(/\.phase-declarations select,\s*\.phase-assignment select\s*\{[^}]*border:\s*1px solid var\(--interactive-boundary\)/s);
    expect(css).toMatch(/\.primary-action\s*\{[^}]*color:\s*#ffffff;[^}]*background:\s*#245b3b/s);
    const pairs = [
      ["#17211b", "#ffffff"], ["#17211b", "#f3f5f1"], ["#17211b", "#f8faf7"],
      ["#17211b", "#e7f0e9"], ["#17211b", "#eaf3ec"], ["#ffffff", "#17211b"],
      ["#ffffff", "#245b3b"], ["#607367", "#ffffff"], ["#607367", "#f3f5f1"],
      ["#607367", "#f8faf7"], ["#607367", "#e7f0e9"], ["#607367", "#eaf3ec"]
    ];
    for (const [foreground, background] of pairs) expect(ratio(foreground, background)).toBeGreaterThanOrEqual(3);
    expect(css).not.toContain("forced-color-adjust: none");
    expect(css).toContain("@media (forced-colors: active)");
  });
});
