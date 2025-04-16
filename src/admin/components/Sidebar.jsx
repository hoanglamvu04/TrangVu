import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-sidebar">
      <h2 className="admin-sidebar-title">Trang quản trị</h2>
      <div className="admin-sidebar-nav-wrapper">
        <nav className="admin-sidebar-nav">
          <Link to="/admin" className={isActive("/admin") ? "active" : ""}>
            Bảng điều khiển
          </Link>
          <Link to="/admin/categories" className={isActive("/admin/categories") ? "active" : ""}>
            Quản lý danh mục
          </Link>
          <Link to="/admin/products" className={isActive("/admin/products") ? "active" : ""}>
            Quản lý sản phẩm
          </Link>
          <Link to="/admin/product-details" className={isActive("/admin/product-details") ? "active" : ""}>
            Quản lý chi tiết sản phẩm
          </Link>
          <Link to="/admin/product-descriptions" className={isActive("/admin/product-descriptions") ? "active" : ""}>
            Quản lý mô tả sản phẩm
          </Link>
          <Link to="/admin/order-manager" className={isActive("/admin/order-manager") ? "active" : ""}>
            Quản lý đơn hàng
          </Link>
          <Link to="/admin/users" className={isActive("/admin/users") ? "active" : ""}>
            Quản lý người dùng
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
