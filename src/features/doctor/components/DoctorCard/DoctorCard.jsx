// DoctorCard.jsx
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
    return specialization.split(',').map(spec => spec.trim()).slice(0, 3);
  };

  // Left content - Thông tin cơ bản bên dưới avatar
  const leftContent = (
    <div className={styles.basicInfo}>
      <h3 className={styles.doctorName}>BS. {doctor.name}</h3>
      <div className={styles.genderBadge}>
        {getGenderBadgeText(doctor.gender)}
      </div>
      <div className={styles.experience}>
        {doctor.yearsOfExperience} năm kinh nghiệm
      </div>
    </div>
  );

  // Right content - Thông tin chi tiết
  const rightContent = (
    <div className={styles.doctorDetails}>
      {/* Học vấn */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Học vấn</h4>
        <p className={styles.sectionText}>{doctor.degree}</p>
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
          <li>Chứng chỉ chuyên khoa cấp I {doctor.specialization}</li>
          <li>Hơn {doctor.yearsOfExperience} năm kinh nghiệm điều trị</li>
          <li>Thành viên Hội Y học Việt Nam</li>
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