import React from 'react';
import { useParams } from 'react-router-dom';
import { useDoctors } from '@hooks/useDoctors';
import styles from './DoctorDetails.module.css';

const DoctorDetails = () => {
  const { id } = useParams();
  const { doctors, loading, error } = useDoctors();

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

  return (
    <div className={styles.doctorDetailsModal}>
      <div className={styles.doctorCard}>
        <div className={styles.doctorAvatar}>
          <img src={doctor.image} alt={doctor.name} className={styles.doctorImage} />
        </div>
        <div className={styles.doctorInfo}>
          <h3>{doctor.name}</h3>
          <p><strong>ID:</strong> {doctor.id}</p>
          <p><strong>Chuyên môn:</strong> {doctor.specialization}</p>
          <p><strong>Số điện thoại:</strong> {doctor.phone}</p>
          <p><strong>Số năm kinh nghiệm:</strong> {doctor.yearsOfExperience}</p>
          <p><strong>Bằng cấp:</strong> {doctor.degree}</p>
          <p><strong>Số giấy phép:</strong> {doctor.licenseNumber}</p>
          <p><strong>Giới tính:</strong> {doctor.gender}</p>
          <p><strong>Địa chỉ:</strong> {doctor.address}</p>
          <p><strong>Giới thiệu:</strong> {doctor.about}</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;