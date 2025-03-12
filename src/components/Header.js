import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate(); // Hook để điều hướng

  return (
    <header>
      <div className="top-bar">
        <span>📦 Theo dõi đơn hàng</span>
        <span>🏬 Cửa hàng gần bạn</span>
        <span>🎉 Khuyến mãi hôm nay</span>
        <div className="right-menu">
          <span>✨ YunWZ</span>
          <span>⚡ 420ent.</span>
          <span>⚡ DISSNEELAND</span>
          <span>⚡ HYPERFOCUS</span>
        </div>
      </div>

      <div className="main-header">
        <h1 className="logo">YUNWZ</h1>
        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm sản phẩm..." />
          <button className="search-btn">🔍</button>
        </div>
        <div className="user-actions">
          {/* Khi nhấn vào icon người, sẽ chuyển hướng đến trang đăng nhập */}
          <span className="icon" onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
            👤
          </span>
          <div className="cart">
            <span className="icon">🛒</span>
            <span className="cart-badge">10</span>
          </div>
          <span className="icon">❤️</span>
          <span className="icon">💬</span>
          <span className="icon">🌐</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
