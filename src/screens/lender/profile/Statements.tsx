import React from "react";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { SectionLabel } from "../../../components/ui/SectionLabel";
import { useI18n } from "../../../i18n";
import { useApp } from "../../../context/AppContext";

const MONTHS = ["March 2026", "February 2026", "January 2026", "December 2025", "November 2025", "October 2025"];

export const LenderStatementsPage: React.FC = () => {
  const { t } = useI18n();
  const { pushToast } = useApp();

  return (
    <PhoneFrame title={t("lender.profile.statements")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <SectionLabel>{t("lender.profile.statementsHeader")}</SectionLabel>
        {MONTHS.map((m) => (
          <button
            key={m}
            onClick={() => pushToast(t("lender.profile.statementsDownload", { month: m }), "success")}
            className="mb-2 flex w-full items-center justify-between rounded-pill border border-border-gold bg-bg-panel/60 px-5 py-3 text-left text-[14px] font-semibold text-gold-bright transition-colors hover:bg-bg-panel/80"
          >
            <span>{m}</span>
            <span className="flex items-center gap-2 text-[12.5px] text-text-muted">
              PDF
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" />
              </svg>
            </span>
          </button>
        ))}
      </motion.div>
    </PhoneFrame>
  );
};
