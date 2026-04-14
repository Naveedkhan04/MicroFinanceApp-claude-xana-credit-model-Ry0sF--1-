import React from "react";
import { useI18n } from "../../i18n";
import clsx from "../../utils/clsx";
import type { Lang } from "../../types";

interface Props {
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<Props> = ({ compact = true }) => {
  const { lang, setLang } = useI18n();

  const options: { value: Lang; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "ja", label: "日本" },
  ];

  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-pill border border-border-gold bg-bg-panel/80 backdrop-blur p-1",
        compact ? "text-[11px]" : "text-[13px]",
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setLang(opt.value)}
          className={clsx(
            "rounded-pill px-3 py-1 font-semibold transition-colors",
            lang === opt.value
              ? "bg-gold text-[#3B2608]"
              : "text-text-muted hover:text-gold",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
