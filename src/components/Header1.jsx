import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import AuthModal from "./AuthModal/AuthModal";
import CartModal from "./CartModal";
import NotificationModal from "./NotificationModal";

const Header = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [showHeader, setShowHeader] = useState(true);
  const [scrollBasedMenu, setScrollBasedMenu] = useState(true);
  const [manualMenuVisible, setManualMenuVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);

  const showMenu = scrollBasedMenu && manualMenuVisible;

  useEffect(() => {
    const stored = localStorage.getItem("customer");
    if (stored) setCustomer(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("customer");
      if (stored) setCustomer(JSON.parse(stored));
      else setCustomer(null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const isScrollingDown = current > lastScrollY;
      setShowHeader(!isScrollingDown || current < 100);
      setScrollBasedMenu(!isScrollingDown || current < 100);
      setLastScrollY(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (showMenu) {
      document.body.classList.add("with-menu");
      document.body.classList.remove("without-menu");
    } else {
      document.body.classList.remove("with-menu");
      document.body.classList.add("without-menu");
    }
  }, [showMenu]);

  const handleUserIconClick = () => {
    const stored = localStorage.getItem("customer");
    if (stored) navigate("/CustomerProfile");
    else setShowAuthModal(true);
  };

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const toggleMenu = () => {
    setManualMenuVisible((prev) => !prev);
  };

  return (
    <>
      <header className={`sticky-header ${showHeader ? "show" : "hide"}`}>
        <div className="container_header">
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

          <div className="main-header">
            <h1 className="logo"><a href="/">TV_Fashion</a></h1>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="search-btn" onClick={handleSearch}>🔍</button>
            </div>
            <div className="user-actions">
              <span className="icon" onClick={handleUserIconClick}>👤</span>
              <span className="icon cart-icon" onClick={() => setShowCart(true)}>🛒</span>
              <span className="icon" onClick={() => setShowNotifications(true)}>🔔</span>
              
              {/* 👉 Icon ẩn/hiện menu 👁️ */}
              <span
                className="icon toggle-menu-icon"
                onClick={toggleMenu}
                title={manualMenuVisible ? "Ẩn menu" : "Hiện menu"}
              >
                {manualMenuVisible ? "👁️" : "🙈"}
              </span>

              <span className="icon">💬</span>
              <span className="icon">🌐</span>
            </div>
          </div>
        </div>

        {showMenu && (
          <div className={`menu-fixed-wrapper ${showMenu ? "show" : "hide"}`}>
            <div className="nav-scroll-wrapper">
              <div className="container_menu">
                <nav className="main-nav">
                  <a href="/" className="menu-item">Trang Chủ</a>
                  <a href="/category/" className="menu-item">Sản Phẩm Nổi Bật</a>
                  <a href="/category/ao-thun-nam" className="menu-item">Áo Thun Nam</a>
                  <a href="/category/ao-thun-nu" className="menu-item">Áo Thun Nữ</a>
                  <a href="/category/vay-nu" className="menu-item">Váy</a>
                  <a href="/category/giay-dep" className="menu-item">Giày Dép</a>
                  <a href="/category/tui-xach" className="menu-item">Túi Xách</a>
                  <a href="/category/mu-non" className="menu-item">Mũ & Nón</a>
                  <a href="/category/phu-kien" className="menu-item">Phụ Kiện</a>
                  <a href="/category/do-bo" className="menu-item">Đồ Bộ</a>
                  <a href="/category/ao-len" className="menu-item">Áo Len</a>
                  <a href="/category/giam-gia" className="menu-item">Xu Hướng Mới</a>
                  <a href="/category/giam-gia" className="menu-item">Chất Lượng Cao</a>
                  <a href="/category/giam-gia" className="menu-item">Giá Rẻ Đã Qua Sử Dụng</a>
                  <a href="/category/giam-gia" className="menu-item">Giảm Giá</a>
                </nav>
              </div>
            </div>
          </div>
        )}
      </header>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showCart && <CartModal onClose={() => setShowCart(false)} />}
      {showNotifications && <NotificationModal onClose={() => setShowNotifications(false)} />}
    </>
  );
};

export default Header;
