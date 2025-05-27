import React from 'react';
import styles from './CommonLayout.module.css';

const CommonLayout = ({ children, sidebar, userRole = 'patient' }) => {
  return (
    <div className={styles.layout}>
      {sidebar}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default CommonLayout;