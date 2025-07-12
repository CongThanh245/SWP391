import apiClient from "./axiosConfig";

// Hàm lấy toàn bộ kết quả bệnh nhân và chia theo giai đoạn
export const getAllPatientResults = async (patientId) => {
  try {
    // Gọi 5 API song song để tối ưu hiệu suất
    const [
      medicalRecordResponse,
      ovulationTriggerResponse,
      ovarianStimulationResponse,
      endometrialPreparationResponse,
      embryoTransferResponse,
    ] = await Promise.all([
      apiClient.get(`/patients/treatment-profile/medical-record`, {
        params: { patientId },
      }),
      apiClient.get(
        `/patients/treatment-profile/intervention/ovulation-trigger-injection`,
        {
          params: { patientId },
        }
      ),
      apiClient.get(
        `/patients/treatment-profile/intervention/ovarian-stimulation-process`,
        {
          params: { patientId },
        }
      ),
      apiClient.get(
        `/patients/treatment-profile/intervention/endometrial-preparation`,
        {
          params: { patientId },
        }
      ),
      apiClient.get(
        `/patients/treatment-profile/intervention/embryo-transfer`,
        {
          params: { patientId },
        }
      ),
    ]);

    // Tổ chức dữ liệu theo 3 giai đoạn
    const results = {
      preIntervention: {
        // Giai đoạn Khám chuyên khoa
        vitalSigns: {
          wife: medicalRecordResponse.data.wifeVitalSignsResponse,
          husband: medicalRecordResponse.data.husbandVitalSignsResponse,
        },
        preparationNotes: medicalRecordResponse.data.preparationNotesResponse,
        protocol: medicalRecordResponse.data.protocolResponseSet,
      },
      intervention: {
        // Giai đoạn Can thiệp
        follicularMonitoring:
          medicalRecordResponse.data.follicularMonitoringUltrasoundResponseList,
        intrauterineInsemination:
          medicalRecordResponse.data.intrauterineInseminationProcessResponse,
        oocyteRetrieval:
          medicalRecordResponse.data.oocyteRetrievalProcedureResponse,
        spermProcessing: medicalRecordResponse.data.spermProcessingResponse,
        ovulationTrigger: ovulationTriggerResponse.data,
        ovarianStimulation: ovarianStimulationResponse.data,
        endometrialPreparation: endometrialPreparationResponse.data,
        embryoTransfer: embryoTransferResponse.data,
      },
      postIntervention: {
        // Giai đoạn Hậu can thiệp
        interventionStageNotes:
          medicalRecordResponse.data.interventionStageNotesResponse,
        postInterventionUpdate:
          medicalRecordResponse.data.postInterventionStageUpdateRequest,
      },
    };

    return results;
  } catch (error) {
    console.error("Error fetching patient results:", error);
    throw new Error("Failed to fetch patient results");
  }
};

// Hàm lấy tất cả đơn thuốc từ 4 API can thiệp
export const getAllPrescriptions = async (patientId) => {
  try {
    // Gọi 4 API liên quan đến đơn thuốc
    const [
      ovulationTriggerResponse,
      ovarianStimulationResponse,
      endometrialPreparationResponse,
      embryoTransferResponse,
    ] = await Promise.all([
      apiClient.get(
        `/patients/treatment-profile/intervention/ovulation-trigger-injection`,
        {
          params: { patientId },
        }
      ),
      apiClient.get(
        `/patients/treatment-profile/intervention/ovarian-stimulation-process`,
        {
          params: { patientId },
        }
      ),
      apiClient.get(
        `/patients/treatment-profile/intervention/endometrial-preparation`,
        {
          params: { patientId },
        }
      ),
      apiClient.get(
        `/patients/treatment-profile/intervention/embryo-transfer`,
        {
          params: { patientId },
        }
      ),
    ]);

    // Tập hợp tất cả đơn thuốc
    const prescriptions = [
      {
        type: "ovulationTrigger",
        prescription: ovulationTriggerResponse.data.prescription,
      },
      {
        type: "ovarianStimulation",
        prescription: ovarianStimulationResponse.data.prescription,
      },
      {
        type: "endometrialPreparation",
        prescription: endometrialPreparationResponse.data.prescription,
      },
      {
        type: "embryoTransfer",
        prescription: embryoTransferResponse.data.prescription,
      },
    ];

    // Lọc bỏ các đơn thuốc rỗng (nếu có)
    return prescriptions.filter(
      (p) => p.prescription && p.prescription.items.length > 0
    );
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    throw new Error("Failed to fetches prescriptions");
  }
};
