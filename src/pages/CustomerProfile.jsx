import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/CustomerProfile.css";
import OrderManagement from "../components/OrderManagement";
import AddressManagement from "../components/AddressManagement";

import {
  FaUser, FaShoppingBag, FaWallet, FaMapMarkerAlt,
  FaRegStar, FaSignOutAlt, FaChevronRight
} from "react-icons/fa";

const CustomerProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("profile");

  useEffect(() => {
    if (location.pathname === "/order-management") {
      setSelectedTab("orders");
    }
  }, [location]);

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
  const [avatarFile, setAvatarFile] = useState(null);

  const [changePwdMode, setChangePwdMode] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const handleSave = () => {
    setCustomer({
      ...customer,
      fullName,
      email,
      phone,
      avatar: avatarFile ? URL.createObjectURL(avatarFile) : customer.avatar
    });
    setEditMode(false);
  };

  const handleChangePassword = () => {
    if (newPwd.length < 6) return alert("Mật khẩu mới phải có ít nhất 6 ký tự");
    if (oldPwd === newPwd) return alert("Mật khẩu mới phải khác mật khẩu cũ");
    if (newPwd !== confirmPwd) return alert("Xác nhận mật khẩu không khớp");
    alert("Đổi mật khẩu thành công!");
    setOldPwd(""); setNewPwd(""); setConfirmPwd("");
    setChangePwdMode(false);
  };

  return (
    <div className="customer-profile">
      <aside className="sidebar">
        <div className={`sidebar-item ${selectedTab === "profile" ? "active" : ""}`} 
          onClick={() => { setSelectedTab("profile"); navigate("/CustomerProfile"); }}>
          <FaUser /> Thông tin tài khoản <FaChevronRight />
        </div>
        <div className={`sidebar-item ${selectedTab === "addresses" ? "active" : ""}`} 
          onClick={() => { setSelectedTab("addresses"); }}>
          <FaMapMarkerAlt /> Quản Lý Địa Chỉ <FaChevronRight />
        </div>
        <div className={`sidebar-item ${selectedTab === "orders" ? "active" : ""}`} 
          onClick={() => { setSelectedTab("orders"); navigate("/order-management"); }}>
          <FaShoppingBag /> Quản Lý Đơn Hàng <FaChevronRight />
        </div>
        <div className="sidebar-item"><FaRegStar /> Đánh giá và phản hồi <FaChevronRight /></div>
        <div className="sidebar-item logout"><FaSignOutAlt /> Đăng xuất <FaChevronRight /></div>
      </aside>

      <main className="profile-content">
        {selectedTab === "profile" && (
          <>
            <h2>Thông tin tài khoản</h2>
            <div className="profile-card">
              <div className="avatar-section">
                <img
                  src={avatarFile ? URL.createObjectURL(avatarFile) : customer.avatar}
                  alt="Avatar"
                  className="avatar"
                />
                <p className="username">@{customer.username}</p>

                {editMode && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                  />
                )}
              </div>

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

            <h2 className="login-title">Thông tin đăng nhập</h2>
            <div className="login-info">
              <div className="info-row"><span>Email:</span> <strong>{customer.email}</strong></div>
              <div className="info-row"><span>Mật khẩu:</span> <strong>**************</strong></div>

              {!changePwdMode && (
                <button className="update-btn" onClick={() => setChangePwdMode(true)}>ĐỔI MẬT KHẨU</button>
              )}

              {changePwdMode && (
                <div className="change-password-form">
                  <input type="password" placeholder="Mật khẩu hiện tại" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} />
                  <input type="password" placeholder="Mật khẩu mới" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
                  <input type="password" placeholder="Xác nhận mật khẩu mới" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className="save-btn" onClick={handleChangePassword}>Xác nhận</button>
                    <button className="cancel-btn " onClick={() => setChangePwdMode(false)}>Huỷ</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {selectedTab === "orders" && <OrderManagement />}
        {selectedTab === "addresses" && <AddressManagement />}
      </main>
    </div>
  );
};

export default CustomerProfile;
