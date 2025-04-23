import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = JSON.parse(localStorage.getItem("customer"));
      if (!user) return navigate("/");

      try {
        const res = await axios.get(`http://localhost:5000/api/admin/check-by-code/${user.customerCode}`);        ;
        if (res.data.isAdmin) setIsAdmin(true);
        else navigate("/");
      } catch (error) {
        console.error("Lỗi kiểm tra quyền admin:", error);
        navigate("/");
      }
    };

    checkAdmin();
  }, [navigate]);

  const isActive = (path) => location.pathname === path;

  if (!isAdmin) return null;

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
