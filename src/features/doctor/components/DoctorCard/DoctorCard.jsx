import React from 'react';
import Card from '@components/common/Card/Card';
import styles from './DoctorCard.module.css';

const DoctorCard = ({ doctor, onClick }) => {
  // Lấy chữ cái đầu của tên nếu không có ảnh
  const getInitials = (name) => {
    if (!name) return 'N';
    return name.split(' ').pop().charAt(0).toUpperCase(); // Lấy chữ cái đầu của từ cuối (họ)
  };

  // Chuyển giới tính thành nhãn hiển thị
  const getGenderBadgeText = (gender) => {
    return gender === 'MALE' ? 'Nam khoa' : 'Sản phụ khoa';
  };

  // Left content - Thông tin cơ bản bên dưới avatar
  const leftContent = (
    <div className={styles.basicInfo}>
      <h3 className={styles.doctorName}>BS. {doctor.name}</h3>
      <div className={styles.genderBadge}>
        {getGenderBadgeText(doctor.gender)}
      </div>
      <div className={styles.experience}>
        {doctor.yearOfExperience} năm kinh nghiệm
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
          <p className={styles.specializationTag}>{doctor.specialization || 'Không có thông tin'}</p>
        </div>
      </div>

      {/* Thành tựu */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Thành tựu nổi bật</h4>
        <ul className={styles.achievementsList}>
          {doctor.specialization && <li>Chứng chỉ chuyên khoa {doctor.specialization}</li>}
          <li>Hơn {doctor.yearOfExperience} năm kinh nghiệm điều trị</li>
          {doctor.about && <li>{doctor.about.slice(0, 100)}...</li>}
        </ul>
      </div>
    </div>
  );

  // Avatar props - Sử dụng imageProfile nếu có
  const avatarProps = doctor.imageProfile && doctor.imageProfile !== '/assets/images/bacsi.png'
    ? {
        src: doctor.imageProfile,
        alt: doctor.name,
        className: 'w-24 h-24 rounded-full object-cover' // Tailwind CSS để đảm bảo ảnh hiển thị hợp lý
      }
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