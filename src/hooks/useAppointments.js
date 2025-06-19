import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchAppointments, fetchAppointmentPatient, searchAppointments } from "@api/appointmentApi";

const DEFAULT_FILTERS = { dateFilter: "all", fromDate: "", toDate: "" };

export const useAppointments = ({ filterByPatientId, filters = DEFAULT_FILTERS, role = "receptionist" } = {}) => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Memoize filters
  const normalizedFilters = useMemo(() => ({
    dateFilter: filters.dateFilter || "all",
    fromDate: filters.fromDate || "",
    toDate: filters.toDate || "",
  }), [filters]);

  // Hàm lấy lịch hẹn, dùng useCallback để tránh tạo mới
  const loadAppointments = useCallback(async () => {  
    setIsLoading(true);
    try {
      let data;
      if (role === "patient") {
        console.log('Gọi API /my_appointments cho bệnh nhân');
        data = await fetchAppointmentPatient();
      } else if (normalizedFilters.dateFilter !== "all") {
        console.log('Gọi API /appointments/search với bộ lọc ngày:', normalizedFilters);
        const searchParams = {};
        if (normalizedFilters.dateFilter === "custom" && normalizedFilters.fromDate && normalizedFilters.toDate) {
          searchParams.date = `${normalizedFilters.fromDate},${normalizedFilters.toDate}`;
        } else {
          const today = new Date().toISOString().split("T")[0];
          searchParams.date = today;
        }
        data = await searchAppointments(searchParams);
      } else {
        console.log('Gọi API /receptionists/appointments cho lễ tân', { filterByPatientId });
        data = await fetchAppointments(filterByPatientId);
      }

      // Ensure data is an array
      const appointmentData = Array.isArray(data) ? data : data ? [data] : [];

      const mapped = appointmentData.map((appt) => {
        const appointmentDate = new Date(appt.appointmentDateTime);
        const date = appointmentDate.toISOString().split("T")[0];
        const time = appointmentDate.toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit" 
        });
        const status = (appt.appointmentStatus || "").toLowerCase();
        return {
          id: appt.appointmentId,
          appointmentId: appt.appointmentId,
          patientName: appt.patientName,
          doctorName: appt.doctorName,
          status,
          date,
          time,
          notes: appt.notes || "",
          rawDateTime: appt.appointmentDateTime,
          receptionistId: appt.receptionistId,
          receptionistName: appt.receptionistName,
        };
      });

      const sorted = mapped.sort((a, b) => {
        const dateA = new Date(a.rawDateTime);
        const dateB = new Date(b.rawDateTime);
        if ((a.status === "pending" || a.status === "confirmed") && 
            (b.status === "pending" || b.status === "confirmed")) {
          return dateA - dateB;
        }
        return dateB - dateA;
      });

      setAppointments(sorted);
    } catch (err) {
      setError("Không thể tải lịch hẹn. Vui lòng thử lại sau.");
      console.error("Error loading appointments:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
    } finally {
      setIsLoading(false);
    }
  }, [filterByPatientId, normalizedFilters, role]);

  useEffect(() => {
    console.log('useEffect chạy với:', { filterByPatientId, normalizedFilters, role });
    loadAppointments();
  }, [loadAppointments]);

  // Hàm làm mới dữ liệu
  const refetchAppointments = useCallback(() => {
    console.log('Làm mới lịch hẹn');
    loadAppointments();
  }, [loadAppointments]);

  return { appointments, isLoading, error, refetchAppointments };
};