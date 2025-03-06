import React from "react";
import "../styles/Header.css";

const Header = () => {
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
          <span className="icon">👤</span>
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
