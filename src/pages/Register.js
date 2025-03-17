import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css"; 

const RegisterPage = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        user_name: "",
        password: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [isClosed, setIsClosed] = useState(false); // ✅ Trạng thái đóng modal

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setMessage("Mật khẩu không khớp!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/register", {
                name: formData.name,
                email: formData.email,
                user_name: formData.user_name,
                password: formData.password
            });

            setMessage(response.data.message);
            setSuccess(true);
            setFormData({ name: "", email: "", user_name: "", password: "", confirmPassword: "" });

        } catch (error) {
            setMessage(error.response?.data?.message || "Lỗi khi đăng ký!");
        }
    };

    return (
      <div className="auth-wrapper">
        <div className="login-container register-container">
            <div className="login-form">
                <h2>Chào mừng! Hãy đăng ký</h2>
                <p className="sub-text">Tạo tài khoản để bắt đầu trải nghiệm mua sắm</p>

                {message && !success && <p className="error-message">{message}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Họ và tên</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Nhập họ và tên" />
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Nhập email" />
                    </div>

                    <div className="input-group">
                        <label>Tên đăng nhập</label>
                        <input type="text" name="user_name" value={formData.user_name} onChange={handleChange} required placeholder="Nhập tên đăng nhập" />
                    </div>

                    <div className="input-group">
                        <label>Mật khẩu</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Nhập mật khẩu" />
                    </div>

                    <div className="input-group">
                        <label>Xác nhận mật khẩu</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Nhập lại mật khẩu" />
                    </div>

                    <button className="login-btn" type="submit">Đăng Ký</button>

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

        {/* ✅ Modal hiển thị vĩnh viễn */}
        {success && !isClosed && (
            <div className="success-modal">
                <div className="success-content">
                    <button className="close-btn" onClick={() => setIsClosed(true)}>✖</button>
                    <h3>🎉 Đăng ký thành công!</h3>
                    <p>Bạn có thể kiểm tra giao diện modal này.</p>
                </div>
            </div>
        )}
      </div>
    );
};

export default RegisterPage;
