"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useLocale } from "next-intl";
import { getInsurancePrograms } from "@/actions/getInsurancePrograms";

// Sub-components

import PersonalInfoStep from "@/components/personalInfoStep";
import InsurancesStep from "@/components/Insurances";
import ConsentStep from "@/components/ConsentStep";
import { InsuranceProgram } from "@/types";

export default function SignupFlow() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [programs, setPrograms] = useState<InsuranceProgram[]>([]);
  const { name, email, selectedInsuranceId, hasConsented, setPersonalInfo, setInsurance, setConsent } = useUserStore();

  useEffect(() => {
    async function load() {
      const data = await getInsurancePrograms();
      setPrograms(data);
      setLoading(false);
    }
    load();
  }, []);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-[1.5rem]" dir={isRtl ? "rtl" : "ltr"}>
      <div className="bg-[#ffffff] w-full max-w-[42rem] rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(19,78,74,0.1)] border border-[#f1f5f9] overflow-hidden">
        
        {/* Progress Bar */}
        <div className="flex h-[0.6rem] bg-[#f1f5f9]">
          <div 
            className="bg-medical-teal transition-all duration-700 ease-in-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-[3rem]">
          {step === 1 && (
            <PersonalInfoStep 
              name={name} 
              email={email} 
              isRtl={isRtl} 
              onUpdate={setPersonalInfo} 
              onNext={nextStep} 
            />
          )}

          {step === 2 && (
            <InsurancesStep 
              programs={programs} 
              selectedId={selectedInsuranceId} 
              isRtl={isRtl} 
              onSelect={setInsurance} 
              onNext={nextStep} 
              onBack={prevStep} 
            />
          )}

          {step === 3 && (
            <ConsentStep 
              hasConsented={hasConsented} 
              isRtl={isRtl} 
              onConsentChange={setConsent} 
              onBack={prevStep} 
              onComplete={() => window.location.href = '/dashboard'}
            />
          )}
        </div>
      </div>
    </div>
  );
}