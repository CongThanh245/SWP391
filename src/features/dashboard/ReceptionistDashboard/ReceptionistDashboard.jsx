// src/features/receptionist/pages/ReceptionistDashboard.jsx
import React, { useState } from "react";
import {
  Calendar,
  Users,
  UserCheck,
  ClipboardList,
  Plus,
  Search,
  User,
  FileText,
} from "lucide-react";
import StaffLayout from "@components/layout/StaffLayout/StaffLayout";
import StaffSidebar from "@components/common/Sidebar/StaffSidebar/StaffSidebar.jsx";
import Button from "@components/common/Button/Button";

// Import các page components


import styles from "./ReceptionistDashboard.module.css";
import AppointmentManagement from "@features/appointment/pages/AppointmentManagement/AppointmentManagement";
import PreTestResult from "@features/test-result/pages/PreTestResult";
import PatientList from "@features/patient/pages/PatientList/PatientList";
import DoctorList from "@features/doctor/pages/DoctorList/DoctorList";

const ReceptionistDashboard = () => {
  const [activeItem, setActiveItem] = useState("dashboard"); // Default là dashboard

  // Menu items cho receptionist - cấu trúc đơn giản phù hợp với StaffSidebar
  const menuItems = [
    {
      key: "dashboard",
      label: "Trang chủ",
      icon: User,
    },
    {
      key: "appointment",
      label: "Xem lịch hẹn",
      icon: ClipboardList,
    },
    {
      key: "test-results",
      label: "Nhập kết quả xét nghiệm",
      icon: ClipboardList,
    },
    { 
      key: "search-patients", 
      label: "Danh sách bệnh nhân", 
      icon: Search 
    },
    { 
      key: "search-doctors", 
      label: "Danh sách bác sĩ", 
      icon: Search 
    },
    { 
      key: "create-blog", 
      label: "Tạo blog", 
      icon: Plus 
    },
    { 
      key: "blog-list", 
      label: "Danh sách blog", 
      icon: FileText 
    },
  ];

  // Thông tin user
  const userInfo = {
    name: "Nguyễn Thị Lan",
    role: "receptionist",
  };

  // Dữ liệu cho dashboard home
  const statsData = [
    { label: "Lịch hẹn hôm nay", value: "24", color: "blue", icon: Calendar },
    { label: "Bệnh nhân mới", value: "8", color: "green", icon: Users },
    { label: "Chờ xác nhận", value: "12", color: "orange", icon: UserCheck },
    {
      label: "Kết quả chờ nhập",
      value: "5",
      color: "purple",
      icon: ClipboardList,
    },
  ];

  const quickActions = [
    {
      title: "Tạo lịch hẹn mới",
      description: "Tạo lịch hẹn cho bệnh nhân",
      icon: Plus,
      color: "blue",
      action: () => setActiveItem("appointment"),
    },
    {
      title: "Xác nhận lịch hẹn",
      description: "Xác nhận các lịch hẹn đang chờ",
      icon: UserCheck,
      color: "green",
      action: () => setActiveItem("appointment"),
    },
    {
      title: "Tìm kiếm bệnh nhân",
      description: "Tìm kiếm thông tin bệnh nhân",
      icon: Search,
      color: "purple",
      action: () => setActiveItem("search-patients"),
    },
    {
      title: "Nhập kết quả xét nghiệm",
      description: "Nhập kết quả xét nghiệm mới",
      icon: FileText,
      color: "orange",
      action: () => setActiveItem("test-results"),
    },
  ];

  const handleMenuClick = (key) => {
    setActiveItem(key);
  };

  // Function để render content dựa trên activeItem
  const renderContent = () => {
    switch (activeItem) {
      case "appointment":
        return <AppointmentManagement />;
      case "test-results":
        return <PreTestResult />;
      case "search-patients":
        return <PatientList />;
      case "search-doctors":
        return <DoctorList />;
      case "create-blog":
        // Tạm thời return placeholder, bạn cần tạo component này
        return <div>Create Blog Page - Coming Soon</div>;
      case "blog-list":
        // Tạm thời return placeholder, bạn cần tạo component này
        return <div>Blog List Page - Coming Soon</div>;
      case "dashboard":
      default:
        return renderDashboardHome();
    }
  };

  // Dashboard home content
  const renderDashboardHome = () => (
    <div className={styles.dashboard}>
      {/* Header với thông tin user */}
      <div className={styles.dashboardHeader}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <User size={24} />
          </div>
          <div className={styles.userDetails}>
            <h2 className={styles.welcomeText}>Chào mừng, Receptionist</h2>
            <p className={styles.subtitle}>
              Quản lý lịch hẹn, bệnh nhân và các hoạt động hàng ngày
            </p>
          </div>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={`${styles.statCard} ${styles[stat.color]}`}
            >
              <div className={styles.statIcon}>
                <stat.icon size={24} />
              </div>
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
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`${styles.actionCard} ${styles[action.color]}`}
            >
              <div className={styles.actionIcon}>
                <action.icon size={32} />
              </div>
              <div className={styles.actionContent}>
                <h4 className={styles.actionTitle}>{action.title}</h4>
                <p className={styles.actionDescription}>
                  {action.description}
                </p>
              </div>
              <div className={styles.actionButton}>
                <Button variant="primary" onClick={action.action}>
                  Thực hiện
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hoạt động gần đây */}
      <div className={styles.recentActivitySection}>
        <h3 className={styles.sectionTitle}>Hoạt động gần đây</h3>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>
              <Calendar size={20} />
            </div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>
                <strong>Nguyễn Văn A</strong> đã đặt lịch hẹn lúc 14:30
              </p>
              <span className={styles.activityTime}>10 phút trước</span>
            </div>
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>
              <UserCheck size={20} />
            </div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>
                <strong>Trần Thị B</strong> đã xác nhận lịch hẹn
              </p>
              <span className={styles.activityTime}>25 phút trước</span>
            </div>
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>
              <ClipboardList size={20} />
            </div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>
                Kết quả xét nghiệm cho <strong>Lê Văn C</strong> đã được cập
                nhật
              </p>
              <span className={styles.activityTime}>1 giờ trước</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <StaffLayout
      sidebar={
        <StaffSidebar
          menuItems={menuItems}
          activeItem={activeItem}
          onItemClick={handleMenuClick}
          userRole="receptionist"
          userInfo={userInfo}
        />
      }
    >
      {renderContent()}
    </StaffLayout>
  );
};

export default ReceptionistDashboard;