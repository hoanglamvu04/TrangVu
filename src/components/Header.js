import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import AuthModal from "../components/AuthModal/AuthModal";

const Header = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [customer, setCustomer] = useState(null);

  // Kiểm tra đăng nhập khi vừa vào trang
  useEffect(() => {
    const stored = localStorage.getItem("customer");
    if (stored) setCustomer(JSON.parse(stored));
  }, []);

  // Theo dõi khi đăng nhập thành công (localStorage được set)
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("customer");
      if (stored) setCustomer(JSON.parse(stored));
      else setCustomer(null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Click biểu tượng người dùng
  const handleUserIconClick = () => {
    const stored = localStorage.getItem("customer");
    if (stored) {
      navigate("/CustomerProfile");
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <header>
      <div className="container_header">
        {/* Thanh trên cùng */}
        <div className="top-bar">
          <span>📦 Theo dõi đơn hàng</span>
          <span>🏬 Cửa hàng gần bạn</span>
          <span>🎉 Khuyến mãi hôm nay</span>
          <div className="right-menu">
            <span>✨ YunWZ</span>
            <span>⚡ 420ent.</span>
            <span>⚡ DISSNEELAND</span>
            <span>⚡ Beck'Stage</span>
          </div>
        </div>

        {/* Header chính */}
        <div className="main-header">
          <h1 className="logo">
            <a href="#">TV_Fashion</a>
          </h1>

          <div className="search-bar">
            <input type="text" placeholder="Tìm kiếm sản phẩm..." />
            <button className="search-btn">🔍</button>
          </div>

          <div className="user-actions">
            {/* Chỉ giữ một icon người dùng xử lý logic */}
            <span
              className="icon"
              onClick={handleUserIconClick}
              style={{ cursor: "pointer" }}
            >
              👤
            </span>

            <span className="icon cart-icon" onClick={() => navigate("/cart")}>
              🛒
            </span>

            <span className="icon" onClick={() => navigate("/wishlist")}>
              ❤️
            </span>

            <span className="icon">💬</span>
            <span className="icon">🌐</span>
          </div>
        </div>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </header>
  );
};

export default Header;
