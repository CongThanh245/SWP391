import { useEffect, useState } from "react";
import { fetchAppointments, searchAppointments } from "@api/appointmentApi";

export const useAppointments = ({ filterByPatientId, filters = { dateFilter: "all", fromDate: "", toDate: "" } } = {}) => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {  
      setIsLoading(true);
      try {
        let data;
        if (filters.dateFilter !== "all" || filterByPatientId) {
          // Sử dụng API search nếu có bộ lọc ngày hoặc patientId
          const searchParams = {};
          if (filterByPatientId) searchParams.patientId = filterByPatientId;
          if (filters.dateFilter === "custom" && filters.fromDate && filters.toDate) {
            searchParams.date = `${filters.fromDate},${filters.toDate}`; // Giả sử backend hỗ trợ range
          } else if (filters.dateFilter !== "all") {
            const today = new Date().toISOString().split("T")[0];
            searchParams.date = today;
          }
          data = await searchAppointments(searchParams);
        } else {
          data = await fetchAppointments(filterByPatientId);
        }

        // Ánh xạ dữ liệu từ backend
        const mapped = data.map((appt) => {
          const appointmentDate = new Date(appt.appointmentDateTime);
          const date = appointmentDate.toISOString().split("T")[0];
          const time = appointmentDate.toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit" 
          });
          const status = (appt.appointmentStatus || "").toLowerCase();
          if (status === "completed") return null; // Loại bỏ completed

          return {
            id: appt.appointmentId,
            appointmentId: appt.appointmentId,
            patientId: appt.patientId,
            patientName: appt.patientName,
            doctorName: appt.doctorName,
            doctorId: appt.doctorId,
            status,
            date,
            time,
            notes: appt.notes || "",
            rawDateTime: appt.appointmentDateTime,
          };
        }).filter(appt => appt !== null);

        // Sắp xếp theo ngày
        const sorted = mapped.sort((a, b) => {
          const dateA = new Date(a.rawDateTime);
          const dateB = new Date(b.rawDateTime);
          if ((a.status === "pending" || a.status === "confirmed") && 
              (b.status === "pending" || b.status === "confirmed")) {
            return dateA - dateB; // Gần nhất lên đầu
          }
          return dateB - dateA; // Mới nhất lên đầu cho cancelled
        });

        setAppointments(sorted);
      } catch (err) {
        setError("Không thể tải lịch hẹn. Vui lòng thử lại sau.");
        console.error("Error loading appointments:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [filterByPatientId, filters]);

  return { appointments, isLoading, error };
};