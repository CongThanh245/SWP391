// src/features/doctor/components/DoctorDetails/DoctorDetails.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAdminDoctors } from '@hooks/useDoctors';
import Card from '@components/common/Card/Card';
import styles from './DoctorDetails.module.css';

const DoctorDetails = ({ onClose }) => {
  const { id } = useParams();
  const { doctors, loading, error } = useAdminDoctors();

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  if (error) {
    return <div className={styles.error}>Lỗi: {error}</div>;
  }

  const doctor = doctors.find((doc) => doc.id === id);

  if (!doctor) {
    return <div className={styles.error}>Không tìm thấy bác sĩ</div>;
  }

  const leftContent = (
    <div className={styles.doctorStats}>
      <div className={styles.experience}>
        <strong>{doctor.yearOfExperience}</strong> {/* Sửa từ yearsOfExperience */}
        <span>Năm kinh nghiệm</span>
      </div>
    </div>
  );

  const rightContent = (
    <div className={styles.doctorInfo}>
      <h3 className={styles.doctorName}>{doctor.name}</h3>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>ID:</span>
          <span className={styles.infoValue}>{doctor.id}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Chuyên môn:</span>
          <span className={styles.infoValue}>{doctor.specialization}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Số điện thoại:</span>
          <span className={styles.infoValue}>{doctor.phone}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Bằng cấp:</span>
          <span className={styles.infoValue}>{doctor.degree}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Số giấy phép:</span>
          <span className={styles.infoValue}>{doctor.licenseNumber}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Giới tính:</span>
          <span className={styles.infoValue}>{doctor.gender}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Địa chỉ:</span>
          <span className={styles.infoValue}>{doctor.address}</span>
        </div>
      </div>
      {doctor.about && (
        <div className={styles.aboutSection}>
          <h4 className={styles.aboutTitle}>Giới thiệu:</h4>
          <p className={styles.aboutText}>{doctor.about}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className={`${styles.doctorDetailsPage} ${onClose ? styles.modalVersion : ''}`}>
      <div className={styles.pageHeader}>
        <h2>Thông tin bác sĩ</h2>
        <p>Chi tiết thông tin bác sĩ</p>
      </div>
      <Card
        avatar={doctor.image ? { src: doctor.image, alt: doctor.name } : null}
        avatarPlaceholder={doctor.name?.charAt(0)?.toUpperCase() || 'BS'}
        leftContent={leftContent}
        rightContent={rightContent}
        className={styles.doctorCard}
      />
    </div>
  );
};

export default DoctorDetails;