import React, { useState } from "react";
import {
  Pill,
  Clock,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Info,
  Phone,
  Mail,
  Download,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f9f6f6 0%, #EAE4E1 100%)",
    fontFamily: "'Montserrat', sans-serif",
  },

  header: {
    background: "linear-gradient(135deg, #61474C 0%, #9e8e7b 100%)",
    color: "#ffffff",
    padding: "3rem 0",
    marginBottom: "2rem",
    position: "relative",
    overflow: "hidden",
  },

  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 50%)",
    pointerEvents: "none",
  },

  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
    position: "relative",
    zIndex: 2,
  },

  headerProfile: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    marginBottom: "2rem",
  },

  avatarContainer: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "3px solid rgba(255,255,255,0.3)",
    backdropFilter: "blur(10px)",
  },

  headerTitle: {
    margin: 0,
    fontSize: "2.5rem",
    fontWeight: "700",
    letterSpacing: "-0.02em",
    color: "#ffffff",
  },

  headerSubtitle: {
    margin: "0.5rem 0 0 0",
    opacity: 0.9,
    fontSize: "1.1rem",
    fontWeight: "400",
    color: "#ffffff",
  },

  headerStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
    marginTop: "2rem",
  },

  headerStatCard: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: "16px",
    padding: "1.5rem",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.2)",
    transition: "all 0.3s ease",
  },

  mainContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
  },

  quickStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem",
  },

  statCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "2rem",
    boxShadow: "0 10px 40px rgba(51, 51, 51, 0.15)",
    border: "1px solid rgba(158, 142, 123, 0.2)",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
  },

  statCardBg: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    opacity: 0.1,
    transform: "translate(30px, -30px)",
  },

  statNumber: {
    fontSize: "3rem",
    fontWeight: "800",
    marginBottom: "0.5rem",
    position: "relative",
    zIndex: 2,
  },

  statLabel: {
    color: "#4A2C2A",
    fontSize: "1rem",
    fontWeight: "500",
    position: "relative",
    zIndex: 2,
  },

  searchSection: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "2rem",
    boxShadow: "0 10px 40px rgba(51, 51, 51, 0.15)",
    marginBottom: "3rem",
    border: "1px solid rgba(158, 142, 123, 0.2)",
  },

  searchContainer: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
    flexWrap: "wrap",
  },

  searchInputWrapper: {
    position: "relative",
    flex: "1",
    minWidth: "300px",
  },

  searchInput: {
    width: "100%",
    padding: "16px 16px 16px 50px",
    border: "2px solid rgba(158, 142, 123, 0.2)",
    borderRadius: "16px",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    background: "#f9f6f6",
  },

  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#4A2C2A",
  },

  filterSelect: {
    padding: "16px 20px",
    border: "2px solid rgba(158, 142, 123, 0.2)",
    borderRadius: "16px",
    fontSize: "1rem",
    background: "#ffffff",
    outline: "none",
    cursor: "pointer",
    minWidth: "180px",
  },

  prescriptionCard: {
    background: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 15px 50px rgba(97, 71, 76, 0.25)",
    border: "1px solid rgba(158, 142, 123, 0.2)",
    overflow: "hidden",
    marginBottom: "2rem",
    transition: "all 0.3s ease",
  },

  prescriptionHeader: {
    padding: "2.5rem",
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, #EAE4E1 100%)",
    borderBottom: "1px solid rgba(158, 142, 123, 0.2)",
    position: "relative",
  },

  prescriptionHeaderContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.5rem",
  },

  prescriptionTitle: {
    margin: "0 0 0.75rem 0",
    color: "#61474C",
    fontSize: "1.5rem",
    fontWeight: "700",
  },

  prescriptionMeta: {
    margin: "0 0 0.5rem 0",
    color: "#4A2C2A",
    fontSize: "0.95rem",
  },

  prescriptionDiagnosis: {
    margin: 0,
    color: "#333333",
    fontWeight: "600",
    fontSize: "1.1rem",
  },

  statusBadge: {
    padding: "0.75rem 1.5rem",
    borderRadius: "50px",
    fontSize: "0.9rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#ffffff",
  },

  instructionBox: {
    background: "rgba(97, 71, 76, 0.1)",
    padding: "1.5rem",
    borderRadius: "16px",
    borderLeft: "5px solid #61474C",
    marginTop: "1rem",
  },

  instructionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "0.75rem",
  },

  instructionTitle: {
    color: "#61474C",
    fontWeight: "600",
    fontSize: "1rem",
  },

  instructionText: {
    margin: 0,
    color: "#333333",
    lineHeight: "1.6",
  },

  medicationSection: {
    padding: "2.5rem",
  },

  medicationHeader: {
    margin: "0 0 2rem 0",
    color: "#61474C",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "1.3rem",
    fontWeight: "600",
  },

  medicationGrid: {
    display: "grid",
    gap: "1.5rem",
  },

  medicationCard: {
    border: "2px solid rgba(158, 142, 123, 0.2)",
    borderRadius: "20px",
    padding: "2rem",
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, #EAE4E1 100%)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },

  medicationCardActive: {
    borderColor: "#61474C",
    boxShadow: "0 10px 30px rgba(97, 71, 76, 0.25)",
    transform: "translateY(-4px)",
  },

  medicationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.5rem",
  },

  medicationInfo: {
    flex: 1,
  },

  medicationName: {
    margin: "0 0 0.5rem 0",
    color: "#61474C",
    fontSize: "1.4rem",
    fontWeight: "700",
  },

  medicationGeneric: {
    margin: "0 0 1rem 0",
    color: "#4A2C2A",
    fontStyle: "italic",
  },

  medicationDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "1rem",
    marginTop: "1.5rem",
  },

  medicationDetailItem: {
    padding: "1rem",
    background: "rgba(97, 71, 76, 0.05)",
    borderRadius: "12px",
    borderLeft: "4px solid #61474C",
  },

  medicationDetailLabel: {
    color: "#61474C",
    fontWeight: "600",
    fontSize: "0.9rem",
    marginBottom: "0.5rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  medicationDetailValue: {
    margin: 0,
    color: "#333333",
    fontSize: "1rem",
    fontWeight: "500",
  },

  medicationStatus: {
    textAlign: "right",
    marginLeft: "1.5rem",
  },

  medicationStatusBadge: {
    padding: "0.75rem 1.25rem",
    borderRadius: "50px",
    fontSize: "0.85rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    whiteSpace: "nowrap",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#ffffff",
  },

  medicationQuantity: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#4A2C2A",
  },

  expandedDetails: {
    borderTop: "2px solid rgba(158, 142, 123, 0.2)",
    paddingTop: "2rem",
    marginTop: "2rem",
  },

  detailSection: {
    marginBottom: "1.5rem",
  },

  detailLabel: {
    color: "#61474C",
    fontWeight: "600",
    fontSize: "1rem",
    marginBottom: "0.75rem",
  },

  detailBox: {
    margin: "0.75rem 0",
    padding: "1.5rem",
    borderRadius: "16px",
    lineHeight: "1.6",
  },

  instructionsBox: {
    background: "rgba(97, 71, 76, 0.1)",
    color: "#333333",
    borderLeft: "5px solid #61474C",
  },

  warningsBox: {
    background: "rgba(255, 152, 0, 0.1)",
    color: "#333333",
    borderLeft: "5px solid #ff9800",
  },

  sideEffectsBox: {
    background: "rgba(125, 141, 161, 0.1)",
    color: "#333333",
    borderLeft: "5px solid #7d8da1",
  },

  toggleDetailsButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    color: "#61474C",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    background: "transparent",
    transition: "all 0.3s ease",
  },

  prescriptionFooter: {
    padding: "1.5rem 2.5rem",
    background: "linear-gradient(135deg, #EAE4E1 0%, #f9f6f6 100%)",
    borderTop: "1px solid rgba(158, 142, 123, 0.2)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },

  footerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    fontSize: "0.9rem",
    color: "#4A2C2A",
  },
};

const MedicineViewPage = () => {
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const patientInfo = {
    name: "Nguyễn Thị Lan Anh",
    age: 32,
    phone: "0912 345 678",
    email: "lananh@email.com",
    patientId: "BN001234",
  };

  const prescriptions = [
    {
      id: 1,
      date: "2024-06-15",
      doctor: "BS. Nguyễn Văn A",
      diagnosis: "Điều trị kích thích buồng trứng",
      status: "active",
      validUntil: "2024-07-15",
      instructions: "Uống thuốc đúng giờ, tránh quên liều",
      medications: [
        {
          id: 1,
          name: "Gonal-F 300UI",
          genericName: "Follitropin alfa",
          dosage: "150UI",
          frequency: "1 lần/ngày",
          timing: "Tối (8:00 PM)",
          duration: "10 ngày",
          quantity: "10 lọ",
          instructions: "Tiêm dưới da vùng bụng, luân phiên vị trí",
          warnings: "Bảo quản trong tủ lạnh 2-8°C",
          sideEffects: "Có thể gây đau nhẹ tại vị trí tiêm",
          status: "taking",
        },
        {
          id: 2,
          name: "Cetrotide 0.25mg",
          genericName: "Cetrorelix",
          dosage: "0.25mg",
          frequency: "1 lần/ngày",
          timing: "Sáng (7:00 AM)",
          duration: "5 ngày",
          quantity: "5 lọ",
          instructions:
            "Tiêm dưới da, bắt đầu từ ngày thứ 6 của chu kỳ kích thích",
          warnings: "Không dùng cho phụ nữ có thai",
          sideEffects: "Có thể gây buồn nôn nhẹ",
          status: "waiting",
        },
        {
          id: 3,
          name: "Folic Acid 5mg",
          genericName: "Acid folic",
          dosage: "5mg",
          frequency: "1 lần/ngày",
          timing: "Sáng (sau ăn)",
          duration: "30 ngày",
          quantity: "30 viên",
          instructions: "Uống với nước, sau bữa ăn sáng",
          warnings: "Không uống chung với trà, cà phê",
          sideEffects: "Hiếm khi gây khó tiêu",
          status: "taking",
        },
      ],
    },
    {
      id: 2,
      date: "2024-05-20",
      doctor: "BS. Nguyễn Văn A",
      diagnosis: "Chuẩn bị nội mạc tử cung",
      status: "completed",
      validUntil: "2024-06-20",
      instructions: "Hoàn thành đủ liều theo chỉ định",
      medications: [
        {
          id: 4,
          name: "Estradiol 2mg",
          genericName: "Estradiol valerate",
          dosage: "2mg",
          frequency: "2 lần/ngày",
          timing: "Sáng & Tối",
          duration: "21 ngày",
          quantity: "42 viên",
          instructions: "Uống đều đặn cùng giờ mỗi ngày",
          warnings: "Tránh hút thuốc khi dùng thuốc",
          sideEffects: "Có thể gây căng ngực, đau đầu nhẹ",
          status: "completed",
        },
        {
          id: 5,
          name: "Progesterone 200mg",
          genericName: "Progesterone",
          dosage: "200mg",
          frequency: "2 lần/ngày",
          timing: "Sáng & Tối",
          duration: "14 ngày",
          quantity: "28 viên",
          instructions: "Đặt âm đạo, nằm nghỉ 30 phút sau khi dùng",
          warnings: "Không dùng khi có xuất huyết âm đạo bất thường",
          sideEffects: "Có thể gây buồn ngủ",
          status: "completed",
        },
      ],
    },
    {
      id: 3,
      date: "2024-07-01",
      doctor: "BS. Nguyễn Văn A",
      diagnosis: "Hỗ trợ giai đoạn hoàng thể",
      status: "pending",
      validUntil: "2024-08-01",
      instructions: "Chờ kết quả xét nghiệm trước khi bắt đầu",
      medications: [
        {
          id: 6,
          name: "Duphaston 10mg",
          genericName: "Dydrogesterone",
          dosage: "10mg",
          frequency: "2 lần/ngày",
          timing: "Sáng & Tối (sau ăn)",
          duration: "14 ngày",
          quantity: "28 viên",
          instructions: "Uống sau bữa ăn, không nhai",
          warnings: "Thông báo bác sĩ nếu có xuất huyết bất thường",
          sideEffects: "Có thể gây buồn nôn, chóng mặt",
          status: "pending",
        },
      ],
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#4caf50";
      case "completed":
        return "#61474C";
      case "pending":
        return "#ff9800";
      case "expired":
        return "#f44336";
      default:
        return "#61474C";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang sử dụng";
      case "completed":
        return "Đã hoàn thành";
      case "pending":
        return "Chờ thực hiện";
      case "expired":
        return "Đã hết hạn";
      default:
        return "Không xác định";
    }
  };

  const getMedicationStatusColor = (status) => {
    switch (status) {
      case "taking":
        return "#4caf50";
      case "completed":
        return "#61474C";
      case "waiting":
        return "#ff9800";
      case "pending":
        return "#4d3c2d";
      default:
        return "#61474C";
    }
  };

  const getMedicationStatusText = (status) => {
    switch (status) {
      case "taking":
        return "Đang uống";
      case "completed":
        return "Đã hoàn thành";
      case "waiting":
        return "Chờ bắt đầu";
      case "pending":
        return "Chờ xác nhận";
      default:
        return "Không xác định";
    }
  };

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.medications.some(
        (med) =>
          med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.genericName.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || prescription.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerOverlay}></div>
        <div style={styles.headerContent}>
          <div style={styles.headerProfile}>
            <div style={styles.avatarContainer}>
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 style={styles.headerTitle}>Đơn Thuốc Của Tôi</h1>
              <p style={styles.headerSubtitle}>
                {patientInfo.name} • Mã BN: {patientInfo.patientId}
              </p>
            </div>
          </div>

          <div style={styles.headerStats}>
            <div style={styles.headerStatCard}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Phone className="w-5 h-5" />
                <span style={{ fontSize: "1rem", color: "#ffffff" }}>
                  {patientInfo.phone}
                </span>
              </div>
            </div>
            <div style={styles.headerStatCard}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Mail className="w-5 h-5" />
                <span style={{ fontSize: "1rem", color: "#ffffff" }}>
                  {patientInfo.email}
                </span>
              </div>
            </div>
            <div style={styles.headerStatCard}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Calendar className="w-5 h-5" />
                <span style={{ fontSize: "1rem", color: "#ffffff" }}>
                  Tuổi: {patientInfo.age}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.quickStats}>
          <div
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow =
                "0 20px 60px rgba(51, 51, 51, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 40px rgba(51, 51, 51, 0.15)";
            }}
          >
            <div style={{ ...styles.statCardBg, background: "#4caf50" }}></div>
            <div style={{ ...styles.statNumber, color: "#4caf50" }}>
              {prescriptions.filter((p) => p.status === "active").length}
            </div>
            <div style={styles.statLabel}>Đơn thuốc đang dùng</div>
          </div>

          <div
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow =
                "0 20px 60px rgba(51, 51, 51, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 40px rgba(51, 51, 51, 0.15)";
            }}
          >
            <div style={{ ...styles.statCardBg, background: "#61474C" }}></div>
            <div style={{ ...styles.statNumber, color: "#61474C" }}>
              {prescriptions.reduce(
                (total, p) => total + p.medications.length,
                0
              )}
            </div>
            <div style={styles.statLabel}>Tổng số loại thuốc</div>
          </div>
  
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} style={styles.prescriptionCard}>
              <div style={styles.prescriptionHeader}>
                <div style={styles.prescriptionHeaderContent}>
                  <div>
                    <h2 style={styles.prescriptionTitle}>
                      Đơn thuốc ngày {prescription.date}
                    </h2>
                    <p style={styles.prescriptionMeta}>
                      Bác sĩ: {prescription.doctor}
                    </p>
                    <p style={styles.prescriptionDiagnosis}>
                      Chẩn đoán: {prescription.diagnosis}
                    </p>
                  </div>
                  <div
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(prescription.status),
                    }}
                  >
                    {getStatusText(prescription.status)}
                  </div>
                </div>
                {prescription.instructions && (
                  <div style={styles.instructionBox}>
                    <div style={styles.instructionHeader}>
                      <Info className="w-5 h-5" style={{ color: "#61474C" }} />
                      <h3 style={styles.instructionTitle}>Hướng dẫn chung</h3>
                    </div>
                    <p style={styles.instructionText}>
                      {prescription.instructions}
                    </p>
                  </div>
                )}
              </div>

              <div style={styles.medicationSection}>
                <h3 style={styles.medicationHeader}>
                  <Pill className="w-5 h-5" />
                  Danh sách thuốc
                </h3>
                <div style={styles.medicationGrid}>
                  {prescription.medications.map((medication) => (
                    <div
                      key={medication.id}
                      style={{
                        ...styles.medicationCard,
                        ...(selectedMedication === medication.id &&
                          styles.medicationCardActive),
                      }}
                    >
                      <div style={styles.medicationHeader}>
                        <div style={styles.medicationInfo}>
                          <h4 style={styles.medicationName}>
                            {medication.name}
                          </h4>
                          <p style={styles.medicationGeneric}>
                            {medication.genericName}
                          </p>
                        </div>
                        <div style={styles.medicationStatus}>
                          <div
                            style={{
                              ...styles.medicationStatusBadge,
                              backgroundColor: getMedicationStatusColor(
                                medication.status
                              ),
                            }}
                          >
                            {getMedicationStatusText(medication.status)}
                          </div>
                          <p style={styles.medicationQuantity}>
                            Số lượng: {medication.quantity}
                          </p>
                        </div>
                      </div>
                      <div style={styles.medicationDetails}>
                        <div style={styles.medicationDetailItem}>
                          <p style={styles.medicationDetailLabel}>Liều lượng</p>
                          <p style={styles.medicationDetailValue}>
                            {medication.dosage}
                          </p>
                        </div>
                        <div style={styles.medicationDetailItem}>
                          <p style={styles.medicationDetailLabel}>Tần suất</p>
                          <p style={styles.medicationDetailValue}>
                            {medication.frequency}
                          </p>
                        </div>
                        <div style={styles.medicationDetailItem}>
                          <p style={styles.medicationDetailLabel}>Thời gian</p>
                          <p style={styles.medicationDetailValue}>
                            {medication.timing}
                          </p>
                        </div>
                        <div style={styles.medicationDetailItem}>
                          <p style={styles.medicationDetailLabel}>Thời hạn</p>
                          <p style={styles.medicationDetailValue}>
                            {medication.duration}
                          </p>
                        </div>
                      </div>
                      <button
                        style={styles.toggleDetailsButton}
                        onClick={() =>
                          setSelectedMedication(
                            selectedMedication === medication.id
                              ? null
                              : medication.id
                          )
                        }
                      >
                        {selectedMedication === medication.id
                          ? "Ẩn chi tiết"
                          : "Xem chi tiết"}
                        {selectedMedication === medication.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      {selectedMedication === medication.id && (
                        <div style={styles.expandedDetails}>
                          <div style={styles.detailSection}>
                            <h4 style={styles.detailLabel}>
                              Hướng dẫn sử dụng
                            </h4>
                            <div
                              style={{
                                ...styles.detailBox,
                                ...styles.instructionsBox,
                              }}
                            >
                              {medication.instructions}
                            </div>
                          </div>
                          <div style={styles.detailSection}>
                            <h4 style={styles.detailLabel}>Cảnh báo</h4>
                            <div
                              style={{
                                ...styles.detailBox,
                                ...styles.warningsBox,
                              }}
                            >
                              {medication.warnings}
                            </div>
                          </div>
                          <div style={styles.detailSection}>
                            <h4 style={styles.detailLabel}>Tác dụng phụ</h4>
                            <div
                              style={{
                                ...styles.detailBox,
                                ...styles.sideEffectsBox,
                              }}
                            >
                              {medication.sideEffects}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.prescriptionFooter}>
                <div style={styles.footerInfo}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Calendar className="w-4 h-4" />
                    Hạn sử dụng: {prescription.validUntil}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <User className="w-4 h-4" />
                    Bác sĩ: {prescription.doctor}
                  </div>
                </div>
                <button
                  style={{
                    padding: "0.75rem 1.5rem",
                    background:
                      "linear-gradient(135deg, #61474C 0%, #9e8e7b 100%)",
                    color: "#fbf9f6",
                    borderRadius: "12px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Download className="w-4 h-4" />
                  Tải đơn thuốc
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicineViewPage;
