import apiClient from './axiosConfig';

export const updatePatient = async (data) => {
  const response = await apiClient.patch('http://localhost:8088/api/v1/patients/me', data);
  return response.data;
};

export const getPatients = async () => {
  const response = await apiClient.get('receptionists/patients');
  return response.data;
};

export const getPatientDetails = async (id) => {
  const response = await apiClient.get(`receptionists/patients/${id}`);
  return response.data;
};