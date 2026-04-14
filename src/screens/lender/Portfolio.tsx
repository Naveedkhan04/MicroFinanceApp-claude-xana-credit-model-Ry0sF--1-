import React, { useEffect, useState } from "react";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { LenderNav } from "../../components/layout/LenderNav";
import { Card } from "../../components/ui/Card";
import { AllocationBars } from "../../components/ui/AllocationBars";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { StatusChip } from "../../components/ui/StatusChip";
import { StatCard } from "../../components/ui/StatCard";
import { Skeleton } from "../../components/ui/Skeleton";
import { lenderApi } from "../../data/services";
import { formatCurrency, formatPercent, useI18n } from "../../i18n";
import type { LenderOverview } from "../../types";

export const Portfolio: React.FC = () => {
  const { t, lang } = useI18n();
  const [ov, setOv] = useState<LenderOverview | null>(null);
  useEffect(() => {
    lenderApi.getOverview().then(setOv);
  }, []);

  if (!ov) {
    return (
      <PhoneFrame title={t("lender.portfolio.title")} hideCancel bottomNav={<LenderNav />}>
        <Skeleton variant="block" className="h-40" />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame title={t("lender.portfolio.title")} hideCancel bottomNav={<LenderNav />}>
      <h2 className="mb-4 text-center text-[22px] font-semibold text-gold">{t("lender.portfolio.title")}</h2>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label={t("lender.portfolio.principal")} value={formatCurrency(ov.activeCapital, "USD", lang)} accent />
        <StatCard label={t("lender.portfolio.atRisk")} value={formatPercent(ov.atRiskExposure, lang)} />
      </div>

      <SectionLabel>{t("lender.portfolio.byType")}</SectionLabel>
      <Card>
        <AllocationBars items={ov.allocation.byType} />
      </Card>

      <SectionLabel>{t("lender.portfolio.byDuration")}</SectionLabel>
      <Card>
        <AllocationBars items={ov.allocation.byDuration} />
      </Card>

      <SectionLabel>{t("lender.portfolio.byPerformance")}</SectionLabel>
      <Card className="space-y-2">
        {ov.allocation.byPerformance.map((p) => {
          const tone = p.label === "Performing" ? "green" : p.label === "Watchlist" ? "amber" : "red";
          return (
            <div key={p.label} className="flex items-center justify-between">
              <StatusChip tone={tone as "green" | "amber" | "red"}>{p.label}</StatusChip>
              <span className="font-semibold text-text">{formatPercent(p.value, lang)}</span>
            </div>
          );
        })}
      </Card>
    </PhoneFrame>
  );
};
