import React from "react";
import clsx from "../../utils/clsx";

type Tone = "gold" | "green" | "red" | "blue" | "neutral" | "amber";

interface Props {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  gold: "bg-gold/15 text-gold border border-gold/40",
  green: "bg-success/15 text-success border border-success/40",
  red: "bg-danger/15 text-danger border border-danger/40",
  blue: "bg-info/15 text-info border border-info/40",
  neutral: "bg-surface text-text-muted border border-border",
  amber: "bg-warning/15 text-warning border border-warning/40",
};

export const StatusChip: React.FC<Props> = ({ tone = "neutral", children, className }) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase",
      toneClasses[tone],
      className,
    )}
  >
    {children}
  </span>
);
