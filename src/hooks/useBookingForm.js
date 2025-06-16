import { useState } from 'react';
import { createAppointment } from '../api/appointmentApi';

const doctors = [
  { id: 1, name: 'BS. Nguyễn Thị Hoa', specialty: 'Chuyên khoa Sản Phụ khoa'},
  { id: 2, name: 'BS. Trần Văn Minh', specialty: 'Chuyên khoa Hiếm muộn'},
  { id: 3, name: 'BS. Lê Thị Mai', specialty: 'Chuyên khoa IVF'},
  { id: 4, name: 'BS. Phạm Đức Anh', specialty: 'Chuyên khoa Nam học' },
];

const timeSlots = [
  { time: '08:00', available: true },
  { time: '08:30', available: true },
  { time: '09:00', available: false },
  { time: '09:30', available: true },
  { time: '10:00', available: true },
  { time: '10:30', available: false },
  { time: '14:00', available: true },
  { time: '14:30', available: true },
  { time: '15:00', available: true },
  { time: '15:30', available: true },
  { time: '16:00', available: false },
  { time: '16:30', available: true },
];

const useBookingForm = (onClose) => {
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    timeSlot: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.doctorId) newErrors.doctorId = 'Vui lòng chọn bác sĩ';
    if (!formData.date) {
      newErrors.date = 'Vui lòng chọn ngày khám';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Ngày khám không thể là ngày trong quá khứ';
      }
    }
    if (!formData.timeSlot) newErrors.timeSlot = 'Vui lòng chọn giờ khám';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Convert date and timeSlot to Unix timestamp
      const [hours, minutes] = formData.timeSlot.split(':');
      const appointmentDate = new Date(formData.date);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const appointmentDateTime = Math.floor(appointmentDate.getTime() / 1000);

      // Find doctor name
      const doctor = doctors.find((doc) => doc.id === parseInt(formData.doctorId));
      const doctorName = doctor ? doctor.name : '';

      // Generate appointment_id (e.g., timestamp-based)
      const appointmentId = `APPT-${Date.now()}`;

      // Prepare payload for API
      const payload = {
        appointment_date_time: appointmentDateTime,
        notes: formData.notes,
        doctor_name: doctorName,
        appointment_status: 'pending',
        patient_name: 'Test Patient', // Hardcoded for now
        appointment_id: appointmentId,
      };

      // Call API to create appointment
      await createAppointment(payload);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => {
        setFormData({ doctorId: '', date: '', timeSlot: '', notes: '' });
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      setErrorMessage('Đặt lịch thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setErrorMessage('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ doctorId: '', date: '', timeSlot: '', notes: '' });
      setErrors({});
      setShowSuccess(false);
      setErrorMessage('');
      onClose();
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    showSuccess,
    errorMessage,
    doctors,
    timeSlots,
    handleSubmit,
    handleInputChange,
    handleClose,
    today: new Date().toISOString().split('T')[0],
  };
};

export default useBookingForm;