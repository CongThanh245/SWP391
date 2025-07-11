import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress, Typography, Box } from "@mui/material";
import { Mail, Shield } from "lucide-react";
import styles from "./ForgotPasswordPage.module.css";

const EmailForm = ({ onSubmit, loading }) => {
  const emailValidationSchema = Yup.object({
    email: Yup.string()
      .email("Vui lòng nhập email hợp lệ")
      .required("Vui lòng nhập email"),
  });

  return (
    <div key="email-form">
      <div className={styles.headerWithIcon}>
        <div className={styles.headerIcon}>
          <Shield size={32} />
        </div>
        <div className={styles.header}>
          <Typography variant="h4" component="h1">
            Đặt lại mật khẩu
          </Typography>
          <Typography variant="body1" color="inherit">
            Nhập email để nhận mã OTP đặt lại mật khẩu
          </Typography>
        </div>
      </div>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={emailValidationSchema}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form className={styles.forgotPasswordForm}>
            <div className={styles.formGroup}>
              <TextField
                fullWidth
                label="Địa chỉ Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                disabled={loading}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <div className={styles.inputIcon}>
                      <Mail size={20} />
                    </div>
                  ),
                }}
                autoComplete="email"
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi mã OTP"}
            </Button>
          </Form>
        )}
      </Formik>

      <Box className={styles.helpSection}>
        <Typography variant="body2" color="textSecondary">
          Bạn sẽ nhận được email chứa mã OTP để đặt lại mật khẩu. Mã này sẽ hết hạn sau 24 giờ.
        </Typography>
      </Box>
    </div>
  );
};

export default EmailForm;