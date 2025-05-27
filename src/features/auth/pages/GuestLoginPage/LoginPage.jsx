// src/pages/LoginPage/LoginPage.jsx
import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import { FcGoogle } from "react-icons/fc"; // Cần cài đặt: npm install react-icons
import { GoogleLogin } from "@react-oauth/google";
import {  useNavigate } from 'react-router-dom';
import { authenticateUser } from "../../../../api/authApi";
const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  // Trạng thái để kiểm soát focus và giá trị của input
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

 const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8088/api/v1/oauth2/authorization/google';
  };
     
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials({
      ...credentials,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setLoading(true);
    try {
      if(!credentials.username || !credentials.password){
        throw new Error('Vui lòng nhập đầy đủ email và mật khẩu');
      }
      console.log("Đăng nhập với:", credentials);

      const result = await authenticateUser({
        email: credentials.username,
        password: credentials.password
      });
      console.log("Đăng nhập thành công:", result);

      if (result.token) {
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
        }
        setSuccessMessage('Đăng nhập thành công!');
setTimeout(() => {
            navigate('/register'); // or wherever you want to redirect
            // window.location.href = '/dashboard'; // alternative redirect method
        }, 1000);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.message);
        setError(error.message);
        
        // Clear password field on error for security
        setCredentials(prev => ({
            ...prev,
            password: ''
        }));
    }finally{
      setLoading(false);
    }
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
              className={`${styles.floatingLabel} ${isUsernameFocused || credentials.username
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
              className={`${styles.floatingLabel} ${isPasswordFocused || credentials.password
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
            className={styles.googleLoginButton}
            onClick={handleGoogleLogin}
          >
            <FcGoogle className={styles.googleIcon} />
            Đăng nhập với Google
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
