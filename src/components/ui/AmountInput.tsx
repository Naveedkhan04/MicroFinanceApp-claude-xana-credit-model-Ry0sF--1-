import React from "react";
import clsx from "../../utils/clsx";

interface Props {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  token?: string;
  disabled?: boolean;
  align?: "left" | "right";
  className?: string;
  inputMode?: "decimal" | "numeric" | "tel";
}

export const AmountInput: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  token,
  disabled,
  align = "right",
  inputMode = "decimal",
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex items-center overflow-hidden rounded-pill bg-white shadow-inner",
        disabled && "opacity-60",
        className,
      )}
    >
      {token && (
        <button
          type="button"
          tabIndex={-1}
          className="bg-gold text-[#3B2608] font-bold px-5 py-3 text-[15px] rounded-pill m-1"
        >
          {token}
        </button>
      )}
      <input
        type="text"
        inputMode={inputMode}
        value={value === 0 ? "" : value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          "flex-1 bg-transparent px-5 py-3 text-[17px] text-[#222] outline-none placeholder:text-neutral-400",
          align === "right" ? "text-right" : "text-left",
        )}
      />
    </div>
  );
};
