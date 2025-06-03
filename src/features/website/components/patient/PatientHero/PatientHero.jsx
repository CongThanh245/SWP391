import React, { useState } from "react";
import styles from "./PatientHero.module.css";
import BookingForm from "@features/appointment/components/BookingForm/BookingForm";

const PatientHero = ({ userName = "bạn" }) => {
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const handleBookAppointment = () => {
    setIsBookingFormOpen(true);
  };

  const handleCloseBookingForm = () => {
    setIsBookingFormOpen(false);
  };

  const handleViewSchedule = () => {
    // Handle view schedule logic
    console.log("Xem lịch khám clicked");
  };

  const handleViewMedicalRecord = () => {
      // Handle view medical record logic
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
            Chào mừng {userName} đến với
            <br />
            FertiCare
          </h1>

          <p className={styles.subtitle}>
            Chúng tôi mang đến những giải pháp điều trị hiếm muộn tiên tiến
            nhất, với đội ngũ bác sĩ giàu kinh nghiệm và công nghệ y tế hiện
            đại.
          </p>

          <button
            className={styles.primaryButton}
            onClick={handleBookAppointment}
          >
            Đặt lịch hẹn ngay
          </button>

          {/* Stats Section */}
          <div className={styles.statsSection}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>15+</span>
              <span className={styles.statLabel}>Năm kinh nghiệm</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>5000+</span>
              <span className={styles.statLabel}>Ca thành công</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>Bác sĩ chuyên khoa</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>98%</span>
              <span className={styles.statLabel}>Hài lòng</span>
            </div>
          </div>
        </div>

        {/* Right Section - Feature Cards */}
        <div className={styles.rightSection}>
          <div className={styles.featureCard} onClick={handleViewSchedule}>
            <div className={styles.cardIcon}>📅</div>
            <h3 className={styles.cardTitle}>Xem lịch khám</h3>
            <p className={styles.cardDescription}>
              Kiểm tra và quản lý lịch hẹn khám bệnh của bạn một cách dễ dàng
            </p>
            <a
              href="#"
              className={styles.cardLink}
              onClick={(e) => e.preventDefault()}
            >
              Xem ngay
            </a>
          </div>

          <div className={styles.featureCard} onClick={handleViewMedicalRecord}>
            <div className={styles.cardIcon}>📋</div>
            <h3 className={styles.cardTitle}>Hồ sơ bệnh án</h3>
            <p className={styles.cardDescription}>
              Truy cập hồ sơ y tế và theo dõi quá trình điều trị của bạn
            </p>
            <a
              href="#"
              className={styles.cardLink}
              onClick={(e) => e.preventDefault()}
            >
              Xem ngay
            </a>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingForm
        isOpen={isBookingFormOpen}
        onClose={handleCloseBookingForm}
      />
    </section>
  );
};

export default PatientHero;
