// components/Vision/Vision.jsx
import React from 'react';
import styles from './Vision.module.css';

const Vision = () => {
  const values = [
    {
      title: "Chất lượng",
      description: "Cam kết cung cấp dịch vụ y tế chất lượng cao với đội ngũ bác sĩ chuyên nghiệp",
      icon: "🏥"
    },
    {
      title: "An toàn",
      description: "Đảm bảo an toàn tuyệt đối cho bệnh nhân với quy trình khám chữa bệnh chuẩn mực",
      icon: "🛡️"
    },
    {
      title: "Tận tâm",
      description: "Luôn đặt sức khỏe và lợi ích của bệnh nhân lên hàng đầu trong mọi hoạt động",
      icon: "❤️"
    },
    {
      title: "Hiện đại",
      description: "Ứng dụng công nghệ y tế tiên tiến nhất để nâng cao hiệu quả điều trị",
      icon: "⚕️"
    }
  ];

  return (
    <div className={styles.visionContainer}>
      <div className={styles.visionSection}>
        <h2 className={styles.sectionTitle}>Tầm nhìn của chúng tôi</h2>
        <div className={styles.visionContent}>
          <p className={styles.visionText}>
            Trở thành phòng khám đa khoa hàng đầu trong khu vực, cung cấp dịch vụ chăm sóc 
            sức khỏe toàn diện, chuyên nghiệp và nhân văn. Chúng tôi hướng tới việc xây dựng 
            một cộng đồng khỏe mạnh thông qua việc áp dụng những tiến bộ y học hiện đại nhất.
          </p>
        </div>
      </div>

      <div className={styles.valuesSection}>
        <h2 className={styles.sectionTitle}>Giá trị cốt lõi</h2>
        <div className={styles.valuesGrid}>
          {values.map((value, index) => (
            <div key={index} className={styles.valueCard}>
              <div className={styles.valueIcon}>{value.icon}</div>
              <h3 className={styles.valueTitle}>{value.title}</h3>
              <p className={styles.valueDescription}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vision;