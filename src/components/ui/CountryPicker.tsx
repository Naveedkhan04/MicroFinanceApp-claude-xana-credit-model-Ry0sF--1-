import React, { useMemo, useState } from "react";
import { Sheet } from "./Sheet";
import { Flag } from "./Flag";
import { COUNTRIES, type Country } from "../../data/countries";
import { useI18n } from "../../i18n";
import clsx from "../../utils/clsx";

interface Props {
  open: boolean;
  selected: Country;
  onClose: () => void;
  onSelect: (c: Country) => void;
}

export const CountryPicker: React.FC<Props> = ({ open, selected, onClose, onSelect }) => {
  const { t } = useI18n();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.dial.includes(needle) ||
        c.iso.toLowerCase().includes(needle),
    );
  }, [q]);

  const handle = (c: Country) => {
    onSelect(c);
    setQ("");
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={t("borrower.otp.countryTitle")}>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("borrower.otp.countrySearch")}
        className="mb-3 w-full rounded-xl border border-border-gold bg-bg-panel/60 px-4 py-3 text-[14px] text-text outline-none focus:border-gold"
      />

      <div className="flex flex-col gap-1">
        {filtered.map((c) => {
          const active = c.iso === selected.iso && c.dial === selected.dial;
          return (
            <button
              key={`${c.iso}-${c.dial}`}
              type="button"
              onClick={() => handle(c)}
              className={clsx(
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                active
                  ? "border-gold bg-gold/10"
                  : "border-border-gold/50 bg-bg-panel/40 hover:border-border-gold",
              )}
            >
              <Flag iso={c.iso} size={22} />
              <span className="flex-1 text-[14px] font-semibold text-gold-bright">{c.name}</span>
              <span className="text-[13px] font-semibold text-text-muted">{c.dial}</span>
              {active && (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-gold">
                  <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </Sheet>
  );
};
