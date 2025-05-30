import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ 
  userType = 'user', 
  title = 'Đăng nhập',
  subtitle = 'Chào mừng bạn trở lại',
  apiEndpoint,
  redirectPath = '/dashboard',
}) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
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

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.username,
          password: credentials.password,
          userType: userType
        })
      });

      if (!response.ok) {
        throw new Error('Đăng nhập thất bại');
      }

      const result = await response.json();
      console.log("Đăng nhập thành công:", result);

      if (result.token) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('userType', userType);
      }

      setSuccessMessage('Đăng nhập thành công!');
      setTimeout(() => {
        navigate(redirectPath);
      }, 1000);

    } catch (error) {
      console.error("Lỗi đăng nhập:", error.message);
      setError(error.message);
      
      setCredentials(prev => ({
        ...prev,
        password: ''
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label
              className={`${styles.floatingLabel} ${
                isUsernameFocused || credentials.username
                  ? styles.floatingLabelActive
                  : ""
              }`}
              htmlFor="username"
            >
              Email/Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              onFocus={() => setIsUsernameFocused(true)}
              onBlur={() => setIsUsernameFocused(false)}
              disabled={loading}
              required
            />
          </div>

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
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;