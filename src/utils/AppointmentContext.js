import { createContext } from 'react';

// Tạo Context để chia sẻ appointmentCounts
export const AppointmentContext = createContext({
  appointmentCounts: { pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
});