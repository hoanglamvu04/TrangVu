import React, { useState } from 'react';
import './AuthModal.css';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import axios from 'axios';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("auth-modal-overlay")) {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      if (!formData.email || !formData.password) {
        return setError("Vui lòng nhập email và mật khẩu!");
      }
    } else {
      if (!formData.name || !formData.phone || !formData.email || !formData.password) {
        return setError("Vui lòng nhập đầy đủ thông tin!");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          return setError("Email không đúng định dạng!");
        }
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        alert("Đăng nhập thành công!");
        localStorage.setItem("customer", JSON.stringify(res.data.user));
        onClose();
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/register", {
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phone,
        });
        alert("Đăng ký thành công!");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi");
    }
    setLoading(false);
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
            <button className="social-icon-btn"><FaGoogle className="social-icon" /></button>
            <button className="social-icon-btn"><FaFacebookF className="social-icon facebook" /></button>
          </div>
        </div>

        <div className="auth-divider">Hoặc đăng nhập tài khoản:</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input type="text" name="name" placeholder="Tên của bạn" value={formData.name} onChange={handleInputChange} />
              <input type="text" name="phone" placeholder="SĐT của bạn" value={formData.phone} onChange={handleInputChange} />
            </>
          )}
          <input type="text" name="email" placeholder="Email của bạn" value={formData.email} onChange={handleInputChange} />
          <input type="password" name="password" placeholder="Mật khẩu" value={formData.password} onChange={handleInputChange} />

          {isLogin && (
            <div className="forgot-password">
              <button type="button">Quên mật khẩu?</button>
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ TÀI KHOẢN"}
          </button>
        </form>

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
