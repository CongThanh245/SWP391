import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Phone,
  Calendar,
  X,
  Activity,
  FileText,
  Edit3,
} from "lucide-react";
import {
  getPatients,
  getEvaluationCriteria,
  updateEvaluationCriteria,
} from "@api/patientApi";
import styles from "./PreTestResult.module.css";
import { Link } from "react-router-dom";

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
          acc[criterion.id] = {
            currentValue: criterion.currentValue || "",
            note: criterion.note || "",
          };
          return acc;
        }, {})
      );
      setIsModalOpen(true);
    } catch (err) {
      setError("Bệnh nhân chưa tới ngày khám");
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    const appointmentId = patient.latestAppointmentId;
    fetchEvaluationCriteria(appointmentId, patient.id);
  };

  const handleInputChange = (criterionId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [criterionId]: { ...prev[criterionId], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    try {
      const updateData = Object.entries(formData).map(
        ([criteriaId, { currentValue, note }]) => ({
          criteriaId,
          currentValue: currentValue || "",
          note,
        })
      );

      await updateEvaluationCriteria(updateData);
      setIsModalOpen(false);
      await fetchPatients();
    } catch (err) {
      setError("Không thể cập nhật tiêu chí đánh giá");
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
  if (error)
    return (
      <div>
        <Link
          to="/receptionist-dashboard/test-results"
          className={styles.backLink}
        > Quay lại </Link>
        <div className={styles.error}>{error}</div>
      </div>
    );

  return (
    <div className={styles.patientListPage}>
      <div className={styles.pageHeader}>
        <h2>Nhập kết quả xét nghiệm</h2>
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
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <div className={styles.titleContent}>
                  <div>
                    <h3>Kết quả xét nghiệm - {selectedPatient?.patientName}</h3>
                    <p>ID: {selectedPatient?.patientId}</p>
                  </div>
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
              <div className={styles.testResultsContainer}>
                <div className={styles.tableHeader}>
                  <div className={styles.headerCell}>
                    <span>Tên xét nghiệm</span>
                  </div>
                  <div className={styles.headerCell}>
                    <span>Kết quả</span>
                  </div>
                  <div className={styles.headerCell}>
                    <span>Đơn vị</span>
                  </div>
                  <div className={styles.headerCell}>
                    <span>Mô tả</span>
                  </div>

                  <div className={styles.headerCell}>
                    <Edit3 size={16} />
                    <span>Ghi chú</span>
                  </div>
                </div>

                <div className={styles.testResultsList}>
                  {evaluationCriteria.map((criterion, index) => (
                    <div key={criterion.id} className={styles.testResultRow}>
                      <div className={styles.testCell}>
                        <div className={styles.testName}>
                          <span>{criterion.name}</span>
                        </div>
                      </div>

                      <div className={styles.testCell}>
                        <input
                          type="text"
                          className={styles.resultInput}
                          value={formData[criterion.id]?.currentValue || ""}
                          onChange={(e) =>
                            handleInputChange(
                              criterion.id,
                              "currentValue",
                              e.target.value
                            )
                          }
                          placeholder="Nhập kết quả"
                        />
                      </div>

                      <div className={styles.testCell}>
                        <span className={styles.unit}>
                          {criterion.measurementUnit || "N/A"}
                        </span>
                      </div>

                      <div className={styles.testCell}>
                        <span className={styles.description}>
                          {criterion.description || "Chưa có mô tả"}
                        </span>
                      </div>

                      <div className={styles.testCell}>
                        <input
                          type="text"
                          className={styles.noteInput}
                          value={formData[criterion.id]?.note || ""}
                          onChange={(e) =>
                            handleInputChange(
                              criterion.id,
                              "note",
                              e.target.value
                            )
                          }
                          placeholder="Ghi chú thêm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.footerActions}>
                <button className={styles.saveButton} onClick={handleSubmit}>
                  <Activity size={12} />
                  Lưu kết quả
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreTestResult;
