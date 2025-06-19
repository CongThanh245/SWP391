import React from "react";
import { Calendar, Clock, User, FileText, X, AlertCircle } from "lucide-react";
import styles from "./AppointmentTable.module.css";

const AppointmentTable = ({
  appointments = [],
  isLoading = false,
  onCancelAppointment,
  setShowNoteModal,
}) => {
  const [cancellingId, setCancellingId] = React.useState(null);

  const statusConfig = {
    pending: { label: "Chờ xác nhận", color: "#f59e0b", bgColor: "#fef3c7" },
    confirmed: { label: "Đã xác nhận", color: "#10b981", bgColor: "#d1fae5" },
    cancelled: { label: "Đã hủy", color: "#ef4444", bgColor: "#fee2e2" },
  };

  const handleCancelClick = async (appointmentId) => {
    console.log("Hủy lịch hẹn với ID:", appointmentId);
    if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) {
      setCancellingId(appointmentId);
      try {
        // Call the passed onCancelAppointment function
        await onCancelAppointment(appointmentId);
      } catch (error) {
        console.error("Error cancelling appointment:", error);
        alert("Không thể hủy lịch hẹn. Vui lòng thử lại sau.");
      } finally {
        setCancellingId(null);
      }
    }
  };

  const formatDateTime = (date, time) => {
    if (!date || date === "N/A") return "Chưa xác định";

    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return `${formattedDate} ${time !== "N/A" ? time : ""}`.trim();
  };

  const canCancel = (appointment) => {
    return (
      appointment.status === "pending" || appointment.status === "confirmed"
    );
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Đang tải lịch hẹn...</p>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <Calendar size={48} />
        </div>
        <h3>Không có lịch hẹn nào</h3>
        <p>Bạn chưa có lịch hẹn nào được đăng ký</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.headerCell}>
                <div className={styles.headerContent}>
                  <Clock size={16} />
                  <span>Thời gian</span>
                </div>
              </th>
              <th className={styles.headerCell}>
                <div className={styles.headerContent}>
                  <User size={16} />
                  <span>Bác sĩ</span>
                </div>
              </th>
              <th className={styles.headerCell}>
                <div className={styles.headerContent}>
                  <AlertCircle size={16} />
                  <span>Trạng thái</span>
                </div>
              </th>
              <th className={styles.headerCell}>
                <div className={styles.headerContent}>
                  <FileText size={16} />
                  <span>Ghi chú</span>
                </div>
              </th>
              <th className={styles.headerCell}>
                <span>Hành động</span>
              </th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {appointments.map((appointment) => {
              const statusInfo =
                statusConfig[appointment.status] || statusConfig.pending;

              return (
                <tr key={appointment.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.dateTimeCell}>
                      <div className={styles.dateTime}>
                        {formatDateTime(appointment.date, appointment.time)}
                      </div>
                    </div>
                  </td>

                  <td className={styles.tableCell}>
                    <div className={styles.doctorCell}>
                      <div className={styles.doctorName}>
                        {appointment.doctorName || "Chưa phân công"}
                      </div>
                    </div>
                  </td>

                  <td className={styles.tableCell}>
                    <div className={styles.statusCell}>
                      <span
                        className={styles.statusBadge}
                        style={{
                          color: statusInfo.color,
                          backgroundColor: statusInfo.bgColor,
                        }}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </td>

                  <td className={styles.tableCell}>
                    <div className={styles.notesCell}>
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
                  </td>

                  <td className={styles.tableCell}>
                    <div className={styles.actionCell}>
                      {canCancel(appointment) ? (
                        <button
                          className={`${styles.actionButton} ${styles.cancelButton}`}
                          onClick={() => handleCancelClick(appointment.id)}
                          disabled={cancellingId === appointment.id}
                          title="Hủy lịch hẹn"
                        >
                          {cancellingId === appointment.id ? (
                            <div className={styles.buttonSpinner}></div>
                          ) : (
                            <>
                              <X size={14} />
                              <span>Hủy</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className={styles.noAction}>-</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;