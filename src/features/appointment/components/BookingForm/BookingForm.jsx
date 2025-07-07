import React, { useEffect } from "react";
import BaseModal from "@components/common/BaseModal/BaseModal";
import styles from "./BookingForm.module.css";
import useBookingForm from "@hooks/useBookingForm";

const BookingModal = ({ isOpen, onClose, onSuccess }) => {
  const {
    formData,
    errors,
    isSubmitting,
    showSuccess,
    errorMessage,
    doctors,
    timeSlots,
    uploadedFiles,
    handleSubmit,
    handleInputChange,
    handleFileSelection,
    handleClose,
    handleTimeSlotFocus,
    today,
    loadingSlots,
  } = useBookingForm(onClose);

  // Khi booking thành công:
  useEffect(() => {
    if (showSuccess) {
      handleClose(); // Đóng modal
      onSuccess?.(); // Báo lên parent để show toast
    }
  }, [showSuccess]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Đặt lịch hẹn khám"
      className="booking-modal"
    >
      <form className={styles.bookingForm} onSubmit={handleSubmit}>
        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}

        <div className={styles.formContent}>
          {/* Frame 1 - Doctor & Date */}
          <div className={styles.frame}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Chọn bác sĩ <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={formData.doctorId}
                onChange={(e) => handleInputChange("doctorId", e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">Chọn bác sĩ</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
              {errors.doctorId && (
                <span className={styles.errorMessage}>{errors.doctorId}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Ngày khám <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                className={styles.input}
                value={formData.date}
                min={today}
                onChange={(e) => handleInputChange("date", e.target.value)}
                disabled={isSubmitting}
              />
              {errors.date && (
                <span className={styles.errorMessage}>{errors.date}</span>
              )}
            </div>
          </div>

          {/* Frame 2 - Time & Notes */}
          <div className={styles.frame}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Giờ khám <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={formData.timeSlot}
                onChange={(e) => handleInputChange("timeSlot", e.target.value)}
                onFocus={handleTimeSlotFocus}
                disabled={isSubmitting || loadingSlots}
              >
                <option value="">Chọn giờ khám</option>
                {timeSlots
                  .filter((slot) => slot.available)
                  .map((slot) => (
                    <option key={slot.id} value={slot.time}>
                      {slot.time}
                    </option>
                  ))}
              </select>
              {errors.timeSlot && (
                <span className={styles.errorMessage}>{errors.timeSlot}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label + " flex items-center gap-1"}>
                File đã tải lên
                <span
                  className={styles.infoIcon}
                  title="Đây là file bạn đã tải lên từ trang quản lý hồ sơ cá nhân (Hồ sơ đính kèm)."
                >
                  ?
                </span>
              </label>
              <div className={styles.fileList}>
                {uploadedFiles.length > 0 ? (
                  uploadedFiles.map((file) => (
                    <div key={file.id} className={styles.fileCard}>
                      <input
                        type="checkbox"
                        id={`file-${file.id}`}
                        checked={formData.files?.includes(file.id) || false}
                        onChange={() => handleFileSelection(file.id)}
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor={`file-${file.id}`}
                        className={styles.fileLabel}
                      >
                        <div className={styles.filePreview}>
                          {file.type.startsWith("image/") ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className={styles.fileImage}
                            />
                          ) : (
                            <div className={styles.fileIcon}>📄</div>
                          )}
                          <span className={styles.fileName}>{file.name}</span>
                        </div>
                      </label>
                    </div>
                  ))
                ) : (
                  <p className={styles.noFiles}>Không có tài liệu nào.</p>
                )}
              </div>
              {errors.files && (
                <span className={styles.errorMessage}>{errors.files}</span>
              )}
            </div>
          </div>

          {/* Frame 3 - Files */}
          <div className={styles.frame}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ghi chú thêm</label>
              <textarea
                className={styles.textarea}
                placeholder="Mô tả triệu chứng hoặc yêu cầu đặc biệt..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || showSuccess}
          >
            {isSubmitting ? "Đang xử lý..." : "Đặt lịch"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default BookingModal;
