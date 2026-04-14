import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Mode } from "../types";

interface Toast {
  id: number;
  message: string;
  tone: "default" | "success" | "error";
}

interface AppContextValue {
  mode: Mode | null;
  setMode: (m: Mode | null) => void;
  authed: boolean;
  setAuthed: (a: boolean) => void;
  toasts: Toast[];
  pushToast: (message: string, tone?: Toast["tone"]) => void;
  dismissToast: (id: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<Mode | null>(() => {
    const v = typeof window !== "undefined" ? window.localStorage.getItem("xana.mode") : null;
    return v === "lender" || v === "borrower" ? v : null;
  });
  const [authed, setAuthed] = useState<boolean>(() => {
    return typeof window !== "undefined"
      ? window.localStorage.getItem("xana.authed") === "1"
      : false;
  });
  const [toasts, setToasts] = useState<Toast[]>([]);

  const setMode = useCallback((m: Mode | null) => {
    setModeState(m);
    if (typeof window !== "undefined") {
      if (m) window.localStorage.setItem("xana.mode", m);
      else window.localStorage.removeItem("xana.mode");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("xana.authed", authed ? "1" : "0");
    }
  }, [authed]);

  const pushToast = useCallback((message: string, tone: Toast["tone"] = "default") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2500);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({ mode, setMode, authed, setAuthed, toasts, pushToast, dismissToast }),
    [mode, setMode, authed, toasts, pushToast, dismissToast],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
