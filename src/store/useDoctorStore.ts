import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DoctorState {
  drId: string;
  drName: string;
  drImage: string;
  drToken: string;
  setDrAuth: (id: string, name: string, image: string, token: string) => void;
  clearDrAuth: () => void;
}

export const useDoctorStore = create<DoctorState>()(
  persist(
    (set) => ({
      drId: "",
      drName: "",
      drImage: "",
      drToken: "",
      setDrAuth: (id, name, image, token) => 
        set({ drId: id, drName: name, drImage: image, drToken: token }),
      clearDrAuth: () => 
        set({ drId: "", drName: "", drImage: "", drToken: "" }),
    }),
    { name: 'hi-care-dr-v1' }
  )
);