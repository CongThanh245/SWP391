import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../GuestHeader/GuestHeader.css";
import logo from "../../../assets/images/Logo2.svg";
import apiClient from "@api/axiosConfig";
import { User, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@utils/authUtils";

const Header = () => {
  const dropdownRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlRole = params.get("role");

    let authToken = localStorage.getItem("authToken");
    let userRole = localStorage.getItem("role");

    if (urlToken && urlRole) {
      localStorage.setItem("authToken", urlToken);
      localStorage.setItem("role", urlRole);
      authToken = urlToken;
      userRole = urlRole;

      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("token");
      cleanUrl.searchParams.delete("role");
      window.history.replaceState({}, document.title, cleanUrl.pathname);
    }

    if (authToken && userRole === "PATIENT") {
      apiClient
        .get("/patients/me")
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch((err) => {
          console.error("Lỗi lấy thông tin bệnh nhân", err);
          localStorage.removeItem("authToken");
          localStorage.removeItem("role");
          localStorage.removeItem("user");
          setUser(null);
        });
    }
  }, []);

  return (
    <header className="header">
      {/* Top info bar */}
      <div className="top-info-bar">
        <div className="top-info-container">
          <div className="contact-info">
            <span className="hotline">
              <svg
                className="phone-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4D3C2D"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
              </svg>
              Hotline: <strong>1900 1234</strong>
            </span>
            <span className="working-hours">
              <svg
                className="clock-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4D3C2D"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h5" />
                <path d="M17.5 17.5 16 16.3V14" />
                <circle cx="16" cy="16" r="6" />
              </svg>
              Thứ 2 - Chủ nhật: <strong>7:00 - 20:00</strong>
            </span>
          </div>
          <div className="email-info">
            <span className="email">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4D3C2D"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
              </svg>
              Email: <strong>ferticare@gmail.com</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container">
        <div className="logo-container">
          <img src={logo} alt="FertiCare Logo" className="logo" />
          <span className="logo-text">
            <span className="logo-name">FERTICARE</span>
            <span className="logo-tagline">MEDICAL TECHNOLOGY</span>
          </span>
        </div>

        <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/" className="nav-link">
                TRANG CHỦ
              </a>
            </li>
            <li className="nav-item">
              <a href="/about-us" className="nav-link">
                GIỚI THIỆU CƠ SỞ Y TẾ
              </a>
            </li>
            <li className="nav-item">
              <a href="/our-doctors" className="nav-link">
                ĐỘI NGŨ CHUYÊN GIA
              </a>
            </li>
            <li className="nav-item">
              <a href="/services" className="nav-link">
                DỊCH VỤ
              </a>
            </li>
            <li className="nav-item">
              <a href="/health-records" className="nav-link">
                HỒ SƠ SỨC KHỎE
              </a>
            </li>
          </ul>
        </nav>

        <div className="auth-buttons">
          {user ? (
            <div
              className="user-info"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="avatar">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" />
                ) : (
                  <User size={20} color="#fff" />
                )}
              </div>
              <span className="username">{user.patientName}</span>
              <span className="caret">▼</span>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="dropdown-menu-user"
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a onClick={() => navigate("/health-records/profile")}>
                      <Settings size={16} /> Hồ sơ
                    </a>
                    <button onClick={() => logout(navigate, setUser)}>
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button className="login-button" onClick={() => navigate("/login")}>
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
