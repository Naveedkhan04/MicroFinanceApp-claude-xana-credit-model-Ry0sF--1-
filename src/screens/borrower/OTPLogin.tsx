import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { Card } from "../../components/ui/Card";
import { useI18n } from "../../i18n";
import { useApp } from "../../context/AppContext";
import { auth } from "../../data/services";
import clsx from "../../utils/clsx";

export const OTPLogin: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { setAuthed, pushToast } = useApp();

  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("+252 ");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(30);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== "code") return;
    setResendIn(30);
    const iv = setInterval(() => setResendIn((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, [step]);

  const sendOtp = async () => {
    if (phone.replace(/\D/g, "").length < 8) return;
    setLoading(true);
    try {
      await auth.borrowerSendOtp(phone);
      setStep("code");
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    const joined = code.join("");
    if (joined.length !== 6) return;
    setLoading(true);
    setErr(null);
    try {
      await auth.borrowerVerifyOtp(joined);
      setAuthed(true);
      pushToast("Welcome back", "success");
      navigate("/borrower");
    } catch {
      setErr(t("borrower.otp.invalid"));
    } finally {
      setLoading(false);
    }
  };

  const onCodeChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };

  return (
    <PhoneFrame onCancel={() => navigate("/borrower/welcome")}>
      <div className="mt-2 flex flex-col gap-5">
        <h1 className="text-center text-[24px] font-semibold text-gold">
          {step === "phone" ? t("borrower.welcome.continue") : t("borrower.otp.title")}
        </h1>

        {step === "phone" ? (
          <>
            <Card>
              <label className="mb-2 block text-[13px] text-text-muted">{t("borrower.otp.phoneLabel")}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-[20px] tracking-wider text-text outline-none"
                placeholder="+252 63 123 4567"
              />
            </Card>
            <PrimaryButton disabled={phone.replace(/\D/g, "").length < 8} loading={loading} onClick={sendOtp}>
              {t("borrower.otp.send")}
            </PrimaryButton>
          </>
        ) : (
          <>
            <p className="text-center text-[13px] text-text-muted">
              {t("borrower.otp.codeLabel")}
              <br />
              <span className="text-gold">{phone}</span>
            </p>

            <div className="flex justify-center gap-2">
              {code.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  value={d}
                  onChange={(e) => onCodeChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !d && i > 0) inputs.current[i - 1]?.focus();
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  className={clsx(
                    "h-12 w-10 rounded-xl border bg-bg-panel/80 text-center text-[22px] font-semibold text-gold outline-none",
                    err ? "border-danger" : "border-border-gold focus:border-gold",
                  )}
                />
              ))}
            </div>
            {err && <p className="text-center text-[12px] text-danger">{err}</p>}

            <PrimaryButton loading={loading} disabled={code.join("").length !== 6} onClick={verify}>
              {t("app.continue")}
            </PrimaryButton>

            <button
              onClick={() => resendIn === 0 && sendOtp()}
              disabled={resendIn > 0}
              className="mx-auto text-[13px] text-text-muted disabled:opacity-60 hover:text-gold"
            >
              {resendIn > 0
                ? t("borrower.otp.resendIn", { seconds: resendIn })
                : t("borrower.otp.resend")}
            </button>
          </>
        )}
      </div>
    </PhoneFrame>
  );
};
