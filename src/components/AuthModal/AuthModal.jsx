import React, { useState } from 'react';
import './AuthModal.css';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("auth-modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose}>×</button>

        <h2 className="auth-title">Rất nhiều đặc quyền và quyền lợi mua sắm đang chờ bạn</h2>

        <div className="auth-benefits">
          <div>🎁 Voucher ưu đãi</div>
          <div>🎉 Quà tặng độc quyền</div>
          <div>💸 Hoàn tiền Coolcash</div>
        </div>

        <div className="auth-social-row">
          <span className="auth-social-label">Đăng nhập bằng:</span>
          <div className="auth-social-icons">
            <button className="social-icon-btn">
              <FaGoogle className="social-icon" />
            </button>
            <button className="social-icon-btn">
              <FaFacebookF className="social-icon facebook" />
            </button>
          </div>
        </div>

        <div className="auth-divider">Hoặc đăng nhập tài khoản:</div>

        {isLogin ? (
          <form className="auth-form">
            <input type="text" placeholder="Email/SĐT của bạn" />
            <input type="password" placeholder="Mật khẩu" />
            <div className="forgot-password">
              <button type="button">Quên mật khẩu?</button>
            </div>
            <button className="auth-submit">ĐĂNG NHẬP</button>
          </form>
        ) : (
          <form className="auth-form">
            <input type="text" placeholder="Tên của bạn" />
            <input type="text" placeholder="SĐT của bạn" />
            <input type="email" placeholder="Email của bạn" />
            <input type="password" placeholder="Mật khẩu" />
            <button className="auth-submit">ĐĂNG KÝ TÀI KHOẢN</button>
          </form>
        )}

        <div className="auth-switch">
          {isLogin ? (
            <>
              <span>Bạn chưa có tài khoản? </span>
              <button onClick={() => setIsLogin(false)}>Đăng ký</button>
            </>
          ) : (
            <>
              <span>Đã có tài khoản? </span>
              <button onClick={() => setIsLogin(true)}>Đăng nhập</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
