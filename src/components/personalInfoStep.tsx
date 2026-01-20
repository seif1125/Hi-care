"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PersonalInfoStepProps } from "@/types";



export default function PersonalInfoStep({ name, email, isRtl, onUpdate, onNext }: PersonalInfoStepProps) {
  const t = useTranslations("Signup");

  return (
    <div className={`animate-in fade-in duration-500 ${isRtl ? 'slide-in-from-left-8' : 'slide-in-from-right-8'}`}>
      <header className="mb-[2.5rem]">
        <h2 className="text-[2.25rem] font-[900] text-[#134e4a] tracking-tight">{t("personalInfo")}</h2>
        <p className="text-[#64748b] mt-[0.5rem]">{t("step", { current: 1, total: 3 })}</p>
      </header>

      <div className="space-y-[1.5rem]">
        <input 
          type="text" 
          className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[1.25rem] px-[1.5rem] py-[1.25rem] focus:border-medical-teal outline-none transition-all text-start"
          placeholder={t("namePlaceholder")}
          value={name}
          onChange={(e) => onUpdate(e.target.value, email)}
        />
        <input 
          type="email" 
          className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[1.25rem] px-[1.5rem] py-[1.25rem] focus:border-medical-teal outline-none transition-all text-start"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => onUpdate(name, e.target.value)}
        />
      </div>

      <button 
        onClick={onNext} 
        disabled={!name || !email} 
        className="w-full mt-[3rem] bg-medical-teal text-white font-[800] py-[1.25rem] rounded-[1.5rem] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {t("continue")} {isRtl ? <ArrowLeft size="1.25rem" /> : <ArrowRight size="1.25rem" />}
      </button>
    </div>
  );
}