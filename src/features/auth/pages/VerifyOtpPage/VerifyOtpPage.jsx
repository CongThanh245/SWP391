import React, { useState } from 'react';
import OTPInput from 'react-otp-input';
import {  useNavigate } from 'react-router-dom';
import { verifyOtp } from '../../../../api/authApi';  // import hàm API bạn đã viết

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
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Nhập mã kích hoạt tài khoản</h2>
      <OTPInput
        value={token}
        onChange={handleChange}
        numInputs={6}
        isInputNum
        separator={<span style={{ margin: '0 8px' }}>-</span>}
        renderInput={(props) => (
          <input
            {...props}
            style={{
              width: '3rem',
              height: '3rem',
              fontSize: '1.5rem',
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          />
        )}
      />

      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}

      <button
        onClick={handleVerify}
        disabled={loading || token.length !== 6}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          fontSize: '1rem',
          cursor: loading || token.length !== 6 ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Đang xác thực...' : 'Xác thực'}
      </button>
    </div>
  );
}

export default VerifyOtpPage;