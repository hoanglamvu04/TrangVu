import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";
import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";

const API_URL = "http://localhost:5000";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const [promotingId, setPromotingId] = useState(null);
  const [lockingId, setLockingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 30;

  useEffect(() => {
    fetchUsers();
    fetchAdmins();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/users`);
      setUsers(res.data);
    } catch (err) {
      alert("Không thể lấy danh sách khách hàng");
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/all`);
      setAdmins(res.data);
    } catch (err) {
      console.error("Không thể lấy danh sách admin", err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      setShowHeader(currentScroll < lastScrollTop || currentScroll < 10);
      setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá tài khoản này?")) {
      try {
        await axios.delete(`${API_URL}/api/admin/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert("Xoá thất bại");
      }
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const isUserAdmin = (customerCode) => admins.some(a => a.customerCode === customerCode);

  const promoteOrRemoveAdmin = async (customerCode) => {
    const isAdmin = isUserAdmin(customerCode);
    const confirmMsg = isAdmin
      ? `Bạn có chắc muốn gỡ quyền admin khỏi ${customerCode}?`
      : `Bạn có chắc muốn phân quyền admin cho ${customerCode}?`;

    if (!window.confirm(confirmMsg)) return;
    setPromotingId(customerCode);

    try {
      if (isAdmin) {
        await axios.delete(`${API_URL}/api/admin/remove/${customerCode}`);
        alert(`Đã gỡ quyền admin khỏi ${customerCode}`);
      } else {
        await axios.post(`${API_URL}/api/admin/create`, {
          admCode: `ADM-${customerCode}`,
          customerCode,
        });
        alert(`Đã phân quyền admin cho ${customerCode}`);
      }
      fetchAdmins();
    } catch (err) {
      alert("Không thể cập nhật quyền admin");
      console.error(err);
    } finally {
      setPromotingId(null);
    }
  };

  const toggleLockUser = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn ${user.status === "Blocked" ? "mở khoá" : "khoá"} tài khoản này?`)) return;
    setLockingId(user._id);
    try {
      await axios.put(`${API_URL}/api/admin/users/${user._id}`, {
        ...user,
        status: user.status === "Blocked" ? "Active" : "Blocked",
      });
      fetchUsers();
    } catch (err) {
      alert("Không thể cập nhật trạng thái người dùng");
      console.error(err);
    } finally {
      setLockingId(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="admin-page">
      <div className={`section-header ${showHeader ? "visible" : "hidden"}`}>
        <h2 className="admin-title">Quản lý tài khoản khách hàng</h2>
        <div className="admin-header-controls">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="admin-search-box"
          />
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            + Thêm người dùng
          </button>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Mã KH</th>
            <th>Ảnh</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Ngày sinh</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.customerCode}</td>
              <td>
                <img
                  src={`http://localhost:5000${user.avatar || "/uploads/default-avatar.png"}`}
                  alt="avatar"
                  width="40"
                  height="40"
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              </td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.birthDate ? new Date(user.birthDate).toLocaleDateString() : "-"}</td>
              <td>{user.status}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="admin-btn btn-edit" onClick={() => handleEdit(user)}>Sửa</button>{" "}
                <button className="admin-btn btn-delete" onClick={() => handleDelete(user._id)}>Xoá</button>{" "}
                <button
                  className="admin-btn btn-promote"
                  onClick={() => promoteOrRemoveAdmin(user.customerCode)}
                  disabled={promotingId === user.customerCode}
                >
                  {promotingId === user.customerCode
                    ? "Đang xử lý..."
                    : isUserAdmin(user.customerCode)
                    ? "Gỡ quyền Admin"
                    : "Phân quyền Admin"}
                </button>{" "}
                <button
                  className="admin-btn btn-lock"
                  onClick={() => toggleLockUser(user)}
                  disabled={lockingId === user._id}
                >
                  {lockingId === user._id
                    ? "Đang cập nhật..."
                    : user.status === "Blocked"
                    ? "Mở khoá"
                    : "Khoá"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchUsers();
            setShowAddModal(false);
          }}
        />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={() => {
            fetchUsers();
            setEditUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManager;