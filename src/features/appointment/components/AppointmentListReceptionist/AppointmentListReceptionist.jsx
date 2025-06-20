import React, { useState } from "react";
import { Clock, Calendar, Eye, Trash2, CheckCircle } from "lucide-react";
import ConfirmationDialog from "@components/common/ConfirmationDialog/ConfirmationDialog"; // Adjust path as needed
import styles from "./AppointmentListReceptionist.module.css";
import { confirmAppointment, completeAppointment, cancelAppointment } from "@api/appointmentApi";

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
  refetchAppointments,
}) => {
  const [showNoteModal, setShowNoteModal] = useState({
    open: false,
    content: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    appointmentId: null,
    action: null,
    title: "",
    content: "",
    confirmText: "",
  });

  const handleActionClick = (id, action) => {
    let dialogConfig = {
      open: true,
      appointmentId: id,
      action,
    };

    switch (action) {
      case "confirm":
        dialogConfig = {
          ...dialogConfig,
          title: "Xác nhận lịch hẹn",
          content: "Bạn đã gọi điện xác nhận với bệnh nhân chưa?",
          confirmText: "Xác nhận",
        };
        break;
      case "complete":
        dialogConfig = {
          ...dialogConfig,
          title: "Hoàn thành lịch hẹn",
          content: "Bạn có chắc chắn muốn đánh dấu lịch hẹn này là đã hoàn thành?",
          confirmText: "Hoàn thành",
        };
        break;
      case "cancel":
        dialogConfig = {
          ...dialogConfig,
          title: "Hủy lịch hẹn",
          content: "Bạn có chắc chắn muốn hủy lịch hẹn này? Hành động này không thể hoàn tác.",
          confirmText: "Hủy",
        };
        break;
      default:
        return;
    }

    setConfirmDialog(dialogConfig);
  };

  const handleConfirmAction = async () => {
    const { appointmentId, action } = confirmDialog;
    try {
      if (action === "confirm") {
        await confirmAppointment(appointmentId);
      } else if (action === "complete") {
        await completeAppointment(appointmentId);
      } else if (action === "cancel") {
        await cancelAppointment(appointmentId);
      }
      refetchAppointments();
    } catch (error) {
      alert("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
      console.error("Error updating appointment:", error);
    } finally {
      setConfirmDialog({
        open: false,
        appointmentId: null,
        action: null,
        title: "",
        content: "",
        confirmText: "",
      });
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialog({
      open: false,
      appointmentId: null,
      action: null,
      title: "",
      content: "",
      confirmText: "",
    });
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
          {`Chưa có lịch hẹn ${statusConfig[activeTab] || "chờ xác nhận"}`}
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
        <div className={styles.headerCell}>Ghi chú</div>
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
          <div className={styles.notesInfo}>
            {appointment.notes ? (
              <>
                <span
                  className={styles.notes}
                  title={appointment.notes}
                >
                  {appointment.notes.length > 50
                    ? `${appointment.notes.substring(0, 50)}...`
                    : appointment.notes}
                </span>
                {appointment.notes.length > 50 && (
                  <button
                    className={styles.viewMoreButton}
                    onClick={() =>
                      setShowNoteModal({
                        open: true,
                        content: appointment.notes,
                      })
                    }
                  >
                    Xem thêm
                  </button>
                )}
              </>
            ) : (
              <span className={styles.noNotes}>Không có ghi chú</span>
            )}
          </div>
          <div className={styles.actions}>
            {appointment.status === "pending" && (
              <>
                <button
                  className={`${styles.actionBtn} ${styles.complete}`}
                  title="Xác nhận"
                  onClick={() => handleActionClick(appointment.id, "confirm")}
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.cancel}`}
                  title="Hủy"
                  onClick={() => handleActionClick(appointment.id, "cancel")}
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
                  onClick={() => handleActionClick(appointment.id, "complete")}
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.cancel}`}
                  title="Hủy"
                  onClick={() => handleActionClick(appointment.id, "cancel")}
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
      {showNoteModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Ghi chú đầy đủ</h3>
            <p className={styles.modalText}>{showNoteModal.content}</p>
            <button
              className={styles.modalCloseButton}
              onClick={() => setShowNoteModal({ open: false, content: "" })}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmAction}
        title={confirmDialog.title}
        content={confirmDialog.content}
        confirmText={confirmDialog.confirmText}
        cancelText="Hủy bỏ"
      />
    </div>
  );
};

export default AppointmentListReceptionist;