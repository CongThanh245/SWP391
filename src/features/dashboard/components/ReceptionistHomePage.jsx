// @features/dashboard/components/DashboardHome.jsx
import React from "react";
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
import Button from "@components/common/Button/Button";
import styles from "../ReceptionistDashboard/ReceptionistDashboard.module.css";
const ReceptionistHomePage = () => {
  return (
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
            { label: "Bệnh nhân mới", value: "8", color: "green", icon: User },
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
                <Button variant="primary" onClick={() => navigate(action.path)}>
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
};

export default ReceptionistHomePage;