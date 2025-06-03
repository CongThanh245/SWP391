import React from "react";
import { User, Clock, Calendar, Phone, Edit, Trash2, CheckCircle, Eye, RefreshCw } from "lucide-react";
import styles from "./AppointmentList.module.css";

const AppointmentList = ({ appointments, activeTab }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming':
        return <Clock size={16} className={styles.statusIcon} />;
      case 'completed':
        return <CheckCircle size={16} className={styles.statusIcon} />;
      case 'cancelled':
        return <Trash2 size={16} className={styles.statusIcon} />;
      default:
        return <Clock size={16} className={styles.statusIcon} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Sắp tới';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Sắp tới';
    }
  };

  if (appointments.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <Calendar size={48} />
        </div>
        <h3>Không có lịch hẹn nào</h3>
        <p>Chưa có lịch hẹn {getStatusText(activeTab).toLowerCase()} nào</p>
      </div>
    );
  }

  return (
    <div className={styles.appointmentList}>
      <div className={styles.tableHeader}>
        <div className={styles.headerCell}>ID - Họ tên</div>
        <div className={styles.headerCell}>Số điện thoại</div>
        <div className={styles.headerCell}>Thời gian</div>
        <div className={styles.headerCell}>Trạng thái</div>
        <div className={styles.headerCell}>Actions</div>
      </div>
      
      {appointments.map((appointment) => (
        <div key={appointment.id} className={`${styles.appointmentRow} ${styles[appointment.status]}`}>
          <div className={styles.patientInfo}>
            <div className={styles.avatar}>
              <User size={20} />
            </div>
            <div className={styles.patientDetails}>
              <span className={styles.patientId}>{appointment.id}</span>
              <span className={styles.patientName}>{appointment.patientName}</span>
            </div>
          </div>
          
          <div className={styles.phoneInfo}>
            <Phone size={16} />
            <span>{appointment.phone}</span>
          </div>
          
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
          
          <div className={`${styles.statusBadge} ${styles[appointment.status]}`}>
            {getStatusIcon(appointment.status)}
            <span>{getStatusText(appointment.status)}</span>
          </div>
          
          <div className={styles.actions}>
            {appointment.status === 'upcoming' && (
              <>
                <button className={`${styles.actionBtn} ${styles.edit}`} title="Chỉnh sửa">
                  <Edit size={16} />
                </button>
                <button className={`${styles.actionBtn} ${styles.complete}`} title="Hoàn thành">
                  <CheckCircle size={16} />
                </button>
                <button className={`${styles.actionBtn} ${styles.cancel}`} title="Hủy">
                  <Trash2 size={16} />
                </button>
              </>
            )}
            {appointment.status === 'completed' && (
              <button className={`${styles.actionBtn} ${styles.view}`} title="Xem chi tiết">
                <Eye size={16} />
              </button>
            )}
            {appointment.status === 'cancelled' && (
              <button className={`${styles.actionBtn} ${styles.restore}`} title="Khôi phục">
                <RefreshCw size={16} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;