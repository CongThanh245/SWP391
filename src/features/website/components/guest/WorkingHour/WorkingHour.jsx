// components/WorkingHours/WorkingHours.jsx
import React from "react";
import styles from "./WorkingHour.module.css";
import Button from "@components/common/Button/Button";

const WorkingHours = () => {
  const schedule = [
    { day: "Thứ 2 - Thứ 6", time: "07:00 - 19:00", isOpen: true },
    { day: "Thứ 7", time: "07:00 - 17:00", isOpen: true },
    { day: "Chủ nhật", time: "08:00 - 16:00", isOpen: true },
    { day: "Lễ Tết", time: "Nghỉ", isOpen: false },
  ];

  const contactInfo = [
    {
      label: "Địa chỉ",
      value: "123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM",
      icon: "📍",
    },
    { label: "Điện thoại", value: "(028) 1234 5678", icon: "📞" },
    { label: "Email", value: "info@ankhang.com", icon: "✉️" },
    { label: "Website", value: "www.ankhang.com", icon: "🌐" },
  ];

  return (
    <div className={styles.workingHoursContainer}>
      <div className={styles.scheduleSection}>
        <h2 className={styles.sectionTitle}>Giờ làm việc</h2>
        <div className={styles.note}>
          <p>
            💡<strong>Lưu ý:</strong> Vui lòng gọi trước để đặt lịch hẹn tránh
            chờ đợi
          </p>
        </div>
        <div className={styles.scheduleCard}>
          {schedule.map((item, index) => (
            <div
              key={index}
              className={`${styles.scheduleItem} ${
                !item.isOpen ? styles.closed : ""
              }`}
            >
              <span className={styles.day}>{item.day}</span>
              <span className={styles.time}>{item.time}</span>
              <span
                className={`${styles.status} ${
                  item.isOpen ? styles.open : styles.closedStatus
                }`}
              >
                {item.isOpen ? "🟢" : "🔴"}
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
        <div className={styles.actionButtons}>
          <Button variant="primary">Đặt lịch ngay</Button>
        </div>
      </div>
    </div>
  );
};

export default WorkingHours;
