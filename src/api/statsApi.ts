import apiClient from './axiosConfig';

export const getDoctorTreatmentStats = async () => {
  try {
    const response = await apiClient.get('/doctors/me/stats');
    return response.data;
  } catch (error: unknown) {
    const message =
      error && typeof error === 'object' && 'response' in error
        ? (error as any).response?.data?.message || 'Không thể lấy dữ liệu thống kê bác sĩ'
        : 'Đã xảy ra lỗi không xác định khi lấy dữ liệu thống kê bác sĩ';
    throw new Error(message);
  }
};