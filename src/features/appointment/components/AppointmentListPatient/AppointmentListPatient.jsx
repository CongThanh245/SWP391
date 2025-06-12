// features/appointment/components/AppointmentListPatient/AppointmentListPatient.jsx
import React from "react";
import { Clock, Calendar, Eye } from "lucide-react";
import AppointmentCard from "../AppointmentCard/AppointmentCard";
import styles from "./AppointmentListPatient.module.css";
import { updateAppointmentStatus } from "@api/appointmentApi";

// Cấu hình trạng thái
const statusConfig = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
};

const AppointmentListPatient = ({
  appointments = [],
  isLoading = false,
  activeTab = "all",
}) => {
  // Hàm cập nhật trạng thái (dù Patient không dùng, giữ để tương thích với AppointmentCard)
  const handleStatusUpdate = async () => {
    // Không làm gì vì Patient không có quyền
  };

  const filteredAppointments =
    activeTab === "all"
      ? appointments
      : appointments.filter((appt) => appt.status === activeTab);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Đang tải lịch hẹn...</p>
      </div>
    );
  }

  if (filteredAppointments.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <Calendar size={48} />
        </div>
        <h3>Không có lịch hẹn nào</h3>
        <p>
          {`Bạn chưa có lịch hẹn ${statusConfig[activeTab] || "chờ xác nhận"
            .toLowerCase()} nào`}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      <div className={styles.appointmentGrid}>
        {filteredAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            isPatientView={true}
            allowActions={false}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default AppointmentListPatient;