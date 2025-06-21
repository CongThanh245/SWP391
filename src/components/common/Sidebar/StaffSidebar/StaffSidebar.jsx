import React from "react";
import styles from "./StaffSidebar.module.css";
import classNames from "classnames";
import { LogOut } from "lucide-react";
import { logout } from "@utils/authUtils";
import { useNavigate } from "react-router-dom";

const StaffSidebar = ({
  menuItems,
  activeItem,
  onItemClick,
  userRole = "staff",
  userInfo,
}) => {
  const navigate = useNavigate();

  const getRoleDisplayName = (role) => {
    const names = {
      receptionist: "Receptionist",
      doctor: "Bác sĩ",
      admin: "Quản trị viên",
      staff: "Nhân viên",
    };
    return names[role] || "Nhân viên";
  };

  // Function to render icon, handling both components and JSX
  const renderIcon = (icon) => {
    if (React.isValidElement(icon)) {
      return icon;
    } else if (typeof icon === "function") {
      return React.createElement(icon, { size: 20 });
    }
    return null;
  };

  return (
    <div className={styles.staffSidebar}>
      {/* User Info Section */}
      <div className={styles.userSection}>
        <div className={styles.userAvatar}>
          <span className={styles.avatarText}>
            {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "N"}
          </span>
        </div>
        <div className={styles.userInfo}>
          <h4 className={styles.userName}>
            {userInfo?.name || "Nguyễn Thị Lan"}
          </h4> 
          <span className={styles.userRole}>
            {getRoleDisplayName(userRole)}
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
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