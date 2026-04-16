import React, { useState } from "react";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { ToggleRow } from "../../../components/ui/SettingsItems";
import { useI18n } from "../../../i18n";

export const LenderNotificationsPage: React.FC = () => {
  const { t } = useI18n();
  const [notif, setNotif] = useState({ deposits: true, earnings: true, product: false });

  return (
    <PhoneFrame title={t("lender.profile.notifications")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="mb-4 px-1 text-[13px] text-text-muted">
          {t("lender.profile.notifHint")}
        </p>
        <ToggleRow
          label={t("lender.profile.notifDeposit")}
          checked={notif.deposits}
          onChange={(v) => setNotif({ ...notif, deposits: v })}
        />
        <ToggleRow
          label={t("lender.profile.notifEarnings")}
          checked={notif.earnings}
          onChange={(v) => setNotif({ ...notif, earnings: v })}
        />
        <ToggleRow
          label={t("lender.profile.notifProduct")}
          checked={notif.product}
          onChange={(v) => setNotif({ ...notif, product: v })}
        />
      </motion.div>
    </PhoneFrame>
  );
};
