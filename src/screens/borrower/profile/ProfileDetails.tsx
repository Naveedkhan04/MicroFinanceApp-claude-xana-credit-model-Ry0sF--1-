import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { Card } from "../../../components/ui/Card";
import { StatusChip } from "../../../components/ui/StatusChip";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { DetailRow } from "../../../components/ui/SettingsItems";
import { AvatarUploader } from "../../../components/ui/AvatarUploader";
import { borrowerProfile } from "../../../data/mockData";
import { formatDate, useI18n } from "../../../i18n";

export const BorrowerProfileDetails: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const p = borrowerProfile;

  return (
    <PhoneFrame title={t("borrower.profile.details")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-4 text-center">
          <div className="mx-auto mb-3 flex justify-center">
            <AvatarUploader storageKey="xana.borrower.avatar" size={96} />
          </div>
          <div className="text-[17px] font-bold text-gold-bright">{p.fullName}</div>
          <div className="mt-1 text-[12.5px] text-text-muted">{p.phone}</div>
          <div className="mt-3 flex justify-center">
            <StatusChip tone="green">{t("common.kycVerified")}</StatusChip>
          </div>
          <p className="mt-3 text-[12.5px] text-text-muted">
            {t("borrower.profile.detailsHint")}
          </p>
        </Card>

        <DetailRow label={t("borrower.profile.personalFullName")} value={p.fullName} />
        <DetailRow label={t("borrower.profile.personalPhone")} value={p.phone} />
        <DetailRow label={t("borrower.profile.personalId")} value={p.idNumber ?? "—"} />
        <DetailRow label={t("borrower.profile.personalCity")} value={p.city ?? "—"} />
        <DetailRow label={t("borrower.profile.memberSince")} value={formatDate(p.createdAt, lang)} />

        <div className="mt-6">
          <PrimaryButton variant="outline" onClick={() => navigate("/borrower/onboarding")}>
            {t("borrower.profile.personalEdit")}
          </PrimaryButton>
        </div>
      </motion.div>
    </PhoneFrame>
  );
};
