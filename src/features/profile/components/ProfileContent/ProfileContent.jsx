import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ProfileCard from "../ProfileCard/ProfileCard";
import PatientInfo from "../PatientInfo/PatientInfo";
import BaseModal from "@components/common/BaseModal/BaseModal";
import styles from "./ProfileContent.module.css";
import { formatDate, parseDateForInput, formatDateForAPI } from "@utils/format";
import { updatePatient } from "@api/patientApi";
import { useToast } from "@hooks/use-toast";

// Validation Schema với Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được vượt quá 100 ký tự")
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/, "Họ tên chỉ được chứa chữ cái và khoảng trắng")
    .required("Họ tên là bắt buộc"),
  phone: Yup.string()
    .transform((value) => value.replace(/[\s-]/g, "")) // Remove spaces and dashes
    .matches(
      /^(\+84|0)[3-9]\d{8}$/,
      "Nhập số điện thoại hợp lệ (VD: 0901234567 hoặc +84901234567)"
    )
    .required("Số điện thoại là bắt buộc"),
  address: Yup.string()
    .max(255, "Địa chỉ không được vượt quá 255 ký tự")
    .required("Địa chỉ là bắt buộc"),
  dateOfBirth: Yup.date()
    .typeError("Ngày sinh phải là định dạng hợp lệ")
    .required("Ngày sinh là bắt buộc")
    .max(new Date(), "Ngày sinh phải trong quá khứ")
    .test("age", "Tuổi phải từ 1 đến 120", function (value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 1 && age <= 120;
    }),
  gender: Yup.string()
    .oneOf(
      ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"],
      "Vui lòng chọn giới tính"
    )
    .required("Giới tính là bắt buộc"),
  emergencyContact: Yup.string()
    .transform((value) => value.replace(/[\s-]/g, ""))
    .matches(
      /^(\+84|0)[3-9]\d{8}$/,
      "Nhập số điện thoại liên hệ khẩn cấp hợp lệ (VD: 0901234567 hoặc +84901234567)"
    )
    .required("Số liên hệ khẩn cấp là bắt buộc"),
  maritalStatus: Yup.string()
    .oneOf(
      ["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"],
      "Vui lòng chọn tình trạng hôn nhân"
    )
    .nullable(),
  marriageDate: Yup.date()
    .typeError("Ngày kết hôn phải là định dạng hợp lệ")
    .max(new Date(), "Ngày kết hôn không thể trong tương lai")
    .nullable(),
  spouseName: Yup.string()
    .min(2, "Tên người đi kèm phải có ít nhất 2 ký tự")
    .max(100, "Tên người đi kèm không được vượt quá 100 ký tự")
    .matches(
      /^[a-zA-ZÀ-ỹ\s]+$/,
      "Tên người đi kèm chỉ được chứa chữ cái và khoảng trắng"
    )
    .nullable(),
  spousePhone: Yup.string()
    .transform((value) => value.replace(/[\s-]/g, ""))
    .matches(
      /^(\+84|0)[3-9]\d{8}$/,
      "Nhập số điện thoại hợp lệ (VD: 0901234567 hoặc +84901234567)"
    )
    .nullable(),
  spouseAddress: Yup.string()
    .max(255, "Địa chỉ người đi kèm không được vượt quá 255 ký tự")
    .nullable(),
  spouseEmergencyContact: Yup.string()
    .transform((value) => value.replace(/[\s-]/g, ""))
    .matches(
      /^(\+84|0)[3-9]\d{8}$/,
      "Nhập số điện thoại liên hệ khẩn cấp hợp lệ (VD: 0901234567 hoặc +84901234567)"
    )
    .nullable(),
  spouseDateOfBirth: Yup.date()
    .typeError("Ngày sinh người đi kèm phải là định dạng hợp lệ")
    .max(new Date(), "Ngày sinh phải trong quá khứ")
    .nullable(),
  spouseGender: Yup.string()
    .oneOf(
      ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"],
      "Vui lòng chọn giới tính người đi kèm"
    )
    .nullable(),
});

