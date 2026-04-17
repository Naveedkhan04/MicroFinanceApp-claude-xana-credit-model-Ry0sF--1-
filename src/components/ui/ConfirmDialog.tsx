import React, { useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "../../utils/clsx";
import { PhoneFrameOverlayContext } from "../layout/PhoneFrame";

interface Props {
  open: boolean;
  title: string;
  message?: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DANGER = "#E5484D";

export const ConfirmDialog: React.FC<Props> = ({
  open,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}) => {
  const overlay = useContext(PhoneFrameOverlayContext);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onCancel]);

  if (typeof document === "undefined") return null;

  const node = (
    <div
      className={clsx(
        "absolute inset-0 z-[120] flex items-end justify-center transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        className={clsx(
          "relative z-10 w-full max-w-[420px] rounded-t-3xl border-t border-border-gold bg-bg-panel px-6 pt-5 pb-8 shadow-2xl transition-transform",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label={cancelLabel}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white/80 transition-colors hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="mt-2 text-center">
          <h3 className="text-[22px] font-semibold text-gold-bright">{title}</h3>
          {message && (
            <p className="mx-auto mt-4 max-w-[320px] text-[17px] leading-snug text-white">
              {message}
            </p>
          )}

          <div className="mx-auto my-8 flex h-[110px] w-[110px] items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke={DANGER} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a9 9 0 1 0 5.657 16.03" />
              <path d="M15 12h7" />
              <path d="M19 8l4 4-4 4" />
            </svg>
          </div>

          <button
            type="button"
            onClick={onConfirm}
            className="mx-auto flex h-[60px] w-full max-w-[343px] items-center justify-center gap-2 rounded-pill text-[17px] font-semibold text-white shadow-lg transition-transform active:scale-[0.98]"
            style={{ background: DANGER }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(node, overlay ?? document.body);
};
