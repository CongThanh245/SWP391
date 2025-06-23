// @features/dashboard/components/ReceptionistProfile.jsx
import React, { useState, useEffect } from "react";
import Button from "@components/common/Button/Button";
import styles from "./ReceptionistProfile.module.css";
import { useNavigate } from "react-router-dom";
import { fetchReceptionistProfile } from "@api/receptionistApi"; // Giả sử apiClient được cấu hình đúng

const ReceptionistProfile = () => {
  const navigate = useNavigate();
  const [receptionistProfile, setReceptionistProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch receptionist profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchReceptionistProfile();
        setReceptionistProfile(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải thông tin cá nhân. Vui lòng thử lại sau.");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Format date (e.g., from ISO string to DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "Chưa cập nhật";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return `${age} tuổi`;
  };

  // Format gender
  const formatGender = (gender) => {
    return gender === "MALE" ? "Nam" : gender === "FEMALE" ? "Nữ" : "Khác";
  };

  // Format phone number
  const formatPhone = (phone) => {
    if (!phone) return "Chưa cập nhật";
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  };

  if (loading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.errorState}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#DC2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
          <h3>Không thể tải thông tin</h3>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      {/* Header */}
      <div className={styles.profileHeader}>
        <h1 className={styles.pageTitle}>Thông tin cá nhân</h1>
      </div>

      {/* Profile Card */}
      <div className={styles.profileCard}>
        {/* Avatar Section */}
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

        {/* Information Grid */}
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

        {/* Action Buttons */}
        {/* <div className={styles.actionButtons}>
          <Button
            variant="primary"
            onClick={() => navigate("/receptionist-dashboard/profile/edit")}
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

          <Button
            variant="secondary"
            onClick={() => navigate("/receptionist-dashboard/change-password")}
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
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Đổi mật khẩu
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default ReceptionistProfile;