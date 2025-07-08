import React, { useState, useEffect } from "react";
import { getAllPatientResults } from "@api/patientResultApi";
import { downloadFile } from "@api/fileApi";
import styles from "./PatientResultsPage.module.css";
import PreInterventionSection from "@features/test-result/components/PreInterventionSection";
import InterventionSection from "@features/test-result/components/InterventionSection";
import PostInterventionSection from "@features/test-result/components/PostInterventionSection";

const PatientResultsPage = () => {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const patientId = user.patientId;

      if (!patientId) {
        setError("Không tìm thấy ID bệnh nhân trong localStorage");
        setLoading(false);
        return;
      }

      try {
        const data = await getAllPatientResults(patientId);
        setResults(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Không thể tải kết quả bệnh nhân");
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const handleDownload = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const patientId = user?.patientId;

      if (!patientId) {
        throw new Error("Không tìm thấy ID bệnh nhân trong localStorage");
      }

      const fileData = await downloadFile(patientId);
      const url = window.URL.createObjectURL(
        new Blob([fileData], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ket-qua-benh-nhan-${patientId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log("Tải file thành công!");
    } catch (error) {
      console.error("Tải file thất bại:", error.message);
      alert(
        `Không thể tải kết quả: ${error.message || "Vui lòng thử lại sau."}`
      );
    }
  };

  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải kết quả...</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
      </div>
    );

  if (!results)
    return (
      <div className={styles.noData}>
        <p>Không có dữ liệu kết quả</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Kết Quả Khám Bệnh</h1>
        <div className={styles.subtitle}>Tải về tại đây để xem chi tiết quá trình điều trị</div>
        <button className={styles.downloadButton} onClick={handleDownload}>
         Xem chi tiết kết quả
        </button>
      </div>

      <div className={styles.timeline}>
        <div className={styles.timelineItem}>
          <span>Khám chuyên khoa</span>
        </div>
        <div className={styles.timelineLine}></div>
        <div className={styles.timelineItem}>
          <span>Can thiệp</span>
        </div>
        <div className={styles.timelineLine}></div>
        <div className={styles.timelineItem}>
          <span>Hậu can thiệp</span>
        </div>
      </div>

      <PreInterventionSection results={results.preIntervention} />
      <InterventionSection
        results={{
          ...results.intervention,
          preparationNotes: results.preIntervention.preparationNotes,
        }}
      />
      <PostInterventionSection results={results.postIntervention} />
    </div>
  );
};

export default PatientResultsPage;
