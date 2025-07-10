import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OTPInput from 'react-otp-input';
import { verifyOtp } from '../../../../api/authApi';
import styles from './VerifyOtpPage.module.css'; 

function VerifyOtpPage() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (value) => {
    setToken(value);
    setError('');
  };

  const handleVerify = async () => {
    if (token.length === 0) {
      setError('Vui lòng nhập mã kích hoạt');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyOtp(token);
      alert('Kích hoạt thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Kích hoạt thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.verifyOtpContainer}>
      <h2>
        Vui lòng nhập mã OTP gồm 6 chữ số mà chúng tôi đã gửi đến email của bạn. <br />
        Kiểm tra hộp thư đến hoặc thư mục spam nếu không thấy email.
      </h2>
      <div className={styles.otpInputContainer}>
        <OTPInput
          value={token}
          onChange={handleChange}
          numInputs={6}
          isInputNum
          separator={<span className={styles.otpSeparator}>-</span>}
          renderInput={(props) => <input {...props} className={styles.otpInput} aria-label="Mã OTP" />}
        />
      </div>
      {error && <p className={styles.errorMessage} role="alert">{error}</p>}
      <button
        className={styles.verifyButton}
        onClick={handleVerify}
        disabled={loading || token.length !== 6}
        aria-label={loading ? 'Đang xác thực mã OTP' : 'Xác thực mã OTP'}
      >
        {loading ? 'Đang xác thực...' : 'Xác thực'}
      </button>
      <Link to="/register" className={styles.registerLink} aria-label="Quay lại trang đăng ký">
        Quay lại đăng ký
      </Link>
    </div>
  );
}

export default VerifyOtpPage;