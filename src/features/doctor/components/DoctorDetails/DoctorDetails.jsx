import React from 'react';
import { useParams } from 'react-router-dom';
import { useDoctorDetails } from '@hooks/useDoctors';
import Card from '@components/common/Card/Card';
import styles from './DoctorDetails.module.css';

const DoctorDetails = ({ onClose }) => {
  const { id } = useParams();
  const { doctor, loading, error } = useDoctorDetails(id);

  // Lấy chữ cái đầu của từ cuối trong tên
  const getInitials = (name) => {
    if (!name) return 'N';
    const lastWord = name.split(' ').pop();
    return lastWord.charAt(0).toUpperCase();
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  if (error) {
    return <div className={styles.error}>Lỗi: {error}</div>;
  }

  if (!doctor) {
    return <div className={styles.error}>Không tìm thấy bác sĩ</div>;
  }

  const leftContent = (
    <div className={styles.doctorStats}>
      <div className={styles.experience}>
        <strong>{doctor.yearOfExperience}</strong>
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
        avatar={doctor.imageProfile && doctor.imageProfile !== '/assets/images/bacsi.png' 
          ? { src: doctor.imageProfile, alt: doctor.name, className: 'w-24 h-24 rounded-full object-cover border-2 border-white shadow-sm' } 
          : null}
        avatarPlaceholder={
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 border-2 border-white shadow-sm">
            {getInitials(doctor.name)}
          </div>
        }
        leftContent={leftContent}
        rightContent={rightContent}
        className={styles.doctorCard}
      />
    </div>
  );
};

export default DoctorDetails;