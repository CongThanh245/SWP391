// features/appointment/components/AppointmentListReceptionist/AppointmentListReceptionist.jsx
import React from "react";
import { Clock, Calendar, Eye, Trash2, CheckCircle } from "lucide-react";
import styles from "./AppointmentListReceptionist.module.css";
import { updateAppointmentStatus } from "@api/appointmentApi";

// Cấu hình trạng thái
const statusConfig = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
};

const AppointmentListReceptionist = ({
  appointments = [],
  isLoading = false,
  activeTab = "all",
}) => {
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      window.location.reload(); // Có thể thay bằng callback sau
    } catch (error) {
      alert("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
    }
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
          {`Chưa có lịch hẹn ${statusConfig[activeTab] || "chờ xác nhận"
            .toLowerCase()} nào`}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.appointmentList}>
      <div className={styles.tableHeader}>
        <div className={styles.headerCell}>Thời gian</div>
        <div className={styles.headerCell}>Bác sĩ</div>
        <div className={styles.headerCell}>Bệnh nhân</div>
        <div className={styles.headerCell}>Trạng thái</div>
        <div className={styles.headerCell}>Hành động</div>
      </div>
      {filteredAppointments.map((appointment) => (
        <div
          key={appointment.id}
          className={`${styles.appointmentRow} ${styles[appointment.status]}`}
        >
          <div className={styles.timeInfo}>
            <div className={styles.date}>
              <Calendar size={16} />
              <span>{appointment.date}</span>
            </div>
            <div className={styles.time}>
              <Clock size={16} />
              <span>{appointment.time}</span>
            </div>
          </div>
          <div className={styles.doctorInfo}>
            <span>{appointment.doctorName}</span>
          </div>
          <div className={styles.patientInfo}>
            <span>{appointment.patientName}</span>
          </div>
          <div className={`${styles.statusBadge} ${styles[appointment.status]}`}>
            <span>{statusConfig[appointment.status] || "Chờ xác nhận"}</span>
          </div>
          <div className={styles.actions}>
            {appointment.status === "pending" && (
              <>
                <button
                  className={`${styles.actionBtn} ${styles.complete}`}
                  title="Xác nhận"
                  onClick={() => handleStatusUpdate(appointment.id, "confirmed")}
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.cancel}`}
                  title="Hủy"
                  onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            {appointment.status === "confirmed" && (
              <>
                <button
                  className={`${styles.actionBtn} ${styles.complete}`}
                  title="Hoàn thành"
                  onClick={() => handleStatusUpdate(appointment.id, "completed")}
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.cancel}`}
                  title="Hủy"
                  onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            {appointment.status === "completed" && (
              <button
                className={`${styles.actionBtn} ${styles.view}`}
                title="Xem chi tiết"
                onClick={() =>
                  alert(
                    `Chi tiết: Bác sĩ: ${appointment.doctorName}, Bệnh nhân: ${appointment.patientName}, Ghi chú: ${appointment.notes}`
                  )
                }
              >
                <Eye size={16} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentListReceptionist;