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