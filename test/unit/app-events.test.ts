import { describe, expect, it, vi } from "vitest";
import { bindAppEvents } from "../../src/app-events";
import { createInitialAppState } from "../../src/app-state";
import type { SafetyConsentStore } from "../../src/consent-state";

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

describe("app event binding", () => {
  it("binds fresh DOM after repeated renders without duplicate effects", () => {
    const requestRender = vi.fn();
    const consent: SafetyConsentStore = {
      hasSafetyConsent: () => false,
      setSafetyConsent: () => undefined
    };
    const dependencies = {
      state: createInitialAppState(),
      consent,
      lifecycle: {} as never,
      requestRender
    };

    const firstButton = new FakeButton();
    bindAppEvents(new FakeRoot(firstButton) as unknown as ParentNode, dependencies);
    firstButton.click();
    expect(requestRender).toHaveBeenCalledTimes(1);

    const secondButton = new FakeButton();
    bindAppEvents(new FakeRoot(secondButton) as unknown as ParentNode, dependencies);
    secondButton.click();
    expect(requestRender).toHaveBeenCalledTimes(2);
  });
});
