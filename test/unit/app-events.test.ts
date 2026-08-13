import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { bindAppEvents } from "../../src/app-events";
import {
  completeProcessingWithOutputs,
  createInitialAppState,
  rebuildPhaseReviewState,
  setPhaseDeclaration
} from "../../src/app-state";
import type { SafetyConsentStore } from "../../src/consent-state";
import { poseThresholds } from "../../src/pose-contract";

class FakeButton {
  private listeners: (() => void)[] = [];

  addEventListener(_event: "click", listener: () => void): void {
    this.listeners.push(listener);
  }

  click(): void {
    for (const listener of this.listeners) listener();
  }
}

class FakeRoot {
  constructor(private readonly button: FakeButton) {}

  querySelector(selector: string) {
    return selector === "[data-placeholder-action='camera']" ? this.button : null;
  }

  querySelectorAll() {
    return [];
  }
}

class EventTargetStub {
  dataset: Record<string, string> = {};
  files?: File[];
  checked = false;
  value = "";
  private readonly listeners = new Map<string, ((event: { currentTarget: EventTargetStub }) => unknown)[]>();
  addEventListener(name: string, listener: (event: { currentTarget: EventTargetStub }) => unknown): void {
    this.listeners.set(name, [...(this.listeners.get(name) ?? []), listener]);
  }
  click(): void { void this.dispatch("click"); }
  async dispatch(name: string): Promise<void> {
    await Promise.all((this.listeners.get(name) ?? []).map((listener) => listener({ currentTarget: this })));
  }
}

class MapRoot {
  constructor(
    readonly singles: Record<string, EventTargetStub> = {},
    readonly lists: Record<string, EventTargetStub[]> = {}
  ) {}
  querySelector(selector: string): EventTargetStub | null { return this.singles[selector] ?? null; }
  querySelectorAll(selector: string): EventTargetStub[] { return this.lists[selector] ?? []; }
}

class PickerRoot {
  readonly picker = new EventTargetStub();
  readonly input = new EventTargetStub();
  querySelector(selector: string): EventTargetStub | null {
    if (selector === "[data-video-picker]") return this.picker;
    if (selector === "#video-file") return this.input;
    return null;
  }
  querySelectorAll(): EventTargetStub[] { return []; }
}

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => { resolve = done; });
  return { promise, resolve };
}

