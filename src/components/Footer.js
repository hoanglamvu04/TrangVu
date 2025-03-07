import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import "../styles/Footer.css"; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-column">
          <h3>Về TV_Fashion</h3>
          <p>TV_Fashion là nền tảng mua sắm thời trang trực tuyến dành cho giới trẻ. Chúng tôi cam kết mang đến sản phẩm chất lượng, xu hướng mới nhất với giá cả hợp lý.</p>
        </div>
        <div className="footer-column">
          <h3>Hỗ Trợ Khách Hàng</h3>
          <ul>
            <li><a href="/faq">Câu hỏi thường gặp</a></li>
            <li><a href="/shipping">Chính sách giao hàng</a></li>
            <li><a href="/return-policy">Chính sách đổi trả</a></li>
            <li><a href="/contact">Liên hệ</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Liên Hệ</h3>
          <p>Email: mail.lamzu@gmail.com</p>
          <p>Hotline: 1900 1234</p>
          <div className="social-icons">
            <a href="https://www.facebook.com/lamzu204" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://www.instagram.com/lamzu__/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
          </div>
        </div>
        <div className="footer-column">
          <h3>Nhận Tin Khuyến Mãi</h3>
          <form className="newsletter-form">
            <input type="email" placeholder="Nhập email của bạn" required />
            <button type="submit">Đăng ký</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} TV_Fashion. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
