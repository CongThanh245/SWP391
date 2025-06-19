// src/pages/AdminLogin/AdminLogin.jsx
import React from 'react';
import LoginForm from "@features/auth/components/LoginForm/LoginForm";
import styles from './AdminLoginPage.module.css'
const AdminLoginPage = () => {
  return (
    <div className={styles.adminContainer}>
      <div className={styles.formWrapper}>
        <LoginForm
          userType="admin"
          title="Đăng nhập Admin"
          subtitle="Chào mừng quản trị viên"
          apiEndpoint="http://localhost:8088/api/v1/auth/login-admin"
          redirectPath="/admin-dashboard"
        />
      </div>
    </div>
  );
};
export default AdminLoginPage;