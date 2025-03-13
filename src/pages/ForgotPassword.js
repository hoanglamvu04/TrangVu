import React from "react";
import "../styles/Login.css";

const ForgotPasswordPage = () => {
  return (
    <div className="auth-wrapper">
      <div className="login-container forgot-password-container">
        <div className="login-form">
          <h2>Quên mật khẩu?</h2>
          <p className="sub-text">Nhập email/SĐT để đặt lại mật khẩu</p>

          <form>
            <div className="input-group">
              <label>Email / SĐT</label>
              <input type="text" placeholder="Nhập email hoặc số điện thoại" />
            </div>

            <button className="login-btn">Gửi yêu cầu</button>

            <p className="register-link">
              Nhớ mật khẩu? <a href="/login">Đăng nhập ngay</a>
            </p>
          </form>
        </div>

        <div className="login-image">
          <img src="/assets/images/login-banner.png" alt="Forgot Password" />
          <h3>Đặt lại mật khẩu của bạn</h3>
          <p>Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu vào email của bạn</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
