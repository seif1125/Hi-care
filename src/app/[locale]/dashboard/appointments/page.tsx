"use client";

import { useAppointmentStore } from "@/store/useAppointmentsStore";
import { useLocale, useTranslations } from "next-intl";
import { Calendar, Clock, User, Trash2, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AppointmentsPage() {
  const t = useTranslations("Appointments");
  const locale = useLocale();
  const { appointments, cancelAppointment } = useAppointmentStore();

  return (
    <main className="min-h-[100vh] bg-[#f8fafc] p-[1.5rem] md:p-[3rem]">
      <div className="max-w-[64rem] mx-auto flex flex-col gap-[2.5rem]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-[1.5rem]">
          <div className="flex flex-col gap-[0.5rem]">
            <Link href="/dashboard" className="flex items-center gap-[0.5rem] text-medical-teal font-[800] text-[0.875rem] hover:underline mb-[0.5rem]">
              <ArrowLeft size="1rem" /> {t('backToDashboard') || "Back to Dashboard"}
            </Link>
            <h1 className="text-[2.25rem] text-center md:text-start font-[900] text-[#134e4a] tracking-tight">
              {t('myAppointments')}
            </h1>
          </div>
          
          <div className="bg-[#ffffff] border-[0.125rem] text-center md:text-start border-[#f1f5f9] px-[1.5rem] py-[1rem] rounded-[1.5rem] shadow-sm">
            <p className="text-[#64748b] text-[0.75rem] font-[800] uppercase tracking-wider mb-[0.25rem]">{t('totalBookings')}</p>
            <p className="text-[1.5rem] font-[900] text-medical-teal">{appointments.length}</p>
          </div>
        </div>

        {/* Appointments List */}
        <div className="flex flex-col gap-[1.25rem]">
          {appointments.length > 0 ? (
            appointments.map((apt) => (
              <div 
                key={apt.id} 
                className="bg-[#ffffff] border-[0.125rem] border-[#f1f5f9] rounded-[2rem] p-[1.5rem] md:p-[2rem] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center items-end justify-between gap-[2rem]"
              >
                {/* Doctor & Specialty info */}
                <div className="flex items-center gap-[1.5rem]">
                  <div className="w-[4.5rem] h-[4.5rem] bg-[#f8fafc] rounded-[1.25rem] flex items-center justify-center text-medical-teal">
                    <User size="2rem" />
                  </div>
                  <div className="flex flex-col gap-[0.25rem]">
                    <h3 className="text-[1.25rem] font-[900] text-[#134e4a]">{apt.doctorName}</h3>
                    <p className="text-[#64748b] font-[600] text-[0.875rem]">{apt.specialty}</p>
                  </div>
                </div>

                {/* Date & Time info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1rem] md:gap-[3rem]">
                  <div className="flex items-center gap-[0.75rem]">
                    <div className="p-[0.5rem] bg-medical-teal/10 rounded-[0.75rem] text-medical-teal">
                      <Calendar size="1.25rem" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.65rem] font-[800] text-[#94a3b8] uppercase">{t('date')}</span>
                      <span className="text-[0.9375rem] font-[700] text-[#1e293b]">
                        {new Date(apt.time).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-[0.75rem]">
                    <div className="p-[0.5rem] bg-medical-teal/10 rounded-[0.75rem] text-medical-teal">
                      <Clock size="1.25rem" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.65rem] font-[800] text-[#94a3b8] uppercase">{t('time')}</span>
                      <span className="text-[0.9375rem] font-[700] text-[#1e293b]">
                        {new Date(apt.time).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end border-t-[0.125rem] md:border-none border-[#f1f5f9] pt-[1.5rem] md:pt-0">
                  <button 
                    onClick={() => {
                      if(confirm(t('confirmCancel'))) cancelAppointment(apt.id);
                    }}
                    className="flex items-center gap-[0.5rem] text-[#ef4444] font-[800] text-[0.875rem] hover:bg-red-50 px-[1.25rem] py-[0.75rem] rounded-[1rem] transition-all cursor-pointer group"
                  >
                    <Trash2 size="1.125rem" className="group-hover:shake" />
                    {t('cancelAppointment')}
                  </button>
                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="bg-[#ffffff] border-[0.25rem] border-dashed border-[#f1f5f9] rounded-[3rem] p-[5rem] flex flex-col items-center text-center gap-[1.5rem]">
              <div className="w-[5rem] h-[5rem] bg-[#f8fafc] rounded-full flex items-center justify-center text-[#94a3b8]">
                <AlertCircle size="2.5rem" />
              </div>
              <div className="flex flex-col gap-[0.5rem]">
                <h2 className="text-[1.5rem] font-[900] text-[#1e293b]">{t('noAppointments')}</h2>
                <p className="text-[#64748b] font-[600]">{t('noAppointmentsDesc')}</p>
              </div>
              <Link href="/dashboard" className="mt-[1rem] bg-medical-teal text-white font-[800] px-[2.5rem] py-[1rem] rounded-[1.5rem] hover:brightness-95 transition-all shadow-lg shadow-medical-teal/20">
                {t('bookNow')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}