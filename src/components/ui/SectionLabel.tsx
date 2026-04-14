import React from "react";
import clsx from "../../utils/clsx";

interface Props {
  children: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export const SectionLabel: React.FC<Props> = ({ children, right, className }) => (
  <div className={clsx("mt-5 mb-2 flex items-end justify-between px-1", className)}>
    <span className="text-[15px] font-semibold text-gold">{children}</span>
    {right && <span className="text-[13px] text-text-muted">{right}</span>}
  </div>
);
