import React from "react";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { FieldRow } from "../../../components/ui/SettingsItems";
import { useI18n } from "../../../i18n";
import { useApp } from "../../../context/AppContext";

export const LenderSecurityPage: React.FC = () => {
  const { t } = useI18n();
  const { pushToast } = useApp();

  return (
    <PhoneFrame title={t("lender.profile.security")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
        <FieldRow
          label={t("lender.profile.secChangePw")}
          value="••••••••"
          action={{
            label: "Change",
            onClick: () => pushToast(t("lender.profile.secResetSent"), "success"),
          }}
        />
        <FieldRow
          label={t("lender.profile.secTwoFA")}
          value={t("lender.profile.sec2FAOn")}
          action={{
            label: "Manage",
            onClick: () => pushToast(t("lender.profile.sec2FAMsg"), "default"),
          }}
        />
        <FieldRow
          label={t("lender.profile.secSessions")}
          value={t("lender.profile.secThisDevice")}
          action={{
            label: "View",
            onClick: () => pushToast(t("lender.profile.secSessionsMsg"), "default"),
          }}
        />
      </motion.div>
    </PhoneFrame>
  );
};
