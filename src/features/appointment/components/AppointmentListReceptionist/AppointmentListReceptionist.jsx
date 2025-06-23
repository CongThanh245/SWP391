import React, { useState } from 'react';
import { Clock, Calendar, Eye, Trash2, CheckCircle, X } from 'lucide-react';
import ConfirmationDialog from '@components/common/ConfirmationDialog/ConfirmationDialog';
import styles from './AppointmentListReceptionist.module.css';
import { confirmAppointment, completeAppointment, cancelAppointment } from '@api/appointmentApi';

const statusConfig = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  completed: 'Đã hoàn thành',
  cancelled: 'Đã hủy',
};

const AppointmentListReceptionist = ({
  appointments = [],
  isLoading = false,
  activeTab = 'all',
  refetchAppointments,
  toast, // Add toast prop
}) => {
  const [showNoteModal, setShowNoteModal] = useState({
    open: false,
    content: '',
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    appointmentId: null,
    action: null,
    title: '',
    content: '',
    confirmText: '',
  });
  const [detailsModal, setDetailsModal] = useState({
    open: false,
    appointment: null,
  });

  const handleActionClick = (id, action, appointment = null) => {
    if (action === 'confirm') {
      setDetailsModal({ open: true, appointment });
      return;
    }

    let dialogConfig = { open: true, appointmentId: id, action };

    switch (action) {
      case 'complete':
        dialogConfig = {
          ...dialogConfig,
          title: 'Hoàn thành lịch hẹn',
          content: 'Bạn có chắc chắn muốn đánh dấu lịch hẹn này là đã hoàn thành?',
          confirmText: 'Hoàn thành',
        };
        break;
      case 'cancel':
        dialogConfig = {
          ...dialogConfig,
          title: 'Hủy lịch hẹn',
          content: 'Bạn có chắc chắn muốn hủy lịch hẹn này? Hành động này không thể hoàn tác.',
          confirmText: 'Hủy',
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
      action: 'confirm',
      title: 'Xác nhận liên hệ',
      content: 'Trước khi xác nhận lịch hẹn, hãy đảm bảo đã liên hệ với bệnh nhân.',
      confirmText: 'Xác nhận',
    });
  };

  const handleConfirmAction = async () => {
    const { appointmentId, action } = confirmDialog;
    try {
      console.log(toast)
      if (action === 'confirm') {
        await confirmAppointment(appointmentId);
        toast({
          title: 'Thành công',
          description: 'Xác nhận lịch hẹn thành công!',
          variant: 'default',
        });
        console.log(toast);
      } else if (action === 'complete') {
        await completeAppointment(appointmentId);
        toast({
          title: 'Thành công',
          description: 'Lịch hẹn đã được đánh dấu là hoàn thành!',
          variant: 'default',
        });
      } else if (action === 'cancel') {
        await cancelAppointment(appointmentId);
        toast({
          title: 'Thành công',
          description: 'Hủy lịch hẹn thành công!',
          variant: 'default',
        });
      }
      refetchAppointments();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: `Cập nhật trạng thái thất bại: ${error.message || 'Vui lòng thử lại.'}`,
        variant: 'destructive',
      });
      console.error('Error updating appointment:', error);
    } finally {
      setConfirmDialog({
        open: false,
        appointmentId: null,
        action: null,
        title: '',
        content: '',
        confirmText: '',
      });
      setDetailsModal({ open: false, appointment: null });
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialog({
      open: false,
      appointmentId: null,
      action: null,
      title: '',
      content: '',
      confirmText: '',
    });
  };

  const handleDetailsClose = () => {
    setDetailsModal({ open: false, appointment: null });
  };

  const filteredAppointments =
    activeTab === 'all'
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
        <p>{`Chưa có lịch hẹn ${statusConfig[activeTab] || 'chờ xác nhận'}`}</p>
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
            <span>{statusConfig[appointment.status] || 'Chờ xác nhận'}</span>
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
            {appointment.status === 'pending' && (
              <>
                <button
                  className={`${styles.actionBtn} ${styles.complete}`}
                  title='Xác nhận'
                  onClick={() =>
                    handleActionClick(appointment.id, 'confirm', appointment)
                  }
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.cancel}`}
                  title='Hủy'
                  onClick={() => handleActionClick(appointment.id, 'cancel')}
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            {appointment.status === 'confirmed' && (
              <>
                <button
                  className={`${styles.actionBtn} ${styles.complete}`}
                  title='Hoàn thành'
                  onClick={() => handleActionClick(appointment.id, 'complete')}
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.cancel}`}
                  title='Hủy'
                  onClick={() => handleActionClick(appointment.id, 'cancel')}
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            {appointment.status === 'completed' && (
              <button
                className={`${styles.actionBtn} ${styles.view}`}
                title='Xem chi tiết'
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
              onClick={() => setShowNoteModal({ open: false, content: '' })}
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
                onClick={() =>
                  setDetailsModal({ open: false, appointment: null })
                }
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
                  <strong>Bệnh nhân:</strong>{' '}
                  {detailsModal.appointment.patientName}
                </p>
                <p>
                  <strong>Số điện thoại:</strong>{' '}
                  {detailsModal.appointment.patientPhone || 'Không có'}
                </p>
                <p>
                  <strong>Ngày giờ:</strong> {detailsModal.appointment.date}{' '}
                  {detailsModal.appointment.time}
                </p>
                <p>
                  <strong>Ghi chú:</strong>{' '}
                  {detailsModal.appointment.notes || 'Không có'}
                </p>
              </div>
            </div>

            <div className={styles.detailsModalActions}>
              <button
                className={styles.detailsCancelButton}
                onClick={() =>
                  setDetailsModal({ open: false, appointment: null })
                }
              >
                Hủy
              </button>
              {detailsModal.appointment.status === 'pending' && (
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
        cancelText='Hủy bỏ'
        zIndex={1100} // đảm bảo nằm trên modal chi tiết
      />
    </div>
  );
};

export default AppointmentListReceptionist;