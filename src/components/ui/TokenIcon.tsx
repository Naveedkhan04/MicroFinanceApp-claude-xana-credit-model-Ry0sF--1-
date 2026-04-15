import React from "react";
import clsx from "../../utils/clsx";

interface Props {
  kind: "" | "usdt" | "gold" | "xana";
  size?: number;
  className?: string;
}

export const TokenIcon: React.FC<Props> = ({ kind, size = 44, className }) => {
  const base = "inline-flex items-center justify-center rounded-full font-bold shrink-0";

  if (kind === "usdt") {
    return (
      <div
        className={clsx(base, "bg-tether text-white", className)}
        style={{ width: size, height: size, fontSize: size * 0.45 }}
      >
        T
      </div>
    );
  }

  return (
    <div
      className={clsx(
        base,
        "text-white italic",
        kind === "xana"
          ? "bg-[radial-gradient(circle_at_30%_30%,#F7CF6F,#C08624)]"
          : "bg-[radial-gradient(circle_at_30%_30%,#FFE08A,#B2873A)]",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.46, fontFamily: "Georgia, serif" }}
    >
      X
    </div>
  );
};
