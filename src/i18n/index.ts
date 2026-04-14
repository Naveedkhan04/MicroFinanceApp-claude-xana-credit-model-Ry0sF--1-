import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { en, type Dict } from "./en";
import { ja } from "./ja";
import type { Lang } from "../types";

/* ------------------------------------------------------------------ */
/* Dictionaries                                                        */
/* ------------------------------------------------------------------ */
export const dictionaries: Record<Lang, Dict> = { en, ja };

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
type KeyPath<T, Prev extends string = ""> = {
  [K in keyof T & string]: T[K] extends object
    ? KeyPath<T[K], `${Prev}${K}.`>
    : `${Prev}${K}`;
}[keyof T & string];

export type TKey = KeyPath<Dict>;

function resolve(dict: unknown, path: string): string {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined),
      dict,
    ) as string;
}

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars || typeof str !== "string") return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */
interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = (typeof window !== "undefined" && window.localStorage.getItem("xana.lang")) as Lang | null;
    return saved === "ja" || saved === "en" ? saved : "en";
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("xana.lang", l);
      document.documentElement.lang = l;
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback<I18nContextValue["t"]>(
    (key, vars) => {
      const dict = dictionaries[lang];
      const value = resolve(dict, key);
      if (typeof value !== "string") {
        // fallback to English
        const fallback = resolve(dictionaries.en, key);
        return typeof fallback === "string" ? interpolate(fallback, vars) : key;
      }
      return interpolate(value, vars);
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return React.createElement(I18nContext.Provider, { value }, children);
};

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                  */
/* ------------------------------------------------------------------ */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  lang: Lang = "en",
): string {
  try {
    return new Intl.NumberFormat(lang === "ja" ? "ja-JP" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatDate(iso: string, lang: Lang = "en"): string {
  try {
    return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatPercent(value: number, lang: Lang = "en"): string {
  return new Intl.NumberFormat(lang === "ja" ? "ja-JP" : "en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
}
