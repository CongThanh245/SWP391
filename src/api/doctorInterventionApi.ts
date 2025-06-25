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