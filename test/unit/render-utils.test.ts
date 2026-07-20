import { describe, expect, it } from "vitest";
import { escapeHtml, formatRemoteDataClass, formatSwingCardWarning } from "../../src/render-utils";

describe("render utilities", () => {
  it("escapes user-controlled text through one canonical helper", () => {
    expect(escapeHtml(`<img src=x onerror="alert('x')">`)).toBe(
      "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;"
    );
  });

  it("formats remote data classes and Swing Card warnings consistently", () => {
    expect(formatRemoteDataClass("warnings-and-limitations")).toBe("Warnings and Limitations");
    expect(formatSwingCardWarning("PHASE_REVIEW_REQUIRED")).toBe(
      "Phase review is required before metrics should be interpreted."
    );
  });
});
