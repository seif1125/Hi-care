"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { MessageCircle, Calendar, ShieldCheck, Star } from "lucide-react";
import { DoctorCardProps } from "@/types";

const DoctorCard = memo(({ doctor, onBooking }: DoctorCardProps) => {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  const isRtl = locale === "ar";

  // Memoize strings to avoid re-calculation on every render
  const name = isRtl ? doctor.name_ar : doctor.name_en;
  const specialty = isRtl ? doctor.specialty_ar : doctor.specialty_en;

  // Optimize availability check: only calculate if doctor.availability changes
  const hasAvailableSlots = useMemo(() => {
    const now = new Date();
    return doctor.availability.some((slot) => new Date(slot) >= now);
  }, [doctor.availability]);

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border-2 border-slate-50 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-500 group">
      <div className="flex flex-row gap-5 mb-7">
        <div className="relative shrink-0">
          <Image 
            src={doctor.image} 
            alt={name} 
            width={88} 
            height={88} 
            className="rounded-[1.75rem] object-cover bg-slate-50" 
            loading="lazy" 
          />
          <div className={`absolute -bottom-2 ${isRtl ? '-left-2' : '-right-2'} bg-white shadow-md rounded-xl px-2.5 py-1.5 flex items-center gap-1`}>
            <Star size="0.875rem" className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-black">4.9</span>
          </div>
        </div>
        
        <div className="flex flex-col pt-1">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck size="1rem" className="text-medical-teal" />
            <span className="text-[0.65rem] font-black text-medical-teal uppercase tracking-widest">
              {t("insuranceVerified") || "Verified"}
            </span>
          </div>
          <h3 className="font-black text-teal-900 text-lg leading-tight mb-1">{name}</h3>
          <p className="text-slate-500 text-sm font-semibold">{specialty}</p>
        </div>
      </div>

      <div className="flex flex-row gap-3">
        {doctor.can_chat && (
          <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-50 text-slate-600 font-extrabold text-sm cursor-pointer hover:bg-slate-100 transition-all active:scale-95">
            <MessageCircle size="1.125rem" /> {t("chatNow")}
          </button>
        )}
        
        {hasAvailableSlots && (
          <button 
            onClick={() => onBooking(doctor)}
            className="flex-[1.5] flex items-center justify-center gap-2 py-4 rounded-2xl bg-medical-teal text-white font-extrabold text-sm cursor-pointer hover:brightness-95 transition-all shadow-lg shadow-teal-500/20 active:scale-95"
          >
            <Calendar size="1.125rem" /> {t("book")}
          </button>
        )}
      </div>
    </div>
  );
});

DoctorCard.displayName = "DoctorCard";

export default DoctorCard;