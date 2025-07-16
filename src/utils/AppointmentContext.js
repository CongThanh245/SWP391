// AppointmentContext.js
import { createContext } from 'react';

export const AppointmentContext = createContext({
  appointmentCounts: { pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
  appointments: [],
  isLoading: false,
  error: null,
  refetchAppointments: () => {},
});