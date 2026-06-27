import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SwingMetricPayload } from "../../src/metric-contract";
import {
  buildSwingCardPrompt,
  composeSwingCardPng,
  deriveSwingCardContentWarnings,
  renderSwingCardPrintSurface,
  sanitizeSwingCardFilename,
  triggerSwingCardDownload,
  wrapCanvasText
} from "../../src/swing-card-generator";
import type { PoseOverlayRenderResult } from "../../src/pose-renderer";
import type { SwingCardContent, SwingCardKeyframe } from "../../src/swing-card-contract";

interface FakeContext {
  canvas: HTMLCanvasElement;
  fillStyle: string;
  strokeStyle: string;
  lineWidth: number;
  font: string;
  setTransform: ReturnType<typeof vi.fn>;
  fillRect: ReturnType<typeof vi.fn>;
  strokeRect: ReturnType<typeof vi.fn>;
  fillText: ReturnType<typeof vi.fn>;
  drawImage: ReturnType<typeof vi.fn>;
  measureText: ReturnType<typeof vi.fn>;
}

const originalGetRandomValues = crypto.getRandomValues.bind(crypto);
const createdCanvases: FakeCanvas[] = [];
let fakeDocument: FakeDocument;

class FakeElement {
  className = "";
  dataset: Record<string, string> = {};
  style: Record<string, string> = {};
  textContent = "";
  attributes = new Map<string, string>();
  children: FakeElement[] = [];
  parent?: FakeElement;

  constructor(readonly tagName: string) {}

  append(...children: FakeElement[]): void {
    for (const child of children) {
      child.parent = this;
      this.children.push(child);
    }
  }

  remove(): void {
    if (!this.parent) return;
    this.parent.children = this.parent.children.filter((child) => child !== this);
    this.parent = undefined;
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  querySelectorAll(selector: string): FakeElement[] {
    const matches: FakeElement[] = [];
    const visit = (element: FakeElement) => {
      if (matchesSelector(element, selector)) matches.push(element);
      for (const child of element.children) visit(child);
    };
    visit(this);
    return matches;
  }

  getText(): string {
    return [this.textContent, ...this.children.map((child) => child.getText())].join("");
  }
}

class FakeAnchorElement extends FakeElement {
  href = "";
  download = "";
  rel = "";

  constructor() {
    super("a");
  }

  click(): void {
    return undefined;
  }
}

class FakeDocument {
  body = new FakeElement("body");

  createElement(tagName: string): FakeElement {
    if (tagName.toLowerCase() === "canvas") {
      const canvas = new FakeCanvas();
      createdCanvases.push(canvas);
      return canvas as unknown as FakeElement;
    }
    if (tagName.toLowerCase() === "a") return new FakeAnchorElement();
    return new FakeElement(tagName);
  }
}

function matchesSelector(element: FakeElement, selector: string): boolean {
  if (selector.startsWith(".")) return element.className.split(/\s+/).includes(selector.slice(1));
  if (selector === "a[download]") return element instanceof FakeAnchorElement && !!element.download;
  if (selector === "[data-swing-card-print-section]") {
    return Object.hasOwn(element.dataset, "swingCardPrintSection");
  }
  return false;
}

class FakeCanvas extends FakeElement {
  width = 0;
  height = 0;
  context: FakeContext | null;
  toBlobImpl: (callback: BlobCallback, type?: string) => void = (callback) => {
    callback(new Blob(["png"], { type: "image/png" }));
  };
  toDataURL = vi.fn();

  constructor(contextAvailable = true) {
    super("canvas");
    this.context = contextAvailable ? fakeContext(this as unknown as HTMLCanvasElement) : null;
  }

  getContext = vi.fn(() => this.context);

