// components/Vision/Vision.jsx
import React from 'react';
import styles from './Vision.module.css';

const Vision = () => {
  const values = [
    {
      title: "Chất lượng",
      description: "Cam kết cung cấp dịch vụ y tế chất lượng cao với đội ngũ bác sĩ chuyên nghiệp",
      icon:
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4d3c2d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-hospital-icon"
        >
          <path d="M12 6v4" />
          <path d="M14 14h-4" />
          <path d="M14 18h-4" />
          <path d="M14 8h-4" />
          <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2" />
          <path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18" />
        </svg>
    },
    {
      title: "An toàn",
      description: "Đảm bảo an toàn tuyệt đối cho bệnh nhân với quy trình khám chữa bệnh chuẩn mực",
      icon:
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4d3c2d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-shield-check-icon"
        >
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
    },
    {
      title: "Tận tâm",
      description: "Luôn đặt sức khỏe và lợi ích của bệnh nhân lên hàng đầu trong mọi hoạt động",
      icon:
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4d3c2d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-heart-handshake-icon"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
          <path d="m18 15-2-2" />
          <path d="m15 18-2-2" />
        </svg>
    },
    {
      title: "Hiện đại",
      description: "Ứng dụng công nghệ y tế tiên tiến nhất để nâng cao hiệu quả điều trị",
      icon:
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4d3c2d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-square-activity-icon"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M17 12h-2l-2 5-2-10-2 5H7" />
        </svg>
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