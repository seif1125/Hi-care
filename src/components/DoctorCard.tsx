"use client";
import { Doctor, DoctorCardProps } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import { MessageCircle, Calendar, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";



export default function DoctorCard({ doctor, onBooking }: DoctorCardProps) {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  const isRtl = locale === "ar";

  const name = isRtl ? doctor.name_ar : doctor.name_en;
  const specialty = isRtl ? doctor.specialty_ar : doctor.specialty_en;

  return (
    <div className="bg-[#ffffff] rounded-[2.5rem] p-[1.5rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] border-[0.125rem] border-[#f1f5f9] hover:shadow-[0_20px_40px_-15px_rgba(13,148,136,0.1)] transition-all duration-500 group">
      <div className="flex flex-row gap-[1.25rem] mb-[1.75rem]">
        <div className="relative shrink-0">
          <Image src={doctor.image} alt={name} width={88} height={88} className=" rounded-[1.75rem] object-cover bg-[#f8fafc]" loading="lazy" />
          <div className={`absolute -bottom-[0.5rem] ${isRtl ? '-left-[0.5rem]' : '-right-[0.5rem]'} bg-[#ffffff] shadow-sm rounded-[0.75rem] px-[0.625rem] py-[0.375rem] flex items-center gap-[0.25rem]`}>
            <Star size="0.875rem" className="fill-yellow-400 text-yellow-400" />
            <span className="text-[0.75rem] font-[800]">4.9</span>
          </div>
        </div>
        
        <div className="flex flex-col pt-[0.25rem]">
          <div className="flex items-center gap-[0.5rem] mb-[0.375rem]">
            <ShieldCheck size="1rem" className="text-medical-teal" />
            <span className="text-[0.6875rem] font-[800] text-medical-teal uppercase tracking-widest">{t("insuranceVerified") || "Verified"}</span>
          </div>
          <h3 className="font-[900] text-[#134e4a] text-[1.125rem] leading-tight mb-[0.25rem]">{name}</h3>
          <p className="text-[#64748b] text-[0.875rem] font-[600]">{specialty}</p>
        </div>
      </div>

      <div className="flex flex-row gap-[0.75rem]">
        {doctor.can_chat && (
          <button className="flex-1 flex items-center justify-center gap-[0.5rem] py-[1rem] rounded-[1.25rem] bg-[#f8fafc] text-[#475569] font-[800] text-[0.875rem] cursor-pointer hover:bg-[#f1f5f9] transition-all">
            <MessageCircle size="1.125rem" /> {t("chatNow")}
          </button>
        )}
        <button 
          onClick={() => onBooking(doctor)}
          className="flex-[1.5] flex items-center justify-center gap-[0.5rem] py-[1rem] rounded-[1.25rem] bg-medical-teal text-[#ffffff] font-[800] text-[0.875rem] cursor-pointer hover:brightness-95 transition-all shadow-lg shadow-medical-teal/20"
        >
          <Calendar size="1.125rem" /> {t("book")}
        </button>
      </div>
    </div>
  );
}