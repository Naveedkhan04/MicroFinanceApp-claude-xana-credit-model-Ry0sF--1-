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
  align?: "left" | "center" | "right";
  bold?: boolean;
}

export const BalanceCard: React.FC<Props> = ({
  label,
  amount,
  currency = "$",
  sublabel,
  subvalue,
  className,
  centered = true,
  align,
  bold = true,
}) => {
  const resolvedAlign = align ?? (centered ? "center" : "left");
  const justify =
    resolvedAlign === "right" ? "justify-end" : resolvedAlign === "left" ? "justify-start" : "justify-center";
  const textAlignCls =
    resolvedAlign === "right" ? "text-right" : resolvedAlign === "left" ? "text-left" : "text-center";
  const weightCls = bold ? "font-bold" : "font-light";
  return (
  <Card className={clsx("py-6", textAlignCls, className)}>
    {label && <div className="mb-1 text-[13px] text-text-muted">{label}</div>}
    <div className={clsx("flex items-baseline gap-1", "justify-end")}>
      <span className={clsx("text-[26px] text-gold-dim", weightCls)}>{currency}</span>
      <span className={clsx("gold-text text-[40px] tracking-tight leading-[48px]", weightCls)}>{amount}</span>
    </div>
    {(sublabel || subvalue) && (
      <>
        <hr className="my-2 border-border-gold" />
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-text-muted">{sublabel}</span>
          <span className="text-text font-semibold">{subvalue}</span>
        </div>
      </>
    )}
  </Card>
  );
};
