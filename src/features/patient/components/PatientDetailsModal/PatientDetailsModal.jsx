import React from "react";
import { User, Phone, Users, X } from "lucide-react";
import styles from "./PatientDetailsModal.module.css";

const PatientDetailsModal = ({
  patient,
  isOpen,
  onClose,
  extraFields = [],
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case "MALE":
        return "Nam";
      case "FEMALE":
        return "Nữ";
      default:
        return "Chưa xác định";
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (!isOpen || !patient) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <h3>Thông tin chi tiết bệnh nhân</h3>
            <p>ID: {patient.patientId}</p>
            <div className={styles.infoItem}>
              <label>Trạng thái hồ sơ:</label>
              <span
                className={
                  patient.profileCompleted
                    ? styles.statusActive
                    : styles.statusInactive
                }
              >
                {patient.profileCompleted ? "Đã hoàn thiện" : "Chưa hoàn thiện"}
              </span>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.modalContent}>
          {/* Thông tin cơ bản */}
          <div className={styles.modalSection}>
            <div className={styles.sectionHeader}>
              <User size={20} />
              <h4>Thông tin cơ bản</h4>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Họ và tên:</label>
                <span>{patient.patientName}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Tuổi:</label>
                <span>{calculateAge(patient.dateOfBirth)} tuổi</span>
              </div>
              <div className={styles.infoItem}>
                <label>Giới tính:</label>
                <span>{getGenderText(patient.gender)}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Ngày sinh:</label>
                <span>{formatDate(patient.dateOfBirth)}</span>
              </div>
            </div>
          </div>

          {/* Thông tin liên lạc */}
          <div className={styles.modalSection}>
            <div className={styles.sectionHeader}>
              <Phone size={20} />
              <h4>Thông tin liên lạc</h4>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Email:</label>
                <span>{patient.email || "Chưa có thông tin"}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Số điện thoại:</label>
                <span>{patient.patientPhone || "Chưa có thông tin"}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Địa chỉ:</label>
                <span>{patient.patientAddress || "Chưa có thông tin"}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Liên hệ khẩn cấp:</label>
                <span>{patient.emergencyContact || "Chưa có thông tin"}</span>
              </div>
            </div>
          </div>

          {/* Thông tin người đi kèm */}
          {patient.spousePatientName && (
            <div className={styles.modalSection}>
              <div className={styles.sectionHeader}>
                <Users size={20} />
                <h4>Thông tin người đi kèm</h4>
              </div>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>Họ và tên:</label>
                  <span>{patient.spousePatientName}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Giới tính:</label>
                  <span>{getGenderText(patient.spouseGender)}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Ngày sinh:</label>
                  <span>{formatDate(patient.spouseDateOfBirth)}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Số điện thoại:</label>
                  <span>
                    {patient.spousePatientPhone || "Chưa có thông tin"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <label>Địa chỉ:</label>
                  <span>
                    {patient.spousePatientAddress || "Chưa có thông tin"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <label>Liên hệ khẩn cấp:</label>
                  <span>
                    {patient.spouseEmergencyContact || "Chưa có thông tin"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* giả dụ nếu có nhiều field khác mà role ở cấp cao hơn mới thấy thì truyền qua đây */}
          {extraFields.length > 0 && (
            <div className={styles.modalSection}>
              <div className={styles.sectionHeader}>
                <User size={20} />
                <h4>Thông tin bổ sung</h4>
              </div>
              <div className={styles.infoGrid}>
                {extraFields.map((field, index) => (
                  <div key={index} className={styles.infoItem}>
                    <label>{field.label}:</label>
                    <span>{field.value || "Chưa có thông tin"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;