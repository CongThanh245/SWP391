import React from "react";
import styles from "./StaffSidebar.module.css";
import classNames from "classnames";

const StaffSidebar = ({
  menuItems,
  activeItem,
  onItemClick,
  userRole = "staff",
  userInfo,
}) => {
  const getRoleDisplayName = (role) => {
    const names = {
      receptionist: "Receptionist",
      doctor: "Bác sĩ",
      admin: "Quản trị viên",
      staff: "Nhân viên",
    };
    return names[role] || "Nhân viên";
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
              <div className={styles.menuItemIcon}>
                <item.icon size={20} />
              </div>
            )}
            <span className={styles.menuItemLabel}>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        <div className={styles.footerInfo}>
          <p className={styles.clinicName}>FertiCare</p>
          <p className={styles.clinicSubtitle}>Điều trị hiếm muộn</p>
        </div>
      </div>
    </div>
  );
};

export default StaffSidebar;