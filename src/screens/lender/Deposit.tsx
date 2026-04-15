import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { LenderNav } from "../../components/layout/LenderNav";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { Card } from "../../components/ui/Card";
import { AmountInput } from "../../components/ui/AmountInput";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { StatusChip } from "../../components/ui/StatusChip";
import { lenderApi } from "../../data/services";
import type { Pool, PoolType } from "../../types";
import { formatCurrency, formatPercent, useI18n } from "../../i18n";
import { useApp } from "../../context/AppContext";
import clsx from "../../utils/clsx";

export const Deposit: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { pushToast } = useApp();

  const [pools, setPools] = useState<Pool[]>([]);
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState<PoolType>("balanced");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const walletBalance = 1500;

  useEffect(() => {
    lenderApi.getPools().then(setPools);
  }, []);

  const selectedPool = useMemo(() => pools.find((p) => p.id === selected), [pools, selected]);
  const amountNum = Number(amount) || 0;
  const valid = selectedPool && amountNum >= selectedPool.minDeposit && amountNum <= walletBalance;

  const handleConfirm = async () => {
    if (!valid || !selectedPool) return;
    setLoading(true);
    try {
      await lenderApi.deposit(amountNum, selected);
      pushToast(`Deposited ${formatCurrency(amountNum, "USD", lang)}`, "success");
      navigate("/lender");
    } catch (e) {
      pushToast("Deposit failed. Try again.", "error");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  const poolCopy = {
    stable: t("lender.deposit.stable"),
    balanced: t("lender.deposit.balanced"),
    "high-yield": t("lender.deposit.high"),
  } as const;

  return (
    <PhoneFrame
      title={t("lender.deposit.title")}
      bottomNav={<LenderNav />}
      footer={
        <div>
          <PrimaryButton disabled={!valid} onClick={() => setConfirmOpen(true)}>
            {t("lender.deposit.confirm")}
          </PrimaryButton>
          {!valid && amount !== "" && (
            <p className="mt-2 text-center text-[12px] text-danger">
              {t("lender.deposit.amount")}: min {formatCurrency(selectedPool?.minDeposit ?? 0, "USD", lang)}
            </p>
          )}
        </div>
      }
    >
      <SectionLabel right={`${t("lender.deposit.walletBalance")}: ${formatCurrency(walletBalance, "USD", lang)}`}>
        {t("lender.deposit.amount")}
      </SectionLabel>
      <AmountInput value={amount} onChange={setAmount} token="USDT" placeholder={t("common.enterAmount")} />

      <SectionLabel>{t("lender.deposit.selectPool")}</SectionLabel>
      <div className="space-y-3">
        {pools.map((p) => {
          const riskTone = p.risk === "low" ? "green" : p.risk === "medium" ? "amber" : "red";
          const active = selected === p.id;
          return (
            <Card
              key={p.id}
              interactive
              onClick={() => setSelected(p.id)}
              className={clsx("cursor-pointer transition-all", active && "ring-2 ring-gold")}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[16px] font-bold text-gold-bright">{poolCopy[p.id]}</div>
                  <div className="mt-1 text-[12px] text-text-muted">{p.liquidityTerms}</div>
                </div>
                <div className="text-right">
                  <div className="gold-text text-[18px] font-semibold">{formatPercent(p.apy, lang)}</div>
                  <div className="text-[11px] text-text-muted">{t("lender.deposit.expectedApy")}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <StatusChip tone={riskTone}>{t(("common.risk." + p.risk) as "common.risk.low")}</StatusChip>
                <StatusChip tone="neutral">Min {formatCurrency(p.minDeposit, "USD", lang)}</StatusChip>
              </div>
            </Card>
          );
        })}
      </div>

      {confirmOpen && selectedPool && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60 px-3 pb-6 md:items-center md:justify-center">
          <Card className="w-full max-w-md">
            <h3 className="mb-1 text-[17px] font-semibold text-gold">{t("lender.deposit.confirmTitle")}</h3>
            <p className="mb-4 text-[13px] text-text-muted">
              {t("lender.deposit.confirmDesc", { amount: formatCurrency(amountNum, "USDT", lang), pool: poolCopy[selectedPool.id] })}
            </p>
            <div className="mb-4 space-y-2 rounded-xl bg-surface p-3 text-[13px]">
              <Row label={t("lender.deposit.expectedApy")} value={formatPercent(selectedPool.apy, lang)} />
              <Row label={t("lender.deposit.risk")} value={t(("common.risk." + selectedPool.risk) as "common.risk.low")} />
              <Row label={t("lender.deposit.liquidity")} value={selectedPool.liquidityTerms} />
            </div>
            <div className="flex gap-2">
              <PrimaryButton variant="outline" onClick={() => setConfirmOpen(false)}>
                {t("app.cancel")}
              </PrimaryButton>
              <PrimaryButton loading={loading} onClick={handleConfirm}>
                {t("app.confirm")}
              </PrimaryButton>
            </div>
          </Card>
        </div>
      )}
    </PhoneFrame>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-text-muted">{label}</span>
    <span className="font-medium text-text">{value}</span>
  </div>
);
