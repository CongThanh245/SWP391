import React from 'react';
import styles from '../FeatureSection/FeatureSection.module.css'; // Adjust the path as necessary
import FeatureItem from '@features/website/components/patient/FeatureSection/FeatureItem/FeatureItem.jsx'; // Adjust the path as necessary
const features = [
  {
    icon: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="9" stroke="#9e8e7b" strokeWidth="2" />
        <path
          d="M12 7V12L15 15"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Đặt lịch khám',
    description: 'Dễ dàng đặt lịch và quản lý các cuộc hẹn khám trực tuyến',
  },
  {
    icon: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
          stroke="#9e8e7b"
          strokeWidth="2"
        />
        <path
          d="M9 12H15"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 9V15"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Bác sĩ',
    description: 'Chọn bác sĩ chuyên khoa điều trị hiếm muộn phù hợp',
  },
  {
    icon: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
          stroke="#9e8e7b"
          strokeWidth="2"
        />
        <path d="M12 12L12 22" stroke="#9e8e7b" strokeWidth="2" />
        <path d="M12 12L21 7" stroke="#9e8e7b" strokeWidth="2" />
        <path d="M12 12L3 7" stroke="#9e8e7b" strokeWidth="2" />
      </svg>
    ),
    title: 'Dịch vụ',
    description: 'Đa dạng dịch vụ điều trị hiếm muộn IUI, IVF và tư vấn',
  },
  {
    icon: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 11H15"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 8V14"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M3 4.5H21"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="3"
          y="4"
          width="18"
          height="17"
          rx="2"
          stroke="#9e8e7b"
          strokeWidth="2"
        />
        <path
          d="M8 2V4"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 2V4"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Blog',
    description: 'Chia sẻ kinh nghiệm và thông tin về điều trị hiếm muộn',
  },
  {
    icon: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 12V22H4V12"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 7H2V12H22V7Z"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12 22V7"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Hồ sơ sức khỏe',
    description: 'Theo dõi và quản lý hồ sơ sức khỏe hiếm muộn',
  },
  {
    icon: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 12H15"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 9V15"
          stroke="#9e8e7b"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Liên hệ',
    description: 'Kết nối với chuyên gia y tế về điều trị hiếm muộn',
  },
];

function FeaturesSection() {
  return (
    <section className={styles.featuresSection}>
      {features.map((feature, index) => (
        <FeatureItem
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </section>
  );
}

export default FeaturesSection;