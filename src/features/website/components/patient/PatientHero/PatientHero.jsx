import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "./PatientHero.module.css";
import BookingForm from "@features/appointment/components/BookingForm/BookingForm";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@hooks/use-toast";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@components/ui/toast";
import { User, FileText, Calendar, CloudUpload } from "lucide-react";

const PatientHero = () => {
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isProfileIncompleteModalOpen, setIsProfileIncompleteModalOpen] = useState(false);
  const { toasts, toast } = useToast();
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    if (user && user.profileCompleted) {
      setIsBookingFormOpen(true);
    } else {
      setIsProfileIncompleteModalOpen(true);
    }
  };

  const handleCloseBookingForm = () => {
    setIsBookingFormOpen(false);
  };

  const handleBookingSuccess = () => {
    toast({
      title: "🎉 Đặt lịch thành công",
      description: "Chúng tôi sẽ liên hệ với bạn sớm nhất.",
    });
  };

  const handleCloseProfileModal = () => {
    setIsProfileIncompleteModalOpen(false);
  };

  const handleCompleteProfile = () => {
    setIsProfileIncompleteModalOpen(false);
    navigate("/health-records/profile");
  };

  return (
    <section className={styles.container}>
      <div className={styles.backgroundDecoration}></div>
      <div className={styles.pulseRing}></div>
      <div className={styles.particleContainer}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.centerSection}>
          <h1 className={`${styles.title} ${styles.fadeInUp}`}>
            Chào mừng bạn đến với
            <br />
            FertiCare
          </h1>
          <p className={`${styles.subtitle} ${styles.fadeInUp}`}>
            Chúng tôi mang đến những giải pháp điều trị hiếm muộn tiên tiến
            nhất, với đội ngũ bác sĩ giàu kinh nghiệm và công nghệ y tế hiện
            đại.
          </p>
          <button
            className={`${styles.primaryButton} ${styles.glowEffect}`}
            onClick={handleBookAppointment}
          >
            <span className={styles.buttonText}>Đặt lịch hẹn ngay</span>
            <span className={styles.ripple}></span>
          </button>
        </div>

        <div className={styles.actionSection}>
          <Link to="/health-records/profile" className={styles.actionButton}>
            <User className={styles.icon} size={20} />
            Hồ sơ cá nhân
          </Link>
          <Link
            to="/health-records/medical-records"
            className={styles.actionButton}
          >
            <FileText className={styles.icon} size={20} />
            Kết quả khám bệnh
          </Link>
          <Link
            to="/health-records/appointments"
            className={styles.actionButton}
          >
            <Calendar className={styles.icon} size={20} />
            Lịch hẹn của tôi
          </Link>
          <Link
            to="/health-records/attachments"
            className={styles.actionButton}
          >
            <CloudUpload className={styles.icon} size={20} />
            Tài liệu tải lên
          </Link>
        </div>
      </div>

      <BookingForm
        isOpen={isBookingFormOpen}
        onClose={handleCloseBookingForm}
        onSuccess={handleBookingSuccess}
      />

      <Modal
        isOpen={isProfileIncompleteModalOpen}
        onRequestClose={handleCloseProfileModal}
        className={styles.profileIncompleteModal}
        overlayClassName={styles.profileIncompleteOverlay}
        ariaHideApp={false}
      >
        <div className={styles.profileModalContent}>
          <h2 className={styles.profileModalTitle}>
            Vui lòng hoàn thành hồ sơ
          </h2>
          <p className={styles.profileModalDescription}>
            Để đặt lịch hẹn, bạn cần hoàn thành thông tin hồ sơ cá nhân trước.
          </p>
          <div className={styles.profileModalButtonContainer}>
            <button
              onClick={handleCloseProfileModal}
              className={styles.profileModalCloseButton}
            >
              Đóng
            </button>
            <button
              onClick={handleCompleteProfile}
              className={styles.profileModalActionButton}
            >
              Hoàn thành hồ sơ
            </button>
          </div>
        </div>
      </Modal>

      {toasts.map((t) => (
        <Toast key={t.id} {...t}>
          {t.title && <ToastTitle>{t.title}</ToastTitle>}
          {t.description && (
            <ToastDescription>{t.description}</ToastDescription>
          )}
          {t.action}
          <ToastClose />
        </Toast>
      ))}
    </section>
  );
};

export default PatientHero;