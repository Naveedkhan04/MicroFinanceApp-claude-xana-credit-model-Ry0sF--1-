import React from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { BorrowerNav } from "../../components/layout/BorrowerNav";
import { Card } from "../../components/ui/Card";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { formatCurrency, formatDate, formatPercent, useI18n } from "../../i18n";
import { computeDueDate, computeFee, computeTotal, useBorrowFlow } from "./BorrowFlow";
import type { LoanDuration } from "../../types";
import clsx from "../../utils/clsx";

const OPTIONS: LoanDuration[] = [7, 14, 21, 30];

function rateFor(d: LoanDuration) {
  if (d <= 7) return 0.08;
  if (d <= 14) return 0.15;
  if (d <= 21) return 0.2;
  return 0.25;
}

export const SelectDuration: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { amount, duration, setDuration } = useBorrowFlow();

  const next = () => navigate("/borrower/review");

  return (
    <PhoneFrame title={t("borrower.duration.title")} bottomNav={<BorrowerNav />}>
      <h2 className="mb-4 text-center text-[22px] font-semibold text-gold">{t("borrower.duration.title")}</h2>

      <div className="space-y-3">
        {OPTIONS.map((d) => {
          const rate = rateFor(d);
          const fee = computeFee(amount, rate);
          const total = computeTotal(amount, rate);
          const due = computeDueDate(d);
          const active = duration === d;
          const effective = rate * (30 / d); // monthly effective
          return (
            <Card
              key={d}
              interactive
              onClick={() => setDuration(d)}
              className={clsx("cursor-pointer transition-all", active && "ring-2 ring-gold")}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[17px] font-bold text-gold-bright">{t("borrower.duration.days", { days: d })}</div>
                  <div className="text-[12px] text-text-muted">{formatDate(due, lang)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[15px] font-semibold text-text">{formatCurrency(total, "USD", lang)}</div>
                  <div className="text-[11px] text-text-muted">{t("borrower.duration.total")}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
                <Info label={t("borrower.duration.fee")} value={`${formatCurrency(fee, "USD", lang)} (${formatPercent(rate, lang)})`} />
                <Info label={t("borrower.duration.effective")} value={formatPercent(effective, lang)} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6">
        <PrimaryButton onClick={next}>{t("borrower.duration.next")}</PrimaryButton>
      </div>
    </PhoneFrame>
  );
};

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl bg-surface p-2">
    <div className="text-text-muted">{label}</div>
    <div className="font-medium text-text">{value}</div>
  </div>
);
