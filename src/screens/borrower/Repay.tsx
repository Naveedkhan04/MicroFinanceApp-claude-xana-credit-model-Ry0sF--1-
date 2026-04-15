import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
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
import { useApp } from "../../context/AppContext";
import type { Loan } from "../../types";

type Mode = "full" | "partial";

export const Repay: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { pushToast } = useApp();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [mode, setMode] = useState<Mode>("full");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<null | { full: boolean }>(null);

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
      pushToast(t("borrower.repay.success"), "success");
      setSuccess({ full: !res.loan });
    } catch {
      pushToast(t("common.error"), "error");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PhoneFrame hideCancel>
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 15 }}
            className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/20 text-5xl text-success"
          >
            ✓
          </motion.div>
          <h2 className="mb-2 text-[22px] font-semibold text-gold">{t("borrower.repay.success")}</h2>
          <p className="mb-8 max-w-[260px] text-[13px] text-text-muted">
            {success.full ? t("borrower.repay.successDesc") : t("borrower.repay.partialDesc")}
          </p>
          <PrimaryButton onClick={() => navigate("/borrower")}>{t("app.done")}</PrimaryButton>
        </div>
      </PhoneFrame>
    );
  }

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

    </PhoneFrame>
  );
};
