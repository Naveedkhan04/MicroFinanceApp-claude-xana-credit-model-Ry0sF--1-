import React from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n";
import clsx from "../../utils/clsx";

interface Props {
  title?: string;
  onCancel?: () => void;
  hideCancel?: boolean;
  right?: React.ReactNode;
  className?: string;
}

export const TopBar: React.FC<Props> = ({
  title,
  onCancel,
  hideCancel = false,
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
    >
      {!hideCancel ? (
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : navigate(-1))}
          className="text-[15px] text-white/90 hover:text-white"
        >
          {t("app.cancel")}
        </button>
      ) : (
        <span className="w-[54px]" />
      )}
      <h1 className="text-center text-[22px] font-semibold text-gold uppercase">
        {title ?? t("app.brand")}
      </h1>
      {right ?? (
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 text-white hover:bg-white/10"
          aria-label="menu"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <circle cx="5" cy="12" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="19" cy="12" r="1.8" />
          </svg>
        </button>
      )}
    </header>
  );
};
