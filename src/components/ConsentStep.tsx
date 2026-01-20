"use client";

import { useTranslations } from "next-intl";
import { FileText, ArrowRight, ArrowLeft } from "lucide-react";
import { ConsentStepProps } from "@/types";



export default function StepConsent({ hasConsented, isRtl, onConsentChange, onComplete, onBack }: ConsentStepProps) {
  const t = useTranslations("Signup");

  return (
    <div className={`animate-in fade-in duration-500 ${isRtl ? 'slide-in-from-left-8' : 'slide-in-from-right-8'}`}>
      <header className="mb-[2.5rem]">
        <button onClick={onBack} className="text-medical-teal font-[700] mb-[1rem] flex items-center gap-1">
           {isRtl ? <ArrowRight size="1rem" /> : <ArrowLeft size="1rem" />} {t("back")}
        </button>
        <h2 className="text-[2.25rem] font-[900] text-[#134e4a] tracking-tight">{t("finalConsent")}</h2>
      </header>

      <div className="bg-[#f8fafc] p-[2rem] rounded-[2rem] border border-[#e2e8f0] mb-[2rem] text-start">
        <div className="flex gap-[1rem] mb-[1rem] text-medical-teal items-center">
          <FileText size="1.75rem" />
          <h4 className="font-[800] text-[1.125rem]">{t("termsTitle")}</h4>
        </div>
        <p className="text-[1rem] text-[#64748b] leading-[1.8]">{t("termsText")}</p>
      </div>

      <label className="flex items-start gap-[1.25rem] cursor-pointer group mb-[3rem]">
        <input 
          type="checkbox" 
          className="mt-[0.35rem] w-[1.5rem] h-[1.5rem] accent-medical-teal shrink-0"
          checked={hasConsented}
          onChange={(e) => onConsentChange(e.target.checked)}
        />
        <span className="text-[1.1rem] text-[#475569] font-[500] group-hover:text-[#134e4a] transition-colors text-start">
          {t("agree")}
        </span>
      </label>

      <button 
        onClick={onComplete}
        disabled={!hasConsented}
        className="w-full bg-[#134e4a] text-white font-[900] text-[1.125rem] py-[1.5rem] rounded-[2rem] shadow-xl hover:bg-[#0d4e4a] transition-all disabled:opacity-30"
      >
        {t("complete")}
      </button>
    </div>
  );
}