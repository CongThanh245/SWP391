import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../GuestHeader/GuestHeader.css'; // Adjust the path as necessa  ry
import logo from '../../../assets/images/LogoFertiCare.svg';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    services: false,
    doctors: false,
  });
  
  const navigate = useNavigate();

  const toggleDropdown = (menu) => {
    setIsDropdownOpen({
      ...isDropdownOpen,
      [menu]: !isDropdownOpen[menu],
    });
  };

  return (
    <header className="header">
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
              <a href="/" className="nav-link">TRANG CHỦ</a>
            </li>
            <li className="nav-item">
              <a href="/about-us" className="nav-link">GIỚI THIỆU CƠ SỞ Y TẾ</a>
            </li>
            <li 
              className="nav-item dropdown"
              onMouseEnter={() => toggleDropdown('doctors')}
              onMouseLeave={() => toggleDropdown('doctors')}
            >
              <a href="/our-doctors" className="nav-link">ĐỘI NGŨ CHUYÊN GIA</a>
            </li>
            <li 
              className="nav-item dropdown"
              onMouseEnter={() => toggleDropdown('services')}
              onMouseLeave={() => toggleDropdown('services')}
            >
              <a href="/services" className="nav-link">DỊCH VỤ <i className="dropdown-icon">▼</i></a>
              {isDropdownOpen.services && (
                <ul className="dropdown-menu">
                  <li><a href="/services/iui">Điều trị IUI</a></li>
                  <li><a href="/services/ivf">Điều trị IVF</a></li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <a href="/blog" className="nav-link">BLOG</a>
            </li>
            <li className="nav-item">
              <a href="/health-records" className="nav-link">HỒ SƠ SỨC KHỎE</a>
            </li>
            <li className="nav-item">
              <a href="/contact" className="nav-link">LIÊN HỆ</a>
            </li>
          </ul>
        </nav>

        <div className="auth-buttons">
          <button className="login-button" onClick={() => navigate('/login')}>Đăng nhập</button>
        </div>
      </div>
    </header>
  );
};

export default Header;