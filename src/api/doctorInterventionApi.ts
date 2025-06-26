// @api/doctorInterventionApi.ts (nên dùng .ts để tận dụng TypeScript)

import apiClient from '@api/axiosConfig'; // Đảm bảo đường dẫn này đúng với project của bạn

// =========================================================
// Định nghĩa các Interface cho API
// =========================================================

export interface Medication {
    id: string;
    name: string;
    // Thêm các trường khác nếu API trả về
}

export interface PrescriptionItemPayload {
    medicationId: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
}

export interface PrescriptionPayload {
    dateIssued: string;
    notes: string;
    items: PrescriptionItemPayload[];
}

export interface OvarianStimulationPayload {
    prescription: PrescriptionPayload;
    startDate: string;
    drugResponse: string;
    status: string;
}

interface FollicularMonitoringData {
    id?: string;
    actionDate: string;
    follicleCount: number;
    follicleSize: number;
    endometrialThickness: number;
    status: string;
}

type CreateFollicularMonitoringPayload = Omit<FollicularMonitoringData, 'id' | 'status'>;
type UpdateFollicularMonitoringPayload = Omit<FollicularMonitoringData, 'id' | 'status'>;

interface IntraUterineInseminationProcessData {
    status: string; // e.g., "IN_PROGRESS", "COMPLETED", "CANCELLED", etc.
    actionDate: string; // Format: "YYYY-MM-DD"
}

type UpdateIUIProcessPayload = IntraUterineInseminationProcessData;

interface EmbryoTransferData {
    prescription: PrescriptionPayload;
    actionDate: string; // Changed from startDate to actionDate
    drugResponse: string; // Assuming 'drugResponse' is also applicable here
    status: string;
}


// =========================================================
// Các hàm API
// =========================================================

export const getMedicationList = async (): Promise<Medication[]> => {
    try {
        const response = await apiClient.get<Medication[]>('/medications/medication-list');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch medication list:', error);
        throw error;
    }
};

