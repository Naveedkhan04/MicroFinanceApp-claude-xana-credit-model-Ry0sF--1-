import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { BorrowerNav } from "../../components/layout/BorrowerNav";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { StatusChip } from "../../components/ui/StatusChip";
import { EmptyState } from "../../components/ui/EmptyState";
import { TokenIcon } from "../../components/ui/TokenIcon";
import { borrowerApi } from "../../data/services";
import { formatCurrency, formatDate, useI18n } from "../../i18n";
import type { Loan } from "../../types";

export const ActiveLoan: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<Loan | null>(null);

  useEffect(() => {
    borrowerApi.getActiveLoan().then(setLoan);
  }, []);

  if (!loan) {
    return (
      <PhoneFrame title={t("borrower.active.title")} bottomNav={<BorrowerNav />}>
        <EmptyState
          title={t("borrower.home.noLoan")}
          description={t("borrower.home.noLoanDesc", { amount: formatCurrency(20, "USD", lang) })}
          icon="🌙"
          action={<PrimaryButton onClick={() => navigate("/borrower/borrow")}>{t("borrower.home.borrow")}</PrimaryButton>}
        />
      </PhoneFrame>
    );
  }

  const remaining = loan.total - loan.amountRepaid;
  const pct = loan.amountRepaid / loan.total;
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(loan.dueAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );
  const overdue = daysLeft === 0 && loan.amountRepaid < loan.total;

  return (
    <PhoneFrame
      title={t("borrower.active.title")}
      showBack
      bottomNav={<BorrowerNav />}
      footer={
        <PrimaryButton onClick={() => navigate("/borrower/repay")}>
          {t("borrower.active.repay")}
        </PrimaryButton>
      }
    >
      <Card>
        <div className="flex items-center gap-4">
          <TokenIcon kind="xana" size={54} />
          <div className="flex-1">
            <div className="text-[13px] text-text-muted">{t("borrower.active.borrowed")}</div>
            <div className="gold-text text-[24px] font-semibold">{formatCurrency(loan.principal, "USD", lang)}</div>
          </div>
          {overdue ? (
            <StatusChip tone="red">{t("borrower.active.overdue")}</StatusChip>
          ) : (
            <StatusChip tone="green">{t("status.active")}</StatusChip>
          )}
        </div>

        <hr className="my-4 border-border-gold" />

        <div className="grid grid-cols-2 gap-3 text-[13px]">
          <div>
            <div className="text-text-muted">{t("borrower.active.due")}</div>
            <div className="font-semibold text-text">{formatCurrency(loan.total, "USD", lang)}</div>
          </div>
          <div className="text-right">
            <div className="text-text-muted">{t("borrower.active.remaining")}</div>
            <div className="font-semibold text-gold-bright">{formatCurrency(remaining, "USD", lang)}</div>
          </div>
        </div>

        <ProgressBar value={pct} className="mt-4" tone={overdue ? "red" : "gold"} />
        <div className="mt-2 flex justify-between text-[12px] text-text-muted">
          <span>{formatDate(loan.issuedAt, lang)}</span>
          <span>
            {overdue ? t("borrower.active.overdue") : t("borrower.active.daysLeft", { days: daysLeft })}
          </span>
        </div>
      </Card>

      <Card className="mt-3 space-y-2 text-[13px]">
        <Row label={t("borrower.review.fee")} value={formatCurrency(loan.fee, "USD", lang)} />
        <Row label={t("borrower.review.destination")} value={loan.disbursementTarget} />
        <Row label={t("borrower.review.due")} value={formatDate(loan.dueAt, lang)} />
      </Card>
    </PhoneFrame>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-text-muted">{label}</span>
    <span className="font-medium text-text">{value}</span>
  </div>
);
