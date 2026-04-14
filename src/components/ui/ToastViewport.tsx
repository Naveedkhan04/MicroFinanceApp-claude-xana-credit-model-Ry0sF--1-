import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../../context/AppContext";
import clsx from "../../utils/clsx";

export const ToastViewport: React.FC = () => {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[120px] z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className={clsx(
              "glass pointer-events-auto max-w-[320px] rounded-pill border px-5 py-3 text-[13px] font-medium",
              t.tone === "success" && "border-success/50 text-success",
              t.tone === "error" && "border-danger/50 text-danger",
              t.tone === "default" && "border-gold/40 text-gold-bright",
            )}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
