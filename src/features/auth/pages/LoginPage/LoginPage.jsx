// src/pages/LoginPage/LoginPage.jsx
import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import { FcGoogle } from "react-icons/fc"; // Cần cài đặt: npm install react-icons

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  // Trạng thái để kiểm soát focus và giá trị của input
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials({
      ...credentials,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Đăng nhập với:", credentials);
    // Xử lý logic đăng nhập ở đây
  };

  const handleGoogleLogin = () => {
    console.log("Đăng nhập với Google");
    // Xử lý login với Google ở đây
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.backToHome}>
          <a href="/">Quay lại trang chủ</a>
      </div>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>Đăng nhập</h1>
          <p>Chào mừng bạn trở lại</p>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          {/* Input Tên đăng nhập với floating label */}
          <div className={styles.formGroup}>
            <label
              className={`${styles.floatingLabel} ${
                isUsernameFocused || credentials.username
                  ? styles.floatingLabelActive
                  : ""
              }`}
              htmlFor="username"
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              onFocus={() => setIsUsernameFocused(true)}
              onBlur={() => setIsUsernameFocused(false)}
              required
            />
          </div>

          {/* Input Mật khẩu với floating label */}
          <div className={styles.formGroup}>
            <label
              className={`${styles.floatingLabel} ${
                isPasswordFocused || credentials.password
                  ? styles.floatingLabelActive
                  : ""
              }`}
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              required
            />
          </div>

          <div className={styles.formOptions}>
            <div className={styles.rememberMe}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={credentials.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
            </div>
            <a href="#" className={styles.forgotPassword}>
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" className={styles.loginButton}>
            Đăng nhập
          </button>

          <div className={styles.divider}>
            <span>Hoặc</span>
          </div>

          <button
            type="button"
            className={styles.googleButton}
            onClick={handleGoogleLogin}
          >
            <FcGoogle className={styles.googleIcon} />
            <span>Đăng nhập bằng Google</span>
          </button>
        </form>

        <div className={styles.signupPrompt}>
          <p>
            Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
