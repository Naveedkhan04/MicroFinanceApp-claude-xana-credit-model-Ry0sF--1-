import React, { useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "../../utils/clsx";
import { PrimaryButton } from "./PrimaryButton";
import { PhoneFrameOverlayContext } from "../layout/PhoneFrame";

export type DialogStatus = "success" | "error";

interface Props {
  open: boolean;
  status: DialogStatus;
  title: string;
  description?: string;
  hash?: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  onClose: () => void;
}

export const StatusDialog: React.FC<Props> = ({
  open,
  status,
  title,
  description,
  hash,
  primaryLabel,
  onPrimary,
  onClose,
}) => {
  const overlay = useContext(PhoneFrameOverlayContext);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  const isSuccess = status === "success";
  const ringColor = isSuccess ? "#17C27A" : "#E5484D";

  const copy = () => {
    if (hash) navigator.clipboard?.writeText(hash);
  };

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
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative z-10 w-full max-w-[420px] rounded-t-3xl border-t border-border-gold bg-bg-panel px-6 pt-5 pb-8 text-center shadow-2xl transition-transform",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white/80 transition-colors hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="mt-2">
          <h3 className="text-[20px] font-semibold text-gold-bright">{title}</h3>
          {description && (
            <p className="mx-auto mt-2 max-w-[300px] text-[14px] leading-snug text-text-muted">
              {description}
            </p>
          )}

          {hash && (
            <button
              onClick={copy}
              className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full border border-border-gold bg-bg-panel/60 px-3 py-1.5 text-[12px] text-gold-bright"
            >
              <span className="text-text-muted">Hash:</span>
              <span className="font-mono">{hash.length > 14 ? `${hash.slice(0, 8)}…${hash.slice(-4)}` : hash}</span>
              <span className="text-gold">⧉</span>
            </button>
          )}

          <div
            className="mx-auto my-7 flex h-[72px] w-[72px] items-center justify-center rounded-full"
            style={{ background: ringColor, boxShadow: `0 0 0 6px ${ringColor}22` }}
          >
            {isSuccess ? (
              <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            )}
          </div>

          <PrimaryButton onClick={onPrimary ?? onClose}>
            {primaryLabel ?? (isSuccess ? "OK" : "Retry")}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );

  return createPortal(node, overlay ?? document.body);
};
