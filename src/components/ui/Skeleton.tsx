import React from "react";
import clsx from "../../utils/clsx";

interface Props {
  className?: string;
  variant?: "line" | "block" | "circle";
}

export const Skeleton: React.FC<Props> = ({ className, variant = "line" }) => (
  <div
    className={clsx(
      "animate-pulse bg-surface-raised/60",
      variant === "line" && "h-3 rounded-full",
      variant === "block" && "rounded-2xl",
      variant === "circle" && "rounded-full",
      className,
    )}
  />
);
