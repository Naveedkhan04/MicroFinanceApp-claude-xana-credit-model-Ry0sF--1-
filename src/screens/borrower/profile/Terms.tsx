import React from "react";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../../components/layout/PhoneFrame";
import { Card } from "../../../components/ui/Card";
import { useI18n } from "../../../i18n";

export const BorrowerTermsPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <PhoneFrame title={t("borrower.profile.terms")} showBack>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="space-y-3 text-[13.5px] leading-relaxed text-text-muted">
            <p>{t("borrower.profile.termsBody1")}</p>
            <p className="text-gold-bright">{t("borrower.profile.termsLink")}</p>
          </div>
        </Card>
      </motion.div>
    </PhoneFrame>
  );
};
