import React from "react";
import clsx from "../../utils/clsx";

interface Props {
  value: number; // 0..1
  className?: string;
  tone?: "gold" | "green" | "red";
}

export const ProgressBar: React.FC<Props> = ({ value, className, tone = "gold" }) => {
  const clamped = Math.max(0, Math.min(1, value));
  const fill: Record<string, string> = {
    gold: "bg-gold",
    green: "bg-success",
    red: "bg-danger",
  };
  return (
    <div className={clsx("h-2 w-full overflow-hidden rounded-full bg-surface-raised/70", className)}>
      <div
        className={clsx("h-full rounded-full transition-[width] duration-500 ease-out", fill[tone])}
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
};
