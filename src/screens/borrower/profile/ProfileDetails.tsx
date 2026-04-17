import React, { useState } from "react";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { Card } from "../../../components/ui/Card";
import { StatusChip } from "../../../components/ui/StatusChip";
import { FieldRow } from "../../../components/ui/SettingsItems";
import { AvatarUploader } from "../../../components/ui/AvatarUploader";
import { borrowerProfile } from "../../../data/mockData";
import { formatDate, useI18n } from "../../../i18n";
import { useApp } from "../../../context/AppContext";

export const BorrowerProfileDetails: React.FC = () => {
  const { t, lang } = useI18n();
  const { pushToast } = useApp();
  const p = borrowerProfile;

  const [fullName, setFullName] = useState(p.fullName);
  const [phone, setPhone] = useState(p.phone);
  const [idNumber, setIdNumber] = useState(p.idNumber ?? "");
  const [city, setCity] = useState(p.city ?? "");

  const onSaved = () => pushToast(t("borrower.profile.saved"), "success");

  return (
    <PhoneFrame title={t("borrower.profile.details")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-full flex-col pt-2">
        <Card className="mb-4 text-center">
          <div className="mx-auto mb-3 flex justify-center">
            <AvatarUploader storageKey="xana.borrower.avatar" size={96} />
          </div>
          <div className="text-[17px] font-bold text-gold-bright">{fullName}</div>
          <div className="mt-1 text-[12.5px] text-text-muted">{phone}</div>
          <div className="mt-3 flex justify-center">
            <StatusChip tone="green">{t("common.kycVerified")}</StatusChip>
          </div>
          <p className="mt-3 text-[12.5px] text-text-muted">
            {t("borrower.profile.detailsHint")}
          </p>
        </Card>

        <FieldRow
          label={t("borrower.profile.personalFullName")}
          value={fullName}
          editable
          onSave={(v) => { setFullName(v); onSaved(); }}
        />
        <FieldRow
          label={t("borrower.profile.personalPhone")}
          value={phone}
          editable
          inputType="tel"
          onSave={(v) => { setPhone(v); onSaved(); }}
        />
        <FieldRow
          label={t("borrower.profile.personalId")}
          value={idNumber || "—"}
          editable
          onSave={(v) => { setIdNumber(v); onSaved(); }}
        />
        <FieldRow
          label={t("borrower.profile.personalCity")}
          value={city || "—"}
          editable
          onSave={(v) => { setCity(v); onSaved(); }}
        />
        <FieldRow
          label={t("borrower.profile.memberSince")}
          value={formatDate(p.createdAt, lang)}
        />

        <div className="mb-[100px]" />
      </motion.div>
    </PhoneFrame>
  );
};
