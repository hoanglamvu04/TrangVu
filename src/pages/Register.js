import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    const [countdown, setCountdown] = useState(5); // Biến đếm ngược 5 giây
    const navigate = useNavigate();

    useEffect(() => {
        if (success) {
            const interval = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);

            setTimeout(() => {
                navigate("/login");
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [success, navigate]);

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
            setSuccess(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="login-container register-container">
                <div className="login-form">
                    <h2>Chào mừng! Hãy đăng ký</h2>
                    <p className="sub-text">Tạo tài khoản để bắt đầu trải nghiệm mua sắm</p>

                    {message && (
                        <p className={`message ${success ? "success-message" : "error-message"}`}>
                            {message}
                        </p>
                    )}

                    {success && (
                        <p className="countdown-message">
                            Bạn sẽ được chuyển đến trang đăng nhập sau {countdown} giây...
                        </p>
                    )}

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
        </div>
    );
};

export default RegisterPage;
