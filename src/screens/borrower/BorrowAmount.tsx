import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { BorrowerNav } from "../../components/layout/BorrowerNav";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { AmountInput } from "../../components/ui/AmountInput";
import { Chip } from "../../components/ui/Chip";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { Card } from "../../components/ui/Card";
import { borrowerApi } from "../../data/services";
import { formatCurrency, formatDate, useI18n } from "../../i18n";
import { useBorrowFlow, computeFee, computeTotal, computeDueDate } from "./BorrowFlow";
import type { BorrowerProfile } from "../../types";

const QUICK = [5, 10, 15, 20];

export const BorrowAmount: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { amount, setAmount, duration, feeRate } = useBorrowFlow();
  const [profile, setProfile] = useState<BorrowerProfile | null>(null);
  const [input, setInput] = useState(String(amount));

  useEffect(() => {
    borrowerApi.getProfile().then(setProfile);
  }, []);

  const n = Number(input) || 0;
  const limit = profile?.creditLimit ?? 20;
  const valid = n >= 5 && n <= limit;

  const fee = computeFee(n, feeRate);
  const total = computeTotal(n, feeRate);
  const due = computeDueDate(duration);

  const next = () => {
    setAmount(n);
    navigate("/borrower/duration");
  };

  return (
    <PhoneFrame
      title={t("borrower.borrow.title")}
      bottomNav={<BorrowerNav />}
      footer={
        <PrimaryButton disabled={!valid} onClick={next}>
          {t("borrower.borrow.next")}
        </PrimaryButton>
      }
    >
      <SectionLabel right={t("borrower.borrow.limitHelper", { limit: formatCurrency(limit, "USD", lang) })}>
        {t("borrower.borrow.amount")}
      </SectionLabel>

      <AmountInput value={input} onChange={setInput} token="USD" placeholder={t("common.enterAmount")} />

      <div className="mt-3 flex flex-wrap gap-2">
        {QUICK.filter((x) => x <= limit).map((q) => (
          <Chip key={q} active={n === q} onClick={() => setInput(String(q))}>
            ${q}
          </Chip>
        ))}
      </div>

      <SectionLabel>{t("borrower.review.requested")}</SectionLabel>
      <Card className="space-y-2 text-[13px]">
        <Row label={t("borrower.borrow.received")} value={formatCurrency(n, "USD", lang)} accent />
        <Row label={t("borrower.borrow.fee")} value={formatCurrency(fee, "USD", lang)} />
        <Row label={t("borrower.review.repayment")} value={formatCurrency(total, "USD", lang)} accent />
        <Row label={t("borrower.borrow.due")} value={formatDate(due, lang)} />
      </Card>

      {!valid && n > 0 && (
        <p className="mt-3 text-center text-[12px] text-danger">
          {t("borrower.borrow.invalid", { min: 5, max: limit })}
        </p>
      )}

    </PhoneFrame>
  );
};

const Row: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
  <div className="flex justify-between">
    <span className="text-text-muted">{label}</span>
    <span className={accent ? "font-semibold text-gold-bright" : "font-medium text-text"}>{value}</span>
  </div>
);
