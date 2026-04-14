import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { BorrowerNav } from "../../components/layout/BorrowerNav";
import { BalanceCard } from "../../components/ui/BalanceCard";
import { Card } from "../../components/ui/Card";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { StatusChip } from "../../components/ui/StatusChip";
import { LanguageSwitcher } from "../../components/ui/LanguageSwitcher";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Skeleton } from "../../components/ui/Skeleton";
import { TokenIcon } from "../../components/ui/TokenIcon";
import { borrowerApi } from "../../data/services";
import { formatCurrency, formatDate, useI18n } from "../../i18n";
import type { BorrowerProfile, Loan } from "../../types";

export const BorrowerHome: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<BorrowerProfile | null>(null);
  const [loan, setLoan] = useState<Loan | null>(null);

  useEffect(() => {
    Promise.all([borrowerApi.getProfile(), borrowerApi.getActiveLoan()]).then(([p, l]) => {
      setProfile(p);
      setLoan(l);
    });
  }, []);

  if (!profile) {
    return (
      <PhoneFrame title={t("app.brand")} hideCancel topBarRight={<LanguageSwitcher />} bottomNav={<BorrowerNav />}>
        <Skeleton variant="block" className="h-40" />
      </PhoneFrame>
    );
  }

  const eligibilityTone: Record<BorrowerProfile["eligibility"], "green" | "red" | "amber" | "neutral"> = {
    eligible: "green",
    ineligible: "red",
    review: "amber",
    blocked: "red",
  };
  const eligibilityLabel: Record<BorrowerProfile["eligibility"], string> = {
    eligible: t("borrower.home.eligible"),
    ineligible: t("borrower.home.ineligible"),
    review: t("borrower.home.review"),
    blocked: t("borrower.home.blocked"),
  };

  const daysLeft = loan
    ? Math.max(0, Math.ceil((new Date(loan.dueAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;
  const repayPct = loan ? loan.amountRepaid / loan.total : 0;

  const canBorrow = profile.eligibility === "eligible" && !loan;

  return (
    <PhoneFrame title={t("app.brand")} hideCancel topBarRight={<LanguageSwitcher />} bottomNav={<BorrowerNav />}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-3 flex items-center justify-center gap-2">
          <h2 className="text-[22px] font-semibold text-gold">{t("borrower.home.creditLimit")}</h2>
        </div>

        <BalanceCard
          amount={profile.creditLimit.toFixed(2)}
          sublabel={t("borrower.home.trustScore")}
          subvalue={`${profile.trustScore} / 100`}
        />

        <Card className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-[13px] text-text-muted">{t("borrower.home.eligibility")}</div>
            <div className="mt-1">
              <StatusChip tone={eligibilityTone[profile.eligibility]}>{eligibilityLabel[profile.eligibility]}</StatusChip>
            </div>
          </div>
          <TokenIcon kind="xana" size={40} />
        </Card>

        {loan ? (
          <>
            <SectionLabel>{t("borrower.home.activeLoan")}</SectionLabel>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] text-text-muted">{t("borrower.active.borrowed")}</div>
                  <div className="text-[22px] font-semibold gold-text">{formatCurrency(loan.principal, "USD", lang)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] text-text-muted">{t("borrower.home.nextAmount")}</div>
                  <div className="text-[18px] font-semibold text-gold-bright">
                    {formatCurrency(loan.total - loan.amountRepaid, "USD", lang)}
                  </div>
                </div>
              </div>
              <ProgressBar value={repayPct} className="mt-3" />
              <div className="mt-2 flex justify-between text-[12px] text-text-muted">
                <span>
                  {t("borrower.home.dueDate")}: {formatDate(loan.dueAt, lang)}
                </span>
                <span>{daysLeft} {t("common.days")}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <PrimaryButton onClick={() => navigate("/borrower/repay")}>{t("borrower.home.repay")}</PrimaryButton>
                <PrimaryButton variant="outline" onClick={() => navigate("/borrower/active")}>
                  {t("borrower.active.breakdown")}
                </PrimaryButton>
              </div>
            </Card>
          </>
        ) : (
          <Card className="mt-4 text-center">
            <p className="mb-1 text-[14px] font-semibold text-gold">{t("borrower.home.noLoan")}</p>
            <p className="mb-4 text-[13px] text-text-muted">
              {t("borrower.home.noLoanDesc", { amount: formatCurrency(profile.creditLimit, "USD", lang) })}
            </p>
            <PrimaryButton disabled={!canBorrow} onClick={() => navigate("/borrower/borrow")}>
              {t("borrower.home.borrow")}
            </PrimaryButton>
            {profile.eligibility === "review" && (
              <p className="mt-3 text-[12px] text-warning">{t("borrower.home.review")}</p>
            )}
            {profile.eligibility === "blocked" && (
              <p className="mt-3 text-[12px] text-danger">{t("borrower.home.blocked")}</p>
            )}
          </Card>
        )}

        <SectionLabel>{t("borrower.trust.title")}</SectionLabel>
        <Card interactive onClick={() => navigate("/borrower/trust")}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[15px] font-semibold text-gold-bright">{profile.trustScore}</div>
              <div className="text-[12px] text-text-muted">
                {profile.streak}× {t("borrower.trust.streak")}
              </div>
            </div>
            <ProgressBar value={profile.trustScore / 100} className="w-32" />
          </div>
        </Card>
      </motion.div>
    </PhoneFrame>
  );
};
