"use client";
import { useState, useEffect, useMemo } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Search, ChevronDown } from "lucide-react"; // Added ChevronDown for the button
import DoctorCard from "@/components/DoctorCard";
import BookingModal from "@/components/BookingModal";
import { CATEGORIES } from "@/constants";
import { getDoctorsAction } from "@/actions/getDoctors";
import { Doctor } from "@/types";
import { reserveAppointment } from "@/actions/reserveAppointment";

export default function DashboardPage() {
  const { selectedInsuranceId } = useUserStore();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [selectedDr, setSelectedDr] = useState<Doctor | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // --- Pagination State ---
  const ITEMS_PER_PAGE = 12;
  const [displayLimit, setDisplayLimit] = useState(ITEMS_PER_PAGE);
  
  useEffect(() => {
    getDoctorsAction().then(setDoctors);
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setDisplayLimit(ITEMS_PER_PAGE);
  }, [search, activeCat, selectedInsuranceId]);

  const filteredDoctors = useMemo(() => {
    const insuranceId = selectedInsuranceId?.toString();
    return doctors.filter((dr) => {
      const matchesInsurance = !insuranceId || dr.insurance_ids.map(String).includes(insuranceId);
      const matchesSearch = dr.name_en.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCat === "all" || dr.specialty_en === activeCat;
      return matchesInsurance && matchesSearch && matchesCat;
    });
  }, [doctors, search, activeCat, selectedInsuranceId]);

  // --- Paginated Slice ---
  const visibleDoctors = useMemo(() => {
    return filteredDoctors.slice(0, displayLimit);
  }, [filteredDoctors, displayLimit]);

  return (
    <main className="min-h-screen bg-[#f8fafc] p-[3rem]">
      <div className="max-w-[80rem] mx-auto flex flex-col gap-[4rem]">
        
        {/* Search & Categories */}
        <section className="flex flex-col gap-[2rem]">
          <div className="relative w-full max-w-[40rem]">
            <Search className="absolute left-[1.5rem] top-1/2 -translate-y-1/2 text-[#94a3b8]" size="1.5rem" />
            <input 
              className="w-full bg-[#ffffff] border-none outline-none rounded-[1.5rem] pl-[4rem] pr-[1.5rem] py-[1.25rem] text-[1.125rem] font-medium shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-medical-teal/20"
              placeholder="Search doctors..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-row items-center gap-[1rem] overflow-x-auto no-scrollbar pb-[0.5rem]">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`cursor-pointer whitespace-nowrap px-[2rem] py-[0.875rem] rounded-[1.25rem] text-[0.875rem] font-[800] transition-all border-[0.125rem] ${
                  activeCat === cat.id ? "bg-medical-teal border-medical-teal text-[#ffffff] shadow-lg shadow-medical-teal/30" : "bg-[#ffffff] border-[#f1f5f9] text-[#64748b] hover:border-[#e2e8f0]"
                }`}
              >
                {cat.en}
              </button>
            ))}
          </div>
        </section>

        {/* Doctors Grid */}
        <section className="flex flex-col gap-[2rem]">
          <div className="flex justify-between items-center">
            <h2 className="text-[2rem] font-[900] text-[#134e4a] tracking-tight">Available Doctors</h2>
            <span className="bg-medical-teal/10 text-medical-teal px-[1.25rem] py-[0.5rem] rounded-[1rem] font-[800] text-[0.875rem]">
              Showing {visibleDoctors.length} of {filteredDoctors.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2.5rem]">
            {visibleDoctors.map((dr) => (
              <DoctorCard 
                onBooking={(dr) => {setSelectedDr(dr); setModalOpen(true);}} 
                key={dr.id} 
                doctor={dr} 
              />
            ))}
          </div>

          {/* Empty State */}
          {
          filteredDoctors.length === 0 && (
            <div className="py-[6rem] bg-[#ffffff] rounded-[3rem] border-[0.2rem] border-dashed border-[#f1f5f9] text-center text-[#94a3b8] font-bold">
              No results found.
          \  </div>
          )}

          {/* Pagination Button */}
          {filteredDoctors.length > displayLimit && (
            <div className="flex justify-center mt-[2rem]">
              <button 
                onClick={() => setDisplayLimit(prev => prev + ITEMS_PER_PAGE)}
                className="flex items-center gap-[0.75rem] px-[3.5rem] py-[1.25rem] bg-[#ffffff] border-2  border-medical-teal text-medical-teal font-[800] rounded-[1.5rem] cursor-pointer hover:bg-medical-teal hover:text-[white] transition-all shadow-md active:scale-95"
              >
                Show More <ChevronDown size="1.25rem" />
              </button>
            </div>
          )}
        </section>
      </div>

      {modalOpen && selectedDr && (
        <BookingModal  
          onReserve={(appointmentData, withGoogle) => {
            reserveAppointment(appointmentData, withGoogle).then(() => {
              setSelectedDr(null);
            })
          }} 
          doctor={selectedDr??null} 
          onClose={() => setSelectedDr(null)} 
        />
      )}
    </main>
  );
}