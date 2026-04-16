import React from "react";
import clsx from "../../utils/clsx";

interface Props {
  iso: string;
  size?: number;
  className?: string;
  rounded?: boolean;
}

export const Flag: React.FC<Props> = ({ iso, size = 20, className, rounded = true }) => {
  const code = iso.toLowerCase();
  const width = Math.round(size * 1.4);
  return (
    <img
      src={`https://flagcdn.com/w80/${code}.png`}
      srcSet={`https://flagcdn.com/w160/${code}.png 2x`}
      alt={iso}
      width={width}
      height={size}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={clsx(
        "inline-block select-none object-cover",
        rounded && "rounded-[3px]",
        className,
      )}
      style={{ width, height: size }}
    />
  );
};
