import React, { useState } from "react";
import "../styles/Login.css";
const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="overlay">
      <div className="login-container">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email/SĐT của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Đăng Nhập</button>
        </form>
        <p className="forgot-password">Quên mật khẩu?</p>
      </div>
    </div>
  );
};

export default Login;
