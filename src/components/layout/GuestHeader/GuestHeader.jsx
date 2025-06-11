import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../GuestHeader/GuestHeader.css"; // Adjust the path as necessary
import logo from "../../../assets/images/LogoFertiCare.svg";
import apiClient from "@api/axiosConfig";

const Header = () => {
  const [user, setUser] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState({
    services: false,
    doctors: false,
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null); // clear frontend state
    navigate("/login");
  };

  const toggleDropdown = (menu) => {
    setIsDropdownOpen({
      ...isDropdownOpen,
      [menu]: !isDropdownOpen[menu],
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlRole = params.get("role");

    let authToken = localStorage.getItem("authToken");
    let userRole = localStorage.getItem("role");

    // Nếu có token mới từ URL, cập nhật
    if (urlToken && urlRole) {
      localStorage.setItem("authToken", urlToken);
      localStorage.setItem("role", urlRole);

      // Cập nhật biến local
      authToken = urlToken;
      userRole = urlRole;

      // Clean URL
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("token");
      cleanUrl.searchParams.delete("role");
      window.history.replaceState({}, document.title, cleanUrl.pathname);
    }

    // Gọi API với token (mới hoặc cũ)
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
          setUser(null); // Reset user state
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
                strokeWidth={2} // Sửa từ stroke-width thành strokeWidth
                strokeLinecap="round" // Sửa từ stroke-linecap thành strokeLinecap
                strokeLinejoin="round" // Sửa từ stroke-linejoin thành strokeLinejoin
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
                strokeWidth={2} // Sửa từ stroke-width thành strokeWidth
                strokeLinecap="round" // Sửa từ stroke-linecap thành strokeLinecap
                strokeLinejoin="round" // Sửa từ stroke-linejoin thành strokeLinejoin
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
                strokeWidth={2} // Sửa từ stroke-width thành strokeWidth
                strokeLinecap="round" // Sửa từ stroke-linecap thành strokeLinecap
                strokeLinejoin="round" // Sửa từ stroke-linejoin thành strokeLinejoin
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
            <li
              className="nav-item dropdown"
              onMouseEnter={() => toggleDropdown("services")}
              onMouseLeave={() => toggleDropdown("services")}
            >
              <a href="/services" className="nav-link">
                DỊCH VỤ <i className="dropdown-icon">▼</i>
              </a>
              {isDropdownOpen.services && (
                <ul className="dropdown-menu">
                  <li>
                    <a href="/services/iui">Điều trị IUI</a>
                  </li>
                  <li>
                    <a href="/services/ivf">Điều trị IVF</a>
                  </li>
                </ul>
              )}
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
            <div className="user-info">
              <img
                src={user.avatarUrl || "/default-avatar.png"} // fallback if missing
                alt="Avatar"
                className="avatar"
                onClick={() => navigate("/profile")}
              />
              <span className="username" onClick={() => navigate("/profile")}>
                {user.patientName}
              </span>
              <button className="logout-button" onClick={handleLogout}>
                Đăng xuất
              </button>
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