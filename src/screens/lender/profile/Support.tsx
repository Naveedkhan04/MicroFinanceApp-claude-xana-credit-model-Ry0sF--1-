import React from "react";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { FieldRow } from "../../../components/ui/SettingsItems";
import { useI18n } from "../../../i18n";

export const LenderSupportPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <PhoneFrame title={t("lender.profile.support")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-full flex-col pt-2">
        <FieldRow label={t("lender.profile.supportEmail")} value={t("lender.profile.supportEmailValue")} />
        <FieldRow label={t("lender.profile.supportHours")} value={t("lender.profile.supportHoursValue")} />
        <FieldRow label={t("lender.profile.supportResponse")} value={t("lender.profile.supportResponseValue")} />

        <div className="mt-auto pt-6 mb-[100px]">
          <PrimaryButton onClick={() => { window.location.href = "mailto:support@xana.app"; }}>
            {t("lender.profile.supportCta")}
          </PrimaryButton>
        </div>
      </motion.div>
    </PhoneFrame>
  );
};
