import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { CountryPicker } from "../../components/ui/CountryPicker";
import { Flag } from "../../components/ui/Flag";
import { COUNTRIES, type Country } from "../../data/countries";
import { useI18n } from "../../i18n";
import { useApp } from "../../context/AppContext";
import { auth } from "../../data/services";
import clsx from "../../utils/clsx";

const DEFAULT_COUNTRY: Country = COUNTRIES[0];

export const OTPLogin: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { setAuthed, pushToast } = useApp();

  const [step, setStep] = useState<"phone" | "code">("phone");
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(30);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const fullPhone = `${country.dial} ${phoneNumber}`.trim();
  const digitCount = phoneNumber.replace(/\D/g, "").length;

  useEffect(() => {
    if (step !== "code") return;
    setResendIn(30);
    const iv = setInterval(() => setResendIn((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, [step]);

  const sendOtp = async () => {
    if (digitCount < 7) return;
    setLoading(true);
    try {
      await auth.borrowerSendOtp(fullPhone);
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

  const footer =
    step === "phone" ? (
      <PrimaryButton disabled={digitCount < 7} loading={loading} onClick={sendOtp}>
        {t("borrower.otp.send")}
      </PrimaryButton>
    ) : (
      <div className="flex flex-col gap-3">
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
      </div>
    );

  const isCode = step === "code";

  return (
    <PhoneFrame
      hideCancel
      title={isCode ? t("borrower.otp.verifyTitle") : undefined}
      topBarRight={isCode ? null : undefined}
      footer={footer}
    >
      <div className="mt-2 flex flex-col gap-5">
        {step === "phone" ? (
          <div>
            <label className="mb-2 ml-2 block text-[13px] text-text-muted">
              {t("borrower.otp.phoneLabel")}
            </label>
            <div
              className="flex h-[56px] items-center overflow-hidden bg-white shadow-inner"
              style={{ borderRadius: 62 }}
            >
              <button
                type="button"
                onClick={() => setCountryOpen(true)}
                className="flex h-full items-center gap-1.5 border-r border-neutral-200 pl-5 pr-3 text-[#222] transition-colors hover:bg-neutral-50"
                aria-label={t("borrower.otp.countryTitle")}
              >
                <Flag iso={country.iso} size={18} />
                <span
                  style={{ fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 700 }}
                >
                  {country.dial}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-none stroke-current text-neutral-500"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={t("borrower.otp.phonePlaceholder")}
                className="flex-1 bg-transparent px-4 text-[#222] outline-none placeholder:text-neutral-400"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.36px",
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <p className="text-center text-[16px] text-text-muted">
              {t("borrower.otp.codeLabel")}
              <br />
              <span className="text-gold">{fullPhone}</span>
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
                    "h-14 w-14 rounded-2xl border bg-bg-panel/80 text-center text-[26px] font-semibold text-gold outline-none",
                    err ? "border-danger" : "border-border-gold focus:border-gold",
                  )}
                />
              ))}
            </div>
            {err && <p className="text-center text-[12px] text-danger">{err}</p>}
          </>
        )}
      </div>

      <CountryPicker
        open={countryOpen}
        selected={country}
        onClose={() => setCountryOpen(false)}
        onSelect={setCountry}
      />
    </PhoneFrame>
  );
};
