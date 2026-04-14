import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { Card } from "../../components/ui/Card";
import { useI18n } from "../../i18n";
import { borrowerApi } from "../../data/services";
import {
  computeDueDate,
  computeFee,
  computeTotal,
  useBorrowFlow,
} from "./BorrowFlow";

type Phase = "check" | "review" | "prep" | "send" | "success" | "fail" | "review-required";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const Processing: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { amount, duration, feeRate, reset } = useBorrowFlow();
  const [phase, setPhase] = useState<Phase>("check");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rs = await borrowerApi.checkEligibility(amount);
        if (cancelled) return;
        if (rs.decision === "review") return setPhase("review-required");
        if (rs.decision === "decline") return setPhase("fail");

        setPhase("review");
        await sleep(600);
        if (cancelled) return;

        setPhase("prep");
        await sleep(500);
        if (cancelled) return;

        setPhase("send");
        await borrowerApi.createLoan({
          amount,
          duration,
          feeRate,
          fee: computeFee(amount, feeRate),
          total: computeTotal(amount, feeRate),
          dueAt: computeDueDate(duration),
          destination: "+252 63 4567890",
        });
        if (cancelled) return;
        setPhase("success");
      } catch {
        if (!cancelled) setPhase("fail");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps: { key: Exclude<Phase, "success" | "fail" | "review-required">; label: string }[] = [
    { key: "check", label: t("borrower.processing.check") },
    { key: "review", label: t("borrower.processing.review") },
    { key: "prep", label: t("borrower.processing.prep") },
    { key: "send", label: t("borrower.processing.send") },
  ];
  const stepIndex = steps.findIndex((s) => s.key === phase);

  if (phase === "success") {
    return (
      <PhoneFrame hideCancel>
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 15 }}
            className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/20 text-5xl text-success"
          >
            ✓
          </motion.div>
          <h2 className="mb-2 text-[22px] font-semibold text-gold">{t("borrower.processing.success")}</h2>
          <p className="mb-8 max-w-[260px] text-[13px] text-text-muted">{t("borrower.repay.successDesc")}</p>
          <PrimaryButton
            onClick={() => {
              reset();
              navigate("/borrower");
            }}
          >
            {t("app.done")}
          </PrimaryButton>
        </div>
      </PhoneFrame>
    );
  }

  if (phase === "fail") {
    return (
      <PhoneFrame hideCancel>
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-danger/20 text-5xl text-danger">!</div>
          <h2 className="mb-2 text-[22px] font-semibold text-danger">{t("borrower.processing.fail")}</h2>
          <p className="mb-8 max-w-[260px] text-[13px] text-text-muted">{t("borrower.processing.failDesc")}</p>
          <div className="flex w-full gap-2">
            <PrimaryButton variant="outline" onClick={() => navigate("/borrower")}>
              {t("app.cancel")}
            </PrimaryButton>
            <PrimaryButton onClick={() => navigate("/borrower/review")}>{t("app.retry")}</PrimaryButton>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  if (phase === "review-required") {
    return (
      <PhoneFrame hideCancel>
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-warning/20 text-5xl text-warning">…</div>
          <h2 className="mb-2 text-[22px] font-semibold text-warning">{t("borrower.home.review")}</h2>
          <p className="mb-8 max-w-[280px] text-[13px] text-text-muted">
            Our team needs to review your request. We'll notify you within 24 hours.
          </p>
          <PrimaryButton onClick={() => navigate("/borrower")}>{t("app.done")}</PrimaryButton>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame hideCancel>
      <div className="flex h-full flex-col items-center justify-center px-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8 h-20 w-20 rounded-full border-4 border-gold/30 border-t-gold"
        />
        <Card className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            <motion.ul
              key={phase}
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {steps.map((s, i) => {
                const done = i < stepIndex;
                const active = i === stepIndex;
                return (
                  <li key={s.key} className="flex items-center gap-3 text-[14px]">
                    <span
                      className={
                        done
                          ? "flex h-6 w-6 items-center justify-center rounded-full bg-success/20 text-success"
                          : active
                            ? "h-6 w-6 animate-pulse rounded-full bg-gold/30"
                            : "h-6 w-6 rounded-full border border-border"
                      }
                    >
                      {done ? "✓" : null}
                    </span>
                    <span className={active ? "font-semibold text-gold" : done ? "text-text-muted line-through" : "text-text-muted"}>
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </motion.ul>
          </AnimatePresence>
        </Card>
      </div>
    </PhoneFrame>
  );
};
