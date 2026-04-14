import React from "react";

interface Props {
  items: { label: string; value: number }[];
  format?: (v: number) => string;
}

export const AllocationBars: React.FC<Props> = ({ items, format = (v) => `${Math.round(v * 100)}%` }) => (
  <div className="space-y-3">
    {items.map((it) => (
      <div key={it.label}>
        <div className="mb-1 flex justify-between text-[13px]">
          <span className="text-text">{it.label}</span>
          <span className="text-gold">{format(it.value)}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised/70">
          <div
            className="h-full rounded-full bg-gold-gradient"
            style={{ width: `${Math.max(4, it.value * 100)}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);
