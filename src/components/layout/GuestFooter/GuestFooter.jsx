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
            <li><a href="/facility">Giới thiệu cơ sở y tế</a></li>
            <li><a href="/doctors">Đội ngũ bác sĩ</a></li>
            <li><a href="/services">Dịch vụ điều trị</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/health-records">Hồ sơ sức khỏe</a></li>
            <li><a href="/contact">Liên hệ</a></li>
          </ul>
        </div>

        <div className="footer-section services">
          <h3 className="footer-heading">Dịch vụ</h3>
          <ul className="footer-links">
            <li><a href="/services/iui">Điều trị IUI</a></li>
            <li><a href="/services/ivf">Điều trị IVF</a></li>
            <li><a href="/services/consultation">Tư vấn hiếm muộn</a></li>
            <li><a href="/services/tracking">Theo dõi chu kỳ</a></li>
            <li><a href="/services/medication">Quản lý đơn thuốc</a></li>
            <li><a href="/services/prices">Bảng giá dịch vụ</a></li>
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
          <div className="footer-subscribe">
            <h4>Đăng ký nhận tin</h4>
            <div className="subscribe-form">
              <input type="email" placeholder="Email của bạn" />
              <button type="submit">Đăng ký</button>
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