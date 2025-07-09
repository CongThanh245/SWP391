import React, { useState, useEffect } from "react";
import { getAllPrescriptions } from "@api/patientResultApi";
import styles from "./PrescriptionsPage.module.css";

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedCards, setExpandedCards] = useState({});

  const treatmentTypes = {
    ovulationTrigger: {
      title: "Tiêm Kích Thích Rụng Trứng",
      color: "primary",
    },
    ovarianStimulation: {
      title: "Kích Thích Buồng Trứng",
      color: "success",
    },
    endometrialPreparation: {
      title: "Chuẩn Bị Nội Mạc Tử Cung",
      color: "warning",
    },
    embryoTransfer: {
      title: "Chuyển Phôi Thai",
      color: "info",
    },
  };

  useEffect(() => {
    const fetchPrescriptions = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const patientId = user?.patientId;

      if (!patientId) {
        setError("Patient ID not found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const data = await getAllPrescriptions(patientId);
        setPrescriptions(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load prescriptions");
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  const filteredPrescriptions = prescriptions.filter(
    (p) => activeTab === "all" || p.type === activeTab
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "Đang điều trị";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getDrugResponseText = (response) => {
    switch (response) {
      case "EFFECTIVE":
        return "ko oonr";
      case "INEFFECTIVE":
        return "Không hiệu quả";
      case "PARTIAL":
        return "Hiệu quả một phần";
      default:
        return response;
    }
  };

  const toggleCardExpansion = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Đang tải đơn thuốc...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Lỗi tải dữ liệu</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={styles.retryButton}
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h2>Chưa có đơn thuốc</h2>
        <p>
          Bạn chưa có đơn thuốc nào. Đơn thuốc sẽ xuất hiện tại đây khi bác sĩ
          kê đơn.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.prescriptionsContainer}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Đơn thuốc của tôi</h1>
      </div>

      {/* Filter Tabs */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${
            activeTab === "all" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          Tất cả ({prescriptions.length})
        </button>
        {Object.entries(treatmentTypes).map(([key, config]) => {
          const count = prescriptions.filter((p) => p.type === key).length;
          if (count === 0) return null;
          return (
            <button
              key={key}
              className={`${styles.tab} ${
                activeTab === key ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab(key)}
            >
              {config.title}
            </button>
          );
        })}
      </div>

      {/* Prescriptions Grid */}
      <div className={styles.prescriptionsGrid}>
        {filteredPrescriptions.map((prescription, index) => {
          const typeConfig = treatmentTypes[prescription.type];
          const isExpanded = expandedCards[index];
          return (
            <div
              key={index}
              className={`${styles.prescriptionCard} ${
                styles[typeConfig.color]
              }`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.treatmentInfo}>
                  <span className={styles.treatmentIcon}>
                    {typeConfig.icon}
                  </span>
                  <h3 className={styles.treatmentTitle}>
                    <strong style={{ paddingRight: "5px" }}>
                      Thuốc cho phác đồ:
                    </strong>{" "}
                    {typeConfig.title}
                  </h3>
                </div>
                <div className={styles.prescriptionMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Ngày kê đơn:</span>
                    <span className={styles.metaValue}>
                      {formatDate(prescription.prescription.dateIssued)}
                    </span>
                  </div>
                </div>
              </div>

              {prescription.prescription.notes && (
                <div className={styles.notesSection}>
                  <h4>Ghi chú</h4>
                  <p>{prescription.prescription.notes}</p>
                </div>
              )}

              <div className={styles.medicationsSection}>
                <div className={styles.medicationsHeader}>
                  <h4>
                    Danh sách thuốc ({prescription.prescription.items.length})
                  </h4>
                  <button
                    className={styles.toggleButton}
                    onClick={() => toggleCardExpansion(index)}
                  >
                    {isExpanded ? "Ẩn" : "Xem chi tiết"}
                  </button>
                </div>
                {isExpanded && (
                  <div className={styles.medicationsList}>
                    {prescription.prescription.items.map((item, itemIndex) => (
                      <div key={itemIndex} className={styles.medicationItem}>
                        <div className={styles.medicationHeader}>
                          <span className={styles.medicationName}>
                            {item.name}
                          </span>
                          <span className={styles.quantity}>
                            SL: {item.quantity}
                          </span>
                        </div>
                        <div className={styles.medicationDetails}>
                          <span>Liều: {item.dosage}</span>
                          <span>Tần suất: {item.frequency}</span>
                          <span>Thời gian: {item.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.footerInfo}>
        <h4>Lưu ý</h4>
        <ul>
          <li>Sử dụng thuốc đúng chỉ định</li>
          <li>Liên hệ bác sĩ nếu có tác dụng phụ</li>
          <li>Bảo quản thuốc đúng cách</li>
        </ul>
      </div>
    </div>
  );
};

export default PrescriptionsPage;
