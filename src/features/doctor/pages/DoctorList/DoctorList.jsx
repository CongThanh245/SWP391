// src/features/doctor/components/DoctorList/DoctorList.jsx
import React from 'react';
import { User, Phone } from 'lucide-react';
import { useAdminDoctors } from '@hooks/useDoctors';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './DoctorList.module.css';
import DoctorDetails from '@features/doctor/components/DoctorDetails/DoctorDetails';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.modalCloseButton} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const DoctorList = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const { doctors, loading, error } = useAdminDoctors(); // Sử dụng hook

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  if (error) {
    return <div className={styles.error}>Lỗi: {error}</div>;
  }

  const handleCloseModal = () => {
    navigate('/receptionist-dashboard/doctors'); // Quay lại danh sách
  };

  return (
    <div className={styles.doctorListPage}>
      <div className={styles.pageHeader}>
        <h2>Danh sách Bác sĩ</h2>
        <p>Thông tin các bác sĩ trong phòng khám</p>
      </div>

      <div className={styles.doctorGrid}>
        {doctors.map((doctor) => (
          <div key={doctor.id} className={styles.doctorCard}>
            <div className={styles.doctorAvatar}>
              <User size={32} />
            </div>
            <div className={styles.doctorInfo}>
              <h4>{doctor.id}</h4>
              <h3>{doctor.name}</h3>
              <p>{doctor.specialization}</p>
              <div className={styles.doctorDetails}>
                <div className={styles.detail}>
                  <Phone size={16} />
                  <span>{doctor.phone}</span>
                </div>
              </div>
              <Link
                to={`/receptionist-dashboard/doctors/${doctor.id}`}
                className={styles.viewDetailsButton}
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal hiển thị DoctorDetails nếu có id */}
      {id && (
        <Modal isOpen={!!id} onClose={handleCloseModal}>
          <DoctorDetails onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default DoctorList;