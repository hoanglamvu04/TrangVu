import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import AuthModal from "../components/AuthModal/AuthModal";

const Header = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <header>
      <div className="container_header">
      {/* Thanh thông tin trên cùng */}
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

        {/* Thanh tìm kiếm */}
        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm sản phẩm..." />
          <button className="search-btn">🔍</button>
        </div>

        {/* Các icon chức năng */}
        <div className="user-actions">
          {/* Bấm icon này để hiện modal đăng nhập */}
          <span
            className="icon"
            onClick={() => setShowAuthModal(true)}
            style={{ cursor: "pointer" }}
          >
            👤
          </span>

          {/* Chuyển tới trang profile */}
          <span
            className="icon"
            onClick={() => navigate("/CustomerProfile")}
            style={{ cursor: "pointer" }}
          >
            👤
          </span>

          {/* Giỏ hàng */}
          <span
            className="icon cart-icon"
            onClick={() => navigate("/cart")}
          >
            🛒
          </span>

          {/* Danh sách yêu thích */}
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
