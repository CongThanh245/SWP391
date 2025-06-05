const API_BASE_URL = 'https://683a7bc143bb370a8672d354.mockapi.io/appointment';

export const createAppointment = async (appointmentData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create appointment');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchAppointments = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    console.log('Response status:', response.status); // Thêm dòng này
    console.log('Response data:', await response.clone().json()); // Thêm dòng này
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const updateAppointmentStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appointment_status: status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update appointment status');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};