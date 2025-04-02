import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Trang quản trị</h2>
      <nav>
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/products">Quản lý sản phẩm</Link>
        <Link to="/admin/orders">Quản lý đơn hàng</Link>
        <Link to="/admin/users">Người dùng</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
