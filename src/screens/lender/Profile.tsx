import React from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { LenderNav } from "../../components/layout/LenderNav";
import { Card } from "../../components/ui/Card";
import { StatusChip } from "../../components/ui/StatusChip";
import { LanguageSwitcher } from "../../components/ui/LanguageSwitcher";
import { lenderProfile } from "../../data/mockData";
import { useI18n } from "../../i18n";
import { useApp } from "../../context/AppContext";

export const LenderProfile: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { setMode, setAuthed } = useApp();

  const logout = () => {
    setAuthed(false);
    setMode(null);
    navigate("/");
  };

  const p = lenderProfile;

  return (
    <PhoneFrame title={t("lender.profile.title")} hideCancel bottomNav={<LenderNav />}>
      <h2 className="mb-4 text-center text-[22px] font-semibold text-gold">{t("lender.profile.title")}</h2>

      <Card className="mb-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full border-2 border-gold-dim bg-gradient-to-br from-[#6b5a48] to-[#2a2016]" />
          <div className="flex-1">
            <div className="text-[17px] font-bold text-gold-bright">{p.walletAddress}</div>
            <div className="text-[12.5px] text-text-muted">{p.email}</div>
          </div>
          <StatusChip tone="green">{t("common.kycVerified")}</StatusChip>
        </div>
      </Card>

      <div className="space-y-2">
        <MenuRow icon="💳" label={t("lender.profile.wallet")} value={p.walletAddress} />
        <MenuRow icon="📧" label={t("lender.profile.email")} value={p.email} />
        <MenuRow icon="🪪" label={t("lender.profile.kyc")} value={<StatusChip tone="green">{t("common.kycVerified")}</StatusChip>} />
        <MenuRow icon="📄" label={t("lender.profile.statements")} />
        <MenuRow icon="🔔" label={t("lender.profile.notifications")} />
        <MenuRow icon="🔐" label={t("lender.profile.security")} />
        <MenuRow
          icon="🌐"
          label={t("languageSwitcher.label")}
          value={<LanguageSwitcher />}
        />
        <MenuRow icon="💬" label={t("lender.profile.support")} />
        <MenuRow icon="📃" label={t("lender.profile.terms")} />
      </div>

      <div className="mt-10">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-pill border border-border-gold bg-transparent py-4 text-[15px] font-semibold text-gold-bright"
        >
          <span>↪</span> {t("lender.profile.logout")}
        </button>
      </div>
    </PhoneFrame>
  );
};

const MenuRow: React.FC<{ icon: string; label: string; value?: React.ReactNode }> = ({ icon, label, value }) => (
  <Card className="flex items-center gap-4 py-4">
    <span className="w-6 text-center text-[18px] text-gold">{icon}</span>
    <span className="flex-1 text-[15px] font-semibold text-gold-bright">{label}</span>
    <span className="text-[12.5px] text-text-muted">{value}</span>
    <span className="text-gold">›</span>
  </Card>
);
