import React from "react";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { FieldRow } from "../../../components/ui/SettingsItems";
import { useI18n } from "../../../i18n";

export const BorrowerSupportPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <PhoneFrame title={t("borrower.profile.support")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-full flex-col pt-2">
        <FieldRow label={t("borrower.profile.supportWhatsapp")} value={t("borrower.profile.supportWhatsappValue")} />
        <FieldRow label={t("borrower.profile.supportEmail")} value={t("borrower.profile.supportEmailValue")} />
        <FieldRow label={t("borrower.profile.supportHours")} value={t("borrower.profile.supportHoursValue")} />

        <div className="mt-auto pt-6 mb-[112px]">
          <PrimaryButton onClick={() => { window.location.href = "tel:+252610000000"; }}>
            {t("borrower.profile.supportCta")}
          </PrimaryButton>
        </div>
      </motion.div>
    </PhoneFrame>
  );
};
