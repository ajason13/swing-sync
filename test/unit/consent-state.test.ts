import { describe, expect, it } from "vitest";
import { consentStorageKey, createSafetyConsentStore, type ConsentStorage } from "../../src/consent-state";

function storage(initial?: string): ConsentStorage & { values: Map<string, string> } {
  const values = new Map<string, string>();
  if (initial) values.set(consentStorageKey, initial);
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    }
  };
}

describe("safety consent storage", () => {
  it("reads accepted and missing local acknowledgement state", () => {
    expect(createSafetyConsentStore(storage("accepted")).hasSafetyConsent()).toBe(true);
    expect(createSafetyConsentStore(storage()).hasSafetyConsent()).toBe(false);
  });

  it("stores and removes only the accepted acknowledgement value", () => {
    const fakeStorage = storage();
    const consent = createSafetyConsentStore(fakeStorage);

    consent.setSafetyConsent(true);
    expect(fakeStorage.values.get(consentStorageKey)).toBe("accepted");
    expect(consent.hasSafetyConsent()).toBe(true);

    consent.setSafetyConsent(false);
    expect(fakeStorage.values.has(consentStorageKey)).toBe(false);
    expect(consent.hasSafetyConsent()).toBe(false);
  });

  it("fails closed when reading local acknowledgement throws", () => {
    const consent = createSafetyConsentStore({
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => undefined,
      removeItem: () => undefined
    });

    expect(consent.hasSafetyConsent()).toBe(false);
    expect(consent.hasSafetyConsent()).toBe(false);
  });

  it("fails closed through the public query after set or remove failures", () => {
    const setFailure = createSafetyConsentStore({
      getItem: () => "accepted",
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => undefined
    });
    setFailure.setSafetyConsent(true);
    expect(setFailure.hasSafetyConsent()).toBe(false);

    const removeFailure = createSafetyConsentStore({
      getItem: () => "accepted",
      setItem: () => undefined,
      removeItem: () => {
        throw new Error("blocked");
      }
    });
    removeFailure.setSafetyConsent(false);
    expect(removeFailure.hasSafetyConsent()).toBe(false);
  });
});
