import React, { useEffect, useState } from "react";
import { Clock, Calendar, Eye, Trash2, CheckCircle, X } from "lucide-react";
import ConfirmationDialog from "@components/common/ConfirmationDialog/ConfirmationDialog";
import styles from "./AppointmentListReceptionist.module.css";
import {
  confirmAppointment,
  completeAppointment,
  cancelAppointment,
} from "@api/appointmentApi";
import { useToast } from "@hooks/use-toast";
import { getAppointmentFiles } from "@api/fileApi";

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
  const { toasts, toast } = useToast();
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
  const [detailsModal, setDetailsModal] = useState({
    open: false,
    appointment: null,
  });
  const [attachments, setAttachments] = useState([]);
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(false);
  const [attachmentError, setAttachmentError] = useState(null);

  // Fetch attachments when details modal is opened
  useEffect(() => {
    if (detailsModal.open && detailsModal.appointment?.id) {
      const fetchAttachments = async () => {
        setIsLoadingAttachments(true);
        setAttachmentError(null);
        try {
          const data = await getAppointmentFiles(detailsModal.appointment.id);
          setAttachments(data || []);
        } catch (error) {
          setAttachmentError("Không thể tải file đính kèm. Vui lòng thử lại.");
          console.error("Error fetching attachments:", error);
        } finally {
          setIsLoadingAttachments(false);
        }
      };
      fetchAttachments();
    } else {
      // Reset attachments when modal is closed
      setAttachments([]);
      setAttachmentError(null);
    }
  }, [detailsModal.open, detailsModal.appointment?.id]);

  const handleActionClick = (id, action, appointment = null) => {
    if (action === "confirm") {
      setDetailsModal({ open: true, appointment });
      return;
    }

    let dialogConfig = { open: true, appointmentId: id, action };

    switch (action) {
      case "complete":
        dialogConfig = {
          ...dialogConfig,
          title: "Hoàn thành lịch hẹn",
          content:
            "Bạn có chắc chắn muốn đánh dấu lịch hẹn này là đã hoàn thành?",
          confirmText: "Hoàn thành",
        };
        break;
      case "cancel":
        dialogConfig = {
          ...dialogConfig,
          title: "Hủy lịch hẹn",
          content:
            "Bạn có chắc chắn muốn hủy lịch hẹn này? Hành động này không thể hoàn tác.",
          confirmText: "Hủy",
        };
        break;
      default:
        return;
    }

    setConfirmDialog(dialogConfig);
  };

  const handleDetailsConfirm = () => {
    if (!detailsModal.appointment) return;
    setConfirmDialog({
      open: true,
      appointmentId: detailsModal.appointment.id,
      action: "confirm",
      title: "Xác nhận liên hệ",
      content:
        "Trước khi xác nhận lịch hẹn, hãy đảm bảo đã liên hệ với bệnh nhân.",
      confirmText: "Xác nhận",
    });
  };

  const handleConfirmAction = async () => {
    const { appointmentId, action } = confirmDialog;
    try {
      if (action === "confirm") {
        await confirmAppointment(appointmentId);
        toast({
          title: "Thành công",
          description: "Xác nhận lịch hẹn thành công!",
        });
      } else if (action === "complete") {
        await completeAppointment(appointmentId);
        toast({
          title: "Thành công",
          description: "Lịch hẹn đã được đánh dấu là hoàn thành!",
        });
      } else if (action === "cancel") {
        await cancelAppointment(appointmentId);
        toast({
          title: "Thành công",
          description: "Hủy lịch hẹn thành công!",
          variant: "default",
        });
      }
      refetchAppointments();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: `Cập nhật trạng thái thất bại: ${
          error.message || "Vui lòng thử lại."
        }`,
        variant: "destructive",
      });
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
      setDetailsModal({ open: false, appointment: null });
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

  const handleDetailsClose = () => {
    setDetailsModal({ open: false, appointment: null });
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
        <p>{`Chưa có lịch hẹn ${statusConfig[activeTab] || "chờ xác nhận"}`}</p>
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
              <Calendar size={16} /> <span>{appointment.date}</span>
            </div>
            <div className={styles.time}>
              <Clock size={16} /> <span>{appointment.time}</span>
            </div>
          </div>
          <div className={styles.doctorInfo}>
            <span>{appointment.doctorName}</span>
          </div>
          <div className={styles.patientInfo}>
            <span>{appointment.patientName}</span>
          </div>
          <div
            className={`${styles.statusBadge} ${styles[appointment.status]}`}
          >
            <span>{statusConfig[appointment.status] || "Chờ xác nhận"}</span>
          </div>
          <div className={styles.notesInfo}>
            {appointment.notes ? (
              <>
                <span className={styles.notes} title={appointment.notes}>
                  {appointment.notes.length > 20
                    ? `${appointment.notes.substring(0, 20)}...`
                    : appointment.notes}
                </span>
                {appointment.notes.length > 20 && (
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
                  onClick={() =>
                    handleActionClick(appointment.id, "confirm", appointment)
                  }
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
                onClick={() => setDetailsModal({ open: true, appointment })}
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

      {detailsModal.open && detailsModal.appointment && (
        <div className={styles.detailsModal}>
          <div className={styles.detailsModalContent}>
            <div className={styles.detailsModalHeader}>
              <h3 className={styles.detailsModalTitle}>Chi tiết lịch hẹn</h3>
              <button
                className={styles.detailsCloseButton}
                onClick={() => setDetailsModal({ open: false, appointment: null })}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.detailsModalBody}>
              <div className={styles.detailsInfo}>
                <p>
                  <strong>Bác sĩ:</strong> {detailsModal.appointment.doctorName}
                </p>
                <p>
                  <strong>Bệnh nhân:</strong>{" "}
                  {detailsModal.appointment.patientName}
                </p>
                <p>
                  <strong>Số điện thoại:</strong>{" "}
                  {detailsModal.appointment.patientPhone || "Không có"}
                </p>
                <p>
                  <strong>Ngày giờ:</strong> {detailsModal.appointment.date}{" "}
                  {detailsModal.appointment.time}
                </p>
                <p>
                  <strong>Ghi chú:</strong>{" "}
                  {detailsModal.appointment.notes || "Không có"}
                </p>
              </div>

              {/* Attachments Section with Scroll */}
              <div className={styles.attachmentsSection}>
                <h4 className={styles.attachmentsTitle}>File đính kèm</h4>
                {isLoadingAttachments ? (
                  <p className={styles.loadingText}>Đang tải file đính kèm...</p>
                ) : attachmentError ? (
                  <p className={styles.errorText}>{attachmentError}</p>
                ) : attachments.length > 0 ? (
                  <div className={styles.attachmentsList}>
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.attachmentId}
                        className={styles.attachmentItem}
                      >
                        <div className={styles.attachmentInfo}>
                          <span className={styles.attachmentIcon}>
                            {attachment.fileType === "PDF" ? (
                              <svg
                                className={styles.fileIcon}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                            ) : (
                              <svg
                                className={styles.fileIcon}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            )}
                          </span>
                          <div>
                            <p className={styles.attachmentName}>
                              {attachment.fileName}
                            </p>
                            <p className={styles.attachmentDetails}>
                              {attachment.attachmentType} •{" "}
                              {attachment.fileSize === 0
                                ? "N/A"
                                : `${attachment.fileSize} KB`}
                            </p>
                          </div>
                        </div>
                        <a
                          href={attachment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.attachmentLink}
                        >
                          Tải xuống
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noAttachments}>Không có file đính kèm</p>
                )}
              </div>
            </div>

            <div className={styles.detailsModalActions}>
              {detailsModal.appointment.status === "pending" && (
                <button
                  className={styles.detailsConfirmButton}
                  onClick={() => handleDetailsConfirm()}
                >
                  Xác nhận lịch hẹn
                </button>
              )}
            </div>
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
        zIndex={1100}
      />
    </div>
  );
};

export default AppointmentListReceptionist;