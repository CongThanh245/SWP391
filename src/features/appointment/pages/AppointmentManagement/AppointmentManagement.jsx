import React, { useState, useEffect, useMemo } from "react";
import styles from "./AppointmentManagement.module.css";
import AppointmentFilterTabs from "@features/appointment/components/AppointmentFilterTabs/AppointmentFilterTabs";
import AppointmentList from "@features/appointment/components/AppointmentList/AppointmentList";
import { fetchAppointments } from "@api/appointmentApi";

const AppointmentManagement = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Valid statuses
  const validStatuses = ["pending", "confirmed", "completed", "cancelled"];

  // Fetch appointments on mount
  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAppointments();
        // Map API data to UI format
        const mappedAppointments = data
          .filter((appt) => validStatuses.includes(appt.appointment_status)) // Only include valid statuses
          .map((appt) => {
            // Handle invalid appointment_date_time
            let date, time;
            const timestamp = parseInt(appt.appointment_date_time);
            if (!isNaN(timestamp)) {
              // Valid Unix timestamp
              date = new Date(timestamp * 1000).toISOString().split("T")[0];
              time = new Date(timestamp * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
            } else {
              // Fallback for invalid date (e.g., "appointment_date_time 1")
              date = "N/A";
              time = "N/A";
            }

            return {
              id: appt.id,
              appointmentId: appt.appointment_id,
              patientName: appt.patient_name,
              phone: "N/A", // Not in API, placeholder
              date,
              time,
              status: appt.appointment_status,
              doctorName: appt.doctor_name,
              notes: appt.notes,
            };
          });
        setAppointments(mappedAppointments);
      } catch (err) {
        console.error("Error loading appointments:", err); // Improved logging
        setError("Không thể tải lịch hẹn. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };
    loadAppointments();
  }, []);

  // Filtered appointments based on active tab
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => appointment.status === activeTab);
  }, [activeTab, appointments]);

  // Count appointments by status
  const appointmentCounts = useMemo(() => {
    return {
      pending: appointments.filter((app) => app.status === "pending").length,
      confirmed: appointments.filter((app) => app.status === "confirmed").length,
      completed: appointments.filter((app) => app.status === "completed").length,
      cancelled: appointments.filter((app) => app.status === "cancelled").length,
    };
  }, [appointments]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  return (
    <div className={styles.appointmentPage}>
      <div className={styles.pageHeader}>
        <h2>Quản lý bệnh nhân đặt lịch</h2>
        <p>Xem và quản lý tất cả lịch hẹn theo trạng thái</p>
      </div>

      {isLoading && <p>Đang tải...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <AppointmentFilterTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        appointmentCounts={appointmentCounts}
      />

      <AppointmentList appointments={filteredAppointments} activeTab={activeTab} />
    </div>
  );
};

export default AppointmentManagement;