import React, { useEffect, useState } from "react";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { BorrowerNav } from "../../components/layout/BorrowerNav";
import { Tabs } from "../../components/ui/Tabs";
import { Card } from "../../components/ui/Card";
import { StatusChip } from "../../components/ui/StatusChip";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { borrowerApi } from "../../data/services";
import { formatCurrency, formatDate, useI18n } from "../../i18n";
import type { Loan, Repayment, Transaction } from "../../types";

type Tab = "loans" | "repayments" | "fees" | "cases";

export const BorrowerHistory: React.FC = () => {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<Tab>("loans");
  const [data, setData] = useState<{
    loans: Loan[];
    repayments: Repayment[];
    transactions: Transaction[];
  } | null>(null);

  useEffect(() => {
    borrowerApi.getHistory().then(setData);
  }, []);

  return (
    <PhoneFrame title={t("borrower.history.title")} hideCancel bottomNav={<BorrowerNav />}>
      <Tabs
        tabs={[
          { key: "loans", label: t("borrower.history.loans") },
          { key: "repayments", label: t("borrower.history.repayments") },
          { key: "fees", label: t("borrower.history.fees") },
          { key: "cases", label: t("borrower.history.cases") },
        ]}
        active={tab}
        onChange={(k) => setTab(k as Tab)}
      />

      <div className="mt-4 space-y-2">
        {!data ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="block" className="h-16" />)
        ) : tab === "loans" ? (
          data.loans.length ? (
            data.loans.map((l) => (
              <Card key={l.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-[14px] font-semibold text-gold-bright">
                    {formatCurrency(l.principal, "USD", lang)} · {l.duration}d
                  </div>
                  <div className="text-[12px] text-text-muted">{formatDate(l.issuedAt, lang)}</div>
                </div>
                <StatusChip tone={l.status === "repaid" ? "green" : l.status === "active" ? "gold" : "red"}>
                  {t(("status." + l.status) as "status.active")}
                </StatusChip>
              </Card>
            ))
          ) : (
            <EmptyState title={t("borrower.history.empty")} icon="🌙" />
          )
        ) : tab === "repayments" ? (
          data.repayments.length ? (
            data.repayments.map((r) => (
              <Card key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-[14px] font-semibold text-text">{formatCurrency(r.amount, "USD", lang)}</div>
                  <div className="text-[12px] text-text-muted">{formatDate(r.at, lang)} · Zaad</div>
                </div>
                <StatusChip tone="green">{t("status.repaid")}</StatusChip>
              </Card>
            ))
          ) : (
            <EmptyState title={t("borrower.history.empty")} icon="🌙" />
          )
        ) : tab === "fees" ? (
          data.loans.length ? (
            data.loans.map((l) => (
              <Card key={l.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-[14px] font-semibold text-text">{formatCurrency(l.fee, "USD", lang)}</div>
                  <div className="text-[12px] text-text-muted">{l.id}</div>
                </div>
                <span className="text-[12px] text-text-muted">{formatDate(l.issuedAt, lang)}</span>
              </Card>
            ))
          ) : (
            <EmptyState title={t("borrower.history.empty")} icon="🌙" />
          )
        ) : (
          <EmptyState title={t("borrower.history.empty")} description="No open support cases." icon="💬" />
        )}
      </div>
    </PhoneFrame>
  );
};
