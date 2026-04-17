import React from "react";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { Card } from "../../../components/ui/Card";
import { useI18n } from "../../../i18n";

export const LenderTermsPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <PhoneFrame title={t("lender.profile.terms")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
        <Card>
          <div className="space-y-3 text-[13.5px] leading-relaxed text-text-muted">
            <p>{t("lender.profile.termsBody1")}</p>
            <p className="text-gold-bright">{t("lender.profile.termsLink")}</p>
          </div>
        </Card>
      </motion.div>
    </PhoneFrame>
  );
};
