// features/appointment/components/AppointmentCard/AppointmentCard.jsx
import React from "react";
import { Clock, Calendar } from "lucide-react"; // Giữ icon cần thiết
import styles from "./AppointmentCard.module.css";

// Định nghĩa trạng thái bằng object
const statusConfig = {
  pending: { text: "Chờ xác nhận", class: "statusPending" },
  confirmed: { text: "Đã xác nhận", class: "statusConfirmed" },
  completed: { text: "Đã hoàn thành", class: "statusCompleted" },
  cancelled: { text: "Đã hủy", class: "statusCancelled" },
};

const AppointmentCard = ({
  appointment,
  isPatientView,
  allowActions,
  onStatusUpdate,
}) => {
  const { status } = appointment;
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <article className={styles.card}>
      {isPatientView ? (
        // Giao diện cho Patient: hiển thị bác sĩ, ngày, giờ, ghi chú, và trạng thái
        <>
          <header className={styles.cardHeader}>
            <div className={styles.patientInfo}>
              <span className={styles.doctorName}>{appointment.doctorName}</span>
            </div>
          </header>
          <section className={styles.appointmentInfo}>
            <div className={styles.infoRow}>
              <Calendar size={16} className={styles.infoIcon} />
              <span>{appointment.date}</span>
            </div>
            <div className={styles.infoRow}>
              <Clock size={16} className={styles.infoIcon} />
              <span>{appointment.time}</span>
            </div>
            {appointment.notes && (
              <div className={styles.infoRow}>
                <span className={styles.notesText}>{appointment.notes}</span>
              </div>
            )}
            <div className={styles.infoRow}>
              <span className={`${styles.statusText} ${styles[config.class]}`}>
                {config.text}
              </span>
            </div>
          </section>
        </>
      ) : (
        // Giao diện cho Receptionist: giữ nguyên với đầy đủ thông tin và hành động
        <>
          <header className={styles.cardHeader}>
            <div className={styles.patientInfo}>
              Bệnh nhân: {appointment.patientName}
            </div>
            <span className={`${styles.statusBadge} ${styles[config.class]}`}>
              {config.text}
            </span>
          </header>
          <section className={styles.appointmentInfo}>
            <div className={styles.infoRow}>
              <Calendar size={16} className={styles.infoIcon} />
              <span>{appointment.date}</span>
            </div>
            <div className={styles.infoRow}>
              <Clock size={16} className={styles.infoIcon} />
              <span>{appointment.time}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.doctorName}>{appointment.doctorName}</span>
            </div>
            {appointment.phone !== "N/A" && (
              <div className={styles.infoRow}>
                <span>SĐT: {appointment.phone}</span>
              </div>
            )}
            {appointment.notes && (
              <div className={styles.infoRow}>
                <span className={styles.notesText}>{appointment.notes}</span>
              </div>
            )}
          </section>
          <footer className={styles.cardActions}>
            {allowActions ? (
              <AppointmentActions
                status={status}
                onStatusUpdate={onStatusUpdate}
                appointmentId={appointment.id}
              />
            ) : null}
          </footer>
        </>
      )}
    </article>
  );
};

// Component riêng cho các nút hành động
const AppointmentActions = ({ status, onStatusUpdate, appointmentId }) => {
  switch (status) {
    case "pending":
      return (
        <>
          <button
            className={styles.confirmBtn}
            onClick={() => onStatusUpdate(appointmentId, "confirmed")}
          >
            <CheckCircle size={16} /> Xác nhận
          </button>
          <button
            className={styles.cancelBtn}
            onClick={() => onStatusUpdate(appointmentId, "cancelled")}
          >
            <Trash2 size={16} /> Hủy
          </button>
        </>
      );
    case "confirmed":
      return (
        <>
          <button
            className={styles.completeBtn}
            onClick={() => onStatusUpdate(appointmentId, "completed")}
          >
            <CheckCircle size={16} /> Hoàn thành
          </button>
          <button
            className={styles.cancelBtn}
            onClick={() => onStatusUpdate(appointmentId, "cancelled")}
          >
            <Trash2 size={16} /> Hủy
          </button>
        </>
      );
    case "completed":
      return null;
    case "cancelled":
      return (
        <button
          className={styles.restoreBtn}
          onClick={() => onStatusUpdate(appointmentId, "pending")}
        >
          <RefreshCw size={16} /> Khôi phục
        </button>
      );
    default:
      return null;
  }
};

export default AppointmentCard;