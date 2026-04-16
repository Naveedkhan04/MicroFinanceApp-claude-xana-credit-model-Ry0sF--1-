import React from "react";
import { Card } from "./Card";
import clsx from "../../utils/clsx";

interface Props {
  label: string;
  value: string;
  accent?: boolean;
  trend?: { direction: "up" | "down"; value: string };
  className?: string;
}

export const StatCard: React.FC<Props> = ({ label, value, accent, trend, className }) => (
  <Card className={clsx("py-4", className)}>
    <div className="text-[12px] text-text-muted">{label}</div>
    <div className={clsx("mt-1 text-[20px] font-semibold", accent ? "gold-text" : "text-text")}>{value}</div>
    {/* {trend && (
      <div className={clsx("mt-1 text-[12px] font-medium", trend.direction === "up" ? "text-success" : "text-danger")}>
        {trend.direction === "up" ? "↑" : "↓"} {trend.value}
      </div>
    )} */}
  </Card>
);
