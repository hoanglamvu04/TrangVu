import React, { useState } from "react";
import "../styles/AuthPage.css";
import nenHelloKitty from "../assets/images/nen-hello-kitty.png"; 

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <div className="auth-page">
            <div className={`auth-container ${isSignUp ? "auth-sign-up-mode" : ""}`}>

                {/* FORM ĐĂNG NHẬP */}
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

                {/* FORM ĐĂNG KÝ */}
                <div className="auth-form-container auth-sign-up">
                    <form>
                        <h1 className="auth-title">Chào mừng! Hãy đăng ký</h1>
                        <p className="auth-subtext">Tạo tài khoản để bắt đầu trải nghiệm mua sắm</p>

                        <label>Họ và tên</label>
                        <input type="text" placeholder="Nhập họ và tên" />

                        <label>Email</label>
                        <input type="email" placeholder="Nhập email" />

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

                {/* PANEL CHUYỂN ĐỔI */}
                <div 
                    className="auth-overlay-container" 
                    style={{ backgroundImage: `url(${nenHelloKitty})` }}
                >
                    <div className="auth-overlay">
                        <div className="auth-overlay-panel">
                            {isSignUp ? (
                                <>
                                    <h1 className="auth-title">Welcome Back!</h1>
                                    <p className="auth-subtext">Đăng nhập để tiếp tục trải nghiệm mua sắm</p>
                                    <button className="auth-panel-btn" onClick={() => setIsSignUp(false)}>Đăng Nhập</button>
                                </>
                            ) : (
                                <>
                                    <h1 className="auth-title">Khám phá phong cách của bạn</h1>
                                    <p className="auth-subtext">Tham gia ngay để nhận ưu đãi độc quyền!</p>
                                    <button className="auth-panel-btn" onClick={() => setIsSignUp(true)}>Đăng Ký</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;
