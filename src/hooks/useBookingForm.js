import { useState, useEffect } from 'react';
import { getDoctorList } from '@api/doctorApi';
import apiClient from '@api/axiosConfig';

// Custom hook for booking: generate slots then fetch slots, include doctorName in payload
const useBookingForm = (onClose) => {
  const [formData, setFormData] = useState({ doctorId: '', date: '', timeSlot: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // 1. Fetch doctors for dropdown
  useEffect(() => {
    (async () => {
      try {
        const list = await getDoctorList();
        setDoctors(list.map(d => ({ id: d.id, name: d.doctorName || d.name })));
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setErrorMessage('Không thể tải danh sách bác sĩ.');
      }
    })();
  }, []);

  // 2. When doctor & date change: generate then fetch slots
  useEffect(() => {
    const { doctorId, date } = formData;
    if (!doctorId || !date) {
      setTimeSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setErrorMessage('');

      // Generate slots
      try {
        await apiClient.post('/slot/generate', null, { params: { doctorId, date } });
        console.log('Slots generate success');
      } catch (genErr) {
        console.error('Generate slots error:', genErr.response?.status, genErr.response?.data);
        setErrorMessage('Lỗi khởi tạo khung giờ.');
        setLoadingSlots(false);
        return;
      }

      // Fetch slots
      try {
        const resp = await apiClient.get('/slot', { params: { doctorId, date } });
        if (Array.isArray(resp.data)) {
          const slots = resp.data.map(s => ({
            id: s.id,
            time: `${s.startTime} - ${s.endTime}`,
            available: !s.booked,
          }));
          setTimeSlots(slots);
          if (!slots.length) setErrorMessage('Không có khung giờ khả dụng.');
        } else {
          console.error('Invalid slots response:', resp.data);
          setErrorMessage('Dữ liệu khung giờ không hợp lệ.');
          setTimeSlots([]);
        }
      } catch (err) {
        console.error('Fetch slots error:', err.response?.status, err.response?.data);
        setErrorMessage('Không thể tải khung giờ.');
        setTimeSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [formData.doctorId, formData.date]);

  // Validate form for submit
  const validate = () => {
    const errs = {};
    if (!formData.doctorId) errs.doctorId = 'Chọn bác sĩ';
    if (!formData.date) errs.date = 'Chọn ngày';
    if (!formData.timeSlot) errs.timeSlot = 'Chọn giờ khám';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle final form submit (e.g., create appointment)
  // Handle final form submit (e.g., create appointment)
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  setIsSubmitting(true);
  setErrorMessage('');

  try {
    // Split the timeSlot to get start time
    const [startTime] = formData.timeSlot.split(' - ');

    // Construct payload for /create_appointment
    const payload = {
      doctorId: formData.doctorId,
      appointmentDate: formData.date, // e.g., "2025-06-18"
      appointmentTime: startTime, // e.g., "09:00"
      note: formData.notes || '', // Use 'note' as per API spec
    };

    // Call the createAppointment API function
    const response = await createAppointment(payload);

    // Log or process response if needed
    console.log('Appointment created:', response);

    // Show success message
    setShowSuccess(true);
    setTimeout(handleClose, 2000);
  } catch (err) {
    console.error('Create appointment error:', err.response?.status, err.response?.data);
    setErrorMessage('Đặt lịch thất bại: ' + (err.response?.data?.message || 'Lỗi không xác định'));
  } finally {
    setIsSubmitting(false);
  }
};

  // Handle field changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'doctorId' || field === 'date' ? { timeSlot: '' } : {}),
    }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setErrorMessage('');
  };

  // Reset and close
  const handleClose = () => {
    setFormData({ doctorId: '', date: '', timeSlot: '', notes: '' });
    setErrors({});
    setShowSuccess(false);
    setErrorMessage('');
    setTimeSlots([]);
    onClose();
  };

  return {
    formData,
    errors,
    isSubmitting,
    showSuccess,
    errorMessage,
    doctors,
    timeSlots,
    loadingSlots,
    today,
    handleInputChange,
    handleSubmit,
    handleClose,
  };
};

export default useBookingForm;
