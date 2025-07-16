import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress, Typography } from "@mui/material";
import { Lock } from "lucide-react";
import styles from "./ForgotPasswordPage.module.css";

const OtpForm = ({ onSubmit, loading, submittedEmail }) => {
  const otpValidationSchema = Yup.object({
    token: Yup.string()
      .required("Vui lòng nhập mã OTP")
      .matches(/^\d{6}$/, "Mã OTP phải là 6 chữ số"),
    newPassword: Yup.string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .required("Vui lòng nhập mật khẩu mới"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
      .required("Vui lòng xác nhận mật khẩu"),
  });

  return (
    <div key="otp-form">
      <div className={styles.headerWithIcon}>
        <div className={styles.headerIcon}>
          <Lock size={32} />
        </div>
        <div className={styles.header}>
          <Typography variant="h4" component="h1">
            Nhập mã OTP và mật khẩu mới
          </Typography>
          <Typography variant="body1" color="inherit">
            Vui lòng nhập mã OTP được gửi đến {submittedEmail} và mật khẩu mới
          </Typography>
        </div>
      </div>

      <Formik
        initialValues={{ token: "", newPassword: "", confirmPassword: "" }}
        validationSchema={otpValidationSchema}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form className={styles.forgotPasswordForm}>
            <div className={styles.formGroup}>
              <TextField
                fullWidth
                label="Mã OTP"
                name="token"
                value={values.token}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.token && Boolean(errors.token)}
                helperText={touched.token && errors.token}
                disabled={loading}
                variant="outlined"
                inputProps={{ maxLength: 6 }}
                autoComplete="off"
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                fullWidth
                label="Mật khẩu mới"
                name="newPassword"
                type="password"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.newPassword && Boolean(errors.newPassword)}
                helperText={touched.newPassword && errors.newPassword}
                disabled={loading}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <div className={styles.inputIcon}>
                      <Lock size={20} />
                    </div>
                  ),
                }}
                autoComplete="new-password"
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                fullWidth
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
                disabled={loading}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <div className={styles.inputIcon}>
                      <Lock size={20} />
                    </div>
                  ),
                }}
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OtpForm;