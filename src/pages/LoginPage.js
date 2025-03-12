import React from "react";
import "../styles/Login.css";

const LoginPage = () => {
  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Phần form đăng nhập */}
        <div className="login-form">
          <h2>Chào mừng trở lại!</h2>
          <p className="sub-text">Đăng nhập để tiếp tục mua sắm</p>

          <form>
            <div className="input-group">
              <label>Email / SĐT</label>
              <input type="text" placeholder="Nhập email hoặc số điện thoại" />
            </div>
            <div className="input-group">
              <label>Mật khẩu</label>
              <input type="password" placeholder="Nhập mật khẩu" />
            </div>

            <button className="login-btn">Đăng Nhập</button>

            <div className="social-login">
              <p>Hoặc đăng nhập bằng:</p>
              <div className="social-icons">
                <button className="google-login">Google</button>
                <button className="facebook-login">Facebook</button>
              </div>
            </div>

            <p className="forgot-password">Quên mật khẩu?</p>
            <p className="register-link">
              Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
            </p>
          </form>
        </div>

        {/* Phần ảnh bên phải */}
        <div className="login-image">
          <img src="/assets/images/login-banner.png" alt="Welcome Image" />
          <h3>Khám phá phong cách của bạn</h3>
          <p>Chào mừng bạn đến với nền tảng mua sắm hiện đại, tiện lợi!</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
