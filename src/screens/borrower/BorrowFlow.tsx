/**
 * Borrow flow context — shared state across:
 *   1. BorrowAmount  -> 2. SelectDuration -> 3. LoanReview -> 4. Processing
 */
import React, { createContext, useContext, useMemo, useState } from "react";
import type { LoanDuration } from "../../types";

interface FlowState {
  amount: number;
  duration: LoanDuration;
  setAmount: (a: number) => void;
  setDuration: (d: LoanDuration) => void;
  reset: () => void;
  feeRate: number; // determined by duration tier
}

const FlowContext = createContext<FlowState | null>(null);

export const BorrowFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [amount, setAmount] = useState(10);
  const [duration, setDuration] = useState<LoanDuration>(14);

  const feeRate = useMemo(() => {
    // tiered fees: shorter = smaller fee, longer = higher fee
    if (duration <= 7) return 0.08;
    if (duration <= 14) return 0.15;
    if (duration <= 21) return 0.2;
    return 0.25;
  }, [duration]);

  const value = useMemo(
    () => ({
      amount,
      duration,
      setAmount,
      setDuration,
      reset: () => {
        setAmount(10);
        setDuration(14);
      },
      feeRate,
    }),
    [amount, duration, feeRate],
  );

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};

export function useBorrowFlow() {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useBorrowFlow must be within BorrowFlowProvider");
  return ctx;
}

export function computeFee(amount: number, rate: number): number {
  return Math.round(amount * rate * 100) / 100;
}

export function computeTotal(amount: number, rate: number): number {
  return Math.round(amount * (1 + rate) * 100) / 100;
}

export function computeDueDate(duration: LoanDuration): string {
  const d = new Date();
  d.setDate(d.getDate() + duration);
  return d.toISOString();
}
