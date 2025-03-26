import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/CustomerProfile.css";
import OrderManagement from "./OrderManagement";
import {
  FaUser, FaShoppingBag, FaWallet, FaMapMarkerAlt,
  FaRegStar, FaSignOutAlt, FaChevronRight, FaEdit, FaTrash, FaPlus
} from "react-icons/fa";

const CustomerProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("profile");

  // Nếu truy cập từ "/order-management" -> Tự động chọn tab "Quản Lý Đơn Hàng"
  useEffect(() => {
    if (location.pathname === "/order-management") {
      setSelectedTab("orders");
    }
  }, [location]);

  // Dữ liệu khách hàng
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

  // Quản lý địa chỉ
  const [addresses, setAddresses] = useState([
    { id: 1, label: "Nhà riêng", address: "Số 18-20/322 Nhân Mỹ - Mỹ Đình 1 - Quận Nam Từ Liêm - TP.Hà Nội." },
    { id: 2, label: "Văn phòng", address: "Km 3 + 350 Đường Phan Trọng Tuệ - Huyện Thanh Trì - TP.Hà Nội" }
  ]);
  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Lưu thông tin cá nhân
  const handleSave = () => {
    setCustomer({ ...customer, fullName, email, phone });
    setEditMode(false);
  };

  // Quản lý địa chỉ
  const handleAddAddress = () => {
    if (newLabel && newAddress) {
      setAddresses([...addresses, { id: Date.now(), label: newLabel, address: newAddress }]);
      setNewLabel("");
      setNewAddress("");
    }
  };

  const handleEditAddress = (index) => {
    setEditIndex(index);
    setNewLabel(addresses[index].label);
    setNewAddress(addresses[index].address);
  };

  const handleSaveEdit = () => {
    let updatedAddresses = [...addresses];
    updatedAddresses[editIndex] = { ...updatedAddresses[editIndex], label: newLabel, address: newAddress };
    setAddresses(updatedAddresses);
    setEditIndex(null);
    setNewLabel("");
    setNewAddress("");
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  return (
    <div className="customer-profile">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className={`sidebar-item ${selectedTab === "profile" ? "active" : ""}`} 
          onClick={() => { setSelectedTab("profile"); navigate("/CustomerProfile"); }}>
          <FaUser /> Thông tin tài khoản <FaChevronRight />
        </div>
        <div className={`sidebar-item ${selectedTab === "orders" ? "active" : ""}`} 
          onClick={() => { setSelectedTab("orders"); navigate("/order-management"); }}>
          <FaShoppingBag /> Quản Lý Đơn Hàng <FaChevronRight />
        </div>
        <div className={`sidebar-item ${selectedTab === "vouchers" ? "active" : ""}`} 
          onClick={() => setSelectedTab("vouchers")}>
          <FaWallet /> Ví Voucher <FaChevronRight />
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
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  ) : (
                    <strong>{customer.fullName}</strong>
                  )}
                </div>
                <div className="info-row">
                  <span>Email:</span>
                  {editMode ? (
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  ) : (
                    <strong>{customer.email}</strong>
                  )}
                </div>
                <div className="info-row">
                  <span>Số điện thoại:</span>
                  {editMode ? (
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
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

            {/* Quản lý địa chỉ */}
            <h2 className="login-title">Quản Lý Địa Chỉ</h2>
            <div className="address-management">
              <div className="address-list">
                {addresses.map((addr, index) => (
                  <div key={addr.id} className="address-card">
                    <div className="address-info">
                      <strong>{addr.label}</strong>
                      <p>{addr.address}</p>
                    </div>
                    <div className="address-actions">
                      <FaEdit className="edit-icon" onClick={() => handleEditAddress(index)} />
                      <FaTrash className="delete-icon" onClick={() => handleDeleteAddress(addr.id)} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="address-form">
                <input type="text" placeholder="Ghi chú (Nhà riêng, Văn phòng...)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
                <input type="text" placeholder="Nhập địa chỉ cụ thể..." value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
                {editIndex !== null ? (
                  <button className="save-btn" onClick={handleSaveEdit}>Lưu thay đổi</button>
                ) : (
                  <button className="add-btn" onClick={handleAddAddress}><FaPlus /> Thêm Địa Chỉ</button>
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

        {selectedTab === "orders" && <OrderManagement />}
      </main>
    </div>
  );
};

export default CustomerProfile;
