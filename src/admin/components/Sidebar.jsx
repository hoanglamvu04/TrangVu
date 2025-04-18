import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);

  // Theo dõi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className={`admin-sidebar ${!isVisible ? "hide" : "sidebar-visible"} ${isCollapsed ? "collapsed" : ""}`}>
        <div className="admin-sidebar-header">
          <h2 className="admin-sidebar-title">Trang quản trị</h2>
          <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            ☰
          </button>
        </div>
        {!isCollapsed && (
          <div className="admin-sidebar-nav-wrapper">
            <nav className="admin-sidebar-nav">
              <Link to="/admin" className={isActive("/admin") ? "active" : ""}>Bảng điều khiển</Link>
              <Link to="/admin/categories" className={isActive("/admin/categories") ? "active" : ""}>Quản lý danh mục</Link>
              <Link to="/admin/products" className={isActive("/admin/products") ? "active" : ""}>Quản lý sản phẩm</Link>
              <Link to="/admin/order-manager" className={isActive("/admin/order-manager") ? "active" : ""}>Quản lý đơn hàng</Link>
              <Link to="/admin/users" className={isActive("/admin/users") ? "active" : ""}>Quản lý người dùng</Link>
            </nav>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
