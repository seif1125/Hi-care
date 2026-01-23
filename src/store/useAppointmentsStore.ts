import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Appointment } from '@/types';

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  cancelAppointment: (id: string) => void;
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set) => ({
      appointments: [],
      
      addAppointment: (newApp) => set((state) => ({
        // We add the new appointment to the start of the list
        appointments: [newApp, ...state.appointments]
      })),

      cancelAppointment: (id) => set((state) => ({
        appointments: state.appointments.filter(app => app.id !== id)
      })),
    }),
    { name: 'hi-care-appointments' }
  )
);