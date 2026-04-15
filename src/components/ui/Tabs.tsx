import React from "react";
import clsx from "../../utils/clsx";

interface Tab {
  key: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (k: string) => void;
  className?: string;
}

export const Tabs: React.FC<Props> = ({ tabs, active, onChange, className }) => (
  <div
    className={clsx("-mx-4 flex gap-6 overflow-x-auto px-4", className)}
    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
  >
    {tabs.map((t) => {
      const isActive = t.key === active;
      return (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={clsx(
            "relative shrink-0 whitespace-nowrap py-2 text-[15px] font-semibold transition-colors",
            isActive ? "text-gold" : "text-text-muted hover:text-text",
          )}
        >
          {t.label}
          {isActive && (
            <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-gold" />
          )}
        </button>
      );
    })}
  </div>
);
