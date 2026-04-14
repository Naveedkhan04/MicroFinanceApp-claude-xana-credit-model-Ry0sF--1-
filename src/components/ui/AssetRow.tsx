import React from "react";
import { Card } from "./Card";
import clsx from "../../utils/clsx";

interface Props {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  subvalue?: string;
  onClick?: () => void;
  className?: string;
  accent?: boolean;
}

export const AssetRow: React.FC<Props> = ({
  icon,
  title,
  subtitle,
  value,
  subvalue,
  onClick,
  className,
  accent = true,
}) => (
  <Card
    interactive={!!onClick}
    onClick={onClick}
    className={clsx("flex items-center gap-4 py-4", className)}
  >
    {icon && <div className="shrink-0">{icon}</div>}
    <div className="min-w-0 flex-1">
      <div className={clsx("truncate text-[16px] font-bold", accent ? "text-gold-bright" : "text-text")}>{title}</div>
      {subtitle && <div className="truncate text-[12.5px] text-text-muted">{subtitle}</div>}
    </div>
    {(value || subvalue) && (
      <div className="shrink-0 text-right">
        {value && <div className={clsx("text-[16px] font-semibold", accent ? "text-gold-bright" : "text-text")}>{value}</div>}
        {subvalue && <div className="text-[12px] text-text-muted">{subvalue}</div>}
      </div>
    )}
  </Card>
);
