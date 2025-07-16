// components/WorkingHours/WorkingHours.jsx
import React from "react";
import styles from "./WorkingHour.module.css";
import Button from "@components/common/Button/Button";

const WorkingHours = () => {
  const schedule = [
    { day: "Thứ 2 - Thứ 6", time: "07:00 - 18:00", isOpen: true },
    { day: "Thứ 7", time: "07:00 - 17:00", isOpen: true },
    { day: "Chủ nhật", time: "08:00 - 16:00", isOpen: true },
    { day: "Lễ Tết", time: "Nghỉ", isOpen: false },
  ];

  const contactInfo = [
    {
      label: "Địa chỉ",
      value: "123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM",
      icon:
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4d3c2d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-map-pin"
        >
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <circle cx="12" cy="10" r="3" />
        </svg>,
    },
    {
      label: "Điện thoại", value: "(028) 1234 5678", icon:
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4d3c2d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-phone-icon"
        >
          <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
        </svg>
    },
    {
      label: "Email", value: "info@ankhang.com", icon:
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4d3c2d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-mail-icon"
        >
          <path d="M22 7L13.009 12.727a2 2 0 0 1-2.009 0L2 7" />
          <rect x="2" y="4" width="20" height="16" rx="2" />
        </svg>
    },
    {
      label: "Website", value: "www.ankhang.com", icon:
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4d3c2d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-globe-icon"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
    },
  ];

  return (
    <div className={styles.workingHoursContainer}>
      <div className={styles.scheduleSection}>
        <h2 className={styles.sectionTitle}>Giờ làm việc</h2>
        <div className={styles.note}>
          <p>
            <strong>Lưu ý:</strong> Vui lòng gọi trước để đặt lịch hẹn tránh
            chờ đợi
          </p>
        </div>
        <div className={styles.scheduleCard}>
          {schedule.map((item, index) => (
            <div
              key={index}
              className={`${styles.scheduleItem} ${!item.isOpen ? styles.closed : ""
                }`}
            >
              <span className={styles.day}>{item.day}</span>
              <span className={styles.time}>{item.time}</span>
              <span
                className={`${styles.status} ${item.isOpen ? styles.open : styles.closedStatus
                  }`}
              >

              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.contactSection}>
        <h2 className={styles.sectionTitle}>Thông tin liên hệ</h2>
        <div className={styles.contactGrid}>
          {contactInfo.map((info, index) => (
            <div key={index} className={styles.contactItem}>
              <div className={styles.contactIcon}>{info.icon}</div>
              <div className={styles.contactDetails}>
                <span className={styles.contactLabel}>{info.label}</span>
                <span className={styles.contactValue}>{info.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkingHours;
