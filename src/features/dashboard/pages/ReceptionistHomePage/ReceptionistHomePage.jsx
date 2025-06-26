import React, { useState, useEffect, useContext } from "react";
import Button from "@components/common/Button/Button";
import styles from "../../components/ReceptionistDashboard/ReceptionistDashboard.module.css";
import { useNavigate } from "react-router-dom";
import { fetchReceptionistProfile } from "@api/receptionistApi";
import ReceptionistProfile from "@features/profile/pages/ReceptionistProfile/ReceptionistProfile";
import { AppointmentContext } from "@utils/AppointmentContext"; // Adjust path as needed

const ReceptionistHomePage = () => {
  const navigate = useNavigate();
  const [receptionistProfile, setReceptionistProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { appointmentCounts } = useContext(AppointmentContext);

  // Fetch receptionist profile on component mount
  useEffect(() => {
    const loadReceptionistProfile = async () => {
      try {
        setLoading(true);
        const profileData = await fetchReceptionistProfile();
        setReceptionistProfile(profileData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching receptionist profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReceptionistProfile();
  }, []);

  // Format name for display
  const getDisplayName = () => {
    if (loading) return "Đang tải...";
    if (error || !receptionistProfile?.receptionistName) return "Receptionist";
    return receptionistProfile.receptionistName;
  };

  // Get greeting message with name
  const getGreetingMessage = () => {
    const name = getDisplayName();
    return `Chào mừng, ${name}`;
  };

  return (
    <div className={styles.dashboard}>
      {/* Header với thông tin user */}
      <div className={styles.dashboardHeader}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4D3C2D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
              <path d="M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
              <path d="M12 17c-2.1 0-4-1.1-5-3" />
            </svg>
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userNameSection}>
              <h2 className={styles.welcomeText}>
                {getGreetingMessage()}
              </h2>
              {receptionistProfile && (
                <div className={styles.userMeta}>
                  {receptionistProfile.employeeId && (
                    <span className={styles.employeeId}>
                      ID: {receptionistProfile.employeeId}
                    </span>
                  )}
                </div>
              )}
            </div>
            <p className={styles.subtitle}>
              Quản lý lịch hẹn, bệnh nhân và các hoạt động hàng ngày
            </p>
          </div>
        </div>
      </div>
      <ReceptionistProfile />

      {/* Loading/Error States */}
      {loading && (
        <div className={styles.loadingSection}>
          <div className={styles.loadingSpinner}></div>
          <p>Đang tải thông tin...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorSection}>
          <div className={styles.errorMessage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
            <span>Không thể tải thông tin profile: {error}</span>
          </div>
        </div>
      )}

      {/* Thống kê tổng quan */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {[
            {
              label: "Lịch hẹn hôm nay",
              value: appointmentCounts.pending + appointmentCounts.confirmed, // Tổng pending và confirmed
              color: "blue",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4D3C2D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                </svg>
              ),
            },
            {
              label: "Chờ xác nhận",
              value: appointmentCounts.pending,
              color: "orange",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4D3C2D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m16 11 2 2 4-4" />
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              ),
            },
            {
              label: "Hoàn tất",
              value: appointmentCounts.completed,
              color: "purple",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4D3C2D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <path d="M12 11h4" />
                  <path d="M12 16h4" />
                  <path d="M8 11h.01" />
                  <path d="M8 16h.01" />
                </svg>
              ),
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`${styles.statCard} ${styles[stat.color]}`}
            >
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>{stat.value}</h3>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thao tác nhanh */}
      <div className={styles.quickActionsSection}>
        <h3 className={styles.sectionTitle}>Thao tác nhanh</h3>
        <div className={styles.actionsGrid}>
          {[
            {
              title: "Tạo lịch hẹn mới",
              description: "Tạo lịch hẹn cho bệnh nhân",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4D3C2D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              ),
              color: "blue",
              path: "/receptionist-dashboard/appointment",
            },
            {
              title: "Xác nhận lịch hẹn",
              description: "Xác nhận các lịch hẹn đang chờ",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4D3C2D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m16 11 2 2 4-4" />
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              ),
              color: "green",
              path: "/receptionist-dashboard/appointment",
            },
            {
              title: "Nhập kết quả xét nghiệm",
              description: "Nhập kết quả xét nghiệm mới",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4D3C2D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M3 10h18" />
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                </svg>
              ),
              color: "orange",
              path: "/receptionist-dashboard/test-results",
            },
          ].map((action, index) => (
            <div
              key={index}
              className={`${styles.actionCard} ${styles[action.color]}`}
            >
              <div className={styles.actionIcon}>{action.icon}</div>
              <div className={styles.actionContent}>
                <h4 className={styles.actionTitle}>{action.title}</h4>
                <p className={styles.actionDescription}>{action.description}</p>
              </div>
              <div className={styles.actionButton}>
                <Button
                  variant="primary"
                  onClick={() => navigate(action.path)}
                >
                  Thực hiện
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReceptionistHomePage;