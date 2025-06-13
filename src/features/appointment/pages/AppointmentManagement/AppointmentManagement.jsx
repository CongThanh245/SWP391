// AppointmentManagement.jsx Trang này cho Receptionist duyệt các lịch hẹn
import React, { useState, useEffect, useMemo } from "react";
import styles from "./AppointmentManagement.module.css";
import AppointmentFilterTabs from "@features/appointment/components/AppointmentFilterTabs/AppointmentFilterTabs";
import AppointmentListReceptionist from "@features/appointment/components/AppointmentListReceptionist/AppointmentListReceptionist";
import { fetchAppointments } from "@api/appointmentApi";

const AppointmentManagement = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validStatuses = ["pending", "confirmed", "completed", "cancelled"];

  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAppointments();
        const mappedAppointments = data
          .filter((appt) => validStatuses.includes(appt.appointment_status))
          .map((appt) => {
            let date, time;
            const timestamp = parseInt(appt.appointment_date_time);
            if (!isNaN(timestamp)) {
              date = new Date(timestamp * 1000).toISOString().split("T")[0];
              time = new Date(timestamp * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
            } else {
              date = "N/A";
              time = "N/A";
            }

            return {
              id: appt.id,
              appointmentId: appt.appointment_id,
              patientName: appt.patient_name,
              phone: "N/A",
              date,
              time,
              status: appt.appointment_status,
              doctorName: appt.doctor_name,
              notes: appt.notes,
            };
          });
        setAppointments(mappedAppointments);
      } catch (err) {
        console.error("Error loading appointments:", err);
        setError("Không thể tải lịch hẹn. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };
    loadAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => appointment.status === activeTab);
  }, [activeTab, appointments]);

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

      <AppointmentListReceptionist
        appointments={filteredAppointments}
        isLoading={isLoading}
        activeTab={activeTab}
      />
    </div>
  );
};

export default AppointmentManagement;