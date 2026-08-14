export interface ConsentStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface SafetyConsentStore {
  hasSafetyConsent(): boolean;
  setSafetyConsent(accepted: boolean): void;
  clearAppLocalData(): ClearAppLocalDataResult;
}

export const consentStorageKey = "swing-sync:safety-consent:v1";
export const appLocalStorageKeys = [consentStorageKey] as const;

export type ClearAppLocalDataResult = "cleared" | "blocked";

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
      if (storageFailed) return;
      try {
        if (accepted) {
          storage.setItem(consentStorageKey, "accepted");
          return;
        }
        storage.removeItem(consentStorageKey);
      } catch {
        storageFailed = true;
      }
    },
    clearAppLocalData: () => {
      if (storageFailed) return "blocked";

      let blocked = false;
      try {
        for (const key of appLocalStorageKeys) {
          try {
            storage.removeItem(key);
          } catch {
            blocked = true;
          }
        }
        for (const key of appLocalStorageKeys) {
          try {
            if (storage.getItem(key) !== null) blocked = true;
          } catch {
            blocked = true;
          }
        }
      } catch {
        blocked = true;
      }

      if (!blocked) return "cleared";
      storageFailed = true;
      return "blocked";
    }
  };
}
