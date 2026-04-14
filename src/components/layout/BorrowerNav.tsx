import React from "react";
import { BottomNav } from "./BottomNav";
import { BorrowIcon, HistoryIcon, HomeIcon, ProfileIcon, RepayIcon } from "./NavIcons";
import { useI18n } from "../../i18n";

export const BorrowerNav: React.FC = () => {
  const { t } = useI18n();
  return (
    <BottomNav
      items={[
        { to: "/borrower", label: t("nav.borrower.home"), icon: <HomeIcon /> },
        { to: "/borrower/borrow", label: t("nav.borrower.borrow"), icon: <BorrowIcon /> },
        { to: "/borrower/repay", label: t("nav.borrower.repay"), icon: <RepayIcon /> },
        { to: "/borrower/history", label: t("nav.borrower.history"), icon: <HistoryIcon /> },
        { to: "/borrower/profile", label: t("nav.borrower.profile"), icon: <ProfileIcon /> },
      ]}
    />
  );
};
