import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { BorrowerNav } from "../../components/layout/BorrowerNav";
import { Card } from "../../components/ui/Card";
import { StatusChip } from "../../components/ui/StatusChip";
import { LanguageSwitcher } from "../../components/ui/LanguageSwitcher";
import { Sheet } from "../../components/ui/Sheet";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { useI18n } from "../../i18n";
import { useApp } from "../../context/AppContext";
import { borrowerProfile } from "../../data/mockData";

type SheetKey = "personal" | "kyc" | "zaad" | "support" | "terms" | null;

export const BorrowerProfile: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { setAuthed, setMode, pushToast } = useApp();
  const p = borrowerProfile;
  const [sheet, setSheet] = useState<SheetKey>(null);

  const logout = () => {
    setAuthed(false);
    setMode(null);
    navigate("/");
  };

  return (
    <PhoneFrame title={t("borrower.profile.title")} hideCancel bottomNav={<BorrowerNav />}>
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
        <MenuRow icon="👤" label={t("borrower.profile.personal")} value={p.fullName} onClick={() => setSheet("personal")} />
        <MenuRow icon="🪪" label={t("borrower.profile.kyc")} value={<StatusChip tone="green">{t("common.kycVerified")}</StatusChip>} onClick={() => setSheet("kyc")} />
        <MenuRow icon="📱" label={t("borrower.profile.zaad")} value={p.zaadNumber} onClick={() => setSheet("zaad")} />
        <MenuRow icon="🌐" label={t("borrower.profile.language")} value={<LanguageSwitcher />} />
        <MenuRow icon="💬" label={t("borrower.profile.support")} onClick={() => setSheet("support")} />
        <MenuRow icon="📃" label={t("borrower.profile.terms")} onClick={() => setSheet("terms")} />
      </div>

      <div className="mt-10">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-pill border border-border-gold bg-transparent py-4 text-[15px] font-semibold text-gold-bright"
        >
          <span>↪</span> {t("borrower.profile.logout")}
        </button>
      </div>

      <Sheet open={sheet === "personal"} onClose={() => setSheet(null)} title="Personal info">
        <Field label="Full name" value={p.fullName} />
        <Field label="Phone" value={p.phone} />
        <Field label="National ID" value={p.idNumber ?? "—"} />
        <Field label="City" value={p.city ?? "—"} />
        <div className="mt-5">
          <PrimaryButton onClick={() => { setSheet(null); navigate("/borrower/onboarding"); }}>
            Edit details
          </PrimaryButton>
        </div>
      </Sheet>

      <Sheet open={sheet === "kyc"} onClose={() => setSheet(null)} title="KYC status">
        <Field label="Status" value="Verified" />
        <Field label="Level" value="Tier 1" />
        <Field label="Verified on" value="Apr 10, 2026" />
        <p className="mt-3 text-[12.5px] text-text-muted">Tier 1 unlocks borrowing up to $20. Complete Tier 2 to raise your limit.</p>
      </Sheet>

      <Sheet open={sheet === "zaad"} onClose={() => setSheet(null)} title="Zaad number">
        <Field label="Current Zaad" value={p.zaadNumber} />
        <p className="mt-2 text-[12.5px] text-text-muted">Loans are disbursed to this Zaad wallet and repayments are pulled from it.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <PrimaryButton variant="outline" onClick={() => { pushToast("Verification code sent", "success"); }}>
            Re-verify
          </PrimaryButton>
          <PrimaryButton onClick={() => { setSheet(null); pushToast("Update requested", "success"); }}>
            Change
          </PrimaryButton>
        </div>
      </Sheet>

      <Sheet open={sheet === "support"} onClose={() => setSheet(null)} title="Support">
        <Field label="WhatsApp" value="+252 61 000 0000" />
        <Field label="Email" value="help@xana.app" />
        <Field label="Hours" value="Sat–Thu, 8am–8pm" />
        <div className="mt-5">
          <PrimaryButton onClick={() => { window.location.href = "tel:+252610000000"; }}>
            Call support
          </PrimaryButton>
        </div>
      </Sheet>

      <Sheet open={sheet === "terms"} onClose={() => setSheet(null)} title="Terms & policies">
        <div className="space-y-2 text-[13px] text-text-muted">
          <p>By borrowing with XANA MFB you agree to repay the loan amount plus the disclosed service fee by the due date. Late repayment affects your Trust Score and future limit.</p>
          <p>Full policies: xana.app/legal</p>
        </div>
      </Sheet>
    </PhoneFrame>
  );
};

const MenuRow: React.FC<{ icon: string; label: string; value?: React.ReactNode; onClick?: () => void }> = ({ icon, label, value, onClick }) => (
  <Card
    className="flex items-center gap-4 py-4"
    interactive={Boolean(onClick)}
    role={onClick ? "button" : undefined}
    onClick={onClick}
  >
    <span className="w-6 text-center text-[18px] text-gold">{icon}</span>
    <span className="flex-1 text-[15px] font-semibold text-gold-bright">{label}</span>
    <span className="text-[12.5px] text-text-muted">{value}</span>
    <span className="text-gold">›</span>
  </Card>
);

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-border-gold bg-bg-panel/60 px-4 py-3">
    <span className="text-[12.5px] text-text-muted">{label}</span>
    <span className="text-[14px] font-semibold text-gold-bright">{value}</span>
  </div>
);
