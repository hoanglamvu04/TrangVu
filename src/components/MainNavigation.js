import React from "react";
import "../styles/MainNavigation.css";
const Menu = () => {
  return (
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
          <a href="/category/giam-gia" className="menu-item">Chất Lượngg Cao</a>
          <a href="/category/giam-gia" className="menu-item">Giá Rẻ Đã Qua Sử Dụng</a>
          <a href="/category/giam-gia" className="menu-item">Giảm Giá</a>
          <a href="/category/giam-gia" className="menu-item">Giảm Giá</a>
          <a href="/category/giam-gia" className="menu-item">Giảm Giá</a>
      </nav>
      </div>
</div>

  );
};

export default Menu;
