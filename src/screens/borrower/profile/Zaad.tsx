import React from "react";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { DetailRow } from "../../../components/ui/SettingsItems";
import { borrowerProfile } from "../../../data/mockData";
import { useI18n } from "../../../i18n";
import { useApp } from "../../../context/AppContext";

export const BorrowerZaadPage: React.FC = () => {
  const { t } = useI18n();
  const { pushToast } = useApp();
  const p = borrowerProfile;

  return (
    <PhoneFrame title={t("borrower.profile.zaad")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-full flex-col">
        <DetailRow label={t("borrower.profile.zaadCurrent")} value={p.zaadNumber} />

        <p className="mt-3 px-1 text-[12.5px] leading-snug text-text-muted">
          {t("borrower.profile.zaadNote")}
        </p>

        <div className="mt-auto pt-6 mb-[100px] grid grid-cols-2 gap-3">
          <PrimaryButton
            variant="outline"
            onClick={() => pushToast(t("borrower.profile.zaadReverified"), "success")}
          >
            {t("borrower.profile.zaadReverify")}
          </PrimaryButton>
          <PrimaryButton
            onClick={() => pushToast(t("borrower.profile.zaadUpdateRequested"), "success")}
          >
            {t("borrower.profile.zaadChange")}
          </PrimaryButton>
        </div>
      </motion.div>
    </PhoneFrame>
  );
};