// Loại bỏ 'any'
export const getOvarianStimulationProcess = async (patientId: string): Promise<OvarianStimulationPayload | null> => {
    try {
        const response = await apiClient.get<OvarianStimulationPayload>(`/doctors/treatment-profile/intervention/ovarian-stimulation-process?patientId=${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch ovarian stimulation process:', error);
        if (error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
};

// Loại bỏ 'any'
export const updateOvarianStimulationProcess = async (patientId: string, data: OvarianStimulationPayload): Promise<OvarianStimulationPayload> => {
    try {
        const response = await apiClient.patch<OvarianStimulationPayload>(`/doctors/treatment-profile/intervention/update-ovarian-stimulation-process?patientId=${patientId}`, data);
        return response.data;
    } catch (error) {
        console.error('Failed to update ovarian stimulation process:', error);
        throw error;
    }
};


export const completeOvarianStimulationProcess = async (patientId: string): Promise<void> => {
    try {
        await apiClient.patch(`/doctors/treatment-profile/intervention/complete-ovarian-stimulation-process?patientId=${patientId}`);
    } catch (error) {
        console.error('Failed to complete Ovarian Stimulation Process  Process:', error);
        throw error;
    }
};


export const cancelOvarianStimulationProcess = async (patientId: string): Promise<void> => {
    try {
        await apiClient.patch(`/doctors/treatment-profile/intervention/cancel-ovarian-stimulation-process?patientId=${patientId}`);
    } catch (error) {
        console.error('Failed to cancel Ovarian Stimulation Process Process:', error);
        throw error;
    }
};

export const getPatientInterventionType = async (patientId: string): Promise<'IUI' | 'IVF' | 'None' | null> => {
    const response = await apiClient.get(`doctors/treatment-profile/intervention/intervention-type?patientId=${patientId}`);
    return response.data.interventionType;
}

// GET - Retrieve follicular monitoring ultrasound data (list)
export const getFollicularMonitoringUltrasound = async (patientId: string): Promise<FollicularMonitoringData[] | null> => {
    try {
        const response = await apiClient.get<FollicularMonitoringData[]>(`/doctors/treatment-profile/intervention/follicular-monitoring-ultrasound?patientId=${patientId}`);
        const data = response.data;
        return data.length > 0 ? data : null;
    } catch (error) {
        console.error("Error fetching follicular monitoring data:", error);
        throw error;
    }
}

// POST - Create a new follicular monitoring ultrasound session
export const createFollicularMonitoringUltrasound = async (
    patientId: string,
    data: CreateFollicularMonitoringPayload // Expects specific fields for creation
): Promise<FollicularMonitoringData> => {
    try {
        const response = await apiClient.post<FollicularMonitoringData>(
            `/doctors/treatment-profile/intervention/follicular-monitoring-ultrasound?patientId=${patientId}`,
            data
        );
        return response.data; // Backend returns the newly created full object
    } catch (error) {
        console.error('Failed to create follicular monitoring ultrasound:', error);
        throw error;
    }
}

// PATCH - Update existing in-progress follicular monitoring ultrasound
// This API updates the 'in-progress' record identified by patientId
// It should receive only the fields meant to be updated, not id or status.
export const updateFollicularMonitoringUltrasound = async (
    patientId: string,
    data: UpdateFollicularMonitoringPayload // Expects specific mutable fields for update
): Promise<FollicularMonitoringData> => {
    try {
        const response = await apiClient.patch<FollicularMonitoringData>(
            `/doctors/treatment-profile/intervention/update-follicular-monitoring-ultrasound?patientId=${patientId}`,
            data
        );
        return response.data; // Backend returns the updated full object
    } catch (error) {
        console.error('Failed to update follicular monitoring ultrasound:', error);
        throw error;
    }
}

// POST - Mark current ultrasound as completed and prepare for next session
// This API triggers a state transition on the backend.
export const nextFollicularMonitoringUltrasound = async (patientId: string): Promise<void> => {
    try {
        // No request body is sent for this action as per your description.
        await apiClient.post(`/doctors/treatment-profile/intervention/next-follicular-monitoring-ultrasound?patientId=${patientId}`);
    } catch (error) {
        console.error('Failed to proceed to next ultrasound session:', error);
        throw error;
    }
}

// GET - Check if there's an in-progress ultrasound
export const hasInProgressUltrasound = async (patientId: string): Promise<boolean> => {
    try {
        const response = await apiClient.get<boolean>(`/doctors/follicular-monitoring-ultrasound/has-in-progress?patientId=${patientId}`);
        const data = response.data;
        return data;
    } catch (error) {
        console.error("Error checking for in-progress ultrasound:", error);
        throw error;
    }
}

export const getIntraUterineInseminationProcess = async (patientId: string): Promise<IntraUterineInseminationProcessData | null> => {
    try {
        const response = await apiClient.get<IntraUterineInseminationProcessData>(`/doctors/treatment-profile/intervention/intrauterine-insemination-process?patientId=${patientId}`);
        // Assuming backend returns null/empty if no data, or throws 404
        return response.data || null;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; // Gracefully handle no existing process
        }
        console.error("Error fetching Intra-Uterine Insemination Process data:", error);
        throw error;
    }
};

// PATCH - Update Intra-Uterine Insemination Process (status and/or actionDate)
export const updateIntraUterineInseminationProcess = async (patientId: string, data: UpdateIUIProcessPayload): Promise<IntraUterineInseminationProcessData> => {
    try {
        const response = await apiClient.patch<IntraUterineInseminationProcessData>(
            `/doctors/treatment-profile/intervention/update-intrauterine-insemination-process?patientId=${patientId}`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Failed to update Intra-Uterine Insemination Process:', error);
        throw error;
    }
};

// PATCH - Complete Intra-Uterine Insemination Process
export const completeIntraUterineInseminationProcess = async (patientId: string): Promise<void> => {
    try {
        await apiClient.patch(`/doctors/treatment-profile/intervention/complete-intrauterine-insemination-process?patientId=${patientId}`);
    } catch (error) {
        console.error('Failed to complete Intra-Uterine Insemination Process:', error);
        throw error;
    }
};

// PATCH - Cancel Intra-Uterine Insemination Process
export const cancelIntraUterineInseminationProcess = async (patientId: string): Promise<void> => {
    try {
        await apiClient.patch(`/doctors/treatment-profile/intervention/cancel-intrauterine-insemination-process?patientId=${patientId}`);
    } catch (error) {
        console.error('Failed to cancel Intra-Uterine Insemination Process:', error);
        throw error;
    }
};

export const updateInterventionStageNotes = async (patientId: string, notes: string) =>{
    try {
        await apiClient.patch(`/doctors/treatment-profile/intervention/update-intervention-stage-notes?patientId=${patientId}`, notes);
    } catch (error) {
        console.error('Failed to update notes intervention Process:', error);
        throw error;
    }
}


export const getInterventionStageNotes = async (patientId: string): Promise<string> =>{
    try {
        const response = await apiClient.get(`/doctors/treatment-profile/intervention/intervention-stage-notes?patientId=${patientId}`);
        return response.data.notes;
    } catch (error) {
        console.error('Failed to get notes intervention Process:', error);
        throw error;
    }
}

export const getSpermProcessingData = async (patientId: string) => {
    try {
        const response = await apiClient.get(`/doctors/treatment-profile/intervention/sperm-processing?patientId=${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to get sperm processing data:', error);
        throw error;
    }
};

export const updateSpermProcessingData = async (patientId: string, data) => {
    try {
        await apiClient.patch(`/doctors/treatment-profile/intervention/update-sperm-processing?patientId=${patientId}`, data);
    } catch (error) {
        console.error('Failed to update sperm processing data:', error);
        throw error;
    }
};

export const completeSpermProcessing = async (patientId: string) => {
    try {
        await apiClient.patch(`/doctors/treatment-profile/intervention/complete-sperm-processing?patientId=${patientId}`);
    } catch (error) {
        console.error('Failed to complete sperm processing:', error);
        throw error;
    }
};

export const cancelSpermProcessing = async (patientId: string) => {
    try {
        await apiClient.patch(`/doctors/treatment-profile/intervention/cancel-sperm-processing?patientId=${patientId}`);
    } catch (error) {
        console.error('Failed to cancel sperm processing:', error);
        throw error;
    }
};


//IVF

export const getOvulationTriggerInjectionProcess = async (patientId: string): Promise<OvarianStimulationPayload | null> => {
    try {
        const response = await apiClient.get<OvarianStimulationPayload>(`/doctors/treatment-profile/intervention/ovulation-trigger-injection?patientId=${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch ovarian stimulation process:', error);
        if (error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
};

// Loại bỏ 'any'
export const updateOvulationTriggerInjectionProcess = async (patientId: string, data: OvarianStimulationPayload): Promise<OvarianStimulationPayload> => {
    try {
        const response = await apiClient.patch<OvarianStimulationPayload>(`/doctors/treatment-profile/intervention/update-ovulation-trigger-injection?patientId=${patientId}`, data);
        return response.data;
    } catch (error) {
        console.error('Failed to update ovarian stimulation process:', error);
        throw error;
    }
};


export const completeOvulationTriggerInjectionProcess = async (patientId: string): Promise<void> => {
    try {
        await apiClient.patch(`/doctors/treatment-profile/intervention/complete-ovulation-trigger-injection?patientId=${patientId}`);
    } catch (error) {
        console.error('Failed to complete Ovarian Stimulation Process  Process:', error);
        throw error;
    }
};


export const cancelOvulationTriggerInjectionProcess = async (patientId: string): Promise<void> => {
    try {
        await apiClient.patch(`/doctors/treatment-profile/intervention/cancel-ovulation-trigger-injection?patientId=${patientId}`);
    } catch (error) {
        console.error('Failed to cancel Ovarian Stimulation Process Process:', error);
        throw error;
    }
};


//Embryo Transfer 

export const getEmbryoTransferProcess = async (patientId: string): Promise<EmbryoTransferData | null> => {
    try {
        const response = await apiClient.get<EmbryoTransferData>(`/doctors/treatment-profile/intervention/embryo-transfer?patientId=${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch ovarian stimulation process:', error);
        if (error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
};

// Loại bỏ 'any'
export const updateEmbryoTransferProcess = async (patientId: string, data: EmbryoTransferData): Promise<OvarianStimulationPayload> => {
    try {
        const response = await apiClient.patch<OvarianStimulationPayload>(`/doctors/treatment-profile/intervention/update-embryo-transfer?patientId=${patientId}`, data);
        return response.data;
    } catch (error) {
        console.error('Failed to update ovarian stimulation process:', error);
        throw error;
    }
};


export const completeEmbryoTransferProcess = async (patientId: string): Promise<void> => {
    try {
        await apiClient.patch(`/doctors/treatment-profile/intervention/complete-embryo-transfer?patientId=${patientId}`);
    } catch (error) {
        console.error('Failed to complete Ovarian Stimulation Process  Process:', error);
        throw error;
    }
};


export const cancelEmbryoTransferProcess = async (patientId: string): Promise<void> => {
    try {
        await apiClient.patch(`/doctors/treatment-profile/intervention/cancel-embryo-transfer?patientId=${patientId}`);
    } catch (error) {
        console.error('Failed to cancel Ovarian Stimulation Process Process:', error);
        throw error;
    }
};



// Endometrial

export const getEndometrialPreparationProcess = async (patientId: string): Promise<OvarianStimulationPayload | null> => {
    try {
        const response = await apiClient.get<OvarianStimulationPayload>(`/doctors/treatment-profile/intervention/endometrial-preparation?patientId=${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch ovarian stimulation process:', error);
        if (error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
};

// Loại bỏ 'any'
export const updateEndometrialPreparationProcess = async (patientId: string, data: OvarianStimulationPayload): Promise<OvarianStimulationPayload> => {
    try {
        const response = await apiClient.patch<OvarianStimulationPayload>(`/doctors/treatment-profile/intervention/update-endometrial-preparation?patientId=${patientId}`, data);
        return response.data;
    } catch (error) {
        console.error('Failed to update ovarian stimulation process:', error);
        throw error;
    }
};


export const completeEndometrialPreparationProcess = async (patientId: string): Promise<void> => {
    try {
        await apiClient.patch(`/doctors/treatment-profile/intervention/complete-endometrial-preparation?patientId=${patientId}`);
    } catch (error) {
        console.error('Failed to complete Ovarian Stimulation Process  Process:', error);
        throw error;
    }
};


export const cancelEndometrialPreparationProcess = async (patientId: string): Promise<void> => {
    try {
        await apiClient.patch(`/doctors/treatment-profile/intervention/cancel-endometrial-preparation?patientId=${patientId}`);
    } catch (error) {
        console.error('Failed to cancel Ovarian Stimulation Process Process:', error);
        throw error;
    }
};