  toBlob(callback: BlobCallback, type?: string): void {
    this.toBlobImpl(callback, type);
  }
}

function fakeContext(canvas: HTMLCanvasElement): FakeContext {
  return {
    canvas,
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 0,
    font: "",
    setTransform: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    drawImage: vi.fn(),
    measureText: vi.fn((text: string) => ({ width: text.length * 8 }) as TextMetrics)
  };
}

function installCanvasFactory(contextAvailable = true): void {
  vi.spyOn(fakeDocument, "createElement").mockImplementation((tagName) => {
    if (tagName.toLowerCase() !== "canvas") return new FakeElement(tagName);
    const canvas = new FakeCanvas(contextAvailable);
    createdCanvases.push(canvas);
    return canvas as unknown as FakeElement;
  });
}

function installCanvasFactoryWithToBlob(toBlobImpl: FakeCanvas["toBlobImpl"]): void {
  vi.spyOn(fakeDocument, "createElement").mockImplementation((tagName) => {
    if (tagName.toLowerCase() !== "canvas") return new FakeElement(tagName);
    const canvas = new FakeCanvas();
    canvas.toBlobImpl = toBlobImpl;
    createdCanvases.push(canvas);
    return canvas as unknown as FakeElement;
  });
}

function overlay(status: PoseOverlayRenderResult["status"] = "rendered"): PoseOverlayRenderResult {
  return {
    status,
    renderedSegments: status === "unavailable" ? 0 : 18,
    skippedSegments: status === "rendered" ? 0 : 1,
    warnings: [],
    width: 640,
    height: 360
  };
}

function preview() {
  return { width: 640, height: 360, close: vi.fn() } as unknown as ImageBitmap & {
    close: ReturnType<typeof vi.fn>;
  };
}

function keyframe(overrides: Partial<SwingCardKeyframe> = {}): SwingCardKeyframe {
  return {
    phaseId: "address",
    phaseLabel: "Address",
    preview: preview(),
    overlay: overlay(),
    ...overrides
  };
}

function metricPayload(overrides: Partial<SwingMetricPayload["metrics"][number]> = {}): SwingMetricPayload {
  return {
    schemaVersion: "0.1.0",
    caddieSetEquivalence: "not-equivalent",
    metrics: [
      {
        metricName: "address-stance-ratio",
        value: { status: "measured", numericValue: 1.2 },
        units: "ratio",
        phaseId: "address",
        handedness: "right",
        confidence: { kind: "not-calibrated" },
        limitationNotes: ["none"],
        ...overrides
      }
    ]
  };
}

function content(overrides: Partial<SwingCardContent> = {}): SwingCardContent {
  const base: SwingCardContent = {
    keyframes: [keyframe()],
    metricPayload: metricPayload(),
    warnings: [],
    analysisPrompt: "Use only the evidence shown in the card."
  };
  return { ...base, ...overrides };
}

beforeEach(() => {
  vi.restoreAllMocks();
  createdCanvases.length = 0;
  fakeDocument = new FakeDocument();
  Object.assign(globalThis, {
    document: fakeDocument,
    window: { setTimeout },
    HTMLAnchorElement: FakeAnchorElement
  });
  Object.defineProperty(crypto, "getRandomValues", {
    configurable: true,
    value: vi.fn((array: Uint8Array) => {
      array.set([0x12, 0x34, 0xab, 0xcd]);
      return array;
    })
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  delete (globalThis as { devicePixelRatio?: number }).devicePixelRatio;
  Object.defineProperty(crypto, "getRandomValues", {
    configurable: true,
    value: originalGetRandomValues
  });
});

describe("swing card warning derivation", () => {
  it("returns warning codes in deterministic order with co-occurrence", () => {
    expect(
      deriveSwingCardContentWarnings({
        keyframes: [keyframe({ preview: undefined, overlay: overlay("partial") })],
        metricPayload: undefined,
        phaseReviewConfirmed: false
      })
    ).toEqual(["KEYFRAME_UNAVAILABLE", "METRICS_UNAVAILABLE", "PHASE_REVIEW_REQUIRED", "PROMPT_LIMITED_EVIDENCE"]);
  });

  it("covers empty keyframes and measured low-evidence metrics", () => {
    expect(
      deriveSwingCardContentWarnings({
        keyframes: [],
        metricPayload: metricPayload({
          confidence: { kind: "low-evidence" },
          limitationNotes: ["pose-evidence-low"]
        }),
        phaseReviewConfirmed: true
      })
    ).toEqual(["NO_KEYFRAMES_SELECTED", "PROMPT_LIMITED_EVIDENCE"]);
  });

  it("marks metrics unavailable only when there are no measured metrics", () => {
    expect(
      deriveSwingCardContentWarnings({
        keyframes: [keyframe()],
        metricPayload: metricPayload({
          value: { status: "missing", numericValue: null },
          confidence: { kind: "unavailable" },
          limitationNotes: ["metric-not-calculated"]
        }),
        phaseReviewConfirmed: true
      })
    ).toEqual(["METRICS_UNAVAILABLE", "PROMPT_LIMITED_EVIDENCE"]);
  });
});

describe("swing card text and filenames", () => {
  it("wraps text using measured widths and preserves paragraph breaks", () => {
    const context = fakeContext({} as HTMLCanvasElement);
    const lines = wrapCanvasText(
      context,
      "This sentence should wrap before the boundary.\n\nSuperlongword",
      96
    );
    expect(lines.length).toBeGreaterThan(3);
    expect(lines).toContain("");
    expect(lines.at(-1)).toBe("Superlongword");
  });

  it("uses wall-clock date and crypto bytes for sanitized filenames", () => {
    expect(sanitizeSwingCardFilename(new Date(2026, 5, 26))).toBe(
      "swing-sync-card-20260626-1234abcd.png"
    );
  });

  it("builds bounded prompt copy without forbidden claims", () => {
    const prompt = buildSwingCardPrompt(
      content({ warnings: ["METRICS_UNAVAILABLE", "PHASE_REVIEW_REQUIRED"] })
    );
    expect(prompt).toContain("manual");
    expect(prompt).toContain("Use only the evidence");
    expect(prompt).toContain("qualified golf coach");
    expect(prompt).toContain("service's terms and privacy practices apply");
    expect(prompt).toContain("Do not claim the card is anonymous");
    expect(prompt).not.toMatch(/guarantees privacy|will diagnose|diagnosis of/i);
  });
});

describe("swing card PNG composition", () => {
  it("returns success with unchanged warnings and does not close previews", async () => {
    installCanvasFactory();
    Object.assign(globalThis, { devicePixelRatio: 2 });
    const source = preview();
    const warnings = ["PROMPT_LIMITED_EVIDENCE"] as const;
    const result = await composeSwingCardPng(
      content({ keyframes: [keyframe({ preview: source })], warnings })
    );

    expect(result.status).toBe("ok");
    expect(result.warnings).toBe(warnings);
    expect(source.close).not.toHaveBeenCalled();
    expect(createdCanvases[0].toDataURL).not.toHaveBeenCalled();
    expect(createdCanvases[0].context?.drawImage).toHaveBeenCalled();
    expect(createdCanvases[0].width).toBe(1920);
    expect(createdCanvases[0].height).toBe(3200);
  });

  it("renders a placeholder instead of drawing a bare preview when overlay is missing", async () => {
    installCanvasFactory();
    await composeSwingCardPng(content({ keyframes: [keyframe({ overlay: undefined })] }));

    expect(createdCanvases[0].context?.drawImage).not.toHaveBeenCalled();
    expect(createdCanvases[0].context?.fillText).toHaveBeenCalledWith(
      "Keyframe unavailable",
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("draws every selected keyframe with an approved overlay", async () => {
    installCanvasFactory();
    await composeSwingCardPng(
      content({ keyframes: Array.from({ length: 8 }, (_, index) => keyframe({ phaseLabel: `Phase ${index + 1}` })) })
    );

    expect(createdCanvases[0].context?.drawImage).toHaveBeenCalledTimes(8);
  });

  it("returns null blob failures with unchanged warnings", async () => {
    installCanvasFactoryWithToBlob((callback) => callback(null));
    const warnings = ["METRICS_UNAVAILABLE"] as const;

    const result = await composeSwingCardPng(content({ warnings }));
    expect(result).toEqual({ status: "error", reason: "PNG_NULL_BLOB", warnings });
  });

  it("returns canvas and security failures without mutating warnings", async () => {
    installCanvasFactory(false);
    const warnings = ["KEYFRAME_UNAVAILABLE"] as const;
    await expect(composeSwingCardPng(content({ warnings }))).resolves.toEqual({
      status: "error",
      reason: "CANVAS_UNAVAILABLE",
      warnings
    });

    installCanvasFactoryWithToBlob(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    await expect(composeSwingCardPng(content({ warnings }))).resolves.toEqual({
      status: "error",
      reason: "PNG_SECURITY_ERROR",
      warnings
    });
  });
});

describe("swing card print and downloads", () => {
  it("renders print surface from the same content", () => {
    installCanvasFactory();
    const card = content({
      warnings: ["KEYFRAME_UNAVAILABLE", "METRICS_UNAVAILABLE"],
      analysisPrompt: "Manual prompt text."
    });
    const surface = renderSwingCardPrintSurface(card);
    const text = (surface as unknown as FakeElement).getText();

    expect(surface.querySelectorAll(".swing-card-print__keyframe")).toHaveLength(1);
    expect(text).toContain("keyframes are unavailable");
    expect(text).toContain("Metrics");
    expect(text).toContain("Manual prompt text.");
    expect(surface.querySelectorAll("[data-swing-card-print-section]")).toHaveLength(4);
  });

  it("revokes prior object URLs before creating a new one and removes anchors", () => {
    vi.useFakeTimers();
    (globalThis as typeof globalThis & { window: { setTimeout: typeof setTimeout } }).window.setTimeout = setTimeout;
    const created: string[] = [];
    const revoked: string[] = [];
    vi.spyOn(URL, "createObjectURL").mockImplementation(() => {
      const url = `blob:test-${created.length}`;
      created.push(url);
      return url;
    });
    vi.spyOn(URL, "revokeObjectURL").mockImplementation((url) => {
      revoked.push(url);
    });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);

    triggerSwingCardDownload(new Blob(["one"]), "one.png");
    triggerSwingCardDownload(new Blob(["two"]), "two.png");

    expect(created).toEqual(["blob:test-0", "blob:test-1"]);
    expect(revoked[0]).toBe("blob:test-0");
    expect(click).toHaveBeenCalledTimes(2);
    expect(document.body.querySelectorAll("a[download]")).toHaveLength(0);

    vi.runAllTimers();
    expect(revoked).toContain("blob:test-1");
    vi.useRealTimers();
  });
});
