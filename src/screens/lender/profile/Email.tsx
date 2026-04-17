import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { DetailRow } from "../../../components/ui/SettingsItems";
import { lenderProfile } from "../../../data/mockData";
import { useI18n } from "../../../i18n";
import { useApp } from "../../../context/AppContext";

export const LenderEmailPage: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { pushToast } = useApp();
  const [value, setValue] = useState("");
  const p = lenderProfile;

  const submit = () => {
    if (!value) return;
    pushToast(t("lender.profile.emailSent"), "success");
    navigate(-1);
  };

  return (
    <PhoneFrame title={t("lender.profile.email")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-full flex-col">
        <DetailRow label={t("lender.profile.emailCurrent")} value={p.email ?? "—"} />

        <label className="mb-2 mt-5 block text-[12.5px] text-text-muted">
          {t("lender.profile.emailNew")}
        </label>
        <input
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("lender.profile.emailPlaceholder")}
          className="w-full rounded-pill border border-border-gold bg-bg-panel/80 px-5 py-3 text-[15px] text-text outline-none focus:border-gold"
        />

        <div className="mt-auto pt-6 mb-[100px]">
          <PrimaryButton onClick={submit} disabled={!value}>
            {t("lender.profile.emailSend")}
          </PrimaryButton>
        </div>
      </motion.div>
    </PhoneFrame>
  );
};
