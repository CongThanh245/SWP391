import React, { useState, useEffect } from "react";
import { Search, User, Phone, Calendar, X, Heart, Users } from "lucide-react";
import { getPatients, getEvaluationCriteria } from "@api/patientApi";
import styles from "./PreTestResult.module.css";

const PreTestResult = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [evaluationCriteria, setEvaluationCriteria] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

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

  const fetchEvaluationCriteria = async (appointmentId, patientId) => {
    try {
      const data = await getEvaluationCriteria(appointmentId, patientId);
      setEvaluationCriteria(data);
      setFormData(
        data.reduce((acc, criterion) => {
          acc[criterion.id] = "";
          return acc;
        }, {})
      );
      setIsModalOpen(true);
    } catch (err) {
      setError("Không thể tải tiêu chí đánh giá");
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    const appointmentId = patient.latestAppointmentId; // Giả sử appointmentId có trong dữ liệu patient
    fetchEvaluationCriteria(appointmentId, patient.id);
  };

  const handleInputChange = (criterionId, value) => {
    setFormData((prev) => ({ ...prev, [criterionId]: value }));
  };

  const handleSubmit = async () => {
    console.log("Kết quả đã nhập:", formData);
    setIsModalOpen(false);
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
                onClick={() => handlePatientClick(patient)}
              >
                Nhập kết quả
              </button>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Nhập kết quả cho {selectedPatient.patientName}</h3>
            {evaluationCriteria.map((criterion) => (
              <div key={criterion.id} className={styles.criterion}>
                <label>{criterion.name}</label>
                <input
                  type="text"
                  value={formData[criterion.id]}
                  onChange={(e) =>
                    handleInputChange(criterion.id, e.target.value)
                  }
                />
              </div>
            ))}
            <button onClick={handleSubmit}>Lưu kết quả</button>
            <button onClick={() => setIsModalOpen(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreTestResult;