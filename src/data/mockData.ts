import type {
  BorrowerProfile,
  LenderOverview,
  LenderProfile,
  Loan,
  Notification,
  Pool,
  Repayment,
  Transaction,
} from "../types";

const iso = (d: Date) => d.toISOString();
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
};
const daysAhead = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
};

// ---------------------------------------------------------------------------
// Pools
// ---------------------------------------------------------------------------
export const pools: Pool[] = [
  {
    id: "stable",
    name: "Stable Pool",
    apy: 0.08,
    risk: "low",
    minDeposit: 50,
    liquidityTerms: "Instant withdraw up to $2k / day",
    totalDeposited: 1_240_000,
    utilization: 0.62,
    reserveCoverage: 0.22,
  },
  {
    id: "balanced",
    name: "Balanced Pool",
    apy: 0.12,
    risk: "medium",
    minDeposit: 100,
    liquidityTerms: "Standard withdraw in 1-3 days",
    totalDeposited: 890_000,
    utilization: 0.78,
    reserveCoverage: 0.15,
  },
  {
    id: "high-yield",
    name: "High Yield Pool",
    apy: 0.22,
    risk: "high",
    minDeposit: 250,
    liquidityTerms: "Withdraw in 7 days",
    totalDeposited: 420_000,
    utilization: 0.91,
    reserveCoverage: 0.09,
  },
];

// ---------------------------------------------------------------------------
// Lender overview
// ---------------------------------------------------------------------------
export const lenderProfile: LenderProfile = {
  id: "lender_001",
  mode: "lender",
  createdAt: daysAgo(120),
  walletAddress: "0x7f3E…9aB4",
  email: "lender@xana.app",
  kycStatus: "verified",
};

export const lenderOverview: LenderOverview = {
  totalBalance: 12_580.42,
  activeCapital: 11_840.0,
  earningsToday: 4.18,
  totalEarnings: 580.42,
  apy: 0.137,
  availableToWithdraw: 740.42,
  autoReinvest: true,
  positions: [
    { poolId: "stable", principal: 4000, earningsToDate: 118.22, depositedAt: daysAgo(90) },
    { poolId: "balanced", principal: 5000, earningsToDate: 281.11, depositedAt: daysAgo(60) },
    { poolId: "high-yield", principal: 2840, earningsToDate: 181.09, depositedAt: daysAgo(40) },
  ],
  apyTrend: [
    0.082, 0.085, 0.088, 0.091, 0.094, 0.097, 0.1, 0.103, 0.106, 0.108,
    0.111, 0.113, 0.115, 0.118, 0.12, 0.122, 0.123, 0.125, 0.126, 0.128,
    0.129, 0.131, 0.132, 0.134, 0.135, 0.136, 0.137, 0.138, 0.137, 0.137,
  ],
  utilizationTrend: [
    0.48, 0.5, 0.53, 0.55, 0.57, 0.59, 0.61, 0.63, 0.65, 0.67,
    0.69, 0.7, 0.72, 0.73, 0.75, 0.76, 0.78, 0.79, 0.8, 0.81,
    0.82, 0.83, 0.84, 0.84, 0.85, 0.85, 0.86, 0.86, 0.85, 0.85,
  ],
  earningsTrend: {
    daily: [2.1, 2.4, 2.8, 3.1, 3.0, 3.3, 3.6, 3.4, 3.7, 3.9, 3.8, 4.0, 4.1, 4.05, 4.18],
    monthly: [42, 51, 58, 66, 72, 78, 85, 92, 98, 104, 110, 118, 122, 125, 125.4],
    lifetime: [
      12, 28, 46, 68, 92, 118, 148, 176, 208, 242,
      278, 312, 348, 386, 422, 458, 492, 518, 542, 556, 568, 576, 580.42,
    ],
  },
  reserveCoverage: 0.17,
  allocation: {
    byType: [
      { label: "Micro 7d", value: 0.22 },
      { label: "Micro 14d", value: 0.41 },
      { label: "Micro 21d", value: 0.2 },
      { label: "Micro 30d", value: 0.17 },
    ],
    byDuration: [
      { label: "≤ 7d", value: 0.18 },
      { label: "8-14d", value: 0.44 },
      { label: "15-21d", value: 0.2 },
      { label: "22-30d", value: 0.18 },
    ],
    byPerformance: [
      { label: "Performing", value: 0.86 },
      { label: "Watchlist", value: 0.09 },
      { label: "At-risk", value: 0.05 },
    ],
  },
  atRiskExposure: 0.05,
};

