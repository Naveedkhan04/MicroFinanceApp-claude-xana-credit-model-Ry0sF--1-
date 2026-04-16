import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneFrame } from "../components/layout/PhoneFrame";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { Flag } from "../components/ui/Flag";
import { useI18n } from "../i18n";
import type { Lang } from "../types";
import clsx from "../utils/clsx";

const LANG_CHOSEN_KEY = "xana.langChosen";

interface Option {
  value: Lang;
  iso: string;
  labelKey: "selectLanguage.japanese" | "selectLanguage.english";
}

const options: Option[] = [
  { value: "ja", iso: "JP", labelKey: "selectLanguage.japanese" },
  { value: "en", iso: "US", labelKey: "selectLanguage.english" },
];

export const SelectLanguage: React.FC = () => {
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Lang>(lang);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage.getItem(LANG_CHOSEN_KEY) === "1") {
      navigate("/mode", { replace: true });
    }
  }, [navigate]);

  const handleContinue = () => {
    setLang(selected);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANG_CHOSEN_KEY, "1");
    }
    navigate("/mode", { replace: true });
  };

  const continueLabel = t("selectLanguage.continue", {
    language: selected === "ja" ? t("selectLanguage.japanese") : t("selectLanguage.english"),
  });

  return (
    <PhoneFrame bare>
      <div className="flex h-full flex-col px-5 pt-10 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="gold-text text-[26px] font-semibold leading-tight">
            {t("selectLanguage.title")}
          </h1>
          <p className="mt-2 text-[13px] text-text-muted">
            {t("selectLanguage.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-8 flex flex-col gap-3"
        >
          {options.map((opt) => {
            const active = selected === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelected(opt.value)}
                className={clsx(
                  "group flex items-center gap-3 rounded-pill border bg-bg-panel/80 backdrop-blur-md px-5 py-4 text-left transition-all",
                  active
                    ? "border-gold shadow-[0_0_0_1px_rgba(224,176,87,0.45)]"
                    : "border-border-gold/60 hover:border-border-gold",
                )}
              >
                <Flag iso={opt.iso} size={22} />
                <span className="flex-1 text-[15px] font-semibold text-text">
                  {t(opt.labelKey)}
                </span>
                {active && (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-gold">
                    <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                  </svg>
                )}
              </button>
            );
          })}
        </motion.div>

        <div className="mt-auto">
          <PrimaryButton onClick={handleContinue}>{continueLabel}</PrimaryButton>
        </div>
      </div>
    </PhoneFrame>
  );
};
