import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { LenderNav } from "../../components/layout/LenderNav";
import { BalanceCard } from "../../components/ui/BalanceCard";
import { Card } from "../../components/ui/Card";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { StatCard } from "../../components/ui/StatCard";
import { LanguageSwitcher } from "../../components/ui/LanguageSwitcher";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { Skeleton } from "../../components/ui/Skeleton";
import { DepositIcon, WithdrawIcon } from "../../components/layout/NavIcons";
import { lenderApi } from "../../data/services";
import { formatCurrency, formatPercent, useI18n } from "../../i18n";
import type { LenderOverview } from "../../types";
import { useApp } from "../../context/AppContext";

export const LenderHome: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { pushToast } = useApp();
  const [ov, setOv] = useState<LenderOverview | null>(null);

  useEffect(() => {
    lenderApi.getOverview().then(setOv);
  }, []);

  const toggleReinvest = async () => {
    if (!ov) return;
    const next = !ov.autoReinvest;
    setOv({ ...ov, autoReinvest: next });
    await lenderApi.setAutoReinvest(next);
    pushToast(next ? "Auto-reinvest enabled" : "Auto-reinvest disabled", "success");
  };

  if (!ov) {
    return (
      <PhoneFrame title={t("nav.lender.home")} hideCancel topBarRight={<LanguageSwitcher />} bottomNav={<LenderNav />}>
        <div className="space-y-4 px-1 pt-3">
          <Skeleton variant="block" className="h-40" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton variant="block" className="h-20" />
            <Skeleton variant="block" className="h-20" />
          </div>
        </div>
      </PhoneFrame>
    );
  }

  const firstTime = ov.totalBalance === 0;

  return (
    <PhoneFrame title={t("nav.lender.home")} hideCancel topBarRight={<LanguageSwitcher />} bottomNav={<LenderNav />}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <BalanceCard
          amount={formatCurrency(ov.totalBalance, "USD", lang).replace(/[^\d.,]/g, "")}
          sublabel={t("lender.home.available")}
          subvalue={formatCurrency(ov.availableToWithdraw, "USD", lang)}
          align="right"
          bold
        />

        {firstTime ? (
          <Card className="text-center">
            <p className="mb-3 text-[15px] font-semibold text-gold">{t("lender.home.firstTime")}</p>
            <p className="mb-5 text-[13px] text-text-muted">{t("lender.home.firstTimeHint")}</p>
            <PrimaryButton onClick={() => navigate("/lender/deposit")}>{t("lender.home.deposit")}</PrimaryButton>
          </Card>
        ) : (
          <>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <StatCard label={t("lender.home.apy")} value={formatPercent(ov.apy, lang)} accent trend={{ direction: "up", value: "+0.4%" }} />
              <StatCard label={t("lender.home.earningsToday")} value={formatCurrency(ov.earningsToday, "USD", lang)} />
              <StatCard label={t("lender.home.activeCapital")} value={formatCurrency(ov.activeCapital, "USD", lang)} />
              <StatCard label={t("lender.home.totalEarnings")} value={formatCurrency(ov.totalEarnings, "USD", lang)} accent />
            </div>

            <SectionLabel>{t("lender.home.available")}</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <PrimaryButton leftIcon={<DepositIcon />} onClick={() => navigate("/lender/deposit")}>{t("lender.home.deposit")}</PrimaryButton>
              <PrimaryButton variant="outline" leftIcon={<WithdrawIcon />} onClick={() => navigate("/lender/withdraw")}>{t("lender.home.withdraw")}</PrimaryButton>
            </div>

            <Card className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-[14px] font-semibold text-text">{t("lender.home.autoReinvest")}</div>
                <div className="text-[12px] text-text-muted">APY compounds daily</div>
              </div>
              <button
                role="switch"
                aria-checked={ov.autoReinvest}
                onClick={toggleReinvest}
                className={`relative h-7 w-12 rounded-full transition-colors ${ov.autoReinvest ? "bg-gold" : "bg-surface-raised"}`}
              >
                <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all ${ov.autoReinvest ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </Card>
          </>
        )}
      </motion.div>
    </PhoneFrame>
  );
};
