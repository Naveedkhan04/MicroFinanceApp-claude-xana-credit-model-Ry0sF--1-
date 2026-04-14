import React from "react";
import { BottomNav } from "./BottomNav";
import { EarnIcon, HistoryIcon, HomeIcon, PortfolioIcon, ProfileIcon } from "./NavIcons";
import { useI18n } from "../../i18n";

export const LenderNav: React.FC = () => {
  const { t } = useI18n();
  return (
    <BottomNav
      items={[
        { to: "/lender", label: t("nav.lender.home"), icon: <HomeIcon /> },
        { to: "/lender/earn", label: t("nav.lender.earn"), icon: <EarnIcon /> },
        { to: "/lender/portfolio", label: t("nav.lender.portfolio"), icon: <PortfolioIcon /> },
        { to: "/lender/history", label: t("nav.lender.history"), icon: <HistoryIcon /> },
        { to: "/lender/profile", label: t("nav.lender.profile"), icon: <ProfileIcon /> },
      ]}
    />
  );
};
