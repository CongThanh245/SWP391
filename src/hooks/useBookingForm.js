import { useState, useEffect } from 'react';
import { createAppointment } from '@api/appointmentApi';
import { getDoctorList } from '@api/doctorApi';

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
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorData = await getDoctorList();
        console.log('Doctor data from API:', doctorData);
        // Ánh xạ dữ liệu từ API thành cấu trúc { id, name }
        const formattedDoctors = doctorData.map((doctor) => ({
          id: doctor.id,
          name: doctor.doctorName,
        }));
        setDoctors(formattedDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error.message);
        setErrorMessage('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
      }
    };
    fetchDoctors();
  }, []);

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
      const [hours, minutes] = formData.timeSlot.split(':');
      const appointmentDate = new Date(formData.date);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const appointmentDateTime = Math.floor(appointmentDate.getTime() / 1000);

      const doctor = doctors.find((doc) => doc.id === formData.doctorId);
      const doctorName = doctor ? doctor.name : '';

      const appointmentId = `APPT-${Date.now()}`;

      const payload = {
        appointment_date_time: appointmentDateTime,
        notes: formData.notes,
        doctor_name: doctorName,
        appointment_status: 'pending',
        patient_name: 'Test Patient',
        appointment_id: appointmentId,
      };

      await createAppointment(payload);

      setShowSuccess(true);
      setTimeout(() => {
        setFormData({ doctorId: '', date: '', timeSlot: '', notes: '' });
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating appointment:', error.message);
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