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

export function createSafetyConsentStore(storage?: ConsentStorage): SafetyConsentStore {
  let storageFailed = false;
  try {
    // Accessing the browser storage property can itself throw when storage is denied.
    storage ??= window.localStorage;
  } catch {
    storageFailed = true;
  }

  return {
    hasSafetyConsent: () => {
      if (storageFailed || !storage) return false;

      try {
        return storage.getItem(consentStorageKey) === "accepted";
      } catch {
        storageFailed = true;
        return false;
      }
    },
    setSafetyConsent: (accepted: boolean) => {
      if (storageFailed || !storage) return;
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
      if (storageFailed || !storage) return "blocked";

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
