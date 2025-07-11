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
    await apiClient.delete(`/admin/${doctorId}`); 
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