import apiClient from "./axiosConfig";
 export const fetchReceptionistProfile  = async () => {
  try {
    const response = await apiClient.get(`receptionists/me`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
 }

 export const updateReceptionistProfile = async (data) => {
  const response = await apiClient.patch('/receptionists/me', data);
  return response.data;
};