describe("app event binding", () => {
  it("binds fresh DOM after repeated renders without duplicate effects", () => {
    const requestRender = vi.fn();
    const consent: SafetyConsentStore = {
      hasSafetyConsent: () => false,
      setSafetyConsent: () => undefined,
      clearAppLocalData: () => "blocked"
    };
    const dependencies = {
      state: createInitialAppState(),
      consent,
      lifecycle: {} as never,
      requestRender,
      applyAccessibilityIntent: vi.fn()
    };

    const firstButton = new FakeButton();
    bindAppEvents(new FakeRoot(firstButton) as unknown as ParentNode, dependencies);
    firstButton.click();
    expect(requestRender).toHaveBeenCalledTimes(1);
    expect(requestRender).toHaveBeenLastCalledWith({
      focusKey: "camera-placeholder",
      visibleStatusText: "Camera capture remains out of scope. Choose a local video file.",
      announcement: "Camera capture remains out of scope. Choose a local video file."
    });

    const secondButton = new FakeButton();
    bindAppEvents(new FakeRoot(secondButton) as unknown as ParentNode, dependencies);
    secondButton.click();
    expect(requestRender).toHaveBeenCalledTimes(2);
  });

  it("uses exactly one announcement channel for every mapped event", () => {
    const events = readFileSync("src/app-events.ts", "utf8");
    const lifecycle = readFileSync("src/analysis-lifecycle.ts", "utf8");
    const actions = readFileSync("src/swing-card-actions.ts", "utf8");
    const main = readFileSync("src/main.ts", "utf8");
    const eventRenderCalls = events.split("\n").filter((line) => line.trim().startsWith("requestRender(")).map((line) => line.trim());
    const eventIntentCalls = events.split("\n").filter((line) => line.includes("applyAccessibilityIntent({"));
    const eventRenderOwners = [
      ["dependency contract", "requestRender(request?: RenderRequest): void;"],
      ["consent change", 'requestRender({ focusKey: "safety-consent", announcement: message });'],
      ["clear local data", 'requestRender({ focusKey: "safety-consent", visibleStatusText: message, announcement: message });'],
      ["consent guard", 'requestRender({ focusKey: "safety-consent", visibleStatusText: message, announcement: message });'],
      ["video guard", 'requestRender({ focusKey: "video-picker", visibleStatusText: message, announcement: message });'],
      ["begin accepted", 'requestRender({ focusKey: "stage-heading", visibleStatusText: message, announcement: message });'],
      ["workflow step", 'requestRender({ focusKey: "stage-heading", visibleStatusText: message, announcement: message });'],
      ["next step", 'requestRender({ focusKey: "stage-heading", visibleStatusText: message, announcement: message });'],
      ["picker success", 'requestRender({ focusKey: "video-picker", visibleStatusText: message, announcement: message });'],
      ["camera", 'requestRender({ focusKey: "camera-placeholder", visibleStatusText: message, announcement: message });'],
      ["review entry", 'requestRender({ focusKey: "phase-review-heading", visibleStatusText: message, announcement: message });'],
      ["view declaration", 'requestRender(phaseRenderRequest("phase-declaration:view", before, state));'],
      ["handedness declaration", 'requestRender(phaseRenderRequest("phase-declaration:handedness", before, state));'],
      ["mirrored declaration", 'requestRender(phaseRenderRequest("phase-declaration:mirrored", before, state));'],
      ["setup declaration", 'requestRender(phaseRenderRequest("phase-setup", before, state));'],
      ["phase assignment", 'requestRender({ focusKey: `phase-assignment:${Number(select.dataset.phaseIndex)}` as RenderRequest["focusKey"] });'],
      ["confirmation choice", 'requestRender({ focusKey: "phase-confirmation" });'],
      ["confirm review", "requestRender({"],
      ["open export", 'requestRender({ focusKey: "swing-card-heading", visibleStatusText: message, announcement: message });'],
      ["keyframe selection", 'requestRender({ focusKey: `keyframe:${Number(button.dataset.keyframeIndex)}` as RenderRequest["focusKey"] });']
    ] as const;
    expect(eventRenderCalls).toHaveLength(eventRenderOwners.length);
    eventRenderOwners.forEach(([owner, expected], index) => expect(eventRenderCalls[index], owner).toBe(expected));
    expect(eventIntentCalls).toHaveLength(3);
    expect(lifecycle.match(/this\.options\.requestRender\(/g)).toHaveLength(1);
    expect(lifecycle.match(/this\.options\.applyAccessibilityIntent\(/g)).toHaveLength(2);
    expect(actions.match(/requestRender\(/g)).toHaveLength(6);
    expect(main.match(/^requestRender\(\);$/gm)).toHaveLength(1);
    expect(main.match(/lifecycle\.closeActive\(\)/g)).toHaveLength(1);

    const mappedCallsites = [
      ["consent", 'focusKey: "safety-consent", announcement: message'],
      ["clear local data", 'clearAppLocalData?.() === "cleared"'],
      ["consent guard", 'focusKey: "safety-consent", visibleStatusText: message'],
      ["video guard", 'focusKey: "video-picker", visibleStatusText: message'],
      ["begin", 'focusKey: "stage-heading", visibleStatusText: message'],
      ["workflow", 'getWorkflowStep(state.activeStep).label} opened.'],
      ["next", 'getNextWorkflowStep(state.activeStep).id'],
      ["picker success", 'Local video selected. It has not been analyzed or persisted.'],
      ["picker cancel", 'addEventListener("cancel", () => applyAccessibilityIntent'],
      ["picker focus", 'addEventListener("focus", () => applyAccessibilityIntent'],
      ["picker focusin", 'addEventListener("focusin", () => applyAccessibilityIntent'],
      ["camera", 'focusKey: "camera-placeholder"'],
      ["review entry", 'focusKey: "phase-review-heading", visibleStatusText: message'],
      ["view declaration", 'phaseRenderRequest("phase-declaration:view"'],
      ["handedness declaration", 'phaseRenderRequest("phase-declaration:handedness"'],
      ["mirrored declaration", 'phaseRenderRequest("phase-declaration:mirrored"'],
      ["setup", 'phaseRenderRequest("phase-setup"'],
      ["assignment", 'focusKey: `phase-assignment:'],
      ["confirmation choice", 'focusKey: "phase-confirmation"'],
      ["confirm", 'Phase review could not be confirmed.'],
      ["export", 'focusKey: "swing-card-heading"'],
      ["keyframe scoped", 'focusKey: `keyframe:'],
      ["stop global", 'Local analysis stopped and volatile resources were released.'],
      ["retry no render", 'applyAccessibilityIntent({ focusKey: "stage-heading" })'],
      ["terminal scoped", '(state === "completed" || state === "failed")'],
      ["close silent", 'async closeActive(): Promise<void>'],
      ["download preparing/results", 'focusKey: "swing-card-download"'],
      ["print preparing/results", 'focusKey: "swing-card-print"'],
      ["copy preparing/results", 'focusKey: "swing-card-copy"'],
      ["initial render", 'requestRender();'],
      ["beforeunload", 'void lifecycle.closeActive();']
    ] as const;
    const allSources = `${events}\n${lifecycle}\n${actions}\n${main}`;
    for (const [owner, needle] of mappedCallsites) expect(allSources, owner).toContain(needle);
    expect(actions.match(/announcement: state\.swingCardStatus/g)).toHaveLength(6);
    expect(lifecycle).not.toContain("announcement: processingStatusText");
    expect(events).not.toContain("announceOverlayStatus");
  });

  it("returns focus to the picker after successful keyboard-opened selection", async () => {
    const root = new PickerRoot();
    const state = createInitialAppState();
    const gate = deferred();
    const requestRender = vi.fn();
    root.input.files = [new File(["video"], "swing.mp4", { type: "video/mp4" })];
    bindAppEvents(root as unknown as ParentNode, {
      state,
      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
      lifecycle: { closeActive: () => gate.promise } as never,
      requestRender,
      applyAccessibilityIntent: vi.fn()
    });
    const changing = root.input.dispatch("change");
    expect(requestRender).not.toHaveBeenCalled();
    gate.resolve();
    await changing;
    expect(requestRender).toHaveBeenCalledOnce();
    expect(requestRender).toHaveBeenCalledWith(expect.objectContaining({ focusKey: "video-picker" }));
  });

  it("clears persistent and volatile app state with one sanitized status, including blocked storage", async () => {
    for (const [result, expected] of [
      ["cleared", "Local Swing Sync user state was cleared in this browser."],
      ["blocked", "Swing Sync could not clear all local app data in this browser."]
    ] as const) {
      const clearControl = new EventTargetStub();
      const state = createInitialAppState();
      state.selectedVideo = new File(["video"], "swing.mp4", { type: "video/mp4" });
      const closeActive = vi.fn(async () => undefined);
      const clearAppLocalData = vi.fn(() => result);
      const requestRender = vi.fn();
      bindAppEvents(new MapRoot({ "#clear-local-data": clearControl }) as unknown as ParentNode, {
        state,
        consent: { hasSafetyConsent: () => result === "cleared", setSafetyConsent: () => undefined, clearAppLocalData },
        lifecycle: { closeActive } as never,
        requestRender,
        applyAccessibilityIntent: vi.fn()
      });

      await clearControl.dispatch("click");

      expect(closeActive).toHaveBeenCalledOnce();
      expect(clearAppLocalData).toHaveBeenCalledOnce();
      expect(state.selectedVideo).toBeUndefined();
      expect(state.activeStep).toBe("capture");
      expect(requestRender).toHaveBeenCalledWith(expect.objectContaining({
        focusKey: "safety-consent",
        visibleStatusText: expect.stringContaining(expected),
        announcement: expect.stringContaining(expected)
      }));
    }
  });

  it("returns focus to the picker on native chooser cancel without rendering", async () => {
    const root = new PickerRoot();
    const requestRender = vi.fn();
    const applyAccessibilityIntent = vi.fn();
    bindAppEvents(root as unknown as ParentNode, {
      state: createInitialAppState(),
      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
      lifecycle: { closeActive: vi.fn() } as never,
      requestRender,
      applyAccessibilityIntent
    });
    await root.input.dispatch("cancel");
    expect(requestRender).not.toHaveBeenCalled();
    expect(applyAccessibilityIntent).toHaveBeenCalledWith({ focusKey: "video-picker" });
  });

  it("redirects hidden file input focus to the picker without positive tabindex", async () => {
    const root = new PickerRoot();
    const applyAccessibilityIntent = vi.fn();
    bindAppEvents(root as unknown as ParentNode, {
      state: createInitialAppState(),
      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
      lifecycle: {} as never,
      requestRender: vi.fn(),
      applyAccessibilityIntent
    });
    await root.input.dispatch("focus");
    expect(applyAccessibilityIntent).toHaveBeenCalledWith({ focusKey: "video-picker" });
  });

  it("awaits closeActive before rendering workflow navigation exactly once", async () => {
    const button = new EventTargetStub();
    button.dataset.step = "capture";
    const root = {
      querySelector: () => null,
      querySelectorAll: (selector: string) => selector === "[data-step]" ? [button] : []
    };
    const state = createInitialAppState();
    state.activeStep = "processing";
    state.processingState = "processing";
    const gate = deferred();
    const requestRender = vi.fn();
    bindAppEvents(root as unknown as ParentNode, {
      state,
      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
      lifecycle: { closeActive: () => gate.promise } as never,
      requestRender,
      applyAccessibilityIntent: vi.fn()
    });
    const navigating = button.dispatch("click");
    expect(requestRender).not.toHaveBeenCalled();
    gate.resolve();
    await navigating;
    expect(requestRender).toHaveBeenCalledOnce();
    expect(requestRender).toHaveBeenCalledWith(expect.objectContaining({ focusKey: "stage-heading" }));
  });

  it("awaits closeActive before selecting a replacement video and renders exactly once", async () => {
    const root = new PickerRoot();
    const state = createInitialAppState();
    const gate = deferred();
    const requestRender = vi.fn();
    root.input.files = [new File(["replacement"], "replacement.mp4", { type: "video/mp4" })];
    bindAppEvents(root as unknown as ParentNode, {
      state,
      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
      lifecycle: { closeActive: () => gate.promise } as never,
      requestRender,
      applyAccessibilityIntent: vi.fn()
    });
    const selecting = root.input.dispatch("change");
    expect(state.selectedVideo).toBeUndefined();
    gate.resolve();
    await selecting;
    expect(state.selectedVideo?.name).toBe("replacement.mp4");
    expect(requestRender).toHaveBeenCalledOnce();
  });

  it("lets navigation and picker callers own exactly one destination render", async () => {
    const navigationButton = new EventTargetStub();
    navigationButton.dataset.step = "capture";
    const navigationRender = vi.fn();
    const navigationState = createInitialAppState();
    navigationState.activeStep = "processing";
    navigationState.processingState = "processing";
    bindAppEvents({
      querySelector: () => null,
      querySelectorAll: (selector: string) => selector === "[data-step]" ? [navigationButton] : []
    } as unknown as ParentNode, {
      state: navigationState,
      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
      lifecycle: { closeActive: vi.fn() } as never,
      requestRender: navigationRender,
      applyAccessibilityIntent: vi.fn()
    });
    await navigationButton.dispatch("click");
    expect(navigationRender).toHaveBeenCalledOnce();

    const pickerRoot = new PickerRoot();
    pickerRoot.input.files = [new File(["replacement"], "replacement.mp4", { type: "video/mp4" })];
    const pickerRender = vi.fn();
    bindAppEvents(pickerRoot as unknown as ParentNode, {
      state: createInitialAppState(),
      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
      lifecycle: { closeActive: vi.fn() } as never,
      requestRender: pickerRender,
      applyAccessibilityIntent: vi.fn()
    });
    await pickerRoot.input.dispatch("change");
    expect(pickerRender).toHaveBeenCalledOnce();
  });

  it("executes typed consent guard begin workflow review declaration confirmation export and keyframe intents", async () => {
    const consentControl = new EventTargetStub();
    consentControl.checked = true;
    let consentAccepted = false;
    const consentRender = vi.fn();
    bindAppEvents(new MapRoot({ "#safety-consent": consentControl }) as unknown as ParentNode, {
      state: createInitialAppState(),
      consent: {
        hasSafetyConsent: () => consentAccepted,
        setSafetyConsent: (value) => { consentAccepted = value; }
      },
      lifecycle: {} as never,
      requestRender: consentRender,
      applyAccessibilityIntent: vi.fn()
    });
    await consentControl.dispatch("change");
    expect(consentRender).toHaveBeenCalledWith({
      focusKey: "safety-consent",
      announcement: "Safety acknowledgement recorded locally."
    });

    for (const guard of ["consent", "video"] as const) {
      const begin = new EventTargetStub();
      const requestRender = vi.fn();
      bindAppEvents(new MapRoot({ "#analysis-button": begin }) as unknown as ParentNode, {
        state: createInitialAppState(),
        consent: { hasSafetyConsent: () => guard === "video", setSafetyConsent: () => undefined },
        lifecycle: {} as never,
        requestRender,
        applyAccessibilityIntent: vi.fn()
      });
      await begin.dispatch("click");
      expect(requestRender).toHaveBeenCalledWith(expect.objectContaining({
        focusKey: guard === "consent" ? "safety-consent" : "video-picker",
        announcement: expect.any(String)
      }));
    }

    const begin = new EventTargetStub();
    const beginState = createInitialAppState();
    beginState.selectedVideo = new File(["video"], "swing.mp4", { type: "video/mp4" });
    const beginRender = vi.fn();
    const startActive = vi.fn();
    bindAppEvents(new MapRoot({ "#analysis-button": begin }) as unknown as ParentNode, {
      state: beginState,
      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
      lifecycle: { startActive } as never,
      requestRender: beginRender,
      applyAccessibilityIntent: vi.fn()
    });
    await begin.dispatch("click");
    expect(beginRender).toHaveBeenCalledWith(expect.objectContaining({ focusKey: "stage-heading", announcement: expect.any(String) }));
    expect(startActive).toHaveBeenCalledOnce();

    for (const selector of ["[data-next-step]", "[data-review-phases]", "[data-open-export]"] as const) {
      const control = new EventTargetStub();
      const state = createInitialAppState();
      if (selector === "[data-review-phases]") state.activeStep = "processing";
      const requestRender = vi.fn();
      bindAppEvents(new MapRoot({ [selector]: control }) as unknown as ParentNode, {
        state,
        consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
        lifecycle: {} as never,
        requestRender,
        applyAccessibilityIntent: vi.fn()
      });
      await control.dispatch("click");
      expect(requestRender).toHaveBeenCalledWith(expect.objectContaining({
        focusKey: selector === "[data-review-phases]"
          ? "phase-review-heading"
          : selector === "[data-open-export]"
            ? "swing-card-heading"
            : "stage-heading"
      }));
    }

    const phaseState = createInitialAppState();
    completeProcessingWithOutputs(phaseState, {
      getOutputs: () => Array.from({ length: 8 }, (_, index) => {
        const landmarks = Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5, z: 0, visibility: 1 }));
        return {
          runGeneration: 1,
          index,
          requestedTimestampMs: index * 100,
          observedSeekTimestampMs: index * 100,
          preview: { close: () => undefined },
          pose: { timestampMs: index * 100, landmarks: [landmarks], worldLandmarks: [landmarks], thresholds: poseThresholds }
        };
      }) as never
    });
    setPhaseDeclaration(phaseState, "handedness", "right");
    setPhaseDeclaration(phaseState, "mirrored", "no");
    setPhaseDeclaration(phaseState, "setup", "confirmed");
    rebuildPhaseReviewState(phaseState);
    const view = new EventTargetStub();
    view.value = "face-on";
    const handedness = new EventTargetStub();
    handedness.value = "left";
    const mirrored = new EventTargetStub();
    mirrored.value = "yes";
    const setup = new EventTargetStub();
    setup.checked = true;
    const assignment = new EventTargetStub();
    assignment.dataset.phaseIndex = "0";
    assignment.value = "0";
    const confirmation = new EventTargetStub();
    const confirm = new EventTargetStub();
    const keyframe = new EventTargetStub();
    keyframe.dataset.keyframeIndex = "2";
    const phaseRender = vi.fn();
    const phaseIntent = vi.fn();
    bindAppEvents(new MapRoot(
      {
        "#phase-view": view,
        "#phase-handedness": handedness,
        "#phase-mirrored": mirrored,
        "#phase-setup": setup,
        "#phase-confirmation": confirmation,
        "[data-confirm-phase-review]": confirm
      },
      { "[data-phase-index]": [assignment], "[data-keyframe-index]": [keyframe] }
    ) as unknown as ParentNode, {
      state: phaseState,
      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
      lifecycle: {} as never,
      requestRender: phaseRender,
      applyAccessibilityIntent: phaseIntent
    });
    await view.dispatch("change");
    expect(phaseRender).toHaveBeenLastCalledWith({
      focusKey: "phase-declaration:view",
      visibleStatusText: "Swing phase suggestions are ready for review.",
      announcement: "Swing phase suggestions are ready for review."
    });
    await view.dispatch("change");
    expect(phaseRender).toHaveBeenLastCalledWith({ focusKey: "phase-declaration:view" });
    await handedness.dispatch("change");
    expect(phaseRender).toHaveBeenLastCalledWith({ focusKey: "phase-declaration:handedness" });
    await mirrored.dispatch("change");
    expect(phaseRender).toHaveBeenLastCalledWith({ focusKey: "phase-declaration:mirrored" });
    await setup.dispatch("change");
    expect(phaseRender).toHaveBeenLastCalledWith({ focusKey: "phase-setup" });
    await assignment.dispatch("change");
    expect(phaseRender).toHaveBeenLastCalledWith({ focusKey: "phase-assignment:0" });
    await confirmation.dispatch("change");
    expect(phaseRender).toHaveBeenLastCalledWith({ focusKey: "phase-confirmation" });
    await confirm.dispatch("click");
    expect(phaseRender).toHaveBeenLastCalledWith({
      focusKey: "phase-review-heading",
      visibleStatusText: "Phase review could not be confirmed.",
      announcement: "Phase review could not be confirmed."
    });
    expect(phaseIntent).not.toHaveBeenCalled();
    await keyframe.dispatch("click");
    expect(phaseRender).toHaveBeenLastCalledWith({ focusKey: "keyframe:2" });
  });
});
