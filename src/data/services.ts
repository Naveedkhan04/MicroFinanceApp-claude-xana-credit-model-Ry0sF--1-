/**
 * Mock services — simulate backend latency and failure for realistic UX.
 * Replace with real API calls when backend is ready.
 */
import {
  activeLoan as seedActive,
  borrowerProfile as seedBorrower,
  borrowerTransactions as seedBTx,
  lenderOverview as seedOverview,
  lenderProfile as seedLender,
  lenderTransactions as seedLTx,
  loanHistory as seedHistory,
  pools as seedPools,
  repayments as seedRepayments,
} from "./mockData";
import type {
  BorrowDraft,
  BorrowerProfile,
  LenderOverview,
  LenderProfile,
  Loan,
  PoolType,
  Repayment,
  RiskScore,
} from "../types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// In-memory state (so UI mutations persist during a session)
// ---------------------------------------------------------------------------
const db = {
  overview: { ...seedOverview } as LenderOverview,
  lender: { ...seedLender } as LenderProfile,
  borrower: { ...seedBorrower } as BorrowerProfile,
  activeLoan: seedActive as Loan | null,
  history: [...seedHistory] as Loan[],
  repayments: [...seedRepayments] as Repayment[],
  lenderTx: [...seedLTx],
  borrowerTx: [...seedBTx],
  pools: [...seedPools],
  walletUSDT: 1500, // lender external wallet
};

// ---------------------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------------------
export const auth = {
  async lenderConnect() {
    await sleep(400);
    return db.lender;
  },
  async borrowerSendOtp(phone: string) {
    await sleep(500);
    return { sent: true, phone };
  },
  async borrowerVerifyOtp(code: string) {
    await sleep(500);
    if (code.length !== 6) throw new Error("invalid-otp");
    return db.borrower;
  },
};

// ---------------------------------------------------------------------------
// LENDER
// ---------------------------------------------------------------------------
export const lenderApi = {
  async getOverview() {
    await sleep(300);
    return db.overview;
  },
  async getPools() {
    await sleep(200);
    return db.pools;
  },
  async deposit(amount: number, poolId: PoolType) {
    await sleep(700);
    if (amount <= 0) throw new Error("invalid-amount");
    db.overview.totalBalance += amount;
    db.overview.activeCapital += amount;
    db.overview.positions = db.overview.positions.map((p) =>
      p.poolId === poolId ? { ...p, principal: p.principal + amount } : p,
    );
    db.lenderTx = [
      {
        id: `tx_${Date.now()}`,
        kind: "deposit",
        amount,
        currency: "USDT",
        at: new Date().toISOString(),
        status: "success",
      },
      ...db.lenderTx,
    ];
    return db.overview;
  },
  async withdraw(amount: number, speed: "instant" | "standard") {
    await sleep(600);
    if (amount > db.overview.availableToWithdraw) {
      throw new Error("insufficient-liquidity");
    }
    const fee = speed === "instant" ? amount * 0.005 : 0;
    db.overview.totalBalance -= amount;
    db.overview.availableToWithdraw -= amount;
    db.lenderTx = [
      {
        id: `tx_${Date.now()}`,
        kind: "withdrawal",
        amount,
        currency: "USDT",
        at: new Date().toISOString(),
        status: "success",
        note: speed === "instant" ? `Instant fee $${fee.toFixed(2)}` : undefined,
      },
      ...db.lenderTx,
    ];
    return db.overview;
  },
  async setAutoReinvest(on: boolean) {
    await sleep(200);
    db.overview.autoReinvest = on;
    return db.overview;
  },
  async getTransactions() {
    await sleep(200);
    return db.lenderTx;
  },
};

// ---------------------------------------------------------------------------
// BORROWER
// ---------------------------------------------------------------------------
export const borrowerApi = {
  async getProfile() {
    await sleep(200);
    return db.borrower;
  },
  async getActiveLoan() {
    await sleep(250);
    return db.activeLoan;
  },
  async getHistory() {
    await sleep(200);
    return { loans: db.history, repayments: db.repayments, transactions: db.borrowerTx };
  },
  async checkEligibility(amount: number): Promise<RiskScore> {
    await sleep(600);
    const p = db.borrower;
    if (p.eligibility === "blocked") {
      return { score: p.trustScore, decision: "decline", reasons: ["account-blocked"] };
    }
    if (p.eligibility === "review") {
      return { score: p.trustScore, decision: "review", reasons: ["manual-review"] };
    }
    if (amount > p.creditLimit) {
      return { score: p.trustScore, decision: "decline", reasons: ["above-limit"] };
    }
    if (db.activeLoan && db.activeLoan.status === "active") {
      return { score: p.trustScore, decision: "decline", reasons: ["one-active-loan"] };
    }
    return { score: p.trustScore, decision: "approve", reasons: [] };
  },
  async createLoan(draft: BorrowDraft): Promise<Loan> {
    await sleep(900);
    // 1 in 8 chance of simulated disbursement failure to show error state
    if (Math.random() < 0.08) throw new Error("disbursement-failed");
    const loan: Loan = {
      id: `loan_${Date.now()}`,
      borrowerId: db.borrower.id,
      principal: draft.amount,
      fee: draft.fee,
      total: draft.total,
      duration: draft.duration,
      issuedAt: new Date().toISOString(),
      dueAt: draft.dueAt,
      status: "active",
      disbursementTarget: draft.destination,
      amountRepaid: 0,
    };
    db.activeLoan = loan;
    db.borrowerTx = [
      {
        id: `btx_${Date.now()}`,
        kind: "loan-issued",
        amount: draft.amount,
        currency: "USD",
        at: loan.issuedAt,
        status: "success",
      },
      ...db.borrowerTx,
    ];
    return loan;
  },
  async repay(amount: number) {
    await sleep(700);
    if (!db.activeLoan) throw new Error("no-active-loan");
    const remaining = db.activeLoan.total - db.activeLoan.amountRepaid;
    const toPay = Math.min(amount, remaining);
    db.activeLoan = {
      ...db.activeLoan,
      amountRepaid: db.activeLoan.amountRepaid + toPay,
    };
    const rp: Repayment = {
      id: `rp_${Date.now()}`,
      loanId: db.activeLoan.id,
      amount: toPay,
      method: "zaad",
      at: new Date().toISOString(),
      status: "success",
    };
    db.repayments = [rp, ...db.repayments];
    db.borrowerTx = [
      {
        id: `btx_${Date.now()}`,
        kind: "repayment",
        amount: -toPay,
        currency: "USD",
        at: rp.at,
        status: "success",
      },
      ...db.borrowerTx,
    ];
    if (db.activeLoan.amountRepaid >= db.activeLoan.total - 0.001) {
      db.history = [{ ...db.activeLoan, status: "repaid" }, ...db.history];
      db.activeLoan = null;
      db.borrower.streak += 1;
      db.borrower.trustScore = Math.min(100, db.borrower.trustScore + 3);
      if (db.borrower.trustScore >= 80) db.borrower.creditLimit = 30;
    }
    return { loan: db.activeLoan, repayment: rp, profile: db.borrower };
  },
};
