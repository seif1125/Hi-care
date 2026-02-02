"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useAppointmentStore } from "@/store/useAppointmentsStore";
import { Search, ChevronDown } from "lucide-react";
import DoctorCard from "@/components/DoctorCard";
import BookingModal from "@/components/BookingModal";
import { SuccessToast } from "@/components/ToastMessage";
import { CATEGORIES, ITEMS_PER_PAGE } from "@/constants";
import { getDoctorsAction } from "@/actions/getDoctors";
import { Doctor } from "@/types";
import { reserveAppointment } from "@/actions/reserveAppointment";
import { useLocale, useTranslations } from "next-intl";
import { filterDoctors } from "@/utils/index";
import ChatModal from "@/components/ChatModal";

export default function DashboardPage() {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  
  const { selectedInsuranceId } = useUserStore();
  const { addAppointment } = useAppointmentStore();

  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [selectedDr, setSelectedDr] = useState<Doctor | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    let isMounted = true;
    getDoctorsAction().then(data => {
      if (isMounted) setDoctors(data);
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    setDisplayLimit(ITEMS_PER_PAGE);
  }, [search, activeCat, selectedInsuranceId]);

  const filteredDoctors = useMemo(() => 
    filterDoctors(doctors, search, activeCat, selectedInsuranceId?.toString(), locale),
  [doctors, search, activeCat, selectedInsuranceId, locale]);

  const visibleDoctors = useMemo(() => 
    filteredDoctors.slice(0, displayLimit),
  [filteredDoctors, displayLimit]);

  const handleReserve = useCallback(async (appointmentData: any, withGoogle: boolean) => {
    try {
      await reserveAppointment(appointmentData, addAppointment, withGoogle, locale);
      setBookingModalOpen(false);
      setSelectedDr(null);
      setShowSuccess(true);
    } catch (error) {
      console.error("Reservation failed:", error);
    }
  }, [addAppointment, locale]);

  const handleOpenChat = (dr: Doctor) => {
    setSelectedDr(dr);
    setChatModalOpen(true);
  };

  const handleOpenBooking = (dr: Doctor) => {
    setSelectedDr(dr);
    setBookingModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-[1.5rem] md:p-[3rem]">
      <div className="max-w-[80rem] mx-auto flex flex-col gap-[4rem]">
        
        {/* Search & Categories Section */}
        <section className="flex flex-col gap-[2rem]">
          <div className="relative w-full max-w-[36rem]">
            <Search className="absolute left-[1.5rem] top-[50%] -translate-y-[50%] text-slate-400" size="1.5rem" />
            <input 
              className="w-full bg-white border-none rounded-[1.5rem] pl-[4rem] pr-[1.5rem] py-[1.25rem] text-[1.125rem] font-medium shadow-sm focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
              placeholder={t("searchDoctor")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-[1rem] overflow-x-auto no-scrollbar pb-[0.5rem]">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`px-[2rem] py-[0.875rem] rounded-[1rem] text-[0.875rem] font-[800] transition-all border-2 whitespace-nowrap ${
                  activeCat === cat.id 
                    ? "bg-medical-teal border-medical-teal text-white shadow-lg shadow-teal-500/30" 
                    : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                }`}
              >
                {locale === "en" ? cat.en : cat.ar}
              </button>
            ))}
          </div>
        </section>

        {/* Doctor Grid Section */}
        <section className="flex flex-col gap-[2rem]">
          <div className="flex justify-between items-center">
            <h2 className="text-[1.875rem] font-[900] text-teal-900 leading-[1.2]">{t('availableDoctors')}</h2>
            <span className="bg-teal-50 text-medical-teal px-[1.25rem] py-[0.5rem] rounded-[1rem] font-[800] text-[0.875rem]">
              {t('showing')} {visibleDoctors.length} {t('of')} {filteredDoctors.length}
            </span>
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2.5rem]">
              {visibleDoctors.map((dr) => (
                <DoctorCard 
                  key={dr.id} 
                  doctor={dr} 
                  onBooking={() => handleOpenBooking(dr)} 
                  onChat={() => handleOpenChat(dr)}
                />
              ))}
            </div>
          ) : (
            <div className="py-[6rem] bg-white rounded-[3rem] border-4 border-dashed border-slate-100 text-center text-slate-400 font-[700]">
              {t('noResults')}
            </div>
          )}

          {filteredDoctors.length > displayLimit && (
            <div className="flex justify-center mt-[2rem]">
              <button 
                onClick={() => setDisplayLimit(prev => prev + ITEMS_PER_PAGE)}
                className="flex items-center gap-[0.75rem] px-[3.5rem] py-[1.25rem] bg-white border-2 border-medical-teal text-medical-teal font-[800] rounded-[1.5rem] cursor-pointer hover:bg-medical-teal hover:text-white transition-all active:scale-[0.95] shadow-md"
              >
                {t('showMore')}<ChevronDown size="1.25rem" />
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Modals Rendering Logic */}
      {selectedDr && bookingModalOpen && (
        <BookingModal  
          doctor={selectedDr}
          onClose={() => {setSelectedDr(null); setBookingModalOpen(false)}} 
          onReserve={handleReserve} 
        />
      )}

      {chatModalOpen && selectedDr && (
        <ChatModal 
          doctor={selectedDr}
          onClose={() => {setChatModalOpen(false); setSelectedDr(null);}} 
        />
      )}

      {showSuccess && (
        <SuccessToast 
          message={t('appointmentSuccess')} 
          onClose={() => setShowSuccess(false)} 
        />
      )}
    </main>
  );
}