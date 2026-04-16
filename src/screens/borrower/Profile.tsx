import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { BorrowerNav } from "../../components/layout/BorrowerNav";
import { Card } from "../../components/ui/Card";
import { StatusChip } from "../../components/ui/StatusChip";
import { MenuRow } from "../../components/ui/SettingsItems";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { useI18n } from "../../i18n";
import { useApp } from "../../context/AppContext";
import { borrowerProfile } from "../../data/mockData";
import { useStoredAvatar } from "../../utils/useStoredAvatar";

export const BorrowerProfile: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { setAuthed, setMode } = useApp();
  const p = borrowerProfile;
  const [logoutOpen, setLogoutOpen] = useState(false);
  const avatar = useStoredAvatar("xana.borrower.avatar");

  const confirmLogout = () => {
    setLogoutOpen(false);
    setAuthed(false);
    setMode(null);
    navigate("/mode");
  };

  const currentLangLabel = lang === "ja" ? t("selectLanguage.japanese") : t("selectLanguage.english");

  return (
    <PhoneFrame title={t("borrower.profile.title")} hideCancel bottomNav={<BorrowerNav />}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card
          className="mb-4"
          interactive
          role="button"
          onClick={() => navigate("/borrower/profile/details")}
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-gold-dim bg-gradient-to-br from-[#6b5a48] to-[#2a2016]">
              {avatar && <img src={avatar} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1">
              <div className="text-[17px] font-bold text-gold-bright">{p.fullName}</div>
              <div className="text-[12.5px] text-text-muted">{p.phone}</div>
            </div>
            <span className="text-gold">›</span>
          </div>
        </Card>

        <div className="space-y-2">
          <MenuRow icon="👤" label={t("borrower.profile.personal")} value={p.fullName} onClick={() => navigate("/borrower/profile/personal")} />
          <MenuRow icon="🪪" label={t("borrower.profile.kyc")} value={<StatusChip tone="green">{t("common.kycVerified")}</StatusChip>} onClick={() => navigate("/borrower/profile/kyc")} />
          <MenuRow icon="📱" label={t("borrower.profile.zaad")} value={p.zaadNumber} onClick={() => navigate("/borrower/profile/zaad")} />
          <MenuRow icon="🌐" label={t("borrower.profile.language")} value={currentLangLabel} onClick={() => navigate("/borrower/profile/language")} />
          <MenuRow icon="💬" label={t("borrower.profile.support")} onClick={() => navigate("/borrower/profile/support")} />
          <MenuRow icon="📃" label={t("borrower.profile.terms")} onClick={() => navigate("/borrower/profile/terms")} />
        </div>

        <div className="mt-10">
          <button
            onClick={() => setLogoutOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-pill border border-border-gold bg-transparent py-4 text-[15px] font-semibold text-gold-bright transition-colors hover:bg-gold/10"
          >
            <span>↪</span> {t("borrower.profile.logout")}
          </button>
        </div>
      </motion.div>

      <ConfirmDialog
        open={logoutOpen}
        title={t("borrower.profile.logoutTitle")}
        message={t("borrower.profile.logoutMessage")}
        cancelLabel={t("app.cancel")}
        confirmLabel={t("borrower.profile.logoutConfirm")}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={confirmLogout}
      />
    </PhoneFrame>
  );
};
