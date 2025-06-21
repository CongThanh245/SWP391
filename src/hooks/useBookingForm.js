import { useState, useEffect } from "react";
import { getDoctorList } from "@api/doctorApi";
import apiClient from "@api/axiosConfig";
import { createAppointment } from "@api/appointmentApi";

const useBookingForm = (onClose) => {
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    timeSlot: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const list = await getDoctorList();
        setDoctors(list.map((d) => ({ id: d.id, name: d.doctorName || d.name })));
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setErrorMessage("Không thể tải danh sách bác sĩ.");
      }
    };
    fetchDoctors();
  }, []);

  // Fetch slots when doctor & date change
  useEffect(() => {
    const fetchSlots = async () => {
      const { doctorId, date } = formData;
      
      if (!doctorId || !date) {
        setTimeSlots([]);
        return;
      }

      setLoadingSlots(true);
      setErrorMessage("");
      setTimeSlots([]);

      try {
        console.log(`Fetching slots for doctorId: ${doctorId}, date: ${date}`);
        
        // Lấy slots hiện có
        let response = await apiClient.get('/slot', { 
          params: { doctorId, date } 
        });
        
        // Nếu không có slots thì generate
        if (!response.data || response.data.length === 0) {
          console.log('No slots found, generating...');
          await apiClient.post('/slot/generate', null, { 
            params: { doctorId, date } 
          });
          
          // Fetch lại sau khi generate
          response = await apiClient.get('/slot', { 
            params: { doctorId, date } 
          });
        }

        if (Array.isArray(response.data)) {
          // Xử lý duplicate slots - chỉ giữ lại 1 slot cho mỗi thời gian
          const uniqueSlots = response.data.reduce((acc, slot) => {
            const existingSlot = acc.find(s => s.time === slot.startTime);
            
            if (!existingSlot) {
              // Chưa có slot này, thêm vào
              acc.push({
                id: slot.id,
                time: slot.startTime,
                available: !slot.booked
              });
            } else if (existingSlot.available && !slot.booked) {
              // Nếu có duplicate và cả 2 đều available, ưu tiên slot đầu tiên
              // (không làm gì)
            } else if (!existingSlot.available && !slot.booked) {
              // Nếu slot cũ đã booked mà slot mới chưa booked, thay thế
              const index = acc.findIndex(s => s.time === slot.startTime);
              acc[index] = {
                id: slot.id,
                time: slot.startTime,
                available: true
              };
            }
            
            return acc;
          }, []);

          // Sort theo thời gian
          uniqueSlots.sort((a, b) => a.time.localeCompare(b.time));
          
          setTimeSlots(uniqueSlots);
          console.log(`Loaded ${uniqueSlots.length} unique slots`);
          
          if (uniqueSlots.length === 0) {
            setErrorMessage('Không có khung giờ khả dụng.');
          }
        } else {
          setErrorMessage('Dữ liệu khung giờ không hợp lệ.');
        }
        
      } catch (err) {
        console.error('Error fetching slots:', err);
        if (err.response?.status === 409) {
          // Conflict - có thể do generate duplicate, thử fetch lại
          try {
            const response = await apiClient.get('/slot', { 
              params: { doctorId, date } 
            });
            if (response.data && response.data.length > 0) {
              const uniqueSlots = response.data
                .filter((slot, index, arr) => 
                  arr.findIndex(s => s.startTime === slot.startTime) === index
                )
                .map(slot => ({
                  id: slot.id,
                  time: slot.startTime,
                  available: !slot.booked
                }))
                .sort((a, b) => a.time.localeCompare(b.time));
              
              setTimeSlots(uniqueSlots);
            } else {
              setErrorMessage('Không có khung giờ khả dụng.');
            }
          } catch (retryErr) {
            setErrorMessage('Không thể tải khung giờ. Vui lòng thử lại.');
          }
        } else {
          setErrorMessage('Không thể tải khung giờ. Vui lòng thử lại.');
        }
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [formData.doctorId, formData.date]);

  // Validate form
  const validate = () => {
    const errs = {};
    if (!formData.doctorId) errs.doctorId = "Chọn bác sĩ";
    if (!formData.date) errs.date = "Chọn ngày";
    if (!formData.timeSlot) errs.timeSlot = "Chọn giờ khám";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle time slot focus - check if doctor and date are selected
  const handleTimeSlotFocus = (e) => {
    if (!formData.doctorId || !formData.date) {
      e.target.blur(); 
      
      // Set specific error messages
      const newErrors = {};
      if (!formData.doctorId && !formData.date) {
        setErrorMessage("Vui lòng chọn bác sĩ và ngày khám trước khi chọn giờ khám.");
      } else if (!formData.doctorId) {
        newErrors.doctorId = "Vui lòng chọn bác sĩ trước";
        setErrorMessage("Vui lòng chọn bác sĩ trước khi chọn giờ khám.");
      } else if (!formData.date) {
        newErrors.date = "Vui lòng chọn ngày trước";
        setErrorMessage("Vui lòng chọn ngày khám trước khi chọn giờ khám.");
      }
      
      setErrors(prev => ({ ...prev, ...newErrors }));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        doctorId: formData.doctorId,
        appointmentDate: formData.date,
        appointmentTime: formData.timeSlot,
        note: formData.notes || "",
      };
      
      console.log("Creating appointment:", payload);
      await createAppointment(payload);
      
      setShowSuccess(true);
      setTimeout(handleClose, 2000);
      
    } catch (err) {
      console.error("Create appointment error:", err);
      
      let errorMsg = "Đặt lịch thất bại: ";
      if (err.response?.status === 409) {
        errorMsg += "Khung giờ đã được đặt.";
      } else if (err.response?.data?.message?.includes('maximum')) {
        errorMsg += "Bạn đã đạt giới hạn số lịch hẹn.";
      } else {
        errorMsg += err.response?.data?.message || "Lỗi không xác định.";
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset timeSlot khi đổi doctor hoặc date
      ...(field === "doctorId" || field === "date" ? { timeSlot: "" } : {}),
    }));
    
    setErrors(prev => ({ ...prev, [field]: "" }));
    setErrorMessage("");
  };

  // Handle close
  const handleClose = () => {
    setFormData({ doctorId: "", date: "", timeSlot: "", notes: "" });
    setErrors({});
    setShowSuccess(false);
    setErrorMessage("");
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
    handleTimeSlotFocus, 
  };
};

export default useBookingForm;