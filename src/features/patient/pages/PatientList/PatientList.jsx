import React, { useState, useEffect } from "react";
import { Search, User, Phone, Calendar } from "lucide-react";
import { getPatients, getPatientDetails } from "@api/patientApi";
import PatientDetailsModal from "@features/patient/components/PatientDetailsModal/PatientDetailsModal";
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

      <PatientDetailsModal
        patient={selectedPatient}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PatientList;