import React from "react";
import LoginForm from "@features/auth/components/LoginForm/LoginForm";
import { FcGoogle } from "react-icons/fc";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:8088/api/v1/oauth2/authorization/google`;
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.backToHome}>
        <a href="/">Quay lại trang chủ</a>
      </div>

      <div className={styles.formWrapper}>
        <LoginForm
          title="Đăng nhập"
          subtitle="Chào mừng bạn trở lại"
        />

        <div className={styles.additionalOptions}>
          <div className={styles.divider}>
            <span>Hoặc</span>
          </div>
          <button
            type="button"
            className={styles.googleLoginButton}
            onClick={handleGoogleLogin}
          >
            <FcGoogle className={styles.googleIcon} />
            Đăng nhập với Google
          </button>
          <div className={styles.formOptions}>
            <a href="/forgot-password" className={styles.forgotPassword}>
              Quên mật khẩu?
            </a>
          </div>
          <div className={styles.signupPrompt}>
            <p>
              Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;