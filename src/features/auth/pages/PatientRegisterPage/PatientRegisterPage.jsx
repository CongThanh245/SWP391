// src/features/auth/PatientRegisterPage/RegisterPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { registerUser } from "../../../../api/authApi";
import styles from "./PatientRegisterPage.module.css";

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, "Ít nhất 2 ký tự")
    .required("Vui lòng nhập họ và tên"),
  dateOfBirth: Yup.date()
    .max(new Date(), "Ngày sinh không hợp lệ")
    .required("Vui lòng chọn ngày sinh"),
  phoneNumber: Yup.string()
    .matches(/^(0|\+84)(\d{9,10})$/, "SĐT không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
    )
    .required("Vui lòng nhập mật khẩu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
  gender: Yup.string()
    .oneOf(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"])
    .required("Vui lòng chọn giới tính"),
});

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.registerContainer}>
      <div className={styles.backToHome}>
        <a href="/">Quay lại trang chủ</a>
      </div>

      <div className={styles.registerCard}>
        <div className={styles.registerHeader}>
          <h1>Đăng ký tài khoản</h1>
          <p>Tạo tài khoản mới để trở thành bệnh nhân</p>
        </div>

        <Formik
          initialValues={{
            fullName: "",
            dateOfBirth: "",
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
            gender: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            try {
              await registerUser({
                fullName: values.fullName,
                dateOfBirth: values.dateOfBirth,
                phoneNumber: values.phoneNumber,
                email: values.email,
                password: values.password,
                gender: values.gender,
              });
              navigate("/verify-otp", { state: { email: values.email } });
            } catch (err) {
              setStatus(err.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, status }) => (
            <Form className={styles.registerForm} noValidate>
              {status && <div className={styles.apiErrorMessage}>{status}</div>}

              <div className={styles.formGroup}>
                <label>Họ và tên*</label>
                <Field name="fullName" placeholder="Nhập họ và tên" />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ngày sinh*</label>
                <Field name="dateOfBirth" type="date" />
                <ErrorMessage
                  name="dateOfBirth"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Số điện thoại*</label>
                <Field name="phoneNumber" placeholder="0xxxxxxxxx" />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email*</label>
                <Field name="email" type="email" placeholder="abc@xyz.com" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Mật khẩu*</label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Mật khẩu"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Xác nhận mật khẩu*</label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Giới tính*</label>
                <Field name="gender" as="select">
                  <option value="">Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </Field>
                <ErrorMessage
                  name="gender"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>

              <button
                type="submit"
                className={styles.registerButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </Form>
          )}
        </Formik>

        <p className={styles.loginPrompt}>
          Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;