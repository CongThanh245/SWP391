import apiClient from "./axiosConfig";

// Translation mappings for statuses
// Translation mappings for statuses
const drugResponseTranslations = {
  EFFECTIVE: "Hiệu quả",
  INEFFECTIVE: "Không hiệu quả",
  UNCLEAR: "Không rõ",
};

const statusTranslations = {
  IN_PROGRESS: "Đang tiến hành",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

// Function to translate status fields in an object
const translateStatuses = (obj) => {
  if (!obj) return obj;

  // Create a new object to avoid mutating the original
  const translatedObj = { ...obj };

  // Translate drugResponse if it exists
  if (translatedObj.drugResponse) {
    translatedObj.drugResponse =
      drugResponseTranslations[translatedObj.drugResponse] ||
      translatedObj.drugResponse;
  }

  // Translate status if it exists
  if (translatedObj.status) {
    translatedObj.status =
      statusTranslations[translatedObj.status] || translatedObj.status;
  }

  // Translate evaluationOutcome if it exists
  if (translatedObj.evaluationOutcome) {
    translatedObj.evaluationOutcome =
      drugResponseTranslations[translatedObj.evaluationOutcome] ||
      translatedObj.evaluationOutcome;
  }

  return translatedObj;
};

// Function to translate statuses in arrays or nested objects
const translateNestedData = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => translateNestedData(item));
  } else if (data && typeof data === "object") {
    const translated = translateStatuses(data);
    // Recursively translate nested objects
    for (const key in translated) {
      if (Object.prototype.hasOwnProperty.call(translated, key)) {
        translated[key] = translateNestedData(translated[key]);
      }
    }
    return translated;
  }
  return data;
};

// Hàm lấy toàn bộ kết quả bệnh nhân và chia theo giai đoạn
export const getAllPatientResults = async (patientId) => {
  if (!patientId) {
    throw new Error("Patient ID is required");
  }

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

    // Translate statuses in each response
    const translatedMedicalRecord = translateNestedData(
      medicalRecordResponse.data
    );
    const translatedOvulationTrigger = translateNestedData(
      ovulationTriggerResponse.data
    );
    const translatedOvarianStimulation = translateNestedData(
      ovarianStimulationResponse.data
    );
    const translatedEndometrialPreparation = translateNestedData(
      endometrialPreparationResponse.data
    );
    const translatedEmbryoTransfer = translateNestedData(
      embryoTransferResponse.data
    );

    // Tổ chức dữ liệu theo 3 giai đoạn
    const results = {
      preIntervention: {
        vitalSigns: {
          wife: translatedMedicalRecord.wifeVitalSignsResponse,
          husband: translatedMedicalRecord.husbandVitalSignsResponse,
        },
        preparationNotes: translatedMedicalRecord.preparationNotesResponse,
        protocol: translatedMedicalRecord.protocolResponseSet,
      },
      intervention: {
        follicularMonitoring:
          translatedMedicalRecord.follicularMonitoringUltrasoundResponseList,
        intrauterineInsemination:
          translatedMedicalRecord.intrauterineInseminationProcessResponse,
        oocyteRetrieval:
          translatedMedicalRecord.oocyteRetrievalProcedureResponse,
        spermProcessing: translatedMedicalRecord.spermProcessingResponse,
        ovulationTrigger: translatedOvulationTrigger,
        ovarianStimulation: translatedOvarianStimulation, // Fixed typo here
        endometrialPreparation: translatedEndometrialPreparation,
        embryoTransfer: translatedEmbryoTransfer,
        interventionStageNotes:
          translatedMedicalRecord.interventionStageNotesResponse,
      },
      postIntervention: {
        postInterventionUpdate:
          translatedMedicalRecord.postInterventionStageUpdateRequest,
      },
    };

    return results;
  } catch (error) {
    console.error(
      "Error fetching patient results:",
      error.response?.data || error.message
    );
    throw new Error(
      "Failed to fetch patient results: " +
        (error.response?.data?.error || error.message)
    );
  }
};

// Hàm lấy tất cả đơn thuốc từ 4 API can thiệp
export const getAllPrescriptions = async (patientId) => {
  if (!patientId) {
    throw new Error("Patient ID is required");
  }

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
      (p) => p.prescription && p.prescription.items?.length > 0
    );
  } catch (error) {
    console.error(
      "Error fetching prescriptions:",
      error.response?.data || error.message
    );
    throw new Error(
      "Failed to fetch prescriptions: " +
        (error.response?.data?.error || error.message)
    );
  }
};
