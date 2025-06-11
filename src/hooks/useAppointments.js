// useAppointments.js
import { useEffect, useState } from "react";
import { fetchAppointments } from "@api/appointmentApi";

export const useAppointments = ({ filterByPatientId } = {}) => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAppointments();

        const filtered = data.filter((appt) => {
          const isValidStatus = ["pending", "confirmed", "completed", "cancelled"].includes(appt.appointment_status);
          const isForPatient = !filterByPatientId || appt.patient_id === filterByPatientId;
          return isValidStatus && isForPatient;
        });

        const mapped = filtered.map((appt) => {
          let date = "N/A", time = "N/A";
          const ts = parseInt(appt.appointment_date_time);
          if (!isNaN(ts)) {
            const d = new Date(ts * 1000);
            date = d.toISOString().split("T")[0];
            time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          }

          return {
            id: appt.id,
            appointmentId: appt.appointment_id,
            patientId: appt.patient_id,
            patientName: appt.patient_name,
            doctorName: appt.doctor_name,
            status: appt.appointment_status,
            date,
            time,
            notes: appt.notes,
          };
        });

        setAppointments(mapped);
      } catch (err) {
        setError("Không thể tải lịch hẹn.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [filterByPatientId]);

  return { appointments, isLoading, error };
};
