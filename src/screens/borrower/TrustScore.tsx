import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { BorrowerNav } from "../../components/layout/BorrowerNav";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { StatusChip } from "../../components/ui/StatusChip";
import { Skeleton } from "../../components/ui/Skeleton";
import { useI18n } from "../../i18n";
import { borrowerApi } from "../../data/services";
import type { BorrowerProfile } from "../../types";

export const TrustScore: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [p, setP] = useState<BorrowerProfile | null>(null);
  useEffect(() => {
    borrowerApi.getProfile().then(setP);
  }, []);

  if (!p) {
    return (
      <PhoneFrame title={t("borrower.trust.title")} bottomNav={<BorrowerNav />}>
        <Skeleton variant="block" className="h-40" />
      </PhoneFrame>
    );
  }

  const nextUnlock = p.trustScore < 80 ? 80 : p.trustScore < 90 ? 90 : 100;
  const unlockPct = p.trustScore / nextUnlock;

  return (
    <PhoneFrame title={t("borrower.trust.title")} bottomNav={<BorrowerNav />} onCancel={() => navigate(-1)}>
      <Card className="text-center py-6">
        <div className="gold-text text-[56px] font-semibold leading-none">{p.trustScore}</div>
        <div className="mt-1 text-[13px] text-text-muted">/ 100</div>
        <hr className="my-4 border-border-gold" />
        <div className="flex justify-between text-[13px]">
          <span className="text-text-muted">{t("borrower.trust.streak")}</span>
          <span className="font-semibold text-gold-bright">{p.streak} × {t("status.repaid")}</span>
        </div>
      </Card>

      <Card className="mt-3">
        <div className="mb-2 flex justify-between text-[13px]">
          <span className="text-text-muted">{t("borrower.trust.nextUnlock")}</span>
          <span className="font-semibold text-gold-bright">{nextUnlock}</span>
        </div>
        <ProgressBar value={unlockPct} />
        <p className="mt-3 text-[12px] text-text-muted">
          {p.trustScore >= 80 ? "Limit raised to $30 ✓" : "Reach 80 to unlock $30 loans."}
        </p>
      </Card>

      <Card className="mt-3 space-y-3 text-[13px]">
        <div className="text-[14px] font-semibold text-gold">{t("borrower.trust.improve")}</div>
        <Tip icon="⏱" text={t("borrower.trust.tipOnTime")} />
        <Tip icon="🔁" text={t("borrower.trust.tipRepeat")} />
        <Tip icon="💯" text={t("borrower.trust.tipFull")} />
      </Card>

      <Card className="mt-3 flex items-center justify-between">
        <span className="text-[13px] text-text-muted">{t("borrower.trust.lowerFee")}</span>
        <StatusChip tone="gold">-2% fee at 90</StatusChip>
      </Card>
    </PhoneFrame>
  );
};

const Tip: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <div className="flex items-start gap-3">
    <span className="text-[16px] text-gold">{icon}</span>
    <span className="text-text">{text}</span>
  </div>
);
