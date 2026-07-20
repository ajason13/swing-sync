export interface ConsentStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface SafetyConsentStore {
  hasSafetyConsent(): boolean;
  setSafetyConsent(accepted: boolean): void;
}

export const consentStorageKey = "swing-sync:safety-consent:v1";

export function createSafetyConsentStore(storage: ConsentStorage = window.localStorage): SafetyConsentStore {
  let storageFailed = false;

  return {
    hasSafetyConsent: () => {
      if (storageFailed) return false;

      try {
        return storage.getItem(consentStorageKey) === "accepted";
      } catch {
        storageFailed = true;
        return false;
      }
    },
    setSafetyConsent: (accepted: boolean) => {
      try {
        if (accepted) {
          storage.setItem(consentStorageKey, "accepted");
          return;
        }
        storage.removeItem(consentStorageKey);
      } catch {
        storageFailed = true;
      }
    }
  };
}
