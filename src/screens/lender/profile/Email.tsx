import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { FieldRow } from "../../../components/ui/SettingsItems";
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
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-full flex-col pt-2">
        <FieldRow label={t("lender.profile.emailCurrent")} value={p.email ?? "—"} />

        <div className="mb-3">
          <div className="mb-1.5 pl-2 text-[12.5px] text-text-muted">
            {t("lender.profile.emailNew")}
          </div>
          <div className="flex items-center gap-2 rounded-pill border border-border-gold bg-bg-panel/60 pl-5 pr-5 min-h-[52px]">
            <input
              type="email"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("lender.profile.emailPlaceholder")}
              className="w-full bg-transparent py-3 text-[14px] font-semibold text-gold-bright placeholder:text-text-muted outline-none"
            />
          </div>
        </div>

        <div className="mt-auto pt-6 mb-[100px]">
          <PrimaryButton onClick={submit} disabled={!value}>
            {t("lender.profile.emailSend")}
          </PrimaryButton>
        </div>
      </motion.div>
    </PhoneFrame>
  );
};
