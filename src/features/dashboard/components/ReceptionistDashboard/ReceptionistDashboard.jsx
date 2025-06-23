import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
          <path d="M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          <path d="M12 17c-2.1 0-4-1.1-5-3" />
        </svg>
      ),
      path: "/receptionist-dashboard",
    },
    {
      key: "appointment",
      label: "Quản lí lịch hẹn",
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
          <path d="m9 14 2 2 4-4" />
        </svg>
      ),
      path: "/receptionist-dashboard/appointment",
    },
    {
      key: "test-results",
      label: "Nhập kết quả xét nghiệm",
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
      path: "/receptionist-dashboard/test-results",
    },
    {
      key: "search-patients",
      label: "Danh sách bệnh nhân",
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
          <circle cx="10" cy="7" r="4" />
          <path d="M10.3 15H7a4 4 0 0 0-4 4v2" />
          <circle cx="17" cy="17" r="3" />
          <path d="m21 21-1.9-1.9" />
        </svg>
      ),
      path: "/receptionist-dashboard/patients",
    },
    {
      key: "search-doctors",
      label: "Danh sách bác sĩ",
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
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      ),
      path: "/receptionist-dashboard/doctors",
    },
    // {
    //   key: "create-blog",
    //   label: "Tạo blog",
    //   icon: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       width="24"
    //       height="24"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //       stroke="#4D3C2D"
    //       strokeWidth="2"
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //     >
    //       <path d="M5 12h14" />
    //       <path d="M12 5v14" />
    //     </svg>
    //   ),
    //   path: "/receptionist-dashboard/create-blog",
    // },
    // {
    //   key: "blog-list",
    //   label: "Danh sách blog",
    //   icon: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       width="24"
    //       height="24"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //       stroke="#4D3C2D"
    //       strokeWidth="2"
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //     >
    //       <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    //       <path d="M3 10h18" />
    //       <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    //     </svg>
    //   ),
    //   path: "/receptionist-dashboard/blog-list",
    // },
  ];


  // Xử lý khi click vào menu
  const handleMenuClick = (key) => {
    const item = menuItems.find((item) => item.key === key);
    navigate(item.path);
  };

  const getActiveItem = () => {
    return (
      menuItems.find((item) => {
        const isExactMatch = location.pathname === item.path;
        const isNestedMatch =
          location.pathname.startsWith(item.path + "/") &&
          item.path !== "/receptionist-dashboard";
        return (
          isExactMatch ||
          (isNestedMatch && item.path.length > "/receptionist-dashboard".length)
        );
      })?.key || "dashboard"
    );
  };

  const activeItem = getActiveItem();

  return (
    <StaffLayout
      sidebar={
        <StaffSidebar
          menuItems={menuItems}
          activeItem={activeItem}
          onItemClick={(key) =>
            handleMenuClick(
              key,
              menuItems.find((item) => item.key === key).path
            )
          }
        />
      }
    >
      <Outlet />
    </StaffLayout>
  );
};

export default ReceptionistDashboard;