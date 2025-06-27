import apiClient from '@api/axiosConfig';


interface Medication { id: string; name: string; }

interface PrescriptionItem {
    medicationId: string;
    drugName?: string; 
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
}

interface Prescription {
    dateIssued: string;
    notes: string;
    items: PrescriptionItem[];
}

type PostInterventionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PLANNED'; 
type BetahcgEvaluation = 'PREGNANT' | 'NOT_PREGNANT' | 'SUSPICIOUS' | 'BIOCHEMICAL';
type EvaluationOutcome = 'EFFECTIVE' | 'NOT_EFFECTIVE' | 'SUSPICIOUS' | 'EARLY_MISCARRIAGE';

export interface PostInterventionData {
    hasPain: boolean; // hasPain
    hasBleeding: boolean; // hasBleeding
    otherComplications: string; // otherComplications
    betahcgDate: string; // inferred from "Ngày xét nghiệm"
    betahcgResult: string; // betahcgResult
    betahcgEvaluation: BetahcgEvaluation; // betahcgEvaluation
    evaluationOutcome: EvaluationOutcome; // evaluationOutcome
    expectedFollowUpDate: string; // expectedFollowUpDate
    additionalNotes: string; // additionalNotes
    status: PostInterventionStatus; // status
    prescription: Prescription; // prescription
}


export const getPostInterventionInfo = async (patientId : string): Promise<PostInterventionData | null> => {
    try{
        const response = await apiClient.get<PostInterventionData>(`doctors/treatment-profile/post-intervention/info?patientId=${patientId}`);
        return response.data;
    }catch(error){
        if (error.response && error.response.status === 404) {
            return null; // Gracefully handle no existing process
        }
        console.error("Error fetching Post Intervention Data Process data:", error);
        throw error;
    }
};

export const updatePostIntervention  = async (patientId : string, data: PostInterventionData): Promise<PostInterventionData | null> => {
    try{
        const response = await apiClient.post(`doctors/treatment-profile/post-intervention/update-stage?patientId=${patientId}`, data);
        return response.data;
    }catch(error){
        if (error.response && error.response.status === 404) {
            return null; // Gracefully handle no existing process
        }
        console.error("Error fetching Post Intervention Data Process data:", error);
        throw error;
    }
};
