"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useAppointmentStore } from "@/store/useAppointmentsStore";
import { Search, ChevronDown } from "lucide-react";
import DoctorCard from "@/components/DoctorCard";
import BookingModal from "@/components/BookingModal";
import { CATEGORIES, ITEMS_PER_PAGE } from "@/constants";
import { getDoctorsAction } from "@/actions/getDoctors";
import { Doctor } from "@/types";
import { reserveAppointment } from "@/actions/reserveAppointment";
import { useLocale, useTranslations } from "next-intl";
import { filterDoctors } from "@/utils/index";

export default function DashboardPage() {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  
  // Stores
  const { selectedInsuranceId } = useUserStore();
  const { addAppointment } = useAppointmentStore();

  // State
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [selectedDr, setSelectedDr] = useState<Doctor | null>(null);
  const [displayLimit, setDisplayLimit] = useState(ITEMS_PER_PAGE);

  // Initial Fetch
  useEffect(() => {
    let isMounted = true;
    getDoctorsAction().then(data => {
      if (isMounted) setDoctors(data);
    });
    return () => { isMounted = false; };
  }, []);

  // Reset pagination on filter change
  useEffect(() => {
    setDisplayLimit(ITEMS_PER_PAGE);
  }, [search, activeCat, selectedInsuranceId]);

  // Derived Data
  const filteredDoctors = useMemo(() => 
    filterDoctors(doctors, search, activeCat, selectedInsuranceId?.toString(), locale),
  [doctors, search, activeCat, selectedInsuranceId, locale]);

  const visibleDoctors = useMemo(() => 
    filteredDoctors.slice(0, displayLimit),
  [filteredDoctors, displayLimit]);

  // Handlers
  const handleReserve = useCallback(async (appointmentData: any, withGoogle: boolean) => {
    try {
      await reserveAppointment(appointmentData, addAppointment, withGoogle);
      setSelectedDr(null);
    } catch (error) {
      console.error("Reservation failed:", error);
    }
  }, [addAppointment]);

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Search & Categories */}
        <section className="flex flex-col gap-8">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size="1.5rem" />
            <input 
              className="w-full bg-white border-none rounded-3xl pl-16 pr-6 py-5 text-lg font-medium shadow-sm focus:ring-2 focus:ring-teal-500/20 outline-none"
              placeholder={t("searchDoctor")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`px- py-3.5 rounded-2xl text-sm font-extrabold transition-all border-2 whitespace-nowrap ${
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

        {/* Doctor List */}
        <section className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-teal-900">{t('availableDoctors')}</h2>
            <span className="bg-teal-50 text-medical-teal px-5 py-2 rounded-2xl font-extrabold text-sm">
              {t('showing')} {visibleDoctors.length} {t('of')} {filteredDoctors.length}
            </span>
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {visibleDoctors.map((dr) => (
                <DoctorCard 
                  key={dr.id} 
                  doctor={dr} 
                  onBooking={setSelectedDr} 
                />
              ))}
            </div>
          ) : (
            <div className="py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-50 text-center text-slate-400 font-bold">
              {t('noResults')}
            </div>
          )}

          {filteredDoctors.length > displayLimit && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={() => setDisplayLimit(prev => prev + ITEMS_PER_PAGE)}
                className="flex items-center gap-3 px-14 py-5 bg-white border-2 border-medical-teal text-medical-teal font-extrabold rounded-3xl hover:bg-medical-teal hover:text-white transition-all active:scale-95"
              >
                {t('showMore')}<ChevronDown size="1.25rem" />
              </button>
            </div>
          )}
        </section>
      </div>

      {selectedDr && (
        <BookingModal  
          doctor={selectedDr}
          onClose={() => setSelectedDr(null)} 
          onReserve={handleReserve} 
        />
      )}
    </main>
  );
}