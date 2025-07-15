import apiClient from './axiosConfig';
export const getDoctors = async (
  params: Record<string, string | number | boolean>
) => {
  try {
    const response = await apiClient.get('/admin/doctors', { params });
    return response.data;
  } catch (error: unknown) {
    const message =
      error && typeof error === 'object' && 'response' in error
        ? (error as any).response?.data?.message || 'Failed to fetch doctors'
        : 'An unknown error occurred while fetching doctors';

    throw new Error(message);
  }
};


export const getDoctorStats = async () => {
  try {
    const response = await apiClient.get('/admin/doctor-admin-stats');
    return response.data;
  } catch (error: unknown) {
    const message =
      error && typeof error === 'object' && 'response' in error
        ? (error as any).response?.data?.message || 'Failed to fetch doctor stats'
        : 'An unknown error occurred while fetching doctor stats';

    throw new Error(message);
  }
};

export const getAdminDashboard = async () => {
  try {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  } catch (error: unknown) {
    const message =
      error && typeof error === 'object' && 'response' in error
        ? (error as any).response?.data?.message || 'Failed to fetch admin dashboard '
        : 'An unknown error occurred while fetching admin dashboard';

    throw new Error(message);
  }
}

export const getDoctorDetails = async (doctorId) => {
    try {
    const response = await apiClient.get(`/admin/doctor/doctor_id_ferticare?doctor_id_ferticare=${doctorId}`);
    return response.data;
  } catch (error: unknown) {
    const message =
      error && typeof error === 'object' && 'response' in error
        ? (error as any).response?.data?.message || 'Failed to fetch doctor details '
        : 'An unknown error occurred while fetching admin doctor details';

    throw new Error(message);
  }
}

export const uploadDoctorAvatar = async (doctorId: string, file: File): Promise<string> => {
  try{
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/admin/doctor-avatar/${doctorId}`, formData,
      {
        headers: {
          'Content-Type' : 'multipart/form-data',
        }
      }
    );
    return response.data;
  }catch(error: unknown){
    const message =
      error && typeof error === 'object' && 'response' in error
        ? (error as any).response?.data?.message || 'Failed to upload doctor avatar'
        : 'An unknown error occurred while uploading doctor avatar';

    throw new Error(message);
  }
};

export const deleteDoctor  = async (doctorId: string): Promise<void>=>{
  try {
    await apiClient.patch(`/admin/${doctorId}`); 
  } catch (error: unknown) {
    const message =
      error && typeof error === 'object' && 'response' in error
        ? (error as any).response?.data?.message || 'Failed to delete doctor'
        : 'An unknown error occurred while deleting doctor';

    throw new Error(message);
  }
}

export const getPatients = async (
  params: Record<string, string>
) => {
  try {
    const response = await apiClient.get('/admin/patients', { params });
    return response.data;
  } catch (error: unknown) {
    const message =
      error && typeof error === 'object' && 'response' in error
        ? (error as any).response?.data?.message || 'Failed to fetch patients'
        : 'An unknown error occurred while fetching doctors';

    throw new Error(message);
  }
};


export const fetchReceptionists = async () => {
  try {
    const response = await apiClient.get('/admin/receptionists');
    return response.data;
  } catch (error) {
    const message =
      error && typeof error === 'object' && 'response' in error
        ? error.response?.data?.message || 'Failed to fetch receptionists'
        : 'An unknown error occurred while fetching receptionists';

    throw new Error(message);
  }
};



interface Patient {
  id: string;
  patientId: string;
  patientName: string;
  email: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  patientAddress?: string | null;
  patientPhone?: string;
  emergencyContact?: string | null;
  joinDate?: string;
  dateOfBirth?: string;
  profileCompleted?: boolean;
  spousePatientName?: string | null;
  spousePatientAddress?: string | null;
  spousePatientPhone?: string | null;
  spouseEmergencyContact?: string | null;
  spouseDateOfBirth?: string | null;
  spouseGender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | null;
}
export const getPatientDetails = async (patientId: string): Promise<Patient> => {
  try {
    console.log('Gọi API getPatientDetails với patientId:', patientId);
    const response = await apiClient.get(`/admin/patients/by_patient_id_ferticare`, {
      params: {
        patient_id_ferticare: patientId,
      },
    });
    console.log('Response từ API:', response.data);

    const data = response.data;
    return {
      id: data.id,
      patientId: data.patientId,
      patientName: data.patientName,
      email: data.email,
      gender: data.gender,
      patientAddress: data.patientAddress || null,
      patientPhone: data.patientPhone,
      emergencyContact: data.emergencyContact || null,
      joinDate: data.joinDate,
      dateOfBirth: data.dateOfBirth,
      profileCompleted: data.profileCompleted,
      spousePatientName: data.spousePatientName || null,
      spousePatientAddress: data.spousePatientAddress || null,
      spousePatientPhone: data.spousePatientPhone || null,
      spouseEmergencyContact: data.spouseEmergencyContact || null,
      spouseDateOfBirth: data.spouseDateOfBirth || null,
      spouseGender: data.spouseGender || null,
    };
  } catch (error) {
    console.error('Lỗi khi gọi API getPatientDetails:', error);
    const message =
      error && typeof error === 'object' && 'response' in error
        ? error.response?.data?.message || 'Failed to fetch patient details'
        : 'An unknown error occurred while fetching patient details';
    throw new Error(message);
  }
};



interface UpdateDoctorData {
  doctorName?: string;
  doctorPhone?: string;
  doctorAddress?: string;
  doctorEmail?: string;
  doctorStatus?: string; // "Available" or "Unavailable"
  doctorSpecialization?: string;
  doctorGender?: string;
  degree?: string;
  dateOfBirth?: string;
  yearOfExperience?: number;
  licenseNumber?: string;
}

export const updateDoctor = async (doctorId: string, data: UpdateDoctorData) => {
  try {
    const response = await apiClient.patch(`/admin/doctors/doctor_id_ferticare`, data);
    return response.data;
  } catch (error: unknown) {
    const message =
      error && typeof error === 'object' && 'response' in error
        ? (error as any).response?.data?.message || 'Failed to update doctor'
        : 'An unknown error occurred while updating doctor';
    throw new Error(message);
  }
};