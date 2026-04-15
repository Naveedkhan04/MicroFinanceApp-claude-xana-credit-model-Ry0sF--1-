import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../../components/layout/PhoneFrame";
import { Card } from "../../components/ui/Card";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { useI18n } from "../../i18n";

interface Draft {
  fullName: string;
  idNumber: string;
  dob: string;
  city: string;
  zaad: string;
}

export const Onboarding: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft>({
    fullName: "",
    idNumber: "",
    dob: "",
    city: "",
    zaad: "",
  });

  const valid = Object.values(draft).every((v) => v.trim().length > 0);

  const save = () => navigate("/borrower");

  return (
    <PhoneFrame
      onCancel={() => navigate("/borrower/welcome")}
      footer={
        <PrimaryButton disabled={!valid} onClick={save}>
          {t("borrower.onboarding.save")}
        </PrimaryButton>
      }
    >
      <h1 className="mb-5 text-center text-[22px] font-semibold text-gold">{t("borrower.onboarding.title")}</h1>

      <div className="space-y-3">
        <Field label={t("borrower.onboarding.fullName")} value={draft.fullName} onChange={(v) => setDraft({ ...draft, fullName: v })} />
        <Field label={t("borrower.onboarding.idNumber")} value={draft.idNumber} onChange={(v) => setDraft({ ...draft, idNumber: v })} />
        <Field label={t("borrower.onboarding.dob")} value={draft.dob} onChange={(v) => setDraft({ ...draft, dob: v })} placeholder="YYYY-MM-DD" />
        <Field label={t("borrower.onboarding.city")} value={draft.city} onChange={(v) => setDraft({ ...draft, city: v })} />
        <Field label={t("borrower.onboarding.zaad")} value={draft.zaad} onChange={(v) => setDraft({ ...draft, zaad: v })} placeholder="+252 63 …" />
      </div>

    </PhoneFrame>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <Card>
    <label className="mb-1 block text-[12px] text-text-muted">{label}</label>
    <input
      className="w-full bg-transparent text-[15px] text-text outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </Card>
);
