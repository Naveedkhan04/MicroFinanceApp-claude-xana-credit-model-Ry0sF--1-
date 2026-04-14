import React, { useEffect, useState } from "react";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { LenderNav } from "../../components/layout/LenderNav";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Sparkline } from "../../components/ui/Sparkline";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatCurrency, formatPercent, useI18n } from "../../i18n";
import { lenderApi } from "../../data/services";
import type { LenderOverview } from "../../types";

export const Earn: React.FC = () => {
  const { t, lang } = useI18n();
  const [ov, setOv] = useState<LenderOverview | null>(null);
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

  return (
    <PhoneFrame title={t("lender.earn.title")} hideCancel bottomNav={<LenderNav />}>
      <h2 className="mb-4 text-center text-[22px] font-semibold text-gold">{t("lender.earn.title")}</h2>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label={t("lender.earn.daily")} value={formatCurrency(ov.earningsToday, "USD", lang)} accent />
        <StatCard label={t("lender.earn.monthly")} value={formatCurrency(monthly, "USD", lang)} />
        <StatCard label={t("lender.earn.lifetime")} value={formatCurrency(ov.totalEarnings, "USD", lang)} />
      </div>

      <SectionLabel right={formatPercent(ov.apy, lang)}>{t("lender.earn.apyTrend")}</SectionLabel>
      <Card>
        <Sparkline data={ov.apyTrend} height={88} />
      </Card>

      <SectionLabel right={formatPercent(ov.utilizationTrend[ov.utilizationTrend.length - 1], lang)}>
        {t("lender.earn.utilization")}
      </SectionLabel>
      <Card>
        <Sparkline data={ov.utilizationTrend} color="#4ADE80" height={72} />
      </Card>

      <SectionLabel right={formatPercent(ov.reserveCoverage, lang)}>{t("lender.earn.reserve")}</SectionLabel>
      <Card>
        <ProgressBar value={ov.reserveCoverage} />
        <p className="mt-3 text-[12px] text-text-muted">Reserve pool protects against borrower defaults.</p>
      </Card>
    </PhoneFrame>
  );
};
