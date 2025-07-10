import { useState, useEffect } from "react";
import { getDoctorList } from "@api/doctorApi";
import apiClient from "@api/axiosConfig";
import { createAppointment } from "@api/appointmentApi";
import usePatientFiles from "./usePatientFiles";

const useBookingForm = (onClose) => {
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    timeSlot: "",
    notes: "",
    files: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Get patientId from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const patientId = user?.id; // Use user.id as specified
  const { uploadedFiles, fileErrorMessage } = usePatientFiles(patientId);

  const today = new Date().toISOString().split("T")[0];

  // Sync file error message with main error message
  useEffect(() => {
    const checkPatientId = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const patientId = user?.id;

      if (!patientId) {
        setErrorMessage("Không tìm thấy thông tin bệnh nhân trong bộ nhớ.");
      } else if (fileErrorMessage) {
        setErrorMessage(fileErrorMessage);
      } else {
        setErrorMessage("");
      }
    };

    const timer = setTimeout(checkPatientId, 100); // Trì hoãn 100ms

    return () => clearTimeout(timer); // Dọn dẹp timer
  }, [fileErrorMessage]);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const list = await getDoctorList();
        setDoctors(
          list.map((d) => ({ id: d.id, name: d.doctorName || d.name }))
        );
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

        let response = await apiClient.get("/slot", {
          params: { doctorId, date },
        });

        if (!response.data || response.data.length === 0) {
          console.log("No slots found, generating...");
          await apiClient.post("/slot/generate", null, {
            params: { doctorId, date },
          });

          response = await apiClient.get("/slot", {
            params: { doctorId, date },
          });
        }

        if (Array.isArray(response.data)) {
          const uniqueSlots = response.data.reduce((acc, slot) => {
            const existingSlot = acc.find((s) => s.time === slot.startTime);

            if (!existingSlot) {
              acc.push({
                id: slot.id,
                time: slot.startTime,
                available: !slot.booked,
              });
            } else if (existingSlot.available && !slot.booked) {
              // Do nothing
            } else if (!existingSlot.available && !slot.booked) {
              const index = acc.findIndex((s) => s.time === slot.startTime);
              acc[index] = {
                id: slot.id,
                time: slot.startTime,
                available: true,
              };
            }

            return acc;
          }, []);

          uniqueSlots.sort((a, b) => a.time.localeCompare(b.time));

          setTimeSlots(uniqueSlots);
          console.log(`Loaded ${uniqueSlots.length} unique slots`);

          if (uniqueSlots.length === 0) {
            setErrorMessage("Không có khung giờ khả dụng.");
          }
        } else {
          setErrorMessage("Dữ liệu khung giờ không hợp lệ.");
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        if (err.response?.status === 409) {
          try {
            const response = await apiClient.get("/slot", {
              params: { doctorId, date },
            });
            if (response.data && response.data.length > 0) {
              const uniqueSlots = response.data
                .filter(
                  (slot, index, arr) =>
                    arr.findIndex((s) => s.startTime === slot.startTime) ===
                    index
                )
                .map((slot) => ({
                  id: slot.id,
                  time: slot.startTime,
                  available: !slot.booked,
                }))
                .sort((a, b) => a.time.localeCompare(b.time));

              setTimeSlots(uniqueSlots);
            } else {
              setErrorMessage("Không có khung giờ khả dụng.");
            }
          } catch (retryErr) {
            setErrorMessage("Không thể tải khung giờ. Vui lòng thử lại.");
          }
        } else {
          setErrorMessage("Không thể tải khung giờ. Vui lòng thử lại.");
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
    // Optional: Require at least one file if needed
    // if (!formData.files.length) errs.files = "Chọn ít nhất một tài liệu";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle time slot focus
  const handleTimeSlotFocus = (e) => {
    if (!formData.doctorId || !formData.date) {
      e.target.blur();

      const newErrors = {};
      if (!formData.doctorId && !formData.date) {
        setErrorMessage(
          "Vui lòng chọn bác sĩ và ngày khám trước khi chọn giờ khám."
        );
      } else if (!formData.doctorId) {
        setErrorMessage("Vui lòng chọn bác sĩ trước khi chọn giờ khám.");
      } else if (!formData.date) {
        newErrors.date = "Vui lòng chọn ngày trước";
        setErrorMessage("Vui lòng chọn ngày khám trước khi chọn giờ khám.");
      }

      setErrors((prev) => ({ ...prev, ...newErrors }));
    }
  };

  // Handle file selection
  const handleFileSelection = (fileId) => {
    setFormData((prev) => {
      const files = prev.files.includes(fileId)
        ? prev.files.filter((id) => id !== fileId)
        : [...prev.files, fileId];
      return { ...prev, files };
    });
    setErrors((prev) => ({ ...prev, files: "" }));
    setErrorMessage("");
  };
  const translateError = (code, message) => {
    const errorMap = {
      400: {
        "Appointments must be booked at least 24 hours in advance":
          "Lịch hẹn phải được đặt trước ít nhất 24 giờ.",
      },
      100: {
        "You already have 3 appointments on this date. Please delete unnecessary appointments.":
          "Bạn đã có 3 lịch hẹn vào ngày này. Vui lòng hủy các lịch hẹn không cần thiết.",
        "You already have another appointment at this time.":
          "Bạn đã có lịch hẹn khác vào thời điểm này.",
        default: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
      },
      409: {
        default: "Khung giờ đã được đặt.",
      },
    };

    if (errorMap[code] && errorMap[code][message]) {
      return errorMap[code][message];
    }
    return errorMap[code]?.default || "Đã xảy ra lỗi. Vui lòng thử lại.";
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
        attachmentId: formData.files,
      };

      console.log("Creating appointment:", payload);
      await createAppointment(payload);

      setShowSuccess(true);
      setTimeout(handleClose, 1000);
    } catch (err) {
      console.error("Create appointment error:", err);

      const errorCode = err.response?.data?.businessErrorCode;
      const errorMessageFromBackend =
        err.response?.data?.error || err.response?.data?.message;

      // Dịch lỗi sang tiếng Việt
      const translatedMessage = translateError(
        errorCode,
        errorMessageFromBackend
      );

      setErrorMessage(translatedMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "doctorId" || field === "date" ? { timeSlot: "" } : {}),
    }));

    setErrors((prev) => ({ ...prev, [field]: "" }));
    setErrorMessage("");
  };

  // Handle close
  const handleClose = () => {
    setFormData({ doctorId: "", date: "", timeSlot: "", notes: "", files: [] });
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
    uploadedFiles,
    loadingSlots,
    today,
    handleInputChange,
    handleSubmit,
    handleClose,
    handleTimeSlotFocus,
    handleFileSelection,
  };
};

export default useBookingForm;
