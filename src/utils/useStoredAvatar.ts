import { useEffect, useState } from "react";

export function useStoredAvatar(storageKey: string): string | null {
  const [src, setSrc] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(storageKey);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) setSrc(e.newValue);
    };
    const onFocus = () => setSrc(window.localStorage.getItem(storageKey));
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [storageKey]);

  return src;
}
