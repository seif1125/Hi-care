import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  name: string;
  email: string;
  selectedInsuranceId: string;
  hasConsented: boolean;
  setPersonalInfo: (name: string, email: string) => void;
  setInsurance: (id: string) => void;
  setConsent: (hasConsented: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: "",
      email: "",
      selectedInsuranceId: "",
      hasConsented: false,
      setPersonalInfo: (name, email) => set({ name, email }),
      setInsurance: (id) => set({ selectedInsuranceId: id }),
      setConsent: (hasConsented) => set({ hasConsented }),
    }),
    { name: 'hi-care-registration' }
  )
);