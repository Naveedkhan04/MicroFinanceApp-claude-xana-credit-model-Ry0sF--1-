import React, { useEffect, useMemo, useState } from "react";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { BorrowerNav } from "../../components/layout/BorrowerNav";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { borrowerApi } from "../../data/services";
import { formatDate, useI18n } from "../../i18n";
import type { Loan, Repayment, Transaction } from "../../types";

type RowKind = "loan" | "repayment" | "fee";

interface Row {
  id: string;
  kind: RowKind;
  at: string;
  amount: number;
  currency: "USD";
}

const ACTION_KEY: Record<RowKind, string> = {
  loan: "borrower.history.actionLoan",
  repayment: "borrower.history.actionRepayment",
  fee: "borrower.history.actionFee",
};

export const BorrowerHistory: React.FC = () => {
  const { t, lang } = useI18n();
  const [data, setData] = useState<{
    loans: Loan[];
    repayments: Repayment[];
    transactions: Transaction[];
  } | null>(null);

  useEffect(() => {
    borrowerApi.getHistory().then(setData);
  }, []);

  const rows = useMemo<Row[]>(() => {
    if (!data) return [];
    const out: Row[] = [];
    data.loans.forEach((l) => {
      out.push({ id: `${l.id}-loan`, kind: "loan", at: l.issuedAt, amount: l.principal, currency: "USD" });
      if (l.fee > 0) {
        out.push({ id: `${l.id}-fee`, kind: "fee", at: l.issuedAt, amount: -l.fee, currency: "USD" });
      }
    });
    data.repayments.forEach((r) => {
      out.push({ id: r.id, kind: "repayment", at: r.at, amount: -r.amount, currency: "USD" });
    });
    return out.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  }, [data]);

  return (
    <PhoneFrame title={t("borrower.history.title")} hideCancel bottomNav={<BorrowerNav />}>
      <div className="mt-1 overflow-hidden rounded-2xl border border-border-gold bg-bg-panel/80 backdrop-blur-md">
        <table className="w-full table-fixed border-collapse text-left text-[12px]">
          <thead>
            <tr className="border-b border-border-gold/70 bg-surface-raised/40 text-[11px] uppercase tracking-wider text-text-muted">
              <th className="w-[34%] px-3 py-2.5 font-semibold">{t("borrower.history.colDate")}</th>
              <th className="w-[26%] px-2 py-2.5 font-semibold">{t("borrower.history.colAction")}</th>
              <th className="w-[16%] px-2 py-2.5 font-semibold">{t("borrower.history.colToken")}</th>
              <th className="w-[24%] px-3 py-2.5 text-right font-semibold">{t("borrower.history.colAmount")}</th>
            </tr>
          </thead>
          <tbody>
            {!data ? (
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
                  <EmptyState title={t("borrower.history.empty")} icon="🌙" />
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
