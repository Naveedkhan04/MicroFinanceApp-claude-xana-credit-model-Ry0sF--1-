import React from "react";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { ActionItem } from "../../../components/ui/SettingsItems";
import { useI18n } from "../../../i18n";
import { useApp } from "../../../context/AppContext";

export const LenderSecurityPage: React.FC = () => {
  const { t } = useI18n();
  const { pushToast } = useApp();

  return (
    <PhoneFrame title={t("lender.profile.security")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <ActionItem
          label={t("lender.profile.secChangePw")}
          onClick={() => pushToast(t("lender.profile.secResetSent"), "success")}
        />
        <ActionItem
          label={t("lender.profile.secTwoFA")}
          value={t("lender.profile.sec2FAOn")}
          onClick={() => pushToast(t("lender.profile.sec2FAMsg"), "default")}
        />
        <ActionItem
          label={t("lender.profile.secSessions")}
          value={t("lender.profile.secThisDevice")}
          onClick={() => pushToast(t("lender.profile.secSessionsMsg"), "default")}
        />
      </motion.div>
    </PhoneFrame>
  );
};
