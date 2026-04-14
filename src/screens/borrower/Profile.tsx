import React from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { BorrowerNav } from "../../components/layout/BorrowerNav";
import { Card } from "../../components/ui/Card";
import { StatusChip } from "../../components/ui/StatusChip";
import { LanguageSwitcher } from "../../components/ui/LanguageSwitcher";
import { useI18n } from "../../i18n";
import { useApp } from "../../context/AppContext";
import { borrowerProfile } from "../../data/mockData";

export const BorrowerProfile: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { setAuthed, setMode } = useApp();
  const p = borrowerProfile;

  const logout = () => {
    setAuthed(false);
    setMode(null);
    navigate("/");
  };

  return (
    <PhoneFrame title={t("borrower.profile.title")} hideCancel bottomNav={<BorrowerNav />}>
      <h2 className="mb-4 text-center text-[22px] font-semibold text-gold">{t("borrower.profile.title")}</h2>

      <Card className="mb-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full border-2 border-gold-dim bg-gradient-to-br from-[#6b5a48] to-[#2a2016]" />
          <div className="flex-1">
            <div className="text-[17px] font-bold text-gold-bright">{p.fullName}</div>
            <div className="text-[12.5px] text-text-muted">{p.phone}</div>
          </div>
          <StatusChip tone="green">{t("common.kycVerified")}</StatusChip>
        </div>
      </Card>

      <div className="space-y-2">
        <MenuRow icon="👤" label={t("borrower.profile.personal")} value={p.fullName} />
        <MenuRow icon="🪪" label={t("borrower.profile.kyc")} value={<StatusChip tone="green">{t("common.kycVerified")}</StatusChip>} />
        <MenuRow icon="📱" label={t("borrower.profile.zaad")} value={p.zaadNumber} />
        <MenuRow icon="🌐" label={t("borrower.profile.language")} value={<LanguageSwitcher />} />
        <MenuRow icon="💬" label={t("borrower.profile.support")} />
        <MenuRow icon="📃" label={t("borrower.profile.terms")} />
      </div>

      <div className="mt-10">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-pill border border-border-gold bg-transparent py-4 text-[15px] font-semibold text-gold-bright"
        >
          <span>↪</span> {t("borrower.profile.logout")}
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
