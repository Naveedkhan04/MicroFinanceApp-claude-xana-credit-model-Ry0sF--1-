import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useI18n } from "../i18n";
import { useApp } from "../context/AppContext";
import { Card } from "../components/ui/Card";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { PhoneFrame } from "../components/layout/PhoneFrame";
import { TokenIcon } from "../components/ui/TokenIcon";

export const ModeSelect: React.FC = () => {
  const { t } = useI18n();
  const { setMode, setAuthed } = useApp();
  const navigate = useNavigate();

  const handleLender = () => {
    setMode("lender");
    setAuthed(true);
    navigate("/lender");
  };

  const handleBorrower = () => {
    setMode("borrower");
    setAuthed(false);
    navigate("/borrower/welcome");
  };

  return (
    <PhoneFrame bare>
      <div className="flex h-full flex-col items-center justify-between px-3 py-6">
        <div className="flex w-full items-center justify-center px-2 pt-2">
          <h1 className="text-[15px] font-bold tracking-[0.2em] text-white uppercase">
            {t("app.brand")}
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-1 w-full flex-col items-center justify-center gap-6"
        >
          <div className="text-center">
            <div className="mb-3 flex justify-center">
              <TokenIcon kind="gold" size={72} />
            </div>
            <h2 className="mb-1 gold-text text-[24px] font-semibold">{t("mode.title")}</h2>
            <p className="text-[13px] text-text-muted">{t("mode.subtitle")}</p>
          </div>

          <Card className="w-full" interactive onClick={handleLender}>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M12 2l3 6 6 .9-4.5 4.4 1 6.2L12 16.8l-5.5 2.7 1-6.2L3 8.9 9 8z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[16px] font-bold text-gold-bright">{t("mode.lender")}</div>
                <div className="text-[12.5px] text-text-muted">{t("mode.lenderDesc")}</div>
              </div>
              <span className="text-gold">›</span>
            </div>
          </Card>

          <Card className="w-full" interactive onClick={handleBorrower}>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M12 3c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 4a3 3 0 100 6 3 3 0 000-6zm0 14c-2.2 0-4.2-.9-5.7-2.4.3-1.8 3.8-2.8 5.7-2.8s5.4 1 5.7 2.8A7.9 7.9 0 0112 21z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[16px] font-bold text-gold-bright">{t("mode.borrower")}</div>
                <div className="text-[12.5px] text-text-muted">{t("mode.borrowerDesc")}</div>
              </div>
              <span className="text-gold">›</span>
            </div>
          </Card>
        </motion.div>

        <PrimaryButton variant="ghost" onClick={handleBorrower}>
          {t("app.continue")} →
        </PrimaryButton>
      </div>
    </PhoneFrame>
  );
};
