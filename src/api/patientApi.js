import apiClient from './axiosConfig';

export const updatePatient = async (data) => {
  const response = await apiClient.patch('http://localhost:8088/api/v1/patients/me', data);
  return response.data;
};