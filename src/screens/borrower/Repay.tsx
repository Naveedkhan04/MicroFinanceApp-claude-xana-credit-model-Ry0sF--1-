import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { StatusDialog } from "../../components/ui/StatusDialog";
import { BorrowerNav } from "../../components/layout/BorrowerNav";
import { Card } from "../../components/ui/Card";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { AmountInput } from "../../components/ui/AmountInput";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { Chip } from "../../components/ui/Chip";
import { EmptyState } from "../../components/ui/EmptyState";
import { TokenIcon } from "../../components/ui/TokenIcon";
import { borrowerApi } from "../../data/services";
import { formatCurrency, useI18n } from "../../i18n";
import type { Loan } from "../../types";

type Mode = "full" | "partial";

export const Repay: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [mode, setMode] = useState<Mode>("full");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<null | { full: boolean }>(null);
  const [failed, setFailed] = useState(false);
  const randomHash = () =>
    "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  const [txHash, setTxHash] = useState<string | undefined>(undefined);

  useEffect(() => {
    borrowerApi.getActiveLoan().then((l) => {
      setLoan(l);
      if (l) setAmount((l.total - l.amountRepaid).toFixed(2));
    });
  }, []);

  useEffect(() => {
    if (!loan) return;
    const remaining = loan.total - loan.amountRepaid;
    if (mode === "full") setAmount(remaining.toFixed(2));
  }, [mode, loan]);

  if (!loan && !success) {
    return (
      <PhoneFrame title={t("borrower.repay.title")} bottomNav={<BorrowerNav />}>
        <EmptyState
          title={t("borrower.home.noLoan")}
          icon="🌙"
          action={<PrimaryButton onClick={() => navigate("/borrower")}>{t("app.done")}</PrimaryButton>}
        />
      </PhoneFrame>
    );
  }

  const remaining = loan ? loan.total - loan.amountRepaid : 0;
  const n = Number(amount) || 0;
  const valid = n > 0 && n <= remaining + 0.001;

  const pay = async () => {
    setLoading(true);
    try {
      const res = await borrowerApi.repay(n);
      setTxHash(randomHash());
      setSuccess({ full: !res.loan });
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhoneFrame
      title={t("borrower.repay.title")}
      bottomNav={<BorrowerNav />}
      footer={
        <PrimaryButton disabled={!valid} loading={loading} onClick={pay}>
          {t("borrower.repay.confirm")}
        </PrimaryButton>
      }
    >
      <Card className="mb-4 flex items-center gap-4">
        <TokenIcon kind="xana" size={46} />
        <div className="flex-1">
          <div className="text-[13px] text-text-muted">{t("borrower.repay.amountDue")}</div>
          <div className="gold-text text-[22px] font-semibold">{formatCurrency(remaining, "USD", lang)}</div>
        </div>
      </Card>

      <SectionLabel>{t("borrower.repay.method")}</SectionLabel>
      <Card className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tether text-white font-bold">Z</div>
        <div className="flex-1">
          <div className="text-[14px] font-semibold text-gold-bright">{t("borrower.repay.methodZaad")}</div>
          <div className="text-[12px] text-text-muted">{loan?.disbursementTarget}</div>
        </div>
      </Card>

      <SectionLabel>{t("common.amount")}</SectionLabel>
      <div className="mb-2 flex gap-2">
        <Chip active={mode === "full"} onClick={() => setMode("full")}>
          {t("borrower.repay.full")}
        </Chip>
        <Chip active={mode === "partial"} onClick={() => setMode("partial")}>
          {t("borrower.repay.partial")}
        </Chip>
      </div>

      <AmountInput value={amount} onChange={setAmount} token="USD" placeholder={t("common.enterAmount")} disabled={mode === "full"} />

      <StatusDialog
        open={!!success}
        status="success"
        title={t("borrower.repay.success")}
        description={success?.full ? t("borrower.repay.successDesc") : t("borrower.repay.partialDesc")}
        hash={txHash}
        primaryLabel={t("app.done")}
        onPrimary={() => { setSuccess(null); navigate("/borrower"); }}
        onClose={() => setSuccess(null)}
      />

      <StatusDialog
        open={failed}
        status="error"
        title="Repayment Failed"
        description="The transaction could not be completed. No funds were deducted."
        primaryLabel="Retry"
        onPrimary={() => { setFailed(false); pay(); }}
        onClose={() => setFailed(false)}
      />
    </PhoneFrame>
  );
};
