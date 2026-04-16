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
  const goldGradient =
    "linear-gradient(88deg, #D09635 4.35%, #E5B057 18.75%, #D28E1F 35.38%, #AD7211 65.92%, #E5B057 83.64%, #D09635 96.49%)";
  return (
    <div
      className={clsx(
        "flex h-[56px] items-center overflow-hidden bg-white shadow-inner",
        disabled && "opacity-60",
        className,
      )}
      style={{ borderRadius: 62 }}
    >
      {token && (
        <button
          type="button"
          tabIndex={-1}
          className="m-0 inline-flex h-[56px] items-center justify-center px-6 text-white"
          style={{
            background: goldGradient,
            borderTopLeftRadius: 62,
            borderBottomLeftRadius: 62,
            fontFamily: "Inter, sans-serif",
            fontSize: 18,
            fontWeight: 600,
            lineHeight: "140%",
            letterSpacing: "-0.36px",
          }}
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
          "flex-1 bg-transparent px-5 text-[#222] outline-none placeholder:text-neutral-400",
          align === "right" ? "text-right" : "text-left",
        )}
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 18,
          fontWeight: 600,
          lineHeight: "140%",
          letterSpacing: "-0.36px",
        }}
      />
    </div>
  );
};
