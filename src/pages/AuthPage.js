import React, { useState } from "react";
import "../styles/AuthPage.css";

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <div className="auth-page">
            <div className={`auth-container ${isSignUp ? "auth-sign-up-mode auth-container-expanded" : ""}`}>

                <div className="auth-form-container auth-sign-in">
                    <form>
                        <h1 className="auth-title">Chào mừng trở lại!</h1>
                        <p className="auth-subtext">Đăng nhập để tiếp tục mua sắm</p>

                        <label>Email / SĐT</label>
                        <input type="text" placeholder="Nhập email hoặc số điện thoại" />

                        <label>Mật khẩu</label>
                        <input type="password" placeholder="Nhập mật khẩu" />

                        <a href="#" className="auth-link">Quên mật khẩu?</a>
                        <button className="auth-btn">Đăng Nhập</button>

                        <p className="auth-alt-text">Hoặc đăng nhập bằng:</p>
                        <div className="auth-social-buttons">
                            <button className="google-btn">Google</button>
                            <button className="facebook-btn">Facebook</button>
                        </div>

                        <p>
                            Chưa có tài khoản?{" "}
                            <span className="auth-toggle" onClick={() => setIsSignUp(true)}>Đăng ký ngay</span>
                        </p>
                    </form>
                </div>

                <div className="auth-form-container auth-form-container-sign-up auth-sign-up">
                    <form>
                        <h1 className="auth-title">Chào mừng! Hãy đăng ký</h1>
                        <p className="auth-subtext">Tạo tài khoản để bắt đầu trải nghiệm mua sắm</p>

                        <label>Họ và tên</label>
                        <input type="text" placeholder="Nhập họ và tên" />
                        
                        <label>Email</label>
                        <input type="email" placeholder="Nhập email" />

                        <label>Tên đăng nhập</label>
                        <input type="text" placeholder="Nhập tên đăng nhập" />
                        
                        <label>Mật khẩu</label>
                        <input type="password" placeholder="Nhập mật khẩu" />
                        
                        <label>Xác nhận mật khẩu</label>
                        <input type="password" placeholder="Nhập lại mật khẩu" />

                        <button className="auth-btn">Đăng Ký</button>

                        <p>
                            Đã có tài khoản?{" "}
                            <span className="auth-toggle" onClick={() => setIsSignUp(false)}>Đăng nhập ngay</span>
                        </p>
                    </form>
                </div>

                <div className="auth-overlay-container">
                    <div className="auth-overlay">
                        {!isSignUp && (
                            <div className="auth-overlay-panel auth-left">
                                <h1 className="auth-title">Khám phá phong cách của bạn</h1>
                                <p className="auth-subtext">Tham gia ngay để nhận ưu đãi độc quyền!</p>
                                <button className="auth-btn auth-panel-btn" onClick={() => setIsSignUp(true)}>Đăng Ký</button>
                            </div>
                        )}

                        {isSignUp && (
                            <div className="auth-overlay-panel auth-right">
                                <h1 className="auth-title">Welcome Back!</h1>
                                <p className="auth-subtext">Đăng nhập để tiếp tục trải nghiệm mua sắm</p>
                                <button className="auth-btn auth-panel-btn" onClick={() => setIsSignUp(false)}>Đăng Nhập</button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;
