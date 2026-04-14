import React from "react";
import clsx from "../../utils/clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  raised?: boolean;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  padded = true,
  raised = false,
  interactive = false,
  className,
  children,
  ...rest
}) => (
  <div
    className={clsx(
      "rounded-2xl border border-border-gold bg-bg-panel/80 backdrop-blur-md",
      raised && "shadow-card",
      padded && "p-5",
      interactive && "active:scale-[0.99] transition-transform",
      className,
    )}
    {...rest}
  >
    {children}
  </div>
);
