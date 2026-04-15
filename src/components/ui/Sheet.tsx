import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "../../utils/clsx";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Sheet: React.FC<Props> = ({ open, onClose, title, children, className }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  const node = (
    <div
      className={clsx(
        "fixed inset-0 z-[100] flex items-end justify-center transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <div
        className={clsx(
          "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative z-10 flex w-full max-w-[420px] max-h-[85vh] flex-col rounded-t-3xl border-t border-border-gold bg-bg-panel shadow-2xl transition-transform md:mb-3 md:rounded-3xl md:max-h-[820px]",
          open ? "translate-y-0" : "translate-y-full",
          className,
        )}
      >
        <div className="shrink-0 px-5 pt-3">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/20" />
          {title && (
            <h2 className="mb-3 text-center text-[17px] font-semibold text-gold-bright uppercase tracking-wide">
              {title}
            </h2>
          )}
        </div>
        <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-5 pb-8">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
};
