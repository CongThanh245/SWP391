import React, { useCallback, memo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@components/common/Button/Button";
import styles from "./ReceptionistProfile.module.css";
import { updateReceptionistProfile } from "@api/receptionistApi";

// Validation schema với Yup
const validationSchema = Yup.object({
  receptionistName: Yup.string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên không được vượt quá 100 ký tự")
    .required("Họ và tên là bắt buộc"),
  receptionistPhone: Yup.string()
    .matches(/^(\+84|0)[3-9]\d{8}$/, "Số điện thoại không đúng định dạng Việt Nam")
    .required("Số điện thoại là bắt buộc"),
  receptionistAddress: Yup.string()
    .max(255, "Địa chỉ không được vượt quá 255 ký tự")
    .optional(),
});
const ReceptionistProfile = ({ receptionistProfile, refetchProfile }) => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // Format date
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  // Calculate age
  const calculateAge = useCallback((dateOfBirth) => {
    if (!dateOfBirth) return "Chưa cập nhật";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} tuổi`;
  }, []);

  // Format gender
  const formatGender = useCallback((gender) => {
    return gender === "MALE" ? "Nam" : gender === "FEMALE" ? "Nữ" : "Khác";
  }, []);

  // Format phone number
  const formatPhone = useCallback((phone) => {
    if (!phone) return "Chưa cập nhật";
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  }, []);

  // Memoized EditModal
  const EditModal = memo(({ isOpen, onClose, receptionistProfile, refetchProfile }) => {
    const formik = useFormik({
      initialValues: {
        receptionistName: receptionistProfile?.receptionistName || "",
        receptionistPhone: receptionistProfile?.receptionistPhone || "",
        receptionistAddress: receptionistProfile?.receptionistAddress || "",
      },
      enableReinitialize: true,
      validationSchema,
      onSubmit: async (values, { setSubmitting, setStatus }) => {
        try {
          setStatus(null);
          console.log("Submitting form with values:", values);
          await updateReceptionistProfile(values);
          setStatus({ success: "Cập nhật thông tin thành công!" });
          await refetchProfile();
          onClose();
        } catch (err) {
          setStatus({ error: "Cập nhật thất bại. Vui lòng kiểm tra lại thông tin." });
          console.error("Error updating profile:", err);
        } finally {
          setSubmitting(false);
        }
      },
    });

    const handleInputChange = useCallback(
      (e) => {
        console.log(`${e.target.name} input change:`, e.target.value);
        formik.handleChange(e);
      },
      [formik.handleChange]
    );

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Chỉnh sửa thông tin</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-xl">
              ×
            </button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="receptionistName"
                value={formik.values.receptionistName}
                onChange={handleInputChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-color"
                required
              />
              {formik.touched.receptionistName && formik.errors.receptionistName && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.receptionistName}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="receptionistPhone"
                value={formik.values.receptionistPhone}
                onChange={handleInputChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-color"
                placeholder="+84xxxxxxxxx"
                required
              />
              {formik.touched.receptionistPhone && formik.errors.receptionistPhone && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.receptionistPhone}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                name="receptionistAddress"
                value={formik.values.receptionistAddress}
                onChange={handleInputChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-color"
              />
              {formik.touched.receptionistAddress && formik.errors.receptionistAddress && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.receptionistAddress}</p>
              )}
            </div>
            {formik.status?.error && <p className="text-red-500 text-sm mb-4">{formik.status.error}</p>}
            {formik.status?.success && <p className="text-green-500 text-sm mb-4">{formik.status.success}</p>}
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                className={styles.modalSecondaryButton}
                onClick={onClose}
                disabled={formik.isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                className={styles.modalPrimaryButton}
                disabled={formik.isSubmitting}
              >
                Lưu
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  });

  if (!receptionistProfile) {
    return null; // Parent handles loading/error states
  }

  return (
    <div className={styles.profileContainer}>
      {/* Header */}
      <div className={styles.profileHeader}>
        <h1 className={styles.pageTitle}>Thông tin cá nhân</h1>
        <div className={styles.actionButtons}>
          <Button
            variant="primary"
            className={styles.primaryButton}
            onClick={() => {
              console.log("Opening edit modal");
              setIsEditModalOpen(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            Chỉnh sửa thông tin
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4D3C2D"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
              <path d="M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
              <path d="M12 17c-2.1 0-4-1.1-5-3" />
            </svg>
          </div>
          <div className={styles.nameSection}>
            <h2 className={styles.name}>
              {receptionistProfile?.receptionistName || "Chưa cập nhật"}
            </h2>
            <p className={styles.role}>Nhân viên lễ tân</p>
            <div className={styles.statusBadge}>
              <span
                className={`${styles.status} ${
                  receptionistProfile?.active ? styles.active : styles.inactive
                }`}
              >
                {receptionistProfile?.active ? "Đang hoạt động" : "Không hoạt động"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>Thông tin cơ bản</h3>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                    <path d="M12 18h.01" />
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Mã nhân viên</span>
                  <span className={styles.infoValue}>
                    {receptionistProfile?.employeeId || "Chưa cập nhật"}
                  </span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                    <path d="M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                    <path d="M12 17c-2.1 0-4-1.1-5-3" />
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Giới tính</span>
                  <span className={styles.infoValue}>
                    {formatGender(receptionistProfile?.gender)}
                  </span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Ngày sinh</span>
                  <span className={styles.infoValue}>
                    {formatDate(receptionistProfile?.dateOfBirth)} (
                    {calculateAge(receptionistProfile?.dateOfBirth)})
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>Thông tin liên hệ</h3>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Số điện thoại</span>
                  <span className={styles.infoValue}>
                    {formatPhone(receptionistProfile?.receptionistPhone)}
                  </span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Địa chỉ</span>
                  <span className={styles.infoValue}>
                    {receptionistProfile?.receptionistAddress || "Chưa cập nhật"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>Thông tin công việc</h3>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Ngày vào làm</span>
                  <span className={styles.infoValue}>
                    {formatDate(receptionistProfile?.joinDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        receptionistProfile={receptionistProfile}
        refetchProfile={refetchProfile}
      />
    </div>
  );
};

export default ReceptionistProfile;