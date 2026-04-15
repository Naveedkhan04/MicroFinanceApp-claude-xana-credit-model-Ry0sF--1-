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
    "mx-auto inline-flex h-[64px] w-full max-w-[343px] items-center justify-center gap-2 px-6 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  const goldGradient =
    "linear-gradient(88deg, #D09635 4.35%, #E5B057 18.75%, #D28E1F 35.38%, #AD7211 65.92%, #E5B057 83.64%, #D09635 96.49%)";
  const variants: Record<string, string> = {
    gold: "text-white",
    outline: "bg-transparent border border-gold text-gold hover:bg-gold/10",
    ghost: "bg-surface text-text hover:bg-surface-raised",
  };

  return (
    <button
      className={clsx(base, variants[variant], fullWidth && "w-full", className)}
      style={{
        borderRadius: 62,
        fontFamily: "Inter, sans-serif",
        fontSize: 18,
        fontWeight: 600,
        lineHeight: "140%",
        letterSpacing: "-0.36px",
        textAlign: "center",
        ...(variant === "gold" ? { background: goldGradient, color: "#FFF" } : null),
      }}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
      ) : (
        leftIcon && <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">{leftIcon}</span>
      )}
      <span className="whitespace-nowrap">{children}</span>
      {!loading && rightIcon && <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">{rightIcon}</span>}
    </button>
  );
};
