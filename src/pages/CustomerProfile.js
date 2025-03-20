import React, { useState } from "react";
import "../styles/CustomerProfile.css";
import { 
  FaUser, FaShoppingBag, FaWallet, FaMapMarkerAlt, 
  FaRegStar, FaSignOutAlt, FaChevronRight 
} from "react-icons/fa";
import OrderManagement from "./OrderManagement";
import VoucherWallet from "./VoucherWallet";
import AddressManagement from "./AddressManagement";

const CustomerProfile = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [customer, setCustomer] = useState({
    avatar: "/assets/images/avt-test.png",
    username: "lamvu123",
    fullName: "Hoàng Lâm Vũ",
    email: "hoanglamvuytb@gmail.com",
    phone: "0376531093",
    status: "Hoạt động",
    createdAt: "20/09/2004",
  });

  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState(customer.fullName);
  const [email, setEmail] = useState(customer.email);
  const [phone, setPhone] = useState(customer.phone);

  const handleSave = () => {
    setCustomer({ ...customer, fullName, email, phone });
    setEditMode(false);
  };

  return (
    <div className="customer-profile">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className={`sidebar-item ${selectedTab === "profile" ? "active" : ""}`} 
          onClick={() => setSelectedTab("profile")}>
          <FaUser /> Thông tin tài khoản <FaChevronRight />
        </div>
        <div className={`sidebar-item ${selectedTab === "orders" ? "active" : ""}`} 
          onClick={() => setSelectedTab("orders")}>
          <FaShoppingBag /> Quản Lý Đơn Hàng <FaChevronRight />
        </div>
        <div className={`sidebar-item ${selectedTab === "vouchers" ? "active" : ""}`} 
          onClick={() => setSelectedTab("vouchers")}>
          <FaWallet /> Ví Voucher <FaChevronRight />
        </div>
        <div className={`sidebar-item ${selectedTab === "addresses" ? "active" : ""}`} 
          onClick={() => setSelectedTab("addresses")}>
          <FaMapMarkerAlt /> Quản Lý Địa Chỉ <FaChevronRight />
        </div>
        <div className="sidebar-item"><FaRegStar /> Đánh giá và phản hồi <FaChevronRight /></div>
        <div className="sidebar-item logout"><FaSignOutAlt /> Đăng xuất <FaChevronRight /></div>
      </aside>

      {/* Main Content */}
      <main className="profile-content">
        {selectedTab === "profile" && (
          <>
            <h2>Thông tin tài khoản</h2>
            <div className="profile-card">
              {/* Ảnh đại diện */}
              <div className="avatar-section">
                <img src={customer.avatar} alt="Avatar" className="avatar" />
                <p className="username">@{customer.username}</p>
              </div>

              {/* Thông tin cá nhân */}
              <div className="info-section">
                <div className="info-row">
                  <span>Họ và tên:</span>
                  {editMode ? (
                    <input 
                      type="text" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                    />
                  ) : (
                    <strong>{customer.fullName}</strong>
                  )}
                </div>
                <div className="info-row">
                  <span>Email:</span>
                  {editMode ? (
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  ) : (
                    <strong>{customer.email}</strong>
                  )}
                </div>
                <div className="info-row">
                  <span>Số điện thoại:</span>
                  {editMode ? (
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                    />
                  ) : (
                    <strong>{customer.phone}</strong>
                  )}
                </div>
                <div className="info-row"><span>Trạng thái:</span> <strong>{customer.status}</strong></div>
                <div className="info-row"><span>Ngày tạo tài khoản:</span> <strong>{customer.createdAt}</strong></div>

                {editMode ? (
                  <button className="save-btn" onClick={handleSave}>Lưu</button>
                ) : (
                  <button className="edit-btn" onClick={() => setEditMode(true)}>Chỉnh sửa</button>
                )}
              </div>
            </div>

            <h2 className="login-title">Thông tin đăng nhập</h2>
            <div className="login-info">
              <div className="info-row"><span>Email:</span> <strong>{customer.email}</strong></div>
              <div className="info-row"><span>Mật khẩu:</span> <strong>**************</strong></div>
              <button className="update-btn">ĐỔI MẬT KHẨU</button>
            </div>
          </>
        )}

        {selectedTab === "orders" && (
          <OrderManagement />
        )}
        {selectedTab === "vouchers" && (
          <VoucherWallet />
        )}
        {selectedTab === "addresses" && <AddressManagement />}
      </main>
    </div>
  );
};

export default CustomerProfile;
