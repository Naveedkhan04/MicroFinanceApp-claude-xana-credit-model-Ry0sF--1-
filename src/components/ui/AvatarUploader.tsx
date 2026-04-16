import React, { useEffect, useRef, useState } from "react";
import clsx from "../../utils/clsx";

interface Props {
  storageKey: string;
  size?: number;
  onChange?: (dataUrl: string | null) => void;
}

export const AvatarUploader: React.FC<Props> = ({ storageKey, size = 96, onChange }) => {
  const [src, setSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(storageKey);
    if (saved) setSrc(saved);
  }, [storageKey]);

  const persist = (next: string | null) => {
    setSrc(next);
    if (typeof window !== "undefined") {
      if (next) window.localStorage.setItem(storageKey, next);
      else window.localStorage.removeItem(storageKey);
    }
    onChange?.(next);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") persist(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const openPicker = () => fileRef.current?.click();

  const remove = (e: React.MouseEvent) => {
    e.stopPropagation();
    persist(null);
  };

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={openPicker}
        aria-label="Change profile photo"
        className={clsx(
          "relative overflow-hidden rounded-full border-2 border-gold-dim transition-transform active:scale-[0.98]",
          "bg-gradient-to-br from-[#6b5a48] to-[#2a2016]",
        )}
        style={{ width: size, height: size }}
      >
        {src ? (
          <img src={src} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[28px] text-gold/70">
            <svg viewBox="0 0 24 24" className="h-1/2 w-1/2 fill-current">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.3-8 5.1V21h16v-1.9c0-2.8-3.6-5.1-8-5.1z" />
            </svg>
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/55 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold-bright">
          <svg viewBox="0 0 24 24" className="mr-1 h-3 w-3 fill-current">
            <path d="M9 4l2-2h2l2 2h3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h3zm3 4a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
          </svg>
          Edit
        </span>
      </button>

      {src && (
        <button
          type="button"
          onClick={remove}
          aria-label="Remove photo"
          className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border-gold bg-bg-panel text-white/80 shadow-md transition-colors hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
};
