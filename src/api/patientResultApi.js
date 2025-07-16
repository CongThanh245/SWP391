import apiClient from "./axiosConfig";

// Translation mappings for statuses
const drugResponseTranslations = {
  EFFECTIVE: "Hiệu quả",
  INEFFECTIVE: "Không hiệu quả",
  UNCLEAR: "Không rõ",
};

const statusTranslations = {
  IN_PROGRESS: "Đang tiến hành",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
};

// New: Error message translations for business errors
const errorTranslations = {
  appointmentNotReached: "Bạn chưa đến ngày khám, vui lòng chờ đến ngày khám để thực hiện thao tác này.",
  default: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ."
};

// Function to translate status fields in an object
const translateStatuses = (obj) => {
  if (!obj) return obj;

  const translatedObj = { ...obj };

  if (translatedObj.drugResponse) {
    translatedObj.drugResponse =
      drugResponseTranslations[translatedObj.drugResponse] ||
      translatedObj.drugResponse;
  }

  if (translatedObj.status) {
    translatedObj.status =
      statusTranslations[translatedObj.status] || translatedObj.status;
  }

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
    for (const key in translated) {
      if (Object.prototype.hasOwnProperty.call(translated, key)) {
        translated[key] = translateNestedData(translated[key]);
      }
    }
    return translated;
  }
  return data;
};

// New: Function to handle and translate API errors
const handleApiError = (error) => {
  const errorResponse = error.response?.data || {};
  const { businessErrorCode, businessExceptionDescription, error: errorDetail } = errorResponse;

  // Default error message
  let userMessage = errorTranslations.default;

  // Check for specific "lastAppointment is null" error
  if (businessErrorCode === 100 && errorDetail?.includes("null")) {
    userMessage = errorTranslations.appointmentNotReached;
  }

  // Return the user-friendly message to be displayed
  return userMessage;
};

// Hàm lấy toàn bộ kết quả bệnh nhân và chia theo giai đoạn
export const getAllPatientResults = async (patientId) => {
  if (!patientId) {
    throw new Error("Mã bệnh nhân là bắt buộc");
  }

  try {
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
        ovarianStimulation: translatedOvarianStimulation,
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
    const userMessage = handleApiError(error);
    throw new Error(userMessage); // Throw user-friendly error for the UI to catch
  }
};

// Hàm lấy tất cả đơn thuốc từ 4 API can thiệp
export const getAllPrescriptions = async (patientId) => {
  if (!patientId) {
    throw new Error("Mã bệnh nhân là bắt buộc");
  }

  try {
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

    return prescriptions.filter(
      (p) => p.prescription && p.prescription.items?.length > 0
    );
  } catch (error) {
    const userMessage = handleApiError(error);
    throw new Error(userMessage); 
  }
};