import React, { useEffect, useMemo, useState } from "react";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { LenderNav } from "../../components/layout/LenderNav";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { lenderApi } from "../../data/services";
import { formatDate, useI18n } from "../../i18n";
import type { Transaction, TransactionKind } from "../../types";

const VISIBLE_KINDS: TransactionKind[] = ["deposit", "withdrawal", "earning", "adjustment"];

const ACTION_KEY: Record<TransactionKind, string> = {
  deposit: "lender.history.actionDeposit",
  withdrawal: "lender.history.actionWithdrawal",
  earning: "lender.history.actionEarning",
  adjustment: "lender.history.actionAdjustment",
  "loan-issued": "lender.history.actionDeposit",
  repayment: "lender.history.actionWithdrawal",
  fee: "lender.history.actionAdjustment",
};

export const LenderHistory: React.FC = () => {
  const { t, lang } = useI18n();
  const [tx, setTx] = useState<Transaction[] | null>(null);

  useEffect(() => {
    lenderApi.getTransactions().then(setTx);
  }, []);

  const rows = useMemo(() => {
    if (!tx) return [];
    return tx
      .filter((x) => VISIBLE_KINDS.includes(x.kind))
      .slice()
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  }, [tx]);

  return (
    <PhoneFrame title={t("lender.history.title")} hideCancel bottomNav={<LenderNav />}>
      <div className="mt-1 overflow-hidden rounded-2xl border border-border-gold bg-bg-panel/80 backdrop-blur-md">
        <table className="w-full table-fixed border-collapse text-left text-[12px]">
          <thead>
            <tr className="whitespace-nowrap border-b border-border-gold/70 bg-surface-raised/40 text-[11px] uppercase tracking-wider text-text-muted">
              <th className="w-[34%] px-3 py-2.5 font-semibold">{t("lender.history.colDate")}</th>
              <th className="w-[26%] px-2 py-2.5 font-semibold">{t("lender.history.colAction")}</th>
              <th className="w-[16%] px-2 py-2.5 font-semibold">{t("lender.history.colToken")}</th>
              <th className="w-[24%] px-3 py-2.5 text-right font-semibold">{t("lender.history.colAmount")}</th>
            </tr>
          </thead>
          <tbody>
            {!tx ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-border-gold/30 last:border-b-0">
                  <td className="px-3 py-2.5"><Skeleton variant="line" className="h-3 w-20" /></td>
                  <td className="px-2 py-2.5"><Skeleton variant="line" className="h-3 w-14" /></td>
                  <td className="px-2 py-2.5"><Skeleton variant="line" className="h-3 w-10" /></td>
                  <td className="px-3 py-2.5"><Skeleton variant="line" className="ml-auto h-3 w-16" /></td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8">
                  <EmptyState title={t("lender.history.empty")} icon="🌙" />
                </td>
              </tr>
            ) : (
              rows.map((it) => {
                const negative = it.amount < 0;
                return (
                  <tr
                    key={it.id}
                    className="border-b border-border-gold/30 last:border-b-0 hover:bg-surface-raised/30"
                  >
                    <td className="px-3 py-2.5 text-text-muted">{formatDate(it.at, lang)}</td>
                    <td className="px-2 py-2.5 font-medium text-text">{t(ACTION_KEY[it.kind] as never)}</td>
                    <td className="px-2 py-2.5 text-text-muted">{it.currency}</td>
                    <td
                      className={`px-3 py-2.5 text-right font-semibold tabular-nums ${
                        negative ? "text-danger" : "gold-text"
                      }`}
                    >
                      {negative ? "" : "+"}
                      {it.amount.toFixed(2)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </PhoneFrame>
  );
};
