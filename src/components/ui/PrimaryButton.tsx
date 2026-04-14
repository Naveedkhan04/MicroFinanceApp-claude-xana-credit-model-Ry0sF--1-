import React from "react";
import clsx from "../../utils/clsx";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "outline" | "ghost";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export const PrimaryButton: React.FC<Props> = ({
  variant = "gold",
  leftIcon,
  rightIcon,
  fullWidth = true,
  loading,
  className,
  disabled,
  children,
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-pill px-6 py-[14px] text-[15px] font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  const variants: Record<string, string> = {
    gold: "bg-gold-gradient text-white shadow-gold",
    outline:
      "bg-transparent border border-gold text-gold hover:bg-gold/10",
    ghost: "bg-surface text-text hover:bg-surface-raised",
  };

  return (
    <button
      className={clsx(base, variants[variant], fullWidth && "w-full", className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
      ) : (
        leftIcon
      )}
      <span className="truncate">{children}</span>
      {!loading && rightIcon}
    </button>
  );
};
