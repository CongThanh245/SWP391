import React, { useState } from "react";
import styles from "./RegisterPage.module.css";
import { registerUser } from "../../../../api/authApi";
import { useNavigate } from 'react-router-dom';

// Định nghĩa cấu trúc form fields
const FORM_FIELDS = [
  {
    id: "fullName",
    name: "fullName",
    type: "text",
    label: "Họ và tên",
    placeholder: "Nhập họ và tên của bạn",
    required: true,
    validation: {
      required: "Vui lòng nhập họ và tên",
    },
  },
  {
    id: "dateOfBirth",
    name: "dateOfBirth",
    type: "date",
    label: "Ngày sinh",
    placeholder: "DD/MM/YYYY",
    required: true,
    validation: {
      required: "Vui lòng nhập ngày sinh",
    },
  },
  {
    id: "phoneNumber",
    name: "phoneNumber",
    type: "tel",
    label: "Số điện thoại",
    placeholder: "Nhập số điện thoại của bạn",
    required: true,
    validation: {
      required: "Vui lòng nhập số điện thoại",
      pattern: {
        value: /^(0|\+84)(\d{9,10})$/,
        message: "Số điện thoại không hợp lệ (định dạng Việt Nam)",
      },
    },
  },
  {
    id: "email",
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Nhập địa chỉ email của bạn",
    required: true,
    validation: {
      required: "Vui lòng nhập email",
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Email không hợp lệ",
      },
    },
  },
  {
    id: "username",
    name: "username",
    type: "text",
    label: "Tên đăng nhập",
    placeholder: "Tạo tên đăng nhập (tối thiểu 6 ký tự)",
    required: true,
    validation: {
      required: "Vui lòng nhập tên đăng nhập",
      minLength: {
        value: 6,
        message: "Tên đăng nhập phải có ít nhất 6 ký tự",
      },
    },
  },
  {
    id: "password",
    name: "password",
    type: "password",
    label: "Mật khẩu",
    placeholder: "Tạo mật khẩu mới (tối thiểu 8 ký tự)",
    required: true,
    validation: {
      required: "Vui lòng nhập mật khẩu",
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        message:
          "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số",
      },
    },
  },
  {
    id: "confirmPassword",
    name: "confirmPassword",
    type: "password",
    label: "Xác nhận mật khẩu",
    placeholder: "Nhập lại mật khẩu",
    required: true,
    validation: {
      required: "Vui lòng xác nhận mật khẩu",
      match: {
        field: "password",
        message: "Mật khẩu không trùng khớp",
      },
    },
  },
];


const RegisterPage = () => {
  // Khởi tạo state form data động từ FORM_FIELDS
  const navigate = useNavigate();
  const initialFormData = FORM_FIELDS.reduce(
    (acc, field) => {
      acc[field.name] = "";
      return acc;
    },
    { agreeTerms: false }
  );

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Xử lý thay đổi giá trị input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Xóa lỗi khi người dùng bắt đầu sửa
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }

    // Xóa API error khi user bắt đầu sửa
    if (errors.apiError) {
      setErrors(prev => ({
        ...prev,
        apiError: null,
      }));
    }

    // Kiểm tra xác nhận mật khẩu ngay khi gõ
    if (
      name === "confirmPassword" ||
      (name === "password" && formData.confirmPassword)
    ) {
      const passwordToCheck = name === "password" ? value : formData.password;
      const confirmValue =
        name === "confirmPassword" ? value : formData.confirmPassword;

      if (confirmValue && passwordToCheck !== confirmValue) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: "Mật khẩu không trùng khớp",
        }));
      } else if (confirmValue) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: null,
        }));
      }
    }
  };

  // Validate một trường dữ liệu
  const validateField = (fieldName, value) => {
    const field = FORM_FIELDS.find((f) => f.name === fieldName);
    if (!field || !field.validation) return null;

    const { validation } = field;

    if (validation.required && !value) {
      return validation.required;
    }

    if (validation.pattern && value && !validation.pattern.value.test(value)) {
      return validation.pattern.message;
    }

    if (validation.minLength && value && value.length < validation.minLength.value) {
      return validation.minLength.message;
    }

    if (validation.match) {
      const matchFieldValue = formData[validation.match.field];
      if (value !== matchFieldValue) {
        return validation.match.message;
      }
    }

    return null;
  };

  // Validate tất cả các trường
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    FORM_FIELDS.forEach((field) => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    if (!formData.agreeTerms) {
      newErrors.agreeTerms =
        "Bạn phải đồng ý với Điều khoản sử dụng và Chính sách bảo mật";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Xử lý submit form - FIXED: Removed duplicate function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        const result = await registerUser(formData);
        console.log("Đăng ký thành công:", result);
        setSubmitSuccess(true);


      } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        setErrors(prev => ({
          ...prev,
          apiError:
            error.response?.data?.message ||
            "Đăng ký thất bại. Vui lòng thử lại sau.",
        }));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.backToHome}>
        <p>
          <a href="/">Quay lại trang chủ</a>
        </p>
      </div>
      <div className={styles.registerCard}>
        <div className={styles.registerHeader}>
          <h1>Đăng ký tài khoản</h1>
          <p>Tạo tài khoản mới để trở thành bệnh nhân</p>
        </div>

        {submitSuccess ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h2>Đăng ký thành công!</h2>
            <p>
              Một email xác nhận đã được gửi đến{" "}
              <strong>{formData.email}</strong>.
            </p>
            <p>
              Vui lòng kiểm tra hộp thư và nhập mã OTP kích hoạt để hoàn
              tất quá trình đăng ký.
            </p>
            <button
              onClick={() =>
                navigate('/verify-otp', { state: { email: formData.email } })
              }
            >
              Tiếp tục
            </button>
          </div>
        ) : (
          <form className={styles.registerForm} onSubmit={handleSubmit}>
            {/* Display API error at the top if exists */}
            {errors.apiError && (
              <div className={styles.apiErrorMessage}>
                <p className={styles.errorMessage}>{errors.apiError}</p>
              </div>
            )}

            {FORM_FIELDS.map((field) => (
              <div key={field.id} className={styles.formGroup}>
                <label htmlFor={field.id}>
                  {field.label}{" "}
                  {field.required && (
                    <span className={styles.requiredMark}>*</span>
                  )}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className={errors[field.name] ? styles.inputError : ""}
                  required={field.required}
                />
                {errors[field.name] && (
                  <p className={styles.errorMessage}>{errors[field.name]}</p>
                )}
              </div>
            ))}

            <div className={styles.formOptions}>
              <div className={styles.agreeTerms}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <label htmlFor="agreeTerms">
                  Tôi đồng ý với <a href="#">Điều khoản sử dụng</a> và <a href="#">Chính sách bảo mật</a>
                </label>
              </div>
              {errors.agreeTerms && (
                <p className={styles.errorMessage}>{errors.agreeTerms}</p>
              )}
            </div>

            <button
              type="submit"
              className={styles.registerButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>
        )}

        <div className={styles.loginPrompt}>
          <p>
            Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;