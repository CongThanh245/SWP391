import React, { useEffect, useState } from "react";
import styles from "./StaffSidebar.module.css";
import classNames from "classnames";
import { LogOut } from "lucide-react";
import { logout } from "@utils/authUtils";
import { useNavigate } from "react-router-dom";
import apiClient from "@api/axiosConfig";

const StaffSidebar = ({ menuItems, activeItem, onItemClick }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/receptionists/me")
      .then((res) => {
        const receptionist = res.data;
        const userData = {
          name: receptionist.receptionistName,
          employeeId: receptionist.employeeId,
          phone: receptionist.receptionistPhone,
        };
        setUser(userData);
        setRole("receptionist");
        // Optional: Lưu vào localStorage nếu cần
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", "receptionist");
      })
      .catch((err) => {
        console.error("Lỗi lấy thông tin lễ tân:", err);
        setUser(null);
        setRole(null);
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getRoleDisplayName = (role) => {
    const names = {
      receptionist: "Receptionist",
    };
    return names[role] || "";
  };

  const renderIcon = (icon) => {
    if (React.isValidElement(icon)) {
      return icon;
    } else if (typeof icon === "function") {
      return React.createElement(icon, { size: 20 });
    }
    return null;
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang fetch API
  }

  return (
    <div className={styles.staffSidebar}>
      {/* User Info */}
      <div className={styles.userSection}>
        <div className={styles.userAvatar}>
          <span className={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "N"}
          </span>
        </div>
        <div className={styles.userInfo}>
          <h4 className={styles.userName}>{user?.name || "Receptionist"}</h4>
          <span className={styles.userRole}>{getRoleDisplayName(role)}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={classNames(styles.menuItem, {
              [styles.active]: activeItem === item.key,
            })}
            onClick={() => onItemClick(item.key)}
          >
            {item.icon && (
              <div className={styles.menuItemIcon}>{renderIcon(item.icon)}</div>
            )}
            <span className={styles.menuItemLabel}>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        <div className={styles.footerInfo}>
          <button onClick={() => logout(navigate)}>
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffSidebar;