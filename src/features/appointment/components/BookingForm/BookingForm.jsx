import React, { useState } from 'react';
import BaseModal from '@components/common/BaseModal/BaseModal';
import styles from './BookingForm.module.css';

const BookingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    timeSlot: '',
    notes: ''
  });
 const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data - trong thực tế sẽ fetch từ API
  const doctors = [
    {
      id: 1,
      name: 'BS. Nguyễn Thị Hoa',
      specialty: 'Chuyên khoa Sản Phụ khoa',
      avatar: 'NH'
    },
    {
      id: 2,
      name: 'BS. Trần Văn Minh',
      specialty: 'Chuyên khoa Hiếm muộn',
      avatar: 'TM'
    },
    {
      id: 3,
      name: 'BS. Lê Thị Mai',
      specialty: 'Chuyên khoa IVF',
      avatar: 'LM'
    },
    {
      id: 4,
      name: 'BS. Phạm Đức Anh',
      specialty: 'Chuyên khoa Nam học',
      avatar: 'PA'
    }
  ];

  // Mock time slots - trong thực tế sẽ dựa vào bác sĩ và ngày được chọn
  const timeSlots = [
    { time: '08:00', available: true },
    { time: '08:30', available: true },
    { time: '09:00', available: false },
    { time: '09:30', available: true },
    { time: '10:00', available: true },
    { time: '10:30', available: false },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '15:30', available: true },
    { time: '16:00', available: false },
    { time: '16:30', available: true }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.doctorId) {
      newErrors.doctorId = 'Vui lòng chọn bác sĩ';
    }
    
    if (!formData.date) {
      newErrors.date = 'Vui lòng chọn ngày khám';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Ngày khám không thể là ngày trong quá khứ';
      }
    }
    
    if (!formData.timeSlot) {
      newErrors.timeSlot = 'Vui lòng chọn giờ khám';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          doctorId: '',
          date: '',
          timeSlot: '',
          notes: ''
        });
        setShowSuccess(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDoctorSelect = (doctorId) => {
    setFormData(prev => ({ ...prev, doctorId }));
    setErrors(prev => ({ ...prev, doctorId: '' }));
  };

  const handleTimeSlotSelect = (time) => {
    setFormData(prev => ({ ...prev, timeSlot: time }));
    setErrors(prev => ({ ...prev, timeSlot: '' }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        doctorId: '',
        date: '',
        timeSlot: '',
        notes: ''
      });
      setErrors({});
      setShowSuccess(false);
      onClose();
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Đặt lịch hẹn khám"
      className="booking-modal"
    >
      <form className={styles.bookingForm} onSubmit={handleSubmit}>
        {showSuccess && (
          <div className={styles.successMessage}>
            🎉 Đặt lịch hẹn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.
          </div>
        )}

        <div className={styles.formContent}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Chọn bác sĩ */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Chọn bác sĩ <span className={styles.required}>*</span>
              </label>
              <div className={styles.doctorList}>
                {doctors.map(doctor => (
                  <div
                    key={doctor.id}
                    className={`${styles.doctorCard} ${
                      formData.doctorId === doctor.id ? styles.selected : ''
                    }`}
                    onClick={() => handleDoctorSelect(doctor.id)}
                  >
                    <div className={styles.doctorAvatar}>
                      {doctor.avatar}
                    </div>
                    <div className={styles.doctorInfo}>
                      <h4 className={styles.doctorName}>{doctor.name}</h4>
                      <p className={styles.doctorSpecialty}>{doctor.specialty}</p>
                    </div>
                  </div>
                ))}
              </div>
              {errors.doctorId && (
                <span className={styles.errorMessage}>{errors.doctorId}</span>
              )}
            </div>

            {/* Ghi chú */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Ghi chú thêm</label>
              <textarea
                className={styles.textarea}
                placeholder="Mô tả triệu chứng hoặc yêu cầu đặc biệt..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Chọn ngày */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Ngày khám <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                className={styles.input}
                value={formData.date}
                min={today}
                onChange={(e) => handleInputChange('date', e.target.value)}
                disabled={isSubmitting}
              />
              {errors.date && (
                <span className={styles.errorMessage}>{errors.date}</span>
              )}
            </div>

            {/* Chọn giờ */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Giờ khám <span className={styles.required}>*</span>
              </label>
              <div className={styles.timeSlots}>
                {timeSlots.map(slot => (
                  <button
                    key={slot.time}
                    type="button"
                    className={`${styles.timeSlot} ${
                      formData.timeSlot === slot.time ? styles.selected : ''
                    } ${!slot.available ? styles.unavailable : ''}`}
                    onClick={() => slot.available && handleTimeSlotSelect(slot.time)}
                    disabled={!slot.available || isSubmitting}
                  >
                    {slot.time}
                    {!slot.available && ' (Đã đặt)'}
                  </button>
                ))}
              </div>
              {errors.timeSlot && (
                <span className={styles.errorMessage}>{errors.timeSlot}</span>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || showSuccess}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default BookingModal;