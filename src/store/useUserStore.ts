import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  id: string;
  name: string;
  email: string;
  token: string | null;
  selectedInsuranceId: string;
  hasConsented: boolean;
  // Actions
  setPersonalInfo: (name: string, email: string) => void;
  setInsurance: (id: string) => void;
  setConsent: (hasConsented: boolean) => void;
  setAuth: (id: string, name: string, token: string) => void;
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
      setAuth: (id, name, token) => set({ id, name, token }), // Saves the session
    }),
    { name: 'hi-care-registration' }
  )
);