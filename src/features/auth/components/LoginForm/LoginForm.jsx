import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField } from "@mui/material";
import styles from "./LoginForm.module.css";
import { useNavigate } from "react-router-dom";
import { useToast } from "@hooks/use-toast";

const LoginForm = ({
  title = "Đăng nhập",
  subtitle = "Chào mừng bạn trở lại",
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const roleRedirectMap = {
    patient: "/",
    receptionist: "/receptionist-dashboard",
    doctor: "/doctor-dashboard",
    administrator: "/admin-dashboard",
  };

  // Validation schema với Yup
  const validationSchema = Yup.object({
    username: Yup.string().required("Vui lòng nhập email"),
    password: Yup.string().required("Vui lòng nhập mật khẩu"),
  });

  const handleSubmit = async (values, { setFieldValue, setFieldError }) => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8088/api/v1/auth/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.username,
            password: values.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.validationErrors
          ? errorData.validationErrors.join(", ")
          : "Email hoặc mật khẩu không đúng";
        // Gán lỗi vào trường username hoặc password
        setFieldError("username", errorMessage);
        setFieldError("password", errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Đăng nhập thành công:", result);

      if (result.token) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("role", result.accountType ?? "");
        localStorage.setItem("isFreshLogin", "true");
      }

      // Hiển thị toast thành công
      toast({
        title: "Thành công",
        description: "Đăng nhập thành công!",
        variant: "default",
      });

      // Navigate to the appropriate dashboard
      const storedRole =
        localStorage.getItem("role")?.toLowerCase() || "patient";
      const redirectPath = roleRedirectMap[storedRole] || "/";

      setTimeout(() => {
        navigate(redirectPath);
      }, 1000);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.message);

      // Clear mật khẩu khi đăng nhập thất bại
      setFieldValue("password", "");
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

        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnBlur={false} // Prevent validation on blur
          validateOnChange={false} // Prevent validation on change
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className={styles.loginForm}>
              <div className={styles.formGroup}>
                <TextField
                  fullWidth
                  label="Email"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  disabled={loading}
                  variant="outlined"
                />
              </div>

              <div className={styles.formGroup}>
                <TextField
                  fullWidth
                  label="Mật khẩu"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  disabled={loading}
                  variant="outlined"
                />
              </div>

              <button
                type="submit"
                className={styles.loginButton}
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;