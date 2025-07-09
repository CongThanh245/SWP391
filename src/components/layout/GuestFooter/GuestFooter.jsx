import React from 'react';
import '../GuestFooter/GuestFooter.css';
import logo from '../../../assets/images/LogoFertiCare.svg';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <div className="footer-logo-container">
            <img src={logo} alt="FertiCare Logo" className="footer-logo" />
            <div className="footer-logo-text">
              <span className="footer-logo-name">FertiCare</span>
              <span className="footer-logo-tagline">MEDICAL TECHNOLOGY</span>
            </div>
          </div>
          <p className="footer-description">
            Phần mềm quản lý và theo dõi quá trình điều trị hiếm muộn chuyên nghiệp, 
            hỗ trợ người dùng trong hành trình đón chờ thiên thần nhỏ.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <Instagram size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section links">
          <h3 className="footer-heading">Liên kết nhanh</h3>
          <ul className="footer-links">
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/about-us">Giới thiệu cơ sở y tế</a></li>
            <li><a href="/our-doctors">Đội ngũ bác sĩ</a></li>
            <li><a href="/services">Dịch vụ điều trị</a></li>
            <li><a href="/health-records">Hồ sơ sức khỏe</a></li>
          </ul>
        </div>

        <div className="footer-section services">
          <h3 className="footer-heading">Dịch vụ</h3>
          <ul className="footer-links">
            <li><a href="/health-records/profile">Hồ sơ cá nhân</a></li>
            <li><a href="/health-records/medical-records">Kết quả điều trị</a></li>
            <li><a href="/health-records/appointmens">Lịch khám</a></li>
            <li><a href="/health-records/prescriptions">Đơn thuốc</a></li>
            <li><a href="/health-records/attachments">Hồ sơ đính kèm</a></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3 className="footer-heading">Liên hệ</h3>
          <div className="contact-items">
            <div className="contact-item">
              <MapPin size={18} />
              <span>123 Lê Lợi, Quận 1, TP. Hồ Chí Minh</span>
            </div>
            <div className="contact-item">
              <Phone size={18} />
              <span>(028) 3822 9999</span>
            </div>
            <div className="contact-item">
              <Mail size={18} />
              <span>info@FertiCare.vn</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} FertiCare. Tất cả quyền được bảo lưu.</p>
          <div className="footer-bottom-links">
            <a href="/terms">Điều khoản sử dụng</a>
            <a href="/privacy">Chính sách bảo mật</a>
            <a href="/cookies">Chính sách cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;