// Shared domain types for XANA Micro Credit

export type Mode = "lender" | "borrower";
export type Lang = "en" | "ja";

// ---------------------------------------------------------------------------
// Users & Profiles
// ---------------------------------------------------------------------------
export interface User {
  id: string;
  mode: Mode;
  createdAt: string;
}

export interface LenderProfile extends User {
  mode: "lender";
  walletAddress: string;
  email?: string;
  kycStatus: "verified" | "pending" | "none";
}

export interface BorrowerProfile extends User {
  mode: "borrower";
  fullName: string;
  phone: string;
  idNumber?: string;
  dob?: string;
  city?: string;
  zaadNumber: string;
  kycStatus: "verified" | "pending" | "none";
  trustScore: number; // 0-100
  streak: number;
  creditLimit: number;
  eligibility: "eligible" | "ineligible" | "review" | "blocked";
}

// ---------------------------------------------------------------------------
// Pools & Lender positions
// ---------------------------------------------------------------------------
export type PoolType = "stable" | "balanced" | "high-yield";

export interface Pool {
  id: PoolType;
  name: string;
  apy: number;
  risk: "low" | "medium" | "high";
  minDeposit: number;
  liquidityTerms: string;
  totalDeposited: number;
  utilization: number; // 0-1
  reserveCoverage: number; // 0-1
}

export interface PoolPosition {
  poolId: PoolType;
  principal: number;
  earningsToDate: number;
  depositedAt: string;
}

export interface LenderOverview {
  totalBalance: number;
  activeCapital: number;
  earningsToday: number;
  totalEarnings: number;
  apy: number;
  availableToWithdraw: number;
  autoReinvest: boolean;
  positions: PoolPosition[];
  apyTrend: number[];
  utilizationTrend: number[];
  reserveCoverage: number;
  allocation: {
    byType: { label: string; value: number }[];
    byDuration: { label: string; value: number }[];
    byPerformance: { label: string; value: number }[];
  };
  atRiskExposure: number;
}

// ---------------------------------------------------------------------------
// Loans
// ---------------------------------------------------------------------------
export type LoanStatus =
  | "pending"
  | "active"
  | "overdue"
  | "repaid"
  | "defaulted"
  | "declined";

export type LoanDuration = 7 | 14 | 21 | 30;

export interface Loan {
  id: string;
  borrowerId: string;
  principal: number;
  fee: number;
  total: number; // principal + fee
  duration: LoanDuration;
  issuedAt: string;
  dueAt: string;
  status: LoanStatus;
  disbursementTarget: string; // Zaad number
  amountRepaid: number;
}

export interface Repayment {
  id: string;
  loanId: string;
  amount: number;
  method: "zaad";
  at: string;
  status: "success" | "failed" | "pending";
}

export interface RiskScore {
  score: number;
  decision: "approve" | "decline" | "review";
  reasons: string[];
}

// ---------------------------------------------------------------------------
// Generic
// ---------------------------------------------------------------------------
export type TransactionKind =
  | "deposit"
  | "withdrawal"
  | "earning"
  | "adjustment"
  | "loan-issued"
  | "repayment"
  | "fee";

export interface Transaction {
  id: string;
  kind: TransactionKind;
  amount: number;
  currency: "USDT" | "USD";
  at: string;
  status: "success" | "pending" | "failed";
  note?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
}

// ---------------------------------------------------------------------------
// Borrow flow state
// ---------------------------------------------------------------------------
export interface BorrowDraft {
  amount: number;
  duration: LoanDuration;
  feeRate: number; // 0.15 etc
  fee: number;
  total: number;
  dueAt: string;
  destination: string;
}