const ProfileContent = () => {
  const { userData, rawUserData } = useOutletContext() || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const genderMap = {
    MALE: "Nam",
    FEMALE: "Nữ",
    OTHER: "Khác",
  };

  const maritalStatusMap = {
    SINGLE: "Độc thân",
    MARRIED: "Đã kết hôn",
    DIVORCED: "Đã ly hôn",
    WIDOWED: "Goá",
  };

  const displayData = {
    name: userData?.name || "Chưa có tên",
    patientId: userData?.patientId || "BN001234",
    joinDate: userData?.joinDate || "Chưa cập nhật",
    birthDate: userData?.birthDate || "Chưa cập nhật",
    marriageDate: userData?.marriageDate || "Chưa cập nhật",
    address: userData?.address || "Chưa cập nhật",
    phone: userData?.phone || "Chưa cập nhật",
    gender: genderMap[userData?.gender] || "Chưa cập nhật",
    email: userData?.email || "Chưa cập nhật",
    maritalStatus: maritalStatusMap[userData?.maritalStatus] || "Chưa cập nhật",
    emergencyContact: userData?.emergencyContact || "Chưa cập nhật",
    image: userData?.image || null,
    spouseName: userData?.spouseName || "Chưa cập nhật",
    spouseAddress: userData?.spouseAddress || "Chưa cập nhật",
    spousePhone: userData?.spousePhone || "Chưa cập nhật",
    spouseEmergencyContact: userData?.spouseEmergencyContact || "Chưa cập nhật",
    spouseBirthDate: userData?.spouseBirthDate || "Chưa cập nhật",
    spouseGender: genderMap[userData?.spouseGender] || "Chưa cập nhật",
  };

  const getInitialValues = () => ({
    name: rawUserData?.patientName || "",
    phone: rawUserData?.patientPhone || "",
    address: rawUserData?.patientAddress || "",
    dateOfBirth: rawUserData?.dateOfBirth || "",
    gender: rawUserData?.gender || "",
    emergencyContact: rawUserData?.emergencyContact || "", // Added emergencyContact
    spouseName: rawUserData?.spousePatientName || "",
    spousePhone: rawUserData?.spousePatientPhone || "",
    spouseAddress: rawUserData?.spousePatientAddress || "",
    spouseEmergencyContact: rawUserData?.spouseEmergencyContact || "",
    spouseDateOfBirth: rawUserData?.spouseDateOfBirth || "",
    spouseGender: rawUserData?.spouseGender || "",
  });

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsSubmitting(true);

    const payload = {
      patientName: values.name.trim(),
      patientPhone: values.phone.trim(),
      patientAddress: values.address.trim(),
      dateOfBirth: formatDateForAPI(values.dateOfBirth),
      gender: values.gender,
      emergencyContact: values.emergencyContact.trim(), // Added emergencyContact
      spousePatientName: values.spouseName ? values.spouseName.trim() : null,
      spousePatientPhone: values.spousePhone ? values.spousePhone.trim() : null,
      spousePatientAddress: values.spouseAddress
        ? values.spouseAddress.trim()
        : null,
      spouseEmergencyContact: values.spouseEmergencyContact
        ? values.spouseEmergencyContact.trim()
        : null,
      spouseDateOfBirth: formatDateForAPI(values.spouseDateOfBirth),
      spouseGender: values.spouseGender || null,
    };

    try {
      const updated = await updatePatient(payload);
      localStorage.setItem("user", JSON.stringify(updated));
      setIsModalOpen(false);
      toast({
        title: "Cập nhật thành công",
        description: "Đã cập nhật hồ sơ của bạn.",
        variant: "success",
      });
      window.location.reload();
    } catch (error) {
      console.error("Cập nhật hồ sơ thất bại:", error);
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((field) => {
          setFieldError(field, serverErrors[field]);
        });
      } else {
        alert("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  if (!userData || !rawUserData) return <div>Đang tải...</div>;

  return (
    <div>
      <ProfileCard user={displayData} onEdit={handleEdit} />
      <PatientInfo user={displayData} onEdit={handleEdit} />

      <BaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Chỉnh sửa thông tin"
      >
        <Formik
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, errors, touched, isSubmitting: formikSubmitting }) => (
            <Form className={styles.editForm}>
              <div className={styles.detailGrid}>
                {/* Section: Thông tin cá nhân */}
                <div className={styles.sectionTitle}>Thông tin cá nhân</div>

                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Họ tên:</label>
                  <div>
                    <Field
                      type="text"
                      name="name"
                      className={`${styles.formInput} ${
                        errors.name && touched.name ? styles.inputError : ""
                      }`}
                      placeholder="Nhập họ và tên"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className={styles.errorMessage}
                    />
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Giới tính:</label>
                  <div>
                    <Field
                      as="select"
                      name="gender"
                      className={`${styles.formSelect} ${
                        errors.gender && touched.gender ? styles.inputError : ""
                      }`}
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className={styles.errorMessage}
                    />
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Số điện thoại:</label>
                  <div>
                    <Field
                      type="tel"
                      name="phone"
                      className={`${styles.formInput} ${
                        errors.phone && touched.phone ? styles.inputError : ""
                      }`}
                      placeholder="Nhập số điện thoại"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className={styles.errorMessage}
                    />
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Ngày sinh:</label>
                  <div>
                    <Field
                      type="date"
                      name="dateOfBirth"
                      className={`${styles.formInput} ${
                        errors.dateOfBirth && touched.dateOfBirth
                          ? styles.inputError
                          : ""
                      }`}
                    />
                    <ErrorMessage
                      name="dateOfBirth"
                      component="div"
                      className={styles.errorMessage}
                    />
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Địa chỉ:</label>
                  <div>
                    <Field
                      type="text"
                      name="address"
                      className={`${styles.formInput} ${
                        errors.address && touched.address
                          ? styles.inputError
                          : ""
                      }`}
                      placeholder="Nhập địa chỉ chi tiết"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className={styles.errorMessage}
                    />
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>
                    Liên hệ khẩn cấp:
                  </label>
                  <div>
                    <Field
                      type="tel"
                      name="emergencyContact"
                      className={`${styles.formInput} ${
                        errors.emergencyContact && touched.emergencyContact
                          ? styles.inputError
                          : ""
                      }`}
                      placeholder="Nhập số liên hệ khẩn cấp"
                    />
                    <ErrorMessage
                      name="emergencyContact"
                      component="div"
                      className={styles.errorMessage}
                    />
                  </div>
                </div>

                {/* Section: Thông tin người đi kèm */}
                <div className={styles.sectionTitle}>
                  Thông tin người đi kèm
                </div>

                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>
                    Tên người đi kèm:
                  </label>
                  <div>
                    <Field
                      type="text"
                      name="spouseName"
                      className={`${styles.formInput} ${
                        errors.spouseName && touched.spouseName
                          ? styles.inputError
                          : ""
                      }`}
                      placeholder="Nhập tên người đi kèm"
                    />
                    <ErrorMessage
                      name="spouseName"
                      component="div"
                      className={styles.errorMessage}
                    />
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Giới tính:</label>
                  <div>
                    <Field
                      as="select"
                      name="spouseGender"
                      className={`${styles.formSelect} ${
                        errors.spouseGender && touched.spouseGender
                          ? styles.inputError
                          : ""
                      }`}
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </Field>
                    <ErrorMessage
                      name="spouseGender"
                      component="div"
                      className={styles.errorMessage}
                    />
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Số điện thoại:</label>
                  <div>
                    <Field
                      type="tel"
                      name="spousePhone"
                      className={`${styles.formInput} ${
                        errors.spousePhone && touched.spousePhone
                          ? styles.inputError
                          : ""
                      }`}
                      placeholder="Nhập số điện thoại"
                    />
                    <ErrorMessage
                      name="spousePhone"
                      component="div"
                      className={styles.errorMessage}
                    />
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Ngày sinh:</label>
                  <div>
                    <Field
                      type="date"
                      name="spouseDateOfBirth"
                      className={`${styles.formInput} ${
                        errors.spouseDateOfBirth && touched.spouseDateOfBirth
                          ? styles.inputError
                          : ""
                      }`}
                    />
                    <ErrorMessage
                      name="spouseDateOfBirth"
                      component="div"
                      className={styles.errorMessage}
                    />
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>
                    Địa chỉ người đi kèm:
                  </label>
                  <div>
                    <Field
                      type="text"
                      name="spouseAddress"
                      className={`${styles.formInput} ${
                        errors.spouseAddress && touched.spouseAddress
                          ? styles.inputError
                          : ""
                      }`}
                      placeholder="Nhập địa chỉ người đi kèm"
                    />
                    <ErrorMessage
                      name="spouseAddress"
                      component="div"
                      className={styles.errorMessage}
                    />
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>
                    Liên hệ khẩn cấp:
                  </label>
                  <div>
                    <Field
                      type="tel"
                      name="spouseEmergencyContact"
                      className={`${styles.formInput} ${
                        errors.spouseEmergencyContact &&
                        touched.spouseEmergencyContact
                          ? styles.inputError
                          : ""
                      }`}
                      placeholder="Nhập số liên hệ khẩn cấp"
                    />
                    <ErrorMessage
                      name="spouseEmergencyContact"
                      component="div"
                      className={styles.errorMessage}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={`${styles.btnBase} ${styles.btnCancel}`}
                  disabled={formikSubmitting || isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={`${styles.btnBase} ${styles.btnUpdate}`}
                  disabled={formikSubmitting || isSubmitting}
                >
                  {formikSubmitting || isSubmitting
                    ? "Đang lưu..."
                    : "Lưu thay đổi"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </BaseModal>
    </div>
  );
};

export default ProfileContent;
