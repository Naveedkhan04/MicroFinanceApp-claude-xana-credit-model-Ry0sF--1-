import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { DetailRow } from "../../../components/ui/SettingsItems";
import { borrowerProfile } from "../../../data/mockData";
import { useI18n } from "../../../i18n";

export const BorrowerPersonalPage: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const p = borrowerProfile;

  return (
    <PhoneFrame title={t("borrower.profile.personal")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <DetailRow label={t("borrower.profile.personalFullName")} value={p.fullName} />
        <DetailRow label={t("borrower.profile.personalPhone")} value={p.phone} />
        <DetailRow label={t("borrower.profile.personalId")} value={p.idNumber ?? "—"} />
        <DetailRow label={t("borrower.profile.personalCity")} value={p.city ?? "—"} />

        <div className="mt-6">
          <PrimaryButton onClick={() => navigate("/borrower/onboarding")}>
            {t("borrower.profile.personalEdit")}
          </PrimaryButton>
        </div>
      </motion.div>
    </PhoneFrame>
  );
};
