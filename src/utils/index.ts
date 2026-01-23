import { Doctor } from "@/types";

// Move this above the component or to a utils file
export const filterDoctors = (
    doctors: Doctor[],
    search: string,
    category: string,
    insuranceId: string | undefined,
    locale: string
  ) => {
    const query = search.toLowerCase();
    return doctors.filter((dr) => {
      const matchesInsurance = !insuranceId || dr.insurance_ids.map(String).includes(insuranceId);
      const matchesCat = category === "all" || dr.specialty_en === category;
      const name = locale === 'en' ? dr.name_en : dr.name_ar;
      const matchesSearch = name.toLowerCase().includes(query);
      
      return matchesInsurance && matchesCat && matchesSearch;
    });
  };