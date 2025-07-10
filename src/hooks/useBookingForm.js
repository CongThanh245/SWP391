import { useState, useEffect } from "react"; // Thêm useEffect
import { createAppointment } from "@api/appointmentApi";
import { useDoctors } from "./useDoctors"; 
import  useTimeSlots  from "./useTimeSlots";
import  usePatient  from "./usePatient";
import  {translateError}  from "../utils/errorUtils";
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
  const today = new Date().toISOString().split("T")[0];

  const { patientId, error: patientError } = usePatient();
  const { doctors, error: doctorsError } = useDoctors();
  const { timeSlots, loadingSlots, error: slotsError } = useTimeSlots(
    formData.doctorId,
    formData.date
  );
  const { uploadedFiles, fileErrorMessage } = usePatientFiles(patientId);

  // Quản lý lỗi trong useEffect
  useEffect(() => {
    if (patientError) {
      setErrorMessage(patientError);
    } else if (fileErrorMessage) {
      setErrorMessage(fileErrorMessage);
    } else if (doctorsError) {
      setErrorMessage(doctorsError);
    } else if (slotsError) {
      setErrorMessage(slotsError);
    } else {
      setErrorMessage("");
    }
  }, [patientError, fileErrorMessage, doctorsError, slotsError]);

  const validateForm = () => {
    const errs = {};
    if (!formData.doctorId) errs.doctorId = "Chọn bác sĩ";
    if (!formData.date) errs.date = "Chọn ngày";
    if (!formData.timeSlot) errs.timeSlot = "Chọn giờ khám";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
      setTimeout(handleClose, 100);
    } catch (err) {
      console.error("Create appointment error:", err);
      const errorCode = err.response?.data?.businessErrorCode;
      const errorMessageFromBackend =
        err.response?.data?.error || err.response?.data?.message;
      const translatedMessage = translateError(errorCode, errorMessageFromBackend);
      setErrorMessage(translatedMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "doctorId" || field === "date" ? { timeSlot: "" } : {}),
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setErrorMessage("");
  };

  const handleClose = () => {
    setFormData({ doctorId: "", date: "", timeSlot: "", notes: "", files: [] });
    setErrors({});
    setShowSuccess(false);
    setErrorMessage("");
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