import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { LenderNav } from "../../components/layout/LenderNav";
import { Card } from "../../components/ui/Card";
import { StatusChip } from "../../components/ui/StatusChip";
import { LanguageSwitcher } from "../../components/ui/LanguageSwitcher";
import { Sheet } from "../../components/ui/Sheet";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { lenderProfile } from "../../data/mockData";
import { useI18n } from "../../i18n";
import { useApp } from "../../context/AppContext";

type SheetKey =
  | "wallet"
  | "email"
  | "kyc"
  | "statements"
  | "notifications"
  | "security"
  | "support"
  | "terms"
  | null;

export const LenderProfile: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { setMode, setAuthed, pushToast } = useApp();
  const [sheet, setSheet] = useState<SheetKey>(null);
  const [notif, setNotif] = useState({ deposits: true, earnings: true, product: false });

  const logout = () => {
    setAuthed(false);
    setMode(null);
    navigate("/");
  };

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    pushToast("Copied", "success");
  };

  const p = lenderProfile;

  return (
    <PhoneFrame title={t("lender.profile.title")} hideCancel bottomNav={<LenderNav />}>
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
        <MenuRow icon="💳" label={t("lender.profile.wallet")} value={p.walletAddress} onClick={() => setSheet("wallet")} />
        <MenuRow icon="📧" label={t("lender.profile.email")} value={p.email} onClick={() => setSheet("email")} />
        <MenuRow icon="🪪" label={t("lender.profile.kyc")} value={<StatusChip tone="green">{t("common.kycVerified")}</StatusChip>} onClick={() => setSheet("kyc")} />
        <MenuRow icon="📄" label={t("lender.profile.statements")} onClick={() => setSheet("statements")} />
        <MenuRow icon="🔔" label={t("lender.profile.notifications")} onClick={() => setSheet("notifications")} />
        <MenuRow icon="🔐" label={t("lender.profile.security")} onClick={() => setSheet("security")} />
        <MenuRow icon="🌐" label={t("languageSwitcher.label")} value={<LanguageSwitcher />} />
        <MenuRow icon="💬" label={t("lender.profile.support")} onClick={() => setSheet("support")} />
        <MenuRow icon="📃" label={t("lender.profile.terms")} onClick={() => setSheet("terms")} />
      </div>

      <div className="mt-10">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-pill border border-border-gold bg-transparent py-4 text-[15px] font-semibold text-gold-bright"
        >
          <span>↪</span> {t("lender.profile.logout")}
        </button>
      </div>

      <Sheet open={sheet === "wallet"} onClose={() => setSheet(null)} title="Wallet">
        <Field label="Address" value={p.walletAddress} mono />
        <Field label="Network" value="Ethereum" />
        <div className="mt-5 grid grid-cols-2 gap-3">
          <PrimaryButton variant="outline" onClick={() => copy(p.walletAddress)}>Copy</PrimaryButton>
          <PrimaryButton onClick={() => setSheet(null)}>Done</PrimaryButton>
        </div>
      </Sheet>

      <Sheet open={sheet === "email"} onClose={() => setSheet(null)} title="Linked email">
        <Field label="Current" value={p.email ?? "—"} />
        <label className="mb-2 mt-4 block text-[12px] text-text-muted">New email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-border-gold bg-bg-panel/80 px-4 py-3 text-[15px] text-text outline-none focus:border-gold"
        />
        <div className="mt-5">
          <PrimaryButton onClick={() => { pushToast("Verification email sent", "success"); setSheet(null); }}>
            Send verification
          </PrimaryButton>
        </div>
      </Sheet>

      <Sheet open={sheet === "kyc"} onClose={() => setSheet(null)} title="KYC status">
        <Field label="Status" value="Verified" />
        <Field label="Level" value="Tier 2" />
        <Field label="Verified on" value="Apr 12, 2026" />
        <p className="mt-3 text-[12.5px] text-text-muted">Tier 2 unlocks deposits up to $50,000 and cross-border withdrawals.</p>
      </Sheet>

      <Sheet open={sheet === "statements"} onClose={() => setSheet(null)} title="Statements">
        {["March 2026", "February 2026", "January 2026"].map((m) => (
          <button
            key={m}
            onClick={() => { pushToast(`Downloading ${m}`, "success"); }}
            className="mb-2 flex w-full items-center justify-between rounded-xl border border-border-gold bg-bg-panel/60 px-4 py-3 text-left text-[14px] text-gold-bright"
          >
            <span>{m}</span>
            <span className="text-text-muted">PDF ↓</span>
          </button>
        ))}
      </Sheet>

      <Sheet open={sheet === "notifications"} onClose={() => setSheet(null)} title="Notifications">
        <Toggle label="Deposit confirmations" checked={notif.deposits} onChange={(v) => setNotif({ ...notif, deposits: v })} />
        <Toggle label="Daily earnings summary" checked={notif.earnings} onChange={(v) => setNotif({ ...notif, earnings: v })} />
        <Toggle label="Product updates" checked={notif.product} onChange={(v) => setNotif({ ...notif, product: v })} />
      </Sheet>

      <Sheet open={sheet === "security"} onClose={() => setSheet(null)} title="Security">
        <ActionRow label="Change password" onClick={() => pushToast("Reset link sent", "success")} />
        <ActionRow label="Two-factor authentication" value="On" onClick={() => pushToast("2FA settings opened", "default")} />
        <ActionRow label="Active sessions" value="This device" onClick={() => pushToast("No other sessions", "default")} />
      </Sheet>

      <Sheet open={sheet === "support"} onClose={() => setSheet(null)} title="Support">
        <Field label="Email" value="support@xana.app" />
        <Field label="Hours" value="24/7" />
        <Field label="Response time" value="< 4 hours" />
        <div className="mt-5">
          <PrimaryButton onClick={() => { window.location.href = "mailto:support@xana.app"; }}>
            Contact support
          </PrimaryButton>
        </div>
      </Sheet>

      <Sheet open={sheet === "terms"} onClose={() => setSheet(null)} title="Terms & policies">
        <div className="space-y-2 text-[13px] text-text-muted">
          <p>By using XANA MFB, you agree to our Terms of Service and Privacy Policy. Your deposits earn interest through diversified micro-lending positions and are withdrawable subject to product-specific lock-up windows.</p>
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

const Field: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-border-gold bg-bg-panel/60 px-4 py-3">
    <span className="text-[12.5px] text-text-muted">{label}</span>
    <span className={"text-[14px] font-semibold text-gold-bright " + (mono ? "font-mono" : "")}>{value}</span>
  </div>
);

const ActionRow: React.FC<{ label: string; value?: string; onClick: () => void }> = ({ label, value, onClick }) => (
  <button
    onClick={onClick}
    className="mb-2 flex w-full items-center justify-between rounded-xl border border-border-gold bg-bg-panel/60 px-4 py-3 text-left"
  >
    <span className="text-[14px] font-semibold text-gold-bright">{label}</span>
    <span className="flex items-center gap-2 text-[12.5px] text-text-muted">
      {value}
      <span className="text-gold">›</span>
    </span>
  </button>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <div className="mb-2 flex items-center justify-between rounded-xl border border-border-gold bg-bg-panel/60 px-4 py-3">
    <span className="text-[14px] text-gold-bright">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={"h-6 w-11 rounded-full p-0.5 transition-colors " + (checked ? "bg-gold" : "bg-white/20")}
    >
      <span className={"block h-5 w-5 rounded-full bg-white transition-transform " + (checked ? "translate-x-5" : "translate-x-0")} />
    </button>
  </div>
);
