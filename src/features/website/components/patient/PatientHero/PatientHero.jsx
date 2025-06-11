import React, { useState } from "react";
import styles from "./PatientHero.module.css";
import BookingForm from "@features/appointment/components/BookingForm/BookingForm";
import { Link } from "react-router-dom";

const PatientHero = () => {
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  const handleBookAppointment = () => {
    setIsBookingFormOpen(true);
  };

  const handleCloseBookingForm = () => {
    setIsBookingFormOpen(false);
  };

  const handleViewSchedule = () => {
    console.log("Xem lịch khám clicked");
  };

  const handleViewMedicalRecord = () => {
    console.log("Hồ sơ bệnh án clicked");
  };

  return (
    <section className={styles.container}>
      <div className={styles.backgroundDecoration}></div>

      <div className={styles.content}>
        {/* Left Section */}
        <div className={styles.leftSection}>
          <div className={styles.badge}>
            Trung tâm điều trị hiếm muộn hàng đầu
          </div>

          <h1 className={styles.title}>
            Chào mừng bạn đến với
            <br />
            FertiCare
          </h1>

          <p className={styles.subtitle}>
            Chúng tôi mang đến những giải pháp điều trị hiếm muộn tiên tiến
            nhất, với đội ngũ bác sĩ giàu kinh nghiệm và công nghệ y tế hiện
            đại.
          </p>

          <button className={styles.primaryButton} onClick={handleBookAppointment}>
            Đặt lịch hẹn ngay
          </button>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          {/* Card for View Schedule */}
          <Link
            to="/health-records/appointments"
            className={styles.featureCard}
            onClick={handleViewSchedule}
          >
            <svg
              className={styles.icon}
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4D3C2D"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
              <path d="M8 14h.01" />
              <path d="M12 14h.01" />
              <path d="M16 14h.01" />
              <path d="M8 18h.01" />
              <path d="M12 18h.01" />
              <path d="M16 18h.01" />
            </svg>
            <h3 className={styles.cardTitle}>Xem lịch khám</h3>
            <p className={styles.cardDescription}>
              Kiểm tra và quản lý lịch hẹn khám bệnh của bạn một cách dễ dàng
            </p>
            <span className={styles.cardLink}>Xem ngay</span>
          </Link>

          {/* Card for Medical Record */}
          <Link
            to="/health-records/medical-records"
            className={styles.featureCard}
            onClick={handleViewMedicalRecord}
          >
            <svg
              className={styles.icon}
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4D3C2D"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M10 9H8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
            </svg>
            <h3 className={styles.cardTitle}>Hồ sơ bệnh án</h3>
            <p className={styles.cardDescription}>
              Truy cập hồ sơ y tế và theo dõi quá trình điều trị của bạn
            </p>
            <span className={styles.cardLink}>Xem ngay</span>
          </Link>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingForm isOpen={isBookingFormOpen} onClose={handleCloseBookingForm} />
    </section>
  );
};

export default PatientHero;