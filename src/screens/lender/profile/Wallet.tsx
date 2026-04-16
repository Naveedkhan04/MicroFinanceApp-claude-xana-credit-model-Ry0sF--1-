import React from "react";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { Card } from "../../../components/ui/Card";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { DetailRow } from "../../../components/ui/SettingsItems";
import { lenderProfile } from "../../../data/mockData";
import { useI18n } from "../../../i18n";
import { useApp } from "../../../context/AppContext";

export const LenderWalletPage: React.FC = () => {
  const { t } = useI18n();
  const { pushToast } = useApp();
  const p = lenderProfile;

  const copy = () => {
    navigator.clipboard?.writeText(p.walletAddress);
    pushToast(t("lender.profile.walletCopied"), "success");
  };

  return (
    <PhoneFrame title={t("lender.profile.wallet")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-4 text-center">
          <div className="text-[12.5px] uppercase tracking-wider text-text-muted">
            {t("lender.profile.wallet")}
          </div>
          <div className="mt-2 break-all font-mono text-[16px] font-semibold text-gold-bright">
            {p.walletAddress}
          </div>
        </Card>

        <DetailRow label={t("lender.profile.walletAddress")} value={p.walletAddress} mono />
        <DetailRow label={t("lender.profile.walletNetwork")} value="Ethereum" />

        <p className="mt-3 px-1 text-[12.5px] leading-snug text-text-muted">
          {t("lender.profile.walletNote")}
        </p>

        <div className="mt-6">
          <PrimaryButton onClick={copy}>{t("lender.profile.walletCopy")}</PrimaryButton>
        </div>
      </motion.div>
    </PhoneFrame>
  );
};
