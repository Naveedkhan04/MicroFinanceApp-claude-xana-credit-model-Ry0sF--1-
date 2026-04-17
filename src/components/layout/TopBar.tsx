import React from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n";
import clsx from "../../utils/clsx";

interface Props {
  title?: string;
  onCancel?: () => void;
  hideCancel?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  className?: string;
}

export const TopBar: React.FC<Props> = ({
  title,
  onCancel,
  hideCancel = false,
  showBack = false,
  onBack,
  right,
  className,
}) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  return (
    <header
      className={clsx(
        "relative z-10 flex items-center justify-between px-5 pt-3 pb-2",
        className,
      )}
      style={{
        background: "goldGradient", // Replace with actual gold gradient value
        borderTopLeftRadius: 62,
        borderBottomLeftRadius: 62,
        fontFamily: "Inter, sans-serif",
        fontSize: 18,
        fontWeight: 600,
        lineHeight: "140%",
        letterSpacing: "-0.36px",
      }}
    >
      <h1 className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[22px] font-semibold text-gold uppercase">
        {title ?? t("app.brand")}
      </h1>
      {showBack ? (
        <button
          type="button"
          onClick={() => (onBack ? onBack() : navigate(-1))}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border-gold text-gold-bright transition-colors hover:bg-gold/10"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-none stroke-current"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      ) : !hideCancel ? (
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : navigate(-1))}
          className="text-[15px] text-white/90 hover:text-white"
        >
          {t("app.cancel")}
        </button>
      ) : (
        <span className="h-8 w-8" />
      )}
      {right !== undefined ? right : <span className="h-8 w-8" />}
    </header>
  );
};