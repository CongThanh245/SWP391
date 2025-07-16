import React from "react";
import styles from "../pages/PatientResultsPage.module.css";

const PreInterventionSection = ({ results }) => {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Khám chuyên khoa</h2>
        <div className={styles.sectionBadge}>Pre-Intervention</div>
      </div>
      <div className={styles.cardGrid}>
        <div className={styles.topRow}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h3>Chỉ số sinh hiệu</h3>
            </div>
            <div className={styles.cardContent}>
              {results.vitalSigns.wife || results.vitalSigns.husband ? (
                <table className={styles.vitalSignsTable}>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Cao</th>
                      <th>Nặng</th>
                      <th>BMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.vitalSigns.wife && (
                      <tr>
                        <td>Vợ</td>
                        <td>{results.vitalSigns.wife.wifeHeight} cm</td>
                        <td>{results.vitalSigns.wife.wifeWeight} kg</td>
                        <td>{results.vitalSigns.wife.wifeBmi}</td>
                      </tr>
                    )}
                    {results.vitalSigns.husband && (
                      <tr>
                        <td>Chồng</td>
                        <td>{results.vitalSigns.husband.husbandHeight} cm</td>
                        <td>{results.vitalSigns.husband.husbandWeight} kg</td>
                        <td>{results.vitalSigns.husband.husbandBmi}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <div className={styles.noData}>Không có dữ liệu</div>
              )}
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h3>Ghi chú chuẩn bị</h3>
            </div>
            <div className={styles.cardContent}>
              {results.preparationNotes.preparationNotes || (
                <div className={styles.noData}>Không có dữ liệu</div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <h3>Quy trình điều trị</h3>
          </div>
          <div className={styles.cardContent}>
            {Array.isArray(results.protocol) && results.protocol.length > 0 ? (
              <table className={styles.protocolsTable}>
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Kết quả</th>
                    <th>Mô tả</th>
                    <th>Ngày xét nghiệm</th>
                  </tr>
                </thead>
                <tbody>
                  {results.protocol.map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.protocolName}</td>
                      <td>{p.note || "N/A" }</td>
                      <td>{p.description}</td>
                      <td>{p.evaluationDate }</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.noData}>Không có dữ liệu</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreInterventionSection;