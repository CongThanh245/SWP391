import React, { useState } from 'react';
import OTPInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
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
      <h2>Nhập mã kích hoạt tài khoản</h2>
      <div className={styles.otpInputContainer}>
        <OTPInput
          value={token}
          onChange={handleChange}
          numInputs={6}
          isInputNum
          separator={<span className={styles.otpSeparator}>-</span>}
          renderInput={(props) => <input {...props} className={styles.otpInput} />}
        />
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <button
        className={styles.verifyButton}
        onClick={handleVerify}
        disabled={loading || token.length !== 6}
      >
        {loading ? 'Đang xác thực...' : 'Xác thực'}
      </button>
    </div>
  );
}

export default VerifyOtpPage;