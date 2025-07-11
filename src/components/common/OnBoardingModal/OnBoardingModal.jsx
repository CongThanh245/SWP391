import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from './OnboardingModal.module.css';
import step1 from '@assets/images/step1.png';
import step2 from '@assets/images/step2.png';
import step3 from '@assets/images/step3.png';
import step4 from '@assets/images/step4.png';

const OnboardingModal = ({ isOpen, onRequestClose, userName }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Chào mừng bạn đến với hệ thống!',
      description: `Xin chào ${userName || 'bạn'}! Đây là Dashboard của bạn, nơi bạn có thể quản lý hồ sơ và đặt lịch hẹn. Nhấn vào nút "Đặt lịch hẹn" để bắt đầu.`,
      image: step1,
    },
    {
      title: 'Hoàn thiện hồ sơ cá nhân',
      description: 'Để đặt lịch hẹn, hãy hoàn thành hồ sơ của bạn. Nhấn "Chỉnh sửa hồ sơ" trên Dashboard và điền đầy đủ thông tin. Khi trạng thái là "Đã hoàn thành", bạn có thể đặt lịch!',
      image: step2,
    },
    {
      title: 'Tải tài liệu (tùy chọn)',
      description: 'Nếu cần đính kèm tài liệu, vào trang "Tải lên tài liệu" từ menu và chọn file. Đảm bảo tải lên trước khi đặt lịch.',
      image: step3,
    },
    {
      title: 'Đặt lịch hẹn dễ dàng',
      description: 'Quay lại Dashboard, nhấn "Đặt lịch hẹn", chọn thời gian phù hợp và xác nhận. Rất đơn giản!',
      image: step4,
    },
    {
      title: 'Bạn đã sẵn sàng!',
      description: 'Chúc mừng! Bạn đã biết cách đặt lịch hẹn. Bắt đầu ngay hoặc khám phá thêm các tính năng. Liên hệ hỗ trợ nếu cần!',
      image: step4,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('hasSeenOnboarding', 'true');
      onRequestClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleSkip}
      className={styles.onboardingModal}
      overlayClassName={styles.onboardingOverlay}
      ariaHideApp={false}
    >
      <div className="relative">
        <button
          onClick={handleSkip}
          className={styles.skipButton}
        >
          Bỏ qua
        </button>
        <div className="flex flex-col items-center">
          <img
            src={steps[currentStep].image}
            alt={steps[currentStep].title}
            className={styles.image}
          />
          <h2>{steps[currentStep].title}</h2>
          <p>{steps[currentStep].description}</p>
          <div className={styles.buttonContainer}>
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`${styles.navButton} ${styles.previousButton}`}
            >
              Quay lại
            </button>
            <button
              onClick={handleNext}
              className={`${styles.navButton} ${styles.nextButton}`}
            >
              {currentStep === steps.length - 1 ? 'Hoàn tất' : 'Tiếp theo'}
            </button>
          </div>
          <div className={styles.progressDots}>
            {steps.map((_, index) => (
              <div
                key={index}
                className={`${styles.progressDot} ${index === currentStep ? styles.active : ''}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OnboardingModal;