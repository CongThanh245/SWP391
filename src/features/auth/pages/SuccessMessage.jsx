import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { CheckCircle } from "lucide-react";
import styles from "./ForgotPasswordPage.module.css";

const SuccessMessage = ({ onBackToLogin }) => (
  <div>
    <div className={styles.successHeader}>
      <div className={styles.successIcon}>
        <CheckCircle size={40} />
      </div>
      <Typography variant="h4" component="h1">
        Mật khẩu đã được đặt lại!
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Mật khẩu của bạn đã được cập nhật thành công. Bạn sẽ được chuyển hướng đến trang đăng nhập.
      </Typography>
    </div>

    <Box className={styles.successContent}>
      <Box className={styles.helpBox}>
        <Typography variant="body2" color="textSecondary">
          <strong>Lưu ý:</strong> Vui lòng sử dụng mật khẩu mới để đăng nhập.
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={onBackToLogin}
        className={styles.backToLoginButton}
      >
        Quay lại đăng nhập
      </Button>
    </Box>
  </div>
);

export default SuccessMessage;