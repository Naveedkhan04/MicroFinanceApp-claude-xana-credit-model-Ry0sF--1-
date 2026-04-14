import React, { useEffect, useMemo, useState } from "react";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { LenderNav } from "../../components/layout/LenderNav";
import { Tabs } from "../../components/ui/Tabs";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { lenderApi } from "../../data/services";
import { formatCurrency, formatDate, useI18n } from "../../i18n";
import type { Transaction, TransactionKind } from "../../types";

export const LenderHistory: React.FC = () => {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<TransactionKind | "all">("deposit");
  const [tx, setTx] = useState<Transaction[] | null>(null);

  useEffect(() => {
    lenderApi.getTransactions().then(setTx);
  }, []);

  const items = useMemo(() => {
    if (!tx) return [];
    return tx.filter((x) => x.kind === tab);
  }, [tx, tab]);

  return (
    <PhoneFrame title={t("lender.history.title")} hideCancel bottomNav={<LenderNav />}>
      <h2 className="mb-4 text-center text-[22px] font-semibold text-gold">{t("lender.history.title")}</h2>

      <Tabs
        tabs={[
          { key: "deposit", label: t("lender.history.deposits") },
          { key: "withdrawal", label: t("lender.history.withdrawals") },
          { key: "earning", label: t("lender.history.earnings") },
          { key: "adjustment", label: t("lender.history.adjustments") },
        ]}
        active={tab}
        onChange={(k) => setTab(k as TransactionKind)}
      />

      <div className="mt-4 space-y-2">
        {!tx ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="block" className="h-16" />)
        ) : items.length === 0 ? (
          <EmptyState title={t("lender.history.empty")} icon="🌙" />
        ) : (
          items.map((it) => (
            <Card key={it.id} className="flex items-center justify-between py-3">
              <div>
                <div className="text-[14px] font-semibold capitalize text-text">{it.kind}</div>
                <div className="text-[12px] text-text-muted">{formatDate(it.at, lang)}</div>
                {it.note && <div className="text-[11px] text-text-muted">{it.note}</div>}
              </div>
              <div className="gold-text text-[16px] font-semibold">
                {it.amount > 0 ? "+" : ""}
                {formatCurrency(it.amount, it.currency, lang)}
              </div>
            </Card>
          ))
        )}
      </div>
    </PhoneFrame>
  );
};
