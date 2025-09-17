import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaShoppingCart, FaBell, FaComments, FaGlobe, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Header.css";
import AuthModal from "./AuthModal/AuthModal";
import CartModal from "./CartModal";
import NotificationModal from "./NotificationModal";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Header = () => {
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [manualMenuVisible, setManualMenuVisible] = useState(true);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState("");
  const [showPromo, setShowPromo] = useState(true);
  const [navCollections, setNavCollections] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setCatLoading(true);
        setCatError("");

        const [catsRes, colsRes] = await Promise.allSettled([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/collections?showInNav=1&activeNow=1`),
        ]);

        if (mounted) {
          if (catsRes.status === "fulfilled") {
            const data = Array.isArray(catsRes.value.data) ? catsRes.value.data : [];
            const actives = data
              .filter((c) => (c.status || "").toLowerCase() === "active")
              .sort((a, b) => (a.categoryCode || "").localeCompare(b.categoryCode || ""));
            setCategories(actives);
          } else {
            setCatError("Không thể tải danh mục");
          }

          if (colsRes.status === "fulfilled") {
            setNavCollections(Array.isArray(colsRes.value.data) ? colsRes.value.data : []);
          } else {
            setNavCollections([]);
          }
        }
      } catch {
        if (mounted) setCatError("Không thể tải danh mục");
      } finally {
        if (mounted) setCatLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleUserIconClick = useCallback(() => {
    const stored = localStorage.getItem("customer");
    if (stored) navigate("/CustomerProfile");
    else setShowAuthModal(true);
  }, [navigate]);

  const handleSearch = useCallback(() => {
    const kw = searchKeyword.trim();
    if (kw) navigate(`/search?keyword=${encodeURIComponent(kw)}`);
  }, [navigate, searchKeyword]);

  const toggleMenu = useCallback(() => setManualMenuVisible((prev) => !prev), []);

  return (
    <>
      <header className="sticky-header show">
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

          {showPromo && (
            <div className="promo-ticker">
              <div className="promo-inner">
                <span className="promo-badge">FLASH SALE</span>
                <div className="ticker">
                  <div className="ticker-track">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <span key={i} className="ticker-item">🔥 Flash Sale – Giảm sốc 70%</span>
                    ))}
                  </div>
                </div>
                <button className="promo-close" aria-label="Đóng" onClick={() => setShowPromo(false)}>×</button>
              </div>
            </div>
          )}

          <div className="main-header">
            <h1 className="logo"><Link to="/">TV_Fashion</Link></h1>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="search-btn" onClick={handleSearch}>
                <FaSearch size={20} />
              </button>
            </div>

            <div className="user-actions">
              <span className="icon" onClick={handleUserIconClick}><FaUser size={25} /></span>
              <span className="icon cart-icon" onClick={() => setShowCart(true)}><FaShoppingCart size={25} /></span>
              <span className="icon" onClick={() => setShowNotifications(true)}><FaBell size={25} /></span>
              <span className="icon toggle-menu-icon" onClick={toggleMenu} title={manualMenuVisible ? "Ẩn menu" : "Hiện menu"}>
                {manualMenuVisible ? <FaEye size={25} /> : <FaEyeSlash size={25} />}
              </span>
              <span className="icon"><FaComments size={25} /></span>
              <span className="icon"><FaGlobe size={25} /></span>
            </div>
          </div>
        </div>

        {manualMenuVisible && (
          <div className="menu-fixed-wrapper show">
            <div className="nav-scroll-wrapper">
              <div className="container_menu">
                <nav className="main-nav">
                  <Link to="/" className="menu-item">Trang Chủ</Link>

                  {catLoading && <span className="menu-item">Đang tải...</span>}
                  {!catLoading && catError && <span className="menu-item">{catError}</span>}

                  {!catLoading && !catError && categories.map((cat) => (
                    <Link
                      key={cat._id || cat.categoryCode}
                      to={`/category/${cat.categoryCode}`}
                      className="menu-item"
                      title={cat.description || cat.name}
                    >
                      {cat.name}
                    </Link>
                  ))}

                  {navCollections.length > 0 && (
                    <>
                      <Link to="/collections" className="menu-item">Bộ Sưu Tập</Link>
                      {navCollections.map((c) => (
                        <Link
                          key={c._id || c.slug}
                          to={`/collection/${c.slug}`}
                          className="menu-item"
                          title={c.description || c.name}
                        >
                          {c.name}
                        </Link>
                      ))}
                    </>
                  )}

                  <Link to="/category/xu-huong-moi" className="menu-item">Xu Hướng Mới</Link>
                  <Link to="/category/chat-luong-cao" className="menu-item">Chất Lượng Cao</Link>
                  <Link to="/category/da-qua-su-dung" className="menu-item">Giá Rẻ Đã Qua Sử Dụng</Link>
                  <Link to="/sale" className="menu-item">Giảm Giá</Link>
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
