import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/CustomerProfile.css";
import OrderManagement from "../components/OrderManagement";
import AddressManagement from "../components/AddressManagement";
import ReviewFeedback from "../components/ReviewFeedback";
import axios from "axios";

import {
  FaUser, FaShoppingBag, FaWallet, FaMapMarkerAlt,
  FaRegStar, FaSignOutAlt, FaChevronRight, FaLock
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;
console.log("🌐 API_URL = ", API_URL);

const CustomerProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("profile");
  const [customer, setCustomer] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (location.pathname === "/order-management") {
      setSelectedTab("orders");
    } else if (location.pathname === "/review-feedback") {
      setSelectedTab("feedback");
    } else if (location.pathname === "/address-management") {
      setSelectedTab("addresses");
    } else {
      setSelectedTab("profile");
    }
  }, [location]);

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      const parsed = JSON.parse(storedCustomer);
      setCustomer(parsed);

      axios
        .get(`http://localhost:5000/api/admin/check-by-code/${parsed.customerCode}`)
        .then(res => setIsAdmin(res.data.isAdmin))
        .catch(err => console.log("Lỗi kiểm tra quyền admin:", err));
    }
  }, []);

  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [changePwdMode, setChangePwdMode] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  useEffect(() => {
    if (customer) {
      setFullName(customer.fullName);
      setEmail(customer.email);
      setPhone(customer.phoneNumber);
      setBirthDate(customer.birthDate ? new Date(customer.birthDate).toISOString().split("T")[0] : "");
    }
  }, [customer]);

  const handleSave = async () => {
    try {
      let avatarPath = customer.avatar;

      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const res = await axios.post("http://localhost:5000/api/auth/upload-avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        avatarPath = res.data.filePath;
      }

      const updateRes = await axios.put(`http://localhost:5000/api/auth/update/${customer._id}`, {
        fullName,
        phoneNumber: phone,
        birthDate,
        avatar: avatarPath,
      });

      alert("Cập nhật thông tin thành công!");
      setCustomer(updateRes.data.user);
      localStorage.setItem("customer", JSON.stringify(updateRes.data.user));
      setEditMode(false);
    } catch (err) {
      alert("Lỗi khi cập nhật: " + (err.response?.data?.message || err.message));
    }
  };

  const handleChangePassword = () => {
    if (newPwd.length < 6) return alert("Mật khẩu mới phải có ít nhất 6 ký tự");
    if (oldPwd === newPwd) return alert("Mật khẩu mới phải khác mật khẩu cũ");
    if (newPwd !== confirmPwd) return alert("Xác nhận mật khẩu không khớp");
    alert("Đổi mật khẩu thành công!");
    setOldPwd(""); setNewPwd(""); setConfirmPwd("");
    setChangePwdMode(false);
  };

  if (!customer) return <div className="customer-profile">Đang tải dữ liệu...</div>;

  const handleLogout = () => {
    localStorage.removeItem("customer");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="customer-profile">
      <aside className="sidebar">
        <div className={`sidebar-item ${selectedTab === "profile" ? "active" : ""}`} 
          onClick={() => { setSelectedTab("profile"); navigate("/CustomerProfile"); }}>
          <FaUser /> Thông tin tài khoản <FaChevronRight />
        </div>
        <div
          className={`sidebar-item ${selectedTab === "addresses" ? "active" : ""}`}
          onClick={() => {
            setSelectedTab("addresses");
            navigate("/address-management");
          }}
        >
          <FaMapMarkerAlt /> Quản Lý Địa Chỉ <FaChevronRight />
        </div>

        <div className={`sidebar-item ${selectedTab === "orders" ? "active" : ""}`} 
          onClick={() => { setSelectedTab("orders"); navigate("/order-management"); }}>
          <FaShoppingBag /> Quản Lý Đơn Hàng <FaChevronRight />
        </div>

        {isAdmin && (
          <div className="sidebar-item" onClick={() => navigate("/admin")}>  
            <FaLock /> Trang quản trị <FaChevronRight />
          </div>
        )}

        <div className="sidebar-item logout" onClick={handleLogout}>
          <FaSignOutAlt /> Đăng xuất <FaChevronRight />
        </div>
      </aside>

      <main className="profile-content">
        {selectedTab === "profile" && (
          <>
            <h2>Thông tin tài khoản</h2>
            <div className="profile-card">
              <div className="avatar-section">
              <img
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : customer.avatar?.startsWith("/uploads/avatars/")
                      ? `${API_URL}${customer.avatar}`
                      : "/assets/images/default-avatar.png"
                }
                alt="Avatar"
                className="avatar"
              />

                <p className="username">@{customer.customerCode}</p>

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
                  <strong>{customer.email}</strong> 
                </div>
                <div className="info-row">
                  <span>Số điện thoại:</span>
                  <strong>{customer.phoneNumber}</strong> 
                </div>
                <div className="info-row">
                  <span>Ngày sinh:</span>
                  {editMode ? (
                    <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                  ) : (
                    <strong>{birthDate ? new Date(birthDate).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</strong>
                  )}
                </div>
                <div className="info-row"><span>Trạng thái:</span> <strong>{customer.status}</strong></div>
                <div className="info-row"><span>Ngày tạo tài khoản:</span> <strong>{new Date(customer.createdAt).toLocaleDateString("vi-VN")}</strong></div>

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
        {selectedTab === "addresses" && <AddressManagement />}
        {selectedTab === "orders" && <OrderManagement />}
        {selectedTab === "feedback" && <ReviewFeedback />}

      </main>
    </div>
  );
};

export default CustomerProfile;