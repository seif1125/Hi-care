"use client";
import { useState, memo } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useLocale, useTranslations } from "next-intl";
import {  ModalProps } from "@/types";
import { X, Calendar as CalIcon, Clock, Shield, User, Mail, MessageSquare } from "lucide-react";

const ReadOnlyField = memo(({ icon, label, value }: { icon: React.ReactNode; label: string; value: any }) => (
  <div className="flex flex-col gap-[0.25rem]">
    <span className="text-[0.7rem] font-[800] text-[#94a3b8] uppercase flex items-center gap-[0.35rem]">
      {icon} {label}
    </span>
    <p className="text-[1rem] font-[700] text-[#1e293b] truncate">{value || "N/A"}</p>
  </div>
));
ReadOnlyField.displayName = "ReadOnlyField";

export default function BookingModal({ doctor, onClose,onReserve }: ModalProps) {
  const { name, email, selectedInsuranceId } = useUserStore();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  const drName = locale === "ar" ? doctor.name_ar : doctor.name_en;
  const drSpecialty = locale === "ar" ? doctor.specialty_ar : doctor.specialty_en;

  const handleFinalize = (withGoogle: boolean) => {
    if (!selectedSlot) return;
    onReserve( {
      id: crypto.randomUUID(),
      doctorId: doctor.id,
      doctorName: drName,
      specialty: drSpecialty,
      time: selectedSlot,
      type: "consultation",
      userComment: comment,
    },withGoogle);




    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-medical-dark/60 backdrop-blur-[0.5rem] p-[1rem]">
      <div className="bg-[#ffffff] w-full max-w-[45rem] max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] relative">
        <button onClick={onClose} className="absolute top-[1.5rem] right-[1.5rem] p-[0.5rem] hover:bg-[#f1f5f9] rounded-full cursor-pointer transition-colors">
          <X size="1.5rem" className="text-[#64748b]" />
        </button>

        <h2 className="text-[1.75rem] font-[900] text-[#134e4a] mb-[2rem] tracking-tight">{t("book")}</h2>

        <div className="flex flex-col gap-[1rem] mb-[2.5rem]">
          <label className="text-[0.875rem] font-[800] text-[#64748b] uppercase tracking-wider">Select Available Time</label>
          <div className="flex flex-wrap gap-[0.75rem]">
            {doctor.availability.filter((slot) => new Date(slot) >= new Date()).map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-[1.5rem] py-[0.75rem] rounded-[1rem] font-[700] text-[0.875rem] transition-all cursor-pointer border-2 ${
                  selectedSlot === slot 
                  ? "bg-medical-teal border-medical-teal text-[#ffffff] shadow-[0_8px_20px_-5px_rgba(13,148,136,0.4)]" 
                  : "bg-[#f8fafc] border-[#f1f5f9] text-[#475569] hover:border-medical-teal/30"
                }`}
              >
                {new Date(slot).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
              </button>
            ))}
          </div>
        </div>

        {selectedSlot && (
          <div className="flex flex-col gap-[2rem] animate-in fade-in slide-in-from-bottom-[1rem] duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.5rem] bg-[#f8fafc] p-[2rem] rounded-[2rem] border-2 border-[#f1f5f9]">
              <ReadOnlyField icon={<User size="1rem"/>} label="Patient Name" value={name??'anonymous'} />
              <ReadOnlyField icon={<Mail size="1rem"/>} label="Email Address" value={email??'anonymous@mail.com'} />
              <ReadOnlyField icon={<Shield size="1rem"/>} label="Insurance" value={selectedInsuranceId??'No Insurance'} />
              <ReadOnlyField icon={<CalIcon size="1rem"/>} label="Doctor" value={drName} />
              <ReadOnlyField icon={<Clock size="1rem"/>} label="Specialty" value={drSpecialty} />
              <ReadOnlyField icon={<Clock size="1rem"/>} label="Date" value={new Date(selectedSlot).toLocaleString(locale)} />
            </div>

            <div className="flex flex-col gap-[0.75rem]">
              <label className="text-[0.875rem] font-[800] text-[#64748b] flex items-center gap-[0.5rem]"><MessageSquare size="1rem" /> Notes</label>
              <textarea 
                className="w-full p-[1.5rem] bg-[#ffffff] border-2 border-[#f1f5f9] rounded-[1.5rem] outline-none focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal transition-all min-h-[8rem]"
                placeholder="How can the doctor help you?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-[1rem]">
              <button onClick={() => handleFinalize(false)} className="flex-1 bg-medical-teal text-[#ffffff] font-[800] py-[1.25rem] rounded-[1.5rem] cursor-pointer hover:brightness-95 transition-all shadow-[0_10px_25px_-5px_rgba(13,148,136,0.3)]">Confirm Booking</button>
              <button onClick={() => handleFinalize(true)} className="flex-1 bg-[#ffffff] border-2 border-[#e2e8f0] text-[#1e293b] font-[800] py-[1.25rem] rounded-[1.5rem] cursor-pointer hover:bg-[#f8fafc] transition-all flex items-center justify-center gap-[0.75rem]">
                <span className="text-[#ea4335] font-bold">G</span> {t("saveGoogle")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}