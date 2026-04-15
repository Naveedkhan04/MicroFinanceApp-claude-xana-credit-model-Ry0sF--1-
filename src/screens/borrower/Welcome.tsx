import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { LanguageSwitcher } from "../../components/ui/LanguageSwitcher";
import { TokenIcon } from "../../components/ui/TokenIcon";
import { useI18n } from "../../i18n";

export const Welcome: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <PhoneFrame bare>
      <div className="flex h-full flex-col px-4 py-8">
        <div className="flex justify-between">
          <div className=" text-center text-[13px] font-semibold tracking-[0.3em] text-white">XANA</div>
          <LanguageSwitcher />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-auto flex flex-col items-center text-center"
        >
          <TokenIcon kind="gold" size={96} className="mb-5" />
          <h1 className="mb-1 text-[30px] font-semibold">
            <span className="gold-text">{t("app.brand")}</span>
          </h1>
          <p className="max-w-[280px] text-[14px] leading-relaxed text-text-muted">
            {t("borrower.welcome.tagline")}
          </p>
        </motion.div>

        <div className="mt-auto space-y-3">
          <PrimaryButton onClick={() => navigate("/borrower/otp")}>
            {t("borrower.welcome.continue")}
          </PrimaryButton>
          <button className="mx-auto block text-[13px] text-text-muted hover:text-gold">
            {t("borrower.welcome.help")}
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
};
