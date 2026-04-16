import React from "react";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { DetailRow } from "../../../components/ui/SettingsItems";
import { useI18n } from "../../../i18n";

export const LenderSupportPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <PhoneFrame title={t("lender.profile.support")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <DetailRow label={t("lender.profile.supportEmail")} value={t("lender.profile.supportEmailValue")} />
        <DetailRow label={t("lender.profile.supportHours")} value={t("lender.profile.supportHoursValue")} />
        <DetailRow label={t("lender.profile.supportResponse")} value={t("lender.profile.supportResponseValue")} />

        <div className="mt-6">
          <PrimaryButton onClick={() => { window.location.href = "mailto:support@xana.app"; }}>
            {t("lender.profile.supportCta")}
          </PrimaryButton>
        </div>
      </motion.div>
    </PhoneFrame>
  );
};
