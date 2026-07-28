import { describe, expect, it, vi } from "vitest";
import {
  applyAccessibilityIntent,
  applyPostRenderAccessibility,
  findFocusTarget,
  isFocusKey,
  viewFallbackKey
} from "../../src/app-accessibility";

class FakeDocument {
  activeElement: FakeElement | null = null;
  defaultView = { getComputedStyle: (element: FakeElement) => ({ display: element.display, visibility: element.visibility }) };
}

class FakeElement {
  isConnected = true;
  hidden = false;
  disabled = false;
  hiddenAncestor = false;
  inertAncestor = false;
  ariaHidden = false;
  tabIndex = 0;
  display = "block";
  visibility = "visible";
  textContent = "";
  focus = vi.fn(() => { this.ownerDocument.activeElement = this; });
  constructor(readonly ownerDocument: FakeDocument, readonly key?: string) {}
  getAttribute(name: string): string | null {
    if (name === "data-focus-key") return this.key ?? null;
    if (name === "aria-hidden") return this.ariaHidden ? "true" : null;
    return null;
  }
  closest(): FakeElement | null { return this.hiddenAncestor || this.inertAncestor ? this : null; }
}

class FakeRoot {
  constructor(readonly elements: FakeElement[]) {}
  contains(element: FakeElement): boolean { return this.elements.includes(element); }
  querySelectorAll(): FakeElement[] { return this.elements; }
}

function fixture(...keys: string[]) {
  const document = new FakeDocument();
  const elements = keys.map((key) => new FakeElement(document, key));
  return { document, elements, root: new FakeRoot(elements) };
}

describe("app accessibility", () => {
  it("accepts only known data-focus-key values and rejects arbitrary selector strings", () => {
    for (const key of ["safety-consent", "workflow-step:review", "phase-assignment:7", "keyframe:0"]) expect(isFocusKey(key)).toBe(true);
    for (const key of ["#safety-consent", "[data-focus-key]", "workflow-step:settings", "phase-assignment:8", "keyframe:1.5"]) expect(isFocusKey(key)).toBe(false);
  });

  it("uses exact bounded dynamic-key rejection and exact per-view fallbacks", () => {
    expect(viewFallbackKey("capture", false)).toBe("stage-heading");
    expect(viewFallbackKey("processing", true)).toBe("stage-heading");
    expect(viewFallbackKey("review", true)).toBe("phase-review-heading");
    expect(viewFallbackKey("review", false)).toBe("stage-heading");
    expect(viewFallbackKey("export", true)).toBe("swing-card-heading");
    expect(viewFallbackKey("export", false)).toBe("stage-heading");
  });

  it("gives explicit focus precedence over prior and fallback targets", () => {
    const { root, elements } = fixture("stage-heading", "video-picker", "safety-consent");
    applyPostRenderAccessibility(root as never, null, "capture", false, { focusKey: "video-picker" }, "safety-consent");
    expect(elements[1].focus).toHaveBeenCalledOnce();
    expect(elements[0].focus).not.toHaveBeenCalled();
    expect(elements[2].focus).not.toHaveBeenCalled();
  });

  it("restores previous known focus and otherwise uses a visible enabled fallback", () => {
    const { root, elements } = fixture("stage-heading", "safety-consent");
    applyPostRenderAccessibility(root as never, null, "capture", false, {}, "safety-consent");
    expect(elements[1].focus).toHaveBeenCalledOnce();
    elements[1].disabled = true;
    applyPostRenderAccessibility(root as never, null, "capture", false);
    expect(elements[0].focus).toHaveBeenCalledOnce();
  });

  it("rejects hidden disconnected disabled aria-hidden inert hidden-ancestor invisible and positive-tabindex targets", () => {
    for (const state of ["hidden", "disconnected", "disabled", "aria-hidden", "inert", "ancestor", "display", "visibility", "positive"]) {
      const { root, elements } = fixture("video-picker");
      const target = elements[0];
      if (state === "hidden") target.hidden = true;
      if (state === "disconnected") target.isConnected = false;
      if (state === "disabled") target.disabled = true;
      if (state === "aria-hidden") target.ariaHidden = true;
      if (state === "inert") target.inertAncestor = true;
      if (state === "ancestor") target.hiddenAncestor = true;
      if (state === "display") target.display = "none";
      if (state === "visibility") target.visibility = "hidden";
      if (state === "positive") target.tabIndex = 1;
      expect(findFocusTarget(root as never, "video-picker")).toBeUndefined();
    }
  });

  it("allows tabindex -1 programmatic targets and safely no-ops without a target", () => {
    const { root, elements } = fixture("stage-heading");
    elements[0].tabIndex = -1;
    applyAccessibilityIntent(root as never, null, { focusKey: "stage-heading" });
    expect(elements[0].focus).toHaveBeenCalledOnce();
    expect(() => applyAccessibilityIntent(new FakeRoot([]) as never, null, { focusKey: "stage-heading" })).not.toThrow();
  });

  it("updates the stable announcer through textContent and not when announcement is absent", () => {
    const announcer = { textContent: "Existing" } as HTMLElement;
    const root = new FakeRoot([]);
    applyAccessibilityIntent(root as never, announcer, { announcement: "Ready <strong>now</strong>" });
    expect(announcer.textContent).toBe("Ready <strong>now</strong>");
    applyAccessibilityIntent(root as never, announcer, {});
    expect(announcer.textContent).toBe("Ready <strong>now</strong>");
  });

  it("keeps retry and terminal focus idempotent with and without intervening user focus", () => {
    const { document, root, elements } = fixture("stage-heading", "retry-analysis");
    applyAccessibilityIntent(root as never, null, { focusKey: "stage-heading" });
    applyAccessibilityIntent(root as never, null, { focusKey: "stage-heading" });
    expect(elements[0].focus).toHaveBeenCalledOnce();
    document.activeElement = elements[1];
    applyAccessibilityIntent(root as never, null, { focusKey: "stage-heading" });
    expect(elements[0].focus).toHaveBeenCalledTimes(2);
  });
});
