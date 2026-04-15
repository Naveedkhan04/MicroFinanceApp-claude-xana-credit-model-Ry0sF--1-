import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { BorrowerNav } from "../../components/layout/BorrowerNav";
import { Card } from "../../components/ui/Card";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { TokenIcon } from "../../components/ui/TokenIcon";
import { formatCurrency, formatDate, useI18n } from "../../i18n";
import { computeDueDate, computeFee, computeTotal, useBorrowFlow } from "./BorrowFlow";
import { borrowerApi } from "../../data/services";
import type { BorrowerProfile } from "../../types";

export const LoanReview: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { amount, duration, feeRate } = useBorrowFlow();
  const [consent, setConsent] = useState(false);
  const [profile, setProfile] = useState<BorrowerProfile | null>(null);

  useEffect(() => {
    borrowerApi.getProfile().then(setProfile);
  }, []);

  const fee = computeFee(amount, feeRate);
  const total = computeTotal(amount, feeRate);
  const due = computeDueDate(duration);

  const confirm = () => navigate("/borrower/processing");

  return (
    <PhoneFrame
      title={t("borrower.review.title")}
      bottomNav={<BorrowerNav />}
      footer={
        <PrimaryButton disabled={!consent} onClick={confirm}>
          {t("borrower.review.confirm")}
        </PrimaryButton>
      }
    >
      <Card className="mb-3 flex items-center gap-4">
        <TokenIcon kind="xana" size={48} />
        <div className="flex-1">
          <div className="text-[13px] text-text-muted">{t("borrower.review.received")}</div>
          <div className="gold-text text-[24px] font-semibold">{formatCurrency(amount, "USD", lang)}</div>
        </div>
      </Card>

      <Card className="space-y-3 text-[14px]">
        <Row label={t("borrower.review.requested")} value={formatCurrency(amount, "USD", lang)} />
        <Row label={t("borrower.review.fee")} value={formatCurrency(fee, "USD", lang)} />
        <Row label={t("borrower.review.repayment")} value={formatCurrency(total, "USD", lang)} accent />
        <Row label={t("borrower.review.due")} value={formatDate(due, lang)} />
        <Row label={t("borrower.review.destination")} value={profile?.zaadNumber ?? "—"} />
      </Card>

      <p className="mt-3 text-center text-[12px] text-warning">{t("borrower.review.lateFee")}</p>

      <label className="mt-4 flex items-start gap-3 rounded-2xl border border-border-gold bg-bg-panel/60 p-4 text-[13px] cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={() => setConsent((v) => !v)}
          className="mt-1 h-5 w-5 shrink-0 accent-[#F5C354]"
        />
        <span className="text-text-muted">{t("borrower.review.consent")}</span>
      </label>

    </PhoneFrame>
  );
};

const Row: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
  <div className="flex justify-between">
    <span className="text-text-muted">{label}</span>
    <span className={accent ? "font-semibold text-gold-bright" : "font-medium text-text"}>{value}</span>
  </div>
);
