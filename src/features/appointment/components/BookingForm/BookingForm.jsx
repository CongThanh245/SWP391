import React, { useState } from 'react';
import BaseModal from '@components/common/BaseModal/BaseModal';
import styles from './BookingForm.module.css';
import useBookingForm from '@hooks/useBookingForm';

const BookingModal = ({ isOpen, onClose }) => {
  const {
    formData,
    errors,
    isSubmitting,
    showSuccess,
    errorMessage,
    doctors,
    timeSlots,
    handleSubmit,
    handleInputChange,
    handleClose,
    today,
  } = useBookingForm(onClose);

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
        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}

        <div className={styles.formContent}>
          {/* Left Column - Doctor & Date */}
          <div className={styles.leftColumn}>
            {/* Doctor Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Chọn bác sĩ <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={formData.doctorId}
                onChange={(e) => handleInputChange('doctorId', e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">Chọn bác sĩ</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
              {errors.doctorId && (
                <span className={styles.errorMessage}>{errors.doctorId}</span>
              )}
            </div>

            {/* Date Selection */}
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
          </div>

          {/* Right Column - Time & Notes */}
          <div className={styles.rightColumn}>
            {/* Time Slot Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Giờ khám <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={formData.timeSlot}
                onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">Chọn giờ khám</option>
                {timeSlots.map((slot) => (
                  <option
                    key={slot.time}
                    value={slot.time}
                    disabled={!slot.available}
                  >
                    {slot.time}
                    {!slot.available && ' (Đã đặt)'}
                  </option>
                ))}
              </select>
              {errors.timeSlot && (
                <span className={styles.errorMessage}>{errors.timeSlot}</span>
              )}
            </div>

            {/* Notes Section */}
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
            {isSubmitting ? 'Đang xử lý...' : 'Đặt lịch'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default BookingModal;