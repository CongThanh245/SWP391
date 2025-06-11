// src/components/common/Sidebar/PatientSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './PatientSidebar.module.css';
import classNames from 'classnames';

const Sidebar = ({ menuItems, userRole }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Hồ sơ bệnh nhân</h3>
      </div>
      
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.path} // Sử dụng path từ menuItems để điều hướng
            className={({ isActive }) =>
              classNames(styles.menuItem, { [styles.active]: isActive })
            }
          >
            <item.icon size={20} className={styles.icon} />
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;