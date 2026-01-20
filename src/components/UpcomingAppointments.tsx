"use client";
import { useUserStore } from "@/store/useUserStore";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Video, MapPin, Calendar } from "lucide-react";
import { useAppointmentStore } from "@/store/useAppointmentsStore";

export default function UpcomingAppointments() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  // Assuming you've added 'appointments' to your Zustand store

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
        {t("upcoming")} 
        <span className="bg-medical-teal text-white text-[0.7rem] px-2 py-0.5 rounded-full">
          {appointments.length}
        </span>
      </h2>
      
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {appointments.map((app) => (
          <div key={app.id} className="min-w-[20rem] bg-medical-teal rounded-[2rem] p-5 text-white shadow-xl shadow-medical-teal/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-medical-teal/80 text-[0.7rem] font-bold uppercase tracking-widest mb-1">
                    {app.type}
                  </p>
                  <h4 className="font-bold text-lg">{app.doctorName}</h4>
                </div>
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                  <Video size={20} />
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm font-medium bg-black/10 p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{new Date(app.time).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="w-px h-4 bg-white/20" />
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(app.time).toLocaleDateString(locale)}</span>
                </div>
              </div>
            </div>
            {/* Aesthetic background circle */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}