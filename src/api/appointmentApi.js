import apiClient from "./axiosConfig";
// chưa sài được hàm createAppointment
export const createAppointment = async (appointmentData) => {
  try {
    console.log("Payload sent:", JSON.stringify(appointmentData, null, 2));
    const response = await apiClient.post("/create_appointment", appointmentData);
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchAppointments = async (patientId) => {
  try {
    const response = await apiClient.get("/receptionists/appointments", {
      params: patientId ? { patientId } : {}, // Không gửi params nếu patientId không có
    });
    const data = response.data;
    if (!data) return [];
    return Array.isArray(data) ? data : [data]; // Xử lý trường hợp data không phải mảng
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
 export const fetchAppointmentPatient = async () => {
  try {
    const response = await apiClient.get(`/my_appointments`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
 }


// chưa sài được hàm searchAppointments
export const searchAppointments = async (params = {}) => {
  try {
    const response = await apiClient.get("/appointments/search", {
      params, // Truyền params như date, status
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
//chưa sài được hàm updateAppointment
export const updateAppointmentStatus = async (id) => {
  try {
    const response = await apiClient.put(`/cancel/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi API:", error);
    throw error;
  }
};

// Hàm mới cho xác nhận lịch hẹn
export const confirmAppointment = async (id) => {
  try {
    const response = await apiClient.put(`/receptionists/appointments/${id}/confirm`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Hàm mới cho hoàn thành lịch hẹn
export const completeAppointment = async (id) => {
  try {
    const response = await apiClient.put(`/receptionists/appointments/${id}/complete`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Hàm mới cho hủy lịch hẹn
export const cancelAppointment = async (id) => {
  try {
    const response = await apiClient.put(`/receptionists/appointments/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};