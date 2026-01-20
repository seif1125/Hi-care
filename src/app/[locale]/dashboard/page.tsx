"use client";
import { useState, useEffect, useMemo } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Search } from "lucide-react";
import DoctorCard from "@/components/DoctorCard";
import UpcomingAppointments from "@/components/UpcomingAppointments";
import { CATEGORIES } from "@/constants";
import { getDoctorsAction } from "@/actions/getDoctors";
import { Doctor } from "@/types";


export default  function DashboardPage() {
  const { selectedInsuranceId } = useUserStore();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
const fetchDoctors = async () => {
    const data = await getDoctorsAction();
    setDoctors(data);
  }
  useEffect(() => {
    // Fetch from your MockAPI or local JSON
    fetchDoctors();
  }, []);

  

  const filteredDoctors = useMemo(() => {
    return doctors.filter(dr => {
      const matchesInsurance = dr.insurance_ids.includes(selectedInsuranceId);
      const matchesSearch = dr.name_en.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCat === "all" || dr.specialty_en === activeCat;
      return matchesInsurance && matchesSearch && matchesCat;
    });
  }, [doctors, search, activeCat, selectedInsuranceId]);

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-8">

      {/* Search & Categories */}
      <section className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-medical-teal"
            placeholder="Search for doctors..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
                activeCat === cat.id ? "bg-medical-teal text-white" : "bg-white text-slate-600"
              }`}
            >
              {cat.en}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(dr => <DoctorCard key={dr.id} doctor={dr} />)}
      </div>
    </main>
  );
}