import React from "react";
import styles from "../pages/PatientResultsPage.module.css";

const InterventionSection = ({ results }) => {
  const {
    preparationNotes,
    follicularMonitoring,
    intrauterineInsemination,
    oocyteRetrieval,
    spermProcessing,
    ovulationTrigger,
    ovarianStimulation,
    endometrialPreparation,
    embryoTransfer,
    interventionStageNotes,
  } = results;

  // Determine treatment type (IUI or IVF)
  const isIUI = preparationNotes?.suggestIUI;
  const isIVF = preparationNotes?.suggestIVF;

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Can thiệp</h2>
        <div className={styles.sectionBadge}>Intervention</div>
      </div>
      <div className={styles.cardGrid}>
        {/* Wife's Results */}
        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <h3>
              Kết quả của người vợ (
              {isIUI ? "IUI" : isIVF ? "IVF" : "Không xác định"})
            </h3>
          </div>
          <div className={styles.cardContent}>
            {/* Follicular Monitoring (Common for IUI and IVF) */}
            <div className={styles.monitoringList}>
              <h4>Siêu âm theo dõi nang noãn</h4>
              {follicularMonitoring?.length > 0 ? (
                follicularMonitoring.map((f) => (
                  <div key={f.id} className={styles.monitoringItem}>
                    <div>
                      <span>
                        Ngày xét nghiệm:{" "}
                        <strong style={{ paddingLeft: "5px" }}>
                          {" "}
                          {f.actionDate || "N/A"}
                        </strong>
                      </span>
                      <div className={styles.monitoringDetails}>
                        <span>
                          Số lượng nang:{" "}
                          <strong>{f.follicleCount || "N/A"}</strong>
                        </span>
                        <span>
                          Kích thước nang:{" "}
                          <strong>{f.follicleSize || "N/A"} mm</strong>
                        </span>
                        <span>
                          Độ dày nội mạc:{" "}
                          <strong>{f.endometrialThickness || "N/A"} mm</strong>
                        </span>
                        <span>
                          Trạng thái: <strong>{f.status || "N/A"}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noData}>Không có dữ liệu</div>
              )}
            </div>

            {/* IVF-specific sections */}
            {isIVF && (
              <>
                {/* Ovulation Trigger */}
                <div className={styles.monitoringList}>
                  <h4>Tiêm kích trứng</h4>
                  {ovulationTrigger ? (
                    <div className={styles.monitoringItem}>
                      <span>
                        Ngày xét nghiệm:{" "}
                        <strong style={{ paddingLeft: "5px" }}>
                          {ovulationTrigger.startDate || "N/A"}
                        </strong>
                      </span>
                      <div className={styles.monitoringDetails}>
                        <span>
                          Phản ứng thuốc:{" "}
                          <strong>
                            {ovulationTrigger.drugResponse || "N/A"}
                          </strong>
                        </span>
                        <span>
                          Trạng thái:{" "}
                          <strong>{ovulationTrigger.status || "N/A"}</strong>
                        </span>
                        {ovulationTrigger.prescription?.items?.length > 0 && (
                          <span>
                            Đơn thuốc:{" "}
                            <strong>
                              {ovulationTrigger.prescription.items
                                .map((item) => item.name)
                                .join(", ")}
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.noData}>Không có dữ liệu</div>
                  )}
                </div>

                {/* Endometrial Preparation */}
                <div className={styles.monitoringList}>
                  <h4>Chuẩn bị nội mạc tử cung</h4>
                  {endometrialPreparation ? (
                    <div className={styles.monitoringItem}>
                      <span>
                        Ngày xét nghiệm:{" "}
                        <strong style={{ paddingLeft: "5px" }}>
                          {endometrialPreparation.startDate || "N/A"}
                        </strong>
                      </span>
                      <div className={styles.monitoringDetails}>
                        <span>
                          Phản ứng thuốc:{" "}
                          <strong>
                            {endometrialPreparation.drugResponse || "N/A"}
                          </strong>
                        </span>
                        <span>
                          Trạng thái:{" "}
                          <strong>
                            {endometrialPreparation.status || "N/A"}
                          </strong>
                        </span>
                        {endometrialPreparation.prescription?.items?.length >
                          0 && (
                          <span>
                            Đơn thuốc:{" "}
                            <strong>
                              {endometrialPreparation.prescription.items
                                .map((item) => item.name)
                                .join(", ")}
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.noData}>Không có dữ liệu</div>
                  )}
                </div>

                {/* Oocyte Retrieval */}
                <div className={styles.monitoringList}>
                  <h4>Thủ thuật chọc hút trứng</h4>
                  {oocyteRetrieval ? (
                    <div className={styles.monitoringItem}>
                      <span>
                        Ngày xét nghiệm:{" "}
                        <strong style={{ paddingLeft: "5px" }}>
                          {oocyteRetrieval.actionDate || "N/A"}
                        </strong>
                      </span>
                      <div className={styles.monitoringDetails}>
                        <span>
                          Tổng số trứng:{" "}
                          <strong>
                            {oocyteRetrieval.totalOocytesRetrieved || "N/A"}
                          </strong>
                        </span>
                        <span>
                          Trứng trưởng thành:{" "}
                          <strong>
                            {oocyteRetrieval.matureOocytes || "N/A"}
                          </strong>
                        </span>
                        <span>
                          Trứng đông lạnh:{" "}
                          <strong>
                            {oocyteRetrieval.frozenOocytes || "N/A"}
                          </strong>
                        </span>
                        <span>
                          Trạng thái:{" "}
                          <strong>{oocyteRetrieval.status || "N/A"}</strong>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.noData}>Không có dữ liệu</div>
                  )}
                </div>

                {/* Embryo Transfer */}
                <div className={styles.monitoringList}>
                  <h4>Chuyển phôi</h4>
                  {embryoTransfer ? (
                    <div className={styles.monitoringItem}>
                      <span>
                        Ngày xét nghiệm:{" "}
                        <strong style={{ paddingLeft: "5px" }}>
                          {embryoTransfer.actionDate || "N/A"}
                        </strong>
                      </span>
                      <div className={styles.monitoringDetails}>
                        <span>
                          Phản ứng thuốc:{" "}
                          <strong>
                            {embryoTransfer.drugResponse || "N/A"}
                          </strong>
                        </span>
                        <span>
                          Trạng thái:{" "}
                          <strong>{embryoTransfer.status || "N/A"}</strong>
                        </span>
                        {embryoTransfer.prescription?.items?.length > 0 && (
                          <span>
                            Đơn thuốc:{" "}
                            <strong>
                              {embryoTransfer.prescription.items
                                .map((item) => item.name)
                                .join(", ")}
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.noData}>Không có dữ liệu</div>
                  )}
                </div>
              </>
            )}

            {/* IUI-specific sections */}
            {isIUI && (
              <>
                {/* Ovarian Stimulation */}
                <div className={styles.monitoringList}>
                  <h4>Phác đồ kích thích buồng trứng</h4>
                  {ovarianStimulation ? (
                    <div className={styles.monitoringItem}>
                      <span>
                        Ngày xét nghiệm:{" "}
                        <strong style={{ paddingLeft: "5px" }}>
                          {ovarianStimulation.startDate || "N/A"}
                        </strong>
                      </span>
                      <div className={styles.monitoringDetails}>
                        <span>
                          Phản ứng thuốc:{" "}
                          <strong>
                            {ovarianStimulation.drugResponse || "N/A"}
                          </strong>
                        </span>
                        <span>
                          Trạng thái:{" "}
                          <strong>{ovarianStimulation.status || "N/A"}</strong>
                        </span>
                        {ovarianStimulation.prescription?.items?.length > 0 && (
                          <span>
                            Đơn thuốc:{" "}
                            <strong>
                              {ovarianStimulation.prescription.items
                                .map((item) => item.name)
                                .join(", ")}
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.noData}>Không có dữ liệu</div>
                  )}
                </div>

                {/* Intrauterine Insemination */}
                <div className={styles.monitoringList}>
                  <h4>Thụ tinh trong tử cung (IUI)</h4>
                  {intrauterineInsemination ? (
                    <div className={styles.monitoringItem}>
                      <span>
                        Ngày xét nghiệm:{" "}
                        <strong style={{ paddingLeft: "5px" }}>
                          {intrauterineInsemination.actionDate || "N/A"}
                        </strong>
                      </span>
                      <div className={styles.monitoringDetails}>
                        <span>
                          Trạng thái:{" "}
                          <strong>
                            {intrauterineInsemination.status || "N/A"}
                          </strong>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.noData}>Không có dữ liệu</div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Husband's Results and Intervention Notes */}
        <div className={styles.topRow}>
          {/* Husband's Results */}
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h3>Kết quả của người chồng</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.monitoringList}>
                <h4>Xử lý tinh trùng</h4>
                {spermProcessing ? (
                  <div className={styles.monitoringItem}>
                    <span>
                      Ngày xét nghiệm:
                      <strong style={{ paddingLeft: "5px" }}>
                        {" "}
                        {spermProcessing.collectionDate || "N/A"}
                      </strong>
                    </span>
                    <div className={styles.monitoringDetails}>
                      <span>
                        Phương pháp:{" "}
                        <strong>
                          {spermProcessing.processingMethod || "N/A"}
                        </strong>
                      </span>
                      <span>
                        Nồng độ tinh trùng:{" "}
                        <strong>{spermProcessing.spermDensity || "N/A"}</strong>
                      </span>
                      <span>
                        Độ di động:{" "}
                        <strong>
                          {spermProcessing.motilityLevel || "N/A"}
                        </strong>
                      </span>
                      <span>
                        Đánh giá:{" "}
                        <strong>{spermProcessing.evaluation || "N/A"}</strong>
                      </span>
                      <span>
                        Trạng thái:{" "}
                        <strong>{spermProcessing.status || "N/A"}</strong>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.noData}>Không có dữ liệu</div>
                )}
              </div>
            </div>
          </div>

          {/* Intervention Notes */}
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h3>Ghi chú giai đoạn can thiệp</h3>
            </div>
            <div className={styles.cardContent}>
              {interventionStageNotes?.notes ? (
                <div>{interventionStageNotes.notes}</div>
              ) : (
                <div className={styles.noData}>Không có dữ liệu</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterventionSection;
