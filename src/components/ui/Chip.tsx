import React from "react";
import clsx from "../../utils/clsx";

interface Props {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export const Chip: React.FC<Props> = ({ active, onClick, children, className, size = "md" }) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      "rounded-pill border font-semibold transition-colors",
      size === "md" ? "px-5 py-0.5 text-sm" : "px-3 py-1 text-xs",
      active
        ? "bg-gold text-[#3B2608] border-gold"
        : "border-gold text-gold hover:bg-gold/10",
      className,
    )}
  >
    {children}
  </button>
);
