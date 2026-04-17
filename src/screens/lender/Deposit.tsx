import React, { useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { PhoneFrame, PhoneFrameOverlayContext } from "../../components/layout/PhoneFrame";
import { LenderNav } from "../../components/layout/LenderNav";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { Card } from "../../components/ui/Card";
import { AmountInput } from "../../components/ui/AmountInput";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { StatusChip } from "../../components/ui/StatusChip";
import { StatusDialog } from "../../components/ui/StatusDialog";
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
  const [result, setResult] = useState<{ status: "success" | "error"; hash?: string } | null>(null);
  const walletBalance = 1500;

  useEffect(() => {
    lenderApi.getPools().then(setPools);
  }, []);

  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConfirmOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [confirmOpen]);

  const selectedPool = useMemo(() => pools.find((p) => p.id === selected), [pools, selected]);
  const amountNum = Number(amount) || 0;
  const valid = selectedPool && amountNum >= selectedPool.minDeposit && amountNum <= walletBalance;

  const handleConfirm = async () => {
    if (!valid || !selectedPool) return;
    setLoading(true);
    try {
      await lenderApi.deposit(amountNum, selected);
      setConfirmOpen(false);
      setResult({ status: "success", hash: randomHash() });
    } catch (e) {
      setConfirmOpen(false);
      setResult({ status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const randomHash = () =>
    "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

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

      {selectedPool && (
        <ConfirmDepositSheet
          open={confirmOpen}
          title={t("lender.deposit.confirmTitle")}
          description={t("lender.deposit.confirmDesc", {
            amount: formatCurrency(amountNum, "USDT", lang),
            pool: poolCopy[selectedPool.id],
          })}
          rows={[
            { label: t("lender.deposit.expectedApy"), value: formatPercent(selectedPool.apy, lang) },
            { label: t("lender.deposit.risk"), value: t(("common.risk." + selectedPool.risk) as "common.risk.low") },
            { label: t("lender.deposit.liquidity"), value: selectedPool.liquidityTerms },
          ]}
          cancelLabel={t("app.cancel")}
          confirmLabel={t("app.confirm")}
          loading={loading}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
        />
      )}

      <StatusDialog
        open={!!result}
        status={result?.status ?? "success"}
        title={result?.status === "success" ? "Deposit Successful" : "Deposit Failed"}
        description={
          result?.status === "success"
            ? `Your funds of ${formatCurrency(amountNum, "USD", lang)} have been deposited successfully.`
            : "The transaction could not be completed. No funds were deducted."
        }
        hash={result?.hash}
        primaryLabel={result?.status === "success" ? "OK" : "Retry"}
        onPrimary={() => {
          const wasSuccess = result?.status === "success";
          setResult(null);
          if (wasSuccess) navigate("/lender");
          else setConfirmOpen(true);
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

interface ConfirmDepositSheetProps {
  open: boolean;
  title: string;
  description: string;
  rows: { label: string; value: string }[];
  cancelLabel: string;
  confirmLabel: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDepositSheet: React.FC<ConfirmDepositSheetProps> = ({
  open,
  title,
  description,
  rows,
  cancelLabel,
  confirmLabel,
  loading,
  onCancel,
  onConfirm,
}) => {
  const overlay = useContext(PhoneFrameOverlayContext);

  const node = (
    <div
      className={clsx(
        "absolute inset-0 z-[120] flex items-end justify-center transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onCancel} />
      <div
        className={clsx(
          "relative z-10 w-full max-w-[420px] rounded-t-3xl border-t border-border-gold bg-bg-panel px-6 pt-5 pb-8 shadow-2xl transition-transform",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label={cancelLabel}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white/80 transition-colors hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="mt-5">
          <h3 className="text-center text-[20px] font-semibold text-gold-bright">{title}</h3>
          <p className="mt-6 text-center text-[14px] leading-snug text-white">{description}</p>

          <div className="mt-6 space-y-2 rounded-xl bg-surface p-4 text-[13px]">
            {rows.map((r) => (
              <Row key={r.label} label={r.label} value={r.value} />
            ))}
          </div>

          <div className="mt-16 flex gap-3">
            <PrimaryButton variant="outline" onClick={onCancel}>
              {cancelLabel}
            </PrimaryButton>
            <PrimaryButton loading={loading} onClick={onConfirm}>
              {confirmLabel}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(node, overlay ?? document.body);
};
