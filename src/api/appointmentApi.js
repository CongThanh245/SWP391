import apiClient from './axiosConfig';
// chưa sài được hàm createAppointment
export const createAppointment = async (appointmentData) => {
  try {
    const response = await apiClient.post('/create_appointment', appointmentData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchAppointments = async (patientId) => {
  try {
    const response = await apiClient.get('/appointments', {
      params: { patientId },
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
// chưa sài được hàm searchAppointments
export const searchAppointments = async (params = {}) => {
  try {
    const response = await apiClient.get('/appointments/search', {
      params, // Truyền params như date, status
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
//chưa sài được hàm updateAppointment
export const updateAppointmentStatus = async (id, status) => {
  try {
    const response = await apiClient.put(`/appointments/${id}`, {
      appointmentStatus: status.toUpperCase(), // Backend yêu cầu uppercase
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};