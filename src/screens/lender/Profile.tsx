import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { LenderNav } from "../../components/layout/LenderNav";
import { Card } from "../../components/ui/Card";
import { StatusChip } from "../../components/ui/StatusChip";
import { MenuRow } from "../../components/ui/SettingsItems";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { lenderProfile } from "../../data/mockData";
import { useI18n } from "../../i18n";
import { useApp } from "../../context/AppContext";
import { useStoredAvatar } from "../../utils/useStoredAvatar";

export const LenderProfile: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { setMode, setAuthed } = useApp();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const avatar = useStoredAvatar("xana.lender.avatar");

  const p = lenderProfile;

  const confirmLogout = () => {
    setLogoutOpen(false);
    setAuthed(false);
    setMode(null);
    navigate("/mode");
  };

  const currentLangLabel = lang === "ja" ? t("selectLanguage.japanese") : t("selectLanguage.english");

  return (
    <PhoneFrame title={t("lender.profile.title")} hideCancel bottomNav={<LenderNav />}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card
          className="mb-4"
          interactive
          role="button"
          onClick={() => navigate("/lender/profile/details")}
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-gold-dim bg-gradient-to-br from-[#6b5a48] to-[#2a2016]">
              {avatar && <img src={avatar} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1">
              <div className="text-[17px] font-bold text-gold-bright">{p.email}</div>
              <div className="font-mono text-[12.5px] text-text-muted">{p.walletAddress}</div>
            </div>
            <span className="text-gold">›</span>
          </div>
        </Card>

        <div className="space-y-2">
          <MenuRow icon="💳" label={t("lender.profile.wallet")} value={p.walletAddress} onClick={() => navigate("/lender/profile/wallet")} />
          <MenuRow icon="📧" label={t("lender.profile.email")} value={p.email ?? "—"} onClick={() => navigate("/lender/profile/email")} />
          <MenuRow icon="🪪" label={t("lender.profile.kyc")} value={<StatusChip tone="green">{t("common.kycVerified")}</StatusChip>} onClick={() => navigate("/lender/profile/kyc")} />
          <MenuRow icon="📄" label={t("lender.profile.statements")} onClick={() => navigate("/lender/profile/statements")} />
          <MenuRow icon="🔔" label={t("lender.profile.notifications")} onClick={() => navigate("/lender/profile/notifications")} />
          <MenuRow icon="🔐" label={t("lender.profile.security")} onClick={() => navigate("/lender/profile/security")} />
          <MenuRow icon="🌐" label={t("languageSwitcher.label")} value={currentLangLabel} onClick={() => navigate("/lender/profile/language")} />
          <MenuRow icon="💬" label={t("lender.profile.support")} onClick={() => navigate("/lender/profile/support")} />
          <MenuRow icon="📃" label={t("lender.profile.terms")} onClick={() => navigate("/lender/profile/terms")} />
        </div>

        <div className="mt-10">
          <button
            onClick={() => setLogoutOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-pill border border-border-gold bg-transparent py-4 text-[15px] font-semibold text-gold-bright transition-colors hover:bg-gold/10"
          >
            <span>↪</span> {t("lender.profile.logout")}
          </button>
        </div>
      </motion.div>

      <ConfirmDialog
        open={logoutOpen}
        title={t("lender.profile.logoutTitle")}
        message={t("lender.profile.logoutMessage")}
        cancelLabel={t("app.cancel")}
        confirmLabel={t("lender.profile.logoutConfirm")}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={confirmLogout}
      />
    </PhoneFrame>
  );
};
