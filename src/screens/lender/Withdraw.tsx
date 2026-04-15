import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { LenderNav } from "../../components/layout/LenderNav";
import { BalanceCard } from "../../components/ui/BalanceCard";
import { AmountInput } from "../../components/ui/AmountInput";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { Card } from "../../components/ui/Card";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { Chip } from "../../components/ui/Chip";
import { Skeleton } from "../../components/ui/Skeleton";
import { StatusDialog } from "../../components/ui/StatusDialog";
import { lenderApi } from "../../data/services";
import { formatCurrency, useI18n } from "../../i18n";
import { useApp } from "../../context/AppContext";
import type { LenderOverview } from "../../types";

export const Withdraw: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { pushToast } = useApp();
  const [ov, setOv] = useState<LenderOverview | null>(null);
  const [amount, setAmount] = useState("");
  const [speed, setSpeed] = useState<"instant" | "standard">("standard");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: "success" | "error"; hash?: string } | null>(null);
  const randomHash = () =>
    "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

  useEffect(() => {
    lenderApi.getOverview().then(setOv);
  }, []);

  const amountNum = Number(amount) || 0;
  const fee = speed === "instant" ? amountNum * 0.005 : 0;
  const valid = ov && amountNum > 0 && amountNum <= ov.availableToWithdraw;
  const lowLiquidity = (ov?.availableToWithdraw ?? 0) < 500;

  const handleWithdraw = async () => {
    if (!valid) return;
    setLoading(true);
    try {
      await lenderApi.withdraw(amountNum, speed);
      setResult({ status: "success", hash: randomHash() });
    } catch (e) {
      setResult({ status: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!ov) {
    return (
      <PhoneFrame title={t("lender.withdraw.title")} bottomNav={<LenderNav />}>
        <Skeleton variant="block" className="h-40" />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame
      title={t("lender.withdraw.title")}
      bottomNav={<LenderNav />}
      footer={
        <PrimaryButton disabled={!valid} loading={loading} onClick={handleWithdraw}>
          {t("lender.withdraw.confirm")}
        </PrimaryButton>
      }
    >
      <BalanceCard
        label={t("lender.withdraw.withdrawable")}
        amount={ov.availableToWithdraw.toFixed(2)}
      />

      <SectionLabel>{t("lender.withdraw.amount")}</SectionLabel>
      <AmountInput value={amount} onChange={setAmount} token="USDT" placeholder={t("common.enterAmount")} />

      <SectionLabel>{t("lender.withdraw.speed")}</SectionLabel>
      <div className="flex gap-2">
        <Chip active={speed === "instant"} onClick={() => setSpeed("instant")}>
          {t("lender.withdraw.instant")}
        </Chip>
        <Chip active={speed === "standard"} onClick={() => setSpeed("standard")}>
          {t("lender.withdraw.standard")}
        </Chip>
      </div>

      <Card className="mt-5 space-y-2 text-[13px]">
        <Row label={t("lender.withdraw.fee")} value={formatCurrency(fee, "USDT", lang)} />
        <Row label={t("lender.withdraw.estimate")} value={speed === "instant" ? "~1 minute" : "1-3 days"} />
      </Card>

      {lowLiquidity && (
        <p className="mt-3 text-center text-[12px] text-warning">{t("lender.withdraw.lowLiquidity")}</p>
      )}

      <StatusDialog
        open={!!result}
        status={result?.status ?? "success"}
        title={result?.status === "success" ? "Withdrawal Successful" : "Withdrawal Failed"}
        description={
          result?.status === "success"
            ? `${formatCurrency(amountNum, "USDT", lang)} is on its way to your wallet.`
            : "The transaction could not be completed. No funds were deducted."
        }
        hash={result?.hash}
        primaryLabel={result?.status === "success" ? "OK" : "Retry"}
        onPrimary={() => {
          const wasSuccess = result?.status === "success";
          setResult(null);
          if (wasSuccess) navigate("/lender");
          else handleWithdraw();
        }}
        onClose={() => setResult(null)}
      />
    </PhoneFrame>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-text-muted">{label}</span>
    <span className="font-medium text-text">{value}</span>
  </div>
);
