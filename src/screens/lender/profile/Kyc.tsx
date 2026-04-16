import React from "react";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { Card } from "../../../components/ui/Card";
import { StatusChip } from "../../../components/ui/StatusChip";
import { DetailRow } from "../../../components/ui/SettingsItems";
import { useI18n } from "../../../i18n";

export const LenderKycPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <PhoneFrame title={t("lender.profile.kyc")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-4 text-center">
          <div
            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: "#17C27A", boxShadow: "0 0 0 6px #17C27A22" }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8"
              fill="none"
              stroke="white"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>
          <div className="text-[16px] font-semibold text-gold-bright">
            {t("common.kycVerified")}
          </div>
          <div className="mt-1 text-[12.5px] text-text-muted">
            {t("lender.profile.kycTier2")}
          </div>
        </Card>

        <DetailRow
          label="Status"
          value={<StatusChip tone="green">{t("common.kycVerified")}</StatusChip>}
        />
        <DetailRow label={t("lender.profile.kycLevel")} value={t("lender.profile.kycTier2")} />
        <DetailRow label={t("lender.profile.kycVerifiedOn")} value="Apr 12, 2026" />

        <p className="mt-3 px-1 text-[12.5px] leading-snug text-text-muted">
          {t("lender.profile.kycTier2Note")}
        </p>
      </motion.div>
    </PhoneFrame>
  );
};
