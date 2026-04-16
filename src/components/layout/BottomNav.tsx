import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import clsx from "../../utils/clsx";

export interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  items: NavItem[];
}

export const BottomNav: React.FC<Props> = ({ items }) => {
  const { pathname } = useLocation();
  return (
    <nav className="absolute inset-x-3 bottom-4 z-20 flex items-center justify-around rounded-[28px] border border-border-gold bg-bg-panel/90 p-2 backdrop-blur-lg">
      {items.map((it) => {
        const isModeRoot = it.to.split("/").filter(Boolean).length === 1;
        const active = isModeRoot
          ? pathname === it.to
          : pathname === it.to || pathname.startsWith(it.to + "/");
        return (
          <NavLink
            key={it.to}
            to={it.to}
            end
            className={clsx(
              "flex flex-1 flex-col items-center gap-1 px-1 py-1.5 text-[11px] font-medium transition-colors",
              active ? "text-gold" : "text-text-muted hover:text-text",
            )}
          >
            <span className="[&>svg]:h-[22px] [&>svg]:w-[22px]">{it.icon}</span>
            <span>{it.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
