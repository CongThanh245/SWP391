// src/features/doctor/services/doctorApi.js
import axios from 'axios';
import apiClient from './axiosConfig';

const API_URL = 'https://683a7bc143bb370a8672d354.mockapi.io/doctors';

export const getDoctors = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch doctors: ' + error.message);
  }
};

export const getDoctorsStats = async () =>{
  const response = await apiClient.get('/doctors/me/stats');
  return response.data
}
export const getDoctorAppointments = async (params = {}) => {
  const {
    filterBy = 'all',
    status = 'all',
    page = 0,
    size = 5,
  } = params;

  try {
    const response = await apiClient.get('/doctors/appointment_list', {
      params: {
        filterBy,
        status,
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch doctor appointments:', error);
    throw error;
  }
};

export const getDoctorList = async () => {
  try {
    const response = await apiClient.get('/doctors');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch doctor list: ' + error.message);
  }
};
export const importDoctors = async (mappedDoctors, options = {}) =>{
  try {
    const response = await apiClient.post('/admin/import-doctor-csv', {
      data: mappedDoctors,
      options: {
        updateExisting: false,
        skipDuplicates: true,
        validateOnly: false,
        ...options,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Import failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to import doctors');
  }
}
