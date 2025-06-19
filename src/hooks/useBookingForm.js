import { useState, useEffect, useCallback, useRef } from "react";
import { getDoctorList } from "@api/doctorApi";
import apiClient from "@api/axiosConfig";
import { createAppointment } from "@api/appointmentApi";

// Custom hook for booking with debouncing and optimized slot fetching
const useBookingForm = (onClose) => {
  const [count, setCount] = useState(0); // For debugging purposes
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
  
  // Cache để tránh gọi API trùng lặp
  const slotsCache = useRef(new Map());
  const debounceTimer = useRef(null);
  const abortController = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  // 1. Fetch doctors for dropdown
  useEffect(() => {
    (async () => {
      try {
        const list = await getDoctorList();
        setDoctors(
          list.map((d) => ({ id: d.id, name: d.doctorName || d.name }))
        );
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setErrorMessage("Không thể tải danh sách bác sĩ.");
      }
    })();
  }, []);

  // 2. Optimized slot fetching với duplicate prevention
  const fetchSlotsDebounced = useCallback(async (doctorId, date) => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort();
    }

    debounceTimer.current = setTimeout(async () => {
      // Kiểm tra cache trước
      const cacheKey = `${doctorId}-${date}`;
      if (slotsCache.current.has(cacheKey)) {
        console.log('Using cached slots for:', cacheKey);
        const cachedSlots = slotsCache.current.get(cacheKey);
        setTimeSlots(cachedSlots);
        setLoadingSlots(false);
        return;
      }

      setLoadingSlots(true);
      setErrorMessage('');
      setTimeSlots([]);
      
      // Tạo AbortController mới cho request này
      abortController.current = new AbortController();

      try {
        console.log(`Fetching slots for doctorId: ${doctorId}, date: ${date}`);
        
        // STRATEGY: Luôn fetch existing slots trước
        let resp = await apiClient.get('/slot', { 
          params: { doctorId, date },
          signal: abortController.current.signal 
        });
        
        // Nếu không có slots hoặc có ít slots, generate thêm
        if (!resp.data || resp.data.length === 0) {
          console.log('No existing slots found, generating new ones...');
          try {
            await apiClient.post('/slot/generate', null, { 
              params: { doctorId, date },
              signal: abortController.current.signal 
            });
            
            // Fetch lại sau khi generate
            resp = await apiClient.get('/slot', { 
              params: { doctorId, date },
              signal: abortController.current.signal 
            });
          } catch (generateError) {
            console.log('Generate error (possibly duplicate):', generateError.message);
            // Nếu generate fail, vẫn dùng data hiện tại
            if (generateError.response?.status !== 409) {
              throw generateError; // Re-throw nếu không phải lỗi duplicate
            }
            // Với lỗi 409, fetch lại existing slots
            resp = await apiClient.get('/slot', { 
              params: { doctorId, date },
              signal: abortController.current.signal 
            });
          }
        } else {
          console.log(`Found ${resp.data.length} existing slots, using them directly`);
        }

        if (Array.isArray(resp.data)) {
          // Xử lí duplicate slots từ backend
          const slotsMap = new Map();
          resp.data.forEach(slot => {
            const key = `${slot.startTime}`;
            if (!slotsMap.has(key)) {
              slotsMap.set(key, {
                id: slot.id,
                time: slot.startTime,
                available: !slot.booked,
                // Lưu thêm info để debug
                slotId: slot.id,
                isBooked: slot.booked
              });
            } else {
              // Nếu có duplicate, ưu tiên slot chưa book
              const existing = slotsMap.get(key);
              if (existing.isBooked && !slot.booked) {
                slotsMap.set(key, {
                  id: slot.id,
                  time: slot.startTime,
                  available: !slot.booked,
                  slotId: slot.id,
                  isBooked: slot.booked
                });
              }
              console.warn(`Duplicate slot found for time ${slot.startTime}:`, {
                existing: existing,
                duplicate: slot
              });
            }
          });
          
          // Convert Map to Array và sort theo thời gian
          const uniqueSlots = Array.from(slotsMap.values())
            .sort((a, b) => a.time.localeCompare(b.time));
          
          console.log(`Processed ${resp.data.length} slots → ${uniqueSlots.length} unique slots`);
          
          // Lưu vào cache với expiry time (5 phút)
          const cacheData = {
            slots: uniqueSlots,
            timestamp: Date.now(),
            expiry: Date.now() + (5 * 60 * 1000) // 5 phút
          };
          slotsCache.current.set(cacheKey, uniqueSlots);
          
          setTimeSlots(uniqueSlots);
          if (!uniqueSlots.length) {
            setErrorMessage('Không có khung giờ khả dụng.');
          }
        } else {
          setErrorMessage('Dữ liệu khung giờ không hợp lệ.');
          setTimeSlots([]);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching slots:', err.response?.status, err.response?.data);
          
          // Xử lý các lỗi cụ thể
          if (err.response?.status === 409) {
            setErrorMessage('Khung giờ đã tồn tại. Đang tải lại...');
          } else if (err.response?.data?.message?.includes('unique result')) {
            setErrorMessage('Dữ liệu bị trùng lặp trong hệ thống. Vui lòng liên hệ admin.');
          } else {
            setErrorMessage('Không thể tải khung giờ. Vui lòng thử lại.');
          }
          setTimeSlots([]);
        }
      } finally {
        setLoadingSlots(false);
      }
    }, 800); // Debounce 800ms
  }, []);

  // 3. Effect để fetch slots khi doctor & date thay đổi
  useEffect(() => {
    const { doctorId, date } = formData;

    if (!doctorId || !date) {
      setTimeSlots([]);
      if (doctorId && !date) {
        setErrorMessage('Vui lòng chọn ngày khám');
      } else if (!doctorId && date) {
        setErrorMessage('Vui lòng chọn bác sĩ');
      } else {
        setErrorMessage('');
      }
      return;
    }

    fetchSlotsDebounced(doctorId, date);

    // Cleanup function
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [formData.doctorId, formData.date, fetchSlotsDebounced]);

  // Validate form for submit
  const validate = () => {
    const errs = {};
    if (!formData.doctorId) errs.doctorId = "Chọn bác sĩ";
    if (!formData.date) errs.date = "Chọn ngày";
    if (!formData.timeSlot) errs.timeSlot = "Chọn giờ khám";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle final form submit with better error handling
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
      setCount(count => count + 1); // Increment count for debugging
      console.log("Creating appointment with payload:", payload);
      const response = await createAppointment(payload);
      console.log("Appointment created:", response);

      // Xóa cache để refresh slots sau khi đặt lịch thành công
      const cacheKey = `${formData.doctorId}-${formData.date}`;
      slotsCache.current.delete(cacheKey);

      setShowSuccess(true);
      setTimeout(handleClose, 2000);
    } catch (err) {
      console.error("Create appointment error:", err.response?.status, err.response?.data);
      
      // Xử lý các lỗi cụ thể từ backend
      let errorMsg = "Đặt lịch thất bại: ";
      
      if (err.response?.status === 409) {
        errorMsg += "Lịch hẹn đã tồn tại hoặc khung giờ đã được đặt.";
      } else if (err.response?.data?.message?.includes('unique result')) {
        errorMsg += "Dữ liệu bị trùng lặp. Vui lòng chọn lại khung giờ.";
      } else if (err.response?.data?.message?.includes('maximum')) {
        errorMsg += "Bạn đã đạt giới hạn số lịch hẹn (tối đa 3 lịch).";
      } else if (err.response?.data?.message) {
        errorMsg += err.response.data.message;
      } else {
        errorMsg += "Lỗi không xác định. Vui lòng thử lại.";
      }
      
      setErrorMessage(errorMsg);
      
      // Nếu lỗi liên quan đến slots, refresh lại slots
      if (err.response?.status === 409 || err.response?.data?.message?.includes('unique')) {
        setTimeout(() => {
          refreshSlots();
        }, 1000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle field changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Chỉ reset timeSlot khi thay đổi doctor hoặc date
      ...(field === "doctorId" || field === "date" ? { timeSlot: "" } : {}),
    }));
    
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setErrorMessage("");
  };

  // Reset and close
  const handleClose = () => {
    // Cancel any pending requests
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (abortController.current) {
      abortController.current.abort();
    }

    setFormData({ doctorId: "", date: "", timeSlot: "", notes: "" });
    setErrors({});
    setShowSuccess(false);
    setErrorMessage("");
    setTimeSlots([]);
    
    // Clear cache nếu cần
    // slotsCache.current.clear();
    
    onClose();
  };

  // Function để clear cache và refresh slots
  const refreshSlots = useCallback((clearAll = false) => {
    const { doctorId, date } = formData;
    
    if (clearAll) {
      // Clear toàn bộ cache
      slotsCache.current.clear();
      console.log('Cleared all slots cache');
    } else if (doctorId && date) {
      // Clear cache cho combination cụ thể
      const cacheKey = `${doctorId}-${date}`;
      slotsCache.current.delete(cacheKey);
      console.log('Cleared cache for:', cacheKey);
    }
    
    // Fetch lại nếu có đủ thông tin
    if (doctorId && date) {
      fetchSlotsDebounced(doctorId, date);
    }
  }, [formData.doctorId, formData.date, fetchSlotsDebounced]);

  // Function để check và clean expired cache
  const cleanExpiredCache = useCallback(() => {
    const now = Date.now();
    const keysToDelete = [];
    
    slotsCache.current.forEach((value, key) => {
      if (value.expiry && now > value.expiry) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      slotsCache.current.delete(key);
      console.log('Cleaned expired cache:', key);
    });
  }, []);

  // Clean expired cache mỗi 2 phút
  useEffect(() => {
    const cleanupInterval = setInterval(cleanExpiredCache, 2 * 60 * 1000);
    return () => clearInterval(cleanupInterval);
  }, [cleanExpiredCache]);

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
    refreshSlots, // Export để có thể refresh manual
    cleanExpiredCache, // Export để có thể clean cache manual
  };
};

export default useBookingForm;