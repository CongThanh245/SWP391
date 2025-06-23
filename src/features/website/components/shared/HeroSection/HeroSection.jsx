import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DNAPic from "@assets/images/DNA3DPic.svg";
import styles from "./HeroSection.module.css";
import Button from "@components/common/Button/Button.jsx";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
} from "@mui/material";
import { isAuthenticated, getUserData, logout } from "@utils/authUtils.js";

function HeroSection() {
  const [open, setOpen] = useState(false);
  const [isPatient, setIsPatient] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const patientStatus = isAuthenticated();
    setIsPatient(patientStatus);
    if (patientStatus) {
      setUser(getUserData());
    }
  }, []);

  const handleAppointmentClick = () => {
    if (!isPatient) {
      setOpen(true); // Mở popup nếu chưa đăng nhập
    } else {
      console.log("Đăng ký lịch hẹn");
      // Thêm logic để đăng ký lịch hẹn, ví dụ gọi API
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLoginRedirect = () => {
    setOpen(false);
    navigate("/login");
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1>FERTICARE</h1>
          <p>Phần mềm quản lý và theo dõi quá trình điều trị hiếm muộn</p>
          <p className={styles.heroDescription}>
            Chúng tôi cung cấp giải pháp toàn diện để theo dõi quá trình điều
            trị hiếm muộn, bao gồm quản lý lịch trình, theo dõi tiến độ, và liên
            lạc với đội ngũ y tế. Điều này giúp bạn an tâm hơn trong hành trình
            đón chờ thiên thần nhỏ của mình.
          </p>
          <div className={styles.heroButtons}>
            <Button variant="primary" onClick={handleAppointmentClick}>
              Đăng ký lịch hẹn
            </Button>
            <Button variant="secondary" onClick={() =>  navigate("/about-us")}>Tìm hiểu thêm</Button>
          </div>
        </div>
        <img className={styles.heroImage} src={DNAPic} alt="DNA" />
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "var(--card-background)", // White cho card
            borderRadius: "var(--border-radius-2)", // 1.2rem
            boxShadow: "var(--box-shadow)", // Shadow từ color-light
            padding: "var(--card-padding)", // 1.8rem
            fontFamily: "var(--font-family)", // Montserrat
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "var(--font-size-xl)", // 28px
            color: "var(--text-primary)", // Black/dark gray
            fontWeight: 600,
            textAlign: "center",
            paddingBottom: "var(--spacing-sm)", // 8px
          }}
        >
          Từ từ đã nhé!
        </DialogTitle>
        <DialogContent
          sx={{
            fontSize: "var(--font-size-base)", // 16px
            color: "var(--text-secondary)", // Medium gray
            padding: "var(--spacing-md)", // 16px
          }}
        >
          <p>Bạn cần đăng nhập để đăng ký lịch hẹn.</p>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "var(--spacing-md)", // 16px
            justifyContent: "center",
            gap: "var(--spacing-md)", // 16px
          }}
        >
          <MuiButton
            onClick={handleClose}
            sx={{
              fontFamily: "var(--font-family)", // Montserrat
              fontSize: "var(--font-size-base)", // 16px
              color: "var(--text-secondary)", // Medium gray
              border: "1px solid var(--button-secondary-border)", // Light gray
              borderRadius: "var(--border-radius-1)", // 0.4rem
              padding: "var(--spacing-sm) var(--spacing-lg)", // 8px 24px
              textTransform: "none",
              "&:hover": {
                backgroundColor: "var(--hover-accent)", // Deep taupe với opacity
              },
            }}
          >
            Đóng
          </MuiButton>
          <MuiButton
            onClick={handleLoginRedirect}
            variant="contained"
            sx={{
              fontFamily: "var(--font-family)", // Montserrat
              fontSize: "var(--font-size-base)", // 16px
              backgroundColor: "var(--button-primary-bg)", // Deep taupe
              color: "var(--button-primary-text)", // Off-white
              borderRadius: "var(--border-radius-1)", // 0.4rem
              padding: "var(--spacing-sm) var(--spacing-lg)", // 8px 24px
              textTransform: "none",
              "&:hover": {
                backgroundColor: "var(--button-hover-bg)", // Darker taupe
              },
            }}
          >
            Đăng nhập
          </MuiButton>
        </DialogActions>
      </Dialog>
    </section>
  );
}

export default HeroSection;
