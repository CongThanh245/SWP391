// src/components/layout/StaffLayout/StaffLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './StaffLayout.module.css';

const StaffLayout = ({ sidebar }) => {
  return (
    <div className={styles.staffLayout}>
      {sidebar}
      <div className={styles.mainContent}>
        <Outlet /> {/* Thay thế children bằng Outlet */}
      </div>
    </div>
  );
};

export default StaffLayout;