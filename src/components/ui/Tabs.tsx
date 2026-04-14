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
  <div className={clsx("flex justify-center gap-10", className)}>
    {tabs.map((t) => {
      const isActive = t.key === active;
      return (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={clsx(
            "relative py-2 text-[15px] font-semibold transition-colors",
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
