"use client";

import { useState, memo, useMemo, useCallback } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useLocale, useTranslations } from "next-intl";
import { ModalProps, Appointment } from "@/types";
import { X, Calendar as CalIcon, Clock, Shield, User, Mail, MessageSquare } from "lucide-react";

// --- Sub-components ---

const ReadOnlyField = memo(({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[0.7rem] font-extrabold text-slate-400 uppercase flex items-center gap-1.5">
      {icon} {label}
    </span>
    <p className="text-base font-bold text-slate-800 truncate">{value || "N/A"}</p>
  </div>
));
ReadOnlyField.displayName = "ReadOnlyField";

// Separated to prevent re-renders of the whole modal on text input
const BookingSummary = memo(({ details, t, locale }: { details: any; t: any; locale: string }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
    <ReadOnlyField icon={<User size="1rem"/>} label={t('patientName')} value={details.name} />
    <ReadOnlyField icon={<Mail size="1rem"/>} label={t('emailAddress')} value={details.email} />
    <ReadOnlyField icon={<Shield size="1rem"/>} label={t('insurance')} value={details.insurance} />
    <ReadOnlyField icon={<CalIcon size="1rem"/>} label={t("doctor")} value={details.drName} />
    <ReadOnlyField icon={<Clock size="1rem"/>} label={t("specialty")} value={details.drSpecialty} />
    <ReadOnlyField 
      icon={<Clock size="1rem"/>} 
      label={t('date')} 
      value={new Date(details.slot).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' })} 
    />
  </div>
));
BookingSummary.displayName = "BookingSummary";

// --- Main Component ---

export default function BookingModal({ doctor, onClose, onReserve }: ModalProps) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const { name, email, selectedInsuranceId } = useUserStore();

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  // Memoized doctor info
  const drInfo = useMemo(() => ({
    name: locale === "ar" ? doctor.name_ar : doctor.name_en,
    specialty: locale === "ar" ? doctor.specialty_ar : doctor.specialty_en
  }), [doctor, locale]);

  // Filter valid slots (Current date/time and future only)
  const availableSlots = useMemo(() => {
    const now = new Date();
    return doctor.availability.filter(slot => new Date(slot) >= now);
  }, [doctor.availability]);

  const handleFinalize = useCallback((withGoogle: boolean) => {
    if (!selectedSlot) return;

    const appointment: Appointment = {
      id: crypto.randomUUID(),
      doctorId: doctor.id,
      doctorName: drInfo.name,
      specialty: drInfo.specialty,
      time: selectedSlot,
      type: "consultation",
      userComment: comment,
    };

    onReserve(appointment, withGoogle);
    onClose();
  }, [selectedSlot, doctor.id, drInfo, comment, onReserve, onClose]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[45rem] max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative">
        
        <button onClick={onClose} aria-label="Close" className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
          <X size="1.5rem" className="text-slate-500" />
        </button>

        <h2 className="text-3xl font-black text-teal-900 mb-8 tracking-tight">{t("book")}</h2>

        {/* Slot Selection */}
        <div className="flex flex-col gap-4 mb-10">
          <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">{t('selectTime')}</label>
          <div className="flex flex-wrap gap-3">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer border-2 ${
                  selectedSlot === slot 
                  ? "bg-medical-teal border-medical-teal text-white shadow-lg shadow-teal-500/40" 
                  : "bg-slate-50 border-slate-100 text-slate-600 hover:border-teal-200"
                }`}
              >
                {new Date(slot).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Booking Details Section */}
        {selectedSlot && (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <BookingSummary 
              t={t} 
              locale={locale}
              details={{
                name: name || t('anonymous'),
                email: email || t('anonymousEmail'),
                insurance: selectedInsuranceId || t('noInsurance'),
                drName: drInfo.name,
                drSpecialty: drInfo.specialty,
                slot: selectedSlot
              }}
            />

            <div className="flex flex-col gap-3">
              <label className="text-sm font-extrabold text-slate-500 flex items-center gap-2">
                <MessageSquare size="1rem" /> {t('notes')}
              </label>
              <textarea 
                className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-medical-teal transition-all min-h-[8rem] text-slate-700"
                placeholder={t('bookingPlaceholder')} 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => handleFinalize(false)} 
                className="flex-1 bg-medical-teal text-white font-extrabold py-5 rounded-2xl cursor-pointer hover:brightness-90 transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
              >
                {t('confirmReservation')}
              </button>
              <button 
                onClick={() => handleFinalize(true)} 
                className="flex-1 bg-white border-2 border-slate-200 text-slate-800 font-extrabold py-5 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <span className="text-google-red font-bold">G</span> {t("saveGoogle")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}