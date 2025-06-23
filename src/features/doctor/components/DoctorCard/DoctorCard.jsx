// src/features/doctor/components/DoctorCard/DoctorCard.jsx
import React from 'react';
import Card from '@components/common/Card/Card';
import styles from './DoctorCard.module.css';

const DoctorCard = ({ doctor, onClick }) => {
  const getInitials = (name) => {
    if (!name) return 'N';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return nameParts[0].charAt(0).toUpperCase();
  };

  const getGenderBadgeText = (gender) => {
    return gender === 'MALE' ? 'Nam khoa' : 'Sản phụ khoa';
  };

  const getSpecializationTags = (specialization) => {
    if (!specialization) return [];
    // API trả về specialization là chuỗi đơn (ví dụ: "IVF_SPECIALIST")
    // Nếu server trả về chuỗi phân tách bằng dấu phẩy, giữ logic split
    return specialization.includes(',') 
      ? specialization.split(',').map(spec => spec.trim()).slice(0, 3)
      : [specialization];
  };

  // Left content - Thông tin cơ bản bên dưới avatar
  const leftContent = (
    <div className={styles.basicInfo}>
      <h3 className={styles.doctorName}>BS. {doctor.name}</h3>
      <div className={styles.genderBadge}>
        {getGenderBadgeText(doctor.gender)}
      </div>
      <div className={styles.experience}>
        {doctor.yearOfExperience} năm kinh nghiệm {/* Sửa từ yearsOfExperience */}
      </div>
    </div>
  );

  // Right content - Thông tin chi tiết
  const rightContent = (
    <div className={styles.doctorDetails}>
      {/* Học vấn */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Học vấn</h4>
        <p className={styles.sectionText}>{doctor.degree || 'Không có thông tin'}</p>
      </div>

      {/* Chuyên môn */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Chuyên môn</h4>
        <div className={styles.specializationTags}>
          {getSpecializationTags(doctor.specialization).map((spec, index) => (
            <span key={index} className={styles.specializationTag}>
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Thành tựu */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Thành tựu nổi bật</h4>
        <ul className={styles.achievementsList}>
          <li>Chứng chỉ chuyên khoa {doctor.specialization}</li>
          <li>Hơn {doctor.yearOfExperience} năm kinh nghiệm điều trị</li>
          {/* Xóa mục giả định nếu không có trong API */}
          {doctor.about && <li>{doctor.about.slice(0, 100)}...</li>}
        </ul>
      </div>
    </div>
  );

  // Avatar props
  const avatarProps = doctor.image && doctor.image !== "/assets/images/bacsi.png" 
    ? { src: doctor.image, alt: doctor.name }
    : null;

  const avatarPlaceholder = getInitials(doctor.name);

  return (
    <Card
      avatar={avatarProps}
      avatarPlaceholder={avatarPlaceholder}
      leftContent={leftContent}
      rightContent={rightContent}
      onClick={onClick}
      className={styles.doctorCard}
    />
  );
};

export default DoctorCard;