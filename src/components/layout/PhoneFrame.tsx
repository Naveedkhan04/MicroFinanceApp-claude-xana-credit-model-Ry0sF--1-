import React from "react";
import { StatusBar } from "./StatusBar";
import { TopBar } from "./TopBar";
import { ToastViewport } from "../ui/ToastViewport";
import clsx from "../../utils/clsx";

interface Props {
  children: React.ReactNode;
  title?: string;
  onCancel?: () => void;
  hideCancel?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  bottomNav?: React.ReactNode;
  topBarRight?: React.ReactNode;
  /** Hide TopBar completely (for welcome/OTP-like screens) */
  bare?: boolean;
  /** Pinned bottom action area (e.g. primary CTA). Sits 24px above the bottom nav or viewport edge. */
  footer?: React.ReactNode;
}

export const PhoneFrame: React.FC<Props> = ({
  children,
  title,
  onCancel,
  hideCancel,
  showBack,
  onBack,
  bottomNav,
  topBarRight,
  bare = false,
  footer,
}) => (
  <div className="flex min-h-screen items-center justify-center bg-black">
    <div
      className={clsx(
        "relative flex h-screen w-full max-w-[420px] flex-col overflow-hidden bg-bg",
        "md:my-3 md:h-[900px] md:rounded-[32px] md:shadow-2xl",
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-rocks" />
      {/* Bokeh speckles */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 65%, rgba(255,200,100,0.08) 0 2px, transparent 3px), radial-gradient(circle at 35% 85%, rgba(255,200,100,0.06) 0 2px, transparent 3px), radial-gradient(circle at 70% 75%, rgba(255,200,100,0.07) 0 3px, transparent 4px), radial-gradient(circle at 85% 90%, rgba(255,200,100,0.05) 0 2px, transparent 3px)",
        }}
      />

      <StatusBar />
      <div className="mx-auto my-1 h-[5px] w-28 rounded-full bg-neutral-300/80" />

      {!bare && (
        <TopBar
          title={title}
          onCancel={onCancel}
          hideCancel={hideCancel ?? Boolean(bottomNav)}
          right={topBarRight}
        />
      )}

      {/* Content */}
      <main
        className={clsx(
          "no-scrollbar relative z-10 flex-1 overflow-y-auto px-4 pt-1",
          footer ? (bottomNav ? "pb-[200px]" : "pb-[128px]") : bottomNav ? "pb-[96px]" : "pb-6",
        )}
      >
        {children}
      </main>

      {footer && (
        <div
          className={clsx(
            "absolute inset-x-4 z-20",
            bottomNav ? "bottom-[112px]" : "bottom-12",
          )}
        >
          {footer}
        </div>
      )}

      {bottomNav}
      <ToastViewport />
    </div>
  </div>
);
