import React from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HeroUIProvider } from "@heroui/react";

import { AppProvider, useApp } from "./context/AppContext";
import { I18nProvider } from "./i18n";

import { ModeSelect } from "./screens/ModeSelect";
import { SelectLanguage } from "./screens/SelectLanguage";

// Lender
import { LenderHome } from "./screens/lender/LenderHome";
import { Deposit as LenderDeposit } from "./screens/lender/Deposit";
import { Earn as LenderEarn } from "./screens/lender/Earn";
import { Portfolio as LenderPortfolio } from "./screens/lender/Portfolio";
import { Withdraw as LenderWithdraw } from "./screens/lender/Withdraw";
import { LenderHistory } from "./screens/lender/History";
import { LenderProfile } from "./screens/lender/Profile";
import { LenderProfileDetails } from "./screens/lender/profile/ProfileDetails";
import { LenderWalletPage } from "./screens/lender/profile/Wallet";
import { LenderEmailPage } from "./screens/lender/profile/Email";
import { LenderKycPage } from "./screens/lender/profile/Kyc";
import { LenderStatementsPage } from "./screens/lender/profile/Statements";
import { LenderNotificationsPage } from "./screens/lender/profile/Notifications";
import { LenderSecurityPage } from "./screens/lender/profile/Security";
import { LenderLanguagePage } from "./screens/lender/profile/Language";
import { LenderSupportPage } from "./screens/lender/profile/Support";
import { LenderTermsPage } from "./screens/lender/profile/Terms";

// Borrower
import { Welcome as BorrowerWelcome } from "./screens/borrower/Welcome";
import { OTPLogin } from "./screens/borrower/OTPLogin";
import { Onboarding } from "./screens/borrower/Onboarding";
import { BorrowerHome } from "./screens/borrower/BorrowerHome";
import { BorrowAmount } from "./screens/borrower/BorrowAmount";
import { SelectDuration } from "./screens/borrower/SelectDuration";
import { LoanReview } from "./screens/borrower/LoanReview";
import { Processing } from "./screens/borrower/Processing";
import { ActiveLoan } from "./screens/borrower/ActiveLoan";
import { Repay } from "./screens/borrower/Repay";
import { TrustScore } from "./screens/borrower/TrustScore";
import { BorrowerHistory } from "./screens/borrower/History";
import { BorrowerProfile } from "./screens/borrower/Profile";
import { BorrowerProfileDetails } from "./screens/borrower/profile/ProfileDetails";
import { BorrowerPersonalPage } from "./screens/borrower/profile/Personal";
import { BorrowerKycPage } from "./screens/borrower/profile/Kyc";
import { BorrowerZaadPage } from "./screens/borrower/profile/Zaad";
import { BorrowerLanguagePage } from "./screens/borrower/profile/Language";
import { BorrowerSupportPage } from "./screens/borrower/profile/Support";
import { BorrowerTermsPage } from "./screens/borrower/profile/Terms";
import { BorrowFlowProvider } from "./screens/borrower/BorrowFlow";

const BorrowerGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authed, mode } = useApp();
  if (!authed || mode !== "borrower") return <Navigate to="/borrower/welcome" replace />;
  return <>{children}</>;
};

const LenderGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authed, mode } = useApp();
  if (!authed || mode !== "lender") return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AnimatedOutlet: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18 }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const Shell: React.FC = () => {
  return (
    <AnimatedOutlet>
      <Routes>
        <Route path="/" element={<SelectLanguage />} />
        <Route path="/mode" element={<ModeSelect />} />

        {/* Lender */}
        <Route path="/lender" element={<LenderGuard><LenderHome /></LenderGuard>} />
        <Route path="/lender/deposit" element={<LenderGuard><LenderDeposit /></LenderGuard>} />
        <Route path="/lender/earn" element={<LenderGuard><LenderEarn /></LenderGuard>} />
        <Route path="/lender/portfolio" element={<LenderGuard><LenderPortfolio /></LenderGuard>} />
        <Route path="/lender/withdraw" element={<LenderGuard><LenderWithdraw /></LenderGuard>} />
        <Route path="/lender/history" element={<LenderGuard><LenderHistory /></LenderGuard>} />
        <Route path="/lender/profile" element={<LenderGuard><LenderProfile /></LenderGuard>} />
        <Route path="/lender/profile/details" element={<LenderGuard><LenderProfileDetails /></LenderGuard>} />
        <Route path="/lender/profile/wallet" element={<LenderGuard><LenderWalletPage /></LenderGuard>} />
        <Route path="/lender/profile/email" element={<LenderGuard><LenderEmailPage /></LenderGuard>} />
        <Route path="/lender/profile/kyc" element={<LenderGuard><LenderKycPage /></LenderGuard>} />
        <Route path="/lender/profile/statements" element={<LenderGuard><LenderStatementsPage /></LenderGuard>} />
        <Route path="/lender/profile/notifications" element={<LenderGuard><LenderNotificationsPage /></LenderGuard>} />
        <Route path="/lender/profile/security" element={<LenderGuard><LenderSecurityPage /></LenderGuard>} />
        <Route path="/lender/profile/language" element={<LenderGuard><LenderLanguagePage /></LenderGuard>} />
        <Route path="/lender/profile/support" element={<LenderGuard><LenderSupportPage /></LenderGuard>} />
        <Route path="/lender/profile/terms" element={<LenderGuard><LenderTermsPage /></LenderGuard>} />

        {/* Borrower */}
        <Route path="/borrower/welcome" element={<BorrowerWelcome />} />
        <Route path="/borrower/otp" element={<OTPLogin />} />
        <Route path="/borrower/onboarding" element={<Onboarding />} />

        <Route path="/borrower" element={<BorrowerGuard><BorrowerHome /></BorrowerGuard>} />
        <Route path="/borrower/borrow" element={<BorrowerGuard><BorrowAmount /></BorrowerGuard>} />
        <Route path="/borrower/duration" element={<BorrowerGuard><SelectDuration /></BorrowerGuard>} />
        <Route path="/borrower/review" element={<BorrowerGuard><LoanReview /></BorrowerGuard>} />
        <Route path="/borrower/processing" element={<BorrowerGuard><Processing /></BorrowerGuard>} />
        <Route path="/borrower/active" element={<BorrowerGuard><ActiveLoan /></BorrowerGuard>} />
        <Route path="/borrower/repay" element={<BorrowerGuard><Repay /></BorrowerGuard>} />
        <Route path="/borrower/trust" element={<BorrowerGuard><TrustScore /></BorrowerGuard>} />
        <Route path="/borrower/history" element={<BorrowerGuard><BorrowerHistory /></BorrowerGuard>} />
        <Route path="/borrower/profile" element={<BorrowerGuard><BorrowerProfile /></BorrowerGuard>} />
        <Route path="/borrower/profile/details" element={<BorrowerGuard><BorrowerProfileDetails /></BorrowerGuard>} />
        <Route path="/borrower/profile/personal" element={<BorrowerGuard><BorrowerPersonalPage /></BorrowerGuard>} />
        <Route path="/borrower/profile/kyc" element={<BorrowerGuard><BorrowerKycPage /></BorrowerGuard>} />
        <Route path="/borrower/profile/zaad" element={<BorrowerGuard><BorrowerZaadPage /></BorrowerGuard>} />
        <Route path="/borrower/profile/language" element={<BorrowerGuard><BorrowerLanguagePage /></BorrowerGuard>} />
        <Route path="/borrower/profile/support" element={<BorrowerGuard><BorrowerSupportPage /></BorrowerGuard>} />
        <Route path="/borrower/profile/terms" element={<BorrowerGuard><BorrowerTermsPage /></BorrowerGuard>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatedOutlet>
  );
};

const App: React.FC = () => (
  <HeroUIProvider>
    <I18nProvider>
      <AppProvider>
        <BrowserRouter>
          <BorrowFlowProvider>
            <Shell />
          </BorrowFlowProvider>
        </BrowserRouter>
      </AppProvider>
    </I18nProvider>
  </HeroUIProvider>
);

export default App;
