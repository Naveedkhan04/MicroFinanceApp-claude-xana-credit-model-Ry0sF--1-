import React from "react";
import clsx from "../../utils/clsx";

export const DetailRow: React.FC<{
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  className?: string;
}> = ({ label, value, mono, className }) => (
  <div
    className={clsx(
      "mb-2 flex items-center justify-between gap-3 rounded-pill border border-border-gold bg-bg-panel/60 px-5 py-4",
      className,
    )}
  >
    <span className="text-[12.5px] text-text-muted">{label}</span>
    <span
      className={clsx(
        "text-right text-[14px] font-semibold text-gold-bright",
        mono && "font-mono",
      )}
    >
      {value}
    </span>
  </div>
);

export const ActionItem: React.FC<{
  label: string;
  value?: React.ReactNode;
  onClick: () => void;
}> = ({ label, value, onClick }) => (
  <button
    onClick={onClick}
    className="mb-2 flex w-full items-center justify-between rounded-pill border border-border-gold bg-bg-panel/60 px-5 py-3 text-left transition-colors hover:bg-bg-panel/80"
  >
    <span className="text-[14px] font-semibold text-gold-bright">{label}</span>
    <span className="flex items-center gap-2 text-[12.5px] text-text-muted">
      {value}
      <span className="text-gold">›</span>
    </span>
  </button>
);

export const ToggleRow: React.FC<{
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <div className="mb-2 flex items-center justify-between rounded-pill border border-border-gold bg-bg-panel/60 px-5 py-3">
    <span className="text-[14px] text-gold-bright">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={clsx(
        "h-6 w-11 rounded-full p-0.5 transition-colors",
        checked ? "bg-gold" : "bg-white/20",
      )}
    >
      <span
        className={clsx(
          "block h-5 w-5 rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  </div>
);

export const MenuRow: React.FC<{
  icon: string;
  label: string;
  value?: React.ReactNode;
  onClick?: () => void;
}> = ({ icon, label, value, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={!onClick}
    className="flex w-full items-center gap-4 rounded-pill border border-border-gold bg-bg-panel/80 px-5 py-4 backdrop-blur-md transition-transform active:scale-[0.99] disabled:cursor-default"
  >
    <span className="w-6 text-center text-[18px] text-gold">{icon}</span>
    <span className="flex-1 text-left text-[15px] font-semibold text-gold-bright">{label}</span>
    {value != null && <span className="text-[12.5px] text-text-muted">{value}</span>}
    {onClick && <span className="text-gold">›</span>}
  </button>
);
