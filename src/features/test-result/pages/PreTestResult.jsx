import React, { useState } from "react";
import { FileText, Upload } from "lucide-react";
import styles from "./PreTestResult.module.css";

const PreTestResult = () => {
  const [patientId, setPatientId] = useState("");
  const [testType, setTestType] = useState("");
  const [results, setResults] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting test results:", { patientId, testType, results });
  };  

  return (
    <div className={styles.testResultsPage}>
      <div className={styles.pageHeader}>
        <h2>Nhập Kết quả Xét nghiệm</h2>
        <p>Nhập và cập nhật kết quả xét nghiệm cho bệnh nhân</p>
      </div>

      <form className={styles.testForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Mã bệnh nhân:</label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Nhập mã bệnh nhân"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Loại xét nghiệm:</label>
          <select value={testType} onChange={(e) => setTestType(e.target.value)}>
            <option value="">Chọn loại xét nghiệm</option>
            <option value="blood">Xét nghiệm máu</option>
            <option value="urine">Xét nghiệm nước tiểu</option>
            <option value="hormone">Xét nghiệm hormone</option>
          </select>
        </div>

        <div className={styles.uploadArea}>
          <Upload size={32} />
          <p>Kéo thả file hoặc click để tải lên kết quả xét nghiệm</p>
        </div>

        <div className={styles.formGroup}>
          <label>Kết quả:</label>
          <textarea
            value={results}
            onChange={(e) => setResults(e.target.value)}
            placeholder="Nhập kết quả xét nghiệm"
            rows={6}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          <FileText size={16} />
          Lưu kết quả
        </button>
      </form>
    </div>
  );
};

export default PreTestResult;