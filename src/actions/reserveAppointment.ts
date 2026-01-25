import { useAppointmentStore } from "@/store/useAppointmentsStore";
import { Appointment } from "@/types";

export const reserveAppointment = async (
  appointmentData: Appointment, 
  addAppointment: (data: Appointment) => void, // Pass the function here
  withGoogle: boolean,
  locale: string
): Promise<void> => {
  // 1. Handle API logic (e.g., using your API URL env variable)
  // 2. Update the local store
  addAppointment(appointmentData);
  if (withGoogle) {
    const start = new Date(appointmentData.time).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(appointmentData.time).getTime() + 30 * 60000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=Appointment+with+${locale === "ar" ? appointmentData.doctorName_ar : appointmentData.doctorName_en}&dates=${start}/${end}&details=${appointmentData.userComment}`;
    window.open(url, "_blank");
  }
};

 