// ---------------------------------------------------------------------------
// Borrower
// ---------------------------------------------------------------------------
export const borrowerProfile: BorrowerProfile = {
  id: "borrower_001",
  mode: "borrower",
  createdAt: daysAgo(40),
  fullName: "Asha Warsame",
  phone: "+252 63 4567890",
  idNumber: "SL-2024-88420",
  dob: "1995-06-12",
  city: "Hargeisa",
  zaadNumber: "+252 63 4567890",
  kycStatus: "verified",
  trustScore: 74,
  streak: 4,
  creditLimit: 20,
  eligibility: "eligible",
};

export const activeLoan: Loan | null = {
  id: "loan_2026_04_01",
  borrowerId: "borrower_001",
  principal: 15,
  fee: 2.25,
  total: 17.25,
  duration: 14,
  issuedAt: daysAgo(5),
  dueAt: daysAhead(9),
  status: "active",
  disbursementTarget: "+252 63 4567890",
  amountRepaid: 0,
};

export const loanHistory: Loan[] = [
  {
    id: "loan_2026_03_15",
    borrowerId: "borrower_001",
    principal: 10,
    fee: 1.5,
    total: 11.5,
    duration: 14,
    issuedAt: daysAgo(40),
    dueAt: daysAgo(26),
    status: "repaid",
    disbursementTarget: "+252 63 4567890",
    amountRepaid: 11.5,
  },
  {
    id: "loan_2026_02_20",
    borrowerId: "borrower_001",
    principal: 5,
    fee: 0.75,
    total: 5.75,
    duration: 7,
    issuedAt: daysAgo(70),
    dueAt: daysAgo(63),
    status: "repaid",
    disbursementTarget: "+252 63 4567890",
    amountRepaid: 5.75,
  },
];

export const repayments: Repayment[] = [
  {
    id: "rp_001",
    loanId: "loan_2026_03_15",
    amount: 11.5,
    method: "zaad",
    at: daysAgo(26),
    status: "success",
  },
  {
    id: "rp_002",
    loanId: "loan_2026_02_20",
    amount: 5.75,
    method: "zaad",
    at: daysAgo(63),
    status: "success",
  },
];

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------
export const lenderTransactions: Transaction[] = [
  { id: "tx_1", kind: "deposit", amount: 5000, currency: "USDT", at: daysAgo(60), status: "success" },
  { id: "tx_2", kind: "earning", amount: 4.18, currency: "USDT", at: daysAgo(0), status: "success" },
  { id: "tx_3", kind: "earning", amount: 3.95, currency: "USDT", at: daysAgo(1), status: "success" },
  { id: "tx_4", kind: "withdrawal", amount: 200, currency: "USDT", at: daysAgo(14), status: "success" },
  { id: "tx_5", kind: "deposit", amount: 2840, currency: "USDT", at: daysAgo(40), status: "success" },
  { id: "tx_6", kind: "adjustment", amount: -12.3, currency: "USDT", at: daysAgo(30), status: "success", note: "Default reserve" },
];

export const borrowerTransactions: Transaction[] = [
  { id: "btx_1", kind: "loan-issued", amount: 15, currency: "USD", at: daysAgo(5), status: "success" },
  { id: "btx_2", kind: "repayment", amount: -11.5, currency: "USD", at: daysAgo(26), status: "success" },
  { id: "btx_3", kind: "loan-issued", amount: 10, currency: "USD", at: daysAgo(40), status: "success" },
  { id: "btx_4", kind: "repayment", amount: -5.75, currency: "USD", at: daysAgo(63), status: "success" },
];

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export const notifications: Notification[] = [
  {
    id: "n_1",
    title: "Loan disbursed",
    body: "$15 has been sent to your Zaad number.",
    at: daysAgo(5),
    read: false,
  },
  {
    id: "n_2",
    title: "Trust score increased",
    body: "Your score is now 74. Next unlock at 80.",
    at: daysAgo(26),
    read: true,
  },
];
