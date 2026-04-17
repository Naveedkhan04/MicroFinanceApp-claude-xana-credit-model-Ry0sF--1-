import React from "react";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { Flag } from "../../../components/ui/Flag";
import { useI18n } from "../../../i18n";
import type { Lang } from "../../../types";
import clsx from "../../../utils/clsx";

interface Option {
  value: Lang;
  iso: string;
  label: string;
}

export const LenderLanguagePage: React.FC = () => {
  const { t, lang, setLang } = useI18n();

  const options: Option[] = [
    { value: "en", iso: "US", label: t("selectLanguage.english") },
    { value: "ja", iso: "JP", label: t("selectLanguage.japanese") },
  ];

  return (
    <PhoneFrame title={t("languageSwitcher.label")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
        <div className="mb-1.5 pl-2 text-[12.5px] text-text-muted">
          {t("selectLanguage.title")}
        </div>
        <div className="flex flex-col gap-3">
          {options.map((opt) => {
            const active = lang === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setLang(opt.value)}
                className={clsx(
                  "flex items-center gap-3 rounded-pill bg-bg-panel/80 px-5 py-4 text-left backdrop-blur-md transition-all",
                  active
                    ? "border-gold shadow-[0_0_0_1px_rgba(224,176,87,0.45)]"
                    : "border-border-gold/60 hover:border-border-gold",
                )}
              >
                <Flag iso={opt.iso} size={22} />
                <span className="flex-1 text-[15px] font-semibold text-text">{opt.label}</span>
                {active && (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-gold">
                    <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </PhoneFrame>
  );
};
