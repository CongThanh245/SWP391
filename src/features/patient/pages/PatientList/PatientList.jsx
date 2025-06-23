import React, { useState, useEffect } from "react";
import { Search, User, Phone, Calendar, X, Heart, Users } from "lucide-react";
import { getPatients, getPatientDetails } from "@api/patientApi";
import styles from "./PatientList.module.css";

const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      setError("Không thể tải danh sách bệnh nhân");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatientDetails = async (id) => {
    try {
      const data = await getPatientDetails(id);
      setSelectedPatient(data);
      setIsModalOpen(true);
    } catch (err) {
      setError("Không thể tải thông tin chi tiết bệnh nhân");
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchTerm.toLowerCase();
    const patientName = patient.patientName || "";
    const patientId = patient.patientId || "";
    const patientPhone = patient.patientPhone || "";

    return (
      patientName.toLowerCase().includes(searchLower) ||
      patientId.toLowerCase().includes(searchLower) ||
      patientPhone.includes(searchTerm)
    );
  });

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

  const getMaritalStatusText = (status) => {
    switch (status) {
      case "Single":
        return "Độc thân";
      case "Married":
        return "Đã kết hôn";
      case "Divorced":
        return "Đã ly hôn";
      case "Widowed":
        return "Góa";
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

  if (isLoading) return <div className={styles.loading}>Đang tải...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.patientListPage}>
      <div className={styles.pageHeader}>
        <h2>Danh sách Bệnh nhân</h2>
        <p>Quản lý thông tin bệnh nhân</p>
        <div className={styles.stats}>
          <span>Tổng số: {patients.length}</span>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm bệnh nhân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.patientGrid}>
        {filteredPatients.length === 0 ? (
          <div className={styles.noResults}>
            <User size={48} />
            <h3>Không tìm thấy bệnh nhân</h3>
            <p>Thử tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className={`${styles.patientCard} ${
                styles[patient.profileCompleted ? "active" : "inactive"]
              }`}
            >
              <div className={styles.patientHeader}>
                <div className={styles.patientAvatar}>
                  <User size={24} />
                </div>
                <div className={styles.patientBasicInfo}>
                  <h4>{patient.patientName}</h4>
                  <p className={styles.patientId}>ID: {patient.patientId}</p>
                  <p className={styles.patientAge}>
                    {calculateAge(patient.dateOfBirth)} tuổi
                  </p>
                </div>
              </div>

              <div className={styles.patientDetails}>
                <div className={styles.detailRow}>
                  <Phone size={16} />
                  <span>{patient.patientPhone}</span>
                </div>
                <div className={styles.detailRow}>
                  <Calendar size={16} />
                  <span>Ngày tham gia: {formatDate(patient.joinDate)}</span>
                </div>
              </div>

              <button
                className={styles.detailButton}
                onClick={() => fetchPatientDetails(patient.id)}
              >
                Xem chi tiết
              </button>
            </div>
          ))
        )}
      </div>

      {isModalOpen && selectedPatient && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsModalOpen(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <h3>Thông tin chi tiết bệnh nhân</h3>
                <p>ID: {selectedPatient.patientId}</p>
                <div className={styles.infoItem}>
                  <label>Trạng thái hồ sơ:</label>
                  <span
                    className={
                      selectedPatient.profileCompleted
                        ? styles.statusActive
                        : styles.statusInactive
                    }
                  >
                    {selectedPatient.profileCompleted
                      ? "Đã hoàn thiện"
                      : "Chưa hoàn thiện"}
                  </span>
                </div>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
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
                    <span>{selectedPatient.patientName}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Tuổi:</label>
                    <span>
                      {calculateAge(selectedPatient.dateOfBirth)} tuổi
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Giới tính:</label>
                    <span>{getGenderText(selectedPatient.gender)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Ngày sinh:</label>
                    <span>{formatDate(selectedPatient.dateOfBirth)}</span>
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
                    <span>{selectedPatient.email || "Chưa có thông tin"}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Số điện thoại:</label>
                    <span>
                      {selectedPatient.patientPhone || "Chưa có thông tin"}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Địa chỉ:</label>
                    <span>
                      {selectedPatient.patientAddress || "Chưa có thông tin"}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Liên hệ khẩn cấp:</label>
                    <span>
                      {selectedPatient.emergencyContact || "Chưa có thông tin"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tình trạng hôn nhân */}
              <div className={styles.modalSection}>
                <div className={styles.sectionHeader}>
                  <Heart size={20} />
                  <h4>Tình trạng hôn nhân</h4>
                </div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <label>Tình trạng:</label>
                    <span>
                      {getMaritalStatusText(selectedPatient.maritalStatus)}
                    </span>
                  </div>
                  {selectedPatient.marriageDate &&
                    selectedPatient.maritalStatus !== "Single" && (
                      <div className={styles.infoItem}>
                        <label>Ngày kết hôn:</label>
                        <span>{formatDate(selectedPatient.marriageDate)}</span>
                      </div>
                    )}
                </div>
              </div>

              {/* Thông tin vợ/chồng (nếu có) */}
              {selectedPatient.maritalStatus === "Married" &&
                selectedPatient.spousePatientName && (
                  <div className={styles.modalSection}>
                    <div className={styles.sectionHeader}>
                      <Users size={20} />
                      <h4>Thông tin vợ/chồng</h4>
                    </div>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <label>Họ và tên:</label>
                        <span>{selectedPatient.spousePatientName}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <label>Giới tính:</label>
                        <span>
                          {getGenderText(selectedPatient.spouseGender)}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <label>Ngày sinh:</label>
                        <span>
                          {formatDate(selectedPatient.spouseDateOfBirth)}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <label>Ngày tham gia:</label>
                        <span>{formatDate(selectedPatient.joinDate)}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <label>Số điện thoại:</label>
                        <span>
                          {selectedPatient.spousePatientPhone ||
                            "Chưa có thông tin"}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <label>Địa chỉ:</label>
                        <span>
                          {selectedPatient.spousePatientAddress ||
                            "Chưa có thông tin"}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <label>Liên hệ khẩn cấp:</label>
                        <span>
                          {selectedPatient.spouseEmergencyContact ||
                            "Chưa có thông tin"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalCloseButton}
                onClick={() => setIsModalOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
