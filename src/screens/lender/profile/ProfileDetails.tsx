import React from "react";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { Card } from "../../../components/ui/Card";
import { StatusChip } from "../../../components/ui/StatusChip";
import { DetailRow } from "../../../components/ui/SettingsItems";
import { AvatarUploader } from "../../../components/ui/AvatarUploader";
import { lenderProfile } from "../../../data/mockData";
import { formatDate, useI18n } from "../../../i18n";

export const LenderProfileDetails: React.FC = () => {
  const { t, lang } = useI18n();
  const p = lenderProfile;

  return (
    <PhoneFrame title={t("lender.profile.details")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-4 text-center">
          <div className="mx-auto mb-3 flex justify-center">
            <AvatarUploader storageKey="xana.lender.avatar" size={96} />
          </div>
          <div className="text-[17px] font-bold text-gold-bright">{p.email}</div>
          <div className="mt-1 font-mono text-[12.5px] text-text-muted">{p.walletAddress}</div>
          <div className="mt-3 flex justify-center">
            <StatusChip tone="green">{t("common.kycVerified")}</StatusChip>
          </div>
          <p className="mt-3 text-[12.5px] text-text-muted">{t("lender.profile.detailsHint")}</p>
        </Card>

        <DetailRow label={t("lender.profile.accountId")} value={p.id} mono />
        <DetailRow label={t("lender.profile.walletAddress")} value={p.walletAddress} mono />
        <DetailRow label={t("lender.profile.email")} value={p.email ?? "—"} />
        <DetailRow
          label={t("lender.profile.kyc")}
          value={<StatusChip tone="green">{t("common.kycVerified")}</StatusChip>}
        />
        <DetailRow label={t("lender.profile.memberSince")} value={formatDate(p.createdAt, lang)} />
      </motion.div>
    </PhoneFrame>
  );
};
