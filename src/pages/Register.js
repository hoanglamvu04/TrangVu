import React from "react";
import "../styles/Login.css"; 

const RegisterPage = () => {
  return (
    <div className="auth-wrapper">
      <div className="login-container register-container">
        <div className="login-form">
          <h2>Chào mừng! Hãy đăng ký</h2>
          <p className="sub-text">Tạo tài khoản để bắt đầu trải nghiệm mua sắm</p>

          <form>
            <div className="input-group">
              <label>Họ và tên</label>
              <input type="text" placeholder="Nhập họ và tên" />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="Nhập email" />
            </div>

            <div className="input-group">
              <label>Tên đăng nhập</label>
              <input type="text" placeholder="Nhập tên đăng nhập" />
            </div>

            <div className="input-group">
              <label>Mật khẩu</label>
              <input type="password" placeholder="Nhập mật khẩu" />
            </div>

            <div className="input-group">
              <label>Xác nhận mật khẩu</label>
              <input type="password" placeholder="Nhập lại mật khẩu" />
            </div>

            <button className="login-btn">Đăng Ký</button>

            <p className="register-link">
              Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
            </p>
          </form>
        </div>

        <div className="login-image">
          <img src="/assets/images/login-banner.png" alt="Welcome Image" />
          <h3>Khám phá phong cách của bạn</h3>
          <p>Tham gia ngay để nhận ưu đãi độc quyền!</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
