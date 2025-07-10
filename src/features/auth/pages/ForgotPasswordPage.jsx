import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@hooks/use-toast";
import EmailForm from "./EmailForm";
import OtpForm from "./OtpForm";
import SuccessMessage from "./SuccessMessage";
import styles from "./ForgotPasswordPage.module.css";
import { Button } from "@mui/material";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailSubmit = useCallback(
    async (values, { setFieldError, resetForm }) => {
      setLoading(true);
      setSubmittedEmail(values.email);

      try {
        const response = await fetch(
          "http://localhost:8088/api/v1/auth/forgot-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: values.email }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.validationErrors
            ? errorData.validationErrors.join(", ")
            : "Email không tồn tại hoặc có lỗi xảy ra";
          setFieldError("email", errorMessage);
          throw new Error(errorMessage);
        }

        setIsOtpStep(true);
        resetForm();
      } catch (error) {
        console.error("Lỗi gửi yêu cầu đặt lại mật khẩu:", error.message);
        toast({
          title: "Lỗi",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const handleOtpSubmit = useCallback(
    async (values, { setFieldError, resetForm }) => {
      setLoading(true);

      try {
        const response = await fetch(
          "http://localhost:8088/api/v1/auth/reset-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: values.token,
              newPassword: values.newPassword,
              confirmPassword: values.confirmPassword,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.validationErrors
            ? errorData.validationErrors.join(", ")
            : "Mã OTP không hợp lệ hoặc có lỗi xảy ra";
          setFieldError("token", errorMessage);
          throw new Error(errorMessage);
        }

        setIsSuccess(true);
        resetForm();
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        console.error("Lỗi đặt lại mật khẩu:", error.message);
        toast({
          title: "Lỗi",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast, navigate]
  );

  const handleBackToLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <div className={styles.forgotPasswordContainer}>
      <div className={styles.forgotPasswordCard}>
        {isSuccess ? (
          <SuccessMessage onBackToLogin={handleBackToLogin} />
        ) : isOtpStep ? (
          <OtpForm onSubmit={handleOtpSubmit} loading={loading} submittedEmail={submittedEmail} />
        ) : (
          <EmailForm onSubmit={handleEmailSubmit} loading={loading} />
        )}
        {!isSuccess && !isOtpStep && (
          <div className={styles.backToLogin}>
            <Button
              variant="text"
              onClick={handleBackToLogin}
              className={styles.backToLoginLink}
              aria-label="Quay lại đăng nhập"
            >
              Quay lại đăng nhập
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;