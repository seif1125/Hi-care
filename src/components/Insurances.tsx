"use client";

import { useTranslations, useLocale } from "next-intl";
import { 
  CheckCircle2, ArrowRight, ArrowLeft, 
  ShieldCheck, Wallet, Calendar, ExternalLink, Info 
} from "lucide-react";
import { InsurancesStepProps } from "@/types/index";

export default function InsurancesStep({ programs, selectedId, isRtl, onSelect, onNext, onBack }: InsurancesStepProps) {
  const t = useTranslations("Signup");
  const locale = useLocale();

  return (
    <div className={`animate-in fade-in duration-700 ${isRtl ? 'slide-in-from-left-8' : 'slide-in-from-right-8'}`}>
      <header className="mb-[2.5rem]">
        <button onClick={onBack} className="text-medical-teal font-[700] mb-[1rem] flex items-center gap-1 hover:opacity-70 transition-all">
           {isRtl ? <ArrowRight size="1rem" /> : <ArrowLeft size="1rem" />} {t("back")}
        </button>
        <h2 className="text-[2.25rem] font-[900] text-[#134e4a] tracking-tight leading-tight">{t("insurancePlan")}</h2>
        <p className="text-[#64748b] mt-[0.5rem] font-medium">{t("insuranceSubtitle")}</p>
      </header>

      <div className="space-y-[1.5rem] max-h-[30rem] overflow-y-auto pr-[0.75rem] custom-scrollbar">
        {programs.map((plan) => {
          const isSelected = selectedId === plan.id;
          const providerName = locale === 'ar' ? plan.provider_ar : plan.provider_en;
          const programTitle = locale === 'ar' ? plan.program_title_ar : plan.program_title_en;
          const details = locale === 'ar' ? plan.details_ar : plan.details_en;
          const website = locale === 'ar' ? plan.provider_website_ar : plan.provider_website_en;

          return (
            <label 
              key={plan.id} 
              className={`relative flex flex-col p-[1.75rem] rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 ${
                isSelected 
                  ? "border-medical-teal bg-[#f0fdfa] shadow-[0_20px_40px_-15px_rgba(13,148,136,0.15)] scale-[1.02]" 
                  : "border-[#f1f5f9] bg-white hover:border-[#e2e8f0] shadow-sm"
              }`}
            >
              <input 
                type="radio" 
                className="hidden" 
                checked={isSelected}
                onChange={() => onSelect(plan.id)} 
              />

              {/* Header: Logo & Link */}
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-xl border border-[#f1f5f9] shadow-sm">
                    <img src={plan.provider_logo} alt={providerName} className="h-7 w-auto object-contain" />
                  </div>
                  <a 
                    href={website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Prevents radio selection when clicking link
                    className="text-[#94a3b8] hover:text-medical-teal transition-colors"
                  >
                    <ExternalLink size="1.1rem" />
                  </a>
                </div>
                {isSelected && (
                  <CheckCircle2 className="text-medical-teal animate-in zoom-in duration-300" size="1.75rem" />
                )}
              </div>

              {/* Title Section */}
              <div className="text-start mb-5">
                <h4 className="font-[900] text-[#134e4a] text-[1.25rem] leading-tight mb-1.5">
                  {programTitle}
                </h4>
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-medical-teal/40"></span>
                   <p className="text-[0.95rem] text-[#475569] font-bold">{providerName}</p>
                </div>
              </div>

              {/* Details Bento Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#f8fafc] p-3 rounded-2xl border border-[#f1f5f9]">
                  <div className="flex items-center gap-2 mb-1 text-medical-teal">
                    <Wallet size="0.9rem" />
                    <span className="text-[0.7rem] font-black uppercase tracking-wider">{locale === 'ar' ? 'السعر' : 'Price'}</span>
                  </div>
                  <p className="text-[1rem] font-black text-[#134e4a]">${plan.price}<span className="text-[0.75rem] font-medium opacity-60">/mo</span></p>
                </div>

                <div className="bg-[#f8fafc] p-3 rounded-2xl border border-[#f1f5f9]">
                  <div className="flex items-center gap-2 mb-1 text-medical-teal">
                    <ShieldCheck size="0.9rem" />
                    <span className="text-[0.7rem] font-black uppercase tracking-wider">{locale === 'ar' ? 'التغطية' : 'Coverage'}</span>
                  </div>
                  <p className="text-[1rem] font-black text-[#134e4a]">${plan.coverage_amount.toLocaleString()}</p>
                </div>
              </div>

              {/* Expiry & Description */}
              <div className="space-y-3 pt-4 border-t border-dashed border-[#e2e8f0]">
                <div className="flex items-center gap-2 text-[#64748b]">
                  <Calendar size="0.9rem" />
                  <span className="text-[0.8rem] font-semibold">
                    {locale === 'ar' ? 'ينتهي في:' : 'Expires:'} {plan.expiry_date}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-[#64748b] bg-white/50 p-2 rounded-lg">
                  <Info size="0.9rem" className="mt-0.5 shrink-0" />
                  <p className="text-[0.85rem] leading-relaxed italic line-clamp-2">
                    {details}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <button 
        onClick={onNext} 
        disabled={!selectedId} 
        className="w-full mt-[2.5rem] bg-medical-teal text-white font-[900] py-[1.5rem] rounded-[2rem] shadow-xl shadow-medical-teal/20 active:scale-[0.97] transition-all disabled:opacity-20 disabled:grayscale"
      >
        {t("continue")}
      </button>
    </div>
  );
}