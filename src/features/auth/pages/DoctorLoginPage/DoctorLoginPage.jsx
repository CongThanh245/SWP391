import React from "react";
import LoginForm from "@features/auth/components/LoginForm/LoginForm";
import styles from "./DoctorLoginPage.module.css";

const DoctorLoginPage = () => {
  return (
    <div className={styles.doctorContainer}>
      <div className={styles.formWrapper}>
        <LoginForm
          userType="doctor"
          title="Đăng nhập Bác sĩ"
          subtitle="Chào mừng bác sĩ trở lại"
          apiEndpoint="http://localhost:8088/api/v1/auth/authenticate"
          redirectPath="/doctor-dashboard"
        />
      </div>
    </div>
  );
};

export default DoctorLoginPage;
