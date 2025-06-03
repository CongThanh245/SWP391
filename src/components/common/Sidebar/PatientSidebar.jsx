import React from 'react';
import styles from './PatientSidebar.module.css';
import classNames from 'classnames';

const Sidebar = ({ menuItems, activeItem, onItemClick, userRole = 'patient' }) => {
  const getRoleTitle = (role) => {
    const titles = {
      patient: 'Hồ sơ bệnh nhân',
      doctor: 'Quản lý bác sĩ',
      admin: 'Quản trị hệ thống'
    };
    return titles[role];
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {getRoleTitle(userRole)}
        </h3>
      </div>
      
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={classNames(
              styles.menuItem,
              { [styles.active]: activeItem === item.key }
            )}
            onClick={() => onItemClick(item.key)}
          >
            <item.icon size={20} className={styles.icon} />
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;