import React from "react";
import styles from "../pages/PatientResultsPage.module.css";

const PostInterventionSection = ({ results }) => {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Hậu can thiệp</h2>
        <div className={styles.sectionBadge}>Post-Intervention</div>
      </div>
      <div className={styles.cardGrid}>
        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <h3>Kết quả theo dõi</h3>
          </div>
          <div className={styles.cardContent}>
            {results.postInterventionUpdate ? (
              <div className={styles.resultInfo}>
                <div>
                  Đau bụng:{" "}
                  <strong>
                    {results.postInterventionUpdate.abdominalPain || ""}
                  </strong>
                </div>
                <div>
                  Ra máu:{" "}
                  <strong>
                    {results.postInterventionUpdate.bleeding || ""}
                  </strong>
                </div>
                <div>
                  Xét nghiệm β-hCG:{" "}
                </div>
                <div>
                  &nbsp;&nbsp;Ngày xét nghiệm:{" "}
                  <strong>
                    {results.postInterventionUpdate.testDate || ""}
                  </strong>
                </div>
                <div>
                  &nbsp;&nbsp;Kết quả:{" "}
                  <strong>
                    {results.postInterventionUpdate.betaHcgResult || ""}
                  </strong>
                </div>
                <div>
                  &nbsp;&nbsp;Đánh giá:{" "}
                  <strong>
                    {results.postInterventionUpdate.evaluationOutcome || ""}
                  </strong>
                </div>
                <div>
                  Đánh giá hiệu quả:{" "}
                  <strong>
                    {results.postInterventionUpdate.effectivenessEvaluation || ""}
                  </strong>
                </div>
                <div>
                  Trạng thái:{" "}
                  <strong>
                    {results.postInterventionUpdate.status || ""}
                  </strong>
                </div>
              </div>
            ) : (
              <div className={styles.noData}>Không có dữ liệu</div>
            )}
          </div>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <h3>Ghi chú theo dõi</h3>
          </div>
          <div className={styles.cardContent}>
            {results.postInterventionUpdate?.additionalNotes || (
              <div className={styles.noData}>Không có dữ liệu</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostInterventionSection;