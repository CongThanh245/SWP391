import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
import styles from "./ReceptionistDashboard.module.css";

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Menu items cho receptionist
  const menuItems = [
    {
      key: "dashboard",
      label: "Trang chủ",
      icon: User,
      path: "/receptionist-dashboard",
    },
    {
      key: "appointment",
      label: "Xem lịch hẹn",
      icon: ClipboardList,
      path: "/receptionist-dashboard/appointment",
    },
    {
      key: "test-results",
      label: "Nhập kết quả xét nghiệm",
      icon: ClipboardList,
      path: "/receptionist-dashboard/test-results",
    },
    {
      key: "search-patients",
      label: "Danh sách bệnh nhân",
      icon: Search,
      path: "/receptionist-dashboard/patients",
    },
    {
      key: "search-doctors",
      label: "Danh sách bác sĩ",
      icon: Search,
      path: "/receptionist-dashboard/doctors",
    },
    {
      key: "create-blog",
      label: "Tạo blog",
      icon: Plus,
      path: "/receptionist-dashboard/create-blog",
    },
    {
      key: "blog-list",
      label: "Danh sách blog",
      icon: FileText,
      path: "/receptionist-dashboard/blog-list",
    },
  ];

  // Thông tin user
  const userInfo = {
    name: "Nguyễn Thị Lan",
    role: "receptionist",
  };

  // Xử lý khi click vào menu
  const handleMenuClick = (key) => {
    const item = menuItems.find((item) => item.key === key);
    navigate(item.path);
  };

  // Nội dung trang chủ của dashboard
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
          {[
            {
              label: "Lịch hẹn hôm nay",
              value: "24",
              color: "blue",
              icon: Calendar,
            },
            { label: "Bệnh nhân mới", value: "8", color: "green", icon: Users },
            {
              label: "Chờ xác nhận",
              value: "12",
              color: "orange",
              icon: UserCheck,
            },
            {
              label: "Kết quả chờ nhập",
              value: "5",
              color: "purple",
              icon: ClipboardList,
            },
          ].map((stat, index) => (
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
          {[
            {
              title: "Tạo lịch hẹn mới",
              description: "Tạo lịch hẹn cho bệnh nhân",
              icon: Plus,
              color: "blue",
              path: "/receptionist-dashboard/appointment",
            },
            {
              title: "Xác nhận lịch hẹn",
              description: "Xác nhận các lịch hẹn đang chờ",
              icon: UserCheck,
              color: "green",
              path: "/receptionist-dashboard/appointment",
            },
            {
              title: "Tìm kiếm bệnh nhân",
              description: "Tìm kiếm thông tin bệnh nhân",
              icon: Search,
              color: "purple",
              path: "/receptionist-dashboard/patients",
            },
            {
              title: "Nhập kết quả xét nghiệm",
              description: "Nhập kết quả xét nghiệm mới",
              icon: FileText,
              color: "orange",
              path: "/receptionist-dashboard/test-results",
            },
          ].map((action, index) => (
            <div
              key={index}
              className={`${styles.actionCard} ${styles[action.color]}`}
            >
              <div className={styles.actionIcon}>
                <action.icon size={32} />
              </div>
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

      {/* Hoạt động gần đây */}
      <div className={styles.recentActivitySection}>
        <h3 className={styles.sectionTitle}>Hoạt động gần đây</h3>
        <div className={styles.activityList}>
          {[
            {
              icon: Calendar,
              text: "<strong>Nguyễn Văn A</strong> đã đặt lịch hẹn lúc 14:30",
              time: "10 phút trước",
            },
            {
              icon: UserCheck,
              text: "<strong>Trần Thị B</strong> đã xác nhận lịch hẹn",
              time: "25 phút trước",
            },
            {
              icon: ClipboardList,
              text: "Kết quả xét nghiệm cho <strong>Lê Văn C</strong> đã được cập nhật",
              time: "1 giờ trước",
            },
          ].map((activity, index) => (
            <div key={index} className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <activity.icon size={20} />
              </div>
              <div className={styles.activityContent}>
                <p
                  className={styles.activityText}
                  dangerouslySetInnerHTML={{ __html: activity.text }}
                />
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getActiveItem = () => {
    return menuItems.find((item) => {
      const isExactMatch = location.pathname === item.path;
      const isNestedMatch = location.pathname.startsWith(item.path + "/") && item.path !== "/receptionist-dashboard";
      return isExactMatch || (isNestedMatch && item.path.length > "/receptionist-dashboard".length);
    })?.key || "dashboard";
  };

  const activeItem = getActiveItem();

  return (
    <StaffLayout
      sidebar={
        <StaffSidebar
          menuItems={menuItems}
          activeItem={activeItem}
          onItemClick={(key) =>
            handleMenuClick(key, menuItems.find((item) => item.key === key).path)
          }
          userRole="receptionist"
          userInfo={userInfo}
        />
      }
    >
      <Outlet />
    </StaffLayout>
  );
};

export default ReceptionistDashboard;