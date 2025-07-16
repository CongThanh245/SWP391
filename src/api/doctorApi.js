// src/features/doctor/services/doctorApi.js
import apiClient from './axiosConfig';

export const getDoctors = async (params = {}) => {
  try {
    const response = await apiClient.get('/guest/doctors', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch doctors:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch doctors');
  }
};

export const getDoctorDetails = async (doctorId) => {
  try {
    const response = await apiClient.get('/admin/doctor/doctor_id_ferticare', {
      params: { doctor_id_ferticare: doctorId },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch doctor details:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch doctor details');
  }
};

export const getAdminDoctors = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/doctors', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch doctors:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch doctors');
  }
};
export const getDoctorsStats = async () => {
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

export const getPatientList = async (params = {}) => {
  const {
    name = '',
    page = 5,
    size = 5,
  } = params;
  try {
    const response = await apiClient.get('/doctors/patient_list', {
      params: {
        name,
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patient list:', error);
    throw error;
  }
}

export const getDoctorList = async () => {
  try {
    const response = await apiClient.get('/doctors');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch doctor list: ' + error.message);
  }
};
export const importDoctors = async (mappedDoctors, options = {}) => {
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
export const getWifeProfile = async (patientId) => {
  try {
    const response = await apiClient.get(`/doctors/wife_profile?patientId=${patientId}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch doctor appointments:', error);
    throw error;
  }
}

export const getWifeVital = async (patientId) => {
  try {
    const response = await apiClient.get(`/doctors/treatment-profile/wife-vital-signs?patientId=${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch doctor appointments:', error);
    throw error;
  }
}

export const getHusbandVital = async (patientId) => {
  try {
    const response = await apiClient.get(`/doctors/treatment-profile/husband-vital-signs?patientId=${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch doctor appointments:', error);
    throw error;
  }
}

export const getProtocolList = async (appoimnetId) => {
  try {
    const response = await apiClient.get(`/doctors/treatment-profile/protocols-list?patientId=${appoimnetId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch doctor appointments:', error);
    throw error;
  }
}

export const getPreparation_notes = async (patientId) => {
  try {
    const response = await apiClient.get(`/doctors/treatment-profile/preparation_notes?patientId=${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch doctor appointments:', error);
    throw error;
  }
}

export const getDetailedTestResult = async (protocolId) => {
  try {
    const response = await apiClient.get(`/doctors/treatment-profile/evaluation?protocolId=${protocolId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching detailed test result for protocolId ${protocolId}:`, error);
    throw error;
  }
};

export const handlePreParationStage = async (patientId) => {
  try {
    const response = await apiClient.patch(`/doctors/treatment-profile/preparation/finish-stage?patientId=${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching detailed test result for protocolId ${patientId}:`, error);
    throw error;
  }
}

export const getPreparationStatus = async (patientId) => {
  try {
    const response = await apiClient.get(
      '/doctors/treatment-profile/preparation/status',
      {
        params: {
          patientId: patientId
        }
      }
    );
    return response.data; // This will return { status: "PLANNED" } or similar
  } catch (error) {
    console.error('Failed to get preparation status:', error.response?.data || error.message);
    throw error;
  }
}
//Intervention
export const completeInterventionStage = async (patientId) => {
  try {
    const response = await apiClient.patch(`/doctors/treatment-profile/intervention/finish-stage?patientId=${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching detailed test result for protocolId ${patientId}:`, error);
    throw error;
  }
}

export const getInterventionStageStatus = async (patientId) => {
  try {
    const response = await apiClient.get(
      '/doctors/treatment-profile/intervention/intervention-status',
      {
        params: {
          patientId: patientId
        }
      }
    );
    return response.data; // This will return { status: "PLANNED" } or similar
  } catch (error) {
    console.error('Failed to get preparation status:', error.response?.data || error.message);
    throw error;
  }
}

//PostIntervention

//Intervention
export const completePostInterventionStage = async (patientId) => {
  try {
    const response = await apiClient.patch(`/doctors/treatment-profile/post-intervention/finish-stage?patientId=${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching detailed test result for protocolId ${patientId}:`, error);
    throw error;
  }
}

export const getPostInterventionStageStatus = async (patientId) => {
  try {
    const response = await apiClient.get(
      '/doctors/treatment-profile/post-intervention/status',
      {
        params: {
          patientId: patientId
        }
      }
    );
    return response.data; // This will return { status: "PLANNED" } or similar
  } catch (error) {
    console.error('Failed to get preparation status:', error.response?.data || error.message);
    throw error;
  }
}

export const completeTreatment = async (patientId) => {
  try {
    const response = await apiClient.patch(`/doctors/treatment-profile/treatment/finish-treatment?patientId=${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching detailed test result for protocolId ${patientId}:`, error);
    throw error;
  }
}



export const saveFollowUpRecommendation = async (followUpData) => {
  try {
    // Using apiClient.post as per your example's structure
    const response = await apiClient.patch(
      '/doctors/treatment-profile/preparation/followUpAppointment', // Example endpoint, adjust as needed
      followUpData
      // You can add a third argument for config here if needed, e.g., { headers: { Authorization: 'Bearer ...' }}
    );
    return response.data; // Return the data part of the response, mirroring your getPreparationStatus
  } catch (error) {
    console.error('Failed to save follow-up recommendation:', error.response?.data || error.message);
    throw error; // Re-throw the error for external handling
  }
};

export const doctorFile = async (patientId) => {
  try {
    const response = await apiClient(`/appointment/files/doctor-get-files?patientId=${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to save follow-up recommendation:', error.response?.data || error.message);
    throw error;
  }
};

