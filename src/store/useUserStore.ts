import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface UserState {
  id: string;
  name: string;
  email: string;
  token: string | null; // Add this
  selectedInsuranceId: string;
  hasConsented: boolean;
  setPersonalInfo: (name: string, email: string) => void;
  setInsurance: (id: string) => void;
  setConsent: (hasConsented: boolean) => void;
  setAuth: (id: string, token: string) => void; // Add this
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: "",
      name: "",
      email: "",
      token: null,
      selectedInsuranceId: "",
      hasConsented: false,
      setPersonalInfo: (name, email) => set({ name, email }),
      setInsurance: (id) => set({ selectedInsuranceId: id }),
      setConsent: (hasConsented) => set({ hasConsented }),
      setAuth: (id, token) => set({ id, token }), // Implementation
    }),
    { name: 'hi-care-registration' }
  )
);