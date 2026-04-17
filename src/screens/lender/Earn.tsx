import React, { useEffect, useState } from "react";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { LenderNav } from "../../components/layout/LenderNav";
import { Card } from "../../components/ui/Card";
import { BalanceCard } from "../../components/ui/BalanceCard";
import clsx from "../../utils/clsx";
import { Sparkline } from "../../components/ui/Sparkline";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatCurrency, formatPercent, useI18n } from "../../i18n";
import { lenderApi } from "../../data/services";
import type { LenderOverview } from "../../types";

type Range = "daily" | "monthly" | "lifetime";

export const Earn: React.FC = () => {
  const { t, lang } = useI18n();
  const [ov, setOv] = useState<LenderOverview | null>(null);
  const [range, setRange] = useState<Range>("daily");
  useEffect(() => {
    lenderApi.getOverview().then(setOv);
  }, []);

  if (!ov) {
    return (
      <PhoneFrame title={t("lender.earn.title")} hideCancel bottomNav={<LenderNav />}>
        <Skeleton variant="block" className="h-40" />
      </PhoneFrame>
    );
  }

  const monthly = ov.earningsToday * 30;
  const values: Record<Range, number> = {
    daily: ov.earningsToday,
    monthly,
    lifetime: ov.totalEarnings,
  };
  const ranges: { key: Range; label: string }[] = [
    { key: "daily", label: t("lender.earn.daily") },
    { key: "monthly", label: t("lender.earn.monthly") },
    { key: "lifetime", label: t("lender.earn.lifetime") },
  ];

  const activeLabel = ranges.find((r) => r.key === range)?.label ?? "";
  const formattedAmount = formatCurrency(values[range], "USD", lang).replace(/[^\d.,]/g, "");
  const earningsSeries = ov.earningsTrend[range];

  return (
    <PhoneFrame title={t("lender.earn.title")} hideCancel bottomNav={<LenderNav />}>
      <div className="mt-1 flex">
        {ranges.map((r) => {
          const isActive = r.key === range;
          return (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={clsx(
                "relative flex-1 whitespace-nowrap py-2 text-center text-[15px] font-semibold transition-colors",
                isActive ? "text-gold" : "text-text-muted hover:text-text",
              )}
            >
              {r.label}
              {isActive && (
                <span className="absolute inset-x-4 -bottom-px h-[2px] rounded-full bg-gold" />
              )}
            </button>
          );
        })}
      </div>

      <BalanceCard
        className="mt-3"
        label={activeLabel.toUpperCase()}
        amount={formattedAmount}
        centered
      />

      <SectionLabel right={formatPercent(ov.apy, lang)}>{t("lender.earn.apyTrend")}</SectionLabel>
      <Card>
        <Sparkline data={ov.apyTrend} height={96} />
      </Card>

      <SectionLabel right={formatCurrency(values[range], "USD", lang)}>
        {activeLabel} {t("lender.earn.trendEarnings")}
      </SectionLabel>
      <Card>
        <Sparkline data={earningsSeries} color="#E5B057" height={96} />
      </Card>

      <SectionLabel right={formatPercent(ov.utilizationTrend[ov.utilizationTrend.length - 1], lang)}>
        {t("lender.earn.utilization")}
      </SectionLabel>
      <Card>
        <Sparkline data={ov.utilizationTrend} color="#4ADE80" height={80} />
      </Card>

      <SectionLabel right={formatPercent(ov.reserveCoverage, lang)}>{t("lender.earn.reserve")}</SectionLabel>
      <Card>
        <ProgressBar value={ov.reserveCoverage} />
        <p className="mt-3 text-[12px] text-text-muted">Reserve pool protects against borrower defaults.</p>
      </Card>
    </PhoneFrame>
  );
};
