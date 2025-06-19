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