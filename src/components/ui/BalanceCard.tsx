import React from "react";
import { Card } from "./Card";
import clsx from "../../utils/clsx";

interface Props {
  label?: string;
  amount: string;
  currency?: string;
  sublabel?: string;
  subvalue?: string;
  className?: string;
  centered?: boolean;
}

export const BalanceCard: React.FC<Props> = ({
  label,
  amount,
  currency = "$",
  sublabel,
  subvalue,
  className,
  centered = true,
}) => (
  <Card className={clsx("py-6", centered && "text-center", className)}>
    {label && <div className="mb-1 text-[13px] text-text-muted">{label}</div>}
    <div className="flex items-baseline justify-center gap-1">
      <span className="text-[26px] font-light text-gold-dim">{currency}</span>
      <span className="gold-text text-[40px] font-light tracking-tight">{amount}</span>
    </div>
    {(sublabel || subvalue) && (
      <>
        <hr className="my-3 border-border-gold" />
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-text-muted">{sublabel}</span>
          <span className="text-text font-semibold">{subvalue}</span>
        </div>
      </>
    )}
  </Card>
);
