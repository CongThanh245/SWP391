// src/pages/ReceptionistLogin/ReceptionistLogin.jsx
import React from "react";
import LoginForm from "@features/auth/components/LoginForm/LoginForm";
import styles from "./ReceptionistLoginPage.module.css";
const ReceptionistLoginPage = () => {
  return (
    <div className={styles.receptionistContainer}>
      <div className={styles.formWrapper}>
        <LoginForm
          userType="receptionist"
          title="Đăng nhập Lễ tân"
          subtitle="Chào mừng lễ tân trở lại"
          apiEndpoint="http://localhost:8088/api/v1/auth/login"
          redirectPath="/receptionist/dashboard"
          showGoogleLogin={true}
          showForgotPassword={true}
        />
      </div>
    </div>
  );
};
export default ReceptionistLoginPage;
