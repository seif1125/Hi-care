"use client";
import { DoctorCardProps } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import { MessageCircle, Calendar, ShieldCheck, Star } from "lucide-react";
import { div } from "framer-motion/client";



export default function DoctorCard({ doctor }: DoctorCardProps) {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  const isRtl = locale === "ar";

  const name = isRtl ? doctor.name_ar : doctor.name_en;
  const specialty = isRtl ? doctor.specialty_ar : doctor.specialty_en;

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
      <div className="flex gap-4 mb-6">
        <div className="relative">
          <img 
            src={doctor.image} 
            alt={name} 
            className="w-20 h-20 rounded-2xl object-cover bg-slate-50"
          />
          <div className="absolute -bottom-2 -right-2 bg-white shadow-sm rounded-lg px-2 py-1 flex items-center gap-1">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[0.7rem] font-bold">4.9</span>
          </div>
        </div>
        
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={16} className="text-medical-teal" />
            <span className="text-[0.65rem] font-bold text-medical-teal uppercase tracking-wider">
              {"Verified Plan"}
            </span>
          </div>
          <h3 className="font-black text-slate-800 text-lg leading-tight">{name}</h3>
          <p className="text-slate-500 text-sm font-medium">{specialty}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {doctor.can_chat && (
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors">
            <MessageCircle size={18} />
            {t("chatNow")}
          </button>
        )}
        
        {doctor.can_reserve && (
         <div className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors ${
            doctor.can_chat ? 'bg-medical-teal text-white hover:bg-medical-teal/90' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}>
            <Calendar size={18} />
            {t("book")}
            </div>
          
        )}
      </div>
    </div>
  );
}