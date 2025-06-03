// src/components/layout/StaffLayout/StaffLayout.jsx
import React from 'react';
import styles from './StaffLayout.module.css';

const StaffLayout = ({ children, sidebar }) => {
  return (
    <div className={styles.staffLayout}>
      {sidebar}
      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  );
};

export default StaffLayout;